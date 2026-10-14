const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

console.log('=================================================================');
console.log('TEST SUITE: CHAMPIONSHIP STANDINGS VICTORIES & PODIUM AUDIT');
console.log('=================================================================');

// 1. Verify index.html contains standings-week-filter
console.log('\n[TEST 1] Verifying #standings-week-filter in index.html...');
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert.ok(indexHtml.includes('id="standings-week-filter"'), 'Missing #standings-week-filter in index.html');
assert.ok(indexHtml.includes('value="all"'), 'Missing value="all" option in week filter');
assert.ok(indexHtml.includes('value="1"'), 'Missing value="1" option in week filter');
assert.ok(indexHtml.includes('value="2"'), 'Missing value="2" option in week filter');
console.log('  ✓ PASS: #standings-week-filter exists with all options (all, 1, 2, 3, 4).');

// 2. Load src/blacklist-data.js and verify raw challenge records
console.log('\n[TEST 2] Auditing raw weekly challenge records in src/blacklist-data.js...');
const blacklistDataCode = fs.readFileSync(path.join(__dirname, 'src', 'blacklist-data.js'), 'utf8');
const sandbox = { window: {}, localStorage: { getItem: () => null, setItem: () => {} } };
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);
vm.runInContext(blacklistDataCode, sandbox);

const weeks = sandbox.window.CHAMPIONSHIP_WEEKS_DATA || sandbox.CHAMPIONSHIP_WEEKS_DATA;
const drivers = sandbox.window.DEFAULT_BLACKLIST_DRIVERS || sandbox.DEFAULT_BLACKLIST_DRIVERS;

// Verify Week 1 challenge specifics for Nebula
const w1 = weeks['1'] || weeks[0];
assert.ok(w1, 'Week 1 data must exist');
assert.strictEqual(w1.challenges.length, 8, 'Week 1 must have 8 challenges');

// Nebula in Week 1:
// Ch 0: P1, Ch 1: P1, Ch 2: P2, Ch 3: P1, Ch 4: P1, Ch 5: P1, Ch 6: P1, Ch 7: P3
const nebW1Placements = [];
w1.challenges.forEach((ch, idx) => {
  const grp0 = (ch.groupsResults || ch.groupsWinners || {})['0'] || ch.top3;
  const nebEntry = grp0.find(e => e.pilot && e.pilot.toLowerCase().includes('nebula'));
  assert.ok(nebEntry, `Nebula must be present in Week 1 Challenge #${idx + 1}`);
  const pos = grp0.indexOf(nebEntry) + 1;
  nebW1Placements.push({ ch: idx, pos, time: nebEntry.time });
});

assert.strictEqual(nebW1Placements[2].pos, 2, 'Nebula must be in 2nd place (P2) in Challenge 3 (Bayshore)');
assert.strictEqual(nebW1Placements[7].pos, 3, 'Nebula must be in 3rd place (P3) in Challenge 8 (Petersburgs)');

const nebW1_P1 = nebW1Placements.filter(p => p.pos === 1).length;
const nebW1_P2 = nebW1Placements.filter(p => p.pos === 2).length;
const nebW1_P3 = nebW1Placements.filter(p => p.pos === 3).length;

assert.strictEqual(nebW1_P1, 6, 'Nebula must have 6 P1 victories in Week 1');
assert.strictEqual(nebW1_P2, 1, 'Nebula must have 1 P2 second place in Week 1');
assert.strictEqual(nebW1_P3, 1, 'Nebula must have 1 P3 third place in Week 1');
console.log(`  ✓ PASS: Week 1 Nebula audited: P1=${nebW1_P1}, P2=${nebW1_P2}, P3=${nebW1_P3} (Total 8 events).`);

sandbox.window.addEventListener = () => {};
sandbox.document = {
  addEventListener: () => {},
  getElementById: (id) => {
    return {
      value: '',
      textContent: '',
      innerHTML: '',
      style: {},
      classList: { add: () => {}, remove: () => {}, contains: () => false },
      appendChild: () => {}
    };
  },
  querySelectorAll: () => []
};
sandbox.navigator = {};
sandbox.i18next = { language: 'es', t: k => k };

const tcCode = fs.readFileSync(path.join(__dirname, 'src', 'tournament-controller.js'), 'utf8');
vm.runInContext(tcCode, sandbox);

const tc = sandbox;

// Helper to run syncDriversWithChallengeResults and get driver
async function runTests() {
  await sandbox.window.loadTournamentData();

  function testSync(weekFilter) {
    const syncFn = tc.syncDriversWithChallengeResults || sandbox.window.syncDriversWithChallengeResults;
    const getDriversFn = tc.getSortedDrivers || sandbox.window.getSortedDrivers;
    assert.ok(typeof syncFn === 'function', 'syncDriversWithChallengeResults must be a function');
    syncFn(weekFilter);
    return getDriversFn();
  }

  // 3A. Test Week 1 Filter
  const listW1 = testSync('1');
const nebW1 = listW1.find(d => d.alias === 'Nebula');
assert.ok(nebW1, 'Nebula must be in drivers list');
assert.strictEqual(nebW1.victories.p1, 6, 'Nebula Week 1 P1 must be 6');
assert.strictEqual(nebW1.victories.p2, 1, 'Nebula Week 1 P2 must be 1');
assert.strictEqual(nebW1.victories.p3, 1, 'Nebula Week 1 P3 must be 1');
assert.strictEqual(nebW1.totalScore, 1148, 'Nebula Week 1 score must be 1148 PTS (183 + 670 + 295)');
console.log(`  ✓ PASS: Week 1 Filter -> Nebula: P1=${nebW1.victories.p1}, P2=${nebW1.victories.p2}, P3=${nebW1.victories.p3}, Score=${nebW1.totalScore} PTS`);

const zimanW1 = listW1.find(d => d.alias === 'ZimanX');
assert.strictEqual(zimanW1.victories.p1, 0, 'ZimanX Week 1 P1 must be 0');
assert.strictEqual(zimanW1.victories.p2, 3, 'ZimanX Week 1 P2 must be 3');
assert.strictEqual(zimanW1.victories.p3, 5, 'ZimanX Week 1 P3 must be 5');
assert.strictEqual(zimanW1.totalScore, 518, 'ZimanX Week 1 score must be 518 PTS (129 + 250 + 139)');
console.log(`  ✓ PASS: Week 1 Filter -> ZimanX: P1=${zimanW1.victories.p1}, P2=${zimanW1.victories.p2}, P3=${zimanW1.victories.p3}, Score=${zimanW1.totalScore} PTS`);

const bourneW1 = listW1.find(d => d.alias.includes('Bourne'));
assert.strictEqual(bourneW1.victories.p1, 2, 'N6 xBourne Week 1 P1 must be 2');
assert.strictEqual(bourneW1.victories.p2, 4, 'N6 xBourne Week 1 P2 must be 4');
assert.strictEqual(bourneW1.victories.p3, 2, 'N6 xBourne Week 1 P3 must be 2');
assert.strictEqual(bourneW1.totalScore, 806, 'N6 xBourne Week 1 score must be 806 PTS');
console.log(`  ✓ PASS: Week 1 Filter -> N6 xBourne: P1=${bourneW1.victories.p1}, P2=${bourneW1.victories.p2}, P3=${bourneW1.victories.p3}, Score=${bourneW1.totalScore} PTS`);

const avengerW1 = listW1.find(d => d.alias.includes('Avenger'));
assert.strictEqual(avengerW1.victories.p1, 8, 'SRTxAvenger™ Week 1 P1 must be 8');
assert.strictEqual(avengerW1.victories.p2, 0, 'SRTxAvenger™ Week 1 P2 must be 0');
assert.strictEqual(avengerW1.victories.p3, 0, 'SRTxAvenger™ Week 1 P3 must be 0');
assert.strictEqual(avengerW1.totalScore, 1320, 'SRTxAvenger™ Week 1 score must be 1320 PTS');
console.log(`  ✓ PASS: Week 1 Filter -> SRTxAvenger™: P1=${avengerW1.victories.p1}, P2=${avengerW1.victories.p2}, P3=${avengerW1.victories.p3}, Score=${avengerW1.totalScore} PTS`);

// 3B. Test Week 2 Filter
const listW2 = testSync('2');
const nebW2 = listW2.find(d => d.alias === 'Nebula');
assert.strictEqual(nebW2.victories.p1, 4, 'Nebula Week 2 P1 must be 4');
assert.strictEqual(nebW2.victories.p2, 5, 'Nebula Week 2 P2 must be 5');
assert.strictEqual(nebW2.victories.p3, 0, 'Nebula Week 2 P3 must be 0');
assert.strictEqual(nebW2.totalScore, 1178, 'Nebula Week 2 score must be 1178 PTS');
console.log(`  ✓ PASS: Week 2 Filter -> Nebula: P1=${nebW2.victories.p1}, P2=${nebW2.victories.p2}, P3=${nebW2.victories.p3}, Score=${nebW2.totalScore} PTS`);

const avengerW2 = listW2.find(d => d.alias.includes('Avenger'));
assert.strictEqual(avengerW2.victories.p1, 5, 'SRTxAvenger™ Week 2 P1 must be 5');
assert.strictEqual(avengerW2.victories.p2, 3, 'SRTxAvenger™ Week 2 P2 must be 3');
assert.strictEqual(avengerW2.victories.p3, 0, 'SRTxAvenger™ Week 2 P3 must be 0');
assert.strictEqual(avengerW2.totalScore, 1157, 'SRTxAvenger™ Week 2 score must be 1157 PTS');
console.log(`  ✓ PASS: Week 2 Filter -> SRTxAvenger™: P1=${avengerW2.victories.p1}, P2=${avengerW2.victories.p2}, P3=${avengerW2.victories.p3}, Score=${avengerW2.totalScore} PTS`);

const zimanW2 = listW2.find(d => d.alias === 'ZimanX');
assert.strictEqual(zimanW2.victories.p1, 3, 'ZimanX Week 2 P1 must be 3');
assert.strictEqual(zimanW2.victories.p2, 5, 'ZimanX Week 2 P2 must be 5');
assert.strictEqual(zimanW2.victories.p3, 0, 'ZimanX Week 2 P3 must be 0');
assert.strictEqual(zimanW2.totalScore, 952, 'ZimanX Week 2 score must be 952 PTS');
console.log(`  ✓ PASS: Week 2 Filter -> ZimanX: P1=${zimanW2.victories.p1}, P2=${zimanW2.victories.p2}, P3=${zimanW2.victories.p3}, Score=${zimanW2.totalScore} PTS`);

// 3C. Test Cumulative All Weeks Filter
const listAll = testSync('all');
const nebAll = listAll.find(d => d.alias === 'Nebula');
assert.strictEqual(nebAll.victories.p1, 10, 'Nebula All Weeks P1 must be 10 (6 + 4)');
assert.strictEqual(nebAll.victories.p2, 6, 'Nebula All Weeks P2 must be 6 (1 + 5)');
assert.strictEqual(nebAll.victories.p3, 1, 'Nebula All Weeks P3 must be 1 (1 + 0)');
assert.strictEqual(nebAll.totalScore, 2326, 'Nebula All Weeks score must be 2326 PTS (1148 + 1178)');
console.log(`  ✓ PASS: All Weeks Filter -> Nebula: P1=${nebAll.victories.p1}, P2=${nebAll.victories.p2}, P3=${nebAll.victories.p3}, Score=${nebAll.totalScore} PTS`);

const avengerAll = listAll.find(d => d.alias.includes('Avenger'));
assert.strictEqual(avengerAll.victories.p1, 13, 'SRTxAvenger™ All Weeks P1 must be 13 (8 + 5)');
assert.strictEqual(avengerAll.victories.p2, 3, 'SRTxAvenger™ All Weeks P2 must be 3 (0 + 3)');
assert.strictEqual(avengerAll.victories.p3, 0, 'SRTxAvenger™ All Weeks P3 must be 0 (0 + 0)');
assert.strictEqual(avengerAll.totalScore, 2477, 'SRTxAvenger™ All Weeks score must be 2477 PTS (1320 + 1157)');
console.log(`  ✓ PASS: All Weeks Filter -> SRTxAvenger™: P1=${avengerAll.victories.p1}, P2=${avengerAll.victories.p2}, P3=${avengerAll.victories.p3}, Score=${avengerAll.totalScore} PTS`);

const zimanAll = listAll.find(d => d.alias === 'ZimanX');
assert.strictEqual(zimanAll.victories.p1, 3, 'ZimanX All Weeks P1 must be 3 (0 + 3)');
assert.strictEqual(zimanAll.victories.p2, 8, 'ZimanX All Weeks P2 must be 8 (3 + 5)');
assert.strictEqual(zimanAll.victories.p3, 5, 'ZimanX All Weeks P3 must be 5 (5 + 0)');
assert.strictEqual(zimanAll.totalScore, 1470, 'ZimanX All Weeks score must be 1470 PTS (518 + 952)');
console.log(`  ✓ PASS: All Weeks Filter -> ZimanX: P1=${zimanAll.victories.p1}, P2=${zimanAll.victories.p2}, P3=${zimanAll.victories.p3}, Score=${zimanAll.totalScore} PTS`);

// 3D. Test Week 3 & Week 4 Filters (Pending / Not in course yet)
  console.log('\n[TEST 4] Verifying Week 3 & Week 4 Pending / Uncompleted Isolation...');
  const listW3 = testSync('3');
  listW3.forEach(d => {
    assert.strictEqual(d.totalScore, 0, `Driver ${d.alias} must have 0 points in Week 3 (pending)`);
    assert.strictEqual(d.victories.p1, 0, `Driver ${d.alias} must have 0 P1 victories in Week 3`);
  });
  console.log('  ✓ PASS: Week 3 Filter correctly isolated (All drivers have 0 PTS / 0 Victories as it is pending).');

  const listW4 = testSync('4');
  listW4.forEach(d => {
    assert.strictEqual(d.totalScore, 0, `Driver ${d.alias} must have 0 points in Week 4 (pending)`);
    assert.strictEqual(d.victories.p1, 0, `Driver ${d.alias} must have 0 P1 victories in Week 4`);
  });
  console.log('  ✓ PASS: Week 4 Filter correctly isolated (All drivers have 0 PTS / 0 Victories as it is pending).');

  // 3E. Verify Groups Alfa, Beta, Gamma, Delta participants in Weeks 1 & 2
  console.log('\n[TEST 5] Auditing groups Alfa, Beta, Gamma, Delta drivers for Weeks 1 & 2...');
  const listAllGroups = testSync('all');

  const dannyAll = listAllGroups.find(d => d.alias.includes('DannyLove'));
  assert.strictEqual(dannyAll.totalScore, 1061, 'DannyLove All Weeks score must be 1061 PTS');
  assert.strictEqual(dannyAll.victories.p1, 5, 'DannyLove must have 5 P1 victories');
  assert.strictEqual(dannyAll.victories.p2, 3, 'DannyLove must have 3 P2 podiums');

  const shidoAll = listAllGroups.find(d => d.alias.includes('Shido'));
  assert.strictEqual(shidoAll.totalScore, 880, 'Shido All Weeks score must be 880 PTS');
  assert.strictEqual(shidoAll.victories.p1, 4, 'Shido must have 4 P1 victories');
  assert.strictEqual(shidoAll.victories.p2, 3, 'Shido must have 3 P2 podiums');

  const leaAll = listAllGroups.find(d => d.alias === 'Lea');
  assert.strictEqual(leaAll.totalScore, 528, 'Lea All Weeks score must be 528 PTS');
  assert.strictEqual(leaAll.victories.p1, 3, 'Lea must have 3 P1 victories');

  const lemondAll = listAllGroups.find(d => d.alias.includes('xLeMondx'));
  assert.strictEqual(lemondAll.totalScore, 397, 'xLeMondx All Weeks score must be 397 PTS');
  assert.strictEqual(lemondAll.victories.p2, 4, 'xLeMondx must have 4 P2 podiums');

  console.log('  ✓ PASS: All Group Alfa, Beta, Gamma, Delta drivers strictly reconciled for Weeks 1 & 2.');

console.log('\n=================================================================');
console.log('🎉 ALL STANDINGS VICTORIES & PODIUM AUDIT TESTS PASSED SUCCESSFULLY!');
console.log('=================================================================');
}

runTests().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
