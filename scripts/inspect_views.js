const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

const viewRegex = /id="(view-[^"]+)"/g;
let match;
const views = [];

lines.forEach((line, idx) => {
    let m;
    while ((m = viewRegex.exec(line)) !== null) {
        views.push({ id: m[1], line: idx + 1 });
    }
});

console.log('Found views:');
views.forEach(v => console.log(`Line ${v.line}: #${v.id}`));
