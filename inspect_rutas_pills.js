const fs = require('fs');
const html = fs.readFileSync('stitch_nfs_mw_ranks_v7/nfsmw_ranks_redise_o_de_rutas/code.html', 'utf8');

const p = html.indexOf('<!-- Category Pills -->');
console.log('Category pills snippet:');
console.log(html.substring(p, p + 900));

const g = html.indexOf('grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3');
console.log('Grid snippet:');
console.log(html.substring(g - 30, g + 80));
