const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const appJsPath = path.join(__dirname, 'src', 'app.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const appJs = fs.readFileSync(appJsPath, 'utf8');

console.log('================================================================');
console.log('TEST SUITE: INSTRUCCIÓN 2 - REORGANIZACIÓN NAVBAR Y COMUNIDAD');
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

// 1. HALL DE LA FAMA EN MENÚ PRINCIPAL
console.log('1. VERIFICACIÓN DE HALL DE LA FAMA EN MENÚ PRINCIPAL:');
const hallOfFameMainMatch = html.match(/<a\s+[^>]*id="nav-halloffame"[^>]*>([\s\S]*?)<\/a>/);
assert(!!hallOfFameMainMatch, 'Enlace #nav-halloffame presente en el menú principal');
if (hallOfFameMainMatch) {
  const text = hallOfFameMainMatch[1].trim();
  assert(text.includes('HALL DE LA FAMA'), `Texto correcto: "${text}"`);
  assert(hallOfFameMainMatch[0].includes('data-target="halloffame"'), 'data-target="halloffame" configurado');
  assert(hallOfFameMainMatch[0].includes('href="#halloffame"'), 'href="#halloffame" configurado');
}

// 2. VERIFICACIÓN DE DROPDOWN COMUNIDAD LIMPIO
console.log('\n2. VERIFICACIÓN DE DROPDOWN COMUNIDAD:');
const communityDropdownMatch = html.match(/<div\s+class="relative group">[\s\S]*?<a\s+[^>]*id="nav-community"[\s\S]*?<\/div>\s*<\/div>/);
assert(!!communityDropdownMatch, 'Dropdown de comunidad encontrado');

if (communityDropdownMatch) {
  const dropdownContent = communityDropdownMatch[0];
  
  // No debe contener Hall de la Fama
  assert(!dropdownContent.includes('href="#halloffame"'), 'Comunidad NO contiene enlace a #halloffame (movido a menú principal)');
  
  // No debe contener Desafíos & Retos
  assert(!dropdownContent.includes('href="#challenges"'), 'Comunidad NO contiene enlace a #challenges (eliminado por redundancia)');
  
  // No debe contener Tactical Cockpit
  assert(!dropdownContent.includes('href="#cockpit"'), 'Comunidad NO contiene enlace a #cockpit (eliminado por redundancia)');

  // Debe contener los 5 enlaces legítimos de comunidad
  assert(dropdownContent.includes('href="#guides"'), 'Comunidad contiene Guías de Tuning');
  assert(dropdownContent.includes('href="#rules"'), 'Comunidad contiene Reglamento Oficial');
  assert(dropdownContent.includes('href="#map"'), 'Comunidad contiene Mapa Táctico');
  assert(dropdownContent.includes('href="#download"'), 'Comunidad contiene Centro de Descargas');
  assert(dropdownContent.includes('href="#submit"'), 'Comunidad contiene Subir Registro');
}

// 3. VERIFICACIÓN DE ENRUTAMIENTO EN SRC/APP.JS
console.log('\n3. VERIFICACIÓN DE ENRUTADOR EN SRC/APP.JS:');
assert(appJs.includes("'halloffame': 'nav-halloffame'"), "NAV_PARENT_MAP asocia halloffame con 'nav-halloffame'");
assert(appJs.includes("'ranking': 'halloffame'"), "VIEW_MAP registra 'ranking' apuntando a halloffame");
assert(appJs.includes("'hall-de-la-fama': 'halloffame'"), "VIEW_MAP registra 'hall-de-la-fama' apuntando a halloffame");

console.log(`\n================================================================`);
console.log(`RESULTADO DE LA SUITE: ${passedTests} PASARON / ${totalTests - passedTests} FALLARON`);
console.log(`================================================================`);
if (passedTests === totalTests) {
  console.log('\n🎉 TODOS LOS CAMBIOS DE LA INSTRUCCIÓN 2 HAN SIDO VALIDADOS EXITOSAMENTE');
} else {
  process.exit(1);
}
