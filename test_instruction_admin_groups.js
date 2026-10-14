// Test Suite: Verificación de Pilotos Oficiales e Inscritos en Comisaría (Admin Groups)
const fs = require('fs');
const vm = require('vm');
const path = require('path');

console.log("=== INICIANDO PRUEBAS: SISTEMA DE GRUPOS Y PILOTOS OFICIALES EN ADMIN ===");

// 1. Simulación de entorno DOM y navegador
const mockLocalStorage = {};
const mockElements = {};

function createMockElement(id, tag = 'div') {
    const el = {
        id: id,
        tagName: tag.toUpperCase(),
        value: '',
        innerHTML: '',
        style: {},
        className: '',
        children: [],
        disabled: false,
        querySelectorAll: (sel) => [],
        focus: () => {}
    };
    mockElements[id] = el;
    return el;
}

const sandbox = {
    window: {},
    document: {
        getElementById: (id) => mockElements[id] || null,
        createElement: (tag) => createMockElement('dynamic_' + Math.random(), tag),
        querySelectorAll: (sel) => {
            if (sel === '#champ-admin-groups-container .admin-group-card') {
                return [
                    createMockElement('admin-group-card-0'),
                    createMockElement('admin-group-card-1'),
                    createMockElement('admin-group-card-2'),
                    createMockElement('admin-group-card-3')
                ];
            }
            return [];
        },
        body: { appendChild: () => {} },
        addEventListener: () => {}
    },
    addEventListener: () => {},
    localStorage: {
        getItem: (k) => mockLocalStorage[k] || null,
        setItem: (k, v) => { mockLocalStorage[k] = String(v); },
        removeItem: (k) => { delete mockLocalStorage[k]; }
    },
    fetch: async () => ({ ok: false }),
    console: console,
    setTimeout: (fn) => setTimeout(fn, 0),
    clearTimeout: () => {},
    alert: () => {},
    confirm: () => true
};
sandbox.window = sandbox;

// 2. Cargar dependencias de datos previas (routes-data, seasons-data, blacklist-data)
const blacklistDataCode = fs.readFileSync('assets/js/blacklist-data.js', 'utf8');
vm.runInNewContext(blacklistDataCode, sandbox);

// 3. Cargar admin.js
const adminCode = fs.readFileSync('assets/js/admin.js', 'utf8');
vm.runInNewContext(adminCode, sandbox);

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  ✓ PASS: ${message}`);
    } else {
        console.error(`  ✗ FAIL: ${message}`);
        throw new Error(`Assertion failed: ${message}`);
    }
}

// TEST 1: Fallback / Initial tournament participants contiene los 15 pilotos
console.log("\n[TEST 1] Verificación de Participantes Oficiales de Respaldo (15 pilotos)");
const fallbackParticipants = sandbox.getChampionshipDefaultDrivers();
assert(Array.isArray(fallbackParticipants), "getChampionshipDefaultDrivers devuelve un arreglo");
assert(fallbackParticipants.length === 15, `Tiene 15 participantes (actual: ${fallbackParticipants.length})`);
assert(fallbackParticipants[0].alias === "ZimanX" && fallbackParticipants[0].rank === 1, "Rango 1 es ZimanX");
assert(fallbackParticipants[10].alias === "RazorV8" && fallbackParticipants[10].rank === 11, "Rango 11 es RazorV8");
assert(fallbackParticipants[14].alias === "SRTxAvengerT" && fallbackParticipants[14].rank === 15, "Rango 15 es SRTxAvengerT");

// TEST 2: NFS_MW_2005_STORY_RIVALS contiene 15 rivales CPU
console.log("\n[TEST 2] Verificación de Rivales IA / Historia NFS MW 2005 (15 rivales)");
const storyRiv = sandbox.NFS_MW_2005_STORY_RIVALS;
assert(Array.isArray(storyRiv), "NFS_MW_2005_STORY_RIVALS es un arreglo");
assert(storyRiv.length === 15, `Tiene 15 rivales IA (actual: ${storyRiv.length})`);
assert(storyRiv[0].alias === "Razor" && storyRiv[0].name === "Clarence Callahan", "CPU 1 es Razor (Clarence Callahan)");
assert(storyRiv[1].alias === "Bull" && storyRiv[1].name === "Toru Sato", "CPU 2 es Bull (Toru Sato)");

// TEST 3: getBlacklistDriverSelectOptionsHTML - Sin colisiones y selección exacta
console.log("\n[TEST 3] Generación de Opciones de Selección sin colisiones");
const selectHtmlPilot1 = sandbox.getBlacklistDriverSelectOptionsHTML(1);
assert(selectHtmlPilot1.includes('<optgroup label="🏁 PILOTOS OFICIALES DEL TORNEO (INSCRITOS • BLACKLIST 2026)">'), "Contiene optgroup unificado de pilotos oficiales");
assert(selectHtmlPilot1.includes('<option value="1" selected>🏁 #1 ZimanX'), "Selecciona exactamente al Piloto #1 (ZimanX)");

// Verificar que value="1" NO aparece dos veces como opción numérica
const countValue1 = (selectHtmlPilot1.match(/value="1"/g) || []).length;
assert(countValue1 === 1, `value="1" aparece solo una vez (conteo: ${countValue1})`);

// Verificar que CPU Razor tiene cpu_1 y no colisiona
assert(selectHtmlPilot1.includes('value="cpu_1"'), "CPU Razor usa el valor no colisionante 'cpu_1'");
assert(selectHtmlPilot1.includes('Razor - Clarence Callahan'), "CPU Razor muestra su nombre original de campaña");

// TEST 4: Selección de piloto #11 (RazorV8) en lista oficial
console.log("\n[TEST 4] Selección de piloto oficial en plaza avanzada (#11 RazorV8)");
const selectHtmlPilot11 = sandbox.getBlacklistDriverSelectOptionsHTML(11);
assert(selectHtmlPilot11.includes('<option value="11" selected>🏁 #11 RazorV8'), "Selecciona exactamente a #11 RazorV8");

// TEST 5: getChampionshipDriverByRank
console.log("\n[TEST 5] Resolución de Pilotos por Rango o Identificador");
const p1 = sandbox.getChampionshipDriverByRank(1);
assert(p1.alias === "ZimanX", `Rango 1 resuelve a ZimanX (obtenido: ${p1.alias})`);
assert(p1.ride === "Porsche Carrera GT", `Vehículo de #1 es Porsche Carrera GT`);

const p11 = sandbox.getChampionshipDriverByRank(11);
assert(p11.alias === "RazorV8", `Rango 11 resuelve a RazorV8 (obtenido: ${p11.alias})`);

const pCpu = sandbox.getChampionshipDriverByRank("cpu_1");
assert(pCpu.alias === "Razor (IA)", `cpu_1 resuelve a Razor (IA)`);

const pOpen = sandbox.getChampionshipDriverByRank("open_11");
assert(pOpen.alias.includes("Plaza #11"), `open_11 resuelve a Plaza #11`);

// TEST 6: In-memory retention al cambiar de semana
console.log("\n[TEST 6] Retención de cambios de grupos en memoria al cambiar de semana");
// Mocking DOM elements para semana 1
createMockElement('champ-admin-groups-container');
createMockElement('grp-name-0');
createMockElement('grp-tag-0');
createMockElement('grp-p0-0');
createMockElement('grp-p1-0');
createMockElement('grp-p2-0');

createMockElement('grp-name-1');
createMockElement('grp-tag-1');
createMockElement('grp-p0-1');
createMockElement('grp-p1-1');
createMockElement('grp-p2-1');

createMockElement('grp-name-2');
createMockElement('grp-tag-2');
createMockElement('grp-p0-2');
createMockElement('grp-p1-2');
createMockElement('grp-p2-2');

createMockElement('grp-name-3');
createMockElement('grp-tag-3');
createMockElement('grp-p0-3');
createMockElement('grp-p1-3');
createMockElement('grp-p2-3');

mockElements['grp-name-0'].value = "Grupo Alfa (Personalizado)";
mockElements['grp-tag-0'].value = "TIER 1";
mockElements['grp-p0-0'].value = "11"; // RazorV8 asignado a la casilla 1
mockElements['grp-p1-0'].value = "12"; // TurboFox asignado a la casilla 2
mockElements['grp-p2-0'].value = "13"; // SRTxSigy asignado a la casilla 3

// Inicializar y cambiar de semana
sandbox.selectChampionshipAdminWeek(2);
assert(sandbox.getCurrentChampAdminWeek() === 2, "Semana activa cambió a 2");

// Volver a semana 1
sandbox.selectChampionshipAdminWeek(1);
const w1Data = sandbox.getActiveChampWeekData(1);
assert(w1Data.groups[0].name === "Grupo Alfa (Personalizado)", "El nombre modificado se conservó");
assert(w1Data.groups[0].pilots[0] === 11, `Piloto en casilla 1 es 11 (RazorV8) (obtenido: ${w1Data.groups[0].pilots[0]})`);
assert(w1Data.groups[0].pilots[1] === 12, `Piloto en casilla 2 es 12 (TurboFox) (obtenido: ${w1Data.groups[0].pilots[1]})`);
assert(w1Data.groups[0].pilots[2] === 13, `Piloto en casilla 3 es 13 (SRTxSigy) (obtenido: ${w1Data.groups[0].pilots[2]})`);

// TEST 7: Registro de nuevo participante extiende automáticamente los pilotos oficiales
console.log("\n[TEST 7] Registro de nuevo participante extiende la lista de pilotos oficiales");
(async () => {
    const newPilot = await sandbox.registerNewChampionshipParticipant({
        name: "SpeedDemon99",
        alias: "SpeedDemon99",
        ride: "Corvette C6.R",
        contact: "+15550001"
    });
    assert(newPilot.rank === 16, `Nuevo piloto asignado al rango 16 (obtenido: ${newPilot.rank})`);
    
    const officialDrivers = sandbox.getChampionshipDefaultDrivers();
    const found = officialDrivers.find(d => d.rank === 16);
    assert(found !== undefined, "El nuevo piloto está presente en getChampionshipDefaultDrivers()");
    assert(found.alias === "SpeedDemon99", "El alias del piloto 16 es SpeedDemon99");

    const selectHtmlAfter = sandbox.getBlacklistDriverSelectOptionsHTML(16);
    assert(selectHtmlAfter.includes('🏁 #16 SpeedDemon99'), "Aparece en el select oficial como piloto homologado");
    assert(selectHtmlAfter.includes('selected'), "Está marcado como seleccionado");

    console.log(`\n=======================================================`);
    console.log(`🎉 TODAS LAS PRUEBAS PASARON CON ÉXITO: ${passedTests}/${totalTests}`);
    console.log(`=======================================================`);
})();
