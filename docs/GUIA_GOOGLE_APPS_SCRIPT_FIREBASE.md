# 🏁 Guía de Conexión: Google Sheets, Google Apps Script & Firebase Realtime Database

Esta guía detalla el proceso paso a paso para vincular tus Hojas de Cálculo de Google Sheets (Circuitos, Drag y Sprint) con **Firebase Realtime Database** (`nfsranks-blacklist-default-rtdb.firebaseio.com`) y con la aplicación web de **NFSRANKSMW**.

---

## 📌 Arquitectura del Sistema

```
[Formulario Web NFSRANKSMW]
       │
       │ (1. Validación milimétrica: |Fin - Inicio - Declarado| <= 50ms)
       │ (2. Envío HTTP POST con payload JSON)
       ▼
[Google Apps Script: doPost(e)]
       │
       │ (3. Inserta fila en pestaña "Envios_Pendientes")
       ▼
[Google Sheets (Circuitos / Drag / Sprint)]
       │
       │ (4. Moderador revisa y ejecuta: "Aprobar Fila Seleccionada")
       ▼
[Apps Script: REST API PUT /leaderboards/<pista>/<cat>.json]
       │
       │ (5. Ordena tiempos, calcula #1, #2, #3... y actualiza la BD)
       ▼
[Firebase Realtime Database]
       │
       │ (6. Lectura en tiempo real en la web)
       ▼
[Tablas de Leaderboard en Vivo (NFSRANKSMW)]
```

---

## 🚀 Paso 1: Instalar el Conector en Google Sheets

1. Abre cualquiera de tus Hojas de Cálculo de Google Sheets maestras:
   - **Leaderboard Circuitos:** [Abrir carpeta de Drive](https://drive.google.com/drive/folders/13Sx-GMgddJq8kgV34tQmEkd9Q0bQzm22)
   - **Leaderboard Drag:** [Abrir carpeta de Drive](https://drive.google.com/drive/folders/16xzLFtx2Fij3Hx-1RZoAyz4jjQ3ne0d9)
   - **Leaderboard Sprint:** [Abrir carpeta de Drive](https://drive.google.com/drive/folders/1AREorOOXnK6vkMamweHjIn38SI9VavNQ)
2. En la barra de menús superior de Google Sheets, dirígete a:
   **Extensiones** > **Apps Script**.
3. Se abrirá el editor de código de Google Apps Script. Borra cualquier código existente (`function myFunction() { ... }`).
4. Abre el archivo [`scripts/GoogleAppsScript_Connector.gs`](../scripts/GoogleAppsScript_Connector.gs) de este proyecto, copia todo su contenido y pégalo en el editor de Apps Script.
5. Haz clic en el icono de **Guardar** (disquete) o presiona `Ctrl + S`.
6. Nombra el proyecto como `NFSRanks_Connector`.

---

## 🌐 Paso 2: Implementar como Aplicación Web (Web App)

Para que el formulario web de envío pueda comunicarse con tu hoja de cálculo, debes publicar el script como Aplicación Web:

1. En la esquina superior derecha del editor de Apps Script, haz clic en **Implementar** (Deploy) > **Nueva implementación** (New deployment).
2. Haz clic en el icono de engranaje ⚙️ junto a *Seleccionar tipo* y elige **Aplicación web** (Web app).
3. Configura los campos exactamente así:
   - **Descripción:** `Conector Telemetria NFSRanks v1`
   - **Ejecutar como:** `Yo (tu_correo@gmail.com)`
   - **Quién tiene acceso:** `Cualquiera` *(Anyone)*  
     > [!IMPORTANT]
     > Es indispensable seleccionar **Cualquiera** (*Anyone*) para que los corredores puedan enviar sus tiempos desde la página web sin requerir autenticación de Google.
4. Haz clic en **Implementar** (Deploy).
5. Google te solicitará **Autorizar el acceso** (Authorize access):
   - Selecciona tu cuenta de Google.
   - Si aparece el aviso *"Google no ha verificado esta aplicación"*, haz clic en **Configuración avanzada** (*Advanced*) y luego en **Ir a NFSRanks_Connector (no seguro)**.
   - Concede los permisos solicitados (administración de hojas de cálculo y conexiones de red externas para Firebase).
6. Al finalizar, Google te mostrará la **URL de la aplicación web**. Tendrá un formato similar a:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
7. Copia esta URL completa.

---

## 🔗 Paso 3: Conectar la URL en el Proyecto Web

1. Abre el archivo [`assets/js/app.js`](../assets/js/app.js).
2. Localiza la línea 30:
   ```javascript
   // Conector Web App de Google Apps Script (Hojas de Cálculo & Firebase)
   const GOOGLE_APPS_SCRIPT_WEBAPP_URL = "URL_DE_TU_GOOGLE_APPS_SCRIPT_WEBAPP_AQUI";
   ```
3. Reemplaza `"URL_DE_TU_GOOGLE_APPS_SCRIPT_WEBAPP_AQUI"` por la URL de tu aplicación web que copiaste en el paso anterior.
4. Guarda el archivo. ¡Listo! El formulario web ya enviará automáticamente todos los envíos validados a Google Sheets.

---

## 🏁 Paso 4: Menú de Moderación y Envío a Firebase

Una vez instalado el script, recarga tu hoja de Google Sheets. Verás un nuevo menú en la barra superior:

```
🏁 NFSRANKSMW Telemetría
├── ✅ Aprobar Fila Seleccionada y Enviar a Firebase
├── 🔄 Sincronizar Hoja Completa a Firebase
└── ℹ️ Ayuda y Estado de Conexión
```

### 1. Flujo de Aprobación de Récords
1. Cuando un usuario envía un récord desde la web, este se valida matemáticamente en el navegador y en el script (`|diff - declarado| <= 50ms`).
2. Se inserta automáticamente en la pestaña **`Envios_Pendientes`** con los datos del piloto, auto, pista, tiempos, marcas de video y enlace de YouTube.
3. El moderador abre la hoja, revisa el enlace de video y selecciona la fila que desea aprobar.
4. Hace clic en:  
   **🏁 NFSRANKSMW Telemetría** > **✅ Aprobar Fila Seleccionada y Enviar a Firebase**.
5. El script:
   - Descarga los registros existentes de esa pista desde Firebase RTDB.
   - Inserta el nuevo registro.
   - Reordena todos los tiempos de menor a mayor (más rápido primero).
   - Reasigna las posiciones oficiales (`#1, #2, #3...`).
   - Sube la tabla actualizada a Firebase mediante `PUT` HTTP REST.
   - Marca la fila en Google Sheets como `APROBADO` en color verde.
   - La tabla web del Leaderboard reflejará el récord inmediatamente.

### 2. Sincronización Masiva de Tiempos Históricos
Si tienes pestañas existentes con récords que deseas transferir inmediatamente a Firebase:
1. Sitúate en la pestaña que contiene los datos.
2. Haz clic en **🏁 NFSRANKSMW Telemetría** > **🔄 Sincronizar Hoja Completa a Firebase**.
3. Confirma el cuadro de diálogo. Todos los registros de la pestaña se normalizarán y se sincronizarán directamente con Firebase Realtime Database.

---

## 🔒 Paso 5: Reglas de Seguridad de Firebase Realtime Database

Tu regla original en Firebase era:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### ¿Interfiere tu regla original con el nuevo sistema?
**¡NO, no interfiere en absoluto!**  
De hecho, tu regla original al tener `".read": true` y `".write": true` en la raíz (`/`) permite que **TODAS** las funciones de la app web, el conector de Google Apps Script y el mod del juego funcionen sin ninguna restricción:
1. **Inscripción de Torneo:** Escribe y lee en `/championship_participants.json`.
2. **Leaderboards en Vivo:** Escribe y lee en `/leaderboards/...`.
3. **Auditoría de Envíos:** Escribe y lee en `/submissions/...`.
4. **Mod DLL/ASI de Telemetría (`dll.cpp`):** Escribe en `/records.json`.

> [!WARNING]
> Si aplicaste la regla segmentada anterior (que solo incluía `leaderboards`, `submissions` y `championship_participants`), **SÍ interfería** con el mod de telemetría del juego (`dll.cpp` / `NFSMW_FirebaseBridge.ini`), ya que el mod envía datos a `/records.json`.

### Regla recomendada para 0 interferencias:
Para que **absolutamente nada interfiera** y todas las funciones (web, formularios, torneos, leaderboards y el mod DLL del juego) funcionen al 100%:

- **Opción A (La más sencilla y 100% compatible - Tu regla original):**
  ```json
  {
    "rules": {
      ".read": true,
      ".write": true
    }
  }
  ```

- **Opción B (Estructurada por nodos, cubriendo todas las funciones de la app):**
  ```json
  {
    "rules": {
      "leaderboards": {
        ".read": true,
        ".write": true
      },
      "submissions": {
        ".read": true,
        ".write": true
      },
      "championship_participants": {
        ".read": true,
        ".write": true
      },
      "records": {
        ".read": true,
        ".write": true
      }
    }
  }
  ```

Ambas opciones garantizan que el envío de datos, las consultas en tiempo real y todas las funciones de la web operen con total libertad y sin bloqueos de permisos.
