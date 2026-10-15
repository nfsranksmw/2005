/**
 * NFSMW RANKS // Weekly Challenges Controller
 * Powered by Google Stitch Architecture & Design System.
 * Connects directly to legacy seasons-data.js & blacklist-data.js
 */

(function () {
  let activeSeasonKey = 'season_1';
  let activeWeekNumber = 2;
  let activeCategoryFilter = 'all'; // 'all' | 'junkman' | 'bmw' | 'circuito' | 'sprint'

  /**
   * Helper: Get current season data
   */
  function getSeasonData() {
    if (typeof window !== 'undefined' && window.SEASONS_DATA && window.SEASONS_DATA[activeSeasonKey]) {
      return window.SEASONS_DATA[activeSeasonKey];
    }
    return null;
  }

  /**
   * Helper: Get active week challenges
   */
  function getActiveWeekData() {
    const season = getSeasonData();
    if (!season || !Array.isArray(season.weeks)) return null;
    return season.weeks.find(w => w.weekNum === activeWeekNumber) || season.weeks[0];
  }

  /**
   * Helper: Get championship week data from blacklist-data if available
   */
  function getChampionshipWeekData() {
    if (typeof window !== 'undefined' && window.CHAMPIONSHIP_WEEKS_DATA) {
      return window.CHAMPIONSHIP_WEEKS_DATA[activeWeekNumber] || null;
    }
    return null;
  }

  /**
   * Main Entry: Load Weekly Challenges View
   */
  function loadWeeklyChallengesView() {
    renderWeekNavigationPills();
    renderSummaryBar();
    renderChallengesGrid();
    initFilterEventListeners();
  }

  /**
   * Sets the active week (1 to 4)
   */
  function setSeasonWeek(weekNum) {
    activeWeekNumber = Math.max(1, Math.min(4, parseInt(weekNum, 10)));
    renderWeekNavigationPills();
    renderSummaryBar();
    renderChallengesGrid();
  }

  /**
   * Changes week relative by delta (-1 or +1)
   */
  function changeSeasonWeek(delta) {
    let nextWeek = activeWeekNumber + delta;
    if (nextWeek < 1) nextWeek = 4;
    if (nextWeek > 4) nextWeek = 1;
    setSeasonWeek(nextWeek);
  }

  /**
   * Sets category filter
   */
  function setChallengeCategoryFilter(cat) {
    activeCategoryFilter = cat;
    // Update filter buttons styling
    const filterBtns = document.querySelectorAll('[data-challenge-filter]');
    filterBtns.forEach(btn => {
      const f = btn.getAttribute('data-challenge-filter');
      if (f === cat) {
        btn.className = 'px-3 py-1.5 rounded-lg bg-primary-container text-black font-headline-sm text-body-xs font-black uppercase tracking-wider shadow transition-all';
      } else {
        btn.className = 'px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-white font-headline-sm text-body-xs font-bold uppercase tracking-wider transition-all';
      }
    });
    renderChallengesGrid();
  }

  /**
   * Renders the Week Pills Navigation
   */
  function renderWeekNavigationPills() {
    const container = document.getElementById('challenges-week-pills');
    if (!container) return;

    const isEn = (typeof i18next !== 'undefined' && i18next.language === 'en') ||
                 (typeof window !== 'undefined' && window.getCurrentLanguage && window.getCurrentLanguage() === 'en');

    const weeks = isEn ? [
      { num: 1, label: 'Week 1', subtitle: 'Urban Assault' },
      { num: 2, label: 'Week 2', subtitle: 'Coastal Challenge' },
      { num: 3, label: 'Week 3', subtitle: 'Night Pursuit' },
      { num: 4, label: 'Week 4', subtitle: 'Grand Final Rockport' }
    ] : [
      { num: 1, label: 'Semana 1', subtitle: 'Asalto Urbano' },
      { num: 2, label: 'Semana 2', subtitle: 'Desafío Costero' },
      { num: 3, label: 'Semana 3', subtitle: 'Persecución Nocturna' },
      { num: 4, label: 'Semana 4', subtitle: 'Gran Final Rockport' }
    ];

    container.innerHTML = weeks.map(w => {
      const isActive = w.num === activeWeekNumber;
      if (isActive) {
        return `
          <button type="button" onclick="setSeasonWeek(${w.num})" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-black font-headline-sm text-label-hud font-black uppercase tracking-wider shadow-lg transform scale-105 transition-all">
            <span class="w-2 h-2 rounded-full bg-black animate-ping"></span>
            <span>${w.label}</span>
            <span class="hidden md:inline text-[10px] opacity-80 font-label-data font-bold">(${w.subtitle})</span>
          </button>
        `;
      }
      return `
        <button type="button" onclick="setSeasonWeek(${w.num})" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface font-headline-sm text-label-hud font-bold uppercase tracking-wider border border-surface-container-highest/40 transition-all">
          <span>${w.label}</span>
        </button>
      `;
    }).join('');

    // Update label
    const labelEl = document.getElementById('challenges-active-week-label');
    if (labelEl) {
      const activeInfo = weeks.find(w => w.num === activeWeekNumber);
      labelEl.textContent = `${activeInfo.label}: ${activeInfo.subtitle} // ${isEn ? 'OFFICIAL' : 'OFICIAL'}`;
    }
  }

  /**
   * Renders the Top Summary KPI Bar
   */
  function renderSummaryBar() {
    const weekData = getActiveWeekData();
    const champWeek = getChampionshipWeekData();

    const isEn = (typeof i18next !== 'undefined' && i18next.language === 'en') ||
                 (typeof window !== 'undefined' && window.getCurrentLanguage && window.getCurrentLanguage() === 'en');

    const dateRangeEl = document.getElementById('c-summary-daterange');
    if (dateRangeEl && weekData) {
      dateRangeEl.textContent = weekData.dateRange || (champWeek ? champWeek.dates : (isEn ? 'Nov 01 - Nov 07, 2026' : '01 Nov - 07 Nov 2026'));
    }

    const countEl = document.getElementById('c-summary-count');
    if (countEl && weekData && Array.isArray(weekData.challenges)) {
      countEl.textContent = isEn ? `${weekData.challenges.length} Official Trials` : `${weekData.challenges.length} Pruebas Oficiales`;
    }

    const potEl = document.getElementById('c-summary-pot');
    if (potEl) {
      potEl.textContent = '$2.000.000 Bounty';
    }
  }

  /**
   * Renders the Grid of Weekly Challenge Cards
   */
  function renderChallengesGrid() {
    const grid = document.getElementById('challenges-cards-grid');
    if (!grid) return;

    const isEn = (typeof i18next !== 'undefined' && i18next.language === 'en') ||
                 (typeof window !== 'undefined' && window.getCurrentLanguage && window.getCurrentLanguage() === 'en');

    const weekData = getActiveWeekData();
    const champWeek = getChampionshipWeekData();
    if (!weekData || !Array.isArray(weekData.challenges)) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center bg-surface-container-low rounded-xl">
          <span class="material-symbols-outlined text-[48px] text-outline mb-2">sports_score</span>
          <p class="font-headline-sm text-body-md text-outline font-bold">${isEn ? 'Loading weekly challenges...' : 'Cargando desafíos semanales...'}</p>
        </div>
      `;
      return;
    }

    let challenges = weekData.challenges;

    // Apply category filter
    if (activeCategoryFilter !== 'all') {
      const f = activeCategoryFilter.toLowerCase();
      challenges = challenges.filter(c => {
        const cat = (c.category || '').toLowerCase();
        const type = (c.type || '').toLowerCase();
        if (f === 'junkman') return cat.includes('junkman');
        if (f === 'bmw') return cat.includes('bmw');
        if (f === 'circuito') return type.includes('circuito');
        if (f === 'sprint') return type.includes('sprint');
        return true;
      });
    }

    if (challenges.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center bg-surface-container-low rounded-xl">
          <span class="material-symbols-outlined text-[48px] text-outline mb-2">search_off</span>
          <p class="font-headline-sm text-body-md text-outline font-bold">${isEn ? 'No trials found with selected filter' : 'No hay pruebas con el filtro seleccionado'}</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = challenges.map((chal, idx) => {
      const isBMW = (chal.category || '').toLowerCase().includes('bmw');
      const isSprint = (chal.type || '').toLowerCase().includes('sprint');

      const typeBadgeClass = isSprint
        ? 'bg-secondary-container/20 text-secondary border border-secondary-container/50'
        : 'bg-tertiary-container/20 text-tertiary-fixed border border-tertiary-container/50';

      const catBadgeClass = isBMW
        ? 'bg-blue-950/60 text-blue-300 border border-blue-500/40'
        : 'bg-primary-container/20 text-primary-container border border-primary-container/40';

      const thumbUrl = chal.thumb || 'assets/img/routes-header-banner.jpg';

      // Find top records and car restriction if in CHAMPIONSHIP_WEEKS_DATA
      let topDriverInfo = isEn ? 'Open Homologation' : 'Homologación Abierta';
      let topTimeInfo = chal.targetTime || '01:18.500';
      let resolvedCarRestriction = chal.car || (isEn ? 'Any Car (Junkman)' : 'Cualquier Auto (Junkman)');

      if (champWeek && Array.isArray(champWeek.challenges)) {
        const matched = champWeek.challenges.find(ch => (ch.route || '').toLowerCase() === (chal.track || '').toLowerCase());
        if (matched) {
          if (matched.carRestriction) {
            resolvedCarRestriction = matched.carRestriction;
          }
          if (Array.isArray(matched.top3) && matched.top3.length > 0) {
            const p1 = matched.top3[0];
            topDriverInfo = `${p1.pilot} (${p1.car || ''})`;
            topTimeInfo = p1.time || chal.targetTime;
          }
        }
      }

      return `
        <div class="relative hud-card hover-card-lift tactical-chamfer-top-right overflow-hidden shadow-xl flex flex-col justify-between group">
          <div class="tactical-watermark">#${idx + 1}</div>
          <!-- Top Thumbnail Banner -->
          <div class="relative h-44 w-full overflow-hidden bg-surface-container-lowest">
            <img src="${thumbUrl}" alt="${chal.track}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100" onerror="this.src='assets/img/routes-header-banner.jpg'"/>
            <div class="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/40 to-transparent"></div>
            
            <!-- Type & Category Badges -->
            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              <span class="tactical-badge ${isSprint ? 'tactical-badge-nitro' : 'tactical-badge-cyan'}">
                ${chal.type || 'Circuito'}
              </span>
              <span class="tactical-badge ${isBMW ? 'tactical-badge-cyan' : 'tactical-badge-amber'}">
                ${chal.category || 'Junkman'}
              </span>
            </div>

            <!-- Reward Pot Tag -->
            <div class="absolute top-3 right-3 bg-surface-container-lowest/80 backdrop-blur-md px-2.5 py-0.5 rounded-sm border border-primary-container/40 z-10">
              <span class="font-label-data text-[11px] font-extrabold text-primary-container tabular-nums">
                +${chal.reward?.pts || 300} PTS • ${chal.reward?.bounty || '$500K'}
              </span>
            </div>

            <!-- Track Title Overlay -->
            <div class="absolute bottom-3 left-3 right-3 z-10">
              <div class="font-label-data text-[10px] uppercase text-outline font-semibold tracking-wider">
                ${isEn ? `OFFICIAL TRIAL #${idx + 1}` : `PRUEBA OFICIAL #${idx + 1}`} // ${chal.lapType || 'Single Lap'}
              </div>
              <h3 class="font-headline-md text-headline-sm uppercase text-on-surface font-black truncate">
                ${chal.track}
              </h3>
            </div>
          </div>

          <!-- Card Body: Target Times & Regulations -->
          <div class="p-4 flex-1 flex flex-col justify-between gap-4 relative z-10">
            <!-- Benchmark Splits Grid -->
            <div class="space-y-1">
              <div class="hud-row-item flex items-center justify-between text-xs font-label-data pb-1.5">
                <span class="text-on-surface-variant font-bold flex items-center gap-1.5">
                  <span class="text-primary-container font-black">[ GOLD // 🥇 ]</span>
                </span>
                <span class="font-label-timer-md text-primary-container font-bold tabular-nums">${chal.targetTime || '01:18.500'}</span>
              </div>
              <div class="hud-row-item flex items-center justify-between text-xs font-label-data pb-1.5">
                <span class="text-on-surface-variant flex items-center gap-1.5">
                  <span class="text-slate-300 font-bold">[ SILVER // 🥈 ]</span>
                </span>
                <span class="text-on-surface font-semibold font-label-data tabular-nums">+02.500s (200 PTS)</span>
              </div>
              <div class="hud-row-item flex items-center justify-between text-xs font-label-data pb-1">
                <span class="text-on-surface-variant flex items-center gap-1.5">
                  <span class="text-amber-500 font-bold">[ BRONZE // 🥉 ]</span>
                </span>
                <span class="text-on-surface-variant font-label-data tabular-nums">+05.000s (100 PTS)</span>
              </div>
            </div>

            <!-- Car Restriction & Top Record Holder -->
            <div class="bl-restriction-row hud-card p-2.5 rounded-sm border border-white/5 space-y-1.5 shadow-inner">
              <div class="flex items-center justify-between text-[11px] font-label-data">
                <span class="text-on-surface-variant font-bold flex items-center gap-1">
                  <span class="material-symbols-outlined text-[15px] text-secondary">directions_car</span>
                  <span>${isEn ? 'RESTRICTED CAR:' : 'COCHE RESTRINGIDO:'}</span>
                </span>
                <span class="text-primary font-bold truncate max-w-[190px]">${escapeHtml(resolvedCarRestriction)}</span>
              </div>
              <div class="flex items-center justify-between text-[11px] font-label-data">
                <span class="text-outline uppercase">${isEn ? 'Current Record:' : 'Récord Actual:'}</span>
                <span class="text-tertiary font-bold truncate max-w-[190px] tabular-nums">${topTimeInfo} (${topDriverInfo.split(' ')[0]})</span>
              </div>
            </div>

            <!-- Actions Row -->
            <div class="flex items-center gap-2 pt-1">
              <a href="#routes-pistas?route=${encodeURIComponent(chal.track)}" onclick="switchView('routes-pistas')" class="flex-1 py-2 px-3 rounded-sm bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-[11px] font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1">
                <span class="material-symbols-outlined text-[15px]">telemetry</span>
                <span>${isEn ? 'View Route' : 'Ver Ruta'}</span>
              </a>
              <a href="admin.html?action=submit&track=${encodeURIComponent(chal.track)}&week=${activeWeekNumber}" class="flex-1 py-2 px-3 rounded-sm bg-primary-container hover:bg-primary text-black font-headline-sm text-[11px] font-black uppercase tracking-wider text-center shadow transition-all flex items-center justify-center gap-1">
                <span class="material-symbols-outlined text-[15px]">send</span>
                <span>${isEn ? 'Submit Record' : 'Registrar Marca'}</span>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Initialize filter button listeners
   */
  function initFilterEventListeners() {
    const filterBtns = document.querySelectorAll('[data-challenge-filter]');
    filterBtns.forEach(btn => {
      btn.onclick = () => {
        const cat = btn.getAttribute('data-challenge-filter');
        setChallengeCategoryFilter(cat);
      };
    });
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

  // Global exports
  if (typeof window !== 'undefined') {
    window.loadWeeklyChallengesView = loadWeeklyChallengesView;
    window.setSeasonWeek = setSeasonWeek;
    window.changeSeasonWeek = changeSeasonWeek;
    window.setChallengeCategoryFilter = setChallengeCategoryFilter;
  }
  if (typeof module !== 'undefined') {
    module.exports = {
      loadWeeklyChallengesView,
      setSeasonWeek,
      changeSeasonWeek,
      setChallengeCategoryFilter
    };
  }
})();
