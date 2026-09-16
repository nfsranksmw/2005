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
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });

    const targetSection = document.getElementById('view-' + viewId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    const targetNavLink = document.getElementById('nav-' + viewId);
    if (targetNavLink) {
        targetNavLink.classList.add('active');
    }

    const mainNav = document.getElementById('main-nav');
    if (mainNav) {
        mainNav.classList.remove('open');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

        if (route.type === "Circuito") {
            iconHtml = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--cyan-electric);">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.23-5.23"></path>
            </svg>`;
        } else if (route.type === "Sprint") {
            iconHtml = `<span style="font-size: 22px; color: var(--nfs-orange);">⚡</span>`;
        } else if (route.type === "Drag") {
            iconHtml = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style="color: var(--nfs-orange);">
                <path d="M9 2h6v2H9V2zm1 3h4v2h-4V5zm-2 3h8v2H8V8zm1 3h6v2H9v-2zm-2 3h10v2H7v-2zm2 3h6v2H9v-2zm-3 3h12v2H6v-2z"/>
            </svg>`;
        } else {
            iconHtml = `<span style="font-size: 22px; color: var(--cyan-electric);">🔄</span>`;
        }

        const card = document.createElement('div');
        card.className = 'route-card';
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
                <div class="route-badge-letter">${letterBadge}</div>
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
// CARGA Y RENDERIZADO DE TABLAS INDIVIDUALES (LEADERBOARDS)
// =======================================================
async function loadLeaderboardForRoute(route) {
    const circuitTabs = document.getElementById('container-tabs-circuit');
    const sprintDragTabs = document.getElementById('container-tabs-sprintdrag');

    document.querySelectorAll('.circuit-section, .sprintdrag-section').forEach(sec => sec.classList.remove('active'));

    if (route.type === "Circuito") {
        if (circuitTabs) circuitTabs.classList.add('active-group');
        if (sprintDragTabs) sprintDragTabs.classList.remove('active-group');
        switchCircuitTab('junkman-single', circuitTabs.querySelector('.tab-btn'));

        const [d1, d2, d3, d4] = await Promise.all([
            fetchGoogleSheetData(route.sheets.junkmanSingle),
            fetchGoogleSheetData(route.sheets.junkmanFast),
            fetchGoogleSheetData(route.sheets.bmwSingle),
            fetchGoogleSheetData(route.sheets.bmwFast)
        ]);

        renderTableRows('tbody-junkman-single', d1);
        renderTableRows('tbody-junkman-fast', d2);
        renderTableRows('tbody-bmw-single', d3);
        renderTableRows('tbody-bmw-fast', d4);
    } else {
        if (circuitTabs) circuitTabs.classList.remove('active-group');
        if (sprintDragTabs) sprintDragTabs.classList.add('active-group');
        switchSprintDragTab('sprintdrag-junkman', sprintDragTabs.querySelector('.tab-btn'));

        const [dJunkman, dBmw] = await Promise.all([
            fetchGoogleSheetData(route.sheets.junkman),
            fetchGoogleSheetData(route.sheets.bmw)
        ]);

        renderTableRows('tbody-sprintdrag-junkman', dJunkman);
        renderTableRows('tbody-sprintdrag-bmw', dBmw);
    }
}

function renderTableRows(tbodyId, dataRows) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (!dataRows || dataRows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 20px; font-family: var(--font-racing); font-size: 16px;">Sin registros oficiales para esta categoría aún.</td></tr>`;
        return;
    }

    dataRows.forEach(row => {
        const tr = document.createElement('tr');
        const rankNum = parseInt(String(row.rank).replace(/[^0-9]/g, ''), 10);
        let posClass = rankNum === 1 ? "rank-1" : (rankNum === 2 ? "rank-2" : (rankNum === 3 ? "rank-3" : ""));
        
        let videoBtnHTML = (row.yt && row.yt !== "#" && row.yt.startsWith("http")) 
            ? `<a href="${row.yt}" target="_blank" rel="noopener noreferrer" class="btn-youtube">▶ Video</a>` 
            : `<span style="color: var(--text-dimmed); font-size: 12px;">Sin video</span>`;

        tr.innerHTML = `
            <td class="${posClass}">${row.rank}</td>
            <td><strong style="color: #ffffff; font-size: 15px;">${row.driver}</strong></td>
            <td style="color: var(--nfs-orange); font-family: var(--font-mono); font-weight: 800; font-size: 15px; text-shadow: var(--nfs-subtle-glow);">${row.time}</td>
            <td><span class="telemetry-pill">🎮 ${row.device}</span></td>
            <td><span class="telemetry-pill" style="color: #ffffff; font-weight: 600;">🚗 ${row.car}</span></td>
            <td><span class="telemetry-pill">⚙️ ${row.gearbox}</span></td>
            <td style="color: var(--text-muted); font-size: 13px;">${row.date}</td>
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
// ENVÍO DE TIEMPOS VÍA WEBHOOK A DISCORD
// =======================================================
async function handleTimeSubmit(event) {
    event.preventDefault();

    const btn = document.getElementById('btn-submit-time');
    const status = document.getElementById('submit-status');

    const driver = document.getElementById('sub-driver').value.trim();
    const route = document.getElementById('sub-route').value.trim();
    const time = document.getElementById('sub-time').value.trim();
    const car = document.getElementById('sub-car').value.trim();
    const gearbox = document.getElementById('sub-gearbox').value;
    const device = document.getElementById('sub-device').value;
    const video = document.getElementById('sub-video').value.trim();

    btn.disabled = true;
    btn.innerText = "⏳ Enviando a Telemetría...";
    status.style.color = "var(--nfs-orange)";
    status.innerText = "Procesando envío de registro...";

    const discordPayload = {
        embeds: [{
            title: "🏎️ ¡NUEVO TIEMPO REGISTRADO!",
            color: 16742144, // #ff7700
            fields: [
                { name: "👤 Piloto", value: driver, inline: true },
                { name: "🏁 Ruta", value: route, inline: true },
                { name: "⏱️ Tiempo", value: time, inline: true },
                { name: "🚗 Auto", value: car, inline: true },
                { name: "⚙️ Transmisión", value: gearbox, inline: true },
                { name: "🎮 Control", value: device, inline: true },
                { name: "🎬 Prueba de Video", value: `[Ver Video](${video})`, inline: false }
            ],
            footer: { text: "NFS Most Wanted Official Leaderboards" },
            timestamp: new Date().toISOString()
        }]
    };

    try {
        if (DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL !== "URL_DE_TU_WEBHOOK_DE_DISCORD_AQUI") {
            await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordPayload)
            });
        }

        status.style.color = "var(--green-neon)";
        status.innerText = "¡Enviado con éxito! Los moderadores verificarán tu tiempo y video.";
        document.getElementById('form-submit-time').reset();
    } catch (error) {
        console.error("Error enviando tiempo:", error);
        status.style.color = "var(--f1-red)";
        status.innerText = "Error de conexión. Inténtalo de nuevo más tarde.";
    } finally {
        btn.disabled = false;
        btn.innerText = "🚀 Enviar Registro a Revisión";
    }
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

    // 3. Renderizado del Buscador Oficial de Pilotos
    renderDriverSearchUI('search-driver-wrapper');

    // 4. Ejecución diferida en segundo plano para tablas globales y Hall of Fame
    setTimeout(() => {
        generateHallOfFame();
        generateGlobalLeaderboards();
    }, 150);
});
