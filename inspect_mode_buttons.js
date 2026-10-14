const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const searches = ['CIRCUITOS (29)', 'CIRCUITOS</button>', 'data-mode="circuit"'];
searches.forEach(s => {
  let idx = 0;
  while ((idx = html.indexOf(s, idx)) !== -1) {
    const secIdx = html.lastIndexOf('id="view-', idx);
    const secName = secIdx !== -1 ? html.substring(secIdx, html.indexOf('"', secIdx + 9)) : 'none';
    console.log(`"${s}" found at ${idx} inside ${secName}`);
    console.log(html.substring(Math.max(0, idx - 200), Math.min(html.length, idx + 400)));
    console.log('----------------------------------------------------');
    idx += s.length;
  }
});
