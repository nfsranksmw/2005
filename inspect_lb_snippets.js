const fs = require('fs');
const html = fs.readFileSync('stitch_nfs_mw_ranks_v7/nfsmw_ranks_leaderboard_de_ruta_city_perimeter/code.html', 'utf8');

const t = html.indexOf('CITY PERIMETER');
console.log('City perimeter occurrences:');
let pos = 0;
while ((pos = html.indexOf('CITY PERIMETER', pos)) !== -1) {
  console.log('At pos', pos, ':', html.substring(pos - 40, pos + 60).replace(/\n/g, ' '));
  pos += 14;
}

const tbody = html.indexOf('<tbody');
console.log('\nTbody snippet:');
console.log(html.substring(tbody - 30, tbody + 100));

const catTabs = html.indexOf('JUNKMAN (SINGLE LAP)');
console.log('\nCat tabs snippet:');
console.log(html.substring(catTabs - 150, catTabs + 200).replace(/\n/g, ' '));
