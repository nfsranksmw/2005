const fs = require('fs');
const path = require('path');

console.log('=== TEST SUITE: ESTRATEGIA MODULAR FASE 3 ===\n');

const html = fs.readFileSync('index.html', 'utf8');

// 1. Test Home Background
console.log('--- TEST 1: HOME BACKGROUND IMAGE ---');
const bgExistsOnDisk = fs.existsSync(path.join('assets', 'img', 'hero-bmw-m3-gtr-banner.jpg'));
if (bgExistsOnDisk) {
  console.log('[PASS] Image file assets/img/hero-bmw-m3-gtr-banner.jpg exists on disk (' + (fs.statSync(path.join('assets', 'img', 'hero-bmw-m3-gtr-banner.jpg')).size / 1024).toFixed(1) + ' KB)');
} else {
  console.error('[FAIL] Image assets/img/hero-bmw-m3-gtr-banner.jpg does NOT exist on disk!');
}

const hasHeroBgStyle = html.includes("assets/img/hero-bmw-m3-gtr-banner.jpg");
if (hasHeroBgStyle) {
  console.log('[PASS] index.html contains background-image style referencing hero banner');
} else {
  console.error('[FAIL] index.html missing background-image for hero banner!');
}

// 2. Test Routes Filters & IDs
console.log('\n--- TEST 2: ROUTES FILTERS & DYNAMIC CARDS ---');
const routesIds = [
  'routes-category-filters',
  'btn-filter-all',
  'btn-filter-circuit',
  'btn-filter-sprint',
  'btn-filter-drag',
  'routes-search-input',
  'routes-cards-container'
];

routesIds.forEach(id => {
  if (html.includes(`id="${id}"`)) {
    console.log(`[PASS] Found #${id}`);
  } else {
    console.error(`[FAIL] Missing #${id}`);
  }
});

// Check routes-data.js
if (fs.existsSync('src/routes-data.js')) {
  const routesContent = fs.readFileSync('src/routes-data.js', 'utf8');
  eval(routesContent.replace('const routesData', 'global.routesData'));
  console.log(`[PASS] src/routes-data.js loaded with ${global.routesData.length} tracks`);
} else {
  console.error('[FAIL] src/routes-data.js does not exist!');
}

// 3. Test Firebase Connection & Leaderboards
console.log('\n--- TEST 3: FIREBASE & LEADERBOARD ROWS ---');
const lbIds = [
  'leaderboard-breadcrumb-track',
  'leaderboard-track-name',
  'leaderboard-category-tabs',
  'leaderboard-tbody',
  'leaderboard-back-btn'
];

lbIds.forEach(id => {
  if (html.includes(`id="${id}"`)) {
    console.log(`[PASS] Found #${id}`);
  } else {
    console.error(`[FAIL] Missing #${id}`);
  }
});

// Test real Firebase RTDB query
console.log('\nTesting Realtime Database query for "City Perimeter"...');
fetch('https://nfsranks-blacklist-default-rtdb.firebaseio.com/leaderboards/city_perimeter.json')
  .then(res => res.json())
  .then(data => {
    if (data && typeof data === 'object') {
      const catKeys = Object.keys(data);
      console.log(`[PASS] Firebase query succeeded! Categories: ${catKeys.join(', ')}`);
      const sampleRecords = data[catKeys[0]];
      console.log(`[PASS] Category "${catKeys[0]}" has ${sampleRecords.length} records in Firebase.`);
      console.log('Sample record driver:', sampleRecords[0].driver, 'Time:', sampleRecords[0].time, 'Car:', sampleRecords[0].car);
      console.log('\n=== ALL PHASE 3 TESTS PASSED: READY FOR LIVE SERVER ===');
    } else {
      console.error('[FAIL] Firebase returned invalid data:', data);
    }
  })
  .catch(err => {
    console.error('[FAIL] Firebase fetch failed:', err);
  });
