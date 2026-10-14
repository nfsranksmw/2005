const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('id="view-leaderboard"');
console.log('=== TOP OF VIEW-LEADERBOARD ===');
console.log(html.substring(start, start + 2500));
