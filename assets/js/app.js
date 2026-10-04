window.addEventListener('storage', (e) => {
    if (e.key === 'nfs_championship_weeks_data_v2' && e.newValue) {
        try {
            const data = JSON.parse(e.newValue);
            if (data && typeof data === 'object' && typeof CHAMPIONSHIP_WEEKS_DATA !== 'undefined') {
                if (Array.isArray(data)) {
                    data.forEach((w, idx) => {
                        if (w && idx > 0) {
                            CHAMPIONSHIP_WEEKS_DATA[idx] = w;
                            CHAMPIONSHIP_WEEKS_DATA[String(idx)] = w;
                        }
                    });
                } else {
                    Object.keys(data).forEach(k => {
                        if (data[k]) {
                            CHAMPIONSHIP_WEEKS_DATA[k] = data[k];
                            const n = parseInt(k, 10);
                            if (!isNaN(n)) CHAMPIONSHIP_WEEKS_DATA[n] = data[k];
                        }
                    });
                }
                const activeW = (typeof currentChampionshipWeek !== 'undefined') ? currentChampionshipWeek : 1;
                if (typeof renderChampionshipGroups === 'function') renderChampionshipGroups(activeW);
                if (typeof renderChampionshipChallenges === 'function') renderChampionshipChallenges(activeW);
                if (typeof renderBlacklistUI === 'function') renderBlacklistUI();
                if (typeof renderAllTacticalCards === 'function') renderAllTacticalCards();
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
 * LÃ³gica principal: NavegaciÃ³n, TelemetrÃ­a F1, CachÃ© Inteligente,
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

    const targetNavLink = document.getElementById('nav-' + viewId) || document.getElementById('nav-dropdown-' + viewId);
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
    document.querySelectorAll('#container-tabs-circuit .tab-btn').forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) targetTab.classList.add('active');
    if (btn) btn.classList.add('active');

    // Sincronizar pÃ­ldoras
    if (tabId.includes('junkman')) {
        currentModality = 'junkman';
        const pMod = document.getElementById('pill-val-modality');
        if (pMod) pMod.textContent = 'Junkman';
    } else if (tabId.includes('bmw')) {
        currentModality = 'bmw';
        const pMod = document.getElementById('pill-val-modality');
        if (pMod) pMod.textContent = 'BMW M3 GTR';
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
    applyCurrentCarFilter();
}

function switchSprintDragTab(tabId, btn) {
    document.querySelectorAll('.sprintdrag-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('#container-tabs-sprintdrag .tab-btn').forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) targetTab.classList.add('active');
    if (btn) btn.classList.add('active');

    if (tabId.includes('junkman')) {
        currentModality = 'junkman';
        const pMod = document.getElementById('pill-val-modality');
        if (pMod) pMod.textContent = 'Junkman';
    } else if (tabId.includes('bmw')) {
        currentModality = 'bmw';
        const pMod = document.getElementById('pill-val-modality');
        if (pMod) pMod.textContent = 'BMW M3 GTR';
    }
    applyCurrentCarFilter();
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
        status: 'LÃ­der en Fuga // Downtown Express',
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
        if (btnIcon) btnIcon.textContent = 'â–¶ï¸';
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
            previewContainer.outerHTML = `
                <div class="route-record-preview">
<span class="route-time-display"><svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" style="vertical-align: -1px; margin-right: 3px; display: inline-block;"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>${topRow.time}</span>
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
        titleEl.innerHTML = `<span class="title-main">LEADERBOARD:</span> <span class="title-accent">${escapeHtml(route.name)}</span> <span class="title-sub" style="font-size: 0.72em; opacity: 0.85; color: #cbd5e1; margin-left: 6px;">(${escapeHtml(route.type)})</span>`;
    }
    const supEl = document.getElementById('leaderboard-sup');
    if (supEl && route) {
        const typeText = route.type ? route.type.toUpperCase() : 'ROUTE';
        supEl.innerText = `${typeText} TELEMETRY // ROCKPORT TIMING`;
    }
    const descEl = document.getElementById('leaderboard-desc');
    if (descEl && route) {
        descEl.innerText = `Detailed record of times, drivers, and telemetry for ${route.name} (${route.type}).`;
    }

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

    if (route.type === "Circuito") {
        if (circuitTabs) circuitTabs.classList.add('active-group');
        if (sprintDragTabs) sprintDragTabs.classList.remove('active-group');
        switchCircuitTab('junkman-single', circuitTabs.querySelector('.tab-btn'));

        const fbJunkmanSingle = extractCategoryRecords(fbData, 'junkman_single');
        const fbJunkmanFast = extractCategoryRecords(fbData, 'junkman_fast');
        const fbBmwSingle = extractCategoryRecords(fbData, 'bmw_single');
        const fbBmwFast = extractCategoryRecords(fbData, 'bmw_fast');

        renderTableRows('tbody-junkman-single', fbJunkmanSingle);
        renderTableRows('tbody-junkman-fast', fbJunkmanFast);
        renderTableRows('tbody-bmw-single', fbBmwSingle);
        renderTableRows('tbody-bmw-fast', fbBmwFast);
    } else {
        if (circuitTabs) circuitTabs.classList.remove('active-group');
        if (sprintDragTabs) sprintDragTabs.classList.add('active-group');
        switchSprintDragTab('sprintdrag-junkman', sprintDragTabs.querySelector('.tab-btn'));

        const fbJunkman = extractCategoryRecords(fbData, 'junkman');
        const fbBmw = extractCategoryRecords(fbData, 'bmw');

        renderTableRows('tbody-sprintdrag-junkman', fbJunkman);
        renderTableRows('tbody-sprintdrag-bmw', fbBmw);
    }
}

function formatRaceTime(timeStr) {
    if (!timeStr) return '--:--.---';
    if (typeof timeStr === 'number') {
        return window.NFS_FIREBASE ? window.NFS_FIREBASE.formatMsToTime(timeStr) : String(timeStr);
    }
    const clean = String(timeStr).trim();
    if (window.NFS_FIREBASE && window.NFS_FIREBASE.parseTimeToMs) {
        const ms = window.NFS_FIREBASE.parseTimeToMs(clean);
        if (ms !== null) {
            return window.NFS_FIREBASE.formatMsToTime(ms);
        }
    }
    return clean;
}

function renderTableRows(tbodyId, dataRows) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!dataRows || dataRows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 25px; font-family: var(--font-racing); font-size: 13px;">Sin registros oficiales para esta categorÃ­a aÃºn.</td></tr>`;
        return;
    }

    dataRows.forEach(row => {
        const tr = document.createElement('tr');
        const rankNum = parseInt(String(row.rank).replace(/[^0-9]/g, ''), 10);
        const displayRank = !isNaN(rankNum) && rankNum > 0 ? rankNum : (row.rank || '1');

        let rankBadgeClass = 'rank-normal';
        if (displayRank === 1) rankBadgeClass = 'rank-gold';
        else if (displayRank === 2) rankBadgeClass = 'rank-silver';
        else if (displayRank === 3) rankBadgeClass = 'rank-bronze';

        let rowHighlightClass = displayRank === 1 ? 'active-row' : '';
        tr.className = `blacklist-row ${rowHighlightClass}`;
        tr.setAttribute('data-car', row.car || '');

        let videoBtnHTML = (row.yt && row.yt !== "#" && row.yt.startsWith("http"))
            ? `<a href="${row.yt}" target="_blank" rel="noopener noreferrer" class="btn-yt-link"><svg viewBox="0 0 24 24" width="9" height="9" fill="currentColor" style="vertical-align: 0px; margin-right: 4px; display: inline-block;"><path d="M8 5v14l11-7z"/></svg>VIDEO</a>`
            : `<span class="no-video-text">--</span>`;

        let aliasTag = '';
        if (displayRank === 1) aliasTag = '<span class="driver-cell-alias alias-wr">WORLD RECORD</span>';
        else if (displayRank === 2) aliasTag = '<span class="driver-cell-alias alias-top2">TOP 2 WORLD</span>';
        else if (displayRank === 3) aliasTag = '<span class="driver-cell-alias alias-top3">TOP 3 WORLD</span>';
        else aliasTag = '<span class="driver-cell-alias alias-driver">OFFICIAL DRIVER</span>';

        const blBadgeClass = displayRank === 1 ? 'bl-badge-gold' : displayRank === 2 ? 'bl-badge-silver' : displayRank === 3 ? 'bl-badge-bronze' : '';

        // Badge hexagonal para Top 3 o nÃºmero limpio para #4+
        let rankBadgeHTML = '';
        if (displayRank === 1) {
            rankBadgeHTML = `
                <div class="hex-badge">
                    <svg class="hex-svg" viewBox="0 0 36 36">
                        <polygon class="hex-shape hex-shape-gold" points="18,2 33,10 33,26 18,34 3,26 3,10"/>
                        <text x="18" y="19" class="hex-text">1</text>
                    </svg>
                </div>`;
        } else if (displayRank === 2) {
            rankBadgeHTML = `
                <div class="hex-badge">
                    <svg class="hex-svg" viewBox="0 0 36 36">
                        <polygon class="hex-shape hex-shape-silver" points="18,2 33,10 33,26 18,34 3,26 3,10"/>
                        <text x="18" y="19" class="hex-text">2</text>
                    </svg>
                </div>`;
        } else if (displayRank === 3) {
            rankBadgeHTML = `
                <div class="hex-badge">
                    <svg class="hex-svg" viewBox="0 0 36 36">
                        <polygon class="hex-shape hex-shape-bronze" points="18,2 33,10 33,26 18,34 3,26 3,10"/>
                        <text x="18" y="19" class="hex-text">3</text>
                    </svg>
                </div>`;
        } else {
            rankBadgeHTML = `<span class="rank-plain">${displayRank}</span>`;
        }

        const formattedTime = formatRaceTime(row.time);

        let gbRaw = (row.gearbox || 'Manual').trim();
        let gbDisplay = 'Manual';
        if (gbRaw.toLowerCase().includes('auto')) {
            gbDisplay = 'Auto';
        }

        tr.innerHTML = `
            <td class="col-place">
                ${rankBadgeHTML}
            </td>
            <td class="col-player">
                <div class="driver-name-cell-wrapper">
                    ${window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(row.driver) : ''}
                    <div class="driver-cell-flex">
                        <div class="driver-names-row">
                            <span class="driver-cell-name notranslate" translate="no">${row.driver}</span>
                            ${aliasTag}
                        </div>
                        <div class="driver-car-sub">
                            <span class="car-name-text">${row.car || 'BMW M3 GTR'}</span>
                            <span class="bl-chip ${blBadgeClass}">BL #${displayRank}</span>
                            <span class="bl-chip bl-chip-gearbox">${gbDisplay}</span>
                        </div>
                    </div>
                </div>
            </td>
            <td class="col-time">
                <span class="time-stat-val">${formattedTime}</span>
            </td>
            <td class="col-desktop col-car">
                <span class="leaderboard-car-text">${row.car || '--'}</span>
            </td>
            <td class="col-desktop col-device">
                ${window.NFS_HARDWARE ? window.NFS_HARDWARE.getPublicTagHTML(row.device) : `<span class="leaderboard-device-pill hw-public-tag"><span class="device-label">${row.device || 'Teclado'}</span></span>`}
            </td>
            <td class="col-desktop col-gearbox">
                <span class="leaderboard-gearbox-pill" title="Transmisión: ${gbRaw}">
                    <span class="gear-icon"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style="vertical-align: -1.5px; display: inline-block;"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg></span>
                    <span class="gearbox-label">${gbDisplay}</span>
                </span>
            </td>
            <td class="col-desktop col-date">
                <span class="leaderboard-date-text">${row.date || '--'}</span>
            </td>
            <td class="col-video" style="text-align: center;">${videoBtnHTML}</td>
        `;
        tbody.appendChild(tr);
    });
}

// =======================================================
// RENDERIZADO DEL PODIO TOP 3 (Inspirado en lokal.gg Ref. 1)
// =======================================================
function renderTop3PodiumCards(containerId, top3Array, metricKey = 'records', metricLabel = 'RÃ©cords Mundiales') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!top3Array || top3Array.length === 0) {
        container.innerHTML = '';
        return;
    }

const trophies = ['#1', '#2', '#3'];
    const rankClasses = ['rank-1', 'rank-2', 'rank-3'];
    const badgeTitles = [t('podium_badge_1', 'Absolute Legend'), t('podium_badge_2', 'Elite Driver'), t('podium_badge_3', 'Contender')];

    let html = '';
    top3Array.slice(0, 3).forEach((driver, idx) => {
        const rankNum = idx + 1;
        const trophy = trophies[idx];
        const rankClass = rankClasses[idx];
        const badge = badgeTitles[idx];
        const metricVal = driver[metricKey] !== undefined ? driver[metricKey] : (driver.total || '--');

        html += `
            <div class="podium-card ${rankClass}">
                <div>
                    <div class="podium-header">
                        <div class="podium-avatar-wrapper">
<div class="podium-avatar">#${rankNum}</div>
                            ${window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(driver.driver, 'xlarge') : ''}
                            <div class="podium-driver-info">
                                <h4 class="notranslate" translate="no">${driver.driver}</h4>
                                <span class="podium-badge-label">${badge}</span>
                            </div>
                        </div>
<div class="podium-trophy">#${rankNum}</div>
                    </div>
                </div>

                <div class="podium-stats-row">
                    <span class="podium-metric-label">${metricLabel}</span>
                    <span class="podium-time-val">${metricVal}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// =======================================================
// HALL OF FAME Y TOP GLOBAL DE PODIOS
// =======================================================
async function generateHallOfFame() {
    const hofTbody = document.getElementById('tbody-hall-of-fame');
    if (!hofTbody) return;

    const sortedDrivers = await fetchWithMemoryAndStorageCache('compiled_hall_of_fame_v5', async () => {
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

    // 1. Renderizar Podio Top 3 de tarjetas (lokal.gg)
    if (sortedDrivers && sortedDrivers.length >= 3) {
        renderTop3PodiumCards('podium-hall-of-fame', sortedDrivers, 'records', t('col_records', 'World Records'));
    }

    // 2. Renderizar tabla deportiva completa
    hofTbody.innerHTML = '';
    if (!sortedDrivers || sortedDrivers.length === 0) {
        hofTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">${t('no_records_yet', 'No records registered yet.')}</td></tr>`;
        return;
    }

    sortedDrivers.forEach((item, index) => {
        let pos = index + 1;
        let posClass = pos === 1 ? "rank-1" : (pos === 2 ? "rank-2" : (pos === 3 ? "rank-3" : ""));
let badge = pos === 1 ? t('podium_badge_1', 'Absolute Legend') : (pos <= 3 ? t('podium_badge_2', 'Elite Driver') : t('podium_badge_3', 'Contender'));

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="${posClass}">#${pos}</td>
            <td>${window.NFSOperators ? window.NFSOperators.getDriverCellHTML(item.driver) : `<strong class="notranslate" translate="no" style="color: #ffffff; font-size: 12.2px;">${item.driver}</strong>`}</td>
            <td style="color: var(--nfs-orange); font-family: var(--font-mono); font-weight: 800; font-size: 13px; text-shadow: var(--nfs-subtle-glow);">${item.records} ${t('col_records', 'Records')}</td>
            <td><span class="telemetry-pill">PC / Multi</span></td>
            <td><span class="telemetry-pill" style="color: var(--nfs-orange); font-weight: bold;">${badge}</span></td>
        `;
        hofTbody.appendChild(tr);
    });
}

async function processPodiumsForRoutes(filterType = null) {
    const cacheKey = `compiled_podiums_v6_${filterType ? filterType.toLowerCase() : 'all'}`;

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

    // Si es la tabla principal de pilotos, renderizamos tambiÃ©n las tarjetas de podio superiores
    if (tbodyId === 'tbody-global-drivers' && fullData && fullData.length >= 3) {
        renderTop3PodiumCards('podium-global-drivers', fullData, 'total', 'Podios Totales');
    }

    if (!fullData || fullData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">No hay podios registrados en esta categorÃ­a aÃºn.</td></tr>`;
        removeLoadMoreButton(tbodyId);
        return;
    }

    const currentLimit = podiumDisplayLimits[tbodyId] || PODIUM_PAGE_SIZE;
    const visibleData = fullData.slice(0, currentLimit);

    tbody.innerHTML = '';
    visibleData.forEach((item, index) => {
        let pos = index + 1;
        let posClass = pos === 1 ? "rank-1" : (pos === 2 ? "rank-2" : (pos === 3 ? "rank-3" : ""));

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="${posClass}">#${pos}</td>
            <td>${window.NFSOperators ? window.NFSOperators.getDriverCellHTML(item.driver) : `<strong class="notranslate" translate="no" style="color: #ffffff; font-size: 12.2px;">${item.driver}</strong>`}</td>
            <td style="color: #ffd700; font-family: var(--font-mono); font-weight: 800; font-size: 12.2px; text-shadow: var(--gold-glow);">${item.first}</td>
            <td style="color: #e2e8f0; font-family: var(--font-mono); font-weight: 800; font-size: 12.2px; text-shadow: var(--silver-glow);">${item.second}</td>
            <td style="color: #ff9f43; font-family: var(--font-mono); font-weight: 800; font-size: 12.2px; text-shadow: var(--bronze-glow);">${item.third}</td>
            <td style="color: var(--nfs-orange); font-family: var(--font-mono); font-weight: 800; font-size: 13px; text-shadow: var(--nfs-subtle-glow);">${item.total}</td>
        `;
        tbody.appendChild(tr);
    });

    if (fullData.length > currentLimit) {
        renderLoadMoreButton(tbodyId, () => {
            podiumDisplayLimits[tbodyId] += PODIUM_PAGE_SIZE;
            renderGlobalPodiumTable(tbodyId, filterType);
        });
    } else {
        removeLoadMoreButton(tbodyId);
    }
}

function renderLoadMoreButton(tbodyId, onClickHandler) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const tableContainer = tbody.closest('.table-container') || tbody.parentElement;
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
            â¬‡ï¸ ${loadMoreText}
        </button>
    `;

    const btn = btnContainer.querySelector('.btn-load-more');
    btn.onclick = onClickHandler;
}

function removeLoadMoreButton(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    const tableContainer = tbody.closest('.table-container') || tbody.parentElement;
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
                            <th>PosiciÃ³n</th>
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
        switchView('routes');
        const routeInput = document.getElementById('route-search');
        if (routeInput) {
            routeInput.value = query;
            if (typeof filterRoutes === 'function') {
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
        switchView('routes');
        return;
    }
    const route = routesData.find(r => r.name.trim().toLowerCase() === routeName.trim().toLowerCase());
    if (!route) {
        switchView('routes');
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
                    value: `${seasonId.toUpperCase()} â€¢ Semana ${weekNum} (${challengeId})`,
                    inline: false
                });
            }

            const discordPayload = {
                embeds: [{
                    title: `ðŸ“¥ NUEVA SOLICITUD DE TIEMPO [${submissionId}]`,
                    color: 16742144, // #ff7700
                    description: `Un piloto ha enviado un nuevo rÃ©cord para revisiÃ³n tÃ©cnica en **NFSRANKSMW**. Pendiente de homologaciÃ³n.`,
                    fields: discordFields,
                    footer: { text: "NFSMWRANKS â€¢ ComisarÃ­a de HomologaciÃ³n de Tiempos" },
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
    if (bannerTitle) bannerTitle.innerHTML = `ðŸ† DESAFÃO OFICIAL VINCULADO: ${seasonName} â€¢ SEMANA ${weekNum}`;
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
 * Alternar entre vista de Fichas de DesafÃ­os y Tabla de ClasificaciÃ³n de Temporada
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

    // ActualizaciÃ³n de barras de informaciÃ³n de cabecera
    const dateRangeEl = document.getElementById('challenge-week-daterange');
    const weekInfoLabel = document.getElementById('season-week-info-label');
    const totalCountEl = document.getElementById('challenge-total-count');
    const rewardPotEl = document.getElementById('challenge-reward-pot');

    if (dateRangeEl) dateRangeEl.textContent = currentWeekData.dateRange || '01 Nov - 28 Nov 2026';
    if (weekInfoLabel) weekInfoLabel.textContent = `${season.name} â€¢ ${currentWeekData.title}`;
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
        const rewardDesc = ch.reward ? ch.reward.desc : '300 PTS Blacklist â€¢ $500.000 Bounty';

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
${ch.type} ${isCircuit && ch.lapType ? 'â€¢ ' + ch.lapType : ''}
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

                <!-- Botones de AcciÃ³n -->
                <div class="challenge-actions-row" style="padding: 12px 16px; background: rgba(0,0,0,0.25); border-top: 1px solid rgba(255,255,255,0.06); gap: 10px;">
                    <button type="button" class="btn-toggle-complete ${isDone ? 'completed' : 'incomplete'}" onclick="toggleChallengeComplete('${ch.id}')" style="flex: 1; padding: 10px; font-size: 11.5px;">
${isDone ? 'COMPLETADO' : 'MARCAR HECHO'}
                    </button>
                    
                    <button type="button" class="btn-challenge-submit" onclick="startSeasonChallengeSubmission('${season.id}', ${currentWeekData.weekNum}, '${ch.id}', '${escapeHtml(ch.track)}', '${escapeHtml(ch.category)}', '${escapeHtml(ch.car)}', '${escapeHtml(rewardDesc)}')" style="flex: 1.4; padding: 10px; font-size: 12px;">
Enviar RÃ©cord
                    </button>
                </div>
            </div>
        `;
    });

    gridContainer.innerHTML = html;
}

/**
 * Cargar y renderizar en vivo la clasificaciÃ³n de temporada desde Firebase RTDB
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
        titleEl.textContent = `ðŸ† CLASIFICACIÃ“N OFICIAL: ${seasonName.toUpperCase()} (${seasonPeriod.toUpperCase()})`;
    }

    if (tbody && (!cachedSeasonStandings[currentSeasonId] || forceRefresh)) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; color: var(--cyan-neon); padding: 40px; font-family: var(--font-racing); font-size: 13.5px;">
                    <div style="display: inline-block; animation: spin 1s linear infinite; margin-right: 8px;">ðŸ”„</div>
                    Consultando tabla de clasificaciÃ³n de ${seasonName} desde Firebase RTDB...
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
        const res = await fetch(`${baseUrl}/seasons/${currentSeasonId}/standings.json`);
        let standings = null;
        if (res.ok) {
            standings = await res.json();
        }

        let list = [];
        if (Array.isArray(standings)) {
            list = standings.filter(Boolean);
        } else if (standings && typeof standings === 'object') {
            list = Object.values(standings).filter(Boolean);
        }

        // Si aÃºn no hay registros publicados, proveer un preview elegante de pilotos aspirantes
        if (list.length === 0) {
            list = [
                { rank: "#1", driver: "Razor", s1: 100, s2: 85, s3: 90, s4: 95, totalPts: 370, totalBounty: "$7.400.000", badgeTitle: "Rey de Rockport City", rewardMedals: "Oro & Trofeo Legend" },
                { rank: "#2", driver: "Bull", s1: 80, s2: 75, s3: 82, s4: 88, totalPts: 325, totalBounty: "$6.500.000", badgeTitle: "Ã‰lite Blacklist #1", rewardMedals: "Plata de Temporada" },
                { rank: "#3", driver: "Ronnie", s1: 70, s2: 68, s3: 75, s4: 72, totalPts: 285, totalBounty: "$5.700.000", badgeTitle: "Ã‰lite Blacklist #1", rewardMedals: "Plata de Temporada" },
                { rank: "#4", driver: "Torque", s1: 50, s2: 55, s3: 60, s4: 58, totalPts: 223, totalBounty: "$4.460.000", badgeTitle: "Veterano Oficial", rewardMedals: "Plata de Temporada" },
                { rank: "#5", driver: "Ming", s1: 45, s2: 48, s3: 52, s4: 50, totalPts: 195, totalBounty: "$3.900.000", badgeTitle: "Veterano Oficial", rewardMedals: "Plata de Temporada" },
                { rank: "#6", driver: "Webster", s1: 35, s2: 40, s3: 42, s4: 45, totalPts: 162, totalBounty: "$3.240.000", badgeTitle: "Veterano Oficial", rewardMedals: "Completador Oficial" }
            ];
        }

        cachedSeasonStandings[currentSeasonId] = list;
        renderSeasonStandingsLive(list);
    } catch (e) {
        console.warn("Error cargando clasificaciÃ³n de temporada:", e);
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; color: var(--f1-red); padding: 30px; font-family: var(--font-racing);">
                        âŒ No se pudo conectar con Firebase RTDB. Verifica tu conexiÃ³n a internet o intenta nuevamente.
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
                    No hay tiempos puntuados aÃºn para esta temporada. Â¡SÃ© el primero en enviar tu rÃ©cord!
                </td>
            </tr>
        `;
        if (podiumContainer) podiumContainer.innerHTML = '';
        return;
    }

    // Render podium Top 3
    if (podiumContainer) {
        const top3 = list.slice(0, 3);
        const medals = ['ðŸ¥‡', 'ðŸ¥ˆ', 'ðŸ¥‰'];
        const rankClasses = ['rank-1', 'rank-2', 'rank-3'];

        podiumContainer.innerHTML = top3.map((p, idx) => {
            const avatarSvg = (typeof OPERATOR_ICONS !== 'undefined') ? OPERATOR_ICONS.getAvatar(p.driver, 44) : '';
            return `
                <div class="season-podium-card ${rankClasses[idx]}">
                    <span class="season-podium-medal">${medals[idx]}</span>
                    <div style="width: 44px; height: 44px; border-radius: 50%; overflow: hidden; background: rgba(0,0,0,0.4); flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                        ${avatarSvg || 'ðŸŽï¸'}
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div class="season-podium-driver notranslate" translate="no" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${escapeHtml(p.driver)}
                        </div>
                        <div class="season-podium-pts">
                            ${p.totalPts || 0} PTS BLACKLIST
                        </div>
                        <div class="season-podium-bounty">
                            ðŸ’° ${p.totalBounty || '$0'}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render table rows
    tbody.innerHTML = list.map((p, idx) => {
        const rankNum = idx + 1;
        const rankBadge = rankNum === 1 ? 'ðŸ¥‡ #1' : (rankNum === 2 ? 'ðŸ¥ˆ #2' : (rankNum === 3 ? 'ðŸ¥‰ #3' : `#${rankNum}`));
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
                        ${p.badgeTitle || 'Aspirante Blacklist'}
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
        const local = localStorage.getItem('nfs_championship_weeks_data_v2');
        if (local && typeof CHAMPIONSHIP_WEEKS_DATA !== 'undefined') {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed)) {
                parsed.forEach((w, idx) => {
                    if (w && idx > 0) {
                        CHAMPIONSHIP_WEEKS_DATA[idx] = w;
                        CHAMPIONSHIP_WEEKS_DATA[String(idx)] = w;
                    }
                });
            } else if (typeof parsed === 'object') {
                Object.keys(parsed).forEach(k => {
                    if (parsed[k]) {
                        CHAMPIONSHIP_WEEKS_DATA[k] = parsed[k];
                        const n = parseInt(k, 10);
                        if (!isNaN(n)) CHAMPIONSHIP_WEEKS_DATA[n] = parsed[k];
                    }
                });
            }
            if (typeof renderChampionshipGroups === 'function') {
                renderChampionshipGroups(currentChampionshipWeek);
            }
            if (typeof renderChampionshipChallenges === 'function') {
                renderChampionshipChallenges(currentChampionshipWeek);
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
            localStorage.setItem('nfs_championship_weeks_data_v2', JSON.stringify(data));
            if (Array.isArray(data)) {
                data.forEach((w, idx) => {
                    if (w && idx > 0) {
                        CHAMPIONSHIP_WEEKS_DATA[idx] = w;
                        CHAMPIONSHIP_WEEKS_DATA[String(idx)] = w;
                    }
                });
            } else {
                Object.keys(data).forEach(k => {
                    if (data[k]) {
                        CHAMPIONSHIP_WEEKS_DATA[k] = data[k];
                        const n = parseInt(k, 10);
                        if (!isNaN(n)) CHAMPIONSHIP_WEEKS_DATA[n] = data[k];
                    }
                });
            }
            if (typeof renderChampionshipGroups === 'function') {
                renderChampionshipGroups(currentChampionshipWeek);
            }
            if (typeof renderChampionshipChallenges === 'function') {
                renderChampionshipChallenges(currentChampionshipWeek);
            }
        }
    } catch (e) {
        console.info("Championship weeks data loaded from local cache");
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
// BLACKLIST EVENT // CAMPEONATO 2026 (4 SEMANAS â€¢ 5 GRUPOS â€¢ 8 DESAFÃOS)
// =======================================================

const BLACKLIST_STORAGE_KEY = 'nfs_blacklist_championship_2026_v5';
let blacklistDrivers = [];
let currentSelectedBlacklistRank = 1;
let currentChampionshipWeek = 1;

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
    const bonusPts = ((bt.first || 0) * 100) + ((bt.second || 0) * 50) + ((bt.third || 0) * 20);
    const repPts = Math.floor((driver.rep || 0) / 10000);
    return p1Pts + p2Pts + p3Pts + p4Pts + bonusPts + repPts;
}

function getDriverGroupForWeek(rank, weekNum) {
    if (typeof CHAMPIONSHIP_WEEKS_DATA === 'undefined') return 'Grupo Alpha';
    const weekData = CHAMPIONSHIP_WEEKS_DATA[weekNum] || CHAMPIONSHIP_WEEKS_DATA[1];
    if (!weekData || !weekData.groups) return 'Grupo Alpha';
    for (const grp of weekData.groups) {
        if (grp.pilots && grp.pilots.includes(rank)) {
            return grp.name;
        }
    }
    // Asignar en rotación a los grupos para pilotos de parrilla extendida
    const numGroups = weekData.groups.length || 4;
    const groupIdx = (rank - 1) % numGroups;
    if (weekData.groups[groupIdx] && weekData.groups[groupIdx].name) {
        return `${weekData.groups[groupIdx].name} [Ext]`;
    }
    return `Grupo #${groupIdx + 1} [Ext]`;
}

function switchChampionshipWeek(weekNumber, btn) {
    currentChampionshipWeek = weekNumber;

    // Actualizar botones de selector de semana
    const pills = document.querySelectorAll('.champ-pill');
    pills.forEach((p, idx) => {
        if (btn) {
            p.classList.toggle('active', p === btn);
        } else {
            p.classList.toggle('active', idx === (weekNumber - 1));
        }
    });

    const champWeekEl = document.getElementById('bl-summary-champ-week');
    if (champWeekEl) {
        const weekPrefix = (window.nfsI18n ? window.nfsI18n.t('champ_week_' + weekNumber) : `Semana ${weekNumber}`);
        champWeekEl.textContent = `${weekPrefix} / 4 (8 ${window.nfsI18n ? window.nfsI18n.t('champ_challenges_title') : 'Desafíos'})`;
    }

    renderChampionshipGroups(weekNumber);
    renderChampionshipChallenges(weekNumber);
    renderBlacklistUI();
    updateBlacklistTacticalCard();
    renderAllTacticalCards();
}

function renderChampionshipGroups(weekNumber) {
    const container = document.getElementById('champ-groups-grid');
    const datesBadge = document.getElementById('champ-week-dates-badge');
    if (!container) return;

    if (typeof CHAMPIONSHIP_WEEKS_DATA === 'undefined') return;
    const weekData = CHAMPIONSHIP_WEEKS_DATA[weekNumber] || CHAMPIONSHIP_WEEKS_DATA[1];
    if (!weekData) return;

    if (datesBadge) {
        datesBadge.textContent = weekData.dates || `Semana ${weekNumber}`;
    }

    container.innerHTML = '';

    const numGroups = (weekData.groups && weekData.groups.length) ? weekData.groups.length : 5;
    weekData.groups.forEach((grp, grpIdx) => {
        const groupCard = document.createElement('div');
        groupCard.className = 'champ-group-card';

        // Incluir pilotos base del grupo y cualquier piloto extendido (> 15) asignado por rotación
        const groupPilots = [...grp.pilots];
        blacklistDrivers.forEach(d => {
            if (d.rank > 15 && (d.rank - 1) % numGroups === grpIdx && !groupPilots.includes(d.rank)) {
                groupPilots.push(d.rank);
            }
        });

        let pilotsHtml = '';
        groupPilots.forEach(pilotRank => {
            const driver = blacklistDrivers.find(d => 
                d.rank === pilotRank || 
                d.rank === parseInt(pilotRank, 10) || 
                (d.alias && d.alias.toLowerCase() === String(pilotRank).toLowerCase()) || 
                (d.name && d.name.toLowerCase() === String(pilotRank).toLowerCase())
            ) || {
                rank: typeof pilotRank === 'number' ? pilotRank : (groupPilots.indexOf(pilotRank) + 1),
                name: `Piloto ${pilotRank}`,
                alias: `${pilotRank}`,
                ride: 'Vehículo Stock',
                rep: 0
            };

            const isSelected = driver.rank === currentSelectedBlacklistRank;
            const pts = calculateDriverPoints(driver);

            if (window.NFSOperators) {
                window.NFSOperators.linkPlayerAliases(driver.name, driver.alias);
            }

            pilotsHtml += `
                <div class="champ-group-pilot-item ${isSelected ? 'selected' : ''}" onclick="selectBlacklistPilot(${driver.rank})">
                    <div class="pilot-item-left">
                        <span class="bl-rank-badge ${driver.rank === 1 ? 'rank-gold' : driver.rank === 2 ? 'rank-silver' : driver.rank === 3 ? 'rank-bronze' : 'rank-normal'}" style="min-width: 28px; height: 28px; font-size: 10.5px;">${driver.rank}</span>
                        ${window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(driver.alias || driver.name) : ''}
                        <div>
                            <div class="pilot-item-name notranslate" translate="no">${driver.name} <span style="color: var(--nfs-orange);">"${driver.alias}"</span></div>
                            <div class="pilot-item-car">${driver.ride}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div class="pilot-item-pts">${pts.toLocaleString()} PTS</div>
                        <div style="font-family: var(--font-mono); font-size: 8.9px; color: var(--green-neon);">$${(driver.rep || 0).toLocaleString()}</div>
                    </div>
                </div>
            `;
        });

        const defaultTag = window.nfsI18n ? window.nfsI18n.t('badge_official_trio') : 'GRUPO OFICIAL';
        groupCard.innerHTML = `
            <div class="champ-group-header">
                <span class="champ-group-name">${grp.name}</span>
                <span class="champ-group-tag">${grp.tag || defaultTag}</span>
            </div>
            <div class="champ-group-pilots">
                ${pilotsHtml}
            </div>
        `;

        container.appendChild(groupCard);
    });
}

function renderChampionshipChallenges(weekNumber) {
    const container = document.getElementById('champ-challenges-grid');
    if (!container) return;

    if (typeof CHAMPIONSHIP_WEEKS_DATA === 'undefined') return;
    const weekData = CHAMPIONSHIP_WEEKS_DATA[weekNumber] || CHAMPIONSHIP_WEEKS_DATA[1];
    if (!weekData || !weekData.challenges) return;

    container.innerHTML = '';

    weekData.challenges.forEach((ch, idx) => {
        const card = document.createElement('div');
        card.className = 'champ-challenge-card';

        let top3Html = '';
        ch.top3.forEach((t, tIdx) => {
            const rowClass = tIdx === 0 ? 'podium-row-1' : tIdx === 1 ? 'podium-row-2' : 'podium-row-3';
            const bonusClass = tIdx === 0 ? 'bonus-100' : tIdx === 1 ? 'bonus-50' : 'bonus-20';
            const repBadgeText = t.repBadge || (t.repMoney ? `💰 $${t.repMoney.toLocaleString()} REP` : '');
            const defaultPending = window.nfsI18n ? window.nfsI18n.t('champ_pending_driver') : 'Por disputar';
            const pilotDisplay = (t.pilot === 'Por disputar' || !t.pilot) ? defaultPending : t.pilot;

            top3Html += `
                <div class="champ-ch-podium-row ${rowClass}">
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span class="badge-bonus ${bonusClass}">${t.badge}</span>
                        ${repBadgeText ? `<span class="badge-rep-money">${repBadgeText}</span>` : ''}
                        <div>
                            <span class="notranslate" translate="no" style="font-weight: 700; color: #ffffff;">${pilotDisplay}</span>
                            ${t.car ? `<span style="color: var(--text-muted); font-size: 8.9px; margin-left: 4px;">• ${t.car}</span>` : ''}
                        </div>
                    </div>
                    <span style="font-family: var(--font-mono); font-weight: 700; color: var(--cyan-electric); font-size: 10.5px;">${t.time || '--:--.---'}</span>
                </div>
            `;
        });

        const restrictionLabel = window.nfsI18n ? window.nfsI18n.t('champ_restriction_label') : 'AUTO RESTRICTIVO:';
        const restrictionHtml = ch.carRestriction ? `
            <div class="champ-ch-restriction">
                <span style="color: var(--nfs-orange); font-size: 13px;">🚗</span>
                <span class="restriction-label">${restrictionLabel}</span>
                <span class="restriction-car">${ch.carRestriction}</span>
            </div>
        ` : '';

        card.innerHTML = `
            <div class="champ-ch-header">
                <span class="champ-ch-title">#0${idx + 1} ${ch.route}</span>
                <span class="champ-ch-type">${ch.type.toUpperCase()}</span>
            </div>
            ${restrictionHtml}
            <div class="champ-ch-podiums">
                ${top3Html}
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
 * Sincroniza e indexa las Fichas TÃ©cnicas y la ClasificaciÃ³n General con los ganadores de los desafÃ­os
 * de las rotaciones semanales (CHAMPIONSHIP_WEEKS_DATA) o datos en vivo de competiciÃ³n.
 */
function syncBlacklistWithRotationsAndStandings() {
    if (typeof CHAMPIONSHIP_WEEKS_DATA === 'undefined') return;

    Object.keys(CHAMPIONSHIP_WEEKS_DATA).forEach(weekKey => {
        const weekData = CHAMPIONSHIP_WEEKS_DATA[weekKey];
        if (!weekData || !weekData.challenges) return;

        weekData.challenges.forEach(ch => {
            if (!ch.top3 || !Array.isArray(ch.top3)) return;
            ch.top3.forEach(t => {
                if (!t.pilot || t.pilot === 'Por disputar' || t.pilot === 'En espera') return;
                const driver = blacklistDrivers.find(d => d.rank === t.rank || (d.alias && t.pilot && d.alias.toLowerCase() === t.pilot.toLowerCase()));
                if (driver) {
                    driver.lastChallengeId = ch.id;
                }
            });
        });
    });

    renderBlacklistUI();
    renderAllTacticalCards();
    updateBlacklistTacticalCard();
    renderPilotQuickJumpPills();
    saveBlacklistData();
}

/**
 * Permite registrar o actualizar en tiempo real el resultado de un piloto en un desafÃ­o,
 * recalculando automÃ¡ticamente la ClasificaciÃ³n General y re-indexando las Fichas TÃ©cnicas.
 */
function updatePilotScoreFromChallenge(pilotIdentifier, placement, bonusPts = 0, repMoney = 0) {
    const driver = blacklistDrivers.find(d => 
        d.rank === pilotIdentifier || 
        (d.alias && typeof pilotIdentifier === 'string' && d.alias.toLowerCase() === pilotIdentifier.toLowerCase()) ||
        (d.name && typeof pilotIdentifier === 'string' && d.name.toLowerCase() === pilotIdentifier.toLowerCase())
    );

    if (!driver) {
        console.warn(`[NFSRANKSMW] Piloto no encontrado para actualizar puntaje: ${pilotIdentifier}`);
        return false;
    }

    if (!driver.victories) driver.victories = { p1: 0, p2: 0, p3: 0, p4: 0 };
    if (!driver.bestTimes) driver.bestTimes = { first: 0, second: 0, third: 0 };

    if (placement === 1) {
        driver.victories.p1 = (driver.victories.p1 || 0) + 1;
        if (bonusPts >= 100) driver.bestTimes.first = (driver.bestTimes.first || 0) + 1;
    } else if (placement === 2) {
        driver.victories.p2 = (driver.victories.p2 || 0) + 1;
        if (bonusPts >= 50) driver.bestTimes.second = (driver.bestTimes.second || 0) + 1;
    } else if (placement === 3) {
        driver.victories.p3 = (driver.victories.p3 || 0) + 1;
        if (bonusPts >= 20) driver.bestTimes.third = (driver.bestTimes.third || 0) + 1;
    } else if (placement === 4) {
        driver.victories.p4 = (driver.victories.p4 || 0) + 1;
    }

    if (repMoney > 0) {
        driver.rep = (driver.rep || 0) + repMoney;
    }

    saveBlacklistData();
    renderBlacklistUI();
    renderAllTacticalCards();
    updateBlacklistTacticalCard();
    renderPilotQuickJumpPills();

    return true;
}

function renderBlacklistUI() {
    const tbody = document.getElementById('tbody-blacklist-roster');
    if (!tbody) return;

    // Ordenar dinÃ¡micamente segÃºn la ClasificaciÃ³n General del Campeonato (Puntos y Desempates)
    const sortedDrivers = getSortedBlacklistDrivers();

    // Actualizar barra de resumen con el lÃ­der real actual
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
        totalRepEl.textContent = `$${totalRep.toLocaleString()}`;
    }
    const repStandingsEl = document.getElementById('bl-standings-rep');
    if (repStandingsEl) {
        repStandingsEl.textContent = `$${totalRep.toLocaleString()}`;
    }

    tbody.innerHTML = '';

    sortedDrivers.forEach((driver, idx) => {
        if (window.NFSOperators) {
            window.NFSOperators.linkPlayerAliases(driver.name, driver.alias);
        }
        const standingRank = idx + 1;
        const tr = document.createElement('tr');
        tr.className = `blacklist-row ${driver.rank === currentSelectedBlacklistRank ? 'active-row' : ''}`;
        tr.onclick = () => selectBlacklistPilot(driver.rank);

        let rankBadgeClass = 'rank-normal';
        if (standingRank === 1) rankBadgeClass = 'rank-gold';
        else if (standingRank === 2) rankBadgeClass = 'rank-silver';
        else if (standingRank === 3) rankBadgeClass = 'rank-bronze';

        let statusClass = 'status-active';
        if (standingRank === 1) statusClass = 'status-leader';
        else if (standingRank <= 3) statusClass = 'status-contender';

        const totalPts = calculateDriverPoints(driver);
        const groupName = getDriverGroupForWeek(driver.rank, currentChampionshipWeek);
        const bt = driver.bestTimes || { first: 0, second: 0, third: 0 };
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
                <span class="rep-money-cell">$${(driver.rep || 0).toLocaleString()}</span>
            </td>
            <td style="color: #ffd700; font-weight: 800; font-family: var(--font-mono);">${driver.victories?.p1 || 0}</td>
            <td style="color: #e2e8f0; font-weight: 800; font-family: var(--font-mono);">${driver.victories?.p2 || 0}</td>
            <td style="color: #cd7f32; font-weight: 800; font-family: var(--font-mono);">${driver.victories?.p3 || 0}</td>
            <td style="color: #38bdf8; font-weight: 800; font-family: var(--font-mono);">${driver.victories?.p4 || 0}</td>
            <td>
                <div class="bonus-summary-cell">
                    <span class="mini-bonus-pill badge-bonus-100" title="1Â° Mejor Tiempo (+100 PTS)">ðŸ¥‡ ${bt.first || 0}</span>
                    <span class="mini-bonus-pill badge-bonus-50" title="2Â° Mejor Tiempo (+50 PTS)">ðŸ¥ˆ ${bt.second || 0}</span>
                    <span class="mini-bonus-pill badge-bonus-20" title="3Â° Mejor Tiempo (+20 PTS)">ðŸ¥‰ ${bt.third || 0}</span>
                </div>
            </td>
            <td>
                <span class="pts-cell">${totalPts.toLocaleString()} PTS</span>
            </td>
            <td>
                <span class="champ-group-tag">${groupName}</span>
            </td>
            <td>
                <span class="status-badge ${statusClass}">${standingRank === 1 ? 'ðŸ‘ LÃDER #1' : driver.status || 'ACTIVO'}</span>
            </td>
        `;

        tbody.appendChild(tr);
    });

    // Actualizar la Ficha TÃ¡ctica seleccionada
    updateBlacklistTacticalCard();
}

function selectBlacklistPilot(rank) {
    currentSelectedBlacklistRank = rank;
    updateBlacklistTacticalCard();

    // Actualizar fila activa en la tabla
    const rows = document.querySelectorAll('.blacklist-row');
    rows.forEach((r, idx) => {
        if (blacklistDrivers[idx] && blacklistDrivers[idx].rank === rank) {
            r.classList.add('active-row');
        } else {
            r.classList.remove('active-row');
        }
    });

    // Actualizar selecciÃ³n en grupos de carrera
    document.querySelectorAll('.champ-group-pilot-item').forEach(el => {
        const rankSpan = el.querySelector('.bl-rank-badge');
        if (rankSpan && rankSpan.textContent.trim() === `${rank}`) {
            el.classList.add('selected');
        } else {
            el.classList.remove('selected');
        }
    });
}

function updateBlacklistTacticalCard() {
    const sorted = getSortedBlacklistDrivers();
    const driver = blacklistDrivers.find(d => d.rank === currentSelectedBlacklistRank) || sorted[0];
    if (!driver) return;

    const currentStandingRank = sorted.findIndex(d => d.rank === driver.rank) + 1;

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

    const groupName = getDriverGroupForWeek(driver.rank, currentChampionshipWeek);
    const bt = driver.bestTimes || { first: 0, second: 0, third: 0 };

    if (numEl) numEl.textContent = `Blacklist ${currentStandingRank}`;
    if (nameEl) nameEl.textContent = `${driver.name} "${driver.alias}"`;
    if (rideEl) rideEl.textContent = driver.ride;
    if (strEl) strEl.textContent = driver.strength;
    if (groupEl) groupEl.textContent = `${groupName} (Semana ${currentChampionshipWeek})`;
    if (bioEl) bioEl.textContent = driver.bio;
    if (sigEl) sigEl.textContent = driver.signature || driver.alias.toUpperCase();
    if (repEl) repEl.textContent = `$${(driver.rep || 0).toLocaleString()}`;
    if (ptsEl) ptsEl.textContent = `${calculateDriverPoints(driver).toLocaleString()} PTS`;

    if (b1El) b1El.textContent = `${bt.first || 0} ${bt.first === 1 ? 'vez' : 'veces'}`;
    if (b2El) b2El.textContent = `${bt.second || 0} ${bt.second === 1 ? 'vez' : 'veces'}`;
    if (b3El) b3El.textContent = `${bt.third || 0} ${bt.third === 1 ? 'vez' : 'veces'}`;

    if (p1El) p1El.textContent = driver.victories?.p1 || 0;
    if (p2El) p2El.textContent = driver.victories?.p2 || 0;
    if (p3El) p3El.textContent = driver.victories?.p3 || 0;
    if (p4El) p4El.textContent = driver.victories?.p4 || 0;
}

function renderAllTacticalCards() {
    const container = document.getElementById('blacklist-cards-grid');
    if (!container) return;

    // Ordenar explÃ­citamente segÃºn la ClasificaciÃ³n General del Campeonato (1 al 15+)
    const sorted = getSortedBlacklistDrivers();

    container.innerHTML = '';

    sorted.forEach((driver, idx) => {
        if (window.NFSOperators) {
            window.NFSOperators.linkPlayerAliases(driver.name, driver.alias);
        }
        const currentStandingRank = idx + 1;
        const totalPts = calculateDriverPoints(driver);
        const groupName = getDriverGroupForWeek(driver.rank, currentChampionshipWeek);
        const bt = driver.bestTimes || { first: 0, second: 0, third: 0 };
        const v = driver.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };

        const card = document.createElement('div');
        card.className = 'blacklist-tactical-card standalone-card';
        card.id = `pilot-card-${driver.rank}`;

        card.innerHTML = `
            <div class="tactical-card-overlay"></div>
            <div class="tactical-card-header">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%;">
                    <div>
                        <div class="blacklist-number-title">Blacklist ${currentStandingRank}</div>
                        <div class="blacklist-driver-fullname notranslate" translate="no">${driver.name} "${driver.alias}"</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div class="tactical-standing-badge ${currentStandingRank === 1 ? 'badge-gold' : currentStandingRank === 2 ? 'badge-silver' : currentStandingRank === 3 ? 'badge-bronze' : ''}">
                            TOP ${currentStandingRank}
                        </div>
                        ${window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(driver.alias || driver.name, 'xlarge') : ''}
                    </div>
                </div>
            </div>

            <div class="tactical-specs">
                <div class="spec-row">
                    <span class="spec-label">Ride:</span>
                    <span class="spec-value">${driver.ride}</span>
                </div>
                <div class="spec-row">
                    <span class="spec-label">Strength:</span>
                    <span class="spec-value">${driver.strength}</span>
                </div>
                <div class="spec-row">
                    <span class="spec-label" data-i18n="weekly_group">${window.nfsI18n ? window.nfsI18n.t('weekly_group') : 'Weekly Group'}:</span>
                    <span class="spec-value" style="color: var(--nfs-orange);">${groupName} (${window.nfsI18n ? window.nfsI18n.t('label_week') : 'Week'} ${currentChampionshipWeek})</span>
                </div>
            </div>

            <div class="tactical-bio-box">
                <div class="bio-bracket-top">
                    <span class="bio-title">bio:</span>
                </div>
                <p class="bio-text">${driver.bio}</p>
                <div class="bio-bracket-bottom"></div>
                <div class="tactical-signature notranslate" translate="no">${driver.signature || driver.alias.toUpperCase()}</div>
                ${driver.youtube ? `
                <div style="margin-top: 10px;">
                    <a href="${driver.youtube}" target="_blank" rel="noopener noreferrer" class="tactical-yt-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 4px;"><path d="M8 5v14l11-7z"/></svg> ${window.nfsI18n ? window.nfsI18n.t('promo_video_watch') : 'Watch Channel / YouTube Video'}
                    </a>
                </div>
                ` : ''}
            </div>

            <div class="tactical-metrics-grid">
                <div class="metric-box rep-box">
                    <span class="metric-label">DINERO DE REPUTACIÃ“N ($ REP)</span>
                    <span class="metric-value rep-val">$${(driver.rep || 0).toLocaleString()}</span>
                </div>
                <div class="metric-box pts-box">
                    <span class="metric-label">PUNTOS TOTALES (SCORE)</span>
                    <span class="metric-value">${totalPts.toLocaleString()} PTS</span>
                </div>
            </div>

            <div class="tactical-bonuses-row">
                <div class="bonus-chip chip-b1">
                    <span class="bonus-tag">ðŸ¥‡ 1Â° MEJOR (+100)</span>
                    <span class="bonus-val">${bt.first || 0} ${bt.first === 1 ? 'vez' : 'veces'}</span>
                </div>
                <div class="bonus-chip chip-b2">
                    <span class="bonus-tag">ðŸ¥ˆ 2Â° MEJOR (+50)</span>
                    <span class="bonus-val">${bt.second || 0} ${bt.second === 1 ? 'vez' : 'veces'}</span>
                </div>
                <div class="bonus-chip chip-b3">
                    <span class="bonus-tag">ðŸ¥‰ 3Â° MEJOR (+20)</span>
                    <span class="bonus-val">${bt.third || 0} ${bt.third === 1 ? 'vez' : 'veces'}</span>
                </div>
            </div>

            <div class="tactical-podiums-breakdown">
                <div class="podium-chip chip-p1">
                    <span class="chip-pos">P1 (1Â°)</span>
                    <span class="chip-val">${v.p1 || 0}</span>
                </div>
                <div class="podium-chip chip-p2">
                    <span class="chip-pos">P2 (2Â°)</span>
                    <span class="chip-val">${v.p2 || 0}</span>
                </div>
                <div class="podium-chip chip-p3">
                    <span class="chip-pos">P3 (3Â°)</span>
                    <span class="chip-val">${v.p3 || 0}</span>
                </div>
                <div class="podium-chip chip-p4">
                    <span class="chip-pos">P4 (4Â°)</span>
                    <span class="chip-val">${v.p4 || 0}</span>
                </div>
            </div>

            <div class="tactical-action-bar">
                <button class="btn-explored" style="width: 100%; justify-content: center; font-size: 13px;" onclick="switchView('championship-standings')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px;"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1c1.94-.38 3.51-1.74 3.61-3.96 2.47-.31 4.39-2.39 4.39-4.94V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg> Ver en ClasificaciÃ³n General
                </button>
            </div>
        `;

        container.appendChild(card);
    });

    renderQuickJumpPills();
    updateChampionshipRosterLabels();
}

function renderQuickJumpPills() {
    const container = document.getElementById('pilot-quick-jump-pills');
    const titleEl = document.getElementById('quick-jump-title');
    if (!container) return;

    const totalPilots = Math.max(15, blacklistDrivers.length);
    if (titleEl) {
        const titleText = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.t) ? window.nfsI18n.t('quick_jump_title') : 'âš¡ QUICK JUMP TO DRIVER';
        titleEl.textContent = `${titleText} (1 - ${totalPilots}):`;
    }

    container.innerHTML = '';
    const sorted = getSortedBlacklistDrivers();
    sorted.forEach((d, idx) => {
        const standingRank = idx + 1;
        const btn = document.createElement('button');
        btn.className = 'jump-pill notranslate';
        btn.setAttribute('translate', 'no');
        btn.onclick = () => scrollToPilotCard(d.rank);

        if (standingRank === 1) icon = 'ðŸ‘ ';
        btn.textContent = `${icon}#${standingRank} ${d.alias || d.name}`;
        container.appendChild(btn);
    });
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
            slot.strength = `${p.ride} â€¢ ${p.schedule || 'CompeticiÃ³n en Vivo'}`;
            slot.bio = `Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: ${p.schedule || 'Horario Flexible'}.${p.contact ? ` Contacto: ${p.contact}.` : ''} Compite en Rockport City bajo verificaciÃ³n de juego limpio.`;
            slot.signature = (p.alias || p.name).toUpperCase();
            slot.status = idx === 0 ? "ðŸ‘ LÃDER BLACKLIST #1 (OFICIAL)" : `PILOTO OFICIAL #${idx + 1}`;
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
                strength: `${p.ride} â€¢ ${p.schedule || 'Parrilla Extendida'}`,
                rep: 0,
                victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
                bestTimes: { first: 0, second: 0, third: 0 },
                bio: `Piloto Oficial Inscrito en el Campeonato 2026 (Parrilla Extendida). Disponibilidad: ${p.schedule || 'Horario Flexible'}.${p.contact ? ` Contacto: ${p.contact}.` : ''} Compite en Rockport City bajo verificaciÃ³n de juego limpio.`,
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

    saveBlacklistData();

    // Actualizar todas las vistas dependientes del torneo
    renderBlacklistUI();
    renderChampionshipGroups(currentChampionshipWeek);
    renderAllTacticalCards();
    updateBlacklistTacticalCard();
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
    switchChampionshipWeek(1);
    renderAllTacticalCards();
}

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

    heroEl.innerHTML = `
        <div class="past-hero-content">
            <div class="past-hero-badges">
                <span class="past-badge-edition">${t.edition}</span>
                <span class="past-badge-date">ðŸ“… ${t.date}</span>
                <span class="past-badge-category">âš™ï¸ ${t.category}</span>
                <span class="past-badge-format">âš”ï¸ ${t.format}</span>
            </div>
            <h2 class="past-hero-title">${t.title}</h2>
            <p class="past-hero-desc">
                Organizado y disputado bajo las normas oficiales de <strong>${t.platform}</strong>. 
                ${t.hosts ? `CoordinaciÃ³n y arbitraje: <span style="color: var(--nfs-orange);">${t.hosts}</span>.` : ''}
            </p>
        </div>
        <div class="past-hero-actions">
            <a href="${t.challongeUrl}" target="_blank" rel="noopener noreferrer" class="btn-challonge-link-hero">
                <span>ðŸ”—</span> Ver Bracket Oficial en Challonge
            </a>
        </div>
    `;
}

function renderPastTournamentStats(t) {
    const statsEl = document.getElementById('past-tournament-stats-bar');
    if (!statsEl) return;

    statsEl.innerHTML = `
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">ðŸ‘‘</span>
            <div class="challenge-summary-content">
                <span class="challenge-summary-label">CAMPEÃ“N HISTÃ“RICO</span>
                <span class="challenge-summary-val" style="color: #ffd700; font-weight: 800;">${t.stats.champion} ðŸ¥‡</span>
            </div>
        </div>
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">ðŸ¥ˆ</span>
            <div class="challenge-summary-content">
                <span class="challenge-summary-label">SUBCAMPEÃ“N</span>
                <span class="challenge-summary-val" style="color: #e2e8f0;">${t.stats.runnerUp}</span>
            </div>
        </div>
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">ðŸŽï¸</span>
            <div class="challenge-summary-content">
                <span class="challenge-summary-label">PILOTOS EN EL CUADRO</span>
                <span class="challenge-summary-val" style="color: #38bdf8; font-family: var(--font-mono);">${t.stats.totalPilots} Corredores</span>
            </div>
        </div>
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">âš”ï¸</span>
            <div class="challenge-summary-content">
                <span class="challenge-summary-label">PARTIDAS DISPUTADAS</span>
                <span class="challenge-summary-val" style="color: var(--green-neon); font-family: var(--font-mono);">${t.stats.totalMatches} Enfrentamientos</span>
            </div>
        </div>
    `;
}

function renderPastTournamentBrackets(t) {
    const container = document.getElementById('past-brackets-container');
    if (!container) return;

    let html = '';

    t.bracketSections.forEach(sec => {
        html += `
            <div class="bracket-section-block bracket-section-${sec.sectionId}">
                <div class="bracket-section-header">
                    <h3>${sec.sectionTitle}</h3>
                    <span class="bracket-rounds-count">${sec.rounds.length} ${sec.rounds.length === 1 ? 'Ronda' : 'Rondas'}</span>
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

                html += `
                    <div class="bracket-match-card ${isGrandFinal ? 'match-grand-final' : ''}">
                        <div class="match-meta">
                            <span class="match-id-badge">MATCH #${m.id}</span>
                            ${isGrandFinal ? '<span class="grand-final-badge">ðŸ‘‘ GRAN FINAL</span>' : ''}
                        </div>
                        <div class="match-competitors">
                            <!-- Jugador 1 -->
                            <div class="match-player-row ${p1Winner ? 'is-winner' : 'is-loser'}">
                                <span class="player-seed">#${m.p1.seed}</span>
                                <span class="player-name">${m.p1.name}</span>
                                ${p1Winner ? '<span class="winner-crown-icon">ðŸ‘‘</span>' : ''}
                                <span class="player-score ${p1Winner ? 'score-winner' : ''}">${m.p1.score}</span>
                            </div>
                            <div class="match-row-divider"></div>
                            <!-- Jugador 2 -->
                            <div class="match-player-row ${p2Winner ? 'is-winner' : 'is-loser'}">
                                <span class="player-seed">#${m.p2.seed}</span>
                                <span class="player-name">${m.p2.name}</span>
                                ${p2Winner ? '<span class="winner-crown-icon">ðŸ‘‘</span>' : ''}
                                <span class="player-score ${p2Winner ? 'score-winner' : ''}">${m.p2.score}</span>
                            </div>
                        </div>
                        <div class="match-status-footer">
                            <span class="match-verdict">
                                Vencedor: <strong style="color: ${p1Winner || p2Winner ? 'var(--green-neon)' : 'var(--text-muted)'};">${p1Winner ? m.p1.name : (p2Winner ? m.p2.name : 'Por disputar')}</strong>
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

    let html = `
        <div class="past-podium-grid">
    `;

    t.podium.forEach(item => {
        const medalClass = item.place === 1 ? 'podium-gold' : (item.place === 2 ? 'podium-silver' : (item.place === 3 ? 'podium-bronze' : 'podium-honor'));
        html += `
            <div class="past-podium-card ${medalClass}">
                <div class="podium-card-glow"></div>
                <div class="podium-place-badge">
                    <span class="podium-medal">${item.medal}</span>
                    <span class="podium-rank-text">${item.rankName}</span>
                </div>
                <div class="podium-driver-info">
                    <span class="podium-seed">CABEZA DE SERIE #${item.seed}</span>
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

    let html = '';
    t.participants.forEach(p => {
        const isPodium = p.finalPos.includes('CampeÃ³n') || p.finalPos.includes('Lugar');
        const posClass = p.finalPos.includes('CampeÃ³n') ? 'pos-champion' : (p.finalPos.includes('2do') ? 'pos-silver' : (p.finalPos.includes('3er') ? 'pos-bronze' : ''));

        html += `
            <tr class="${isPodium ? 'row-podium' : ''}">
                <td style="font-family: var(--font-mono); font-weight: 700; color: var(--nfs-orange);">#${p.seed}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <strong style="color: #ffffff; font-size: 15px;">${p.name}</strong>
                        ${p.finalPos.includes('CampeÃ³n') ? '<span class="crown-badge">ðŸ‘‘ 1Â°</span>' : ''}
                    </div>
                </td>
                <td>
                    <span class="past-final-pos ${posClass}">${p.finalPos}</span>
                </td>
                <td style="color: var(--text-muted); font-size: 13px;">
                    ${p.finalPos.includes('CampeÃ³n') ? 'ðŸ† Gran Finalista Vencedor' : (p.finalPos.includes('2do') ? 'âš”ï¸ Gran Finalista' : 'CompletÃ³ cuadro de llaves')}
                </td>
                <td>
                    <span class="badge-verified-challonge">âœ“ Verificado Challonge</span>
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
    { rank: 1, driver: "Lea4Speed0", time: "1:20.750", car: "Carrera GT", route: "City Perimeter", routeType: "Circuito" },
    { rank: 2, driver: "SRTxAvenger", time: "1:20.767", car: "Carrera GT", route: "City Perimeter", routeType: "Circuito" },
    { rank: 3, driver: "Skymaster", time: "1:14.65", car: "Carrera GT", route: "Seaside & Power Station", routeType: "Sprint" },
    { rank: 4, driver: "5TATIC", time: "0m 14s 230ms", car: "Carrera GT", route: "Seaside & Camden", routeType: "Drag" },
    { rank: 5, driver: "ZimanX", time: "1:20.87", car: "Carrera GT", route: "City Perimeter", routeType: "Circuito" }
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
                                    <div class="live-lb-track">ðŸ“ ${route.name} (${route.type})</div>
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
        console.warn("TelemetrÃ­a oficial cargada desde registros oficiales de la tabla.", e);
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
    switchView('routes');
    const searchInput = document.getElementById('route-search');
    if (searchInput) {
        searchInput.value = routeName;
        filterRoutes();
    }
}

function setCategoryAndGo(category) {
    switchView('routes');
    setTimeout(() => {
        const btn = document.querySelector(`.filter-bar button[onclick*="${category}"]`);
        setCategory(category, btn);
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

        let rankBadgeClass = 'rank-normal';
        if (m.roleCategory === 'admin') rankBadgeClass = 'rank-gold';
        else if (m.roleCategory === 'rank-sp') rankBadgeClass = 'rank-gold';
        else if (m.roleCategory === 'rank-s') rankBadgeClass = 'rank-silver';
        else if (m.roleCategory === 'rank-a') rankBadgeClass = 'rank-bronze';
        else if (m.roleCategory === 'rank-c') rankBadgeClass = 'rank-normal';

        const initialLetter = m.name ? m.name.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() || 'M' : 'M';
        const extraRolesHTML = m.extraRoles ? `<span class="extra-roles-tag">${m.extraRoles}</span>` : '';
        const joinMethodHTML = (m.joinMethod && m.joinMethod !== 'Desconocido')
            ? `<span class="join-method-tag">ðŸ”— ${m.joinMethod}</span>`
            : `<span style="color: var(--text-dimmed); font-size: 12px; font-style: italic;">Desconocido</span>`;

        tr.innerHTML = `
            <td>
                <span class="bl-rank-badge ${rankBadgeClass}">${idx + 1}</span>
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
    // Re-renderizar mÃ³dulos dinÃ¡micos cuando cambie el idioma
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
                if (Array.isArray(data)) {
                    data.forEach((w, idx) => {
                        if (w && idx > 0) {
                            CHAMPIONSHIP_WEEKS_DATA[idx] = w;
                            CHAMPIONSHIP_WEEKS_DATA[String(idx)] = w;
                        }
                    });
                } else if (typeof data === 'object') {
                    Object.keys(data).forEach(k => {
                        if (data[k]) {
                            CHAMPIONSHIP_WEEKS_DATA[k] = data[k];
                            const n = parseInt(k, 10);
                            if (!isNaN(n)) CHAMPIONSHIP_WEEKS_DATA[n] = data[k];
                        }
                    });
                }
                const activeW = (typeof currentChampionshipWeek !== 'undefined') ? currentChampionshipWeek : 1;
                if (typeof renderChampionshipGroups === 'function') {
                    renderChampionshipGroups(activeW);
                }
                if (typeof renderChampionshipChallenges === 'function') {
                    renderChampionshipChallenges(activeW);
                }
                if (typeof renderBlacklistUI === 'function') {
                    renderBlacklistUI();
                }
            }
        };
    }

    window.addEventListener('storage', (e) => {
        if (e.key === 'nfs_championship_weeks_data_v1' && e.newValue) {
            try {
                const data = JSON.parse(e.newValue);
                if (data && typeof CHAMPIONSHIP_WEEKS_DATA !== 'undefined') {
                    if (Array.isArray(data)) {
                        data.forEach((w, idx) => {
                            if (w && idx > 0) {
                                CHAMPIONSHIP_WEEKS_DATA[idx] = w;
                                CHAMPIONSHIP_WEEKS_DATA[String(idx)] = w;
                            }
                        });
                    } else if (typeof data === 'object') {
                        Object.keys(data).forEach(k => {
                            if (data[k]) {
                                CHAMPIONSHIP_WEEKS_DATA[k] = data[k];
                                const n = parseInt(k, 10);
                                if (!isNaN(n)) CHAMPIONSHIP_WEEKS_DATA[n] = data[k];
                            }
                        });
                    }
                    const activeW = (typeof currentChampionshipWeek !== 'undefined') ? currentChampionshipWeek : 1;
                    if (typeof renderChampionshipGroups === 'function') {
                        renderChampionshipGroups(activeW);
                    }
                    if (typeof renderChampionshipChallenges === 'function') {
                        renderChampionshipChallenges(activeW);
                    }
                    if (typeof renderBlacklistUI === 'function') {
                        renderBlacklistUI();
                    }
                }
            } catch (err) {}
        }
    });
} catch (e) {
    console.warn("Aviso inicializando sincronización en vivo del campeonato:", e);
}
