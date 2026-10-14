const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('id="view-routes-pistas"');
const gridIdx = html.indexOf('grid-cols-1 md:grid-cols-2 xl:grid-cols-3', start);

console.log('--- HTML BEFORE CARDS GRID ---');
console.log(html.substring(gridIdx - 1500, gridIdx + 100));
