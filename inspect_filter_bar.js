const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('<!-- 2. CONTROL & FILTER BAR -->');
const end = html.indexOf('<!-- 3. FEATURED / HOT ROUTE SPOTLIGHT -->');

console.log('=== SECTION 2: CONTROL & FILTER BAR ===');
console.log(html.substring(start, end));
