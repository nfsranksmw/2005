const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const appJsPath = path.join(__dirname, 'src', 'app.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const appJs = fs.readFileSync(appJsPath, 'utf8');

console.log('================================================================');
console.log('TEST SUITE: FASE 6 - MIGRACIÓN DE DROPDOWNS Y REORGANIZACIÓN NAVBAR');
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

// -----------------------------------------------------------------------------
// 1. REORGANIZACIÓN DEL MENÚ PRINCIPAL
// -----------------------------------------------------------------------------
console.log('1. VERIFICACIÓN DE REORGANIZACIÓN DEL MENÚ PRINCIPAL:');

// Extraer el bloque del nav #main-nav
const mainNavMatch = html.match(/<nav\s+id="main-nav"[\s\S]*?<\/nav>/);
assert(!!mainNavMatch, 'Elemento <nav id="main-nav"> presente en el documento');

if (mainNavMatch) {
  const mainNavContent = mainNavMatch[0];

  // Botón Home como primer elemento
  const firstAnchorMatch = mainNavContent.match(/<a\s+[^>]*id="nav-home"[^>]*>([\s\S]*?)<\/a>/);
  assert(!!firstAnchorMatch, 'Botón #nav-home presente');
  if (firstAnchorMatch) {
    const homeText = firstAnchorMatch[1].trim();
    assert(homeText.includes('HOME'), `Botón Home etiquetado correctamente ("${homeText}")`);
    assert(firstAnchorMatch[0].includes('aria-current="page"'), 'Botón Home marcado con aria-current="page" activo');
  }

  // Comprobar posición de Home como primer enlace directo dentro de #main-nav
  const allAnchors = [...mainNavContent.matchAll(/<a\s+[^>]*id="([^"]+)"/g)].map(m => m[1]);
  assert(allAnchors[0] === 'nav-home', `El primer enlace en el menú es #nav-home (encontrado: #${allAnchors[0]})`);

  // Botón TABLAS DE CLASIFICACIÓN / RANKING oculto con la clase hidden
  const leaderboardMatch = mainNavContent.match(/<a\s+[^>]*id="nav-leaderboard"[^>]*>/);
  assert(!!leaderboardMatch, 'Elemento #nav-leaderboard preservado en el DOM');
  if (leaderboardMatch) {
    const hasHidden = leaderboardMatch[0].includes('hidden');
    assert(hasHidden, 'Elemento #nav-leaderboard tiene la clase "hidden" para ocultarlo visualmente');
  }
}

// -----------------------------------------------------------------------------
// 2. CONSTRUCCIÓN DEL MENÚ DESPLEGABLE "CHALLENGES & TOURNAMENT"
// -----------------------------------------------------------------------------
console.log('\n2. VERIFICACIÓN DEL DROPDOWN "CHALLENGES & TOURNAMENT":');

const dropdownMatch = html.match(/<div[^>]*id="dropdown-challenges"[\s\S]*?<\/div>\s*<\/div>/);
assert(!!dropdownMatch, 'Contenedor #dropdown-challenges presente en el Navbar');

if (dropdownMatch) {
  const dropdownContent = dropdownMatch[0];

  // Botón padre
  const parentBtnMatch = dropdownContent.match(/<a\s+[^>]*id="nav-blacklist"[^>]*>([\s\S]*?)<\/a>/);
  assert(!!parentBtnMatch, 'Botón padre #nav-blacklist presente');
  if (parentBtnMatch) {
    assert(parentBtnMatch[1].includes('CHALLENGES &amp; TOURNAMENT') || parentBtnMatch[1].includes('CHALLENGES & TOURNAMENT'), 
      'Texto del botón padre es "CHALLENGES & TOURNAMENT"');
    assert(parentBtnMatch[1].includes('expand_more'), 'Icono expand_more presente en el botón padre');
  }

  // 7 Sub-enlaces requeridos
  const expectedSublinks = [
    { id: 'nav-challenges', text: 'Weekly Challenges', target: 'challenges' },
    { id: 'nav-blacklist-groups', text: 'Blacklist Groups &amp; Rivals', target: 'blacklist' },
    { id: 'nav-championship-standings', text: 'Championship Standings', target: 'championship-standings' },
    { id: 'nav-blacklist-cards', text: 'Driver Dossiers (1 - 15)', target: 'blacklist-cards' },
    { id: 'nav-championship-register', text: 'Tournament Registration', target: 'championship-register' },
    { id: 'nav-tutorial', text: 'Tournament Tutorial', target: 'tutorial' },
    { id: 'nav-past-tournaments', text: 'Past Tournaments (Challonge)', target: 'past-tournaments' }
  ];

  expectedSublinks.forEach(sub => {
    const linkFound = dropdownContent.includes(`id="${sub.id}"`);
    assert(linkFound, `Sub-enlace #${sub.id} presente en el dropdown`);

    if (linkFound) {
      const linkRegex = new RegExp(`<a\\s+[^>]*id="${sub.id}"[^>]*>([\\s\\S]*?)<\\/a>`);
      const linkMatch = dropdownContent.match(linkRegex);
      if (linkMatch) {
        const textOk = linkMatch[1].includes(sub.text) || linkMatch[1].includes(sub.text.replace('&amp;', '&'));
        assert(textOk, `  Texto correcto para #${sub.id}: "${sub.text}"`);
        const targetOk = linkMatch[0].includes(`data-target="${sub.target}"`);
        assert(targetOk, `  data-target configurado correctamente ("${sub.target}")`);
      }
    }
  });
}

// -----------------------------------------------------------------------------
// 3. FIDELIDAD DE ESTILOS PIXEL-PERFECT (ZERO TAMPERING)
// -----------------------------------------------------------------------------
console.log('\n3. VERIFICACIÓN DE ESTILOS PIXEL-PERFECT (ESTRUCTURA DE STITCH):');

if (dropdownMatch) {
  const dropdownContent = dropdownMatch[0];
  assert(dropdownContent.includes('bg-surface-container-high/95'), 'Usa color de superficie Stitch: bg-surface-container-high/95');
  assert(dropdownContent.includes('backdrop-blur-md'), 'Efecto de desenfoque aplicado: backdrop-blur-md');
  assert(dropdownContent.includes('shadow-2xl'), 'Sombra de elevación Stitch: shadow-2xl');
  assert(dropdownContent.includes('hover:bg-surface-container-highest'), 'Efecto hover en sub-enlaces: hover:bg-surface-container-highest');
  assert(dropdownContent.includes('material-symbols-outlined text-[18px] text-primary-container'), 
    'Iconos telemétricos consistentes: text-primary-container');
}

// Cero clases obsoletas del proyecto viejo en el dropdown
const oldClasses = ['nav-dropdown-content', 'nav-icon-svg', 'nav-dropdown-btn', 'btn-explored'];
oldClasses.forEach(cls => {
  assert(!html.includes(`class="${cls}"`) && !html.includes(`class=" ${cls}`), `Cero contaminación: No existe clase vieja "${cls}"`);
});

// -----------------------------------------------------------------------------
// 4. INTEGRACIÓN DE ENRUTAMIENTO (src/app.js)
// -----------------------------------------------------------------------------
console.log('\n4. VERIFICACIÓN DE INTEGRACIÓN EN ROUTER (src/app.js):');

const requiredRoutes = [
  'weekly-challenges',
  'blacklist-groups',
  'championship-standings',
  'blacklist-cards',
  'driver-dossiers',
  'tournament-registration',
  'championship-register',
  'tournament-tutorial',
  'tutorial',
  'past-tournaments',
  'challenges-tournament'
];

requiredRoutes.forEach(r => {
  assert(appJs.includes(`'${r}'`), `Ruta '${r}' registrada en VIEW_MAP de src/app.js`);
});

assert(appJs.includes(`'cockpit': 'nav-blacklist'`), 'NAV_PARENT_MAP asocia cockpit con nav-blacklist');
assert(appJs.includes(`'challenges': 'nav-blacklist'`), 'NAV_PARENT_MAP asocia challenges con nav-blacklist');
assert(appJs.includes(`link.classList.add('hidden')`), 'updateNavbarUI blinda la visibilidad oculta de nav-leaderboard');

// -----------------------------------------------------------------------------
// RESUMEN FINAL
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`RESULTADO DE LA SUITE: ${passedTests} PASARON / ${totalTests - passedTests} FALLARON`);
console.log('================================================================');

if (passedTests === totalTests) {
  console.log('\n🎉 TODAS LAS PRUEBAS DE LA FASE 6 HAN PASADO EXITOSAMENTE');
  process.exit(0);
} else {
  console.error('\n💥 ALGUNAS PRUEBAS FALLARON');
  process.exit(1);
}
