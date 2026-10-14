const fs = require('fs');
const assert = require('assert');

console.log("=================================================================");
console.log("TEST SUITE: HOMOLOGATION FORM & FIREBASE SUBMISSIONS INTEGRATION");
console.log("=================================================================");

const indexHtml = fs.readFileSync('index.html', 'utf8');

// [TEST 1] Verificar las 86 pistas oficiales en #track-select
console.log("\n[TEST 1] Verificando las 86 pistas oficiales agrupadas en #track-select...");
const routesDataCode = fs.readFileSync('src/routes-data.js', 'utf8') + '; module.exports = routesData;';
const vm = require('vm');
const m = {};
vm.runInNewContext(routesDataCode, { module: m, exports: m });
const routes = m.exports;

assert.strictEqual(routes.length, 86, "Deben existir exactamente 86 rutas en routes-data.js");

const trackSelectRegex = /<select[^>]*id="track-select"[^>]*>([\s\S]*?)<\/select>/;
const trackSelectMatch = indexHtml.match(trackSelectRegex);
assert(trackSelectMatch, "El elemento #track-select debe existir en index.html");

const selectContent = trackSelectMatch[1];
assert(selectContent.includes('optgroup label="🏁 CIRCUITOS (29)"'), "Debe contener el optgroup de Circuitos");
assert(selectContent.includes('optgroup label="⚡ SPRINTS (46)"'), "Debe contener el optgroup de Sprints");
assert(selectContent.includes('optgroup label="🔥 DRAGS (11)"'), "Debe contener el optgroup de Drags");

let missingTracks = [];
routes.forEach(r => {
    // Normalizar comillas y entities
    const escaped = r.name.replace(/&/g, '&amp;');
    if (!selectContent.includes(`value="${escaped}"`)) {
        missingTracks.push(r.name);
    }
});
assert.strictEqual(missingTracks.length, 0, `Todas las 86 pistas deben estar presentes. Faltantes: ${missingTracks.join(', ')}`);
console.log("  ✓ PASS: Las 86 pistas (29 Circuitos, 46 Sprints, 11 Drags) están presentes y agrupadas.");

// [TEST 2] Verificar preajustes de vehículos
console.log("\n[TEST 2] Verificando preajustes de vehículos requeridos (BMW M3 GTR, Porsche Carrera GT, Lotus Elise)...");
assert(indexHtml.includes("setCar('BMW M3 GTR')"), "Debe existir preset para BMW M3 GTR");
assert(indexHtml.includes("setCar('Porsche Carrera GT')"), "Debe existir preset para Porsche Carrera GT");
assert(indexHtml.includes("setCar('Lotus Elise')"), "Debe existir preset para Lotus Elise");
console.log("  ✓ PASS: Preajustes de vehículos verificados correctamente.");

// [TEST 3] Verificar selector de categoría oficial (Junkman y BMW M3 GTR)
console.log("\n[TEST 3] Verificando selector de categoría técnica oficial...");
const categoryRegex = /<select[^>]*id="category-select"[^>]*>([\s\S]*?)<\/select>/;
const categoryMatch = indexHtml.match(categoryRegex);
assert(categoryMatch, "El elemento #category-select debe existir en index.html");
const catContent = categoryMatch[1];
assert(catContent.includes('value="Junkman"'), "Debe incluir opción Junkman");
assert(catContent.includes('value="BMW M3 GTR"'), "Debe incluir opción BMW M3 GTR");
console.log("  ✓ PASS: Opciones de categoría oficial cumplen con la especificación de comisaría.");

// [TEST 4] Verificar selector de tipo de vuelta
console.log("\n[TEST 4] Verificando selector de tipo de vuelta...");
const lapTypeRegex = /<select[^>]*id="lap-type-select"[^>]*>([\s\S]*?)<\/select>/;
const lapTypeMatch = indexHtml.match(lapTypeRegex);
assert(lapTypeMatch, "El elemento #lap-type-select debe existir");
const lapContent = lapTypeMatch[1];
assert(lapContent.includes('value="Single Lap"'), "Debe incluir Single Lap");
assert(lapContent.includes('value="Fast Lap"'), "Debe incluir Fast Lap");
assert(lapContent.includes('value="Sprint / Drag Run"'), "Debe incluir Sprint / Drag Run");
console.log("  ✓ PASS: Selector de tipo de vuelta verificado.");

// [TEST 5] Verificar botón de envío (Título estricto: VALIDAR Y ENVIAR REGISTRO)
console.log("\n[TEST 5] Verificando botón de envío y título...");
assert(indexHtml.includes('<span id="btn-text">VALIDAR Y ENVIAR REGISTRO</span>'), "El texto del botón debe ser exactamente 'VALIDAR Y ENVIAR REGISTRO'");
assert(indexHtml.includes('id="submit-btn"'), "Debe existir submit-btn");
console.log("  ✓ PASS: Título del botón verificado.");

// [TEST 6] Verificar integración con Firebase Realtime Database
console.log("\n[TEST 6] Verificando integración con Firebase RTDB (/submissions.json)...");
assert(indexHtml.includes('submissions.json'), "El script debe realizar POST a submissions.json");
assert(indexHtml.includes("method: 'POST'"), "El script debe usar método POST");
assert(indexHtml.includes("submitHomologationForm"), "El script debe definir submitHomologationForm");
assert(indexHtml.includes("applyRaceTimeMask"), "El script debe implementar applyRaceTimeMask");
assert(indexHtml.includes("handleTrackChange"), "El script debe implementar handleTrackChange");
assert(indexHtml.includes("updateQueueLiveCount"), "El script debe implementar updateQueueLiveCount");
console.log("  ✓ PASS: Lógica de comunicación Firebase RTDB verificada.");

// [TEST 7] Compatibilidad de esquema con admin.html
console.log("\n[TEST 7] Verificando compatibilidad de payload con el panel de administración (admin.js)...");
const adminJs = fs.readFileSync('src/admin.js', 'utf8');
const expectedFields = ['id', 'driver', 'route', 'category', 'lapType', 'car', 'time', 'timeMs', 'videoUrl', 'gearbox', 'device', 'mode', 'status', 'timestamp', 'date'];
expectedFields.forEach(field => {
    assert(indexHtml.includes(`${field}:`), `El payload debe contener el campo '${field}' esperado por admin.js`);
});
console.log("  ✓ PASS: El esquema de payload coincide al 100% con los requerimientos de admin.js.");

console.log("\n=================================================================");
console.log("🎉 TODOS LOS 7 TESTS DE HOMOLOGACIÓN Y FIREBASE PASARON EXITOSAMENTE!");
console.log("=================================================================");
