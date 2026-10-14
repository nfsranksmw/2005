const fs = require('fs');
const path = require('path');

console.log('=================================================================');
console.log('TEST SUITE: MEDIA ASSETS, BACKGROUNDS & FOOTER POWERED BY PARTNERS');
console.log('=================================================================\n');

let pass = 0;
let fail = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    pass++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    fail++;
  }
}

// 1. Verify Image Assets on Disk
console.log('[TEST 1] Verifying image assets on disk...');
const requiredAssets = [
  'assets/img/nfsmw-logo-banner.png',
  'assets/img/Black Edition.jpg',
  'assets/img/firebase-logo.png',
  'assets/img/spaceship-logo.png'
];

requiredAssets.forEach(assetPath => {
  const fullPath = path.join(__dirname, assetPath);
  const exists = fs.existsSync(fullPath);
  const size = exists ? fs.statSync(fullPath).size : 0;
  assert(exists && size > 0, `Asset exists and is non-empty: ${assetPath} (${size} bytes)`);
});

// 2. Verify Global Page Background in index.html
console.log('\n[TEST 2] Verifying Global Background (Black Edition.jpg)...');
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

assert(
  indexHtml.includes('id="global-page-backdrop"') &&
  indexHtml.includes('Black%20Edition.jpg') &&
  indexHtml.includes('fixed inset-0'),
  'Global page backdrop div is properly defined with fixed inset-0 and Black Edition.jpg'
);

assert(
  indexHtml.includes('main class="w-full pt-20 bg-[#0b0e15]/70') &&
  indexHtml.includes('relative z-10'),
  'Main container allows global backdrop to show through cleanly with relative z-10'
);

// 3. Verify Routes & Circuits Header Watermark (nfsmw-logo-banner.png)
console.log('\n[TEST 3] Verifying Routes & Circuits Watermark Banner...');
const routesSection = indexHtml.substring(
  indexHtml.indexOf('id="view-routes-pistas"'),
  indexHtml.indexOf('id="view-challenges"')
);

assert(
  routesSection.includes('assets/img/nfsmw-graffiti-banner.png') || routesSection.includes('assets/img/nfsmw-logo-banner.png'),
  'Routes section hero includes official nfsmw banner'
);

assert(
  (routesSection.includes('opacity-25') || routesSection.includes('opacity-20')) && routesSection.includes('pointer-events-none'),
  'NFS logo watermark has proper opacity and pointer-events-none'
);

// 4. Verify Footer "Produced by & Powered by" Section
console.log('\n[TEST 4] Verifying Footer "Produced by & Powered by" Partner Strip...');
const footerSection = indexHtml.substring(indexHtml.indexOf('<footer'));

assert(
  footerSection.includes('PRODUCED BY &amp; POWERED BY') || footerSection.includes('data-i18n="footer.powered_by"'),
  'Footer contains PRODUCED BY & POWERED BY header'
);

assert(
  footerSection.includes('https://firebase.google.com/') && footerSection.includes('assets/img/firebase-logo.png'),
  'Firebase logo and official link (https://firebase.google.com/) present in footer'
);

assert(
  footerSection.includes('https://www.spaceship.com/') && footerSection.includes('assets/img/spaceship-logo.png'),
  'Spaceship logo and official link (https://www.spaceship.com/) present in footer'
);

assert(
  footerSection.includes('https://discord.gg/pgP45wSN8K') && footerSection.includes('<svg') && footerSection.includes('Discord'),
  'Discord SVG icon and community link (https://discord.gg/pgP45wSN8K) present in footer'
);

assert(
  footerSection.includes('https://github.com') && footerSection.includes('<svg') && footerSection.includes('GitHub'),
  'GitHub SVG icon and official link (https://github.com) present in footer'
);

// 5. HTML Balance Check
console.log('\n[TEST 5] Verifying HTML syntax & tag balance...');
const openTags = (indexHtml.match(/<section/g) || []).length;
const closeTags = (indexHtml.match(/<\/section>/g) || []).length;
assert(openTags === closeTags, `Section tags balanced: ${openTags} open vs ${closeTags} close`);

console.log('\n=================================================================');
if (fail === 0) {
  console.log(`🎉 ALL ${pass} VERIFICATION CHECKS PASSED SUCCESSFULLY!`);
} else {
  console.error(`💥 ${fail} CHECKS FAILED!`);
  process.exit(1);
}
console.log('=================================================================');
