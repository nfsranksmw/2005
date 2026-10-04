const fs = require('fs');
const path = require('path');

const files = ['index.html', 'assets/js/app.js', 'assets/js/i18n.js'];
const terms = ['satelital', 'verificado', 'flecha', 'descarga', 'ubicación', 'ubicacion'];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    terms.forEach(t => {
      if (line.toLowerCase().includes(t)) {
        console.log(`${file}:${i+1} [${t}] -> ${line.trim().slice(0, 120)}`);
      }
    });
  });
});
