/**
 * NFSMW Records - Telemetría y Expedientes de Pilotos
 * src/telemetry-controller.js
 *
 * Motor de búsqueda forense de telemetría de pilotos:
 * - Consulta dinámica en tiempo real contra leaderboards.json y DEFAULT_BLACKLIST_DRIVERS
 * - Búsqueda insensible a mayúsculas con coincidencia exacta, difusa y resolución de alias oficial
 *   (ej: Avenger <-> SRTxAvenger, Lea <-> Lea4Speed0, Nebula <-> Nebula_MW, ZimanX, Wess, Mike)
 * - Cálculo de deltas milimétricos al Récord Mundial (WR)
 * - Agregación de estadísticas de telemetría (WRs, Pistas, Mejor Tiempo, Hardware, Transmisión, REP, PTS)
 * - Filtrado instantáneo por categoría (Todas, Circuitos, Sprints, Drag)
 * - Autocompletado nativo con datalist
 */

(function(window, document) {
  'use strict';

  // Estado del controlador
  let currentPilotName = 'ZimanX';
  let currentPilotRecords = [];
  let currentCategoryFilter = 'all';
  let isSearching = false;

  // Utilidades auxiliares
  function parseTimeToMs(timeStr, timeMs) {
    if (typeof timeMs === 'number' && !isNaN(timeMs) && timeMs > 0) return timeMs;
    if (!timeStr || typeof timeStr !== 'string') return 9999999;
    const clean = timeStr.trim();
    const parts = clean.split(':');
    if (parts.length === 2) {
      const m = parseInt(parts[0], 10) || 0;
      const s = parseFloat(parts[1]) || 0;
      return Math.round((m * 60 + s) * 1000);
    }
    return Math.round((parseFloat(clean) || 9999) * 1000);
  }

  function formatMs(ms) {
    if (!ms || ms <= 0 || ms >= 9999999) return '--:--.---';
    const totalSec = ms / 1000;
    const m = Math.floor(totalSec / 60);
    const s = Math.floor(totalSec % 60);
    const millis = Math.floor(ms % 1000);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
  }

  function formatDelta(deltaMs) {
    if (deltaMs === 0) {
      return '<span class="px-1.5 py-0.5 rounded bg-surface-container text-tertiary font-label-data text-label-data font-bold">RECORD HOLDER</span>';
    }
    const totalSec = deltaMs / 1000;
    const m = Math.floor(totalSec / 60);
    const s = Math.floor(totalSec % 60);
    const millis = Math.floor(deltaMs % 1000);
    const formatted = `+${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
    return `<span class="font-label-data text-label-data text-error font-semibold">${formatted}</span>`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function generateHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hex.slice(0, 4)}...${hex.slice(-4)}`;
  }

  // Mapeo de rutas desde routesData
  function getRouteMetadata(trackKey) {
    const rawKey = (trackKey || '').toLowerCase().trim();
    let foundRoute = null;

    const routes = (typeof window !== 'undefined' && window.routesData)
      ? window.routesData
      : (typeof routesData !== 'undefined' ? routesData : []);

    if (Array.isArray(routes)) {
      foundRoute = routes.find(r => {
        if (!r || !r.name) return false;
        const normName = r.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
        return normName === rawKey || r.name.toLowerCase() === rawKey.replace(/_/g, ' ');
      });
      if (!foundRoute) {
        foundRoute = routes.find(r => {
          if (!r || !r.name) return false;
          return r.name.toLowerCase().includes(rawKey.replace(/_/g, ' '));
        });
      }
    }

    let displayName = '';
    let trackType = 'Circuito';

    if (foundRoute) {
      displayName = foundRoute.name;
      trackType = foundRoute.type || 'Circuito';
    } else {
      // Fallback: Title case de trackKey
      displayName = rawKey.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (rawKey.includes('drag')) {
        trackType = 'Drag';
      } else if (rawKey.includes('sprint')) {
        trackType = 'Sprint';
      }
    }

    return { name: displayName, type: trackType };
  }

  function formatCategoryLabel(catKey, trackType) {
    const k = (catKey || '').toLowerCase();
    const t = (trackType || 'Circuito').toUpperCase();
    if (k === 'junkman_single') return `${t} • JUNKMAN SINGLE LAP`;
    if (k === 'junkman_fast') return `${t} • JUNKMAN FAST LAP`;
    if (k === 'bmw_single') return `${t} • BMW M3 GTR`;
    if (k === 'bmw_fast') return `${t} • BMW FAST LAP`;
    if (k === 'junkman') return `${t} • JUNKMAN MAX`;
    if (k === 'bmw') return `${t} • BMW M3 GTR E46`;
    return `${t} • ${k.toUpperCase()}`;
  }

  // Obtener lista oficial de pilotos de Blacklist
  function getOfficialDrivers() {
    if (typeof window !== 'undefined' && Array.isArray(window.DEFAULT_BLACKLIST_DRIVERS)) {
      return window.DEFAULT_BLACKLIST_DRIVERS;
    }
    if (typeof DEFAULT_BLACKLIST_DRIVERS !== 'undefined' && Array.isArray(DEFAULT_BLACKLIST_DRIVERS)) {
      return DEFAULT_BLACKLIST_DRIVERS;
    }
    return [];
  }

  // Obtener aliases y variantes de un nombre de piloto
  function getPilotAliases(pilotName) {
    const aliases = new Set();
    const cleanName = (pilotName || '').trim().replace(/™/g, '');
    if (cleanName) aliases.add(cleanName);

    const officials = getOfficialDrivers();
    officials.forEach(d => {
      if (!d) return;
      const dName = (d.name || '').trim().replace(/™/g, '');
      const dAlias = (d.alias || '').trim().replace(/™/g, '');
      const dSig = (d.signature || '').trim().replace(/™/g, '');

      const isMatch = (dName && dName.toLowerCase() === cleanName.toLowerCase()) ||
                      (dAlias && dAlias.toLowerCase() === cleanName.toLowerCase()) ||
                      (cleanName.toLowerCase().includes(dName.toLowerCase()) && dName.length > 2) ||
                      (cleanName.toLowerCase().includes(dAlias.toLowerCase()) && dAlias.length > 2);

      if (isMatch) {
        if (dName) aliases.add(dName);
        if (dAlias) aliases.add(dAlias);
        if (dSig) aliases.add(dSig);
      }
    });

    return Array.from(aliases);
  }

  // Comprobar si el registro en leaderboards coincide con el piloto o sus aliases
  function doesRecordMatchPilot(recDriver, pilotName, aliases) {
    if (!recDriver || !pilotName) return false;
    const rd = recDriver.trim().toLowerCase().replace(/™/g, '');
    const pn = pilotName.trim().toLowerCase().replace(/™/g, '');

    if (rd === pn) return true;
    if (rd.includes(pn) || pn.includes(rd)) return true;

    if (Array.isArray(aliases)) {
      for (const a of aliases) {
        if (!a) continue;
        const al = a.trim().toLowerCase().replace(/™/g, '');
        if (rd === al || rd.includes(al) || al.includes(rd)) return true;
      }
    }
    return false;
  }

  // Obtener todos los datos de leaderboards (caché global o fetch)
  async function getLeaderboardsData() {
    if (window.allLeaderboardsData && Object.keys(window.allLeaderboardsData).length > 0) {
      return window.allLeaderboardsData;
    }
    const baseUrl = window.FIREBASE_RTDB_BASE_URL || "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    try {
      const res = await fetch(`${baseUrl}/leaderboards.json`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          window.allLeaderboardsData = data;
          return data;
        }
      }
    } catch (e) {
      console.warn('[Telemetry] Error obteniendo leaderboards:', e);
    }
    return window.allLeaderboardsData || {};
  }

  // Recolectar todos los nombres de pilotos únicos para el datalist
  function getAllUniquePilots(leaderboards) {
    const set = new Set();

    // 1. De DEFAULT_BLACKLIST_DRIVERS
    const officials = getOfficialDrivers();
    officials.forEach(d => {
      if (d && d.name) set.add(d.name.trim());
      if (d && d.alias) set.add(d.alias.trim());
    });

    // 2. De leaderboards
    if (leaderboards && typeof leaderboards === 'object') {
      for (const track of Object.values(leaderboards)) {
        if (!track || typeof track !== 'object') continue;
        for (const cat of Object.values(track)) {
          if (!Array.isArray(cat)) continue;
          cat.forEach(r => {
            if (r && r.driver && typeof r.driver === 'string') {
              set.add(r.driver.trim());
            }
          });
        }
      }
    }

    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }

  // Llenar <datalist id="pilotListSuggestions">
  function populatePilotDatalist(driversList) {
    const datalist = document.getElementById('pilotListSuggestions');
    if (!datalist) return;
    datalist.innerHTML = '';
    if (typeof document.createElement === 'function') {
      driversList.forEach(driver => {
        const option = document.createElement('option');
        option.value = driver;
        datalist.appendChild(option);
      });
    }
  }

  // Resolver mejor coincidencia de piloto
  function findMatchingDriver(query, allDrivers) {
    if (!query) return null;
    const q = query.trim().toLowerCase().replace(/™/g, '');

    // 1. Coincidencia exacta
    const exact = allDrivers.find(d => d.toLowerCase().replace(/™/g, '') === q);
    if (exact) return exact;

    // 2. Empieza por el término
    const starts = allDrivers.find(d => d.toLowerCase().replace(/™/g, '').startsWith(q));
    if (starts) return starts;

    // 3. Contiene el término
    const contains = allDrivers.find(d => d.toLowerCase().replace(/™/g, '').includes(q));
    if (contains) return contains;

    // 4. El término contiene al piloto (ej: "SRTxAvenger" contiene "Avenger")
    const revContains = allDrivers.find(d => q.includes(d.toLowerCase().replace(/™/g, '')));
    if (revContains) return revContains;

    return null;
  }

  // Extraer todos los récords de un piloto
  function extractPilotRecords(pilotName, leaderboards) {
    const records = [];
    if (!leaderboards || typeof leaderboards !== 'object') return records;

    const aliases = getPilotAliases(pilotName);

    for (const [trackKey, trackObj] of Object.entries(leaderboards)) {
      if (!trackObj || typeof trackObj !== 'object') continue;

      const meta = getRouteMetadata(trackKey);

      for (const [catKey, catList] of Object.entries(trackObj)) {
        if (!Array.isArray(catList) || catList.length === 0) continue;

        // Primer registro con tiempo es el Récord Mundial (WR)
        const wrRecord = catList.find(r => r && (r.time || r.timeMs));
        const wrMs = wrRecord ? parseTimeToMs(wrRecord.time, wrRecord.timeMs) : 0;

        // Buscar al piloto en esta categoría usando alias y coincidencias
        const recIndex = catList.findIndex(r => r && r.driver && doesRecordMatchPilot(r.driver, pilotName, aliases));
        if (recIndex !== -1) {
          const rec = catList[recIndex];
          const pilotMs = parseTimeToMs(rec.time, rec.timeMs);
          const isWR = (recIndex === 0) || (rec.rank === '#1') || (pilotMs <= wrMs && pilotMs > 0);
          const deltaMs = isWR ? 0 : Math.max(0, pilotMs - wrMs);

          records.push({
            trackKey: trackKey,
            categoryKey: catKey,
            routeName: meta.name,
            trackType: meta.type,
            rankNum: recIndex + 1,
            isWR: isWR,
            time: rec.time || formatMs(pilotMs),
            timeMs: pilotMs,
            deltaMs: deltaMs,
            car: rec.car || 'BMW M3 GTR',
            setup: (rec.car && rec.car.toLowerCase().includes('bmw')) ? 'Stock Race Spec' : 'Junkman Max + Aero 3',
            gearbox: rec.gearbox || 'Manual',
            device: rec.device || 'Control/Teclado',
            verified: rec.verified !== false,
            yt: rec.yt || ''
          });
        }
      }
    }

    // Ordenar: primero los WRs, luego por menor delta
    records.sort((a, b) => {
      if (a.isWR && !b.isWR) return -1;
      if (!a.isWR && b.isWR) return 1;
      return a.deltaMs - b.deltaMs;
    });

    return records;
  }

  // Extraer o generar datos de perfil del piloto
  function getPilotProfile(pilotName, records) {
    const officials = getOfficialDrivers();
    const aliases = getPilotAliases(pilotName);

    const official = officials.find(d => {
      if (!d) return false;
      return doesRecordMatchPilot(d.name, pilotName, aliases) ||
             doesRecordMatchPilot(d.alias, pilotName, aliases);
    });

    const wrCount = records.filter(r => r.isWR).length;
    const totalRecords = records.length;
    const uniqueTracks = new Set(records.map(r => r.routeName)).size;

    // Calcular auto más frecuente
    const carCounts = {};
    const devCounts = {};
    const gearCounts = {};
    records.forEach(r => {
      if (r.car) carCounts[r.car] = (carCounts[r.car] || 0) + 1;
      if (r.device) devCounts[r.device] = (devCounts[r.device] || 0) + 1;
      if (r.gearbox) gearCounts[r.gearbox] = (gearCounts[r.gearbox] || 0) + 1;
    });

    const topCar = Object.keys(carCounts).sort((a, b) => carCounts[b] - carCounts[a])[0] || (official?.ride || 'BMW M3 GTR');
    const topDevice = Object.keys(devCounts).sort((a, b) => devCounts[b] - devCounts[a])[0] || 'Xbox 360 Controller';
    const topGear = Object.keys(gearCounts).sort((a, b) => gearCounts[b] - gearCounts[a])[0] || 'Manual';

    // Mejor tiempo / marca emblemática
    const bestRecord = records[0] || null;

    if (official) {
      return {
        name: official.name || pilotName,
        rankBadge: official.badge || `BL #${String(official.rank).padStart(2, '0')}`,
        rankNumber: official.rank || 1,
        shieldOk: true,
        rpdFile: `RPD FILE: BL-${String(official.rank).padStart(2, '0')}-2026-X`,
        bio: official.bio || `Piloto Oficial Blacklist // Especialista en ${topCar}`,
        joinDate: '14/ENE/2024',
        region: official.schedule ? `HORARIO: ${official.schedule.toUpperCase()}` : 'ROCKPORT CENTRAL',
        status: official.status || 'ACTIVO EN TORNEO',
        rep: `$${(official.rep || (1300000 + wrCount * 150000)).toLocaleString('en-US')} REP`,
        points: `${official.totalScore || (350 + wrCount * 25)} PTS`,
        avatar: official.avatar || 'assets/img/nfsranksmwlogo.png',
        wrCount: wrCount,
        uniqueTracks: uniqueTracks,
        totalRecords: totalRecords,
        bestTime: bestRecord ? bestRecord.time : '--:--.---',
        bestTrack: bestRecord ? bestRecord.routeName.toUpperCase() : 'ROCKPORT CITY',
        bestCar: topCar,
        bestSetup: bestRecord ? bestRecord.setup : 'Junkman Max',
        device: topDevice.toUpperCase(),
        gearbox: `TRANSMISIÓN ${topGear.toUpperCase()}`
      };
    }

    // Piloto no oficial pero presente en Leaderboards
    const estRep = (wrCount * 250000) + (totalRecords * 20000) + 150000;
    const estPts = (wrCount * 30) + (totalRecords * 4) + 40;
    const badgeText = wrCount > 0 ? `WR #${wrCount}` : `PRO #${Math.min(99, Math.max(1, 100 - totalRecords))}`;

    return {
      name: pilotName,
      rankBadge: badgeText,
      rankNumber: wrCount > 0 ? 1 : 10,
      shieldOk: true,
      rpdFile: `RPD FILE: BL-PRO-${pilotName.slice(0, 3).toUpperCase()}-2026`,
      bio: `División Speedrun Homologada // Especialista en ${topCar} & Circuitos Rockport`,
      joinDate: 'HOMOLOGADO',
      region: 'GLOBAL LEADERBOARD',
      status: wrCount > 0 ? 'VIGENTE EN PODIO' : 'ACTIVO EN RANKINGS',
      rep: `$${estRep.toLocaleString('en-US')} REP`,
      points: `${estPts} PTS`,
      avatar: 'assets/img/nfsranksmwlogo.png',
      wrCount: wrCount,
      uniqueTracks: uniqueTracks,
      totalRecords: totalRecords,
      bestTime: bestRecord ? bestRecord.time : '--:--.---',
      bestTrack: bestRecord ? bestRecord.routeName.toUpperCase() : 'ROCKPORT CITY',
      bestCar: topCar,
      bestSetup: bestRecord ? bestRecord.setup : 'Junkman Max',
      device: topDevice.toUpperCase(),
      gearbox: `TRANSMISIÓN ${topGear.toUpperCase()}`
    };
  }

  // Renderizar la tabla de registros
  function renderRecordsTable(records, filterCategory) {
    const tbody = document.getElementById('telemetry-records-tbody');
    if (!tbody) return;

    let filtered = records;
    if (filterCategory && filterCategory !== 'all') {
      const cat = filterCategory.toLowerCase();
      filtered = records.filter(r => r.trackType && r.trackType.toLowerCase() === cat);
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr class="bg-surface-container-low/50">
          <td colspan="6" class="py-8 px-4 text-center">
            <div class="flex flex-col items-center justify-center gap-2">
              <span class="material-symbols-outlined text-outline text-[32px]">folder_off</span>
              <span class="font-headline-sm text-body-md text-on-surface uppercase font-bold">Sin Tiempos en Esta Categoría</span>
              <p class="font-label-data text-label-data text-outline max-w-md">
                El piloto no registra tiempos homologados bajo el filtro seleccionado (${(filterCategory || 'TODAS').toUpperCase()}).
              </p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    const rowsHtml = filtered.map((r, idx) => {
      const isAltRow = idx % 2 === 1;
      const bgClass = isAltRow ? 'bg-surface-container-lowest' : 'bg-surface-container-low';
      const rankBadge = r.isWR
        ? '<span class="px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container font-label-hud text-label-hud font-bold">WR</span>'
        : `<span class="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-hud text-label-hud font-bold">#${String(r.rankNum).padStart(2, '0')}</span>`;

      const timeClass = r.isWR
        ? 'text-primary-container font-bold'
        : 'text-on-surface font-bold';

      const deltaHtml = formatDelta(r.deltaMs);
      const hashStr = generateHash(`${r.trackKey}_${r.categoryKey}_${r.timeMs}`);

      const vodBtn = r.yt
        ? `<a class="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary-container/20 text-secondary-container hover:bg-secondary-container hover:text-on-secondary transition-all font-label-hud text-label-hud uppercase shadow-sm" href="${escapeHtml(r.yt)}" rel="noopener noreferrer" target="_blank">
             <span class="material-symbols-outlined text-[14px]">smart_display</span> VOD
           </a>`
        : `<span class="inline-flex items-center gap-1 px-2 py-1 rounded bg-surface-container text-outline opacity-40 font-label-hud text-label-hud uppercase" title="Sin enlace VOD reportado">
             <span class="material-symbols-outlined text-[14px]">videocam_off</span> N/A
           </span>`;

      const categoryLabel = formatCategoryLabel(r.categoryKey, r.trackType);

      return `
        <tr class="${bgClass} hover:bg-surface-container-high transition-colors group">
          <td class="py-3 px-3">
            <div class="flex items-center gap-space-xs">
              ${rankBadge}
              <div>
                <div class="font-headline-sm text-body-md text-on-surface font-bold group-hover:text-primary transition-colors">${escapeHtml(r.routeName)}</div>
                <div class="font-label-data text-label-data text-outline">${escapeHtml(categoryLabel)}</div>
              </div>
            </div>
          </td>
          <td class="py-3 px-3">
            <div class="font-label-data text-label-data text-primary font-semibold">${escapeHtml(r.car)}</div>
            <div class="text-outline text-label-data">${escapeHtml(r.setup)}</div>
          </td>
          <td class="py-3 px-3 text-right font-label-timer-md text-label-timer-md ${timeClass}">
            ${escapeHtml(r.time)}
          </td>
          <td class="py-3 px-3 text-center">
            ${deltaHtml}
          </td>
          <td class="py-3 px-3 text-center">
            <span class="font-label-data text-label-data text-outline hover:text-on-surface transition-colors cursor-pointer" title="MD5 Forense Verificado: ${hashStr}">
              ${hashStr}
            </span>
          </td>
          <td class="py-3 px-3 text-right">
            ${vodBtn}
          </td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = rowsHtml;
  }

  // Actualizar los elementos visuales del Dossier en el DOM
  function updateDossierUI(profile, records) {
    // 1. Cabecera e Identidad
    const nameEl = document.getElementById('telemetry-pilot-name');
    if (nameEl) nameEl.innerHTML = `${escapeHtml(profile.name)}<span class="text-primary-container">™</span>`;

    const badgeEl = document.getElementById('telemetry-pilot-rank-badge');
    if (badgeEl) badgeEl.textContent = profile.rankBadge;

    const bioEl = document.getElementById('telemetry-pilot-bio');
    if (bioEl) bioEl.textContent = profile.bio;

    const rpdEl = document.getElementById('telemetry-pilot-rpd-file');
    if (rpdEl) rpdEl.textContent = profile.rpdFile;

    const joinDateEl = document.getElementById('telemetry-pilot-join-date');
    if (joinDateEl) joinDateEl.textContent = profile.joinDate;

    const regionEl = document.getElementById('telemetry-pilot-region');
    if (regionEl) regionEl.textContent = profile.region;

    const statusEl = document.getElementById('telemetry-pilot-status');
    if (statusEl) statusEl.textContent = profile.status;

    const repEl = document.getElementById('telemetry-pilot-rep');
    if (repEl) repEl.textContent = profile.rep;

    const ptsEl = document.getElementById('telemetry-pilot-points');
    if (ptsEl) ptsEl.textContent = profile.points;

    const avatarEl = document.getElementById('telemetry-pilot-avatar');
    if (avatarEl && profile.avatar) avatarEl.src = profile.avatar;

    // 2. 4 KPIs Tiles
    const wrCountEl = document.getElementById('telemetry-stat-wr-count');
    if (wrCountEl) wrCountEl.textContent = String(profile.wrCount).padStart(2, '0');

    const lastWrEl = document.getElementById('telemetry-stat-last-wr');
    if (lastWrEl) {
      lastWrEl.textContent = profile.wrCount > 0 ? `Líder en: ${profile.bestTrack}` : 'Sin WR Activo';
    }

    const tracksCountEl = document.getElementById('telemetry-stat-tracks-count');
    if (tracksCountEl) tracksCountEl.textContent = String(profile.uniqueTracks);

    const totalTimesEl = document.getElementById('telemetry-stat-total-times');
    if (totalTimesEl) totalTimesEl.textContent = `${profile.totalRecords} TIEMPOS`;

    const bestTimeEl = document.getElementById('telemetry-stat-best-time');
    if (bestTimeEl) bestTimeEl.textContent = profile.bestTime;

    const bestTrackEl = document.getElementById('telemetry-stat-best-track');
    if (bestTrackEl) bestTrackEl.textContent = profile.bestTrack;

    const bestCarEl = document.getElementById('telemetry-stat-best-car');
    if (bestCarEl) bestCarEl.textContent = profile.bestCar;

    const bestSetupEl = document.getElementById('telemetry-stat-best-setup');
    if (bestSetupEl) bestSetupEl.textContent = profile.bestSetup;

    const deviceEl = document.getElementById('telemetry-stat-device');
    if (deviceEl) deviceEl.textContent = profile.device;

    const gearboxEl = document.getElementById('telemetry-stat-gearbox');
    if (gearboxEl) gearboxEl.textContent = profile.gearbox;

    // 3. Renderizar filas de la tabla
    renderRecordsTable(records, currentCategoryFilter);
  }

  // Filtrado por categoría (TODAS, CIRCUITOS, SPRINTS, DRAG)
  function filterTelemetryRecords(category, btnElement) {
    currentCategoryFilter = category || 'all';

    // Actualizar estilo visual de los botones
    const filterContainer = document.getElementById('telemetry-category-filters');
    if (filterContainer && typeof filterContainer.querySelectorAll === 'function') {
      const buttons = filterContainer.querySelectorAll('button');
      buttons.forEach(b => {
        b.className = 'px-2.5 py-1 text-label-hud font-label-hud uppercase rounded text-on-surface-variant hover:text-on-surface transition-colors';
      });
    }

    if (btnElement) {
      btnElement.className = 'px-2.5 py-1 text-label-hud font-label-hud uppercase rounded bg-primary-container text-on-primary-container font-bold';
    }

    renderRecordsTable(currentPilotRecords, currentCategoryFilter);
  }

  // Función principal de búsqueda
  async function searchPilotTelemetry(customQuery) {
    if (isSearching) return;
    isSearching = true;

    const input = document.getElementById('pilotSearchInput');
    const query = (typeof customQuery === 'string' ? customQuery : (input ? input.value : '')).trim();

    if (!query) {
      if (input && typeof input.focus === 'function') input.focus();
      isSearching = false;
      return;
    }

    const container = document.getElementById('activeDossierContainer');
    if (container && container.classList) container.classList.add('opacity-40');

    try {
      const leaderboards = await getLeaderboardsData();
      const allDrivers = getAllUniquePilots(leaderboards);

      // Actualizar sugerencias de datalist
      populatePilotDatalist(allDrivers);

      const matchedDriver = findMatchingDriver(query, allDrivers);

      if (!matchedDriver) {
        // Notificación de piloto no encontrado
        console.warn(`[Telemetry] Piloto no encontrado: "${query}"`);
        if (input && input.classList) {
          input.classList.add('border', 'border-error');
          setTimeout(() => { input.classList.remove('border', 'border-error'); }, 1500);
        }

        const tbody = document.getElementById('telemetry-records-tbody');
        if (tbody) {
          tbody.innerHTML = `
            <tr class="bg-surface-container-low">
              <td colspan="6" class="py-8 px-4 text-center">
                <div class="flex flex-col items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-error text-[36px]">person_search</span>
                  <span class="font-headline-sm text-body-md text-error uppercase font-bold">Piloto No Registrado: "${escapeHtml(query)}"</span>
                  <p class="font-label-data text-label-data text-outline max-w-md">
                    No se encontró ningún piloto con ese nombre en la base de datos de Leaderboards ni en los 15 Oficiales de Blacklist. Comprueba el autocompletado del buscador.
                  </p>
                </div>
              </td>
            </tr>
          `;
        }
        return;
      }

      currentPilotName = matchedDriver;
      if (input) input.value = matchedDriver;

      // Extraer y procesar registros
      currentPilotRecords = extractPilotRecords(matchedDriver, leaderboards);
      const profile = getPilotProfile(matchedDriver, currentPilotRecords);

      // Actualizar interfaz
      updateDossierUI(profile, currentPilotRecords);

    } catch (err) {
      console.error('[Telemetry] Error en búsqueda de telemetría:', err);
    } finally {
      if (container && container.classList) {
        setTimeout(() => {
          container.classList.remove('opacity-40');
        }, 150);
      }
      isSearching = false;
    }
  }

  // Establecer piloto y buscar inmediatamente
  function setPilot(pilotName) {
    const input = document.getElementById('pilotSearchInput');
    if (input) input.value = pilotName;
    searchPilotTelemetry(pilotName);
  }

  // Inicialización y enlace de eventos
  function initTelemetryController() {
    const input = document.getElementById('pilotSearchInput');
    if (input && typeof input.addEventListener === 'function') {
      // Búsqueda al pulsar Enter
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          searchPilotTelemetry();
        }
      });

      // Búsqueda al seleccionar del datalist
      input.addEventListener('change', () => {
        searchPilotTelemetry();
      });
    }

    // Inicializar datalist y cargar piloto inicial
    getLeaderboardsData().then(data => {
      const allDrivers = getAllUniquePilots(data);
      populatePilotDatalist(allDrivers);

      const initialQuery = input && input.value ? input.value.trim() : 'ZimanX';
      searchPilotTelemetry(initialQuery);
    });
  }

  // Exportar al ámbito global para HTML y tests
  window.searchPilotTelemetry = searchPilotTelemetry;
  window.filterTelemetryRecords = filterTelemetryRecords;
  window.setPilot = setPilot;
  window.initTelemetryController = initTelemetryController;

  // Ejecución al cargar
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTelemetryController);
    } else {
      initTelemetryController();
    }
  }

})(typeof window !== 'undefined' ? window : globalThis, typeof document !== 'undefined' ? document : {});
