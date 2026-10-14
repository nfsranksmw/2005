const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('<!-- ROW 1: WORLD RECORD -->');
const end = html.indexOf('<!-- ROW 2', start);

console.log('=== ROW 1 FULL HTML ===');
console.log(html.substring(start, end));

const theadIdx = html.indexOf('<thead', html.indexOf('id="view-leaderboard"'));
const theadEnd = html.indexOf('</thead>', theadIdx);
console.log('=== THEAD COLUMNS ===');
console.log(html.substring(theadIdx, theadEnd + 8));
