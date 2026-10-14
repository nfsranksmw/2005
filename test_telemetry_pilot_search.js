/**
 * Test Suite: Telemetry Pilot Search and Graffiti Banner Verification
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

async function runTests() {
  console.log('=== TEST SUITE: TELEMETRY PILOT SEARCH & GRAFFITI BANNERS ===\n');

  // 1. Test Graffiti Banners in index.html
  console.log('--- 1. Verificando Graffiti Banners en index.html ---');
  const indexHtml = fs.readFileSync('index.html', 'utf8');

  const requiredSections = [
    { id: 'view-routes-pistas', name: 'Rutas y Circuitos' },
    { id: 'view-challenges', name: 'Desafíos Semanales' },
    { id: 'view-championship-standings', name: 'Champions Standing' },
    { id: 'view-championship-register', name: 'Torneo de Registro' },
    { id: 'view-telemetria', name: 'Telemetría' },
    { id: 'view-map', name: 'Comunidad: Mapa' },
    { id: 'view-download', name: 'Comunidad: Descargas' },
    { id: 'view-guides', name: 'Comunidad: Guías' },
    { id: 'view-rules', name: 'Comunidad: Reglamento' },
    { id: 'view-submit', name: 'Comunidad: Enviar Récord' },
    { id: 'view-halloffame', name: 'Comunidad: Salón de la Fama' }
  ];

  let bannerErrors = 0;
  for (const sec of requiredSections) {
    const secPos = indexHtml.indexOf(`id="${sec.id}"`);
    if (secPos === -1) {
      console.error(`❌ Sección #${sec.id} (${sec.name}) no encontrada en index.html`);
      bannerErrors++;
      continue;
    }

    // Buscar si dentro de los siguientes 3000 caracteres de esa sección se encuentra nfsmw-graffiti-banner.png
    const chunk = indexHtml.slice(secPos, secPos + 3500);
    if (chunk.includes('assets/img/nfsmw-graffiti-banner.png')) {
      console.log(`✅ #${sec.id} (${sec.name}): Graffiti Banner presente`);
    } else {
      console.error(`❌ #${sec.id} (${sec.name}): No contiene nfsmw-graffiti-banner.png`);
      bannerErrors++;
    }
  }

  if (bannerErrors === 0) {
    console.log('✨ Todos los 11 banners de graffiti fueron verificados exitosamente.\n');
  } else {
    console.error(`⚠️ Hubo ${bannerErrors} errores en banners.\n`);
  }

  // 2. Test Telemetry Controller con datos reales de Firebase RTDB
  console.log('--- 2. Descargando datos de Leaderboards para Test de Pilotos ---');
  const leaderboards = await new Promise((resolve) => {
    https.get('https://nfsranks-blacklist-default-rtdb.firebaseio.com/leaderboards.json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({});
        }
      });
    }).on('error', () => resolve({}));
  });

  const totalTracks = Object.keys(leaderboards).length;
  console.log(`Tracks descargados: ${totalTracks}`);

  // Simular entorno del navegador
  const mockDOM = {
    elements: {},
    createElement(tag) {
      return {
        tag,
        value: '',
        innerHTML: '',
        textContent: ''
      };
    },
    querySelectorAll(selector) {
      return [];
    },
    getElementById(id) {
      if (!this.elements[id]) {
        this.elements[id] = {
          id,
          value: '',
          innerHTML: '',
          textContent: '',
          classList: {
            add: () => {},
            remove: () => {},
            contains: () => false
          },
          appendChild: (child) => {},
          addEventListener: () => {}
        };
      }
      return this.elements[id];
    }
  };

  global.window = {
    allLeaderboardsData: leaderboards,
    FIREBASE_RTDB_BASE_URL: "https://nfsranks-blacklist-default-rtdb.firebaseio.com"
  };
  global.document = mockDOM;

  // Cargar scripts requeridos
  require(path.resolve('src/routes-data.js'));
  require(path.resolve('src/blacklist-data.js'));
  global.routesData = global.routesData || window.routesData;
  global.DEFAULT_BLACKLIST_DRIVERS = window.DEFAULT_BLACKLIST_DRIVERS;

  // Cargar telemetry-controller.js
  delete require.cache[require.resolve('./src/telemetry-controller.js')];
  require(path.resolve('src/telemetry-controller.js'));

  console.log('\n--- 3. Probando Búsqueda de Pilotos Solicitados por el Usuario ---');
  const testPilots = [
    { query: 'Avenger', expectedDriver: 'Avenger', minRecords: 15 },
    { query: 'SRTxAvenger', expectedDriver: 'Avenger', minRecords: 15 },
    { query: 'Nebula', expectedDriver: 'Nebula', minRecords: 1 },
    { query: 'Lea', expectedDriver: 'Lea', minRecords: 100 },
    { query: 'Lea4Speed0', expectedDriver: 'Lea4Speed0', minRecords: 100 },
    { query: 'ZimanX', expectedDriver: 'ZimanX', minRecords: 40 },
    { query: 'Wess', expectedDriver: 'Wess', minRecords: 50 },
    { query: 'Mike', expectedDriver: 'Mike', minRecords: 150 }
  ];

  let pilotErrors = 0;
  for (const t of testPilots) {
    mockDOM.elements['pilotSearchInput'].value = t.query;
    await window.searchPilotTelemetry(t.query);

    const nameEl = mockDOM.elements['telemetry-pilot-name'];
    const totalTimesEl = mockDOM.elements['telemetry-stat-total-times'];
    const tbodyEl = mockDOM.elements['telemetry-records-tbody'];

    const displayedName = nameEl.innerHTML;
    const displayedTimes = totalTimesEl.textContent;
    const hasRows = tbodyEl.innerHTML.includes('<tr class=');

    const matchesName = displayedName.toLowerCase().includes(t.expectedDriver.toLowerCase());
    const timesMatch = parseInt(displayedTimes) >= t.minRecords;

    if (matchesName && timesMatch && hasRows) {
      console.log(`✅ Query: "${t.query}" -> Piloto: "${t.expectedDriver}", ${displayedTimes}, Tabla generada OK`);
    } else {
      console.error(`❌ Query: "${t.query}" falló. Name: ${displayedName}, Times: ${displayedTimes}, HasRows: ${hasRows}`);
      pilotErrors++;
    }
  }

  // 4. Test Category Filter
  console.log('\n--- 4. Probando Filtrado por Categoría en Telemetría ---');
  window.setPilot('Lea4Speed0');
  await new Promise(r => setTimeout(r, 100));

  window.filterTelemetryRecords('circuito');
  const circuitoRows = mockDOM.elements['telemetry-records-tbody'].innerHTML;
  const hasCircuitoRows = circuitoRows.includes('CIRCUITO');

  window.filterTelemetryRecords('sprint');
  const sprintRows = mockDOM.elements['telemetry-records-tbody'].innerHTML;
  const hasSprintRows = sprintRows.includes('SPRINT');

  window.filterTelemetryRecords('all');
  const allRows = mockDOM.elements['telemetry-records-tbody'].innerHTML;

  if (hasCircuitoRows && hasSprintRows && allRows.length > 0) {
    console.log('✅ Filtro por categoría (Circuitos, Sprints, Todas) funciona correctamente');
  } else {
    console.error('❌ Falló el filtro por categoría');
    pilotErrors++;
  }

  console.log('\n========================================');
  if (bannerErrors === 0 && pilotErrors === 0) {
    console.log('🎉 TODOS LOS TESTS PASARON EXITOSAMENTE!');
  } else {
    console.error(`⚠️ Hubo fallos: ${bannerErrors} en banners, ${pilotErrors} en pilotos.`);
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Error ejecutando tests:', err);
  process.exit(1);
});
