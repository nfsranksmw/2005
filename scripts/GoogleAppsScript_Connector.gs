/**
 * ==============================================================================================
 * NFSRANKSMW - GOOGLE APPS SCRIPT: CONECTOR WEB APP (doPost) & FIREBASE REALTIME DATABASE REST API
 * ==============================================================================================
 * 
 * Este script realiza las siguientes funciones:
 * 1. doPost(e): Recibe los datos del formulario web oficial de homologación de tiempos.
 * 2. Valida matemáticamente que: (Marca Fin - Marca Inicio) == Tiempo Declarado (tolerancia +-50ms).
 * 3. Inserta el registro en la hoja de Google Sheets ("Envios_Pendientes" o la hoja correspondiente).
 * 4. Expone la función "enviarFilaAprobadaAFirebase()" que el moderador/admin ejecuta desde el menú
 *    personalizado de Google Sheets para aprobar el registro y despacharlo automáticamente
 *    a la REST API de Firebase Realtime Database (nfsranks-blacklist-default-rtdb.firebaseio.com).
 * 5. Reorganiza y reescribe la tabla de posiciones en Firebase para que los Leaderboards web
 *    reflejen los tiempos en tiempo real.
 */

// ==============================================================================================
// CONFIGURACIÓN GLOBAL
// ==============================================================================================
const CONFIG = {
  FIREBASE_DB_URL: "https://nfsranks-blacklist-default-rtdb.firebaseio.com",
  FIREBASE_AUTH_SECRET: "", // Opcional: Secret / Token de Firebase si las reglas exigen autenticación
  
  // ID o URL de la Hoja de Cálculo de Google Sheets.
  // - Si el script está dentro de Google Sheets (Extensiones > Apps Script), puede dejarse vacío "".
  // - Si creaste el script de forma independiente en script.google.com, PEGA AQUÍ el ID o la URL de tu hoja:
  SPREADSHEET_ID: "", 
  
  SHEET_SUBMISSIONS_NAME: "Envios_Pendientes",
  TOLERANCE_MS: 50 // Tolerancia técnica por redondeo de fotogramas de video
};

/**
 * Obtiene la hoja de cálculo de destino de forma segura:
 * 1. Primero intenta obtener la hoja activa vinculada (getActiveSpreadsheet).
 * 2. Si no existe (script standalone), la abre mediante CONFIG.SPREADSHEET_ID.
 */
function getSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {
    Logger.log("No hay hoja de cálculo activa vinculada: " + e);
  }

  if (CONFIG.SPREADSHEET_ID && CONFIG.SPREADSHEET_ID.trim() !== "") {
    try {
      let id = CONFIG.SPREADSHEET_ID.trim();
      const match = id.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match) id = match[1];
      return SpreadsheetApp.openById(id);
    } catch (e) {
      Logger.log("Error abriendo hoja por ID: " + e);
      return null;
    }
  }

  return null;
}

// ==============================================================================================
// MENÚ PERSONALIZADO EN GOOGLE SHEETS
// ==============================================================================================
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🏁 NFSRANKSMW Telemetría')
    .addItem('✅ Aprobar Fila Seleccionada y Enviar a Firebase', 'menuAprobarFilaSeleccionada')
    .addItem('🔍 Verificar Marcas de Video de Fila Seleccionada', 'menuVerificarMarcasFila')
    .addSeparator()
    .addItem('🔄 Sincronizar Hoja Completa a Firebase', 'menuSincronizarHojaCompleta')
    .addItem('📋 Inicializar Hoja de Envíos Pendientes', 'inicializarHojaEnvios')
    .addToUi();
}

// ==============================================================================================
// API EN SERVIDOR WEB APP: doGet(e) (CACHÉ CENTRALIZADA DE PODIOS)
// ==============================================================================================
function doGet(e) {
  const cache = CacheService.getScriptCache();
  let cachedData = cache.get("global_podiums_json");

  if (!cachedData) {
    const podiums = calculateGlobalPodiumsServer();
    cachedData = JSON.stringify(podiums);
    cache.put("global_podiums_json", cachedData, 3600); // 1 hora
  }

  return ContentService.createTextOutput(cachedData)
    .setMimeType(ContentService.MimeType.JSON);
}

function calculateGlobalPodiumsServer() {
  const ss = getSpreadsheet();
  const sheets = ss.getSheets();
  let podiumStats = {};

  sheets.forEach(sheet => {
    // Omitir la hoja de envíos pendientes para no alterar los podios oficiales
    if (sheet.getName() === CONFIG.SHEET_SUBMISSIONS_NAME) return;

    const data = sheet.getRange("A1:G10").getValues(); 
    data.forEach(row => {
      let rank = String(row[0] || '').replace(/[^0-9]/g, '');
      let rankNum = parseInt(rank, 10);
      let driver = row[1] ? String(row[1]).trim().toUpperCase() : null;

      if ([1, 2, 3].includes(rankNum) && driver) {
        if (!podiumStats[driver]) {
          podiumStats[driver] = { first: 0, second: 0, third: 0 };
        }
        if (rankNum === 1) podiumStats[driver].first++;
        if (rankNum === 2) podiumStats[driver].second++;
        if (rankNum === 3) podiumStats[driver].third++;
      }
    });
  });

  return Object.keys(podiumStats).map(driver => ({
    driver: driver,
    first: podiumStats[driver].first,
    second: podiumStats[driver].second,
    third: podiumStats[driver].third,
    total: podiumStats[driver].first + podiumStats[driver].second + podiumStats[driver].third
  })).sort((a, b) => b.first - a.first || b.second - a.second || b.third - a.third);
}

// ==============================================================================================
// WEBHOOK WEB APP: doPost(e) (RECEPCIÓN Y HOMOLOGACIÓN DE TIEMPOS)
// ==============================================================================================
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    let payload = {};

    // 1. Parsear el cuerpo de la petición (JSON o Form-UrlEncoded)
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e.parameter) {
      payload = e.parameter;
    }

    // 2. Extraer campos
    const driver        = String(payload.driver || payload.piloto || "").trim();
    const car           = String(payload.car || payload.auto || "").trim();
    const route         = String(payload.route || payload.pista || "").trim();
    const mode          = String(payload.mode || payload.modalidad || "Online").trim();
    const videoUrl      = String(payload.video || payload.videoUrl || "").trim();
    const startMark     = String(payload.startMark || payload.marcaInicio || "").trim();
    const endMark       = String(payload.endMark || payload.marcaFin || "").trim();
    const timeDeclared  = String(payload.timeDeclared || payload.tiempo || "").trim();
    const gearbox       = String(payload.gearbox || payload.transmision || "Manual").trim();
    const device        = String(payload.device || payload.control || "Teclado").trim();
    const category      = String(payload.category || payload.categoria || "Junkman").trim();

    if (!driver || !route || !videoUrl || !startMark || !endMark || !timeDeclared) {
      return createJsonResponse({
        status: "error",
        message: "Faltan campos obligatorios en el formulario."
      }, 400);
    }

    // 3. Conversión a milisegundos y Validación de Telemetría
    const startMs = parseTimeToMs(startMark);
    const endMs = parseTimeToMs(endMark);
    const declaredMs = parseTimeToMs(timeDeclared);

    if (startMs === null || endMs === null || declaredMs === null) {
      return createJsonResponse({
        status: "error",
        message: "Formato de tiempo inválido. Usa MM:SS.mmm (ej: 01:20.750)."
      }, 400);
    }

    if (endMs <= startMs) {
      return createJsonResponse({
        status: "error",
        message: "La marca de fin del video debe ser posterior a la marca de inicio."
      }, 400);
    }

    const diffMs = endMs - startMs;
    const discrepancyMs = Math.abs(diffMs - declaredMs);

    if (discrepancyMs > CONFIG.TOLERANCE_MS) {
      return createJsonResponse({
        status: "error",
        message: "Discrepancia detectada: La diferencia de las marcas de video (" + formatMsToTime(diffMs) + 
                 ") no coincide con el tiempo declarado (" + formatMsToTime(declaredMs) + "). Desfase: " + 
                 (discrepancyMs / 1000).toFixed(3) + "s.",
        calculatedDiff: formatMsToTime(diffMs),
        declared: formatMsToTime(declaredMs)
      }, 422);
    }

    // 4. Guardar en Google Sheets (Hoja de Envíos Pendientes) si la hoja está disponible
    const submissionId = String(payload.submissionId || ("SUB-" + Date.now()));
    const now = new Date();
    const formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone() || "GMT-4", "yyyy-MM-dd HH:mm:ss");

    try {
      const ss = getSpreadsheet();
      if (ss) {
        let sheet = ss.getSheetByName(CONFIG.SHEET_SUBMISSIONS_NAME);
        if (!sheet) {
          sheet = inicializarHojaEnvios(ss);
        }
        sheet.appendRow([
          submissionId,
          formattedDate,
          driver,
          car,
          route,
          category,
          mode,
          formatMsToTime(declaredMs),
          formatMsToTime(startMs),
          formatMsToTime(endMs),
          formatMsToTime(diffMs),
          videoUrl,
          gearbox,
          device,
          "PENDIENTE",
          declaredMs
        ]);
      } else {
        Logger.log("Aviso: No hay hoja de cálculo disponible. Guardado en Google Sheets omitido.");
      }
    } catch (sheetErr) {
      Logger.log("Aviso: Error escribiendo en Google Sheets: " + sheetErr);
    }

    // 5. Registrar en Firebase bajo /submissions/<submissionId> para auditoría
    try {
      registrarSubmissionEnFirebase(submissionId, {
        id: submissionId,
        timestamp: formattedDate,
        driver: driver,
        car: car,
        route: route,
        category: category,
        mode: mode,
        time: formatMsToTime(declaredMs),
        timeMs: declaredMs,
        startMark: formatMsToTime(startMs),
        endMark: formatMsToTime(endMs),
        diff: formatMsToTime(diffMs),
        videoUrl: videoUrl,
        gearbox: gearbox,
        device: device,
        status: "PENDIENTE"
      });
    } catch (fbErr) {
      Logger.log("Aviso: Error registrando en Firebase: " + fbErr);
    }

    return createJsonResponse({
      status: "success",
      message: "¡Registro validado e ingresado exitosamente a la cola de homologación!",
      submissionId: submissionId,
      validatedTime: formatMsToTime(declaredMs),
      diffCalculated: formatMsToTime(diffMs)
    }, 200);

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "Error interno procesando envío: " + error.toString()
    }, 500);
  } finally {
    lock.releaseLock();
  }
}

// =======================================================
// APROBACIÓN DE FILA & ENVÍO A FIREBASE REST API
// =======================================================

/**
 * Función accionable desde el menú de Google Sheets para la fila actualmente seleccionada.
 */
function menuAprobarFilaSeleccionada() {
  const ss = getSpreadsheet();
  const sheet = SpreadsheetApp.getActiveSheet() || ss.getActiveSheet();
  const activeRange = sheet ? sheet.getActiveRange() : null;

  if (!activeRange || activeRange.getRow() <= 1) {
    SpreadsheetApp.getUi().alert("Por favor selecciona una fila de datos válida en la hoja (no la cabecera).");
    return;
  }

  const row = activeRange.getRow();

  const result = enviarFilaAprobadaAFirebase(sheet, row);
  if (result.success) {
    SpreadsheetApp.getUi().alert("✅ Registro Aprobado y Enviado a Firebase con Éxito!\n\n" +
                                 "Piloto: " + result.record.driver + "\n" +
                                 "Pista: " + result.record.route + "\n" +
                                 "Tiempo: " + result.record.time + "\n" +
                                 "Posición Asignada: " + result.newRank);
  } else {
    SpreadsheetApp.getUi().alert("❌ Error al aprobar: " + result.message);
  }
}

/**
 * Aprueba una fila específica y la envía a Firebase Realtime Database.
 */
function enviarFilaAprobadaAFirebase(sheet, rowNumber) {
  try {
    const rowValues = sheet.getRange(rowNumber, 1, 1, 16).getValues()[0];

    // Mapeo según la estructura de la hoja de envíos
    const submissionId = rowValues[0];
    const driver       = String(rowValues[2]).trim();
    const car          = String(rowValues[3]).trim();
    const route        = String(rowValues[4]).trim();
    const category     = String(rowValues[5] || "Junkman").trim();
    const mode         = String(rowValues[6] || "Online").trim();
    const timeStr      = String(rowValues[7]).trim();
    const startMark    = String(rowValues[8]).trim();
    const endMark      = String(rowValues[9]).trim();
    const videoUrl     = String(rowValues[11]).trim();
    const gearbox      = String(rowValues[12] || "Manual").trim();
    const device       = String(rowValues[13] || "Teclado").trim();
    const timeMs       = Number(rowValues[15]) || parseTimeToMs(timeStr);

    if (!driver || !route || !timeStr) {
      return { success: false, message: "Datos incompletos en la fila " + rowNumber };
    }

    // 1. Obtener los registros existentes de esa pista y categoría en Firebase
    const routeKey = sanitizeKey(route);
    const categoryKey = sanitizeKey(category);
    const endpointUrl = CONFIG.FIREBASE_DB_URL + "/leaderboards/" + routeKey + "/" + categoryKey + ".json" + getAuthQuery();

    let existingRecords = [];
    const getResponse = UrlFetchApp.fetch(endpointUrl, {
      method: "get",
      muteHttpExceptions: true
    });

    if (getResponse.getResponseCode() === 200) {
      const data = JSON.parse(getResponse.getContentText());
      if (Array.isArray(data)) {
        existingRecords = data.filter(r => r != null);
      } else if (data && typeof data === 'object') {
        existingRecords = Object.keys(data).map(k => data[k]);
      }
    }

    // 2. Insertar el nuevo registro o actualizar si el mismo piloto ya tiene un mejor tiempo
    const newRecord = {
      driver: driver,
      car: car,
      route: route,
      category: category,
      mode: mode,
      time: timeStr,
      timeMs: timeMs,
      startMark: startMark,
      endMark: endMark,
      videoUrl: videoUrl,
      gearbox: gearbox,
      device: device,
      date: Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "GMT-4", "yyyy-MM-dd"),
      verified: true
    };

    // Agregar a la lista
    existingRecords.push(newRecord);

    // 3. Ordenar todos los registros de la pista por tiempo más rápido (menor milisegundos)
    existingRecords.sort((a, b) => (a.timeMs || parseTimeToMs(a.time)) - (b.timeMs || parseTimeToMs(b.time)));

    // 4. Asignar posiciones (#1, #2, #3...)
    let assignedRank = "#1";
    for (let i = 0; i < existingRecords.length; i++) {
      existingRecords[i].rank = "#" + (i + 1);
      if (existingRecords[i].driver === driver && existingRecords[i].time === timeStr) {
        assignedRank = "#" + (i + 1);
      }
    }

    // 5. Reescribir en Firebase Realtime Database con PUT
    const putResponse = UrlFetchApp.fetch(endpointUrl, {
      method: "put",
      contentType: "application/json",
      payload: JSON.stringify(existingRecords),
      muteHttpExceptions: true
    });

    if (putResponse.getResponseCode() >= 200 && putResponse.getResponseCode() < 300) {
      // Marcar como APROBADO en la hoja
      sheet.getRange(rowNumber, 15).setValue("APROBADO");
      sheet.getRange(rowNumber, 15).setBackground("#d4edda").setFontColor("#155724");

      // Actualizar estado en /submissions si existe
      if (submissionId) {
        const subUrl = CONFIG.FIREBASE_DB_URL + "/submissions/" + submissionId + "/status.json" + getAuthQuery();
        UrlFetchApp.fetch(subUrl, {
          method: "put",
          contentType: "application/json",
          payload: JSON.stringify("APROBADO"),
          muteHttpExceptions: true
        });
      }

      return {
        success: true,
        record: newRecord,
        newRank: assignedRank
      };
    } else {
      return {
        success: false,
        message: "Error de Firebase (" + putResponse.getResponseCode() + "): " + putResponse.getContentText()
      };
    }

  } catch (err) {
    return {
      success: false,
      message: err.toString()
    };
  }
}

// =======================================================
// SINCRONIZACIÓN DE HOJA COMPLETA A FIREBASE
// =======================================================
function menuSincronizarHojaCompleta() {
  const ss = getSpreadsheet();
  const sheet = SpreadsheetApp.getActiveSheet() || ss.getActiveSheet();
  const ui = SpreadsheetApp.getUi();

  if (!sheet) {
    ui.alert("No se pudo obtener la hoja activa.");
    return;
  }
  const sheetName = sheet.getName();

  const confirm = ui.alert("Sincronización a Firebase", 
    "¿Deseas sincronizar todos los registros de la pestaña actual '" + sheetName + "' a Firebase Realtime Database?", 
    ui.ButtonSet.YES_NO);

  if (confirm !== ui.Button.YES) return;

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    ui.alert("No hay filas de datos para sincronizar.");
    return;
  }

  // Detectar cabecera
  const headers = data[0].map(h => String(h).toLowerCase().trim());
  const rankIdx    = headers.findIndex(h => h.includes("rank") || h.includes("pos"));
  const driverIdx  = headers.findIndex(h => h.includes("driver") || h.includes("piloto"));
  const timeIdx    = headers.findIndex(h => h.includes("time") || h.includes("tiempo"));
  const deviceIdx  = headers.findIndex(h => h.includes("device") || h.includes("control") || h.includes("dispositivo"));
  const carIdx     = headers.findIndex(h => h.includes("car") || h.includes("auto"));
  const gearboxIdx = headers.findIndex(h => h.includes("gearbox") || h.includes("transmision"));
  const dateIdx    = headers.findIndex(h => h.includes("date") || h.includes("fecha"));
  const videoIdx   = headers.findIndex(h => h.includes("video") || h.includes("yt") || h.includes("link"));

  const records = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const driver = driverIdx >= 0 ? String(row[driverIdx]).trim() : "";
    const time   = timeIdx >= 0 ? String(row[timeIdx]).trim() : "";
    if (!driver || !time) continue;

    const timeMs = parseTimeToMs(time);
    records.push({
      driver: driver,
      time: time,
      timeMs: timeMs,
      car: carIdx >= 0 ? String(row[carIdx]).trim() : "",
      device: deviceIdx >= 0 ? String(row[deviceIdx]).trim() : "",
      gearbox: gearboxIdx >= 0 ? String(row[gearboxIdx]).trim() : "",
      date: dateIdx >= 0 ? String(row[dateIdx]).trim() : Utilities.formatDate(new Date(), "GMT-4", "yyyy-MM-dd"),
      videoUrl: videoIdx >= 0 ? String(row[videoIdx]).trim() : "#",
      verified: true
    });
  }

  // Ordenar por tiempo
  records.sort((a, b) => a.timeMs - b.timeMs);
  records.forEach((r, idx) => r.rank = "#" + (idx + 1));

  const routeKey = sanitizeKey(sheetName);
  const endpointUrl = CONFIG.FIREBASE_DB_URL + "/leaderboards/" + routeKey + "/default.json" + getAuthQuery();

  const response = UrlFetchApp.fetch(endpointUrl, {
    method: "put",
    contentType: "application/json",
    payload: JSON.stringify(records),
    muteHttpExceptions: true
  });

  if (response.getResponseCode() === 200) {
    ui.alert("✅ Éxito", "Se sincronizaron " + records.length + " registros de '" + sheetName + "' en Firebase.", ui.ButtonSet.OK);
  } else {
    ui.alert("❌ Error", "Error al sincronizar: " + response.getContentText(), ui.ButtonSet.OK);
  }
}

// =======================================================
// UTILIDADES DE TIEMPO & CÁLCULO
// =======================================================

function parseTimeToMs(timeStr) {
  if (!timeStr) return null;
  let s = String(timeStr).trim().toLowerCase().replace(',', '.');

  // Patrón: 1m 20s 750ms o 1m 20.75s
  const textMatch = s.match(/(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+(?:\.\d+)?)s)?\s*(?:(\d+)ms)?/);
  if (textMatch && (textMatch[1] || textMatch[2] || textMatch[3] || textMatch[4])) {
    const h = parseInt(textMatch[1] || '0', 10);
    const m = parseInt(textMatch[2] || '0', 10);
    const sec = parseFloat(textMatch[3] || '0');
    const ms = parseInt(textMatch[4] || '0', 10);
    const total = (h * 3600 + m * 60 + sec) * 1000 + ms;
    if (total > 0) return Math.round(total);
  }

  const parts = s.split(':');
  if (parts.length === 3) {
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const sec = parseFloat(parts[2]);
    if (!isNaN(h) && !isNaN(m) && !isNaN(sec)) {
      return Math.round((h * 3600 + m * 60 + sec) * 1000);
    }
  } else if (parts.length === 2) {
    const m = parseInt(parts[0], 10);
    const sec = parseFloat(parts[1]);
    if (!isNaN(m) && !isNaN(sec)) {
      return Math.round((m * 60 + sec) * 1000);
    }
  } else if (parts.length === 1) {
    const sec = parseFloat(parts[0]);
    if (!isNaN(sec)) {
      return Math.round(sec * 1000);
    }
  }
  return null;
}

function formatMsToTime(ms) {
  if (ms == null || isNaN(ms) || ms < 0) return "--:--.---";
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.round(ms % 1000);
  return String(minutes).padStart(2, '0') + ":" + 
         String(seconds).padStart(2, '0') + "." + 
         String(milliseconds).padStart(3, '0');
}

function sanitizeKey(key) {
  if (!key) return "general";
  return key.toLowerCase()
    .replace(/[.#$[\]]/g, "_") // Caracteres no permitidos en claves Firebase
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function getAuthQuery() {
  if (CONFIG.FIREBASE_AUTH_SECRET && CONFIG.FIREBASE_AUTH_SECRET !== "") {
    return "?auth=" + CONFIG.FIREBASE_AUTH_SECRET;
  }
  return "";
}

function registrarSubmissionEnFirebase(submissionId, data) {
  try {
    const url = CONFIG.FIREBASE_DB_URL + "/submissions/" + submissionId + ".json" + getAuthQuery();
    UrlFetchApp.fetch(url, {
      method: "put",
      contentType: "application/json",
      payload: JSON.stringify(data),
      muteHttpExceptions: true
    });
  } catch (e) {
    Logger.log("No se pudo registrar en /submissions: " + e);
  }
}

function createJsonResponse(obj, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function inicializarHojaEnvios(targetSs) {
  const ss = targetSs || getSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_SUBMISSIONS_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_SUBMISSIONS_NAME);
  }

  const headers = [
    "ID Envío", "Fecha / Hora", "Piloto", "Auto", "Pista / Trazado", 
    "Categoría", "Modalidad", "Tiempo Declarado", "Marca Inicio", "Marca Fin", 
    "Diferencia Video", "URL Video YouTube", "Transmisión", "Control", "Estado", "Tiempo (ms)"
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
       .setBackground("#1f1f1f")
       .setFontColor("#ff7700")
       .setFontWeight("bold");
  sheet.setFrozenRows(1);
  return sheet;
}

function menuVerificarMarcasFila() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const row = sheet.getActiveRange().getRow();
  if (row <= 1) return;

  const startMark = sheet.getRange(row, 9).getValue();
  const endMark = sheet.getRange(row, 10).getValue();
  const declared = sheet.getRange(row, 8).getValue();

  const startMs = parseTimeToMs(startMark);
  const endMs = parseTimeToMs(endMark);
  const declaredMs = parseTimeToMs(declared);

  if (startMs === null || endMs === null) {
    SpreadsheetApp.getUi().alert("Marcas de video no encontradas o inválidas en las columnas I y J.");
    return;
  }

  const diffMs = endMs - startMs;
  const match = Math.abs(diffMs - declaredMs) <= CONFIG.TOLERANCE_MS;

  SpreadsheetApp.getUi().alert("🔍 Auditoría de Marcas de Video:\n\n" +
    "Marca Inicio: " + formatMsToTime(startMs) + "\n" +
    "Marca Fin: " + formatMsToTime(endMs) + "\n" +
    "Diferencia Calculada: " + formatMsToTime(diffMs) + "\n" +
    "Tiempo Declarado: " + formatMsToTime(declaredMs) + "\n\n" +
    (match ? "✅ CONCORDANCIA PERFECTA" : "❌ DISCREPANCIA DETECTADA (" + (Math.abs(diffMs - declaredMs)/1000).toFixed(3) + "s de desfase)"));
}
