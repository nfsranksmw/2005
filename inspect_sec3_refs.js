const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('src/app.js', 'utf8');

const sec3Start = html.indexOf('<!-- 3. FEATURED / HOT ROUTE SPOTLIGHT -->');
const sec4Start = html.indexOf('<!-- 4. ROUTES GRID (HIGH-FIDELITY TRACK CARDS) -->');
const sec3Html = html.substring(sec3Start, sec4Start);

const ids = sec3Html.match(/id="([^"]+)"/g) || [];
console.log('IDs in Section 3:', ids);
ids.forEach(idAttr => {
  const id = idAttr.replace(/id="|"/g, '');
  if (appJs.includes(id)) {
    console.log('WARNING: app.js references ID:', id);
  }
});

const dataAttrs = sec3Html.match(/data-[a-z0-9_-]+="[^"]*"/g) || [];
console.log('Data attributes in Section 3:', dataAttrs);
dataAttrs.forEach(d => {
  if (appJs.includes(d)) {
    console.log('WARNING: app.js references data attr:', d);
  }
});
