const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sec1Start = html.indexOf('<!-- 1. HERO / CONTEXT BANNER -->');
const sec2Start = html.indexOf('<!-- 2. CONTROL & FILTER BAR -->');
const sec3Start = html.indexOf('<!-- 3. FEATURED / HOT ROUTE SPOTLIGHT -->');
const sec4Start = html.indexOf('<!-- 4. ROUTES GRID (HIGH-FIDELITY TRACK CARDS) -->');

console.log('=== SECTION 1 (HERO) ===');
console.log(html.substring(sec1Start, sec2Start));

console.log('=== SECTION 3 (FEATURED SPOTLIGHT & VECTOR MAP) ===');
console.log(html.substring(sec3Start, sec4Start));
