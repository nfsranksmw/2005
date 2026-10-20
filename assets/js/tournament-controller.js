/**
 * NFSMW RANKS // Tournament & Blacklist Controller
 * Pixel-perfect adaptation of Google Stitch:
 * 1. 'nfsmw_ranks_blacklist_event_2026_grupos_desaf_os' (Groups & Weekly Challenges)
 * 2. 'nfsmw_ranks_blacklist_2026_standings' (Championship Standings)
 * Synchronized with live Firebase Realtime Database
 */

(function () {
  const FIREBASE_WEEKS_URL = "https://nfsranks-blacklist-default-rtdb.firebaseio.com/records/championship_weeks_data.json";
  const FIREBASE_CHAMPIONSHIP_DRIVERS_URL = "https://nfsranks-blacklist-default-rtdb.firebaseio.com/records/blacklist_championship_2026.json";
  const FIREBASE_PARTICIPANTS_URL = "https://nfsranks-blacklist-default-rtdb.firebaseio.com/championship_participants.json";
  const STORAGE_KEY = 'nfs_championship_weeks_data_v4';
  const CHAMP_DRIVERS_STORAGE_KEY_V6 = 'nfs_blacklist_championship_2026_v6';
  const CHAMP_DRIVERS_STORAGE_KEY_V5 = 'nfs_blacklist_championship_2026_v5';
  const CHAMP_DRIVERS_STORAGE_KEY_V4 = 'nfs_blacklist_championship_2026_v4';

  // State Management
  let activeWeekIndex = 1; // 0 = Week 1, 1 = Week 2, 2 = Week 3, 3 = Week 4
  let currentChampionshipGroupTab = 0; // 0 = Alpha, 1 = Beta, 2 = Gamma, 3 = Delta
  let standingsSearchQuery = '';
  let standingsGroupFilter = 'all';
  let standingsWeekFilter = 'all'; // 'all' | '1' | '2' | '3' | '4'
  let standingsSortMode = 'points'; // 'points' | 'rep' | 'victories'

  let championshipWeeks = [];
  let driversData = [];

  /**
   * Helper: returns the currently selected week safely
   */
  function getActiveWeek() {
    if (!Array.isArray(championshipWeeks) || championshipWeeks.length === 0) return null;
    const targetNum = activeWeekIndex + 1;
    const byNum = championshipWeeks.find(w => w && w.weekNumber === targetNum);
    if (byNum) return byNum;
    return championshipWeeks[activeWeekIndex] || championshipWeeks[0] || null;
  }

  /**
   * Helper: Resolves the official restricted vehicle for a given week and challenge
   */
  function getChallengeCarRestriction(weekNum, ch) {
    if (ch && ch.carRestriction && ch.carRestriction.trim()) {
      return ch.carRestriction.trim();
    }
    // Fallback from CHAMPIONSHIP_WEEKS_DATA if present
    const fallbackWeeks = (typeof window !== 'undefined' && window.CHAMPIONSHIP_WEEKS_DATA)
      ? window.CHAMPIONSHIP_WEEKS_DATA
      : (typeof CHAMPIONSHIP_WEEKS_DATA !== 'undefined' ? CHAMPIONSHIP_WEEKS_DATA : null);
    if (fallbackWeeks) {
      const fWeek = fallbackWeeks[weekNum] || fallbackWeeks[String(weekNum)] || Object.values(fallbackWeeks)[weekNum - 1];
      if (fWeek && Array.isArray(fWeek.challenges)) {
        const match = fWeek.challenges.find(c => (c.route || '').toLowerCase() === (ch.route || '').toLowerCase() || c.id === ch.id);
        if (match && match.carRestriction) return match.carRestriction.trim();
      }
    }
    return 'Libre / Stock';
  }

  /**
   * Official Point Calculation Formula:
   * PTS = (P1 * 25) + (P2 * 18) + (P3 * 15) + (P4 * 12) +
   *       (1º Mejores * 100) + (2º Mejores * 50) + (3º Mejores * 20) +
   *       Math.floor(REP / 10000)
   */
  function calculateDriverPoints(driver) {
    if (!driver) return 0;
    const v = driver.computedVictories || driver.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
    const bt = driver.computedBestTimes || driver.bestTimes || { first: 0, second: 0, third: 0 };
    const p1Pts = (v.p1 || 0) * 25;
    const p2Pts = (v.p2 || 0) * 18;
    const p3Pts = (v.p3 || 0) * 15;
    const p4Pts = (v.p4 || 0) * 12;
    const bonusPts = (typeof driver.computedBonus === 'number')
      ? driver.computedBonus
      : ((typeof driver.bonusPoints === 'number')
        ? driver.bonusPoints
        : (((bt.first || 0) * 100) + ((bt.second || 0) * 50) + ((bt.third || 0) * 20)));
    const repVal = (typeof driver.computedRep === 'number') ? driver.computedRep : (driver.rep || 0);
    const repPts = Math.floor(repVal / 10000);
    return p1Pts + p2Pts + p3Pts + p4Pts + bonusPts + repPts;
  }

  /**
   * Fetch and synchronize championship data with Firebase RTDB and Admin Storage
   */
  async function loadTournamentData() {
    // 1. Initialize drivers from local cache or fallback
    try {
      const cachedDrivers = localStorage.getItem(CHAMP_DRIVERS_STORAGE_KEY_V6) || localStorage.getItem(CHAMP_DRIVERS_STORAGE_KEY_V5) || localStorage.getItem(CHAMP_DRIVERS_STORAGE_KEY_V4);
      if (cachedDrivers) {
        const parsed = JSON.parse(cachedDrivers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          driversData = parsed;
        } else if (parsed && typeof parsed === 'object') {
          driversData = Object.values(parsed);
        }
      }
    } catch (e) {}

    if (!driversData || driversData.length === 0) {
      if (typeof window !== 'undefined' && window.DEFAULT_BLACKLIST_DRIVERS) {
        driversData = JSON.parse(JSON.stringify(window.DEFAULT_BLACKLIST_DRIVERS));
      } else if (typeof DEFAULT_BLACKLIST_DRIVERS !== 'undefined') {
        driversData = JSON.parse(JSON.stringify(DEFAULT_BLACKLIST_DRIVERS));
      }
    }

    // 2. Load championship weeks from localStorage cache
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          championshipWeeks = parsed;
        } else if (parsed && typeof parsed === 'object') {
          championshipWeeks = Object.values(parsed);
        }
      }
    } catch (e) {}

    // 3. Fallback from local data if still empty
    if (!championshipWeeks || (Array.isArray(championshipWeeks) && championshipWeeks.length === 0)) {
      if (typeof window !== 'undefined' && window.CHAMPIONSHIP_WEEKS_DATA) {
        championshipWeeks = JSON.parse(JSON.stringify(window.CHAMPIONSHIP_WEEKS_DATA));
      } else if (typeof CHAMPIONSHIP_WEEKS_DATA !== 'undefined') {
        championshipWeeks = JSON.parse(JSON.stringify(CHAMPIONSHIP_WEEKS_DATA));
      }
      if (championshipWeeks && !Array.isArray(championshipWeeks) && typeof championshipWeeks === 'object') {
        championshipWeeks = Object.values(championshipWeeks);
      }
    }

    // 4. Fetch live from Firebase RTDB (Championship Drivers, Weeks Data & Registered Participants)
    try {
      const [resWeeks, resDrivers, resParts] = await Promise.all([
        fetch(`${FIREBASE_WEEKS_URL}?_t=${Date.now()}`, { cache: 'no-store' }),
        fetch(`${FIREBASE_CHAMPIONSHIP_DRIVERS_URL}?_t=${Date.now()}`, { cache: 'no-store' }).catch(() => null),
        fetch(`${FIREBASE_PARTICIPANTS_URL}?_t=${Date.now()}`, { cache: 'no-store' }).catch(() => null)
      ]);

      if (resWeeks && resWeeks.ok) {
        const liveData = await resWeeks.json();
        if (liveData) {
          let parsedWeeks = Array.isArray(liveData) ? liveData : Object.values(liveData);
          parsedWeeks = parsedWeeks.filter(Boolean);
          if (parsedWeeks.length > 0) {
            parsedWeeks.sort((a, b) => (a.weekNumber || 0) - (b.weekNumber || 0));
            parsedWeeks.forEach(w => {
              if (w && Array.isArray(w.challenges)) {
                w.challenges.forEach(ch => {
                  ch.carRestriction = getChallengeCarRestriction(w.weekNumber, ch);
                });
              }
            });
            championshipWeeks = parsedWeeks;
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(championshipWeeks));
            } catch (e) {}
          }
        }
      }

      if (resDrivers && resDrivers.ok) {
        const liveDrivers = await resDrivers.json();
        if (liveDrivers) {
          const parsed = Array.isArray(liveDrivers) ? liveDrivers : Object.values(liveDrivers);
          if (parsed.length > 0) {
            driversData = parsed.filter(Boolean);
            try {
              localStorage.setItem(CHAMP_DRIVERS_STORAGE_KEY_V6, JSON.stringify(driversData));
            } catch (e) {}
          }
        }
      }

      if (resParts && resParts.ok) {
        const partsData = await resParts.json();
        if (partsData && typeof partsData === 'object') {
          const registeredList = Object.values(partsData);
          registeredList.forEach(p => {
            if (!p || !p.alias) return;
            const existing = driversData.find(d => (d.alias && d.alias.toLowerCase() === p.alias.toLowerCase()) || (d.name && d.name.toLowerCase() === p.alias.toLowerCase()));
            if (!existing) {
              driversData.push({
                rank: driversData.length + 1,
                name: p.alias,
                alias: p.alias,
                ride: p.ride || 'Porsche Carrera GT',
                car: p.ride || 'Porsche Carrera GT',
                rep: 1000000,
                totalScore: 0,
                points: 0,
                totalPts: 0,
                victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
                bestTimes: { first: 0, second: 0, third: 0 }
              });
            }
          });
        }
      }
    } catch (err) {
      console.warn("Aviso: No se pudo conectar a Firebase RTDB para Championship Data:", err);
    }

    // Ensure array structure
    if (!Array.isArray(championshipWeeks)) {
      championshipWeeks = Object.values(championshipWeeks || {});
    }

    // Normalizar pilotos y consolidar puntajes
    syncDriversWithChallengeResults();
  }

  /**
   * Determina si una marca de tiempo representa una participación nula o no registrada:
   * cadenas vacías, marcadores de posición ("--:--.---", "DNS", "DNF", "TBD"),
   * o ceros absolutos ("00:00:00", "00:00.000", "0:00.000", "0", etc.).
   */
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

  /**
   * Sync challenge victories and best times into driver objects across ALL groups (Alfa, Beta, Gama, Delta...)
   * Criterio estricto: Tiempos nulos/00:00:00, 0 bonos y 0 dinero REP no suman puntos a la tabla ni a Race Group ni a Standings.
   */
  function syncDriversWithChallengeResults(targetWeekFilter = standingsWeekFilter) {
    if (!Array.isArray(driversData) || driversData.length === 0) return;

    // Reset weekly counters before re-aggregating
    driversData.forEach(d => {
      d.computedVictories = { p1: 0, p2: 0, p3: 0, p4: 0 };
      d.computedBestTimes = { first: 0, second: 0, third: 0 };
      d.computedBonus = 0;
      d.computedRep = 0;
      d.hasWeeklyParticipation = false;
    });

    // Filtrar semanas según el filtro de la tabla de Standings
    // Regla Oficial Blacklist 2026: Exclusivamente las semanas 1 y 2 están en curso (disputadas).
    // Las semanas 3 y 4 aún no están en curso y NO se contabilizan en la general acumulada
    // hasta que el comisario registre sus eventos desde admin.html en sus fechas.
    const weeksToScan = championshipWeeks.filter((week, idx) => {
      if (!week) return false;
      const wNum = parseInt(week.weekNumber || (idx + 1), 10);
      if (!targetWeekFilter || targetWeekFilter === 'all') {
        // En la general acumulada ('all'), únicamente escanear semanas 1 y 2 que están en curso.
        // Si semana 3 o 4 tiene desafíos disputados reales guardados desde admin.html, se incluirán dinámicamente.
        if (wNum <= 2) return true;
        const hasDisputedEvents = Array.isArray(week.challenges) && week.challenges.some(ch => {
          const map = ch.groupsResults || ch.groupsWinners;
          if (map && typeof map === 'object') {
            return Object.values(map).some(grp => Array.isArray(grp) && grp.some(entry => entry && entry.pilot && entry.pilot !== 'Por disputar' && !isZeroOrNullTime(entry.time)));
          }
          return false;
        });
        return hasDisputedEvents;
      }
      return String(wNum) === String(targetWeekFilter);
    });

    // Scan selected weeks challenges for victories, best times, bonus points, and rep money
    weeksToScan.forEach(week => {
      if (!week || !Array.isArray(week.challenges)) return;

      week.challenges.forEach(ch => {
        if (!ch) return;

        let groupsToProcess = [];
        if (Array.isArray(week.groups) && week.groups.length > 0) {
          week.groups.forEach((grp, gIdx) => {
            const grpName = grp.name || `Grupo #${gIdx + 1}`;
            let grpTop3 = null;
            if (ch.groupsWinners) {
              grpTop3 = ch.groupsWinners[gIdx] || ch.groupsWinners[grpName] || ch.groupsWinners[String(gIdx)];
            }
            if (!grpTop3 && ch.groupsResults) {
              grpTop3 = ch.groupsResults[grpName] || ch.groupsResults[gIdx] || ch.groupsResults[String(gIdx)];
            }
            if (!grpTop3 && gIdx === 0 && Array.isArray(ch.top3)) {
              grpTop3 = ch.top3;
            }
            if (Array.isArray(grpTop3) && grpTop3.length > 0) {
              groupsToProcess.push(grpTop3);
            }
          });
        }

        if (groupsToProcess.length === 0) {
          const sourceMap = ch.groupsWinners || ch.groupsResults;
          if (sourceMap && typeof sourceMap === 'object') {
            const numKeys = Object.keys(sourceMap).filter(k => !isNaN(parseInt(k, 10)));
            const targetKeys = numKeys.length > 0 ? numKeys : Object.keys(sourceMap);
            targetKeys.forEach(k => {
              if (Array.isArray(sourceMap[k]) && sourceMap[k].length > 0) {
                groupsToProcess.push(sourceMap[k]);
              }
            });
          } else if (Array.isArray(ch.top3)) {
            groupsToProcess.push(ch.top3);
          }
        }

        groupsToProcess.forEach(top3List => {
          if (!Array.isArray(top3List)) return;

          top3List.forEach((entry, posIdx) => {
            if (!entry || !entry.pilot) return;
            const pilotName = String(entry.pilot).trim();
            if (pilotName === '' || pilotName === 'Por disputar' || pilotName === 'En espera' || pilotName.toLowerCase().startsWith('plaza disponible')) return;

            const d = findDriverByAlias(pilotName);
            if (!d) return;

            const time = (entry.time || '').trim();
            const isNullTime = isZeroOrNullTime(time);

            // 1. Bono Puntos: ÚNICAMENTE se suman si el tiempo está registrado (no nulo) y el valor es >= 1.
            let bVal = 0;
            if (!isNullTime) {
              if (entry.bonus !== undefined && entry.bonus !== null && entry.bonus !== '') {
                const parsedB = parseInt(entry.bonus, 10);
                bVal = (!isNaN(parsedB) && parsedB >= 1) ? parsedB : 0;
              } else {
                bVal = posIdx === 0 ? 100 : (posIdx === 1 ? 50 : (posIdx === 2 ? 20 : 0));
              }
            }

            // 2. Recompensa REP (Dinero): Anclada a la posición del jugador (Oro, Silver, Bronce, Zinc).
            let rVal = 0;
            if (entry.repMoney !== undefined && entry.repMoney !== null && entry.repMoney !== '') {
              const parsedR = parseInt(entry.repMoney, 10);
              rVal = (!isNaN(parsedR) && parsedR >= 1) ? parsedR : 0;
            } else if (entry.rep !== undefined && entry.rep !== null && entry.rep !== '') {
              const parsedR = parseInt(entry.rep, 10);
              rVal = (!isNaN(parsedR) && parsedR >= 1) ? parsedR : 0;
            }

            // Validar si este puesto realmente participó / fue disputado.
            const hasValidResult = (!isNullTime) || (rVal > 0) || (bVal > 0);
            if (!hasValidResult) return;

            d.hasWeeklyParticipation = true;

            // Sumar bono puntos (solo si hay tiempo registrado y bVal >= 1)
            if (bVal > 0) d.computedBonus = (d.computedBonus || 0) + bVal;

            // Sumar dinero REP (anclado a la posición, rVal >= 1)
            if (rVal > 0) d.computedRep = (d.computedRep || 0) + rVal;

            if (posIdx === 0) {
              d.computedVictories.p1++;
              if (bVal > 0 || !isNullTime) d.computedBestTimes.first++;
            } else if (posIdx === 1) {
              d.computedVictories.p2++;
              if (bVal > 0 || !isNullTime) d.computedBestTimes.second++;
            } else if (posIdx === 2) {
              d.computedVictories.p3++;
              if (bVal > 0 || !isNullTime) d.computedBestTimes.third++;
            } else if (posIdx === 3) {
              d.computedVictories.p4++;
            }
          });
        });
      });
    });

    // Consolidar puntajes oficiales para cada piloto
    driversData.forEach(d => {
      if (d.hasWeeklyParticipation) {
        const v = d.computedVictories;
        const p1Pts = (v.p1 || 0) * 25;
        const p2Pts = (v.p2 || 0) * 18;
        const p3Pts = (v.p3 || 0) * 15;
        const p4Pts = (v.p4 || 0) * 12;
        const bonusPts = d.computedBonus || 0;
        const repPts = Math.floor((d.computedRep || 0) / 10000);
        d.totalScore = p1Pts + p2Pts + p3Pts + p4Pts + bonusPts + repPts;
        d.points = d.totalScore;
        d.totalPts = d.totalScore;
        d.victories = d.computedVictories;
        d.bestTimes = d.computedBestTimes;
        d.rep = d.computedRep;
        d.bonusPoints = d.computedBonus;
      } else if (targetWeekFilter && targetWeekFilter !== 'all') {
        // En una semana específica sin participación, los puntajes son 0
        d.totalScore = 0;
        d.points = 0;
        d.totalPts = 0;
        d.victories = { p1: 0, p2: 0, p3: 0, p4: 0 };
        d.bestTimes = { first: 0, second: 0, third: 0 };
        d.rep = 0;
        d.bonusPoints = 0;
      } else {
        d.totalScore = calculateDriverPoints(d);
        d.points = d.totalScore;
        d.totalPts = d.totalScore;
        d.victories = d.computedVictories || { p1: 0, p2: 0, p3: 0, p4: 0 };
        d.bestTimes = d.computedBestTimes || { first: 0, second: 0, third: 0 };
        d.rep = d.computedRep || 0;
        d.bonusPoints = d.computedBonus || 0;
      }
    });
  }

  /**
   * Helper to find driver by alias, name, or rank
   */
  function findDriverByAlias(identifier) {
    if (!identifier || !Array.isArray(driversData)) return null;
    const clean = String(identifier).trim().toLowerCase();
    const cleanNorm = clean.replace(/[™®©]/g, '').trim();
    const num = parseInt(clean, 10);
    if (!isNaN(num) && String(num) === clean) {
      const byRank = driversData.find(d => d.rank === num);
      if (byRank) return byRank;
    }
    return driversData.find(d => {
      const name = (d.name || '').toLowerCase();
      const alias = (d.alias || '').toLowerCase();
      const nameNorm = name.replace(/[™®©]/g, '').trim();
      const aliasNorm = alias.replace(/[™®©]/g, '').trim();

      if (name === clean || alias === clean) return true;
      if (nameNorm === cleanNorm || aliasNorm === cleanNorm) return true;
      if (alias.includes(clean) || clean.includes(alias)) return true;
      if (aliasNorm && cleanNorm && (aliasNorm.includes(cleanNorm) || cleanNorm.includes(aliasNorm))) return true;
      if (nameNorm && cleanNorm && (nameNorm.includes(cleanNorm) || cleanNorm.includes(nameNorm))) return true;
      return false;
    });
  }

  /**
   * Robust driver identifier resolver supporting rank numbers, ids, and aliases
   */
  function findDriverByIdentifier(pIdentifier) {
    if (pIdentifier === null || pIdentifier === undefined) return null;
    if (typeof pIdentifier === 'object') return pIdentifier;
    if (typeof pIdentifier === 'number') {
      const match = driversData.find(d => d && (d.rank === pIdentifier || d.id === pIdentifier));
      if (match) return match;
      if (typeof window !== 'undefined' && window.DEFAULT_BLACKLIST_DRIVERS) {
        const def = window.DEFAULT_BLACKLIST_DRIVERS.find(d => d.rank === pIdentifier);
        if (def) return def;
      }
      if (typeof DEFAULT_BLACKLIST_DRIVERS !== 'undefined') {
        const def = DEFAULT_BLACKLIST_DRIVERS.find(d => d.rank === pIdentifier);
        if (def) return def;
      }
    }
    return findDriverByAlias(pIdentifier);
  }

  /**
   * Format REP Money: e.g. 3850000 -> "$3.850.000"
   */
  function formatRepMoney(num) {
    if (!num) return "$0";
    return "$" + String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  /**
   * ========================================================
   * VIEW 1: TOURNAMENT GROUPS & WEEKLY CHALLENGES CONTROLLER
   * ========================================================
   */
  async function loadTournamentGroupsView() {
    await loadTournamentData();
    renderWeekTimelinePills();
    renderTournamentKPIStrip();
    renderGroupsGrid();
    updateGroupFilterButtons();
    renderWeeklyChallenges();
  }

  /**
   * Renders the Week 1, 2, 3, 4 timeline pills
   */
  function renderWeekTimelinePills() {
    const container = document.getElementById('tournament-week-selector');
    if (!container) return;
    container.innerHTML = '';

    const isEn = (typeof i18next !== 'undefined' && i18next.language === 'en') ||
                 (typeof window !== 'undefined' && window.getCurrentLanguage && window.getCurrentLanguage() === 'en');

    const weekLabels = isEn ? [
      { num: 1, label: "WEEK 1 (OCT 03 - OCT 09)", text: "WEEK 01", hover: "OCT 03 - 09" },
      { num: 2, label: "WEEK 2 (OCT 10 - OCT 16)", text: "WEEK 02", hover: "OCT 10 - 16" },
      { num: 3, label: "WEEK 3 (OCT 17 - OCT 23)", text: "WEEK 03", hover: "OCT 17 - 23" },
      { num: 4, label: "WEEK 4 (OCT 24-31 • GRAND FINAL RAZOR #1)", text: "WEEK 04", hover: "GRAND FINAL" }
    ] : [
      { num: 1, label: "SEMANA 1 (03 OCT - 09 OCT)", text: "SEMANA 01", hover: "03 - 09 OCT" },
      { num: 2, label: "SEMANA 2 (10 OCT - 16 OCT)", text: "SEMANA 02", hover: "10 - 16 OCT" },
      { num: 3, label: "SEMANA 3 (17 OCT - 23 OCT)", text: "SEMANA 03", hover: "17 - 23 OCT" },
      { num: 4, label: "SEMANA 4 (24-31 OCT • GRAN FINAL RAZOR #1)", text: "SEMANA 04", hover: "GRAN FINAL" }
    ];

    weekLabels.forEach((w, idx) => {
      const isActive = (idx === activeWeekIndex);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `button-turkey uiverse-btn-turkey uiverse-btn-week ${isActive ? 'is-active' : ''}`;
      if (typeof btn.setAttribute === 'function') {
        btn.setAttribute('data-text', w.text);
        btn.setAttribute('data-hover', w.hover);
        btn.setAttribute('title', w.label);
        btn.setAttribute('aria-label', w.label);
      }
      btn.innerHTML = `<span class="sr-only">${w.label}</span>`;

      btn.addEventListener('click', () => {
        activeWeekIndex = idx;
        const currentWeek = getActiveWeek();
        const groups = (currentWeek && Array.isArray(currentWeek.groups) && currentWeek.groups.length > 0)
          ? currentWeek.groups : [];
        if (currentChampionshipGroupTab >= groups.length) {
          currentChampionshipGroupTab = 0;
        }
        renderWeekTimelinePills();
        renderTournamentKPIStrip();
        renderGroupsGrid();
        updateGroupFilterButtons();
        renderWeeklyChallenges();
      });

      container.appendChild(btn);
    });
  }

  /**
   * Renders the 4-Card KPI Strip on top of Groups view
   */
  function renderTournamentKPIStrip() {
    const sorted = getSortedDrivers();
    const leader = sorted[0] || { name: 'SRTxAvenger™', totalScore: 1320 };

    // Total Rep Pot across all drivers
    let totalRep = 0;
    driversData.forEach(d => totalRep += (d.rep || 0));
    if (totalRep === 0) totalRep = 23500000;

    const leaderNameEl = document.getElementById('t-kpi-leader-name');
    if (leaderNameEl) leaderNameEl.textContent = leader.alias || leader.name || 'SRTxAvenger™';
    const leaderPtsEl = document.getElementById('t-kpi-leader-pts');
    if (leaderPtsEl) leaderPtsEl.textContent = `${leader.totalScore || 1320} PTS`;

    const repPotEl = document.getElementById('t-kpi-rep-pot');
    if (repPotEl) repPotEl.textContent = formatRepMoney(totalRep);

    const isEn = (typeof i18next !== 'undefined' && i18next.language === 'en') ||
                 (typeof window !== 'undefined' && window.getCurrentLanguage && window.getCurrentLanguage() === 'en');

    const weekProgEl = document.getElementById('t-kpi-week-progress');
    if (weekProgEl) weekProgEl.textContent = isEn ? `WEEK ${activeWeekIndex + 1} / 4` : `SEMANA ${activeWeekIndex + 1} / 4`;

    const statusEl = document.getElementById('t-kpi-status');
    if (statusEl) statusEl.textContent = isEn ? "IN PROGRESS" : "EN CURSO";

    const currentWeek = getActiveWeek();
    const numGroups = (currentWeek && Array.isArray(currentWeek.groups)) ? currentWeek.groups.length : 4;
    const groupsCountEl = document.getElementById('t-kpi-groups-count');
    if (groupsCountEl) {
      groupsCountEl.textContent = isEn
        ? `${numGroups} Homologated Group${numGroups === 1 ? '' : 's'}`
        : `${numGroups} Grupo${numGroups === 1 ? '' : 's'} Homologado${numGroups === 1 ? '' : 's'}`;
    }
    const headerCountEl = document.getElementById('t-groups-header-count');
    if (headerCountEl) {
      headerCountEl.textContent = isEn ? `(${numGroups} OFFICIAL GROUPS)` : `(${numGroups} GRUPOS OFICIALES)`;
    }

    const windowDatesEl = document.getElementById('tournament-window-dates');
    if (windowDatesEl) {
      const weekWindows = isEn ? [
        "WINDOW: OCT 03, 2026 - OCT 09, 2026",
        "WINDOW: OCT 10, 2026 - OCT 16, 2026",
        "WINDOW: OCT 17, 2026 - OCT 23, 2026",
        "WINDOW: OCT 24, 2026 - OCT 31, 2026"
      ] : [
        "VENTANA: 03 OCT 2026 - 09 OCT 2026",
        "VENTANA: 10 OCT 2026 - 16 OCT 2026",
        "VENTANA: 17 OCT 2026 - 23 OCT 2026",
        "VENTANA: 24 OCT 2026 - 31 OCT 2026"
      ];
      windowDatesEl.textContent = weekWindows[activeWeekIndex] || weekWindows[0];
    }
  }

  /**
   * Renders the 4 Racing Groups (Alpha, Beta, Gamma, Delta) for the selected week
   */
  function renderGroupsGrid() {
    const container = document.getElementById('tournament-groups-grid');
    if (!container) return;
    container.innerHTML = '';

    const isEn = (typeof i18next !== 'undefined' && i18next.language === 'en') ||
                 (typeof window !== 'undefined' && window.getCurrentLanguage && window.getCurrentLanguage() === 'en');

    const currentWeek = getActiveWeek();
    const weekNum = (currentWeek && currentWeek.weekNumber) || (activeWeekIndex + 1);
    let groups = (currentWeek && Array.isArray(currentWeek.groups) && currentWeek.groups.length > 0)
      ? currentWeek.groups.slice()
      : [
        { name: "Grupo Alpha (Líderes)", tag: "🔥 TIER SUPREME", pilots: [1, 10, 3] },
        { name: "Grupo Beta (Aspirantes)", tag: "⚡ TIER HIGH", pilots: [4, 5, 6] },
        { name: "Grupo Gamma (Fuerza & Potencia)", tag: "⚔️ TIER MID-HIGH", pilots: [7, 8, "open_11"] },
        { name: "Grupo Delta (Competición)", tag: "🏁 TIER COMPETICIÓN", pilots: [9, 2, "open_12"] }
      ];

    // Responsive columns depending on groups count
    const numGroups = groups.length;
    let gridColsClass = "grid-cols-1 md:grid-cols-2 xl:grid-cols-4";
    if (numGroups === 1) {
      gridColsClass = "grid-cols-1 max-w-xl mx-auto";
    } else if (numGroups === 2) {
      gridColsClass = "grid-cols-1 md:grid-cols-2";
    } else if (numGroups === 3) {
      gridColsClass = "grid-cols-1 md:grid-cols-3 xl:grid-cols-3";
    } else if (numGroups === 4) {
      gridColsClass = "grid-cols-1 md:grid-cols-2 xl:grid-cols-4";
    } else {
      gridColsClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
    }
    container.className = `grid ${gridColsClass} gap-space-md`;

    const groupStyles = [
      { dot: 'bg-secondary-container', tierBg: 'bg-secondary-container/20 text-secondary', tier: 'TIER SUPREME' },
      { dot: 'bg-primary-container', tierBg: 'bg-primary-container/20 text-primary-container', tier: 'TIER HIGH' },
      { dot: 'bg-tertiary', tierBg: 'bg-tertiary/20 text-tertiary', tier: 'TIER MID-HIGH' },
      { dot: 'bg-surface-container-highest', tierBg: 'bg-surface-container-high text-on-surface-variant', tier: 'TIER COMPETICIÓN' }
    ];

    groups.forEach((grp, gIdx) => {
      const style = groupStyles[gIdx % groupStyles.length];
      const tierBadge = grp.tag ? grp.tag.replace(/[\[\]]/g, '') : style.tier;
      const isSelected = (gIdx === currentChampionshipGroupTab);

      const card = document.createElement('div');
      card.className = `hud-card hud-card-interactive tactical-chamfer-top-right p-space-md shadow-xl flex flex-col gap-space-md cursor-pointer border relative overflow-hidden ${
        isSelected ? 'border-primary-container ring-1 ring-primary-container/50' : 'border-surface-container-highest/40'
      }`;

      // Drivers in group: Respeta el tamaño configurado en admin (dúos de 2, tríos de 3, cuartetos de 4, etc.)
      const defaultSlots = (weekNum >= 3 || activeWeekIndex >= 2) ? 4 : 3;
      const pilotsList = (Array.isArray(grp.pilots) && grp.pilots.length > 0)
        ? grp.pilots.slice()
        : Array.from({ length: defaultSlots }, (_, i) => `open_${(gIdx * defaultSlots) + i + 1}`);
      const numSlots = pilotsList.length;
      let pilotsHtml = '';

      pilotsList.forEach((pIdentifier, pIdx) => {
        const isOpenSlot = (typeof pIdentifier === 'string' && pIdentifier.toLowerCase().includes('open')) ||
                           pIdentifier === 0 || pIdentifier === '0';

        if (isOpenSlot) {
          let slotNum = 11;
          if (typeof pIdentifier === 'string') {
            const digits = pIdentifier.replace(/\D/g, '');
            slotNum = digits ? parseInt(digits, 10) : (gIdx * numSlots + pIdx + 1);
          } else {
            slotNum = gIdx * numSlots + pIdx + 1;
          }

          pilotsHtml += `
            <div class="hud-row-item p-space-sm flex items-center justify-between gap-space-xs">
              <div class="flex items-center gap-space-sm min-w-0">
                <div class="w-7 h-7 rounded-sm bg-surface-container-lowest text-on-surface-variant font-headline-sm text-headline-sm flex items-center justify-center font-bold">${slotNum}</div>
                <div class="flex flex-col min-w-0">
                  <span class="font-headline-sm text-[14px] leading-tight uppercase text-on-surface-variant font-extrabold truncate">${isEn ? `Open Slot #${slotNum}` : `Plaza Disponible #${slotNum}`}</span>
                  <span class="font-label-data text-[11px] text-primary-container truncate font-bold">${isEn ? 'Awaiting Driver' : 'Esperando Piloto'}</span>
                </div>
              </div>
              <div class="flex flex-col text-right shrink-0 min-w-[70px]">
                <span class="font-label-data text-[12.5px] sm:text-[13px] text-on-surface-variant font-black">OPEN</span>
                <span class="font-label-data text-[11px] sm:text-[12px] text-on-surface-variant/70 font-bold tabular-nums">$0</span>
              </div>
            </div>
          `;
          return;
        }

        let driver = findDriverByIdentifier(pIdentifier);

        const rankNum = pIdx + 1;
        const driverRank = driver ? driver.rank : (typeof pIdentifier === 'number' ? pIdentifier : rankNum);
        const name = driver ? (driver.alias || driver.name) : (typeof pIdentifier === 'string' ? pIdentifier : `Piloto #${pIdentifier}`);
        const car = driver ? (driver.ride || driver.car || 'Porsche Carrera GT') : 'Porsche Carrera GT';
        const rep = driver ? formatRepMoney(typeof driver.computedRep === 'number' ? driver.computedRep : driver.rep) : '$0';
        const pts = driver ? (typeof driver.totalScore === 'number' ? driver.totalScore : calculateDriverPoints(driver)) : 0;

        let badgeBg = 'bg-surface-container-highest text-on-surface font-bold';
        if (pIdx === 0) {
          badgeBg = 'bg-primary-container text-on-primary-container font-black';
        } else if (pIdx === 1) {
          badgeBg = 'bg-surface-container-highest text-on-surface font-bold';
        }

        pilotsHtml += `
          <div class="hud-row-item p-space-sm flex items-center justify-between gap-space-xs ${pIdx === 0 ? 'bg-surface-container-high/40' : ''}">
            <div class="flex items-center gap-space-sm min-w-0">
              <div class="w-7 h-7 rounded-sm ${badgeBg} font-headline-sm text-headline-sm flex items-center justify-center">${driverRank}</div>
              <div class="flex flex-col min-w-0">
                <span class="font-headline-sm text-[14px] leading-tight uppercase text-on-surface font-extrabold truncate">${escapeHtml(name)}</span>
                <span class="font-label-data text-[11px] text-on-surface-variant truncate">${escapeHtml(car)}</span>
              </div>
            </div>
            <div class="flex flex-col text-right shrink-0 min-w-[72px]">
              <span class="font-label-data text-[13px] sm:text-[14px] text-primary-container font-black tracking-wide leading-tight tabular-nums">${pts} PTS</span>
              <span class="font-label-data text-[12px] sm:text-[13px] text-tertiary font-black tracking-tight leading-tight tabular-nums drop-shadow-[0_0_8px_rgba(0,208,255,0.4)]">${rep}</span>
            </div>
          </div>
        `;
      });

      card.innerHTML = `
        <div class="tactical-watermark">GRP ${String.fromCharCode(65 + gIdx)}</div>
        <div class="flex flex-col gap-1.5 relative z-10">
          <div class="flex items-center justify-between">
            <span class="tactical-badge text-[10px] uppercase px-2 py-0.5 ${style.tierBg} font-black tracking-wider w-fit inline-block">${escapeHtml(tierBadge)}</span>
          </div>
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-2.5 h-2.5 rounded-sm ${style.dot} shrink-0"></span>
            <span class="font-headline-sm text-headline-sm uppercase text-on-surface font-black truncate">${escapeHtml(grp.name)}</span>
          </div>
        </div>
        <div class="flex flex-col gap-space-xs relative z-10">
          ${pilotsHtml}
        </div>
        <div class="mt-auto pt-2 border-t border-surface-container-highest/30 flex items-center justify-between relative z-10">
          <span class="font-label-data text-[10px] uppercase text-outline flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-secondary">directions_car</span>
            <span>${isEn ? '8 ROUTES • RESTRICTED CAR' : '8 RUTAS • COCHE RESTRINGIDO'}</span>
          </span>
          <span class="font-label-hud text-[10px] uppercase ${isSelected ? 'text-primary font-bold' : 'text-on-surface-variant'} flex items-center gap-1">
            <span>${isSelected ? (isEn ? 'ACTIVE' : 'ACTIVO') : (isEn ? 'VIEW ROUTES' : 'VER RUTAS')}</span>
            <span class="material-symbols-outlined text-[13px]">arrow_forward</span>
          </span>
        </div>
      `;

      card.onclick = () => {
        selectChampionshipGroupTab(gIdx);
        const chSection = document.getElementById('tournament-challenges-grid');
        if (chSection) {
          chSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      };

      container.appendChild(card);
    });
  }

  /**
   * Updates group filter tab buttons with active week group names and states
   */
  function updateGroupFilterButtons() {
    const currentWeek = getActiveWeek();
    const groups = (currentWeek && Array.isArray(currentWeek.groups) && currentWeek.groups.length > 0)
      ? currentWeek.groups
      : [
        { name: "Grupo Alpha (Líderes)" },
        { name: "Grupo Beta (Aspirantes)" },
        { name: "Grupo Gamma (Fuerza & Potencia)" },
        { name: "Grupo Delta (Competición)" }
      ];

    if (currentChampionshipGroupTab >= groups.length) {
      currentChampionshipGroupTab = Math.max(0, groups.length - 1);
    }

    const container = document.getElementById('championship-group-tabs-container') ||
                      document.getElementById('btn-bl-group-0')?.parentElement;

    const icons = ['local_fire_department', 'bolt', 'shield', 'flag', 'stars', 'sports_motorsports', 'workspace_premium'];

    if (container) {
      container.innerHTML = '';
      groups.forEach((grp, idx) => {
        const isActive = (idx === currentChampionshipGroupTab);
        let label = (grp.name || `GRUPO #${idx + 1}`).toUpperCase();
        if (label.includes('(')) {
          label = label.split('(')[0].trim();
        }

        const btn = document.createElement('button');
        btn.id = `btn-bl-group-${idx}`;
        btn.type = 'button';
        btn.onclick = () => selectChampionshipGroupTab(idx);
        btn.className = isActive
          ? "px-space-md py-space-xs rounded bg-primary-container text-on-primary-container font-label-hud text-label-hud uppercase tracking-wider font-black shadow-md flex items-center gap-space-xs transition-all cursor-pointer scale-[1.02]"
          : "px-space-md py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-hud text-label-hud uppercase tracking-wider transition-colors flex items-center gap-space-xs cursor-pointer";
        btn.innerHTML = `
          <span class="material-symbols-outlined text-[16px]">${icons[idx % icons.length]}</span>
          <span>${escapeHtml(label)}</span>
        `;
        container.appendChild(btn);
      });
    } else {
      const groupBtns = [
        document.getElementById('btn-bl-group-0'),
        document.getElementById('btn-bl-group-1'),
        document.getElementById('btn-bl-group-2'),
        document.getElementById('btn-bl-group-3'),
        document.getElementById('btn-bl-group-4')
      ];

      groupBtns.forEach((btn, idx) => {
        if (!btn) return;
        if (idx >= groups.length) {
          btn.style.display = 'none';
          return;
        }
        btn.style.display = 'flex';
        const grp = groups[idx] || { name: `Grupo #${idx + 1}` };
        const isActive = (idx === currentChampionshipGroupTab);

        let label = (grp.name || `GRUPO #${idx + 1}`).toUpperCase();
        if (label.includes('(')) {
          label = label.split('(')[0].trim();
        }

        btn.innerHTML = `
          <span class="material-symbols-outlined text-[16px]">${icons[idx % icons.length]}</span>
          <span>${escapeHtml(label)}</span>
        `;

        if (isActive) {
          btn.className = "px-space-md py-space-xs rounded bg-primary-container text-on-primary-container font-label-hud text-label-hud uppercase tracking-wider font-black shadow-md flex items-center gap-space-xs transition-all cursor-pointer scale-[1.02]";
        } else {
          btn.className = "px-space-md py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-hud text-label-hud uppercase tracking-wider transition-colors flex items-center gap-space-xs cursor-pointer";
        }
      });
    }
  }

  /**
   * Switches active group filter (0 = Alpha, 1 = Beta, 2 = Gamma, 3 = Delta)
   */
  function selectChampionshipGroupTab(grpIdx) {
    currentChampionshipGroupTab = parseInt(grpIdx, 10) || 0;
    updateGroupFilterButtons();
    renderGroupsGrid();
    renderWeeklyChallenges();
  }

  /**
   * Renders the 8 weekly route challenges cards with explicit COCHE RESTRINGIDO
   */
  function renderWeeklyChallenges() {
    const container = document.getElementById('tournament-challenges-grid');
    if (!container) return;
    container.innerHTML = '';

    const isEn = (typeof i18next !== 'undefined' && i18next.language === 'en') ||
                 (typeof window !== 'undefined' && window.getCurrentLanguage && window.getCurrentLanguage() === 'en');

    const currentWeek = getActiveWeek();
    if (!currentWeek) return;

    const challenges = currentWeek.challenges || [];
    const groups = (currentWeek && Array.isArray(currentWeek.groups) && currentWeek.groups.length > 0)
      ? currentWeek.groups
      : [
        { name: "Grupo Alpha (Líderes)", pilots: [1, 10, 3], tag: "🔥 TIER SUPREME" },
        { name: "Grupo Beta (Aspirantes)", pilots: [4, 5, 6], tag: "⚡ TIER HIGH" },
        { name: "Grupo Gamma (Fuerza & Potencia)", pilots: [7, 8, "open_11"], tag: "⚔️ TIER MID-HIGH" },
        { name: "Grupo Delta (Competición)", pilots: [9, 2, "open_12"], tag: "🏁 TIER COMPETICIÓN" }
      ];

    const activeGrp = groups[currentChampionshipGroupTab] || groups[0];
    const grpName = activeGrp.name || `Grupo #${currentChampionshipGroupTab + 1}`;
    const weekNum = currentWeek.weekNumber || (activeWeekIndex + 1);

    if (challenges.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 px-4 bg-surface-container-low rounded-xl">
          <span class="material-symbols-outlined text-[48px] text-outline mb-2">sports_score</span>
          <p class="font-headline-sm text-base text-outline uppercase font-bold">${isEn ? 'No challenges registered for this week' : 'No hay desafíos registrados para esta semana'}</p>
        </div>
      `;
      return;
    }

    challenges.forEach((ch, idx) => {
      const card = document.createElement('div');
      card.className = "hud-card hud-card-interactive tactical-chamfer-top-right p-space-md shadow-xl flex flex-col gap-space-md border border-surface-container-highest/30 relative overflow-hidden";

      // 1. Obtener Top 3 según el grupo seleccionado (Alpha, Beta, Gamma, Delta)
      let top3 = null;
      if (ch.groupsResults) {
        if (ch.groupsResults[currentChampionshipGroupTab]) {
          top3 = ch.groupsResults[currentChampionshipGroupTab];
        } else if (ch.groupsResults[String(currentChampionshipGroupTab)]) {
          top3 = ch.groupsResults[String(currentChampionshipGroupTab)];
        } else if (ch.groupsResults[grpName]) {
          top3 = ch.groupsResults[grpName];
        }
      }
      if (!top3 && ch.groupsWinners) {
        if (ch.groupsWinners[currentChampionshipGroupTab]) {
          top3 = ch.groupsWinners[currentChampionshipGroupTab];
        } else if (ch.groupsWinners[String(currentChampionshipGroupTab)]) {
          top3 = ch.groupsWinners[String(currentChampionshipGroupTab)];
        } else if (ch.groupsWinners[grpName]) {
          top3 = ch.groupsWinners[grpName];
        }
      }
      if (!top3 && currentChampionshipGroupTab === 0 && Array.isArray(ch.top3) && ch.top3.length > 0) {
        const hasRealPilots = ch.top3.some(p => p.pilot && p.pilot !== 'Por disputar');
        if (hasRealPilots) {
          top3 = ch.top3;
        }
      }

      // 2. Determinar coche restringido de la ficha
      const restrictionCar = getChallengeCarRestriction(weekNum, ch);

      const isWeek4Slots = (weekNum >= 3 || (top3 && top3.length >= 4) || (activeGrp && activeGrp.pilots && activeGrp.pilots.length >= 4));

      // Si no hay top3 cargado para este grupo en esta semana, aplicar la rotación de activeGrp.pilots:
      if (!top3 || !Array.isArray(top3) || top3.length === 0) {
        const grpPilots = (activeGrp && Array.isArray(activeGrp.pilots)) ? activeGrp.pilots : [];
        const slotNumbers = isWeek4Slots ? [1, 2, 3, 4] : [1, 2, 3];
        top3 = slotNumbers.map((pos, pIdx) => {
          const pilotId = grpPilots[pIdx];
          let pilotName = isEn ? 'To be contested' : 'Por disputar';
          let carName = restrictionCar;
          if (pilotId !== undefined && pilotId !== null) {
            let driver = null;
            if (typeof pilotId === 'number') {
              driver = driversData.find(d => d.rank === pilotId || d.id === pilotId);
              if (!driver && typeof DEFAULT_BLACKLIST_DRIVERS !== 'undefined') {
                driver = DEFAULT_BLACKLIST_DRIVERS.find(d => d.rank === pilotId);
              }
            }
            if (driver) {
              pilotName = driver.alias || driver.name;
              carName = driver.ride || restrictionCar;
            } else if (typeof pilotId === 'string' && pilotId.startsWith('open_')) {
              const slotNum = pilotId.replace('open_', '');
              pilotName = isEn ? `Open Slot #${slotNum}` : `Plaza Disponible #${slotNum}`;
              carName = isEn ? 'Awaiting Driver' : 'Esperando Piloto';
            } else if (typeof pilotId === 'string') {
              pilotName = pilotId;
            }
          }
          const bonus = pos === 1 ? 100 : (pos === 2 ? 50 : (pos === 3 ? 20 : 10));
          const repMoney = pos === 1 ? 400000 : (pos === 2 ? 250000 : (pos === 3 ? 120000 : 80000));
          return {
            rank: (typeof pilotId === 'number') ? pilotId : null,
            pilot: pilotName,
            car: carName,
            time: '--:--.---',
            bonus: bonus,
            repMoney: repMoney
          };
        });
      }

      // Normalizar objetos de posición
      const p1 = top3[0] || { pilot: 'Por disputar', car: restrictionCar, time: '--:--.---', bonus: 100, repMoney: 400000 };
      const p2 = top3[1] || { pilot: 'Por disputar', car: restrictionCar, time: '--:--.---', bonus: 50, repMoney: 250000 };
      const p3 = top3[2] || { pilot: 'Por disputar', car: restrictionCar, time: '--:--.---', bonus: 20, repMoney: 120000 };
      const p4 = top3[3] || { pilot: 'Por disputar', car: restrictionCar, time: '--:--.---', bonus: 10, repMoney: 80000 };

      const formatRep = (r) => {
        if (r === 0 || r === '0' || r === '$0' || r === '$0 REP') return '$0 REP';
        if (r === undefined || r === null || r === '') return '$0 REP';
        if (typeof r === 'string') {
          const clean = r.replace(/[^0-9]/g, '');
          if (clean === '0' || (clean.length > 0 && clean.split('').every(c => c === '0'))) return '$0 REP';
          const num = parseInt(clean, 10);
          if (!isNaN(num)) r = num;
          else return r.replace('💰 ', '');
        }
        if (r === 0) return '$0 REP';
        if (r >= 1000000) return `$${(r/1000000).toFixed(1)}M REP`;
        if (r >= 1000) return `$${Math.round(r/1000)}K REP`;
        return `$${r} REP`;
      };

      const getSlotBonusDisplay = (slot, defaultBonus) => {
        if (!slot) return '0 PTS';
        if (isZeroOrNullTime(slot.time)) return '0 PTS';
        const b = slot.bonus !== undefined ? slot.bonus : slot.points;
        if (b === 0 || b === '0') return '0 PTS';
        if (b !== undefined && b !== null && b !== '') {
          const num = parseInt(b, 10);
          if (!isNaN(num)) {
            return num <= 0 ? '0 PTS' : `+${num} PTS`;
          }
        }
        return '0 PTS';
      };

      const getSlotRepDisplay = (slot, defaultRep) => {
        if (!slot) return '$0 REP';
        const r = slot.repMoney !== undefined ? slot.repMoney : (slot.rep !== undefined ? slot.rep : slot.money);
        if (r === 0 || r === '0' || r === '$0' || r === '$0 REP' || r === undefined || r === null || r === '') return '$0 REP';
        if (typeof r === 'number') {
          return r <= 0 ? '$0 REP' : formatRep(r);
        }
        if (typeof r === 'string') {
          const clean = r.replace(/[^0-9]/g, '');
          if (clean === '0' || clean === '' || clean.split('').every(c => c === '0')) return '$0 REP';
          const num = parseInt(clean, 10);
          if (!isNaN(num)) return num <= 0 ? '$0 REP' : formatRep(num);
          return r;
        }
        return '$0 REP';
      };

      const getPilotCar = (p) => {
        if (!p.time || p.time === '--:--.---' || p.time.includes('--')) {
          return restrictionCar;
        }
        return p.car || restrictionCar;
      };

      card.innerHTML = `
        <div class="tactical-watermark">#${String(idx + 1).padStart(2, '0')}</div>
        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center gap-space-xs">
            <span class="font-headline-sm text-headline-sm uppercase text-primary-container font-black">#${String(idx + 1).padStart(2, '0')}</span>
            <span class="font-headline-sm text-headline-sm uppercase text-on-surface font-extrabold truncate">${escapeHtml(ch.route || 'Ruta')}</span>
          </div>
          <span class="tactical-badge text-on-surface">${escapeHtml((ch.type || 'Circuito').toUpperCase())}</span>
        </div>

        <!-- Coche Restringido & Grupo Pill (Estilo Cyber-Telemetry HUD: 2 líneas para evitar choques) -->
        <div class="bl-restriction-row bg-surface-container-lowest px-space-sm py-2 rounded-sm flex flex-col gap-1 border border-surface-container-highest/40 shadow-inner relative z-10">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="material-symbols-outlined text-[15px] text-secondary shrink-0">directions_car</span>
              <span class="font-label-hud text-[10px] uppercase text-outline tracking-wider font-bold shrink-0">${isEn ? 'RESTRICTED CAR' : 'COCHE RESTRINGIDO'}</span>
            </div>
            <span class="tactical-badge-amber">${escapeHtml(grpName.toUpperCase())}</span>
          </div>
          <div class="flex items-center gap-1.5 pl-0.5">
            <span class="text-secondary font-mono text-[12px] font-bold shrink-0">//</span>
            <span class="font-label-data text-[13px] sm:text-[14px] text-primary font-black tracking-wide leading-tight break-words">${escapeHtml(restrictionCar)}</span>
          </div>
        </div>

        <!-- Times list -->
        <div class="flex flex-col gap-space-xs relative z-10">
          ${top3.map((p, pIdx) => {
            const pos = pIdx + 1;
            let posBadgeBg = 'bg-surface-container-highest text-on-surface font-bold';
            let timerColor = '#cbd5e1';
            let bonusColor = 'text-outline';
            let defaultBonus = 10;
            let defaultRep = 80000;

            if (pos === 1) {
              posBadgeBg = 'bg-primary-container text-black font-black';
              timerColor = '#fbbf24';
              bonusColor = 'text-primary-container';
              defaultBonus = 100;
              defaultRep = 400000;
            } else if (pos === 2) {
              posBadgeBg = 'bg-surface-container-highest text-on-surface font-bold';
              timerColor = '#e2e8f0';
              bonusColor = 'text-secondary';
              defaultBonus = 50;
              defaultRep = 250000;
            } else if (pos === 3) {
              posBadgeBg = 'bg-surface-container-highest text-on-surface font-bold';
              timerColor = '#fdba74';
              bonusColor = 'text-primary-fixed-dim';
              defaultBonus = 20;
              defaultRep = 120000;
            } else if (pos === 4) {
              posBadgeBg = 'bg-surface-container-highest text-on-surface font-bold';
              timerColor = '#94a3b8';
              bonusColor = 'text-outline';
              defaultBonus = 10;
              defaultRep = 80000;
            }

            const rowBg = 'hud-row-item p-space-sm grid grid-cols-[1fr_auto_1fr] items-center gap-2 relative';

            return `
              <div class="${rowBg}">
                <div class="flex items-center gap-2 min-w-0 justify-self-start">
                  <span class="w-5 h-5 rounded-sm ${posBadgeBg} font-headline-sm text-[12px] flex items-center justify-center shrink-0">${pos}</span>
                  <span class="font-headline-sm text-[13px] sm:text-[13.5px] uppercase text-on-surface font-extrabold truncate" title="${escapeHtml(p.pilot || 'Por disputar')}">${escapeHtml(p.pilot || 'Por disputar')}</span>
                </div>
                <div class="flex items-center justify-center text-center justify-self-center px-1">
                  <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-surface-container-lowest/90 border border-surface-container-highest/50 shadow-inner">
                    <span class="material-symbols-outlined text-[13px] text-[${timerColor}] shrink-0">timer</span>
                    <span class="font-label-hud text-[9px] uppercase tracking-wider text-outline font-black shrink-0">TIME</span>
                    <span class="font-label-timer-md text-[13px] sm:text-[14px] text-[${timerColor}] font-black tracking-tight whitespace-nowrap tabular-nums">${escapeHtml(p.time || '--:--.---')}</span>
                  </div>
                </div>
                <div class="flex flex-col text-right justify-self-end shrink-0 pl-1">
                  <span class="font-label-data text-[12.5px] sm:text-[13px] ${bonusColor} font-black tracking-wide leading-tight tabular-nums">${getSlotBonusDisplay(p, defaultBonus)}</span>
                  <span class="font-label-data text-[12.5px] sm:text-[13px] text-tertiary font-black tracking-tight leading-tight tabular-nums drop-shadow-[0_0_8px_rgba(0,208,255,0.4)]">${getSlotRepDisplay(p, defaultRep)}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      container.appendChild(card);
    });
  }

  // Exponer globalmente para eventos en línea
  if (typeof window !== 'undefined') {
    window.selectChampionshipGroupTab = selectChampionshipGroupTab;
    window.currentChampionshipGroupTab = currentChampionshipGroupTab;
    window.renderWeeklyChallenges = renderWeeklyChallenges;
    window.updateGroupFilterButtons = updateGroupFilterButtons;
  }

  /**
   * ========================================================
   * VIEW 2: CHAMPIONSHIP STANDINGS MATRIX CONTROLLER
   * ========================================================
   */
  async function loadStandingsView() {
    await loadTournamentData();
    syncDriversWithChallengeResults(standingsWeekFilter);
    renderStandingsKPIStrip();
    renderStandingsMatrix();
    initStandingsControls();
    if (typeof renderDossierSidebar === 'function') renderDossierSidebar();
    if (typeof renderDossierQuickDock === 'function') renderDossierQuickDock();
  }

  function getSortedDrivers() {
    let list = [...driversData];

    // Filter by Group
    if (standingsGroupFilter !== 'all') {
      const gFilter = standingsGroupFilter.toLowerCase();
      list = list.filter(d => {
        const r = d.rank || 99;
        if (gFilter === 'alpha' || gFilter === 'alfa') return r <= 3;
        if (gFilter === 'beta') return r >= 4 && r <= 6;
        if (gFilter === 'gamma' || gFilter === 'gama') return r >= 7 && r <= 9;
        if (gFilter === 'delta') return r >= 10 && r <= 15;
        return true;
      });
    }

    // Filter by Search Query
    if (standingsSearchQuery.trim()) {
      const q = standingsSearchQuery.trim().toLowerCase();
      list = list.filter(d => {
        const name = (d.name || '').toLowerCase();
        const alias = (d.alias || '').toLowerCase();
        const ride = (d.ride || d.car || '').toLowerCase();
        return name.includes(q) || alias.includes(q) || ride.includes(q);
      });
    }

    // Sort Modes (Orden estrictamente de mayor a menor)
    if (standingsSortMode === 'rep') {
      list.sort((a, b) => {
        const repA = (typeof a.computedRep === 'number' ? a.computedRep : (a.rep || 0));
        const repB = (typeof b.computedRep === 'number' ? b.computedRep : (b.rep || 0));
        if (repB !== repA) return repB - repA;
        const ptsA = (typeof a.totalScore === 'number' ? a.totalScore : (a.points || a.totalPts || 0));
        const ptsB = (typeof b.totalScore === 'number' ? b.totalScore : (b.points || b.totalPts || 0));
        return ptsB - ptsA;
      });
    } else if (standingsSortMode === 'victories') {
      list.sort((a, b) => {
        const vA = (a.computedVictories ? a.computedVictories.p1 : (a.victories ? a.victories.p1 : 0));
        const vB = (b.computedVictories ? b.computedVictories.p1 : (b.victories ? b.victories.p1 : 0));
        if (vB !== vA) return vB - vA;
        const ptsA = (typeof a.totalScore === 'number' ? a.totalScore : (a.points || a.totalPts || 0));
        const ptsB = (typeof b.totalScore === 'number' ? b.totalScore : (b.points || b.totalPts || 0));
        return ptsB - ptsA;
      });
    } else {
      // Default: Total Points Descending, followed by REP Bounty
      list.sort((a, b) => {
        const ptsA = (typeof a.totalScore === 'number' ? a.totalScore : (a.points || a.totalPts || 0));
        const ptsB = (typeof b.totalScore === 'number' ? b.totalScore : (b.points || b.totalPts || 0));
        if (ptsB !== ptsA) return ptsB - ptsA;
        const repA = (typeof a.computedRep === 'number' ? a.computedRep : (a.rep || 0));
        const repB = (typeof b.computedRep === 'number' ? b.computedRep : (b.rep || 0));
        return repB - repA;
      });
    }

    return list;
  }

  /**
   * Renders the 4-Block Championship KPI Grid
   */
  function renderStandingsKPIStrip() {
    const sorted = getSortedDrivers();
    const leader = sorted[0] || { name: 'SRTxAvenger™', totalScore: 1320, rep: 3200000 };

    // Total Rep Pot across all drivers
    let totalRep = 0;
    driversData.forEach(d => totalRep += (d.rep || d.computedRep || 0));
    if (totalRep === 0) totalRep = 9680000;

    const leaderEl = document.getElementById('s-kpi-leader');
    if (leaderEl) leaderEl.textContent = leader.alias || leader.name || 'SRTxAvenger™';
    const ptsEl = document.getElementById('s-kpi-leader-pts');
    if (ptsEl) {
      const leaderPts = (typeof leader.totalScore === 'number') ? leader.totalScore : (leader.points || 1320);
      ptsEl.textContent = `${leaderPts.toLocaleString('es-ES')} PTS`;
    }

    const isEn = (typeof i18next !== 'undefined' && i18next.language === 'en') ||
                 (typeof window !== 'undefined' && window.getCurrentLanguage && window.getCurrentLanguage() === 'en');

    const repEl = document.getElementById('s-kpi-rep');
    if (repEl) repEl.textContent = formatRepMoney(totalRep);

    const runsEl = document.getElementById('s-kpi-runs');
    if (runsEl) runsEl.textContent = isEn ? "128 HOMOLOGATED" : "128 HOMOLOGADAS";

    const integEl = document.getElementById('s-kpi-integrity');
    if (integEl) integEl.textContent = "100% SUB-FRAME 128Hz";
  }

  /**
   * Renders Horizontal Cards Stream for Championship Standings
   */
  function renderStandingsMatrix() {
    const container = document.getElementById('standings-cards-container');
    if (!container) return;
    container.innerHTML = '';

    const isEn = (typeof i18next !== 'undefined' && i18next.language === 'en') ||
                 (typeof window !== 'undefined' && window.getCurrentLanguage && window.getCurrentLanguage() === 'en');

    const sorted = getSortedDrivers();
    if (sorted.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 px-4 bg-surface-container-low rounded-xl">
          <span class="material-symbols-outlined text-[48px] text-outline mb-2">person_off</span>
          <p class="font-headline-sm text-base text-outline uppercase font-bold">${isEn ? 'No drivers found with the selected filter' : 'No se encontraron pilotos con el filtro seleccionado'}</p>
        </div>
      `;
      return;
    }

    // Telemetry Status Strip (Informa el alcance de semanas homologadas)
    const statusStrip = document.createElement('div');
    if (standingsWeekFilter === '3' || standingsWeekFilter === '4') {
      const isW3 = (standingsWeekFilter === '3');
      statusStrip.className = 'w-full mb-3 p-3.5 rounded-xl bg-surface-container-low border border-primary-container/30 flex items-center gap-3 text-on-surface shadow-sm';
      statusStrip.innerHTML = `
        <span class="material-symbols-outlined text-primary-container text-[24px]">event_upcoming</span>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="font-headline-sm text-xs uppercase text-primary-container font-black tracking-wide">
              ${isW3 ? 'SEMANA 3: EN ESPERA // POR DISPUTAR (17 - 23 OCTUBRE)' : 'SEMANA 4: GRAN FINAL // POR DISPUTAR (24 - 31 OCTUBRE)'}
            </span>
            <span class="font-label-hud text-[9px] bg-surface-container-highest px-1.5 py-0.5 rounded text-outline uppercase font-bold">CALENDARIO PENDIENTE</span>
          </div>
          <div class="font-label-data text-[11px] text-on-surface-variant mt-0.5">
            ${isW3 
              ? 'Esta semana aún no se ha puesto en curso. Las victorias, dinero REP y puntos se contabilizarán en la tabla una vez se homologuen los 8 desafíos oficiales en la Comisaría (admin.html).' 
              : 'Esta semana corresponde a la Gran Final del Campeonato. Aún no se ha puesto en curso y se disputará al finalizar la Semana 3.'}
          </div>
        </div>
      `;
      container.appendChild(statusStrip);
    } else if (standingsWeekFilter === '1' || standingsWeekFilter === '2') {
      const isW1 = (standingsWeekFilter === '1');
      statusStrip.className = 'w-full mb-2.5 px-3 py-2 rounded-lg bg-surface-container-low/70 border border-surface-container-highest/40 flex items-center justify-between text-xs text-on-surface-variant';
      statusStrip.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-secondary"></span>
          <span class="font-headline-sm text-[11px] uppercase font-bold text-on-surface">
            ${isW1 ? 'SEMANA 1: CALIFICACIÓN & TRÍOS INICIALES (8 DESAFÍOS HOMOLOGADOS)' : 'SEMANA 2: ROTACIÓN DE TRÍOS & DUELOS (8 DESAFÍOS HOMOLOGADOS)'}
          </span>
        </div>
        <span class="font-label-data text-[10px] text-outline uppercase font-bold">GRUPOS ALFA, BETA, GAMMA Y DELTA</span>
      `;
      container.appendChild(statusStrip);
    } else {
      statusStrip.className = 'w-full mb-2.5 px-3 py-2 rounded-lg bg-surface-container-low/70 border border-primary-container/20 flex items-center justify-between text-xs text-on-surface-variant';
      statusStrip.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          <span class="font-headline-sm text-[11px] uppercase font-bold text-on-surface">
            CLASIFICACIÓN GENERAL ACUMULADA: SEMANAS 1 &amp; 2 EN CURSO
          </span>
        </div>
        <span class="font-label-data text-[10px] text-primary-container/80 uppercase font-black">16 DESAFÍOS OFICIALES DISPUTADOS</span>
      `;
      container.appendChild(statusStrip);
    }

    sorted.forEach((driver, idx) => {
      const rankNum = idx + 1;
      const isP1 = (rankNum === 1);
      const isP2 = (rankNum === 2);
      const isP3 = (rankNum === 3);

      const card = document.createElement('div');

      // Colors & Gauges according to Google Stitch
      let edgeGauge = 'bg-outline-variant/40';
      let rankBadge = 'w-12 h-12 rounded bg-surface-container-high text-on-surface-variant flex items-center justify-center font-headline-md text-headline-md font-black flex-shrink-0';
      let rowBg = 'bg-surface-container-lowest hover:bg-surface-container-low';
      let avatarIcon = 'sports_motorsports';
      let avatarColor = 'text-outline';
      let rankPillClass = 'bg-surface-container-highest text-on-surface-variant';
      let tagColor = 'text-on-surface';

      if (isP1) {
        edgeGauge = 'bg-primary-container shadow-[0_0_12px_#ffb800]';
        rankBadge = 'w-12 h-12 rounded bg-primary-container text-on-primary flex items-center justify-center font-headline-md text-headline-md font-black flex-shrink-0 shadow-md';
        rowBg = 'bg-surface-container-lowest hover:bg-surface-container-low';
        avatarIcon = 'rocket_launch';
        avatarColor = 'text-primary-container';
        rankPillClass = 'bg-primary-container/20 text-primary-container';
        tagColor = 'text-primary-container';
      } else if (isP2) {
        edgeGauge = 'bg-inverse-surface';
        rankBadge = 'w-12 h-12 rounded bg-surface-container-high text-on-surface flex items-center justify-center font-headline-md text-headline-md font-black flex-shrink-0';
        rowBg = 'bg-surface-container-lowest hover:bg-surface-container-low';
        avatarIcon = 'all_inclusive';
        avatarColor = 'text-secondary';
        rankPillClass = 'bg-surface-container-highest text-secondary';
        tagColor = 'text-secondary';
      } else if (isP3) {
        edgeGauge = 'bg-secondary-container';
        rankBadge = 'w-12 h-12 rounded bg-surface-container-high text-secondary-container flex items-center justify-center font-headline-md text-headline-md font-black flex-shrink-0';
        rowBg = 'bg-surface-container-lowest hover:bg-surface-container-low';
        avatarIcon = 'hexagon';
        avatarColor = 'text-secondary-container';
        rankPillClass = 'bg-secondary-container/20 text-secondary-container';
        tagColor = 'text-secondary-container';
      } else if (rankNum === 4) {
        edgeGauge = 'bg-tertiary/60';
        avatarIcon = 'shield';
        avatarColor = 'text-tertiary';
        tagColor = 'text-tertiary';
      } else {
        avatarIcon = 'directions_car';
      }

      // Group Label
      let groupLabel = driver.groupName || '';
      if (!groupLabel) {
        if (driver.rank >= 1 && driver.rank <= 3) groupLabel = 'Grupo Alpha (Líderes)';
        else if (driver.rank >= 4 && driver.rank <= 6) groupLabel = 'Grupo Beta (Aspirantes)';
        else if (driver.rank >= 7 && driver.rank <= 9) groupLabel = 'Grupo Gamma (Perseguidores)';
        else if (driver.rank >= 10 && driver.rank <= 12) groupLabel = 'Grupo Delta (Contendientes)';
        else if (driver.rank >= 13 && driver.rank <= 15) groupLabel = 'Grupo Épsilon (Nuevos Rivales)';
        else groupLabel = 'Grupo Oficial';
      }

      const v = driver.computedVictories || driver.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
      const bt = driver.computedBestTimes || driver.bestTimes || { first: 0, second: 0, third: 0 };
      const rep = formatRepMoney(typeof driver.computedRep === 'number' ? driver.computedRep : driver.rep);
      const pts = typeof driver.totalScore === 'number' ? driver.totalScore : calculateDriverPoints(driver);
      const car = driver.ride || driver.car || 'Porsche Carrera GT';
      const alias = driver.alias || driver.name || `Piloto #${driver.rank}`;
      const timeBonusPts = typeof driver.computedBonus === 'number' ? driver.computedBonus : ((bt.first || 0) * 100 + (bt.second || 0) * 50 + (bt.third || 0) * 20);

      card.className = `relative hud-card hud-card-interactive tactical-chamfer-top-right p-space-sm md:p-space-md flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-md shadow-lg overflow-hidden group`;

      card.innerHTML = `
        <div class="tactical-watermark">#${rankNum}</div>
        <!-- Edge Gauge -->
        <div class="absolute left-0 top-0 bottom-0 w-1.5 ${edgeGauge}"></div>

        <!-- Pilot Identity Cluster -->
        <div class="flex items-center gap-space-md min-w-[260px] pl-space-xs relative z-10">
          <!-- Rank Number Badge -->
          <div class="${rankBadge}">${rankNum}</div>
          <!-- Escudería Avatar / Insignia -->
          <div class="w-12 h-12 rounded-sm bg-surface-container-high flex items-center justify-center flex-shrink-0 ${avatarColor}">
            <span class="material-symbols-outlined text-[26px]">${avatarIcon}</span>
          </div>
          <!-- Callsign & Car info -->
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-space-xs flex-wrap">
              <span class="font-headline-sm text-headline-sm uppercase text-on-surface font-extrabold leading-none truncate">${escapeHtml(alias)}</span>
              ${driver.name && driver.name !== driver.alias ? `<span class="font-label-data text-label-data text-secondary-container font-semibold truncate">"${escapeHtml(driver.name)}"</span>` : ''}
              <span class="tactical-badge text-[10px] ${rankPillClass}">BLACKLIST ${driver.rank || rankNum}</span>
            </div>
            <div class="flex items-center gap-space-xs mt-1 text-on-surface-variant font-label-data text-label-data truncate">
              <span class="material-symbols-outlined text-[14px]">directions_car</span>
              <span class="uppercase truncate">${escapeHtml(car)}</span>
            </div>
            <div class="mt-1">
              <span class="font-label-data text-[10px] bg-surface-container-highest px-2 py-0.5 rounded-sm text-on-surface-variant uppercase font-medium">${escapeHtml(groupLabel)}</span>
            </div>
          </div>
        </div>

        <!-- Telemetry Data Blocks Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-space-md items-center w-full xl:w-auto relative z-10">
          <!-- REP Money Block -->
          <div class="flex flex-col hud-card hud-row-item px-space-md py-1.5 items-center justify-center min-w-[125px]">
            <span class="font-label-hud text-[9px] uppercase tracking-wider text-on-surface-variant">${isEn ? 'REP CASH' : 'DINERO REP'}</span>
            <span class="font-label-data text-[15px] font-bold text-tertiary tracking-tight tabular-nums">${rep}</span>
          </div>

          <!-- Podiums Breakdown (P1, P2, P3, P4) -->
          <div class="flex items-center hud-card rounded-sm p-1 gap-1 border border-white/5">
            <div class="flex flex-col items-center px-2 py-0.5 rounded-sm ${v.p1 > 0 ? 'bg-primary-container text-black font-black shadow-sm' : ''}" title="${isEn ? '1st Place Victories' : '1er Lugar (Victorias)'}: ${v.p1 || 0}">
              <span class="font-label-hud text-[8px] uppercase font-black ${v.p1 > 0 ? 'text-black' : 'text-on-surface-variant'}">P1</span>
              <span class="font-label-data text-[12px] tabular-nums ${v.p1 > 0 ? 'font-black text-black' : 'text-on-surface-variant font-bold'}">${v.p1 || 0}</span>
            </div>
            <div class="flex flex-col items-center px-2 py-0.5 rounded-sm ${v.p2 > 0 ? 'bg-surface-bright text-white font-black border border-white/20 shadow-sm' : ''}" title="${isEn ? '2nd Place Podiums' : '2do Lugar'}: ${v.p2 || 0}">
              <span class="font-label-hud text-[8px] uppercase font-black ${v.p2 > 0 ? 'text-white' : 'text-on-surface-variant'}">P2</span>
              <span class="font-label-data text-[12px] tabular-nums ${v.p2 > 0 ? 'font-black text-white' : 'text-on-surface-variant font-bold'}">${v.p2 || 0}</span>
            </div>
            <div class="flex flex-col items-center px-2 py-0.5 rounded-sm ${v.p3 > 0 ? 'bg-[#cd7f32]/30 text-[#f59e0b] font-black border border-[#cd7f32]/40 shadow-sm' : ''}" title="${isEn ? '3rd Place Podiums' : '3er Lugar'}: ${v.p3 || 0}">
              <span class="font-label-hud text-[8px] uppercase font-black ${v.p3 > 0 ? 'text-[#f59e0b]' : 'text-on-surface-variant'}">P3</span>
              <span class="font-label-data text-[12px] tabular-nums ${v.p3 > 0 ? 'font-black text-[#f59e0b]' : 'text-on-surface-variant font-bold'}">${v.p3 || 0}</span>
            </div>
            <div class="flex flex-col items-center px-2 py-0.5 rounded-sm ${v.p4 > 0 ? 'bg-surface-container-highest text-on-surface font-black' : ''}" title="${isEn ? '4th Place' : '4to Lugar'}: ${v.p4 || 0}">
              <span class="font-label-hud text-[8px] uppercase font-black ${v.p4 > 0 ? 'text-on-surface' : 'text-on-surface-variant'}">P4</span>
              <span class="font-label-data text-[12px] tabular-nums ${v.p4 > 0 ? 'font-black text-on-surface' : 'text-on-surface-variant font-bold'}">${v.p4 || 0}</span>
            </div>
          </div>

          <!-- Time Bono -->
          <div class="flex flex-col hud-card hud-row-item px-space-md py-1.5 items-center justify-center min-w-[95px]">
            <span class="font-label-hud text-[9px] uppercase tracking-wider text-on-surface-variant">${isEn ? 'TIME BONUS' : 'TIME BONO'}</span>
            <span class="font-label-data text-[14px] font-bold text-primary-container tabular-nums">${timeBonusPts > 0 ? `+${timeBonusPts}` : '0'} PTS</span>
          </div>

          <!-- Total Score -->
          <div class="flex flex-col hud-card hud-row-item px-space-md py-1.5 items-center justify-center min-w-[110px]">
            <span class="font-label-hud text-[9px] uppercase tracking-wider text-on-surface-variant">TOTAL SCORE</span>
            <span class="font-label-timer-md text-label-timer-md font-black ${tagColor} tracking-tight tabular-nums">${pts.toLocaleString('es-ES')} PTS</span>
          </div>
        </div>

        <!-- Leader Status & Action Buttons -->
        <div class="flex items-center gap-space-xs w-full xl:w-auto justify-end relative z-10">
          ${isP1 ? `
          <span class="inline-flex items-center gap-1 tactical-badge-amber">
            <span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">military_tech</span>
            <span>${isEn ? 'LEADER #1' : 'LÍDER #1'}</span>
          </span>` : `
          <span class="inline-flex items-center gap-1 tactical-badge text-on-surface-variant">
            <span>${isEn ? 'DRIVER' : 'PILOTO'} #${driver.rank || rankNum}</span>
          </span>`}
          <button type="button" onclick="if (typeof window.selectDossierPilot === 'function') window.selectDossierPilot(${driver.rank || rankNum}); else if (typeof window.switchView === 'function') window.switchView('blacklist-cards');" class="inline-flex items-center gap-1.5 px-space-md py-2 rounded-sm bg-secondary-container hover:bg-secondary text-on-secondary font-headline-sm text-[12px] font-black uppercase tracking-wider transition-colors shadow-sm cursor-pointer" title="${isEn ? 'View Dossier File' : 'Ver Ficha Dossier'}">
            <span class="material-symbols-outlined text-[15px]">skull</span>
            <span>${isEn ? 'DOSSIER' : 'FICHA'}</span>
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  }

  function initStandingsControls() {
    const searchInput = document.getElementById('standings-search-input');
    if (searchInput) {
      searchInput.value = standingsSearchQuery;
      searchInput.oninput = (e) => {
        standingsSearchQuery = e.target.value;
        renderStandingsMatrix();
      };
    }

    const sortSelect = document.getElementById('standings-sort-filter');
    if (sortSelect) {
      sortSelect.value = standingsSortMode;
      sortSelect.onchange = (e) => {
        standingsSortMode = e.target.value;
        renderStandingsMatrix();
      };
    }

    const groupSelect = document.getElementById('standings-group-filter');
    if (groupSelect) {
      groupSelect.value = standingsGroupFilter;
      groupSelect.onchange = (e) => {
        standingsGroupFilter = e.target.value;
        renderStandingsMatrix();
      };
    }

    const weekSelect = document.getElementById('standings-week-filter');
    if (weekSelect) {
      weekSelect.value = standingsWeekFilter;
      weekSelect.onchange = (e) => {
        standingsWeekFilter = e.target.value;
        syncDriversWithChallengeResults(standingsWeekFilter);
        renderStandingsKPIStrip();
        renderStandingsMatrix();
      };
    }
  }

  /**
   * ========================================================
   * VIEW 3: TACTICAL DOSSIER & COCKPIT HUD MASTER-DETAIL CONTROLLER
   * Pixel-perfect Google Stitch Cyber-Telemetry Cockpit (128Hz Dyno)
   * ========================================================
   */
  let currentDossierRank = 1;
  let dossierSidebarGroupFilter = 'all';
  let dossierSidebarSearchQuery = '';

  /**
   * Returns all drivers strictly ordered by official Championship Standings:
   * 1. Total Score Descending (Points)
   * 2. REP Bounty Money Descending
   * 3. P1 Victories Descending
   */
  function getSortedDriversForDossier() {
    let list = [...driversData];
    list.sort((a, b) => {
      const ptsA = (typeof a.totalScore === 'number' ? a.totalScore : (a.points || a.totalPts || calculateDriverPoints(a)));
      const ptsB = (typeof b.totalScore === 'number' ? b.totalScore : (b.points || b.totalPts || calculateDriverPoints(b)));
      if (ptsB !== ptsA) return ptsB - ptsA;
      const repA = (typeof a.computedRep === 'number' ? a.computedRep : (a.rep || 0));
      const repB = (typeof b.computedRep === 'number' ? b.computedRep : (b.rep || 0));
      if (repB !== repA) return repB - repA;
      const vA = (a.computedVictories ? a.computedVictories.p1 : (a.victories ? a.victories.p1 : 0));
      const vB = (b.computedVictories ? b.computedVictories.p1 : (b.victories ? b.victories.p1 : 0));
      return vB - vA;
    });
    return list;
  }

  /**
   * Selects a driver in the Tactical Dossier cockpit and dynamically renders
   * all indicators, gauges, vehicle specs, REP bounties, and H2H delta comparator.
   */
  function selectDossierPilot(rankOrAlias, triggerSwitchView = true) {
    let target = null;
    if (typeof rankOrAlias === 'number') {
      target = driversData.find(d => d && (d.rank === rankOrAlias || d.id === rankOrAlias));
    } else if (typeof rankOrAlias === 'string') {
      target = findDriverByAlias(rankOrAlias);
    }
    const sorted = getSortedDriversForDossier();
    if (!target && sorted.length > 0) target = sorted[0];
    if (!target) return;

    currentDossierRank = target.rank;
    if (typeof window !== 'undefined') {
      window.currentDossierRank = target.rank;
    }

    if (triggerSwitchView && typeof window !== 'undefined' && typeof window.switchView === 'function') {
      const activeSection = document.querySelector('.view-section.active');
      if (!activeSection || activeSection.id !== 'view-blacklist-cards') {
        window.switchView('blacklist-cards');
      }
    }

    // Determine current standing position
    const standingIndex = sorted.findIndex(d => d.rank === target.rank);
    const standingPos = standingIndex >= 0 ? (standingIndex + 1) : (target.rank || 1);

    const nameEl = document.getElementById('dossier-hero-name');
    const rankEl = document.getElementById('dossier-hero-rank');
    const heatEl = document.getElementById('dossier-hero-heat');
    const idEl = document.getElementById('dossier-hero-id');
    const bioEl = document.getElementById('dossier-hero-bio');
    const ytEl = document.getElementById('dossier-hero-yt');
    const tagEmbossEl = document.getElementById('dossier-hero-tag-emboss');

    const repEl = document.getElementById('dossier-metric-rep');
    const ptsEl = document.getElementById('dossier-metric-pts');
    const rankTagEl = document.getElementById('dossier-hero-rank-tag');
    const leadIndEl = document.getElementById('dossier-lead-indicator');

    const winrateEl = document.getElementById('dossier-metric-winrate');
    const p1CountEl = document.getElementById('dossier-p1-count');
    const p1RateEl = document.getElementById('dossier-p1-rate');
    const p2CountEl = document.getElementById('dossier-p2-count');
    const p2RateEl = document.getElementById('dossier-p2-rate');
    const p3CountEl = document.getElementById('dossier-p3-count');
    const p3RateEl = document.getElementById('dossier-p3-rate');
    const p4CountEl = document.getElementById('dossier-p4-count');
    const p4RateEl = document.getElementById('dossier-p4-rate');

    const bonusEl = document.getElementById('dossier-metric-bonus');
    const bonusP2El = document.getElementById('dossier-bonus-p2');
    const bonusP3El = document.getElementById('dossier-bonus-p3');

    const rideEl = document.getElementById('dossier-spec-ride');
    const groupEl = document.getElementById('dossier-spec-group');
    const availEl = document.getElementById('dossier-spec-availability');
    const clusterCarEl = document.getElementById('dossier-cluster-car');
    const rpmEl = document.getElementById('dossier-rpm-readout');
    const speedEl = document.getElementById('dossier-top-speed');
    const accelEl = document.getElementById('dossier-accel-readout');

    const chosenEl = document.getElementById('dossier-sidebar-chosen');

    const v = target.computedVictories || target.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
    const bt = target.bestTimes || target.computedBestTimes || { first: 0, second: 0, third: 0 };
    const pts = (typeof target.totalScore === 'number') ? target.totalScore : calculateDriverPoints(target);
    const repVal = (typeof target.computedRep === 'number') ? target.computedRep : (target.rep || 0);
    const repFormatted = formatRepMoney(repVal);
    const alias = target.alias || target.name || `Piloto #${target.rank}`;
    const ride = target.ride || target.car || 'Porsche Carrera GT';

    if (nameEl) nameEl.innerHTML = `${escapeHtml(target.name || alias)} <span class="text-cyanic-400 font-mono text-xl sm:text-2xl">"${escapeHtml(alias)}"</span>`;
    if (rankEl) rankEl.textContent = `#${String(standingPos).padStart(2, '0')} BL`;
    if (rankTagEl) rankTagEl.textContent = `BLACKLIST #${String(standingPos).padStart(2, '0')}`;
    if (idEl) idEl.textContent = `ID: BL-${String(target.rank).padStart(2, '0')}-2026`;
    if (chosenEl) chosenEl.textContent = `#${String(standingPos).padStart(2, '0')}`;

    if (heatEl) {
      if (standingPos === 1) {
        heatEl.className = 'px-2 py-0.5 rounded bg-nitro-500 text-white text-[9px] font-mono font-black tracking-widest uppercase';
        heatEl.textContent = 'HEAT 5 // REIGNING LEADER';
      } else if (standingPos <= 3) {
        heatEl.className = 'px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-mono font-black tracking-widest uppercase';
        heatEl.textContent = 'HEAT 4 // ELITE CONTENDER';
      } else {
        heatEl.className = 'px-2 py-0.5 rounded bg-obsidian-850 text-slate-300 border border-obsidian-700 text-[9px] font-mono font-bold tracking-widest uppercase';
        heatEl.textContent = 'HEAT 3 // BLACKLIST CONTENDER';
      }
    }

    if (bioEl) bioEl.textContent = target.bio || target.schedule || 'Piloto Oficial Inscrito en el Campeonato 2026. Telemetría auditada a 128Hz bajo verificación MW-AC sin anomalías registradas.';
    if (tagEmbossEl) tagEmbossEl.textContent = alias.toUpperCase();
    if (ytEl) {
      if (target.youtube) {
        ytEl.href = target.youtube;
        ytEl.classList.remove('hidden');
      } else {
        ytEl.href = 'https://youtube.com';
      }
    }

    if (repEl) repEl.textContent = repFormatted;
    if (ptsEl) ptsEl.innerHTML = `${pts.toLocaleString('es-ES')} <span class="text-xs font-bold text-amber-500">PTS</span>`;

    const totalRuns = (v.p1 + v.p2 + v.p3 + v.p4) || (pts > 0 ? 8 : 0);
    const winRate = totalRuns > 0 ? Math.round((v.p1 / totalRuns) * 100) : 0;
    if (winrateEl) winrateEl.textContent = `${winRate}% WIN RATE`;

    if (p1CountEl) p1CountEl.textContent = v.p1 || 0;
    if (p1RateEl) p1RateEl.textContent = totalRuns > 0 ? `${Math.round(((v.p1 || 0) / totalRuns) * 100)}%` : '0%';
    if (p2CountEl) p2CountEl.textContent = v.p2 || 0;
    if (p2RateEl) p2RateEl.textContent = totalRuns > 0 ? `${Math.round(((v.p2 || 0) / totalRuns) * 100)}%` : '0%';
    if (p3CountEl) p3CountEl.textContent = v.p3 || 0;
    if (p3RateEl) p3RateEl.textContent = totalRuns > 0 ? `${Math.round(((v.p3 || 0) / totalRuns) * 100)}%` : '0%';
    if (p4CountEl) p4CountEl.textContent = v.p4 || 0;
    if (p4RateEl) p4RateEl.textContent = totalRuns > 0 ? `${Math.round(((v.p4 || 0) / totalRuns) * 100)}%` : '0%';

    const b1Times = bt.first || (target.computedBestTimes ? target.computedBestTimes.first : 0);
    const b2Times = bt.second || (target.computedBestTimes ? target.computedBestTimes.second : 0);
    const b3Times = bt.third || (target.computedBestTimes ? target.computedBestTimes.third : 0);
    if (bonusEl) bonusEl.textContent = `${b1Times} VECES (+${b1Times * 100})`;
    if (bonusP2El) bonusP2El.textContent = `${b2Times} veces (+${b2Times * 50})`;
    if (bonusP3El) bonusP3El.textContent = `${b3Times} veces (+${b3Times * 20})`;

    if (rideEl) rideEl.textContent = ride;
    if (clusterCarEl) clusterCarEl.textContent = ride;

    let groupLabel = target.groupName || '';
    if (!groupLabel) {
      if (target.rank <= 3) groupLabel = 'Grupo Alpha (Líderes)';
      else if (target.rank <= 6) groupLabel = 'Grupo Beta (Aspirantes)';
      else if (target.rank <= 9) groupLabel = 'Grupo Gamma (Perseguidores)';
      else if (target.rank <= 12) groupLabel = 'Grupo Delta (Contendientes)';
      else if (target.rank <= 15) groupLabel = 'Grupo Épsilon (Nuevos Rivales)';
      else groupLabel = 'Grupo Oficial';
    }
    if (groupEl) groupEl.textContent = `${groupLabel} • Rank #${standingPos}`;
    if (availEl) availEl.textContent = target.schedule || 'Disponibilidad confirmada para carreras oficiales y desafíos Blacklist.';

    // Dynamic telemetry specs
    if (rpmEl) rpmEl.textContent = (standingPos === 1 ? '8,400' : (standingPos === 2 ? '8,200' : (standingPos === 3 ? '8,100' : '8,000')));
    if (speedEl) speedEl.textContent = (standingPos === 1 ? '388' : (standingPos === 2 ? '382' : (standingPos === 3 ? '378' : (standingPos === 4 ? '375' : '368'))));
    if (accelEl) accelEl.textContent = (standingPos === 1 ? '2.41s' : (standingPos === 2 ? '2.45s' : (standingPos === 3 ? '2.52s' : '2.60s')));

    // H2H Delta Comparator Logic
    const leader = sorted[0] || target;
    const rival = sorted.length > 1 ? sorted[1] : target;
    const leaderPts = (typeof leader.totalScore === 'number') ? leader.totalScore : calculateDriverPoints(leader);
    const rivalPts = (typeof rival.totalScore === 'number') ? rival.totalScore : calculateDriverPoints(rival);

    let p1Target, p2Target;
    let p1StandingRank, p2StandingRank;
    if (standingPos === 1) {
      p1Target = leader;
      p1StandingRank = 1;
      p2Target = rival;
      p2StandingRank = 2;
    } else {
      p1Target = target;
      p1StandingRank = standingPos;
      p2Target = leader;
      p2StandingRank = 1;
    }

    const p1Pts = (typeof p1Target.totalScore === 'number') ? p1Target.totalScore : calculateDriverPoints(p1Target);
    const p2Pts = (typeof p2Target.totalScore === 'number') ? p2Target.totalScore : calculateDriverPoints(p2Target);
    const p1Rep = (typeof p1Target.computedRep === 'number') ? p1Target.computedRep : (p1Target.rep || 0);
    const p2Rep = (typeof p2Target.computedRep === 'number') ? p2Target.computedRep : (p2Target.rep || 0);
    const p1V = p1Target.computedVictories || p1Target.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
    const p2V = p2Target.computedVictories || p2Target.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
    const totalRuns1 = (p1V.p1 + p1V.p2 + p1V.p3 + p1V.p4) || (p1Pts > 0 ? 8 : 1);
    const totalRuns2 = (p2V.p1 + p2V.p2 + p2V.p3 + p2V.p4) || (p2Pts > 0 ? 8 : 1);
    const winRate1 = Math.round(((p1V.p1 || 0) / totalRuns1) * 100);
    const winRate2 = Math.round(((p2V.p1 || 0) / totalRuns2) * 100);

    const h2hHeaderEl = document.getElementById('dossier-h2h-header-tag');
    if (h2hHeaderEl) h2hHeaderEl.textContent = `#${String(p1StandingRank).padStart(2, '0')} vs #${String(p2StandingRank).padStart(2, '0')}`;

    const h2hP1NameEl = document.getElementById('dossier-h2h-p1-name');
    const h2hP1PtsEl = document.getElementById('dossier-h2h-p1-pts');
    const h2hP1RepEl = document.getElementById('dossier-h2h-p1-rep');
    const h2hP1P1El = document.getElementById('dossier-h2h-p1-p1');

    if (h2hP1NameEl) h2hP1NameEl.textContent = `#${p1StandingRank} ${(p1Target.alias || p1Target.name).toUpperCase()}`;
    if (h2hP1PtsEl) h2hP1PtsEl.textContent = p1Pts.toLocaleString('es-ES');
    if (h2hP1RepEl) h2hP1RepEl.textContent = `$${(p1Rep / 1000000).toFixed(2)}M`;
    if (h2hP1P1El) h2hP1P1El.textContent = `${p1V.p1}/${totalRuns1} (${winRate1}%)`;

    const h2hP2NameEl = document.getElementById('dossier-h2h-p2-name');
    const h2hP2PtsEl = document.getElementById('dossier-h2h-p2-pts');
    const h2hP2RepEl = document.getElementById('dossier-h2h-p2-rep');
    const h2hP2P1El = document.getElementById('dossier-h2h-p2-p1');

    if (h2hP2NameEl) h2hP2NameEl.textContent = `#${p2StandingRank} ${(p2Target.alias || p2Target.name).toUpperCase()}`;
    if (h2hP2PtsEl) h2hP2PtsEl.textContent = p2Pts.toLocaleString('es-ES');
    if (h2hP2RepEl) h2hP2RepEl.textContent = `$${(p2Rep / 1000000).toFixed(2)}M`;
    if (h2hP2P1El) h2hP2P1El.textContent = `${p2V.p1}/${totalRuns2} (${winRate2}%)`;

    // Dominance & Net Advantage
    const deltaPts = p1Pts - p2Pts;
    const deltaRep = p1Rep - p2Rep;
    const advEl = document.getElementById('dossier-h2h-advantage');
    if (advEl) {
      if (deltaPts >= 0) {
        advEl.textContent = `+${deltaPts} PTS / +$${Math.round(deltaRep / 1000)}K`;
        advEl.className = 'text-techgreen-400 font-black';
      } else {
        advEl.textContent = `${deltaPts} PTS / -$${Math.round(Math.abs(deltaRep) / 1000)}K`;
        advEl.className = 'text-amber-400 font-black';
      }
    }

    if (leadIndEl) {
      if (standingPos === 1) {
        const leadOverP2 = pts - p2Pts;
        leadIndEl.textContent = `+${leadOverP2} pts de ventaja`;
        leadIndEl.className = 'text-techgreen-400 font-bold';
      } else {
        const leadDiff = leaderPts - pts;
        leadIndEl.textContent = `-${leadDiff} pts del líder`;
        leadIndEl.className = 'text-amber-400 font-bold';
      }
    }

    // Dominance gauge bar
    const sumPts = (p1Pts + p2Pts) || 100;
    const barP1Percent = Math.max(5, Math.min(95, Math.round((p1Pts / sumPts) * 100)));
    const barP2Percent = 100 - barP1Percent;

    const barP1El = document.getElementById('dossier-h2h-bar-p1');
    const barP2El = document.getElementById('dossier-h2h-bar-p2');
    if (barP1El) barP1El.style.width = `${barP1Percent}%`;
    if (barP2El) barP2El.style.width = `${barP2Percent}%`;

    const labelP1El = document.getElementById('dossier-h2h-label-p1');
    const labelP2El = document.getElementById('dossier-h2h-label-p2');
    if (labelP1El) labelP1El.textContent = `${(p1Target.alias || p1Target.name).toUpperCase()} ${barP1Percent}% DOMINANCE`;
    if (labelP2El) labelP2El.textContent = `${(p2Target.alias || p2Target.name).toUpperCase()} ${barP2Percent}%`;

    renderDossierSidebar();
    renderDossierQuickDock();
  }

  /**
   * Renders the dynamic left sidebar in Tactical Dossiers
   */
  function renderDossierSidebar() {
    const listEl = document.getElementById('dossier-roster-list');
    if (!listEl) return;

    const isEn = (typeof i18next !== 'undefined' && i18next.language === 'en') ||
                 (typeof window !== 'undefined' && window.getCurrentLanguage && window.getCurrentLanguage() === 'en');

    const fullList = getSortedDriversForDossier();
    let list = [...fullList];

    if (dossierSidebarGroupFilter && dossierSidebarGroupFilter !== 'all') {
      const g = dossierSidebarGroupFilter.toLowerCase();
      list = list.filter(d => {
        const r = d.rank || 99;
        const grp = (d.groupName || '').toLowerCase();
        if (g === 'alpha' || g === 'alfa') return r <= 3 || grp.includes('alpha') || grp.includes('alfa');
        if (g === 'beta') return (r >= 4 && r <= 6) || grp.includes('beta');
        if (g === 'gamma' || g === 'gama') return (r >= 7 && r <= 9) || grp.includes('gamma') || grp.includes('gama');
        if (g === 'delta') return r >= 10 || grp.includes('delta') || grp.includes('epsilon');
        return true;
      });
    }

    if (dossierSidebarSearchQuery.trim()) {
      const q = dossierSidebarSearchQuery.trim().toLowerCase();
      list = list.filter(d => {
        const name = (d.name || '').toLowerCase();
        const alias = (d.alias || '').toLowerCase();
        const ride = (d.ride || d.car || '').toLowerCase();
        return name.includes(q) || alias.includes(q) || ride.includes(q);
      });
    }

    listEl.innerHTML = '';

    if (list.length === 0) {
      listEl.innerHTML = `
        <div class="text-center py-6 px-3 bg-obsidian-950/60 rounded border border-obsidian-800 text-slate-400 font-mono text-xs">
          ${isEn ? 'No rivals found with that filter' : 'No se encontraron rivales con ese filtro'}
        </div>
      `;
      return;
    }

    list.forEach(driver => {
      const standingIndex = fullList.findIndex(d => d.rank === driver.rank);
      const standingPos = (standingIndex >= 0) ? (standingIndex + 1) : (driver.rank || 1);
      const isSelected = (driver.rank === currentDossierRank);
      const isLeader = (standingPos === 1);
      const isPodium2 = (standingPos === 2);
      const isPodium3 = (standingPos === 3);

      const itemEl = document.createElement('div');
      itemEl.onclick = () => selectDossierPilot(driver.rank, false);

      const pts = (typeof driver.totalScore === 'number') ? driver.totalScore : calculateDriverPoints(driver);
      const repVal = (typeof driver.computedRep === 'number') ? driver.computedRep : (driver.rep || 0);
      const repFormatted = formatRepMoney(repVal);
      const alias = driver.alias || driver.name || (isEn ? `Driver #${driver.rank}` : `Piloto #${driver.rank}`);
      const ride = driver.ride || driver.car || 'Porsche Carrera GT';
      const v = driver.computedVictories || driver.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
      const totalRuns = (v.p1 + v.p2 + v.p3 + v.p4) || (pts > 0 ? 8 : 0);
      const winRate = totalRuns > 0 ? Math.round((v.p1 / totalRuns) * 100) : 0;

      let badgeClass = 'bg-obsidian-800 text-slate-300 border border-obsidian-700';
      if (isLeader) {
        badgeClass = 'bg-primary-container text-black font-black shadow-[0_0_12px_rgba(255,184,0,0.5)]';
      } else if (isPodium2) {
        badgeClass = 'bg-slate-200 text-black font-black border border-white/60';
      } else if (isPodium3) {
        badgeClass = 'bg-amber-600 text-black font-black border border-amber-400/50';
      }

      let statusSubtitle = `<span class="text-[10px] sm:text-[11px] text-slate-400 font-mono block leading-none mt-0.5">BLACKLIST #${driver.rank}</span>`;
      if (isLeader) {
        statusSubtitle = isEn
          ? '<span class="text-[10px] sm:text-[11px] text-primary-container font-mono font-bold block leading-none mt-0.5">👑 CHAMPIONSHIP LEADER</span>'
          : '<span class="text-[10px] sm:text-[11px] text-primary-container font-mono font-bold block leading-none mt-0.5">👑 LÍDER DEL CAMPEONATO</span>';
      } else if (isPodium2 || isPodium3) {
        statusSubtitle = isEn
          ? '<span class="text-[10px] sm:text-[11px] text-amber-400 font-mono font-semibold block leading-none mt-0.5">PODIUM // ELITE</span>'
          : '<span class="text-[10px] sm:text-[11px] text-amber-400 font-mono font-semibold block leading-none mt-0.5">PODIO // ELITE</span>';
      }

      if (isSelected) {
        itemEl.className = 'hud-bracket p-2.5 sm:p-3 rounded-lg bg-obsidian-800 border-2 border-cyanic-400 shadow-[0_0_15px_rgba(0,229,255,0.35)] relative cursor-pointer group transition-all';
      } else {
        itemEl.className = 'p-2.5 sm:p-3 rounded-lg bg-obsidian-850/60 hover:bg-obsidian-800 border border-obsidian-750 hover:border-cyanic-400/50 cursor-pointer transition-all';
      }

      itemEl.innerHTML = `
        <div class="flex items-start justify-between gap-1.5 mb-1.5">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-md ${badgeClass} font-black text-xs sm:text-sm font-mono flex items-center justify-center shrink-0">#${standingPos}</span>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-sm sm:text-[15px] font-black text-white font-mono uppercase tracking-wide truncate">${escapeHtml(alias)}</span>
                ${isLeader ? '<span class="w-2 h-2 rounded-full bg-techgreen-400 animate-pulse shrink-0"></span>' : ''}
              </div>
              ${statusSubtitle}
            </div>
          </div>
          <div class="text-right shrink-0">
            <span class="text-xs sm:text-[13px] font-mono font-black ${repVal > 0 ? 'text-techgreen-400' : 'text-slate-500'} block leading-tight">${repFormatted}</span>
            <span class="text-[11px] sm:text-xs font-mono ${pts > 0 ? 'text-cyanic-300 font-bold' : 'text-slate-500'} block mt-0.5">${pts.toLocaleString('es-ES')} PTS</span>
          </div>
        </div>
        <div class="flex items-center justify-between pt-1.5 border-t border-obsidian-800 text-[11px] font-mono text-slate-300">
          <span class="truncate max-w-[130px] font-medium text-slate-300">${escapeHtml(ride)}</span>
          <svg class="w-16 h-3.5 ${isLeader ? 'stroke-cyanic-400' : (isPodium2 ? 'stroke-amber-400' : 'stroke-slate-600')}" viewBox="0 0 60 12">
            <polyline fill="none" points="${standingPos === 1 ? '0,10 12,8 24,9 36,4 48,5 60,1' : (standingPos === 2 ? '0,11 12,9 24,7 36,8 48,3 60,4' : '0,12 12,11 24,10 36,9 48,8 60,8')}" stroke-width="1.5"></polyline>
          </svg>
          <span class="${winRate > 0 ? 'px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]' : 'text-slate-400 text-[10px]'}">${winRate > 0 ? winRate + '% W' : 'VERIFICADO'}</span>
        </div>
      `;

      listEl.appendChild(itemEl);
    });
  }

  function filterDossierSidebar(query) {
    dossierSidebarSearchQuery = query || '';
    renderDossierSidebar();
  }

  function filterDossierGroup(group, btn) {
    dossierSidebarGroupFilter = group || 'all';
    const buttons = document.querySelectorAll('.dossier-grp-filter-btn');
    buttons.forEach(b => {
      b.className = 'dossier-grp-filter-btn py-1 rounded bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-700 text-slate-400 text-center transition';
    });
    if (btn) {
      btn.className = 'dossier-grp-filter-btn py-1 rounded bg-cyanic-400 text-black font-extrabold text-center transition';
    }
    renderDossierSidebar();
  }

  function renderDossierQuickDock() {
    const dockEl = document.getElementById('dossier-quick-dock');
    if (!dockEl) return;

    const list = getSortedDriversForDossier();
    dockEl.innerHTML = '';

    list.forEach((driver, idx) => {
      const standingPos = idx + 1;
      const isSelected = (driver.rank === currentDossierRank);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.onclick = () => selectDossierPilot(driver.rank, false);

      if (isSelected) {
        btn.className = 'px-3 py-1.5 rounded bg-cyanic-400 text-black text-xs font-mono font-black whitespace-nowrap shadow-glow-cyan flex items-center gap-1 shrink-0';
      } else {
        btn.className = 'px-3 py-1.5 rounded bg-obsidian-850 hover:bg-obsidian-750 border border-obsidian-700 text-slate-300 hover:text-white text-xs font-mono font-bold whitespace-nowrap shrink-0 transition';
      }

      const alias = driver.alias || driver.name || `Piloto #${driver.rank}`;
      btn.innerHTML = `${standingPos === 1 ? '👑 ' : ''}#${standingPos} ${escapeHtml(alias.toUpperCase())}`;
      dockEl.appendChild(btn);
    });
  }

  /**
   * Initializes and populates Tactical Dossier view
   */
  async function loadDossierView(pilotRankOrAlias) {
    await loadTournamentData();
    syncDriversWithChallengeResults();
    const sorted = getSortedDriversForDossier();
    let target = null;
    if (pilotRankOrAlias) {
      target = findDriverByIdentifier(pilotRankOrAlias);
    }
    if (!target && currentDossierRank) {
      target = driversData.find(d => d && (d.rank === currentDossierRank || d.id === currentDossierRank));
    }
    if (!target && sorted.length > 0) {
      target = sorted[0];
    }
    if (target) {
      selectDossierPilot(target.rank, false);
    } else {
      renderDossierSidebar();
      renderDossierQuickDock();
    }
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Realtime Broadcast and Storage Synchronizer with admin.html
  if (typeof window !== 'undefined') {
    try {
      const syncChannel = new BroadcastChannel('nfs_championship_sync');
      syncChannel.onmessage = async (evt) => {
        console.info('[Championship Sync] Actualización recibida desde admin:', evt.data);
        if (evt.data && evt.data.data) {
          const raw = evt.data.data;
          let parsedWeeks = Array.isArray(raw) ? raw : Object.values(raw);
          parsedWeeks = parsedWeeks.filter(Boolean);
          if (parsedWeeks.length > 0) {
            parsedWeeks.sort((a, b) => (a.weekNumber || 0) - (b.weekNumber || 0));
            parsedWeeks.forEach(w => {
              if (w && Array.isArray(w.challenges)) {
                w.challenges.forEach(ch => {
                  ch.carRestriction = getChallengeCarRestriction(w.weekNumber, ch);
                });
              }
            });
            championshipWeeks = parsedWeeks;
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(championshipWeeks));
            } catch (e) {}
          }
        } else {
          await loadTournamentData();
        }
        renderTournamentKPIStrip();
        renderGroupsGrid();
        updateGroupFilterButtons();
        renderWeeklyChallenges();
        renderStandingsKPIStrip();
        renderStandingsMatrix();
      };
    } catch (e) {}

    window.addEventListener('storage', async (evt) => {
      if (evt.key === CHAMP_DRIVERS_STORAGE_KEY_V5 || evt.key === STORAGE_KEY || evt.key === 'nfs_championship_weeks_data_v3' || evt.key === 'nfs_blacklist_championship_2026_v5' || evt.key === 'nfs_blacklist_championship_2026_v4') {
        if (evt.key === STORAGE_KEY || evt.key === 'nfs_championship_weeks_data_v3') {
          try {
            const cached = localStorage.getItem(STORAGE_KEY);
            if (cached) {
              const parsed = JSON.parse(cached);
              let parsedWeeks = Array.isArray(parsed) ? parsed : Object.values(parsed);
              parsedWeeks = parsedWeeks.filter(Boolean);
              if (parsedWeeks.length > 0) {
                parsedWeeks.sort((a, b) => (a.weekNumber || 0) - (b.weekNumber || 0));
                parsedWeeks.forEach(w => {
                  if (w && Array.isArray(w.challenges)) {
                    w.challenges.forEach(ch => {
                      ch.carRestriction = getChallengeCarRestriction(w.weekNumber, ch);
                    });
                  }
                });
                championshipWeeks = parsedWeeks;
              }
            }
          } catch (e) {}
        }
        await loadTournamentData();
        renderTournamentKPIStrip();
        renderGroupsGrid();
        updateGroupFilterButtons();
        renderWeeklyChallenges();
        renderStandingsKPIStrip();
        renderStandingsMatrix();
      }
    });
  }

  // Global exposure
  if (typeof window !== 'undefined') {
    window.loadTournamentGroupsView = loadTournamentGroupsView;
    window.loadStandingsView = loadStandingsView;
    window.loadTournamentData = loadTournamentData;
    window.calculateDriverPoints = calculateDriverPoints;
    window.syncDriversWithChallengeResults = syncDriversWithChallengeResults;
    window.selectChampionshipGroupTab = selectChampionshipGroupTab;
    window.renderWeeklyChallenges = renderWeeklyChallenges;
    window.updateGroupFilterButtons = updateGroupFilterButtons;
    window.selectDossierPilot = selectDossierPilot;
    window.getSortedDrivers = getSortedDrivers;
    window.getSortedDriversForDossier = getSortedDriversForDossier;
    window.loadDossierView = loadDossierView;
    window.renderDossierSidebar = renderDossierSidebar;
    window.renderDossierQuickDock = renderDossierQuickDock;
    window.filterDossierSidebar = filterDossierSidebar;
    window.filterDossierGroup = filterDossierGroup;
  }
  if (typeof module !== 'undefined') {
    module.exports = {
      loadTournamentGroupsView,
      loadStandingsView,
      calculateDriverPoints,
      syncDriversWithChallengeResults,
      getChallengeCarRestriction,
      getSortedDrivers,
      getSortedDriversForDossier,
      loadDossierView,
      selectDossierPilot,
      renderDossierSidebar,
      renderDossierQuickDock,
      filterDossierSidebar,
      filterDossierGroup
    };
  }
})();
