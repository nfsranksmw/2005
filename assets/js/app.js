/**
 * NFSMW RANKS // CORE APPLICATION CONTROLLER
 * Integración de Router SPA, Catálogo de Rutas y Firebase Realtime Database
 * Estricta Regla de Oro: Preservación absoluta de tokens y clases de Stitch
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. ROUTER SPA & CONTROL DE NAVEGACIÓN
  // =========================================================================
  const VIEW_MAP = {
    '': 'home',
    'home': 'home',
    'inicio': 'home',
    'leaderboard': 'leaderboard',
    'tablas': 'leaderboard',
    'ranking': 'leaderboard',
    'clasificacion': 'championship-standings',
    'tablas-de-clasificacion': 'leaderboard',
    'routes': 'routes-pistas',
    'rutas': 'routes-pistas',
    'pistas': 'routes-pistas',
    'routes-pistas': 'routes-pistas',
    'rutas-y-circuitos': 'routes-pistas',
    
    // Challenges & Tournaments (7 distinct sections)
    'challenges': 'challenges',
    'weekly-challenges': 'challenges',
    'desafios': 'challenges',
    'desafio': 'challenges',
    'desafios-semanales': 'challenges',

    'blacklist': 'blacklist',
    'blacklist-groups': 'blacklist',
    'grupos-y-rivales': 'blacklist',
    'grupos': 'blacklist',
    'rivales': 'blacklist',
    'torneos-y-blacklist': 'blacklist',
    'blacklist-2026': 'blacklist',
    'challenges-tournament': 'blacklist',

    'championship-standings': 'championship-standings',
    'standings': 'championship-standings',
    'campeonato': 'championship-standings',
    'campeonato-estadisticas': 'championship-standings',

    'blacklist-cards': 'blacklist-cards',
    'driver-dossiers': 'blacklist-cards',
    'dossiers': 'blacklist-cards',
    'cards': 'blacklist-cards',
    'cockpit': 'blacklist-cards',

    'championship-register': 'championship-register',
    'tournament-registration': 'championship-register',
    'register': 'championship-register',
    'registro': 'championship-register',
    'inscripcion': 'championship-register',

    'tutorial': 'tutorial',
    'tournament-tutorial': 'tutorial',
    'tutorial-torneos': 'tutorial',

    'past-tournaments': 'past-tournaments',
    'torneos-pasados': 'past-tournaments',
    'challonge': 'past-tournaments',

    'telemetria': 'telemetria',
    'telemetry': 'telemetria',
    'driverprofile': 'telemetria',
    'perfil-de-piloto': 'telemetria',
    'profile': 'telemetria',
    'driver': 'telemetria',
    'halloffame': 'halloffame',
    'hall-de-la-fama': 'halloffame',
    'fame': 'halloffame',
    'salon-de-la-fama': 'halloffame',
    'ranking': 'halloffame',
    'rankings': 'halloffame',
    'ranking-hall-de-la-fama': 'halloffame',
    'map': 'map',
    'mapa': 'map',
    'download': 'download',
    'descargas': 'download',
    'guides': 'guides',
    'guias': 'guides',
    'tuning': 'guides',
    'guias-de-tuning': 'guides',
    'rules': 'rules',
    'reglas': 'rules',
    'reglamento': 'rules',
    'submit': 'submit',
    'enviar': 'submit',
    'subir-tiempo': 'submit',
    'community': 'guides',
    'comunidad': 'guides',
    'members': 'guides'
  };

  const NAV_PARENT_MAP = {
    'home': 'nav-home',
    'leaderboard': 'nav-leaderboard',
    'routes-pistas': 'nav-routes-pistas',
    'challenges': 'nav-blacklist',
    'blacklist': 'nav-blacklist',
    'championship-standings': 'nav-blacklist',
    'blacklist-cards': 'nav-blacklist',
    'cockpit': 'nav-blacklist',
    'championship-register': 'nav-blacklist',
    'tutorial': 'nav-blacklist',
    'past-tournaments': 'nav-blacklist',
    'telemetria': 'nav-telemetria',
    'halloffame': 'nav-halloffame',
    'guides': 'nav-community',
    'rules': 'nav-community',
    'map': 'nav-community',
    'download': 'nav-community',
    'submit': 'nav-community'
  };

  const ACTIVE_CLASSES = ['text-on-primary-container', 'bg-primary-container', 'font-bold'];
  const INACTIVE_CLASSES = ['text-on-surface-variant', 'hover:text-on-surface', 'hover:bg-surface-container-high'];

  function resolveViewFromUrl() {
    const rawHash = (window.location.hash || '').replace(/^#view-|^#/, '').trim();
    const hash = rawHash.split('?')[0].toLowerCase();
    if (hash && VIEW_MAP[hash]) return VIEW_MAP[hash];

    const sp = new URLSearchParams(window.location.search);
    if (sp.has('view')) {
      const v = sp.get('view').toLowerCase().trim();
      if (VIEW_MAP[v]) return VIEW_MAP[v];
    }
    return 'home';
  }

  function updateNavbarUI(activeViewId) {
    const parentNavId = NAV_PARENT_MAP[activeViewId] || 'nav-home';
    const mainNav = document.getElementById('main-nav');
    if (mainNav) {
      const navLinks = mainNav.querySelectorAll('a[data-action="navigate"]');
      navLinks.forEach(link => {
        // nav-leaderboard permanece oculto en todo momento
        if (link.id === 'nav-leaderboard') {
          link.classList.add('hidden');
        }

        if (link.id === parentNavId) {
          link.setAttribute('aria-current', 'page');
          link.classList.add('is-active');
          ACTIVE_CLASSES.forEach(c => link.classList.add(c));
          INACTIVE_CLASSES.forEach(c => link.classList.remove(c));
        } else {
          link.removeAttribute('aria-current');
          link.classList.remove('is-active');
          ACTIVE_CLASSES.forEach(c => link.classList.remove(c));
          INACTIVE_CLASSES.forEach(c => link.classList.add(c));
        }
      });
    }

    // Sincronizar estado activo en el menú lateral móvil
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    if (mobileDrawer) {
      const mobileLinks = mobileDrawer.querySelectorAll('a[data-action="navigate"]');
      mobileLinks.forEach(link => {
        const target = link.getAttribute('data-target');
        if (target === activeViewId || (activeViewId === 'home' && target === 'home')) {
          link.classList.add('bg-primary-container', 'text-on-primary-container', 'font-bold');
          link.classList.remove('text-on-surface-variant', 'hover:bg-surface-container-high');
        } else {
          link.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-bold');
          link.classList.add('text-on-surface-variant', 'hover:bg-surface-container-high');
        }
      });
    }
  }

  function switchView(viewId, updateHash = true) {
    // Cerrar automáticamente el menú móvil si está abierto
    if (typeof closeMobileNav === 'function') {
      closeMobileNav();
    }

    const target = VIEW_MAP[viewId] || 'home';

    const sections = document.querySelectorAll('.view-section');
    let found = false;
    sections.forEach(sec => {
      if (sec.id === 'view-' + target) {
        sec.classList.add('active');
        found = true;
      } else {
        sec.classList.remove('active');
      }
    });

    if (!found) {
      const homeSec = document.getElementById('view-home');
      if (homeSec) homeSec.classList.add('active');
    }

    updateNavbarUI(target);

    if (updateHash && window.location.hash !== '#' + target) {
      window.location.hash = '#' + target;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Disparar carga de datos específica si la vista lo requiere
    if (target === 'routes-pistas') {
      ensureRoutesRendered();
    } else if (target === 'leaderboard') {
      const sp = new URLSearchParams(window.location.search);
      const hp = new URLSearchParams((window.location.hash || '').split('?')[1] || '');
      const routeParam = sp.get('route') || hp.get('route');
      loadRouteLeaderboard(routeParam || currentActiveRoute || 'City Perimeter');
    } else if (target === 'challenges') {
      if (typeof window.loadWeeklyChallengesView === 'function') {
        window.loadWeeklyChallengesView();
      }
    } else if (target === 'blacklist') {
      if (typeof window.loadTournamentGroupsView === 'function') {
        window.loadTournamentGroupsView();
      }
    } else if (target === 'championship-standings') {
      if (typeof window.loadStandingsView === 'function') {
        window.loadStandingsView();
      }
    } else if (target === 'blacklist-cards') {
      if (typeof window.loadDossierView === 'function') {
        window.loadDossierView(window.currentDossierRank);
      } else if (typeof window.selectDossierPilot === 'function') {
        window.selectDossierPilot(window.currentDossierRank || 1, false);
      }
    } else if (target === 'championship-register') {
      loadRegistrationView();
    } else if (target === 'past-tournaments') {
      loadPastTournamentsView();
    }

    if (typeof window.applyTranslations === 'function') {
      window.applyTranslations();
    }
  }

  // =========================================================================
  // RESPONSIVE MOBILE NAVIGATION DRAWER CONTROLLER
  // =========================================================================
  function openMobileNav() {
    const drawer = document.getElementById('mobile-nav-drawer');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    const iconOpen = document.getElementById('mobile-menu-icon-open');
    const iconClose = document.getElementById('mobile-menu-icon-close');
    const btn = document.getElementById('btn-mobile-menu-toggle');
    if (!drawer || !backdrop) return;

    backdrop.classList.remove('hidden', 'pointer-events-none');
    setTimeout(() => {
      backdrop.classList.remove('opacity-0');
    }, 10);

    drawer.classList.remove('translate-x-full');
    drawer.setAttribute('aria-hidden', 'false');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (iconOpen) iconOpen.classList.add('hidden');
    if (iconClose) iconClose.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closeMobileNav() {
    document.body.classList.remove('overflow-hidden');
    const drawer = document.getElementById('mobile-nav-drawer');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    const iconOpen = document.getElementById('mobile-menu-icon-open');
    const iconClose = document.getElementById('mobile-menu-icon-close');
    const btn = document.getElementById('btn-mobile-menu-toggle');
    if (!drawer || !backdrop) return;

    drawer.classList.add('translate-x-full');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.classList.add('opacity-0');
    setTimeout(() => {
      backdrop.classList.add('hidden', 'pointer-events-none');
    }, 300);

    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (iconOpen) iconOpen.classList.remove('hidden');
    if (iconClose) iconClose.classList.add('hidden');
  }

  function toggleMobileNav() {
    const drawer = document.getElementById('mobile-nav-drawer');
    if (!drawer) return;
    const isOpen = !drawer.classList.contains('translate-x-full');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  function toggleMobileSubmenu(id) {
    const submenu = document.getElementById(id);
    const chevron = document.getElementById(id + '-chevron');
    if (!submenu) return;
    const isHidden = submenu.classList.contains('hidden');
    if (isHidden) {
      submenu.classList.remove('hidden');
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    } else {
      submenu.classList.add('hidden');
      if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
  }

  window.openMobileNav = openMobileNav;
  window.closeMobileNav = closeMobileNav;
  window.toggleMobileNav = toggleMobileNav;
  window.toggleMobileSubmenu = toggleMobileSubmenu;

  // Cerrar menú móvil al presionar tecla Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
    }
  });

  // Cerrar menú móvil automáticamente si se redimensiona a pantalla ancha / apaisada
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1025 || (window.innerWidth >= 640 && window.matchMedia('(orientation: landscape)').matches)) {
      closeMobileNav();
    }
  });

  window.switchView = switchView;
  window.resolveViewFromUrl = resolveViewFromUrl;

  window.addEventListener('hashchange', () => {
    switchView(resolveViewFromUrl(), false);
  });

  window.addEventListener('popstate', () => {
    switchView(resolveViewFromUrl(), false);
  });

  // =========================================================================
  // 2. LÓGICA DE FILTROS Y RENDERIZADO DE RUTAS
  // =========================================================================
  let currentCategory = 'all';
  let currentSearchQuery = '';
  let routesRendered = false;

  const SVG_TRACK_PATHS = {
    'Circuito': 'M 15,20 Q 30,5 60,15 T 85,45 Q 85,75 55,70 T 20,60 Z',
    'Sprint': 'M 10,70 Q 30,55 50,55 T 75,30 Q 85,15 95,10',
    'Drag': 'M 10,65 L 45,50 L 70,30 L 95,15'
  };

  const TYPE_STYLES = {
    'Circuito': {
      badge: 'bg-primary-container/20 text-primary-container',
      stroke: 'stroke-primary-container',
      shadow: 'drop-shadow-[0_0_8px_rgba(255,184,0,0.3)]',
      timer: 'text-primary-container',
      hover: 'group-hover:text-primary',
      action: 'text-primary hover:text-primary-container',
      subtitle: 'Trazado técnico cerrado de 2 vueltas'
    },
    'Sprint': {
      badge: 'bg-tertiary/15 text-tertiary',
      stroke: 'stroke-tertiary',
      shadow: 'drop-shadow-[0_0_8px_rgba(110,243,255,0.3)]',
      timer: 'text-tertiary',
      hover: 'group-hover:text-tertiary',
      action: 'text-tertiary hover:text-tertiary-fixed',
      subtitle: 'Trazado punto a punto de alta velocidad'
    },
    'Drag': {
      badge: 'bg-secondary-container/20 text-secondary-container',
      stroke: 'stroke-secondary-container',
      shadow: 'drop-shadow-[0_0_8px_rgba(255,87,8,0.3)]',
      timer: 'text-secondary-container',
      hover: 'group-hover:text-secondary-container',
      action: 'text-secondary-container hover:text-secondary-fixed',
      subtitle: 'Aceleración pura con tráfico dinámico'
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // =========================================================================
  // CACHÉ GLOBAL DE LEADERBOARDS & LOOKUP DE RÉCORDS MUNDIALES (WR)
  // =========================================================================
  let allLeaderboardsData = null;
  let isFetchingAllLeaderboards = false;

  async function fetchAllLeaderboards() {
    if (allLeaderboardsData) return allLeaderboardsData;
    if (isFetchingAllLeaderboards) return null;
    isFetchingAllLeaderboards = true;

    const baseUrl = window.FIREBASE_RTDB_BASE_URL || "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    const url = `${baseUrl}/leaderboards.json?_t=${Date.now()}`;

    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      allLeaderboardsData = (data && typeof data === 'object') ? data : {};
      window.allLeaderboardsData = allLeaderboardsData;

      // Actualizar en caliente todas las tarjetas que ya están en el DOM
      updateRouteCardsWithWR();
      return allLeaderboardsData;
    } catch (err) {
      console.warn("Aviso Firebase RTDB Leaderboards:", err);
      return {};
    } finally {
      isFetchingAllLeaderboards = false;
    }
  }

  function getTrackWR(routeName) {
    if (!allLeaderboardsData || !routeName) return null;
    const sanitizeFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.sanitizeKey)
      ? window.NFS_FIREBASE.sanitizeKey
      : (str => str.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_'));
    const routeKey = sanitizeFn(routeName);
    const track = allLeaderboardsData[routeKey];
    if (!track) return null;

    // Buscar categoría preferida para WR (Junkman Single Lap o Junkman en Sprint/Drag, o fallback a BMW)
    const records = track.junkman_single || track.junkman || track.bmw_single || track.bmw || track.junkman_fast || track.bmw_fast || [];
    if (!Array.isArray(records) || records.length === 0) return null;

    // Ordenar de menor a mayor tiempo para asegurar el Top 1 auténtico
    const parseFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.parseTimeToMs)
      ? window.NFS_FIREBASE.parseTimeToMs
      : (s => typeof s === 'number' ? s : 9999999);

    const validRecords = records.filter(r => r && (r.time || r.timeMs));
    if (validRecords.length === 0) return null;

    const sorted = [...validRecords].sort((a, b) => {
      const tA = (typeof a.timeMs === 'number') ? a.timeMs : parseFn(a.time);
      const tB = (typeof b.timeMs === 'number') ? b.timeMs : parseFn(b.time);
      return tA - tB;
    });

    return sorted[0] || null;
  }

  function updateRouteCardsWithWR() {
    const container = document.getElementById('routes-cards-container');
    if (!container) return;

    const cards = container.querySelectorAll('article[data-route]');
    cards.forEach(card => {
      const routeName = card.getAttribute('data-route');
      if (!routeName) return;
      const wr = getTrackWR(routeName);
      if (!wr) return;

      const timeEl = card.querySelector('.route-wr-time');
      if (timeEl) {
        timeEl.textContent = wr.time || formatTime(wr.timeMs);
      }

      const driverEl = card.querySelector('.route-wr-driver');
      if (driverEl) {
        driverEl.textContent = wr.driver;
      }

      const carEl = card.querySelector('.route-wr-car');
      if (carEl && wr.car) {
        carEl.textContent = wr.car;
      }
    });
  }

  function createRouteCardHtml(route) {
    const style = TYPE_STYLES[route.type] || TYPE_STYLES['Circuito'];
    const pathD = SVG_TRACK_PATHS[route.type] || SVG_TRACK_PATHS['Circuito'];
    const modality = route.type === 'Circuito' ? '2 Vueltas' : (route.type === 'Drag' ? '400 Metros' : 'Punto a Punto');

    const wr = getTrackWR(route.name);
    const wrTimeDisplay = wr ? (wr.time || formatTime(wr.timeMs)) : '--:--.---';
    const wrDriverDisplay = wr ? escapeHtml(wr.driver) : 'Ver Leaderboard';
    const wrCarDisplay = wr ? escapeHtml(wr.car || 'Junkman Stage 3') : `${route.type} Homologado`;

    return `
<article class="group relative hud-card hud-card-interactive tactical-chamfer-top-right border border-white/10 flex flex-col justify-between overflow-hidden cursor-pointer" data-route="${escapeHtml(route.name)}">
  <div class="tactical-watermark select-none pointer-events-none">${escapeHtml((route.type || 'SECTOR').toUpperCase())}</div>
  <div class="p-space-md flex flex-col gap-space-sm relative z-10">
    <!-- Header Badges -->
    <div class="flex items-center justify-between gap-2">
      <span class="tactical-badge ${style.badge || 'tactical-badge-neutral'} uppercase">
        ${escapeHtml(route.type.toUpperCase())} // ${modality.toUpperCase()}
      </span>
      <span class="font-label-data text-[11px] text-on-surface-variant uppercase flex items-center gap-1">
        <span class="material-symbols-outlined text-[13px]">location_on</span>
        Rockport City
      </span>
    </div>

    <!-- Route Title & Silhouette -->
    <div class="flex items-center justify-between gap-space-sm mt-1">
      <div>
        <h4 class="font-headline-md text-headline-md uppercase text-on-surface ${style.hover} transition-colors">
          ${escapeHtml(route.name)}
        </h4>
        <p class="font-label-data text-label-data text-on-surface-variant">${style.subtitle}</p>
      </div>
      <div class="w-16 h-12 shrink-0">
        <svg class="w-full h-full ${style.stroke} fill-none ${style.shadow}" viewBox="0 0 100 80">
          <path d="${pathD}" stroke-linecap="round" stroke-width="3"></path>
        </svg>
      </div>
    </div>

    <!-- World Record Main Display -->
    <div class="hud-card hud-row-item p-space-sm mt-1 flex items-center justify-between">
      <div class="flex flex-col">
        <span class="font-label-hud text-label-hud text-on-surface-variant uppercase">RÉCORD MUNDIAL (WR)</span>
        <span class="font-label-timer-lg text-[28px] tabular-nums font-mono ${style.timer} font-bold leading-none mt-0.5 route-wr-time" data-wr-route="${escapeHtml(route.name)}">
          ${wrTimeDisplay}
        </span>
      </div>
      <div class="flex flex-col items-end">
        <div class="flex items-center gap-1.5">
          <span class="tactical-badge tactical-badge-amber text-[9px]">WR</span>
          <span class="font-headline-sm text-[15px] text-on-surface route-wr-driver" data-wr-driver="${escapeHtml(route.name)}">${wrDriverDisplay}</span>
        </div>
        <span class="font-label-data text-[11px] text-outline route-wr-car" data-wr-car="${escapeHtml(route.name)}">${wrCarDisplay}</span>
      </div>
    </div>

    <!-- Micro Stats & Telemetry Breakdown -->
    <div class="grid grid-cols-3 gap-2 py-1 font-label-data text-label-data text-on-surface-variant border-t border-white/5">
      <div>
        <span class="block text-[10px] uppercase text-outline">Categoría</span>
        <span class="text-on-surface font-semibold">${escapeHtml(route.type)}</span>
      </div>
      <div>
        <span class="block text-[10px] uppercase text-outline">Modalidad</span>
        <span class="text-on-surface font-semibold">${modality}</span>
      </div>
      <div class="text-right">
        <span class="block text-[10px] uppercase text-outline">Estado</span>
        <span class="text-tertiary font-semibold">Auditado 128Hz</span>
      </div>
    </div>
  </div>

  <!-- Bottom Actions Drawer -->
  <div class="bg-black/40 px-space-md py-2.5 flex items-center justify-between gap-2 border-t border-white/10 relative z-10">
    <a class="font-label-hud text-label-hud ${style.action} uppercase flex items-center gap-1 font-bold" href="#leaderboard" data-action="view-leaderboard" data-route="${escapeHtml(route.name)}">
      Ver Leaderboard <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
    </a>
    <div class="flex items-center gap-2">
      <button class="p-1 rounded-sm hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors" title="Abrir Leaderboard" data-action="view-leaderboard" data-route="${escapeHtml(route.name)}">
        <span class="material-symbols-outlined text-[16px]">leaderboard</span>
      </button>
    </div>
  </div>
</article>
`;
  }

  function renderRouteCards(routes) {
    const container = document.getElementById('routes-cards-container');
    if (!container) return;

    if (!routes || routes.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center text-outline font-label-data">
          <div class="flex flex-col items-center gap-3">
            <span class="material-symbols-outlined text-[48px] text-outline-variant">search_off</span>
            <span class="font-headline-sm text-body-lg text-on-surface uppercase">No se encontraron trazados</span>
            <span class="font-body-sm text-outline">Prueba con otro término de búsqueda o cambia el filtro de categoría.</span>
          </div>
        </div>
      `;
      return;
    }

    let html = '';
    routes.forEach(r => {
      html += createRouteCardHtml(r);
    });
    container.innerHTML = html;
  }

  function filterRoutes() {
    const sourceData = (typeof routesData !== 'undefined' && Array.isArray(routesData)) ? routesData : [];
    const query = currentSearchQuery.toLowerCase().trim();

    const filtered = sourceData.filter(route => {
      const matchCat = (currentCategory === 'all') || (route.type.toLowerCase() === currentCategory.toLowerCase());
      const matchSearch = !query || route.name.toLowerCase().includes(query) || (route.type && route.type.toLowerCase().includes(query));
      return matchCat && matchSearch;
    });

    renderRouteCards(filtered);

    // Actualizar contador en la cabecera
    const counterEl = document.getElementById('routes-showing-counter');
    if (counterEl) {
      counterEl.textContent = `Mostrando ${filtered.length} de ${sourceData.length} circuitos`;
    }
  }

  function setCategoryFilter(cat) {
    currentCategory = cat;

    const filterContainer = document.getElementById('routes-category-filters');
    if (filterContainer) {
      const buttons = filterContainer.querySelectorAll('button[data-cat]');
      buttons.forEach(btn => {
        const btnCat = btn.getAttribute('data-cat');
        if (btnCat.toLowerCase() === cat.toLowerCase()) {
          btn.className = "h-10 sm:h-11 px-4 py-2 bg-primary-container text-on-primary font-headline-sm text-xs sm:text-sm uppercase rounded-lg font-black transition-all shadow-[0_0_16px_rgba(255,184,0,0.4)] flex items-center gap-2 cursor-pointer border border-primary";
        } else {
          btn.className = "h-10 sm:h-11 px-4 py-2 bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-headline-sm text-xs sm:text-sm uppercase rounded-lg transition-all flex items-center gap-2 cursor-pointer border border-transparent";
        }
      });
    }

    filterRoutes();
  }

  function ensureRoutesRendered() {
    if (routesRendered) return;
    filterRoutes();
    routesRendered = true;
  }

  // =========================================================================
  // 3. CONEXIÓN FIREBASE & LEADERBOARDS DINÁMICOS
  // =========================================================================
  let currentActiveRoute = 'City Perimeter';
  let currentRouteRecordsData = null;
  let currentSelectedCategoryKey = null;

  async function fetchFirebaseRouteRecords(routeName) {
    if (!routeName) return {};
    const sanitizeFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.sanitizeKey) ? window.NFS_FIREBASE.sanitizeKey : (str => str.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_'));
    const routeKey = sanitizeFn(routeName);

    // Si ya existe en la caché global de leaderboards, retornar inmediatamente (0ms latencia)
    if (allLeaderboardsData && allLeaderboardsData[routeKey]) {
      return allLeaderboardsData[routeKey];
    }

    const baseUrl = window.FIREBASE_RTDB_BASE_URL || "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    const url = `${baseUrl}/leaderboards/${routeKey}.json?_t=${Date.now()}`;

    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return {};
      const data = await res.json();
      return (data && typeof data === 'object') ? data : {};
    } catch (err) {
      console.warn("Aviso Firebase RTDB:", err);
      return {};
    }
  }

  function formatTime(msOrStr) {
    if (typeof msOrStr === 'string' && msOrStr.includes(':')) return msOrStr;
    if (window.NFS_FIREBASE && window.NFS_FIREBASE.formatMsToTime && typeof msOrStr === 'number') {
      return window.NFS_FIREBASE.formatMsToTime(msOrStr);
    }
    return msOrStr || '--:--.---';
  }

  // =========================================================================
  // TELEMETRÍA AVANZADA & MAPEO DE ESCUDERÍAS (FASE 3.3)
  // Formato: ${nombre_estadistica}: ${valor} • ${nombre_equipo}
  // =========================================================================
  const KNOWN_DRIVER_TEAMS = {
    'lea4speed0': 'Team Speedrun DE',
    'f1': 'Rockport Syndicate',
    'wess': 'Apex Predator Club',
    'm. rossi': 'Apex Predator Club',
    'k. takahashi': 'Rockport Syndicate',
    'a. vance': 'Blacklist Syndicate',
    'homer': 'Apex Predator Club',
    'buster': 'Palmont Speed Squad',
    'speedy': 'Ironwood Dynamics',
    'kimi': 'Blacklist Syndicate'
  };

  const ESCUDERIAS_FALLBACK = [
    'Team Speedrun DE',
    'Rockport Syndicate',
    'Apex Predator Club',
    'Blacklist Syndicate',
    'Ironwood Dynamics',
    'Palmont Speed Squad',
    'Camden Tech Racing',
    'Razor\'s Edge Motorsport'
  ];

  function getRecordTeam(rec) {
    if (!rec) return 'Team Speedrun DE';
    if (rec.team && typeof rec.team === 'string' && rec.team.trim()) return rec.team.trim();
    if (rec.escuderia && typeof rec.escuderia === 'string' && rec.escuderia.trim()) return rec.escuderia.trim();
    if (rec.club && typeof rec.club === 'string' && rec.club.trim()) return rec.club.trim();
    if (rec.nombre_equipo && typeof rec.nombre_equipo === 'string' && rec.nombre_equipo.trim()) return rec.nombre_equipo.trim();

    const driverKey = String(rec.driver || '').trim().toLowerCase();
    if (KNOWN_DRIVER_TEAMS[driverKey]) {
      return KNOWN_DRIVER_TEAMS[driverKey];
    }

    let hash = 0;
    for (let i = 0; i < driverKey.length; i++) {
      hash = (hash * 31 + driverKey.charCodeAt(i)) >>> 0;
    }
    return ESCUDERIAS_FALLBACK[hash % ESCUDERIAS_FALLBACK.length];
  }

  function getRecordTelemetryStat(rec, pos) {
    if (!rec) return 'TOP SPEED: 382 KM/H';

    // 1. Si el registro ya trae nombre_estadistica y valor explícitos
    if (rec.nombre_estadistica && rec.valor) {
      return `${String(rec.nombre_estadistica).trim().toUpperCase()}: ${String(rec.valor).trim()}`;
    }
    if (rec.statName && rec.statValue) {
      return `${String(rec.statName).trim().toUpperCase()}: ${String(rec.statValue).trim()}`;
    }

    // 2. Si el registro trae métrica de telemetría específica
    if (rec.topSpeed || rec.maxSpeed || rec.speed) {
      const raw = String(rec.topSpeed || rec.maxSpeed || rec.speed).trim().toUpperCase();
      const val = raw.includes('KM/H') ? raw : `${raw} KM/H`;
      return `TOP SPEED: ${val}`;
    }
    if (rec.avgSpeed) {
      const raw = String(rec.avgSpeed).trim().toUpperCase();
      const val = raw.includes('KM/H') ? raw : `${raw} KM/H`;
      return `AVG SPEED: ${val}`;
    }
    if (rec.precision || rec.accuracy) {
      const raw = String(rec.precision || rec.accuracy).trim().replace('%', '');
      return `PRECISIÓN: ${raw}%`;
    }

    // 3. Telemetría de alto rendimiento calculada para la vuelta
    const carLower = (rec.car || '').toLowerCase();
    const isBMW = carLower.includes('bmw') || carLower.includes('m3');
    const isFordGT = carLower.includes('ford gt');
    const isCorvette = carLower.includes('corvette') || carLower.includes('c6');
    const isLambo = carLower.includes('murcielago') || carLower.includes('gallardo');

    let baseSpeed = 382; // 382 KM/H es la velocidad punta de referencia en NFSMW Junkman
    if (isBMW) {
      baseSpeed = 338;
    } else if (isFordGT) {
      baseSpeed = 386;
    } else if (isLambo) {
      baseSpeed = 379;
    } else if (isCorvette) {
      baseSpeed = 376;
    }

    if (pos === 1 && !isBMW) {
      return 'TOP SPEED: 382 KM/H';
    }

    const seed = (rec.timeMs ? rec.timeMs % 100 : 0) + (rec.driver ? rec.driver.charCodeAt(0) : 0);
    const offset = (seed % 5) - 2;
    const rankDrop = Math.min((pos - 1) * 2, 16);
    const finalSpeed = Math.max(260, baseSpeed - rankDrop + offset);
    return `TOP SPEED: ${finalSpeed} KM/H`;
  }

  function createLeaderboardRowHtml(rec, pos, p1TimeMs) {
    const isP1 = pos === 1;

    // 1. Fondo de fila según posición
    const rowBg = isP1
      ? 'bg-surface-container-high/40 hover:bg-surface-container-high'
      : (pos === 2
          ? 'bg-surface-container/60 hover:bg-surface-container-high'
          : (pos === 3
              ? 'bg-surface-container-low/80 hover:bg-surface-container-high'
              : 'bg-surface-container-low/40 hover:bg-surface-container-high'));

    // 2. Medalla / Badge de posición (Top 1 Amarillo brillante vs Top 2+ Neutral/Oscuro)
    let posBadgeBoxHtml = '';
    let posSubLabelHtml = '';
    if (isP1) {
      posBadgeBoxHtml = `
        <div class="w-8 h-8 rounded-sm bg-primary-container text-on-primary-container font-headline-sm text-headline-sm flex items-center justify-center font-black shadow-md tabular-nums">
          1
        </div>
      `;
      posSubLabelHtml = `<span class="tactical-badge tactical-badge-amber text-[9px] uppercase font-black mt-1">WR</span>`;
    } else if (pos === 2) {
      posBadgeBoxHtml = `
        <div class="w-8 h-8 rounded-sm bg-surface-variant text-on-surface font-headline-sm text-headline-sm flex items-center justify-center font-bold tabular-nums">
          2
        </div>
      `;
      posSubLabelHtml = `<span class="tactical-badge tactical-badge-neutral text-[9px] uppercase font-semibold mt-1">TOP 2</span>`;
    } else if (pos === 3) {
      posBadgeBoxHtml = `
        <div class="w-8 h-8 rounded-sm bg-surface-container-highest text-secondary font-headline-sm text-headline-sm flex items-center justify-center font-bold tabular-nums">
          3
        </div>
      `;
      posSubLabelHtml = `<span class="tactical-badge tactical-badge-amber text-[9px] uppercase font-semibold mt-1">TOP 3</span>`;
    } else {
      posBadgeBoxHtml = `
        <div class="w-8 h-8 rounded-sm bg-surface-container text-outline font-headline-sm text-headline-sm flex items-center justify-center font-bold tabular-nums">
          ${pos}
        </div>
      `;
      posSubLabelHtml = `<span class="font-label-hud text-[9px] text-outline/60 uppercase font-semibold mt-1 tabular-nums">P${pos}</span>`;
    }

    // 3. Avatar Icon (Top 1 Amarillo primario vs Top 2+ Neutral/Outline)
    const avatarColor = isP1 ? 'text-primary-container' : 'text-outline';

    // 4. Nombre del Piloto (Top 1 Amarillo primario vs Top 2+ Blanco / Claro text-white text-gray-100)
    const driverNameClass = isP1
      ? 'text-primary group-hover:text-primary-container'
      : 'text-white text-gray-100 group-hover:text-primary';

    // 5. Badges de Rango al lado del Piloto
    let rankBadgesHtml = '';
    if (isP1) {
      rankBadgesHtml = `
        <span class="tactical-badge tactical-badge-amber text-[9px] tracking-wider uppercase font-black">WORLD RECORD</span>
        <span class="tactical-badge tactical-badge-cyan text-[10px]">TOP #1</span>
      `;
    } else if (pos === 2) {
      rankBadgesHtml = `<span class="tactical-badge tactical-badge-neutral text-[10px]">TOP #2 WORLD</span>`;
    } else if (pos === 3) {
      rankBadgesHtml = `<span class="tactical-badge tactical-badge-neutral text-[10px]">TOP #3 WORLD</span>`;
    } else {
      rankBadgesHtml = `<span class="tactical-badge tactical-badge-neutral text-[10px] text-outline">TOP #${pos}</span>`;
    }

    // 6. Tiempo y Delta GAP (Top 1 Amarillo vs Top 2+ Blanco y Delta Gris secundario)
    const timeDisplay = rec.time || formatTime(rec.timeMs);
    const timeClass = isP1 ? 'text-primary' : 'text-white text-gray-100';

    let deltaLabel = '● TIEMPO LÍDER';
    let deltaClass = 'text-primary-container font-bold uppercase tracking-wider text-[11px]';
    if (!isP1) {
      deltaClass = 'text-outline text-gray-400 font-medium tracking-normal text-[11px]';
      if (rec.timeMs && p1TimeMs && rec.timeMs > p1TimeMs) {
        const diff = ((rec.timeMs - p1TimeMs) / 1000).toFixed(3);
        deltaLabel = `+${diff}s`;
      } else {
        deltaLabel = '+0.000s';
      }
    }

    // 7. Botón Multimedia VÍDEO (Top 1 Color acento brillante vs Top 2+ Fondo oscuro con borde)
    const videoUrl = rec.videoUrl || rec.yt || rec.video || '';
    let mediaCtaHtml = '';
    if (videoUrl) {
      if (isP1) {
        mediaCtaHtml = `
          <a href="${escapeHtml(videoUrl)}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 bg-secondary-container hover:bg-secondary-container/90 text-on-surface font-label-hud text-label-hud uppercase tracking-wider rounded inline-flex items-center gap-1.5 shadow">
            <span class="material-symbols-outlined text-[16px]">play_arrow</span>
            VÍDEO
          </a>
        `;
      } else {
        mediaCtaHtml = `
          <a href="${escapeHtml(videoUrl)}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 bg-surface-container hover:bg-surface-container-highest text-on-surface font-label-hud text-label-hud uppercase tracking-wider rounded inline-flex items-center gap-1.5 border border-outline-variant/30 transition-colors">
            <span class="material-symbols-outlined text-secondary text-[16px]">play_arrow</span>
            VÍDEO
          </a>
        `;
      }
    } else {
      mediaCtaHtml = `
        <span class="px-3 py-1.5 bg-surface-container/60 text-outline font-label-hud text-label-hud uppercase tracking-wider rounded inline-flex items-center gap-1.5 border border-outline-variant/20">
          <span class="material-symbols-outlined text-[16px]">verified</span>
          LOG AUDITADO
        </span>
      `;
    }

    // 8. Telemetría y Escudería (Fase 3.3)
    const telemetryStat = getRecordTelemetryStat(rec, pos);
    const teamName = getRecordTeam(rec);

    return `
<tr class="${rowBg} transition-colors group">
  <!-- Pos Badge -->
  <td class="py-space-md px-space-md text-center">
    <div class="inline-flex flex-col items-center justify-center">
      ${posBadgeBoxHtml}
      ${posSubLabelHtml}
    </div>
  </td>

  <!-- Driver & Escudería -->
  <td class="py-space-md px-space-md">
    <div class="flex items-center gap-space-sm">
      <div class="w-10 h-10 rounded bg-surface-container-highest p-1 flex items-center justify-center ${avatarColor}">
        <span class="material-symbols-outlined text-[24px]">sports_motorsports</span>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="font-headline-sm text-body-lg ${driverNameClass} font-bold transition-colors">${escapeHtml(rec.driver)}</span>
          ${rankBadgesHtml}
        </div>
        <div class="flex items-center gap-2 font-label-data text-label-data text-outline mt-0.5">
          <span>${escapeHtml(telemetryStat)}</span>
          <span>•</span>
          <span class="text-on-surface-variant">${escapeHtml(teamName)}</span>
        </div>
      </div>
    </div>
  </td>

  <!-- Time & Delta -->
  <td class="py-space-md px-space-md">
    <div class="flex flex-col">
      <span class="font-label-timer-md text-headline-sm tabular-nums font-mono ${timeClass} font-bold tracking-tight">${timeDisplay}</span>
      <span class="font-label-data text-label-data tabular-nums font-mono ${deltaClass}">${deltaLabel}</span>
    </div>
  </td>

  <!-- Vehicle & Tuning -->
  <td class="py-space-md px-space-md">
    <div class="flex flex-col">
      <span class="text-on-surface font-bold">${escapeHtml(rec.car || 'BMW M3 GTR')}</span>
      <span class="font-label-data text-label-data text-outline">${escapeHtml(rec.gearbox || 'Manual')} • ${escapeHtml(rec.notes || 'Reglamento Oficial')}</span>
    </div>
  </td>

  <!-- Device -->
  <td class="py-space-md px-space-md">
    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded font-label-data text-label-data text-on-surface">
      <span class="material-symbols-outlined text-outline text-[16px]">sports_esports</span>
      <span>${escapeHtml(rec.device || 'DualSense / Xbox')}</span>
    </div>
  </td>

  <!-- Gearbox -->
  <td class="py-space-md px-space-md">
    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-tertiary font-label-data text-label-data font-semibold">
      <span class="material-symbols-outlined text-[14px]">settings</span>
      ${escapeHtml(rec.gearbox || 'Manual')}
    </span>
  </td>

  <!-- Date -->
  <td class="py-space-md px-space-md font-label-data text-label-data text-outline">
    ${escapeHtml(rec.date || '2026')}
  </td>

  <!-- Media CTA -->
  <td class="py-space-md px-space-md text-right">
    <div class="flex items-center justify-end gap-space-xs">
      ${mediaCtaHtml}
    </div>
  </td>
</tr>
`;
  }

  function renderLeaderboardTable(records) {
    const tbody = document.getElementById('leaderboard-tbody');
    if (!tbody) return;

    if (!records || records.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="py-16 text-center text-outline font-label-data">
            <div class="flex flex-col items-center gap-3">
              <span class="material-symbols-outlined text-[48px] text-outline-variant">timer_off</span>
              <span class="font-headline-sm text-body-lg text-on-surface uppercase">Sin registros en esta categoría</span>
              <span class="font-body-sm text-outline">Sé el primero en enviar tu tiempo homologado para este trazado.</span>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    // Ordenar de menor a mayor tiempo
    const sorted = [...records].sort((a, b) => {
      const parseFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.parseTimeToMs) ? window.NFS_FIREBASE.parseTimeToMs : (s => typeof s === 'number' ? s : 9999999);
      const tA = a.timeMs || parseFn(a.time) || 9999999;
      const tB = b.timeMs || parseFn(b.time) || 9999999;
      return tA - tB;
    });

    const p1 = sorted[0];
    const parseFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.parseTimeToMs) ? window.NFS_FIREBASE.parseTimeToMs : (s => typeof s === 'number' ? s : 0);
    const p1Ms = p1.timeMs || parseFn(p1.time) || 0;

    let html = '';
    sorted.forEach((rec, idx) => {
      html += createLeaderboardRowHtml(rec, idx + 1, p1Ms);
    });
    tbody.innerHTML = html;
  }

  // =========================================================================
  // ORDENAMIENTO ESTRICTO DE CATEGORÍAS (REQUERIMIENTO FASE 3.1)
  // 1. "Junkman Single Lap"
  // 2. "Junkman Fast Lap"
  // 3. "BMW M3 GTR Single Lap"
  // 4. "BMW M3 GTR Fast Lap"
  // =========================================================================
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
    if (!Array.isArray(keys)) return [];
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
    'junkman': 'Junkman Stage 3',
    'bmw': 'BMW M3 GTR',
    'stock': 'Stock / De Serie',
    'default': 'Clasificación General'
  };

  function getCategoryDisplayLabel(key, routeType = 'Circuito') {
    if (key === 'junkman_single') return 'Junkman Single Lap';
    if (key === 'junkman_fast') return 'Junkman Fast Lap';
    if (key === 'bmw_single') return 'BMW M3 GTR Single Lap';
    if (key === 'bmw_fast') return 'BMW M3 GTR Fast Lap';
    if (key === 'junkman') {
      return (routeType === 'Sprint') ? 'Junkman Sprint' : ((routeType === 'Drag') ? 'Junkman Drag' : 'Junkman Stage 3');
    }
    if (key === 'bmw') {
      return (routeType === 'Sprint') ? 'BMW M3 GTR Sprint' : ((routeType === 'Drag') ? 'BMW M3 GTR Drag' : 'BMW M3 GTR');
    }
    if (CATEGORY_DISPLAY_LABELS[key]) return CATEGORY_DISPLAY_LABELS[key];
    return key.toUpperCase().replace(/_/g, ' ');
  }

  function renderCategoryTabs(availableKeys, activeKey, routeType = 'Circuito') {
    const container = document.getElementById('leaderboard-category-tabs');
    if (!container) return;

    // Aplicar ordenamiento estricto antes de renderizar
    const sortedKeys = sortCategoriesStrict(availableKeys);

    let html = '';
    sortedKeys.forEach(k => {
      const isActive = k === activeKey;
      const count = (currentRouteRecordsData && Array.isArray(currentRouteRecordsData[k])) ? currentRouteRecordsData[k].length : 0;
      const label = getCategoryDisplayLabel(k, routeType);

      if (isActive) {
        html += `
          <button data-cat-key="${escapeHtml(k)}" class="px-3.5 py-2 rounded bg-surface-container-high text-primary-container font-headline-sm text-body-sm uppercase flex items-center gap-2 shadow-sm font-bold">
            <span>${escapeHtml(label)}</span>
            <span class="px-1.5 py-0.2 bg-primary-container text-on-primary-container font-label-data text-[10px] rounded-full font-bold">${count}</span>
          </button>
        `;
      } else {
        html += `
          <button data-cat-key="${escapeHtml(k)}" class="px-3.5 py-2 rounded text-outline hover:text-on-surface hover:bg-surface-container-high font-headline-sm text-body-sm uppercase flex items-center gap-2 transition-colors">
            <span>${escapeHtml(label)}</span>
            <span class="px-1.5 py-0.2 bg-surface-container text-outline font-label-data text-[10px] rounded-full">${count}</span>
          </button>
        `;
      }
    });

    container.innerHTML = html;

    // Vincular clicks de cambio de categoría
    container.querySelectorAll('button[data-cat-key]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-cat-key');
        selectLeaderboardCategory(key);
      });
    });
  }

  function selectLeaderboardCategory(catKey) {
    currentSelectedCategoryKey = catKey;
    const rawKeys = currentRouteRecordsData ? Object.keys(currentRouteRecordsData).filter(k => Array.isArray(currentRouteRecordsData[k]) && currentRouteRecordsData[k].length > 0) : [];
    
    let routeType = 'Circuito';
    if (typeof routesData !== 'undefined' && Array.isArray(routesData)) {
      const match = routesData.find(r => r.name.toLowerCase() === (currentActiveRoute || '').toLowerCase());
      if (match) routeType = match.type;
    }

    const defaultCategories = (routeType === 'Circuito')
      ? ['junkman_single', 'junkman_fast', 'bmw_single', 'bmw_fast']
      : ['junkman', 'bmw'];

    const availableKeys = sortCategoriesStrict(Array.from(new Set([...defaultCategories, ...rawKeys])));

    renderCategoryTabs(availableKeys.length > 0 ? availableKeys : defaultCategories, catKey, routeType);

    const records = (currentRouteRecordsData && currentRouteRecordsData[catKey]) ? currentRouteRecordsData[catKey] : [];
    renderLeaderboardTable(records);
  }

  async function loadRouteLeaderboard(routeName, targetCategoryKey = null) {
    currentActiveRoute = routeName || 'City Perimeter';

    // 1. Actualizar títulos en la interfaz de Stitch
    const titleEl = document.getElementById('leaderboard-track-name');
    if (titleEl) titleEl.textContent = currentActiveRoute.toUpperCase();

    const breadcrumbEl = document.getElementById('leaderboard-breadcrumb-track');
    if (breadcrumbEl) breadcrumbEl.textContent = currentActiveRoute.toUpperCase();

    // Buscar tipo de ruta
    let routeType = 'Circuito';
    if (typeof routesData !== 'undefined' && Array.isArray(routesData)) {
      const match = routesData.find(r => r.name.toLowerCase() === currentActiveRoute.toLowerCase());
      if (match) routeType = match.type;
    }
    const catBadge = document.getElementById('leaderboard-track-category');
    if (catBadge) catBadge.textContent = routeType.toUpperCase();

    // 2. Estado de carga visual en tabla
    const tbody = document.getElementById('leaderboard-tbody');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="py-16 text-center font-label-data text-primary animate-pulse">
            <div class="flex flex-col items-center gap-2">
              <span class="material-symbols-outlined text-[32px] text-primary-container animate-spin">sync</span>
              <span>Sincronizando telemetría con Firebase RTDB...</span>
            </div>
          </td>
        </tr>
      `;
    }

    // 3. Consultar datos en vivo de Firebase Realtime Database
    const data = await fetchFirebaseRouteRecords(currentActiveRoute);
    currentRouteRecordsData = data;

    // 4. Determinar claves de categoría disponibles y aplicar ordenamiento estricto
    const defaultCategories = (routeType === 'Circuito')
      ? ['junkman_single', 'junkman_fast', 'bmw_single', 'bmw_fast']
      : ['junkman', 'bmw'];

    const rawKeys = Object.keys(data).filter(k => Array.isArray(data[k]) && data[k].length > 0);
    const availableKeys = sortCategoriesStrict(Array.from(new Set([...defaultCategories, ...rawKeys])));

    // Actualizar WR en Hero del Leaderboard si los elementos existen
    const wr = getTrackWR(currentActiveRoute);
    const heroWrTime = document.getElementById('leaderboard-hero-wr-time');
    const heroWrDriver = document.getElementById('leaderboard-hero-wr-driver');
    const heroWrCar = document.getElementById('leaderboard-hero-wr-car');
    if (wr) {
      if (heroWrTime) heroWrTime.textContent = wr.time || formatTime(wr.timeMs);
      if (heroWrDriver) heroWrDriver.textContent = wr.driver;
      if (heroWrCar) heroWrCar.textContent = `${wr.car || (routeType === 'Drag' ? 'Ford GT' : 'Porsche Carrera GT')} [${wr.category || 'Junkman'}]`;
    } else {
      if (heroWrTime) heroWrTime.textContent = '--:--.---';
      if (heroWrDriver) heroWrDriver.textContent = 'En disputa';
      if (heroWrCar) heroWrCar.textContent = `${routeType} Homologado`;
    }

    // 5. Categoría activa predeterminada (siempre la primera en orden estricto)
    let activeKey = targetCategoryKey;
    if (!activeKey || !availableKeys.includes(activeKey)) {
      activeKey = availableKeys[0] || (routeType === 'Circuito' ? 'junkman_single' : 'junkman');
    }

    selectLeaderboardCategory(activeKey);
  }

  window.loadRouteLeaderboard = loadRouteLeaderboard;

  // =========================================================================
  // 4. INICIALIZACIÓN Y EVENT LISTENERS DEL DOM
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    // 0. Asegurar que el scroll vertical esté siempre habilitado
    if (document.body) {
      document.body.classList.remove('overflow-hidden');
    }

    // Listener para restablecer scroll si la ventana se amplía a modo escritorio
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1025 || (window.innerWidth >= 640 && window.matchMedia('(orientation: landscape)').matches)) {
        closeMobileNav();
      }
    });

    // 1. Disparar precarga global de Leaderboards para tener WRs instantáneos en las tarjetas
    fetchAllLeaderboards();

    // 2. Inicializar Router
    const initialView = resolveViewFromUrl();
    switchView(initialView, false);

    // 2. Configurar eventos de filtro de categorías de rutas
    const filterContainer = document.getElementById('routes-category-filters');
    if (filterContainer) {
      filterContainer.querySelectorAll('button[data-cat]').forEach(btn => {
        btn.addEventListener('click', () => {
          const cat = btn.getAttribute('data-cat');
          setCategoryFilter(cat);
        });
      });
    }

    // 3. Buscador en tiempo real de rutas
    const searchInput = document.getElementById('routes-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        filterRoutes();
      });
    }

    // 4. Renderizado inicial de tarjetas de rutas
    ensureRoutesRendered();

    // 5. Delegación de clics globales para navegación y carga de leaderboards
    document.addEventListener('click', (e) => {
      // Clic en tarjetas de modalidades en Home (Circuitos, Sprints, Drag)
      const homeModeCard = e.target.closest('#view-home .bg-surface-container.p-space-md');
      if (homeModeCard) {
        const text = homeModeCard.textContent.toLowerCase();
        let cat = 'all';
        if (text.includes('sprint')) cat = 'Sprint';
        else if (text.includes('drag') || text.includes('arrastre')) cat = 'Drag';
        else if (text.includes('circuito')) cat = 'Circuito';

        if (cat !== 'all') {
          e.preventDefault();
          setCategoryFilter(cat);
          switchView('routes-pistas', true);
          return;
        }
      }

      // Clic en enlace "Ver Leaderboard" de una ruta
      const lbTrigger = e.target.closest('[data-action="view-leaderboard"], article[data-route]');
      if (lbTrigger) {
        const routeName = lbTrigger.getAttribute('data-route') || lbTrigger.closest('article')?.getAttribute('data-route');
        if (routeName) {
          e.preventDefault();
          loadRouteLeaderboard(routeName);
          switchView('leaderboard', true);
          return;
        }
      }

      // Clic en navegación general SPA
      const navElem = e.target.closest('[data-action="navigate"], a[href^="#"]');
      if (navElem) {
        const target = navElem.getAttribute('data-target') || navElem.getAttribute('href').replace(/^#/, '');
        if (target) {
          e.preventDefault();
          switchView(target, true);
        }
      }
    });
  });


  // =========================================================================
  // TOURNAMENT REGISTRATION & REALTIME PARTICIPANTS (FIREBASE RTDB)
  // =========================================================================
  const FIREBASE_CHAMP_PARTICIPANTS_URL = "https://nfsranks-blacklist-default-rtdb.firebaseio.com/championship_participants.json";
  const FIREBASE_REG_PARTICIPANTS_URL = "https://nfsranks-blacklist-default-rtdb.firebaseio.com/records/registered_participants.json";
  const REG_STORAGE_KEY = 'nfs_registered_participants_v3';
  const REG_STORAGE_KEY_V2 = 'nfs_championship_participants_v2';

  const FALLBACK_DEFAULT_PARTICIPANTS = [
    { rank: 1, alias: "ZimanX", name: "ZimanX", ride: "Porsche Carrera GT", schedule: "Sábados", registeredAt: "2026-10-01T12:00:00.000Z" },
    { rank: 2, alias: "MysticX", name: "MysticX", ride: "BMW M3 GTR", schedule: "From Tuesday to Saturday", registeredAt: "2026-10-01T14:30:00.000Z" },
    { rank: 3, alias: "Nebula", name: "Nebula", ride: "Carrera GT y Lotus Elise", schedule: "Sábado desde 20pm en adelante (hora Chile)", registeredAt: "2026-10-01T16:00:00.000Z" },
    { rank: 4, alias: "xLeMondx", name: "xLeMondx", ride: "Porsche Carrera GT", schedule: "Lun - Sáb 8pm - 12 am hora Perú", registeredAt: "2026-10-01T18:00:00.000Z" },
    { rank: 5, alias: "SRTxAvenger™", name: "Avenger", ride: "Porsche Carrera GT y Lotus Elise", schedule: "Lunes a domingo después de las 5 pm", registeredAt: "2026-10-01T19:00:00.000Z" },
    { rank: 6, alias: "Shido", name: "DarkShido", ride: "BMW M3 GTR", schedule: "Sábado desde las 7pm hora Venezuela", registeredAt: "2026-10-01T20:00:00.000Z" },
    { rank: 7, alias: "DannyLove", name: "DannyLove", ride: "BMW M3 GTR", schedule: "Jueves - Domingo | 7:30 pm", registeredAt: "2026-10-01T21:00:00.000Z" },
    { rank: 8, alias: "Lea", name: "Lea4Speed0", ride: "Carrera GT & M3 GTR", schedule: "Domingo 8:00 PM", registeredAt: "2026-10-01T22:00:00.000Z" },
    { rank: 9, alias: "NFSMW", name: "ellafreyafan", ride: "BMW M3 GTR", schedule: "Mon-Sun 8PM - 12AM CET", registeredAt: "2026-10-02T10:00:00.000Z" },
    { rank: 10, alias: "N6 xBourne", name: "N6 xBourne", ride: "Porsche Carrera GT y Lotus Elise", schedule: "Horario Flexible", registeredAt: "2026-10-02T12:00:00.000Z" },
    { rank: 11, alias: "RazorV8", name: "RazorV8", ride: "Ford GT", schedule: "Horario Flexible", registeredAt: "2026-10-02T14:00:00.000Z" },
    { rank: 12, alias: "TurboFox", name: "TurboFox", ride: "Porsche 911 Turbo S", schedule: "Horario Flexible", registeredAt: "2026-10-02T16:00:00.000Z" },
    { rank: 13, alias: "SRTxSigy", name: "SRTxSigy", ride: "Porsche Carrera GT", schedule: "Horario Flexible", registeredAt: "2026-10-02T18:00:00.000Z" }
  ];

  let registeredParticipants = [];

  async function loadRegistrationView() {
    // 1. Cargar desde memoria caché local
    try {
      const cached = localStorage.getItem(REG_STORAGE_KEY) || localStorage.getItem(REG_STORAGE_KEY_V2);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          registeredParticipants = parsed;
          renderRegisteredPilotsUI();
        }
      }
    } catch (e) {}

    // 2. Si aún no hay nada, usar fallback inicial
    if (!registeredParticipants || registeredParticipants.length === 0) {
      registeredParticipants = JSON.parse(JSON.stringify(FALLBACK_DEFAULT_PARTICIPANTS));
      renderRegisteredPilotsUI();
    }

    // 3. Consultar datos en vivo desde Firebase RTDB
    try {
      const [resChamp, resReg] = await Promise.all([
        fetch(`${FIREBASE_CHAMP_PARTICIPANTS_URL}?_t=${Date.now()}`, { cache: 'no-store' }).catch(() => null),
        fetch(`${FIREBASE_REG_PARTICIPANTS_URL}?_t=${Date.now()}`, { cache: 'no-store' }).catch(() => null)
      ]);

      const mergedList = [];
      const seenAliases = new Set();

      function addParticipant(p, key) {
        if (!p || typeof p !== 'object') return;
        const alias = (p.alias || p.name || '').trim();
        if (!alias) return;
        const lower = alias.toLowerCase();
        if (seenAliases.has(lower)) return;
        seenAliases.add(lower);
        mergedList.push({
          ...p,
          alias: alias,
          name: p.name || alias,
          _firebaseKey: key || p._firebaseKey || p.id
        });
      }

      if (resChamp && resChamp.ok) {
        const dataChamp = await resChamp.json();
        if (dataChamp && typeof dataChamp === 'object') {
          if (Array.isArray(dataChamp)) {
            dataChamp.forEach((p, idx) => addParticipant(p, String(idx)));
          } else {
            Object.keys(dataChamp).forEach(k => {
              if (k !== 'weeks_data') addParticipant(dataChamp[k], k);
            });
          }
        }
      }

      if (resReg && resReg.ok) {
        const dataReg = await resReg.json();
        if (dataReg && typeof dataReg === 'object') {
          if (Array.isArray(dataReg)) {
            dataReg.forEach((p, idx) => addParticipant(p, String(idx)));
          } else {
            Object.keys(dataReg).forEach(k => {
              if (k !== 'weeks_data') addParticipant(dataReg[k], k);
            });
          }
        }
      }

      // Si Firebase devolvió datos en vivo válidos, enriquecer con ellos
      if (mergedList.length > 0) {
        mergedList.sort((a, b) => new Date(a.registeredAt || 0) - new Date(b.registeredAt || 0));
        registeredParticipants = mergedList;
        try {
          localStorage.setItem(REG_STORAGE_KEY, JSON.stringify(registeredParticipants));
          localStorage.setItem(REG_STORAGE_KEY_V2, JSON.stringify(registeredParticipants));
        } catch (e) {}
        renderRegisteredPilotsUI();
      }
    } catch (err) {
      console.info("Sincronización Firebase en modo local/offline:", err.message);
    }
  }

  function renderRegisteredPilotsUI() {
    const listContainer = document.getElementById('registered-pilots-list');
    const countNum = document.getElementById('reg-count-num');
    const summarySlots = document.getElementById('reg-summary-slots');

    const total = registeredParticipants.length;
    if (countNum) countNum.textContent = total;
    if (summarySlots) summarySlots.textContent = `${total} / 15 Ocupadas`;

    if (!listContainer) return;

    if (total === 0) {
      listContainer.innerHTML = `
        <div class="text-center py-8 text-on-surface-variant font-label-data text-body-xs">
          Aún no hay pilotos inscritos. ¡Sé el primero en registrarte!
        </div>
      `;
      return;
    }

    listContainer.innerHTML = registeredParticipants.map((p, idx) => {
      const rank = idx + 1;
      const isTop = rank <= 3;
      const rankBadge = isTop
        ? 'bg-primary-container text-black font-black'
        : 'bg-surface-container-highest text-on-surface font-bold';

      const dateStr = p.registeredAt ? new Date(p.registeredAt).toLocaleDateString() : 'Oficial';

      return `
        <div class="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-surface-container-highest/40 transition-all flex items-center justify-between gap-2 shadow-sm">
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="w-6 h-6 rounded ${rankBadge} text-[11px] font-label-data flex items-center justify-center shrink-0">
              #${rank}
            </span>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="font-headline-sm text-[13px] uppercase text-on-surface font-bold truncate">${escapeHtml(p.alias || p.name)}</span>
                ${p.name && p.name !== p.alias ? `<span class="text-[10px] text-primary-container font-label-data font-semibold truncate">(${escapeHtml(p.name)})</span>` : ''}
              </div>
              <div class="flex items-center gap-2 text-[10px] font-label-data text-on-surface-variant truncate">
                <span class="text-secondary-container font-semibold">${escapeHtml(p.ride || 'Porsche Carrera GT')}</span>
                <span>•</span>
                <span>${escapeHtml(p.schedule || 'Horario Flexible')}</span>
              </div>
            </div>
          </div>
          <div class="text-right shrink-0">
            <span class="text-[10px] font-label-data text-outline block">${dateStr}</span>
            <span class="text-[9px] font-label-data text-tertiary uppercase font-bold">VERIFICADO</span>
          </div>
        </div>
      `;
    }).join('');
  }

  async function handleChampionshipSubmit(event) {
    if (event) event.preventDefault();

    const nameInput = document.getElementById('reg-driver-name');
    const aliasInput = document.getElementById('reg-driver-alias');
    const carInput = document.getElementById('reg-driver-car');
    const scheduleInput = document.getElementById('reg-driver-schedule');
    const ytInput = document.getElementById('reg-driver-youtube');
    const contactInput = document.getElementById('reg-driver-contact');
    const termsCheck = document.getElementById('reg-terms');
    const submitBtn = document.getElementById('btn-submit-registration');

    if (!nameInput || !carInput || !scheduleInput || !termsCheck) return;

    const name = nameInput.value.trim();
    const alias = aliasInput ? aliasInput.value.trim() : '';
    const ride = carInput.value.trim();
    const schedule = scheduleInput.value.trim();
    const youtube = ytInput ? ytInput.value.trim() : '';
    const contact = contactInput ? contactInput.value.trim() : '';

    if (!name || !ride || !schedule) {
      showRegisterFeedback("Por favor, completa todos los campos obligatorios (*).", "error");
      return;
    }

    if (!termsCheck.checked) {
      showRegisterFeedback("Debes aceptar el reglamento del Torneo para poder inscribirte.", "error");
      return;
    }

    const effectiveAlias = alias || name;
    const alreadyExists = registeredParticipants.some(p => 
      (p.name && p.name.toLowerCase() === name.toLowerCase()) || 
      (p.alias && p.alias.toLowerCase() === effectiveAlias.toLowerCase())
    );
    if (alreadyExists) {
      showRegisterFeedback(`El piloto "${effectiveAlias}" ya se encuentra registrado en el campeonato.`, "error");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳</span> REGISTRANDO PILOTO EN LA RED...`;
    }

    const newParticipant = {
      id: "reg_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
      name: name,
      alias: effectiveAlias,
      ride: ride,
      schedule: schedule,
      youtube: youtube,
      contact: contact,
      registeredAt: new Date().toISOString(),
      isRealUser: true
    };

    registeredParticipants.push(newParticipant);
    try {
      localStorage.setItem(REG_STORAGE_KEY, JSON.stringify(registeredParticipants));
      localStorage.setItem(REG_STORAGE_KEY_V2, JSON.stringify(registeredParticipants));
    } catch (e) {}
    renderRegisteredPilotsUI();

    try {
      await Promise.all([
        fetch(FIREBASE_CHAMP_PARTICIPANTS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newParticipant)
        }).catch(() => null),
        fetch(FIREBASE_REG_PARTICIPANTS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newParticipant)
        }).catch(() => null)
      ]);
    } catch (e) {
      console.warn("No se pudo conectar con Firebase en la nube (guardado localmente):", e);
    }

    try {
      const channel = new BroadcastChannel('nfs_championship_sync');
      channel.postMessage({ type: 'NEW_PARTICIPANT', participant: newParticipant });
    } catch (e) {}

    nameInput.value = '';
    if (aliasInput) aliasInput.value = '';
    carInput.value = '';
    scheduleInput.value = '';
    if (ytInput) ytInput.value = '';
    if (contactInput) contactInput.value = '';
    termsCheck.checked = false;

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span class="material-symbols-outlined text-[20px]">how_to_reg</span>
        <span>REGISTRARME EN EL CAMPEONATO 2026</span>
      `;
    }

    const assignedRank = registeredParticipants.length;
    showRegisterFeedback(`¡Inscripción confirmada con éxito! Has sido asignado a la Plaza Oficial #${assignedRank} del Campeonato Blacklist 2026.`, "success");
  }

  function showRegisterFeedback(message, type) {
    const el = document.getElementById('register-feedback-msg');
    if (!el) return;
    el.classList.remove('hidden');
    if (type === 'success') {
      el.className = 'p-3 rounded-lg font-label-data text-body-xs font-bold bg-primary-container/20 text-primary-container border border-primary-container/40';
      el.innerHTML = `<strong>✓ ÉXITO:</strong> ${message}`;
    } else {
      el.className = 'p-3 rounded-lg font-label-data text-body-xs font-bold bg-error/20 text-error border border-error/40';
      el.innerHTML = `<strong>⚠ ERROR:</strong> ${message}`;
    }
  }

  // =========================================================================
  // PAST TOURNAMENTS (CHALLONGE HISTORIAL) LOGIC
  // =========================================================================
  let currentPastTournamentKey = 'ev1n0yug';
  let currentPastViewMode = 'brackets';

  function loadPastTournamentsView() {
    renderPastTournament(currentPastTournamentKey);
  }

  function switchPastTournament(key) {
    const data = (typeof window !== 'undefined' && window.PAST_TOURNAMENTS_DATA) || (typeof PAST_TOURNAMENTS_DATA !== 'undefined' ? PAST_TOURNAMENTS_DATA : null);
    if (!data || !data[key]) return;
    currentPastTournamentKey = key;

    const pills = document.querySelectorAll('#past-tournaments-pills button');
    pills.forEach(btn => {
      btn.className = 'px-space-md py-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-hud text-label-hud uppercase tracking-wider flex items-center gap-space-xs transition-colors';
    });

    const activePill = document.getElementById(`pill-tournament-${key}`);
    if (activePill) {
      activePill.className = 'px-space-md py-space-xs rounded-lg bg-surface-container-high text-primary-container font-label-hud text-label-hud uppercase tracking-wider flex items-center gap-space-xs shadow active';
    }

    renderPastTournament(key);
  }

  function switchPastViewMode(mode, btn) {
    currentPastViewMode = mode;
    const modeBtns = document.querySelectorAll('.past-view-mode-tabs button');
    modeBtns.forEach(b => {
      b.className = 'px-space-md py-space-sm bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-white font-headline-sm text-label-hud uppercase tracking-wider rounded-lg flex items-center gap-space-xs font-bold transition-all filter-btn';
    });

    if (btn) {
      btn.className = 'px-space-md py-space-sm bg-primary-container text-black font-headline-sm text-label-hud uppercase tracking-wider rounded-lg flex items-center gap-space-xs shadow font-black transition-all filter-btn active';
    }

    ['brackets', 'podium', 'roster'].forEach(m => {
      const el = document.getElementById(`past-tournament-view-${m}`);
      if (el) {
        if (m === mode) el.classList.remove('hidden');
        else el.classList.add('hidden');
      }
    });
  }

  function renderPastTournament(key) {
    const data = (typeof window !== 'undefined' && window.PAST_TOURNAMENTS_DATA) || (typeof PAST_TOURNAMENTS_DATA !== 'undefined' ? PAST_TOURNAMENTS_DATA : null);
    if (!data) return;
    const t = data[key];
    if (!t) return;

    renderPastTournamentHero(t);
    renderPastTournamentStats(t);
    renderPastTournamentBrackets(t);
    renderPastTournamentPodium(t);
    renderPastTournamentParticipants(t);

    const rosterCountEl = document.getElementById('past-roster-count');
    if (rosterCountEl && t.stats) rosterCountEl.textContent = t.stats.totalPilots;
  }

  function renderPastTournamentHero(t) {
    const heroEl = document.getElementById('past-tournament-hero');
    if (!heroEl) return;

    heroEl.innerHTML = `
      <div class="hud-card tactical-border-accent tactical-corner-brackets p-space-lg shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-space-md relative overflow-hidden">
        <div class="tactical-watermark select-none pointer-events-none">ARCHIVE</div>
        <div class="flex flex-col gap-2 relative z-10">
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="tactical-badge tactical-badge-amber text-body-xs font-black uppercase">${escapeHtml(t.edition)}</span>
            <span class="tactical-badge tactical-badge-neutral text-body-xs uppercase font-bold">${escapeHtml(t.date)}</span>
            <span class="tactical-badge tactical-badge-cyan text-body-xs uppercase font-bold">${escapeHtml(t.category)}</span>
            <span class="tactical-badge tactical-badge-neutral text-body-xs uppercase font-bold">${escapeHtml(t.format)}</span>
          </div>
          <h2 class="font-headline-md text-headline-sm uppercase text-on-surface font-black">${escapeHtml(t.title)}</h2>
          <p class="font-body-md text-body-sm text-on-surface-variant max-w-2xl">
            Organizado y disputado bajo las normas oficiales de <strong>${escapeHtml(t.platform)}</strong>. ${t.hosts ? `Coordinación y arbitraje: <span class="text-primary-container font-bold">${escapeHtml(t.hosts)}</span>.` : ''}
          </p>
        </div>
        <div class="shrink-0 relative z-10">
          <a href="${escapeHtml(t.challongeUrl)}" target="_blank" rel="noopener noreferrer" class="px-4 py-2.5 rounded-sm bg-surface-container-high hover:bg-surface-bright text-primary-container font-headline-sm text-label-hud uppercase font-black tracking-wider flex items-center gap-2 border border-primary-container/30 transition-all">
            <span class="material-symbols-outlined text-[18px]">open_in_new</span>
            <span>Ver Bracket en Challonge</span>
          </a>
        </div>
      </div>
    `;
  }

  function renderPastTournamentStats(t) {
    const statsEl = document.getElementById('past-tournament-stats-bar');
    if (!statsEl || !t.stats) return;

    statsEl.innerHTML = `
      <div class="hud-card hover-card-lift p-space-md flex flex-col justify-between shadow-md relative overflow-hidden">
        <span class="font-label-hud text-label-hud uppercase tracking-widest text-on-surface-variant">TOTAL PILOTOS</span>
        <div class="font-headline-sm text-[16px] text-on-surface font-black leading-tight uppercase tabular-nums">${t.stats.totalPilots} Participantes</div>
        <span class="font-label-data text-[11px] text-on-surface-variant/80 mt-1 uppercase">Parrilla Verificada</span>
      </div>
      <div class="hud-card hover-card-lift p-space-md flex flex-col justify-between shadow-md relative overflow-hidden">
        <span class="font-label-hud text-label-hud uppercase tracking-widest text-on-surface-variant">MATCHES DISPUTADOS</span>
        <div class="font-headline-sm text-[16px] text-secondary font-black leading-tight uppercase tabular-nums">${t.stats.totalMatches} Enfrentamientos</div>
        <span class="font-label-data text-[11px] text-on-surface-variant/80 mt-1 uppercase">Doble Eliminación</span>
      </div>
      <div class="hud-card hover-card-lift p-space-md flex flex-col justify-between shadow-md relative overflow-hidden">
        <span class="font-label-hud text-label-hud uppercase tracking-widest text-on-surface-variant">CAMPEÓN DEL TORNEO</span>
        <div class="font-headline-sm text-[16px] text-primary-container font-black leading-tight uppercase truncate">🥇 ${escapeHtml(t.stats.champion)}</div>
        <span class="font-label-data text-[11px] text-on-surface-variant/80 mt-1 uppercase font-bold">1er Lugar Oficial</span>
      </div>
      <div class="hud-card hover-card-lift p-space-md flex flex-col justify-between shadow-md relative overflow-hidden">
        <span class="font-label-hud text-label-hud uppercase tracking-widest text-on-surface-variant">SUBCAMPEÓN</span>
        <div class="font-headline-sm text-[16px] text-tertiary font-black leading-tight uppercase truncate">🥈 ${escapeHtml(t.stats.runnerUp)}</div>
        <span class="font-label-data text-[11px] text-on-surface-variant/80 mt-1 uppercase font-bold">2do Lugar Oficial</span>
      </div>
    `;
  }

  function renderPastTournamentBrackets(t) {
    const container = document.getElementById('past-brackets-container');
    if (!container || !Array.isArray(t.bracketSections)) return;

    let html = '';
    t.bracketSections.forEach(sec => {
      html += `
        <div class="bg-surface-container-low rounded-xl p-space-md shadow-lg border border-surface-container-highest/40 mb-space-md">
          <div class="flex items-center justify-between mb-space-md border-b border-surface-container-highest/30 pb-2">
            <h3 class="font-headline-sm text-body-md uppercase text-on-surface font-black flex items-center gap-2">
              <span class="material-symbols-outlined text-primary-container text-[18px]">account_tree</span>
              <span>${escapeHtml(sec.sectionTitle)}</span>
            </h3>
            <span class="text-[10px] font-label-data uppercase bg-surface-container-highest px-2 py-0.5 rounded text-outline font-bold">
              ${sec.rounds.length} Rondas
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
      `;

      sec.rounds.forEach((round, rIdx) => {
        html += `
          <div class="bg-surface-container-lowest rounded-lg p-space-sm border border-surface-container-highest/30 flex flex-col gap-2">
            <div class="font-label-hud text-[11px] uppercase text-primary-container font-bold border-b border-surface-container-highest/20 pb-1 flex items-center justify-between">
              <span>R${rIdx + 1}: ${escapeHtml(round.roundName)}</span>
              <span class="text-outline text-[9px]">${round.matches.length} Match(es)</span>
            </div>
            <div class="space-y-2">
        `;

        round.matches.forEach(m => {
          const p1Win = m.p1.winner;
          const p2Win = m.p2.winner;
          const isFinal = sec.sectionId === 'finals';

          html += `
            <div class="p-2 rounded bg-surface-container/60 border ${isFinal ? 'border-primary-container/60 shadow-lg' : 'border-surface-container-highest/30'} flex flex-col gap-1">
              <div class="flex items-center justify-between text-[10px] font-label-data text-outline">
                <span>MATCH #${m.id}</span>
                ${isFinal ? '<span class="text-primary-container font-black">👑 GRAN FINAL</span>' : ''}
              </div>
              <div class="flex items-center justify-between p-1 rounded ${p1Win ? 'bg-primary-container/20 text-on-surface font-black' : 'text-on-surface-variant'} text-body-xs font-label-data">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="text-[10px] text-outline">#${m.p1.seed}</span>
                  <span class="truncate">${escapeHtml(m.p1.name)}</span>
                  ${p1Win ? '<span class="text-primary-container text-[11px]">✓</span>' : ''}
                </div>
                <span class="${p1Win ? 'text-primary-container font-black' : 'text-outline'}">${m.p1.score}</span>
              </div>
              <div class="flex items-center justify-between p-1 rounded ${p2Win ? 'bg-primary-container/20 text-on-surface font-black' : 'text-on-surface-variant'} text-body-xs font-label-data">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="text-[10px] text-outline">#${m.p2.seed}</span>
                  <span class="truncate">${escapeHtml(m.p2.name)}</span>
                  ${p2Win ? '<span class="text-primary-container text-[11px]">✓</span>' : ''}
                </div>
                <span class="${p2Win ? 'text-primary-container font-black' : 'text-outline'}">${m.p2.score}</span>
              </div>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  function renderPastTournamentPodium(t) {
    const container = document.getElementById('past-podium-container');
    if (!container || !Array.isArray(t.podium)) return;

    container.innerHTML = t.podium.map(item => {
      let badgeColor = 'tactical-badge-neutral';
      let borderGlow = 'border-white/10';
      if (item.place === 1) {
        badgeColor = 'tactical-badge-amber';
        borderGlow = 'tactical-border-accent-amber shadow-[0_0_15px_rgba(255,184,0,0.3)]';
      } else if (item.place === 2) {
        badgeColor = 'tactical-badge-cyan';
        borderGlow = 'tactical-border-accent-cyan';
      } else if (item.place === 3) {
        badgeColor = 'tactical-badge-amber';
        borderGlow = 'tactical-border-accent-amber';
      }

      return `
        <div class="hud-card hud-card-interactive tactical-chamfer-top-right p-space-md shadow-xl border ${borderGlow} flex flex-col justify-between relative overflow-hidden group">
          <div class="tactical-watermark select-none pointer-events-none">#${item.place}</div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-space-sm">
              <span class="${badgeColor} text-[10px] font-label-data uppercase font-bold">
                ${item.medal} ${escapeHtml(item.rankName)}
              </span>
              <span class="text-[10px] font-label-data text-outline tabular-nums">Seed #${item.seed}</span>
            </div>
            <h3 class="font-headline-md text-headline-sm uppercase text-on-surface font-black mb-1 truncate">
              ${escapeHtml(item.name)}
            </h3>
            <p class="font-body-md text-body-xs text-on-surface-variant leading-relaxed">
              ${escapeHtml(item.note)}
            </p>
          </div>
          <div class="pt-space-sm border-t border-white/10 mt-space-sm text-[10px] font-label-data text-outline uppercase font-semibold relative z-10">
            ${escapeHtml(t.shortTitle)}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderPastTournamentParticipants(t) {
    const tbody = document.getElementById('tbody-past-participants');
    if (!tbody || !Array.isArray(t.participants)) return;

    tbody.innerHTML = t.participants.map(p => {
      return `
        <tr class="hover:bg-surface-container-high/40 transition-colors">
          <td class="p-3 text-center font-label-data font-bold text-primary-container">#${p.seed}</td>
          <td class="p-3 font-headline-sm text-body-sm uppercase text-on-surface font-bold">${escapeHtml(p.name)}</td>
          <td class="p-3 font-label-data text-body-xs font-semibold text-secondary-container">${escapeHtml(p.finalPos)}</td>
          <td class="p-3 font-label-data text-[10px] text-tertiary uppercase font-bold">Verificado Challonge</td>
        </tr>
      `;
    }).join('');
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

  // Global exposure for tournament handlers
  window.handleChampionshipSubmit = handleChampionshipSubmit;
  window.switchPastTournament = switchPastTournament;
  window.switchPastViewMode = switchPastViewMode;
  window.loadRegistrationView = loadRegistrationView;
  window.loadPastTournamentsView = loadPastTournamentsView;

})();
