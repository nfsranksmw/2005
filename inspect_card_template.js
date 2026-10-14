const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('<!-- CARD 1: Heritage & Hastings -->');
const end = html.indexOf('<!-- CARD 2:', start);

console.log('=== CARD 1 TEMPLATE ===');
console.log(html.substring(start, end));
