/**
 * SUITE DE VALIDACIÓN AUTOMATIZADA - FASE 4: REFINAMIENTO DEL NAVBAR
 * Roles: Arquitecto Frontend Pixel-Perfect
 * Verificación: Migración de Marca (Logo NFS + NFSMWRANKS.ONLINE) y Alineación Estrictamente Centrada del Navbar
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
console.log('TEST SUITE: FASE 4 - REFINAMIENTO DEL NAVBAR & IDENTIDAD DE MARCA');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// 1. VERIFICACIÓN DE ARCHIVOS FÍSICOS DE LOGO
// -----------------------------------------------------------------------------
console.log('1. VERIFICACIÓN DE ASSETS FÍSICOS DE MARCA:');
const destImgDir = path.join(__dirname, 'assets', 'img');
const logoBadgePath = path.join(destImgDir, 'logo-badge.svg');
const nfsLogoPath = path.join(destImgDir, 'nfsranks-logo.svg');

assert(fs.existsSync(logoBadgePath), `Archivo físico existe: assets/img/logo-badge.svg`);
assert(fs.existsSync(nfsLogoPath), `Archivo físico existe: assets/img/nfsranks-logo.svg`);

const badgeContent = fs.readFileSync(logoBadgePath, 'utf8');
assert(badgeContent.includes('#E2263C') && badgeContent.includes('NFS'), 'logo-badge.svg contiene degradado rojo original y texto "NFS"');

// -----------------------------------------------------------------------------
// 2. VERIFICACIÓN DE ESTRUCTURA DE MARCA EN EL NAVBAR (index.html)
// -----------------------------------------------------------------------------
console.log('\n2. VERIFICACIÓN DE LOGO Y MARCA EN NAVBAR (index.html):');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const headerStart = html.indexOf('<header');
const headerEnd = html.indexOf('</header>');
const headerHtml = html.substring(headerStart, headerEnd + 9);

assert(!headerHtml.includes('https://lh3.googleusercontent.com/aida/AEtjO1U0BusLDj07Q3GnZw_xdgavHc0KuvDl2siSzG3Za8fkR_NqGMW-Oo8i1pQad4EAsIvNOAeQqZCY5gF3e6COlctZ6B2BzHnULOk25InyKmE1iK_sNyI5yFIj6kd-EapjqTRJDOd9MSQVXo-sISbJLlDqHX4rOr715Sue3O3y1oFHzBCW-oeBpSsZ9r76HoGRfynsi0njGc-zlzmydKvXQeKyk9GDHVLTcwN7g_bDwwp7LhAMSXHk0noFDq8'), 'Navbar ya NO contiene el logo temporal externo de Google');
assert(headerHtml.includes('src="assets/img/logo-badge.svg"'), 'Navbar referencia el archivo físico local assets/img/logo-badge.svg');
assert(headerHtml.includes('NFSMWRANKS') && headerHtml.includes('.ONLINE'), 'Texto exacto "NFSMWRANKS.ONLINE" presente en la marca de la cabecera');
assert(headerHtml.includes('h-9 w-auto object-contain') || headerHtml.includes('h-8') || headerHtml.includes('h-10'), 'Logo tiene altura controlada armónica para el Navbar (h-9 / h-8 / h-10)');
assert(headerHtml.includes('font-black uppercase tracking-tight'), 'Tipografía del logo respeta mayúsculas font-black');

// -----------------------------------------------------------------------------
// 3. VERIFICACIÓN DE ALINEACIÓN ESTRICTAMENTE CENTRADA (FLEXBOX SIMÉTRICO)
// -----------------------------------------------------------------------------
console.log('\n3. VERIFICACIÓN DE LAYOUT FLEXBOX SIMÉTRICO (Centrado Absoluto):');

assert(headerHtml.includes('flex-1 basis-0 min-w-0 flex items-center justify-start'), 'Bloque izquierdo usa flex-1 basis-0 justify-start para balance simétrico');
assert(headerHtml.includes('flex-1 basis-0 min-w-0 flex items-center justify-end'), 'Bloque derecho usa flex-1 basis-0 justify-end con exactamente el mismo peso');
assert(headerHtml.includes('justify-center') && headerHtml.includes('mx-auto'), 'main-nav configurado con justify-center mx-auto');
assert(headerHtml.includes('id="main-nav"'), 'Contenedor nav id="main-nav" preservado intacto');

// -----------------------------------------------------------------------------
// 4. REGLA DE ORO: INTEGRIDAD DE BOTONES Y DROPDOWNS
// -----------------------------------------------------------------------------
console.log('\n4. INTEGRIDAD DE INTERACTIVIDAD Y DROPDOWNS:');
const requiredNavIds = [
  'nav-home',
  'nav-leaderboard',
  'nav-routes-pistas',
  'nav-blacklist',
  'nav-telemetria',
  'nav-community'
];
requiredNavIds.forEach(id => {
  assert(headerHtml.includes(`id="${id}"`), `Identificador del Router intacto: id="${id}"`);
});

assert(headerHtml.includes('group-hover:flex'), 'Dropdown de Comunidad mantiene comportamiento group-hover:flex');
assert(headerHtml.includes('Salón de la Fama') && headerHtml.includes('Guías de Tuning'), 'Sub-enlaces del dropdown preservados');
assert(headerHtml.includes('global-search-input'), 'Buscador global en Navbar preservado (id="global-search-input")');

console.log('\n================================================================');
console.log(`RESULTADO DE LA SUITE: ${testsPassed} PASARON / ${testsFailed} FALLARON`);
console.log('================================================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('🎉 TODAS LAS PRUEBAS DE LA FASE 4 HAN PASADO EXITOSAMENTE');
}
