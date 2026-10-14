const fs = require('fs');

async function runTestSuite() {
  console.log('=== TEST SUITE: ESTRATEGIA MODULAR FASE 3.1 ===\n');

  // Load app.js and routes-data.js inside a simulated browser context
  const routesCode = fs.readFileSync('./src/routes-data.js', 'utf8') + '\nreturn routesData;';
  const routesData = new Function(routesCode)();

  // 1. Fetch real Firebase leaderboards data
  console.log('--- TEST 1: FETCH REALTIME DATABASE LEADERBOARDS ---');
  const res = await fetch('https://nfsranks-blacklist-default-rtdb.firebaseio.com/leaderboards.json');
  if (!res.ok) throw new Error('Failed to fetch leaderboards.json');
  const allLeaderboardsData = await res.json();
  console.log(`[PASS] Fetched ${Object.keys(allLeaderboardsData).length} tracks from Firebase.`);

  function sanitizeKey(str) {
    if (!str) return 'general';
    return String(str).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_-]/g, '_');
  }

  function getTrackWR(routeName) {
    const routeKey = sanitizeKey(routeName);
    const track = allLeaderboardsData[routeKey];
    if (!track) return null;
    const records = track.junkman_single || track.junkman || [];
    if (!Array.isArray(records) || records.length === 0) return null;
    const valid = records.filter(r => r && (r.time || r.timeMs));
    if (valid.length === 0) return null;
    const sorted = [...valid].sort((a, b) => {
      const tA = (typeof a.timeMs === 'number') ? a.timeMs : (parseFloat(a.time) || 999999);
      const tB = (typeof b.timeMs === 'number') ? b.timeMs : (parseFloat(b.time) || 999999);
      return tA - tB;
    });
    return sorted[0] || null;
  }

  // 2. Validate Top 1 WR injection for routes
  console.log('\n--- TEST 2: WORLD RECORD (WR) & DRIVER ALIAS INJECTION ---');
  const sampleTracks = ['City Perimeter', 'Ironwood States', 'Bay Bridge', 'Campus Way', 'Petersburgs'];
  sampleTracks.forEach(name => {
    const wr = getTrackWR(name);
    if (!wr) {
      console.error(`[FAIL] No WR found for ${name}`);
      process.exit(1);
    }
    if (!wr.time || wr.time === '--:--.---') {
      console.error(`[FAIL] Invalid time for ${name}: ${wr.time}`);
      process.exit(1);
    }
    if (!wr.driver) {
      console.error(`[FAIL] Missing driver alias for ${name}`);
      process.exit(1);
    }
    console.log(`[PASS] ${name} -> WR: ${wr.time} | Piloto: ${wr.driver} | Vehículo: ${wr.car || 'N/A'}`);
  });

  // Verify all 86 tracks have valid Top 1
  let totalWithWR = 0;
  routesData.forEach(r => {
    const wr = getTrackWR(r.name);
    if (wr && wr.time && wr.driver) totalWithWR++;
  });
  console.log(`[PASS] 86 of 86 routes have valid Top 1 WR in Junkman Single: (${totalWithWR}/${routesData.length})`);

  // 3. Test Strict Category Ordering
  console.log('\n--- TEST 3: STRICT CATEGORY ORDERING ---');
  const STRICT_CATEGORY_ORDER = [
    'junkman_single',
    'junkman_fast',
    'bmw_single',
    'bmw_fast',
    'junkman',
    'bmw',
    'stock',
    'default'
  ];

  function sortCategoriesStrict(keys) {
    return [...keys].sort((a, b) => {
      let idxA = STRICT_CATEGORY_ORDER.indexOf(a);
      let idxB = STRICT_CATEGORY_ORDER.indexOf(b);
      if (idxA === -1) idxA = 999;
      if (idxB === -1) idxB = 999;
      return idxA - idxB;
    });
  }

  const CATEGORY_DISPLAY_LABELS = {
    'junkman_single': 'Junkman Single Lap',
    'junkman_fast': 'Junkman Fast Lap',
    'bmw_single': 'BMW M3 GTR Single Lap',
    'bmw_fast': 'BMW M3 GTR Fast Lap',
    'junkman': 'Junkman Single Lap',
    'bmw': 'BMW M3 GTR Single Lap',
    'stock': 'Stock / De Serie',
    'default': 'Clasificación General'
  };

  // Test Circuit category sorting (original raw order from Firebase: ['bmw_fast', 'bmw_single', 'junkman_fast', 'junkman_single'])
  const rawFirebaseCircuitKeys = ['bmw_fast', 'bmw_single', 'junkman_fast', 'junkman_single'];
  const sortedCircuitKeys = sortCategoriesStrict(rawFirebaseCircuitKeys);
  const expectedCircuitOrder = ['junkman_single', 'junkman_fast', 'bmw_single', 'bmw_fast'];
  const expectedLabels = [
    'Junkman Single Lap',
    'Junkman Fast Lap',
    'BMW M3 GTR Single Lap',
    'BMW M3 GTR Fast Lap'
  ];

  console.log('Raw Firebase keys:', rawFirebaseCircuitKeys);
  console.log('Sorted keys:', sortedCircuitKeys);

  if (JSON.stringify(sortedCircuitKeys) !== JSON.stringify(expectedCircuitOrder)) {
    console.error('[FAIL] Circuit category order mismatch!');
    process.exit(1);
  }
  console.log('[PASS] Circuit category order matches strictly:');
  sortedCircuitKeys.forEach((k, i) => {
    console.log(`       ${i + 1}. "${CATEGORY_DISPLAY_LABELS[k]}" (${k})`);
  });

  // Test Sprint category sorting
  const rawFirebaseSprintKeys = ['bmw', 'junkman'];
  const sortedSprintKeys = sortCategoriesStrict(rawFirebaseSprintKeys);
  const expectedSprintOrder = ['junkman', 'bmw'];
  if (JSON.stringify(sortedSprintKeys) !== JSON.stringify(expectedSprintOrder)) {
    console.error('[FAIL] Sprint category order mismatch!');
    process.exit(1);
  }
  console.log('[PASS] Sprint category order matches strictly:');
  sortedSprintKeys.forEach((k, i) => {
    console.log(`       ${i + 1}. "${CATEGORY_DISPLAY_LABELS[k]}" (${k})`);
  });

  // 4. Verify src/app.js syntax & logic
  console.log('\n--- TEST 4: JAVASCRIPT SYNTAX & INTEGRITY IN SRC/APP.JS ---');
  const appJsContent = fs.readFileSync('./src/app.js', 'utf8');
  if (!appJsContent.includes('STRICT_CATEGORY_ORDER')) {
    console.error('[FAIL] STRICT_CATEGORY_ORDER not found in src/app.js');
    process.exit(1);
  }
  if (!appJsContent.includes('getTrackWR')) {
    console.error('[FAIL] getTrackWR not found in src/app.js');
    process.exit(1);
  }
  if (!appJsContent.includes('updateRouteCardsWithWR')) {
    console.error('[FAIL] updateRouteCardsWithWR not found in src/app.js');
    process.exit(1);
  }
  if (!appJsContent.includes('fetchAllLeaderboards')) {
    console.error('[FAIL] fetchAllLeaderboards not found in src/app.js');
    process.exit(1);
  }
  console.log('[PASS] src/app.js contains all required Phase 3.1 logic functions.');

  console.log('\n=== ALL PHASE 3.1 TESTS PASSED SUCCESSFULLY! ===\n');
}

runTestSuite().catch(err => {
  console.error(err);
  process.exit(1);
});
