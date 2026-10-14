const fs = require('fs');

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

// Reset counters
drivers.forEach(d => {
    d.victories = { p1: 0, p2: 0, p3: 0, p4: 0 };
    d.bestTimes = { first: 0, second: 0, third: 0 };
    d.bonusPoints = 0;
    d.rep = 0;
});

const matchDriver = (pilotStr) => {
    if (!pilotStr || pilotStr === 'Por disputar' || pilotStr === 'En espera') return null;
    const clean = String(pilotStr).trim().toLowerCase();
    const num = parseInt(clean, 10);
    if (!isNaN(num) && String(num) === clean) {
        return drivers.find(d => d.rank === num);
    }
    let found = drivers.find(d => 
        (d.alias && d.alias.trim().toLowerCase() === clean) ||
        (d.name && d.name.trim().toLowerCase() === clean)
    );
    if (found) return found;

    found = drivers.find(d => {
        const dAlias = (d.alias || '').trim().toLowerCase();
        const dName = (d.name || '').trim().toLowerCase();
        if (dAlias && (clean.includes(dAlias) || dAlias.includes(clean))) return true;
        if (dName && (clean.includes(dName) || dName.includes(clean))) return true;
        return false;
    });
    return found || null;
};

// Scan weeks 1 and 2
['1', '2'].forEach(wKey => {
    const wData = CHAMPIONSHIP_WEEKS_DATA[wKey];
    if (!wData || !Array.isArray(wData.challenges)) return;

    wData.challenges.forEach(ch => {
        let groupsToProcess = [];
        if (Array.isArray(wData.groups) && wData.groups.length > 0) {
            for (let grpIdx = 0; grpIdx < wData.groups.length; grpIdx++) {
                const grp = wData.groups[grpIdx];
                const grpName = grp.name || ('Grupo #' + (grpIdx + 1));
                let grpTop3 = null;
                if (ch.groupsWinners) {
                    grpTop3 = ch.groupsWinners[grpIdx] || ch.groupsWinners[grpName] || ch.groupsWinners[String(grpIdx)];
                }
                if (!grpTop3 && ch.groupsResults) {
                    grpTop3 = ch.groupsResults[grpName] || ch.groupsResults[grpIdx] || ch.groupsResults[String(grpIdx)];
                }
                if (!grpTop3 && grpIdx === 0 && Array.isArray(ch.top3)) {
                    grpTop3 = ch.top3;
                }
                if (Array.isArray(grpTop3) && grpTop3.length > 0) {
                    groupsToProcess.push(grpTop3);
                }
            }
        }

        groupsToProcess.forEach(top3List => {
            if (!Array.isArray(top3List)) return;

            top3List.forEach((entry, posIdx) => {
                if (!entry || !entry.pilot || entry.pilot === 'Por disputar' || entry.pilot === 'En espera' || entry.pilot.toLowerCase().startsWith('plaza disponible')) return;
                const d = matchDriver(entry.pilot);
                if (!d) return;

                const time = (entry.time || '').trim();
                const isNullTime = isZeroOrNullTime(time);

                let bVal = 0;
                if (!isNullTime) {
                    if (entry.bonus !== undefined && entry.bonus !== null && entry.bonus !== '') {
                        const parsedB = parseInt(entry.bonus, 10);
                        bVal = (!isNaN(parsedB) && parsedB >= 1) ? parsedB : 0;
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

                if (bVal > 0) d.bonusPoints = (d.bonusPoints || 0) + bVal;
                if (rVal > 0) d.rep = (d.rep || 0) + rVal;

                if (posIdx === 0) {
                    d.victories.p1 = (d.victories.p1 || 0) + 1;
                    if (bVal > 0 || !isNullTime) d.bestTimes.first = (d.bestTimes.first || 0) + 1;
                } else if (posIdx === 1) {
                    d.victories.p2 = (d.victories.p2 || 0) + 1;
                    if (bVal > 0 || !isNullTime) d.bestTimes.second = (d.bestTimes.second || 0) + 1;
                } else if (posIdx === 2) {
                    d.victories.p3 = (d.victories.p3 || 0) + 1;
                    if (bVal > 0 || !isNullTime) d.bestTimes.third = (d.bestTimes.third || 0) + 1;
                } else if (posIdx === 3) {
                    d.victories.p4 = (d.victories.p4 || 0) + 1;
                }
            });
        });
    });
});

drivers.forEach(d => {
    const v = d.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
    const p1Pts = (v.p1 || 0) * 25;
    const p2Pts = (v.p2 || 0) * 18;
    const p3Pts = (v.p3 || 0) * 15;
    const p4Pts = (v.p4 || 0) * 12;
    const bonusPts = (typeof d.bonusPoints === 'number') ? d.bonusPoints : 0;
    const repPts = Math.floor((d.rep || 0) / 10000);
    d.points = p1Pts + p2Pts + p3Pts + p4Pts + bonusPts + repPts;
    d.totalPts = d.points;
    d.totalScore = d.points;
});

function updateDriversInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const startStr = 'const DEFAULT_BLACKLIST_DRIVERS = [';
    const startIdx = content.indexOf(startStr);
    if (startIdx === -1) throw new Error('Could not find DEFAULT_BLACKLIST_DRIVERS in ' + filePath);
    
    const champIdx = content.indexOf('const CHAMPIONSHIP_WEEKS_DATA');
    const lastBracket = content.lastIndexOf('];', champIdx);
    if (lastBracket === -1) throw new Error('Could not find end bracket of DEFAULT_BLACKLIST_DRIVERS in ' + filePath);
    
    const driversJSON = JSON.stringify(drivers, null, 4);
    const newContent = content.substring(0, startIdx) + 'const DEFAULT_BLACKLIST_DRIVERS = ' + driversJSON + ';' + content.substring(lastBracket + 2);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated DEFAULT_BLACKLIST_DRIVERS in', filePath);
}

updateDriversInFile('src/blacklist-data.js');
updateDriversInFile('assets/js/blacklist-data.js');

async function uploadDrivers() {
    const res = await fetch('https://nfsranks-blacklist-default-rtdb.firebaseio.com/records/blacklist_championship_2026.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(drivers)
    });
    console.log('PUT /records/blacklist_championship_2026.json:', res.status);
    
    const res2 = await fetch('https://nfsranks-blacklist-default-rtdb.firebaseio.com/championship/blacklist_drivers.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(drivers)
    });
    console.log('PUT /championship/blacklist_drivers.json:', res2.status);
}

uploadDrivers().catch(console.error);
