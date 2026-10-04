const fs = require('fs');

global.window = { NFS_GLOBAL_LEADERBOARDS_CACHE: null };

// Load routesData
let routesDataCode = fs.readFileSync('assets/js/routes-data.js', 'utf8');
routesDataCode = routesDataCode.replace('const routesData =', 'global.routesData =');
eval(routesDataCode);

function sanitizeFirebaseKey(str) {
    return String(str || '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9_-]/g, '_')
        .replace(/[.#$[\]]/g, '_');
}

// Read app.js and extract STITCH_VERIFIED_TRACK_RECORDS and getStitchRouteWRData and getRouteCategoryNumber
let appCode = fs.readFileSync('assets/js/app.js', 'utf8');

const numStart = appCode.indexOf('function getRouteCategoryNumber(');
const numEnd = appCode.indexOf('// Mapa de Distritos y Metadatos para los 86 Trazados');
eval(appCode.slice(numStart, numEnd));

const recStart = appCode.indexOf('const STITCH_VERIFIED_TRACK_RECORDS = {');
const recEnd = appCode.indexOf('function initStitchTelemetryHub()');
eval(appCode.slice(recStart, recEnd));

console.log('--- TESTING NUMERICAL CATEGORY NUMBERS ---');
const circuits = global.routesData.filter(r => r.type === 'Circuito');
const sprints = global.routesData.filter(r => r.type === 'Sprint');
const drags = global.routesData.filter(r => r.type === 'Drag');

console.log('Circuits count:', circuits.length, 'First:', circuits[0].name, '(#', getRouteCategoryNumber(circuits[0]), ') Last:', circuits[circuits.length-1].name, '(#', getRouteCategoryNumber(circuits[circuits.length-1]), ')');
console.log('Sprints count:', sprints.length, 'First:', sprints[0].name, '(#', getRouteCategoryNumber(sprints[0]), ') Last:', sprints[sprints.length-1].name, '(#', getRouteCategoryNumber(sprints[sprints.length-1]), ')');
console.log('Drags count:', drags.length, 'First:', drags[0].name, '(#', getRouteCategoryNumber(drags[0]), ') Last:', drags[drags.length-1].name, '(#', getRouteCategoryNumber(drags[drags.length-1]), ')');

console.log('\n--- TESTING WR DATA FOR KEY TRACKS ---');
const testTracks = ['City Perimeter', 'Ironwood States', 'Campus Way', 'Highlands', 'Petersburgs', 'Seaside & Power Station', 'NFS World Loop', 'Bayshore & Boardwalk', 'Seaside & Camden'];
testTracks.forEach(tName => {
    const route = global.routesData.find(r => r.name.toLowerCase() === tName.toLowerCase());
    const wr = getStitchRouteWRData(route);
    const num = getRouteCategoryNumber(route);
    console.log(`${route.type} #${num} ${route.name} -> Driver: ${wr.driver} | Time: ${wr.time} | Car: ${wr.car}`);
});

console.log('\n--- CHECKING DUMMY NAMES IN ALL 86 TRACKS ---');
let dummyCount = 0;
global.routesData.forEach(r => {
    const wr = getStitchRouteWRData(r);
    if (wr.driver.includes('ViperKing') || wr.driver.includes('ApexPredator') || wr.driver.includes('SpeedHunter') || wr.driver.includes('RazorBlade') || wr.driver.includes('RockportKing')) {
        console.log('Found dummy:', r.name, wr.driver);
        dummyCount++;
    }
});
console.log('Total dummy drivers found in 86 routes:', dummyCount);

console.log('\n--- VERIFYING STRICT NUMERICAL SEQUENCES ---');
let circuitSeqOk = true;
circuits.forEach((r, idx) => {
    if (getRouteCategoryNumber(r) !== idx + 1) circuitSeqOk = false;
});
let sprintSeqOk = true;
sprints.forEach((r, idx) => {
    if (getRouteCategoryNumber(r) !== idx + 1) sprintSeqOk = false;
});
let dragSeqOk = true;
drags.forEach((r, idx) => {
    if (getRouteCategoryNumber(r) !== idx + 1) dragSeqOk = false;
});

console.log('Circuits sequence 1..29 exact:', circuitSeqOk);
console.log('Sprints sequence 1..46 exact:', sprintSeqOk);
console.log('Drags sequence 1..11 exact:', dragSeqOk);
