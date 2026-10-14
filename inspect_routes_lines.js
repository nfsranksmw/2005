const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const s1 = html.indexOf('<!-- 1. HERO / CONTEXT BANNER -->');
const s2 = html.indexOf('<!-- 2. CONTROL & FILTER BAR -->');
const s3 = html.indexOf('<!-- 3. FEATURED / HOT ROUTE SPOTLIGHT -->');
const s4 = html.indexOf('<!-- 4. ROUTES GRID (HIGH-FIDELITY TRACK CARDS) -->');

function lineOf(pos) {
  return html.substring(0, pos).split('\n').length;
}

console.log('Section 1 starts at line:', lineOf(s1));
console.log('Section 2 starts at line:', lineOf(s2));
console.log('Section 3 starts at line:', lineOf(s3));
console.log('Section 4 starts at line:', lineOf(s4));
