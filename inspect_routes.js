const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const views = html.match(/id="view-[^"]+"/g);
console.log('Views found:', views);

const start = html.indexOf('id="view-routes-pistas"');
if (start !== -1) {
  console.log('\n--- view-routes-pistas preview (next 1200 chars) ---');
  console.log(html.substring(start, start + 1200));
}
