const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('id="view-routes-pistas"');
const end = html.indexOf('id="view-blacklist"');
console.log('Routes section start:', start, 'end:', end);

const routesHtml = html.substring(start, end !== -1 ? end : start + 40000);

// Find major section comments and headers
const regex = /(<!--[\s\S]*?-->|<(?:section|header|h1|h2|h3|h4)[^>]*>)/g;
let match;
while ((match = regex.exec(routesHtml)) !== null) {
  const line = match[0].replace(/\n/g, ' ').trim();
  if (line.startsWith('<!--') && line.length < 90) {
    console.log('[COMMENT]', line);
  } else if (!line.startsWith('<!--') && line.length < 120) {
    console.log('[TAG]', line);
  }
}
