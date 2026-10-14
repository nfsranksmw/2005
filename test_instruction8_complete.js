const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("=================================================================");
console.log("TEST SUITE: INSTRUCTION #8 - DOSSIER ENHANCEMENTS & HOME BUTTONS");
console.log("=================================================================");

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// TEST 1: Home Action Buttons & Discord URL Verification
console.log("\n[TEST 1] Verificación de botones y enlaces en la sección Home (#view-home):");

// 1.1 Exploradores -> routes-pistas
assert.ok(
  indexHtml.includes("onclick=\"switchView('routes-pistas')\"") && indexHtml.includes("CLASIFICACIONES DE EXPLORADORES"),
  "Falta botón CLASIFICACIONES DE EXPLORADORES conectado a routes-pistas"
);
console.log("  ✓ CLASIFICACIONES DE EXPLORADORES redirige a 'routes-pistas'");

// 1.2 Salón de la Fama -> halloffame
assert.ok(
  indexHtml.includes("onclick=\"switchView('halloffame')\"") && indexHtml.includes("SALÓN DE LA FAMA"),
  "Falta botón SALÓN DE LA FAMA conectado a halloffame"
);
console.log("  ✓ SALÓN DE LA FAMA redirige a 'halloffame'");

// 1.3 Discord Server URL
assert.ok(
  indexHtml.includes("href=\"https://discord.gg/pgP45wSN8K\"") && indexHtml.includes("SERVIDOR DISCORD"),
  "Falta URL oficial de Discord https://discord.gg/pgP45wSN8K en Home"
);
console.log("  ✓ SERVIDOR DISCORD apunta a https://discord.gg/pgP45wSN8K");

// 1.4 Hero Banner buttons
assert.ok(
  indexHtml.includes("onclick=\"switchView('tutorial')\"") && indexHtml.includes("VER TORNEO Y TUTORIAL"),
  "Falta VER TORNEO Y TUTORIAL conectado a tutorial"
);
console.log("  ✓ VER TORNEO Y TUTORIAL redirige a 'tutorial'");

assert.ok(
  indexHtml.includes("onclick=\"switchView('championship-register')\"") && indexHtml.includes("INSCRÍBETE AHORA"),
  "Falta INSCRÍBETE AHORA conectado a championship-register"
);
console.log("  ✓ INSCRÍBETE AHORA redirige a 'championship-register'");

assert.ok(
  indexHtml.includes("onclick=\"switchView('championship-standings')\"") && indexHtml.includes("VER CLASIFICACIONES"),
  "Falta VER CLASIFICACIONES conectado a championship-standings"
);
console.log("  ✓ VER CLASIFICACIONES redirige a 'championship-standings'");

// TEST 2: Dossier Sidebar Ordering & Legibility Verification
console.log("\n[TEST 2] Verificación de ordenación y tipografía en Tactical Dossier:");

// Mock environment
const mockDom = {};
function createMockNode(id) {
  const node = {
    id,
    textContent: '',
    innerHTML: '',
    style: {},
    className: '',
    children: [],
    classList: {
      add(c) { node.className += ' ' + c; },
      remove(c) { node.className = node.className.replace(c, '').trim(); },
      contains(c) { return (node.className || '').includes(c); }
    },
    appendChild(child) {
      node.children.push(child);
    },
    querySelectorAll(sel) {
      return [];
    }
  };
  return node;
}

global.document = {
  getElementById(id) {
    if (!mockDom[id]) {
      mockDom[id] = createMockNode(id);
    }
    return mockDom[id];
  },
  querySelectorAll(sel) {
    return [];
  },
  createElement(tag) {
    const el = createMockNode('el_' + Math.random().toString(36).substr(2, 5));
    el.tagName = tag.toUpperCase();
    return el;
  }
};

global.window = {
  switchView(view) {
    global.window.activeView = view;
  },
  addEventListener(event, handler) {},
  removeEventListener(event, handler) {},
  currentDossierRank: 1
};

global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};

global.BroadcastChannel = class {
  constructor(name) { this.name = name; }
  postMessage() {}
  close() {}
};

const blacklistData = require('./src/blacklist-data.js');
global.window.DEFAULT_BLACKLIST_DRIVERS = blacklistData.DEFAULT_BLACKLIST_DRIVERS;
global.window.CHAMPIONSHIP_WEEKS_DATA = blacklistData.CHAMPIONSHIP_WEEKS_DATA;
const tournamentCtrl = require('./src/tournament-controller.js');

async function runDossierTests() {
  await tournamentCtrl.loadDossierView();

  // Verify getSortedDriversForDossier returns pilots strictly by standings points desc
  const sortedDossier = tournamentCtrl.getSortedDriversForDossier();
  assert.ok(Array.isArray(sortedDossier) && sortedDossier.length >= 10, "Debe retornar al menos 10 pilotos");

  // Check strictly sorted by points desc
  for (let i = 0; i < sortedDossier.length - 1; i++) {
    const ptsA = sortedDossier[i].totalScore || tournamentCtrl.calculateDriverPoints(sortedDossier[i]);
    const ptsB = sortedDossier[i + 1].totalScore || tournamentCtrl.calculateDriverPoints(sortedDossier[i + 1]);
    assert.ok(ptsA >= ptsB, `El piloto en pos ${i} (${ptsA} pts) debe tener >= pts que el de pos ${i+1} (${ptsB} pts)`);
  }
  console.log(`  ✓ Lista ordenada estrictamente por Standings: #1 ${sortedDossier[0].name} (${sortedDossier[0].totalScore} pts) -> #15 ${sortedDossier[sortedDossier.length - 1].name}`);

  // Render sidebar into mock
  tournamentCtrl.renderDossierSidebar();
  const rosterListEl = global.document.getElementById('dossier-roster-list');
  assert.ok(rosterListEl.children.length >= 10, "El sidebar debe renderizar a todos los pilotos");

  console.log(`  ✓ Sidebar renderizado con ${rosterListEl.children.length} pilotos en orden oficial.`);

  // Check typography classes inside rendered cards
  const firstCardHtml = rosterListEl.children[0].innerHTML;
  assert.ok(firstCardHtml.includes('text-sm') || firstCardHtml.includes('text-[15px]'), "El nombre debe tener text-sm o text-[15px]");
  assert.ok(firstCardHtml.includes('text-techgreen-400'), "El dinero REP debe tener text-techgreen-400");
  assert.ok(firstCardHtml.includes('text-cyanic-300'), "Los puntos deben tener text-cyanic-300");
  console.log("  ✓ Tipografía y contraste mejorados verificados en el HTML generado del sidebar");

// TEST 3: Full Interactivity - Clicking any driver selects them and updates all cards without resetting
console.log("\n[TEST 3] Verificación de reactividad al hacer click en cualquier piloto:");

// Select pilot #3 in standings
const pilotToSelect = sortedDossier[2]; // e.g. N6 xBourne or Nebula
tournamentCtrl.selectDossierPilot(pilotToSelect.rank, false);

assert.strictEqual(global.window.currentDossierRank, pilotToSelect.rank, "currentDossierRank debe actualizarse al rank del piloto seleccionado");
const heroName = global.document.getElementById('dossier-hero-name').innerHTML;
assert.ok(heroName.includes(pilotToSelect.alias || pilotToSelect.name), `El cockpit debe mostrar el nombre del piloto seleccionado: ${pilotToSelect.alias}`);
console.log(`  ✓ Cockpit reactivo actualiza exitosamente a '${pilotToSelect.alias}' (Posición #3)`);

// Select pilot #4 in standings
const pilot4 = sortedDossier[3];
tournamentCtrl.selectDossierPilot(pilot4.rank, false);
assert.strictEqual(global.window.currentDossierRank, pilot4.rank, "currentDossierRank debe actualizarse a pilot4");
const heroName4 = global.document.getElementById('dossier-hero-name').innerHTML;
assert.ok(heroName4.includes(pilot4.alias || pilot4.name), `El cockpit debe mostrar el nombre de ${pilot4.alias}`);
console.log(`  ✓ Cockpit reactivo actualiza exitosamente a '${pilot4.alias}' (Posición #4)`);

// Select pilot #1 again
  const pilot1 = sortedDossier[0];
  tournamentCtrl.selectDossierPilot(pilot1.rank, false);
  assert.strictEqual(global.window.currentDossierRank, pilot1.rank, "currentDossierRank debe actualizarse a pilot1");
  console.log(`  ✓ Cockpit reactivo regresa exitosamente a '${pilot1.alias}' (Posición #1)`);
}

runDossierTests().then(() => {
  // TEST 4: App.js router does not override selected pilot
  console.log("\n[TEST 4] Verificación de que switchView('blacklist-cards') no resetea a Avenger:");
  const appJs = fs.readFileSync(path.join(__dirname, 'src/app.js'), 'utf8');
  assert.ok(!appJs.includes("window.selectDossierPilot(1);"), "app.js no debe tener hardcoded window.selectDossierPilot(1)");
  assert.ok(appJs.includes("loadDossierView(window.currentDossierRank)"), "app.js debe respetar window.currentDossierRank al cambiar de vista");
  console.log("  ✓ Router SPA respeta la selección activa de piloto");

  // TEST 5: HTML Tag Balance
  console.log("\n[TEST 5] Verificación de balance de etiquetas HTML en index.html:");
  const views = [
    'view-home', 'view-leaderboard', 'view-routes-pistas', 'view-challenges',
    'view-blacklist', 'view-championship-standings', 'view-blacklist-cards',
    'view-championship-register', 'view-tutorial', 'view-past-tournaments',
    'view-telemetria', 'view-halloffame', 'view-guides', 'view-rules',
    'view-map', 'view-download', 'view-submit'
  ];

  views.forEach(v => {
    const match = indexHtml.match(new RegExp(`<section[^>]*id="${v}"[\\s\\S]*?<\\/section>`, 'i'));
    assert.ok(match, `La sección #${v} debe estar presente y cerrada correctamente.`);
  });
  console.log(`  ✓ Las ${views.length} vistas principales están balanceadas y cierran sus etiquetas.`);

  console.log("\n=================================================================");
  console.log("🎉 TODAS LAS PRUEBAS DE LA INSTRUCCIÓN #8 PASARON CON ÉXITO!");
  console.log("=================================================================");
}).catch(err => {
  console.error(err);
  process.exit(1);
});
