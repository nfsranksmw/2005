const fs = require('fs');
const path = require('path');

const adminHtmlPath = path.join(__dirname, 'admin.html');
const adminCssPath = path.join(__dirname, 'assets', 'css', 'admin.css');

console.log('================================================================');
console.log('TEST SUITE: INSTRUCCIÓN 1 - ADMIN.HTML & STITCH DESIGN SYSTEM');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

// 1. EXISTENCIA FÍSICA DE ARCHIVOS
console.log('1. VERIFICACIÓN DE ARCHIVOS FÍSICOS:');
assert(fs.existsSync(adminHtmlPath), 'admin.html existe en el directorio del proyecto');
assert(fs.existsSync(adminCssPath), 'assets/css/admin.css existe en el directorio del proyecto');

const adminHtml = fs.readFileSync(adminHtmlPath, 'utf8');
const adminCss = fs.readFileSync(adminCssPath, 'utf8');

// 2. APLICACIÓN DE TOKENS Y ESTILO STITCH
console.log('\n2. VERIFICACIÓN DE TOKENS Y ESTILOS STITCH:');
assert(adminHtml.includes('family=Chivo'), 'admin.html importa la tipografía técnica Chivo de Stitch');
assert(adminHtml.includes('family=JetBrains+Mono'), 'admin.html importa JetBrains Mono para telemetría');
assert(adminHtml.includes('assets/css/admin.css'), 'admin.html enlaza a assets/css/admin.css');
assert(!adminHtml.includes('assets/css/style.css'), 'admin.html no depende del CSS monolítico antiguo');
assert(adminHtml.includes('assets/img/logo-badge.svg'), 'admin.html muestra el badge de identidad oficial');

assert(adminCss.includes('#0A0C10') || adminCss.includes('--admin-bg'), 'admin.css define fondo oscuro profundo (#0A0C10)');
assert(adminCss.includes('#FFB800') || adminCss.includes('--stitch-primary'), 'admin.css define amarillo competición Stitch (#FFB800)');
assert(adminCss.includes('backdrop-filter: blur'), 'admin.css implementa superficies cristal con backdrop-filter');

// 3. INTEGRIDAD DE IDS Y FUNCIONALIDAD DE COMISARÍA
console.log('\n3. VERIFICACIÓN DE ELEMENTOS TÉCNICOS Y FUNCIONALES EN ADMIN.HTML:');
const requiredIds = [
  'form-admin-login',
  'login-email',
  'login-pass',
  'btn-login-submit',
  'admin-nav-user',
  'admin-user-email',
  'view-login',
  'view-dashboard',
  'tab-btn-submissions',
  'tab-btn-leaderboard',
  'tab-btn-championship',
  'tab-btn-challenges',
  'tab-btn-seasons',
  'tab-btn-migration',
  'sec-submissions',
  'sec-leaderboard',
  'sec-migration',
  'sec-seasons',
  'sec-championship',
  'sec-challenges',
  'modal-lb-entry',
  'admin-video-modal',
  'modal-assign-slot',
  'modal-register-new-champ-pilot'
];

requiredIds.forEach(id => {
  assert(adminHtml.includes(`id="${id}"`), `Elemento técnico id="${id}" preservado intacto`);
});

// 4. DEPENDENCIAS JS VINCULADAS
console.log('\n4. VERIFICACIÓN DE SCRIPTS DE SOPORTE:');
assert(adminHtml.includes('routes-data.js'), 'routes-data.js referenciado');
assert(adminHtml.includes('seasons-data.js'), 'seasons-data.js referenciado');
assert(adminHtml.includes('blacklist-data.js'), 'blacklist-data.js referenciado');
assert(adminHtml.includes('hardware-icons.js'), 'hardware-icons.js referenciado');
assert(adminHtml.includes('firebase-config.js'), 'firebase-config.js referenciado');
assert(adminHtml.includes('discord-notifier.js'), 'discord-notifier.js referenciado');
assert(adminHtml.includes('admin.js'), 'admin.js referenciado');

console.log(`\n================================================================`);
console.log(`RESULTADO DE LA SUITE: ${passedTests} PASARON / ${totalTests - passedTests} FALLARON`);
console.log(`================================================================`);
if (passedTests === totalTests) {
  console.log('\n🎉 TODOS LOS CAMBIOS DE LA INSTRUCCIÓN 1 HAN SIDO VALIDADOS EXITOSAMENTE');
} else {
  process.exit(1);
}
