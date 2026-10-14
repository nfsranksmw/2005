const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- STARTING PHASE 7 VERIFICATION TEST ---');

// 1. Verify index.html exists and contains all required view sections
const indexHtmlPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const requiredSections = [
  'view-home',
  'view-leaderboard',
  'view-routes-pistas',
  'view-challenges',
  'view-blacklist',
  'view-championship-standings',
  'view-championship-register',
  'view-tutorial',
  'view-past-tournaments',
  'view-blacklist-cards'
];

requiredSections.forEach(secId => {
  const hasSec = indexHtml.includes(`id="${secId}"`);
  assert.ok(hasSec, `Missing view section: ${secId}`);
  console.log(`[PASS] Section #${secId} exists in index.html`);
});

// 2. Verify Weekly Challenges Elements
const challengesIds = [
  'challenges-week-pills',
  'challenges-active-week-label',
  'c-summary-daterange',
  'c-summary-count',
  'c-summary-pot',
  'challenges-cards-grid'
];
challengesIds.forEach(id => {
  assert.ok(indexHtml.includes(`id="${id}"`), `Missing Weekly Challenges ID: ${id}`);
});
console.log('[PASS] All Weekly Challenges IDs present');

// 3. Verify Blacklist Groups & Rivals Elements
const blacklistIds = [
  'tournament-week-selector',
  't-kpi-leader-name',
  't-kpi-leader-pts',
  't-kpi-rep-pot',
  't-kpi-week-progress',
  't-kpi-status',
  'tournament-groups-grid',
  'tournament-challenges-grid',
  'btn-bl-group-0',
  'btn-bl-group-1',
  'btn-bl-group-2',
  'btn-bl-group-3'
];
blacklistIds.forEach(id => {
  assert.ok(indexHtml.includes(`id="${id}"`), `Missing Blacklist Groups ID: ${id}`);
});
console.log('[PASS] All Blacklist Groups & Rivals IDs present');

// 4. Verify Championship Standings Elements
const standingsIds = [
  's-kpi-leader',
  's-kpi-leader-pts',
  's-kpi-rep',
  's-kpi-runs',
  's-kpi-integrity',
  'standings-cards-container',
  'standings-search-input',
  'standings-sort-filter',
  'standings-group-filter'
];
standingsIds.forEach(id => {
  assert.ok(indexHtml.includes(`id="${id}"`), `Missing Championship Standings ID: ${id}`);
});
console.log('[PASS] All Championship Standings IDs present');

// 5. Verify Registration Elements
const regIds = [
  'form-championship-register',
  'reg-driver-name',
  'reg-driver-alias',
  'reg-driver-car',
  'reg-driver-schedule',
  'reg-driver-youtube',
  'reg-driver-contact',
  'reg-terms',
  'btn-submit-registration',
  'register-feedback-msg',
  'registered-pilots-list',
  'reg-count-num',
  'reg-summary-slots'
];
regIds.forEach(id => {
  assert.ok(indexHtml.includes(`id="${id}"`), `Missing Registration ID: ${id}`);
});
console.log('[PASS] All Tournament Registration IDs present');

// 6. Verify Tutorial Elements
assert.ok(indexHtml.includes('https://www.youtube.com/embed/0w_KsV6fAfg'), 'Missing YouTube tutorial embed');
assert.ok(indexHtml.includes('PASO 01'), 'Missing Tutorial Step 1');
assert.ok(indexHtml.includes('PASO 04'), 'Missing Tutorial Step 4');
console.log('[PASS] Tournament Tutorial video and steps present');

// 7. Verify Past Tournaments Elements
const pastIds = [
  'past-tournaments-pills',
  'pill-tournament-ev1n0yug',
  'pill-tournament-6as1doj5',
  'past-tournament-hero',
  'past-tournament-stats-bar',
  'btn-past-mode-brackets',
  'btn-past-mode-podium',
  'btn-past-mode-roster',
  'past-brackets-container',
  'past-podium-container',
  'tbody-past-participants'
];
pastIds.forEach(id => {
  assert.ok(indexHtml.includes(`id="${id}"`), `Missing Past Tournaments ID: ${id}`);
});
console.log('[PASS] All Past Tournaments IDs present');

// 8. Verify Navbar HOME typography
const navHomeMatch = indexHtml.match(/<a id="nav-home"[^>]*class="([^"]*)"/);
assert.ok(navHomeMatch, 'nav-home tag found');
assert.ok(navHomeMatch[1].includes('text-label-hud'), 'nav-home has uniform text-label-hud typography');
console.log('[PASS] Navbar HOME has uniform text-label-hud typography');

// 9. Verify Script loading order
const requiredScripts = [
  'src/routes-data.js',
  'src/tournaments-data.js',
  'src/blacklist-data.js',
  'src/seasons-data.js',
  'src/firebase-config.js',
  'src/challenges-controller.js',
  'src/tournament-controller.js',
  'src/app.js'
];
requiredScripts.forEach(s => {
  assert.ok(indexHtml.includes(`src="${s}"`), `Missing script tag for ${s}`);
  console.log(`[PASS] Script ${s} included in index.html`);
});

// 10. Verify src/app.js syntax & logic
const appJs = fs.readFileSync(path.join(__dirname, 'src', 'app.js'), 'utf8');
assert.ok(appJs.includes("'challenges': 'challenges'"), 'VIEW_MAP has challenges');
assert.ok(appJs.includes("'blacklist': 'blacklist'"), 'VIEW_MAP has blacklist');
assert.ok(appJs.includes("'championship-standings': 'championship-standings'"), 'VIEW_MAP has championship-standings');
assert.ok(appJs.includes("'blacklist-cards': 'blacklist-cards'"), 'VIEW_MAP has blacklist-cards');
assert.ok(appJs.includes("'championship-register': 'championship-register'"), 'VIEW_MAP has championship-register');
assert.ok(appJs.includes("'tutorial': 'tutorial'"), 'VIEW_MAP has tutorial');
assert.ok(appJs.includes("'past-tournaments': 'past-tournaments'"), 'VIEW_MAP has past-tournaments');

assert.ok(appJs.includes('handleChampionshipSubmit'), 'src/app.js has handleChampionshipSubmit');
assert.ok(appJs.includes('switchPastTournament'), 'src/app.js has switchPastTournament');
assert.ok(appJs.includes('loadRegistrationView'), 'src/app.js has loadRegistrationView');
assert.ok(appJs.includes('loadPastTournamentsView'), 'src/app.js has loadPastTournamentsView');

console.log('[PASS] src/app.js mappings and tournament handlers verified');

console.log('--- ALL PHASE 7 TESTS PASSED SUCCESSFULLY! ---');
