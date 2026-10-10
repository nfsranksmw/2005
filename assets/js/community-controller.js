/**
 * NFSMW RANKS // Community & Telemetry Controller
 * Implements:
 * 1. Official Time Submission Form (handleTimeSubmit, initSubmitRouteSelector, modal)
 * 2. Performance Guides & Competition Tuning Workshop (TUNING_CARS_DATA, sliders, filters)
 * 3. Rockport GPS Live Satellite Map (zoomMap, resetMapZoom, toggleMapFullscreen, focusMapDistrict)
 * 4. Driver Dossier Search (renderDriverSearchUI, searchDriverProfile)
 *
 * 100% compatible with Google Stitch tokens and Firebase Realtime Database
 */

(function () {
  'use strict';

  const FIREBASE_BASE_URL = 'https://nfsranks-blacklist-default-rtdb.firebaseio.com';

  // ==========================================
  // 1. SUBMISSION FORM & TELEMETRY AUDITING
  // ==========================================

  function parseTimeToMs(timeStr) {
    if (window.NFS_FIREBASE && typeof window.NFS_FIREBASE.parseTimeToMs === 'function') {
      return window.NFS_FIREBASE.parseTimeToMs(timeStr);
    }
    if (!timeStr || typeof timeStr !== 'string') return null;
    const clean = timeStr.trim().toLowerCase();
    if (!clean || clean === '--' || clean === '-' || clean === 'n/a') return null;

    if (clean.includes(':')) {
      const parts = clean.split(':');
      if (parts.length === 2) {
        const mins = parseInt(parts[0], 10);
        const secParts = parts[1].split('.');
        const secs = parseInt(secParts[0], 10);
        let msStr = (secParts[1] || '0').replace(/[^0-9]/g, '0');
        if (msStr.length === 1) msStr += '00';
        else if (msStr.length === 2) msStr += '0';
        else if (msStr.length > 3) msStr = msStr.slice(0, 3);
        const ms = parseInt(msStr, 10);
        if (!isNaN(mins) && !isNaN(secs)) {
          return (mins * 60 * 1000) + (secs * 1000) + (isNaN(ms) ? 0 : ms);
        }
      }
    }
    return null;
  }

  function formatMsToTime(ms) {
    if (window.NFS_FIREBASE && typeof window.NFS_FIREBASE.formatMsToTime === 'function') {
      return window.NFS_FIREBASE.formatMsToTime(ms);
    }
    if (ms === null || ms === undefined || isNaN(ms)) return '--:--.---';
    const totalSecs = Math.floor(ms / 1000);
    const remMs = ms % 1000;
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(remMs).padStart(3, '0')}`;
  }

  function sanitizeKey(str) {
    if (window.NFS_FIREBASE && typeof window.NFS_FIREBASE.sanitizeKey === 'function') {
      return window.NFS_FIREBASE.sanitizeKey(str);
    }
    if (!str) return 'general';
    return String(str).toLowerCase().trim().replace(/[^a-z0-9_-]/g, '_');
  }

  function initSubmitRouteSelector() {
    const select = document.getElementById('sub-route');
    if (!select) return;
    if (select.options.length > 5) return; // Already populated

    const currentValue = select.value;
    select.innerHTML = '<option value="">-- Selecciona una de las 86 pistas oficiales --</option>';

    const routes = typeof routesData !== 'undefined' ? routesData : (window.routesData || []);
    if (!routes || !routes.length) return;

    const circuitTracks = routes.filter(r => r.type === 'Circuito');
    const sprintTracks = routes.filter(r => r.type === 'Sprint');
    const dragTracks = routes.filter(r => r.type === 'Drag');

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

  async function handleTimeSubmit(event) {
    if (event) event.preventDefault();

    const btn = document.getElementById('btn-submit-time');
    const status = document.getElementById('sub-status');
    if (!btn || !status) return false;

    const driver = (document.getElementById('sub-driver')?.value || '').trim();
    const route = (document.getElementById('sub-route')?.value || '').trim();
    const car = (document.getElementById('sub-car')?.value || '').trim();
    const category = (document.getElementById('sub-category')?.value || 'Junkman').trim();
    const gearbox = (document.getElementById('sub-gearbox')?.value || 'Manual').trim();
    const video = (document.getElementById('sub-video')?.value || '').trim();
    const timeDeclared = (document.getElementById('sub-time')?.value || '').trim();
    const startMark = (document.getElementById('sub-start')?.value || '').trim();
    const endMark = (document.getElementById('sub-end')?.value || '').trim();
    const device = (document.getElementById('sub-device')?.value || 'Teclado').trim();

    const seasonId = (document.getElementById('sub-season-id')?.value || '').trim();
    const weekNum = (document.getElementById('sub-week-num')?.value || '').trim();
    const challengeId = (document.getElementById('sub-challenge-id')?.value || '').trim();
    const rewardDesc = (document.getElementById('sub-reward-desc')?.value || '').trim();

    // 1. Time parse validation
    const declaredMs = parseTimeToMs(timeDeclared);
    if (declaredMs === null) {
      status.className = 'mt-4 font-headline-sm text-sm text-red-400 bg-red-950/40 p-3 rounded-xl border border-red-800/60';
      status.innerText = '❌ Formato inválido en el Tiempo Declarado en Pantalla. Usa MM:SS.mmm (ej: 01:20.750).';
      document.getElementById('sub-time')?.focus();
      return false;
    }

    // 2. Video timestamp validation if provided
    const startMs = startMark ? parseTimeToMs(startMark) : null;
    const endMs = endMark ? parseTimeToMs(endMark) : null;
    if (startMs !== null && endMs !== null) {
      if (endMs <= startMs) {
        status.className = 'mt-4 font-headline-sm text-sm text-red-400 bg-red-950/40 p-3 rounded-xl border border-red-800/60';
        status.innerText = '❌ La Marca de Fin de vídeo debe ser posterior a la Marca de Inicio.';
        document.getElementById('sub-end')?.focus();
        return false;
      }
      const diffMs = endMs - startMs;
      const discrepancyMs = Math.abs(diffMs - declaredMs);
      if (discrepancyMs > 100) {
        status.className = 'mt-4 font-headline-sm text-sm text-red-400 bg-red-950/40 p-3 rounded-xl border border-red-800/60';
        const diffSec = (discrepancyMs / 1000).toFixed(3);
        status.innerText = `❌ DESFASE DETECTADO: El tiempo declarado (${formatMsToTime(declaredMs)}) difiere del intervalo del vídeo (${formatMsToTime(diffMs)}) por ${diffSec}s.`;
        return false;
      }
    }

    // 3. Video link validation (YouTube / Twitch)
    const isYouTube = video.includes('youtube.com') || video.includes('youtu.be');
    const isTwitch = video.includes('twitch.tv');
    if (!isYouTube && !isTwitch) {
      status.className = 'mt-4 font-headline-sm text-sm text-red-400 bg-red-950/40 p-3 rounded-xl border border-red-800/60';
      status.innerText = '❌ Por favor introduce un enlace válido de YouTube o Twitch (ej: https://www.youtube.com/watch?v=...).';
      document.getElementById('sub-video')?.focus();
      return false;
    }

    // Loading UI
    btn.disabled = true;
    const originalBtnHtml = btn.innerHTML;
    btn.innerHTML = `<span class="material-symbols-outlined text-[20px] animate-spin">sync</span><span>ENVIANDO A HOMOLOGACIÓN...</span>`;
    status.className = 'mt-4 font-headline-sm text-sm text-primary-container bg-primary-container/10 p-3 rounded-xl border border-primary-container/30';
    status.innerText = 'Auditando telemetría y registrando en la cola de homologación...';

    // Route type and Category Key
    const routes = typeof routesData !== 'undefined' ? routesData : (window.routesData || []);
    const matchedRoute = routes.find(r => r.name.toLowerCase() === route.toLowerCase());
    const isCircuit = matchedRoute ? matchedRoute.type === 'Circuito' : true;

    let categoryKey = 'junkman_single';
    if (isCircuit) {
      if (category.toLowerCase().includes('bmw') || category === 'BMW M3 GTR') categoryKey = 'bmw_m3_gtr';
      else if (category.toLowerCase().includes('stock') || category.toLowerCase().includes('no junkman')) categoryKey = 'stock';
      else categoryKey = 'junkman_single';
    } else {
      categoryKey = 'junkman_single';
    }

    const submissionData = {
      id: 'sub_' + Date.now(),
      driver,
      route,
      routeKey: sanitizeKey(route),
      category,
      categoryKey,
      car,
      gearbox,
      time: timeDeclared,
      timeMs: declaredMs,
      video,
      device,
      status: 'pending',
      timestamp: new Date().toISOString(),
      submittedAt: Date.now(),
      seasonChallenge: seasonId ? { seasonId, weekNum, challengeId, rewardDesc } : null
    };

    try {
      const res = await fetch(`${FIREBASE_BASE_URL}/submissions.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (!res.ok) throw new Error('Error de conexión con el servidor de homologación');

      // Success feedback
      status.className = 'mt-4 font-headline-sm text-sm text-techgreen-400 bg-techgreen-500/10 p-3 rounded-xl border border-techgreen-500/30';
      status.innerText = '✅ ¡REGISTRO ENVIADO CON ÉXITO! Entrará a revisión técnica por los comisarios.';

      // Open Success Modal
      openSubmissionSuccessModal(submissionData);

      // Reset form
      document.getElementById('form-submit-time')?.reset();
      unlinkSeasonChallenge();
    } catch (err) {
      console.error('Error submitting time:', err);
      status.className = 'mt-4 font-headline-sm text-sm text-red-400 bg-red-950/40 p-3 rounded-xl border border-red-800/60';
      status.innerText = '❌ Error al conectar con Firebase. Por favor revisa tu conexión a Internet e inténtalo de nuevo.';
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalBtnHtml;
    }

    return false;
  }

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

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function closeSubmissionSuccessModal() {
    const modal = document.getElementById('modal-submission-success');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  function unlinkSeasonChallenge() {
    const banner = document.getElementById('sub-season-banner');
    if (banner) banner.style.display = 'none';
    const sId = document.getElementById('sub-season-id');
    const wNum = document.getElementById('sub-week-num');
    const cId = document.getElementById('sub-challenge-id');
    const rDesc = document.getElementById('sub-reward-desc');
    if (sId) sId.value = '';
    if (wNum) wNum.value = '';
    if (cId) cId.value = '';
    if (rDesc) rDesc.value = '';
  }

  function linkSeasonChallenge(challenge, weekNum = 1) {
    if (!challenge) return;
    const banner = document.getElementById('sub-season-banner');
    const title = document.getElementById('sub-season-banner-title');
    const desc = document.getElementById('sub-season-banner-desc');
    const sId = document.getElementById('sub-season-id');
    const wNum = document.getElementById('sub-week-num');
    const cId = document.getElementById('sub-challenge-id');
    const rDesc = document.getElementById('sub-reward-desc');

    if (banner) banner.style.display = 'flex';
    if (title) title.textContent = `🏆 DESAFÍO VINCULADO: SEMANA ${weekNum} • ${challenge.route}`;
    if (desc) desc.textContent = `Regulación: ${challenge.carRestriction || 'Vehículo de competición'}`;

    if (sId) sId.value = 'season_2026';
    if (wNum) wNum.value = String(weekNum);
    if (cId) cId.value = challenge.id || '';
    if (rDesc) rDesc.value = challenge.reward || '';

    // Pre-populate route and car
    const routeSelect = document.getElementById('sub-route');
    if (routeSelect && challenge.route) {
      routeSelect.value = challenge.route;
    }
    const carInput = document.getElementById('sub-car');
    if (carInput && challenge.carRestriction) {
      carInput.value = challenge.carRestriction;
    }

    if (typeof window.switchView === 'function') {
      window.switchView('submit');
    }
  }

  // ==========================================
  // 2. PERFORMANCE GUIDES & TUNING WORKSHOP
  // ==========================================

  let currentTuningDrivetrainFilter = 'all';
  let currentTuningSearchQuery = '';

  function initTuningSection() {
    const carsData = typeof TUNING_CARS_DATA !== 'undefined' ? TUNING_CARS_DATA : (window.TUNING_CARS_DATA || []);
    if (!carsData || !carsData.length) return;

    const totalCount = carsData.length;
    const rwdCount = carsData.filter(c => c.drivetrain === 'RWD').length;
    const awdCount = carsData.filter(c => c.drivetrain === 'AWD').length;
    const fwdCount = carsData.filter(c => c.drivetrain === 'FWD').length;

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
    const carsData = typeof TUNING_CARS_DATA !== 'undefined' ? TUNING_CARS_DATA : (window.TUNING_CARS_DATA || []);
    if (!container || !carsData || !carsData.length) return;

    let filtered = carsData.slice();

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
        <div class="col-span-full text-center py-12 px-4 bg-surface-container-low rounded-2xl border border-surface-container-highest/60">
          <span class="material-symbols-outlined text-[48px] text-outline mb-2">directions_car</span>
          <p class="font-headline-sm text-base text-on-surface uppercase">No se encontraron coches con el filtro actual</p>
          <p class="font-body-sm text-outline mt-1">Prueba con otro término de búsqueda o selecciona "Todos".</p>
        </div>
      `;
      return;
    }

    filtered.forEach(car => {
      const card = document.createElement('div');
      card.className = 'bg-surface-container-low border border-surface-container-highest/60 rounded-2xl overflow-hidden shadow-xl flex flex-col hover:border-primary-container/60 transition-all duration-300 group';

      const renderSliderRow = (label, val, expl) => {
        let widthPct = 0;
        let leftPct = 50;
        let valColor = '#cbd5e1';

        if (val > 0) {
          widthPct = (val / 5) * 50;
          leftPct = 50;
          valColor = '#ff5500'; // nfs-orange
        } else if (val < 0) {
          const absVal = Math.abs(val);
          widthPct = (absVal / 5) * 50;
          leftPct = 50 - widthPct;
          valColor = '#00d0ff'; // cyan
        } else {
          widthPct = 0;
          leftPct = 50;
          valColor = '#94a3b8';
        }

        const displayVal = val > 0 ? `+${val}` : `${val}`;

        return `
          <div class="flex items-center justify-between gap-3 text-xs py-1" title="${expl || ''}">
            <span class="w-24 shrink-0 font-label-data text-outline truncate">${label}</span>
            <div class="relative flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div class="absolute top-0 bottom-0 left-1/2 w-0.5 bg-outline/40 z-10"></div>
              <div class="absolute top-0 bottom-0 rounded-full transition-all duration-300" style="left: ${leftPct}%; width: ${widthPct}%; background-color: ${valColor};"></div>
            </div>
            <span class="w-8 text-right font-label-data font-bold" style="color: ${valColor};">${displayVal}</span>
          </div>
        `;
      };

      const setup = car.tuningSetup || {};
      const expl = car.sliderExplanations || {};

      const slidersHTML = `
        ${renderSliderRow('Dirección', setup.steering || 0, expl.steering)}
        ${renderSliderRow('Manejo', setup.handling || 0, expl.handling)}
        ${renderSliderRow('Frenos', setup.brakes || 0, expl.brakes)}
        ${renderSliderRow('Altura', setup.rideHeight || 0, expl.rideHeight)}
        ${renderSliderRow('Aerodinámica', setup.aerodynamics || 0, expl.aerodynamics)}
        ${renderSliderRow('Nitro (NOS)', setup.nitrous || 0, expl.nitrous)}
        ${renderSliderRow('Turbo / Superc.', setup.turboSupercharger || 0, expl.turboSupercharger)}
      `;

      card.innerHTML = `
        <div class="relative h-48 bg-surface-container-lowest overflow-hidden border-b border-surface-container-highest/60">
          <img src="${car.image}" alt="${car.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='assets/img/bmw-m3-gtr.jpg'">
          <div class="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
          <div class="absolute top-3 left-3 bg-surface-container-lowest/80 backdrop-blur-md px-2.5 py-1 rounded font-label-hud text-[10px] text-primary-container font-black uppercase tracking-wider border border-surface-container-high">
            ${car.badge || 'COMPETICIÓN'}
          </div>
          <div class="absolute top-3 right-3 bg-surface-container-lowest/80 backdrop-blur-md px-2.5 py-1 rounded font-label-hud text-[10px] text-secondary font-black uppercase tracking-wider border border-surface-container-high">
            ${car.drivetrain} • ${car.drivetrainLabel || ''}
          </div>
          <div class="absolute bottom-3 left-3 right-3">
            <h3 class="font-headline-sm text-lg text-on-surface uppercase font-black tracking-wide leading-tight">${car.name}</h3>
            <span class="font-label-data text-xs text-outline">${car.engine || ''}</span>
          </div>
        </div>

        <div class="p-4 flex-1 flex flex-col justify-between space-y-4">
          <p class="font-body-sm text-xs text-outline leading-relaxed">${car.description || ''}</p>

          <!-- Sliders Grid -->
          <div class="bg-surface-container-lowest/70 border border-surface-container-highest/40 rounded-xl p-3 space-y-1">
            <div class="text-[10px] font-label-hud text-outline uppercase tracking-wider mb-1.5 flex justify-between">
              <span>SETTING DE TELEMETRÍA</span>
              <span class="text-primary-container font-bold">100% RECOMENDADO</span>
            </div>
            ${slidersHTML}
          </div>

          <!-- Specialties & Tips -->
          <div class="space-y-2 pt-2 border-t border-surface-container-highest/40 text-xs">
            <div class="flex items-start gap-2">
              <span class="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">verified</span>
              <div>
                <strong class="text-on-surface font-headline-sm uppercase text-[11px]">Especialidad: </strong>
                <span class="text-outline">${car.trackSpecialty || 'General'}</span>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <span class="material-symbols-outlined text-tertiary text-[16px] shrink-0 mt-0.5">tips_and_updates</span>
              <div>
                <strong class="text-on-surface font-headline-sm uppercase text-[11px]">Pro Tip: </strong>
                <span class="text-outline">${car.proTips || 'Mantener revoluciones altas.'}</span>
              </div>
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  function filterTuningCars() {
    const input = document.getElementById('tuning-search-input');
    currentTuningSearchQuery = input ? input.value : '';
    renderTuningGuides(currentTuningDrivetrainFilter, currentTuningSearchQuery);
  }

  function setTuningDrivetrainFilter(drivetrain, btn) {
    currentTuningDrivetrainFilter = drivetrain;
    document.querySelectorAll('.tuning-filter-btn').forEach(b => {
      b.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-bold');
      b.classList.add('bg-surface-container-high', 'text-outline');
    });
    if (btn) {
      btn.classList.add('bg-primary-container', 'text-on-primary-container', 'font-bold');
      btn.classList.remove('bg-surface-container-high', 'text-outline');
    }
    renderTuningGuides(currentTuningDrivetrainFilter, currentTuningSearchQuery);
  }

  // ==========================================
  // 3. ROCKPORT GPS LIVE SATELLITE MAP
  // ==========================================

  let currentMapZoom = 1.0;

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
    document.querySelectorAll('.district-pill').forEach(b => {
      b.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-bold');
      b.classList.add('bg-surface-container-high', 'text-outline');
    });
    if (btn) {
      btn.classList.add('bg-primary-container', 'text-on-primary-container', 'font-bold');
      btn.classList.remove('bg-surface-container-high', 'text-outline');
    }

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

    const coords = {
      rosewood: { x: 300, y: 350, zoom: 1.5, name: 'ROSEWOOD // CONDADO RESIDENCIAL' },
      downtown: { x: 750, y: 700, zoom: 1.6, name: 'DOWNTOWN ROCKPORT // DISTRITO METROPOLITANO' },
      camden: { x: 250, y: 800, zoom: 1.5, name: 'CAMDEN BEACH & POINT // COSTA INDUSTRIAL' }
    };

    const target = coords[districtKey];
    if (target) {
      currentMapZoom = target.zoom;
      stage.style.transform = `scale(${currentMapZoom})`;
      panContainer.scrollTo({ top: target.y, left: target.x, behavior: 'smooth' });
      if (indicator) indicator.textContent = target.name;
      if (zoomBadge) zoomBadge.textContent = `ZOOM: ${Math.round(currentMapZoom * 100)}%`;
    }
  }

  // ==========================================
  // 4. DRIVER DOSSIER SEARCH UI
  // ==========================================

  async function searchDriverProfile(driverQuery) {
    if (!driverQuery || driverQuery.trim() === '') return null;
    const cleanQuery = driverQuery.trim().toLowerCase();

    const routes = typeof routesData !== 'undefined' ? routesData : (window.routesData || []);
    let matchDriverName = null;
    const driverTracks = [];
    const stats = { first: 0, second: 0, third: 0, total: 0 };

    // Try finding exact or partial match in DEFAULT_BLACKLIST_DRIVERS first
    const defaultDrivers = window.DEFAULT_BLACKLIST_DRIVERS || [];
    const foundDefault = defaultDrivers.find(d =>
      d.name.toLowerCase() === cleanQuery ||
      d.alias.toLowerCase() === cleanQuery ||
      d.name.toLowerCase().includes(cleanQuery) ||
      d.alias.toLowerCase().includes(cleanQuery)
    );

    if (foundDefault) {
      matchDriverName = foundDefault.alias || foundDefault.name;
      stats.first = foundDefault.bestTimes?.first || foundDefault.victories?.p1 || 0;
      stats.second = foundDefault.bestTimes?.second || foundDefault.victories?.p2 || 0;
      stats.third = foundDefault.bestTimes?.third || foundDefault.victories?.p3 || 0;
      stats.total = stats.first + stats.second + stats.third;
    }

    // Now query tracks from routesData records and Firebase
    routes.forEach(route => {
      const records = route.records || {};
      ['junkman_single', 'bmw_m3_gtr', 'stock'].forEach(catKey => {
        const catList = records[catKey] || [];
        catList.forEach((r, rankIdx) => {
          if (!r.driver) return;
          const rDriver = r.driver.trim();
          if (rDriver.toLowerCase().includes(cleanQuery) || (matchDriverName && rDriver.toLowerCase() === matchDriverName.toLowerCase())) {
            if (!matchDriverName) matchDriverName = rDriver;
            const rank = r.rank || (rankIdx + 1);
            if (!foundDefault) {
              if (rank === 1) stats.first++;
              else if (rank === 2) stats.second++;
              else if (rank === 3) stats.third++;
              stats.total++;
            }
            driverTracks.push({
              routeName: route.name || 'Ruta General',
              routeType: route.type || 'Carrera',
              category: catKey.replace('_', ' ').toUpperCase(),
              rank: `#${rank}`,
              time: r.time || '--:--.---',
              car: r.car || 'BMW M3 GTR',
              gearbox: r.gearbox || 'Manual'
            });
          }
        });
      });
    });

    if (!matchDriverName && driverTracks.length === 0) return null;

    return {
      driver: matchDriverName || driverQuery.toUpperCase(),
      stats,
      tracks: driverTracks
    };
  }

  function renderDriverSearchUI(containerId = 'search-driver-wrapper') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="bg-surface-container-low border border-surface-container-highest/60 rounded-2xl p-6 shadow-2xl">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-outlined text-primary-container text-[22px]">manage_search</span>
          <h3 class="font-headline-sm text-lg text-on-surface uppercase tracking-wide">Consultar Expediente y Telemetría de Piloto</h3>
        </div>
        <p class="font-body-sm text-outline mb-4">Ingresa el alias del corredor para consultar podios, tiempos récord y rutas dominadas.</p>
        <div class="flex flex-col sm:flex-row gap-3">
          <input type="text" id="driver-search-input" placeholder="Nombre o alias del piloto (ej: ZimanX, MysticX, DJALIL)..." class="flex-1 bg-surface-container-high border border-surface-container-highest text-on-surface rounded-xl px-4 py-3 focus:border-primary-container focus:outline-none font-body-md text-sm">
          <button id="btn-search-driver" class="bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-headline-sm text-sm uppercase px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0">
            <span class="material-symbols-outlined text-[18px]">search</span>
            <span>BUSCAR EXPEDIENTE</span>
          </button>
        </div>
        <div id="driver-results-container" class="mt-6"></div>
      </div>
    `;

    const btn = document.getElementById('btn-search-driver');
    const input = document.getElementById('driver-search-input');

    const executeSearch = async () => {
      const resultsEl = document.getElementById('driver-results-container');
      if (!resultsEl || !input) return;
      const q = input.value.trim();
      if (!q) {
        resultsEl.innerHTML = `<p class="font-headline-sm text-sm text-outline py-2">Escribe un nombre de piloto para iniciar la búsqueda.</p>`;
        return;
      }

      resultsEl.innerHTML = `
        <div class="flex items-center gap-3 text-primary-container font-headline-sm py-4">
          <span class="material-symbols-outlined animate-spin text-[20px]">sync</span>
          <span>CONSULTANDO EXPEDIENTE Y TELEMETRÍA OFICIAL...</span>
        </div>
      `;

      const profile = await searchDriverProfile(q);
      if (!profile) {
        resultsEl.innerHTML = `
          <div class="bg-surface-container-lowest/80 border border-surface-container-highest/60 rounded-xl p-4 text-center text-outline">
            <span class="material-symbols-outlined text-[36px] text-outline mb-1">person_search</span>
            <p class="font-headline-sm text-sm text-on-surface uppercase">No se encontraron registros activos para "${escapeHtml(q)}"</p>
            <p class="font-body-sm text-xs text-outline mt-1">Verifica el nombre o asegúrate de que el piloto haya registrado marcas oficiales.</p>
          </div>
        `;
        return;
      }

      let tracksHtml = profile.tracks.length > 0 ? profile.tracks.map(t => `
        <tr class="border-b border-surface-container-highest/40 hover:bg-surface-container-high/40 transition-colors">
          <td class="py-3 px-4 font-headline-sm text-sm text-on-surface uppercase">${escapeHtml(t.routeName)} <span class="text-xs text-outline font-normal">(${escapeHtml(t.routeType)})</span></td>
          <td class="py-3 px-4 font-headline-sm text-sm text-primary-container font-bold">${escapeHtml(t.rank)}</td>
          <td class="py-3 px-4 font-label-data text-sm font-bold text-secondary">${escapeHtml(t.time)}</td>
          <td class="py-3 px-4 font-label-data text-xs text-on-surface-variant">${escapeHtml(t.car)}</td>
          <td class="py-3 px-4 font-label-hud text-xs text-outline uppercase">${escapeHtml(t.gearbox)}</td>
        </tr>
      `).join('') : `<tr><td colspan="5" class="text-center py-6 text-outline font-body-sm">Sin carreras registradas en memoria estática aún.</td></tr>`;

      resultsEl.innerHTML = `
        <div class="bg-surface-container-high/80 border-l-4 border-primary-container rounded-xl p-5 mb-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary-container text-[24px]">verified</span>
              <h2 class="font-headline-xl text-xl text-on-surface uppercase font-black">${escapeHtml(profile.driver)}</h2>
            </div>
            <span class="font-label-hud text-xs text-outline uppercase tracking-wider">EXPEDIENTE CERTIFICADO ROCKPORT PD // TELEMETRÍA HOMOLOGADA</span>
          </div>
          <div class="flex items-center gap-3 font-headline-sm text-sm flex-wrap">
            <span class="px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">🥇 1ROS: ${profile.stats.first}</span>
            <span class="px-3 py-1.5 rounded-lg bg-slate-300/10 text-slate-300 border border-slate-300/30">🥈 2DOS: ${profile.stats.second}</span>
            <span class="px-3 py-1.5 rounded-lg bg-amber-600/10 text-amber-500 border border-amber-600/30">🥉 3ROS: ${profile.stats.third}</span>
            <span class="px-3 py-1.5 rounded-lg bg-primary-container/10 text-primary-container border border-primary-container/30 font-bold">TOTAL PODIOS: ${profile.stats.total}</span>
          </div>
        </div>

        <div class="overflow-x-auto rounded-xl border border-surface-container-highest/60 bg-surface-container-lowest/60">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-high/80 border-b border-surface-container-highest/60 text-[11px] font-label-hud uppercase tracking-wider text-outline">
                <th class="py-3 px-4">RUTA</th>
                <th class="py-3 px-4">POSICIÓN</th>
                <th class="py-3 px-4">TIEMPO</th>
                <th class="py-3 px-4">COCHE</th>
                <th class="py-3 px-4">TRANSMISIÓN</th>
              </tr>
            </thead>
            <tbody>
              ${tracksHtml}
            </tbody>
          </table>
        </div>
      `;
    };

    if (btn) btn.onclick = executeSearch;
    if (input) input.onkeyup = (e) => { if (e.key === 'Enter') executeSearch(); };
  }

  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ==========================================
  // EXPORT TO WINDOW
  // ==========================================

  window.handleTimeSubmit = handleTimeSubmit;
  window.initSubmitRouteSelector = initSubmitRouteSelector;
  window.openSubmissionSuccessModal = openSubmissionSuccessModal;
  window.closeSubmissionSuccessModal = closeSubmissionSuccessModal;
  window.unlinkSeasonChallenge = unlinkSeasonChallenge;
  window.linkSeasonChallenge = linkSeasonChallenge;

  window.initTuningSection = initTuningSection;
  window.renderTuningGuides = renderTuningGuides;
  window.filterTuningCars = filterTuningCars;
  window.setTuningDrivetrainFilter = setTuningDrivetrainFilter;

  window.zoomMap = zoomMap;
  window.resetMapZoom = resetMapZoom;
  window.toggleMapFullscreen = toggleMapFullscreen;
  window.focusMapDistrict = focusMapDistrict;

  window.renderDriverSearchUI = renderDriverSearchUI;
  window.searchDriverProfile = searchDriverProfile;

  // Auto-init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    initSubmitRouteSelector();
    initTuningSection();
    renderDriverSearchUI('search-driver-wrapper');
  });

})();
