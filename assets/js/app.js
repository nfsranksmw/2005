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
const FIREBASE_RTDB_BASE_URL = "https://nfsranks-blacklist-default-rtdb.firebaseio.com";

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
    if (mainNav) {
        mainNav.classList.toggle('open');
    }
}

function switchView(viewId) {
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

    const targetNavLink = document.getElementById('nav-' + viewId);
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
    if (mainNav) {
        mainNav.classList.remove('open');
    }

    closeAllDropdowns();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

function switchCircuitTab(tabId, btn) {
    document.querySelectorAll('.circuit-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('#container-tabs-circuit .tab-btn').forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) targetTab.classList.add('active');
    if (btn) btn.classList.add('active');
}

function switchSprintDragTab(tabId, btn) {
    document.querySelectorAll('.sprintdrag-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('#container-tabs-sprintdrag .tab-btn').forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) targetTab.classList.add('active');
    if (btn) btn.classList.add('active');
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
// INTERACTIVIDAD ROCKPORT MAP LIVE
// =======================================================
let currentMapZoom = 1.0;

function zoomMap(delta) {
    const img = document.getElementById('rockport-map-img');
    const zoomBadge = document.getElementById('map-zoom-level');
    if (!img) return;

    currentMapZoom = Math.min(Math.max(currentMapZoom + delta, 0.75), 3.0);
    img.style.transform = `scale(${currentMapZoom})`;
    if (zoomBadge) zoomBadge.textContent = `ZOOM: ${Math.round(currentMapZoom * 100)}%`;
}

function resetMapZoom() {
    const img = document.getElementById('rockport-map-img');
    const zoomBadge = document.getElementById('map-zoom-level');
    const panContainer = document.getElementById('map-pan-container');
    if (!img) return;

    currentMapZoom = 1.0;
    img.style.transform = 'scale(1)';
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

    const img = document.getElementById('rockport-map-img');
    const panContainer = document.getElementById('map-pan-container');
    const indicator = document.getElementById('active-district-indicator');
    const zoomBadge = document.getElementById('map-zoom-level');

    if (!img || !panContainer) return;

    if (districtKey === 'all') {
        currentMapZoom = 1.0;
        img.style.transform = 'scale(1)';
        panContainer.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (indicator) indicator.textContent = 'TODO EL MAPA (GLOBAL)';
        if (zoomBadge) zoomBadge.textContent = 'ZOOM: 100%';
        return;
    }

    currentMapZoom = 1.6;
    img.style.transform = `scale(${currentMapZoom})`;
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
            iconHtml = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: #ffd700;">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.23-5.23"></path>
            </svg>`;
        } else if (route.type === "Sprint") {
            iconHtml = `<span style="font-size: 22px; color: var(--nfs-orange);">⚡</span>`;
        } else if (route.type === "Drag") {
            iconHtml = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style="color: #f87171;">
                <path d="M9 2h6v2H9V2zm1 3h4v2h-4V5zm-2 3h8v2H8V8zm1 3h6v2H9v-2zm-2 3h10v2H7v-2zm2 3h6v2H9v-2zm-3 3h12v2H6v-2z"/>
            </svg>`;
        } else {
            iconHtml = `<span style="font-size: 22px; color: var(--nfs-orange);">🔄</span>`;
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
                <h3>${route.name}</h3>
                <div class="route-preview-placeholder" style="font-size: 12px; color: #64748b;">Cargando récord...</div>
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
        let sampleSheet = "";

        if (route && route.sheets) {
            if (route.type === "Circuito") {
                sampleSheet = route.sheets.junkmanSingle || route.sheets.bmwSingle || route.sheets.junkman || route.sheets.bmw || "";
            } else if (route.type === "Drag") {
                sampleSheet = route.sheets.junkman || route.sheets.bmw || route.sheets.drag || Object.values(route.sheets)[0] || "";
            } else {
                sampleSheet = route.sheets.junkman || route.sheets.bmw || Object.values(route.sheets)[0] || "";
            }
        }

        if (!sampleSheet || sampleSheet.trim() === "") {
            previewContainer.innerHTML = `<span style="font-style: italic; color: #64748b; font-size: 12px;">Disponible para récord</span>`;
            return;
        }

        let rows = await fetchGoogleSheetData(sampleSheet, 5);
        let topRow = Array.isArray(rows) ? rows.find(r => r.rank && (r.rank.includes("1") || r.rank === "1")) : null;

        if (topRow) {
            previewContainer.outerHTML = `
                <div class="route-record-preview">
                    <span class="route-time-display">⏱️ ${topRow.time}</span>
                    <span class="driver-name">👤 ${topRow.driver}</span>
                </div>
                <div style="overflow: hidden; width: 100%; margin-top: 3px;">
                    <div style="white-space: nowrap; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; overflow: hidden; text-overflow: ellipsis;">
                        🏎️ ${topRow.car}
                    </div>
                </div>
            `;
            return;
        }

        previewContainer.innerHTML = `<span style="font-style: italic; color: #64748b; font-size: 12px;">Disponible para récord</span>`;
    } catch (e) {
        console.warn("Error en la previsualización de:", route ? route.name : "Ruta", e);
        previewContainer.innerHTML = `<span style="font-style: italic; color: #64748b; font-size: 12px;">Disponible para récord</span>`;
    }
}

function filterRoutes() {
    const searchInput = document.getElementById('route-search');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const sourceData = typeof routesData !== 'undefined' ? routesData : [];

    const filtered = sourceData.filter(route => {
        const matchesCategory = currentCategory === 'all' || route.type === currentCategory;
        const matchesSearch = route.name.toLowerCase().includes(query);
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

    return raw.filter(Boolean).map(item => ({
        rank: item.rank ? (String(item.rank).startsWith('#') ? item.rank : `#${item.rank}`) : "#--",
        driver: item.driver || "Piloto",
        time: item.time || item.declaredTime || "--:--.---",
        car: item.car || "BMW M3 GTR",
        device: item.device || "PC",
        gearbox: item.gearbox || "Manual",
        date: item.date || new Date().toISOString().split('T')[0],
        yt: item.yt || item.videoUrl || "#"
    }));
}

function mergeLeaderboardData(sheetRows = [], firebaseRows = []) {
    const sRows = Array.isArray(sheetRows) ? sheetRows : [];
    const fbRows = Array.isArray(firebaseRows) ? firebaseRows : [];

    if (fbRows.length === 0) return sRows;
    if (sRows.length === 0) return fbRows;

    const combined = [...sRows];

    fbRows.forEach(fb => {
        if (!fb || !fb.driver) return;
        const fbDriver = String(fb.driver).trim().toLowerCase();
        const fbTime = String(fb.time || fb.declaredTime || '').trim();

        const exists = combined.some(r => {
            const rDriver = String(r.driver || '').trim().toLowerCase();
            const rTime = String(r.time || '').trim();
            return rDriver === fbDriver && rTime === fbTime;
        });

        if (!exists) {
            combined.push({
                rank: fb.rank || '#--',
                driver: fb.driver,
                time: fb.time || fb.declaredTime || '--:--.---',
                car: fb.car || 'BMW M3 GTR',
                device: fb.device || 'PC',
                gearbox: fb.gearbox || 'Manual',
                date: fb.date || new Date().toISOString().split('T')[0],
                yt: fb.yt || fb.videoUrl || '#'
            });
        }
    });

    combined.sort((a, b) => {
        const msA = parseTimeToMs(a.time);
        const msB = parseTimeToMs(b.time);
        if (msA !== null && msB !== null && msA !== msB) return msA - msB;
        if (msA !== null && msB === null) return -1;
        if (msA === null && msB !== null) return 1;
        return (a.driver || '').localeCompare(b.driver || '');
    });

    return combined.map((item, idx) => ({
        ...item,
        rank: `#${idx + 1}`
    }));
}

// =======================================================
// CARGA Y RENDERIZADO DE TABLAS INDIVIDUALES (LEADERBOARDS)
// =======================================================
async function loadLeaderboardForRoute(route) {
    const circuitTabs = document.getElementById('container-tabs-circuit');
    const sprintDragTabs = document.getElementById('container-tabs-sprintdrag');

    document.querySelectorAll('.circuit-section, .sprintdrag-section').forEach(sec => sec.classList.remove('active'));

    const fbDataPromise = fetchFirebaseRouteRecords(route.name);

    if (route.type === "Circuito") {
        if (circuitTabs) circuitTabs.classList.add('active-group');
        if (sprintDragTabs) sprintDragTabs.classList.remove('active-group');
        switchCircuitTab('junkman-single', circuitTabs.querySelector('.tab-btn'));

        const [d1, d2, d3, d4, fbData] = await Promise.all([
            fetchGoogleSheetData(route.sheets.junkmanSingle),
            fetchGoogleSheetData(route.sheets.junkmanFast),
            fetchGoogleSheetData(route.sheets.bmwSingle),
            fetchGoogleSheetData(route.sheets.bmwFast),
            fbDataPromise
        ]);

        const fbJunkmanSingle = extractCategoryRecords(fbData, 'junkman_single');
        const fbJunkmanFast = extractCategoryRecords(fbData, 'junkman_fast');
        const fbBmwSingle = extractCategoryRecords(fbData, 'bmw_single');
        const fbBmwFast = extractCategoryRecords(fbData, 'bmw_fast');

        renderTableRows('tbody-junkman-single', mergeLeaderboardData(d1, fbJunkmanSingle));
        renderTableRows('tbody-junkman-fast', mergeLeaderboardData(d2, fbJunkmanFast));
        renderTableRows('tbody-bmw-single', mergeLeaderboardData(d3, fbBmwSingle));
        renderTableRows('tbody-bmw-fast', mergeLeaderboardData(d4, fbBmwFast));
    } else {
        if (circuitTabs) circuitTabs.classList.remove('active-group');
        if (sprintDragTabs) sprintDragTabs.classList.add('active-group');
        switchSprintDragTab('sprintdrag-junkman', sprintDragTabs.querySelector('.tab-btn'));

        const [dJunkman, dBmw, fbData] = await Promise.all([
            fetchGoogleSheetData(route.sheets.junkman),
            fetchGoogleSheetData(route.sheets.bmw),
            fbDataPromise
        ]);

        const fbJunkman = extractCategoryRecords(fbData, 'junkman');
        const fbBmw = extractCategoryRecords(fbData, 'bmw');

        renderTableRows('tbody-sprintdrag-junkman', mergeLeaderboardData(dJunkman, fbJunkman));
        renderTableRows('tbody-sprintdrag-bmw', mergeLeaderboardData(dBmw, fbBmw));
    }
}

function renderTableRows(tbodyId, dataRows) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!dataRows || dataRows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 25px; font-family: var(--font-racing); font-size: 16px;">Sin registros oficiales para esta categoría aún.</td></tr>`;
        return;
    }

    dataRows.forEach(row => {
        const tr = document.createElement('tr');
        const rankNum = parseInt(String(row.rank).replace(/[^0-9]/g, ''), 10);

        let rankBadgeClass = 'rank-normal';
        if (rankNum === 1) rankBadgeClass = 'rank-gold';
        else if (rankNum === 2) rankBadgeClass = 'rank-silver';
        else if (rankNum === 3) rankBadgeClass = 'rank-bronze';

        let rowHighlightClass = rankNum === 1 ? 'active-row' : '';
        tr.className = `blacklist-row ${rowHighlightClass}`;

        let videoBtnHTML = (row.yt && row.yt !== "#" && row.yt.startsWith("http"))
            ? `<a href="${row.yt}" target="_blank" rel="noopener noreferrer" class="btn-yt-link" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; font-size: 11px; background: rgba(255, 0, 0, 0.15); border: 1px solid rgba(255, 0, 0, 0.4); color: #ff5555; text-decoration: none; border-radius: 4px; font-family: var(--font-racing); font-weight: 700;">▶ Video</a>`
            : `<span style="color: var(--text-dimmed); font-size: 12px; font-style: italic;">Sin video</span>`;

        let aliasTag = '';
        if (rankNum === 1) aliasTag = '<span class="driver-cell-alias">👑 RECORD MUNDIAL</span>';
        else if (rankNum === 2) aliasTag = '<span class="driver-cell-alias" style="color: #cbd5e1;">🥈 TOP 2 MUNDIAL</span>';
        else if (rankNum === 3) aliasTag = '<span class="driver-cell-alias" style="color: #cd7f32;">🥉 TOP 3 MUNDIAL</span>';
        else aliasTag = '<span class="driver-cell-alias" style="color: var(--text-muted); font-size: 10px;">PILOTO OFICIAL</span>';

        tr.innerHTML = `
            <td>
                <span class="bl-rank-badge ${rankBadgeClass}">${rankNum || row.rank}</span>
            </td>
            <td>
                <div class="driver-cell-flex">
                    <span class="driver-cell-name">${row.driver}</span>
                    ${aliasTag}
                </div>
            </td>
            <td>
                <span class="rep-money-cell" style="font-size: 15px; text-shadow: 0 0 10px rgba(34, 197, 94, 0.35);">${row.time}</span>
            </td>
            <td>
                <span style="color: #ffffff; font-weight: 700; font-size: 13px;">${row.car}</span>
            </td>
            <td>
                <span class="champ-group-tag" style="color: #38bdf8; background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.3);">🎮 ${row.device}</span>
            </td>
            <td>
                <span class="champ-group-tag" style="color: #ffd700; background: rgba(255, 215, 0, 0.1); border-color: rgba(255, 215, 0, 0.3);">⚙️ ${row.gearbox}</span>
            </td>
            <td style="color: var(--text-muted); font-family: var(--font-mono); font-size: 12px;">${row.date}</td>
            <td>${videoBtnHTML}</td>
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

    const sortedDrivers = await fetchWithMemoryAndStorageCache('compiled_hall_of_fame_v4', async () => {
        const driverCounts = {};
        const sourceData = typeof routesData !== 'undefined' ? routesData : [];

        const tasks = [];
        for (const route of sourceData) {
            if (!route.sheets) continue;
            const sheetUrls = Object.values(route.sheets).filter(url => url && typeof url === 'string' && url.trim() !== "");

            for (const url of sheetUrls) {
                tasks.push(fetchWithTimeout(url, 5, 3000));
            }
        }

        const results = await Promise.all(tasks);

        results.forEach(rows => {
            if (rows && rows.length > 0) {
                const topDriverRow = rows.find(r => r.rank && (r.rank.includes("1") || r.rank === "1"));
                if (topDriverRow && topDriverRow.driver) {
                    let driverName = topDriverRow.driver.trim().toUpperCase();
                    driverCounts[driverName] = (driverCounts[driverName] || 0) + 1;
                }
            }
        });

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
            <td><strong style="color: #ffffff; font-size: 15px;">${item.driver}</strong></td>
            <td style="color: var(--nfs-orange); font-family: var(--font-mono); font-weight: 800; font-size: 16px; text-shadow: var(--nfs-subtle-glow);">${item.records} Récords</td>
            <td><span class="telemetry-pill">PC / Multi</span></td>
            <td><span class="telemetry-pill" style="color: var(--nfs-orange); font-weight: bold;">${badge}</span></td>
        `;
        hofTbody.appendChild(tr);
    });
}

async function processPodiumsForRoutes(filterType = null) {
    const cacheKey = `compiled_podiums_v5_${filterType ? filterType.toLowerCase() : 'all'}`;

    return await fetchWithMemoryAndStorageCache(cacheKey, async () => {
        const podiumStats = {};
        const sourceData = typeof routesData !== 'undefined' ? routesData : [];
        const rowLimit = 7;
        const tasks = [];

        for (const route of sourceData) {
            if (filterType && route.type && route.type.toLowerCase() !== filterType.toLowerCase()) continue;
            if (!route.sheets) continue;

            const sheetUrls = Object.values(route.sheets).filter(url => url && typeof url === 'string' && url.trim() !== "");
            for (const url of sheetUrls) {
                tasks.push(fetchWithTimeout(url, rowLimit, 3000));
            }
        }

        const results = await Promise.all(tasks);

        results.forEach(rows => {
            if (!rows || rows.length === 0) return;
            rows.forEach(r => {
                if (!r.rank || !r.driver) return;
                let rankNum = parseInt(r.rank.replace(/[^0-9]/g, ''));

                if ([1, 2, 3].includes(rankNum)) {
                    let driverName = r.driver.trim().toUpperCase();
                    if (!podiumStats[driverName]) {
                        podiumStats[driverName] = { first: 0, second: 0, third: 0 };
                    }
                    if (rankNum === 1) podiumStats[driverName].first++;
                    if (rankNum === 2) podiumStats[driverName].second++;
                    if (rankNum === 3) podiumStats[driverName].third++;
                }
            });
        });

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
            <td><strong style="color: #ffffff; font-size: 15px;">${item.driver}</strong></td>
            <td style="color: #ffd700; font-family: var(--font-mono); font-weight: 800; font-size: 15px; text-shadow: var(--gold-glow);">${item.first}</td>
            <td style="color: #e2e8f0; font-family: var(--font-mono); font-weight: 800; font-size: 15px; text-shadow: var(--silver-glow);">${item.second}</td>
            <td style="color: #ff9f43; font-family: var(--font-mono); font-weight: 800; font-size: 15px; text-shadow: var(--bronze-glow);">${item.third}</td>
            <td style="color: var(--nfs-orange); font-family: var(--font-mono); font-weight: 800; font-size: 16px; text-shadow: var(--nfs-subtle-glow);">${item.total}</td>
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

    for (const route of sourceData) {
        if (!route.sheets) continue;
        const sheetEntries = Object.entries(route.sheets);

        for (const [sheetKey, sheetUrl] of sheetEntries) {
            if (!sheetUrl || typeof sheetUrl !== 'string') continue;

            const possibleCacheKeys = [
                `nfs_cache_v6_${sheetUrl}_max7`,
                `nfs_cache_v6_${sheetUrl}_max5`,
                `nfs_cache_v6_${sheetUrl}_max20`,
                `nfs_cache_v6_${sheetUrl}`,
                `nfs_cache_${sheetUrl}_max7`,
                `nfs_cache_${sheetUrl}_max5`,
                `nfs_cache_${sheetUrl}_max20`,
                `nfs_cache_${sheetUrl}`
            ];

            let cachedRows = null;
            for (const key of possibleCacheKeys) {
                if (memoryCache[key] && Array.isArray(memoryCache[key].data)) {
                    cachedRows = memoryCache[key].data;
                    break;
                }
            }

            if (cachedRows) {
                const userRow = cachedRows.find(r => r.driver && r.driver.trim().toUpperCase() === driverStats.driver);
                if (userRow) {
                    driverTracks.push({
                        routeName: route.name || "Ruta General",
                        routeType: route.type || "Carrera",
                        category: sheetKey,
                        rank: userRow.rank || "-",
                        time: userRow.time || "--:--.--",
                        car: userRow.car || "Desconocido",
                        gearbox: userRow.gearbox || "M/A",
                        device: userRow.device || "PC",
                        yt: userRow.yt || "#"
                    });
                }
            }
        }
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
            <h3 style="margin-top: 0; color: #ffffff; font-family: var(--font-racing); font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">🔍 Consultar Expediente de Piloto</h3>
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
        resultsEl.innerHTML = `<p style="color: var(--nfs-orange); font-family: var(--font-racing); font-size: 16px;">⏱️ Consultando telemetría oficial...</p>`;

        const profile = await searchDriverProfile(input.value);
        if (!profile) {
            resultsEl.innerHTML = `<p style="color: var(--text-muted); font-size: 14px; padding: 10px 0;">No se encontraron registros activos para ese piloto.</p>`;
            return;
        }

        let tracksHtml = profile.tracks.length > 0 ? profile.tracks.map(t => `
            <tr>
                <td><strong style="color: #ffffff;">${t.routeName}</strong> (${t.routeType})</td>
                <td style="color: var(--nfs-orange); font-family: var(--font-racing); font-size: 16px; font-weight: bold;">#${t.rank}</td>
                <td style="font-family: var(--font-mono); font-weight: 800; color: var(--nfs-orange);">⏱️ ${t.time}</td>
                <td><span class="telemetry-pill">🚗 ${t.car}</span></td>
                <td><span class="telemetry-pill">⚙️ ${t.gearbox}</span></td>
            </tr>
        `).join('') : `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 15px;">Sin detalles de rutas precargadas aún en memoria.</td></tr>`;

        resultsEl.innerHTML = `
            <div style="background: var(--bg-surface-elevated); padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid var(--nfs-orange); box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
                <h2 style="color: #ffffff; font-family: var(--font-racing); font-size: 26px; margin: 0 0 12px 0;">👤 ${profile.driver}</h2>
                <div style="display: flex; gap: 15px; font-weight: bold; flex-wrap: wrap; font-family: var(--font-racing); font-size: 16px;">
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
    let s = String(timeStr).trim().toLowerCase().replace(',', '.');

    // Patrón con texto: 1m 20s 750ms
    const textMatch = s.match(/(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+(?:\.\d+)?)s)?\s*(?:(\d+)ms)?/);
    if (textMatch && (textMatch[1] || textMatch[2] || textMatch[3] || textMatch[4])) {
        const h = parseInt(textMatch[1] || '0', 10);
        const m = parseInt(textMatch[2] || '0', 10);
        const sec = parseFloat(textMatch[3] || '0');
        const ms = parseInt(textMatch[4] || '0', 10);
        const total = (h * 3600 + m * 60 + sec) * 1000 + ms;
        if (total > 0) return Math.round(total);
    }

    // Patrón con dos puntos: [HH:]MM:SS[.mmm] o SS.mmm
    const parts = s.split(':');
    if (parts.length === 3) {
        const h = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const sec = parseFloat(parts[2]);
        if (!isNaN(h) && !isNaN(m) && !isNaN(sec)) {
            return Math.round((h * 3600 + m * 60 + sec) * 1000);
        }
    } else if (parts.length === 2) {
        const m = parseInt(parts[0], 10);
        const sec = parseFloat(parts[1]);
        if (!isNaN(m) && !isNaN(sec)) {
            return Math.round((m * 60 + sec) * 1000);
        }
    } else if (parts.length === 1) {
        const sec = parseFloat(parts[0]);
        if (!isNaN(sec)) {
            return Math.round(sec * 1000);
        }
    }
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
 * Valida en vivo las marcas de inicio, fin y el tiempo declarado.
 * Compara (Fin - Inicio) con el Tiempo Declarado y actualiza la UI.
 */
function validateTimeMarksLive() {
    const startInput = document.getElementById('sub-start-mark');
    const endInput = document.getElementById('sub-end-mark');
    const declaredInput = document.getElementById('sub-time');

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
async function handleTimeSubmit(event) {
    event.preventDefault();

    const btn = document.getElementById('btn-submit-time');
    const status = document.getElementById('submit-status');

    const driver = document.getElementById('sub-driver').value.trim();
    const route = document.getElementById('sub-route').value.trim();
    const car = document.getElementById('sub-car').value.trim();
    const modeEl = document.querySelector('input[name="sub-mode"]:checked');
    const mode = modeEl ? modeEl.value : 'Online';

    const video = document.getElementById('sub-video').value.trim();
    const startMark = document.getElementById('sub-start-mark').value.trim();
    const endMark = document.getElementById('sub-end-mark').value.trim();
    const timeDeclared = document.getElementById('sub-time').value.trim();

    const gearbox = document.getElementById('sub-gearbox') ? document.getElementById('sub-gearbox').value : 'Manual';
    const device = document.getElementById('sub-device') ? document.getElementById('sub-device').value : 'Teclado';

    // Parseo milimétrico de tiempos
    const startMs = parseTimeToMs(startMark);
    const endMs = parseTimeToMs(endMark);
    const declaredMs = parseTimeToMs(timeDeclared);

    // Validar existencia de formatos válidos
    if (startMs === null) {
        status.style.color = "var(--f1-red)";
        status.innerText = "❌ Formato inválido en la Marca de Inicio. Usa MM:SS.mmm (ej: 00:15.200).";
        document.getElementById('sub-start-mark').focus();
        return false;
    }

    if (endMs === null) {
        status.style.color = "var(--f1-red)";
        status.innerText = "❌ Formato inválido en la Marca de Fin. Usa MM:SS.mmm (ej: 01:35.950).";
        document.getElementById('sub-end-mark').focus();
        return false;
    }

    if (declaredMs === null) {
        status.style.color = "var(--f1-red)";
        status.innerText = "❌ Formato inválido en el Tiempo Declarado. Usa MM:SS.mmm (ej: 01:20.750).";
        document.getElementById('sub-time').focus();
        return false;
    }

    if (endMs <= startMs) {
        status.style.color = "var(--f1-red)";
        status.innerText = "❌ La Marca de Fin debe ser posterior a la Marca de Inicio.";
        document.getElementById('sub-end-mark').focus();
        return false;
    }

    // VALIDACIÓN ESTRICTA: EL TIEMPO DECLARADO DEBE COINCIDIR CON LA DIFERENCIA (Fin - Inicio)
    const diffMs = endMs - startMs;
    const discrepancyMs = Math.abs(diffMs - declaredMs);
    const toleranceMs = 50; // 50ms de tolerancia por redondeo de frames de video

    if (discrepancyMs > toleranceMs) {
        status.style.color = "var(--f1-red)";
        const diffSec = (discrepancyMs / 1000).toFixed(3);
        status.innerText = `❌ VALIDACIÓN RECHAZADA: El tiempo declarado (${formatMsToTime(declaredMs)}) no coincide con la diferencia calculada de las marcas de video (${formatMsToTime(diffMs)}). Desfase detectado: ${diffSec}s. Los valores deben coincidir para homologar el tiempo.`;

        const box = document.getElementById('telemetry-comparison-panel');
        if (box) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        validateTimeMarksLive();
        return false;
    }

    // Validación de URL de YouTube
    if (!video.includes('youtube.com') && !video.includes('youtu.be')) {
        status.style.color = "var(--f1-red)";
        status.innerText = "❌ Por favor introduce un enlace válido de YouTube (ej: https://www.youtube.com/watch?v=... o https://youtu.be/...).";
        document.getElementById('sub-video').focus();
        return false;
    }

    btn.disabled = true;
    btn.innerHTML = "<span>⏳</span> Homologando y Enviando Registro...";
    status.style.color = "var(--nfs-orange)";
    status.innerText = "Validación aprobada. Procesando envío a la red oficial...";

    const gasPayload = {
        driver: driver,
        car: car,
        route: route,
        mode: mode,
        declaredTime: formatMsToTime(declaredMs),
        videoUrl: video,
        startMark: formatMsToTime(startMs),
        endMark: formatMsToTime(endMs),
        gearbox: gearbox,
        device: device
    };

    const discordPayload = {
        embeds: [{
            title: "🏎️ ¡NUEVO TIEMPO HOMOLOGADO!",
            color: 16742144, // #ff7700
            description: `**Verificación de Telemetría:** Tiempo declarado validado exitosamente contra las marcas de video.`,
            fields: [
                { name: "👤 Piloto", value: driver, inline: true },
                { name: "🚗 Auto", value: car, inline: true },
                { name: "🏁 Pista", value: route, inline: true },
                { name: "🌐 Modalidad", value: mode, inline: true },
                { name: "⏱️ Tiempo Declarado", value: formatMsToTime(declaredMs), inline: true },
                { name: "📐 Marcas Video", value: `${formatMsToTime(startMs)} → ${formatMsToTime(endMs)} (Δ: ${formatMsToTime(diffMs)})`, inline: true },
                { name: "⚙️ Transmisión", value: gearbox, inline: true },
                { name: "🎮 Control", value: device, inline: true },
                { name: "🎬 Video YouTube", value: `[Ver en YouTube](${video})`, inline: false }
            ],
            footer: { text: "NFS Most Wanted Official Leaderboards • Homologación de Telemetría" },
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const dispatchTasks = [];

        // 1. Envío al conector de Google Apps Script (Google Sheets & Firebase)
        if (typeof GOOGLE_APPS_SCRIPT_WEBAPP_URL !== 'undefined' &&
            GOOGLE_APPS_SCRIPT_WEBAPP_URL &&
            GOOGLE_APPS_SCRIPT_WEBAPP_URL !== "URL_DE_TU_GOOGLE_APPS_SCRIPT_WEBAPP_AQUI") {
            dispatchTasks.push(
                fetch(GOOGLE_APPS_SCRIPT_WEBAPP_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Permite envío cross-origin a Google Apps Script Web App
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(gasPayload)
                }).then(() => {
                    console.info("Registro despachado a Google Apps Script Connector.");
                }).catch(err => {
                    console.warn("Aviso al enviar a Google Apps Script:", err);
                })
            );
        }

        // 2. Envío al Webhook de Discord
        if (typeof DISCORD_WEBHOOK_URL !== 'undefined' &&
            DISCORD_WEBHOOK_URL &&
            DISCORD_WEBHOOK_URL !== "URL_DE_TU_WEBHOOK_DE_DISCORD_AQUI") {
            dispatchTasks.push(
                fetch(DISCORD_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(discordPayload)
                }).catch(err => {
                    console.warn("Aviso al enviar a Discord Webhook:", err);
                })
            );
        }

        if (dispatchTasks.length > 0) {
            await Promise.allSettled(dispatchTasks);
        }

        status.style.color = "var(--green-neon)";
        status.innerHTML = `✅ <strong>¡REGISTRO VALIDADO Y ENVIADO CON ÉXITO!</strong><br>El tiempo declarado (<code>${formatMsToTime(declaredMs)}</code>) coincide exactamente con la diferencia de marcas (<code>${formatMsToTime(diffMs)}</code>). El registro ha sido enviado a la hoja de telemetría de Google Sheets y a la cola de homologación para Firebase Realtime Database.`;
        document.getElementById('form-submit-time').reset();
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

// =======================================================
// SISTEMA DE DESAFÍOS SEMANALES (Inspirado en NightRiderz World)
// =======================================================
let currentChallengeYear = 2026;
let currentChallengeWeek = 38;
let challengeActiveFilter = 'all';

function getISOWeek(date) {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}

function getWeekDateRangeString(year, week) {
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dayOfWeek = simple.getDay();
    const ISOweekStart = new Date(simple);
    if (dayOfWeek <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());

    const ISOweekEnd = new Date(ISOweekStart);
    ISOweekEnd.setDate(ISOweekStart.getDate() + 6);

    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `Semana ${week} · del ${ISOweekStart.getDate()} de ${months[ISOweekStart.getMonth()]} al ${ISOweekEnd.getDate()} de ${months[ISOweekEnd.getMonth()]} de ${year}`;
}

function createSeededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
        return (s = s * 16807 % 2147483647) / 2147483647;
    };
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

function startChallengeSubmission(routeName, carName) {
    switchView('submit');
    const routeInput = document.getElementById('sub-route');
    const carInput = document.getElementById('sub-car');
    if (routeInput) routeInput.value = routeName;
    if (carInput) {
        const cleanCar = carName.replace('Solo ', '').replace(' (Sin Nitro)', '').trim();
        carInput.value = cleanCar !== 'Cualquier Auto' ? cleanCar : 'BMW M3 GTR';
    }
    const form = document.getElementById('form-submit-time');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

function generateWeeklyChallenges(year, week) {
    const rng = createSeededRandom(year * 100 + week);
    const sourceRoutes = typeof routesData !== 'undefined' ? routesData : [];
    if (sourceRoutes.length === 0) return [];

    const shuffledRoutes = [...sourceRoutes].sort(() => rng() - 0.5);

    const difficultyConfig = [
        { diff: 'Muy Fácil', class: 'diff-very-easy', multiplier: 1.15, reward: '500 SB', cash: '$100.000' },
        { diff: 'Muy Fácil', class: 'diff-very-easy', multiplier: 1.12, reward: '500 SB', cash: '$150.000' },
        { diff: 'Fácil', class: 'diff-easy', multiplier: 1.08, reward: '1.000 SB', cash: '$250.000' },
        { diff: 'Fácil', class: 'diff-easy', multiplier: 1.05, reward: '1.000 SB', cash: '$300.000' },
        { diff: 'Medio', class: 'diff-medium', multiplier: 1.02, reward: '2.000 SB', cash: '$500.000' },
        { diff: 'Medio', class: 'diff-medium', multiplier: 0.99, reward: '2.000 SB', cash: '$600.000' },
        { diff: 'Duro', class: 'diff-hard', multiplier: 0.96, reward: '2.500 SB', cash: '$750.000' },
        { diff: 'Extremo', class: 'diff-extreme', multiplier: 0.93, reward: '3.500 SB', cash: '$1.000.000' }
    ];

    const carRestrictions = [
        "Solo BMW M3 GTR (Sin Nitro)",
        "Porsche Carrera GT",
        "Porsche Cayman S",
        "Chevrolet Corvette C6.R",
        "Ford GT",
        "Cualquier Auto (Junkman)",
        "Subaru Impreza WRX",
        "Mitsubishi Lancer Evo VIII"
    ];

    const modeLabels = {
        'Circuito': 'MODO CONTRARRELOJ // SINGLE LAP',
        'Sprint': 'SPRINT TELEMETRÍA // FULL ROUTE',
        'Drag': 'DRAG TIME ATTACK // PURA POTENCIA'
    };

    const challenges = [];
    const count = Math.min(8, shuffledRoutes.length);

    for (let i = 0; i < count; i++) {
        const route = shuffledRoutes[i];
        const diff = difficultyConfig[i] || difficultyConfig[0];
        const car = carRestrictions[Math.floor(rng() * carRestrictions.length)];
        const completedCount = Math.floor(rng() * 250) + 45;

        let baseSeconds = 90;
        if (route.type === 'Sprint') baseSeconds = 125;
        if (route.type === 'Drag') baseSeconds = 30;

        baseSeconds = Math.round((baseSeconds + (route.name.length * 2) % 30) * diff.multiplier);
        const mins = Math.floor(baseSeconds / 60);
        const secs = baseSeconds % 60;
        const millis = Math.floor(rng() * 900) + 100;
        const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${millis}`;

        challenges.push({
            id: `${year}-w${week}-ch${i}`,
            index: i + 1,
            route: route,
            difficulty: diff.diff,
            diffClass: diff.class,
            carRestriction: car,
            targetTime: formattedTime,
            reward: diff.reward,
            cashReward: diff.cash,
            communityCount: completedCount,
            modeLabel: modeLabels[route.type] || 'MODO CONTRARRELOJ'
        });
    }

    return challenges;
}

function renderChallengesUI() {
    const gridContainer = document.getElementById('challenges-grid');
    if (!gridContainer) return;

    const challenges = generateWeeklyChallenges(currentChallengeYear, currentChallengeWeek);
    const completedList = getCompletedChallenges();

    const dateRangeEl = document.getElementById('challenge-week-daterange');
    const weekLabelEl = document.getElementById('challenge-week-label');
    const totalCountEl = document.getElementById('challenge-total-count');
    const pendingCountEl = document.getElementById('challenge-pending-count');
    const completedCountEl = document.getElementById('challenge-completed-count');

    const total = challenges.length;
    const completedCount = challenges.filter(c => completedList.includes(c.id)).length;
    const pendingCount = total - completedCount;

    if (dateRangeEl) dateRangeEl.textContent = getWeekDateRangeString(currentChallengeYear, currentChallengeWeek);
    if (weekLabelEl) weekLabelEl.textContent = `Semana ${currentChallengeWeek}, ${currentChallengeYear}`;
    if (totalCountEl) totalCountEl.textContent = total;
    if (pendingCountEl) pendingCountEl.textContent = pendingCount;
    if (completedCountEl) completedCountEl.textContent = completedCount;

    const pillAll = document.getElementById('count-pill-all');
    const pillTodo = document.getElementById('count-pill-todo');
    const pillComp = document.getElementById('count-pill-completed');
    if (pillAll) pillAll.textContent = total;
    if (pillTodo) pillTodo.textContent = pendingCount;
    if (pillComp) pillComp.textContent = completedCount;

    const filtered = challenges.filter(c => {
        const isDone = completedList.includes(c.id);
        if (challengeActiveFilter === 'todo') return !isDone;
        if (challengeActiveFilter === 'completed') return isDone;
        return true;
    });

    if (filtered.length === 0) {
        gridContainer.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 40px; font-family: var(--font-racing); font-size: 18px;">No hay desafíos en esta categoría para la semana seleccionada.</p>`;
        return;
    }

    const thumbImages = [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80'
    ];

    let html = '';
    filtered.forEach((ch, idx) => {
        const isDone = completedList.includes(ch.id);
        const thumbUrl = thumbImages[idx % thumbImages.length];

        html += `
            <div class="challenge-card ${isDone ? 'is-completed' : ''}">
                <div>
                    <!-- Miniatura con badges -->
                    <div class="challenge-thumb" style="background-image: url('${thumbUrl}');">
                        <div class="challenge-thumb-header">
                            <span class="difficulty-badge ${ch.diffClass}">${ch.difficulty}</span>
                            <span class="challenge-tier-pill">🏁 ${ch.route.type}</span>
                        </div>
                    </div>

                    <!-- Estadísticas de corredores -->
                    <div class="challenge-community-row">
                        <span>👥</span>
                        <span>${ch.communityCount} corredores completaron</span>
                    </div>

                    <!-- Datos del desafío -->
                    <div class="challenge-body">
                        <div>
                            <span class="challenge-mode-label">${ch.modeLabel}</span>
                            <h3 class="challenge-route-name" title="${ch.route.name}">${ch.route.name}</h3>
                        </div>

                        <!-- Tiempo objetivo -->
                        <div class="challenge-time-box">
                            <span style="font-size: 18px;">⏱️</span>
                            <div>
                                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">TIEMPO OBJETIVO</div>
                                <div class="challenge-time-val" style="color: var(--nfs-orange); text-shadow: var(--nfs-subtle-glow);">
                                    - ${ch.targetTime}
                                </div>
                            </div>
                        </div>

                        <!-- Restricciones -->
                        <div class="challenge-restriction">
                            <span style="color: var(--nfs-orange);">🚗</span>
                            <span>${ch.carRestriction}</span>
                        </div>

                        <!-- Recompensa -->
                        <div class="challenge-reward-bar">
                            <span>⭐</span>
                            <span>RECOMPENSA: ${ch.reward} // ${ch.cashReward}</span>
                        </div>
                    </div>
                </div>

                <!-- Acciones -->
                <div class="challenge-actions-row">
                    <button class="btn-toggle-complete ${isDone ? 'completed' : 'incomplete'}" onclick="toggleChallengeComplete('${ch.id}')">
                        ${isDone ? '✅ COMPLETADO' : '❌ NO COMPLETADO'}
                    </button>
                    
                    <button class="btn-challenge-submit" onclick="startChallengeSubmission('${ch.route.name}', '${ch.carRestriction}')">
                        🚀 Enviar Registro a Moderación
                    </button>
                </div>
            </div>
        `;
    });

    gridContainer.innerHTML = html;
}

function changeChallengeWeek(delta) {
    currentChallengeWeek += delta;
    if (currentChallengeWeek > 52) {
        currentChallengeWeek = 1;
        currentChallengeYear++;
    } else if (currentChallengeWeek < 1) {
        currentChallengeWeek = 52;
        currentChallengeYear--;
    }
    renderChallengesUI();
}

function resetToCurrentWeek() {
    const today = new Date();
    currentChallengeYear = today.getFullYear();
    currentChallengeWeek = getISOWeek(today);
    renderChallengesUI();
}

function setChallengeFilter(filter, btn) {
    document.querySelectorAll('.challenge-filter-pills .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    challengeActiveFilter = filter;
    renderChallengesUI();
}

function initChallengesSystem() {
    const today = new Date();
    currentChallengeYear = today.getFullYear();
    currentChallengeWeek = getISOWeek(today);
    renderChallengesUI();
}

// =======================================================
// BLACKLIST EVENT // CAMPEONATO 2026 (4 SEMANAS • 5 GRUPOS • 8 DESAFÍOS)
// =======================================================

const BLACKLIST_STORAGE_KEY = 'nfs_blacklist_championship_2026_v2';
let blacklistDrivers = [];
let currentSelectedBlacklistRank = 1;
let currentChampionshipWeek = 1;

function loadBlacklistData() {
    try {
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
        champWeekEl.textContent = `Semana ${weekNumber} de 4 (4 Desafíos)`;
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

            pilotsHtml += `
                <div class="champ-group-pilot-item ${isSelected ? 'selected' : ''}" onclick="selectBlacklistPilot(${driver.rank})">
                    <div class="pilot-item-left">
                        <span class="bl-rank-badge ${driver.rank === 1 ? 'rank-gold' : driver.rank === 2 ? 'rank-silver' : driver.rank === 3 ? 'rank-bronze' : 'rank-normal'}" style="min-width: 28px; height: 28px; font-size: 13px;">${driver.rank}</span>
                        <div>
                            <div class="pilot-item-name">${driver.name} <span style="color: var(--nfs-orange);">"${driver.alias}"</span></div>
                            <div class="pilot-item-car">${driver.ride}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div class="pilot-item-pts">${pts.toLocaleString()} PTS</div>
                        <div style="font-family: var(--font-mono); font-size: 11px; color: var(--green-neon);">$${(driver.rep || 0).toLocaleString()}</div>
                    </div>
                </div>
            `;
        });

        groupCard.innerHTML = `
            <div class="champ-group-header">
                <span class="champ-group-name">${grp.name}</span>
                <span class="champ-group-tag">${grp.tag || 'TRÍO OFICIAL'}</span>
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

            top3Html += `
                <div class="champ-ch-podium-row ${rowClass}">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="badge-bonus ${bonusClass}">${t.badge}</span>
                        <div>
                            <span style="font-weight: 700; color: #ffffff;">${t.pilot}</span>
                            <span style="color: var(--text-muted); font-size: 11px; margin-left: 4px;">(${t.car})</span>
                        </div>
                    </div>
                    <span style="font-family: var(--font-mono); font-weight: 700; color: var(--cyan-electric);">${t.time}</span>
                </div>
            `;
        });

        card.innerHTML = `
            <div class="champ-ch-header">
                <span class="champ-ch-title">#0${idx + 1} ${ch.route}</span>
                <span class="champ-ch-type">${ch.type.toUpperCase()}</span>
            </div>
            <div class="champ-ch-podiums">
                ${top3Html}
            </div>
        `;

        container.appendChild(card);
    });
}

function renderBlacklistUI() {
    const tbody = document.getElementById('tbody-blacklist-roster');
    if (!tbody) return;

    // Ordenar de arriba a abajo por rango (1 al 15)
    blacklistDrivers.sort((a, b) => a.rank - b.rank);

    // Actualizar barra de resumen
    const leader = blacklistDrivers[0] || { name: 'Razor', alias: 'Razor', ride: 'BMW M3 GTR' };
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

    blacklistDrivers.forEach(driver => {
        const tr = document.createElement('tr');
        tr.className = `blacklist-row ${driver.rank === currentSelectedBlacklistRank ? 'active-row' : ''}`;
        tr.onclick = () => selectBlacklistPilot(driver.rank);

        let rankBadgeClass = 'rank-normal';
        if (driver.rank === 1) rankBadgeClass = 'rank-gold';
        else if (driver.rank === 2) rankBadgeClass = 'rank-silver';
        else if (driver.rank === 3) rankBadgeClass = 'rank-bronze';

        let statusClass = 'status-active';
        if (driver.rank === 1) statusClass = 'status-leader';
        else if (driver.rank <= 3) statusClass = 'status-contender';

        const totalPts = calculateDriverPoints(driver);
        const groupName = getDriverGroupForWeek(driver.rank, currentChampionshipWeek);
        const bt = driver.bestTimes || { first: 0, second: 0, third: 0 };

        tr.innerHTML = `
            <td>
                <span class="bl-rank-badge ${rankBadgeClass}">${driver.rank}</span>
            </td>
            <td>
                <div class="driver-cell-flex">
                    <span class="driver-cell-name">${driver.name}</span>
                    <span class="driver-cell-alias">"${driver.alias}"</span>
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
                <span class="status-badge ${statusClass}">${driver.status || 'ACTIVO'}</span>
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
    const driver = blacklistDrivers.find(d => d.rank === currentSelectedBlacklistRank) || blacklistDrivers[0];
    if (!driver) return;

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

    if (numEl) numEl.textContent = `blacklist ${driver.rank}`;
    if (nameEl) nameEl.textContent = `${driver.name} ${driver.alias}`;
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

    // Ordenar explícitamente en orden del 1 al 15
    const sorted = [...blacklistDrivers].sort((a, b) => a.rank - b.rank);

    container.innerHTML = '';

    sorted.forEach(driver => {
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
                <div class="blacklist-number-title">blacklist ${driver.rank}</div>
                <div class="blacklist-driver-fullname">${driver.name} "${driver.alias}"</div>
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
                <button class="btn-explored" style="width: 100%; justify-content: center; font-size: 13px;" onclick="switchView('championship-standings')">
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
    const sorted = [...blacklistDrivers].sort((a, b) => a.rank - b.rank);
    sorted.forEach(d => {
        const btn = document.createElement('button');
        btn.className = 'jump-pill';
        btn.onclick = () => scrollToPilotCard(d.rank);

        let icon = '';
        if (d.rank === 1) icon = '👑 ';
        else if (d.rank === 2) icon = '🥈 ';
        else if (d.rank === 3) icon = '🥉 ';

        btn.textContent = `${icon}#${d.rank} ${d.alias || d.name}`;
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
        } else if (idx >= 15) {
            // Expansión dinámica para pilotos inscritos adicionales (16, 18, 20 o más)
            const rankNum = idx + 1;
            const baseRep = Math.max(850000 - ((idx - 14) * 35000), 200000);
            const newPilot = {
                rank: rankNum,
                name: p.name,
                alias: p.alias || p.name,
                ride: p.ride,
                strength: `${p.ride} • ${p.schedule || 'Parrilla Extendida'}`,
                rep: baseRep,
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
                <span style="font-size: 32px; display: block; margin-bottom: 8px;">🏁</span>
                <strong>Aún no hay pilotos inscritos.</strong><br>
                Completa el formulario oficial para reclamar la plaza #1 del Campeonato Blacklist 2026.
            </div>
        `;
        return;
    }

    listContainer.innerHTML = '';
    registeredParticipants.forEach((pilot, idx) => {
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
                        <strong style="color: #ffffff; font-size: 15px;">${p.name}</strong>
                        ${p.finalPos.includes('Campeón') ? '<span class="crown-badge">👑 1°</span>' : ''}
                    </div>
                </td>
                <td>
                    <span class="past-final-pos ${posClass}">${p.finalPos}</span>
                </td>
                <td style="color: var(--text-muted); font-size: 13px;">
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
                    cdContainer.innerHTML = `<div style="color: var(--green-neon); font-family: var(--font-racing); font-size: 16px; font-weight: 800; text-align: center; width: 100%; padding: 6px 0; text-shadow: 0 0 10px rgba(0,255,136,0.6);">🏁 ¡EVENTO EN CURSO!</div>`;
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
        const sampleSheet = routesData[0].sheets ? (routesData[0].sheets.junkmanSingle || Object.values(routesData[0].sheets)[0]) : "";
        if (!sampleSheet) return;

        const rows = await fetchGoogleSheetData(sampleSheet, 8);
        if (Array.isArray(rows) && rows.length > 0) {
            const validRows = rows.filter(r => r.rank && r.driver && r.time).slice(0, 5);
            if (validRows.length >= 3) {
                let html = "";
                validRows.forEach((rec, idx) => {
                    const rankNum = idx + 1;
                    const rankClass = rankNum === 1 ? 'live-lb-rank-1' : (rankNum === 2 ? 'live-lb-rank-2' : (rankNum === 3 ? 'live-lb-rank-3' : 'live-lb-rank-other'));
                    html += `
                        <div class="live-lb-item" onclick="navigateFromLiveLeaderboard('${routesData[0].name}', '${routesData[0].type}')" title="Ver Leaderboard oficial de ${routesData[0].name}">
                            <div class="live-lb-left">
                                <span class="live-lb-rank-num ${rankClass}">${rankNum}</span>
                                <div class="live-lb-info">
                                    <div class="live-lb-driver">${rec.driver}</div>
                                    <div class="live-lb-track">📍 ${routesData[0].name} (${routesData[0].type})</div>
                                </div>
                            </div>
                            <div class="live-lb-right">
                                <div class="live-lb-time">${rec.time}</div>
                                <div class="live-lb-car">${rec.car || 'Carrera GT'}</div>
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
// INICIALIZACIÓN UNIFICADA (DOMContentLoaded)
// =======================================================
window.addEventListener('DOMContentLoaded', () => {
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

    // 8. Ejecución diferida en segundo plano para tablas globales y Hall of Fame
    setTimeout(() => {
        generateHallOfFame();
        generateGlobalLeaderboards();
    }, 150);
});

