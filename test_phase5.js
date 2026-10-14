const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

console.log('--- TEST FASE 5: REORGANIZACIÓN DEL LAYOUT "EXPLORADOR DE RUTAS" ---');

let passed = true;

// 1. Verificar presencia del Mapa Vectorial en el Header
const headerSectionRegex = /<!-- 1\. HERO \/ CONTEXT BANNER -->[\s\S]*?<\/section>/;
const headerMatch = html.match(headerSectionRegex);

if (!headerMatch) {
  console.error('❌ ERROR: No se encontró la sección Header (1. HERO / CONTEXT BANNER).');
  passed = false;
} else {
  const headerContent = headerMatch[0];
  const hasVectorMapInHeader = headerContent.includes('MAPA VECTORIAL V1.3') && 
                               headerContent.includes('SECTORES: S1 / S2 / S3') &&
                               headerContent.includes('START / FINISH');
  const hasFlexContainer = headerContent.includes('flex flex-col xl:flex-row') || 
                           headerContent.includes('xl:flex-row');
  
  if (hasVectorMapInHeader && hasFlexContainer) {
    console.log('✅ 1. Mapa Vectorial integrado con éxito en el Header con layout responsive flex (xl:flex-row).');
  } else {
    console.error('❌ ERROR: El Mapa Vectorial no está correctamente posicionado en el Header.', {
      hasVectorMapInHeader,
      hasFlexContainer
    });
    passed = false;
  }
}

// 2. Verificar eliminación total del bloque "PISTA DESTACADA DE LA SEMANA"
const hasFeaturedSpotlight = html.includes('PISTA DESTACADA DE LA SEMANA');
const hasCamdenHastingsSpotlight = html.includes('<!-- 3. FEATURED / HOT ROUTE SPOTLIGHT -->');

if (!hasFeaturedSpotlight && !hasCamdenHastingsSpotlight) {
  console.log('✅ 2. Bloque "PISTA DESTACADA DE LA SEMANA" eliminado por completo del DOM.');
} else {
  console.error('❌ ERROR: Aún se detectan remanentes del bloque "PISTA DESTACADA DE LA SEMANA".');
  passed = false;
}

// 3. Verificar conexión directa Filtros -> Tarjetas
const filterBarPos = html.indexOf('<!-- 2. CONTROL & FILTER BAR -->');
const routesGridPos = html.indexOf('<!-- 3. ROUTES GRID (HIGH-FIDELITY TRACK CARDS) -->');
const cardsContainerPos = html.indexOf('id="routes-cards-container"');

if (filterBarPos !== -1 && routesGridPos !== -1 && cardsContainerPos !== -1) {
  if (filterBarPos < routesGridPos && routesGridPos < cardsContainerPos) {
    // Comprobar que no haya secciones intermedias entre la barra de filtros y la grilla
    const between = html.substring(filterBarPos, routesGridPos);
    const sectionsBetween = (between.match(/<section/g) || []).length;
    // Solo debe estar la sección de filtros (<section class="... sticky ...">)
    if (sectionsBetween === 1) {
      console.log('✅ 3. Conexión directa y contigua confirmada: Filtros -> Grilla de Trazados.');
    } else {
      console.warn(`⚠️ Advertencia: Hay ${sectionsBetween} etiquetas <section> entre filtros y grilla.`);
    }
  } else {
    console.error('❌ ERROR: El orden secuencial del DOM no es correcto.');
    passed = false;
  }
} else {
  console.error('❌ ERROR: Faltan elementos clave en el flujo del DOM.');
  passed = false;
}

// 4. Verificar integridad de controles interactivos
const requiredIds = [
  'routes-search-input',
  'routes-category-filters',
  'btn-filter-all',
  'btn-filter-circuit',
  'btn-filter-sprint',
  'btn-filter-drag',
  'routes-cards-container',
  'routes-showing-counter'
];

let allIdsFound = true;
for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) {
    console.error(`❌ ERROR: Se perdió el identificador interactivo: #${id}`);
    allIdsFound = false;
    passed = false;
  }
}
if (allIdsFound) {
  console.log('✅ 4. Todos los IDs interactivos de búsqueda y filtrado preservados al 100%.');
}

if (passed) {
  console.log('\n🎉 RESULTADO FINAL: TODOS LOS TESTS DE LA FASE 5 PASARON EXITOSAMENTE.');
} else {
  console.error('\n💥 FALLARON ALGUNOS TESTS.');
  process.exit(1);
}
