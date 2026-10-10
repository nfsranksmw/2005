/**
 * NFSMW RANKS // Tournament & Blacklist Controller
 * Pixel-perfect adaptation of Google Stitch:
 * 1. 'nfsmw_ranks_blacklist_event_2026_grupos_desaf_os' (Groups & Weekly Challenges)
 * 2. 'nfsmw_ranks_blacklist_2026_standings' (Championship Standings)
 * Synchronized with live Firebase Realtime Database
 */

(function () {
  const FIREBASE_WEEKS_URL = "https://nfsranks-blacklist-default-rtdb.firebaseio.com/records/championship_weeks_data.json";
  const FIREBASE_PARTICIPANTS_URL = "https://nfsranks-blacklist-default-rtdb.firebaseio.com/records/registered_participants.json";
  const STORAGE_KEY = 'nfs_championship_weeks_data_v3';

  // State Management
  let activeWeekIndex = 1; // 0 = Week 1, 1 = Week 2, 2 = Week 3, 3 = Week 4
  let currentChampionshipGroupTab = 0; // 0 = Alpha, 1 = Beta, 2 = Gamma, 3 = Delta
  let standingsSearchQuery = '';
  let standingsGroupFilter = 'all';
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
    const v = driver.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
    const bt = driver.bestTimes || { first: 0, second: 0, third: 0 };
    const p1Pts = (v.p1 || 0) * 25;
    const p2Pts = (v.p2 || 0) * 18;
    const p3Pts = (v.p3 || 0) * 15;
    const p4Pts = (v.p4 || 0) * 12;
    const bonusPts = (typeof driver.bonusPoints === 'number')
      ? driver.bonusPoints
      : (((bt.first || 0) * 100) + ((bt.second || 0) * 50) + ((bt.third || 0) * 20));
    const repPts = Math.floor((driver.rep || 0) / 10000);
    return p1Pts + p2Pts + p3Pts + p4Pts + bonusPts + repPts;
  }

  /**
   * Fetch and synchronize championship data with Firebase RTDB
   */
  async function loadTournamentData() {
    // 1. Initialize drivers from fallback
    if (typeof window !== 'undefined' && window.DEFAULT_BLACKLIST_DRIVERS) {
      driversData = JSON.parse(JSON.stringify(window.DEFAULT_BLACKLIST_DRIVERS));
    } else if (typeof DEFAULT_BLACKLIST_DRIVERS !== 'undefined') {
      driversData = JSON.parse(JSON.stringify(DEFAULT_BLACKLIST_DRIVERS));
    }

    // 2. Load from localStorage cache
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

    // 4. Fetch live from Firebase RTDB (Weeks Data & Registered Participants)
    try {
      const [resWeeks, resParts] = await Promise.all([
        fetch(`${FIREBASE_WEEKS_URL}?_t=${Date.now()}`, { cache: 'no-store' }),
        fetch(`${FIREBASE_PARTICIPANTS_URL}?_t=${Date.now()}`, { cache: 'no-store' }).catch(() => null)
      ]);
      if (resWeeks && resWeeks.ok) {
        const liveData = await resWeeks.json();
        if (liveData) {
          let parsedWeeks = Array.isArray(liveData) ? liveData : Object.values(liveData);
          parsedWeeks = parsedWeeks.filter(Boolean);
          if (parsedWeeks.length > 0) {
            // Sort by weekNumber if available
            parsedWeeks.sort((a, b) => (a.weekNumber || 0) - (b.weekNumber || 0));

            // Enrich any missing carRestriction from local blueprint
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
                victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
                bestTimes: { first: 0, second: 0, third: 0 }
              });
            }
          });
        }
      }
    } catch (err) {
      console.warn("Aviso: No se pudo conectar a Firebase RTDB para Championship Weeks:", err);
    }

    // Ensure array structure
    if (!Array.isArray(championshipWeeks)) {
      championshipWeeks = Object.values(championshipWeeks || {});
    }

    // Compute updated driver scores based on challenge results
    syncDriversWithChallengeResults();
  }

  /**
   * Sync challenge victories and best times into driver objects
   */
  function syncDriversWithChallengeResults() {
    if (!Array.isArray(driversData) || driversData.length === 0) return;

    // Reset weekly counters before re-aggregating
    driversData.forEach(d => {
      d.computedVictories = { p1: d.victories ? (d.victories.p1 || 0) : 0, p2: d.victories ? (d.victories.p2 || 0) : 0, p3: d.victories ? (d.victories.p3 || 0) : 0, p4: d.victories ? (d.victories.p4 || 0) : 0 };
      d.computedBonus = (d.bestTimes ? ((d.bestTimes.first || 0) * 100 + (d.bestTimes.second || 0) * 50 + (d.bestTimes.third || 0) * 20) : 0);
      d.computedRep = d.rep || 0;
    });

    // Scan all weeks challenges for victories and bonus points
    championshipWeeks.forEach(week => {
      if (!week || !Array.isArray(week.challenges)) return;
      week.challenges.forEach(ch => {
        if (!ch) return;
        if (Array.isArray(ch.top3)) {
          ch.top3.forEach((t, idx) => {
            if (!t || !t.pilot) return;
            const driver = findDriverByAlias(t.pilot);
            if (driver) {
              if (idx === 0) {
                driver.computedVictories.p1++;
                driver.computedBonus += (t.bonus || 100);
              } else if (idx === 1) {
                driver.computedVictories.p2++;
                driver.computedBonus += (t.bonus || 50);
              } else if (idx === 2) {
                driver.computedVictories.p3++;
                driver.computedBonus += (t.bonus || 20);
              }
              if (t.repMoney) driver.computedRep += t.repMoney;
            }
          });
        }
      });
    });

    // Compute final points
    driversData.forEach(d => {
      const v = d.computedVictories;
      const pts = (v.p1 * 25) + (v.p2 * 18) + (v.p3 * 15) + (v.p4 * 12) + d.computedBonus + Math.floor(d.computedRep / 10000);
      d.totalScore = pts;
    });
  }

  /**
   * Helper to find driver by alias, name, or rank
   */
  function findDriverByAlias(identifier) {
    if (!identifier || !Array.isArray(driversData)) return null;
    const clean = String(identifier).trim().toLowerCase();
    return driversData.find(d => {
      const name = (d.name || '').toLowerCase();
      const alias = (d.alias || '').toLowerCase();
      return name === clean || alias === clean || alias.includes(clean) || clean.includes(alias);
    });
  }

  /**
   * Format REP Money: e.g. 3850000 -> "$3.850.000 REP"
   */
  function formatRepMoney(num) {
    if (!num) return "$0 REP";
    return "$" + String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " REP";
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

    const weekLabels = [
      { num: 1, label: "SEMANA 1", dates: "03 - 09 OCT", tag: "FINALIZADA" },
      { num: 2, label: "SEMANA 2", dates: "10 - 16 OCT", tag: "EN CURSO" },
      { num: 3, label: "SEMANA 3", dates: "17 - 23 OCT", tag: "PRÓXIMA" },
      { num: 4, label: "SEMANA 4", dates: "24 - 31 OCT", tag: "GRAN FINAL" }
    ];

    weekLabels.forEach((w, idx) => {
      const isActive = (idx === activeWeekIndex);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `flex flex-col sm:flex-row items-center gap-1.5 px-4 py-2.5 rounded-lg font-headline-sm text-body-sm uppercase transition-all ${
        isActive
          ? "bg-primary-container text-on-primary-container shadow-[0_0_16px_rgba(255,184,0,0.35)] font-bold scale-[1.02]"
          : "bg-surface-container-high/60 hover:bg-surface-container-high text-outline hover:text-on-surface"
      }`;

      btn.innerHTML = `
        <span class="flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">${isActive ? 'flag' : 'calendar_today'}</span>
          ${w.label}
        </span>
        <span class="font-label-data text-[10px] ${isActive ? 'text-on-primary-container/80' : 'text-outline-variant'}">
          (${w.dates})
        </span>
        <span class="px-1.5 py-0.2 rounded text-[9px] font-label-hud font-bold ${
          isActive ? 'bg-black/20 text-on-primary-container' : 'bg-surface-container text-outline'
        }">
          ${w.tag}
        </span>
      `;

      btn.addEventListener('click', () => {
        activeWeekIndex = idx;
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
    const leader = sorted[0] || { name: 'SRTxAvenger', totalScore: 1328 };

    // Total Rep Pot across all drivers
    let totalRep = 0;
    driversData.forEach(d => totalRep += (d.rep || 0));
    if (totalRep === 0) totalRep = 3850000;

    const leaderNameEl = document.getElementById('t-kpi-leader-name');
    if (leaderNameEl) leaderNameEl.textContent = leader.alias || leader.name;
    const leaderPtsEl = document.getElementById('t-kpi-leader-pts');
    if (leaderPtsEl) leaderPtsEl.textContent = `${leader.totalScore || 1328} PTS`;

    const repPotEl = document.getElementById('t-kpi-rep-pot');
    if (repPotEl) repPotEl.textContent = formatRepMoney(totalRep);

    const weekProgEl = document.getElementById('t-kpi-week-progress');
    if (weekProgEl) weekProgEl.textContent = `Semana ${activeWeekIndex + 1} / 4`;

    const statusEl = document.getElementById('t-kpi-status');
    if (statusEl) statusEl.textContent = "COMPETICIÓN EN VIVO // 128Hz";
  }

  /**
   * Renders the 4 Racing Groups (Alpha, Beta, Gamma, Delta) for the selected week
   */
  function renderGroupsGrid() {
    const container = document.getElementById('tournament-groups-grid');
    if (!container) return;
    container.innerHTML = '';

    const currentWeek = getActiveWeek();
    const groups = (currentWeek && Array.isArray(currentWeek.groups) && currentWeek.groups.length > 0)
      ? currentWeek.groups
      : [
        { name: "Grupo Alpha (Líderes)", tag: "🔥 TIER SUPREME", pilots: [1, 10, 3] },
        { name: "Grupo Beta (Aspirantes)", tag: "⚡ TIER HIGH", pilots: [4, 5, 6] },
        { name: "Grupo Gamma (Fuerza & Potencia)", tag: "⚔️ TIER MID-HIGH", pilots: [7, 8, "open_11"] },
        { name: "Grupo Delta (Competición)", tag: "🏁 TIER COMPETICIÓN", pilots: [9, 2, "open_12"] }
      ];

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
      card.className = `bg-surface-container-low rounded-xl p-space-md shadow-xl flex flex-col gap-space-md hover-card-lift transition-all cursor-pointer border ${
        isSelected ? 'border-primary-container ring-1 ring-primary-container/50' : 'border-surface-container-highest/40'
      }`;

      // Drivers in group
      const pilotsList = Array.isArray(grp.pilots) ? grp.pilots : [];
      let pilotsHtml = '';

      pilotsList.forEach((pIdentifier, pIdx) => {
        const isOpenSlot = (typeof pIdentifier === 'string' && pIdentifier.toLowerCase().includes('open')) ||
                           pIdentifier === 0 || pIdentifier === '0';

        if (isOpenSlot) {
          let slotNum = 11;
          if (typeof pIdentifier === 'string') {
            const digits = pIdentifier.replace(/\D/g, '');
            slotNum = digits ? parseInt(digits, 10) : (gIdx * 3 + pIdx + 1);
          } else {
            slotNum = gIdx * 3 + pIdx + 1;
          }

          pilotsHtml += `
            <div class="bg-surface-container-lowest/60 hover:bg-surface-container transition-all p-space-sm rounded-lg flex items-center justify-between gap-space-xs border border-dashed border-outline-variant/40">
              <div class="flex items-center gap-space-sm min-w-0">
                <div class="w-7 h-7 rounded bg-surface-container-highest/60 text-outline font-headline-sm text-body-sm flex items-center justify-center font-black">${slotNum}</div>
                <div class="flex flex-col min-w-0">
                  <span class="font-headline-sm text-[13px] leading-tight uppercase text-on-surface-variant font-extrabold truncate">Plaza Disponible #${slotNum}</span>
                  <span class="font-label-data text-[10px] text-primary-container truncate font-bold">Esperando Piloto</span>
                </div>
              </div>
              <div class="flex flex-col text-right shrink-0">
                <span class="font-label-data text-[11px] text-on-surface-variant font-bold">OPEN</span>
                <span class="font-label-data text-[10px] text-outline font-bold">$0</span>
              </div>
            </div>
          `;
          return;
        }

        let driver = null;
        if (typeof pIdentifier === 'number') {
          driver = driversData.find(d => d.rank === pIdentifier || d.id === pIdentifier);
          if (!driver && typeof DEFAULT_BLACKLIST_DRIVERS !== 'undefined') {
            driver = DEFAULT_BLACKLIST_DRIVERS.find(d => d.rank === pIdentifier);
          }
        } else if (typeof pIdentifier === 'string') {
          driver = findDriverByAlias(pIdentifier);
        } else if (pIdentifier && typeof pIdentifier === 'object') {
          driver = pIdentifier;
        }

        const rankNum = pIdx + 1;
        const driverRank = driver ? driver.rank : (typeof pIdentifier === 'number' ? pIdentifier : rankNum);
        const name = driver ? (driver.alias || driver.name) : (typeof pIdentifier === 'string' ? pIdentifier : `Piloto #${pIdentifier}`);
        const car = driver ? (driver.ride || driver.car || 'Porsche Carrera GT') : 'Porsche Carrera GT';
        const rep = driver ? formatRepMoney(driver.computedRep || driver.rep) : '$1.250.000 REP';
        const pts = driver ? (driver.totalScore || calculateDriverPoints(driver)) : 0;

        let badgeBg = 'bg-surface-container-highest text-on-surface';
        let ptsClass = 'text-tertiary';
        if (rankNum === 1) {
          badgeBg = 'bg-primary-container text-on-primary-container';
          ptsClass = 'text-primary-container';
        } else if (rankNum === 2) {
          badgeBg = 'bg-secondary-container/30 text-secondary';
          ptsClass = 'text-secondary';
        }

        pilotsHtml += `
          <div class="bg-surface-container hover:bg-surface-container-high transition-all p-space-sm rounded-lg flex items-center justify-between gap-space-xs">
            <div class="flex items-center gap-space-sm min-w-0">
              <div class="w-7 h-7 rounded ${badgeBg} font-headline-sm text-body-sm flex items-center justify-center font-black">${driverRank}</div>
              <div class="flex flex-col min-w-0">
                <span class="font-headline-sm text-[13.5px] leading-tight uppercase text-on-surface font-extrabold truncate">${escapeHtml(name)}</span>
                <span class="font-label-data text-[10px] text-on-surface-variant truncate">${escapeHtml(car)}</span>
              </div>
            </div>
            <div class="flex flex-col text-right shrink-0">
              <span class="font-label-data text-label-data ${ptsClass} font-bold">${pts} PTS</span>
              <span class="font-label-data text-[10px] text-tertiary font-bold">${rep}</span>
            </div>
          </div>
        `;
      });

      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-space-xs min-w-0">
            <span class="w-2.5 h-2.5 rounded-sm ${style.dot} shrink-0"></span>
            <span class="font-headline-sm text-headline-sm uppercase text-on-surface font-black truncate">${escapeHtml(grp.name)}</span>
          </div>
          <span class="font-label-hud text-label-hud uppercase px-space-xs py-[2px] ${style.tierBg} rounded shrink-0 font-bold">${escapeHtml(tierBadge)}</span>
        </div>
        <div class="flex flex-col gap-space-xs">
          ${pilotsHtml}
        </div>
        <div class="mt-auto pt-2 border-t border-surface-container-highest/30 flex items-center justify-between">
          <span class="font-label-data text-[10px] uppercase text-outline flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-secondary">directions_car</span>
            <span>8 RUTAS • COCHE RESTRINGIDO</span>
          </span>
          <span class="font-label-hud text-[10px] uppercase ${isSelected ? 'text-primary font-bold' : 'text-on-surface-variant'} flex items-center gap-1">
            <span>${isSelected ? 'ACTIVO' : 'VER RUTAS'}</span>
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

    const groupBtns = [
      document.getElementById('btn-bl-group-0'),
      document.getElementById('btn-bl-group-1'),
      document.getElementById('btn-bl-group-2'),
      document.getElementById('btn-bl-group-3')
    ];

    const icons = ['local_fire_department', 'bolt', 'swords', 'radio_button_checked'];

    groupBtns.forEach((btn, idx) => {
      if (!btn) return;
      const grp = groups[idx] || { name: `Grupo #${idx + 1}` };
      const isActive = (idx === currentChampionshipGroupTab);

      let label = (grp.name || `GRUPO #${idx + 1}`).toUpperCase();
      if (label.includes('(')) {
        label = label.split('(')[0].trim();
      }

      btn.innerHTML = `
        <span class="material-symbols-outlined text-[16px]">${icons[idx] || 'sports_motorsports'}</span>
        <span>${escapeHtml(label)}</span>
      `;

      if (isActive) {
        btn.className = "px-space-md py-space-xs rounded bg-primary-container text-on-primary-container font-label-hud text-label-hud uppercase tracking-wider font-black shadow-md flex items-center gap-space-xs transition-all cursor-pointer scale-[1.02]";
      } else {
        btn.className = "px-space-md py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-hud text-label-hud uppercase tracking-wider transition-colors flex items-center gap-space-xs cursor-pointer";
      }
    });
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
          <p class="font-headline-sm text-base text-outline uppercase font-bold">No hay desafíos registrados para esta semana</p>
        </div>
      `;
      return;
    }

    challenges.forEach((ch, idx) => {
      const card = document.createElement('div');
      card.className = "bg-surface-container-low rounded-xl p-space-md shadow-xl flex flex-col gap-space-md hover-card-lift transition-all border border-surface-container-highest/30";

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
        top3 = ch.top3;
      }

      // 2. Determinar coche restringido de la ficha
      const restrictionCar = getChallengeCarRestriction(weekNum, ch);

      // Si no hay top3 cargado para este grupo en esta semana, aplicar la rotación de activeGrp.pilots:
      if (!top3 || !Array.isArray(top3) || top3.length === 0) {
        const grpPilots = (activeGrp && Array.isArray(activeGrp.pilots)) ? activeGrp.pilots : [];
        top3 = [1, 2, 3].map((pos, pIdx) => {
          const pilotId = grpPilots[pIdx];
          let pilotName = 'Por disputar';
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
              pilotName = `Plaza Disponible #${slotNum}`;
              carName = 'Esperando Piloto';
            } else if (typeof pilotId === 'string') {
              pilotName = pilotId;
            }
          }
          const bonus = pos === 1 ? 100 : (pos === 2 ? 50 : 20);
          const repMoney = pos === 1 ? 400000 : (pos === 2 ? 250000 : 120000);
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

      const formatRep = (r) => {
        if (!r && r !== 0) return '$400K REP';
        if (typeof r === 'string') return r.replace('💰 ', '');
        if (r >= 1000000) return `$${(r/1000000).toFixed(1)}M REP`;
        if (r >= 1000) return `$${Math.round(r/1000)}K REP`;
        return `$${r} REP`;
      };

      const getPilotCar = (p) => {
        if (!p.time || p.time === '--:--.---' || p.time.includes('--')) {
          return restrictionCar;
        }
        return p.car || restrictionCar;
      };

      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-space-xs">
            <span class="font-headline-sm text-headline-sm uppercase text-primary-container font-black">#${String(idx + 1).padStart(2, '0')}</span>
            <span class="font-headline-sm text-headline-sm uppercase text-on-surface font-extrabold truncate">${escapeHtml(ch.route || 'Ruta')}</span>
          </div>
          <span class="font-label-hud text-label-hud uppercase px-space-xs py-[2px] bg-surface-container-highest text-on-surface rounded font-bold">${escapeHtml((ch.type || 'Circuito').toUpperCase())}</span>
        </div>

        <!-- Coche Restringido & Grupo Pill (Estilo Web Oficial NFS MW) -->
        <div class="bl-restriction-row bg-surface-container-lowest px-space-sm py-space-xs rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-xs border border-surface-container-highest/40 shadow-inner">
          <div class="flex items-center gap-space-xs min-w-0">
            <span class="material-symbols-outlined text-[16px] text-secondary">directions_car</span>
            <span class="font-label-data text-label-data text-on-surface-variant font-bold">COCHE RESTRINGIDO:</span>
            <span class="font-label-data text-label-data text-primary font-bold truncate">${escapeHtml(restrictionCar)}</span>
          </div>
          <div class="flex items-center gap-space-xs shrink-0">
            <span class="font-label-data text-label-data text-on-surface-variant">GRUPO:</span>
            <span class="font-label-data text-label-data text-secondary font-bold">${escapeHtml(grpName.toUpperCase())}</span>
            <span class="font-label-hud text-[10px] text-tertiary px-1.5 py-0.5 rounded bg-surface-container-high shrink-0 font-bold">${escapeHtml(activeGrp.tag || 'TIER COMPETICIÓN')}</span>
          </div>
        </div>

        <!-- Times list -->
        <div class="flex flex-col gap-space-xs">
          <!-- P1 -->
          <div class="bg-surface-container-high p-space-sm rounded-lg flex items-center justify-between shadow-inner">
            <div class="flex items-center gap-space-xs min-w-0">
              <span class="w-5 h-5 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[12px] flex items-center justify-center font-bold">1</span>
              <div class="flex flex-col min-w-0">
                <span class="font-headline-sm text-[13px] uppercase text-on-surface font-bold truncate">${escapeHtml(p1.pilot || 'Por disputar')}</span>
                <span class="font-label-data text-[10px] text-on-surface-variant truncate">${escapeHtml(getPilotCar(p1))}</span>
              </div>
            </div>
            <div class="flex flex-col text-right shrink-0">
              <span class="font-label-data text-label-data text-primary-container font-bold">${escapeHtml(p1.time || '--:--.---')}</span>
              <div class="flex items-center justify-end gap-1">
                <span class="font-label-data text-[10px] text-secondary font-bold">+${p1.bonus || 100} PTS</span>
                <span class="font-label-data text-[10px] text-tertiary font-bold">${formatRep(p1.repMoney || p1.rep)}</span>
              </div>
            </div>
          </div>

          <!-- P2 -->
          <div class="bg-surface-container p-space-sm rounded-lg flex items-center justify-between">
            <div class="flex items-center gap-space-xs min-w-0">
              <span class="w-5 h-5 rounded-full bg-surface-container-highest text-on-surface font-headline-sm text-[12px] flex items-center justify-center font-bold">2</span>
              <div class="flex flex-col min-w-0">
                <span class="font-headline-sm text-[13px] uppercase text-on-surface font-bold truncate">${escapeHtml(p2.pilot || 'Por disputar')}</span>
                <span class="font-label-data text-[10px] text-on-surface-variant truncate">${escapeHtml(getPilotCar(p2))}</span>
              </div>
            </div>
            <div class="flex flex-col text-right shrink-0">
              <span class="font-label-data text-label-data text-on-surface font-bold">${escapeHtml(p2.time || '--:--.---')}</span>
              <div class="flex items-center justify-end gap-1">
                <span class="font-label-data text-[10px] text-secondary font-bold">+${p2.bonus || 50} PTS</span>
                <span class="font-label-data text-[10px] text-tertiary font-bold">${formatRep(p2.repMoney || p2.rep)}</span>
              </div>
            </div>
          </div>

          <!-- P3 -->
          <div class="bg-surface-container p-space-sm rounded-lg flex items-center justify-between">
            <div class="flex items-center gap-space-xs min-w-0">
              <span class="w-5 h-5 rounded-full bg-surface-container-highest text-on-surface font-headline-sm text-[12px] flex items-center justify-center font-bold">3</span>
              <div class="flex flex-col min-w-0">
                <span class="font-headline-sm text-[13px] uppercase text-on-surface font-bold truncate">${escapeHtml(p3.pilot || 'Por disputar')}</span>
                <span class="font-label-data text-[10px] text-on-surface-variant truncate">${escapeHtml(getPilotCar(p3))}</span>
              </div>
            </div>
            <div class="flex flex-col text-right shrink-0">
              <span class="font-label-data text-label-data text-on-surface font-bold">${escapeHtml(p3.time || '--:--.---')}</span>
              <div class="flex items-center justify-end gap-1">
                <span class="font-label-data text-[10px] text-secondary font-bold">+${p3.bonus || 20} PTS</span>
                <span class="font-label-data text-[10px] text-tertiary font-bold">${formatRep(p3.repMoney || p3.rep)}</span>
              </div>
            </div>
          </div>
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
    renderStandingsKPIStrip();
    renderStandingsMatrix();
    initStandingsControls();
  }

  function getSortedDrivers() {
    let list = [...driversData];

    // Filter by Group
    if (standingsGroupFilter !== 'all') {
      const gFilter = standingsGroupFilter.toLowerCase();
      list = list.filter(d => {
        if (gFilter === 'alpha') return d.rank <= 3;
        if (gFilter === 'beta') return d.rank >= 4 && d.rank <= 6;
        if (gFilter === 'gamma') return d.rank >= 7 && d.rank <= 9;
        if (gFilter === 'delta') return d.rank >= 10 && d.rank <= 15;
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

    // Sort Modes
    if (standingsSortMode === 'rep') {
      list.sort((a, b) => (b.computedRep || b.rep || 0) - (a.computedRep || a.rep || 0));
    } else if (standingsSortMode === 'victories') {
      list.sort((a, b) => {
        const vA = (a.computedVictories ? a.computedVictories.p1 : (a.victories ? a.victories.p1 : 0));
        const vB = (b.computedVictories ? b.computedVictories.p1 : (b.victories ? b.victories.p1 : 0));
        return vB - vA;
      });
    } else {
      // Default: total points descending
      list.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
    }

    return list;
  }

  /**
   * Renders the 4-Block Championship KPI Grid
   */
  function renderStandingsKPIStrip() {
    const sorted = getSortedDrivers();
    const leader = sorted[0] || { name: 'SRTxAvenger', totalScore: 1328 };

    // Total Rep Pot across all drivers
    let totalRep = 0;
    driversData.forEach(d => totalRep += (d.rep || 0));
    if (totalRep === 0) totalRep = 3850000;

    const leaderEl = document.getElementById('s-kpi-leader');
    if (leaderEl) leaderEl.textContent = leader.alias || leader.name;
    const ptsEl = document.getElementById('s-kpi-leader-pts');
    if (ptsEl) ptsEl.textContent = `${leader.totalScore || 1328} PTS`;

    const repEl = document.getElementById('s-kpi-rep');
    if (repEl) repEl.textContent = formatRepMoney(totalRep);

    const runsEl = document.getElementById('s-kpi-runs');
    if (runsEl) runsEl.textContent = "84 RUNS";

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

    const sorted = getSortedDrivers();
    if (sorted.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 px-4 bg-surface-container-low rounded-xl">
          <span class="material-symbols-outlined text-[48px] text-outline mb-2">person_off</span>
          <p class="font-headline-sm text-base text-outline uppercase font-bold">No se encontraron pilotos con el filtro seleccionado</p>
        </div>
      `;
      return;
    }

    sorted.forEach((driver, idx) => {
      const rankNum = idx + 1;
      const isP1 = (rankNum === 1);
      const isP2 = (rankNum === 2);
      const isP3 = (rankNum === 3);

      const card = document.createElement('div');

      // Colors & Gauges according to Google Stitch
      let edgeGauge = 'bg-surface-container-highest';
      let rankBadge = 'w-12 h-12 rounded bg-surface-container-high text-on-surface-variant flex items-center justify-center font-headline-md text-headline-md font-black flex-shrink-0';
      let rowBg = 'bg-surface-container-lowest hover:bg-surface-container-low';
      let iconColor = 'text-secondary-container';
      let iconName = 'sports_motorsports';
      let tagColor = 'text-secondary';

      if (isP1) {
        edgeGauge = 'bg-primary-container shadow-[0_0_12px_#ffb800]';
        rankBadge = 'w-12 h-12 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md text-headline-md font-black flex-shrink-0 shadow-lg';
        rowBg = 'bg-surface-container/60 hover:bg-surface-container-high/60 border border-primary-container/30';
        iconColor = 'text-primary-container';
        iconName = 'crown';
        tagColor = 'text-primary-container';
      } else if (isP2) {
        edgeGauge = 'bg-surface-variant';
        rankBadge = 'w-12 h-12 rounded bg-surface-container-highest text-on-surface flex items-center justify-center font-headline-md text-headline-md font-black flex-shrink-0';
        rowBg = 'bg-surface-container-low hover:bg-surface-container';
      } else if (isP3) {
        edgeGauge = 'bg-secondary-container';
        rankBadge = 'w-12 h-12 rounded bg-secondary-container/20 text-secondary-container flex items-center justify-center font-headline-md text-headline-md font-black flex-shrink-0';
        rowBg = 'bg-surface-container-low hover:bg-surface-container';
      }

      const v = driver.computedVictories || driver.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
      const bt = driver.bestTimes || { first: 0, second: 0, third: 0 };
      const rep = formatRepMoney(driver.computedRep || driver.rep);
      const pts = driver.totalScore || calculateDriverPoints(driver);
      const car = driver.ride || driver.car || 'Porsche Carrera GT';
      const alias = driver.alias || driver.name || `Piloto #${driver.rank}`;

      card.className = `relative ${rowBg} rounded-xl p-space-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-space-md shadow-md hover-card-lift overflow-hidden`;

      card.innerHTML = `
        <!-- Left Color Gauge -->
        <div class="absolute left-0 top-0 bottom-0 w-1.5 ${edgeGauge}"></div>

        <!-- Left Block: Rank + Driver Info -->
        <div class="flex items-center gap-space-md pl-space-xs min-w-0">
          <div class="${rankBadge}">${rankNum}</div>
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-space-xs">
              <span class="material-symbols-outlined text-[16px] ${iconColor}">${iconName}</span>
              <span class="font-headline-sm text-headline-sm uppercase text-on-surface font-extrabold truncate">${escapeHtml(alias)}</span>
              ${isP1 ? '<span class="font-label-hud text-[10px] uppercase px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container font-black ml-1">LÍDER</span>' : ''}
            </div>
            <div class="flex items-center gap-space-sm text-on-surface-variant">
              <span class="font-label-data text-body-sm text-outline truncate">${escapeHtml(car)}</span>
              <span class="text-outline-variant font-label-data text-body-xs">•</span>
              <span class="font-label-hud text-label-hud uppercase text-outline">TIER RANK #${driver.rank || idx + 1}</span>
            </div>
          </div>
        </div>

        <!-- Middle Block: Breakdown Pills (Victories, Best Times, Rep) -->
        <div class="flex flex-wrap items-center gap-space-xs md:gap-space-sm text-center">
          <!-- Victories Pill -->
          <div class="bg-surface-container-high/60 px-space-sm py-space-xs rounded flex flex-col items-center">
            <span class="font-label-hud text-[10px] uppercase text-outline">P1 / P2 / P3</span>
            <span class="font-label-data text-body-sm font-bold text-on-surface">${v.p1 || 0} / ${v.p2 || 0} / ${v.p3 || 0}</span>
          </div>
          <!-- 1º Best Times Bonus -->
          <div class="bg-surface-container-high/60 px-space-sm py-space-xs rounded flex flex-col items-center">
            <span class="font-label-hud text-[10px] uppercase text-outline">1º MEJORES (+100)</span>
            <span class="font-label-data text-body-sm font-bold text-secondary">${bt.first || 0}</span>
          </div>
          <!-- Rep Money -->
          <div class="bg-surface-container-high/60 px-space-sm py-space-xs rounded flex flex-col items-center">
            <span class="font-label-hud text-[10px] uppercase text-outline">BOUNTY TOTAL</span>
            <span class="font-label-data text-body-sm font-bold text-tertiary">${rep}</span>
          </div>
        </div>

        <!-- Right Block: Total Championship PTS -->
        <div class="flex items-center justify-between md:justify-end gap-space-md border-t md:border-t-0 border-surface-container-highest/40 pt-space-xs md:pt-0">
          <div class="flex flex-col text-right">
            <span class="font-label-hud text-label-hud uppercase text-outline">TOTAL PUNTOS</span>
            <span class="font-headline-lg text-headline-lg font-black ${tagColor} tracking-tight">${pts.toLocaleString('es-ES')} PTS</span>
          </div>
          <button type="button" onclick="switchView('dossier-pilotos'); if (typeof window.selectDossierPilot === 'function') window.selectDossierPilot(${driver.rank || 1});" class="p-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface hover:text-primary transition-colors cursor-pointer" title="Ver Dossier">
            <span class="material-symbols-outlined text-[20px]">badge</span>
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

  // Global exposure
  if (typeof window !== 'undefined') {
    window.loadTournamentGroupsView = loadTournamentGroupsView;
    window.loadStandingsView = loadStandingsView;
    window.calculateDriverPoints = calculateDriverPoints;
    window.selectChampionshipGroupTab = selectChampionshipGroupTab;
    window.renderWeeklyChallenges = renderWeeklyChallenges;
    window.updateGroupFilterButtons = updateGroupFilterButtons;
  }
  if (typeof module !== 'undefined') {
    module.exports = {
      loadTournamentGroupsView,
      loadStandingsView,
      calculateDriverPoints,
      syncDriversWithChallengeResults,
      getChallengeCarRestriction
    };
  }
})();
