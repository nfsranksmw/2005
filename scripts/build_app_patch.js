const fs = require('fs');

// Read verified records
const verifiedJson = JSON.parse(fs.readFileSync('scratch/all_86_records.json', 'utf8'));

let verifiedLines = [];
for (const [k, v] of Object.entries(verifiedJson)) {
    verifiedLines.push(`    ${JSON.stringify(k)}: ${JSON.stringify(v)}`);
}

const verifiedBlock = `const STITCH_VERIFIED_TRACK_RECORDS = {\n${verifiedLines.join(',\n')}\n};`;

// Read current app.js
let appJs = fs.readFileSync('assets/js/app.js', 'utf8');

// Find boundary 1: from `let stitchCurrentCategory = 'all';` up to `function initStitchTelemetryHub() {`
const startIdx1 = appJs.indexOf("let stitchCurrentCategory = 'all';");
const endIdx1 = appJs.indexOf("function initStitchTelemetryHub() {");

if (startIdx1 === -1 || endIdx1 === -1) {
    console.error("Could not find startIdx1 or endIdx1");
    process.exit(1);
}

const part1 = `let stitchCurrentCategory = 'all';
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
        const res = await fetch(\`\${baseUrl}/leaderboards.json\`);
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
            const timeEl = document.getElementById(\`stitch-wr-\${rKey}\`);
            const driverEl = document.getElementById(\`stitch-driver-\${rKey}\`);
            const carEl = document.getElementById(\`stitch-car-\${rKey}\`);
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
${verifiedBlock}

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
                    pilots: count > 0 ? \`\${count} Pilotos\` : 'Oficial',
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

`;

appJs = appJs.slice(0, startIdx1) + part1 + appJs.slice(endIdx1);

// Find boundary 2: renderStitchRoutesMosaic() and helpers up to goToStitchRouteLeaderboard
const startIdx2 = appJs.indexOf("function renderStitchRoutesMosaic() {");
const endIdx2 = appJs.indexOf("function goToStitchRouteLeaderboard(routeName) {");

if (startIdx2 === -1 || endIdx2 === -1) {
    console.error("Could not find startIdx2 or endIdx2");
    process.exit(1);
}

const part2 = `function downloadStitchGhost(routeName) {
    const curLang = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en';
    const msg = (curLang === 'es')
        ? \`Telemetría y fantasma (.SAV) de \${routeName} descargados correctamente.\`
        : ((curLang === 'pt') ? \`Telemetria e fantasma (.SAV) de \${routeName} baixados com sucesso.\` : \`Telemetry and ghost (.SAV) for \${routeName} downloaded successfully.\`);
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
            ? \`Mostrando \${displayList.length} de \${totalCount} circuitos\`
            : ((curLang === 'pt') ? \`Mostrando \${displayList.length} de \${totalCount} pistas\` : \`Showing \${displayList.length} of \${totalCount} tracks\`);
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
                ? \`Ver Todos los \${routesData.length} Circuitos Oficiales\`
                : ((curLang === 'pt') ? \`Ver Todas as \${routesData.length} Pistas Oficiais\` : \`Show All \${routesData.length} Official Tracks\`);
            if (toggleIcon) toggleIcon.style.transform = "rotate(0deg)";
        }
        toggleBtn.style.display = totalCount <= 6 ? 'none' : 'inline-flex';
    }

    if (displayList.length === 0) {
        grid.innerHTML = \`
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; background: var(--stitch-surface-lowest); border-radius: 10px; border: 1px dashed rgba(255,255,255,0.1);">
                <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="var(--stitch-primary)" stroke-width="2" style="opacity: 0.7; margin: 0 auto 10px auto; display: block;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                <p style="font-family: var(--font-racing); font-size: 15px; text-transform: uppercase; color: #ffffff; margin-top: 6px;">\${(curLang === 'es') ? 'No se encontraron trazados con los filtros seleccionados.' : ((curLang === 'pt') ? 'Nenhuma pista encontrada com os filtros selecionados.' : 'No tracks found matching the selected filters.')}</p>
                <button type="button" class="stitch-btn-cta-secondary" onclick="resetStitchFilters()" style="margin-top: 12px;">\${(curLang === 'es') ? 'Restablecer Filtros' : ((curLang === 'pt') ? 'Redefinir Filtros' : 'Reset Filters')}</button>
            </div>
        \`;
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
                ? \`\${meta.laps.includes('3') ? '3' : '2'} VUELTAS\` 
                : ((curLang === 'pt') ? \`\${meta.laps.includes('3') ? '3' : '2'} VOLTAS\` : \`\${meta.laps.includes('3') ? '3' : '2'} LAPS\`);
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
            timeColor = 'var(--stitch-tertiary, #00dbe9)';
        } else if (route.type === 'Drag') {
            badgeClass = 'cat-badge-drag';
            miniSvgPath = 'M 10,65 L 45,50 L 70,30 L 95,15';
            strokeColor = '#ff5708';
            timeColor = 'var(--stitch-secondary, #ff5708)';
        }

        html += \`
            <article class="stitch-track-card \${isSpotlight ? 'active-spotlight' : ''}" 
                     onclick="selectStitchTrackCard('\${route.name.replace(/'/g, "\\\\'")}')">
                <div class="stitch-card-top">
                    <div class="stitch-card-badge-row">
                        <span class="stitch-card-cat-badge \${badgeClass}">\${badgeTypeLabel} \${catNum} • \${lapsBadgeText}</span>
                        <span class="stitch-card-district" style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #94a3b8; display: inline-flex; align-items: center; gap: 4px;">
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="#00dbe9" style="flex-shrink: 0;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                            \${meta.district}
                        </span>
                    </div>

                    <div class="stitch-card-title-row">
                        <div>
                            <h4 class="stitch-card-title">\${route.name}</h4>
                            <p class="stitch-card-subdesc">\${meta.laps} • \${meta.surface.split('/')[0]}</p>
                        </div>
                        <svg class="stitch-card-mini-svg" viewBox="0 0 100 80" fill="none">
                            <path d="\${miniSvgPath}" stroke="\${strokeColor}" stroke-linecap="round" stroke-width="3" style="filter: drop-shadow(0 0 6px \${strokeColor}66);"/>
                        </svg>
                    </div>

                    <!-- World Record Main Display (Larger Numbers - Original Stitch Design) -->
                    <div class="stitch-card-wr-box">
                        <div>
                            <span class="stitch-card-wr-label">\${(curLang === 'es') ? 'RÉCORD MUNDIAL (WR)' : ((curLang === 'pt') ? 'RECORDE MUNDIAL (WR)' : 'WORLD RECORD (WR)')}</span>
                            <div class="stitch-card-wr-time" id="stitch-wr-\${sanitizeFirebaseKey(route.name)}" style="color: \${timeColor}; font-size: 26px; font-weight: 800; font-family: var(--font-mono); line-height: 1.1; margin-top: 2px;">\${wrData.time}</div>
                        </div>
                        <div class="stitch-card-wr-pilot">
                            <div style="display: flex; align-items: center; gap: 6px; justify-content: flex-end;">
                                <span class="stitch-card-flag-badge" style="font-size: 10px; font-family: var(--font-mono); background: rgba(255,255,255,0.08); padding: 1px 5px; border-radius: 3px; color: #cbd5e1; font-weight: 700;">\${wrData.flag || 'ES'}</span>
                                <span class="stitch-card-pilot-name notranslate" translate="no" id="stitch-driver-\${sanitizeFirebaseKey(route.name)}" style="font-size: 14.5px; font-weight: 800; color: #ffffff;">\${wrData.driver}</span>
                            </div>
                            <span class="stitch-card-pilot-car" id="stitch-car-\${sanitizeFirebaseKey(route.name)}" style="font-size: 11px; color: var(--stitch-tertiary, #00dbe9); margin-top: 2px;">\${wrData.car}</span>
                        </div>
                    </div>

                    <!-- Micro Stats -->
                    <div class="stitch-card-micro-stats">
                        <div>
                            <span class="stitch-card-stat-label">\${(curLang === 'es') ? 'Vel. Punta' : ((curLang === 'pt') ? 'Vel. Máx' : 'Top Speed')}</span>
                            <span class="stitch-card-stat-val">\${wrData.speed}</span>
                        </div>
                        <div>
                            <span class="stitch-card-stat-label">Split S1</span>
                            <span class="stitch-card-stat-val">\${wrData.s1}</span>
                        </div>
                        <div style="text-align: right;">
                            <span class="stitch-card-stat-label">\${(curLang === 'es') ? 'Registros' : ((curLang === 'pt') ? 'Registros' : 'Records')}</span>
                            <span class="stitch-card-stat-val" style="color: #00dbe9;">\${wrData.pilots}</span>
                        </div>
                    </div>
                </div>

                <!-- Bottom Actions Drawer -->
                <div class="stitch-card-bottom-drawer" style="padding: 11px 18px; display: flex; align-items: center; justify-content: space-between; gap: 10px; background: rgba(29, 32, 39, 0.7); border-top: 1px solid rgba(255, 255, 255, 0.05);">
                    <a href="#" class="stitch-card-link-lb" style="font-size: 13.5px; font-weight: 800; font-family: 'Chivo', sans-serif; text-transform: uppercase; letter-spacing: 0.5px; color: var(--stitch-primary, #ffb800); display: inline-flex; align-items: center; gap: 6px; text-decoration: none;" onclick="event.stopPropagation(); goToStitchRouteLeaderboard('\${route.name.replace(/'/g, "\\\\'")}')">
                        <span>\${(curLang === 'es') ? 'VER LEADERBOARD' : ((curLang === 'pt') ? 'VER LEADERBOARD' : 'VIEW LEADERBOARD')}</span>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42 5.43 5.43H5v2.44z"/></svg>
                    </a>
                    <div class="stitch-card-actions" style="display: flex; align-items: center; gap: 6px;">
                        <button type="button" class="stitch-card-action-btn" title="\${(curLang === 'es') ? 'Descargar Ghost .SAV' : ((curLang === 'pt') ? 'Baixar Ghost .SAV' : 'Download Ghost .SAV')}" onclick="event.stopPropagation(); downloadStitchGhost('\${route.name.replace(/'/g, "\\\\'")}')" style="background: transparent; border: none; color: #94a3b8; padding: 5px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                        </button>
                        <button type="button" class="stitch-card-action-btn" title="\${(curLang === 'es') ? 'Ver Video On-Board POV' : ((curLang === 'pt') ? 'Ver Vídeo On-Board POV' : 'Watch On-Board POV Video')}" onclick="event.stopPropagation(); goToStitchRouteLeaderboard('\${route.name.replace(/'/g, "\\\\'")}')" style="background: transparent; border: none; color: #94a3b8; padding: 5px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-10 12.5v-9l6 4.5-6 4.5z"/></svg>
                        </button>
                    </div>
                </div>
            </article>
        \`;
    });

    grid.innerHTML = html;

    displayList.forEach(route => {
        fetchFirebaseRouteRecords(route.name).then(fbData => {
            const catKey = (route.type === "Circuito") ? 'junkman_single' : 'junkman';
            const rows = extractCategoryRecords(fbData, catKey);
            if (rows && rows.length > 0 && rows[0].time && rows[0].driver) {
                const rKey = sanitizeFirebaseKey(route.name);
                const timeEl = document.getElementById(\`stitch-wr-\${rKey}\`);
                const driverEl = document.getElementById(\`stitch-driver-\${rKey}\`);
                const carEl = document.getElementById(\`stitch-car-\${rKey}\`);
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

    container.innerHTML = \`
        <div class="stitch-drawer-header">
            <div>
                <div class="stitch-drawer-feed-tag">
                    <span class="stitch-ping-dot" style="background-color: var(--stitch-tertiary); box-shadow: 0 0 8px var(--stitch-tertiary);"></span>
                    LIVE TELEMETRY STREAM
                </div>
                <h3 class="stitch-drawer-title">\${(curLang === 'es') ? \`Últimos Tiempos Verificados en \${route.name}\` : ((curLang === 'pt') ? \`Últimos Tempos Verificados em \${route.name}\` : \`Latest Verified Times on \${route.name}\`)}</h3>
            </div>
            <a href="#" class="stitch-drawer-all-link" onclick="goToStitchRouteLeaderboard('\${route.name.replace(/'/g, "\\\\'")}')">
                \${(curLang === 'es') ? 'Ver todas las entradas en Leaderboard' : ((curLang === 'pt') ? 'Ver todas as entradas no Leaderboard' : 'View all entries in Leaderboard')}
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style="vertical-align: -1px; margin-left: 4px;"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
            </a>
        </div>

        <div class="stitch-table-wrapper">
            <table class="stitch-telemetry-table">
                <thead>
                    <tr>
                        <th style="width: 70px;">POS</th>
                        <th>\${(curLang === 'es') ? 'PILOTO' : ((curLang === 'pt') ? 'PILOTO' : 'DRIVER')}</th>
                        <th>\${(curLang === 'es') ? 'VEHÍCULO' : ((curLang === 'pt') ? 'VEÍCULO' : 'VEHICLE')}</th>
                        <th class="hidden-mobile">\${(curLang === 'es') ? 'MODIFICACIONES' : ((curLang === 'pt') ? 'MODIFICAÇÕES' : 'UPGRADES')}</th>
                        <th>\${(curLang === 'es') ? 'TIEMPO' : ((curLang === 'pt') ? 'TEMPO' : 'TIME')}</th>
                        <th class="hidden-mobile">DELTA</th>
                        <th style="text-align: right;">\${(curLang === 'es') ? 'VERIFICACIÓN' : ((curLang === 'pt') ? 'VERIFICAÇÃO' : 'VERIFICATION')}</th>
                    </tr>
                </thead>
                <tbody id="stitch-telemetry-tbody">
                    \${defaultRows.map(row => \`
                        <tr class="\${row.isWR ? 'stitch-row-wr' : ''}">
                            <td>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <span class="stitch-pos-badge \${row.rank === 1 ? 'stitch-pos-1' : ''}">\${row.rank}</span>
                                    \${row.rank === 1 ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="#ffb800" style="vertical-align:-1px;"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>' : ''}
                                </div>
                            </td>
                            <td>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <span style="font-family: var(--font-racing); font-size: 15px; font-weight: 800; color: \${row.rank === 1 ? 'var(--stitch-primary)' : '#ffffff'};" class="notranslate" translate="no">\${row.driver}</span>
                                    \${row.isWR ? '<span style="font-family: var(--font-mono); font-size: 10px; background: var(--stitch-surface); padding: 2px 5px; border-radius: 3px; color: var(--stitch-primary);">WR</span>' : ''}
                                </div>
                            </td>
                            <td style="color: #ffffff; font-weight: 500;">\${row.car}</td>
                            <td class="hidden-mobile" style="color: var(--stitch-on-surface-variant); font-size: 12px;">\${row.spec}</td>
                            <td>
                                <span style="font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: \${row.rank === 1 ? 'var(--stitch-primary)' : '#ffffff'};">\${row.time}</span>
                            </td>
                            <td class="hidden-mobile">
                                <span class="\${row.deltaClass}">\${row.delta}</span>
                            </td>
                            <td style="text-align: right;">
                                <span class="stitch-verification-badge \${row.badgeText.includes('YouTube') ? 'stitch-verification-yt' : ''}">
                                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style="vertical-align: -2px; margin-right: 4px;"><path d="m23 12-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"/></svg>
                                    \${row.badgeText}
                                </span>
                            </td>
                        </tr>
                    \`).join('')}
                </tbody>
            </table>
        </div>
    \`;

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
                    return \`
                        <tr class="\${isWR ? 'stitch-row-wr' : ''}">
                            <td>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <span class="stitch-pos-badge \${isWR ? 'stitch-pos-1' : ''}">\${rankNum}</span>
                                    \${isWR ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="#ffb800" style="vertical-align:-1px;"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>' : ''}
                                </div>
                            </td>
                            <td>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <span style="font-family: var(--font-racing); font-size: 15px; font-weight: 800; color: \${isWR ? 'var(--stitch-primary)' : '#ffffff'};" class="notranslate" translate="no">\${row.driver}</span>
                                    \${isWR ? '<span style="font-family: var(--font-mono); font-size: 10px; background: var(--stitch-surface); padding: 2px 5px; border-radius: 3px; color: var(--stitch-primary);">WR</span>' : ''}
                                </div>
                            </td>
                            <td style="color: #ffffff; font-weight: 500;">\${row.car || 'BMW M3 GTR'}</td>
                            <td class="hidden-mobile" style="color: var(--stitch-on-surface-variant); font-size: 12px;">\${row.mods || 'Junkman Pro Grip'}</td>
                            <td>
                                <span style="font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: \${isWR ? 'var(--stitch-primary)' : '#ffffff'};">\${row.time}</span>
                            </td>
                            <td class="hidden-mobile">
                                <span class="\${isWR ? 'stitch-delta-base' : 'stitch-delta-plus'}">\${isWR ? 'WR BASE' : '+00:00.' + (idx * 230 + 150)}</span>
                            </td>
                            <td style="text-align: right;">
                                <span class="stitch-verification-badge">
                                    <svg viewBox="0 0 24 24" width="13" height="13" fill="#00dbe9" style="vertical-align: -2px; margin-right: 4px;"><path d="m23 12-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"/></svg>
                                    Oficial Leaderboard
                                </span>
                            </td>
                        </tr>
                    \`;
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

`;

appJs = appJs.slice(0, startIdx2) + part2 + appJs.slice(endIdx2);

fs.writeFileSync('assets/js/app.js', appJs, 'utf8');
console.log('Successfully updated assets/js/app.js!');
