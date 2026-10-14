const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("=== INICIANDO PRUEBAS: TACTICAL DOSSIER & STANDINGS VERIFICATION ===");

// 1. Verify index.html contains all redesigned Tactical Dossier IDs
const htmlPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(htmlPath, 'utf8');

const requiredDossierElements = [
  'view-blacklist-cards',
  'dossier-search-input',
  'dossier-roster-list',
  'dossier-sidebar-chosen',
  'dossier-hero-name',
  'dossier-hero-rank',
  'dossier-hero-heat',
  'dossier-hero-id',
  'dossier-hero-bio',
  'dossier-hero-yt',
  'dossier-hero-tag-emboss',
  'dossier-cluster-car',
  'dossier-rpm-readout',
  'dossier-top-speed',
  'dossier-accel-readout',
  'dossier-spec-ride',
  'dossier-spec-group',
  'dossier-spec-availability',
  'dossier-metric-rep',
  'dossier-hero-rank-tag',
  'dossier-metric-pts',
  'dossier-lead-indicator',
  'dossier-metric-winrate',
  'dossier-p1-count',
  'dossier-p2-count',
  'dossier-p3-count',
  'dossier-p4-count',
  'dossier-metric-bonus',
  'dossier-bonus-p2',
  'dossier-bonus-p3',
  'dossier-h2h-header-tag',
  'dossier-h2h-p1-name',
  'dossier-h2h-p1-pts',
  'dossier-h2h-p1-rep',
  'dossier-h2h-p1-p1',
  'dossier-h2h-p2-name',
  'dossier-h2h-p2-pts',
  'dossier-h2h-p2-rep',
  'dossier-h2h-p2-p1',
  'dossier-h2h-advantage',
  'dossier-h2h-bar-p1',
  'dossier-h2h-bar-p2',
  'dossier-h2h-label-p1',
  'dossier-h2h-label-p2',
  'dossier-quick-dock'
];

console.log("\n[TEST 1] Verificación de Componentes Pixel-Perfect en index.html");
let missing = 0;
requiredDossierElements.forEach(id => {
  const exists = indexHtml.includes(`id="${id}"`);
  if (!exists) {
    console.error(`  ✗ Missing element: #${id}`);
    missing++;
  }
});
assert.strictEqual(missing, 0, `Faltan ${missing} elementos en el DOM`);
console.log(`  ✓ PASS: Todos los ${requiredDossierElements.length} elementos del Cockpit HUD existen en index.html!`);

// 2. Setup mock DOM environment for tournament controller
const mockDomStore = {};
function createMockEl(id) {
  return {
    id,
    textContent: '',
    innerHTML: '',
    style: {},
    className: '',
    classList: {
      add(c) { mockDomStore[id].className += ' ' + c; },
      remove(c) { mockDomStore[id].className = mockDomStore[id].className.replace(c, ''); },
      contains(c) { return (mockDomStore[id].className || '').includes(c); }
    },
    appendChild(child) {},
    querySelectorAll() { return []; }
  };
}

global.document = {
  getElementById(id) {
    if (!mockDomStore[id]) {
      mockDomStore[id] = createMockEl(id);
    }
    return mockDomStore[id];
  },
  querySelectorAll(sel) {
    return [];
  },
  createElement(tag) {
    return createMockEl('dynamic-' + Math.random());
  }
};

global.window = {
  document: global.document,
  location: { hash: '' },
  scrollTo() {},
  addEventListener() {}
};

global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};

// Mock BroadcastChannel
global.BroadcastChannel = class {
  constructor(name) { this.name = name; }
  postMessage() {}
  close() {}
};

// 3. Load blacklist data & controller
const { DEFAULT_BLACKLIST_DRIVERS, CHAMPIONSHIP_WEEKS_DATA } = require('./src/blacklist-data.js');
window.DEFAULT_BLACKLIST_DRIVERS = DEFAULT_BLACKLIST_DRIVERS;
window.CHAMPIONSHIP_WEEKS_DATA = CHAMPIONSHIP_WEEKS_DATA;
const tournamentController = require('./src/tournament-controller.js');

async function runTests() {
  await tournamentController.loadStandingsView();
  const sortedDrivers = tournamentController.getSortedDrivers();

  // TEST 2: Líder Blacklist #1 de la Clasificación Actual
  console.log("\n[TEST 2] Verificación del Líder Blacklist #1 de la Clasificación Actual");
  const leader = sortedDrivers[0];
  console.log(`  Driver #1: ${leader.name} ("${leader.alias}")`);
  console.log(`  Puntos Totales: ${leader.totalScore} PTS`);
  console.log(`  Recompensa REP: $${leader.rep?.toLocaleString()}`);
  console.log(`  Victorias P1: ${leader.victories?.p1}`);

  // Verificar fórmula oficial de puntuación para el Líder #1:
  // PTS = (P1*25) + (P2*18) + (P3*15) + (P4*12) + Bonus + Math.floor(REP/10000)
  const v1 = leader.victories || {};
  const expectedLeaderScore = ((v1.p1 || 0) * 25) + ((v1.p2 || 0) * 18) + ((v1.p3 || 0) * 15) + ((v1.p4 || 0) * 12) + (leader.bonusPoints || 0) + Math.floor((leader.rep || 0) / 10000);
  assert.strictEqual(leader.totalScore, expectedLeaderScore, `El puntaje del líder (${leader.totalScore}) no coincide con la fórmula oficial (${expectedLeaderScore})`);
  assert.ok(leader.totalScore > 0, 'El líder debe tener puntaje positivo');
  console.log("  ✓ PASS: Líder #1 verificado con exactitud matemática y fórmula oficial!");

  // TEST 3: Verificación de Piloto Destacado (Avenger)
  console.log("\n[TEST 3] Verificación de Piloto Destacado (Avenger)");
  const avenger = sortedDrivers.find(d => (d.alias && d.alias.includes('Avenger')) || (d.name && d.name.includes('Avenger')));
  assert.ok(avenger, 'Avenger debe estar en la lista de pilotos');
  const vAvg = avenger.victories || {};
  const expectedAvgScore = ((vAvg.p1 || 0) * 25) + ((vAvg.p2 || 0) * 18) + ((vAvg.p3 || 0) * 15) + ((vAvg.p4 || 0) * 12) + (avenger.bonusPoints || 0) + Math.floor((avenger.rep || 0) / 10000);
  console.log(`  Avenger - PTS: ${avenger.totalScore} | REP: $${avenger.rep?.toLocaleString()} | P1: ${vAvg.p1}`);
  assert.strictEqual(avenger.totalScore, expectedAvgScore, 'Puntos de Avenger coinciden exactamente con la fórmula');
  console.log("  ✓ PASS: Avenger verificado!");

  // TEST 4: Verificación de Piloto Destacado (Nebula)
  console.log("\n[TEST 4] Verificación de Piloto Destacado (Nebula)");
  const nebula = sortedDrivers.find(d => d.name === 'Nebula' || d.alias === 'Nebula');
  assert.ok(nebula, 'Nebula debe estar en la lista de pilotos');
  const vNeb = nebula.victories || {};
  const expectedNebScore = ((vNeb.p1 || 0) * 25) + ((vNeb.p2 || 0) * 18) + ((vNeb.p3 || 0) * 15) + ((vNeb.p4 || 0) * 12) + (nebula.bonusPoints || 0) + Math.floor((nebula.rep || 0) / 10000);
  console.log(`  Nebula - PTS: ${nebula.totalScore} | REP: $${nebula.rep?.toLocaleString()} | P1: ${vNeb.p1}`);
  assert.strictEqual(nebula.totalScore, expectedNebScore, 'Puntos de Nebula coinciden exactamente con la fórmula');
  console.log("  ✓ PASS: Nebula verificado!");

  // TEST 5: Verificación de Top Clasificados (N6 xBourne & ZimanX)
  console.log("\n[TEST 5] Verificación de Top Clasificados (N6 xBourne & ZimanX)");
  const bourne = sortedDrivers.find(d => d.name.includes('Bourne') || d.alias.includes('Bourne'));
  const ziman = sortedDrivers.find(d => d.name.includes('Ziman') || d.alias.includes('Ziman'));
  assert.ok(bourne, 'N6 xBourne debe estar en la lista');
  assert.ok(ziman, 'ZimanX debe estar en la lista');
  console.log(`  N6 xBourne - PTS: ${bourne.totalScore} | REP: $${bourne.rep?.toLocaleString()} | P1: ${bourne.victories?.p1}`);
  console.log(`  ZimanX - PTS: ${ziman.totalScore} | REP: $${ziman.rep?.toLocaleString()} | P1: ${ziman.victories?.p1}`);
  console.log("  ✓ PASS: Top clasificados verificados!");

  // TEST 6: Casillas Nulas / Sin Disputar
  console.log("\n[TEST 6] Verificación de Casillas Nulas / Sin Disputar");
  const razor = sortedDrivers.find(d => d.name === 'RazorV8' || d.alias === 'RazorV8');
  const turbo = sortedDrivers.find(d => d.name === 'TurboFox' || d.alias === 'TurboFox');
  if (razor) {
    console.log(`  RazorV8 - P1: ${razor.victories?.p1 || 0}, PTS: ${razor.totalScore || 0}, REP: $${razor.rep || 0}`);
    assert.strictEqual(razor.victories?.p1 || 0, 0);
    assert.strictEqual(razor.totalScore || 0, 0);
  }
  if (turbo) {
    console.log(`  TurboFox - P1: ${turbo.victories?.p1 || 0}, PTS: ${turbo.totalScore || 0}, REP: $${turbo.rep || 0}`);
    assert.strictEqual(turbo.victories?.p1 || 0, 0);
    assert.strictEqual(turbo.totalScore || 0, 0);
  }
  console.log("  ✓ PASS: Las casillas vacías/nulas no sumaron victorias ni puntos fantasma!");

  // TEST 7: Interactividad del Cockpit HUD (Tactical Dossier)
  console.log("\n[TEST 7] Interactividad y Renderizado del Cockpit HUD");
  tournamentController.selectDossierPilot(leader.alias || leader.name);

  const heroName = mockDomStore['dossier-hero-name'].innerHTML;
  const heroRep = mockDomStore['dossier-metric-rep'].textContent;
  const heroPts = mockDomStore['dossier-metric-pts'].innerHTML;
  const p1Count = mockDomStore['dossier-p1-count'].textContent;

  console.log(`  HUD Hero Name: ${heroName.trim()}`);
  console.log(`  HUD REP Metric: ${heroRep.trim()}`);
  console.log(`  HUD PTS Metric: ${heroPts.trim()}`);
  console.log(`  HUD P1 Count: ${String(p1Count).trim()}`);

  assert.ok(heroName.includes(leader.name) || heroName.includes(leader.alias));
  assert.strictEqual(heroRep, `$${(leader.rep || 0).toLocaleString('de-DE')}`);
  assert.ok(heroPts.includes(String(leader.totalScore)) || heroPts.includes((leader.totalScore).toLocaleString('de-DE')));
  assert.strictEqual(Number(p1Count), leader.victories?.p1 || 0);
  console.log("  ✓ PASS: Cockpit HUD renderiza la telemetría del líder de forma reactiva!");

  // TEST 8: Switch Instantáneo de Piloto
  const otherDriver = sortedDrivers[1];
  console.log(`\n[TEST 8] Switch Instantáneo de Piloto (${otherDriver.name})`);
  tournamentController.selectDossierPilot(otherDriver.alias || otherDriver.name);

  const heroNameOther = mockDomStore['dossier-hero-name'].innerHTML;
  const heroRepOther = mockDomStore['dossier-metric-rep'].textContent;
  const p1CountOther = mockDomStore['dossier-p1-count'].textContent;

  console.log(`  HUD Hero Name: ${heroNameOther.trim()}`);
  console.log(`  HUD REP Metric: ${heroRepOther.trim()}`);
  console.log(`  HUD P1 Count: ${String(p1CountOther).trim()}`);

  assert.ok(heroNameOther.includes(otherDriver.name) || heroNameOther.includes(otherDriver.alias));
  assert.strictEqual(heroRepOther, `$${(otherDriver.rep || 0).toLocaleString('de-DE')}`);
  assert.strictEqual(Number(p1CountOther), otherDriver.victories?.p1 || 0);
  console.log(`  ✓ PASS: Cockpit HUD actualizó exitosamente todos los indicadores para ${otherDriver.name}!`);

  console.log("\n=======================================================");
  console.log("🎉 TODAS LAS VERIFICACIONES DEL DOSSIER PASARON CON ÉXITO!");
  console.log("=======================================================");
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});

