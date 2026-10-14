const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('id="view-leaderboard"');
const end = html.indexOf('<tbody>', start);
const topPart = html.substring(start, end);

const buttons = topPart.match(/<(button|a)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
console.log('Buttons/tabs in leaderboard top part:');
buttons.forEach(b => {
  const t = b.replace(/<[^>]*>/g, '').trim();
  if (t) console.log('Button:', t.replace(/\n/g, ' '));
});
