const fs = require('fs');
const https = require('https');

const pilotMeta = {
  'SRTxAvenger™': { rank: 5, car: 'Carrera GT & Lotus Elise' },
  'ZimanX': { rank: 1, car: 'Porsche Carrera GT' },
  'SRTxSigy': { rank: 13, car: 'Porsche Carrera GT' },
  'Lea': { rank: 8, car: 'Carrera GT & M3 GTR' },
  'xLeMondx': { rank: 4, car: 'Porsche Carrera GT' },
  'NFSMW': { rank: 9, car: 'BMW M3 GTR' },
  'Shido': { rank: 6, car: 'BMW M3 GTR' },
  'DarkShido': { rank: 6, car: 'BMW M3 GTR' },
  'N6 xBourne': { rank: 10, car: 'Porsche Carrera GT y Lotus Elise' },
  'Flow.': { rank: 14, car: 'Porsche Carrera GT' },
  'DannyLove': { rank: 7, car: 'BMW M3 GTR' },
  'Nebula': { rank: 3, car: 'Carrera GT y Lotus Elise' },
  'RazorV8': { rank: 11, car: 'Ford GT' },
  'Por disputar': { rank: null, car: '' }
};

const groupNames = [
  'Grupo Alfa (Velocidad Pura)',
  'Grupo Beta (Duelo Callejero)',
  'Grupo Gama (Fuerza & Asfalto)',
  'Grupo Delta (Competición & Desafío)'
];

const challengesDefs = [
  { id: 'w2-ch1', route: 'NFS World Loop', type: 'Sprint', carRestriction: 'Porsche Carrera GT (Junkman)' },
  { id: 'w2-ch2', route: 'Highlands', type: 'Circuito', carRestriction: 'Mitsubishi Lancer Evolution (Stock)' },
  { id: 'w2-ch3', route: 'Harbor & Ocean', type: 'Drag', carRestriction: 'Dodge Viper SRT-10 (No Junkman)' },
  { id: 'w2-ch4', route: 'Diamond & Unión', type: 'Sprint', carRestriction: 'Mazda RX-8 (Stock)' },
  { id: 'w2-ch5', route: 'Heritage Height', type: 'Circuito', carRestriction: 'Lamborghini Gallardo (No Junkman)' },
  { id: 'w2-ch6', route: 'Hwy 99 & States', type: 'Sprint', carRestriction: 'Subaru WRX (Stock)' },
  { id: 'w2-ch7', route: 'Seaside & Camden', type: 'Drag', carRestriction: 'Mercedes-Benz SLR McLaren (No Junkman)' },
  { id: 'w2-ch8', route: 'Omega', type: 'Circuito', carRestriction: 'Ford Mustang GT (Stock)' }
];

const challengesRaw = [
  // Ch 0 [NFS World Loop]
  [
    [{ pilot: 'SRTxAvenger™', time: '04:58.750', bonus: 100, repMoney: 500000 }, { pilot: 'ZimanX', time: '05:04.500', bonus: 50, repMoney: 300000 }, { pilot: 'SRTxSigy', time: '00:00.000', bonus: 0, repMoney: 0 }],
    [{ pilot: 'Lea', time: '04:56.960', bonus: 100, repMoney: 500000 }, { pilot: 'xLeMondx', time: '05:00.600', bonus: 50, repMoney: 300000 }, { pilot: 'NFSMW', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'Shido', time: '05:02.300', bonus: 100, repMoney: 500000 }, { pilot: 'N6 xBourne', time: '05:22.380', bonus: 50, repMoney: 300000 }, { pilot: 'Flow.', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'DannyLove', time: '05:02.650', bonus: 100, repMoney: 500000 }, { pilot: 'Nebula', time: '05:09.830', bonus: 50, repMoney: 300000 }, { pilot: 'RazorV8', time: '--:--.---', bonus: 0, repMoney: 0 }]
  ],
  // Ch 1 [Highlands]
  [
    [{ pilot: 'SRTxAvenger™', time: '00:57.750', bonus: 100, repMoney: 460000 }, { pilot: 'ZimanX', time: '00:58.880', bonus: 50, repMoney: 280000 }, { pilot: 'SRTxSigy', time: '00:00.000', bonus: 0, repMoney: 0 }],
    [{ pilot: 'xLeMondx', time: '--:--.---', bonus: 0, repMoney: 0 }, { pilot: 'Lea', time: '--:--.---', bonus: 0, repMoney: 0 }, { pilot: 'NFSMW', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'Shido', time: '00:57.650', bonus: 100, repMoney: 460000 }, { pilot: 'N6 xBourne', time: '00:57.750', bonus: 50, repMoney: 280000 }, { pilot: 'Flow.', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'DannyLove', time: '00:57.960', bonus: 100, repMoney: 460000 }, { pilot: 'Nebula', time: '00:59.000', bonus: 50, repMoney: 280000 }, { pilot: 'RazorV8', time: '--:--.---', bonus: 0, repMoney: 0 }]
  ],
  // Ch 2 [Harbor & Ocean]
  [
    [{ pilot: 'ZimanX', time: '00:20.380', bonus: 100, repMoney: 400000 }, { pilot: 'SRTxAvenger™', time: '00:22.040', bonus: 50, repMoney: 240000 }, { pilot: 'SRTxSigy', time: '00:00.000', bonus: 0, repMoney: 0 }],
    [{ pilot: 'Lea', time: '--:--.---', bonus: 0, repMoney: 0 }, { pilot: 'xLeMondx', time: '--:--.---', bonus: 0, repMoney: 0 }, { pilot: 'NFSMW', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'N6 xBourne', time: '00:20.140', bonus: 100, repMoney: 400000 }, { pilot: 'Shido', time: '00:00.000', bonus: 0, repMoney: 240000 }, { pilot: 'Flow.', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'Nebula', time: '00:24.920', bonus: 100, repMoney: 400000 }, { pilot: 'DannyLove', time: '--:--.---', bonus: 0, repMoney: 240000 }, { pilot: 'RazorV8', time: '--:--.---', bonus: 0, repMoney: 0 }]
  ],
  // Ch 3 [Diamond & Unión]
  [
    [{ pilot: 'ZimanX', time: '01:43.720', bonus: 100, repMoney: 520000 }, { pilot: 'SRTxAvenger™', time: '01:44.170', bonus: 50, repMoney: 310000 }, { pilot: 'SRTxSigy', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'Lea', time: '01:44.000', bonus: 100, repMoney: 520000 }, { pilot: 'xLeMondx', time: '01:45.000', bonus: 50, repMoney: 310000 }, { pilot: 'NFSMW', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'Shido', time: '01:43.470', bonus: 100, repMoney: 520000 }, { pilot: 'N6 xBourne', time: '01:45.640', bonus: 50, repMoney: 310000 }, { pilot: 'Flow.', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'DannyLove', time: '01:43.670', bonus: 100, repMoney: 520000 }, { pilot: 'Nebula', time: '01:46.960', bonus: 50, repMoney: 310000 }, { pilot: 'RazorV8', time: '--:--.---', bonus: 0, repMoney: 0 }]
  ],
  // Ch 4 [Heritage Height]
  [
    [{ pilot: 'ZimanX', time: '01:12.930', bonus: 100, repMoney: 480000 }, { pilot: 'SRTxAvenger™', time: '01:14.850', bonus: 50, repMoney: 290000 }, { pilot: 'SRTxSigy', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'Lea', time: '--:--.---', bonus: 0, repMoney: 0 }, { pilot: 'xLeMondx', time: '--:--.---', bonus: 0, repMoney: 0 }, { pilot: 'NFSMW', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'Shido', time: '01:15.620', bonus: 100, repMoney: 480000 }, { pilot: 'N6 xBourne', time: '01:16.350', bonus: 50, repMoney: 290000 }, { pilot: 'Flow.', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'Nebula', time: '01:14.500', bonus: 100, repMoney: 480000 }, { pilot: 'DannyLove', time: '01:18.230', bonus: 50, repMoney: 290000 }, { pilot: 'RazorV8', time: '--:--.---', bonus: 0, repMoney: 0 }]
  ],
  // Ch 5 [Hwy 99 & States]
  [
    [{ pilot: 'SRTxAvenger™', time: '02:03.870', bonus: 100, repMoney: 510000 }, { pilot: 'ZimanX', time: '02:06.520', bonus: 50, repMoney: 310000 }, { pilot: 'SRTxSigy', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'Lea', time: '02:06.000', bonus: 100, repMoney: 510000 }, { pilot: 'xLeMondx', time: '02:07.000', bonus: 50, repMoney: 310000 }, { pilot: 'NFSMW', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'N6 xBourne', time: '02:13.290', bonus: 100, repMoney: 510000 }, { pilot: 'Shido', time: '02:14.529', bonus: 50, repMoney: 310000 }, { pilot: 'Por disputar', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'DannyLove', time: '02:06.390', bonus: 100, repMoney: 510000 }, { pilot: 'Nebula', time: '02:11.740', bonus: 50, repMoney: 310000 }, { pilot: 'RazorV8', time: '--:--.---', bonus: 0, repMoney: 0 }]
  ],
  // Ch 6 [Seaside & Camden]
  [
    [{ pilot: 'SRTxAvenger™', time: '00:16.010', bonus: 100, repMoney: 420000 }, { pilot: 'ZimanX', time: '00:00.000', bonus: 0, repMoney: 250000 }, { pilot: 'SRTxSigy', time: '00:00.000', bonus: 0, repMoney: 0 }],
    [{ pilot: 'xLeMondx', time: '--:--.---', bonus: 0, repMoney: 0 }, { pilot: 'Lea', time: '--:--.---', bonus: 0, repMoney: 0 }, { pilot: 'NFSMW', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'N6 xBourne', time: '00:16.460', bonus: 100, repMoney: 420000 }, { pilot: 'Shido', time: '00:00.000', bonus: 0, repMoney: 250000 }, { pilot: 'Flow.', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'Nebula', time: '00:17.540', bonus: 100, repMoney: 420000 }, { pilot: 'DannyLove', time: '--:--.---', bonus: 0, repMoney: 250000 }, { pilot: 'RazorV8', time: '--:--.---', bonus: 0, repMoney: 0 }]
  ],
  // Ch 7 [Omega]
  [
    [{ pilot: 'SRTxAvenger™', time: '01:32.270', bonus: 100, repMoney: 550000 }, { pilot: 'ZimanX', time: '01:34.520', bonus: 50, repMoney: 330000 }, { pilot: 'SRTxSigy', time: '00:00.000', bonus: 0, repMoney: 0 }],
    [{ pilot: 'Lea', time: '--:--.---', bonus: 0, repMoney: 0 }, { pilot: 'xLeMondx', time: '--:--.---', bonus: 0, repMoney: 0 }, { pilot: 'NFSMW', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'Nebula', time: '01:33.140', bonus: 100, repMoney: 550000 }, { pilot: 'xLeMondx', time: '01:37.770', bonus: 50, repMoney: 330000 }, { pilot: 'Flow.', time: '--:--.---', bonus: 0, repMoney: 0 }],
    [{ pilot: 'DannyLove', time: '01:35.040', bonus: 100, repMoney: 550000 }, { pilot: 'Nebula', time: '01:36.040', bonus: 50, repMoney: 330000 }, { pilot: 'RazorV8', time: '--:--.---', bonus: 0, repMoney: 0 }]
  ]
];

function formatBadge(bonus, pos) {
  if (bonus === 100) return '🥇 +100 PTS';
  if (bonus === 50) return '🥈 +50 PTS';
  if (bonus === 20) return '🥉 +20 PTS';
  return '0 PTS';
}

function formatRepBadge(rep) {
  if (!rep || rep <= 0) return '$0 REP';
  const thousands = Math.floor(rep / 1000);
  return '💰 $' + thousands.toLocaleString('es-ES') + '.000 REP';
}

const w2Challenges = challengesDefs.map((def, cIdx) => {
  const groupsResults = {};
  const groupsWinners = {};
  const chData = challengesRaw[cIdx];
  chData.forEach((grpList, gIdx) => {
    const grpName = groupNames[gIdx];
    const top3 = grpList.map((e, pos) => {
      const pInfo = pilotMeta[e.pilot] || { rank: null, car: '' };
      return {
        rank: pInfo.rank,
        pilot: e.pilot,
        car: pInfo.car,
        time: e.time,
        bonus: e.bonus,
        badge: formatBadge(e.bonus, pos),
        repMoney: e.repMoney,
        repBadge: formatRepBadge(e.repMoney)
      };
    });
    groupsResults[gIdx] = top3;
    groupsResults[grpName] = top3;
    groupsWinners[gIdx] = top3;
    groupsWinners[grpName] = top3;
  });
  return {
    id: def.id,
    route: def.route,
    type: def.type,
    carRestriction: def.carRestriction,
    top3: groupsResults[0],
    groupsResults: groupsResults,
    groupsWinners: groupsWinners
  };
});

const restoredW2 = {
  weekNumber: 2,
  title: 'Semana 2: Rotación de Tríos & Duelos de Velocidad (10 - 16 Oct)',
  dates: '10 Oct 2026 - 16 Oct 2026',
  groups: [
    { name: 'Grupo Alfa (Velocidad Pura)', pilots: [1, 5, 13], tag: '🔥 TIER SUPREME' },
    { name: 'Grupo Beta (Duelo Callejero)', pilots: [4, 8, 9], tag: '⚡ TIER HIGH' },
    { name: 'Grupo Gama (Fuerza & Asfalto)', pilots: [10, 6, 14], tag: '⚔️ TIER MID-HIGH' },
    { name: 'Grupo Delta (Competición & Desafío)', pilots: [7, 3, 11], tag: '🏁 TIER COMPETICIÓN' }
  ],
  challenges: w2Challenges
};

// Update src/blacklist-data.js and assets/js/blacklist-data.js
function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find start of Week 2: "2": {
  const w2StartStr = '"2": {';
  const w2StartIdx = content.indexOf(w2StartStr);
  if (w2StartIdx === -1) throw new Error('Could not find "2": { in ' + filePath);
  
  // Find start of Week 3: "3": {
  const w3StartStr = '"3": {';
  const w3StartIdx = content.indexOf(w3StartStr, w2StartIdx);
  if (w3StartIdx === -1) throw new Error('Could not find "3": { in ' + filePath);
  
  // Find the comma before "3": {
  const lastCommaBeforeW3 = content.lastIndexOf(',', w3StartIdx);
  
  const w2JSON = JSON.stringify(restoredW2, null, 4);
  // Indent by 4 spaces
  const indentedW2 = w2JSON.split('\n').map((line, idx) => idx === 0 ? line : '    ' + line).join('\n');
  
  const newContent = content.substring(0, w2StartIdx) + '"2": ' + indentedW2 + content.substring(lastCommaBeforeW3);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Successfully updated', filePath);
}

updateFile('src/blacklist-data.js');
updateFile('assets/js/blacklist-data.js');

// Now re-require and upload to Firebase RTDB
async function uploadToFirebase() {
  delete require.cache[require.resolve('../src/blacklist-data.js')];
  const { CHAMPIONSHIP_WEEKS_DATA } = require('../src/blacklist-data.js');
  
  // Verify week 2 in CHAMPIONSHIP_WEEKS_DATA
  const w2 = CHAMPIONSHIP_WEEKS_DATA['2'];
  console.log('Verified Week 2 groups:', JSON.stringify(w2.groups));
  console.log('Verified Week 2 ch0 G0:', JSON.stringify(w2.challenges[0].groupsResults[0]));
  
  // Upload to /records/championship_weeks_data.json
  const res1 = await fetch('https://nfsranks-blacklist-default-rtdb.firebaseio.com/records/championship_weeks_data.json', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(CHAMPIONSHIP_WEEKS_DATA)
  });
  console.log('PUT /records/championship_weeks_data.json:', res1.status);
  
  const res2 = await fetch('https://nfsranks-blacklist-default-rtdb.firebaseio.com/championship/weeks_data.json', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(CHAMPIONSHIP_WEEKS_DATA)
  });
  console.log('PUT /championship/weeks_data.json:', res2.status);
}

uploadToFirebase().catch(e => {
  console.error('Upload error:', e);
  process.exit(1);
});
