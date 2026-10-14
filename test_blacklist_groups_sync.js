const fs = require('fs');
const assert = require('assert');

console.log("=================================================================");
console.log("TEST SUITE: BLACKLIST GRUPOS Y RIVALES - ADMIN SYNC VERIFICATION");
console.log("=================================================================");

// 1. Static check: Verify lines overriding groups in week 3/4 are removed
const controllerCode = fs.readFileSync('src/tournament-controller.js', 'utf8');
assert(!controllerCode.includes('if (weekNum >= 3 && groups.length < 4)'), 'Must not override groups when length < 4');
console.log("✓ Pass: Hardcoded 4/5 groups override condition is completely removed from renderGroupsGrid.");

// 2. Set up mock DOM environment
const mockDom = {};
function createMockNode(id = '') {
  const node = {
    id,
    type: 'button',
    textContent: '',
    _innerHTML: '',
    get innerHTML() { return this._innerHTML; },
    set innerHTML(val) {
      this._innerHTML = val;
      if (val === '') this.children = [];
    },
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
      child.parentElement = node;
    },
    addEventListener(evt, fn) {
      node['on' + evt] = fn;
    },
    click() {
      if (typeof node.onclick === 'function') node.onclick();
    },
    querySelectorAll(sel) {
      return node.children;
    }
  };
  return node;
}

global.window = {
  addEventListener() {},
  scrollTo() {}
};

global.document = {
  getElementById(id) {
    if (!mockDom[id]) {
      mockDom[id] = createMockNode(id);
    }
    return mockDom[id];
  },
  createElement(tag) {
    return createMockNode();
  },
  querySelectorAll(sel) {
    return [];
  }
};

// Mock BroadcastChannel
class MockBroadcastChannel {
  constructor(name) {
    this.name = name;
    if (!MockBroadcastChannel.channels[name]) {
      MockBroadcastChannel.channels[name] = [];
    }
    MockBroadcastChannel.channels[name].push(this);
    this.onmessage = null;
  }
  postMessage(data) {
    const listeners = MockBroadcastChannel.channels[this.name] || [];
    listeners.forEach(ch => {
      if (ch !== this && typeof ch.onmessage === 'function') {
        ch.onmessage({ data });
      }
    });
  }
  close() {}
}
MockBroadcastChannel.channels = {};
global.BroadcastChannel = MockBroadcastChannel;
global.window.BroadcastChannel = MockBroadcastChannel;

// Mock localStorage
const storageStore = {};
global.localStorage = {
  getItem(k) { return storageStore[k] || null; },
  setItem(k, v) { storageStore[k] = String(v); },
  removeItem(k) { delete storageStore[k]; }
};
global.window.localStorage = global.localStorage;

// Mock fetch
global.fetch = async (url) => {
  return {
    ok: true,
    json: async () => null
  };
};

// Load scripts
const blacklistDataCode = fs.readFileSync('src/blacklist-data.js', 'utf8');
const tournamentControllerCode = fs.readFileSync('src/tournament-controller.js', 'utf8');

eval(blacklistDataCode);
eval(tournamentControllerCode);

(async () => {
  // TEST 1: Load live tournament data and verify Week 3 initial render
  console.log("\n[TEST 1] Verificando renderizado de Semana 3 en 'Blacklist Grupos y Rivales':");
  
  // Call loadTournamentGroupsView
  await global.window.loadTournamentGroupsView();

  const weekSelector = document.getElementById('tournament-week-selector');
  assert(weekSelector.children.length === 4, 'Should have 4 week pills');
  
  // Click Week 3 pill (index 2)
  weekSelector.children[2].click();

  const groupsGrid = document.getElementById('tournament-groups-grid');
  assert(groupsGrid, 'Should have #tournament-groups-grid');
  
  console.log(`  Tarjetas de grupos renderizadas en Semana 3: ${groupsGrid.children.length}`);
  assert.strictEqual(groupsGrid.children.length, 3, 'Week 3 must render exactly 3 group cards (Alfa, Beta, Gama)');
  
  const textContent = groupsGrid.children.map(c => c.innerHTML).join(' ');
  assert(textContent.includes('Alfa'), 'Must include Grupo Alfa');
  assert(textContent.includes('Beta'), 'Must include Grupo Beta');
  assert(textContent.includes('Gama'), 'Must include Grupo Gama');
  assert(!textContent.includes('Delta'), 'Must NOT include Grupo Delta (eliminado)');
  assert(!textContent.includes('Épsilon') && !textContent.includes('Epsilon'), 'Must NOT include Grupo Épsilon (eliminado)');
  console.log("  ✓ PASS: Semana 3 muestra únicamente los 3 grupos (Alfa, Beta, Gama). Delta y Épsilon no aparecen.");
  console.log(`  Grid layout class: "${groupsGrid.className}" (Adaptado a 3 columnas)`);
  assert(groupsGrid.className.includes('grid-cols-3'), 'Must be styled with 3 columns');

  // TEST 2: Group filter buttons in Semana 3
  console.log("\n[TEST 2] Verificando botones de filtro de grupo en Semana 3:");
  const tabsContainer = document.getElementById('championship-group-tabs-container');
  console.log(`  Botones de grupo renderizados: ${tabsContainer.children.length}`);
  assert.strictEqual(tabsContainer.children.length, 3, 'Should render exactly 3 filter buttons for Week 3');
  assert(tabsContainer.children[0].innerHTML.includes('ALFA'), 'Button 0 is ALFA');
  assert(tabsContainer.children[1].innerHTML.includes('BETA'), 'Button 1 is BETA');
  assert(tabsContainer.children[2].innerHTML.includes('GAMA'), 'Button 2 is GAMA');
  console.log("  ✓ PASS: Solo existen 3 botones de filtro correspondientes a Alfa, Beta y Gama.");

  // TEST 3: Realtime BroadcastChannel sync from admin (Add group)
  console.log("\n[TEST 3] Verificando sincronización reactiva vía BroadcastChannel (Simulando Agregar Grupo en Admin):");
  
  // Simulate admin adding a 4th group "Grupo Delta (Retorno)" to Week 3
  const adminBC = new MockBroadcastChannel('nfs_championship_sync');
  const updatedWeeks = JSON.parse(JSON.stringify(window.CHAMPIONSHIP_WEEKS_DATA));
  updatedWeeks["3"].groups.push({
    name: "Grupo Delta (Retorno)",
    tag: "🏁 TIER COMPETICIÓN",
    pilots: [2, 7, 14, "open_19"]
  });

  adminBC.postMessage({
    type: 'CHAMPIONSHIP_WEEKS_UPDATED',
    week: 3,
    data: updatedWeeks
  });

  await new Promise(r => setTimeout(r, 50));

  console.log(`  Tarjetas tras agregar grupo desde Admin: ${groupsGrid.children.length}`);
  assert.strictEqual(groupsGrid.children.length, 4, 'Should now render 4 group cards in real time');
  
  console.log(`  Botones tras agregar grupo desde Admin: ${tabsContainer.children.length}`);
  assert.strictEqual(tabsContainer.children.length, 4, 'Should now render 4 filter buttons in real time');
  console.log("  ✓ PASS: Sincronización en tiempo real agrega Grupo Delta automáticamente a la vista!");

  // TEST 4: Realtime delete via BroadcastChannel
  console.log("\n[TEST 4] Verificando sincronización reactiva de eliminación desde Admin:");
  // Now delete Gama and Delta, leaving only 2 groups (Alfa, Beta)
  updatedWeeks["3"].groups = [
    updatedWeeks["3"].groups[0],
    updatedWeeks["3"].groups[1]
  ];

  adminBC.postMessage({
    type: 'CHAMPIONSHIP_WEEKS_UPDATED',
    week: 3,
    data: updatedWeeks
  });

  await new Promise(r => setTimeout(r, 50));

  console.log(`  Tarjetas tras eliminar grupos desde Admin: ${groupsGrid.children.length}`);
  assert.strictEqual(groupsGrid.children.length, 2, 'Should now render 2 group cards in real time');
  
  console.log(`  Botones tras eliminar grupos desde Admin: ${tabsContainer.children.length}`);
  assert.strictEqual(tabsContainer.children.length, 2, 'Should now render 2 filter buttons in real time');
  console.log("  ✓ PASS: Sincronización en tiempo real elimina grupos inmediatamente sin recargar la página!");

  console.log("\n=================================================================");
  console.log("🎉 TODOS LOS TESTS DE SINCRONIZACIÓN BLACKLIST PASARON CON ÉXITO!");
  console.log("=================================================================");
})();
