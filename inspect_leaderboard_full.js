const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('id="view-leaderboard"');
const end = html.indexOf('id="view-routes-pistas"');
const lbHtml = html.substring(start, end);

console.log('--- HEADERS & BREADCRUMBS IN LEADERBOARD ---');
const headers = lbHtml.match(/<(h1|h2|h3|h4|span|div)[^>]*id="[^"]*"[^>]*>/gi);
console.log(headers);

console.log('\n--- ALL ID ATTRIBUTES IN LEADERBOARD ---');
const ids = lbHtml.match(/id="([^"]+)"/gi);
console.log(ids);

console.log('\n--- ALL DATA ATTRIBUTES IN LEADERBOARD ---');
const dataAttrs = lbHtml.match(/data-[a-z0-9_-]+="[^"]*"/gi);
console.log(dataAttrs);
