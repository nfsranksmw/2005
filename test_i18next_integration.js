/**
 * Comprehensive Test Suite for i18next Integration:
 * 1. Validates that i18next and i18n scripts exist and initialize correctly.
 * 2. Validates that default language is English ('en') and secondary is Spanish ('es').
 * 3. Validates top-right dropdown in index.html.
 * 4. Validates translation of UI titles, headings, badges, and buttons.
 * 5. Validates STRICT PROTECTION: Official Route names and Driver names are NEVER translated.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=================================================================');
console.log('TEST SUITE: i18next INTERNATIONALIZATION (EN PRIMARY / ES SECONDARY)');
console.log('=================================================================\n');

// 1. Verify files exist
console.log('[TEST 1] Verifying core i18n files exist...');
assert(fs.existsSync(path.join(__dirname, 'assets', 'vendor', 'i18next.min.js')), 'assets/vendor/i18next.min.js must exist');
assert(fs.existsSync(path.join(__dirname, 'src', 'i18n.js')), 'src/i18n.js must exist');
assert(fs.existsSync(path.join(__dirname, 'assets', 'js', 'i18n.js')), 'assets/js/i18n.js must exist');
console.log('  ✓ PASS: All i18n bundle and engine files are in place.');

// 2. Verify index.html markup
console.log('\n[TEST 2] Verifying index.html header & script imports...');
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

assert(indexHtml.includes('id="lang-selector-wrapper"'), 'index.html must include #lang-selector-wrapper');
assert(indexHtml.includes('id="lang-selector-btn"'), 'index.html must include #lang-selector-btn');
assert(indexHtml.includes('id="current-lang-label"'), 'index.html must include #current-lang-label');
assert(indexHtml.includes('ENGLISH (EN)'), 'Default button label must show ENGLISH (EN)');
assert(indexHtml.includes('id="lang-dropdown-menu"'), 'index.html must include #lang-dropdown-menu');
assert(indexHtml.includes("changeLanguage('en')"), 'Dropdown must have English button');
assert(indexHtml.includes("changeLanguage('es')"), 'Dropdown must have Spanish button');
assert(indexHtml.includes('assets/vendor/i18next.min.js'), 'index.html must load i18next.min.js');
assert(indexHtml.includes('src/i18n.js'), 'index.html must load src/i18n.js');
console.log('  ✓ PASS: Header dropdown markup and script tags correctly present.');

// 3. Load i18n module
console.log('\n[TEST 3] Loading i18n module & verifying dictionaries...');
const i18n = require('./src/i18n.js');
assert(i18n.enTranslations, 'enTranslations must be exported');
assert(i18n.esTranslations, 'esTranslations must be exported');
assert(Array.isArray(i18n.BILINGUAL_PAIRS), 'BILINGUAL_PAIRS must be an array');
assert(i18n.PROTECTED_NAMES instanceof Set, 'PROTECTED_NAMES must be a Set');

console.log(`  - EN dictionary entries: ${Object.keys(i18n.enTranslations).length}`);
console.log(`  - ES dictionary entries: ${Object.keys(i18n.esTranslations).length}`);
console.log(`  - Bilingual DOM pairs: ${i18n.BILINGUAL_PAIRS.length}`);
console.log(`  - Protected proper names: ${i18n.PROTECTED_NAMES.size}`);

assert(Object.keys(i18n.enTranslations).length >= 50, 'EN dictionary must be comprehensive');
assert(Object.keys(i18n.esTranslations).length >= 50, 'ES dictionary must be comprehensive');
assert(i18n.BILINGUAL_PAIRS.length >= 70, 'BILINGUAL_PAIRS must have rich coverage');
console.log('  ✓ PASS: Dictionaries and mapping tables are extensive.');

// 4. Verify Protected Proper Names (Routes & Drivers NEVER translated)
console.log('\n[TEST 4] Verifying STRICT PROTECTION: Route and Driver proper names...');
const routeNamesSample = [
  "City Perimeter", "Heritage Heights", "Dunwich Bay", "Point Camden",
  "Omega Loop", "North Broadway", "Rosewood & Heritage", "Petersburg Dam",
  "Beacon & Somerset", "NFS World Loop", "Campus Way", "Ironwood & Hillcrest",
  "Hwy 201 & Lyons", "Diamond & Union", "Waterfront & Chancellor"
];

const driverNamesSample = [
  "Razor", "Bull", "Ronnie", "Torque", "Webster", "Baron", "Big Lou",
  "Izzy", "Sonny", "Avenger", "SRTxAvenger™", "Nebula", "ZimanX",
  "N6 xBourne", "Earl", "Jewels", "JV", "Kaze", "Ming", "Vic", "Taz"
];

routeNamesSample.forEach(route => {
  assert(i18n.PROTECTED_NAMES.has(route), `Route "${route}" MUST be protected!`);
  // Must NOT be mapped to a translated word in BILINGUAL_PAIRS
  const badPair = i18n.BILINGUAL_PAIRS.find(p => p.en.trim() === route && p.es.trim() !== route);
  assert(!badPair, `Route "${route}" must NEVER be altered in BILINGUAL_PAIRS! Found: ${JSON.stringify(badPair)}`);
});
console.log('  ✓ PASS: 100% of official Route names are protected from translation.');

driverNamesSample.forEach(driver => {
  assert(i18n.PROTECTED_NAMES.has(driver), `Driver "${driver}" MUST be protected!`);
  const badPair = i18n.BILINGUAL_PAIRS.find(p => p.en.trim() === driver && p.es.trim() !== driver);
  assert(!badPair, `Driver "${driver}" must NEVER be altered in BILINGUAL_PAIRS! Found: ${JSON.stringify(badPair)}`);
});
console.log('  ✓ PASS: 100% of driver / pilot proper names are protected from translation.');

// 5. Test DOM translation simulation (EN -> ES -> EN)
console.log('\n[TEST 5] Testing DOM bidirectional translation cycle...');

// Create a simulated DOM structure with text nodes
class MockTextNode {
  constructor(text, parent) {
    this.nodeValue = text;
    this.parentElement = parent;
  }
}

class MockElement {
  constructor(tagName, attributes = {}, parent = null) {
    this.tagName = tagName.toUpperCase();
    this.attributes = attributes;
    this.parentElement = parent;
    this.childNodes = [];
    this.classList = {
      _classes: new Set(),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      contains: (c) => this.classList._classes.has(c)
    };
  }
  getAttribute(name) { return this.attributes[name] || null; }
  setAttribute(name, val) { this.attributes[name] = val; }
  closest(selector) {
    if (selector === '#lang-selector-wrapper' && this.attributes.id === 'lang-selector-wrapper') return this;
    if (this.parentElement) return this.parentElement.closest(selector);
    return null;
  }
}

// Build sample document tree
const docElement = new MockElement('html');
const bodyElement = new MockElement('body', {}, docElement);
docElement.childNodes.push(bodyElement);

// Add sample elements to translate:
// 1. Navigation items
const navLeaderboard = new MockElement('a', { id: 'nav-leaderboard' }, bodyElement);
const navText = new MockTextNode('TABLAS DE CLASIFICACIÓN', navLeaderboard);
navLeaderboard.childNodes.push(navText);
bodyElement.childNodes.push(navLeaderboard);

// 2. Route item (with protected route name!)
const routeTitle = new MockElement('h2', {}, bodyElement);
const routeText = new MockTextNode('City Perimeter', routeTitle); // PROTECTED ROUTE
routeTitle.childNodes.push(routeText);
bodyElement.childNodes.push(routeTitle);

// 3. Driver item (with protected driver name!)
const driverTitle = new MockElement('span', {}, bodyElement);
const driverText = new MockTextNode('SRTxAvenger™', driverTitle); // PROTECTED DRIVER
driverTitle.childNodes.push(driverText);
bodyElement.childNodes.push(driverTitle);

// 4. Section headings
const heading1 = new MockElement('h1', {}, bodyElement);
const headingText = new MockTextNode('EXPLORADOR DE RUTAS Y CIRCUITOS', heading1);
heading1.childNodes.push(headingText);
bodyElement.childNodes.push(heading1);

// 5. Button label
const btnFilter = new MockElement('span', {}, bodyElement);
const btnText = new MockTextNode('CIRCUITOS', btnFilter);
btnFilter.childNodes.push(btnText);
bodyElement.childNodes.push(btnFilter);

// 6. Standings column label
const colLabel = new MockElement('span', {}, bodyElement);
const colText = new MockTextNode('DINERO REP', colLabel);
colLabel.childNodes.push(colText);
bodyElement.childNodes.push(colLabel);

// Flatten text nodes
const allTextNodes = [navText, routeText, driverText, headingText, btnText, colText];

// Setup mock document and window
global.document = {
  documentElement: docElement,
  body: bodyElement,
  createTreeWalker: (root, filterMask, filterObj) => {
    let index = 0;
    return {
      nextNode: () => {
        while (index < allTextNodes.length) {
          const node = allTextNodes[index++];
          if (filterObj.acceptNode(node) === 1 /* FILTER_ACCEPT */) {
            return node;
          }
        }
        return null;
      }
    };
  },
  querySelectorAll: () => [],
  getElementById: () => null
};
global.NodeFilter = {
  SHOW_TEXT: 4,
  FILTER_ACCEPT: 1,
  FILTER_REJECT: 2
};

// Test Phase A: Translate to English ('en')
console.log('  Translating to English (Primary)...');
i18n.applyTranslations('en');

assert.strictEqual(navText.nodeValue.trim(), 'LEADERBOARDS', 'Nav must be translated to English LEADERBOARDS');
assert.strictEqual(headingText.nodeValue.trim(), 'ROUTES & CIRCUITS EXPLORER', 'Heading must be translated to English');
assert.strictEqual(btnText.nodeValue.trim(), 'CIRCUITS', 'Filter button must be translated to English CIRCUITS');
assert.strictEqual(colText.nodeValue.trim(), 'REP CASH', 'Col text must be translated to English REP CASH');

// STRICT INVARIANCE TEST:
assert.strictEqual(routeText.nodeValue.trim(), 'City Perimeter', 'Route name City Perimeter MUST NOT change!');
assert.strictEqual(driverText.nodeValue.trim(), 'SRTxAvenger™', 'Driver name SRTxAvenger™ MUST NOT change!');
console.log('  ✓ PASS: English translation verified; Route & Driver names remain 100% UNTOUCHED.');

// Test Phase B: Translate to Spanish ('es')
console.log('  Translating to Spanish (Secondary)...');
i18n.changeLanguage('es');

assert.strictEqual(navText.nodeValue.trim(), 'TABLAS DE CLASIFICACIÓN', 'Nav must be translated to Spanish TABLAS DE CLASIFICACIÓN');
assert.strictEqual(headingText.nodeValue.trim(), 'EXPLORADOR DE RUTAS Y CIRCUITOS', 'Heading must be translated to Spanish');
assert.strictEqual(btnText.nodeValue.trim(), 'CIRCUITOS', 'Filter button must be translated to Spanish CIRCUITOS');
assert.strictEqual(colText.nodeValue.trim(), 'DINERO REP', 'Col text must be translated to Spanish DINERO REP');

// STRICT INVARIANCE TEST:
assert.strictEqual(routeText.nodeValue.trim(), 'City Perimeter', 'Route name City Perimeter MUST NOT change in Spanish!');
assert.strictEqual(driverText.nodeValue.trim(), 'SRTxAvenger™', 'Driver name SRTxAvenger™ MUST NOT change in Spanish!');
console.log('  ✓ PASS: Spanish translation verified; Route & Driver names remain 100% UNTOUCHED.');

// Test Phase C: Switch back to English ('en')
console.log('  Translating back to English...');
i18n.changeLanguage('en');

assert.strictEqual(navText.nodeValue.trim(), 'LEADERBOARDS');
assert.strictEqual(headingText.nodeValue.trim(), 'ROUTES & CIRCUITS EXPLORER');
assert.strictEqual(routeText.nodeValue.trim(), 'City Perimeter');
assert.strictEqual(driverText.nodeValue.trim(), 'SRTxAvenger™');
console.log('  ✓ PASS: Toggling back and forth is clean, stable, and lossless.');

console.log('\n=================================================================');
console.log('🎉 ALL i18next INTEGRATION & PROPER NAME INVARIANCE TESTS PASSED!');
console.log('=================================================================');
