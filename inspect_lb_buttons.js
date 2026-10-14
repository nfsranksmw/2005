const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('id="view-leaderboard"');
const end = html.indexOf('id="view-routes-pistas"');
const lbHtml = html.substring(start, end);

const buttons = lbHtml.match(/<(button|a)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
console.log('Buttons/tabs inside view-leaderboard (count: ' + buttons.length + '):');
buttons.forEach(b => {
  const t = b.replace(/<[^>]*>/g, '').trim();
  if (t) console.log('  -', t.replace(/\n/g, ' '));
});
