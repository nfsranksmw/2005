const { CHAMPIONSHIP_WEEKS_DATA, DEFAULT_BLACKLIST_DRIVERS } = require('../src/blacklist-data.js');

function isZeroOrNullTime(timeStr) {
  if (!timeStr) return true;
  const clean = String(timeStr).trim().toUpperCase();
  if (clean === '' || clean === '--:--.---' || clean === '--:--:--' || clean === '--:--' || clean === '--' || clean === '-' ||
      clean === '00:00.000' || clean === '00:00:00' || clean === '00:00' || clean === '0:00.000' || clean === '0:00:00' ||
      clean === '0' || clean === '0.0' || clean === '00.00' ||
      clean === 'DNS' || clean === 'DNF' || clean === 'DSQ' || clean === 'TBD' ||
      clean === 'NULO' || clean === 'NULL' || clean === 'NONE' || clean === 'POR DISPUTAR' || clean === 'EN ESPERA') {
    return true;
  }
  const digitsOnly = clean.replace(/[^0-9]/g, '');
  if (digitsOnly.length > 0 && digitsOnly.split('').every(ch => ch === '0')) {
    return true;
  }
  return false;
}

const drivers = JSON.parse(JSON.stringify(DEFAULT_BLACKLIST_DRIVERS));
const driverMap = {};

drivers.forEach(d => {
  d.computedVictories = { p1: 0, p2: 0, p3: 0, p4: 0 };
  d.computedBestTimes = { first: 0, second: 0, third: 0 };
  d.computedBonus = 0;
  d.computedRep = 0;
  d.hasWeeklyParticipation = false;
  d.w1 = { p1: 0, p2: 0, p3: 0, p4: 0, bonus: 0, rep: 0, events: 0 };
  d.w2 = { p1: 0, p2: 0, p3: 0, p4: 0, bonus: 0, rep: 0, events: 0 };
  driverMap[d.alias.toLowerCase()] = d;
  driverMap[d.name.toLowerCase()] = d;
});

function findDriver(name) {
  if (!name) return null;
  const n = name.trim().toLowerCase();
  for (let k of Object.keys(driverMap)) {
    if (k === n) return driverMap[k];
  }
  for (let k of Object.keys(driverMap)) {
    if (k.includes(n) || n.includes(k)) return driverMap[k];
  }
  return null;
}

['1', '2'].forEach(wKey => {
  const week = CHAMPIONSHIP_WEEKS_DATA[wKey];
  week.challenges.forEach(ch => {
    const groups = ch.groupsResults || {};
    Object.keys(groups).forEach(gKey => {
      const gResults = groups[gKey];
      if (Array.isArray(gResults)) {
        gResults.forEach((entry, posIdx) => {
          if (!entry || !entry.pilot || entry.pilot === 'Por disputar' || entry.pilot.startsWith('Plaza') || entry.pilot.startsWith('open_')) return;
          const d = findDriver(entry.pilot);
          if (!d) return;

          const time = (entry.time || '').trim();
          const isNullTime = isZeroOrNullTime(time);

          let bVal = 0;
          if (!isNullTime) {
            if (entry.bonus !== undefined && entry.bonus !== null && entry.bonus !== '') {
              const parsedB = parseInt(entry.bonus, 10);
              bVal = (!isNaN(parsedB) && parsedB >= 1) ? parsedB : 0;
            } else {
              bVal = posIdx === 0 ? 100 : (posIdx === 1 ? 50 : (posIdx === 2 ? 20 : 0));
            }
          }

          let rVal = 0;
          if (entry.repMoney !== undefined && entry.repMoney !== null && entry.repMoney !== '') {
            const parsedR = parseInt(entry.repMoney, 10);
            rVal = (!isNaN(parsedR) && parsedR >= 1) ? parsedR : 0;
          } else if (entry.rep !== undefined && entry.rep !== null && entry.rep !== '') {
            const parsedR = parseInt(entry.rep, 10);
            rVal = (!isNaN(parsedR) && parsedR >= 1) ? parsedR : 0;
          }

          const hasValidResult = (!isNullTime) || (rVal > 0) || (bVal > 0);
          if (!hasValidResult) return;

          d.hasWeeklyParticipation = true;
          const wObj = wKey === '1' ? d.w1 : d.w2;
          wObj.events++;

          if (bVal > 0) {
            d.computedBonus += bVal;
            wObj.bonus += bVal;
          }
          if (rVal > 0) {
            d.computedRep += rVal;
            wObj.rep += rVal;
          }

          if (posIdx === 0) {
            d.computedVictories.p1++;
            wObj.p1++;
            if (bVal > 0 || !isNullTime) d.computedBestTimes.first++;
          } else if (posIdx === 1) {
            d.computedVictories.p2++;
            wObj.p2++;
            if (bVal > 0 || !isNullTime) d.computedBestTimes.second++;
          } else if (posIdx === 2) {
            d.computedVictories.p3++;
            wObj.p3++;
            if (bVal > 0 || !isNullTime) d.computedBestTimes.third++;
          } else if (posIdx === 3) {
            d.computedVictories.p4++;
            wObj.p4++;
          }
        });
      }
    });
  });
});

console.log('=============================================================================');
console.log('STRICT DISPUTED AUDIT: WEEKS 1 & 2 ONLY (NULL/DNS EXCLUDED)');
console.log('=============================================================================');

drivers.forEach(d => {
  const v = d.computedVictories;
  const p1Pts = (v.p1 || 0) * 25;
  const p2Pts = (v.p2 || 0) * 18;
  const p3Pts = (v.p3 || 0) * 15;
  const p4Pts = (v.p4 || 0) * 12;
  const bonusPts = d.computedBonus || 0;
  const repPts = Math.floor((d.computedRep || 0) / 10000);
  const totalScore = p1Pts + p2Pts + p3Pts + p4Pts + bonusPts + repPts;
  d.score = totalScore;
  console.log(`${d.alias.padEnd(16)} | P1: ${String(v.p1).padStart(2)} | P2: ${String(v.p2).padStart(2)} | P3: ${String(v.p3).padStart(2)} | P4: ${String(v.p4).padStart(2)} | Bonus: ${String(bonusPts).padStart(4)} | REP: $${d.computedRep.toLocaleString().padStart(10)} (${String(repPts).padStart(4)} pts) | TOTAL: ${String(totalScore).padStart(5)} PTS`);
  console.log(`   └─ W1: P1:${d.w1.p1} P2:${d.w1.p2} P3:${d.w1.p3} | Bonus:${d.w1.bonus} | REP:$${d.w1.rep.toLocaleString()} | Events:${d.w1.events}`);
  console.log(`   └─ W2: P1:${d.w2.p1} P2:${d.w2.p2} P3:${d.w2.p3} | Bonus:${d.w2.bonus} | REP:$${d.w2.rep.toLocaleString()} | Events:${d.w2.events}`);
});

drivers.sort((a, b) => b.score - a.score);
console.log('\n=== CLASIFICACIÓN OFICIAL STANDINGS (SEMANAS 1 Y 2 SOLAMENTE) ===');
drivers.forEach((d, i) => {
  console.log(`#${String(i+1).padStart(2)} ${d.alias.padEnd(16)} - ${d.score} PTS | P1:${d.computedVictories.p1} P2:${d.computedVictories.p2} P3:${d.computedVictories.p3} | REP: $${d.computedRep.toLocaleString()}`);
});
