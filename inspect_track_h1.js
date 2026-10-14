const fs = require('fs');
const html = fs.readFileSync('stitch_nfs_mw_ranks_v7/nfsmw_ranks_leaderboard_de_ruta_city_perimeter/code.html', 'utf8');
const p = html.indexOf('to-secondary-container">CITY PERIMETER');
console.log('Snippet:');
console.log(html.substring(p - 100, p + 100));
