const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('id="view-leaderboard"');
const end = html.indexOf('<!-- VIEW SECTION:', start + 20);
const lbHtml = html.substring(start, end !== -1 ? end : start + 30000);

console.log('=== SEARCHING LEADERBOARD ROWS ===');
const tbodyIdx = lbHtml.indexOf('<tbody');
if (tbodyIdx !== -1) {
  const tbodyEnd = lbHtml.indexOf('</tbody>', tbodyIdx);
  console.log('Tbody snippet:');
  console.log(lbHtml.substring(tbodyIdx, tbodyIdx + 1500));
} else {
  console.log('No tbody, searching table rows or items');
  const rows = lbHtml.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  console.log('Found tr count:', rows.length);
  if (rows.length > 0) {
    console.log('First TR:', rows[0]);
    if (rows.length > 1) console.log('Second TR:', rows[1]);
  }
}
