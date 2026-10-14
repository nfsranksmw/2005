const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('id="view-routes-pistas"');
const end = html.indexOf('<!-- VIEW SECTION:', start + 20);
const routesHtml = html.substring(start, end);

const sections = routesHtml.match(/<!--\s*\d+\.\s*[^>]+-->/gi) || [];
console.log('Sections in routes-pistas:', sections);

const searchIdx = routesHtml.indexOf('filter');
console.log('Occurrences of "filter":', routesHtml.match(/filter/gi)?.length);
const categoryIdx = routesHtml.indexOf('Circuito');
console.log('Occurrences of "Circuito":', routesHtml.match(/Circuito/gi)?.length);
const sprintIdx = routesHtml.indexOf('Sprint');
console.log('Occurrences of "Sprint":', routesHtml.match(/Sprint/gi)?.length);
const dragIdx = routesHtml.indexOf('Drag');
console.log('Occurrences of "Drag":', routesHtml.match(/Drag/gi)?.length);
