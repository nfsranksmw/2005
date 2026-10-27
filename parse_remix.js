const fs = require('fs');

function inspectRemix(filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const match = content.match(/window\.__remixContext\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
  if (match) {
    try {
      const data = JSON.parse(match[1]);
      console.log('=== ' + filename + ' REMIX DATA ===');
      function searchObj(obj, depth = 0) {
        if (!obj || depth > 8) return;
        if (typeof obj === 'object') {
          if (obj.html && obj.css) {
            console.log('--- FOUND HTML ---');
            console.log(obj.html);
            console.log('--- FOUND CSS ---');
            console.log(obj.css);
            return true;
          }
          for (const k of Object.keys(obj)) {
            if (searchObj(obj[k], depth + 1)) return true;
          }
        }
      }
      searchObj(data);
    } catch(e) {
      console.log('Error parsing remix JSON:', e.message);
    }
  } else {
    console.log('No remixContext in ' + filename);
  }
}

inspectRemix('uiverse_card.html');
inspectRemix('uiverse_btn.html');
