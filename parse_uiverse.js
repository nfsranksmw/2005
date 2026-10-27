const fs = require('fs');

function extractCode(filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const nextDataMatch = content.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (nextDataMatch) {
    try {
      const data = JSON.parse(nextDataMatch[1]);
      console.log('=== ' + filename + ' ===');
      const pageProps = data.props && data.props.pageProps;
      // Search recursively for html and css keys
      function findHtmlCss(obj, depth = 0) {
        if (!obj || depth > 5) return;
        if (obj.html && obj.css) {
          console.log('FOUND HTML:\n' + obj.html);
          console.log('FOUND CSS:\n' + obj.css);
          return true;
        }
        for (const k of Object.keys(obj)) {
          if (typeof obj[k] === 'object') {
            if (findHtmlCss(obj[k], depth + 1)) return true;
          }
        }
      }
      findHtmlCss(pageProps);
    } catch (e) {
      console.log('Error parsing JSON:', e);
    }
  } else {
    console.log('No NEXT_DATA in ' + filename);
  }
}

extractCode('uiverse_card.html');
extractCode('uiverse_btn.html');
