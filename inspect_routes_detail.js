const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('id="view-routes-pistas"');
const end = html.indexOf('<!-- VIEW SECTION:', start + 20);
const routesHtml = html.substring(start, end !== -1 ? end : start + 30000);

console.log('=== SEARCHING FILTER BUTTONS IN ROUTES ===');
const buttons = routesHtml.match(/<(button|a)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
buttons.forEach(b => {
  const text = b.replace(/<[^>]*>/g, '').trim();
  if (text.includes('Circuit') || text.includes('Sprint') || text.includes('Drag') || text.includes('Todos') || text.includes('All')) {
    console.log('Filter button candidate:', b);
  }
});

console.log('\n=== SEARCHING CARDS CONTAINER ===');
// Look for articles or cards grid
const articles = routesHtml.match(/<article[\s\S]*?<\/article>/gi) || [];
console.log('Found articles (route cards):', articles.length);
if (articles.length > 0) {
  console.log('\n--- FIRST ARTICLE SAMPLE ---');
  console.log(articles[0].substring(0, 800));
}

// Find grid container
const gridMatch = routesHtml.match(/<div class="[^"]*grid[^"]*"[^>]*>/gi);
console.log('\nGrid containers:', gridMatch);
