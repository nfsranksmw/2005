const fs = require('fs');
let code = fs.readFileSync('assets/js/routes-data.js', 'utf8');
code = code.replace('const routesData =', 'global.routesData =');
eval(code);

function sanitizeKey(str) {
    return String(str || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_-]/g, '_').replace(/[.#$[\]]/g, '_');
}

fetch('https://nfsranks-blacklist-default-rtdb.firebaseio.com/leaderboards.json')
  .then(r => r.json())
  .then(data => {
    console.log("=== FIRST 10 CIRCUITS ===");
    global.routesData.filter(r => r.type === 'Circuito').slice(0, 10).forEach((r, idx) => {
      const k = sanitizeKey(r.name);
      const catKey = 'junkman_single';
      const catData = data[k] ? data[k][catKey] : null;
      let top = null;
      if (Array.isArray(catData) && catData.length > 0) top = catData[0];
      else if (catData && typeof catData === 'object') top = Object.values(catData)[0];
      console.log(`Circuito ${idx + 1}: ${r.name} -> Top: ${top ? top.driver + ' (' + top.time + ' | ' + top.car + ')' : 'None'}`);
    });

    console.log("\n=== FIRST 5 SPRINTS ===");
    global.routesData.filter(r => r.type === 'Sprint').slice(0, 5).forEach((r, idx) => {
      const k = sanitizeKey(r.name);
      const catKey = 'junkman';
      const catData = data[k] ? data[k][catKey] : null;
      let top = null;
      if (Array.isArray(catData) && catData.length > 0) top = catData[0];
      else if (catData && typeof catData === 'object') top = Object.values(catData)[0];
      console.log(`Sprint ${idx + 1}: ${r.name} -> Top: ${top ? top.driver + ' (' + top.time + ' | ' + top.car + ')' : 'None'}`);
    });

    console.log("\n=== FIRST 5 DRAGS ===");
    global.routesData.filter(r => r.type === 'Drag').slice(0, 5).forEach((r, idx) => {
      const k = sanitizeKey(r.name);
      const catKey = 'junkman';
      const catData = data[k] ? data[k][catKey] : null;
      let top = null;
      if (Array.isArray(catData) && catData.length > 0) top = catData[0];
      else if (catData && typeof catData === 'object') top = Object.values(catData)[0];
      console.log(`Drag ${idx + 1}: ${r.name} -> Top: ${top ? top.driver + ' (' + top.time + ' | ' + top.car + ')' : 'None'}`);
    });
  });
