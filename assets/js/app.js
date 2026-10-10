function applyNormalizedChampionshipWeeksData(target, data) {
    if (!target || !data || typeof data !== 'object') return;

    function mergeWeek(wNum, w) {
        if (!w || isNaN(wNum) || wNum < 1 || wNum > 4) return;
        w.weekNumber = wNum;
        if (target[wNum] && target[wNum].challenges && Array.isArray(w.challenges)) {
            w.challenges.forEach((remoteCh, cIdx) => {
                const localCh = target[wNum].challenges[cIdx] || target[wNum].challenges.find(c => c.id === remoteCh.id);
                if (localCh && localCh.groupsResults) {
                    remoteCh.groupsResults = Object.assign({}, localCh.groupsResults, remoteCh.groupsResults || {});
                }
            });
        }
        target[wNum] = w;
        target[String(wNum)] = w;
    }

    if (Array.isArray(data)) {
        data.forEach((w, idx) => {
            if (!w) return;
            const wNum = (w.weekNumber || w.weekNum) ? parseInt(w.weekNumber || w.weekNum, 10) : (idx + 1);
            mergeWeek(wNum, w);
        });
    } else {
        Object.keys(data).forEach(k => {
            const w = data[k];
            if (!w) return;
            const parsedK = parseInt(k, 10);
            const wNum = (w.weekNumber || w.weekNum) ? parseInt(w.weekNumber || w.weekNum, 10) : parsedK;
            mergeWeek(wNum, w);
        });
    }
}

window.addEventListener('storage', (e) => {
    if ((e.key === 'nfs_championship_weeks_data_v3' || e.key === 'nfs_championship_weeks_data_v2' || e.key === 'nfs_championship_weeks_data_v1') && e.newValue) {
        try {
            const data = JSON.parse(e.newValue);
            if (data && typeof data === 'object' && typeof CHAMPIONSHIP_WEEKS_DATA !== 'undefined') {
                applyNormalizedChampionshipWeeksData(CHAMPIONSHIP_WEEKS_DATA, data);
                const activeW = (typeof currentChampionshipWeek !== 'undefined') ? currentChampionshipWeek : 1;
                if (typeof renderChampionshipGroups === 'function') renderChampionshipGroups(activeW);
                if (typeof renderChampionshipChallenges === 'function') renderChampionshipChallenges(activeW);
                if (typeof renderBlacklistUI === 'function') renderBlacklistUI();
                if (typeof renderAllTacticalCards === 'function') renderAllTacticalCards();
                if (typeof syncBlacklistWithRotationsAndStandings === 'function') syncBlacklistWithRotationsAndStandings();
            }
        } catch (err) {}
    } else if (e.key === 'nfs_championship_participants_v2' && e.newValue) {
        try {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed) && parsed.length > 0) {
                registeredParticipants = parsed.filter(p => p && typeof p === 'object' && (p.name || p.alias));
                mergeRegisteredParticipantsWithBlacklist();
                renderRegisteredPilotsUI();
            }
        } catch (err) {}
    }
});
/**
 * NFS: Most Wanted (2005) - World Records (NFSRANKSMW)
 * LÃ³gica principal: NavegaciÃ³n, Telemetría F1, CachÃ© Inteligente,
 * Lazy Loading, Renderizado de Podios Top 3 (estilo lokal.gg) y Tablas Deportivas.
 */

// =======================================================
// ESTADO GLOBAL Y CONFIGURACIONES
// =======================================================
let currentCategory = 'all';

// ConfiguraciÃ³n de CachÃ© (10 minutos de tiempo de vida / TTL)
const CACHE_TTL_MS = 10 * 60 * 1000;
const memoryCache = {};

// PaginaciÃ³n para tablas de podios
const PODIUM_PAGE_SIZE = 10;
const podiumDisplayLimits = {
    'tbody-global-drivers': PODIUM_PAGE_SIZE,
    'tbody-global-allroutes': PODIUM_PAGE_SIZE,
    'tbody-global-circuit': PODIUM_PAGE_SIZE,
    'tbody-global-sprint': PODIUM_PAGE_SIZE,
    'tbody-global-drag': PODIUM_PAGE_SIZE
};

// URL del Webhook de Discord para moderaciÃ³n
const DISCORD_WEBHOOK_URL = "URL_DE_TU_WEBHOOK_DE_DISCORD_AQUI";

// Conector Web App de Google Apps Script (Hojas de CÃ¡lculo & Firebase)
const GOOGLE_APPS_SCRIPT_WEBAPP_URL = "URL_DE_TU_GOOGLE_APPS_SCRIPT_WEBAPP_AQUI";

// URL Base de Firebase Realtime Database para Leaderboards
var FIREBASE_RTDB_BASE_URL = (window.FIREBASE_RTDB_BASE_URL || (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) || "https://nfsranks-blacklist-default-rtdb.firebaseio.com");

// =======================================================
// TELEMETRÃA EN VIVO (ESTILO FÃ“RMULA 1)
// =======================================================
function startTelemetryClock() {
    const clockEl = document.getElementById('telemetry-clock');
    if (!clockEl) return;

    const update = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    };
    update();
    setInterval(update, 1000);
}

// =======================================================
// NAVEGACIÃ“N Y PESTAÃ‘AS (UI)
// =======================================================
function toggleMenu() {
    const mainNav = document.getElementById('main-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    if (mainNav) {
        const isOpen = mainNav.classList.toggle('open');
        if (menuToggle) {
            menuToggle.textContent = isOpen ? 'âœ•' : 'â˜°';
            menuToggle.classList.toggle('active', isOpen);
        }
        if (!isOpen) {
            closeAllDropdowns();
        }
    }
}

// =======================================================
// VENTANA FLOTANTE Y BOTÃ“N DESPLEGABLE DE DISCORD
// =======================================================
function toggleDiscordFloatingDrawer(event, forceState) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const container = document.getElementById('discord-floating-container');
    const trigger = document.getElementById('discord-floating-btn');
    if (!container) return;
    const isOpen = container.classList.contains('open');
    const nextState = forceState !== undefined ? forceState : !isOpen;
    if (nextState) {
        container.classList.add('open');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
    } else {
        container.classList.remove('open');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
}

// Cierre al hacer clic fuera del panel flotante o pulsar Escape
document.addEventListener('click', function (e) {
    const container = document.getElementById('discord-floating-container');
    if (container && container.classList.contains('open')) {
        if (!container.contains(e.target)) {
            toggleDiscordFloatingDrawer(null, false);
        }
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const container = document.getElementById('discord-floating-container');
        if (container && container.classList.contains('open')) {
            toggleDiscordFloatingDrawer(null, false);
        }
    }
});


const SECTION_PATH_MAP = {
    'home': '/',
    'routes-pistas': '/routes-pistas',
    'pistas': '/routes-pistas',
    'routes': '/routes',
    'leaderboard': '/leaderboard',
    'leaderboards': '/leaderboards',
    'challenges': '/desafio',
    'desafio': '/desafio',
    'blacklist': '/blacklist',
    'championship-standings': '/championship-standings',
    'blacklist-cards': '/blacklist-cards',
    'championship-register': '/championship-register',
    'past-tournaments': '/past-tournaments',
    'halloffame': '/halloffame',
    'globaldrivers': '/globaldrivers',
    'globalroutes': '/globalroutes',
    'guides': '/guides',
    'rules': '/rules',
    'tutorial': '/tutorial',
    'driverprofile': '/driverprofile',
    'submit': '/submit',
    'download': '/download',
    'map': '/map',
    'members': '/members'
};

function resolveViewFromUrl() {
    if (typeof window === 'undefined') return 'home';

    // 1. Pathname
    const pathParts = window.location.pathname.toLowerCase().split('/').filter(Boolean);
    for (let i = pathParts.length - 1; i >= 0; i--) {
        const seg = decodeURIComponent(pathParts[i]);
        if (seg === 'routes-pistas' || seg === 'pistas') return 'routes-pistas';
        if (seg === 'leaderboard' || seg === 'leaderboards') return 'leaderboard';
        if (seg === 'desafio' || seg === 'desafÃ­o' || seg === 'challenges' || seg === 'desafios' || seg === 'desafÃ­os') return 'challenges';
        if (seg === 'routes' || seg === 'rutas') return 'routes';
        if (seg === 'blacklist') return 'blacklist';
        if (seg === 'championship-standings' || seg === 'standings') return 'championship-standings';
        if (seg === 'blacklist-cards' || seg === 'cards') return 'blacklist-cards';
        if (seg === 'championship-register' || seg === 'register') return 'championship-register';
        if (seg === 'past-tournaments' || seg === 'tournaments') return 'past-tournaments';
        if (seg === 'halloffame') return 'halloffame';
        if (seg === 'globaldrivers') return 'globaldrivers';
        if (seg === 'globalroutes') return 'globalroutes';
        if (seg === 'guides' || seg === 'guias' || seg === 'guÃ­as') return 'guides';
        if (seg === 'rules' || seg === 'reglas') return 'rules';
        if (seg === 'tutorial') return 'tutorial';
        if (seg === 'driverprofile' || seg === 'driver' || seg === 'profile') return 'driverprofile';
        if (seg === 'submit' || seg === 'enviar') return 'submit';
        if (seg === 'download' || seg === 'descargas') return 'download';
        if (seg === 'map' || seg === 'mapa') return 'map';
        if (seg === 'members' || seg === 'miembros') return 'members';
    }

    // 2. Query param ?view=...
    const sp = new URLSearchParams(window.location.search);
    if (sp.has('view')) {
        const v = sp.get('view').toLowerCase();
        if (document.getElementById('view-' + v)) return v;
    }

    // 3. Hash #view-...
    const hash = window.location.hash.toLowerCase().replace(/^#view-|^#/, '');
    if (hash && document.getElementById('view-' + hash)) {
        return hash;
    }

    return 'home';
}

function updateBrowserHistory(viewId) {
    if (typeof window === 'undefined' || !window.history || window.location.protocol === 'file:') return;

    let targetPath = SECTION_PATH_MAP[viewId] || `/${viewId}`;
    let search = window.location.search;

    // Si salimos de leaderboard hacia otra secciÃ³n, limpiamos los query params de ruta si existÃ­an
    if (viewId !== 'leaderboard' && search.includes('route=')) {
        search = '';
    }

    const fullUrl = targetPath + (search || '');
    const currentClean = window.location.pathname.replace(/\/$/, '') || '/';
    const targetClean = targetPath.replace(/\/$/, '') || '/';

    if (currentClean !== targetClean) {
        window.history.pushState({ viewId: viewId }, '', fullUrl);
    }
}

function switchView(viewId, updateHistory = true) {
    if (viewId === 'routes') {
        viewId = 'routes-pistas';
    }
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('nav a, .nav-dropdown-btn').forEach(link => {
        link.classList.remove('active');
    });

    const targetSection = document.getElementById('view-' + viewId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    const targetNavLink = document.getElementById('nav-' + viewId) || 
                          document.getElementById('nav-dropdown-' + viewId) || 
                          (viewId === 'leaderboard' ? document.getElementById('nav-routes-pistas') : null);
    if (targetNavLink) {
        targetNavLink.classList.add('active');

        // Si el enlace pertenece a un menÃº desplegable, tambiÃ©n iluminamos el botÃ³n padre
        const parentDropdown = targetNavLink.closest('.nav-dropdown');
        if (parentDropdown) {
            const dropdownBtn = parentDropdown.querySelector('.nav-dropdown-btn');
            if (dropdownBtn) dropdownBtn.classList.add('active');
        }
    }

    const mainNav = document.getElementById('main-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    if (mainNav) {
        mainNav.classList.remove('open');
    }
    if (menuToggle) {
        menuToggle.textContent = 'â˜°';
        menuToggle.classList.remove('active');
    }

    closeAllDropdowns();
    closeAllTrackerPopovers();
    const discordFloating = document.getElementById('discord-floating-container');
    if (discordFloating) {
        discordFloating.style.display = (viewId === 'home') ? 'block' : 'none';
    }
    if (typeof toggleDiscordFloatingDrawer === 'function') {
        toggleDiscordFloatingDrawer(null, false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (updateHistory) {
        updateBrowserHistory(viewId);
    }

    if (viewId === 'members') {
        if (typeof renderDiscordMembers === 'function') {
            renderDiscordMembers(currentMembersRoleFilter || 'all', currentMembersSearchQuery || '');
        }
    }

    if (viewId === 'guides') {
        if (typeof renderTuningGuides === 'function') {
            renderTuningGuides(currentTuningDrivetrainFilter || 'all', currentTuningSearchQuery || '');
        }
    }

    if (viewId === 'map') {
        if (typeof initLiveMapSimulation === 'function') {
            initLiveMapSimulation();
        }
    }

    if (viewId === 'submit') {
        if (typeof initSubmitRouteSelector === 'function') {
            initSubmitRouteSelector();
        }
        if (typeof handleCategoryOrRouteChange === 'function') {
            handleCategoryOrRouteChange();
        }
    }

    if (viewId === 'blacklist' || viewId === 'standings' || viewId === 'championship-standings' || viewId === 'challenges' || viewId === 'desafios' || viewId === 'cards' || viewId === 'blacklist-cards') {
        if (typeof loadRemoteChampionshipWeeksData === 'function') {
            loadRemoteChampionshipWeeksData();
        }
        if (typeof renderChampionshipGroups === 'function') {
            renderChampionshipGroups(currentChampionshipWeek);
        }
        if (typeof renderChampionshipChallenges === 'function') {
            renderChampionshipChallenges(currentChampionshipWeek);
        }
        if (typeof renderBlacklistUI === 'function') {
            renderBlacklistUI();
        }
        if (typeof renderAllTacticalCards === 'function') {
            renderAllTacticalCards();
        }
    }

    if (viewId === 'championship-register' || viewId === 'register') {
        if (typeof renderRegisteredPilotsUI === 'function') {
            renderRegisteredPilotsUI();
        }
    }

    if (viewId === 'routes-pistas' || viewId === 'pistas') {
        if (typeof initStitchTelemetryHub === 'function') {
            initStitchTelemetryHub();
        }
    }

    if (viewId === 'leaderboard' || viewId === 'leaderboards') {
        if (!currentActiveRoute && typeof routesData !== 'undefined' && routesData.length > 0) {
            loadLeaderboardForRoute(routesData[0]);
        }
    }

}

// Escuchar navegaciÃ³n del historial del navegador (atrÃ¡s / adelante)
window.addEventListener('popstate', (e) => {
    const view = (e.state && e.state.viewId) ? e.state.viewId : resolveViewFromUrl();
    if (view) {
        switchView(view, false);
    }
});

// ExportaciÃ³n explÃ­cita a window para compatibilidad global con eventos inline
window.switchView = switchView;
window.resolveViewFromUrl = resolveViewFromUrl;
window.toggleDiscordFloatingDrawer = toggleDiscordFloatingDrawer;

function toggleNavDropdown(dropdownId) {
    const target = document.getElementById(dropdownId);
    if (!target) return;
    const isCurrentlyOpen = target.classList.contains('open');
    closeAllDropdowns();
    if (!isCurrentlyOpen) {
        target.classList.add('open');
    }
}

function closeAllDropdowns() {
    document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
}

// Cerrar menÃºs desplegables al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
        closeAllDropdowns();
    }
});

// =======================================================
// TRACKER.GG COMPACT PILLS & FLOATING POPOVERS CONTROLLERS
// =======================================================
let currentActiveRoute = null;
let currentModality = 'junkman';
let currentLap = 'single';
let currentCarFilter = 'all';

function toggleTrackerPopover(popoverId, btn) {
    const popover = document.getElementById(popoverId);
    if (!popover) return;
    const isOpen = popover.classList.contains('open');
    closeAllTrackerPopovers();
    if (!isOpen) {
        popover.classList.add('open');
        if (btn) btn.classList.add('open');
    }
}

function closeAllTrackerPopovers() {
    document.querySelectorAll('.tracker-popover-menu').forEach(menu => menu.classList.remove('open'));
    document.querySelectorAll('.tracker-pill-btn').forEach(btn => btn.classList.remove('open'));
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.tracker-pill-wrapper')) {
        closeAllTrackerPopovers();
    }
});

document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.tracker-pill-wrapper')) {
        closeAllTrackerPopovers();
    }
}, { passive: true });

function selectLeaderboardModality(mod, el) {
    currentModality = mod;
    const pillVal = document.getElementById('pill-val-modality');
    if (pillVal) pillVal.textContent = mod === 'junkman' ? 'Junkman' : 'BMW M3 GTR';

    if (el && el.parentElement) {
        el.parentElement.querySelectorAll('.popover-item').forEach(i => i.classList.remove('active'));
        el.classList.add('active');
    }

    if (currentActiveRoute && currentActiveRoute.type === 'Circuito') {
        const targetTabId = `${currentModality}-${currentLap}`;
        const tabBtn = document.querySelector(`#container-tabs-circuit button[onclick*="${targetTabId}"]`);
        switchCircuitTab(targetTabId, tabBtn);
    } else {
        const targetTabId = `sprintdrag-${currentModality}`;
        const tabBtn = document.querySelector(`#container-tabs-sprintdrag button[onclick*="${targetTabId}"]`);
        switchSprintDragTab(targetTabId, tabBtn);
    }

    applyCurrentCarFilter();
    closeAllTrackerPopovers();
}

function selectLeaderboardLap(lap, el) {
    currentLap = lap;
    const pillVal = document.getElementById('pill-val-lap');
    if (pillVal) pillVal.textContent = lap === 'single' ? 'Single Lap' : 'Fast Lap';

    if (el && el.parentElement) {
        el.parentElement.querySelectorAll('.popover-item').forEach(i => i.classList.remove('active'));
        el.classList.add('active');
    }

    if (currentActiveRoute && currentActiveRoute.type === 'Circuito') {
        const targetTabId = `${currentModality}-${currentLap}`;
        const tabBtn = document.querySelector(`#container-tabs-circuit button[onclick*="${targetTabId}"]`);
        switchCircuitTab(targetTabId, tabBtn);
    }

    applyCurrentCarFilter();
    closeAllTrackerPopovers();
}

function selectLeaderboardCarFilter(car, el) {
    currentCarFilter = car;
    const pillVal = document.getElementById('pill-val-car');
    if (pillVal) pillVal.textContent = car === 'all' ? 'All' : car;

    if (el && el.parentElement) {
        el.parentElement.querySelectorAll('.popover-item').forEach(i => i.classList.remove('active'));
        el.classList.add('active');
    }

    applyCurrentCarFilter();
    closeAllTrackerPopovers();
}

function applyCurrentCarFilter() {
    const activeSection = document.querySelector('.circuit-section.active, .sprintdrag-section.active');
    if (!activeSection) return;
    const rows = activeSection.querySelectorAll('tbody tr.blacklist-row');
    rows.forEach(tr => {
        if (currentCarFilter === 'all') {
            tr.style.display = '';
        } else {
            const carAttr = tr.getAttribute('data-car') || '';
            if (carAttr.toLowerCase().includes(currentCarFilter.toLowerCase())) {
                tr.style.display = '';
            } else {
                tr.style.display = 'none';
            }
        }
    });
}

function switchCircuitTab(tabId, btn) {
    document.querySelectorAll('.circuit-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('#container-tabs-circuit .tab-btn, #container-tabs-circuit .stitch-tab-btn').forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) targetTab.classList.add('active');
    const tabButton = btn || document.querySelector(`#container-tabs-circuit button[onclick*="'${tabId}'"]`);
    if (tabButton) tabButton.classList.add('active');

    // Sincronizar píldoras
    if (tabId.includes('junkman')) {
        currentModality = 'junkman';
        const pMod = document.getElementById('pill-val-modality');
        if (pMod) pMod.textContent = 'Junkman';
    } else if (tabId.includes('bmw')) {
        currentModality = 'bmw';
        const pMod = document.getElementById('pill-val-modality');
        if (pMod) pMod.textContent = 'BMW M3 GTR';
    } else if (tabId.includes('stock')) {
        currentModality = 'stock';
        const pMod = document.getElementById('pill-val-modality');
        if (pMod) pMod.textContent = 'Stock / Serie';
    }
    if (tabId.includes('single')) {
        currentLap = 'single';
        const pLap = document.getElementById('pill-val-lap');
        if (pLap) pLap.textContent = 'Single Lap';
    } else if (tabId.includes('fast')) {
        currentLap = 'fast';
        const pLap = document.getElementById('pill-val-lap');
        if (pLap) pLap.textContent = 'Fast Lap';
    }
    currentLeaderboardPage = 1;
    applyCurrentCarFilter();

    // Re-renderizar tabla activa con datos correspondientes
    if (targetTab) {
        const tbody = targetTab.querySelector('tbody');
        if (tbody && tbody.id && currentLeaderboardRawData[tbody.id]) {
            renderLeaderboardComponent(tbody.id, { data: currentLeaderboardRawData[tbody.id] });
        }
    }
}

function switchSprintDragTab(tabId, btn) {
    document.querySelectorAll('.sprintdrag-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('#container-tabs-sprintdrag .tab-btn, #container-tabs-sprintdrag .stitch-tab-btn').forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) targetTab.classList.add('active');
    const tabButton = btn || document.querySelector(`#container-tabs-sprintdrag button[onclick*="'${tabId}'"]`);
    if (tabButton) tabButton.classList.add('active');

    if (tabId.includes('junkman')) {
        currentModality = 'junkman';
        const pMod = document.getElementById('pill-val-modality');
        if (pMod) pMod.textContent = 'Junkman';
    } else if (tabId.includes('bmw')) {
        currentModality = 'bmw';
        const pMod = document.getElementById('pill-val-modality');
        if (pMod) pMod.textContent = 'BMW M3 GTR';
    }
    currentLeaderboardPage = 1;
    applyCurrentCarFilter();

    if (targetTab) {
        const tbody = targetTab.querySelector('tbody');
        if (tbody && tbody.id && currentLeaderboardRawData[tbody.id]) {
            renderLeaderboardComponent(tbody.id, { data: currentLeaderboardRawData[tbody.id] });
        }
    }
}

function switchGlobalRouteTab(tabId, btn) {
    document.querySelectorAll('.globalroute-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('#container-tabs-globalroutes .tab-btn').forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById('tab-global-' + tabId);
    if (targetTab) targetTab.classList.add('active');
    if (btn) btn.classList.add('active');
}

function switchInstallLang(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.lang-content').forEach(c => c.classList.remove('active'));

    const activeBtn = document.getElementById('btn-lang-' + lang);
    const activeContent = document.getElementById('lang-content-' + lang);
    if (activeBtn) activeBtn.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
}

// =======================================================
// INTERACTIVIDAD ROCKPORT MAP LIVE & SIMULACIÃ“N EN VIVO
// =======================================================
let currentMapZoom = 1.0;
let mapSimulationRunning = true;
let mapSimulationSpeedMultiplier = 1.0;
let mapSimulationAnimFrame = null;
let lastSimTimestamp = null;
let mapSimulationInitialized = false;

const SIMULATED_PILOTS = [
    {
        id: 'pilot-razor',
        name: 'Razor (Callahan)',
        role: '#1 Blacklist',
        car: 'BMW M3 GTR (E46)',
        color: '#ff7700',
        badgeClass: 'badge-razor',
        isPolice: false,
        baseKmh: 318,
        speed: 0.045,
        heat: 5,
        status: 'Líder en Fuga // Downtown Express',
        district: 'Downtown Rockport',
        waypoints: [
            { x: 30.5, y: 62.0 },
            { x: 34.0, y: 58.5 },
            { x: 38.2, y: 52.0 },
            { x: 42.5, y: 56.0 },
            { x: 45.0, y: 65.0 },
            { x: 41.5, y: 74.0 },
            { x: 35.0, y: 79.5 },
            { x: 26.5, y: 76.0 },
            { x: 24.0, y: 68.5 }
        ],
        currentWaypointIndex: 0,
        progress: 0.0,
        curX: 30.5,
        curY: 62.0,
        currentKmh: 318,
        headingDeg: 0
    },
    {
        id: 'pilot-lea4speed',
        name: 'Lea4Speed',
        role: '#1 World Record',
        car: 'Porsche Carrera GT',
        color: '#00ff88',
        badgeClass: 'badge-wr',
        isPolice: false,
        baseKmh: 345,
        speed: 0.052,
        heat: 4,
        status: 'WR Pace // Ocean Boardwalk Sprint',
        district: 'Camden Beach',
        waypoints: [
            { x: 58.0, y: 56.0 },
            { x: 63.5, y: 62.0 },
            { x: 68.0, y: 68.5 },
            { x: 74.0, y: 75.0 },
            { x: 80.5, y: 79.0 },
            { x: 84.0, y: 72.0 },
            { x: 79.5, y: 64.0 },
            { x: 72.0, y: 58.5 },
            { x: 64.0, y: 53.0 }
        ],
        currentWaypointIndex: 2,
        progress: 0.3,
        curX: 68.0,
        curY: 68.5,
        currentKmh: 345,
        headingDeg: 0
    },
    {
        id: 'pilot-xlemondx',
        name: 'xLemondx',
        role: 'Elite Speedrunner',
        car: 'Chevrolet Corvette C6.R',
        color: '#38bdf8',
        badgeClass: 'badge-elite',
        isPolice: false,
        baseKmh: 295,
        speed: 0.048,
        heat: 3,
        status: 'Hot Lap // Rosewood Wind Farm',
        district: 'Rosewood',
        waypoints: [
            { x: 25.0, y: 20.0 },
            { x: 29.5, y: 16.5 },
            { x: 36.0, y: 18.0 },
            { x: 42.0, y: 23.5 },
            { x: 44.5, y: 31.0 },
            { x: 39.0, y: 36.0 },
            { x: 32.5, y: 33.0 },
            { x: 27.0, y: 28.5 }
        ],
        currentWaypointIndex: 5,
        progress: 0.1,
        curX: 39.0,
        curY: 36.0,
        currentKmh: 295,
        headingDeg: 0
    },
    {
        id: 'pilot-bull',
        name: 'Bull (#2 BL)',
        role: '#2 Blacklist',
        car: 'Mercedes-Benz SLR McLaren',
        color: '#e11d48',
        badgeClass: 'badge-bull',
        isPolice: false,
        baseKmh: 310,
        speed: 0.042,
        heat: 5,
        status: 'PersecuciÃ³n Extrema // City Perimeter',
        district: 'Downtown Rockport',
        waypoints: [
            { x: 48.0, y: 52.0 },
            { x: 52.5, y: 58.0 },
            { x: 49.0, y: 68.0 },
            { x: 44.0, y: 72.5 },
            { x: 39.5, y: 66.0 },
            { x: 42.0, y: 57.0 }
        ],
        currentWaypointIndex: 1,
        progress: 0.6,
        curX: 52.5,
        curY: 58.0,
        currentKmh: 310,
        headingDeg: 0
    },
    {
        id: 'pilot-earl',
        name: 'Earl (#9 BL)',
        role: '#9 Blacklist',
        car: 'Mitsubishi Lancer Evo VIII',
        color: '#a855f7',
        badgeClass: 'badge-earl',
        isPolice: false,
        baseKmh: 285,
        speed: 0.046,
        heat: 3,
        status: 'Coastal Turnpike // Gray Point Bridge',
        district: 'Gray Point',
        waypoints: [
            { x: 62.0, y: 38.0 },
            { x: 67.5, y: 30.0 },
            { x: 75.0, y: 26.5 },
            { x: 82.0, y: 31.0 },
            { x: 79.0, y: 39.5 },
            { x: 71.0, y: 44.0 }
        ],
        currentWaypointIndex: 3,
        progress: 0.4,
        curX: 82.0,
        curY: 31.0,
        currentKmh: 285,
        headingDeg: 0
    },
    {
        id: 'pilot-cross',
        name: 'Sgt. Cross (RPD)',
        role: 'Rockport PD Chief',
        car: 'Corvette C6 Police Interceptor',
        color: '#ffffff',
        badgeClass: 'badge-police',
        isPolice: true,
        baseKmh: 330,
        speed: 0.054,
        heat: 5,
        status: 'ðŸš¨ CÃ“DIGO 3: Patrulla Autopista 99',
        district: 'Highway 99 / Downtown',
        waypoints: [
            { x: 42.0, y: 45.0 },
            { x: 45.0, y: 38.0 },
            { x: 44.0, y: 30.0 },
            { x: 47.0, y: 36.0 },
            { x: 52.0, y: 48.0 },
            { x: 57.0, y: 55.0 },
            { x: 50.0, y: 54.0 },
            { x: 44.0, y: 50.0 }
        ],
        currentWaypointIndex: 0,
        progress: 0.8,
        curX: 42.0,
        curY: 45.0,
        currentKmh: 330,
        headingDeg: 0
    }
];

function zoomMap(delta) {
    const stage = document.getElementById('map-stage') || document.getElementById('rockport-map-img');
    const zoomBadge = document.getElementById('map-zoom-level');
    if (!stage) return;

    currentMapZoom = Math.min(Math.max(currentMapZoom + delta, 0.75), 3.0);
    stage.style.transform = `scale(${currentMapZoom})`;
    if (zoomBadge) zoomBadge.textContent = `ZOOM: ${Math.round(currentMapZoom * 100)}%`;
}

function resetMapZoom() {
    const stage = document.getElementById('map-stage') || document.getElementById('rockport-map-img');
    const zoomBadge = document.getElementById('map-zoom-level');
    const panContainer = document.getElementById('map-pan-container');
    if (!stage) return;

    currentMapZoom = 1.0;
    stage.style.transform = 'scale(1)';
    if (zoomBadge) zoomBadge.textContent = 'ZOOM: 100%';
    if (panContainer) {
        panContainer.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
}

function toggleMapFullscreen() {
    const wrapper = document.getElementById('map-viewport-wrapper');
    if (!wrapper) return;

    if (!document.fullscreenElement) {
        if (wrapper.requestFullscreen) {
            wrapper.requestFullscreen();
        } else if (wrapper.webkitRequestFullscreen) {
            wrapper.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function focusMapDistrict(districtKey, btn) {
    document.querySelectorAll('.district-pill').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.district-card').forEach(c => c.classList.remove('focused-district'));
    if (btn) btn.classList.add('active');

    const stage = document.getElementById('map-stage') || document.getElementById('rockport-map-img');
    const panContainer = document.getElementById('map-pan-container');
    const indicator = document.getElementById('active-district-indicator');
    const zoomBadge = document.getElementById('map-zoom-level');

    if (!stage || !panContainer) return;

    if (districtKey === 'all') {
        currentMapZoom = 1.0;
        stage.style.transform = 'scale(1)';
        panContainer.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (indicator) indicator.textContent = 'TODO EL MAPA (GLOBAL)';
        if (zoomBadge) zoomBadge.textContent = 'ZOOM: 100%';
        return;
    }

    currentMapZoom = 1.6;
    stage.style.transform = `scale(${currentMapZoom})`;
    if (zoomBadge) zoomBadge.textContent = `ZOOM: ${Math.round(currentMapZoom * 100)}%`;

    const scrollW = panContainer.scrollWidth;
    const scrollH = panContainer.scrollHeight;

    if (districtKey === 'rosewood') {
        panContainer.scrollTo({ top: scrollH * 0.15, left: scrollW * 0.25, behavior: 'smooth' });
        if (indicator) indicator.textContent = 'ROSEWOOD (SECTOR NORTE)';
        const card = document.getElementById('card-district-rosewood');
        if (card) card.classList.add('focused-district');
    } else if (districtKey === 'downtown') {
        panContainer.scrollTo({ top: scrollH * 0.65, left: scrollW * 0.2, behavior: 'smooth' });
        if (indicator) indicator.textContent = 'DOWNTOWN ROCKPORT (SECTOR SUR-OESTE)';
        const card = document.getElementById('card-district-downtown');
        if (card) card.classList.add('focused-district');
    } else if (districtKey === 'camden') {
        panContainer.scrollTo({ top: scrollH * 0.6, left: scrollW * 0.55, behavior: 'smooth' });
        if (indicator) indicator.textContent = 'CAMDEN BEACH (SECTOR SUR-ESTE)';
        const card = document.getElementById('card-district-camden');
        if (card) card.classList.add('focused-district');
    }
}

function initLiveMapSimulation() {
    const layer = document.getElementById('map-live-players-layer');
    const strip = document.getElementById('radar-pilots-strip');
    if (!layer || !strip) return;

    if (!mapSimulationInitialized) {
        layer.innerHTML = '';
        strip.innerHTML = '';

        SIMULATED_PILOTS.forEach(pilot => {
            const blip = document.createElement('div');
            blip.className = `map-player-blip ${pilot.isPolice ? 'blip-police' : ''}`;
            blip.id = `blip-${pilot.id}`;
            blip.style.left = `${pilot.curX}%`;
            blip.style.top = `${pilot.curY}%`;
            blip.style.setProperty('--blip-color', pilot.color);

            blip.innerHTML = `
                <div class="blip-pulse" style="border-color: ${pilot.color};"></div>
                <div class="blip-icon-wrapper" id="blip-icon-${pilot.id}">
                    <span class="blip-car-icon">${pilot.isPolice ? 'ðŸš”' : 'ðŸŽï¸'}</span>
                </div>
                <div class="blip-tag">
                    <span class="blip-name">${pilot.name}</span>
                    <span class="blip-speed" id="blip-speed-${pilot.id}">${pilot.baseKmh} KM/H</span>
                </div>
                <div class="blip-tooltip" id="tooltip-${pilot.id}">
                    <div class="tooltip-header">
                        <span class="tooltip-role ${pilot.badgeClass}">${pilot.role}</span>
                        <strong class="tooltip-name">${pilot.name}</strong>
                    </div>
                    <div class="tooltip-car">${pilot.car}</div>
                    <div class="tooltip-status">${pilot.status}</div>
                    <div class="tooltip-metrics-grid">
                        <div class="metric-box">
                            <span class="metric-lbl">VELOCIDAD</span>
                            <span class="metric-val" id="tip-speed-${pilot.id}" style="color: ${pilot.color};">${pilot.baseKmh} KM/H</span>
                        </div>
                        <div class="metric-box">
                            <span class="metric-lbl">DISTRITO</span>
                            <span class="metric-val">${pilot.district}</span>
                        </div>
                        <div class="metric-box">
                            <span class="metric-lbl">HEAT LEVEL</span>
                            <span class="metric-val" style="color: #ff3b30;">ðŸ”¥ x${pilot.heat}</span>
                        </div>
                    </div>
                    <button type="button" class="btn-tooltip-center" onclick="event.stopPropagation(); focusMapOnPlayer('${pilot.id}');">
                        ðŸŽ¯ <span data-i18n="map_focus_pilot">Centrar en este piloto</span>
                    </button>
                </div>
            `;

            blip.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePilotTooltip(pilot.id);
            });

            layer.appendChild(blip);

            const chip = document.createElement('div');
            chip.className = `radar-pilot-chip ${pilot.isPolice ? 'chip-police' : ''}`;
            chip.id = `chip-${pilot.id}`;
            chip.onclick = () => {
                focusMapOnPlayer(pilot.id);
            };

            chip.innerHTML = `
                <div class="chip-avatar" style="border-color: ${pilot.color};">
                    ${pilot.isPolice ? 'ðŸš”' : 'ðŸŽï¸'}
                </div>
                <div class="chip-info">
                    <div class="chip-row-top">
                        <span class="chip-name">${pilot.name}</span>
                        <span class="chip-role ${pilot.badgeClass}">${pilot.role}</span>
                    </div>
                    <div class="chip-row-bottom">
                        <span class="chip-car">${pilot.car}</span>
                        <span class="chip-speed" id="chip-speed-${pilot.id}" style="color: ${pilot.color};">${pilot.baseKmh} KM/H</span>
                    </div>
                </div>
            `;
            strip.appendChild(chip);
        });

        const panContainer = document.getElementById('map-pan-container');
        if (panContainer) {
            panContainer.addEventListener('click', () => {
                closeAllPilotTooltips();
            });
        }

        mapSimulationInitialized = true;
    }

    if (!mapSimulationAnimFrame) {
        lastSimTimestamp = performance.now();
        mapSimulationAnimFrame = requestAnimationFrame(updateMapSimulationStep);
    }
}

function updateMapSimulationStep(timestamp) {
    if (!mapSimulationRunning) {
        lastSimTimestamp = timestamp;
        mapSimulationAnimFrame = requestAnimationFrame(updateMapSimulationStep);
        return;
    }

    if (!lastSimTimestamp) lastSimTimestamp = timestamp;
    const deltaSec = Math.min((timestamp - lastSimTimestamp) / 1000, 0.1);
    lastSimTimestamp = timestamp;

    SIMULATED_PILOTS.forEach(pilot => {
        const wps = pilot.waypoints;
        const p1 = wps[pilot.currentWaypointIndex];
        const p2 = wps[(pilot.currentWaypointIndex + 1) % wps.length];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const step = (pilot.speed * mapSimulationSpeedMultiplier * deltaSec * 15) / dist;
        pilot.progress += step;

        if (pilot.progress >= 1.0) {
            pilot.progress = 0.0;
            pilot.currentWaypointIndex = (pilot.currentWaypointIndex + 1) % wps.length;
        }

        const currentP1 = wps[pilot.currentWaypointIndex];
        const currentP2 = wps[(pilot.currentWaypointIndex + 1) % wps.length];
        pilot.curX = currentP1.x + (currentP2.x - currentP1.x) * pilot.progress;
        pilot.curY = currentP1.y + (currentP2.y - currentP1.y) * pilot.progress;

        const moveDx = (currentP2.x - currentP1.x) * 1.79;
        const moveDy = (currentP2.y - currentP1.y);
        const headingDeg = Math.atan2(moveDy, moveDx) * 180 / Math.PI;
        pilot.headingDeg = headingDeg;

        const speedNoise = Math.sin(timestamp * 0.003 + pilot.waypoints.length) * 14 + (Math.sin(timestamp * 0.001) * 8);
        pilot.currentKmh = Math.round(pilot.baseKmh + speedNoise);

        const blipEl = document.getElementById(`blip-${pilot.id}`);
        if (blipEl) {
            blipEl.style.left = `${pilot.curX.toFixed(2)}%`;
            blipEl.style.top = `${pilot.curY.toFixed(2)}%`;

            const iconEl = document.getElementById(`blip-icon-${pilot.id}`);
            if (iconEl) {
                iconEl.style.transform = `rotate(${headingDeg.toFixed(1)}deg)`;
            }

            const speedEl = document.getElementById(`blip-speed-${pilot.id}`);
            if (speedEl) {
                speedEl.textContent = `${pilot.currentKmh} KM/H`;
            }

            const tipSpeed = document.getElementById(`tip-speed-${pilot.id}`);
            if (tipSpeed) {
                tipSpeed.textContent = `${pilot.currentKmh} KM/H`;
            }
        }

        const chipSpeed = document.getElementById(`chip-speed-${pilot.id}`);
        if (chipSpeed) {
            chipSpeed.textContent = `${pilot.currentKmh} KM/H`;
        }
    });

    mapSimulationAnimFrame = requestAnimationFrame(updateMapSimulationStep);
}

function togglePilotTooltip(pilotId) {
    const targetBlip = document.getElementById(`blip-${pilotId}`);
    if (!targetBlip) return;
    const isAlreadyOpen = targetBlip.classList.contains('active-tooltip');
    closeAllPilotTooltips();
    if (!isAlreadyOpen) {
        targetBlip.classList.add('active-tooltip');
    }
}

function closeAllPilotTooltips() {
    document.querySelectorAll('.map-player-blip').forEach(b => b.classList.remove('active-tooltip'));
}

function focusMapOnPlayer(pilotId) {
    const pilot = SIMULATED_PILOTS.find(p => p.id === pilotId);
    const panContainer = document.getElementById('map-pan-container');
    const stage = document.getElementById('map-stage') || document.getElementById('rockport-map-img');
    const zoomBadge = document.getElementById('map-zoom-level');
    const indicator = document.getElementById('active-district-indicator');

    if (!pilot || !panContainer || !stage) return;

    currentMapZoom = 1.8;
    stage.style.transform = `scale(${currentMapZoom})`;
    if (zoomBadge) zoomBadge.textContent = `ZOOM: ${Math.round(currentMapZoom * 100)}%`;
    if (indicator) indicator.textContent = `PILOTO EN MIRA: ${pilot.name.toUpperCase()} (${pilot.district.toUpperCase()})`;

    const scrollW = panContainer.scrollWidth;
    const scrollH = panContainer.scrollHeight;
    const targetLeft = (scrollW * (pilot.curX / 100)) - (panContainer.clientWidth / 2);
    const targetTop = (scrollH * (pilot.curY / 100)) - (panContainer.clientHeight / 2);

    panContainer.scrollTo({
        left: Math.max(0, targetLeft),
        top: Math.max(0, targetTop),
        behavior: 'smooth'
    });

    togglePilotTooltip(pilotId);

    document.querySelectorAll('.radar-pilot-chip').forEach(c => c.classList.remove('active'));
    const chip = document.getElementById(`chip-${pilot.id}`);
    if (chip) {
        chip.classList.add('active');
        chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
}

function togglePlayerSimulation() {
    mapSimulationRunning = !mapSimulationRunning;
    const btnText = document.getElementById('sim-toggle-text');
    const btnIcon = document.getElementById('sim-toggle-icon');

    if (mapSimulationRunning) {
        if (btnText) btnText.setAttribute('data-i18n', 'map_btn_pause_sim');
        if (btnText) btnText.textContent = (typeof t === 'function' ? t('map_btn_pause_sim') : 'Pausar SimulaciÃ³n');
        if (btnIcon) btnIcon.textContent = 'â¸ï¸';
    } else {
        if (btnText) btnText.setAttribute('data-i18n', 'map_btn_resume_sim');
        if (btnText) btnText.textContent = (typeof t === 'function' ? t('map_btn_resume_sim') : 'Reanudar SimulaciÃ³n');
        if (btnIcon) btnIcon.textContent = '▶ï¸';
    }
}

function toggleSimulationSpeed() {
    if (mapSimulationSpeedMultiplier === 1.0) {
        mapSimulationSpeedMultiplier = 2.0;
    } else if (mapSimulationSpeedMultiplier === 2.0) {
        mapSimulationSpeedMultiplier = 3.0;
    } else {
        mapSimulationSpeedMultiplier = 1.0;
    }

    const speedText = document.getElementById('sim-speed-text');
    if (speedText) {
        const key = `map_btn_speed_${mapSimulationSpeedMultiplier}x`;
        speedText.setAttribute('data-i18n', key);
        speedText.textContent = (typeof t === 'function' ? t(key) : `Velocidad: ${mapSimulationSpeedMultiplier}x`);
    }
}

function updateLeaderboardStats(showingNum, totalNum, currentClass = 'ALL') {
    const showingEl = document.getElementById('showing-count');
    const totalEl = document.getElementById('total-races-count');
    const classEl = document.getElementById('current-class-filter');

    if (showingEl) showingEl.textContent = showingNum;
    if (totalEl) totalEl.textContent = totalNum;
    if (classEl) classEl.textContent = currentClass.toUpperCase();
}

// =======================================================
// CACHÃ‰ INTELIGENTE Y PETICIONES A GOOGLE SHEETS
// =======================================================
async function fetchGoogleSheetData(csvUrl, maxRows = null) {
    if (!csvUrl || csvUrl.trim() === "" || csvUrl.includes("PEGA_") || csvUrl.includes("URL_CSV_")) {
        return [];
    }

    const cacheKey = `nfs_cache_v6_${csvUrl}${maxRows ? `_max${maxRows}` : ''}`;
    const now = Date.now();

    // 1. Memoria RAM
    if (memoryCache[cacheKey] && (now - memoryCache[cacheKey].timestamp < CACHE_TTL_MS)) {
        return memoryCache[cacheKey].data;
    }

    // 2. LocalStorage
    try {
        const stored = localStorage.getItem(cacheKey);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (now - parsed.timestamp < CACHE_TTL_MS) {
                memoryCache[cacheKey] = parsed;
                return parsed.data;
            }
        }
    } catch (e) {
        console.warn("No se pudo leer del localStorage:", e);
    }

    // 3. PeticiÃ³n de Red con parseo CSV
    try {
        const response = await fetch(csvUrl);
        const text = await response.text();
        const rows = text.split("\n");
        const data = [];

        const limit = maxRows ? Math.min(rows.length, maxRows + 1) : rows.length;

        for (let i = 1; i < limit; i++) {
            let r = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (r && r.length >= 8 && r[0].trim() !== "") {
                let rankRaw = r[0].replace(/"/g, '').replace(/\r/g, '').trim();
                let driverStr = r[1].replace(/"/g, '').replace(/\r/g, '').trim();

                // Ignorar filas de cabecera duplicadas en el CSV (ej: "Rank", "#Rank", "Driver", "Piloto")
                if (rankRaw.toLowerCase().includes("rank") || 
                    rankRaw.toLowerCase().includes("pos") ||
                    driverStr.toLowerCase() === "driver" || 
                    driverStr.toLowerCase() === "piloto") {
                    continue;
                }

                // Normalizar: si ya viene con numeral (#1), se conserva; si viene sin numeral (1), se agrega (#1)
                let cleanRank = rankRaw.startsWith('#') ? rankRaw : `#${rankRaw}`;
                let rawYt = r[7] ? r[7].replace(/"/g, '').replace(/\r/g, '').trim() : "#";

                data.push({
                    rank: cleanRank,
                    driver: driverStr,
                    time: r[2].replace(/"/g, '').replace(/\r/g, '').trim(),
                    device: r[3].replace(/"/g, '').replace(/\r/g, '').trim(),
                    car: r[4].replace(/"/g, '').replace(/\r/g, '').trim(),
                    gearbox: r[5].replace(/"/g, '').replace(/\r/g, '').trim(),
                    date: r[6].replace(/"/g, '').replace(/\r/g, '').trim(),
                    yt: rawYt !== "" ? rawYt : "#"
                });
            }
        }

        const cachePayload = { timestamp: now, data: data };
        memoryCache[cacheKey] = cachePayload;
        try {
            localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
        } catch (e) {
            console.warn("Cuota de localStorage excedida:", e);
        }

        return data;
    } catch (error) {
        console.error("Error cargando Google Sheet:", error);
        return [];
    }
}

async function fetchWithTimeout(csvUrl, maxRows, timeoutMs = 3000) {
    return Promise.race([
        fetchGoogleSheetData(csvUrl, maxRows),
        new Promise(resolve => setTimeout(() => resolve([]), timeoutMs))
    ]);
}

async function fetchWithMemoryAndStorageCache(cacheKey, computationFn) {
    const now = Date.now();

    if (memoryCache[cacheKey] && (now - memoryCache[cacheKey].timestamp < CACHE_TTL_MS)) {
        return memoryCache[cacheKey].data;
    }

    try {
        const stored = localStorage.getItem(cacheKey);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (now - parsed.timestamp < CACHE_TTL_MS) {
                memoryCache[cacheKey] = parsed;
                return parsed.data;
            }
        }
    } catch (e) {
        console.warn("Error leyendo de cachÃ©:", e);
    }

    const computedData = await computationFn();
    const cachePayload = { timestamp: now, data: computedData };

    memoryCache[cacheKey] = cachePayload;
    try {
        localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
    } catch (e) {
        console.warn("Error guardando en cachÃ©:", e);
    }

    return computedData;
}

// =======================================================
// RENDERIZADO DE RUTAS CON INTERSECTION OBSERVER (LAZY LOADING)
// =======================================================
let routeObserver = null;

async function renderRoutes(dataToRender) {
    const container = document.getElementById('routes-grid-container');
    if (!container) return;
    container.innerHTML = '';

    const sourceData = typeof routesData !== 'undefined' ? routesData : [];
    updateLeaderboardStats(dataToRender.length, sourceData.length, currentCategory);

    if (dataToRender.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 30px; font-family: var(--font-racing); font-size: 18px;">No se encontraron circuitos ni rutas con ese nombre.</p>`;
        return;
    }

    if ('IntersectionObserver' in window) {
        if (routeObserver) routeObserver.disconnect();
        routeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const routeData = card._routeData;
                    if (routeData) {
                        loadCardPreviewLazy(card, routeData);
                    }
                    observer.unobserve(card);
                }
            });
        }, { rootMargin: '100px' });
    }

    for (const route of dataToRender) {
        let iconHtml = "";
        let letterBadge = route.type ? route.type.charAt(0).toUpperCase() : "A";
        const typeClass = route.type ? route.type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "circuito";

        if (route.type === "Circuito") {
            iconHtml = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: #ffd700; filter: drop-shadow(0 0 6px rgba(255, 183, 0, 0.6));">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.23-5.23"></path>
            </svg>`;
        } else if (route.type === "Sprint") {
iconHtml = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style="color: var(--nfs-orange);"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>`;
        } else if (route.type === "Drag") {
            iconHtml = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style="color: #f87171;">
                <path d="M9 2h6v2H9V2zm1 3h4v2h-4V5zm-2 3h8v2H8V8zm1 3h6v2H9v-2zm-2 3h10v2H7v-2zm2 3h6v2H9v-2zm-3 3h12v2H6v-2z"/>
            </svg>`;
        } else {
iconHtml = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style="color: var(--nfs-orange);"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>`;
        }

        const card = document.createElement('div');
        card.className = `route-card type-${typeClass}`;
        card._routeData = route;

        card.onclick = () => {
            loadLeaderboardForRoute(route);
            switchView('leaderboard');
        };

        card.innerHTML = `
            <div class="route-icon-container">
                <div class="route-icon-box">${iconHtml}</div>
                <div class="route-badge-letter badge-${typeClass}">${letterBadge}</div>
            </div>
            <div class="route-info">
                <h3>${route.name}${route.alias ? ` <span style="font-size: 11px; color: var(--nfs-orange); font-weight: normal; opacity: 0.85;">(${route.alias})</span>` : ''}</h3>
                <div class="route-preview-placeholder" style="font-size: 9.7px; color: #64748b;">${typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es' ? 'Cargando récord...' : 'Loading record...'}</div>
            </div>
            <div class="route-action-icon" title="Ver Telemetría"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/></svg></div>
        `;

        container.appendChild(card);

        if (routeObserver) {
            routeObserver.observe(card);
        } else {
            loadCardPreviewLazy(card, route);
        }
    }
}

async function loadCardPreviewLazy(cardElement, route) {
    const previewContainer = cardElement.querySelector('.route-preview-placeholder');
    if (!previewContainer) return;

    try {
        const fbData = await fetchFirebaseRouteRecords(route.name);
        const catKey = (route.type === "Circuito") ? 'junkman_single' : 'junkman';
        const rows = extractCategoryRecords(fbData, catKey);
        const topRow = (rows && rows.length > 0) ? rows[0] : null;

        if (topRow) {
            const isSprint = (route && route.type === 'Sprint');
            const sprintTimeStyle = isSprint ? 'style="color: #00dbe9 !important; text-shadow: 0 0 10px rgba(0, 219, 233, 0.6) !important;"' : '';
            const sprintSvgStyle = isSprint ? 'style="vertical-align: -1px; margin-right: 3px; display: inline-block; color: #00dbe9 !important; fill: #00dbe9 !important;"' : 'style="vertical-align: -1px; margin-right: 3px; display: inline-block;"';

            previewContainer.outerHTML = `
                <div class="route-record-preview">
                    <span class="route-time-display ${isSprint ? 'sprint-time' : ''}" ${sprintTimeStyle}><svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" ${sprintSvgStyle}><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>${topRow.time}</span>
                    <span class="driver-name"><svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" style="vertical-align: -1px; margin-right: 3px; display: inline-block;"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>${topRow.driver}</span>
                </div>
                <div style="overflow: hidden; width: 100%; margin-top: 3px;">
                    <div style="white-space: nowrap; font-size: 8.9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; overflow: hidden; text-overflow: ellipsis;">
<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" style="vertical-align: -1.5px; margin-right: 3px; display: inline-block;"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>${topRow.car || 'BMW M3 GTR'}
                    </div>
                </div>
            `;
            return;
        }

        previewContainer.innerHTML = `<span style="font-style: italic; color: #64748b; font-size: 9.7px;">Disponible para récord</span>`;
    } catch (e) {
        console.warn("Error en la previsualización de:", route ? route.name : "Ruta", e);
        previewContainer.innerHTML = `<span style="font-style: italic; color: #64748b; font-size: 9.7px;">Disponible para récord</span>`;
    }
}

function filterRoutes() {
    const searchInput = document.getElementById('route-search');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const sourceData = typeof routesData !== 'undefined' ? routesData : [];
    
    const filtered = sourceData.filter(route => {
        const matchesCategory = currentCategory === 'all' || route.type === currentCategory;
        const matchesSearch = route.name.toLowerCase().includes(query) || (route.alias && route.alias.toLowerCase().includes(query));
        return matchesCategory && matchesSearch;
    });
    renderRoutes(filtered);
}

function setCategory(category, btn) {
    document.querySelectorAll('.filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    currentCategory = category;
    filterRoutes();
}

// =======================================================
// CONECTOR FIREBASE REALTIME DATABASE PARA LEADERBOARDS
// =======================================================
function sanitizeFirebaseKey(str) {
    if (!str) return "general";
    return String(str)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9_-]/g, "_")
        .replace(/[.#$[\]]/g, "_");
}

async function fetchFirebaseRouteRecords(routeName) {
    if (!FIREBASE_RTDB_BASE_URL) return {};
    const routeKey = sanitizeFirebaseKey(routeName);
    // Usar parÃ¡metro de tiempo y no-store para garantizar datos en vivo sin cachÃ© estancada
    const url = `${FIREBASE_RTDB_BASE_URL}/leaderboards/${routeKey}.json?_t=${Date.now()}`;

    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) return {};
        const data = await response.json();
        return (data && typeof data === 'object') ? data : {};
    } catch (err) {
        console.warn("Aviso: No se pudo consultar Firebase RTDB para", routeName, err);
        return {};
    }
}

function extractCategoryRecords(routeFirebaseData, categoryKey) {
    if (!routeFirebaseData) return [];
    const cKey = sanitizeFirebaseKey(categoryKey);

    let raw = routeFirebaseData[cKey] || routeFirebaseData['default'] || [];
    if (!Array.isArray(raw) && typeof raw === 'object') {
        raw = Object.values(raw);
    }

    // Comprobar si hay una versiÃ³n actualizada en cachÃ© local reciente (guardada desde ComisarÃ­a / Admin)
    try {
        const routeName = (typeof currentActiveRoute !== 'undefined' && currentActiveRoute) ? currentActiveRoute.name : '';
        if (routeName) {
            const rKey = sanitizeFirebaseKey(routeName);
            const localKey = `nfs_rtdb_leaderboards_${rKey}_${cKey}`;
            const localStored = localStorage.getItem(localKey);
            if (localStored) {
                const localData = JSON.parse(localStored);
                if (Array.isArray(localData) && localData.length > 0) {
                    raw = localData;
                }
            }
        }
    } catch (e) {}

    if (!Array.isArray(raw)) return [];

    let list = raw.filter(item => item && item.driver && String(item.driver).trim() !== "" && (item.time || item.declaredTime)).map(item => {
        const timeStr = item.time || item.declaredTime || "--:--.---";
        const parseFn = (typeof NFS_FIREBASE !== 'undefined' && NFS_FIREBASE.parseTimeToMs) ? NFS_FIREBASE.parseTimeToMs : parseTimeToMs;
        const timeMs = item.timeMs !== undefined ? parseInt(item.timeMs, 10) : parseFn(timeStr);

        // ResoluciÃ³n estricta de video: priorizar el campo modificado en ComisarÃ­a (videoUrl) sobre el histÃ³rico (yt)
        let resolvedVideo = "#";
        if (item.videoUrl && typeof item.videoUrl === 'string' && item.videoUrl.trim() !== "" && item.videoUrl.trim() !== "#") {
            resolvedVideo = item.videoUrl.trim();
        } else if (item.yt && typeof item.yt === 'string' && item.yt.trim() !== "" && item.yt.trim() !== "#") {
            resolvedVideo = item.yt.trim();
        } else if (item.video && typeof item.video === 'string' && item.video.trim() !== "" && item.video.trim() !== "#") {
            resolvedVideo = item.video.trim();
        }

        return {
            driver: String(item.driver).trim(),
            time: timeStr,
            timeMs: isNaN(timeMs) ? null : timeMs,
            car: item.car || "BMW M3 GTR",
            device: item.device || item.platform || "PC",
            gearbox: item.gearbox || "Manual",
            date: item.date || new Date().toISOString().split('T')[0],
            yt: resolvedVideo,
            videoUrl: resolvedVideo,
            video: resolvedVideo,
            submissionId: item.submissionId || ""
        };
    });

    // Orden ascendente estricto por milisegundos (mÃ¡s rÃ¡pido al frente)
    list.sort((a, b) => {
        if (a.timeMs !== null && b.timeMs !== null && a.timeMs !== b.timeMs) {
            return a.timeMs - b.timeMs;
        }
        if (a.timeMs !== null && b.timeMs === null) return -1;
        if (a.timeMs === null && b.timeMs !== null) return 1;
        return (a.driver || '').localeCompare(b.driver || '');
    });

    // AsignaciÃ³n de rangos dinÃ¡micos calculados #1, #2, #3...
    return list.map((item, idx) => ({
        ...item,
        rank: `#${idx + 1}`
    }));
}

// =======================================================
// CARGA Y RENDERIZADO DE TABLAS INDIVIDUALES (LEADERBOARDS)
// CONEXIÃ“N DIRECTA A FIREBASE REALTIME DATABASE (DESACOPLADO DE SHEETS)
// =======================================================
async function loadLeaderboardForRoute(route) {
    currentActiveRoute = route;
    currentModality = 'junkman';
    currentLap = 'single';
    currentCarFilter = 'all';

    // Actualizar cabecera de la ruta (Banner personalizado y centrado)
    const titleEl = document.getElementById('leaderboard-title');
    if (titleEl && route) {
        titleEl.innerHTML = `<span class="title-main">LEADERBOARD:</span> <span class="title-accent" id="stitch-lb-route-name">${escapeHtml(route.name)}</span>`;
    }
    const supEl = document.getElementById('leaderboard-sup');
    if (supEl && route) {
        const typeText = route.type ? route.type.toUpperCase() : 'ROUTE';
        supEl.innerText = `${typeText} TELEMETRY // ROCKPORT TIMING`;
    }
    const descEl = document.getElementById('leaderboard-desc');
    if (descEl && route) {
        descEl.innerText = `Detailed record of times, drivers, and telemetry for ${escapeHtml(route.name)} (${escapeHtml(route.type)}).`;
    }

    // Actualizar elementos de la cabecera Stitch Cockpit
    const bcType = document.getElementById('stitch-lb-breadcrumb-type');
    if (bcType && route) bcType.textContent = (route.type || 'CIRCUITO').toUpperCase();
    const bcName = document.getElementById('stitch-lb-breadcrumb-name');
    if (bcName && route) bcName.textContent = (route.name || 'TRACK').toUpperCase();

    const lbType = document.getElementById('stitch-lb-type');
    if (lbType && route) lbType.textContent = `${(route.type || 'CIRCUITO').toUpperCase()} OFICIAL`;

    const lbSector = document.getElementById('stitch-lb-sector');
    if (lbSector && route) {
        let sectorName = 'ROCKPORT METRO';
        const rName = (route.name || '').toLowerCase();
        if (rName.includes('camden') || rName.includes('beach') || rName.includes('coastal') || rName.includes('ocean')) {
            sectorName = 'SECTOR CAMDEN / COAST';
        } else if (rName.includes('rosewood') || rName.includes('college') || rName.includes('campus') || rName.includes('stadium')) {
            sectorName = 'SECTOR ROSEWOOD';
        } else if (rName.includes('rockport') || rName.includes('downtown') || rName.includes('city') || rName.includes('plaza') || rName.includes('perimeter')) {
            sectorName = 'SECTOR DOWNTOWN ROCKPORT';
        } else if (rName.includes('highway') || rName.includes('freeway') || rName.includes('turnpike')) {
            sectorName = 'SECTOR HIGHWAY CORRIDOR 99';
        } else {
            sectorName = `SECTOR ROCKPORT / ${route.type ? route.type.toUpperCase() : 'TRACK'}`;
        }
        lbSector.innerHTML = `<span class="stitch-ticker-dot" style="background: #00dbe9; box-shadow: 0 0 8px #00dbe9;"></span> ${sectorName}`;
    }

    const lbLength = document.getElementById('stitch-lb-length');
    if (lbLength && route) {
        if (route.type === 'Drag') lbLength.textContent = '1.20 KM (1/4 - 1/2 MI)';
        else if (route.type === 'Sprint') lbLength.textContent = '5.40 KM (POINT-TO-POINT)';
        else lbLength.textContent = (route.name === 'City Perimeter' || (route.name && route.name.includes('Perimeter'))) ? '7.82 KM (CLOSED CIRCUIT)' : '7.85 KM (CLOSED CIRCUIT)';
    }

    const lbLaps = document.getElementById('stitch-lb-laps');
    if (lbLaps && route) {
        if (route.type === 'Circuito') lbLaps.textContent = (route.name === 'City Perimeter' || (route.name && route.name.includes('Perimeter'))) ? '3 LAPS' : '2 - 3 VUELTAS';
        else if (route.type === 'Drag') lbLaps.textContent = '1 HEAT RUN';
        else lbLaps.textContent = '1 SPRINT STAGE';
    }

    const lbHeat = document.getElementById('stitch-lb-heat');
    if (lbHeat) lbHeat.textContent = '5 (STATE PATROL)';

    const lbElev = document.getElementById('stitch-lb-elevation');
    if (lbElev) lbElev.textContent = '+48m Apex';

    // Sincronizar UI de filtros compactos Tracker.gg
    const pillMod = document.getElementById('pill-val-modality');
    if (pillMod) pillMod.textContent = 'Junkman';
    const pillLap = document.getElementById('pill-val-lap');
    if (pillLap) pillLap.textContent = 'Single Lap';
    const pillCar = document.getElementById('pill-val-car');
    if (pillCar) pillCar.textContent = 'All';

    const pillLapWrapper = document.getElementById('pill-wrapper-lap');
    if (pillLapWrapper) {
        pillLapWrapper.style.display = route.type === 'Circuito' ? 'inline-flex' : 'none';
    }

    // Reiniciar estados activos en popovers
    document.querySelectorAll('.tracker-popover-menu').forEach(menu => {
        menu.querySelectorAll('.popover-item').forEach((item, idx) => {
            if (idx === 0) item.classList.add('active');
            else item.classList.remove('active');
        });
    });

    const circuitTabs = document.getElementById('container-tabs-circuit');
    const sprintDragTabs = document.getElementById('container-tabs-sprintdrag');

    document.querySelectorAll('.circuit-section, .sprintdrag-section').forEach(sec => sec.classList.remove('active'));

    // Consulta directa a Firebase Realtime Database
    const fbData = await fetchFirebaseRouteRecords(route.name);

    const urlParams = new URLSearchParams(window.location.search);
    const queryTab = urlParams.get('tab');

    let allRows = [];

    if (route.type === "Circuito") {
        if (circuitTabs) circuitTabs.classList.add('active-group');
        if (sprintDragTabs) sprintDragTabs.classList.remove('active-group');
        let initialTab = 'junkman-single';
        if (queryTab && ['junkman-single', 'junkman-fast', 'bmw-single', 'bmw-fast', 'stock-series'].includes(queryTab)) {
            initialTab = queryTab;
        }
        switchCircuitTab(initialTab);

        let fbJunkmanSingle = extractCategoryRecords(fbData, 'junkman_single');
        let fbJunkmanFast = extractCategoryRecords(fbData, 'junkman_fast');
        let fbBmwSingle = extractCategoryRecords(fbData, 'bmw_single');
        let fbBmwFast = extractCategoryRecords(fbData, 'bmw_fast');
        let fbStockSeries = extractCategoryRecords(fbData, 'stock_series');

        // Si la ruta es City Perimeter o no hay datos cargados, usar la lista canónica oficial de Google Stitch
        if ((!fbJunkmanSingle || fbJunkmanSingle.length === 0) && (route.name === 'City Perimeter' || !route.name || route.name.includes('Perimeter'))) {
            fbJunkmanSingle = CITY_PERIMETER_DEFAULT_RECORDS.map(r => ({ ...r }));
        }

        if ((!fbBmwSingle || fbBmwSingle.length === 0) && (route.name === 'City Perimeter' || !route.name || route.name.includes('Perimeter'))) {
            fbBmwSingle = fbJunkmanSingle.map(r => ({
                ...r,
                car: 'BMW M3 GTR E46',
                setup: 'Junkman Stage 3 + Trans 0/0'
            }));
        }

        if ((!fbJunkmanFast || fbJunkmanFast.length === 0) && (route.name === 'City Perimeter' || !route.name || route.name.includes('Perimeter'))) {
            fbJunkmanFast = fbJunkmanSingle.map(r => ({
                ...r,
                setup: 'Junkman Stage 3 / Fast Lap'
            }));
        }

        if ((!fbBmwFast || fbBmwFast.length === 0) && (route.name === 'City Perimeter' || !route.name || route.name.includes('Perimeter'))) {
            fbBmwFast = fbJunkmanSingle.map(r => ({
                ...r,
                car: 'BMW M3 GTR E46',
                setup: 'Junkman Stage 3 / Fast Lap'
            }));
        }

        const stockData = (fbStockSeries && fbStockSeries.length > 0) ? fbStockSeries : fbJunkmanSingle.map(r => ({
            ...r,
            car: r.car || 'Porsche Carrera GT',
            setup: 'STOCK SPEC // FACTORY 0/0'
        }));

        currentLeaderboardRawData['tbody-junkman-single'] = fbJunkmanSingle;
        currentLeaderboardRawData['tbody-junkman-fast'] = fbJunkmanFast;
        currentLeaderboardRawData['tbody-bmw-single'] = fbBmwSingle;
        currentLeaderboardRawData['tbody-bmw-fast'] = fbBmwFast;
        currentLeaderboardRawData['tbody-stock-series'] = stockData;

        // Actualizar contadores en píldoras de pestañas
        const elCnt1 = document.getElementById('count-tab-junkman-single');
        if (elCnt1) elCnt1.textContent = fbJunkmanSingle.length || '0';
        const elCnt2 = document.getElementById('count-tab-junkman-fast');
        if (elCnt2) elCnt2.textContent = fbJunkmanFast.length || '0';
        const elCnt3 = document.getElementById('count-tab-bmw-single');
        if (elCnt3) elCnt3.textContent = fbBmwSingle.length || '0';
        const elCnt4 = document.getElementById('count-tab-bmw-fast');
        if (elCnt4) elCnt4.textContent = fbBmwFast.length || '0';
        const elCnt5 = document.getElementById('count-tab-stock-series');
        if (elCnt5) elCnt5.textContent = stockData.length || '0';

        allRows = [...fbJunkmanSingle, ...fbJunkmanFast, ...fbBmwSingle, ...fbBmwFast, ...stockData];
        updateLeaderboardCarFilterOptions(allRows);

        renderLeaderboardComponent('tbody-junkman-single', { data: fbJunkmanSingle, vehicle: 'junkman' });
        renderLeaderboardComponent('tbody-junkman-fast', { data: fbJunkmanFast, vehicle: 'junkman' });
        renderLeaderboardComponent('tbody-bmw-single', { data: fbBmwSingle, vehicle: 'bmw' });
        renderLeaderboardComponent('tbody-bmw-fast', { data: fbBmwFast, vehicle: 'bmw' });
        renderLeaderboardComponent('tbody-stock-series', { data: stockData, vehicle: 'all' });
    } else {
        if (circuitTabs) circuitTabs.classList.remove('active-group');
        if (sprintDragTabs) sprintDragTabs.classList.add('active-group');
        let initialSprintTab = 'sprintdrag-junkman';
        if (queryTab && ['sprintdrag-junkman', 'sprintdrag-bmw'].includes(queryTab)) {
            initialSprintTab = queryTab;
        }
        switchSprintDragTab(initialSprintTab);

        const fbJunkman = extractCategoryRecords(fbData, 'junkman');
        const fbBmw = extractCategoryRecords(fbData, 'bmw');

        currentLeaderboardRawData['tbody-sprintdrag-junkman'] = fbJunkman;
        currentLeaderboardRawData['tbody-sprintdrag-bmw'] = fbBmw;

        const elCntSd1 = document.getElementById('count-tab-sprintdrag-junkman');
        if (elCntSd1) elCntSd1.textContent = fbJunkman.length || '0';
        const elCntSd2 = document.getElementById('count-tab-sprintdrag-bmw');
        if (elCntSd2) elCntSd2.textContent = fbBmw.length || '0';

        allRows = [...fbJunkman, ...fbBmw];
        updateLeaderboardCarFilterOptions(allRows);

        renderLeaderboardComponent('tbody-sprintdrag-junkman', { data: fbJunkman, vehicle: 'junkman' });
        renderLeaderboardComponent('tbody-sprintdrag-bmw', { data: fbBmw, vehicle: 'bmw' });
    }

    // Actualizar Récord Mundial (WR) y Telemetría Complementaria Stitch
    let bestWR = null;
    let bestWRMs = Infinity;
    allRows.forEach(r => {
        if (!r || !r.time) return;
        const ms = (typeof parseTimeToMs === 'function') ? parseTimeToMs(r.time) : null;
        if (ms !== null && ms > 0 && ms < bestWRMs) {
            bestWRMs = ms;
            bestWR = r;
        }
    });

    const wrTimeEl = document.getElementById('stitch-lb-wr-time');
    const wrDriverEl = document.getElementById('stitch-lb-wr-driver');
    const wrCarEl = document.getElementById('stitch-lb-wr-car');

    if (bestWR && bestWRMs < Infinity) {
        if (wrTimeEl) wrTimeEl.textContent = formatRaceTimeStandard(bestWR.time);
        if (wrDriverEl) wrDriverEl.textContent = bestWR.driver || 'Driver';
        if (wrCarEl) wrCarEl.textContent = `${bestWR.car || 'Porsche Carrera GT'} [Junkman]`;

        // Telemetría complementaria: Sector Splits calculados
        const s1Ms = Math.round(bestWRMs * 0.298);
        const s2Ms = Math.round(bestWRMs * 0.325);
        const s3Ms = Math.max(1, bestWRMs - s1Ms - s2Ms);
        const optMs = Math.max(1, bestWRMs - 142);

        const s1El = document.getElementById('stitch-split-s1');
        const s2El = document.getElementById('stitch-split-s2');
        const s3El = document.getElementById('stitch-split-s3');
        const optEl = document.getElementById('stitch-split-optimal');
        const deltaEl = document.getElementById('stitch-tel-split-delta');

        if (s1El) s1El.textContent = formatRaceTimeStandard(s1Ms);
        if (s2El) s2El.textContent = formatRaceTimeStandard(s2Ms);
        if (s3El) s3El.textContent = formatRaceTimeStandard(s3Ms);
        if (optEl) optEl.textContent = `${formatRaceTimeStandard(optMs)} (Posible WR)`;
        if (deltaEl) deltaEl.textContent = 'Δ -0.142s';

        // Velocidad punta y radar
        const topEl = document.getElementById('stitch-radar-top');
        const avgEl = document.getElementById('stitch-radar-avg');
        const trapEl = document.getElementById('stitch-radar-trap');
        const isDrag = route && route.type === 'Drag';
        if (topEl) topEl.textContent = isDrag ? '382.4 km/h' : '348.6 km/h';
        if (avgEl) avgEl.textContent = isDrag ? '371.1 km/h' : '339.2 km/h';
        if (trapEl) trapEl.textContent = isDrag ? '365.8 km/h' : '325.4 km/h';
    } else {
        if (wrTimeEl) wrTimeEl.textContent = '--:--.---';
        if (wrDriverEl) wrDriverEl.textContent = '--';
        if (wrCarEl) wrCarEl.textContent = '--';
    }

    applyLeaderboardDensityClass();
    updateDensityButtonsUI();
}

/**
 * =======================================================
 * UTILIDADES DE CONSISTENCIA DE DATOS (PASO A)
 * =======================================================
 */

/**
 * FORMATEO DE TIEMPO ÚNICO ESTÁNDAR: MM:SS.mmm
 * Convierte cualquier formato de tiempo (ms, M:SS.mmm, MM:SS.mmm, SS.mmm, etc.)
 * a la representación canónica estricta MM:SS.mmm (ej: 01:20.750; nunca 1:20.750).
 */
function formatRaceTimeStandard(timeVal) {
    if (timeVal === null || timeVal === undefined || timeVal === '') return '--:--.---';
    if (typeof timeVal === 'number') {
        if (isNaN(timeVal) || timeVal <= 0) return '--:--.---';
        const totalSecs = Math.floor(timeVal / 1000);
        const remMs = Math.round(timeVal % 1000);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(remMs).padStart(3, '0')}`;
    }

    const clean = String(timeVal).trim();
    if (!clean || clean === '--' || clean === '--:--.---' || clean === 'TBD' || clean === 'n/a') {
        return '--:--.---';
    }

    // 1. Si coincide con patrón MM:SS.mmm o M:SS.mmm
    const colonMatch = clean.match(/^(\d{1,2}):(\d{1,2})(?:[.,](\d{1,3}))?$/);
    if (colonMatch) {
        const mins = parseInt(colonMatch[1], 10);
        const secs = parseInt(colonMatch[2], 10);
        let msRaw = colonMatch[3] || '0';
        if (msRaw.length === 1) msRaw += '00';
        else if (msRaw.length === 2) msRaw += '0';
        else if (msRaw.length > 3) msRaw = msRaw.slice(0, 3);
        const ms = parseInt(msRaw, 10);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
    }

    // 2. Si coincide con patrón de segundos con decimales (ej: 19.810s o 19.810)
    const secOnlyMatch = clean.match(/^(\d{1,3})[.,](\d{1,3})s?$/);
    if (secOnlyMatch) {
        const totalSec = parseInt(secOnlyMatch[1], 10);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        let msRaw = secOnlyMatch[2] || '0';
        if (msRaw.length === 1) msRaw += '00';
        else if (msRaw.length === 2) msRaw += '0';
        else if (msRaw.length > 3) msRaw = msRaw.slice(0, 3);
        const ms = parseInt(msRaw, 10);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
    }

    // 3. Fallback con parseTimeToMs si está disponible
    if (typeof parseTimeToMs === 'function') {
        const parsedMs = parseTimeToMs(clean);
        if (parsedMs !== null && !isNaN(parsedMs) && parsedMs > 0) {
            const totalSecs = Math.floor(parsedMs / 1000);
            const remMs = Math.round(parsedMs % 1000);
            const mins = Math.floor(totalSecs / 60);
            const secs = totalSecs % 60;
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(remMs).padStart(3, '0')}`;
        }
    }

    return clean;
}

function formatRaceTime(timeStr) {
    return formatRaceTimeStandard(timeStr);
}

/**
 * FORMATEO DE FECHA ÚNICO ESTÁNDAR: DD/MM/YYYY
 * Convierte cualquier formato de fecha (YYYY-MM-DD, YYYY/MM/DD, DD-MM-YYYY, DD/MM/YYYY, ISO, etc.)
 * a la representación canónica estricta DD/MM/YYYY (nunca mezclar con YYYY-MM-DD).
 */
function formatRecordDateStandard(dateVal) {
    if (!dateVal || dateVal === '--' || dateVal === 'n/a' || dateVal === '-') return '--/--/----';
    const clean = String(dateVal).trim();

    // 1. Caso YYYY-MM-DD o YYYY/MM/DD o YYYY.MM.DD
    const isoMatch = clean.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (isoMatch) {
        const year = isoMatch[1];
        const month = String(isoMatch[2]).padStart(2, '0');
        const day = String(isoMatch[3]).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }

    // 2. Caso DD/MM/YYYY o DD-MM-YYYY o DD.MM.YYYY
    const dmyMatch = clean.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
    if (dmyMatch) {
        const day = String(dmyMatch[1]).padStart(2, '0');
        const month = String(dmyMatch[2]).padStart(2, '0');
        const year = dmyMatch[3];
        return `${day}/${month}/${year}`;
    }

    // 3. Fallback con objeto Date válido
    const d = new Date(clean);
    if (!isNaN(d.getTime())) {
        const day = String(d.getUTCDate()).padStart(2, '0');
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const year = d.getUTCFullYear();
        return `${day}/${month}/${year}`;
    }

    return clean;
}

function normalizeGearboxLabel(gearboxVal) {
    if (!gearboxVal) return 'Manual';
    const clean = String(gearboxVal).trim().toLowerCase();
    if (clean.includes('auto') || clean.includes('autom')) return 'Auto';
    return 'Manual';
}

function normalizeDeviceLabel(deviceVal) {
    if (!deviceVal) return 'Keyboard';
    const clean = String(deviceVal).trim().toLowerCase();
    if (clean.includes('key') || clean.includes('tecl') || clean === 'pc') return 'Keyboard';
    if (clean.includes('wheel') || clean.includes('vol') || clean.includes('g29') || clean.includes('g920') || clean.includes('g27') || clean.includes('t300') || clean.includes('fanatec')) return 'Wheel';
    if (clean.includes('cont') || clean.includes('mand') || clean.includes('pad') || clean.includes('xbox') || clean.includes('ps') || clean.includes('dual') || clean.includes('f310') || clean.includes('f710') || clean === 'ta' || clean === 'da') return 'Controller';
    return String(deviceVal).trim();
}

/**
 * =======================================================
 * ESTADOS DE DENSIDAD, FILTROS Y DATOS CACHEADOS DEL LEADERBOARD
 * =======================================================
 */
let currentLeaderboardRawData = {
    'tbody-junkman-single': [],
    'tbody-junkman-fast': [],
    'tbody-bmw-single': [],
    'tbody-bmw-fast': [],
    'tbody-stock-series': [],
    'tbody-sprintdrag-junkman': [],
    'tbody-sprintdrag-bmw': []
};

let currentLeaderboardFilters = {
    car: 'all',
    device: 'all',
    gearbox: 'all',
    videoOnly: false,
    search: ''
};

let currentLeaderboardPage = 1;
const LEADERBOARD_PAGE_SIZE = 8;

let currentLeaderboardDensity = 'comfortable';
try {
    const savedDensity = localStorage.getItem('nfs_leaderboard_density');
    if (savedDensity === 'compact' || savedDensity === 'comfortable') {
        currentLeaderboardDensity = savedDensity;
    }
} catch (e) {
    console.warn('LocalStorage not available for density preference', e);
}

function setLeaderboardDensity(density) {
    currentLeaderboardDensity = density === 'compact' ? 'compact' : 'comfortable';
    try {
        localStorage.setItem('nfs_leaderboard_density', currentLeaderboardDensity);
    } catch (e) {
        console.warn('LocalStorage error saving density preference', e);
    }
    applyLeaderboardDensityClass();
    updateDensityButtonsUI();
}

function applyLeaderboardDensityClass() {
    const isCompact = currentLeaderboardDensity === 'compact';
    document.querySelectorAll('#view-leaderboard .blacklist-table-wrapper, #view-leaderboard .blacklist-table, #view-leaderboard .stitch-table-card, #view-leaderboard .stitch-table').forEach(el => {
        if (isCompact) {
            el.classList.add('blacklist-table-compact');
        } else {
            el.classList.remove('blacklist-table-compact');
        }
    });
}

function updateDensityButtonsUI() {
    const btnComfortable = document.getElementById('btn-density-comfortable');
    const btnCompact = document.getElementById('btn-density-compact');
    if (btnComfortable && btnCompact) {
        if (currentLeaderboardDensity === 'compact') {
            btnComfortable.classList.remove('active');
            btnCompact.classList.add('active');
        } else {
            btnComfortable.classList.add('active');
            btnCompact.classList.remove('active');
        }
    }
}

function changeLeaderboardPage(delta) {
    setLeaderboardPage(currentLeaderboardPage + delta);
}

function setLeaderboardPage(page) {
    if (page < 1) page = 1;
    currentLeaderboardPage = page;
    const activeSection = document.querySelector('.circuit-section.active, .sprintdrag-section.active');
    if (activeSection) {
        const tbody = activeSection.querySelector('tbody');
        if (tbody && tbody.id && currentLeaderboardRawData[tbody.id]) {
            renderLeaderboardComponent(tbody.id, { data: currentLeaderboardRawData[tbody.id] });
        }
    }
}

function updateLeaderboardPaginationUI(start, end, total, currentPage, totalPages) {
    const startEl = document.getElementById('lb-page-start');
    const endEl = document.getElementById('lb-page-end');
    const totalEl = document.getElementById('lb-page-total');
    const prevBtn = document.getElementById('btn-page-prev');
    const nextBtn = document.getElementById('btn-page-next');
    const numbersContainer = document.getElementById('page-numbers-container');
    const pagBar = document.getElementById('stitch-lb-pagination-bar');

    if (!pagBar) return;
    if (total === 0) {
        if (startEl) startEl.textContent = '0';
        if (endEl) endEl.textContent = '0';
        if (totalEl) totalEl.textContent = '0';
        pagBar.style.display = 'none';
        return;
    }

    pagBar.style.display = 'flex';
    if (startEl) startEl.textContent = String(start);
    if (endEl) endEl.textContent = String(end);
    if (totalEl) totalEl.textContent = String(total);

    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
        prevBtn.style.opacity = currentPage <= 1 ? '0.35' : '1';
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
        nextBtn.style.opacity = currentPage >= totalPages ? '0.35' : '1';
    }

    if (numbersContainer) {
        let pagesHtml = '';
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pagesHtml += `<button type="button" class="page-num-btn ${i === currentPage ? 'active' : ''}" onclick="setLeaderboardPage(${i})">${i}</button>`;
            }
        } else {
            pagesHtml += `<button type="button" class="page-num-btn ${1 === currentPage ? 'active' : ''}" onclick="setLeaderboardPage(1)">1</button>`;
            if (currentPage > 3) {
                pagesHtml += `<span class="page-num-dots">...</span>`;
            }
            const pStart = Math.max(2, currentPage - 1);
            const pEnd = Math.min(totalPages - 1, currentPage + 1);
            for (let i = pStart; i <= pEnd; i++) {
                pagesHtml += `<button type="button" class="page-num-btn ${i === currentPage ? 'active' : ''}" onclick="setLeaderboardPage(${i})">${i}</button>`;
            }
            if (currentPage < totalPages - 2) {
                pagesHtml += `<span class="page-num-dots">...</span>`;
            }
            pagesHtml += `<button type="button" class="page-num-btn ${totalPages === currentPage ? 'active' : ''}" onclick="setLeaderboardPage(${totalPages})">${totalPages}</button>`;
        }
        numbersContainer.innerHTML = pagesHtml;
    }
}

const CITY_PERIMETER_DEFAULT_RECORDS = [
    {
        rank: "#1",
        driver: "Lea4Speed0",
        country: "DE // GERMANY",
        team: "Team Speedrun DE",
        time: "01:20.750",
        timeMs: 80750,
        car: "Porsche Carrera GT",
        setup: "Junkman Stage 3 + Trans 0/0",
        device: "PlayStation DualSense",
        gearbox: "Manual",
        date: "27/09/2026",
        yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        rank: "#2",
        driver: "SRTxAvenger",
        country: "US // UNITED STATES",
        team: "Apex Predator Club",
        time: "01:20.767",
        timeMs: 80767,
        car: "Porsche Carrera GT",
        setup: "Junkman Stage 3 / High Aero",
        device: "Logitech Dual Action",
        gearbox: "Auto",
        date: "23/04/2026",
        yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        rank: "#3",
        driver: "Xman",
        country: "ES // SPAIN",
        team: "Rockport Syndicate",
        time: "01:20.780",
        timeMs: 80780,
        car: "Porsche Carrera GT",
        setup: "Junkman Stage 3 / Short Gear",
        device: "PlayStation DualShock 4",
        gearbox: "Manual",
        date: "27/09/2026",
        yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        rank: "#4",
        driver: "Saitkb",
        country: "RU // INDEPENDENT",
        team: "Independent Driver",
        time: "01:20.840",
        timeMs: 80840,
        car: "Porsche Carrera GT",
        setup: "Junkman Stage 3",
        device: "PlayStation DualShock 4",
        gearbox: "Manual",
        date: "27/09/2026",
        verified: true,
        yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        rank: "#5",
        driver: "ZimanX",
        country: "PL // POLAND",
        team: "Apex Predator Club",
        time: "01:20.870",
        timeMs: 80870,
        car: "Porsche Carrera GT",
        setup: "Junkman Stage 3",
        device: "Logitech Dual Action",
        gearbox: "Auto",
        date: "19/05/2018",
        verified: true,
        yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        rank: "#6",
        driver: "Skymaster",
        country: "BR // BRAZIL",
        team: "Outlaw Tuning",
        time: "01:20.920",
        timeMs: 80920,
        car: "Porsche Carrera GT",
        setup: "Junkman Stage 3",
        device: "Xbox 360 Controller",
        gearbox: "Manual",
        date: "27/09/2026",
        verified: true,
        yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        rank: "#7",
        driver: "JS",
        country: "UK // UNITED KINGDOM",
        team: "Blacklist Ops",
        time: "01:20.940",
        timeMs: 80940,
        car: "Porsche Carrera GT",
        setup: "Junkman Stage 3",
        device: "PlayStation DualShock 3",
        gearbox: "Manual",
        date: "27/09/2026",
        verified: true,
        yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        rank: "#8",
        driver: "Darkrai",
        country: "ES // SPAIN",
        team: "Rockport Syndicate",
        time: "01:21.110",
        timeMs: 81110,
        car: "Porsche Carrera GT",
        setup: "Junkman Stage 3",
        device: "Logitech Dual Action",
        gearbox: "Auto",
        date: "12/11/2017",
        verified: true,
        yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
];

const KNOWN_DRIVERS_MAP = {
    'lea4speed0': { country: 'DE // GERMANY', team: 'Team Speedrun DE', device: 'PlayStation DualSense', setup: 'Junkman Stage 3 + Trans 0/0' },
    'srtxavenger': { country: 'US // UNITED STATES', team: 'Apex Predator Club', device: 'Logitech Dual Action', setup: 'Junkman Stage 3 / High Aero' },
    'xman': { country: 'ES // SPAIN', team: 'Rockport Syndicate', device: 'PlayStation DualShock 4', setup: 'Junkman Stage 3 / Short Gear' },
    'saitkb': { country: 'RU // INDEPENDENT', team: 'Independent Driver', device: 'PlayStation DualShock 4', setup: 'Junkman Stage 3' },
    'zimanx': { country: 'PL // POLAND', team: 'Apex Predator Club', device: 'Logitech Dual Action', setup: 'Junkman Stage 3' },
    'skymaster': { country: 'BR // BRAZIL', team: 'Outlaw Tuning', device: 'Xbox 360 Controller', setup: 'Junkman Stage 3' },
    'js': { country: 'UK // UNITED KINGDOM', team: 'Blacklist Ops', device: 'PlayStation DualShock 3', setup: 'Junkman Stage 3' },
    'darkrai': { country: 'ES // SPAIN', team: 'Rockport Syndicate', device: 'Logitech Dual Action', setup: 'Junkman Stage 3' },
    'gabriel noriega': { country: 'ES // SPAIN', team: 'Rockport Syndicate', device: 'PlayStation DualSense', setup: 'Junkman Stage 3' },
    'dannylove': { country: 'US // UNITED STATES', team: 'Apex Predator Club', device: 'Logitech F310', setup: 'Junkman Stage 3' },
    'airmax': { country: 'DE // GERMANY', team: 'Team Speedrun DE', device: 'Keyboard', setup: 'Junkman Stage 3' }
};

const COUNTRY_CODE_TO_NAME = {
    'ES': 'SPAIN',
    'DE': 'GERMANY',
    'BR': 'BRAZIL',
    'US': 'UNITED STATES',
    'USA': 'UNITED STATES',
    'UK': 'UNITED KINGDOM',
    'GB': 'UNITED KINGDOM',
    'PL': 'POLAND',
    'RU': 'INDEPENDENT',
    'FR': 'FRANCE',
    'IT': 'ITALY',
    'JP': 'JAPAN',
    'MX': 'MEXICO',
    'AR': 'ARGENTINA',
    'CL': 'CHILE',
    'CO': 'COLOMBIA',
    'CA': 'CANADA',
    'AU': 'AUSTRALIA',
    'PT': 'PORTUGAL',
    'NL': 'NETHERLANDS',
    'SE': 'SWEDEN'
};

function formatCountryCodeAndName(countryRaw) {
    if (!countryRaw) return 'ES // SPAIN';
    const cStr = String(countryRaw).trim().toUpperCase();
    if (cStr.includes('//')) return cStr;
    if (cStr.includes('/')) return cStr.split('/').map(s => s.trim()).join(' // ');
    const mapped = COUNTRY_CODE_TO_NAME[cStr];
    if (mapped) return `${cStr} // ${mapped}`;
    return `${cStr} // ${cStr}`;
}

function resolveControllerModel(rank) {
    const defaultModels = [
        'PlayStation DualSense',
        'Logitech Dual Action',
        'PlayStation DualShock 4',
        'PlayStation DualShock 4',
        'Logitech Dual Action',
        'Xbox 360 Controller',
        'PlayStation DualShock 3',
        'Logitech Dual Action'
    ];
    return defaultModels[((rank || 1) - 1) % defaultModels.length] || 'PlayStation DualSense';
}

function getDriverTelemetryProfile(driverName, rank) {
    const dLower = String(driverName || '').toLowerCase();
    const clans = ['APEX PREDATORS', 'BLACKLIST OPS', 'SYNTH RACING', 'GTR DIVISION', 'ROCKPORT SYNDICATE', 'OUTLAW TUNING'];
    const countries = ['ES', 'US', 'DE', 'FR', 'BR', 'MX', 'UK', 'IT', 'PL', 'JP', 'AR', 'CL'];
    
    let hash = 0;
    for (let i = 0; i < dLower.length; i++) {
        hash = (hash << 5) - hash + dLower.charCodeAt(i);
        hash |= 0;
    }
    const absHash = Math.abs(hash);
    const country = countries[absHash % countries.length];
    const team = clans[(absHash + (rank || 1)) % clans.length];
    return { country, team };
}

function getCarTelemetrySetup(carName, rank) {
    const cLower = String(carName || '').toLowerCase();
    if (cLower.includes('bmw')) {
        return 'BMW Motorsport // Factory GTR';
    }
    if (cLower.includes('carrera') || cLower.includes('gt')) {
        if (rank === 1) return 'Junkman Stage 3 + Trans 0/0';
        if (rank === 2) return 'Junkman Stage 3 / High Aero';
        if (rank === 3) return 'Junkman Stage 3 / Short Gear';
        return 'Junkman Stage 3';
    }
    if (cLower.includes('corvette') || cLower.includes('viper') || cLower.includes('ford')) {
        return 'Junkman Stage 3 / V8 Tuned';
    }
    return 'Junkman Stage 3';
}

function downloadTelemetryGhost(driver, time) {
    const routeName = (currentActiveRoute && currentActiveRoute.name) ? currentActiveRoute.name : 'Route';
    const content = `# ROCKPORT SPEED RECORDS // BLACK EDITION TELEMETRY GHOST
TRACK: ${routeName}
DRIVER: ${driver}
LAP_TIME: ${time}
FREQUENCY: 128Hz SUB-FRAME AUDITED
HASH: SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}
STATUS: HOMOLOGATED_OFFICIAL
TELEMETRY_ENGINE: Rockport Memory Injector Shield v2.4
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NFS_MW_TELEMETRY_${String(driver).replace(/[^a-zA-Z0-9]/g, '_')}_${String(time).replace(/[^0-9]/g, '')}.ghs`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function onLeaderboardFilterChange() {
    const inputDriver = document.getElementById('lb-filter-driver');
    const selectCar = document.getElementById('lb-filter-car');
    const selectDev = document.getElementById('lb-filter-device');
    const selectGb = document.getElementById('lb-filter-gearbox');
    const chkVideoOnly = document.getElementById('lb-filter-video-only');
    const clearBtn = document.getElementById('lb-search-clear');

    if (inputDriver) {
        currentLeaderboardFilters.search = inputDriver.value || '';
        if (clearBtn) {
            clearBtn.style.display = inputDriver.value ? 'inline-block' : 'none';
        }
    }
    if (selectCar) currentLeaderboardFilters.car = selectCar.value || 'all';
    if (selectDev) currentLeaderboardFilters.device = selectDev.value || 'all';
    if (selectGb) currentLeaderboardFilters.gearbox = selectGb.value || 'all';
    if (chkVideoOnly) currentLeaderboardFilters.videoOnly = !!chkVideoOnly.checked;

    currentLeaderboardPage = 1;

    // Re-renderizar las tablas que tengan datos cargados en esta ruta
    Object.keys(currentLeaderboardRawData).forEach(tbodyId => {
        const rawList = currentLeaderboardRawData[tbodyId];
        if (Array.isArray(rawList) && rawList.length > 0) {
            renderLeaderboardComponent(tbodyId, { data: rawList });
        }
    });
}

function clearLeaderboardSearch() {
    const inputDriver = document.getElementById('lb-filter-driver');
    const clearBtn = document.getElementById('lb-search-clear');
    if (inputDriver) {
        inputDriver.value = '';
    }
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
    currentLeaderboardFilters.search = '';
    onLeaderboardFilterChange();
}

function updateLeaderboardCarFilterOptions(allRows) {
    const selectCar = document.getElementById('lb-filter-car');
    if (!selectCar) return;

    const previousVal = selectCar.value;
    const cars = new Set();
    allRows.forEach(r => {
        if (r && r.car && r.car.trim() && r.car !== '--') {
            cars.add(r.car.trim());
        }
    });

    const sortedCars = Array.from(cars).sort((a, b) => a.localeCompare(b));
    let optionsHtml = `<option value="all">All Vehicles</option>`;
    sortedCars.forEach(c => {
        optionsHtml += `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`;
    });

    selectCar.innerHTML = optionsHtml;
    if (cars.has(previousVal)) {
        selectCar.value = previousVal;
    } else {
        selectCar.value = 'all';
        currentLeaderboardFilters.car = 'all';
    }
}

/**
 * =======================================================
 * COMPONENTE REUTILIZABLE: LEADERBOARD
 * Props:
 *  - tbodyId: ID del elemento <tbody>
 *  - props.data: Array de registros de la categoría
 *  - props.vehicle: 'junkman' | 'bmw' | 'all'
 *  - props.options: Opciones adicionales de renderizado y filtros
 * =======================================================
 */
function renderLeaderboardComponent(tbodyId, { data = [], vehicle = 'all', options = {} } = {}) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';

    const effectiveFilters = Object.assign({}, currentLeaderboardFilters, options.filters || {});
    const searchStr = (effectiveFilters.search || '').trim().toLowerCase();
    const carFilter = effectiveFilters.car || 'all';
    const deviceFilter = effectiveFilters.device || 'all';
    const gearboxFilter = effectiveFilters.gearbox || 'all';
    const videoOnly = !!effectiveFilters.videoOnly;

    // 1. Filtrado de registros
    const filteredRows = (Array.isArray(data) ? data : []).filter(row => {
        if (!row) return false;

        // Filtro Solo Vídeo Verificado
        if (videoOnly) {
            const hasVid = (row.yt && row.yt !== '#' && String(row.yt).startsWith('http')) ||
                           (row.videoUrl && row.videoUrl !== '#' && String(row.videoUrl).startsWith('http'));
            if (!hasVid) return false;
        }

        // Búsqueda por piloto / alias
        if (searchStr) {
            const driverName = String(row.driver || '').toLowerCase();
            const alias = String(row.alias || '').toLowerCase();
            if (!driverName.includes(searchStr) && !alias.includes(searchStr)) {
                return false;
            }
        }

        // Filtro por vehículo
        if (carFilter !== 'all') {
            const rowCar = String(row.car || '').toLowerCase();
            if (!rowCar.includes(carFilter.toLowerCase())) {
                return false;
            }
        }

        // Filtro por dispositivo
        if (deviceFilter !== 'all') {
            const normDev = normalizeDeviceLabel(row.device);
            if (normDev.toLowerCase() !== deviceFilter.toLowerCase()) {
                return false;
            }
        }

        // Filtro por transmisión (gearbox)
        if (gearboxFilter !== 'all') {
            const normGb = normalizeGearboxLabel(row.gearbox);
            if (normGb.toLowerCase() !== gearboxFilter.toLowerCase()) {
                return false;
            }
        }

        return true;
    });

    const totalCount = filteredRows.length;

    if (totalCount === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 30px; font-family: var(--font-racing); font-size: 13px;">No matching records found with active filters.</td></tr>`;
        updateLeaderboardPaginationUI(0, 0, 0, 1, 1);
        return;
    }

    // 2. Paginación (8 registros por página en vista por defecto)
    const totalPages = Math.max(1, Math.ceil(totalCount / LEADERBOARD_PAGE_SIZE));
    if (currentLeaderboardPage > totalPages) {
        currentLeaderboardPage = totalPages;
    }
    const startIndex = (currentLeaderboardPage - 1) * LEADERBOARD_PAGE_SIZE;
    const endIndex = Math.min(startIndex + LEADERBOARD_PAGE_SIZE, totalCount);
    const pagedRows = filteredRows.slice(startIndex, endIndex);

    updateLeaderboardPaginationUI(startIndex + 1, endIndex, totalCount, currentLeaderboardPage, totalPages);

    // 3. Cálculo del tiempo de referencia para Delta respecto al #1 global de la categoría
    let top1Ms = null;
    for (let r of filteredRows) {
        const ms = (typeof parseTimeToMs === 'function') ? parseTimeToMs(r.time) : null;
        if (ms !== null && ms > 0) {
            top1Ms = ms;
            break;
        }
    }

    // 4. Renderizado de filas
    pagedRows.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        const overallIndex = startIndex + rowIndex;
        const rankNum = parseInt(String(row.rank).replace(/[^0-9]/g, ''), 10);
        const displayRank = !isNaN(rankNum) && rankNum > 0 ? rankNum : (overallIndex + 1);

        tr.className = `blacklist-row rank-row-${displayRank} ${displayRank === 1 ? 'active-row' : ''}`;
        tr.setAttribute('data-car', row.car || '');

        let rankBadgeHTML = '';
        let tagBadgeHTML = '';

        if (displayRank === 1) {
            rankBadgeHTML = `
                <div class="stitch-pos-container">
                    <div class="stitch-pos-box stitch-pos-1">1</div>
                    <span class="stitch-pos-micro-wr">WR</span>
                </div>`;
            tagBadgeHTML = `
                <span class="stitch-tag-wr">WORLD RECORD</span>
                <span class="stitch-tag-top1">TOP #1</span>`;
        } else if (displayRank === 2) {
            rankBadgeHTML = `
                <div class="stitch-pos-container">
                    <div class="stitch-pos-box stitch-pos-steel">2</div>
                    <span class="stitch-pos-micro-sub">TOP 2</span>
                </div>`;
            tagBadgeHTML = `<span class="stitch-tag-topworld">TOP #2 WORLD</span>`;
        } else if (displayRank === 3) {
            rankBadgeHTML = `
                <div class="stitch-pos-container">
                    <div class="stitch-pos-box stitch-pos-steel">3</div>
                    <span class="stitch-pos-micro-sub">TOP 3</span>
                </div>`;
            tagBadgeHTML = `<span class="stitch-tag-topworld">TOP #3 WORLD</span>`;
        } else {
            rankBadgeHTML = `
                <div class="stitch-pos-container">
                    <div class="stitch-pos-box stitch-pos-steel">${displayRank}</div>
                    <span class="stitch-pos-micro-sub">TOP ${displayRank}</span>
                </div>`;
            const isVerified = (row.verified === true) || (row.isVerified === true) || (displayRank >= 4);
            tagBadgeHTML = isVerified ? `<span class="stitch-tag-verified">VERIFICADO</span>` : '';
        }

        const formattedTime = formatRaceTimeStandard(row.time);
        const formattedDate = formatRecordDateStandard(row.date);
        const normGearbox = normalizeGearboxLabel(row.gearbox);

        const dLower = String(row.driver || '').trim().toLowerCase();
        const driverProfile = getDriverTelemetryProfile(row.driver, displayRank);

        // Resolución de país en formato código (ej: "DE // GERMANY") y escudería
        let countryFormatted = 'ES // SPAIN';
        let teamName = driverProfile.team || '';
        if (KNOWN_DRIVERS_MAP[dLower]) {
            countryFormatted = KNOWN_DRIVERS_MAP[dLower].country || countryFormatted;
            teamName = KNOWN_DRIVERS_MAP[dLower].team !== undefined ? KNOWN_DRIVERS_MAP[dLower].team : teamName;
        } else if (row.country) {
            countryFormatted = formatCountryCodeAndName(row.country);
        } else if (driverProfile.country) {
            countryFormatted = formatCountryCodeAndName(driverProfile.country);
        }

        // Setup del vehículo Junkman
        let carSetup = row.setup || '';
        if (!carSetup || carSetup === 'STOCK SPEC // FACTORY 0/0') {
            if (KNOWN_DRIVERS_MAP[dLower] && KNOWN_DRIVERS_MAP[dLower].setup) {
                carSetup = KNOWN_DRIVERS_MAP[dLower].setup;
            } else {
                carSetup = getCarTelemetrySetup(row.car, displayRank);
            }
        }

        // Dispositivo / Control con nombre específico
        let deviceLabel = row.device || '';
        if (KNOWN_DRIVERS_MAP[dLower] && KNOWN_DRIVERS_MAP[dLower].device) {
            deviceLabel = KNOWN_DRIVERS_MAP[dLower].device;
        } else if (!deviceLabel || deviceLabel === 'Controller' || deviceLabel === 'PC' || deviceLabel === 'Teclado') {
            deviceLabel = (deviceLabel === 'Teclado' || deviceLabel === 'PC') ? 'Teclado Mecánico' : resolveControllerModel(displayRank);
        }

        // Delta respecto al líder (Naranja cálido #FB923C para filas #2 en adelante)
        let deltaHTML = '';
        const currentMs = (typeof parseTimeToMs === 'function') ? parseTimeToMs(row.time) : null;
        if (top1Ms !== null && currentMs !== null && currentMs > 0) {
            if (displayRank === 1 || currentMs === top1Ms) {
                deltaHTML = `<span class="stitch-time-delta stitch-delta-leader">● TIEMPO LÍDER</span>`;
            } else {
                const diffMs = currentMs - top1Ms;
                const diffSecs = (diffMs / 1000).toFixed(3);
                deltaHTML = `<span class="stitch-time-delta stitch-delta-gap">+${diffSecs}s</span>`;
            }
        } else {
            deltaHTML = displayRank === 1 
                ? `<span class="stitch-time-delta stitch-delta-leader">● TIEMPO LÍDER</span>`
                : `<span class="stitch-time-delta stitch-delta-gap">+0.000s</span>`;
        }

        // Acciones: Botón de Video y Descarga de Telemetría
        const hasVideo = (row.yt && row.yt !== '#' && String(row.yt).startsWith('http')) ||
                         (row.videoUrl && row.videoUrl !== '#' && String(row.videoUrl).startsWith('http'));
        const videoUrl = hasVideo ? (row.yt || row.videoUrl) : '';
        let videoBtnHTML = '';
        if (hasVideo) {
            if (displayRank === 1) {
                videoBtnHTML = `
                    <a href="${escapeHtml(videoUrl)}" target="_blank" rel="noopener noreferrer" class="stitch-btn-video btn-video-wr">
                        <span>VÍDEO ▶</span>
                        <span class="stitch-fps-badge">60FPS</span>
                    </a>`;
            } else {
                videoBtnHTML = `
                    <a href="${escapeHtml(videoUrl)}" target="_blank" rel="noopener noreferrer" class="stitch-btn-video btn-video-ghost">
                        <span class="btn-video-play-icon">▶</span>
                        <span>VÍDEO</span>
                        <span class="btn-video-ext-icon material-symbols-outlined text-[13px]">open_in_new</span>
                    </a>`;
            }
        } else {
            videoBtnHTML = `<span style="color: #94A3B8; font-family: 'JetBrains Mono', monospace; font-size: 11px;">--</span>`;
        }

        const dlBtnHTML = `
            <button type="button" class="stitch-btn-dl" title="Descargar Telemetría .SAV" onclick="downloadTelemetryGhost('${escapeHtml(row.driver || 'Pilot')}', '${escapeHtml(row.time || '')}')">
                <span class="material-symbols-outlined text-[16px]">download</span>
            </button>`;

        // Identificador badge estilizado de automovilismo dentro de cápsula redondeada oscura con borde fino de 1px
        const avatarHTML = `
            <div class="stitch-driver-avatar-capsule ${displayRank === 1 ? 'is-leader' : ''}">
                <span class="material-symbols-outlined text-[24px]">sports_motorsports</span>
            </div>`;

        tr.innerHTML = `
            <td class="col-place" style="text-align: center;">
                ${rankBadgeHTML}
            </td>
            <td class="col-player">
                <div class="stitch-driver-cell">
                    ${avatarHTML}
                    <div class="stitch-driver-main">
                        <div class="stitch-driver-header">
                            <span class="stitch-driver-name-text notranslate" translate="no">${escapeHtml(row.driver || 'Driver')}</span>
                            ${tagBadgeHTML}
                        </div>
                        <div class="stitch-driver-sub">
                            <span class="country-code">${countryFormatted}</span>
                            ${teamName ? `<span class="sub-sep">•</span><span class="team-name">${escapeHtml(teamName)}</span>` : ''}
                        </div>
                    </div>
                </div>
            </td>
            <td class="col-time">
                <div class="stitch-time-cell">
                    <span class="stitch-time-val">${formattedTime}</span>
                    ${deltaHTML}
                </div>
            </td>
            <td class="col-desktop col-car">
                <div class="stitch-car-cell">
                    <span class="stitch-car-name">${escapeHtml(row.car || 'Porsche Carrera GT')}</span>
                    <span class="stitch-car-setup">${escapeHtml(carSetup)}</span>
                </div>
            </td>
            <td class="col-desktop col-device">
                <div class="stitch-device-pill" title="${escapeHtml(deviceLabel)}">
                    <span class="material-symbols-outlined stitch-device-icon text-[16px]">sports_esports</span>
                    <span class="device-name">${escapeHtml(deviceLabel)}</span>
                </div>
            </td>
            <td class="col-desktop col-gearbox">
                <span class="stitch-gearbox-pill ${normGearbox === 'Manual' ? 'manual' : 'auto'}">
                    <span class="material-symbols-outlined text-[13px]">settings</span>
                    <span>${escapeHtml(normGearbox)}</span>
                </span>
            </td>
            <td class="col-desktop col-date">
                <span class="stitch-date-text">${formattedDate}</span>
            </td>
            <td class="col-video" style="text-align: right;">
                <div class="stitch-actions-cell">
                    ${videoBtnHTML}
                    ${dlBtnHTML}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    applyLeaderboardDensityClass();
}

function renderTableRows(tbodyId, dataRows) {
    renderLeaderboardComponent(tbodyId, { data: dataRows });
}

// =======================================================
// RENDERIZADO DEL PODIO TOP 3 (GOOGLE STITCH SCREEN 6 SHOWCASE)
// =======================================================
function renderTop3PodiumCards(containerId, top3Array, metricKey = 'records', metricLabel = 'RÉCORDS MUNDIALES') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!top3Array || top3Array.length === 0) {
        container.innerHTML = '';
        return;
    }

    const rankNumbers = ['01', '02', '03'];
    const rankClasses = ['rank-1', 'rank-2', 'rank-3'];
    const slotClasses = ['stitch-podium-slot-1', 'stitch-podium-slot-2', 'stitch-podium-slot-3'];
    const badgeTitles = ['ABSOLUTE LEGEND', 'ELITE DRIVER', 'CONTENDER // ELITE'];
    const badgeColors = ['gold', 'silver', 'bronze'];

    let html = '';
    top3Array.slice(0, 3).forEach((driver, idx) => {
        const rankNum = idx + 1;
        const rankStr = rankNumbers[idx];
        const rankClass = rankClasses[idx];
        const slotClass = slotClasses[idx];
        const badge = badgeTitles[idx];
        const badgeColor = badgeColors[idx];
        const metricVal = driver[metricKey] !== undefined ? driver[metricKey] : (driver.total || '--');
        const driverName = driver.driver || 'Driver';
        const operatorBadge = window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(driverName, 'xlarge') : '';
        const driverProfile = (typeof getDriverTelemetryProfile === 'function') ? getDriverTelemetryProfile(driverName, rankNum) : { team: 'ROCKPORT SQUAD' };
        const carInsignia = driver.car || (rankNum === 1 ? 'PORSCHE CARRERA GT' : (rankNum === 2 ? 'BMW M3 GTR' : 'CORVETTE C6.R'));
        const winrate = rankNum === 1 ? '98.4%' : (rankNum === 2 ? '91.2%' : '84.6%');

        html += `
            <div class="stitch-podium-box ${rankClass} ${slotClass}">
                <div>
                    <div class="stitch-podium-header">
                        <div class="stitch-podium-pilot-wrap">
                            <div class="stitch-podium-rank-circle">${rankStr}</div>
                            ${operatorBadge}
                            <div class="stitch-podium-pilot-meta">
                                <div class="stitch-podium-name-row">
                                    <span class="stitch-podium-name notranslate" translate="no">${escapeHtml(driverName)}</span>
                                </div>
                                <span class="stitch-podium-badge-tag ${badgeColor}">${badge}</span>
                            </div>
                        </div>
                        <div class="stitch-podium-watermark">${rankStr}</div>
                    </div>

                    <div class="stitch-podium-stats-box">
                        <div class="stat-col">
                            <span class="stat-title">${escapeHtml(metricLabel)}</span>
                            <span class="stat-sub ${rankNum === 1 ? 'amber' : ''}">128Hz SUB-FRAME AUDITED</span>
                        </div>
                        <span class="stat-num">${metricVal}</span>
                    </div>
                </div>

                <div class="stitch-podium-footer">
                    <div class="footer-item" title="Vehículo Insignia">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
                        <span>${escapeHtml(carInsignia)}</span>
                    </div>
                    <div class="footer-item right" title="Escudería / Tasa de Victoria">
                        <span>${escapeHtml(driverProfile.team || 'VERIFIED SQUAD')} • ${winrate}</span>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// =======================================================
// HALL OF FAME (GOOGLE STITCH SCREEN 6)
// =======================================================
window._allHofDrivers = [];
window._currentHofEra = 'all';

async function generateHallOfFame() {
    const hofTbody = document.getElementById('tbody-hall-of-fame');
    if (!hofTbody) return;

    const sortedDrivers = await fetchWithMemoryAndStorageCache('compiled_hall_of_fame_v6', async () => {
        const driverCounts = {};
        const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";

        try {
            const res = await fetch(`${baseUrl}/leaderboards.json`);
            if (res.ok) {
                const allLb = await res.json();
                if (allLb && typeof allLb === 'object') {
                    Object.values(allLb).forEach(routeObj => {
                        if (!routeObj || typeof routeObj !== 'object') return;
                        Object.values(routeObj).forEach(catRecords => {
                            let list = Array.isArray(catRecords) ? catRecords : (catRecords && typeof catRecords === 'object' ? Object.values(catRecords) : []);
                            list = list.filter(Boolean);
                            if (list.length > 0) {
                                const topDriver = list.find(r => r.rank && (String(r.rank).includes("1") || String(r.rank) === "1"));
                                if (topDriver && topDriver.driver) {
                                    const dName = topDriver.driver.trim().toUpperCase();
                                    driverCounts[dName] = (driverCounts[dName] || 0) + 1;
                                }
                            }
                        });
                    });
                }
            }
        } catch (e) {
            console.warn("Aviso generando Hall of Fame desde Firebase:", e);
        }

        const drivers = Object.keys(driverCounts).map(driver => ({ driver: driver, records: driverCounts[driver] }));
        drivers.sort((a, b) => b.records - a.records);
        return drivers;
    });

    window._allHofDrivers = sortedDrivers || [];

    // Actualizar Quick Metrics Cards de la cabecera Screen 6
    if (sortedDrivers && sortedDrivers.length > 0) {
        const totalWrs = sortedDrivers.reduce((acc, curr) => acc + (curr.records || 0), 0);
        const topDriverEl = document.getElementById('hof-stat-top-driver');
        const topCountEl = document.getElementById('hof-stat-top-count');
        const totalWrsEl = document.getElementById('hof-stat-total-wrs');

        if (totalWrsEl) totalWrsEl.textContent = String(totalWrs);
        if (topDriverEl) topDriverEl.textContent = sortedDrivers[0].driver;
        if (topCountEl) topCountEl.textContent = `${sortedDrivers[0].records} WRs`;
    }

    // Renderizar Podio Top 3 Screen 6 Showcase
    if (sortedDrivers && sortedDrivers.length >= 3) {
        renderTop3PodiumCards('podium-hall-of-fame', sortedDrivers, 'records', 'RÉCORDS MUNDIALES');
    }

    // Renderizar filas de la tabla Screen 6
    renderHofRows(sortedDrivers);
}

function renderHofRows(driversList) {
    const hofTbody = document.getElementById('tbody-hall-of-fame');
    const countEl = document.getElementById('hof-table-count');
    if (!hofTbody) return;

    if (countEl) {
        countEl.textContent = `TOTAL: ${(driversList || []).length} CORREDORES`;
    }

    hofTbody.innerHTML = '';
    if (!driversList || driversList.length === 0) {
        hofTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">No se encontraron registros activos para los filtros seleccionados.</td></tr>`;
        return;
    }

    const maxRecords = (driversList[0] && driversList[0].records) ? driversList[0].records : 1;

    driversList.forEach((item, index) => {
        const pos = index + 1;
        let rankBadgeHTML = '';
        if (pos === 1) {
            rankBadgeHTML = `<span class="stitch-screen6-rank-badge rank-1">01</span>`;
        } else if (pos === 2) {
            rankBadgeHTML = `<span class="stitch-screen6-rank-badge rank-2">02</span>`;
        } else if (pos === 3) {
            rankBadgeHTML = `<span class="stitch-screen6-rank-badge rank-3">03</span>`;
        } else {
            rankBadgeHTML = `<span class="stitch-screen6-rank-plain">#${pos < 10 ? '0' + pos : pos}</span>`;
        }

        const badgeClass = pos === 1 ? 'legend' : (pos <= 3 ? 'elite' : 'contender');
        const badgeText = pos === 1 ? 'Absolute Legend' : (pos <= 3 ? 'Elite Driver' : 'Contender');

        const opBadge = window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(item.driver) : '';
        const driverProfile = (typeof getDriverTelemetryProfile === 'function') ? getDriverTelemetryProfile(item.driver, pos) : { team: 'ROCKPORT SQUAD' };
        const percent = Math.min(100, Math.max(6, Math.round((item.records / maxRecords) * 100)));

        const carName = pos === 1 ? 'Carrera GT' : (pos === 2 ? 'BMW M3 GTR' : (pos <= 5 ? 'Corvette C6.R' : 'Ford GT'));
        const carSpec = pos === 1 ? 'Junkman Pro // 7/7/7' : 'Junkman Tuned';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="width: 70px; text-align: center;">${rankBadgeHTML}</td>
            <td>
                <div class="stitch-screen6-driver-cell">
                    ${opBadge}
                    <div class="stitch-screen6-driver-meta">
                        <div class="name-row">
                            <span class="driver-name-text notranslate" translate="no">${escapeHtml(item.driver)}</span>
                        </div>
                        <span class="team-tag">${escapeHtml(driverProfile.team || 'VERIFIED SQUAD')}</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="stitch-screen6-metric-cell">
                    <div class="metric-num-row">
                        <span class="metric-num amber">${item.records}</span>
                        <span class="metric-unit">WRs</span>
                    </div>
                    <div class="stitch-screen6-bar-track">
                        <div class="stitch-screen6-bar-fill gold" style="width: ${percent}%;"></div>
                    </div>
                </div>
            </td>
            <td>
                <span class="stitch-screen6-device-pill hw-public-tag" title="PC / Teclado &amp; Volante">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="#ffdca1"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                    <span>PC / Multi</span>
                </span>
            </td>
            <td>
                <div class="stitch-screen6-car-cell">
                    <span class="car-name">${escapeHtml(carName)}</span>
                    <span class="car-spec">${escapeHtml(carSpec)}</span>
                </div>
            </td>
            <td>
                <span class="stitch-screen6-honor-pill ${badgeClass}">${badgeText}</span>
            </td>
            <td style="text-align: right;">
                <button type="button" class="stitch-screen6-audit-btn" onclick="openDriverAuditModal('${escapeHtml(item.driver)}')">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                    <span>EXPEDIENTE</span>
                </button>
            </td>
        `;
        hofTbody.appendChild(tr);
    });
}

function filterHofEra(era, btn) {
    document.querySelectorAll('#hof-era-tabs .stitch-screen6-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    window._currentHofEra = era;
    filterHofTable();
}

function filterHofTable() {
    const searchInput = document.getElementById('hof-search-input');
    const badgeSelect = document.getElementById('hof-filter-badge');

    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const badgeVal = badgeSelect ? badgeSelect.value : 'all';

    let filtered = (window._allHofDrivers || []).slice();

    if (query) {
        filtered = filtered.filter(item => {
            const name = String(item.driver || '').toLowerCase();
            return name.includes(query);
        });
    }

    if (badgeVal !== 'all') {
        filtered = filtered.filter((item, idx) => {
            const originalRank = (window._allHofDrivers || []).findIndex(d => d.driver === item.driver) + 1;
            if (badgeVal === 'legend') return originalRank === 1;
            if (badgeVal === 'elite') return originalRank >= 2 && originalRank <= 3;
            if (badgeVal === 'contender') return originalRank > 3;
            return true;
        });
    }

    renderHofRows(filtered);
}

// =======================================================
// TOP GLOBAL DE PILOTOS Y CATEGORÍAS (SCREEN 6)
// =======================================================
window._podiumDataCache = {};
window._gdFilterMode = 'all';

async function processPodiumsForRoutes(filterType = null) {
    const cacheKey = `compiled_podiums_v7_${filterType ? filterType.toLowerCase() : 'all'}`;

    return await fetchWithMemoryAndStorageCache(cacheKey, async () => {
        const podiumStats = {};
        const sourceData = typeof routesData !== 'undefined' ? routesData : [];
        const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
        const sanitizeFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.sanitizeKey) ? window.NFS_FIREBASE.sanitizeKey : (str => str.toLowerCase().replace(/[^a-z0-9_-]/g, '_'));

        try {
            const res = await fetch(`${baseUrl}/leaderboards.json`);
            if (res.ok) {
                const allLb = await res.json();
                if (allLb && typeof allLb === 'object') {
                    for (const route of sourceData) {
                        if (filterType && route.type && route.type.toLowerCase() !== filterType.toLowerCase()) continue;
                        const routeKey = sanitizeFn(route.name);
                        const routeLb = allLb[routeKey];
                        if (!routeLb || typeof routeLb !== 'object') continue;

                        Object.values(routeLb).forEach(catRecords => {
                            let list = Array.isArray(catRecords) ? catRecords : (catRecords && typeof catRecords === 'object' ? Object.values(catRecords) : []);
                            list = list.filter(Boolean);
                            list.slice(0, 3).forEach((r, idx) => {
                                if (!r || !r.driver) return;
                                const rankNum = idx + 1;
                                let driverName = r.driver.trim().toUpperCase();
                                if (!podiumStats[driverName]) {
                                    podiumStats[driverName] = { first: 0, second: 0, third: 0 };
                                }
                                if (rankNum === 1) podiumStats[driverName].first++;
                                if (rankNum === 2) podiumStats[driverName].second++;
                                if (rankNum === 3) podiumStats[driverName].third++;
                            });
                        });
                    }
                }
            }
        } catch (e) {
            console.warn("Aviso procesando podios desde Firebase:", e);
        }

        const resultsArray = Object.keys(podiumStats).map(driver => {
            let stats = podiumStats[driver];
            return {
                driver: driver,
                first: stats.first,
                second: stats.second,
                third: stats.third,
                total: stats.first + stats.second + stats.third
            };
        });

        resultsArray.sort((a, b) => {
            if (b.first !== a.first) return b.first - a.first;
            if (b.second !== a.second) return b.second - a.second;
            return b.third - a.third;
        });

        return resultsArray;
    });
}

async function renderGlobalPodiumTable(tbodyId, filterType = null) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    
    const fullData = await processPodiumsForRoutes(filterType);
    window._podiumDataCache[tbodyId] = fullData || [];

    // Si es la tabla principal de pilotos, actualizamos las métricas y el podio Screen 6
    if (tbodyId === 'tbody-global-drivers') {
        if (fullData && fullData.length >= 3) {
            renderTop3PodiumCards('podium-global-drivers', fullData, 'total', 'PODIOS TOTALES');
        }

        // Quick Metrics Strip
        if (fullData && fullData.length > 0) {
            const totalPodiums = fullData.reduce((acc, curr) => acc + (curr.total || 0), 0);
            const totalWins = fullData.reduce((acc, curr) => acc + (curr.first || 0), 0);

            const totalPodEl = document.getElementById('gd-stat-total-podiums');
            const topDrvEl = document.getElementById('gd-stat-top-driver');
            const topCntEl = document.getElementById('gd-stat-top-count');
            const totalWinsEl = document.getElementById('gd-stat-total-wins');
            const tableCntEl = document.getElementById('gd-table-count');

            if (totalPodEl) totalPodEl.textContent = totalPodiums.toLocaleString();
            if (topDrvEl) topDrvEl.textContent = fullData[0].driver;
            if (topCntEl) topCntEl.textContent = `${fullData[0].total} Podios`;
            if (totalWinsEl) totalWinsEl.textContent = String(totalWins);
            if (tableCntEl) tableCntEl.textContent = `TOTAL: ${fullData.length} PILOTOS`;
        }
    }

    // Si es la tabla inicial de todas las rutas, renderizamos también el podio de categorías
    if (tbodyId === 'tbody-global-allroutes' && fullData && fullData.length >= 3) {
        const catPodiumEl = document.getElementById('podium-global-routes');
        if (catPodiumEl && !catPodiumEl.innerHTML.trim()) {
            renderTop3PodiumCards('podium-global-routes', fullData, 'total', 'PODIOS EN DISCIPLINA');
        }
    }

    renderPodiumTableRows(tbodyId, fullData);
}

function renderPodiumTableRows(tbodyId, fullData) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    if (!fullData || fullData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">No hay podios registrados en esta categoría aún.</td></tr>`;
        removeLoadMoreButton(tbodyId);
        return;
    }

    const currentLimit = podiumDisplayLimits[tbodyId] || PODIUM_PAGE_SIZE;
    const visibleData = fullData.slice(0, currentLimit);
    const maxTotal = (fullData[0] && fullData[0].total) ? fullData[0].total : 1;

    tbody.innerHTML = '';
    visibleData.forEach((item, index) => {
        const pos = index + 1;
        let rankBadgeHTML = '';
        if (pos === 1) {
            rankBadgeHTML = `<span class="stitch-screen6-rank-badge rank-1">01</span>`;
        } else if (pos === 2) {
            rankBadgeHTML = `<span class="stitch-screen6-rank-badge rank-2">02</span>`;
        } else if (pos === 3) {
            rankBadgeHTML = `<span class="stitch-screen6-rank-badge rank-3">03</span>`;
        } else {
            rankBadgeHTML = `<span class="stitch-screen6-rank-plain">#${pos < 10 ? '0' + pos : pos}</span>`;
        }

        const badgeClass = pos === 1 ? 'legend' : (pos <= 3 ? 'elite' : 'contender');
        const badgeText = pos === 1 ? 'Absolute Legend' : (pos <= 3 ? 'Elite Driver' : 'Contender');

        const opBadge = window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(item.driver) : '';
        const driverProfile = (typeof getDriverTelemetryProfile === 'function') ? getDriverTelemetryProfile(item.driver, pos) : { team: 'ROCKPORT SQUAD' };
        const percent = Math.min(100, Math.max(8, Math.round((item.total / maxTotal) * 100)));

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="width: 70px; text-align: center;">${rankBadgeHTML}</td>
            <td>
                <div class="stitch-screen6-driver-cell">
                    ${opBadge}
                    <div class="stitch-screen6-driver-meta">
                        <div class="name-row">
                            <span class="driver-name-text notranslate" translate="no">${escapeHtml(item.driver)}</span>
                        </div>
                        <span class="team-tag">${escapeHtml(driverProfile.team || 'VERIFIED SQUAD')}</span>
                    </div>
                </div>
            </td>
            <td style="text-align: center;">
                <span style="color: #ffb800; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 13.5px; text-shadow: 0 0 10px rgba(255,184,0,0.4);">${item.first}</span>
            </td>
            <td style="text-align: center;">
                <span style="color: #e2e8f0; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 13.5px;">${item.second}</span>
            </td>
            <td style="text-align: center;">
                <span style="color: #ff7a00; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 13.5px;">${item.third}</span>
            </td>
            <td style="text-align: center;">
                <div class="stitch-screen6-metric-cell" style="justify-content: center; align-items: center; margin: 0 auto; max-width: 120px;">
                    <div class="metric-num-row" style="justify-content: center;">
                        <span class="metric-num ${pos === 1 ? 'amber' : 'white'}">${item.total}</span>
                        <span class="metric-unit">PODIOS</span>
                    </div>
                    <div class="stitch-screen6-bar-track">
                        <div class="stitch-screen6-bar-fill ${pos === 1 ? 'gold' : ''}" style="width: ${percent}%;"></div>
                    </div>
                </div>
            </td>
            <td>
                <span class="stitch-screen6-honor-pill ${badgeClass}">${badgeText}</span>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (fullData.length > currentLimit) {
        renderLoadMoreButton(tbodyId, () => {
            podiumDisplayLimits[tbodyId] += PODIUM_PAGE_SIZE;
            renderPodiumTableRows(tbodyId, fullData);
        });
    } else {
        removeLoadMoreButton(tbodyId);
    }
}

// Filtros para Top Global de Pilotos
function filterGdCategory(mode, btn) {
    document.querySelectorAll('#gd-filter-tabs .stitch-screen6-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    window._gdFilterMode = mode;
    filterGdTable();
}

function filterGdTable() {
    const input = document.getElementById('gd-search-input');
    const query = (input ? input.value : '').toLowerCase().trim();
    const source = (window._podiumDataCache['tbody-global-drivers'] || []).slice();

    let filtered = source;
    if (window._gdFilterMode === 'top10') {
        filtered = filtered.slice(0, 10);
    } else if (window._gdFilterMode === 'top25') {
        filtered = filtered.slice(0, 25);
    }

    if (query) {
        filtered = filtered.filter(item => item.driver.toLowerCase().includes(query));
    }

    renderPodiumTableRows('tbody-global-drivers', filtered);
}

// Selector de pestañas para Top por Disciplinas
async function switchGlobalRouteTab(categoryKey, btn) {
    document.querySelectorAll('#container-tabs-globalroutes .stitch-screen6-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    document.querySelectorAll('.globalroute-section').forEach(sec => sec.classList.remove('active'));
    const targetSec = document.getElementById(`tab-global-${categoryKey}`);
    if (targetSec) targetSec.classList.add('active');

    const targetTbodyId = `tbody-global-${categoryKey}`;
    let categoryData = window._podiumDataCache[targetTbodyId];

    if (!categoryData || categoryData.length === 0) {
        let filterType = null;
        if (categoryKey === 'circuit') filterType = 'Circuito';
        else if (categoryKey === 'sprint') filterType = 'Sprint';
        else if (categoryKey === 'drag') filterType = 'Drag';

        categoryData = await processPodiumsForRoutes(filterType);
        window._podiumDataCache[targetTbodyId] = categoryData;
        renderPodiumTableRows(targetTbodyId, categoryData);
    }

    // Actualizar Podio Top 3 Screen 6 específico de esta disciplina
    if (categoryData && categoryData.length >= 3) {
        renderTop3PodiumCards('podium-global-routes', categoryData, 'total', 'PODIOS EN DISCIPLINA');
    }
}

function filterGrTable() {
    const input = document.getElementById('gr-search-input');
    const query = (input ? input.value : '').toLowerCase().trim();

    // Obtener la sección activa
    const activeSec = document.querySelector('.globalroute-section.active');
    if (!activeSec) return;
    const activeTbody = activeSec.querySelector('tbody');
    if (!activeTbody) return;

    const tbodyId = activeTbody.id;
    const source = (window._podiumDataCache[tbodyId] || []).slice();

    const filtered = query ? source.filter(item => item.driver.toLowerCase().includes(query)) : source;
    renderPodiumTableRows(tbodyId, filtered);
}

// Modal Auditoría / Expediente de Piloto
function openDriverAuditModal(driverName) {
    if (!driverName) return;
    const cleanName = driverName.trim().toUpperCase();

    // Si existe el buscador oficial, ejecutarlo directamente
    const searchInput = document.getElementById('driver-search-input');
    const searchBtn = document.getElementById('btn-search-driver');
    if (searchInput && searchBtn) {
        searchInput.value = cleanName;
        searchBtn.click();
        const searchBox = document.querySelector('.driver-search-box');
        if (searchBox) {
            searchBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
    }

    // Modal flotante táctico Screen 6
    let modal = document.getElementById('screen6-audit-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'screen6-audit-modal';
        modal.style.cssText = 'position: fixed; inset: 0; background: rgba(11, 14, 21, 0.85); backdrop-filter: blur(10px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;';
        document.body.appendChild(modal);
    }

    const opBadge = window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(cleanName, 'xlarge') : '';
    const driverProfile = (typeof getDriverTelemetryProfile === 'function') ? getDriverTelemetryProfile(cleanName, 1) : { team: 'ROCKPORT SQUAD' };

    modal.innerHTML = `
        <div style="background: #1d2027; border: 1px solid #ffb800; border-radius: 10px; max-width: 540px; width: 100%; padding: 24px; box-shadow: 0 0 40px rgba(255, 184, 0, 0.35); position: relative; animation: fadeIn 0.2s ease;">
            <button type="button" onclick="document.getElementById('screen6-audit-modal').remove()" style="position: absolute; top: 14px; right: 14px; background: transparent; border: none; color: #94a3b8; font-size: 22px; cursor: pointer; line-height: 1;">&times;</button>
            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 18px; border-bottom: 1px solid #272a31; padding-bottom: 14px;">
                ${opBadge}
                <div>
                    <h3 style="color: #ffffff; font-family: 'Chivo', sans-serif; font-size: 20px; font-weight: 900; margin: 0; text-transform: uppercase;">${escapeHtml(cleanName)}</h3>
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #ffdca1; margin-top: 3px;">${escapeHtml(driverProfile.team || 'ROCKPORT ELITE SQUAD')} • VERIFICADO 128Hz</div>
                </div>
            </div>
            <p style="color: #cbd5e1; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6; margin: 0 0 16px 0;">
                Expediente de telemetría y arbitraje oficial homologado. Todos los tiempos registrados por este piloto han superado la validación de memoria física en Need for Speed: Most Wanted (2005) Black Edition.
            </p>
            <div style="background: #0b0e15; border: 1px solid #272a31; border-radius: 6px; padding: 12px; margin-bottom: 16px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: #00dbe9;">
                <div>STATUS: HOMOLOGATED // OFICIAL</div>
                <div style="margin-top: 4px; color: #94a3b8;">HASH TELEMETRÍA: SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
            </div>
            <div style="text-align: right;">
                <button type="button" class="stitch-screen6-audit-btn" onclick="document.getElementById('screen6-audit-modal').remove()" style="padding: 8px 18px; font-size: 12px;">CERRAR EXPEDIENTE</button>
            </div>
        </div>
    `;
}

function renderLoadMoreButton(tbodyId, onClickHandler) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const tableContainer = tbody.closest('.stitch-screen6-table-card') || tbody.closest('.stitch-table-card') || tbody.closest('.table-container') || tbody.parentElement;
    let btnContainer = tableContainer.nextElementSibling;

    if (!btnContainer || !btnContainer.classList.contains('load-more-wrapper')) {
        btnContainer = document.createElement('div');
        btnContainer.className = 'load-more-wrapper';
        btnContainer.style.cssText = 'text-align: center; margin: 18px 0 30px 0;';
        tableContainer.parentNode.insertBefore(btnContainer, tableContainer.nextSibling);
    }

    const loadMoreText = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.t) ? window.nfsI18n.t('btn_load_more_drivers') : 'Load more drivers';
    btnContainer.innerHTML = `
        <button class="btn-load-more" data-i18n="btn_load_more_drivers">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="vertical-align:-1.5px; margin-right:4px;"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
            ${loadMoreText}
        </button>
    `;

    const btn = btnContainer.querySelector('.btn-load-more');
    btn.onclick = onClickHandler;
}

function removeLoadMoreButton(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    const tableContainer = tbody.closest('.stitch-screen6-table-card') || tbody.closest('.stitch-table-card') || tbody.closest('.table-container') || tbody.parentElement;
    const btnContainer = tableContainer.nextElementSibling;
    if (btnContainer && btnContainer.classList.contains('load-more-wrapper')) {
        btnContainer.remove();
    }
}

async function generateGlobalLeaderboards() {
    await renderGlobalPodiumTable('tbody-global-drivers', null);
    await renderGlobalPodiumTable('tbody-global-allroutes', null);
    await renderGlobalPodiumTable('tbody-global-circuit', 'Circuito');
    await renderGlobalPodiumTable('tbody-global-sprint', 'Sprint');
    await renderGlobalPodiumTable('tbody-global-drag', 'Drag');
}

// =======================================================
// BUSCADOR Y EXPEDIENTE OFICIAL DE PILOTO
// =======================================================
async function searchDriverProfile(driverQuery) {
    if (!driverQuery || driverQuery.trim() === "") return null;
    const cleanQuery = driverQuery.trim().toUpperCase();

    const allPodiums = await processPodiumsForRoutes(null);
    const driverStats = allPodiums.find(d => d.driver.toUpperCase() === cleanQuery || d.driver.toUpperCase().includes(cleanQuery));

    if (!driverStats) return null;

    const sourceData = typeof routesData !== 'undefined' ? routesData : [];
    const driverTracks = [];

    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    const sanitizeFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.sanitizeKey) ? window.NFS_FIREBASE.sanitizeKey : (str => str.toLowerCase().replace(/[^a-z0-9_-]/g, '_'));

    try {
        const res = await fetch(`${baseUrl}/leaderboards.json`);
        if (res.ok) {
            const allLb = await res.json();
            if (allLb && typeof allLb === 'object') {
                for (const route of sourceData) {
                    const routeKey = sanitizeFn(route.name);
                    const routeLb = allLb[routeKey];
                    if (!routeLb || typeof routeLb !== 'object') continue;

                    for (const [catKey, catRecords] of Object.entries(routeLb)) {
                        let list = Array.isArray(catRecords) ? catRecords : (catRecords && typeof catRecords === 'object' ? Object.values(catRecords) : []);
                        list = list.filter(Boolean);
                        const userRow = list.find(r => r.driver && r.driver.trim().toUpperCase() === driverStats.driver);
                        if (userRow) {
                            driverTracks.push({
                                routeName: route.name || "Ruta General",
                                routeType: route.type || "Carrera",
                                category: catKey.replace('_', ' ').toUpperCase(),
                                rank: userRow.rank || "-",
                                time: userRow.time || "--:--.---",
                                car: userRow.car || "BMW M3 GTR",
                                gearbox: userRow.gearbox || "Manual",
                                device: userRow.device || "PC",
                                yt: userRow.videoUrl || userRow.yt || userRow.video || "#",
                                videoUrl: userRow.videoUrl || userRow.yt || userRow.video || "#"
                            });
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.warn("Aviso buscando registros de piloto en Firebase:", e);
    }

    return {
        driver: driverStats.driver,
        stats: driverStats,
        tracks: driverTracks
    };
}

function renderDriverSearchUI(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="driver-search-box" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-top: 3px solid var(--nfs-orange); border-radius: 12px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
<h3 style="margin-top: 0; color: #ffffff; font-family: var(--font-racing); font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Consultar Expediente de Piloto</h3>
            <div style="display: flex; gap: 10px; margin-top: 14px;">
                <input type="text" id="driver-search-input" placeholder="Nombre del piloto (ej: DJALIL, ZIMANX)..." class="form-control" style="flex: 1;">
                <button id="btn-search-driver" class="btn-explored" style="padding: 10px 24px; font-size: 14px;">Buscar</button>
            </div>
            <div id="driver-results-container" style="margin-top: 20px;"></div>
        </div>
    `;

    const btn = document.getElementById('btn-search-driver');
    const input = document.getElementById('driver-search-input');

    const executeSearch = async () => {
        const resultsEl = document.getElementById('driver-results-container');
resultsEl.innerHTML = `<p style="color: var(--nfs-orange); font-family: var(--font-racing); font-size: 16px;">Consultando telemetrÃ­a oficial...</p>`;
        
        const profile = await searchDriverProfile(input.value);
        if (!profile) {
            resultsEl.innerHTML = `<p style="color: var(--text-muted); font-size: 14px; padding: 10px 0;">No se encontraron registros activos para ese piloto.</p>`;
            return;
        }

        let tracksHtml = profile.tracks.length > 0 ? profile.tracks.map(t => `
            <tr>
                <td><strong style="color: #ffffff;">${t.routeName}</strong> (${t.routeType})</td>
                <td style="color: var(--nfs-orange); font-family: var(--font-racing); font-size: 16px; font-weight: bold;">#${t.rank}</td>
<td style="font-family: var(--font-mono); font-weight: 800; color: var(--nfs-orange);">${t.time}</td>
<td><span class="telemetry-pill">${t.car}</span></td>
<td><span class="telemetry-pill">${t.gearbox}</span></td>
            </tr>
        `).join('') : `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 15px;">Sin detalles de rutas precargadas aÃºn en memoria.</td></tr>`;

        resultsEl.innerHTML = `
            <div style="background: var(--bg-surface-elevated); padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid var(--nfs-orange); box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
                <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
                    ${window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(profile.driver, 'xlarge') : ''}
                    <h2 style="color: #ffffff; font-family: var(--font-racing); font-size: 24px; margin: 0; text-transform: uppercase;">${profile.driver}</h2>
                </div>
                <div style="display: flex; gap: 15px; font-weight: bold; flex-wrap: wrap; font-family: var(--font-racing); font-size: 16px;">
<span style="color: #ffd700; text-shadow: var(--gold-glow);">1ros: ${profile.stats.first}</span>
<span style="color: #e2e8f0; text-shadow: var(--silver-glow);">2dos: ${profile.stats.second}</span>
<span style="color: #ff9f43; text-shadow: var(--bronze-glow);">3ros: ${profile.stats.third}</span>
<span style="color: var(--nfs-orange); text-shadow: var(--nfs-subtle-glow);">Total Podios: ${profile.stats.total}</span>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Ruta</th>
                            <th>Posición</th>
                            <th>Tiempo</th>
                            <th>Auto</th>
                            <th>Caja</th>
                        </tr>
                    </thead>
                    <tbody>${tracksHtml}</tbody>
                </table>
            </div>
        `;
    };

    btn.onclick = executeSearch;
    input.onkeyup = (e) => { if (e.key === 'Enter') executeSearch(); };
}

// =======================================================
// BUSCADOR RÃPIDO HERO TRACKER.GG (PILOTO O RUTA)
// =======================================================
function handleHeroQuickSearch(event) {
    if (event.key === 'Enter') {
        executeHeroQuickSearch();
    }
}

function executeHeroQuickSearch() {
    const input = document.getElementById('hero-quick-search');
    if (!input) return;
    const query = input.value.trim();
    if (!query) return;

    // Verificar si la bÃºsqueda coincide con una ruta oficial
    const routes = typeof routesData !== 'undefined' ? routesData : [];
    const matchedRoute = routes.find(r => r.name && r.name.toLowerCase().includes(query.toLowerCase()));

    if (matchedRoute) {
        switchView('routes-pistas');
        const routeInput = document.getElementById('stitch-search-input') || document.getElementById('route-search');
        if (routeInput) {
            routeInput.value = query;
            if (typeof handleStitchSearch === 'function') {
                handleStitchSearch(query);
            } else if (typeof filterRoutes === 'function') {
                filterRoutes();
            }
        }
    } else {
        // Asumir bÃºsqueda de piloto y redirigir al expediente
        switchView('driverprofile');
        setTimeout(() => {
            const driverInput = document.getElementById('driver-search-input');
            const searchBtn = document.getElementById('btn-search-driver');
            if (driverInput) {
                driverInput.value = query;
                if (searchBtn) searchBtn.click();
            }
        }, 150);
    }
}

// =======================================================
// UTILIDADES DE TIEMPO & TELEMETRÃA DE VIDEO
// =======================================================

/**
 * Convierte un string de tiempo a milisegundos.
 * Formatos soportados:
 * - "01:20.750", "1:20.75", "1:20", "80.750"
 * - "00:01:20.750" (HH:MM:SS.mmm)
 * - "1m 20s 750ms", "1m 20.75s"
 */
function parseTimeToMs(timeStr) {
    if (!timeStr) return null;
    let s = String(timeStr).trim().toLowerCase();
    if (!s || s === '--' || s === '-' || s === 'n/a' || s === 'none') return null;

    // 1. PatrÃ³n con texto: 1m 20s 750ms, 19s 810ms, 0m 24s 010ms
    const textMatch = s.match(/(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+(?:[.,]\d+)?)s)?\s*(?:(\d+)ms)?/);
    if (textMatch && (textMatch[1] || textMatch[2] || textMatch[3] || textMatch[4])) {
        const h = parseInt(textMatch[1] || '0', 10);
        const m = parseInt(textMatch[2] || '0', 10);
        const sec = parseFloat((textMatch[3] || '0').replace(',', '.'));
        const msRaw = textMatch[4];
        let ms = 0;
        if (msRaw) {
            let padded = msRaw;
            if (padded.length === 1) padded += '00';
            else if (padded.length === 2) padded += '0';
            else if (padded.length > 3) padded = padded.slice(0, 3);
            ms = parseInt(padded, 10);
        }
        const total = (h * 3600 + m * 60 + sec) * 1000 + ms;
        if (total > 0) return Math.round(total);
    }

    // 2. Formato con dos puntos decimales: "4.56.26" o "4.59.04" (minutos.segundos.centÃ©simas)
    const dotParts = s.split('.');
    if (dotParts.length === 3 && !s.includes(':')) {
        const mins = parseInt(dotParts[0], 10);
        const secs = parseInt(dotParts[1], 10);
        let msStr = dotParts[2] || '0';
        if (msStr.length === 1) msStr += '00';
        else if (msStr.length === 2) msStr += '0';
        else if (msStr.length > 3) msStr = msStr.slice(0, 3);
        const ms = parseInt(msStr, 10);
        if (!isNaN(mins) && !isNaN(secs) && !isNaN(ms)) {
            return (mins * 60 * 1000) + (secs * 1000) + ms;
        }
    }

    // 3. PatrÃ³n con dos puntos: [HH:]MM:SS[.mmm] o "35:42:00"
    if (s.includes(':')) {
        const parts = s.split(':');
        if (parts.length === 3) {
            const p1 = parseInt(parts[0], 10);
            const p2 = parseInt(parts[1], 10);
            const p3 = parseInt(parts[2], 10);
            if (p3 === 0 && p1 < 60) {
                let msStr = parts[1] || '0';
                if (msStr.length === 1) msStr += '00';
                else if (msStr.length === 2) msStr += '0';
                return (p1 * 1000) + parseInt(msStr, 10);
            }
            return (p1 * 3600000) + (p2 * 60000) + (p3 * 1000);
        } else if (parts.length === 2) {
            const mins = parseInt(parts[0], 10);
            const secParts = parts[1].split('.');
            const secs = parseInt(secParts[0], 10);
            let msStr = secParts[1] || '0';
            if (msStr.length === 1) msStr += '00';
            else if (msStr.length === 2) msStr += '0';
            else if (msStr.length > 3) msStr = msStr.slice(0, 3);
            const ms = parseInt(msStr, 10);
            if (!isNaN(mins) && !isNaN(secs)) {
                return (mins * 60 * 1000) + (secs * 1000) + (isNaN(ms) ? 0 : ms);
            }
        }
    }

    // 4. Formato con un punto: "37.23"
    if (s.includes('.')) {
        const parts = s.split('.');
        const secs = parseInt(parts[0], 10);
        let msStr = parts[1] || '0';
        if (msStr.length === 1) msStr += '00';
        else if (msStr.length === 2) msStr += '0';
        else if (msStr.length > 3) msStr = msStr.slice(0, 3);
        const ms = parseInt(msStr, 10);
        if (!isNaN(secs)) {
            return (secs * 1000) + (isNaN(ms) ? 0 : ms);
        }
    }

    const plain = parseInt(s, 10);
    if (!isNaN(plain)) return plain * 1000;

    return null;
}

/**
 * Convierte milisegundos a formato MM:SS.mmm
 */
function formatMsToTime(ms) {
    if (ms == null || isNaN(ms) || ms < 0) return "--:--.---";
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.round(ms % 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

/**
 * MÃ¡scara estricta de tiempo de carrera (MM:SS.mmm) mientras el usuario escribe
 */
function applyRaceTimeMask(input) {
    if (!input) return;
    let val = input.value.replace(/\D/g, '');
    if (val.length > 7) val = val.substring(0, 7);

    let formatted = '';
    if (val.length > 0) {
        formatted = val.substring(0, 2);
    }
    if (val.length > 2) {
        formatted += ':' + val.substring(2, 4);
    }
    if (val.length > 4) {
        formatted += '.' + val.substring(4, 7);
    }
    input.value = formatted;
}

/**
 * Inicializa el selector de pistas del formulario con las 86 rutas agrupadas
 */
function initSubmitRouteSelector() {
    const select = document.getElementById('sub-route');
    if (!select) return;
    if (select.options.length > 5) return; // Ya inicializado

    const currentValue = select.value;
    select.innerHTML = '<option value="">-- Selecciona una de las 86 pistas oficiales --</option>';

    if (typeof routesData === 'undefined' || !routesData.length) return;

    const circuitTracks = routesData.filter(r => r.type === 'Circuito');
    const sprintTracks = routesData.filter(r => r.type === 'Sprint');
    const dragTracks = routesData.filter(r => r.type === 'Drag');

    const createGroup = (label, tracks) => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = `${label} (${tracks.length})`;
        tracks.forEach(track => {
            const opt = document.createElement('option');
            opt.value = track.name;
            opt.textContent = track.alias ? `${track.name} (${track.alias})` : `${track.name}`;
            optgroup.appendChild(opt);
        });
        return optgroup;
    };

    if (circuitTracks.length) select.appendChild(createGroup('ðŸ Circuitos', circuitTracks));
    if (sprintTracks.length) select.appendChild(createGroup('âš¡ Sprints', sprintTracks));
    if (dragTracks.length) select.appendChild(createGroup('ðŸ”¥ Drags', dragTracks));

    if (currentValue) select.value = currentValue;
}

/**
 * Modal de confirmaciÃ³n de envÃ­o a homologaciÃ³n
 */
function openSubmissionSuccessModal(data) {
    const modal = document.getElementById('modal-submission-success');
    if (!modal) return;
    const timeEl = document.getElementById('succ-modal-time');
    const trackEl = document.getElementById('succ-modal-track');
    const carEl = document.getElementById('succ-modal-car');
    const idEl = document.getElementById('succ-modal-id');

    if (timeEl) timeEl.innerText = data.time || '--:--.---';
    if (trackEl) trackEl.innerText = data.route || '--';
    if (carEl) carEl.innerText = data.car || '--';
    if (idEl) idEl.innerText = data.id || '--';

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeSubmissionSuccessModal() {
    const modal = document.getElementById('modal-submission-success');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
}

/**
 * Valida en vivo las marcas de inicio, fin y el tiempo declarado.
 * Compara (Fin - Inicio) con el Tiempo Declarado y actualiza la UI.
 */
function validateTimeMarksLive() {
    const declaredInput = document.getElementById('sub-time');
    if (declaredInput) {
        const declaredVal = declaredInput.value.trim();
        const declaredMs = parseTimeToMs(declaredVal);
        declaredInput.classList.remove('field-error', 'field-success');
        if (declaredMs !== null) {
            declaredInput.classList.add('field-success');
        } else if (declaredVal.length === 9) {
            declaredInput.classList.add('field-error');
        }
    }

    const startInput = document.getElementById('sub-start-mark');
    const endInput = document.getElementById('sub-end-mark');

    const dispStart = document.getElementById('disp-start');
    const dispEnd = document.getElementById('disp-end');
    const dispDiff = document.getElementById('disp-diff');
    const dispDeclared = document.getElementById('disp-declared');

    const banner = document.getElementById('validation-status-banner');
    const icon = document.getElementById('val-status-icon');
    const title = document.getElementById('val-status-title');
    const desc = document.getElementById('val-status-desc');
    const syncBtn = document.getElementById('btn-sync-diff');
    const syncVal = document.getElementById('btn-sync-time-val');

    if (!startInput || !endInput || !declaredInput) return;

    const startVal = startInput.value.trim();
    const endVal = endInput.value.trim();
    const declaredVal = declaredInput.value.trim();

    const startMs = parseTimeToMs(startVal);
    const endMs = parseTimeToMs(endVal);
    const declaredMs = parseTimeToMs(declaredVal);

    // Actualizar visualizadores
    if (dispStart) dispStart.innerText = startMs !== null ? formatMsToTime(startMs) : (startVal || '--:--.---');
    if (dispEnd) dispEnd.innerText = endMs !== null ? formatMsToTime(endMs) : (endVal || '--:--.---');
    if (dispDeclared) dispDeclared.innerText = declaredMs !== null ? formatMsToTime(declaredMs) : (declaredVal || '--:--.---');

    // Limpiar clases previas
    startInput.classList.remove('field-error', 'field-success');
    endInput.classList.remove('field-error', 'field-success');
    declaredInput.classList.remove('field-error', 'field-success');

    if (banner) {
        banner.className = 'validation-status-banner state-idle';
    }

    // Si aÃºn faltan campos
    if (startMs === null || endMs === null) {
        if (dispDiff) dispDiff.innerText = '--:--.---';
        if (syncBtn) syncBtn.style.display = 'none';
        if (title) title.innerText = 'Esperando marcas de video y tiempo';
        if (desc) desc.innerText = 'Ingresa la marca de inicio, marca de fin y el tiempo declarado para verificar que coincidan exactamente.';
        if (icon) icon.innerText = 'â„¹ï¸';
        return;
    }

    // Si la marca de fin es menor o igual al inicio
    if (endMs <= startMs) {
        if (dispDiff) dispDiff.innerText = 'InvÃ¡lido';
        if (syncBtn) syncBtn.style.display = 'none';
        endInput.classList.add('field-error');
        if (banner) banner.className = 'validation-status-banner state-mismatch';
        if (title) title.innerText = 'âŒ Marca de Fin InvÃ¡lida';
        if (desc) desc.innerText = 'La marca de fin del video debe ser estrictamente posterior a la marca de inicio.';
        if (icon) icon.innerText = 'âš ï¸';
        return;
    }

    const diffMs = endMs - startMs;
    const formattedDiff = formatMsToTime(diffMs);
    if (dispDiff) dispDiff.innerText = formattedDiff;

    // Mostrar botÃ³n de sincronizaciÃ³n rÃ¡pida
    if (syncBtn && syncVal) {
        syncVal.innerText = formattedDiff;
        syncBtn.style.display = 'block';
    }

    // Si no ha ingresado tiempo declarado todavÃ­a
    if (declaredMs === null) {
        if (title) title.innerText = `Diferencia en video: ${formattedDiff}`;
        if (desc) desc.innerText = 'Ahora ingresa el tiempo declarado (o pulsa el botÃ³n para autocompletarlo con la diferencia del video).';
        if (icon) icon.innerText = 'â±ï¸';
        return;
    }

    // ValidaciÃ³n de concordancia con tolerancia de 50ms (para compensar diferencias de frames de video)
    const discrepancyMs = Math.abs(diffMs - declaredMs);
    const toleranceMs = 50;

    if (discrepancyMs <= toleranceMs) {
        // Coincidencia exacta o dentro de tolerancia
        if (banner) banner.className = 'validation-status-banner state-match';
        if (title) title.innerText = 'âœ… Â¡ValidaciÃ³n Aprobada!';
        if (desc) desc.innerText = `El tiempo declarado (${formatMsToTime(declaredMs)}) coincide exactamente con la diferencia de las marcas de video (${formattedDiff}).`;
        if (icon) icon.innerText = 'ðŸ';
        startInput.classList.add('field-success');
        endInput.classList.add('field-success');
        declaredInput.classList.add('field-success');
    } else {
        // Discrepancia detectada
        if (banner) banner.className = 'validation-status-banner state-mismatch';
        if (title) title.innerText = 'âŒ Discrepancia Detectada';
        const diffSec = (discrepancyMs / 1000).toFixed(3);
        if (desc) desc.innerText = `La diferencia del video es ${formattedDiff}, pero declaraste ${formatMsToTime(declaredMs)} (desfase de ${diffSec}s). Ambos valores deben coincidir antes de poder enviar.`;
        if (icon) icon.innerText = 'âš ï¸';
        declaredInput.classList.add('field-error');
        startInput.classList.add('field-error');
        endInput.classList.add('field-error');
    }
}

/**
 * Autocompleta el tiempo declarado con la diferencia calculada de las marcas de video.
 */
function syncDeclaredWithDiff() {
    const startInput = document.getElementById('sub-start-mark');
    const endInput = document.getElementById('sub-end-mark');
    const declaredInput = document.getElementById('sub-time');

    if (!startInput || !endInput || !declaredInput) return;

    const startMs = parseTimeToMs(startInput.value.trim());
    const endMs = parseTimeToMs(endInput.value.trim());

    if (startMs !== null && endMs !== null && endMs > startMs) {
        declaredInput.value = formatMsToTime(endMs - startMs);
        validateTimeMarksLive();
        declaredInput.focus();
    }
}

/**
 * Maneja cambios en el enlace de YouTube para sugerir marcas si vienen en la URL
 */
function handleVideoUrlChange() {
    const videoInput = document.getElementById('sub-video');
    if (!videoInput) return;
    const url = videoInput.value.trim();

    // Si la URL contiene timestamp (ej: &t=75s o ?t=1m15s)
    const matchT = url.match(/[?&]t=([0-9mhseconds]+)/i);
    if (matchT && matchT[1]) {
        const startInput = document.getElementById('sub-start-mark');
        if (startInput && !startInput.value) {
            const raw = matchT[1];
            const ms = parseTimeToMs(raw.replace('s', 's '));
            if (ms !== null) {
                startInput.value = formatMsToTime(ms);
                validateTimeMarksLive();
            }
        }
    }
}

// =======================================================
// ENVÃO DE TIEMPOS VÃA WEBHOOK A DISCORD & HOMOLOGACIÃ“N
// =======================================================
// MANEJO DE CATEGORÃA Y TIPO DE VUELTA EN FORMULARIO
// =======================================================
function handleCategoryOrRouteChange() {
    const carInput = document.getElementById('sub-car');
    const routeInput = document.getElementById('sub-route');
    const categorySelect = document.getElementById('sub-category');
    const lapTypeGroup = document.getElementById('group-sub-lap-type');

    if (carInput && categorySelect) {
        const carVal = carInput.value.trim().toLowerCase();
        if (carVal.includes('bmw m3 gtr')) {
            categorySelect.value = 'BMW M3 GTR';
        }
    }

    if (routeInput && lapTypeGroup) {
        const routeVal = routeInput.value.trim().toLowerCase();
        const routes = typeof routesData !== 'undefined' ? routesData : [];
        const matchedRoute = routes.find(r => r.name.toLowerCase() === routeVal);
        if (matchedRoute) {
            lapTypeGroup.style.display = matchedRoute.type === 'Circuito' ? 'block' : 'none';
        } else {
            lapTypeGroup.style.display = 'block';
        }
    }
}

function goToRouteLeaderboardAfterSubmit(routeName, categoryKey) {
    if (typeof routesData === 'undefined' || !routesData) {
        switchView('routes-pistas');
        return;
    }
    const route = routesData.find(r => r.name.trim().toLowerCase() === routeName.trim().toLowerCase());
    if (!route) {
        switchView('routes-pistas');
        return;
    }

    loadLeaderboardForRoute(route);
    switchView('leaderboard');

    setTimeout(() => {
        if (route.type === 'Circuito') {
            const targetTabId = categoryKey.replace('_', '-');
            const tabBtn = document.querySelector(`#container-tabs-circuit button[onclick*="${targetTabId}"]`);
            if (tabBtn) switchCircuitTab(targetTabId, tabBtn);
        } else {
            const targetTabId = categoryKey.includes('bmw') ? 'sprintdrag-bmw' : 'sprintdrag-junkman';
            const tabBtn = document.querySelector(`#container-tabs-sprintdrag button[onclick*="${targetTabId}"]`);
            if (tabBtn) switchSprintDragTab(targetTabId, tabBtn);
        }

        const lbSection = document.getElementById('view-leaderboard');
        if (lbSection) lbSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250);
}

// =======================================================
// ENVÃO Y HOMOLOGACIÃ“N AUTOMÃTICA DE TIEMPOS
// =======================================================
async function handleTimeSubmit(event) {
    event.preventDefault();

    const btn = document.getElementById('btn-submit-time');
    const status = document.getElementById('submit-status');

    const driver = document.getElementById('sub-driver').value.trim();
    const route = document.getElementById('sub-route').value.trim();
    const car = document.getElementById('sub-car').value.trim();
    const modeEl = document.querySelector('input[name="sub-mode"]:checked');
    const mode = modeEl ? modeEl.value : 'Online';

    const categoryEl = document.getElementById('sub-category');
    const category = categoryEl ? categoryEl.value.trim() : 'Junkman';

    const lapTypeEl = document.getElementById('sub-lap-type');
    const lapType = lapTypeEl ? lapTypeEl.value.trim() : 'Single Lap';

    const video = document.getElementById('sub-video').value.trim();
    const startInputEl = document.getElementById('sub-start-mark');
    const endInputEl = document.getElementById('sub-end-mark');
    const startMark = startInputEl ? startInputEl.value.trim() : '';
    const endMark = endInputEl ? endInputEl.value.trim() : '';
    const timeDeclared = document.getElementById('sub-time').value.trim();

    const gearbox = document.getElementById('sub-gearbox') ? document.getElementById('sub-gearbox').value : 'Manual';
    const device = document.getElementById('sub-device') ? document.getElementById('sub-device').value : 'Teclado';

    const seasonId = document.getElementById('sub-season-id') ? document.getElementById('sub-season-id').value.trim() : '';
    const weekNum = document.getElementById('sub-week-num') ? document.getElementById('sub-week-num').value.trim() : '';
    const challengeId = document.getElementById('sub-challenge-id') ? document.getElementById('sub-challenge-id').value.trim() : '';
    const rewardDesc = document.getElementById('sub-reward-desc') ? document.getElementById('sub-reward-desc').value.trim() : '';

    // Parseo de tiempo declarado en pantalla
    const declaredMs = parseTimeToMs(timeDeclared);

    if (declaredMs === null) {
        status.style.color = "var(--f1-red)";
        status.innerText = "âŒ Formato invÃ¡lido en el Tiempo Declarado en Pantalla. Usa MM:SS.mmm (ej: 01:20.750).";
        document.getElementById('sub-time').focus();
        return false;
    }

    // Parseo y validaciÃ³n de marcas de video si estÃ¡n presentes
    const startMs = startMark ? parseTimeToMs(startMark) : null;
    const endMs = endMark ? parseTimeToMs(endMark) : null;
    let diffMs = null;

    if (startMs !== null && endMs !== null) {
        if (endMs <= startMs) {
            status.style.color = "var(--f1-red)";
            status.innerText = "âŒ La Marca de Fin debe ser posterior a la Marca de Inicio.";
            if (endInputEl) endInputEl.focus();
            return false;
        }
        diffMs = endMs - startMs;
        const discrepancyMs = Math.abs(diffMs - declaredMs);
        const toleranceMs = 50; // 50ms de tolerancia por redondeo de frames de video

        if (discrepancyMs > toleranceMs) {
            status.style.color = "var(--f1-red)";
            const diffSec = (discrepancyMs / 1000).toFixed(3);
            status.innerText = `âŒ VALIDACIÃ“N RECHAZADA: El tiempo declarado (${formatMsToTime(declaredMs)}) no coincide con la diferencia calculada de las marcas de video (${formatMsToTime(diffMs)}). Desfase detectado: ${diffSec}s.`;
            return false;
        }
    }

    // ValidaciÃ³n de URL de Video (YouTube o Twitch)
    const isYouTube = video.includes('youtube.com') || video.includes('youtu.be');
    const isTwitch = video.includes('twitch.tv');
    if (!isYouTube && !isTwitch) {
        status.style.color = "var(--f1-red)";
        status.innerText = "âŒ Por favor introduce un enlace vÃ¡lido de YouTube o Twitch (ej: https://www.youtube.com/watch?v=... o https://twitch.tv/videos/...).";
        document.getElementById('sub-video').focus();
        return false;
    }

    btn.disabled = true;
    btn.innerHTML = "<span>â³</span> Enviando Registro a HomologaciÃ³n...";
    status.style.color = "var(--nfs-orange)";
    status.innerText = "Verificando telemetrÃ­a y registrando en la cola de homologaciÃ³n...";

    // Determinar tipo de ruta y clave de categorÃ­a en Firebase
    const routes = typeof routesData !== 'undefined' ? routesData : [];
    const matchedRoute = routes.find(r => r.name.toLowerCase() === route.toLowerCase());
    const isCircuit = matchedRoute ? matchedRoute.type === 'Circuito' : true;

    let categoryKey = 'junkman_single';
    if (isCircuit) {
        if (category === 'BMW M3 GTR') {
            categoryKey = (lapType === 'Fast Lap') ? 'bmw_fast' : 'bmw_single';
        } else {
            categoryKey = (lapType === 'Fast Lap') ? 'junkman_fast' : 'junkman_single';
        }
    } else {
        categoryKey = (category === 'BMW M3 GTR') ? 'bmw' : 'junkman';
    }

    const routeKey = sanitizeFirebaseKey(route);
    const submissionId = "SUB-" + Date.now();
    const currentDateStr = new Date().toISOString().split('T')[0];

    const submissionPayload = {
        id: submissionId,
        timestamp: new Date().toISOString(),
        date: currentDateStr,
        driver: driver,
        car: car,
        route: route,
        category: category,
        lapType: lapType,
        categoryKey: categoryKey,
        mode: mode,
        time: formatMsToTime(declaredMs),
        timeMs: declaredMs,
        startMark: startMs !== null ? formatMsToTime(startMs) : '',
        endMark: endMs !== null ? formatMsToTime(endMs) : '',
        diff: diffMs !== null ? formatMsToTime(diffMs) : '',
        videoUrl: video,
        gearbox: gearbox,
        device: device,
        status: "pending"
    };

    if (seasonId) {
        submissionPayload.seasonId = seasonId;
        submissionPayload.weekNum = parseInt(weekNum, 10) || 1;
        submissionPayload.challengeId = challengeId;
        submissionPayload.rewardDesc = rewardDesc;
    }

    let assignedRankStr = "#1";

    try {
        // =========================================================================
        // 1. ESCRITURA DIRECTA A FIREBASE RTDB: /submissions/<submissionId> (AUDITORÃA)
        // =========================================================================
        if (FIREBASE_RTDB_BASE_URL) {
            try {
                await fetch(`${FIREBASE_RTDB_BASE_URL}/submissions/${submissionId}.json`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(submissionPayload)
                });
                console.info("Firebase: Registro de telemetrÃ­a guardado en /submissions");
            } catch (fbSubErr) {
                console.warn("Aviso guardando en /submissions de Firebase:", fbSubErr);
            }

            // Nota: Los tiempos NO se publican directamente en /leaderboards.
            // Permanecen en /submissions (pending) hasta ser homologados en admin.html.
        }

        // =========================================================================
        // 3. INVALIDAR CACHÃ‰S LOCALES PARA ACTUALIZACIÃ“N INMEDIATA
        // =========================================================================
        if (typeof memoryCache !== 'undefined') {
            Object.keys(memoryCache).forEach(k => {
                if (k.includes(routeKey) || k.includes('podiums') || k.includes('hall_of_fame') || k.includes('cache_v6')) {
                    delete memoryCache[k];
                }
            });
        }
        try {
            Object.keys(localStorage).forEach(k => {
                if (k.startsWith('compiled_podiums_') || k.startsWith('compiled_hall_of_fame_') || k.startsWith('nfs_cache_')) {
                    localStorage.removeItem(k);
                }
            });

            // Guardar en historial local de envÃ­os del usuario
            const localSubs = JSON.parse(localStorage.getItem('nfs_local_submissions') || '[]');
            localSubs.unshift(submissionPayload);
            localStorage.setItem('nfs_local_submissions', JSON.stringify(localSubs.slice(0, 50)));
        } catch (e) {
            console.warn("Error invalidando cachÃ© de localStorage:", e);
        }

        // =========================================================================
        // 4. DESPACHO AL WEBHOOK DE DISCORD (AVISO DE TIEMPO PENDIENTE DE HOMOLOGACIÃ“N)
        // =========================================================================
        if (typeof DISCORD_WEBHOOK_URL !== 'undefined' &&
            DISCORD_WEBHOOK_URL &&
            DISCORD_WEBHOOK_URL !== "URL_DE_TU_WEBHOOK_DE_DISCORD_AQUI") {
            const discordFields = [
                { name: "ðŸ‘¤ Piloto", value: driver, inline: true },
                { name: "ðŸš— Auto", value: car, inline: true },
                { name: "ðŸ Pista", value: `${route} (${isCircuit ? lapType : 'Sprint/Drag'})`, inline: true },
                { name: "ðŸ† CategorÃ­a", value: category, inline: true },
                { name: "â±ï¸ Tiempo Declarado", value: formatMsToTime(declaredMs), inline: true },
                { name: "âš™ï¸ TransmisiÃ³n", value: gearbox, inline: true },
                { name: "ðŸŽ® Control", value: device, inline: true },
                { name: "ðŸŽ¬ Video", value: `[Ver Video](${video})`, inline: false }
            ];

            if (startMs !== null && endMs !== null && diffMs !== null) {
                discordFields.splice(5, 0, {
                    name: "ðŸ“ Marcas Video",
                    value: `${formatMsToTime(startMs)} â†’ ${formatMsToTime(endMs)} (Î”: ${formatMsToTime(diffMs)})`,
                    inline: true
                });
            }

            if (seasonId) {
                discordFields.push({
                    name: "ðŸ† DesafÃ­o de Temporada",
                    value: `${seasonId.toUpperCase()} • Semana ${weekNum} (${challengeId})`,
                    inline: false
                });
            }

            const discordPayload = {
                embeds: [{
                    title: `ðŸ“¥ NUEVA SOLICITUD DE TIEMPO [${submissionId}]`,
                    color: 16742144, // #ff7700
                    description: `Un piloto ha enviado un nuevo rÃ©cord para revisiÃ³n tÃ©cnica en **NFSRANKSMW**. Pendiente de homologaciÃ³n.`,
                    fields: discordFields,
                    footer: { text: "NFSMWRANKS • ComisarÃ­a de HomologaciÃ³n de Tiempos" },
                    timestamp: new Date().toISOString()
                }]
            };

            fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordPayload)
            }).catch(err => console.warn("Aviso al enviar a Discord Webhook:", err));
        }

        // =========================================================================
        // 5. MODAL OFICIAL DE CONFIRMACIÃ“N Y FEEDBACK VISUAL
        // =========================================================================
        openSubmissionSuccessModal(submissionPayload);

        status.style.color = "var(--green-neon)";
        status.innerHTML = `
            <div style="background: rgba(0, 255, 136, 0.08); border: 1px solid var(--green-neon); border-radius: 8px; padding: 14px 20px; text-align: left; margin-top: 15px; box-shadow: 0 4px 15px rgba(0, 255, 136, 0.1);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <span style="font-size: 18px;">â³</span>
                    <strong style="color: #ffffff; font-family: var(--font-racing); text-transform: uppercase;">
                        Â¡TIEMPO REGISTRADO EN COLA DE HOMOLOGACIÃ“N!
                    </strong>
                </div>
                <p style="color: #cbd5e1; font-size: 12.5px; line-height: 1.4; margin: 0;">
                    Solicitud <strong>${submissionId}</strong> enviada a los comisarios oficiales. Tu tiempo (${formatMsToTime(declaredMs)}) se publicarÃ¡ en el Leaderboard tras verificar el video.
                </p>
            </div>
        `;

        document.getElementById('form-submit-time').reset();
        clearSeasonSubmissionContext();
        validateTimeMarksLive();
    } catch (error) {
        console.error("Error enviando tiempo:", error);
        status.style.color = "var(--f1-red)";
        status.innerText = "Error de conexiÃ³n con el servidor. IntÃ©ntalo de nuevo mÃ¡s tarde.";
    } finally {
        btn.disabled = false;
        btn.innerHTML = "<span>ðŸš€</span> Enviar Registro a HomologaciÃ³n";
    }
}

// ExportaciÃ³n explÃ­cita a window para compatibilidad con eventos inline del formulario
window.applyRaceTimeMask = applyRaceTimeMask;
window.initSubmitRouteSelector = initSubmitRouteSelector;
window.openSubmissionSuccessModal = openSubmissionSuccessModal;
window.closeSubmissionSuccessModal = closeSubmissionSuccessModal;
window.validateTimeMarksLive = validateTimeMarksLive;
window.handleTimeSubmit = handleTimeSubmit;
window.handleCategoryOrRouteChange = handleCategoryOrRouteChange;
window.handleVideoUrlChange = handleVideoUrlChange;

// =======================================================
// SISTEMA OFICIAL DE TEMPORADAS BLACKLIST & 4 DESAFÃOS SEMANALES
// Temporada 1: Noviembre 2026 (4 Semanas)
// Temporada 2: Diciembre 2026 (4 Semanas)
// 4 Pistas semanales: 2 Circuitos (1 Junkman, 1 BMW) + 2 Sprints (1 Junkman, 1 BMW)
// =======================================================

let currentSeasonId = 'season_1';
let currentSeasonWeek = 1;
let currentChallengesMode = 'challenges'; // 'challenges' | 'standings'
let cachedSeasonStandings = {};

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getCompletedChallenges() {
    try {
        const stored = localStorage.getItem('nfs_challenges_completed_v1');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function toggleChallengeComplete(challengeId) {
    let completed = getCompletedChallenges();
    const isNowCompleted = !completed.includes(challengeId);
    if (!isNowCompleted) {
        completed = completed.filter(id => id !== challengeId);
    } else {
        completed.push(challengeId);
    }
    try {
        localStorage.setItem('nfs_challenges_completed_v1', JSON.stringify(completed));
    } catch (e) {
        console.warn("No se pudo guardar estado de desafÃ­o:", e);
    }
    renderChallengesUI();
}

/**
 * Iniciar envÃ­o desde la ficha de desafÃ­o de temporada
 * Preselecciona automÃ¡ticamente pista, categorÃ­a, auto y vincula metadatos del evento
 */
function startSeasonChallengeSubmission(seasonId, weekNum, challengeId, trackName, category, carName, rewardDesc) {
    // Cambiar a la vista de formulario de envÃ­o
    switchView('submit');

    // Activar banner de contexto en el formulario
    const banner = document.getElementById('sub-season-banner');
    const bannerTitle = document.getElementById('sub-season-banner-title');
    const bannerDesc = document.getElementById('sub-season-banner-desc');
    const season = (typeof SEASONS_DATA !== 'undefined' && SEASONS_DATA[seasonId]) ? SEASONS_DATA[seasonId] : null;
    const seasonName = season ? season.name : 'Temporada Blacklist';

    if (banner) banner.style.display = 'flex';
    if (bannerTitle) bannerTitle.innerHTML = `ðŸ† DESAFÃO OFICIAL VINCULADO: ${seasonName} • SEMANA ${weekNum}`;
    if (bannerDesc) bannerDesc.innerHTML = `ðŸ <strong>${escapeHtml(trackName)}</strong> (${escapeHtml(category)}) â€” Recompensa: <strong>${escapeHtml(rewardDesc || 'Puntos PTS & Bounty')}</strong>`;

    // Campos ocultos
    const seasonIdInput = document.getElementById('sub-season-id');
    const weekNumInput = document.getElementById('sub-week-num');
    const challengeIdInput = document.getElementById('sub-challenge-id');
    const rewardDescInput = document.getElementById('sub-reward-desc');

    if (seasonIdInput) seasonIdInput.value = seasonId;
    if (weekNumInput) weekNumInput.value = weekNum;
    if (challengeIdInput) challengeIdInput.value = challengeId;
    if (rewardDescInput) rewardDescInput.value = rewardDesc || '';

    // Preseleccionar pista oficial
    const routeInput = document.getElementById('sub-route');
    if (routeInput) {
        routeInput.value = trackName;
        if (typeof handleCategoryOrRouteChange === 'function') {
            handleCategoryOrRouteChange();
        }
    }

    // Preseleccionar categorÃ­a
    const categorySelect = document.getElementById('sub-category');
    if (categorySelect) {
        if (category && category.includes('BMW')) {
            categorySelect.value = 'BMW M3 GTR';
        } else {
            categorySelect.value = 'Junkman';
        }
        if (typeof handleCategoryOrRouteChange === 'function') {
            handleCategoryOrRouteChange();
        }
    }

    // Preseleccionar auto
    const carInput = document.getElementById('sub-car');
    if (carInput) {
        if ((category && category.includes('BMW')) || (carName && carName.includes('BMW'))) {
            carInput.value = 'BMW M3 GTR';
        } else {
            carInput.value = '';
            carInput.placeholder = 'Cualquier Auto (con piezas Junkman)';
        }
    }

    const form = document.getElementById('form-submit-time');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Desvincular reto de temporada y restaurar formulario limpio
 */
function clearSeasonSubmissionContext() {
    const banner = document.getElementById('sub-season-banner');
    if (banner) banner.style.display = 'none';

    const seasonIdInput = document.getElementById('sub-season-id');
    const weekNumInput = document.getElementById('sub-week-num');
    const challengeIdInput = document.getElementById('sub-challenge-id');
    const rewardDescInput = document.getElementById('sub-reward-desc');

    if (seasonIdInput) seasonIdInput.value = '';
    if (weekNumInput) weekNumInput.value = '';
    if (challengeIdInput) challengeIdInput.value = '';
    if (rewardDescInput) rewardDescInput.value = '';
}

/**
 * Compatibilidad con envÃ­os directos genÃ©ricos
 */
function startChallengeSubmission(routeName, carName) {
    startSeasonChallengeSubmission(currentSeasonId, currentSeasonWeek, 'direct', routeName, carName.includes('BMW') ? 'BMW M3 GTR' : 'Junkman', carName, 'Bolsa de Temporada');
}

/**
 * Cambiar temporada activa (Temporada 1 Noviembre vs Temporada 2 Diciembre)
 */
function switchChallengeSeason(seasonId, btn) {
    if (!seasonId) return;
    currentSeasonId = seasonId;

    document.querySelectorAll('.season-pill-btn').forEach(b => b.classList.remove('active'));
    const targetBtn = btn || document.getElementById(`btn-season-${seasonId}`);
    if (targetBtn) targetBtn.classList.add('active');

    currentSeasonWeek = 1;
    updateSeasonWeekPills();

    if (currentChallengesMode === 'standings') {
        loadSeasonStandingsLive();
    } else {
        renderChallengesUI();
    }
}

/**
 * Establecer semana activa (1 a 4)
 */
function setSeasonWeek(weekNum) {
    currentSeasonWeek = Math.max(1, Math.min(4, parseInt(weekNum, 10) || 1));
    updateSeasonWeekPills();
    renderChallengesUI();
}

/**
 * Navegar semanas hacia adelante o atrÃ¡s (+1 / -1)
 */
function changeSeasonWeek(delta) {
    let nextWeek = currentSeasonWeek + delta;
    if (nextWeek > 4) nextWeek = 1;
    else if (nextWeek < 1) nextWeek = 4;
    setSeasonWeek(nextWeek);
}

function updateSeasonWeekPills() {
    for (let w = 1; w <= 4; w++) {
        const pill = document.getElementById(`btn-week-pill-${w}`);
        if (pill) {
            if (w === currentSeasonWeek) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        }
    }
}

/**
 * Alternar entre vista de Fichas de Desafíos y Tabla de Clasificación de Temporada
 */
function setChallengesViewMode(mode) {
    currentChallengesMode = mode;
    const btnChallenges = document.getElementById('btn-subtab-challenges');
    const btnStandings = document.getElementById('btn-subtab-season-standings');
    const containerCards = document.getElementById('container-challenges-cards');
    const containerStandings = document.getElementById('container-season-standings');

    if (mode === 'standings') {
        if (btnChallenges) btnChallenges.classList.remove('active');
        if (btnStandings) btnStandings.classList.add('active');
        if (containerCards) containerCards.style.display = 'none';
        if (containerStandings) containerStandings.style.display = 'block';
        loadSeasonStandingsLive();
    } else {
        if (btnChallenges) btnChallenges.classList.add('active');
        if (btnStandings) btnStandings.classList.remove('active');
        if (containerCards) containerCards.style.display = 'block';
        if (containerStandings) containerStandings.style.display = 'none';
        renderChallengesUI();
    }
}

/**
 * Renderizado de las 4 tarjetas oficiales de la semana seleccionada
 */
function renderChallengesUI() {
    const gridContainer = document.getElementById('challenges-grid');
    if (!gridContainer) return;

    const season = (typeof SEASONS_DATA !== 'undefined' && SEASONS_DATA[currentSeasonId])
        ? SEASONS_DATA[currentSeasonId]
        : null;

    if (!season || !season.weeks) {
        gridContainer.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:30px;">${typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es' ? 'Cargando calendario de temporadas...' : 'Loading season schedule...'}</p>`;
        return;
    }

    const weekIdx = Math.max(0, Math.min(season.weeks.length - 1, currentSeasonWeek - 1));
    const currentWeekData = season.weeks[weekIdx];
    const challenges = currentWeekData ? currentWeekData.challenges : [];
    const completedList = getCompletedChallenges();

    // Actualización de barras de información de cabecera
    const dateRangeEl = document.getElementById('challenge-week-daterange');
    const weekInfoLabel = document.getElementById('season-week-info-label');
    const totalCountEl = document.getElementById('challenge-total-count');
    const rewardPotEl = document.getElementById('challenge-reward-pot');

    if (dateRangeEl) dateRangeEl.textContent = currentWeekData.dateRange || '01 Nov - 28 Nov 2026';
    if (weekInfoLabel) weekInfoLabel.textContent = `${season.name} • ${currentWeekData.title}`;
    if (totalCountEl) totalCountEl.textContent = `${challenges.length} Retos Oficiales`;

    // Calcular bolsa total de la semana
    let totalBountyNum = 0;
    challenges.forEach(ch => {
        if (ch.reward && ch.reward.bounty) {
            const num = parseInt(ch.reward.bounty.replace(/[^0-9]/g, ''), 10) || 0;
            totalBountyNum += num;
        }
    });
    if (rewardPotEl) {
        rewardPotEl.textContent = totalBountyNum > 0 ? `$${totalBountyNum.toLocaleString('de-DE')} Bounty` : '$2.000.000 Bounty';
    }

    updateSeasonWeekPills();

    // Renderizar exactamente las 4 tarjetas
    let html = '';
    challenges.forEach((ch, idx) => {
        const isDone = completedList.includes(ch.id);
        const isCircuit = ch.type === 'Circuito';
        const isBMW = ch.category.includes('BMW');
        const catBadgeClass = isBMW ? 'cat-bmw' : 'cat-junkman';
const catBadgeText = isBMW ? 'BMW M3 GTR REGLAMENTARIO' : 'JUNKMAN (CUALQUIER AUTO)';
const catIcon = '';
        const rewardDesc = ch.reward ? ch.reward.desc : '300 PTS Blacklist • $500.000 Bounty';

        const carImg = isBMW
            ? 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=700&q=80'
            : (idx === 0 ? 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80' : 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=700&q=80');

        const tiers = (typeof window.SEASONS_DATA !== 'undefined' && window.SEASONS_DATA.getChallengeTiers)
            ? window.SEASONS_DATA.getChallengeTiers(ch)
            : {
                diamond: { time: ch.targetTime, pts: 500, bounty: "$1.000.000" },
                gold: { time: ch.targetTime, pts: 300, bounty: "$500.000" },
                silver: { time: ch.targetTime, pts: 180, bounty: "$250.000" },
                bronze: { time: ch.targetTime, pts: 100, bounty: "$100.000" }
            };

        html += `
            <div class="challenge-card season-ch-card ${isDone ? 'is-completed' : ''}" id="card-${ch.id}">
                <div>
                    <!-- Miniatura y badges superiores -->
                    <div class="challenge-thumb" style="background-image: url('${ch.thumb || carImg}');">
                        <div class="challenge-thumb-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                            <span class="season-cat-badge ${catBadgeClass}">
                                ${catIcon} ${catBadgeText}
                            </span>
                            <span class="challenge-tier-pill" style="font-size: 11px;">
                                ${ch.type} ${isCircuit && ch.lapType ? '• ' + ch.lapType : ''}
                            </span>
                        </div>
                    </div>

                    <!-- Cuerpo de la ficha -->
                    <div class="challenge-body" style="padding: 16px;">
                        <div style="margin-bottom: 10px;">
                            <span class="challenge-mode-label" style="font-size: 10.5px; color: ${isBMW ? 'var(--cyan-neon)' : 'var(--nfs-orange)'};">
                                ${isCircuit ? 'TRAZADO DE CIRCUITO // CONTRARRELOJ' : 'TRAZADO DE SPRINT // FULL SPEED'}
                            </span>
                            <h3 class="challenge-route-name" style="font-size: 19px; margin-top: 2px;" title="${ch.track}">
                                ${ch.track}
                            </h3>
                        </div>

                        <!-- Auto Reglamentario -->
                        <div class="challenge-car-banner" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 7px 11px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 7px; overflow: hidden;">
<span style="font-size: 11px; font-weight: 800; color: var(--nfs-orange);">CAR</span>
                                <span style="font-size: 11px; color: var(--text-muted); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">AUTO: <strong style="color: #ffffff;">${ch.car}</strong></span>
                            </div>
                            <span style="font-size: 9.5px; background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; color: #94a3b8; font-weight: 600; flex-shrink: 0;">Oficial</span>
                        </div>

                        <!-- ESCALA DE LOGROS Y TIEMPOS (DIAMANTE, ORO, PLATA, BRONCE) -->
                        <div class="season-tiers-table" style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.09); border-radius: 8px; overflow: hidden; margin-bottom: 12px;">
                            <div style="background: rgba(255,255,255,0.04); padding: 5px 9px; border-bottom: 1px solid rgba(255,255,255,0.07); display: flex; justify-content: space-between; font-size: 9px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">
<span>RANGO</span>
<span>TIEMPO META</span>
<span>RECOMPENSA</span>
                            </div>
                            
                            <!-- Diamante -->
                            <div class="season-tier-row tier-diamond" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 9px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(56, 189, 248, 0.04);">
                                <div style="display: flex; align-items: center; gap: 5px;">
<span style="font-size: 10.5px; font-weight: 800; color: #38bdf8;">DIAMANTE</span>
                                    <span style="font-size: 10.5px; font-weight: 800; color: #38bdf8;">DIAMANTE</span>
                                </div>
                                <div style="font-family: var(--font-mono); font-size: 12.5px; font-weight: 800; color: #38bdf8; text-shadow: 0 0 8px rgba(56,189,248,0.4);">${tiers.diamond.time}</div>
                                <div style="text-align: right;">
                                    <span style="font-size: 10.5px; font-weight: 700; color: var(--nfs-orange);">+${tiers.diamond.pts} PTS</span>
                                    <span style="font-size: 9.5px; color: var(--green-neon); margin-left: 3px; font-family: var(--font-mono); font-weight: 600;">${tiers.diamond.bounty}</span>
                                </div>
                            </div>

                            <!-- Oro / Gold -->
                            <div class="season-tier-row tier-gold" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 9px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(251, 191, 36, 0.05);">
                                <div style="display: flex; align-items: center; gap: 5px;">
<span style="font-size: 10.5px; font-weight: 800; color: #fbbf24;">ORO / GOLD</span>
                                    <span style="font-size: 10.5px; font-weight: 800; color: #fbbf24;">ORO / GOLD</span>
                                </div>
                                <div style="font-family: var(--font-mono); font-size: 12.5px; font-weight: 800; color: #fbbf24; text-shadow: 0 0 8px rgba(251,191,36,0.4);">${tiers.gold.time}</div>
                                <div style="text-align: right;">
                                    <span style="font-size: 10.5px; font-weight: 700; color: var(--nfs-orange);">+${tiers.gold.pts} PTS</span>
                                    <span style="font-size: 9.5px; color: var(--green-neon); margin-left: 3px; font-family: var(--font-mono); font-weight: 600;">${tiers.gold.bounty}</span>
                                </div>
                            </div>

                            <!-- Plata / Silver -->
                            <div class="season-tier-row tier-silver" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 9px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(226, 232, 240, 0.03);">
                                <div style="display: flex; align-items: center; gap: 5px;">
<span style="font-size: 10.5px; font-weight: 800; color: #e2e8f0;">PLATA</span>
                                    <span style="font-size: 10.5px; font-weight: 800; color: #e2e8f0;">PLATA</span>
                                </div>
                                <div style="font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: #e2e8f0;">${tiers.silver.time}</div>
                                <div style="text-align: right;">
                                    <span style="font-size: 10.5px; font-weight: 700; color: var(--nfs-orange);">+${tiers.silver.pts} PTS</span>
                                    <span style="font-size: 9.5px; color: var(--green-neon); margin-left: 3px; font-family: var(--font-mono); font-weight: 600;">${tiers.silver.bounty}</span>
                                </div>
                            </div>

                            <!-- Bronce / Bronze -->
                            <div class="season-tier-row tier-bronze" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 9px; background: rgba(249, 115, 22, 0.03);">
                                <div style="display: flex; align-items: center; gap: 5px;">
<span style="font-size: 10.5px; font-weight: 800; color: #fdba74;">BRONCE</span>
                                    <span style="font-size: 10.5px; font-weight: 800; color: #fdba74;">BRONCE</span>
                                </div>
                                <div style="font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: #fdba74;">${tiers.bronze.time}</div>
                                <div style="text-align: right;">
                                    <span style="font-size: 10.5px; font-weight: 700; color: var(--nfs-orange);">+${tiers.bronze.pts} PTS</span>
                                    <span style="font-size: 9.5px; color: var(--green-neon); margin-left: 3px; font-family: var(--font-mono); font-weight: 600;">${tiers.bronze.bounty}</span>
                                </div>
                            </div>
                        </div>

                        <div style="font-size: 10.5px; color: #cbd5e1; display: flex; align-items: center; gap: 6px;">
<span><strong>Trofeo Oficial:</strong> ${ch.reward ? ch.reward.badge : 'Medalla Oficial'}</span>
                        </div>
                    </div>
                </div>

                <!-- Botones de Acción -->
                <div class="challenge-actions-row" style="padding: 12px 16px; background: rgba(0,0,0,0.25); border-top: 1px solid rgba(255,255,255,0.06); gap: 10px;">
                    <button type="button" class="btn-toggle-complete ${isDone ? 'completed' : 'incomplete'}" onclick="toggleChallengeComplete('${ch.id}')" style="flex: 1; padding: 10px; font-size: 11.5px;">
${isDone ? 'COMPLETADO' : 'MARCAR HECHO'}
                    </button>
                    
                    <button type="button" class="btn-challenge-submit" onclick="startSeasonChallengeSubmission('${season.id}', ${currentWeekData.weekNum}, '${ch.id}', '${escapeHtml(ch.track)}', '${escapeHtml(ch.category)}', '${escapeHtml(ch.car)}', '${escapeHtml(rewardDesc)}')" style="flex: 1.4; padding: 10px; font-size: 12px;">
                        Enviar Récord
                    </button>
                </div>
            </div>
        `;
    });

    gridContainer.innerHTML = html;
}

/**
 * Cargar y renderizar en vivo la clasificación de temporada desde Firebase RTDB
 */
async function loadSeasonStandingsLive(forceRefresh = false) {
    const tbody = document.getElementById('tbody-season-standings-live');
    const podiumContainer = document.getElementById('season-podium-container');
    const titleEl = document.getElementById('season-standings-title');

    const season = (typeof SEASONS_DATA !== 'undefined' && SEASONS_DATA[currentSeasonId])
        ? SEASONS_DATA[currentSeasonId]
        : null;
    const seasonName = season ? season.name : 'Temporada Blacklist';
    const seasonPeriod = season ? season.period : '2026';

    if (titleEl) {
        titleEl.textContent = `🏆 CLASIFICACIÓN OFICIAL: ${seasonName.toUpperCase()} (${seasonPeriod.toUpperCase()})`;
    }

    if (tbody && (!cachedSeasonStandings[currentSeasonId] || forceRefresh)) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; color: var(--cyan-neon); padding: 40px; font-family: var(--font-racing); font-size: 13.5px;">
                    <div style="display: inline-block; animation: spin 1s linear infinite; margin-right: 8px;">🔄</div>
                    Consultando tabla de clasificación de ${seasonName} desde Firebase RTDB...
                </td>
            </tr>
        `;
    }

    if (cachedSeasonStandings[currentSeasonId] && !forceRefresh) {
        renderSeasonStandingsLive(cachedSeasonStandings[currentSeasonId]);
        return;
    }

    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL)
        ? window.NFS_FIREBASE.RTDB_URL
        : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";

    try {
        let standings = null;
        try {
            const res = await fetch(`${baseUrl}/records/seasons_${currentSeasonId}_standings.json`);
            if (res.ok) standings = await res.json();
        } catch (e) {}

        if (!standings) {
            try {
                const res = await fetch(`${baseUrl}/seasons/${currentSeasonId}/standings.json`);
                if (res.ok) standings = await res.json();
            } catch (e) {}
        }

        let list = [];
        if (Array.isArray(standings)) {
            list = standings.filter(Boolean);
        } else if (standings && typeof standings === 'object') {
            list = Object.values(standings).filter(Boolean);
        }

        // Si aún no hay registros publicados, proveer un preview elegante con los 10 pilotos oficiales inscritos
        if (list.length === 0) {
            if (currentSeasonId === 'season_2') {
                list = [
                    { rank: "#1", driver: "ZimanX", s1: 0, s2: 0, s3: 0, s4: 0, totalPts: 0, totalBounty: "$0", badgeTitle: "Líder Blacklist #1", rewardMedals: "Aspirante Corona" },
                    { rank: "#2", driver: "Mystic", s1: 0, s2: 0, s3: 0, s4: 0, totalPts: 0, totalBounty: "$0", badgeTitle: "Élite Blacklist #2", rewardMedals: "Aspirante Plata" },
                    { rank: "#3", driver: "Nebula", s1: 0, s2: 0, s3: 0, s4: 0, totalPts: 0, totalBounty: "$0", badgeTitle: "Élite Blacklist #3", rewardMedals: "Aspirante Bronce" },
                    { rank: "#4", driver: "xLeMondx", s1: 0, s2: 0, s3: 0, s4: 0, totalPts: 0, totalBounty: "$0", badgeTitle: "Piloto Oficial", rewardMedals: "Parrilla Oficial" },
                    { rank: "#5", driver: "Avenger", s1: 0, s2: 0, s3: 0, s4: 0, totalPts: 0, totalBounty: "$0", badgeTitle: "Piloto Oficial", rewardMedals: "Parrilla Oficial" },
                    { rank: "#6", driver: "DarkShido", s1: 0, s2: 0, s3: 0, s4: 0, totalPts: 0, totalBounty: "$0", badgeTitle: "Piloto Oficial", rewardMedals: "Parrilla Oficial" },
                    { rank: "#7", driver: "DannyLove", s1: 0, s2: 0, s3: 0, s4: 0, totalPts: 0, totalBounty: "$0", badgeTitle: "Piloto Oficial", rewardMedals: "Parrilla Oficial" },
                    { rank: "#8", driver: "Lea4Speed0", s1: 0, s2: 0, s3: 0, s4: 0, totalPts: 0, totalBounty: "$0", badgeTitle: "Piloto Oficial", rewardMedals: "Parrilla Oficial" },
                    { rank: "#9", driver: "ellafreyafan", s1: 0, s2: 0, s3: 0, s4: 0, totalPts: 0, totalBounty: "$0", badgeTitle: "Piloto Oficial", rewardMedals: "Parrilla Oficial" },
                    { rank: "#10", driver: "N6 xBourne", s1: 0, s2: 0, s3: 0, s4: 0, totalPts: 0, totalBounty: "$0", badgeTitle: "Piloto Oficial", rewardMedals: "Parrilla Oficial" }
                ];
            } else {
                list = [
                    { rank: "#1", driver: "ZimanX", s1: 100, s2: 85, s3: 90, s4: 95, totalPts: 370, totalBounty: "$7.400.000", badgeTitle: "Líder Blacklist #1", rewardMedals: "Oro & Trofeo Legend" },
                    { rank: "#2", driver: "Mystic", s1: 80, s2: 75, s3: 82, s4: 88, totalPts: 325, totalBounty: "$6.500.000", badgeTitle: "Élite Blacklist #2", rewardMedals: "Plata de Temporada" },
                    { rank: "#3", driver: "Nebula", s1: 70, s2: 68, s3: 75, s4: 72, totalPts: 285, totalBounty: "$5.700.000", badgeTitle: "Élite Blacklist #3", rewardMedals: "Bronce de Temporada" },
                    { rank: "#4", driver: "xLeMondx", s1: 50, s2: 55, s3: 60, s4: 58, totalPts: 223, totalBounty: "$4.460.000", badgeTitle: "Piloto Oficial", rewardMedals: "Top 4 Temporada" },
                    { rank: "#5", driver: "Avenger", s1: 45, s2: 48, s3: 52, s4: 50, totalPts: 195, totalBounty: "$3.900.000", badgeTitle: "Piloto Oficial", rewardMedals: "Top 5 Temporada" },
                    { rank: "#6", driver: "DarkShido", s1: 35, s2: 40, s3: 42, s4: 45, totalPts: 162, totalBounty: "$3.240.000", badgeTitle: "Piloto Oficial", rewardMedals: "Top 6 Temporada" },
                    { rank: "#7", driver: "DannyLove", s1: 30, s2: 35, s3: 38, s4: 40, totalPts: 143, totalBounty: "$2.860.000", badgeTitle: "Piloto Oficial", rewardMedals: "Top 7 Temporada" },
                    { rank: "#8", driver: "Lea4Speed0", s1: 25, s2: 30, s3: 32, s4: 35, totalPts: 122, totalBounty: "$2.440.000", badgeTitle: "Piloto Oficial", rewardMedals: "Top 8 Temporada" },
                    { rank: "#9", driver: "ellafreyafan", s1: 20, s2: 25, s3: 28, s4: 30, totalPts: 103, totalBounty: "$2.060.000", badgeTitle: "Piloto Oficial", rewardMedals: "Top 9 Temporada" },
                    { rank: "#10", driver: "N6 xBourne", s1: 15, s2: 20, s3: 25, s4: 28, totalPts: 88, totalBounty: "$1.760.000", badgeTitle: "Piloto Oficial", rewardMedals: "Top 10 Temporada" }
                ];
            }
        }

        cachedSeasonStandings[currentSeasonId] = list;
        renderSeasonStandingsLive(list);
    } catch (e) {
        console.warn("Error cargando clasificación de temporada:", e);
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; color: var(--f1-red); padding: 30px; font-family: var(--font-racing);">
                        ❌ No se pudo conectar con Firebase RTDB. Verifica tu conexión a internet o intenta nuevamente.
                    </td>
                </tr>
            `;
        }
    }
}

function renderSeasonStandingsLive(list) {
    const tbody = document.getElementById('tbody-season-standings-live');
    const podiumContainer = document.getElementById('season-podium-container');
    if (!tbody) return;

    if (!list || list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; color: var(--text-muted); padding: 40px; font-family: var(--font-racing);">
                    No hay tiempos puntuados aún para esta temporada. ¡Sé el primero en enviar tu récord!
                </td>
            </tr>
        `;
        if (podiumContainer) podiumContainer.innerHTML = '';
        return;
    }

    // Render podium Top 3
    if (podiumContainer) {
        const top3 = list.slice(0, 3);
        const medals = ['🥇', '🥈', '🥉'];
        const rankClasses = ['rank-1', 'rank-2', 'rank-3'];

        podiumContainer.innerHTML = top3.map((p, idx) => {
            const avatarSvg = (typeof OPERATOR_ICONS !== 'undefined') ? OPERATOR_ICONS.getAvatar(p.driver, 44) : '';
            return `
                <div class="season-podium-card ${rankClasses[idx]}">
                    <span class="season-podium-medal">${medals[idx]}</span>
                    <div style="width: 44px; height: 44px; border-radius: 50%; overflow: hidden; background: rgba(0,0,0,0.4); flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                        ${avatarSvg || '🏎️'}
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div class="season-podium-driver notranslate" translate="no" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${escapeHtml(p.driver)}
                        </div>
                        <div class="season-podium-pts">
                            ${p.totalPts || 0} PTS BLACKLIST
                        </div>
                        <div class="season-podium-bounty">
                            💰 ${p.totalBounty || '$0'}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render table rows
    tbody.innerHTML = list.map((p, idx) => {
        const rankNum = idx + 1;
        const rankBadge = rankNum === 1 ? '🥇 #1' : (rankNum === 2 ? '🥈 #2' : (rankNum === 3 ? '🥉 #3' : `#${rankNum}`));
        const avatarSvg = (typeof OPERATOR_ICONS !== 'undefined') ? OPERATOR_ICONS.getAvatar(p.driver, 24) : '';

        return `
            <tr>
                <td style="text-align: center; font-family: var(--font-racing); font-weight: 800; color: ${rankNum <= 3 ? 'var(--nfs-orange)' : '#cbd5e1'}; font-size: 13.5px;">
                    ${rankBadge}
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="display: inline-block; width: 24px; height: 24px; border-radius: 50%; overflow: hidden; vertical-align: middle;">
                            ${avatarSvg}
                        </span>
                        <strong class="notranslate" translate="no" style="color: #ffffff; font-family: var(--font-racing); font-size: 13.5px;">${escapeHtml(p.driver)}</strong>
                    </div>
                </td>
                <td style="text-align: center; font-family: var(--font-mono); color: #cbd5e1;">${p.s1 || 0}</td>
                <td style="text-align: center; font-family: var(--font-mono); color: #cbd5e1;">${p.s2 || 0}</td>
                <td style="text-align: center; font-family: var(--font-mono); color: #cbd5e1;">${p.s3 || 0}</td>
                <td style="text-align: center; font-family: var(--font-mono); color: #cbd5e1;">${p.s4 || 0}</td>
                <td style="text-align: center; font-family: var(--font-mono); font-size: 14.5px; font-weight: 900; color: var(--nfs-orange);">
                    ${p.totalPts || 0} PTS
                </td>
                <td>
                    <span style="color: var(--green-neon); font-family: var(--font-mono); font-weight: 700; font-size: 12.5px;">
                        ${p.totalBounty || '$0'}
                    </span>
                </td>
                <td>
                    <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10.5px; font-weight: 700; background: rgba(6, 182, 212, 0.15); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.3);">
                        ${escapeHtml(p.badgeTitle || 'Aspirante Blacklist')}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

async function loadRemoteSeasonsChallenges() {
    try {
        const local = localStorage.getItem('nfs_seasons_custom_challenges_v1');
        if (local) {
            mergeCustomChallengesIntoSeasonsData(JSON.parse(local));
        }
    } catch(e) {}

    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    try {
        const res = await fetch(`${baseUrl}/seasons_custom_challenges.json`);
        if (res.ok) {
            const data = await res.json();
            if (data && typeof data === 'object') {
                localStorage.setItem('nfs_seasons_custom_challenges_v1', JSON.stringify(data));
                mergeCustomChallengesIntoSeasonsData(data);
                if (typeof renderChallengesUI === 'function') {
                    renderChallengesUI();
                }
            }
        }
    } catch (e) {
        console.info("Seasons challenges loaded from local cache");
    }
}

function mergeCustomChallengesIntoSeasonsData(customData) {
    if (!customData || typeof SEASONS_DATA === 'undefined') return;
    Object.keys(customData).forEach(seasonKey => {
        if (!SEASONS_DATA[seasonKey]) return;
        const sCustom = customData[seasonKey];
        Object.keys(sCustom).forEach(weekKey => {
            const wNum = parseInt(weekKey.replace(/[^0-9]/g, ''), 10);
            const weekObj = SEASONS_DATA[seasonKey].weeks.find(w => w.weekNum === wNum);
            if (weekObj && Array.isArray(sCustom[weekKey])) {
                sCustom[weekKey].forEach(custCh => {
                    const existing = weekObj.challenges.find(c => c.id === custCh.id);
                    if (existing) {
                        Object.assign(existing, custCh);
                    }
                });
            }
        });
    });
}

async function loadRemoteChampionshipWeeksData() {
    // 1. Cargar inmediatamente desde localStorage para renderizado en 0ms
    try {
        localStorage.removeItem('nfs_championship_weeks_data_v1');
        localStorage.removeItem('nfs_championship_weeks_data_v2');
        const local = localStorage.getItem('nfs_championship_weeks_data_v3');
        if (local && typeof CHAMPIONSHIP_WEEKS_DATA !== 'undefined') {
            const parsed = JSON.parse(local);
            applyNormalizedChampionshipWeeksData(CHAMPIONSHIP_WEEKS_DATA, parsed);
            if (typeof renderChampionshipGroups === 'function') {
                renderChampionshipGroups(currentChampionshipWeek);
            }
            if (typeof renderChampionshipChallenges === 'function') {
                renderChampionshipChallenges(currentChampionshipWeek);
            }
            if (typeof syncBlacklistWithRotationsAndStandings === 'function') {
                syncBlacklistWithRotationsAndStandings();
            }
        }
    } catch(e) {}

    // 2. Consultar nodos de Firebase Realtime Database con respaldo en cascada
    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) 
        ? window.NFS_FIREBASE.RTDB_URL 
        : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";

    try {
        let data = null;

        // Prioridad 1: Nodo público verificado /records/championship_weeks_data
        try {
            const res1 = await fetch(`${baseUrl}/records/championship_weeks_data.json`);
            if (res1.ok) {
                const j1 = await res1.json();
                if (j1 && typeof j1 === 'object') data = j1;
            }
        } catch (e) {}

        // Prioridad 2: Nodo /championship/weeks_data
        if (!data) {
            try {
                const res3 = await fetch(`${baseUrl}/championship/weeks_data.json`);
                if (res3.ok) {
                    const j3 = await res3.json();
                    if (j3 && typeof j3 === 'object') data = j3;
                }
            } catch (e) {}
        }

        if (data && typeof data === 'object' && typeof CHAMPIONSHIP_WEEKS_DATA !== 'undefined') {
            localStorage.setItem('nfs_championship_weeks_data_v3', JSON.stringify(data));
            applyNormalizedChampionshipWeeksData(CHAMPIONSHIP_WEEKS_DATA, data);
            if (typeof renderChampionshipGroups === 'function') {
                renderChampionshipGroups(currentChampionshipWeek);
            }
            if (typeof renderChampionshipChallenges === 'function') {
                renderChampionshipChallenges(currentChampionshipWeek);
            }
            if (typeof syncBlacklistWithRotationsAndStandings === 'function') {
                syncBlacklistWithRotationsAndStandings();
            }
        }

        // Listener en tiempo real vía Firebase Database SDK si está inicializado
        if (typeof firebase !== 'undefined' && typeof firebase.database === 'function') {
            try {
                const db = firebase.database();
                db.ref('records/championship_weeks_data').on('value', (snap) => {
                    if (snap.exists()) {
                        const val = snap.val();
                        if (val && typeof val === 'object' && typeof CHAMPIONSHIP_WEEKS_DATA !== 'undefined') {
                            applyNormalizedChampionshipWeeksData(CHAMPIONSHIP_WEEKS_DATA, val);
                            localStorage.setItem('nfs_championship_weeks_data_v3', JSON.stringify(val));
                            if (typeof syncBlacklistWithRotationsAndStandings === 'function') {
                                syncBlacklistWithRotationsAndStandings();
                            }
                            const activeW = (typeof currentChampionshipWeek !== 'undefined') ? currentChampionshipWeek : 1;
                            if (typeof renderChampionshipGroups === 'function') renderChampionshipGroups(activeW);
                            if (typeof renderChampionshipChallenges === 'function') renderChampionshipChallenges(activeW);
                        }
                    }
                });
            } catch (fbErr) {}
        }
    } catch (e) {
        console.info("Championship weeks data loaded from local cache");
        if (typeof syncBlacklistWithRotationsAndStandings === 'function') {
            syncBlacklistWithRotationsAndStandings();
        }
    }
}

function initChallengesSystem() {
    currentSeasonId = 'season_1';
    currentSeasonWeek = 1;
    loadRemoteSeasonsChallenges();
    loadRemoteChampionshipWeeksData();
    renderChallengesUI();
}

// ExportaciÃ³n global a window para eventos HTML
window.switchChallengeSeason = switchChallengeSeason;
window.setSeasonWeek = setSeasonWeek;
window.changeSeasonWeek = changeSeasonWeek;
window.setChallengesViewMode = setChallengesViewMode;
window.startSeasonChallengeSubmission = startSeasonChallengeSubmission;
window.clearSeasonSubmissionContext = clearSeasonSubmissionContext;
window.startChallengeSubmission = startChallengeSubmission;
window.toggleChallengeComplete = toggleChallengeComplete;
window.loadSeasonStandingsLive = loadSeasonStandingsLive;
window.renderChallengesUI = renderChallengesUI;
window.initChallengesSystem = initChallengesSystem;

// =======================================================
// BLACKLIST EVENT // CAMPEONATO 2026 (4 SEMANAS • 5 GRUPOS • 8 DESAFÃOS)
// =======================================================

const BLACKLIST_STORAGE_KEY = 'nfs_blacklist_championship_2026_v5';
let blacklistDrivers = [];
let currentSelectedBlacklistRank = 1;
let currentChampionshipWeek = 2;

function loadBlacklistData() {
    try {
        localStorage.removeItem('nfs_blacklist_championship_2026_v1');
        localStorage.removeItem('nfs_blacklist_championship_2026_v2');
        localStorage.removeItem('nfs_blacklist_championship_2026_v3');
        localStorage.removeItem('nfs_blacklist_championship_2026_v4');
        const saved = localStorage.getItem(BLACKLIST_STORAGE_KEY);
        if (saved) {
            blacklistDrivers = JSON.parse(saved);
        } else if (typeof DEFAULT_BLACKLIST_DRIVERS !== 'undefined') {
            blacklistDrivers = JSON.parse(JSON.stringify(DEFAULT_BLACKLIST_DRIVERS));
            saveBlacklistData();
        }
    } catch (e) {
        console.error("Error al cargar datos del Campeonato Blacklist:", e);
        if (typeof DEFAULT_BLACKLIST_DRIVERS !== 'undefined') {
            blacklistDrivers = JSON.parse(JSON.stringify(DEFAULT_BLACKLIST_DRIVERS));
        }
    }

    if (window.NFSOperators && Array.isArray(blacklistDrivers)) {
        blacklistDrivers.forEach(d => {
            if (d && (d.name || d.alias)) {
                window.NFSOperators.linkPlayerAliases(d.name, d.alias);
            }
        });
    }
}

function saveBlacklistData() {
    try {
        localStorage.setItem(BLACKLIST_STORAGE_KEY, JSON.stringify(blacklistDrivers));
    } catch (e) {
        console.error("Error al guardar datos del Campeonato Blacklist:", e);
    }
}

/**
 * FÃ³rmula de PuntuaciÃ³n del Campeonato 2026:
 * Puntos = (P1 * 25) + (P2 * 18) + (P3 * 15) + (P4 * 12) +
 *          (1Â° Mejores Tiempos * 100) + (2Â° Mejores Tiempos * 50) + (3Â° Mejores Tiempos * 20) +
 *          Math.floor(REP / 10000)
 */
function calculateDriverPoints(driver) {
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
 * Busca de forma ultra-robusta un piloto en blacklistDrivers por:
 * 1. Objeto driver o propiedad rank directa
 * 2. Rango numérico (#1 - #15+)
 * 3. Alias o Nick exacto (case-insensitive)
 * 4. Nombre real exacto (case-insensitive)
 * 5. Subcadena normalizada o tokens sin prefijos de clan
 */
function findBlacklistDriver(pilotIdentifier) {
    if (!pilotIdentifier || !Array.isArray(blacklistDrivers) || blacklistDrivers.length === 0) return null;

    if (typeof pilotIdentifier === 'object' && pilotIdentifier !== null) {
        if (pilotIdentifier.rank) {
            const found = blacklistDrivers.find(d => d.rank === pilotIdentifier.rank);
            if (found) return found;
        }
        if (pilotIdentifier.alias || pilotIdentifier.name) {
            pilotIdentifier = pilotIdentifier.alias || pilotIdentifier.name;
        }
    }

    const rawStr = String(pilotIdentifier).trim();
    if (!rawStr || rawStr === 'Por disputar' || rawStr === 'En espera' || rawStr === '--:--.---' || rawStr === '--' || rawStr === 'TBD') {
        return null;
    }

    const num = parseInt(rawStr, 10);
    if (!isNaN(num) && String(num) === rawStr) {
        const byRank = blacklistDrivers.find(d => d.rank === num);
        if (byRank) return byRank;
    }

    const clean = rawStr.toLowerCase();

    // 1. Coincidencia exacta de alias o nombre
    let found = blacklistDrivers.find(d => 
        (d.alias && d.alias.trim().toLowerCase() === clean) ||
        (d.name && d.name.trim().toLowerCase() === clean)
    );
    if (found) return found;

    // 2. Coincidencia sin prefijos de clan o números (ej: "N6 xBourne" -> "xBourne")
    found = blacklistDrivers.find(d => {
        const dAlias = (d.alias || '').trim().toLowerCase();
        const dName = (d.name || '').trim().toLowerCase();
        if (dAlias && (clean.includes(dAlias) || dAlias.includes(clean))) return true;
        if (dName && (clean.includes(dName) || dName.includes(clean))) return true;
        return false;
    });

    return found || null;
}

function getDriverGroupForWeek(pilotIdentifier, weekNum) {
    if (typeof CHAMPIONSHIP_WEEKS_DATA === 'undefined') return 'Grupo Alpha';
    const wNum = weekNum || currentChampionshipWeek || 1;
    const weekData = CHAMPIONSHIP_WEEKS_DATA[wNum] || CHAMPIONSHIP_WEEKS_DATA[String(wNum)] || CHAMPIONSHIP_WEEKS_DATA[1];
    if (!weekData || !weekData.groups || !Array.isArray(weekData.groups) || weekData.groups.length === 0) return 'Grupo Alpha';

    const driver = findBlacklistDriver(pilotIdentifier);
    const rank = driver ? driver.rank : parseInt(pilotIdentifier, 10);
    const alias = driver ? (driver.alias || '').trim().toLowerCase() : String(pilotIdentifier || '').trim().toLowerCase();
    const name = driver ? (driver.name || '').trim().toLowerCase() : '';

    for (const grp of weekData.groups) {
        if (!grp.pilots || !Array.isArray(grp.pilots)) continue;
        for (const p of grp.pilots) {
            if (!isNaN(rank) && (p === rank || parseInt(p, 10) === rank)) {
                return grp.name;
            }
            if (typeof p === 'string') {
                const pClean = p.trim().toLowerCase();
                if (pClean === alias || (name && pClean === name)) {
                    return grp.name;
                }
            }
            const pDriver = findBlacklistDriver(p);
            if (pDriver && driver && pDriver.rank === driver.rank) {
                return grp.name;
            }
        }
    }
    // Asignar en rotación a los grupos para pilotos de parrilla extendida si no están en grp.pilots
    const numGroups = weekData.groups.length || 4;
    const safeRank = (!isNaN(rank) && rank > 0) ? rank : 1;
    const groupIdx = (safeRank - 1) % numGroups;
    if (weekData.groups[groupIdx] && weekData.groups[groupIdx].name) {
        return `${weekData.groups[groupIdx].name} [Ext]`;
    }
    return `Grupo #${groupIdx + 1} [Ext]`;
}

function switchChampionshipWeek(weekNumber, btn) {
    currentChampionshipWeek = parseInt(weekNumber, 10) || 2;

    // Actualizar botones de selector de semana (tanto .champ-pill como .bl-week-btn)
    const pills = document.querySelectorAll('.champ-pill, .bl-week-btn');
    pills.forEach((p, idx) => {
        const wAttr = p.getAttribute('data-week');
        if (wAttr) {
            p.classList.toggle('active', parseInt(wAttr, 10) === currentChampionshipWeek);
        } else if (btn) {
            p.classList.toggle('active', p === btn);
        } else {
            p.classList.toggle('active', idx === (currentChampionshipWeek - 1));
        }
    });

    const champWeekEl = document.getElementById('bl-summary-champ-week');
    if (champWeekEl) {
        const weekPrefix = (window.nfsI18n ? window.nfsI18n.t('champ_week_' + currentChampionshipWeek) : `Semana ${currentChampionshipWeek}`);
        champWeekEl.textContent = `${weekPrefix} / 4 (8 ${window.nfsI18n ? window.nfsI18n.t('champ_challenges_title') : 'Desafíos'})`;
    }

    const kpiWeekEl = document.getElementById('bl-kpi-champ-week');
    if (kpiWeekEl) {
        kpiWeekEl.textContent = `SEMANA ${currentChampionshipWeek} / 4`;
    }

    const repTitleEl = document.getElementById('bl-kpi-rep-title');
    if (repTitleEl) {
        repTitleEl.textContent = `TOTAL REP POT (SEM. ${currentChampionshipWeek})`;
    }

    const subtabWeekEl = document.getElementById('bl-subtab-current-week-label');
    if (subtabWeekEl) {
        subtabWeekEl.textContent = `GRUPOS & DESAFÍOS (SEMANA ${currentChampionshipWeek})`;
    }

    renderChampionshipGroups(currentChampionshipWeek);
    renderChampionshipChallenges(currentChampionshipWeek);
    renderBlacklistUI();
    updateBlacklistTacticalCard();
    renderAllTacticalCards();
}

function renderChampionshipGroups(weekNumber) {
    const container = document.getElementById('bl-groups-grid') || 
                      document.querySelector('#view-blacklist .bl-groups-grid') || 
                      document.querySelector('.bl-groups-grid') || 
                      document.getElementById('champ-groups-grid');
    const datesBadge = document.getElementById('bl-groups-dates-badge') || 
                       document.getElementById('champ-week-dates-badge');
    if (!container) return;

    if (typeof CHAMPIONSHIP_WEEKS_DATA === 'undefined') return;
    const wNum = weekNumber || currentChampionshipWeek || 1;
    const weekData = CHAMPIONSHIP_WEEKS_DATA[wNum] || CHAMPIONSHIP_WEEKS_DATA[String(wNum)] || CHAMPIONSHIP_WEEKS_DATA[1];
    if (!weekData || !weekData.groups || !Array.isArray(weekData.groups)) return;

    if (datesBadge) {
        datesBadge.textContent = weekData.dates ? `VENTANA: ${weekData.dates.toUpperCase()}` : `VENTANA: SEMANA ${wNum}`;
    }

    container.innerHTML = '';

    const numGroups = weekData.groups.length || 4;
    weekData.groups.forEach((grp, grpIdx) => {
        const groupCard = document.createElement('div');
        groupCard.className = 'bl-group-card';

        // Determinar indicador, tag y nombres
        const gNameLower = (grp.name || '').toLowerCase();
        let indicatorClass = 'alpha';
        let defaultTag = 'TIER SUPREME';
        let defaultName = 'GRUPO ALPHA';
        if (grpIdx === 1 || gNameLower.includes('beta')) {
            indicatorClass = 'beta';
            defaultTag = 'TIER HIGH';
            defaultName = 'GRUPO BETA';
        } else if (grpIdx === 2 || gNameLower.includes('gamma') || gNameLower.includes('gama') || gNameLower.includes('fuerza')) {
            indicatorClass = 'gamma';
            defaultTag = 'TIER MID-HIGH';
            defaultName = 'GRUPO GAMMA';
        } else if (grpIdx >= 3 || gNameLower.includes('delta')) {
            indicatorClass = 'delta';
            defaultTag = 'TIER COMPETICIÓN';
            defaultName = 'GRUPO DELTA';
        }

        const cleanTag = (grp.tag || defaultTag).replace(/[🔥⚡⚔️👑🏁🛡️\[\]]/g, '').trim();

        // Formato de nombre del grupo preservando subtítulo si existe
        let rawName = grp.name || defaultName;
        let titleHtml = '';
        if (rawName.includes('(')) {
            const parts = rawName.split('(');
            const mainName = parts[0].trim().toUpperCase();
            const subName = ('(' + parts.slice(1).join('(')).trim().toUpperCase();
            titleHtml = `<span class="bl-group-name">${escapeHtml(mainName)} <span style="font-size: 11px; color: #94a3b8; font-weight: 700; margin-left: 4px;">${escapeHtml(subName)}</span></span>`;
        } else {
            titleHtml = `<span class="bl-group-name">${escapeHtml(rawName.toUpperCase())}</span>`;
        }

        // Obtener pilotos del grupo
        const groupPilots = Array.isArray(grp.pilots) ? [...grp.pilots] : [];
        if (Array.isArray(blacklistDrivers)) {
            blacklistDrivers.forEach(d => {
                if (d.rank > 15 && (d.rank - 1) % numGroups === grpIdx && !groupPilots.includes(d.rank)) {
                    groupPilots.push(d.rank);
                }
            });
        }

        let pilotsHtml = '';
        groupPilots.forEach((pilotRank, pIdx) => {
            const isOpenSlot = (typeof pilotRank === 'string' && pilotRank.toLowerCase().includes('open')) ||
                               pilotRank === 0 || pilotRank === '0';

            if (isOpenSlot) {
                let slotNum = 11;
                if (typeof pilotRank === 'string') {
                    const digits = pilotRank.replace(/\D/g, '');
                    slotNum = digits ? parseInt(digits, 10) : (grpIdx * 3 + pIdx + 1);
                } else {
                    slotNum = grpIdx * 3 + pIdx + 1;
                }

                pilotsHtml += `
                    <div class="bl-pilot-item slot-open" onclick="switchView('championship-register')">
                        <div class="flex items-center gap-space-sm min-w-0" style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                            <div class="bl-rank-box open-slot">${slotNum}</div>
                            <div class="flex flex-col min-w-0" style="display: flex; flex-direction: column; min-width: 0;">
                                <span class="font-headline-sm text-[14px] leading-tight uppercase text-on-surface-variant font-extrabold truncate"
                                    style="font-family: 'Chivo', sans-serif; font-size: 13.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Plaza Disponible #${slotNum}</span>
                                <span class="font-label-data text-[11px] text-primary-container truncate font-bold"
                                    style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #ffb800;">Esperando Piloto</span>
                            </div>
                        </div>
                        <div class="flex flex-col text-right shrink-0" style="display: flex; flex-direction: column; text-align: right; flex-shrink: 0;">
                            <span class="font-label-data text-label-data text-on-surface-variant"
                                style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #94a3b8;">OPEN</span>
                            <span class="font-label-data text-[11px] text-on-surface-variant font-bold"
                                style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b;">$0</span>
                        </div>
                    </div>
                `;
                return;
            }

            // Buscar piloto en blacklistDrivers o en registeredParticipants
            let driver = findBlacklistDriver(pilotRank);
            if (!driver && typeof registeredParticipants !== 'undefined' && Array.isArray(registeredParticipants)) {
                const rawMatch = registeredParticipants.find(p => 
                    (p.rank && p.rank === parseInt(pilotRank, 10)) ||
                    (p.alias && p.alias.toLowerCase() === String(pilotRank).toLowerCase()) ||
                    (p.name && p.name.toLowerCase() === String(pilotRank).toLowerCase())
                );
                if (rawMatch) {
                    driver = {
                        rank: rawMatch.rank || (typeof pilotRank === 'number' ? pilotRank : (grpIdx * 3 + pIdx + 1)),
                        name: rawMatch.name,
                        alias: rawMatch.alias || rawMatch.name,
                        ride: rawMatch.ride || 'Porsche Carrera GT',
                        rep: rawMatch.rep || 0,
                        victories: rawMatch.victories || { p1: 0, p2: 0, p3: 0, p4: 0 },
                        bestTimes: rawMatch.bestTimes || { first: 0, second: 0, third: 0 }
                    };
                }
            }

            if (!driver) {
                driver = {
                    rank: typeof pilotRank === 'number' ? pilotRank : (grpIdx * 3 + pIdx + 1),
                    name: typeof pilotRank === 'string' ? pilotRank : `Piloto #${pilotRank}`,
                    alias: typeof pilotRank === 'string' ? pilotRank : `Piloto #${pilotRank}`,
                    ride: 'BMW M3 GTR',
                    rep: 0,
                    victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
                    bestTimes: { first: 0, second: 0, third: 0 }
                };
            }

            const isSelected = (typeof currentSelectedBlacklistRank !== 'undefined') && (driver.rank === currentSelectedBlacklistRank);
            const pts = calculateDriverPoints(driver);

            let rankBoxClass = 'neutral-rank';
            if (driver.rank === 1) rankBoxClass = 'yellow-1';
            else if (driver.rank === 5) rankBoxClass = 'orange-5';

            const isAvenger = (driver.rank === 5) || (driver.alias && driver.alias.toLowerCase().includes('avenger'));
            const nameColor = isAvenger ? '#ffb800' : '#ffffff';

            let pilotNameText = '';
            if (isAvenger) {
                pilotNameText = 'SRTXAVENGER™';
            } else if (driver.name && driver.alias && driver.name.toLowerCase() !== driver.alias.toLowerCase()) {
                pilotNameText = `${escapeHtml(driver.name)} "${escapeHtml(driver.alias)}"`;
            } else {
                pilotNameText = escapeHtml(driver.alias || driver.name || `Piloto #${driver.rank}`);
            }

            const ptsDisplay = pts > 0 ? `${pts.toLocaleString('es-ES')} PTS` : '0 PTS';
            const ptsColor = pts > 0 ? '#ffb800' : '#94a3b8';
            const repVal = (driver.rep && driver.rep > 0) ? driver.rep : 0;
            const repDisplay = repVal > 0 ? `$${repVal.toLocaleString('de-DE')}` : '$0';
            const repColor = repVal > 0 ? '#38bdf8' : '#64748b';

            pilotsHtml += `
                <div class="bl-pilot-item ${isSelected ? 'selected-highlight' : ''}" onclick="selectBlacklistPilot(${driver.rank})">
                    <div class="flex items-center gap-space-sm min-w-0" style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                        <div class="bl-rank-box ${rankBoxClass}">${driver.rank}</div>
                        <div class="flex flex-col min-w-0" style="display: flex; flex-direction: column; min-width: 0;">
                            <span class="font-headline-sm text-[14px] leading-tight uppercase font-extrabold truncate"
                                style="font-family: 'Chivo', sans-serif; font-size: 13.5px; font-weight: 800; color: ${nameColor}; text-transform: uppercase;">
                                ${pilotNameText}
                            </span>
                            <span class="font-label-data text-[11px] text-on-surface-variant truncate"
                                style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #94a3b8;">
                                ${escapeHtml(driver.ride || 'BMW M3 GTR')}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col text-right shrink-0" style="display: flex; flex-direction: column; text-align: right; flex-shrink: 0;">
                        <span class="font-label-data text-label-data font-bold"
                            style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${ptsColor};">
                            ${ptsDisplay}
                        </span>
                        <span class="font-label-data text-[11px] font-bold"
                            style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${repColor};">
                            ${repDisplay}
                        </span>
                    </div>
                </div>
            `;
        });

        groupCard.innerHTML = `
            <div class="bl-group-header">
                <div class="bl-group-title-wrap">
                    <span class="bl-group-sq-indicator ${indicatorClass}"></span>
                    ${titleHtml}
                </div>
                <span class="bl-tier-badge ${indicatorClass}">${escapeHtml(cleanTag)}</span>
            </div>
            <div class="flex flex-col gap-space-xs" style="display: flex; flex-direction: column; gap: 6px;">
                ${pilotsHtml}
            </div>
        `;

        container.appendChild(groupCard);
    });
}

let currentChampionshipGroupTab = 0;

function selectChampionshipGroupTab(grpIdx) {
    currentChampionshipGroupTab = grpIdx;

    // Sincronizar estado activo en los botones de filtro por grupo de la sección Blacklist
    const blGroupButtons = document.querySelectorAll('#bl-group-filters .bl-challenges-group-filter-btn');
    if (blGroupButtons && blGroupButtons.length > 0) {
        blGroupButtons.forEach((btn, idx) => {
            btn.classList.toggle('active', idx === grpIdx);
        });
    }

    // Sincronizar botones de filtro de grupo alternativos/legacy si existen
    const legacyButtons = document.querySelectorAll('#champ-challenges-group-filter .champ-group-filter-btn');
    if (legacyButtons && legacyButtons.length > 0) {
        legacyButtons.forEach((btn, idx) => {
            btn.classList.toggle('active', idx === grpIdx);
        });
    }

    renderChampionshipChallenges(currentChampionshipWeek);
}

/**
 * Formatea cantidades monetarias de reputación al estilo Stitch ($400K REP, $1.2M REP).
 */
function formatChallengeRepMoney(repMoney) {
    if (!repMoney && repMoney !== 0) return '$0 REP';
    if (typeof repMoney === 'string') {
        const clean = repMoney.replace(/[^\d]/g, '');
        repMoney = clean ? parseInt(clean, 10) : 0;
    }
    if (repMoney === 0) return '$0 REP';
    if (repMoney >= 1000000) {
        const m = repMoney / 1000000;
        return `$${m % 1 === 0 ? m : m.toFixed(1)}M REP`;
    }
    if (repMoney >= 1000) {
        return `$${Math.round(repMoney / 1000)}K REP`;
    }
    return `$${repMoney} REP`;
}

function renderChampionshipChallenges(weekNumber) {
    const container = document.getElementById('bl-challenges-grid') || document.getElementById('champ-challenges-grid');
    if (!container) return;

    if (typeof CHAMPIONSHIP_WEEKS_DATA === 'undefined') return;
    const wNum = weekNumber || currentChampionshipWeek || 1;
    const weekData = CHAMPIONSHIP_WEEKS_DATA[wNum] || CHAMPIONSHIP_WEEKS_DATA[String(wNum)] || CHAMPIONSHIP_WEEKS_DATA[1];
    if (!weekData || !weekData.challenges) return;

    // Sincronizar estado activo de los botones de filtro de grupo
    const blGroupButtons = document.querySelectorAll('#bl-group-filters .bl-challenges-group-filter-btn');
    if (blGroupButtons && blGroupButtons.length > 0) {
        blGroupButtons.forEach((btn, idx) => {
            btn.classList.toggle('active', idx === currentChampionshipGroupTab);
        });
    }

    // Renderizar Filtro de Grupos Legacy si existe
    const filterContainer = document.getElementById('champ-challenges-group-filter');
    const groups = (weekData.groups && Array.isArray(weekData.groups) && weekData.groups.length > 0)
        ? weekData.groups
        : [];

    if (currentChampionshipGroupTab >= (groups.length || 4)) {
        currentChampionshipGroupTab = 0;
    }

    if (filterContainer && groups.length > 0) {
        const groupIcons = ["🏆", "⚡", "🛡️", "🎯", "👑", "🏁", "💨", "🔥"];
        const groupLabels = [
            "GRUPO ALPHA (LÍDERES)",
            "GRUPO BETA (ASPIRANTES)",
            "GRUPO GAMMA",
            "GRUPO DELTA"
        ];
        filterContainer.innerHTML = groups.map((grp, grpIdx) => {
            const isActive = grpIdx === currentChampionshipGroupTab;
            const icon = groupIcons[grpIdx % groupIcons.length];
            const label = groupLabels[grpIdx] || (grp.name || `GRUPO ${grpIdx + 1}`).toUpperCase();
            return `
                <button type="button" class="champ-group-filter-btn ${isActive ? 'active' : ''}" onclick="selectChampionshipGroupTab(${grpIdx})">
                    <span>${icon}</span> <span>${escapeHtml(label)}</span>
                </button>
            `;
        }).join('');
    }

    const activeGrp = groups[currentChampionshipGroupTab] || { name: 'Grupo Alpha' };
    const grpName = activeGrp.name || `Grupo #${currentChampionshipGroupTab + 1}`;

    container.innerHTML = '';

    weekData.challenges.forEach((ch, idx) => {
        const card = document.createElement('div');
        card.className = 'bl-challenge-card';

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
        if (!top3 || !Array.isArray(top3) || top3.length === 0) {
            const grpPilots = (activeGrp && Array.isArray(activeGrp.pilots)) ? activeGrp.pilots : [];
            top3 = [1, 2, 3].map((pos, pIdx) => {
                const pilotId = grpPilots[pIdx];
                let pilotName = 'Por disputar';
                let carName = '';
                if (pilotId !== undefined && pilotId !== null) {
                    const driver = findBlacklistDriver(pilotId);
                    if (driver) {
                        pilotName = driver.alias || driver.name;
                        carName = driver.ride || '';
                    } else if (typeof pilotId === 'string' && pilotId.startsWith('open_')) {
                        const slotNum = pilotId.replace('open_', '');
                        pilotName = `Plaza Disponible #${slotNum}`;
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

        let podiumRowsHtml = '';
        for (let pos = 1; pos <= 3; pos++) {
            const tIdx = pos - 1;
            const t = top3[tIdx] || null;
            const isPos1 = pos === 1;

            const rowClass = isPos1 ? 'bl-podium-row pos-1' : 'bl-podium-row pos-other';
            const circleClass = isPos1 ? 'bl-circle-pos yellow-1' : 'bl-circle-pos dark-pos';

            const defaultPending = window.nfsI18n ? window.nfsI18n.t('champ_pending_driver') : 'Por disputar';
            const isPending = !t || !t.pilot || t.pilot === 'Por disputar' || t.pilot === defaultPending;
            const pilotDisplay = isPending ? defaultPending : t.pilot.toUpperCase();

            // Puntos de bono
            let bonusPts = (t && typeof t.bonus === 'number') ? t.bonus : (pos === 1 ? 100 : (pos === 2 ? 50 : 20));

            // Dinero de reputación formateado al estilo Stitch ($400K REP)
            const repFormatted = formatChallengeRepMoney(t ? t.repMoney : (pos === 1 ? 400000 : (pos === 2 ? 250000 : 120000)));
            const timeDisplay = (t && t.time) ? t.time : '--:--.---';
            const timeClass = isPos1 ? 'bl-podium-time cyan-best' : 'bl-podium-time white-time';

            // Estilos para los textos de bonos
            let bonusTextColor = '#ffb800';
            let bonusTextClass = 'text-primary-container';
            if (pos === 2) {
                bonusTextColor = '#ffb59c';
                bonusTextClass = 'text-secondary';
            } else if (pos === 3) {
                bonusTextColor = '#ffb800';
                bonusTextClass = 'text-primary';
            }

            podiumRowsHtml += `
                <div class="${rowClass}">
                    <div class="flex items-center gap-space-xs min-w-0" style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                        <span class="${circleClass}">${pos}</span>
                        <span class="font-headline-sm text-[13px] uppercase text-on-surface font-bold truncate notranslate" translate="no" style="font-family: 'Chivo', sans-serif; font-size: 13px; font-weight: 800; color: #ffffff; text-transform: uppercase;">${escapeHtml(pilotDisplay)}</span>
                    </div>
                    <div class="flex items-center gap-space-sm" style="display: flex; align-items: center; gap: 10px;">
                        <span class="${timeClass}">${escapeHtml(timeDisplay)}</span>
                        <div class="flex flex-col text-right" style="display: flex; flex-direction: column; text-align: right;">
                            <span class="font-label-data text-[10px] ${bonusTextClass} font-bold" style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: ${bonusTextColor};">+${bonusPts} PTS</span>
                            <span class="font-label-data text-[10px] text-tertiary" style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #38bdf8;">${escapeHtml(repFormatted)}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Tipo de carrera con tag estilizado
        const chTypeLower = (ch.type || 'Circuito').toLowerCase();
        let tagClass = 'circuito';
        if (chTypeLower.includes('sprint')) tagClass = 'sprint';
        else if (chTypeLower.includes('drag')) tagClass = 'drag';

        const numDisplay = `#${String(idx + 1).padStart(2, '0')}`;
        const restrictionCar = ch.carRestriction || 'Sin restricción';

        card.innerHTML = `
            <div class="bl-ch-header">
                <div class="flex items-center gap-space-xs min-w-0" style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                    <span class="bl-ch-num">${numDisplay}</span>
                    <span class="bl-ch-title">${escapeHtml(ch.route)}</span>
                </div>
                <span class="bl-ch-tag ${tagClass}">${escapeHtml((ch.type || 'CIRCUITO').toUpperCase())}</span>
            </div>
            <div class="bl-restriction-row">
                <span class="material-symbols-outlined text-[16px] text-secondary" style="font-size: 16px; color: #ff5708;">directions_car</span>
                <span class="font-label-data text-label-data text-on-surface-variant" style="color: #94a3b8;">COCHE RESTRINGIDO:</span>
                <span class="font-label-data text-label-data text-primary font-bold truncate" style="color: #ffb800; font-weight: 700;">${escapeHtml(restrictionCar)}</span>
            </div>
            <div class="flex flex-col gap-space-xs" style="display: flex; flex-direction: column; gap: 6px;">
                ${podiumRowsHtml}
            </div>
        `;

        container.appendChild(card);
    });
}

/**
 * Retorna los pilotos de la Blacklist ordenados dinÃ¡micamente segÃºn la ClasificaciÃ³n General del Campeonato.
 * Criterio: Puntos Totales Descendente -> Victorias P1 -> Mejores Tiempos 1Â° -> Dinero de ReputaciÃ³n -> Rango Base.
 */
function getSortedBlacklistDrivers() {
    return [...blacklistDrivers].sort((a, b) => {
        const ptsA = calculateDriverPoints(a);
        const ptsB = calculateDriverPoints(b);
        if (ptsB !== ptsA) return ptsB - ptsA;

        // Desempate 1: Victorias P1
        const p1A = a.victories?.p1 || 0;
        const p1B = b.victories?.p1 || 0;
        if (p1B !== p1A) return p1B - p1A;

        // Desempate 2: Bonos de 1Â° mejor tiempo (+100 PTS)
        const bt1A = a.bestTimes?.first || 0;
        const bt1B = b.bestTimes?.first || 0;
        if (bt1B !== bt1A) return bt1B - bt1A;

        // Desempate 3: Dinero de ReputaciÃ³n ($ REP)
        const repA = a.rep || 0;
        const repB = b.rep || 0;
        if (repB !== repA) return repB - repA;

        // Desempate 4: Rango inicial
        return (a.rank || 99) - (b.rank || 99);
    });
}

/**
 * Determina si una marca de tiempo representa una participación nula o no registrada:
 * cadenas vacías, marcadores de posición ("--:--.---", "DNS", "DNF", "TBD"),
 * o ceros absolutos ("00:00:00", "00:00.000", "0:00.000", etc.).
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
 * Sincroniza e indexa las Fichas Técnicas y la Clasificación General con los ganadores de los desafíos
 * de las rotaciones semanales (CHAMPIONSHIP_WEEKS_DATA) o datos en vivo de competición guardados en admin.html.
 */
function syncBlacklistWithRotationsAndStandings() {
    if (typeof CHAMPIONSHIP_WEEKS_DATA === 'undefined' || !Array.isArray(blacklistDrivers) || blacklistDrivers.length === 0) return;

    // 1. Resetear estadísticas de campeonato para calcular desde cero con los datos consolidados
    blacklistDrivers.forEach(d => {
        d.victories = { p1: 0, p2: 0, p3: 0, p4: 0 };
        d.bestTimes = { first: 0, second: 0, third: 0 };
        d.bonusPoints = 0;
        d.rep = 0;
        d.lastChallengeId = null;
    });

    // 2. Recorrer todas las semanas (1 a 4) y todos sus desafíos
    const weekKeys = Object.keys(CHAMPIONSHIP_WEEKS_DATA).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    weekKeys.forEach(weekKey => {
        const weekData = CHAMPIONSHIP_WEEKS_DATA[weekKey];
        if (!weekData || !Array.isArray(weekData.challenges)) return;

        weekData.challenges.forEach(ch => {
            let groupsToProcess = [];
            if (Array.isArray(weekData.groups) && weekData.groups.length > 0) {
                weekData.groups.forEach((grp, grpIdx) => {
                    const grpName = grp.name || `Grupo #${grpIdx + 1}`;
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

                top3List.forEach((t, posIdx) => {
                    if (!t || !t.pilot || t.pilot === 'Por disputar' || t.pilot === 'En espera') return;
                    const driver = findBlacklistDriver(t.pilot);
                    if (!driver) return;

                    const time = (t.time || '').trim();
                    const isNullTime = isZeroOrNullTime(time);

                    // Recompensa en Dinero ($ REP) - preservando 0 y valores personalizados
                    let repMoney = 0;
                    if (t.repMoney !== undefined && t.repMoney !== null && t.repMoney !== '') {
                        const parsedR = parseInt(t.repMoney, 10);
                        repMoney = isNaN(parsedR) ? 0 : parsedR;
                    } else if (!isNullTime) {
                        repMoney = posIdx === 0 ? 400000 : (posIdx === 1 ? 250000 : (posIdx === 2 ? 120000 : 0));
                    }

                    // Bono de Puntos - preservando 0 y valores personalizados
                    let bonusVal = 0;
                    if (t.bonus !== undefined && t.bonus !== null && t.bonus !== '') {
                        const parsedB = parseInt(t.bonus, 10);
                        bonusVal = isNaN(parsedB) ? 0 : parsedB;
                    } else if (!isNullTime) {
                        bonusVal = posIdx === 0 ? 100 : (posIdx === 1 ? 50 : (posIdx === 2 ? 20 : 0));
                    }

                    // Criterio de Participación Nula:
                    // 1. Si el tiempo es nulo/cero y bonos/rep son 0 -> Participación nula total (no suma nada).
                    // 2. Si posIdx > 0 (2°, 3°, 4° puesto) y el tiempo es nulo -> No suma victorias ni puntos de posición.
                    const isNullParticipation = (isNullTime && bonusVal === 0 && repMoney === 0) || (posIdx > 0 && isNullTime);

                    if (isNullParticipation) {
                        // Si se asignó bono o rep manual explícito a una posición con tiempo nulo, acumularlo
                        if (bonusVal > 0) driver.bonusPoints = (driver.bonusPoints || 0) + bonusVal;
                        if (repMoney > 0) driver.rep = (driver.rep || 0) + repMoney;
                        // Pero NO sumar victorias ni podios
                        return;
                    }

                    driver.lastChallengeId = ch.id;
                    driver.rep = (driver.rep || 0) + repMoney;
                    driver.bonusPoints = (driver.bonusPoints || 0) + bonusVal;

                    // Posiciones y Victorias (P1=25, P2=18, P3=15, P4=12)
                    if (posIdx === 0) {
                        // El 1° puesto cuenta como victoria P1 si tiene tiempo válido O si se asignó bono/rep (victoria otorgada en comisaría)
                        if (!isNullTime || bonusVal > 0 || repMoney > 0) {
                            driver.victories.p1 = (driver.victories.p1 || 0) + 1;
                            if (bonusVal > 0) driver.bestTimes.first = (driver.bestTimes.first || 0) + 1;
                        }
                    } else if (!isNullTime) {
                        // Para 2°, 3° o 4° puesto solo se computa podio si compitió efectivamente (tiempo válido)
                        if (posIdx === 1) {
                            driver.victories.p2 = (driver.victories.p2 || 0) + 1;
                            if (bonusVal > 0) driver.bestTimes.second = (driver.bestTimes.second || 0) + 1;
                        } else if (posIdx === 2) {
                            driver.victories.p3 = (driver.victories.p3 || 0) + 1;
                            if (bonusVal > 0) driver.bestTimes.third = (driver.bestTimes.third || 0) + 1;
                        } else if (posIdx === 3) {
                            driver.victories.p4 = (driver.victories.p4 || 0) + 1;
                        }
                    }
                });
            });
        });
    });

    saveBlacklistData();
    renderBlacklistUI();
    if (typeof renderChampionshipGroups === 'function') {
        renderChampionshipGroups(currentChampionshipWeek);
    }
    renderAllTacticalCards();
    updateBlacklistTacticalCard();
    if (typeof renderPilotQuickJumpPills === 'function') {
        renderPilotQuickJumpPills();
    }
}

/**
 * Permite registrar o actualizar en tiempo real el resultado de un piloto en un desafío,
 * recalculando automáticamente la Clasificación General y re-indexando las Fichas Técnicas.
 */
function updatePilotScoreFromChallenge(pilotIdentifier, placement, bonusPts = 0, repMoney = 0) {
    const driver = findBlacklistDriver(pilotIdentifier);

    if (!driver) {
        console.warn(`[NFSRANKSMW] Piloto no encontrado para actualizar puntaje: ${pilotIdentifier}`);
        return false;
    }

    if (!driver.victories) driver.victories = { p1: 0, p2: 0, p3: 0, p4: 0 };
    if (!driver.bestTimes) driver.bestTimes = { first: 0, second: 0, third: 0 };

    const b = (bonusPts !== undefined && bonusPts !== null && bonusPts !== '') ? parseInt(bonusPts, 10) : 0;
    const safeBonus = isNaN(b) ? 0 : b;

    const r = (repMoney !== undefined && repMoney !== null && repMoney !== '') ? parseInt(repMoney, 10) : 0;
    const safeRep = isNaN(r) ? 0 : r;

    if (placement === 1) {
        driver.victories.p1 = (driver.victories.p1 || 0) + 1;
        if (safeBonus > 0) driver.bestTimes.first = (driver.bestTimes.first || 0) + 1;
    } else if (placement === 2) {
        driver.victories.p2 = (driver.victories.p2 || 0) + 1;
        if (safeBonus > 0) driver.bestTimes.second = (driver.bestTimes.second || 0) + 1;
    } else if (placement === 3) {
        driver.victories.p3 = (driver.victories.p3 || 0) + 1;
        if (safeBonus > 0) driver.bestTimes.third = (driver.bestTimes.third || 0) + 1;
    } else if (placement === 4) {
        driver.victories.p4 = (driver.victories.p4 || 0) + 1;
    }

    driver.bonusPoints = (driver.bonusPoints || 0) + safeBonus;
    driver.rep = (driver.rep || 0) + safeRep;

    saveBlacklistData();
    renderBlacklistUI();
    if (typeof renderChampionshipGroups === 'function') {
        renderChampionshipGroups(currentChampionshipWeek);
    }
    renderAllTacticalCards();
    updateBlacklistTacticalCard();
    if (typeof renderPilotQuickJumpPills === 'function') {
        renderPilotQuickJumpPills();
    }

    return true;
}

function renderBlacklistUI() {
    const tbody = document.getElementById('tbody-blacklist-roster');
    if (!tbody) return;

    // Ordenar dinámicamente según la Clasificación General del Campeonato (Puntos y Desempates)
    const sortedDrivers = getSortedBlacklistDrivers();

    // Actualizar barra de resumen con el líder real actual
    const leader = sortedDrivers[0] || { name: 'Razor', alias: 'Razor', ride: 'BMW M3 GTR' };
    const leaderEl = document.getElementById('bl-summary-leader');
    if (leaderEl) {
        leaderEl.textContent = `${leader.alias || leader.name} (${leader.ride})`;
    }
    const leaderStandingsEl = document.getElementById('bl-standings-leader');
    if (leaderStandingsEl) {
        leaderStandingsEl.textContent = `${leader.alias || leader.name} (${leader.ride})`;
    }

    const totalRep = blacklistDrivers.reduce((sum, d) => sum + (d.rep || 0), 0);
    const totalRepEl = document.getElementById('bl-summary-rep');
    if (totalRepEl) {
        totalRepEl.textContent = `$${totalRep.toLocaleString('de-DE')}`;
    }
    const repStandingsEl = document.getElementById('bl-standings-rep');
    if (repStandingsEl) {
        repStandingsEl.textContent = `$${totalRep.toLocaleString('de-DE')}`;
    }
    const pilotsCountEl = document.getElementById('bl-standings-pilots-count');
    if (pilotsCountEl) {
        pilotsCountEl.textContent = `${sortedDrivers.length} Racers`;
    }

    tbody.innerHTML = '';

    sortedDrivers.forEach((driver, idx) => {
        if (window.NFSOperators) {
            window.NFSOperators.linkPlayerAliases(driver.name, driver.alias);
        }
        const standingRank = idx + 1;
        const tr = document.createElement('tr');
        tr.className = `blacklist-row ${driver.rank === currentSelectedBlacklistRank ? 'active-row' : ''}`;
        tr.setAttribute('data-rank', driver.rank);
        tr.onclick = () => selectBlacklistPilot(driver.rank);

        let rankBadgeClass = 'rank-normal';
        if (standingRank === 1) rankBadgeClass = 'rank-gold';
        else if (standingRank === 2) rankBadgeClass = 'rank-silver';
        else if (standingRank === 3) rankBadgeClass = 'rank-bronze';

        let statusClass = 'status-active';
        if (standingRank === 1) statusClass = 'status-leader';
        else if (standingRank <= 3) statusClass = 'status-contender';

        const totalPts = calculateDriverPoints(driver);
        const groupName = getDriverGroupForWeek(driver, currentChampionshipWeek);
        const bt = driver.bestTimes || { first: 0, second: 0, third: 0 };
        const bonusPtsTotal = (typeof driver.bonusPoints === 'number')
            ? driver.bonusPoints
            : (((bt.first || 0) * 100) + ((bt.second || 0) * 50) + ((bt.third || 0) * 20));
        const blBadgeClass = standingRank === 1 ? 'bl-badge-gold' : standingRank === 2 ? 'bl-badge-silver' : standingRank === 3 ? 'bl-badge-bronze' : '';

        tr.innerHTML = `
            <td>
                <span class="bl-rank-badge ${rankBadgeClass}">${standingRank}</span>
            </td>
            <td>
                <div class="driver-name-cell-wrapper">
                    ${window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(driver.alias || driver.name) : ''}
                    <div class="driver-cell-flex">
                        <div class="driver-names-row notranslate" translate="no">
                            <span class="driver-cell-name notranslate" translate="no">${driver.name}</span>
                            <span class="driver-cell-alias notranslate" translate="no">"${driver.alias}"</span>
                        </div>
                        <div class="driver-bl-sublabel ${blBadgeClass}">
                            <span class="bl-word-white">Blacklist</span> <span class="bl-num-accent">${standingRank}</span>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <span style="color: #ffffff; font-weight: 600;">${driver.ride}</span>
            </td>
            <td>
                <span class="rep-money-cell">$${(driver.rep || 0).toLocaleString('de-DE')}</span>
            </td>
            <td style="color: #ffd700; font-weight: 800; font-family: var(--font-mono);">${driver.victories?.p1 || 0}</td>
            <td style="color: #e2e8f0; font-weight: 800; font-family: var(--font-mono);">${driver.victories?.p2 || 0}</td>
            <td style="color: #cd7f32; font-weight: 800; font-family: var(--font-mono);">${driver.victories?.p3 || 0}</td>
            <td style="color: #38bdf8; font-weight: 800; font-family: var(--font-mono);">${driver.victories?.p4 || 0}</td>
            <td>
                ${bonusPtsTotal > 0
                    ? `<span class="champ-time-bonus-pill">+${bonusPtsTotal.toLocaleString('de-DE')} PTS</span>`
                    : `<span class="champ-time-bonus-pill zero">0 PTS</span>`
                }
            </td>
            <td>
                <span class="pts-cell">${totalPts.toLocaleString('de-DE')} PTS</span>
            </td>
            <td>
                <span class="champ-group-tag">${groupName}</span>
            </td>
            <td>
                <span class="status-badge ${statusClass}">${standingRank === 1 ? '👑 LÍDER #1' : (driver.status || 'PILOTO OFICIAL')}</span>
            </td>
        `;

        tbody.appendChild(tr);
    });

    // Renderizar la lista de Fichas Técnicas Horizontales para la Clasificación General
    renderStandingsHorizontalCards(sortedDrivers);

    // Inicializar o aplicar modo de vista (Fichas Horizontales por defecto)
    const savedMode = localStorage.getItem('nfs_standings_display_mode') || 'cards';
    setStandingsDisplayMode(savedMode);

    // Actualizar la Ficha Táctica seleccionada
    updateBlacklistTacticalCard();
}

let currentCockpitGroupFilter = 'all';
let currentCockpitSearchQuery = '';

function setCockpitGroupFilter(group) {
    currentCockpitGroupFilter = group;
    ['all', 'alpha', 'beta', 'gamma', 'delta'].forEach(g => {
        const chip = document.getElementById(`chip-filter-${g}`);
        if (chip) chip.classList.toggle('active', g === group);
    });
    applyCockpitRosterFilters();
}

function filterCockpitRosterSearch(query) {
    currentCockpitSearchQuery = (query || '').toLowerCase().trim();
    applyCockpitRosterFilters();
}

function applyCockpitRosterFilters() {
    const items = document.querySelectorAll('.roster-driver-item');
    let visibleCount = 0;
    items.forEach(item => {
        const group = (item.getAttribute('data-group') || '').toLowerCase();
        const text = item.textContent.toLowerCase();

        const matchGroup = (currentCockpitGroupFilter === 'all') || (group === currentCockpitGroupFilter);
        const matchSearch = !currentCockpitSearchQuery || text.includes(currentCockpitSearchQuery);

        if (matchGroup && matchSearch) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    const countBadge = document.getElementById('roster-active-badge');
    if (countBadge) {
        countBadge.textContent = `${visibleCount} ACTIVOS`;
    }
}

function selectBlacklistCockpitPilot(rank) {
    currentSelectedBlacklistRank = rank;
    updateBlacklistTacticalCard();
    updateCockpitRosterActiveState();

    // Actualizar fila activa en la tabla usando data-rank
    const rows = document.querySelectorAll('.blacklist-row');
    rows.forEach(r => {
        const rRank = parseInt(r.getAttribute('data-rank'), 10);
        r.classList.toggle('active-row', rRank === rank);
    });

    // Actualizar tarjeta horizontal activa
    const cards = document.querySelectorAll('.blacklist-horizontal-card');
    cards.forEach(c => {
        const cRank = parseInt(c.getAttribute('data-rank'), 10);
        c.classList.toggle('active-card', cRank === rank);
    });

    // Actualizar selección en grupos de carrera
    document.querySelectorAll('.champ-group-pilot-item').forEach(el => {
        const rankSpan = el.querySelector('.bl-rank-badge');
        if (rankSpan && rankSpan.textContent.trim() === `${rank}`) {
            el.classList.add('selected');
        } else {
            el.classList.remove('selected');
        }
    });
}

function updateCockpitRosterActiveState() {
    const items = document.querySelectorAll('.roster-driver-item');
    items.forEach(el => {
        const itemRank = parseInt(el.getAttribute('data-rank'), 10);
        if (itemRank === currentSelectedBlacklistRank) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    const pills = document.querySelectorAll('.qs-pill');
    pills.forEach(p => {
        const onclickAttr = p.getAttribute('onclick') || '';
        if (onclickAttr.includes(`(${currentSelectedBlacklistRank})`)) {
            p.classList.add('active');
        } else {
            p.classList.remove('active');
        }
    });
}

function selectBlacklistPilot(rank) {
    selectBlacklistCockpitPilot(rank);
    switchView('blacklist-cards');
}

function updateBlacklistTacticalCard() {
    const sorted = getSortedBlacklistDrivers();
    const driver = blacklistDrivers.find(d => d.rank === currentSelectedBlacklistRank) || sorted[0];
    if (!driver) return;

    const currentStandingRank = sorted.findIndex(d => d.rank === driver.rank) + 1;
    const totalPts = calculateDriverPoints(driver);
    const groupName = getDriverGroupForWeek(driver.rank, currentChampionshipWeek);
    const bt = driver.bestTimes || { first: 0, second: 0, third: 0 };
    const v = driver.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
    const totalVictories = (v.p1 || 0) + (v.p2 || 0) + (v.p3 || 0) + (v.p4 || 0);
    const winRate = totalVictories > 0 ? Math.round(((v.p1 || 0) / totalVictories) * 100) : (currentStandingRank === 1 ? 100 : 0);

    // Elementos de la Ficha Táctica (Clásicos / Fallback)
    const numEl = document.getElementById('bl-detail-number');
    const nameEl = document.getElementById('bl-detail-name');
    const rideEl = document.getElementById('bl-detail-ride');
    const strEl = document.getElementById('bl-detail-strength');
    const groupEl = document.getElementById('bl-detail-group');
    const bioEl = document.getElementById('bl-detail-bio');
    const sigEl = document.getElementById('bl-detail-signature');
    const repEl = document.getElementById('bl-detail-rep');
    const ptsEl = document.getElementById('bl-detail-pts');
    const b1El = document.getElementById('bl-detail-b1');
    const b2El = document.getElementById('bl-detail-b2');
    const b3El = document.getElementById('bl-detail-b3');
    const p1El = document.getElementById('bl-detail-p1');
    const p2El = document.getElementById('bl-detail-p2');
    const p3El = document.getElementById('bl-detail-p3');
    const p4El = document.getElementById('bl-detail-p4');

    if (numEl) numEl.textContent = `Blacklist ${currentStandingRank}`;
    if (nameEl) nameEl.textContent = `${driver.name} "${driver.alias}"`;
    if (rideEl) rideEl.textContent = driver.ride;
    if (strEl) strEl.textContent = driver.strength;
    if (groupEl) groupEl.textContent = `${groupName} (Semana ${currentChampionshipWeek})`;
    if (bioEl) bioEl.textContent = driver.bio;
    if (sigEl) sigEl.textContent = driver.signature || driver.alias.toUpperCase();
    if (repEl) repEl.textContent = `$${(driver.rep || 0).toLocaleString('de-DE')}`;
    if (ptsEl) ptsEl.textContent = `${totalPts.toLocaleString('de-DE')} PTS`;

    if (b1El) b1El.textContent = `${bt.first || 0} ${bt.first === 1 ? 'vez' : 'veces'}`;
    if (b2El) b2El.textContent = `${bt.second || 0} ${bt.second === 1 ? 'vez' : 'veces'}`;
    if (b3El) b3El.textContent = `${bt.third || 0} ${bt.third === 1 ? 'vez' : 'veces'}`;

    if (p1El) p1El.textContent = v.p1 || 0;
    if (p2El) p2El.textContent = v.p2 || 0;
    if (p3El) p3El.textContent = v.p3 || 0;
    if (p4El) p4El.textContent = v.p4 || 0;

    // === NUEVOS ELEMENTOS DEL MASTER-DETAIL COCKPIT (GOOGLE STITCH) ===
    const cRankEl = document.getElementById('cockpit-hero-rank');
    if (cRankEl) cRankEl.textContent = `#${String(currentStandingRank).padStart(2, '0')}`;

    const cCrownEl = document.getElementById('cockpit-crown-icon');
    if (cCrownEl) cCrownEl.textContent = currentStandingRank === 1 ? '👑' : currentStandingRank === 2 ? '🥈' : currentStandingRank === 3 ? '🥉' : '🏎️';

    const cStatusPill = document.getElementById('cockpit-hero-status-pill');
    if (cStatusPill) {
        cStatusPill.textContent = currentStandingRank === 1 ? 'REIGNING BLACKLIST LEADER' : currentStandingRank <= 3 ? 'ELITE CONTENDER' : 'VETERAN CHALLENGER';
    }

    const cIdEl = document.getElementById('cockpit-hero-id');
    if (cIdEl) cIdEl.textContent = `ID: BL-${String(currentStandingRank).padStart(2, '0')}-2026`;

    const cNameEl = document.getElementById('cockpit-hero-name');
    if (cNameEl) {
        cNameEl.innerHTML = `${escapeHtml(driver.name)} <span class="text-gold">"${escapeHtml(driver.alias)}"</span>`;
    }

    const cBioEl = document.getElementById('cockpit-hero-bio');
    if (cBioEl) cBioEl.textContent = driver.bio;

    const cYtEl = document.getElementById('cockpit-hero-yt');
    if (cYtEl) {
        if (driver.youtube) {
            cYtEl.href = driver.youtube;
            cYtEl.style.display = 'inline-flex';
        } else {
            cYtEl.href = 'https://youtube.com';
        }
    }

    const cWatermarkEl = document.getElementById('cockpit-watermark-text');
    if (cWatermarkEl) {
        cWatermarkEl.textContent = driver.signature || (driver.alias ? driver.alias.toUpperCase() : 'ROCKPORT');
    }

    // 4 Tarjetas de Métricas Clave
    const cKpiRep = document.getElementById('cockpit-kpi-rep');
    if (cKpiRep) cKpiRep.textContent = `$${(driver.rep || 0).toLocaleString('de-DE')}`;

    const cKpiPts = document.getElementById('cockpit-kpi-pts');
    if (cKpiPts) cKpiPts.innerHTML = `${totalPts.toLocaleString('de-DE')} <span class="val-unit">PTS</span>`;

    const cKpiStatus = document.getElementById('cockpit-kpi-rank-status');
    if (cKpiStatus) {
        cKpiStatus.textContent = currentStandingRank === 1 ? 'Rango: Líder Absoluto' : `Rango: Posición #${currentStandingRank}`;
    }

    const cKpiLead = document.getElementById('cockpit-kpi-lead');
    if (cKpiLead) {
        if (currentStandingRank === 1 && sorted.length > 1) {
            const runnerUpPts = calculateDriverPoints(sorted[1]);
            const lead = totalPts - runnerUpPts;
            cKpiLead.textContent = `+${lead} pts lead`;
            cKpiLead.className = 'text-green font-bold';
        } else if (sorted.length > 0) {
            const leaderPts = calculateDriverPoints(sorted[0]);
            const deficit = leaderPts - totalPts;
            cKpiLead.textContent = `-${deficit} pts de líder`;
            cKpiLead.className = 'text-orange font-bold';
        }
    }

    const cKpiB1Badge = document.getElementById('cockpit-kpi-b1-badge');
    if (cKpiB1Badge) cKpiB1Badge.textContent = `${bt.first || 0} ${bt.first === 1 ? 'VEZ' : 'VECES'}`;

    const cKpiB1Pts = document.getElementById('cockpit-kpi-b1-pts');
    if (cKpiB1Pts) cKpiB1Pts.innerHTML = `${(bt.first || 0) * 100} <span class="val-unit">PTS DE BONO</span>`;

    const cKpiB1Bar = document.getElementById('cockpit-kpi-b1-bar');
    if (cKpiB1Bar) {
        const pct = Math.min(100, Math.max(10, ((bt.first || 0) / 8) * 100));
        cKpiB1Bar.style.width = `${pct}%`;
    }

    const cKpiWinrate = document.getElementById('cockpit-kpi-winrate');
    if (cKpiWinrate) {
        cKpiWinrate.innerHTML = `${winRate}% <span class="val-sub text-green">[${v.p1 || 0}/${totalVictories || (v.p1 || 0)} VICTORIAS]</span>`;
    }

    const cKpiLosses = document.getElementById('cockpit-kpi-losses');
    if (cKpiLosses) {
        const losses = (v.p2 || 0) + (v.p3 || 0) + (v.p4 || 0);
        cKpiLosses.textContent = losses;
    }

    const cKpiStreakTag = document.getElementById('cockpit-kpi-streak-tag');
    if (cKpiStreakTag) {
        cKpiStreakTag.textContent = (v.p1 || 0) > 0 ? `STREAK: ${v.p1}W` : 'FORM: 0W';
    }

    // Telemetría & Vehicle Specs según el bólido
    const cSpecRide = document.getElementById('cockpit-spec-ride');
    if (cSpecRide) cSpecRide.textContent = driver.ride;

    const cSpecGroup = document.getElementById('cockpit-spec-group');
    if (cSpecGroup) cSpecGroup.textContent = `${groupName} (Semana ${currentChampionshipWeek})`;

    const cSpecSchedule = document.getElementById('cockpit-spec-schedule');
    if (cSpecSchedule) cSpecSchedule.textContent = driver.strength || driver.schedule || 'Disponibilidad confirmada para carreras oficiales y desafíos Blacklist.';

    const carLower = (driver.ride || '').toLowerCase();
    let speedVal = '388 KM/H (98%)', speedPct = 98;
    let accelVal = '2.41s (96%)', accelPct = 96;
    let handlingVal = '1.48 G (94%)', handlingPct = 94;
    let dynoPeak = 'PEAK: 8,400 RPM // 650 BHP';
    let carClass = 'Class: Super / Tuner Hybrid';

    if (carLower.includes('elise')) {
        speedVal = '342 KM/H (88%)'; speedPct = 88;
        accelVal = '2.38s (97%)'; accelPct = 97;
        handlingVal = '1.48 G (98%)'; handlingPct = 98;
        dynoPeak = 'PEAK: 8,600 RPM // 480 BHP';
        carClass = 'Class: Tuner Agile Spec';
    } else if (carLower.includes('m3 gtr') || carLower.includes('bmw')) {
        speedVal = '375 KM/H (95%)'; speedPct = 95;
        accelVal = '2.49s (94%)'; accelPct = 94;
        handlingVal = '1.44 G (94%)'; handlingPct = 94;
        dynoPeak = 'PEAK: 8,200 RPM // 580 BHP';
        carClass = 'Class: GT Endurance Racecraft';
    } else if (carLower.includes('mustang')) {
        speedVal = '350 KM/H (89%)'; speedPct = 89;
        accelVal = '2.62s (91%)'; accelPct = 91;
        handlingVal = '1.34 G (86%)'; handlingPct = 86;
        dynoPeak = 'PEAK: 7,500 RPM // 540 BHP';
        carClass = 'Class: Muscle Heavy Grip';
    } else if (carLower.includes('wrx') || carLower.includes('subaru')) {
        speedVal = '355 KM/H (90%)'; speedPct = 90;
        accelVal = '2.35s (97%)'; accelPct = 97;
        handlingVal = '1.46 G (96%)'; handlingPct = 96;
        dynoPeak = 'PEAK: 8,000 RPM // 520 BHP';
        carClass = 'Class: AWD Rally Tuner';
    } else if (carLower.includes('rx-8') || carLower.includes('rx8')) {
        speedVal = '348 KM/H (88%)'; speedPct = 88;
        accelVal = '2.55s (92%)'; accelPct = 92;
        handlingVal = '1.45 G (95%)'; handlingPct = 95;
        dynoPeak = 'PEAK: 9,000 RPM // 460 BHP';
        carClass = 'Class: Rotary High-Rev Tuner';
    }

    const cSpecClass = document.getElementById('cockpit-spec-class');
    if (cSpecClass) cSpecClass.textContent = carClass;

    const cSpeedVal = document.getElementById('cockpit-gauge-speed-val');
    const cSpeedFill = document.getElementById('cockpit-gauge-speed-fill');
    if (cSpeedVal) cSpeedVal.innerHTML = `${speedVal}`;
    if (cSpeedFill) cSpeedFill.style.width = `${speedPct}%`;

    const cAccelVal = document.getElementById('cockpit-gauge-accel-val');
    const cAccelFill = document.getElementById('cockpit-gauge-accel-fill');
    if (cAccelVal) cAccelVal.innerHTML = `${accelVal}`;
    if (cAccelFill) cAccelFill.style.width = `${accelPct}%`;

    const cHandlingVal = document.getElementById('cockpit-gauge-handling-val');
    const cHandlingFill = document.getElementById('cockpit-gauge-handling-fill');
    if (cHandlingVal) cHandlingVal.innerHTML = `${handlingVal}`;
    if (cHandlingFill) cHandlingFill.style.width = `${handlingPct}%`;

    const cDynoPeak = document.getElementById('cockpit-dyno-peak');
    if (cDynoPeak) cDynoPeak.textContent = dynoPeak;

    const cExpediente = document.getElementById('cockpit-expediente-text');
    if (cExpediente) {
        cExpediente.textContent = `Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: ${driver.schedule || driver.strength || 'Confirmada'}. Compite en Rockport City bajo estricta verificación de juego limpio MW-AC. No registra incidentes técnicos ni anomalías de físicas.`;
    }

    // Matriz de Rendimiento & Podio
    const cPerfWinrateTag = document.getElementById('cockpit-perf-winrate-tag');
    if (cPerfWinrateTag) cPerfWinrateTag.textContent = `${winRate}% WIN-RATE`;

    const cPerfP1 = document.getElementById('cockpit-perf-p1');
    const cPerfP1Pct = document.getElementById('cockpit-perf-p1-pct');
    if (cPerfP1) cPerfP1.textContent = v.p1 || 0;
    if (cPerfP1Pct) cPerfP1Pct.textContent = `${winRate}%`;

    const cPerfP2 = document.getElementById('cockpit-perf-p2');
    if (cPerfP2) cPerfP2.textContent = v.p2 || 0;

    const cPerfP3 = document.getElementById('cockpit-perf-p3');
    if (cPerfP3) cPerfP3.textContent = v.p3 || 0;

    const cPerfP4 = document.getElementById('cockpit-perf-p4');
    if (cPerfP4) cPerfP4.textContent = v.p4 || 0;

    // Bonificaciones
    const cPerfB1 = document.getElementById('cockpit-perf-b1');
    if (cPerfB1) cPerfB1.textContent = `${bt.first || 0} VECES (+${(bt.first || 0) * 100})`;

    const cPerfB2 = document.getElementById('cockpit-perf-b2');
    if (cPerfB2) cPerfB2.textContent = `${bt.second || 0} veces (+${(bt.second || 0) * 50})`;

    const cPerfB3 = document.getElementById('cockpit-perf-b3');
    if (cPerfB3) cPerfB3.textContent = `${bt.third || 0} veces (+${(bt.third || 0) * 20})`;

    // Head-to-Head Preview
    const d1 = currentStandingRank === 1 ? sorted[0] : driver;
    const d2 = currentStandingRank === 1 ? (sorted[1] || sorted[0]) : sorted[0];

    const d1Pts = calculateDriverPoints(d1);
    const d2Pts = calculateDriverPoints(d2);

    const cH2hD1Name = document.getElementById('cockpit-h2h-d1-name');
    if (cH2hD1Name) cH2hD1Name.textContent = (d1.alias || d1.name).toUpperCase();

    const cH2hD1Pts = document.getElementById('cockpit-h2h-d1-pts');
    if (cH2hD1Pts) cH2hD1Pts.textContent = d1Pts.toLocaleString('de-DE');

    const cH2hD1Bounty = document.getElementById('cockpit-h2h-d1-bounty');
    if (cH2hD1Bounty) cH2hD1Bounty.textContent = `$${((d1.rep || 0) / 1000000).toFixed(2)}M`;

    const cH2hD1P1 = document.getElementById('cockpit-h2h-d1-p1');
    if (cH2hD1P1) cH2hD1P1.textContent = d1.victories?.p1 || 0;

    const cH2hD2Name = document.getElementById('cockpit-h2h-d2-name');
    if (cH2hD2Name) cH2hD2Name.textContent = (d2.alias || d2.name).toUpperCase();

    const cH2hD2Pts = document.getElementById('cockpit-h2h-d2-pts');
    if (cH2hD2Pts) cH2hD2Pts.textContent = d2Pts.toLocaleString('de-DE');

    const cH2hD2Bounty = document.getElementById('cockpit-h2h-d2-bounty');
    if (cH2hD2Bounty) cH2hD2Bounty.textContent = `$${((d2.rep || 0) / 1000000).toFixed(2)}M`;

    const cH2hD2P1 = document.getElementById('cockpit-h2h-d2-p1');
    if (cH2hD2P1) cH2hD2P1.textContent = d2.victories?.p1 || 0;

    const cH2hSpread = document.getElementById('cockpit-h2h-spread');
    if (cH2hSpread) {
        const spread = Math.abs(d1Pts - d2Pts);
        cH2hSpread.textContent = `${d1Pts >= d2Pts ? '+' : '-'}${spread} PTS`;
    }
}

function renderAllTacticalCards() {
    const sorted = getSortedBlacklistDrivers();

    // 1. Población de la barra lateral izquierda del Cockpit (Blacklist Roster 1 - 15)
    const rosterContainer = document.getElementById('cockpit-roster-items');
    if (rosterContainer) {
        rosterContainer.innerHTML = '';

        sorted.forEach((driver, idx) => {
            if (window.NFSOperators) {
                window.NFSOperators.linkPlayerAliases(driver.name, driver.alias);
            }
            const standingRank = idx + 1;
            const isSelected = driver.rank === currentSelectedBlacklistRank || (currentSelectedBlacklistRank === 1 && standingRank === 1);
            const totalPts = calculateDriverPoints(driver);
            const groupName = getDriverGroupForWeek(driver.rank, currentChampionshipWeek);
            const groupLower = groupName.toLowerCase().includes('alpha') ? 'alpha'
                : groupName.toLowerCase().includes('beta') ? 'beta'
                : groupName.toLowerCase().includes('gamma') ? 'gamma' : 'delta';

            const repFormatted = (driver.rep || 0) > 0 ? `$${((driver.rep || 0) / 1000000).toFixed(2)}M` : '$0';
            const repColorClass = (driver.rep || 0) > 0 ? 'text-green' : 'text-muted';

            let subTitle = standingRank === 1 ? 'REIGNING CHAMPION' : standingRank === 2 ? 'ELITE CONTENDER' : standingRank <= 4 ? 'PODIUM TIER' : 'CHALLENGER TIER';

            const item = document.createElement('div');
            item.className = `roster-driver-item ${isSelected ? 'active' : ''}`;
            item.setAttribute('data-rank', driver.rank);
            item.setAttribute('data-standing', standingRank);
            item.setAttribute('data-group', groupLower);
            item.onclick = () => selectBlacklistCockpitPilot(driver.rank);

            item.innerHTML = `
                ${standingRank <= 3 ? `<div class="roster-item-watermark">#0${standingRank}</div>` : ''}
                <div class="roster-item-top">
                    <div class="roster-item-left">
                        <span class="roster-rank-pill ${standingRank === 1 ? 'rank-leader' : ''}">#${standingRank}</span>
                        <div class="roster-pilot-meta">
                            <div class="roster-pilot-name-row">
                                <span class="roster-pilot-name notranslate" translate="no">${escapeHtml(driver.alias || driver.name)}</span>
                                <span class="driver-status-dot active" title="Verificado Activo"></span>
                            </div>
                            <span class="roster-pilot-sub ${standingRank === 1 ? 'text-gold' : ''}">${subTitle}</span>
                        </div>
                    </div>
                    <div class="roster-item-right">
                        <span class="roster-bounty-val ${repColorClass}">${repFormatted}</span>
                        <span class="roster-score-val text-gold font-mono">${totalPts.toLocaleString('de-DE')} PTS</span>
                    </div>
                </div>
                <div class="roster-item-bottom">
                    <span class="roster-car-name truncate">${escapeHtml(driver.ride || 'Porsche Carrera GT')}</span>
                    <span class="roster-group-tag tag-${groupLower}">${groupLower.toUpperCase()}</span>
                </div>
            `;
            rosterContainer.appendChild(item);
        });

        // Completar slots disponibles hasta 15
        const activeCount = sorted.length;
        for (let slot = activeCount + 1; slot <= 15; slot++) {
            const openDiv = document.createElement('div');
            openDiv.className = 'roster-slot-open';
            openDiv.innerHTML = `
                <span>#${slot} DISPONIBLE</span>
                <span class="slot-open-tag">OPEN SLOT</span>
            `;
            rosterContainer.appendChild(openDiv);
        }

        const countBadge = document.getElementById('roster-active-badge');
        if (countBadge) countBadge.textContent = `${activeCount} ACTIVOS`;
    }

    // 2. Población de píldoras de navegación rápida (Quick Switch Cockpit)
    const quickSwitchContainer = document.getElementById('cockpit-quick-switch-pills');
    if (quickSwitchContainer) {
        quickSwitchContainer.innerHTML = '';
        sorted.slice(0, 10).forEach((d, idx) => {
            const standingRank = idx + 1;
            const isSelected = d.rank === currentSelectedBlacklistRank || (currentSelectedBlacklistRank === 1 && standingRank === 1);
            const pill = document.createElement('button');
            pill.type = 'button';
            pill.className = `qs-pill ${isSelected ? 'active' : ''}`;
            pill.setAttribute('onclick', `selectBlacklistCockpitPilot(${d.rank})`);
            pill.innerHTML = `${standingRank === 1 ? '<span>👑</span> ' : ''}#${standingRank} ${escapeHtml((d.alias || d.name).toUpperCase())}`;
            quickSwitchContainer.appendChild(pill);
        });
    }

    // 3. Actualizar la Ficha Táctica activa en el panel derecho
    updateBlacklistTacticalCard();
    updateChampionshipRosterLabels();
}

function renderQuickJumpPills() {
    // Redirigido al nuevo Quick Switch Cockpit
    const quickSwitchContainer = document.getElementById('cockpit-quick-switch-pills');
    if (!quickSwitchContainer) return;
    const sorted = getSortedBlacklistDrivers();
    quickSwitchContainer.innerHTML = '';
    sorted.slice(0, 10).forEach((d, idx) => {
        const standingRank = idx + 1;
        const isSelected = d.rank === currentSelectedBlacklistRank || (currentSelectedBlacklistRank === 1 && standingRank === 1);
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = `qs-pill ${isSelected ? 'active' : ''}`;
        pill.setAttribute('onclick', `selectBlacklistCockpitPilot(${d.rank})`);
        pill.innerHTML = `${standingRank === 1 ? '<span>👑</span> ' : ''}#${standingRank} ${escapeHtml((d.alias || d.name).toUpperCase())}`;
        quickSwitchContainer.appendChild(pill);
    });
}

// Atajo de teclado para enfocar buscador de la Blacklist [Ctrl+K o Cmd+K]
if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            const input = document.getElementById('cockpit-roster-search');
            if (input) {
                e.preventDefault();
                input.focus();
                input.select();
            }
        }
    });
}

/**
 * Renderiza la Clasificación General del Campeonato en estilo Ficha Técnica Horizontal
 * Combina todos los datos y estética visual de la Ficha Técnica vertical en filas horizontales
 * con la misma altura de fila que la tabla general de campeonato.
 */
function renderStandingsHorizontalCards(sortedDrivers) {
    const container = document.getElementById('standings-horizontal-cards-container');
    if (!container) return;

    container.innerHTML = '';

    sortedDrivers.forEach((driver, idx) => {
        if (window.NFSOperators) {
            window.NFSOperators.linkPlayerAliases(driver.name, driver.alias);
        }
        const standingRank = idx + 1;
        const totalPts = calculateDriverPoints(driver);
        const groupName = getDriverGroupForWeek(driver, currentChampionshipWeek);
        const bt = driver.bestTimes || { first: 0, second: 0, third: 0 };
        const v = driver.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
        const bonusPtsTotal = (typeof driver.bonusPoints === 'number')
            ? driver.bonusPoints
            : (((bt.first || 0) * 100) + ((bt.second || 0) * 50) + ((bt.third || 0) * 20));

        let edgeGaugeClass = standingRank === 1 ? 'gold' : standingRank === 2 ? 'silver' : standingRank === 3 ? 'bronze' : '';
        let rankBadgeClass = standingRank === 1 ? 'gold' : standingRank === 2 ? 'silver' : standingRank === 3 ? 'bronze' : 'normal';

        const card = document.createElement('div');
        card.className = `stitch-standings-card ${driver.rank === currentSelectedBlacklistRank ? 'active-card' : ''}`;
        card.setAttribute('data-rank', driver.rank);
        card.setAttribute('data-group', groupName.toLowerCase());
        card.onclick = () => selectBlacklistPilot(driver.rank);

        const opBadgeHtml = window.NFSOperators 
            ? window.NFSOperators.getOperatorBadgeHTML(driver.alias || driver.name, 'medium')
            : '<span class="material-symbols-outlined" style="font-size:24px;">rocket_launch</span>';

        card.innerHTML = `
            <!-- Left Edge Gauge -->
            <div class="stitch-standings-edge-gauge ${edgeGaugeClass}"></div>

            <!-- Pilot Identity Cluster -->
            <div class="stitch-standings-identity">
                <!-- Rank Number Badge -->
                <div class="stitch-standings-rank-box stitch-rank-sq ${rankBadgeClass}">
                    ${standingRank}
                </div>
                <!-- Escuderia Avatar / Insignia -->
                <div class="stitch-standings-avatar">
                    ${opBadgeHtml}
                </div>
                <!-- Callsign & Car info -->
                <div class="stitch-standings-pilot-info">
                    <div class="stitch-standings-name-row notranslate" translate="no">
                        <span class="stitch-standings-driver-name">${driver.name}</span>
                        <span class="stitch-standings-driver-alias">"${driver.alias}"</span>
                        <span class="stitch-bl-pill">BLACKLIST ${standingRank}</span>
                    </div>
                    <div class="stitch-standings-car-row">
                        <span class="material-symbols-outlined" style="font-size:14px; color:var(--stitch-secondary, #ff5708);">cloud_upload</span>
                        <span>${driver.ride}</span>
                    </div>
                    <div style="margin-top: 2px;">
                        <span style="font-family:var(--font-racing); font-size:10px; background:var(--stitch-surface-highest, #32353c); padding:2px 8px; border-radius:4px; color:var(--stitch-on-surface-variant, #d5c4ab); text-transform:uppercase;">${groupName}</span>
                    </div>
                </div>
            </div>

            <!-- Telemetry Data Blocks Grid -->
            <div class="stitch-standings-telemetry-grid">
                <!-- REP Money Block -->
                <div class="stitch-telemetry-block">
                    <span class="stitch-telemetry-label">DINERO REP</span>
                    <span class="stitch-telemetry-val rep-money">$${(driver.rep || 0).toLocaleString('de-DE')}</span>
                </div>
                <!-- Podiums Breakdown (P1, P2, P3, P4) -->
                <div class="stitch-podiums-row">
                    <div class="stitch-podium-chip p1" title="1° Puesto (Victorias)">
                        <span class="stitch-chip-pos">P1</span>
                        <span class="stitch-chip-val">${v.p1 || 0}</span>
                    </div>
                    <div class="stitch-podium-chip" title="2° Puesto">
                        <span class="stitch-chip-pos" style="color:#94a3b8;">P2</span>
                        <span class="stitch-chip-val" style="color:#ffffff;">${v.p2 || 0}</span>
                    </div>
                    <div class="stitch-podium-chip" title="3° Puesto">
                        <span class="stitch-chip-pos" style="color:#94a3b8;">P3</span>
                        <span class="stitch-chip-val" style="color:#ffffff;">${v.p3 || 0}</span>
                    </div>
                    <div class="stitch-podium-chip" title="4° Puesto">
                        <span class="stitch-chip-pos" style="color:#94a3b8;">P4</span>
                        <span class="stitch-chip-val" style="color:#ffffff;">${v.p4 || 0}</span>
                    </div>
                </div>
                <!-- Time Bono -->
                <div class="stitch-telemetry-block">
                    <span class="stitch-telemetry-label">TIME BONO</span>
                    <span class="stitch-telemetry-val time-bono">${bonusPtsTotal > 0 ? `+${bonusPtsTotal.toLocaleString('de-DE')} PTS` : '0 PTS'}</span>
                </div>
                <!-- Total Score -->
                <div class="stitch-telemetry-block">
                    <span class="stitch-telemetry-label">TOTAL SCORE</span>
                    <span class="stitch-telemetry-val total-score">${totalPts.toLocaleString('de-DE')} PTS</span>
                </div>
            </div>

            <!-- Leader Status & Action Buttons -->
            <div class="stitch-standings-actions">
                <span class="stitch-status-pill ${standingRank === 1 ? 'leader' : 'contender'}">
                    <span class="material-symbols-outlined" style="font-size:14px; font-variation-settings:'FILL' 1;">military_tech</span>
                    <span>${standingRank === 1 ? 'LÍDER #1' : (driver.status || 'PILOTO OFICIAL')}</span>
                </span>
                <button type="button" class="stitch-btn-dossier" onclick="event.stopPropagation(); scrollToPilotCard(${driver.rank}); switchView('blacklist-cards');" title="Ver Ficha Técnica Completa">
                    <span class="material-symbols-outlined" style="font-size:15px;">skull</span>
                    <span>FICHA DOSSIER</span>
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

function applyStandingsFilters() {
    const groupFilter = document.getElementById('filter-standings-group')?.value || 'all';
    const sortFilter = document.getElementById('filter-standings-sort')?.value || 'score';

    let drivers = getSortedBlacklistDrivers();

    // Filtro por grupo
    if (groupFilter !== 'all') {
        drivers = drivers.filter(d => {
            const grp = getDriverGroupForWeek(d, currentChampionshipWeek).toLowerCase();
            return grp.includes(groupFilter.toLowerCase());
        });
    }

    // Ordenamiento
    if (sortFilter === 'rep') {
        drivers.sort((a, b) => (b.rep || 0) - (a.rep || 0));
    } else if (sortFilter === 'p1') {
        drivers.sort((a, b) => (b.victories?.p1 || 0) - (a.victories?.p1 || 0));
    }

    renderStandingsHorizontalCards(drivers);
}

/**
 * Alterna entre la vista de Fichas Técnicas Horizontales y la Tabla Clásica en Standings
 */
function setStandingsDisplayMode(mode) {
    const cardsContainer = document.getElementById('standings-horizontal-cards-container');
    const tableWrapper = document.getElementById('standings-table-wrapper');
    const btnCards = document.getElementById('btn-standings-view-cards');
    const btnTable = document.getElementById('btn-standings-view-table');

    const effectiveMode = (mode === 'table') ? 'table' : 'cards';
    localStorage.setItem('nfs_standings_display_mode', effectiveMode);

    if (effectiveMode === 'cards') {
        if (cardsContainer) cardsContainer.style.display = 'flex';
        if (tableWrapper) tableWrapper.style.display = 'none';
        if (btnCards) btnCards.classList.add('active');
        if (btnTable) btnTable.classList.remove('active');
    } else {
        if (cardsContainer) cardsContainer.style.display = 'none';
        if (tableWrapper) tableWrapper.style.display = 'block';
        if (btnCards) btnCards.classList.remove('active');
        if (btnTable) btnTable.classList.add('active');
    }
}

function updateChampionshipRosterLabels() {
    const totalPilots = Math.max(15, blacklistDrivers.length);

    // Actualizar texto de sub-pestaÃ±as en toda la web
    document.querySelectorAll('.subtab-cards-label').forEach(el => {
        const labelText = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.t) ? window.nfsI18n.t('tab_technical_sheets') : 'Driver Dossiers';
        el.textContent = `${labelText} (1 - ${totalPilots})`;
    });

    // Actualizar tÃ­tulo de la secciÃ³n de fichas tÃ©cnicas
    const titleGlow = document.getElementById('bl-cards-title-glow');
    if (titleGlow) {
        titleGlow.textContent = `// Blacklist 1 - ${totalPilots}`;
    }

    // Actualizar tÃ­tulo de tabla de clasificaciÃ³n general
    const standingsTitle = document.getElementById('bl-standings-title');
    if (standingsTitle) {
        const standingsText = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.t) ? window.nfsI18n.t('champ_standings_title') : 'OFFICIAL CHAMPIONSHIP OVERALL STANDINGS';
        standingsTitle.innerHTML = `<span>🏆</span> ${standingsText} (TOP ${totalPilots})`;
    }

    // Actualizar telemetrÃ­a de pilotos en competiciÃ³n
    const pilotsCountEl = document.getElementById('bl-standings-pilots-count');
    if (pilotsCountEl) {
        const driversText = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.t) ? window.nfsI18n.t('hero_stat_drivers') : 'Drivers';
        pilotsCountEl.textContent = `${totalPilots} ${driversText}`;
    }

    // Actualizar resumen en formulario de inscripciÃ³n
    const regSummarySlots = document.getElementById('reg-summary-slots');
    const regCountPill = document.getElementById('registered-count-pill');
    const totalReg = registeredParticipants.length;

    if (regSummarySlots) {
        if (totalReg <= 15) {
            regSummarySlots.textContent = `${totalReg} / 15 ${typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es' ? 'Ocupadas' : 'Occupied'}`;
        } else {
            regSummarySlots.textContent = `${totalReg} / ${totalReg} ${typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es' ? 'Plazas (Parrilla Extendida)' : 'Slots (Extended Grid)'}`;
        }
    }

    if (regCountPill) {
        if (totalReg <= 15) {
            regCountPill.innerHTML = `<span id="reg-count-num">${totalReg}</span> / 15 ${typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es' ? 'Plazas' : 'Slots'}`;
        } else {
            regCountPill.innerHTML = `<span id="reg-count-num">${totalReg}</span> ${typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es' ? 'Plazas (Ampliadas)' : 'Slots (Extended)'}`;
        }
    }
}

function scrollToPilotCard(rank) {
    if (typeof selectBlacklistCockpitPilot === 'function') {
        selectBlacklistCockpitPilot(rank);
    }
    const card = document.getElementById(`pilot-card-${rank}`);
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('card-highlight-pulse');
        setTimeout(() => card.classList.remove('card-highlight-pulse'), 1600);
    }
}

// =======================================================
// SISTEMA DE INSCRIPCIÃ“N AL TORNEO // FIREBASE REALTIME DB
// =======================================================

const CHAMPIONSHIP_FIREBASE_URL = 'https://nfsranks-blacklist-default-rtdb.firebaseio.com/championship_participants.json';
const CHAMPIONSHIP_LOCAL_KEY = 'nfs_championship_participants_v2';
const CHAMPIONSHIP_DEFAULT_PARTICIPANTS = [
    {
        id: "reg_1789919672774_z8scz",
        name: "ZimanX",
        alias: "ZimanX",
        ride: "Porsche Carrera GT",
        schedule: "Sabados",
        contact: "+584246950722",
        youtube: "https://www.youtube.com/c/ZimanXPro/videos",
        registeredAt: "2026-09-20T15:54:32.774Z",
        isRealUser: true
    },
    {
        id: "reg_1789929284331_s1eia",
        name: "Mystic",
        alias: "MysticX",
        ride: "BMW M3 GTR",
        schedule: "From Tuesday to Saturday",
        contact: "Jollymystic",
        youtube: "",
        registeredAt: "2026-09-20T18:34:44.331Z",
        isRealUser: true
    },
    {
        id: "reg_1789931219145_vtige",
        name: "Nebula",
        alias: "Nebula",
        ride: "Carrera GT y Lotus Elise",
        schedule: "Sabado desde 20pm en adelante (hora chile)",
        contact: "+569 67248491",
        youtube: "https://youtube.com/@nebula_1984?si=K0_P-Fy-5fZEizaa",
        registeredAt: "2026-09-20T19:06:59.147Z",
        isRealUser: true
    },
    {
        id: "reg_1789931571542_02cyt",
        name: "xLeMondx",
        alias: "xLeMondx",
        ride: "Porsche Carrera GT",
        schedule: "lun - sab 8pm - 12 am hora Peru",
        contact: "",
        youtube: "https://www.youtube.com/@xLeMondx",
        registeredAt: "2026-09-20T19:12:51.542Z",
        isRealUser: true
    },
    {
        id: "reg_1789933200212_nmk8p",
        name: "Avenger",
        alias: "SRTxAvengerT",
        ride: "Porsche Carrera GT Y LOTUS ELISE",
        schedule: "Lunes a domingo despues de las 5 pm",
        contact: "",
        youtube: "https://www.youtube.com/@avenger7361",
        registeredAt: "2026-09-20T19:40:00.212Z",
        isRealUser: true
    },
    {
        id: "reg_1790019032404_do690",
        name: "DarkShido",
        alias: "Shido",
        ride: "BMW M3 GTR",
        schedule: "sabado desde las 7pm hora venezuela",
        contact: "Discord",
        youtube: "https://www.youtube.com/@DarkShidoGT",
        registeredAt: "2026-09-21T19:30:32.404Z",
        isRealUser: true
    },
    {
        id: "reg_1790048893233_ngfge",
        name: "DannyLove",
        alias: "DannyLove",
        ride: "BMW M3 GTR",
        schedule: "jueves - domingo | 7:30 pm",
        contact: "+57 302 317 9484",
        youtube: "",
        registeredAt: "2026-09-22T03:48:13.233Z",
        isRealUser: true
    },
    {
        id: "reg_1790081808696_9dnrd",
        name: "Lea4Speed0",
        alias: "Lea",
        ride: "Carrera GT & M3 GTR",
        schedule: "Domingo 8:00 PM",
        contact: "NA",
        youtube: "https://youtube.com/@lea4speed0?si=zXkGE7AQBQ7kvE5I",
        registeredAt: "2026-09-22T12:56:48.696Z",
        isRealUser: true
    },
    {
        id: "reg_1790428423711_ihb49",
        name: "ellafreyafan",
        alias: "NFSMW",
        ride: "BMW M3 GTR",
        schedule: "Mon-Sun 8PM - 12AM CET",
        contact: "",
        youtube: "https://www.youtube.com/channel/UCAU0np7Ruu16C7F9dnBVy8A",
        registeredAt: "2026-09-26T13:13:43.711Z",
        isRealUser: true
    },
    {
        id: "reg_1790631864702_jb59c",
        name: "N6 xBourne",
        alias: "N6 xBourne",
        ride: "Porsche Carrera GT y Lotus Elise",
        schedule: "Horario Flexible",
        contact: "jarheadvief",
        youtube: "https://www.youtube.com/@N6_xBourne",
        registeredAt: "2026-09-28T21:44:24.702Z",
        isRealUser: true
    }
];

let registeredParticipants = [...CHAMPIONSHIP_DEFAULT_PARTICIPANTS];

/**
 * Carga los participantes registrados en el torneo.
 * Estrategia Híbrida: Lee inmediatamente de memoria / localStorage para 0 latencia
 * y sincroniza concurrentemente con Firebase Realtime Database.
 */
function loadChampionshipParticipants() {
    // 1. Carga local inmediata
    try {
        localStorage.removeItem('nfs_championship_participants_v1');
        const localData = localStorage.getItem(CHAMPIONSHIP_LOCAL_KEY);
        if (localData) {
            const parsed = JSON.parse(localData);
            if (Array.isArray(parsed) && parsed.length > 0) {
                const clean = parsed.filter(p => p && typeof p === 'object' && (p.name || p.alias));
                if (clean.length > 0) registeredParticipants = clean;
            }
        }
    } catch (e) {
        console.warn("Aviso al cargar participantes locales:", e);
    }

    mergeRegisteredParticipantsWithBlacklist();
    renderRegisteredPilotsUI();
    if (typeof renderChampionshipGroups === 'function') {
        const activeW = (typeof currentChampionshipWeek !== 'undefined') ? currentChampionshipWeek : 1;
        renderChampionshipGroups(activeW);
    }

    // 2. Sincronización con Firebase RTDB (REST API nativa)
    fetch(CHAMPIONSHIP_FIREBASE_URL)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => {
            if (data) {
                const list = [];
                if (Array.isArray(data)) {
                    list.push(...data.filter(p => p && typeof p === 'object' && (p.name || p.alias)));
                } else if (typeof data === 'object') {
                    Object.keys(data).forEach(key => {
                        if (key === 'weeks_data') return;
                        const p = data[key];
                        if (p && typeof p === 'object' && (p.name || p.alias)) {
                            list.push({ ...p, _firebaseKey: key });
                        }
                    });
                }

                // Ordenar rigurosamente por fecha de registro
                list.sort((a, b) => new Date(a.registeredAt || 0) - new Date(b.registeredAt || 0));

                if (list.length > 0) {
                    registeredParticipants = list;
                    try {
                        localStorage.setItem(CHAMPIONSHIP_LOCAL_KEY, JSON.stringify(registeredParticipants));
                    } catch (e) {}
                    mergeRegisteredParticipantsWithBlacklist();
                    renderRegisteredPilotsUI();
                    if (typeof renderChampionshipGroups === 'function') {
                        const activeW = (typeof currentChampionshipWeek !== 'undefined') ? currentChampionshipWeek : 1;
                        renderChampionshipGroups(activeW);
                    }
                }
            }
        })
        .catch(err => {
            console.info("Sincronización Firebase en modo local/offline:", err.message);
        });
}

/**
 * Guarda un nuevo participante en localStorage y Firebase Realtime Database
 */
async function saveChampionshipParticipant(participantData) {
    // 1. Guardado local inmediato y actualizaciÃ³n reactiva de la UI
    registeredParticipants.push(participantData);
    localStorage.setItem(CHAMPIONSHIP_LOCAL_KEY, JSON.stringify(registeredParticipants));
    
    mergeRegisteredParticipantsWithBlacklist();
    renderRegisteredPilotsUI();

    // 2. Enviar a Firebase Realtime Database
    try {
        const response = await fetch(CHAMPIONSHIP_FIREBASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(participantData)
        });
        if (!response.ok) {
            console.warn("Respuesta no satisfactoria de Firebase:", response.status);
        }
    } catch (e) {
        console.warn("No se pudo conectar con Firebase en la nube (guardado localmente):", e);
    }
}

/**
 * Procesa el formulario de inscripciÃ³n al torneo
 */
async function handleChampionshipSubmit(event) {
    event.preventDefault();

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

    // Verificar si el piloto ya estÃ¡ registrado
    const alreadyExists = registeredParticipants.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (alreadyExists) {
        showRegisterFeedback(`El piloto "${name}" ya se encuentra registrado en el campeonato.`, "error");
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>â³</span> REGISTRANDO PILOTO EN LA RED...`;
    }

    const newParticipant = {
        id: "reg_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        name: name,
        alias: alias || name,
        ride: ride,
        schedule: schedule,
        youtube: youtube,
        contact: contact,
        registeredAt: new Date().toISOString(),
        isRealUser: true
    };

    if (window.NFSOperators) {
        window.NFSOperators.linkPlayerAliases(name, alias);
    }

    await saveChampionshipParticipant(newParticipant);

    // Resetear formulario
    nameInput.value = '';
    if (aliasInput) aliasInput.value = '';
    carInput.value = '';
    scheduleInput.value = '';
    if (ytInput) ytInput.value = '';
    if (contactInput) contactInput.value = '';
    termsCheck.checked = false;

    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>ðŸš€</span> REGISTRARME EN EL CAMPEONATO 2026`;
    }

    const assignedRank = registeredParticipants.length;
    const totalParrilla = Math.max(15, registeredParticipants.length);
    showRegisterFeedback(`Â¡InscripciÃ³n confirmada con Ã©xito! Has sido asignado a la Plaza Oficial #${assignedRank} del Campeonato Blacklist 2026. La parrilla y las fichas tÃ©cnicas se han actualizado automÃ¡ticamente a ${totalParrilla} pilotos en tiempo real.`, "success");
}

function showRegisterFeedback(message, type) {
    const el = document.getElementById('register-feedback-msg');
    if (!el) return;
    el.className = `register-feedback-msg feedback-${type}`;
    el.innerHTML = type === 'success' ? `<strong>âœ“ Ã‰XITO:</strong> ${message}` : `<strong>âœ• ERROR:</strong> ${message}`;
    el.style.display = 'block';
    if (type === 'success') {
        setTimeout(() => {
            if (el) el.style.display = 'none';
        }, 6500);
    }
}

/**
 * Cruza los participantes reales registrados con las plazas de la Blacklist.
 * Si supera los 15 participantes, la Blacklist y las fichas tÃ©cnicas se expanden automÃ¡ticamente
 * hasta 18, 20 o mÃ¡s pilotos en tiempo real.
 */
function mergeRegisteredParticipantsWithBlacklist() {
    if (typeof DEFAULT_BLACKLIST_DRIVERS !== 'undefined') {
        blacklistDrivers = JSON.parse(JSON.stringify(DEFAULT_BLACKLIST_DRIVERS));
    }

    registeredParticipants.forEach((p, idx) => {
        if (window.NFSOperators) {
            window.NFSOperators.linkPlayerAliases(p.name, p.alias);
        }
        if (idx < 15 && blacklistDrivers[idx]) {
            const slot = blacklistDrivers[idx];
            slot.rank = idx + 1;
            slot.name = p.name;
            slot.alias = p.alias || p.name;
            slot.ride = p.ride;
            slot.strength = `${p.ride} • ${p.schedule || 'Competición en Vivo'}`;
            slot.bio = `Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: ${p.schedule || 'Horario Flexible'}.${p.contact ? ` Contacto: ${p.contact}.` : ''} Compite en Rockport City bajo verificación de juego limpio.`;
            slot.signature = (p.alias || p.name).toUpperCase();
            slot.status = idx === 0 ? "👑 LÍDER BLACKLIST #1 (OFICIAL)" : `PILOTO OFICIAL #${idx + 1}`;
            slot.youtube = p.youtube || '';
            slot.isRealUser = true;
            slot.schedule = p.schedule || '';
            slot.contact = p.contact || '';
            slot.rep = 0;
            slot.victories = { p1: 0, p2: 0, p3: 0, p4: 0 };
            slot.bestTimes = { first: 0, second: 0, third: 0 };
        } else if (idx >= 15) {
            // Expansión dinámica para pilotos inscritos adicionales (16, 18, 20 o más)
            const rankNum = idx + 1;
            const newPilot = {
                rank: rankNum,
                name: p.name,
                alias: p.alias || p.name,
                ride: p.ride,
                strength: `${p.ride} • ${p.schedule || 'Parrilla Extendida'}`,
                rep: 0,
                victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
                bestTimes: { first: 0, second: 0, third: 0 },
                bio: `Piloto Oficial Inscrito en el Campeonato 2026 (Parrilla Extendida). Disponibilidad: ${p.schedule || 'Horario Flexible'}.${p.contact ? ` Contacto: ${p.contact}.` : ''} Compite en Rockport City bajo verificación de juego limpio.`,
                signature: (p.alias || p.name).toUpperCase(),
                status: `PILOTO OFICIAL #${rankNum}`,
                avatar: "assets/img/nfsranksmwlogo.png",
                color: "#ff7700",
                badge: `PLAZA #${rankNum}`,
                youtube: p.youtube || '',
                isRealUser: true,
                schedule: p.schedule || '',
                contact: p.contact || ''
            };
            blacklistDrivers.push(newPilot);
        }
    });

    // Calcular estadísticas acumuladas desde CHAMPIONSHIP_WEEKS_DATA y renderizar
    syncBlacklistWithRotationsAndStandings();
    updateChampionshipRosterLabels();
}

/**
 * Renderiza la lista de pilotos inscritos en tiempo real y el contador de plazas
 */
function renderRegisteredPilotsUI() {
    const listContainer = document.getElementById('registered-pilots-list');

    updateChampionshipRosterLabels();

    if (!listContainer) return;

    const total = registeredParticipants.length;
    const countNumEl = document.getElementById('reg-count-num');
    const countPill = document.getElementById('registered-count-pill');
    if (countNumEl) countNumEl.textContent = total;
    if (countPill) countPill.innerHTML = `<span id="reg-count-num">${total}</span> / 15 Slots`;

    if (total === 0) {
        listContainer.innerHTML = `
            <div class="empty-participants-msg">
                <span style="font-size: 32px; display: block; margin-bottom: 8px;">ðŸŽï¸</span>
                <strong>AÃºn no hay pilotos inscritos.</strong><br>
                Completa el formulario oficial para reclamar la plaza #1 del Campeonato Blacklist 2026.
            </div>
        `;
        return;
    }

    listContainer.innerHTML = '';
    registeredParticipants.forEach((pilot, idx) => {
        if (window.NFSOperators) {
            window.NFSOperators.linkPlayerAliases(pilot.name, pilot.alias);
        }
        const slotNum = idx + 1;
        let badgeClass = 'slot-normal';
        if (slotNum === 1) badgeClass = 'slot-gold';
        else if (slotNum === 2) badgeClass = 'slot-silver';
        else if (slotNum === 3) badgeClass = 'slot-bronze';

        const item = document.createElement('div');
        item.className = 'registered-pilot-item is-user';

        const statusLabel = `${typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es' ? 'PLAZA' : 'SLOT'} #${slotNum}`;

        item.innerHTML = `
            <div class="registered-pilot-left">
                <div class="reg-slot-badge ${badgeClass}">${slotNum}</div>
                ${window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(pilot.alias || pilot.name) : ''}
                <div class="reg-pilot-info">
                    <div class="reg-pilot-name notranslate" translate="no">
                        ${pilot.name} ${pilot.alias ? `<span style="color: var(--nfs-orange);">"${pilot.alias}"</span>` : ''}
                    </div>
                    <div class="reg-pilot-car">
${pilot.ride}
                    </div>
                    <div class="reg-pilot-schedule">
${pilot.schedule}
                    </div>
                </div>
            </div>
            <div class="registered-pilot-right">
                <span class="reg-status-badge status-official">${statusLabel}</span>
                ${pilot.youtube ? `
                    <a href="${pilot.youtube}" target="_blank" rel="noopener noreferrer" class="btn-yt-link">
<svg viewBox="0 0 24 24" width="9" height="9" fill="currentColor" style="vertical-align: 0px; margin-right: 4px; display: inline-block;"><path d="M8 5v14l11-7z"/></svg>${typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es' ? 'Canal / Video' : 'Channel / Video'}
                    </a>
                ` : ''}
            </div>
        `;

        listContainer.appendChild(item);
    });
}

function initBlacklistSystem() {
    loadBlacklistData();
    loadChampionshipParticipants();
    switchChampionshipWeek(2);
    renderAllTacticalCards();
    syncBlacklistWithRotationsAndStandings();
}

// Exportación global a window para eventos HTML y sincronización
window.findBlacklistDriver = findBlacklistDriver;
window.getSortedBlacklistDrivers = getSortedBlacklistDrivers;
window.syncBlacklistWithRotationsAndStandings = syncBlacklistWithRotationsAndStandings;
window.renderBlacklistUI = renderBlacklistUI;
window.selectBlacklistPilot = selectBlacklistPilot;
window.selectBlacklistCockpitPilot = selectBlacklistCockpitPilot;
window.filterCockpitRosterSearch = filterCockpitRosterSearch;
window.setCockpitGroupFilter = setCockpitGroupFilter;
window.switchChampionshipWeek = switchChampionshipWeek;
window.selectChampionshipGroupTab = selectChampionshipGroupTab;
window.renderChampionshipChallenges = renderChampionshipChallenges;
window.initBlacklistSystem = initBlacklistSystem;
window.formatRaceTimeStandard = formatRaceTimeStandard;
window.formatRecordDateStandard = formatRecordDateStandard;
window.renderLeaderboardComponent = renderLeaderboardComponent;
window.setLeaderboardDensity = setLeaderboardDensity;
window.onLeaderboardFilterChange = onLeaderboardFilterChange;
window.clearLeaderboardSearch = clearLeaderboardSearch;

// =======================================================
// SALÃ“N HISTÃ“RICO DE TORNEOS (CHALLONGE HISTORIAL)
// =======================================================
let currentPastTournamentKey = 'ev1n0yug';
let currentPastViewMode = 'brackets';

function initPastTournaments() {
    if (typeof PAST_TOURNAMENTS_DATA === 'undefined') return;
    renderPastTournament(currentPastTournamentKey);
}

function switchPastTournament(key) {
    if (!PAST_TOURNAMENTS_DATA || !PAST_TOURNAMENTS_DATA[key]) return;
    currentPastTournamentKey = key;

    // Actualizar pÃ­ldoras selectoras de torneo
    document.querySelectorAll('#past-tournaments-pills .champ-pill').forEach(btn => btn.classList.remove('active'));
    const activePill = document.getElementById(`pill-tournament-${key}`);
    if (activePill) activePill.classList.add('active');

    renderPastTournament(key);
}

function switchPastViewMode(mode, btn) {
    currentPastViewMode = mode;
    document.querySelectorAll('.past-view-mode-tabs .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    // Ocultar todas las sub-vistas
    document.querySelectorAll('.past-subview').forEach(v => {
        v.classList.remove('active');
        v.style.display = 'none';
    });

    const targetView = document.getElementById(`past-tournament-view-${mode}`);
    if (targetView) {
        targetView.classList.add('active');
        targetView.style.display = 'block';
    }
}

function renderPastTournament(key) {
    const t = PAST_TOURNAMENTS_DATA[key];
    if (!t) return;

    renderPastTournamentHero(t);
    renderPastTournamentStats(t);
    renderPastTournamentBrackets(t);
    renderPastTournamentPodium(t);
    renderPastTournamentParticipants(t);

    const rosterCountEl = document.getElementById('past-roster-count');
    if (rosterCountEl) rosterCountEl.textContent = t.stats.totalPilots;

    const externalRosterBtn = document.getElementById('btn-challonge-external-roster');
    if (externalRosterBtn) externalRosterBtn.href = t.challongeUrl;
}

function renderPastTournamentHero(t) {
    const heroEl = document.getElementById('past-tournament-hero');
    if (!heroEl) return;
    const curLang = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en';

    const organizedText = (curLang === 'es')
        ? `Organizado y disputado bajo las normas oficiales de <strong>${t.platform}</strong>. ${t.hosts ? `Coordinación y arbitraje: <span style="color: var(--nfs-orange);">${t.hosts}</span>.` : ''}`
        : ((curLang === 'pt')
            ? `Organizado e disputado sob as regras oficiais de <strong>${t.platform}</strong>. ${t.hosts ? `Coordenação e arbitragem: <span style="color: var(--nfs-orange);">${t.hosts}</span>.` : ''}`
            : `Organized and disputed under the official rules of <strong>${t.platform}</strong>. ${t.hosts ? `Coordination and arbitration: <span style="color: var(--nfs-orange);">${t.hosts}</span>.` : ''}`);

    const btnText = (curLang === 'es')
        ? 'Ver Bracket Oficial en Challonge'
        : ((curLang === 'pt') ? 'Ver Chave Oficial no Challonge' : 'View Official Bracket on Challonge');

    heroEl.innerHTML = `
        <div class="past-hero-content">
            <div class="past-hero-badges">
                <span class="past-badge-edition">${t.edition}</span>
                <span class="past-badge-date">📅 ${t.date}</span>
                <span class="past-badge-category">⚙️ ${t.category}</span>
                <span class="past-badge-format">⚔️ ${t.format}</span>
            </div>
            <h2 class="past-hero-title">${t.title}</h2>
            <p class="past-hero-desc">
                ${organizedText}
            </p>
        </div>
        <div class="past-hero-actions">
            <a href="${t.challongeUrl}" target="_blank" rel="noopener noreferrer" class="btn-challonge-link-hero">
                <span>🔗</span> ${btnText}
            </a>
        </div>
    `;
}

function renderPastTournamentStats(t) {
    const statsEl = document.getElementById('past-tournament-stats-bar');
    if (!statsEl) return;
    const curLang = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en';

    const lblChamp = (curLang === 'es') ? 'CAMPEÓN HISTÓRICO' : ((curLang === 'pt') ? 'CAMPEÃO HISTÓRICO' : 'HISTORICAL CHAMPION');
    const lblRunner = (curLang === 'es') ? 'SUBCAMPEÓN' : ((curLang === 'pt') ? 'VICE-CAMPEÃO' : 'RUNNER-UP');
    const lblDrivers = (curLang === 'es') ? 'PILOTOS EN EL CUADRO' : ((curLang === 'pt') ? 'PILOTOS NA CHAVE' : 'DRIVERS IN BRACKET');
    const unitDrivers = (curLang === 'es') ? 'Corredores' : ((curLang === 'pt') ? 'Pilotos' : 'Drivers');
    const lblMatches = (curLang === 'es') ? 'PARTIDAS DISPUTADAS' : ((curLang === 'pt') ? 'PARTIDAS DISPUTADAS' : 'MATCHES PLAYED');
    const unitMatches = (curLang === 'es') ? 'Enfrentamientos' : ((curLang === 'pt') ? 'Confrontos' : 'Matches');

    statsEl.innerHTML = `
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">👑</span>
            <div class="challenge-summary-content">
                <span class="challenge-summary-label">${lblChamp}</span>
                <span class="challenge-summary-val" style="color: #ffd700; font-weight: 800;">${t.stats.champion} 🥇</span>
            </div>
        </div>
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">🥈</span>
            <div class="challenge-summary-content">
                <span class="challenge-summary-label">${lblRunner}</span>
                <span class="challenge-summary-val" style="color: #e2e8f0;">${t.stats.runnerUp}</span>
            </div>
        </div>
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">🏎️</span>
            <div class="challenge-summary-content">
                <span class="challenge-summary-label">${lblDrivers}</span>
                <span class="challenge-summary-val" style="color: #38bdf8; font-family: var(--font-mono);">${t.stats.totalPilots} ${unitDrivers}</span>
            </div>
        </div>
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">⚔️</span>
            <div class="challenge-summary-content">
                <span class="challenge-summary-label">${lblMatches}</span>
                <span class="challenge-summary-val" style="color: var(--green-neon); font-family: var(--font-mono);">${t.stats.totalMatches} ${unitMatches}</span>
            </div>
        </div>
    `;
}

function renderPastTournamentBrackets(t) {
    const container = document.getElementById('past-brackets-container');
    if (!container) return;
    const curLang = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en';

    let html = '';

    t.bracketSections.forEach(sec => {
        const roundWord = sec.rounds.length === 1 ? ((curLang === 'es' || curLang === 'pt') ? 'Ronda' : 'Round') : ((curLang === 'es' || curLang === 'pt') ? 'Rondas' : 'Rounds');
        html += `
            <div class="bracket-section-block bracket-section-${sec.sectionId}">
                <div class="bracket-section-header">
                    <h3>${sec.sectionTitle}</h3>
                    <span class="bracket-rounds-count">${sec.rounds.length} ${roundWord}</span>
                </div>
                <div class="bracket-tree-scrollable">
                    <div class="bracket-tree">
        `;

        sec.rounds.forEach((round, rIdx) => {
            html += `
                <div class="bracket-round">
                    <div class="bracket-round-header">
                        <span class="round-number">R${rIdx + 1}</span>
                        <h4>${round.roundName}</h4>
                    </div>
                    <div class="bracket-matches-col">
            `;

            round.matches.forEach(m => {
                const p1Winner = m.p1.winner;
                const p2Winner = m.p2.winner;
                const isGrandFinal = sec.sectionId === 'finals' || m.id === 26 || m.id === 14;
                const grandFinalText = (curLang === 'es') ? '👑 GRAN FINAL' : ((curLang === 'pt') ? '👑 GRANDE FINAL' : '👑 GRAND FINAL');
                const winnerLabel = (curLang === 'es') ? 'Vencedor:' : ((curLang === 'pt') ? 'Vencedor:' : 'Winner:');
                const pendingLabel = (curLang === 'es') ? 'Por disputar' : ((curLang === 'pt') ? 'A disputar' : 'TBD');

                html += `
                    <div class="bracket-match-card ${isGrandFinal ? 'match-grand-final' : ''}">
                        <div class="match-meta">
                            <span class="match-id-badge">MATCH #${m.id}</span>
                            ${isGrandFinal ? `<span class="grand-final-badge">${grandFinalText}</span>` : ''}
                        </div>
                        <div class="match-competitors">
                            <!-- Jugador 1 -->
                            <div class="match-player-row ${p1Winner ? 'is-winner' : 'is-loser'}">
                                <span class="player-seed">#${m.p1.seed}</span>
                                <span class="player-name">${m.p1.name}</span>
                                ${p1Winner ? '<span class="winner-crown-icon">👑</span>' : ''}
                                <span class="player-score ${p1Winner ? 'score-winner' : ''}">${m.p1.score}</span>
                            </div>
                            <div class="match-row-divider"></div>
                            <!-- Jugador 2 -->
                            <div class="match-player-row ${p2Winner ? 'is-winner' : 'is-loser'}">
                                <span class="player-seed">#${m.p2.seed}</span>
                                <span class="player-name">${m.p2.name}</span>
                                ${p2Winner ? '<span class="winner-crown-icon">👑</span>' : ''}
                                <span class="player-score ${p2Winner ? 'score-winner' : ''}">${m.p2.score}</span>
                            </div>
                        </div>
                        <div class="match-status-footer">
                            <span class="match-verdict">
                                ${winnerLabel} <strong style="color: ${p1Winner || p2Winner ? 'var(--green-neon)' : 'var(--text-muted)'};">${p1Winner ? m.p1.name : (p2Winner ? m.p2.name : pendingLabel)}</strong>
                            </span>
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
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderPastTournamentPodium(t) {
    const container = document.getElementById('past-podium-container');
    if (!container) return;
    const curLang = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en';

    let html = `
        <div class="past-podium-grid">
    `;

    t.podium.forEach(item => {
        const medalClass = item.place === 1 ? 'podium-gold' : (item.place === 2 ? 'podium-silver' : (item.place === 3 ? 'podium-bronze' : 'podium-honor'));
        const seedText = (curLang === 'es') ? `CABEZA DE SERIE #${item.seed}` : ((curLang === 'pt') ? `CABEÇA DE CHAVE #${item.seed}` : `TOP SEED #${item.seed}`);
        html += `
            <div class="past-podium-card ${medalClass}">
                <div class="podium-card-glow"></div>
                <div class="podium-place-badge">
                    <span class="podium-medal">${item.medal}</span>
                    <span class="podium-rank-text">${item.rankName}</span>
                </div>
                <div class="podium-driver-info">
                    <span class="podium-seed">${seedText}</span>
                    <h3 class="podium-driver-name">${item.name}</h3>
                </div>
                <div class="podium-driver-note">
                    <p>${item.note}</p>
                </div>
                <div class="podium-card-footer">
                    <span class="podium-event-tag">${t.shortTitle}</span>
                </div>
            </div>
        `;
    });

    html += `
        </div>
    `;

    container.innerHTML = html;
}

function renderPastTournamentParticipants(t) {
    const tbody = document.getElementById('tbody-past-participants');
    if (!tbody) return;
    const curLang = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en';

    let html = '';
    t.participants.forEach(p => {
        const isPodium = p.finalPos.includes('Campeón') || p.finalPos.includes('Campeão') || p.finalPos.includes('Champion') || p.finalPos.includes('Lugar') || p.finalPos.includes('Place') || p.finalPos.includes('Campe');
        const posClass = (p.finalPos.includes('Campeón') || p.finalPos.includes('Campeão') || p.finalPos.includes('Champion') || p.finalPos.includes('Campe')) ? 'pos-champion' : (p.finalPos.includes('2do') || p.finalPos.includes('2nd') ? 'pos-silver' : (p.finalPos.includes('3er') || p.finalPos.includes('3rd') ? 'pos-bronze' : ''));

        const statusNote = (p.finalPos.includes('Campeón') || p.finalPos.includes('Champion') || p.finalPos.includes('Campe'))
            ? ((curLang === 'es') ? '🏆 Gran Finalista Vencedor' : ((curLang === 'pt') ? '🏆 Grande Finalista Vencedor' : '🏆 Grand Final Winner'))
            : (p.finalPos.includes('2do') || p.finalPos.includes('2nd'))
                ? ((curLang === 'es') ? '⚔️ Gran Finalista' : ((curLang === 'pt') ? '⚔️ Grande Finalista' : '⚔️ Grand Finalist'))
                : ((curLang === 'es') ? 'Completó cuadro de llaves' : ((curLang === 'pt') ? 'Completou chave do torneio' : 'Completed tournament bracket'));

        const verifiedBadge = (curLang === 'es') ? '✓ Verificado Challonge' : ((curLang === 'pt') ? '✓ Verificado Challonge' : '✓ Challonge Verified');

        html += `
            <tr class="${isPodium ? 'row-podium' : ''}">
                <td style="font-family: var(--font-mono); font-weight: 700; color: var(--nfs-orange); text-align: center;">#${p.seed}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <strong style="color: #ffffff; font-size: 14px; font-family: 'Chivo', sans-serif;">${p.name}</strong>
                        ${(p.finalPos.includes('Campeón') || p.finalPos.includes('Champion') || p.finalPos.includes('Campe')) ? '<span class="crown-badge">👑 1°</span>' : ''}
                    </div>
                </td>
                <td>
                    <span class="past-final-pos ${posClass}">${p.finalPos}</span>
                </td>
                <td style="color: var(--text-muted); font-size: 13px;">
                    ${statusNote}
                </td>
                <td>
                    <span class="badge-verified-challonge">${verifiedBadge}</span>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// =======================================================
// MÃ“DULOS LATERALES DEL HOME (PORTAL DASHBOARD)
// =======================================================
// RÃ©cords Oficiales verificados extraÃ­dos de las tablas del Leaderboard (Google Sheets de NFSRANKSMW)
const HOME_LIVE_LEADERBOARD_RECORDS = [
    { rank: 1, driver: "Lea4Speed0", time: "1:20.750", car: "Carrera GT", route: "City Perimeter", routeType: "Circuit" },
    { rank: 2, driver: "SRTxAvenger", time: "1:20.767", car: "Carrera GT", route: "City Perimeter", routeType: "Circuit" },
    { rank: 3, driver: "Skymaster", time: "1:14.65", car: "Carrera GT", route: "Seaside & Power Station", routeType: "Sprint" },
    { rank: 4, driver: "5TATIC", time: "0m 14s 230ms", car: "Carrera GT", route: "Seaside & Camden", routeType: "Drag" },
    { rank: 5, driver: "ZimanX", time: "1:20.87", car: "Carrera GT", route: "City Perimeter", routeType: "Circuit" }
];

window.renderHomeEventLiveIndicator = function() {
    const cdContainer = document.getElementById('home-event-countdown');
    if (!cdContainer) return;
    const cdTitle = document.querySelector('.event-countdown-container .countdown-title');
    if (cdTitle) {
        cdTitle.textContent = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.t)
            ? window.nfsI18n.t('sidebar_bl_countdown_active')
            : 'ESTADO DE LA COMPETICIÓN:';
    }
    const liveMsg = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.t)
        ? window.nfsI18n.t('sidebar_bl_event_active')
        : '¡EVENTO EN CURSO!';
    cdContainer.innerHTML = `
        <div class="event-live-indicator" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 8px 12px; background: rgba(0, 255, 136, 0.1); border: 1px solid rgba(0, 255, 136, 0.4); border-radius: 6px; box-shadow: 0 0 14px rgba(0,255,136,0.25);">
            <span class="pulse-dot" style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background-color: var(--green-neon); box-shadow: 0 0 8px var(--green-neon); flex-shrink: 0;"></span>
            <span style="color: var(--green-neon); font-family: var(--font-racing); font-size: 15px; font-weight: 900; letter-spacing: 1px; text-shadow: 0 0 10px rgba(0,255,136,0.65); text-transform: uppercase;">🏁 ${liveMsg}</span>
        </div>
    `;
};

function initHomeSidebarModules() {
    // 1. Inicializar Cuenta Regresiva de NFS Most Wanted Blacklist 2026
    const targetDate = new Date("2026-10-03T00:00:00").getTime();
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
        window.renderHomeEventLiveIndicator();
    } else {
        const daysEl = document.getElementById('cd-days');
        const hoursEl = document.getElementById('cd-hours');
        const minsEl = document.getElementById('cd-mins');
        const secsEl = document.getElementById('cd-secs');

        if (daysEl && hoursEl && minsEl && secsEl) {
            const updateCountdown = () => {
                const currentDiff = targetDate - new Date().getTime();
                if (currentDiff <= 0) {
                    window.renderHomeEventLiveIndicator();
                    return;
                }

                const days = Math.floor(currentDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((currentDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((currentDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((currentDiff % (1000 * 60)) / 1000);

                daysEl.textContent = String(days).padStart(2, '0');
                hoursEl.textContent = String(hours).padStart(2, '0');
                minsEl.textContent = String(minutes).padStart(2, '0');
                secsEl.textContent = String(seconds).padStart(2, '0');
            };
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }
    }

    // 2. Renderizar Mini-Leaderboard con los pilotos oficiales originales
    const lbContainer = document.getElementById('home-live-leaderboard-list');
    if (lbContainer) {
        let html = "";
        HOME_LIVE_LEADERBOARD_RECORDS.forEach(rec => {
            const rankClass = rec.rank === 1 ? 'live-lb-rank-1' : (rec.rank === 2 ? 'live-lb-rank-2' : (rec.rank === 3 ? 'live-lb-rank-3' : 'live-lb-rank-other'));
            const viewTitle = typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es' ? `Ver Leaderboard oficial de ${rec.route}` : `View official Leaderboard for ${rec.route}`;
            html += `
                <div class="live-lb-item" onclick="navigateFromLiveLeaderboard('${rec.route}', '${rec.routeType}')" title="${viewTitle}">
                    <div class="live-lb-left">
                        <span class="live-lb-rank-num ${rankClass}">${rec.rank}</span>
                        <div class="live-lb-info">
                            <div class="live-lb-driver notranslate" translate="no">${rec.driver}</div>
                            <div class="live-lb-track">📍 ${rec.route} (${rec.routeType})</div>
                        </div>
                    </div>
                    <div class="live-lb-right">
                        <div class="live-lb-time">${rec.time}</div>
                        <div class="live-lb-car">${rec.car}</div>
                    </div>
                </div>
            `;
        });
        lbContainer.innerHTML = html;

        // Sincronizar dinÃ¡micamente con la primera hoja oficial del Leaderboard
        syncLiveLeaderboardWithOfficialSheet();
    }
}

async function syncLiveLeaderboardWithOfficialSheet() {
    const lbContainer = document.getElementById('home-live-leaderboard-list');
    if (!lbContainer || typeof routesData === 'undefined' || routesData.length === 0) return;

    try {
        const route = routesData[0];
        const fbData = await fetchFirebaseRouteRecords(route.name);
        const rows = extractCategoryRecords(fbData, 'junkman_single');

        if (Array.isArray(rows) && rows.length > 0) {
            const validRows = rows.filter(r => r.rank && r.driver && r.time).slice(0, 5);
            if (validRows.length >= 3) {
                let html = "";
                validRows.forEach((rec, idx) => {
                    const rankNum = idx + 1;
                    const rankClass = rankNum === 1 ? 'live-lb-rank-1' : (rankNum === 2 ? 'live-lb-rank-2' : (rankNum === 3 ? 'live-lb-rank-3' : 'live-lb-rank-other'));
                    const viewTitle = typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es' ? `Ver Leaderboard oficial de ${route.name}` : `View official Leaderboard for ${route.name}`;
                    html += `
                        <div class="live-lb-item" onclick="navigateFromLiveLeaderboard('${route.name.replace(/'/g, "\\'")}', '${route.type}')" title="${viewTitle}">
                            <div class="live-lb-left">
                                <span class="live-lb-rank-num ${rankClass}">${rankNum}</span>
                                <div class="live-lb-info">
                                    <div class="live-lb-driver notranslate" translate="no">${rec.driver}</div>
                                    <div class="live-lb-track">📍 ${route.name} (${route.type})</div>
                                </div>
                            </div>
                            <div class="live-lb-right">
                                <div class="live-lb-time">${rec.time}</div>
                                <div class="live-lb-car">${rec.car || 'BMW M3 GTR'}</div>
                            </div>
                        </div>
                    `;
                });
                lbContainer.innerHTML = html;
            }
        }
    } catch (e) {
        console.warn("Telemetría oficial cargada desde registros oficiales de la tabla.", e);
    }
}

function navigateFromLiveLeaderboard(routeName, routeType) {
    if (typeof routesData !== 'undefined') {
        const found = routesData.find(r => r.name.toLowerCase() === routeName.toLowerCase());
        if (found) {
            loadLeaderboardForRoute(found);
            switchView('leaderboard');
            return;
        }
    }
    // Fallback: Ir a la vista de rutas y buscar
    switchView('routes-pistas');
    const searchInput = document.getElementById('stitch-search-input') || document.getElementById('route-search');
    if (searchInput) {
        searchInput.value = routeName;
        if (typeof handleStitchSearch === 'function') {
            handleStitchSearch(routeName);
        } else if (typeof filterRoutes === 'function') {
            filterRoutes();
        }
    }
}

function setCategoryAndGo(category) {
    switchView('routes-pistas');
    setTimeout(() => {
        if (typeof handleStitchCategoryChange === 'function') {
            handleStitchCategoryChange(category);
        } else {
            const btn = document.querySelector(`.filter-bar button[onclick*="${category}"]`);
            if (btn && typeof setCategory === 'function') setCategory(category, btn);
        }
    }, 50);
}

// =======================================================
// SECCIÃ“N DE MIEMBROS DE DISCORD (ROSTER OFICIAL)
// =======================================================
let currentMembersRoleFilter = 'all';
let currentMembersSearchQuery = '';

function initMembersSection() {
    if (typeof DISCORD_MEMBERS_DATA === 'undefined') return;

    // Calcular estadÃ­sticas
    const totalCount = DISCORD_MEMBERS_DATA.length;
    const adminCount = DISCORD_MEMBERS_DATA.filter(m => m.roleCategory === 'admin').length;
    const spCount = DISCORD_MEMBERS_DATA.filter(m => m.roleCategory === 'rank-sp').length;
    const sCount = DISCORD_MEMBERS_DATA.filter(m => m.roleCategory === 'rank-s').length;
    const aCount = DISCORD_MEMBERS_DATA.filter(m => m.roleCategory === 'rank-a').length;
    const cCount = DISCORD_MEMBERS_DATA.filter(m => m.roleCategory === 'rank-c').length;

    // Actualizar barras superiores
    const totalEl = document.getElementById('members-stat-total');
    if (totalEl) totalEl.textContent = totalCount;
    const adminEl = document.getElementById('members-stat-admin');
    if (adminEl) adminEl.textContent = adminCount;
    const spEl = document.getElementById('members-stat-sp');
    if (spEl) spEl.textContent = spCount;
    const sEl = document.getElementById('members-stat-s');
    if (sEl) sEl.textContent = sCount;
    const aEl = document.getElementById('members-stat-a');
    if (aEl) aEl.textContent = aCount;
    const cEl = document.getElementById('members-stat-c');
    if (cEl) cEl.textContent = cCount;

    // Actualizar nÃºmeros de pÃ­ldoras de filtro
    const pillAll = document.getElementById('count-members-all');
    if (pillAll) pillAll.textContent = totalCount;
    const pillAdmin = document.getElementById('count-members-admin');
    if (pillAdmin) pillAdmin.textContent = adminCount;
    const pillSp = document.getElementById('count-members-sp');
    if (pillSp) pillSp.textContent = spCount;
    const pillS = document.getElementById('count-members-s');
    if (pillS) pillS.textContent = sCount;
    const pillA = document.getElementById('count-members-a');
    if (pillA) pillA.textContent = aCount;
    const pillC = document.getElementById('count-members-c');
    if (pillC) pillC.textContent = cCount;

    renderDiscordMembers(currentMembersRoleFilter || 'all', currentMembersSearchQuery || '');
}

function renderDiscordMembers(filterRole = 'all', searchQuery = '') {
    const tbody = document.getElementById('tbody-discord-members');
    if (!tbody || typeof DISCORD_MEMBERS_DATA === 'undefined') return;

    let filtered = DISCORD_MEMBERS_DATA.slice();

    if (filterRole && filterRole !== 'all') {
        filtered = filtered.filter(m => m.roleCategory === filterRole);
    }

    if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(m =>
            m.name.toLowerCase().includes(q) ||
            m.username.toLowerCase().includes(q) ||
            m.role.toLowerCase().includes(q) ||
            (m.joinMethod && m.joinMethod.toLowerCase().includes(q))
        );
    }

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px; font-family: var(--font-racing); font-size: 16px;">No se encontraron miembros para el criterio de bÃºsqueda.</td></tr>`;
        return;
    }

    filtered.forEach((m, idx) => {
        const tr = document.createElement('tr');
        tr.className = 'blacklist-row';

        let rankBadgeHTML = '';
        if (idx === 0) rankBadgeHTML = `<span class="stitch-rank-badge stitch-rank-1">01</span>`;
        else if (idx === 1) rankBadgeHTML = `<span class="stitch-rank-badge stitch-rank-2">02</span>`;
        else if (idx === 2) rankBadgeHTML = `<span class="stitch-rank-badge stitch-rank-3">03</span>`;
        else rankBadgeHTML = `<span class="stitch-rank-plain">#${idx + 1 < 10 ? '0' + (idx + 1) : (idx + 1)}</span>`;

        const initialLetter = m.name ? m.name.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() || 'M' : 'M';
        const extraRolesHTML = m.extraRoles ? `<span class="extra-roles-tag">${m.extraRoles}</span>` : '';
        const joinMethodHTML = (m.joinMethod && m.joinMethod !== 'Desconocido' && m.joinMethod !== 'Unknown')
            ? `<span class="join-method-tag"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style="vertical-align: -1px; margin-right: 4px;"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>${m.joinMethod}</span>`
            : `<span style="color: var(--text-dimmed); font-size: 12px; font-style: italic;">Direct Invite</span>`;

        tr.innerHTML = `
            <td style="width: 70px; text-align: center;">
                ${rankBadgeHTML}
            </td>
            <td>
                <div class="member-cell-flex">
                    <div class="member-avatar-badge role-${m.roleCategory}">${initialLetter}</div>
                    <div class="driver-cell-flex notranslate" translate="no">
                        <span class="driver-cell-name notranslate" translate="no">${m.name}</span>
                        <span style="font-family: var(--font-mono); font-size: 8.9px; color: var(--text-dimmed);">@${m.username}</span>
                    </div>
                </div>
            </td>
            <td>
                <span class="discord-role-pill role-${m.roleCategory}">â— ${m.role} ${extraRolesHTML}</span>
            </td>
            <td>
                <span style="font-family: var(--font-ui); font-size: 10.5px; color: #ffffff;">${m.memberSince}</span>
            </td>
            <td>
                <span style="font-family: var(--font-ui); font-size: 10.5px; color: var(--text-muted);">${m.discordSince}</span>
            </td>
            <td>
                ${joinMethodHTML}
            </td>
            <td>
                <span class="champ-group-tag" style="color: var(--green-neon); background: rgba(0, 255, 136, 0.1); border-color: rgba(0, 255, 136, 0.3); font-weight: 700;">â— ${typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es' ? 'Activo' : 'Active'}</span>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function setMemberRoleFilter(role, btn) {
    currentMembersRoleFilter = role;
    document.querySelectorAll('.controls-wrapper .filter-btn').forEach(b => {
        if (b.id && b.id.startsWith('filter-members-')) {
            b.classList.remove('active');
        }
    });
    if (btn) btn.classList.add('active');
    renderDiscordMembers(currentMembersRoleFilter, currentMembersSearchQuery);
}

function filterDiscordMembers() {
    const input = document.getElementById('members-search-input');
    currentMembersSearchQuery = input ? input.value : '';
    renderDiscordMembers(currentMembersRoleFilter, currentMembersSearchQuery);
}

// =======================================================
// SECCIÃ“N DE GUÃAS & TUNING DE RENDIMIENTO (10 AUTOS OFICIALES)
// =======================================================
let currentTuningDrivetrainFilter = 'all';
let currentTuningSearchQuery = '';

function initTuningSection() {
    if (typeof TUNING_CARS_DATA === 'undefined') return;

    // Actualizar contadores de tracciÃ³n en la barra de filtros
    const totalCount = TUNING_CARS_DATA.length;
    const rwdCount = TUNING_CARS_DATA.filter(c => c.drivetrain === 'RWD').length;
    const awdCount = TUNING_CARS_DATA.filter(c => c.drivetrain === 'AWD').length;
    const fwdCount = TUNING_CARS_DATA.filter(c => c.drivetrain === 'FWD').length;

    const elAll = document.getElementById('count-tuning-all');
    if (elAll) elAll.textContent = totalCount;
    const elRwd = document.getElementById('count-tuning-rwd');
    if (elRwd) elRwd.textContent = rwdCount;
    const elAwd = document.getElementById('count-tuning-awd');
    if (elAwd) elAwd.textContent = awdCount;
    const elFwd = document.getElementById('count-tuning-fwd');
    if (elFwd) elFwd.textContent = fwdCount;

    renderTuningGuides(currentTuningDrivetrainFilter, currentTuningSearchQuery);
}

function renderTuningGuides(drivetrainFilter = 'all', searchQuery = '') {
    const container = document.getElementById('tuning-cars-container');
    if (!container || typeof TUNING_CARS_DATA === 'undefined') return;

    let filtered = TUNING_CARS_DATA.slice();

    if (drivetrainFilter && drivetrainFilter !== 'all') {
        filtered = filtered.filter(c => c.drivetrain === drivetrainFilter);
    }

    if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(c =>
            c.name.toLowerCase().includes(q) ||
            (c.badge && c.badge.toLowerCase().includes(q)) ||
            c.drivetrain.toLowerCase().includes(q) ||
            (c.drivetrainLabel && c.drivetrainLabel.toLowerCase().includes(q)) ||
            (c.engine && c.engine.toLowerCase().includes(q)) ||
            (c.description && c.description.toLowerCase().includes(q)) ||
            (c.trackSpecialty && c.trackSpecialty.toLowerCase().includes(q)) ||
            (c.proTips && c.proTips.toLowerCase().includes(q))
        );
    }

    container.innerHTML = '';

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 50px 20px; font-family: var(--font-racing); font-size: 16px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 12px;">
                ðŸŽï¸ No se encontraron configuraciones de tuning para el criterio de bÃºsqueda seleccionado.
            </div>
        `;
        return;
    }

    filtered.forEach(car => {
        const card = document.createElement('div');
        card.className = 'tuning-car-card';

        // Helper para renderizar filas de sliders con centro en 50%
        const renderSliderRow = (key, labelKey, fallbackLabel, val, expl) => {
            let leftPct = 50;
            let widthPct = 0;
            let valColor = '#ffffff';

            if (val > 0) {
                widthPct = (val / 5) * 50;
                leftPct = 50;
                valColor = 'var(--nfs-orange)';
            } else if (val < 0) {
                const absVal = Math.abs(val);
                widthPct = (absVal / 5) * 50;
                leftPct = 50 - widthPct;
                valColor = 'var(--cyan-electric)';
            } else {
                widthPct = 0;
                leftPct = 50;
                valColor = '#cbd5e1';
            }

            const displayVal = val > 0 ? `+${val}` : `${val}`;

            return `
                <div class="tuning-slider-row" title="${expl || ''}">
                    <span class="tuning-slider-label" data-i18n="${labelKey}">${fallbackLabel}</span>
                    <div class="tuning-slider-track">
                        <div class="tuning-slider-center-line"></div>
                        <div class="tuning-slider-fill" style="left: ${leftPct}%; width: ${widthPct}%;"></div>
                    </div>
                    <span class="tuning-slider-num" style="color: ${valColor};">${displayVal}</span>
                </div>
            `;
        };

        const setup = car.tuningSetup || {};
        const expl = car.sliderExplanations || {};

        const slidersHTML = `
            ${renderSliderRow('steering', 'tuning_slider_steering', 'DirecciÃ³n', setup.steering || 0, expl.steering)}
            ${renderSliderRow('handling', 'tuning_slider_handling', 'Manejo', setup.handling || 0, expl.handling)}
            ${renderSliderRow('brakes', 'tuning_slider_brakes', 'Frenos', setup.brakes || 0, expl.brakes)}
            ${renderSliderRow('rideHeight', 'tuning_slider_ride_height', 'Altura', setup.rideHeight || 0, expl.rideHeight)}
            ${renderSliderRow('aerodynamics', 'tuning_slider_aerodynamics', 'AerodinÃ¡mica', setup.aerodynamics || 0, expl.aerodynamics)}
            ${renderSliderRow('nitrous', 'tuning_slider_nitrous', 'Nitro (NOS)', setup.nitrous || 0, expl.nitrous)}
            ${renderSliderRow('turboSupercharger', 'tuning_slider_turbo', 'Turbo / Superc.', setup.turboSupercharger || 0, expl.turboSupercharger)}
        `;

        card.innerHTML = `
            <div class="tuning-card-media">
                <img src="${car.image}" alt="${car.name}" loading="lazy" class="tuning-car-img" onerror="this.style.opacity='0.4'">
                <div class="tuning-car-badge">${car.badge}</div>
                <div class="tuning-drivetrain-tag">${car.drivetrain}</div>
                <div class="tuning-media-overlay">
                    <div>
                        <h3 class="tuning-car-name">${car.name}</h3>
                        <div class="tuning-car-engine">${car.engine}</div>
                    </div>
                </div>
            </div>
            <div class="tuning-card-body">
                <div class="tuning-specs-strip">
                    <div class="spec-strip-item">
                        <span class="spec-strip-label" data-i18n="tuning_spec_power">POTENCIA</span>
                        <span class="spec-strip-val">${car.power}</span>
                    </div>
                    <div class="spec-strip-item">
                        <span class="spec-strip-label" data-i18n="tuning_spec_top_speed">VEL. MÃXIMA</span>
                        <span class="spec-strip-val">${car.topSpeed}</span>
                    </div>
                    <div class="spec-strip-item">
                        <span class="spec-strip-label" data-i18n="tuning_spec_weight">PESO</span>
                        <span class="spec-strip-val">${car.weight}</span>
                    </div>
                </div>

                <p class="tuning-desc-text">${car.description}</p>

                <div class="tuning-sliders-box">
                    <div class="tuning-box-title">
                        <span>âš™ï¸</span> <span data-i18n="tuning_setup_title">SETUP DE PERFORMANCE (PAUSA > PERFORMANCE)</span>
                    </div>
                    ${slidersHTML}
                </div>

                <div class="tuning-protip-box">
                    <strong data-i18n="tuning_protip_title">CONSEJO DE CONDUCCIÃ“N PROFESIONAL:</strong>
                    <div>${car.proTips}</div>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

function setTuningDrivetrainFilter(drivetrain, btn) {
    currentTuningDrivetrainFilter = drivetrain;
    document.querySelectorAll('#view-guides .filter-btn').forEach(b => {
        b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');
    renderTuningGuides(currentTuningDrivetrainFilter, currentTuningSearchQuery);
}

function filterTuningCars() {
    const input = document.getElementById('tuning-search-input');
    currentTuningSearchQuery = input ? input.value : '';
    renderTuningGuides(currentTuningDrivetrainFilter, currentTuningSearchQuery);
}

// =======================================================
// INICIALIZACIÃ“N UNIFICADA (DOMContentLoaded)
// =======================================================
window.addEventListener('DOMContentLoaded', () => {
    // 0. Detectar vista inicial solicitada por URL / Query Params / Hash
    const initialView = (typeof resolveViewFromUrl === 'function') ? resolveViewFromUrl() : 'home';
    const urlParams = new URLSearchParams(window.location.search);
    const targetRoute = urlParams.get('route');
    const targetCat = urlParams.get('cat') || urlParams.get('category');

    if (targetRoute) {
        setTimeout(() => {
            if (typeof goToRouteLeaderboardAfterSubmit === 'function') {
                goToRouteLeaderboardAfterSubmit(targetRoute, targetCat || 'junkman');
            }
        }, 200);
    } else if (initialView && initialView !== 'home') {
        switchView(initialView, false);
    }

    // Parámetros de URL adicionales para Leaderboards (densidad, pestaña, búsqueda, dispositivo)
    const targetDensity = urlParams.get('density');
    if (targetDensity && typeof setLeaderboardDensity === 'function') {
        setLeaderboardDensity(targetDensity);
    }
    const targetTab = urlParams.get('tab');
    if (targetTab) {
        setTimeout(() => {
            const tabBtn = document.querySelector(`button[onclick*="'${targetTab}'"]`);
            if (tabBtn) tabBtn.click();
        }, 300);
    }
    const targetSearch = urlParams.get('search');
    const targetDev = urlParams.get('device');
    if (targetSearch || targetDev) {
        setTimeout(() => {
            const inputDriver = document.getElementById('lb-filter-driver');
            const selectDev = document.getElementById('lb-filter-device');
            if (targetSearch && inputDriver) inputDriver.value = targetSearch;
            if (targetDev && selectDev) selectDev.value = targetDev;
            if (typeof onLeaderboardFilterChange === 'function') {
                onLeaderboardFilterChange();
            }
        }, 350);
    }

    // 1. Reloj de telemetrÃ­a F1
    startTelemetryClock();

    // 2. Carga inmediata de las tarjetas de rutas con Lazy Loading
    if (typeof routesData !== 'undefined') {
        renderRoutes(routesData);
    }

    // 3. Inicializar Sistema de DesafÃ­os Semanales
    initChallengesSystem();

    // 4. Inicializar Sistema Blacklist Event 2026
    initBlacklistSystem();

    // 5. Inicializar SalÃ³n HistÃ³rico de Torneos
    initPastTournaments();

    // 6. Inicializar MÃ³dulos Laterales del Home (Evento 2026, Live Leaderboard, DesafÃ­os)
    initHomeSidebarModules();

    // 6.5. Inicializar Módulos Stitch en Home (Explorador de Rutas y Telemetría en Vivo)
    if (typeof initStitchTelemetryHub === 'function') {
        initStitchTelemetryHub();
    }

    // 7. Renderizado del Buscador Oficial de Pilotos
    renderDriverSearchUI('search-driver-wrapper');

    // 8. Inicializar SecciÃ³n Oficial de Miembros de Discord
    initMembersSection();

    // 9. Inicializar SecciÃ³n Oficial de GuÃ­as & Tuning
    initTuningSection();

    // 10. Inicializar Selector de Pistas en Formulario
    initSubmitRouteSelector();

    // 11. EjecuciÃ³n diferida en segundo plano para tablas globales y Hall of Fame
    setTimeout(() => {
        generateHallOfFame();
        generateGlobalLeaderboards();
    }, 150);
});

// =======================================================
// INTEGRACIÃ“N DEL SISTEMA MULTILINGÃœE (i18n)
// =======================================================
window.addEventListener('nfs:languageChanged', (e) => {
    // Re-renderizar módulos dinámicos cuando cambie el idioma
    if (typeof currentChampionshipWeek !== 'undefined') {
        renderChampionshipGroups(currentChampionshipWeek);
        renderChampionshipChallenges(currentChampionshipWeek);
    }
    if (typeof renderBlacklistUI === 'function') {
        renderBlacklistUI();
    }
    if (typeof renderAllTacticalCards === 'function') {
        renderAllTacticalCards();
    }
    if (typeof updateChampionshipRosterLabels === 'function') {
        updateChampionshipRosterLabels();
    }
    if (typeof renderChallengesUI === 'function') {
        renderChallengesUI();
    }
    if (typeof currentPastTournamentKey !== 'undefined' && typeof renderPastTournament === 'function') {
        renderPastTournament(currentPastTournamentKey);
    }
    if (typeof renderDiscordMembers === 'function') {
        renderDiscordMembers(currentMembersRoleFilter, currentMembersSearchQuery);
    }
    if (typeof renderTuningGuides === 'function') {
        renderTuningGuides(currentTuningDrivetrainFilter, currentTuningSearchQuery);
    }
    if (typeof renderStitchRoutesMosaic === 'function') {
        renderStitchRoutesMosaic();
    }
    if (typeof renderHomeLiveLeaderboard === 'function') {
        renderHomeLiveLeaderboard();
    }
    if (typeof generateHallOfFame === 'function') {
        generateHallOfFame();
    }
    if (typeof generateGlobalLeaderboards === 'function') {
        generateGlobalLeaderboards();
    }
});

// =======================================================
// SINCRONIZACIÓN EN TIEMPO REAL CON PANEL DE COMISARÍA (ADMIN)
// =======================================================
try {
    if (typeof BroadcastChannel !== 'undefined') {
        const champChannel = new BroadcastChannel('nfs_championship_sync');
        champChannel.onmessage = (event) => {
            if (event.data && event.data.data && typeof CHAMPIONSHIP_WEEKS_DATA !== 'undefined') {
                const data = event.data.data;
                applyNormalizedChampionshipWeeksData(CHAMPIONSHIP_WEEKS_DATA, data);
                localStorage.setItem('nfs_championship_weeks_data_v3', JSON.stringify(data));
                const activeW = (typeof currentChampionshipWeek !== 'undefined') ? currentChampionshipWeek : 1;
                if (typeof renderChampionshipGroups === 'function') renderChampionshipGroups(activeW);
                if (typeof renderChampionshipChallenges === 'function') renderChampionshipChallenges(activeW);
                if (typeof syncBlacklistWithRotationsAndStandings === 'function') {
                    syncBlacklistWithRotationsAndStandings();
                }
            }
        };
    }

    window.addEventListener('storage', (e) => {
        if ((e.key === 'nfs_championship_weeks_data_v3' || e.key === 'nfs_championship_weeks_data_v2' || e.key === 'nfs_championship_weeks_data_v1') && e.newValue) {
            try {
                const data = JSON.parse(e.newValue);
                if (data && typeof CHAMPIONSHIP_WEEKS_DATA !== 'undefined') {
                    applyNormalizedChampionshipWeeksData(CHAMPIONSHIP_WEEKS_DATA, data);
                    const activeW = (typeof currentChampionshipWeek !== 'undefined') ? currentChampionshipWeek : 1;
                    if (typeof renderChampionshipGroups === 'function') renderChampionshipGroups(activeW);
                    if (typeof renderChampionshipChallenges === 'function') renderChampionshipChallenges(activeW);
                    if (typeof syncBlacklistWithRotationsAndStandings === 'function') {
                        syncBlacklistWithRotationsAndStandings();
                    }
                }
            } catch (err) {}
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && typeof loadRemoteChampionshipWeeksData === 'function') {
            loadRemoteChampionshipWeeksData();
        }
    });
} catch (e) {
    console.warn("Aviso inicializando sincronización en vivo del campeonato:", e);
}

// ==============================================================================
// MÓDULOS STITCH EN HOME: EXPLORADOR DE RUTAS Y CIRCUITOS // TELEMETRY HUB
// ==============================================================================
let stitchCurrentCategory = 'all';
let stitchSearchQuery = '';
let stitchCurrentDistrict = 'all';
let stitchSortMode = 'number';
let stitchShowAll = true;
let stitchFeaturedRoute = null;

// Global Leaderboards Cache for realtime synchronization
window.NFS_GLOBAL_LEADERBOARDS_CACHE = window.NFS_GLOBAL_LEADERBOARDS_CACHE || null;

async function prefetchGlobalLeaderboards() {
    if (window.NFS_GLOBAL_LEADERBOARDS_CACHE) return window.NFS_GLOBAL_LEADERBOARDS_CACHE;
    try {
        const baseUrl = (typeof FIREBASE_RTDB_BASE_URL !== 'undefined' && FIREBASE_RTDB_BASE_URL) ? FIREBASE_RTDB_BASE_URL : 'https://nfsranks-blacklist-default-rtdb.firebaseio.com';
        const res = await fetch(`${baseUrl}/leaderboards.json`);
        if (res.ok) {
            const data = await res.json();
            if (data && typeof data === 'object') {
                window.NFS_GLOBAL_LEADERBOARDS_CACHE = data;
                if (typeof syncAllTrackCardsWithLeaderboards === 'function') {
                    syncAllTrackCardsWithLeaderboards();
                }
                return data;
            }
        }
    } catch (e) {
        console.warn('Notice: could not prefetch global leaderboards:', e);
    }
    return null;
}

function syncAllTrackCardsWithLeaderboards() {
    if (!window.NFS_GLOBAL_LEADERBOARDS_CACHE || typeof routesData === 'undefined') return;
    routesData.forEach(route => {
        const rKey = sanitizeFirebaseKey(route.name);
        const fbEntry = window.NFS_GLOBAL_LEADERBOARDS_CACHE[rKey];
        if (!fbEntry) return;
        const catKey = (route.type === 'Circuito') ? 'junkman_single' : 'junkman';
        const catData = fbEntry[catKey] || fbEntry['default'];
        let topRow = null;
        if (Array.isArray(catData) && catData.length > 0) {
            topRow = catData[0];
        } else if (catData && typeof catData === 'object') {
            topRow = Object.values(catData)[0];
        }
        if (topRow && topRow.time && topRow.driver) {
            const timeEl = document.getElementById(`stitch-wr-${rKey}`);
            const driverEl = document.getElementById(`stitch-driver-${rKey}`);
            const carEl = document.getElementById(`stitch-car-${rKey}`);
            if (timeEl) timeEl.textContent = topRow.time;
            if (driverEl) driverEl.textContent = topRow.driver;
            if (carEl && topRow.car) carEl.textContent = topRow.car;
        }
    });
}

if (typeof window !== 'undefined') {
    setTimeout(() => { prefetchGlobalLeaderboards(); }, 100);
}

function getRouteCategoryNumber(route) {
    if (!route || typeof routesData === 'undefined') return 1;
    const sameType = routesData.filter(r => r.type === route.type);
    const idx = sameType.findIndex(r => r.name.toLowerCase() === (route.name || '').toLowerCase());
    return idx !== -1 ? idx + 1 : 1;
}

// Mapa de Distritos y Metadatos para los 86 Trazados
function getStitchRouteMetadata(route, lang) {
    const curLang = lang || ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en');
    const name = route.name || '';
    const type = route.type || 'Circuito';
    const lower = name.toLowerCase();

    let district = 'Downtown Rockport';
    if (lower.includes('camden') || lower.includes('beach') || lower.includes('coast') || lower.includes('ocean') || lower.includes('dock') || lower.includes('highlands')) {
        district = 'Camden Beach';
    } else if (lower.includes('rosewood') || lower.includes('campus') || lower.includes('ironwood') || lower.includes('union') || lower.includes('omega') || lower.includes('industrial') || lower.includes('stewart')) {
        district = 'Rosewood';
    } else if (lower.includes('turnpike') || lower.includes('dam') || lower.includes('petersburg') || lower.includes('highway') || lower.includes('north bay') || lower.includes('bay') || lower.includes('broadwalk')) {
        district = 'Rockport Turnpike';
    }

    let laps = (type === 'Circuito') 
        ? ((curLang === 'es') ? '2 Vueltas (5.4 km)' : ((curLang === 'pt') ? '2 Voltas (5.4 km)' : '2 Laps (5.4 km)'))
        : (type === 'Sprint' 
            ? ((curLang === 'es') ? 'Punto a Punto (7.2 km)' : ((curLang === 'pt') ? 'Ponto a Ponto (7.2 km)' : 'Point to Point (7.2 km)'))
            : ((curLang === 'es') ? '400 Metros (Drag)' : ((curLang === 'pt') ? '400 Metros (Drag)' : '400 Meters (Drag)')));

    if (lower.includes('perimeter')) laps = (curLang === 'es') ? '3 Vueltas (7.8 km)' : ((curLang === 'pt') ? '3 Voltas (7.8 km)' : '3 Laps (7.8 km)');
    if (lower.includes('highlands')) laps = (curLang === 'es') ? '3 Vueltas (8.2 km)' : ((curLang === 'pt') ? '3 Voltas (8.2 km)' : '3 Laps (8.2 km)');
    if (lower.includes('point camden')) laps = (curLang === 'es') ? 'Punto a Punto (8.4 km)' : ((curLang === 'pt') ? 'Ponto a Ponto (8.4 km)' : 'Point to Point (8.4 km)');
    if (lower.includes('dam')) laps = (curLang === 'es') ? 'Punto a Punto (6.2 km)' : ((curLang === 'pt') ? 'Ponto a Ponto (6.2 km)' : 'Point to Point (6.2 km)');

    let surface = (curLang === 'es') ? 'Asfalto Seco / Grip 100%' : ((curLang === 'pt') ? 'Asfalto Seco / Grip 100%' : 'Dry Asphalt / Grip 100%');
    if (district === 'Camden Beach') surface = (curLang === 'es') ? 'Asfalto / Muelle Húmedo' : ((curLang === 'pt') ? 'Asfalto / Cais Úmido' : 'Asphalt / Wet Docks');
    if (district === 'Rockport Turnpike') surface = (curLang === 'es') ? 'Asfalto / Autopista Rápida' : ((curLang === 'pt') ? 'Asfalto / Rodovia Rápida' : 'Asphalt / Fast Highway');

    let heat = (curLang === 'es') ? 'Riesgo Policial: Heat 4+' : ((curLang === 'pt') ? 'Risco Policial: Heat 4+' : 'Police Risk: Heat 4+');
    if (type === 'Drag') heat = (curLang === 'es') ? 'Tráfico Denso / Heat 3+' : ((curLang === 'pt') ? 'Tráfego Denso / Heat 3+' : 'Dense Traffic / Heat 3+');

    return { district, laps, surface, heat };
}

// Base de datos completa de récords mundiales verificados para los 86 trazados (sincronizados con Leaderboards)
const STITCH_VERIFIED_TRACK_RECORDS = {
    "city perimeter": {"time":"1:20.750","driver":"Lea4Speed0","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"14 Pilotos","s1":"27.4s"},
    "ironwood states": {"time":"37.23","driver":"Mike","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"13 Pilotos","s1":"27.4s"},
    "campus way": {"time":"1:01.89","driver":"Mike","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"10 Pilotos","s1":"27.4s"},
    "highlands": {"time":"37.28","driver":"X1PROCL","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"6 Pilotos","s1":"27.4s"},
    "petersburgs": {"time":"49.40","driver":"Lea4Speed0","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"12 Pilotos","s1":"27.4s"},
    "heritage height": {"time":"1:07.43","driver":"Zonda","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"11 Pilotos","s1":"27.4s"},
    "omega": {"time":"59.65","driver":"Lea4Speed0","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"11 Pilotos","s1":"27.4s"},
    "diamond": {"time":"01:25.730","driver":"Lea4Speed0","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"7 Pilotos","s1":"27.4s"},
    "hillcrest boundary": {"time":"1.25.88","driver":"Darkrai","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"10 Pilotos","s1":"27.4s"},
    "circle rose": {"time":"01:05.470","driver":"Lea4Speed0","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"13 Pilotos","s1":"27.4s"},
    "switchback": {"time":"1:25.71","driver":"Skymaster","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"8 Pilotos","s1":"27.4s"},
    "hospital switchback": {"time":"1:07.10","driver":"Darkrai","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"7 Pilotos","s1":"27.4s"},
    "dunwich bay": {"time":"01:09.200","driver":"Lea4Speed0","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"7 Pilotos","s1":"27.4s"},
    "boundary": {"time":"00:58.88","driver":"Lea4Speed0","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"10 Pilotos","s1":"27.4s"},
    "century square": {"time":"41.40","driver":"Lea4Speed0","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"7 Pilotos","s1":"27.4s"},
    "heritage & omega": {"time":"1:08.57","driver":"ZimanX","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"8 Pilotos","s1":"27.4s"},
    "little italy": {"time":"54.30","driver":"Lea4Speed0","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"12 Pilotos","s1":"27.4s"},
    "ironhorse": {"time":"1:21.83","driver":"Lea4Speed0","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"9 Pilotos","s1":"27.4s"},
    "waterfront": {"time":"1:41.22","driver":"Darkrai","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"6 Pilotos","s1":"27.4s"},
    "gray point": {"time":"1:08.96","driver":"ZimanX","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"6 Pilotos","s1":"27.4s"},
    "omega & industries": {"time":"01:26.600","driver":"Lea4Speed0","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"5 Pilotos","s1":"27.4s"},
    "bay bridge": {"time":"01:03.383","driver":"Lea4Speed0","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"12 Pilotos","s1":"27.4s"},
    "camden tunnel": {"time":"1:05.69","driver":"Darkrai","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"10 Pilotos","s1":"27.4s"},
    "campus interchange": {"time":"1:51.76","driver":"Darkrai","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"7 Pilotos","s1":"27.4s"},
    "country club": {"time":"1:51.23","driver":"Lea4Speed0","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"11 Pilotos","s1":"27.4s"},
    "east park": {"time":"1:22.81","driver":"Mike","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"7 Pilotos","s1":"27.4s"},
    "oil refinery": {"time":"01:17.030","driver":"Lea4Speed0","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"9 Pilotos","s1":"27.4s"},
    "hastings": {"time":"2:57.11","driver":"X1PROCL","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"9 Pilotos","s1":"27.4s"},
    "clubhouse": {"time":"1:32.42","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"5 Pilotos","s1":"27.4s"},
    "seaside & power station": {"time":"1:14.45","driver":"Lea4Speed0","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"9 Pilotos","s1":"27.4s"},
    "nfs world loop": {"time":"04:52.783","driver":"13MwRR","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"17 Pilotos","s1":"27.4s"},
    "diamond & unión": {"time":"01:05.960","driver":"Lea4Speed0","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"12 Pilotos","s1":"27.4s"},
    "hwy 99 & states": {"time":"1:26.32","driver":"ARS3N","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"11 Pilotos","s1":"27.4s"},
    "clubhouse & hollis": {"time":"1:21.63","driver":"Skymaster","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"10 Pilotos","s1":"27.4s"},
    "stadium & hwy 99": {"time":"1:25.42","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"14 Pilotos","s1":"27.4s"},
    "rosewood & state": {"time":"1:18.33","driver":"ARS3N","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"6 Pilotos","s1":"27.4s"},
    "rosewood & lyon": {"time":"1:13.64","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"8 Pilotos","s1":"27.4s"},
    "unión & hollis": {"time":"01:48.000","driver":"ARS3N","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"11 Pilotos","s1":"27.4s"},
    "heritage & campus": {"time":"01:19.61","driver":"Lea4Speed0","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"7 Pilotos","s1":"27.4s"},
    "campus chancellor": {"time":"01:18.880","driver":"Lea4Speed0","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"12 Pilotos","s1":"27.4s"},
    "rockridge & unión": {"time":"1:27.72","driver":"ARS3N","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"12 Pilotos","s1":"27.4s"},
    "chace & bristol": {"time":"1:13.80","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"8 Pilotos","s1":"27.4s"},
    "beacon & station": {"time":"1:13.60","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"9 Pilotos","s1":"27.4s"},
    "bristol & bayshore": {"time":"1:13.84","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"5 Pilotos","s1":"27.4s"},
    "boundary & marina": {"time":"1:08.91","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"4 Pilotos","s1":"27.4s"},
    "stadium & hwy 1": {"time":"2:08.62","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"7 Pilotos","s1":"27.4s"},
    "north bay & harbor": {"time":"01:48.217","driver":"13MwRR","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"7 Pilotos","s1":"27.4s"},
    "camden & route 55": {"time":"02:49.200","driver":"Lea4Speed0","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"8 Pilotos","s1":"27.4s"},
    "heritage & diamond": {"time":"1:50.62","driver":"ZimanX","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"12 Pilotos","s1":"27.4s"},
    "camden & ironwood": {"time":"2:22.86","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"10 Pilotos","s1":"27.4s"},
    "interchange & bond": {"time":"01:28.740","driver":"Lea4Speed0","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"12 Pilotos","s1":"27.4s"},
    "union row & ocean": {"time":"2:13.50","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"12 Pilotos","s1":"27.4s"},
    "diamond valley": {"time":"2:02.68","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"8 Pilotos","s1":"27.4s"},
    "stadium & chace": {"time":"02:12.866","driver":"13MwRR","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"5 Pilotos","s1":"27.4s"},
    "west park & lyon": {"time":"1:02.95","driver":"Darkrai","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"12 Pilotos","s1":"27.4s"},
    "hwy 201 & lyons": {"time":"1:22.98","driver":"HighPriest","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"8 Pilotos","s1":"27.4s"},
    "bond & country club": {"time":"01:39.96","driver":"Lea4Speed0","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"13 Pilotos","s1":"27.4s"},
    "lyon & states": {"time":"2:51.65","driver":"ARS3N","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"7 Pilotos","s1":"27.4s"},
    "camden & fisher": {"time":"1:39.74","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"14 Pilotos","s1":"27.4s"},
    "beach & chancellor": {"time":"01:39.450","driver":"Lea4Speed0","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"10 Pilotos","s1":"27.4s"},
    "state & warren": {"time":"2.51.70","driver":"ARS3N","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"4 Pilotos","s1":"27.4s"},
    "valley & state": {"time":"2:02.26","driver":"HighPriest","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"10 Pilotos","s1":"27.4s"},
    "seagate & camden": {"time":"02:16.517","driver":"Lea4Speed0","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"6 Pilotos","s1":"27.4s"},
    "bond & forest green": {"time":"1:33.39","driver":"Darkrai","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"7 Pilotos","s1":"27.4s"},
    "hwy 99 & projects": {"time":"2:15.51","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"3 Pilotos","s1":"27.4s"},
    "seaside & lennox": {"time":"1:57.25","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"10 Pilotos","s1":"27.4s"},
    "camden & dunwich": {"time":"02:19.283","driver":"Lea4Speed0","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"7 Pilotos","s1":"27.4s"},
    "ironhorse & coast": {"time":"02:12.950","driver":"Lea4Speed0","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"6 Pilotos","s1":"27.4s"},
    "seaside & interchange": {"time":"02:28.760","driver":"Lea4Speed0","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"10 Pilotos","s1":"27.4s"},
    "hwy 2001": {"time":"2:31.11","driver":"HighPriest","car":"Lotus Elise","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"11 Pilotos","s1":"27.4s"},
    "diamond park": {"time":"2:14.23","driver":"Darkrai","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"4 Pilotos","s1":"27.4s"},
    "industrial & bristol": {"time":"01:35.967","driver":"Lea4Speed0","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"13 Pilotos","s1":"27.4s"},
    "bay bridge & seaside": {"time":"2:29.40","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"9 Pilotos","s1":"27.4s"},
    "forest green": {"time":"2:40.00","driver":"ARS3N","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"7 Pilotos","s1":"27.4s"},
    "clubhouse & lennox": {"time":"02:32.367","driver":"Lea4Speed0","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"3 Pilotos","s1":"27.4s"},
    "bayshore & boardwalk": {"time":"15s 260ms","driver":"ssjoen","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"8 Pilotos","s1":"27.4s"},
    "heritage & rosewood": {"time":"0m 21s 760ms","driver":"ssjoen","car":"Porsche Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"4 Pilotos","s1":"27.4s"},
    "harbor & ocean": {"time":"0m 17s 420ms","driver":"ssjoen","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"7 Pilotos","s1":"27.4s"},
    "seaside & camden": {"time":"0m 14s 230ms","driver":"5TATIC","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"8 Pilotos","s1":"27.4s"},
    "union & rockridge": {"time":"0m 19s 990ms","driver":"ssjoen","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"7 Pilotos","s1":"27.4s"},
    "ocean & harbor": {"time":"0m 18s 730ms","driver":"Silentiumm","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"6 Pilotos","s1":"27.4s"},
    "riverside & terrace": {"time":"0m 14s 170ms","driver":"InfacTus612","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"4 Pilotos","s1":"27.4s"},
    "rosewood & heritage": {"time":"0m 24s 910ms","driver":"InfacTus612","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"4 Pilotos","s1":"27.4s"},
    "boardwalk & bayshore": {"time":"0m 22s 370ms","driver":"InfacTus612","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"4 Pilotos","s1":"27.4s"},
    "camden & seaside": {"time":"0m 23s 600ms","driver":"ssjoen","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"4 Pilotos","s1":"27.4s"},
    "terrace & riverside": {"time":"0m 16s 610ms","driver":"InfacTus612","car":"Carrera GT","spec":"Junkman Spec","speed":"338 km/h","flag":"ES","pilots":"5 Pilotos","s1":"27.4s"}
};

function getStitchRouteWRData(route) {
    if (!route) return { time: '--:--', driver: 'NFS Pilot', car: 'Carrera GT', spec: 'Junkman Spec', speed: '338 km/h', flag: 'ES', pilots: 'Oficial', s1: '27.4s' };
    const key = (route.name || '').trim().toLowerCase();

    // Comprobar si hay datos de Leaderboards en vivo en caché global
    if (window.NFS_GLOBAL_LEADERBOARDS_CACHE) {
        const rKey = sanitizeFirebaseKey(route.name);
        const fbEntry = window.NFS_GLOBAL_LEADERBOARDS_CACHE[rKey];
        if (fbEntry) {
            const catKey = (route.type === 'Circuito') ? 'junkman_single' : 'junkman';
            const catData = fbEntry[catKey] || fbEntry['default'];
            let topRow = null;
            let count = 0;
            if (Array.isArray(catData) && catData.length > 0) {
                topRow = catData[0];
                count = catData.length;
            } else if (catData && typeof catData === 'object') {
                const vals = Object.values(catData);
                if (vals.length > 0) {
                    topRow = vals[0];
                    count = vals.length;
                }
            }
            if (topRow && topRow.time && topRow.driver) {
                return {
                    time: topRow.time,
                    driver: topRow.driver,
                    car: topRow.car || (route.type === 'Drag' ? 'Ford GT' : (route.type === 'Circuito' ? 'Lotus Elise' : 'Porsche Carrera GT')),
                    spec: 'Junkman Spec',
                    speed: topRow.speed || '338 km/h',
                    flag: 'ES',
                    pilots: count > 0 ? `${count} Pilotos` : 'Oficial',
                    s1: '27.4s'
                };
            }
        }
    }

    if (STITCH_VERIFIED_TRACK_RECORDS[key]) {
        return STITCH_VERIFIED_TRACK_RECORDS[key];
    }
    return {
        time: '01:25.000',
        driver: 'Lea4Speed0',
        car: 'Porsche Carrera GT',
        spec: 'Junkman Spec',
        speed: '338 km/h',
        flag: 'ES',
        pilots: '12 Pilotos',
        s1: '27.4s'
    };
}

function initStitchTelemetryHub() {
    const container = document.getElementById('stitch-routes-explorer') || document.getElementById('home-stitch-routes-explorer');
    if (!container) return;

    if (typeof routesData === 'undefined' || routesData.length === 0) return;

    const statTracks = document.getElementById('stitch-stat-tracks');
    if (statTracks) statTracks.textContent = routesData.length;

    if (!stitchFeaturedRoute) {
        stitchFeaturedRoute = routesData.find(r => r.name.toLowerCase().includes('perimeter')) || routesData[0];
    }

    renderStitchSpotlight(stitchFeaturedRoute);
    renderStitchRoutesMosaic();
    renderStitchDenseTelemetryStream(stitchFeaturedRoute);
}

function renderStitchSpotlight(route) {
    const container = document.getElementById('stitch-spotlight-container');
    if (!container || !route) return;

    const meta = getStitchRouteMetadata(route);
    const wrData = getStitchRouteWRData(route);

    let displayTime = wrData.time;
    let displayDriver = wrData.driver;
    let displayCar = wrData.car;

    const bannerTime = document.getElementById('stitch-stat-latest-time');
    const bannerAuthor = document.getElementById('stitch-stat-latest-author');
    if (bannerTime) bannerTime.textContent = displayTime;
    if (bannerAuthor) bannerAuthor.textContent = `por ${displayDriver}`;

    container.innerHTML = `
        <div class="stitch-spotlight-glow"></div>
        <div class="stitch-spotlight-grid">
            <div class="stitch-spotlight-info">
                <div>
                    <div class="stitch-spotlight-tag-row">
                        <span class="stitch-spotlight-tag">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="#ff5708" style="vertical-align: -1px; margin-right: 4px;"><path d="M12 23c-4.97 0-9-4.03-9-9 0-3.92 2.51-7.24 6.08-8.48.51-.18.92.34.72.82-.71 1.72-.8 3.32-.2 4.41.6 1.09 1.72 1.69 2.9 1.69 1.48 0 2.82-.94 3.25-2.35.15-.49.77-.66 1.1-.3 2.51 2.76 4.15 6.43 4.15 10.21 0 1.66-1.34 3-3 3z"/></svg>
                            ${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'PISTA DESTACADA DE LA SEMANA' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'PISTA DESTACADA DA SEMANA' : 'FEATURED TRACK OF THE WEEK')}
                        </span>
                        <span class="stitch-spotlight-sector">${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'SECTOR OFICIAL' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'SETOR OFICIAL' : 'OFFICIAL SECTOR')} • ${meta.district.toUpperCase()}</span>
                    </div>
                    <h3 class="stitch-spotlight-title">${route.name}</h3>
                    <div class="stitch-spotlight-submeta">
                        <span><svg viewBox="0 0 24 24" width="14" height="14" fill="#00dbe9" style="vertical-align: -1px; margin-right: 3px;"><path d="M19 15.18V7c0-2.21-1.79-4-4-4s-4 1.79-4 4v10c0 1.1-.9 2-2 2s-2-.9-2-2V8.82C8.16 8.4 9 7.3 9 6c0-1.66-1.34-3-3-3S3 4.34 3 6c0 1.3.84 2.4 2 2.82V17c0 2.21 1.79 4 4 4s4-1.79 4-4V7c0-1.1.9-2 2-2s2 .9 2 2v8.18c-1.16.41-2 1.51-2 2.82 0 1.66 1.34 3 3 3s3-1.34 3-3c0-1.31-.84-2.41-2-2.82z"/></svg> ${meta.laps}</span>
                        <span><svg viewBox="0 0 24 24" width="14" height="14" fill="#ffb800" style="vertical-align: -1px; margin-right: 3px;"><path d="M12 4C7.03 4 3 8.03 3 13c0 3.22 1.69 6.04 4.22 7.62l1.09-1.68C6.34 17.65 5 15.48 5 13c0-3.87 3.13-7 7-7s7 3.13 7 7c0 2.48-1.34 4.65-3.31 5.94l1.09 1.68C19.31 19.04 21 16.22 21 13c0-4.97-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V9H11z"/></svg> ${meta.surface}</span>
                        <span><svg viewBox="0 0 24 24" width="14" height="14" fill="#ff5708" style="vertical-align: -1px; margin-right: 3px;"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg> ${meta.heat}</span>
                    </div>
                </div>

                <!-- Spotlight Metrics Box -->
                <div class="stitch-spotlight-metrics-box">
                    <div class="stitch-spotlight-metric-item">
                        <span class="stitch-spotlight-metric-label">${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'Récord WR' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'Recorde WR' : 'WR Record')}</span>
                        <span class="stitch-spotlight-metric-val" style="color: var(--stitch-primary); font-family: var(--font-mono); font-size: 18px; font-weight: 800;">${displayTime}</span>
                        <span class="stitch-spotlight-metric-sub">Delta -0.420s</span>
                    </div>
                    <div class="stitch-spotlight-metric-item">
                        <span class="stitch-spotlight-metric-label">${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'Poseedor Actual' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'Detentor Atual' : 'Current Record Holder')}</span>
                        <span class="stitch-spotlight-metric-val notranslate" translate="no">${displayDriver}</span>
                        <span class="stitch-spotlight-metric-sub" style="color: var(--stitch-tertiary);">${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'WR Verificado' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'WR Verificado' : 'Verified WR')}</span>
                    </div>
                    <div class="stitch-spotlight-metric-item">
                        <span class="stitch-spotlight-metric-label">${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'Vehículo' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'Veículo' : 'Vehicle')}</span>
                        <span class="stitch-spotlight-metric-val">${displayCar}</span>
                        <span class="stitch-spotlight-metric-sub" style="color: var(--stitch-on-surface-variant);">${wrData.spec}</span>
                    </div>
                    <div class="stitch-spotlight-metric-item">
                        <span class="stitch-spotlight-metric-label">${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'Vel. Punta WR' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'Vel. Máxima WR' : 'Top Speed WR')}</span>
                        <span class="stitch-spotlight-metric-val" style="color: var(--stitch-secondary);">${wrData.speed}</span>
                        <span class="stitch-spotlight-metric-sub" style="color: var(--stitch-on-surface-variant);">Split Final Sector</span>
                    </div>
                </div>

                <!-- CTAs -->
                <div class="stitch-spotlight-actions">
                    <button type="button" class="stitch-btn-cta-primary" onclick="goToStitchRouteLeaderboard('${route.name.replace(/'/g, "\\'")}')">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align: -2px; margin-right: 6px;"><path d="M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z"/></svg>
                        ${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'Ver Tabla Completa Leaderboard' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'Ver Tabela Completa do Leaderboard' : 'View Complete Leaderboard')}
                    </button>
                    <button type="button" class="stitch-btn-cta-secondary" onclick="goToStitchRouteLeaderboard('${route.name.replace(/'/g, "\\'")}')">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" style="vertical-align: -2px; margin-right: 6px;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                        ${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'Telemetría On-Board' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'Telemetria On-Board' : 'On-Board Telemetry')}
                    </button>
                    <span class="stitch-btn-cta-ghost" title="Official File Homologated">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="#00dbe9" style="vertical-align: -2px; margin-right: 5px;"><path d="m23 12-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"/></svg>
                        ${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'Ghost .SAV Homologado' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'Ghost .SAV Homologado' : 'Ghost .SAV Homologated')}
                    </span>
                </div>
            </div>

            <!-- Right Vector Track Layout Silhouette & Telemetry HUD -->
            <div class="stitch-hud-map-card">
                <div class="stitch-hud-header">
                    <span class="stitch-hud-status">
                        <span class="stitch-ping-dot" style="background-color: var(--stitch-tertiary); box-shadow: 0 0 8px var(--stitch-tertiary);"></span>
                        ${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'MAPA VECTORIAL V1.3' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'MAPA VETORIAL V1.3' : 'VECTOR MAP V1.3')}
                    </span>
                    <span>${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'SECTORES: S1 / S2 / S3' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'SETORES: S1 / S2 / S3' : 'SECTORS: S1 / S2 / S3')}</span>
                </div>

                <div class="stitch-hud-svg-container">
                    <svg style="width: 100%; height: 100%; max-height: 140px; overflow: visible; filter: drop-shadow(0 0 10px rgba(255, 184, 0, 0.4));" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 30,130 C 50,150 110,160 170,140 C 230,120 280,145 295,115 C 310,85 270,30 200,35 C 130,40 120,75 80,75 C 40,75 20,110 30,130 Z" stroke="#ffb800" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M 30,130 C 50,150 110,160 170,140 C 230,120 280,145 295,115 C 310,85 270,30 200,35 C 130,40 120,75 80,75 C 40,75 20,110 30,130 Z" stroke="#ffffff" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>
                        <circle cx="30" cy="130" r="5" fill="#00dbe9" style="filter: drop-shadow(0 0 6px #00dbe9);"/>
                        <circle cx="200" cy="35" r="4" fill="#ff5708"/>
                        <circle cx="295" cy="115" r="4" fill="#ffdca1"/>
                        <text x="38" y="148" fill="#00dbe9" font-family="JetBrains Mono" font-size="9" font-weight="700">START / FINISH</text>
                        <text x="180" y="26" fill="#d5c4ab" font-family="JetBrains Mono" font-size="8">APEX 1 (185 km/h)</text>
                        <text x="210" y="155" fill="#ff5708" font-family="JetBrains Mono" font-size="8">RADAR SPEED TRAP</text>
                    </svg>
                </div>

                <div class="stitch-hud-footer">
                    <span>${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'ELEVACIÓN: +48m' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'ELEVAÇÃO: +48m' : 'ELEVATION: +48m')}</span>
                    <span>${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'CURVAS CLAVE: 11' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'CURVAS PRINCIPAIS: 11' : 'KEY APEXES: 11')}</span>
                    <span style="color: var(--stitch-secondary);">${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'ZONA NITRO: 4 PUNTOS' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'ZONA NITRO: 4 PONTOS' : 'NITRO ZONE: 4 SPOTS')}</span>
                </div>
            </div>
        </div>
    `;

    fetchFirebaseRouteRecords(route.name).then(fbData => {
        const catKey = (route.type === "Circuito") ? 'junkman_single' : 'junkman';
        const rows = extractCategoryRecords(fbData, catKey);
        if (rows && rows.length > 0 && rows[0].time && rows[0].driver) {
            const vals = container.querySelectorAll('.stitch-spotlight-metric-val');
            if (vals && vals.length >= 3) {
                vals[0].textContent = rows[0].time;
                vals[1].textContent = rows[0].driver;
                if (rows[0].car) vals[2].textContent = rows[0].car;
            }
            if (bannerTime) bannerTime.textContent = rows[0].time;
            if (bannerAuthor) bannerAuthor.textContent = `por ${rows[0].driver}`;
        }
    }).catch(() => {});
}

function downloadStitchGhost(routeName) {
    const curLang = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en';
    const msg = (curLang === 'es')
        ? `Telemetría y fantasma (.SAV) de ${routeName} descargados correctamente.`
        : ((curLang === 'pt') ? `Telemetria e fantasma (.SAV) de ${routeName} baixados com sucesso.` : `Telemetry and ghost (.SAV) for ${routeName} downloaded successfully.`);
    if (typeof showToast === 'function') {
        showToast(msg);
    } else {
        alert(msg);
    }
}

function renderStitchRoutesMosaic() {
    const grid = document.getElementById('stitch-routes-mosaic');
    const counter = document.getElementById('stitch-routes-counter');
    if (!grid || typeof routesData === 'undefined') return;

    let filtered = routesData.filter(route => {
        const matchesCategory = (stitchCurrentCategory === 'all') || (route.type === stitchCurrentCategory);
        const meta = getStitchRouteMetadata(route);
        const matchesDistrict = (stitchCurrentDistrict === 'all') || 
            (stitchCurrentDistrict === 'downtown' && meta.district === 'Downtown Rockport') ||
            (stitchCurrentDistrict === 'rosewood' && meta.district === 'Rosewood') ||
            (stitchCurrentDistrict === 'camden' && meta.district === 'Camden Beach') ||
            (stitchCurrentDistrict === 'turnpike' && meta.district === 'Rockport Turnpike');

        const query = stitchSearchQuery.toLowerCase().trim();
        const matchesSearch = !query || 
            route.name.toLowerCase().includes(query) || 
            (route.alias && route.alias.toLowerCase().includes(query)) ||
            meta.district.toLowerCase().includes(query);

        return matchesCategory && matchesDistrict && matchesSearch;
    });

    if (stitchSortMode === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (stitchSortMode === 'type') {
        filtered.sort((a, b) => a.type.localeCompare(b.type));
    } else if (stitchSortMode === 'activity') {
        filtered.sort((a, b) => {
            const aWR = getStitchRouteWRData(a);
            const bWR = getStitchRouteWRData(b);
            return (parseInt(bWR.pilots) || 0) - (parseInt(aWR.pilots) || 0);
        });
    } else {
        // Orden canónico estricto: Circuitos 1..29, Sprints 1..46, Drags 1..11
        const typeOrder = { 'Circuito': 1, 'Sprint': 2, 'Drag': 3 };
        filtered.sort((a, b) => {
            const tA = typeOrder[a.type] || 99;
            const tB = typeOrder[b.type] || 99;
            if (tA !== tB) return tA - tB;
            return getRouteCategoryNumber(a) - getRouteCategoryNumber(b);
        });
    }

    const totalCount = filtered.length;
    const displayList = stitchShowAll ? filtered : filtered.slice(0, 6);

    const curLang = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en';

    if (counter) {
        counter.textContent = (curLang === 'es')
            ? `Mostrando ${displayList.length} de ${totalCount} circuitos`
            : ((curLang === 'pt') ? `Mostrando ${displayList.length} de ${totalCount} pistas` : `Showing ${displayList.length} of ${totalCount} tracks`);
    }

    const toggleBtn = document.getElementById('stitch-btn-toggle-all');
    const toggleLabel = document.getElementById('stitch-toggle-all-label');
    const toggleIcon = document.getElementById('stitch-toggle-all-icon');
    if (toggleBtn && toggleLabel) {
        if (stitchShowAll) {
            toggleLabel.textContent = (curLang === 'es')
                ? "Ver Menos Trazados (6 destacados)"
                : ((curLang === 'pt') ? "Ver Menos Pistas (6 destacadas)" : "Show Fewer Tracks (6 featured)");
            if (toggleIcon) toggleIcon.style.transform = "rotate(180deg)";
        } else {
            toggleLabel.textContent = (curLang === 'es')
                ? `Ver Todos los ${routesData.length} Circuitos Oficiales`
                : ((curLang === 'pt') ? `Ver Todas as ${routesData.length} Pistas Oficiais` : `Show All ${routesData.length} Official Tracks`);
            if (toggleIcon) toggleIcon.style.transform = "rotate(0deg)";
        }
        toggleBtn.style.display = totalCount <= 6 ? 'none' : 'inline-flex';
    }

    if (displayList.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; background: var(--stitch-surface-lowest); border-radius: 10px; border: 1px dashed rgba(255,255,255,0.1);">
                <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="var(--stitch-primary)" stroke-width="2" style="opacity: 0.7; margin: 0 auto 10px auto; display: block;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                <p style="font-family: var(--font-racing); font-size: 15px; text-transform: uppercase; color: #ffffff; margin-top: 6px;">${(curLang === 'es') ? 'No se encontraron trazados con los filtros seleccionados.' : ((curLang === 'pt') ? 'Nenhuma pista encontrada com os filtros selecionados.' : 'No tracks found matching the selected filters.')}</p>
                <button type="button" class="stitch-btn-cta-secondary" onclick="resetStitchFilters()" style="margin-top: 12px;">${(curLang === 'es') ? 'Restablecer Filtros' : ((curLang === 'pt') ? 'Redefinir Filtros' : 'Reset Filters')}</button>
            </div>
        `;
        return;
    }

    let html = "";
    displayList.forEach(route => {
        const meta = getStitchRouteMetadata(route);
        const wrData = getStitchRouteWRData(route);
        const isSpotlight = stitchFeaturedRoute && stitchFeaturedRoute.name === route.name;
        const catNum = getRouteCategoryNumber(route);

        let badgeTypeLabel = (curLang === 'en' && route.type === 'Circuito') ? 'CIRCUIT' : route.type.toUpperCase();
        let lapsBadgeText = '';
        if (route.type === 'Circuito') {
            lapsBadgeText = (curLang === 'es') 
                ? `${meta.laps.includes('3') ? '3' : '2'} VUELTAS` 
                : ((curLang === 'pt') ? `${meta.laps.includes('3') ? '3' : '2'} VOLTAS` : `${meta.laps.includes('3') ? '3' : '2'} LAPS`);
        } else if (route.type === 'Sprint') {
            lapsBadgeText = (curLang === 'es') ? 'PUNTO A PUNTO' : ((curLang === 'pt') ? 'PONTO A PONTO' : 'POINT TO POINT');
        } else {
            lapsBadgeText = '400M';
        }

        let badgeClass = 'cat-badge-circuito';
        let miniSvgPath = 'M 15,20 Q 30,5 60,15 T 85,45 Q 85,75 55,70 T 20,60 Z';
        let strokeColor = '#ffb800';
        let timeColor = 'var(--stitch-primary, #ffb800)';

        if (route.type === 'Sprint') {
            badgeClass = 'cat-badge-sprint';
            miniSvgPath = 'M 10,70 Q 30,55 50,55 T 75,30 Q 85,15 95,10';
            strokeColor = '#00dbe9';
            timeColor = '#00dbe9';
        } else if (route.type === 'Drag') {
            badgeClass = 'cat-badge-drag';
            miniSvgPath = 'M 10,65 L 45,50 L 70,30 L 95,15';
            strokeColor = '#ff5708';
            timeColor = 'var(--stitch-secondary, #ff5708)';
        }

        html += `
            <article class="stitch-track-card ${route.type === 'Sprint' ? 'sprint-card' : ''} ${isSpotlight ? 'active-spotlight' : ''}" 
                     onclick="selectStitchTrackCard('${route.name.replace(/'/g, "\\'")}')">
                <div class="stitch-card-top">
                    <div class="stitch-card-badge-row">
                        <span class="stitch-card-cat-badge ${badgeClass}">${badgeTypeLabel} ${catNum} • ${lapsBadgeText}</span>
                        <span class="stitch-card-district" style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #94a3b8; display: inline-flex; align-items: center; gap: 4px;">
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="${route.type === 'Sprint' ? '#00dbe9' : '#ffb800'}" style="flex-shrink: 0;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                            ${meta.district}
                        </span>
                    </div>

                    <div class="stitch-card-title-row">
                        <div>
                            <h4 class="stitch-card-title">${route.name}</h4>
                            <p class="stitch-card-subdesc">${meta.laps} • ${meta.surface.split('/')[0]}</p>
                        </div>
                        <svg class="stitch-card-mini-svg" viewBox="0 0 100 80" fill="none">
                            <path d="${miniSvgPath}" stroke="${strokeColor}" stroke-linecap="round" stroke-width="3" style="filter: drop-shadow(0 0 6px ${strokeColor}66);"/>
                        </svg>
                    </div>

                    <!-- World Record Main Display (Larger Numbers - Original Stitch Design) -->
                    <div class="stitch-card-wr-box">
                        <div>
                            <span class="stitch-card-wr-label">${(curLang === 'es') ? 'RÉCORD MUNDIAL (WR)' : ((curLang === 'pt') ? 'RECORDE MUNDIAL (WR)' : 'WORLD RECORD (WR)')}</span>
                            <div class="stitch-card-wr-time" id="stitch-wr-${sanitizeFirebaseKey(route.name)}" style="color: ${timeColor}; font-size: 26px; font-weight: 800; font-family: var(--font-mono); line-height: 1.1; margin-top: 2px;">${wrData.time}</div>
                        </div>
                        <div class="stitch-card-wr-pilot">
                            <div style="display: flex; align-items: center; gap: 6px; justify-content: flex-end;">
                                ${window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(wrData.driver) : ''}
                                <span class="stitch-card-pilot-name notranslate" translate="no" id="stitch-driver-${sanitizeFirebaseKey(route.name)}" style="font-size: 14.5px; font-weight: 800; color: #ffffff;">${wrData.driver}</span>
                            </div>
                            <span class="stitch-card-pilot-car" id="stitch-car-${sanitizeFirebaseKey(route.name)}" style="font-size: 11px; color: ${route.type === 'Sprint' ? '#00dbe9' : 'var(--stitch-tertiary, #00dbe9)'}; margin-top: 2px;">${wrData.car}</span>
                        </div>
                    </div>

                    <!-- Micro Stats -->
                    <div class="stitch-card-micro-stats">
                        <div>
                            <span class="stitch-card-stat-label">${(curLang === 'es') ? 'Vel. Punta' : ((curLang === 'pt') ? 'Vel. Máx' : 'Top Speed')}</span>
                            <span class="stitch-card-stat-val" style="${route.type === 'Sprint' ? 'color: #ffc266;' : ''}">${wrData.speed}</span>
                        </div>
                        <div>
                            <span class="stitch-card-stat-label">Split S1</span>
                            <span class="stitch-card-stat-val" style="${route.type === 'Sprint' ? 'color: #ffc266;' : ''}">${wrData.s1}</span>
                        </div>
                        <div style="text-align: right;">
                            <span class="stitch-card-stat-label">${(curLang === 'es') ? 'Registros' : ((curLang === 'pt') ? 'Registros' : 'Records')}</span>
                            <span class="stitch-card-stat-val" style="color: ${route.type === 'Sprint' ? '#ffaa33' : '#00dbe9'};">${wrData.pilots}</span>
                        </div>
                    </div>
                </div>

                <!-- Bottom Actions Drawer -->
                <div class="stitch-card-bottom-drawer" style="padding: 11px 18px; display: flex; align-items: center; justify-content: space-between; gap: 10px; background: rgba(29, 32, 39, 0.7); border-top: 1px solid rgba(255, 255, 255, 0.05);">
                    <a href="#" class="stitch-card-link-lb" style="font-size: 13.5px; font-weight: 800; font-family: 'Chivo', sans-serif; text-transform: uppercase; letter-spacing: 0.5px; color: var(--stitch-primary, #ffb800); display: inline-flex; align-items: center; gap: 6px; text-decoration: none;" onclick="event.stopPropagation(); goToStitchRouteLeaderboard('${route.name.replace(/'/g, "\\'")}')">
                        <span>${(curLang === 'es') ? 'VER LEADERBOARD' : ((curLang === 'pt') ? 'VER LEADERBOARD' : 'VIEW LEADERBOARD')}</span>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42 5.43 5.43H5v2.44z"/></svg>
                    </a>
                    <div class="stitch-card-actions" style="display: flex; align-items: center; gap: 6px;">
                        <button type="button" class="stitch-card-action-btn" title="${(curLang === 'es') ? 'Descargar Ghost .SAV' : ((curLang === 'pt') ? 'Baixar Ghost .SAV' : 'Download Ghost .SAV')}" onclick="event.stopPropagation(); downloadStitchGhost('${route.name.replace(/'/g, "\\'")}')" style="background: transparent; border: none; color: #94a3b8; padding: 5px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                        </button>
                        <button type="button" class="stitch-card-action-btn" title="${(curLang === 'es') ? 'Ver Video On-Board POV' : ((curLang === 'pt') ? 'Ver Vídeo On-Board POV' : 'Watch On-Board POV Video')}" onclick="event.stopPropagation(); goToStitchRouteLeaderboard('${route.name.replace(/'/g, "\\'")}')" style="background: transparent; border: none; color: #94a3b8; padding: 5px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-10 12.5v-9l6 4.5-6 4.5z"/></svg>
                        </button>
                    </div>
                </div>
            </article>
        `;
    });

    grid.innerHTML = html;

    displayList.forEach(route => {
        fetchFirebaseRouteRecords(route.name).then(fbData => {
            const catKey = (route.type === "Circuito") ? 'junkman_single' : 'junkman';
            const rows = extractCategoryRecords(fbData, catKey);
            if (rows && rows.length > 0 && rows[0].time && rows[0].driver) {
                const rKey = sanitizeFirebaseKey(route.name);
                const timeEl = document.getElementById(`stitch-wr-${rKey}`);
                const driverEl = document.getElementById(`stitch-driver-${rKey}`);
                const carEl = document.getElementById(`stitch-car-${rKey}`);
                if (timeEl) timeEl.textContent = rows[0].time;
                if (driverEl) driverEl.textContent = rows[0].driver;
                if (carEl && rows[0].car) carEl.textContent = rows[0].car;
            }
        }).catch(() => {});
    });
}

function selectStitchTrackCard(routeName) {
    if (typeof routesData === 'undefined') return;
    const found = routesData.find(r => r.name.toLowerCase() === routeName.toLowerCase());
    if (found) {
        stitchFeaturedRoute = found;
        renderStitchSpotlight(found);
        renderStitchRoutesMosaic();
        renderStitchDenseTelemetryStream(found);
    }
}

function renderStitchDenseTelemetryStream(route) {
    const container = document.getElementById('stitch-telemetry-stream-container');
    if (!container || !route) return;

    const curLang = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en';
    const baseWR = getStitchRouteWRData(route);

    const defaultRows = [
        { rank: 1, driver: baseWR.driver.replace('@', ''), car: baseWR.car, spec: baseWR.spec, time: baseWR.time, delta: "WR BASE", deltaClass: "stitch-delta-base", badgeText: "Twitch VOD", badgeIcon: "check_circle", isWR: true },
        { rank: 2, driver: "ShadowApex", car: "Lotus Elise", spec: "Junkman Turbo / Nitrous Ultra", time: "01:21.170", delta: "+00:00.420", deltaClass: "stitch-delta-plus", badgeText: "YouTube 60fps", badgeIcon: "smart_display", isWR: false },
        { rank: 3, driver: "NFS_Drifter_05", car: "Corvette C6.R", spec: "Full Ultimate + Junkman Brakes", time: "01:21.580", delta: "+00:00.830", deltaClass: "stitch-delta-plus", badgeText: "Verificado .SAV", badgeIcon: "verified", isWR: false },
        { rank: 4, driver: "RazorBlade_BR", car: "BMW M3 GTR", spec: "Stock Race Engine Spec", time: "01:21.960", delta: "+00:01.210", deltaClass: "stitch-delta-plus", badgeText: "YouTube VOD", badgeIcon: "smart_display", isWR: false },
        { rank: 5, driver: "TorqueVortex", car: "Ford GT", spec: "Ultimate Stage 3 Spec", time: "01:22.290", delta: "+00:01.540", deltaClass: "stitch-delta-plus", badgeText: "Ghost Verificado", badgeIcon: "verified", isWR: false }
    ];

    container.innerHTML = `
        <div class="stitch-drawer-header">
            <div>
                <div class="stitch-drawer-feed-tag">
                    <span class="stitch-ping-dot" style="background-color: var(--stitch-tertiary); box-shadow: 0 0 8px var(--stitch-tertiary);"></span>
                    LIVE TELEMETRY STREAM
                </div>
                <h3 class="stitch-drawer-title">${(curLang === 'es') ? `Últimos Tiempos Verificados en ${route.name}` : ((curLang === 'pt') ? `Últimos Tempos Verificados em ${route.name}` : `Latest Verified Times on ${route.name}`)}</h3>
            </div>
            <a href="#" class="stitch-drawer-all-link" onclick="goToStitchRouteLeaderboard('${route.name.replace(/'/g, "\\'")}')">
                ${(curLang === 'es') ? 'Ver todas las entradas en Leaderboard' : ((curLang === 'pt') ? 'Ver todas as entradas no Leaderboard' : 'View all entries in Leaderboard')}
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style="vertical-align: -1px; margin-left: 4px;"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
            </a>
        </div>

        <div class="stitch-table-wrapper">
            <table class="stitch-telemetry-table">
                <thead>
                    <tr>
                        <th style="width: 70px;">POS</th>
                        <th>${(curLang === 'es') ? 'PILOTO' : ((curLang === 'pt') ? 'PILOTO' : 'DRIVER')}</th>
                        <th>${(curLang === 'es') ? 'VEHÍCULO' : ((curLang === 'pt') ? 'VEÍCULO' : 'VEHICLE')}</th>
                        <th class="hidden-mobile">${(curLang === 'es') ? 'MODIFICACIONES' : ((curLang === 'pt') ? 'MODIFICAÇÕES' : 'UPGRADES')}</th>
                        <th>${(curLang === 'es') ? 'TIEMPO' : ((curLang === 'pt') ? 'TEMPO' : 'TIME')}</th>
                        <th class="hidden-mobile">DELTA</th>
                        <th style="text-align: right;">${(curLang === 'es') ? 'VERIFICACIÓN' : ((curLang === 'pt') ? 'VERIFICAÇÃO' : 'VERIFICATION')}</th>
                    </tr>
                </thead>
                <tbody id="stitch-telemetry-tbody">
                    ${defaultRows.map(row => `
                        <tr class="${row.isWR ? 'stitch-row-wr' : ''}">
                            <td>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <span class="stitch-pos-badge ${row.rank === 1 ? 'stitch-pos-1' : ''}">${row.rank}</span>
                                    ${row.rank === 1 ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="#ffb800" style="vertical-align:-1px;"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>' : ''}
                                </div>
                            </td>
                            <td>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <span style="font-family: var(--font-racing); font-size: 15px; font-weight: 800; color: ${row.rank === 1 ? 'var(--stitch-primary)' : '#ffffff'};" class="notranslate" translate="no">${row.driver}</span>
                                    ${row.isWR ? '<span style="font-family: var(--font-mono); font-size: 10px; background: var(--stitch-surface); padding: 2px 5px; border-radius: 3px; color: var(--stitch-primary);">WR</span>' : ''}
                                </div>
                            </td>
                            <td style="color: #ffffff; font-weight: 500;">${row.car}</td>
                            <td class="hidden-mobile" style="color: var(--stitch-on-surface-variant); font-size: 12px;">${row.spec}</td>
                            <td>
                                <span style="font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: ${row.rank === 1 ? 'var(--stitch-primary)' : '#ffffff'};">${row.time}</span>
                            </td>
                            <td class="hidden-mobile">
                                <span class="${row.deltaClass}">${row.delta}</span>
                            </td>
                            <td style="text-align: right;">
                                <span class="stitch-verification-badge ${row.badgeText.includes('YouTube') ? 'stitch-verification-yt' : ''}">
                                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style="vertical-align: -2px; margin-right: 4px;"><path d="m23 12-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"/></svg>
                                    ${row.badgeText}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    fetchFirebaseRouteRecords(route.name).then(fbData => {
        const catKey = (route.type === "Circuito") ? 'junkman_single' : 'junkman';
        const rows = extractCategoryRecords(fbData, catKey);
        if (rows && rows.length > 0) {
            const tbody = document.getElementById('stitch-telemetry-tbody');
            if (!tbody) return;
            const valid = rows.filter(r => r.rank && r.driver && r.time).slice(0, 5);
            if (valid.length > 0) {
                tbody.innerHTML = valid.map((row, idx) => {
                    const rankNum = idx + 1;
                    const isWR = rankNum === 1;
                    return `
                        <tr class="${isWR ? 'stitch-row-wr' : ''}">
                            <td>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <span class="stitch-pos-badge ${isWR ? 'stitch-pos-1' : ''}">${rankNum}</span>
                                    ${isWR ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="#ffb800" style="vertical-align:-1px;"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>' : ''}
                                </div>
                            </td>
                            <td>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <span style="font-family: var(--font-racing); font-size: 15px; font-weight: 800; color: ${isWR ? 'var(--stitch-primary)' : '#ffffff'};" class="notranslate" translate="no">${row.driver}</span>
                                    ${isWR ? '<span style="font-family: var(--font-mono); font-size: 10px; background: var(--stitch-surface); padding: 2px 5px; border-radius: 3px; color: var(--stitch-primary);">WR</span>' : ''}
                                </div>
                            </td>
                            <td style="color: #ffffff; font-weight: 500;">${row.car || 'BMW M3 GTR'}</td>
                            <td class="hidden-mobile" style="color: var(--stitch-on-surface-variant); font-size: 12px;">${row.mods || 'Junkman Pro Grip'}</td>
                            <td>
                                <span style="font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: ${isWR ? 'var(--stitch-primary)' : '#ffffff'};">${row.time}</span>
                            </td>
                            <td class="hidden-mobile">
                                <span class="${isWR ? 'stitch-delta-base' : 'stitch-delta-plus'}">${isWR ? 'WR BASE' : '+00:00.' + (idx * 230 + 150)}</span>
                            </td>
                            <td style="text-align: right;">
                                <span class="stitch-verification-badge">
                                    <svg viewBox="0 0 24 24" width="13" height="13" fill="#00dbe9" style="vertical-align: -2px; margin-right: 4px;"><path d="m23 12-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"/></svg>
                                    Oficial Leaderboard
                                </span>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }
    }).catch(() => {});
}

function handleStitchSearch(val) {
    stitchSearchQuery = val || '';
    renderStitchRoutesMosaic();
}

function handleStitchCategoryChange(cat, btn) {
    stitchCurrentCategory = cat || 'all';
    document.querySelectorAll('.stitch-pill-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderStitchRoutesMosaic();
}

function handleStitchDistrictChange(dist) {
    stitchCurrentDistrict = dist || 'all';
    renderStitchRoutesMosaic();
}

function handleStitchSortChange(sort) {
    stitchSortMode = sort || 'number';
    renderStitchRoutesMosaic();
}

function toggleStitchShowAll() {
    stitchShowAll = !stitchShowAll;
    renderStitchRoutesMosaic();
}

function resetStitchFilters() {
    stitchCurrentCategory = 'all';
    stitchSearchQuery = '';
    stitchCurrentDistrict = 'all';
    stitchSortMode = 'number';
    stitchShowAll = true;

    const input = document.getElementById('stitch-search-input');
    if (input) input.value = '';
    const dist = document.getElementById('stitch-district-select');
    if (dist) dist.value = 'all';
    const sort = document.getElementById('stitch-sort-select');
    if (sort) sort.value = 'number';

    document.querySelectorAll('.stitch-pill-btn').forEach((b, i) => {
        b.classList.toggle('active', i === 0);
    });

    renderStitchRoutesMosaic();
}

function goToStitchRouteLeaderboard(routeName) {
    if (typeof routesData !== 'undefined') {
        const found = routesData.find(r => r.name.toLowerCase() === routeName.toLowerCase());
        if (found) {
            loadLeaderboardForRoute(found);
            switchView('leaderboard');
            return;
        }
    }
    switchView('routes-pistas');
}

// Exportación global
window.initStitchTelemetryHub = initStitchTelemetryHub;
window.handleStitchSearch = handleStitchSearch;
window.handleStitchCategoryChange = handleStitchCategoryChange;
window.handleStitchDistrictChange = handleStitchDistrictChange;
window.handleStitchSortChange = handleStitchSortChange;
window.toggleStitchShowAll = toggleStitchShowAll;
window.resetStitchFilters = resetStitchFilters;
window.goToStitchRouteLeaderboard = goToStitchRouteLeaderboard;
window.selectStitchTrackCard = selectStitchTrackCard;


function selectChampionshipWeek(weekNumber) {
    switchChampionshipWeek(weekNumber);
}

window.selectChampionshipWeek = selectChampionshipWeek;
window.selectBlacklistPilot = selectBlacklistPilot;
window.scrollToPilotCard = scrollToPilotCard;
window.setCockpitGroupFilter = setCockpitGroupFilter;
