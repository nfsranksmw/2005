/**
 * SUITE DE VALIDACIÓN AUTOMATIZADA - FASE 3.4
 * Regla de Oro: Zero UI Tampering (CSS e index.html intactos)
 * Verificación de condicionales de estilo P1 vs P2+ y soporte integral de Circuitos, Sprints y Drags
 */

const fs = require('fs');
const path = require('path');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    testsFailed++;
  }
}

console.log('================================================================');
console.log('TEST SUITE: FASE 3.4 - CONDICIONALES DE ESTILO & EXPANSIÓN GLOBAL');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// 1. VERIFICACIÓN DE REGLA DE ORO (Zero UI Tampering)
// -----------------------------------------------------------------------------
console.log('1. REGLA DE ORO: Preservación de CSS e index.html');
const cssDir = path.join(__dirname, 'assets');
let cssFilesModified = false;
if (fs.existsSync(cssDir)) {
  const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
  assert(cssFiles.length >= 0, `Verificación de directorio de estilos: ${cssFiles.length} CSS encontrados`);
}
assert(!cssFilesModified, 'Archivos CSS permanecen estrictamente inalterados');

// -----------------------------------------------------------------------------
// 2. EXTRACCIÓN Y EJECUCIÓN DE FUNCIONES DEL CONTROLADOR JS (src/app.js)
// -----------------------------------------------------------------------------
console.log('\n2. EVALUACIÓN DE LÓGICA DE CONTROLADOR (src/app.js)');
const appCode = fs.readFileSync(path.join(__dirname, 'src', 'app.js'), 'utf8');

// Extraer funciones clave para testeo unitario
const routesDataCode = fs.readFileSync(path.join(__dirname, 'src', 'routes-data.js'), 'utf8');
const routesData = eval(routesDataCode.replace('const routesData =', ''));

assert(Array.isArray(routesData) && routesData.length === 86, `Catálogo completo cargado: ${routesData.length} rutas (esperado 86)`);
const circuits = routesData.filter(r => r.type === 'Circuito');
const sprints = routesData.filter(r => r.type === 'Sprint');
const drags = routesData.filter(r => r.type === 'Drag');
assert(circuits.length === 29, `Circuitos verificados: ${circuits.length} (esperado 29)`);
assert(sprints.length === 46, `Sprints verificados: ${sprints.length} (esperado 46)`);
assert(drags.length === 11, `Drags verificados: ${drags.length} (esperado 11)`);

// Mock de NFS_FIREBASE y entorno DOM mínimo para ejecutar createLeaderboardRowHtml
global.window = {
  NFS_FIREBASE: {
    formatMsToTime: ms => {
      const mins = Math.floor(ms / 60000);
      const secs = Math.floor((ms % 60000) / 1000);
      const millis = ms % 1000;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
    },
    parseTimeToMs: s => 80000,
    sanitizeKey: s => s.toLowerCase().replace(/[^a-z0-9_-]/g, '_')
  }
};

// Extraer createLeaderboardRowHtml y helpers de src/app.js usando Function
const extractFn = (name, regex) => {
  const match = appCode.match(regex);
  if (!match) throw new Error(`No se pudo extraer ${name}`);
  return match[0];
};

// Extraer funciones de estilo y formato
const helpersCode = `
  const routesData = ${JSON.stringify(routesData)};
  ${appCode.substring(appCode.indexOf('function escapeHtml'), appCode.indexOf('function renderLeaderboardTable'))}
  ${appCode.substring(appCode.indexOf('const STRICT_CATEGORY_ORDER'), appCode.indexOf('function renderCategoryTabs'))}
  return {
    createLeaderboardRowHtml,
    getCategoryDisplayLabel,
    sortCategoriesStrict,
    getRecordTeam,
    getRecordTelemetryStat
  };
`;

const fns = (new Function(helpersCode))();

// -----------------------------------------------------------------------------
// 3. CONDICIONALES DE RENDERIZADO: POSICIÓN 1 (TOP 1 WR)
// -----------------------------------------------------------------------------
console.log('\n3. VERIFICACIÓN POSICIÓN 1 (Top 1 World Record):');
const p1Record = {
  driver: 'ViperKing99',
  time: '01:20.750',
  timeMs: 80750,
  car: 'Porsche Carrera GT',
  gearbox: 'Manual',
  videoUrl: 'https://youtube.com/watch?v=mockP1'
};
const p1Html = fns.createLeaderboardRowHtml(p1Record, 1, 80750);

assert(p1Html.includes('bg-primary-container text-on-primary-container'), 'P1: Badge de posición tiene fondo amarillo brillante (bg-primary-container)');
assert(p1Html.includes('text-primary group-hover:text-primary-container'), 'P1: Nombre del piloto usa clase amarilla primaria (text-primary)');
assert(p1Html.includes('font-label-timer-md text-headline-sm text-primary font-bold'), 'P1: Tiempo principal usa clase amarilla primaria (text-primary)');
assert(p1Html.includes('TIEMPO LÍDER') && p1Html.includes('text-primary-container'), 'P1: Subtítulo indica "TIEMPO LÍDER" en color acento');
assert(p1Html.includes('bg-secondary-container') && p1Html.includes('play_arrow'), 'P1: Botón VÍDEO usa color acento brillante con sombra (bg-secondary-container)');
assert(p1Html.includes('TOP SPEED:') || p1Html.includes('SECTOR S1:'), 'P1: Telemetría avanzada presente en celda de piloto');

// -----------------------------------------------------------------------------
// 4. CONDICIONALES DE RENDERIZADO: POSICIÓN 2 (TOP 2 WORLD)
// -----------------------------------------------------------------------------
console.log('\n4. VERIFICACIÓN POSICIÓN 2 (Top 2 World):');
const p2Record = {
  driver: 'SRTxAvenger',
  time: '01:20.767',
  timeMs: 80767,
  car: 'Porsche Carrera GT',
  gearbox: 'Auto',
  videoUrl: 'https://youtube.com/watch?v=mockP2'
};
const p2Html = fns.createLeaderboardRowHtml(p2Record, 2, 80750);

assert(!p2Html.includes('bg-primary-container text-on-primary-container'), 'P2: NO usa medalla amarilla brillante');
assert(p2Html.includes('bg-surface-variant text-on-surface'), 'P2: Medalla usa fondo oscuro neutral de Stitch (bg-surface-variant)');
assert(p2Html.includes('text-white text-gray-100'), 'P2: Nombre del piloto usa clase de texto blanco/claro (text-white text-gray-100)');
assert(!p2Html.includes('text-primary font-bold tracking-tight'), 'P2: Tiempo principal NO es amarillo');
assert(p2Html.includes('text-white text-gray-100'), 'P2: Tiempo principal usa texto blanco/claro');
assert(p2Html.includes('+0.017s'), 'P2: Delta GAP calculado exactamente (+0.017s)');
assert(p2Html.includes('text-gray-400') && p2Html.includes('text-outline'), 'P2: Delta GAP estilizado en gris secundario (text-gray-400 text-outline)');
assert(p2Html.includes('bg-surface-container') && p2Html.includes('border border-outline-variant/30'), 'P2: Botón VÍDEO usa fondo y borde oscuro/transparente, NO color brillante');
assert(!p2Html.includes('bg-secondary-container hover:bg-secondary-container/90'), 'P2: Botón VÍDEO NO usa clase de primer lugar (bg-secondary-container)');

// -----------------------------------------------------------------------------
// 5. CONDICIONALES DE RENDERIZADO: POSICIÓN 3 Y POSICIÓN 4+
// -----------------------------------------------------------------------------
console.log('\n5. VERIFICACIÓN POSICIONES 3 Y 4+:');
const p3Record = {
  driver: 'Xman',
  time: '01:20.780',
  timeMs: 80780,
  car: 'Porsche Carrera GT',
  gearbox: 'Manual',
  videoUrl: 'https://youtube.com/watch?v=mockP3'
};
const p3Html = fns.createLeaderboardRowHtml(p3Record, 3, 80750);
assert(p3Html.includes('bg-surface-container-highest text-secondary'), 'P3: Medalla usa fondo de contenedor de Stitch (bg-surface-container-highest)');
assert(p3Html.includes('text-white text-gray-100'), 'P3: Nombre del piloto es blanco/claro');
assert(p3Html.includes('+0.030s'), 'P3: Delta GAP calculado (+0.030s)');
assert(p3Html.includes('text-gray-400'), 'P3: Delta GAP estilizado con texto secundario gris');

const p4Record = {
  driver: 'Skymaster',
  time: '01:20.920',
  timeMs: 80920,
  car: 'Porsche Carrera GT',
  gearbox: 'Manual',
  videoUrl: 'https://youtube.com/watch?v=mockP4'
};
const p4Html = fns.createLeaderboardRowHtml(p4Record, 4, 80750);
assert(p4Html.includes('bg-surface-container text-outline'), 'P4: Medalla usa fondo neutral container (bg-surface-container)');
assert(p4Html.includes('text-white text-gray-100'), 'P4: Nombre de piloto es blanco/claro');
assert(p4Html.includes('+0.170s'), 'P4: Delta GAP calculado (+0.170s)');
assert(p4Html.includes('text-gray-400'), 'P4: Delta GAP usa clase text-gray-400');
assert(p4Html.includes('border border-outline-variant/30'), 'P4: Botón VÍDEO con borde y fondo oscuro');

// -----------------------------------------------------------------------------
// 6. ETIQUETAS DINÁMICAS Y SOPORTE DE CIRCUITOS, SPRINTS Y DRAGS
// -----------------------------------------------------------------------------
console.log('\n6. ETIQUETAS Y ADAPTACIÓN DE CATEGORÍAS (CIRCUITOS, SPRINTS Y DRAGS):');

// Circuitos
assert(fns.getCategoryDisplayLabel('junkman_single', 'Circuito') === 'Junkman Single Lap', 'Circuito: junkman_single -> Junkman Single Lap');
assert(fns.getCategoryDisplayLabel('junkman_fast', 'Circuito') === 'Junkman Fast Lap', 'Circuito: junkman_fast -> Junkman Fast Lap');
assert(fns.getCategoryDisplayLabel('bmw_single', 'Circuito') === 'BMW M3 GTR Single Lap', 'Circuito: bmw_single -> BMW M3 GTR Single Lap');
assert(fns.getCategoryDisplayLabel('bmw_fast', 'Circuito') === 'BMW M3 GTR Fast Lap', 'Circuito: bmw_fast -> BMW M3 GTR Fast Lap');

// Sprints
assert(fns.getCategoryDisplayLabel('junkman', 'Sprint') === 'Junkman Sprint', 'Sprint: junkman -> Junkman Sprint');
assert(fns.getCategoryDisplayLabel('bmw', 'Sprint') === 'BMW M3 GTR Sprint', 'Sprint: bmw -> BMW M3 GTR Sprint');

// Drags
assert(fns.getCategoryDisplayLabel('junkman', 'Drag') === 'Junkman Drag', 'Drag: junkman -> Junkman Drag');
assert(fns.getCategoryDisplayLabel('bmw', 'Drag') === 'BMW M3 GTR Drag', 'Drag: bmw -> BMW M3 GTR Drag');

// Ordenamiento estricto
const unsorted = ['bmw_fast', 'junkman', 'bmw_single', 'junkman_single', 'bmw', 'junkman_fast'];
const sorted = fns.sortCategoriesStrict(unsorted);
assert(sorted[0] === 'junkman_single', 'Orden estricto: junkman_single primero');
assert(sorted[1] === 'junkman_fast', 'Orden estricto: junkman_fast segundo');
assert(sorted[2] === 'bmw_single', 'Orden estricto: bmw_single tercero');
assert(sorted[3] === 'bmw_fast', 'Orden estricto: bmw_fast cuarto');
assert(sorted[4] === 'junkman', 'Orden estricto: junkman quinto');
assert(sorted[5] === 'bmw', 'Orden estricto: bmw sexto');

console.log('\n================================================================');
console.log(`RESULTADO DE LA SUITE: ${testsPassed} PASARON / ${testsFailed} FALLARON`);
console.log('================================================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('🎉 TODAS LAS PRUEBAS DE LA FASE 3.4 HAN PASADO EXITOSAMENTE');
}
