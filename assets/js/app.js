/**
 * NFS: Most Wanted (2005) - World Records (NFSRANKSMW)
 * Lógica principal: Navegación, Telemetría F1, Caché Inteligente,
 * Lazy Loading, Renderizado de Podios Top 3 (estilo lokal.gg) y Tablas Deportivas.
 */

// =======================================================
// ESTADO GLOBAL Y CONFIGURACIONES
// =======================================================
let currentCategory = 'all';

// Configuración de Caché (10 minutos de tiempo de vida / TTL)
const CACHE_TTL_MS = 10 * 60 * 1000;
const memoryCache = {};

// Paginación para tablas de podios
const PODIUM_PAGE_SIZE = 10;
const podiumDisplayLimits = {
    'tbody-global-drivers': PODIUM_PAGE_SIZE,
    'tbody-global-allroutes': PODIUM_PAGE_SIZE,
    'tbody-global-circuit': PODIUM_PAGE_SIZE,
    'tbody-global-sprint': PODIUM_PAGE_SIZE,
    'tbody-global-drag': PODIUM_PAGE_SIZE
};

// URL del Webhook de Discord para moderación
const DISCORD_WEBHOOK_URL = "URL_DE_TU_WEBHOOK_DE_DISCORD_AQUI";

// Conector Web App de Google Apps Script (Hojas de Cálculo & Firebase)
const GOOGLE_APPS_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzi0i3UMk4nywlcJlCX_leHJBjEJZ0a-gkAA_rTl2Q6B0iL7EglOLLVyPyoiZMagBQQ/exec";

// URL Base de Firebase Realtime Database para Leaderboards
var FIREBASE_RTDB_BASE_URL = (window.FIREBASE_RTDB_BASE_URL || (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) || "https://nfsranks-blacklist-default-rtdb.firebaseio.com");

// =======================================================
// TELEMETRÍA EN VIVO (ESTILO FÓRMULA 1)
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
// NAVEGACIÓN Y PESTAÑAS (UI)
// =======================================================
function toggleMenu() {
    const mainNav = document.getElementById('main-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    if (mainNav) {
        const isOpen = mainNav.classList.toggle('open');
        if (menuToggle) {
            menuToggle.textContent = isOpen ? '✕' : '☰';
            menuToggle.classList.toggle('active', isOpen);
        }
        if (!isOpen) {
            closeAllDropdowns();
        }
    }
}

// =======================================================
// VENTANA FLOTANTE Y BOTÓN DESPLEGABLE DE DISCORD
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
        if (seg === 'desafio' || seg === 'desafío' || seg === 'challenges' || seg === 'desafios' || seg === 'desafíos') return 'challenges';
        if (seg === 'routes' || seg === 'rutas') return 'routes';
        if (seg === 'blacklist') return 'blacklist';
        if (seg === 'championship-standings' || seg === 'standings') return 'championship-standings';
        if (seg === 'blacklist-cards' || seg === 'cards') return 'blacklist-cards';
        if (seg === 'championship-register' || seg === 'register') return 'championship-register';
        if (seg === 'past-tournaments' || seg === 'tournaments') return 'past-tournaments';
        if (seg === 'halloffame') return 'halloffame';
        if (seg === 'globaldrivers') return 'globaldrivers';
        if (seg === 'globalroutes') return 'globalroutes';
        if (seg === 'guides' || seg === 'guias' || seg === 'guías') return 'guides';
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

    // Si salimos de leaderboard hacia otra sección, limpiamos los query params de ruta si existían
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

        // Si el enlace pertenece a un menú desplegable, también iluminamos el botón padre
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
        menuToggle.textContent = '☰';
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
}

// Escuchar navegación del historial del navegador (atrás / adelante)
window.addEventListener('popstate', (e) => {
    const view = (e.state && e.state.viewId) ? e.state.viewId : resolveViewFromUrl();
    if (view) {
        switchView(view, false);
    }
});

// Exportación explícita a window para compatibilidad global con eventos inline
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

// Cerrar menús desplegables al hacer clic fuera
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
    if (pillVal) pillVal.textContent = car === 'all' ? 'Todos' : car;

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

    // Sincronizar píldoras
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
// INTERACTIVIDAD ROCKPORT MAP LIVE & SIMULACIÓN EN VIVO
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
        status: 'Persecución Extrema // City Perimeter',
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
        status: '🚨 CÓDIGO 3: Patrulla Autopista 99',
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
                    <span class="blip-car-icon">${pilot.isPolice ? '🚔' : '🏎️'}</span>
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
                            <span class="metric-val" style="color: #ff3b30;">🔥 x${pilot.heat}</span>
                        </div>
                    </div>
                    <button type="button" class="btn-tooltip-center" onclick="event.stopPropagation(); focusMapOnPlayer('${pilot.id}');">
                        🎯 <span data-i18n="map_focus_pilot">Centrar en este piloto</span>
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
                    ${pilot.isPolice ? '🚔' : '🏎️'}
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
        if (btnText) btnText.textContent = (typeof t === 'function' ? t('map_btn_pause_sim') : 'Pausar Simulación');
        if (btnIcon) btnIcon.textContent = '⏸️';
    } else {
        if (btnText) btnText.setAttribute('data-i18n', 'map_btn_resume_sim');
        if (btnText) btnText.textContent = (typeof t === 'function' ? t('map_btn_resume_sim') : 'Reanudar Simulación');
        if (btnIcon) btnIcon.textContent = '▶️';
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
// CACHÉ INTELIGENTE Y PETICIONES A GOOGLE SHEETS
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

    // 3. Petición de Red con parseo CSV
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
        console.warn("Error leyendo de caché:", e);
    }

    const computedData = await computationFn();
    const cachePayload = { timestamp: now, data: computedData };

    memoryCache[cacheKey] = cachePayload;
    try {
        localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
    } catch (e) {
        console.warn("Error guardando en caché:", e);
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
        container.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 30px; font-family: var(--font-racing); font-size: 14.6px;">No se encontraron circuitos ni rutas con ese nombre.</p>`;
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
            iconHtml = `<span style="font-size: 17.8px; color: var(--nfs-orange);">⚡</span>`;
        } else if (route.type === "Drag") {
            iconHtml = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style="color: #f87171;">
                <path d="M9 2h6v2H9V2zm1 3h4v2h-4V5zm-2 3h8v2H8V8zm1 3h6v2H9v-2zm-2 3h10v2H7v-2zm2 3h6v2H9v-2zm-3 3h12v2H6v-2z"/>
            </svg>`;
        } else {
            iconHtml = `<span style="font-size: 17.8px; color: var(--nfs-orange);">🔄</span>`;
        }

        const card = document.createElement('div');
        card.className = `route-card type-${typeClass}`;
        card._routeData = route;

        card.onclick = () => {
            const titleEl = document.getElementById('leaderboard-title');
            if (titleEl) titleEl.innerText = `Leaderboard: ${route.name} (${route.type})`;
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
                <div class="route-preview-placeholder" style="font-size: 9.7px; color: #64748b;">Cargando récord...</div>
            </div>
            <div class="route-action-icon" title="Ver Telemetría">🏁</div>
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
                    <span class="route-time-display">⏱️ ${topRow.time}</span>
                    <span class="driver-name">👤 ${topRow.driver}</span>
                </div>
                <div style="overflow: hidden; width: 100%; margin-top: 3px;">
                    <div style="white-space: nowrap; font-size: 8.9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; overflow: hidden; text-overflow: ellipsis;">
                        🏎️ ${topRow.car || 'BMW M3 GTR'}
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
    const url = `${FIREBASE_RTDB_BASE_URL}/leaderboards/${routeKey}.json`;

    try {
        const response = await fetch(url);
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
    if (!Array.isArray(raw)) return [];

    let list = raw.filter(item => item && item.driver && String(item.driver).trim() !== "" && (item.time || item.declaredTime)).map(item => {
        const timeStr = item.time || item.declaredTime || "--:--.---";
        const parseFn = (typeof NFS_FIREBASE !== 'undefined' && NFS_FIREBASE.parseTimeToMs) ? NFS_FIREBASE.parseTimeToMs : parseTimeToMs;
        const timeMs = item.timeMs !== undefined ? parseInt(item.timeMs, 10) : parseFn(timeStr);
        return {
            driver: String(item.driver).trim(),
            time: timeStr,
            timeMs: isNaN(timeMs) ? null : timeMs,
            car: item.car || "BMW M3 GTR",
            device: item.device || item.platform || "PC",
            gearbox: item.gearbox || "Manual",
            date: item.date || new Date().toISOString().split('T')[0],
            yt: item.yt || item.videoUrl || item.video || "#",
            submissionId: item.submissionId || ""
        };
    });

    // Orden ascendente estricto por milisegundos (más rápido al frente)
    list.sort((a, b) => {
        if (a.timeMs !== null && b.timeMs !== null && a.timeMs !== b.timeMs) {
            return a.timeMs - b.timeMs;
        }
        if (a.timeMs !== null && b.timeMs === null) return -1;
        if (a.timeMs === null && b.timeMs !== null) return 1;
        return (a.driver || '').localeCompare(b.driver || '');
    });

    // Asignación de rangos dinámicos calculados #1, #2, #3...
    return list.map((item, idx) => ({
        ...item,
        rank: `#${idx + 1}`
    }));
}

// =======================================================
// CARGA Y RENDERIZADO DE TABLAS INDIVIDUALES (LEADERBOARDS)
// CONEXIÓN DIRECTA A FIREBASE REALTIME DATABASE (DESACOPLADO DE SHEETS)
// =======================================================
async function loadLeaderboardForRoute(route) {
    currentActiveRoute = route;
    currentModality = 'junkman';
    currentLap = 'single';
    currentCarFilter = 'all';

    // Sincronizar UI de filtros compactos Tracker.gg
    const pillMod = document.getElementById('pill-val-modality');
    if (pillMod) pillMod.textContent = 'Junkman';
    const pillLap = document.getElementById('pill-val-lap');
    if (pillLap) pillLap.textContent = 'Single Lap';
    const pillCar = document.getElementById('pill-val-car');
    if (pillCar) pillCar.textContent = 'Todos';

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
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 25px; font-family: var(--font-racing); font-size: 13px;">Sin registros oficiales para esta categoría aún.</td></tr>`;
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
            ? `<a href="${row.yt}" target="_blank" rel="noopener noreferrer" class="btn-yt-link" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; font-size: 8.9px; background: rgba(255, 0, 0, 0.15); border: 1px solid rgba(255, 0, 0, 0.4); color: #ff5555; text-decoration: none; border-radius: 4px; font-family: var(--font-racing); font-weight: 700; transition: all 0.2s ease;">▶ Video</a>`
            : `<span style="color: var(--text-dimmed); font-size: 9.7px; font-style: italic;">Sin video</span>`;

        let aliasTag = '';
        if (displayRank === 1) aliasTag = '<span class="driver-cell-alias">👑 RECORD MUNDIAL</span>';
        else if (displayRank === 2) aliasTag = '<span class="driver-cell-alias" style="color: #cbd5e1;">🥈 TOP 2 MUNDIAL</span>';
        else if (displayRank === 3) aliasTag = '<span class="driver-cell-alias" style="color: #cd7f32;">🥉 TOP 3 MUNDIAL</span>';
        else aliasTag = '<span class="driver-cell-alias" style="color: var(--text-muted); font-size: 8.1px;">PILOTO OFICIAL</span>';

        const blBadgeClass = displayRank === 1 ? 'bl-badge-gold' : displayRank === 2 ? 'bl-badge-silver' : displayRank === 3 ? 'bl-badge-bronze' : '';

        // Badge hexagonal para Top 3 o número limpio para #4+
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

        tr.innerHTML = `
            <td class="col-place">
                ${rankBadgeHTML}
            </td>
            <td class="col-player">
                <div class="driver-name-cell-wrapper">
                    ${window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(row.driver) : ''}
                    <div class="driver-cell-flex">
                        <div class="driver-names-row">
                            <span class="driver-cell-name">${row.driver}</span>
                            ${aliasTag}
                        </div>
                        <div class="driver-car-sub">
                            <span class="car-name-text">${row.car || 'BMW M3 GTR'}</span>
                            <span class="bl-chip ${blBadgeClass}">BL #${displayRank}</span>
                        </div>
                    </div>
                </div>
            </td>
            <td class="col-time">
                <span class="time-stat-val">${formattedTime}</span>
            </td>
            <td class="col-desktop">
                <span style="color: #ffffff; font-weight: 700; font-size: 10.5px; letter-spacing: 0.3px;">${row.car || '--'}</span>
            </td>
            <td class="col-desktop">
                <span class="champ-group-tag" style="color: #38bdf8; background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.3); font-family: var(--font-racing); font-weight: 700; letter-spacing: 0.5px;">🎮 ${row.device || 'PC'}</span>
            </td>
            <td class="col-desktop">
                <span class="champ-group-tag" style="color: #ffd700; background: rgba(255, 215, 0, 0.1); border-color: rgba(255, 215, 0, 0.3); font-family: var(--font-racing); font-weight: 700; letter-spacing: 0.5px;">⚙️ ${row.gearbox || 'Manual'}</span>
            </td>
            <td class="col-desktop" style="color: var(--text-muted); font-family: var(--font-mono); font-size: 9.7px;">${row.date || '--'}</td>
            <td class="col-desktop">${videoBtnHTML}</td>
        `;
        tbody.appendChild(tr);
    });
}

// =======================================================
// RENDERIZADO DEL PODIO TOP 3 (Inspirado en lokal.gg Ref. 1)
// =======================================================
function renderTop3PodiumCards(containerId, top3Array, metricKey = 'records', metricLabel = 'Récords Mundiales') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!top3Array || top3Array.length === 0) {
        container.innerHTML = '';
        return;
    }

    const trophies = ['👑', '🥈', '🥉'];
    const rankClasses = ['rank-1', 'rank-2', 'rank-3'];
    const badgeTitles = ['Leyenda Absoluta', 'Elite Driver', 'Contendiente'];

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
                            <div class="podium-avatar">${rankNum === 1 ? '🥇' : (rankNum === 2 ? '🥈' : '🥉')}</div>
                            ${window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(driver.driver, 'xlarge') : ''}
                            <div class="podium-driver-info">
                                <h4>${driver.driver}</h4>
                                <span class="podium-badge-label">${badge}</span>
                            </div>
                        </div>
                        <div class="podium-trophy">${trophy}</div>
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
        renderTop3PodiumCards('podium-hall-of-fame', sortedDrivers, 'records', 'Récords Mundiales');
    }

    // 2. Renderizar tabla deportiva completa
    hofTbody.innerHTML = '';
    if (!sortedDrivers || sortedDrivers.length === 0) {
        hofTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No hay récords registrados todavía.</td></tr>`;
        return;
    }

    sortedDrivers.forEach((item, index) => {
        let pos = index + 1;
        let posClass = pos === 1 ? "rank-1" : (pos === 2 ? "rank-2" : (pos === 3 ? "rank-3" : ""));
        let badge = pos === 1 ? "👑 Leyenda Absoluta" : (pos <= 3 ? "🔥 Elite Driver" : "⭐ Contendiente");

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="${posClass}">#${pos}</td>
            <td>${window.NFSOperators ? window.NFSOperators.getDriverCellHTML(item.driver) : `<strong style="color: #ffffff; font-size: 12.2px;">${item.driver}</strong>`}</td>
            <td style="color: var(--nfs-orange); font-family: var(--font-mono); font-weight: 800; font-size: 13px; text-shadow: var(--nfs-subtle-glow);">${item.records} Récords</td>
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

    // Si es la tabla principal de pilotos, renderizamos también las tarjetas de podio superiores
    if (tbodyId === 'tbody-global-drivers' && fullData && fullData.length >= 3) {
        renderTop3PodiumCards('podium-global-drivers', fullData, 'total', 'Podios Totales');
    }

    if (!fullData || fullData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">No hay podios registrados en esta categoría aún.</td></tr>`;
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
            <td>${window.NFSOperators ? window.NFSOperators.getDriverCellHTML(item.driver) : `<strong style="color: #ffffff; font-size: 12.2px;">${item.driver}</strong>`}</td>
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

    btnContainer.innerHTML = `
        <button class="btn-load-more">
            ⬇️ Cargar más pilotos
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
                                yt: userRow.yt || "#"
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
            <h3 style="margin-top: 0; color: #ffffff; font-family: var(--font-racing); font-size: 16.2px; text-transform: uppercase; letter-spacing: 1px;">🔍 Consultar Expediente de Piloto</h3>
            <div style="display: flex; gap: 10px; margin-top: 14px;">
                <input type="text" id="driver-search-input" placeholder="Nombre del piloto (ej: DJALIL, ZIMANX)..." class="form-control" style="flex: 1;">
                <button id="btn-search-driver" class="btn-explored" style="padding: 10px 24px; font-size: 11.3px;">Buscar</button>
            </div>
            <div id="driver-results-container" style="margin-top: 20px;"></div>
        </div>
    `;

    const btn = document.getElementById('btn-search-driver');
    const input = document.getElementById('driver-search-input');

    const executeSearch = async () => {
        const resultsEl = document.getElementById('driver-results-container');
        resultsEl.innerHTML = `<p style="color: var(--nfs-orange); font-family: var(--font-racing); font-size: 13px;">⏱️ Consultando telemetría oficial...</p>`;

        const profile = await searchDriverProfile(input.value);
        if (!profile) {
            resultsEl.innerHTML = `<p style="color: var(--text-muted); font-size: 11.3px; padding: 10px 0;">No se encontraron registros activos para ese piloto.</p>`;
            return;
        }

        let tracksHtml = profile.tracks.length > 0 ? profile.tracks.map(t => `
            <tr>
                <td><strong style="color: #ffffff;">${t.routeName}</strong> (${t.routeType})</td>
                <td style="color: var(--nfs-orange); font-family: var(--font-racing); font-size: 13px; font-weight: bold;">#${t.rank}</td>
                <td style="font-family: var(--font-mono); font-weight: 800; color: var(--nfs-orange);">⏱️ ${t.time}</td>
                <td><span class="telemetry-pill">🚗 ${t.car}</span></td>
                <td><span class="telemetry-pill">⚙️ ${t.gearbox}</span></td>
            </tr>
        `).join('') : `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 15px;">Sin detalles de rutas precargadas aún en memoria.</td></tr>`;

        resultsEl.innerHTML = `
            <div style="background: var(--bg-surface-elevated); padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid var(--nfs-orange); box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
                <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
                    ${window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(profile.driver, 'xlarge') : ''}
                    <h2 style="color: #ffffff; font-family: var(--font-racing); font-size: 24px; margin: 0; text-transform: uppercase;">${profile.driver}</h2>
                </div>
                <div style="display: flex; gap: 15px; font-weight: bold; flex-wrap: wrap; font-family: var(--font-racing); font-size: 13px;">
                    <span style="color: #ffd700; text-shadow: var(--gold-glow);">🥇 1ros: ${profile.stats.first}</span>
                    <span style="color: #e2e8f0; text-shadow: var(--silver-glow);">🥈 2dos: ${profile.stats.second}</span>
                    <span style="color: #ff9f43; text-shadow: var(--bronze-glow);">🥉 3ros: ${profile.stats.third}</span>
                    <span style="color: var(--nfs-orange); text-shadow: var(--nfs-subtle-glow);">📊 Total Podios: ${profile.stats.total}</span>
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
// BUSCADOR RÁPIDO HERO TRACKER.GG (PILOTO O RUTA)
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

    // Verificar si la búsqueda coincide con una ruta oficial
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
        // Asumir búsqueda de piloto y redirigir al expediente
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
// UTILIDADES DE TIEMPO & TELEMETRÍA DE VIDEO
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

    // 1. Patrón con texto: 1m 20s 750ms, 19s 810ms, 0m 24s 010ms
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

    // 2. Formato con dos puntos decimales: "4.56.26" o "4.59.04" (minutos.segundos.centésimas)
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

    // 3. Patrón con dos puntos: [HH:]MM:SS[.mmm] o "35:42:00"
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
 * Máscara estricta de tiempo de carrera (MM:SS.mmm) mientras el usuario escribe
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

    if (circuitTracks.length) select.appendChild(createGroup('🏁 Circuitos', circuitTracks));
    if (sprintTracks.length) select.appendChild(createGroup('⚡ Sprints', sprintTracks));
    if (dragTracks.length) select.appendChild(createGroup('🔥 Drags', dragTracks));

    if (currentValue) select.value = currentValue;
}

/**
 * Modal de confirmación de envío a homologación
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

    // Si aún faltan campos
    if (startMs === null || endMs === null) {
        if (dispDiff) dispDiff.innerText = '--:--.---';
        if (syncBtn) syncBtn.style.display = 'none';
        if (title) title.innerText = 'Esperando marcas de video y tiempo';
        if (desc) desc.innerText = 'Ingresa la marca de inicio, marca de fin y el tiempo declarado para verificar que coincidan exactamente.';
        if (icon) icon.innerText = 'ℹ️';
        return;
    }

    // Si la marca de fin es menor o igual al inicio
    if (endMs <= startMs) {
        if (dispDiff) dispDiff.innerText = 'Inválido';
        if (syncBtn) syncBtn.style.display = 'none';
        endInput.classList.add('field-error');
        if (banner) banner.className = 'validation-status-banner state-mismatch';
        if (title) title.innerText = '❌ Marca de Fin Inválida';
        if (desc) desc.innerText = 'La marca de fin del video debe ser estrictamente posterior a la marca de inicio.';
        if (icon) icon.innerText = '⚠️';
        return;
    }

    const diffMs = endMs - startMs;
    const formattedDiff = formatMsToTime(diffMs);
    if (dispDiff) dispDiff.innerText = formattedDiff;

    // Mostrar botón de sincronización rápida
    if (syncBtn && syncVal) {
        syncVal.innerText = formattedDiff;
        syncBtn.style.display = 'block';
    }

    // Si no ha ingresado tiempo declarado todavía
    if (declaredMs === null) {
        if (title) title.innerText = `Diferencia en video: ${formattedDiff}`;
        if (desc) desc.innerText = 'Ahora ingresa el tiempo declarado (o pulsa el botón para autocompletarlo con la diferencia del video).';
        if (icon) icon.innerText = '⏱️';
        return;
    }

    // Validación de concordancia con tolerancia de 50ms (para compensar diferencias de frames de video)
    const discrepancyMs = Math.abs(diffMs - declaredMs);
    const toleranceMs = 50;

    if (discrepancyMs <= toleranceMs) {
        // Coincidencia exacta o dentro de tolerancia
        if (banner) banner.className = 'validation-status-banner state-match';
        if (title) title.innerText = '✅ ¡Validación Aprobada!';
        if (desc) desc.innerText = `El tiempo declarado (${formatMsToTime(declaredMs)}) coincide exactamente con la diferencia de las marcas de video (${formattedDiff}).`;
        if (icon) icon.innerText = '🏁';
        startInput.classList.add('field-success');
        endInput.classList.add('field-success');
        declaredInput.classList.add('field-success');
    } else {
        // Discrepancia detectada
        if (banner) banner.className = 'validation-status-banner state-mismatch';
        if (title) title.innerText = '❌ Discrepancia Detectada';
        const diffSec = (discrepancyMs / 1000).toFixed(3);
        if (desc) desc.innerText = `La diferencia del video es ${formattedDiff}, pero declaraste ${formatMsToTime(declaredMs)} (desfase de ${diffSec}s). Ambos valores deben coincidir antes de poder enviar.`;
        if (icon) icon.innerText = '⚠️';
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
// ENVÍO DE TIEMPOS VÍA WEBHOOK A DISCORD & HOMOLOGACIÓN
// =======================================================
// MANEJO DE CATEGORÍA Y TIPO DE VUELTA EN FORMULARIO
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

    const titleEl = document.getElementById('leaderboard-title');
    if (titleEl) titleEl.innerText = `Leaderboard: ${route.name} (${route.type})`;

    loadLeaderboardForRoute(route);
    switchView('leaderboard');

    setTimeout(() => {
        if (categoryKey.includes('bmw')) {
            const modBtn = document.querySelector('#popover-modality button[onclick*="bmw"]');
            selectLeaderboardModality('bmw', modBtn);
        } else {
            const modBtn = document.querySelector('#popover-modality button[onclick*="junkman"]');
            selectLeaderboardModality('junkman', modBtn);
        }

        if (route.type === 'Circuito') {
            if (categoryKey.includes('fast')) {
                const lapBtn = document.querySelector('#popover-lap button[onclick*="fast"]');
                selectLeaderboardLap('fast', lapBtn);
            } else {
                const lapBtn = document.querySelector('#popover-lap button[onclick*="single"]');
                selectLeaderboardLap('single', lapBtn);
            }
        }

        const lbSection = document.getElementById('view-leaderboard');
        if (lbSection) lbSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250);
}

// =======================================================
// ENVÍO Y HOMOLOGACIÓN AUTOMÁTICA DE TIEMPOS
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
        status.innerText = "❌ Formato inválido en el Tiempo Declarado en Pantalla. Usa MM:SS.mmm (ej: 01:20.750).";
        document.getElementById('sub-time').focus();
        return false;
    }

    // Parseo y validación de marcas de video si están presentes
    const startMs = startMark ? parseTimeToMs(startMark) : null;
    const endMs = endMark ? parseTimeToMs(endMark) : null;
    let diffMs = null;

    if (startMs !== null && endMs !== null) {
        if (endMs <= startMs) {
            status.style.color = "var(--f1-red)";
            status.innerText = "❌ La Marca de Fin debe ser posterior a la Marca de Inicio.";
            if (endInputEl) endInputEl.focus();
            return false;
        }
        diffMs = endMs - startMs;
        const discrepancyMs = Math.abs(diffMs - declaredMs);
        const toleranceMs = 50; // 50ms de tolerancia por redondeo de frames de video

        if (discrepancyMs > toleranceMs) {
            status.style.color = "var(--f1-red)";
            const diffSec = (discrepancyMs / 1000).toFixed(3);
            status.innerText = `❌ VALIDACIÓN RECHAZADA: El tiempo declarado (${formatMsToTime(declaredMs)}) no coincide con la diferencia calculada de las marcas de video (${formatMsToTime(diffMs)}). Desfase detectado: ${diffSec}s.`;
            return false;
        }
    }

    // Validación de URL de Video (YouTube o Twitch)
    const isYouTube = video.includes('youtube.com') || video.includes('youtu.be');
    const isTwitch = video.includes('twitch.tv');
    if (!isYouTube && !isTwitch) {
        status.style.color = "var(--f1-red)";
        status.innerText = "❌ Por favor introduce un enlace válido de YouTube o Twitch (ej: https://www.youtube.com/watch?v=... o https://twitch.tv/videos/...).";
        document.getElementById('sub-video').focus();
        return false;
    }

    btn.disabled = true;
    btn.innerHTML = "<span>⏳</span> Enviando Registro a Homologación...";
    status.style.color = "var(--nfs-orange)";
    status.innerText = "Verificando telemetría y registrando en la cola de homologación...";

    // Determinar tipo de ruta y clave de categoría en Firebase
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
        // 1. ESCRITURA DIRECTA A FIREBASE RTDB: /submissions/<submissionId> (AUDITORÍA)
        // =========================================================================
        if (FIREBASE_RTDB_BASE_URL) {
            try {
                await fetch(`${FIREBASE_RTDB_BASE_URL}/submissions/${submissionId}.json`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(submissionPayload)
                });
                console.info("Firebase: Registro de telemetría guardado en /submissions");
            } catch (fbSubErr) {
                console.warn("Aviso guardando en /submissions de Firebase:", fbSubErr);
            }

            // Nota: Los tiempos NO se publican directamente en /leaderboards.
            // Permanecen en /submissions (pending) hasta ser homologados en admin.html.
        }

        // =========================================================================
        // 3. INVALIDAR CACHÉS LOCALES PARA ACTUALIZACIÓN INMEDIATA
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

            // Guardar en historial local de envíos del usuario
            const localSubs = JSON.parse(localStorage.getItem('nfs_local_submissions') || '[]');
            localSubs.unshift(submissionPayload);
            localStorage.setItem('nfs_local_submissions', JSON.stringify(localSubs.slice(0, 50)));
        } catch (e) {
            console.warn("Error invalidando caché de localStorage:", e);
        }

        // =========================================================================
        // 4. DESPACHO AL WEBHOOK DE DISCORD (AVISO DE TIEMPO PENDIENTE DE HOMOLOGACIÓN)
        // =========================================================================
        if (typeof DISCORD_WEBHOOK_URL !== 'undefined' &&
            DISCORD_WEBHOOK_URL &&
            DISCORD_WEBHOOK_URL !== "URL_DE_TU_WEBHOOK_DE_DISCORD_AQUI") {
            const discordFields = [
                { name: "👤 Piloto", value: driver, inline: true },
                { name: "🚗 Auto", value: car, inline: true },
                { name: "🏁 Pista", value: `${route} (${isCircuit ? lapType : 'Sprint/Drag'})`, inline: true },
                { name: "🏆 Categoría", value: category, inline: true },
                { name: "⏱️ Tiempo Declarado", value: formatMsToTime(declaredMs), inline: true },
                { name: "⚙️ Transmisión", value: gearbox, inline: true },
                { name: "🎮 Control", value: device, inline: true },
                { name: "🎬 Video", value: `[Ver Video](${video})`, inline: false }
            ];

            if (startMs !== null && endMs !== null && diffMs !== null) {
                discordFields.splice(5, 0, {
                    name: "📐 Marcas Video",
                    value: `${formatMsToTime(startMs)} → ${formatMsToTime(endMs)} (Δ: ${formatMsToTime(diffMs)})`,
                    inline: true
                });
            }

            if (seasonId) {
                discordFields.push({
                    name: "🏆 Desafío de Temporada",
                    value: `${seasonId.toUpperCase()} • Semana ${weekNum} (${challengeId})`,
                    inline: false
                });
            }

            const discordPayload = {
                embeds: [{
                    title: `📥 NUEVA SOLICITUD DE TIEMPO [${submissionId}]`,
                    color: 16742144, // #ff7700
                    description: `Un piloto ha enviado un nuevo récord para revisión técnica en **NFSRANKSMW**. Pendiente de homologación.`,
                    fields: discordFields,
                    footer: { text: "NFSMWRANKS • Comisaría de Homologación de Tiempos" },
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
        // 5. MODAL OFICIAL DE CONFIRMACIÓN Y FEEDBACK VISUAL
        // =========================================================================
        openSubmissionSuccessModal(submissionPayload);

        status.style.color = "var(--green-neon)";
        status.innerHTML = `
            <div style="background: rgba(0, 255, 136, 0.08); border: 1px solid var(--green-neon); border-radius: 8px; padding: 14px 20px; text-align: left; margin-top: 15px; box-shadow: 0 4px 15px rgba(0, 255, 136, 0.1);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <span style="font-size: 18px;">⏳</span>
                    <strong style="color: #ffffff; font-family: var(--font-racing); text-transform: uppercase;">
                        ¡TIEMPO REGISTRADO EN COLA DE HOMOLOGACIÓN!
                    </strong>
                </div>
                <p style="color: #cbd5e1; font-size: 12.5px; line-height: 1.4; margin: 0;">
                    Solicitud <strong>${submissionId}</strong> enviada a los comisarios oficiales. Tu tiempo (${formatMsToTime(declaredMs)}) se publicará en el Leaderboard tras verificar el video.
                </p>
            </div>
        `;

        document.getElementById('form-submit-time').reset();
        clearSeasonSubmissionContext();
        validateTimeMarksLive();
    } catch (error) {
        console.error("Error enviando tiempo:", error);
        status.style.color = "var(--f1-red)";
        status.innerText = "Error de conexión con el servidor. Inténtalo de nuevo más tarde.";
    } finally {
        btn.disabled = false;
        btn.innerHTML = "<span>🚀</span> Enviar Registro a Homologación";
    }
}

// Exportación explícita a window para compatibilidad con eventos inline del formulario
window.applyRaceTimeMask = applyRaceTimeMask;
window.initSubmitRouteSelector = initSubmitRouteSelector;
window.openSubmissionSuccessModal = openSubmissionSuccessModal;
window.closeSubmissionSuccessModal = closeSubmissionSuccessModal;
window.validateTimeMarksLive = validateTimeMarksLive;
window.handleTimeSubmit = handleTimeSubmit;
window.handleCategoryOrRouteChange = handleCategoryOrRouteChange;
window.handleVideoUrlChange = handleVideoUrlChange;

// =======================================================
// SISTEMA OFICIAL DE TEMPORADAS BLACKLIST & 4 DESAFÍOS SEMANALES
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
        console.warn("No se pudo guardar estado de desafío:", e);
    }
    renderChallengesUI();
}

/**
 * Iniciar envío desde la ficha de desafío de temporada
 * Preselecciona automáticamente pista, categoría, auto y vincula metadatos del evento
 */
function startSeasonChallengeSubmission(seasonId, weekNum, challengeId, trackName, category, carName, rewardDesc) {
    // Cambiar a la vista de formulario de envío
    switchView('submit');

    // Activar banner de contexto en el formulario
    const banner = document.getElementById('sub-season-banner');
    const bannerTitle = document.getElementById('sub-season-banner-title');
    const bannerDesc = document.getElementById('sub-season-banner-desc');
    const season = (typeof SEASONS_DATA !== 'undefined' && SEASONS_DATA[seasonId]) ? SEASONS_DATA[seasonId] : null;
    const seasonName = season ? season.name : 'Temporada Blacklist';

    if (banner) banner.style.display = 'flex';
    if (bannerTitle) bannerTitle.innerHTML = `🏆 DESAFÍO OFICIAL VINCULADO: ${seasonName} • SEMANA ${weekNum}`;
    if (bannerDesc) bannerDesc.innerHTML = `🏁 <strong>${escapeHtml(trackName)}</strong> (${escapeHtml(category)}) — Recompensa: <strong>${escapeHtml(rewardDesc || 'Puntos PTS & Bounty')}</strong>`;

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

    // Preseleccionar categoría
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
 * Compatibilidad con envíos directos genéricos
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
 * Navegar semanas hacia adelante o atrás (+1 / -1)
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
        gridContainer.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:30px;">Cargando calendario de temporadas...</p>';
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
        const catBadgeText = isBMW ? '👑 BMW M3 GTR REGLAMENTARIO' : '⚡ JUNKMAN (CUALQUIER AUTO)';
        const catIcon = isBMW ? '🏎️' : '🔧';
        const rewardDesc = ch.reward ? ch.reward.desc : '300 PTS Blacklist • $500.000 Bounty';

        const carImg = isBMW
            ? 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=700&q=80'
            : (idx === 0 ? 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80' : 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=700&q=80');

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
                                🏁 ${ch.type} ${isCircuit && ch.lapType ? '• ' + ch.lapType : ''}
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

                        <!-- Tiempo Objetivo y Vehículo -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                            <div class="challenge-time-box" style="margin: 0; padding: 8px 10px;">
                                ⏱️
                                <div>
                                    <div style="font-size: 8.5px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">TIEMPO OBJETIVO</div>
                                    <div class="challenge-time-val" style="color: var(--green-neon); font-size: 14px;">
                                        ${ch.targetTime}
                                    </div>
                                </div>
                            </div>
                            <div class="challenge-time-box" style="margin: 0; padding: 8px 10px; background: rgba(255,255,255,0.03);">
                                🚗
                                <div>
                                    <div style="font-size: 8.5px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">VEHÍCULO</div>
                                    <div style="font-size: 11px; font-weight: 800; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${ch.car}">
                                        ${ch.car}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Grid de Recompensas -->
                        <div class="season-reward-grid">
                            <div class="season-reward-cell">
                                <span class="rw-lbl">💰 Bolsa Bounty</span>
                                <span class="rw-val" style="color: var(--green-neon);">${ch.reward ? ch.reward.bounty : '$500.000'}</span>
                            </div>
                            <div class="season-reward-cell">
                                <span class="rw-lbl">⭐ Puntos Blacklist</span>
                                <span class="rw-val" style="color: var(--nfs-orange);">${ch.reward ? ch.reward.pts : '300'} PTS</span>
                            </div>
                        </div>
                        <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                            <span>🎖️</span> <span><strong>Trofeo:</strong> ${ch.reward ? ch.reward.badge : 'Medalla Oficial'}</span>
                        </div>
                    </div>
                </div>

                <!-- Botones de Acción -->
                <div class="challenge-actions-row" style="padding: 12px 16px; background: rgba(0,0,0,0.25); border-top: 1px solid rgba(255,255,255,0.06); gap: 10px;">
                    <button type="button" class="btn-toggle-complete ${isDone ? 'completed' : 'incomplete'}" onclick="toggleChallengeComplete('${ch.id}')" style="flex: 1; padding: 10px; font-size: 11.5px;">
                        ${isDone ? '✅ COMPLETADO' : '⭕ MARCAR HECHO'}
                    </button>
                    
                    <button type="button" class="btn-challenge-submit" onclick="startSeasonChallengeSubmission('${season.id}', ${currentWeekData.weekNum}, '${ch.id}', '${escapeHtml(ch.track)}', '${escapeHtml(ch.category)}', '${escapeHtml(ch.car)}', '${escapeHtml(rewardDesc)}')" style="flex: 1.4; padding: 10px; font-size: 12px;">
                        🚀 Enviar Récord
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

        // Si aún no hay registros publicados, proveer un preview elegante de pilotos aspirantes
        if (list.length === 0) {
            list = [
                { rank: "#1", driver: "Razor", s1: 100, s2: 85, s3: 90, s4: 95, totalPts: 370, totalBounty: "$7.400.000", badgeTitle: "Rey de Rockport City", rewardMedals: "Oro & Trofeo Legend" },
                { rank: "#2", driver: "Bull", s1: 80, s2: 75, s3: 82, s4: 88, totalPts: 325, totalBounty: "$6.500.000", badgeTitle: "Élite Blacklist #1", rewardMedals: "Plata de Temporada" },
                { rank: "#3", driver: "Ronnie", s1: 70, s2: 68, s3: 75, s4: 72, totalPts: 285, totalBounty: "$5.700.000", badgeTitle: "Élite Blacklist #1", rewardMedals: "Plata de Temporada" },
                { rank: "#4", driver: "Torque", s1: 50, s2: 55, s3: 60, s4: 58, totalPts: 223, totalBounty: "$4.460.000", badgeTitle: "Veterano Oficial", rewardMedals: "Plata de Temporada" },
                { rank: "#5", driver: "Ming", s1: 45, s2: 48, s3: 52, s4: 50, totalPts: 195, totalBounty: "$3.900.000", badgeTitle: "Veterano Oficial", rewardMedals: "Plata de Temporada" },
                { rank: "#6", driver: "Webster", s1: 35, s2: 40, s3: 42, s4: 45, totalPts: 162, totalBounty: "$3.240.000", badgeTitle: "Veterano Oficial", rewardMedals: "Completador Oficial" }
            ];
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
                        <div class="season-podium-driver" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
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
                        <strong style="color: #ffffff; font-family: var(--font-racing); font-size: 13.5px;">${escapeHtml(p.driver)}</strong>
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

function initChallengesSystem() {
    currentSeasonId = 'season_1';
    currentSeasonWeek = 1;
    renderChallengesUI();
}

// Exportación global a window para eventos HTML
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
// BLACKLIST EVENT // CAMPEONATO 2026 (4 SEMANAS • 5 GRUPOS • 8 DESAFÍOS)
// =======================================================

const BLACKLIST_STORAGE_KEY = 'nfs_blacklist_championship_2026_v4';
let blacklistDrivers = [];
let currentSelectedBlacklistRank = 1;
let currentChampionshipWeek = 1;

function loadBlacklistData() {
    try {
        localStorage.removeItem('nfs_blacklist_championship_2026_v1');
        localStorage.removeItem('nfs_blacklist_championship_2026_v2');
        localStorage.removeItem('nfs_blacklist_championship_2026_v3');
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
 * Fórmula de Puntuación del Campeonato 2026:
 * Puntos = (P1 * 25) + (P2 * 18) + (P3 * 15) + (P4 * 12) +
 *          (1° Mejores Tiempos * 100) + (2° Mejores Tiempos * 50) + (3° Mejores Tiempos * 20) +
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
    // Asignar en rotación a los grupos para pilotos de parrilla extendida (> 15)
    const groupNames = [
        'Grupo Alpha (Líderes)',
        'Grupo Beta (Aspirantes)',
        'Grupo Gamma (Fuerza)',
        'Grupo Delta (Técnica)',
        'Grupo Épsilon (Defensa)'
    ];
    const groupIdx = (rank - 1) % 5;
    return `${groupNames[groupIdx]} [Ext]`;
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

    weekData.groups.forEach((grp, grpIdx) => {
        const groupCard = document.createElement('div');
        groupCard.className = 'champ-group-card';

        // Incluir pilotos base del grupo y cualquier piloto extendido (> 15) asignado por rotación
        const groupPilots = [...grp.pilots];
        blacklistDrivers.forEach(d => {
            if (d.rank > 15 && (d.rank - 1) % 5 === grpIdx && !groupPilots.includes(d.rank)) {
                groupPilots.push(d.rank);
            }
        });

        let pilotsHtml = '';
        groupPilots.forEach(pilotRank => {
            const driver = blacklistDrivers.find(d => d.rank === pilotRank) || {
                rank: pilotRank,
                name: `Piloto #${pilotRank}`,
                alias: `P${pilotRank}`,
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
                            <div class="pilot-item-name">${driver.name} <span style="color: var(--nfs-orange);">"${driver.alias}"</span></div>
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

        const defaultTag = window.nfsI18n ? window.nfsI18n.t('badge_official_trio') : 'TRÍO OFICIAL';
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
            const bonusClass = t.bonus === 100 ? 'badge-bonus-100' : t.bonus === 50 ? 'badge-bonus-50' : 'badge-bonus-20';
            const repBadgeText = t.repBadge || (t.repMoney ? `💰 $${t.repMoney.toLocaleString()} REP` : '');
            const defaultPending = window.nfsI18n ? window.nfsI18n.t('champ_pending_driver') : 'Por disputar';
            const pilotDisplay = (t.pilot === 'Por disputar' || !t.pilot) ? defaultPending : t.pilot;

            top3Html += `
                <div class="champ-ch-podium-row ${rowClass}">
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span class="badge-bonus ${bonusClass}">${t.badge}</span>
                        ${repBadgeText ? `<span class="badge-rep-money">${repBadgeText}</span>` : ''}
                        <div>
                            <span style="font-weight: 700; color: #ffffff;">${pilotDisplay}</span>
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
                <span style="color: var(--nfs-orange); font-size: 10.5px;">🚗</span>
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
 * Retorna los pilotos de la Blacklist ordenados dinámicamente según la Clasificación General del Campeonato.
 * Criterio: Puntos Totales Descendente -> Victorias P1 -> Mejores Tiempos 1° -> Dinero de Reputación -> Rango Base.
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

        // Desempate 2: Bonos de 1° mejor tiempo (+100 PTS)
        const bt1A = a.bestTimes?.first || 0;
        const bt1B = b.bestTimes?.first || 0;
        if (bt1B !== bt1A) return bt1B - bt1A;

        // Desempate 3: Dinero de Reputación ($ REP)
        const repA = a.rep || 0;
        const repB = b.rep || 0;
        if (repB !== repA) return repB - repA;

        // Desempate 4: Rango inicial
        return (a.rank || 99) - (b.rank || 99);
    });
}

/**
 * Sincroniza e indexa las Fichas Técnicas y la Clasificación General con los ganadores de los desafíos
 * de las rotaciones semanales (CHAMPIONSHIP_WEEKS_DATA) o datos en vivo de competición.
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
 * Permite registrar o actualizar en tiempo real el resultado de un piloto en un desafío,
 * recalculando automáticamente la Clasificación General y re-indexando las Fichas Técnicas.
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
                        <div class="driver-names-row">
                            <span class="driver-cell-name">${driver.name}</span>
                            <span class="driver-cell-alias">"${driver.alias}"</span>
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
                    <span class="mini-bonus-pill badge-bonus-100" title="1° Mejor Tiempo (+100 PTS)">🥇 ${bt.first || 0}</span>
                    <span class="mini-bonus-pill badge-bonus-50" title="2° Mejor Tiempo (+50 PTS)">🥈 ${bt.second || 0}</span>
                    <span class="mini-bonus-pill badge-bonus-20" title="3° Mejor Tiempo (+20 PTS)">🥉 ${bt.third || 0}</span>
                </div>
            </td>
            <td>
                <span class="pts-cell">${totalPts.toLocaleString()} PTS</span>
            </td>
            <td>
                <span class="champ-group-tag">${groupName}</span>
            </td>
            <td>
                <span class="status-badge ${statusClass}">${standingRank === 1 ? '👑 LÍDER #1' : driver.status || 'ACTIVO'}</span>
            </td>
        `;

        tbody.appendChild(tr);
    });

    // Actualizar la Ficha Táctica seleccionada
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

    // Ordenar explícitamente según la Clasificación General del Campeonato (1 al 15+)
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
                        <div class="blacklist-driver-fullname">${driver.name} "${driver.alias}"</div>
                    </div>
                    ${window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(driver.alias || driver.name, 'xlarge') : ''}
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
                    <span class="spec-label">Grupo Semanal:</span>
                    <span class="spec-value" style="color: var(--nfs-orange);">${groupName} (Semana ${currentChampionshipWeek})</span>
                </div>
            </div>

            <div class="tactical-bio-box">
                <div class="bio-bracket-top">
                    <span class="bio-title">bio:</span>
                </div>
                <p class="bio-text">${driver.bio}</p>
                <div class="bio-bracket-bottom"></div>
                <div class="tactical-signature">${driver.signature || driver.alias.toUpperCase()}</div>
                ${driver.youtube ? `
                <div style="margin-top: 10px;">
                    <a href="${driver.youtube}" target="_blank" rel="noopener noreferrer" class="tactical-yt-btn">
                        <span>▶</span> Ver Canal / Video YouTube
                    </a>
                </div>
                ` : ''}
            </div>

            <div class="tactical-metrics-grid">
                <div class="metric-box rep-box">
                    <span class="metric-label">DINERO DE REPUTACIÓN ($ REP)</span>
                    <span class="metric-value rep-val">$${(driver.rep || 0).toLocaleString()}</span>
                </div>
                <div class="metric-box pts-box">
                    <span class="metric-label">PUNTOS TOTALES (SCORE)</span>
                    <span class="metric-value">${totalPts.toLocaleString()} PTS</span>
                </div>
            </div>

            <div class="tactical-bonuses-row">
                <div class="bonus-chip chip-b1">
                    <span class="bonus-tag">🥇 1° MEJOR (+100)</span>
                    <span class="bonus-val">${bt.first || 0} ${bt.first === 1 ? 'vez' : 'veces'}</span>
                </div>
                <div class="bonus-chip chip-b2">
                    <span class="bonus-tag">🥈 2° MEJOR (+50)</span>
                    <span class="bonus-val">${bt.second || 0} ${bt.second === 1 ? 'vez' : 'veces'}</span>
                </div>
                <div class="bonus-chip chip-b3">
                    <span class="bonus-tag">🥉 3° MEJOR (+20)</span>
                    <span class="bonus-val">${bt.third || 0} ${bt.third === 1 ? 'vez' : 'veces'}</span>
                </div>
            </div>

            <div class="tactical-podiums-breakdown">
                <div class="podium-chip chip-p1">
                    <span class="chip-pos">P1 (1°)</span>
                    <span class="chip-val">${v.p1 || 0}</span>
                </div>
                <div class="podium-chip chip-p2">
                    <span class="chip-pos">P2 (2°)</span>
                    <span class="chip-val">${v.p2 || 0}</span>
                </div>
                <div class="podium-chip chip-p3">
                    <span class="chip-pos">P3 (3°)</span>
                    <span class="chip-val">${v.p3 || 0}</span>
                </div>
                <div class="podium-chip chip-p4">
                    <span class="chip-pos">P4 (4°)</span>
                    <span class="chip-val">${v.p4 || 0}</span>
                </div>
            </div>

            <div class="tactical-action-bar">
                <button class="btn-explored" style="width: 100%; justify-content: center; font-size: 10.5px;" onclick="switchView('championship-standings')">
                    <span>🏆</span> Ver en Clasificación General
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
        titleEl.textContent = `⚡ SALTO RÁPIDO A PILOTO (ORDEN BLACKLIST 1 AL ${totalPilots}):`;
    }

    container.innerHTML = '';
    const sorted = getSortedBlacklistDrivers();
    sorted.forEach((d, idx) => {
        const standingRank = idx + 1;
        const btn = document.createElement('button');
        btn.className = 'jump-pill';
        btn.onclick = () => scrollToPilotCard(d.rank);

        let icon = '';
        if (standingRank === 1) icon = '👑 ';
        else if (standingRank === 2) icon = '🥈 ';
        else if (standingRank === 3) icon = '🥉 ';

        btn.textContent = `${icon}#${standingRank} ${d.alias || d.name}`;
        container.appendChild(btn);
    });
}

function updateChampionshipRosterLabels() {
    const totalPilots = Math.max(15, blacklistDrivers.length);

    // Actualizar texto de sub-pestañas en toda la web
    document.querySelectorAll('.subtab-cards-label').forEach(el => {
        el.textContent = `Fichas Técnicas (1 al ${totalPilots})`;
    });

    // Actualizar título de la sección de fichas técnicas
    const titleGlow = document.getElementById('bl-cards-title-glow');
    if (titleGlow) {
        titleGlow.textContent = `// Blacklist 1 al ${totalPilots}`;
    }

    // Actualizar título de tabla de clasificación general
    const standingsTitle = document.getElementById('bl-standings-title');
    if (standingsTitle) {
        standingsTitle.innerHTML = `<span>🏆</span> CLASIFICACIÓN GENERAL OFICIAL DEL CAMPEONATO (TOP ${totalPilots})`;
    }

    // Actualizar telemetría de pilotos en competición
    const pilotsCountEl = document.getElementById('bl-standings-pilots-count');
    if (pilotsCountEl) {
        pilotsCountEl.textContent = `${totalPilots} Corredores`;
    }

    // Actualizar resumen en formulario de inscripción
    const regSummarySlots = document.getElementById('reg-summary-slots');
    const regCountPill = document.getElementById('registered-count-pill');
    const totalReg = registeredParticipants.length;

    if (regSummarySlots) {
        if (totalReg <= 15) {
            regSummarySlots.textContent = `${totalReg} / 15 Ocupadas`;
        } else {
            regSummarySlots.textContent = `${totalReg} / ${totalReg} Plazas (Parrilla Extendida)`;
        }
    }

    if (regCountPill) {
        if (totalReg <= 15) {
            regCountPill.innerHTML = `<span id="reg-count-num">${totalReg}</span> / 15 Plazas`;
        } else {
            regCountPill.innerHTML = `<span id="reg-count-num">${totalReg}</span> Plazas (Ampliadas)`;
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
// SISTEMA DE INSCRIPCIÓN AL TORNEO // FIREBASE REALTIME DB
// =======================================================

const CHAMPIONSHIP_FIREBASE_URL = 'https://nfsranks-blacklist-default-rtdb.firebaseio.com/championship_participants.json';
const CHAMPIONSHIP_LOCAL_KEY = 'nfs_championship_participants_v1';
let registeredParticipants = [];

/**
 * Carga los participantes registrados en el torneo.
 * Estrategia Híbrida: Lee inmediatamente de localStorage para 0 latencia
 * y sincroniza concurrentemente con Firebase Realtime Database.
 */
function loadChampionshipParticipants() {
    // 1. Carga local inmediata
    try {
        const localData = localStorage.getItem(CHAMPIONSHIP_LOCAL_KEY);
        if (localData) {
            registeredParticipants = JSON.parse(localData);
            mergeRegisteredParticipantsWithBlacklist();
            renderRegisteredPilotsUI();
        }
    } catch (e) {
        console.warn("Aviso al cargar participantes locales:", e);
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
                    list.push(...data.filter(Boolean));
                } else if (typeof data === 'object') {
                    Object.keys(data).forEach(key => {
                        if (data[key]) {
                            list.push({ ...data[key], _firebaseKey: key });
                        }
                    });
                }

                // Ordenar rigurosamente por fecha de registro
                list.sort((a, b) => new Date(a.registeredAt || 0) - new Date(b.registeredAt || 0));

                if (list.length > 0) {
                    registeredParticipants = list;
                    localStorage.setItem(CHAMPIONSHIP_LOCAL_KEY, JSON.stringify(registeredParticipants));
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
    // 1. Guardado local inmediato y actualización reactiva de la UI
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
 * Procesa el formulario de inscripción al torneo
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

    // Verificar si el piloto ya está registrado
    const alreadyExists = registeredParticipants.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (alreadyExists) {
        showRegisterFeedback(`El piloto "${name}" ya se encuentra registrado en el campeonato.`, "error");
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>⏳</span> REGISTRANDO PILOTO EN LA RED...`;
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
        submitBtn.innerHTML = `<span>🚀</span> REGISTRARME EN EL CAMPEONATO 2026`;
    }

    const assignedRank = registeredParticipants.length;
    const totalParrilla = Math.max(15, registeredParticipants.length);
    showRegisterFeedback(`¡Inscripción confirmada con éxito! Has sido asignado a la Plaza Oficial #${assignedRank} del Campeonato Blacklist 2026. La parrilla y las fichas técnicas se han actualizado automáticamente a ${totalParrilla} pilotos en tiempo real.`, "success");
}

function showRegisterFeedback(message, type) {
    const el = document.getElementById('register-feedback-msg');
    if (!el) return;
    el.className = `register-feedback-msg feedback-${type}`;
    el.innerHTML = type === 'success' ? `<strong>✓ ÉXITO:</strong> ${message}` : `<strong>✕ ERROR:</strong> ${message}`;
    el.style.display = 'block';
    if (type === 'success') {
        setTimeout(() => {
            if (el) el.style.display = 'none';
        }, 6500);
    }
}

/**
 * Cruza los participantes reales registrados con las plazas de la Blacklist.
 * Si supera los 15 participantes, la Blacklist y las fichas técnicas se expanden automáticamente
 * hasta 18, 20 o más pilotos en tiempo real.
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

    if (total === 0) {
        listContainer.innerHTML = `
            <div class="empty-participants-msg">
                <span style="font-size: 25.9px; display: block; margin-bottom: 8px;">🏁</span>
                <strong>Aún no hay pilotos inscritos.</strong><br>
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

        const statusLabel = `PLAZA #${slotNum}`;

        item.innerHTML = `
            <div class="registered-pilot-left">
                <div class="reg-slot-badge ${badgeClass}">${slotNum}</div>
                ${window.NFSOperators ? window.NFSOperators.getOperatorBadgeHTML(pilot.alias || pilot.name) : ''}
                <div class="reg-pilot-info">
                    <div class="reg-pilot-name">
                        ${pilot.name} ${pilot.alias ? `<span style="color: var(--nfs-orange);">"${pilot.alias}"</span>` : ''}
                    </div>
                    <div class="reg-pilot-car">
                        <span>🏎️</span> ${pilot.ride}
                    </div>
                    <div class="reg-pilot-schedule">
                        <span>⏰</span> ${pilot.schedule}
                    </div>
                </div>
            </div>
            <div class="registered-pilot-right">
                <span class="reg-status-badge status-official">${statusLabel}</span>
                ${pilot.youtube ? `
                    <a href="${pilot.youtube}" target="_blank" rel="noopener noreferrer" class="btn-yt-link">
                        ▶ Canal / Video
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
// SALÓN HISTÓRICO DE TORNEOS (CHALLONGE HISTORIAL)
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

    // Actualizar píldoras selectoras de torneo
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
                <span class="past-badge-date">📅 ${t.date}</span>
                <span class="past-badge-category">⚙️ ${t.category}</span>
                <span class="past-badge-format">⚔️ ${t.format}</span>
            </div>
            <h2 class="past-hero-title">${t.title}</h2>
            <p class="past-hero-desc">
                Organizado y disputado bajo las normas oficiales de <strong>${t.platform}</strong>. 
                ${t.hosts ? `Coordinación y arbitraje: <span style="color: var(--nfs-orange);">${t.hosts}</span>.` : ''}
            </p>
        </div>
        <div class="past-hero-actions">
            <a href="${t.challongeUrl}" target="_blank" rel="noopener noreferrer" class="btn-challonge-link-hero">
                <span>🔗</span> Ver Bracket Oficial en Challonge
            </a>
        </div>
    `;
}

function renderPastTournamentStats(t) {
    const statsEl = document.getElementById('past-tournament-stats-bar');
    if (!statsEl) return;

    statsEl.innerHTML = `
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">👑</span>
            <div class="challenge-summary-content">
                <span class="challenge-summary-label">CAMPEÓN HISTÓRICO</span>
                <span class="challenge-summary-val" style="color: #ffd700; font-weight: 800;">${t.stats.champion} 🥇</span>
            </div>
        </div>
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">🥈</span>
            <div class="challenge-summary-content">
                <span class="challenge-summary-label">SUBCAMPEÓN</span>
                <span class="challenge-summary-val" style="color: #e2e8f0;">${t.stats.runnerUp}</span>
            </div>
        </div>
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">🏎️</span>
            <div class="challenge-summary-content">
                <span class="challenge-summary-label">PILOTOS EN EL CUADRO</span>
                <span class="challenge-summary-val" style="color: #38bdf8; font-family: var(--font-mono);">${t.stats.totalPilots} Corredores</span>
            </div>
        </div>
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">⚔️</span>
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
                            ${isGrandFinal ? '<span class="grand-final-badge">👑 GRAN FINAL</span>' : ''}
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
        const isPodium = p.finalPos.includes('Campeón') || p.finalPos.includes('Lugar');
        const posClass = p.finalPos.includes('Campeón') ? 'pos-champion' : (p.finalPos.includes('2do') ? 'pos-silver' : (p.finalPos.includes('3er') ? 'pos-bronze' : ''));

        html += `
            <tr class="${isPodium ? 'row-podium' : ''}">
                <td style="font-family: var(--font-mono); font-weight: 700; color: var(--nfs-orange);">#${p.seed}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <strong style="color: #ffffff; font-size: 12.2px;">${p.name}</strong>
                        ${p.finalPos.includes('Campeón') ? '<span class="crown-badge">👑 1°</span>' : ''}
                    </div>
                </td>
                <td>
                    <span class="past-final-pos ${posClass}">${p.finalPos}</span>
                </td>
                <td style="color: var(--text-muted); font-size: 10.5px;">
                    ${p.finalPos.includes('Campeón') ? '🏆 Gran Finalista Vencedor' : (p.finalPos.includes('2do') ? '⚔️ Gran Finalista' : 'Completó cuadro de llaves')}
                </td>
                <td>
                    <span class="badge-verified-challonge">✓ Verificado Challonge</span>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// =======================================================
// MÓDULOS LATERALES DEL HOME (PORTAL DASHBOARD)
// =======================================================
// Récords Oficiales verificados extraídos de las tablas del Leaderboard (Google Sheets de NFSRANKSMW)
const HOME_LIVE_LEADERBOARD_RECORDS = [
    { rank: 1, driver: "Lea4Speed0", time: "1:20.750", car: "Carrera GT", route: "City Perimeter", routeType: "Circuito" },
    { rank: 2, driver: "SRTxAvenger", time: "1:20.767", car: "Carrera GT", route: "City Perimeter", routeType: "Circuito" },
    { rank: 3, driver: "Skymaster", time: "1:14.65", car: "Carrera GT", route: "Seaside & Power Station", routeType: "Sprint" },
    { rank: 4, driver: "5TATIC", time: "0m 14s 230ms", car: "Carrera GT", route: "Seaside & Camden", routeType: "Drag" },
    { rank: 5, driver: "ZimanX", time: "1:20.87", car: "Carrera GT", route: "City Perimeter", routeType: "Circuito" }
];

function initHomeSidebarModules() {
    // 1. Inicializar Cuenta Regresiva de NFS Most Wanted Blacklist 2026
    const targetDate = new Date("2026-10-03T00:00:00").getTime();
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (daysEl && hoursEl && minsEl && secsEl) {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const diff = targetDate - now;

            if (diff <= 0) {
                daysEl.textContent = "00";
                hoursEl.textContent = "00";
                minsEl.textContent = "00";
                secsEl.textContent = "00";
                const cdContainer = document.getElementById('home-event-countdown');
                if (cdContainer) {
                    cdContainer.innerHTML = `<div style="color: var(--green-neon); font-family: var(--font-racing); font-size: 13px; font-weight: 800; text-align: center; width: 100%; padding: 6px 0; text-shadow: 0 0 10px rgba(0,255,136,0.6);">🏁 ¡EVENTO EN CURSO!</div>`;
                }
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            daysEl.textContent = String(days).padStart(2, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minsEl.textContent = String(minutes).padStart(2, '0');
            secsEl.textContent = String(seconds).padStart(2, '0');
        };
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // 2. Renderizar Mini-Leaderboard con los pilotos oficiales originales
    const lbContainer = document.getElementById('home-live-leaderboard-list');
    if (lbContainer) {
        let html = "";
        HOME_LIVE_LEADERBOARD_RECORDS.forEach(rec => {
            const rankClass = rec.rank === 1 ? 'live-lb-rank-1' : (rec.rank === 2 ? 'live-lb-rank-2' : (rec.rank === 3 ? 'live-lb-rank-3' : 'live-lb-rank-other'));
            html += `
                <div class="live-lb-item" onclick="navigateFromLiveLeaderboard('${rec.route}', '${rec.routeType}')" title="Ver Leaderboard oficial de ${rec.route}">
                    <div class="live-lb-left">
                        <span class="live-lb-rank-num ${rankClass}">${rec.rank}</span>
                        <div class="live-lb-info">
                            <div class="live-lb-driver">${rec.driver}</div>
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

        // Sincronizar dinámicamente con la primera hoja oficial del Leaderboard
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
                    html += `
                        <div class="live-lb-item" onclick="navigateFromLiveLeaderboard('${route.name.replace(/'/g, "\\'")}', '${route.type}')" title="Ver Leaderboard oficial de ${route.name}">
                            <div class="live-lb-left">
                                <span class="live-lb-rank-num ${rankClass}">${rankNum}</span>
                                <div class="live-lb-info">
                                    <div class="live-lb-driver">${rec.driver}</div>
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
            const titleEl = document.getElementById('leaderboard-title');
            if (titleEl) titleEl.innerText = `Leaderboard: ${found.name} (${found.type})`;
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
// SECCIÓN DE MIEMBROS DE DISCORD (ROSTER OFICIAL)
// =======================================================
let currentMembersRoleFilter = 'all';
let currentMembersSearchQuery = '';

function initMembersSection() {
    if (typeof DISCORD_MEMBERS_DATA === 'undefined') return;

    // Calcular estadísticas
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

    // Actualizar números de píldoras de filtro
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
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px; font-family: var(--font-racing); font-size: 13px;">No se encontraron miembros para el criterio de búsqueda.</td></tr>`;
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
            ? `<span class="join-method-tag">🔗 ${m.joinMethod}</span>`
            : `<span style="color: var(--text-dimmed); font-size: 9.7px; font-style: italic;">Desconocido</span>`;

        tr.innerHTML = `
            <td>
                <span class="bl-rank-badge ${rankBadgeClass}">${idx + 1}</span>
            </td>
            <td>
                <div class="member-cell-flex">
                    <div class="member-avatar-badge role-${m.roleCategory}">${initialLetter}</div>
                    <div class="driver-cell-flex">
                        <span class="driver-cell-name">${m.name}</span>
                        <span style="font-family: var(--font-mono); font-size: 8.9px; color: var(--text-dimmed);">@${m.username}</span>
                    </div>
                </div>
            </td>
            <td>
                <span class="discord-role-pill role-${m.roleCategory}">● ${m.role} ${extraRolesHTML}</span>
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
                <span class="champ-group-tag" style="color: var(--green-neon); background: rgba(0, 255, 136, 0.1); border-color: rgba(0, 255, 136, 0.3); font-weight: 700;">● Activo</span>
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
// SECCIÓN DE GUÍAS & TUNING DE RENDIMIENTO (10 AUTOS OFICIALES)
// =======================================================
let currentTuningDrivetrainFilter = 'all';
let currentTuningSearchQuery = '';

function initTuningSection() {
    if (typeof TUNING_CARS_DATA === 'undefined') return;

    // Actualizar contadores de tracción en la barra de filtros
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
            <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 50px 20px; font-family: var(--font-racing); font-size: 13px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 12px;">
                🏎️ No se encontraron configuraciones de tuning para el criterio de búsqueda seleccionado.
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
            ${renderSliderRow('steering', 'tuning_slider_steering', 'Dirección', setup.steering || 0, expl.steering)}
            ${renderSliderRow('handling', 'tuning_slider_handling', 'Manejo', setup.handling || 0, expl.handling)}
            ${renderSliderRow('brakes', 'tuning_slider_brakes', 'Frenos', setup.brakes || 0, expl.brakes)}
            ${renderSliderRow('rideHeight', 'tuning_slider_ride_height', 'Altura', setup.rideHeight || 0, expl.rideHeight)}
            ${renderSliderRow('aerodynamics', 'tuning_slider_aerodynamics', 'Aerodinámica', setup.aerodynamics || 0, expl.aerodynamics)}
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
                        <span class="spec-strip-label" data-i18n="tuning_spec_top_speed">VEL. MÁXIMA</span>
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
                        <span>⚙️</span> <span data-i18n="tuning_setup_title">SETUP DE PERFORMANCE (PAUSA > PERFORMANCE)</span>
                    </div>
                    ${slidersHTML}
                </div>

                <div class="tuning-protip-box">
                    <strong data-i18n="tuning_protip_title">CONSEJO DE CONDUCCIÓN PROFESIONAL:</strong>
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
// INICIALIZACIÓN UNIFICADA (DOMContentLoaded)
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

    // 1. Reloj de telemetría F1
    startTelemetryClock();

    // 2. Carga inmediata de las tarjetas de rutas con Lazy Loading
    if (typeof routesData !== 'undefined') {
        renderRoutes(routesData);
    }

    // 3. Inicializar Sistema de Desafíos Semanales
    initChallengesSystem();

    // 4. Inicializar Sistema Blacklist Event 2026
    initBlacklistSystem();

    // 5. Inicializar Salón Histórico de Torneos
    initPastTournaments();

    // 6. Inicializar Módulos Laterales del Home (Evento 2026, Live Leaderboard, Desafíos)
    initHomeSidebarModules();

    // 7. Renderizado del Buscador Oficial de Pilotos
    renderDriverSearchUI('search-driver-wrapper');

    // 8. Inicializar Sección Oficial de Miembros de Discord
    initMembersSection();

    // 9. Inicializar Sección Oficial de Guías & Tuning
    initTuningSection();

    // 10. Inicializar Selector de Pistas en Formulario
    initSubmitRouteSelector();

    // 11. Ejecución diferida en segundo plano para tablas globales y Hall of Fame
    setTimeout(() => {
        generateHallOfFame();
        generateGlobalLeaderboards();
    }, 150);
});

// =======================================================
// INTEGRACIÓN DEL SISTEMA MULTILINGÜE (i18n)
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
});

