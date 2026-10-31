/**
 * UI Interactions & Universal Cyber-Glitch System (NFSRANKSMW)
 * Need for Speed: Most Wanted Theme (Orange & Purple Dual-State Glitch)
 */

function initUniversalGlitchSystem() {
  const targetSelectors = [
    '.nav-link', '.nav-link-glitch', '.navbar-item', '.dropdown-menu a', '.submenu-item', '.dropdown-glitch-item',
    'button:not(.no-glitch)', '.btn:not(.no-glitch)', '.glitch-nfs-btn',
    '.track-filter-pill', '.setup-pill', '.week-tab', '.group-tab',
    '.sidebar-category-item', '.sidebar-btn', '.filter-pill-btn',
    '.champ-leaderboard-btn', '.stage-action-btn',
    '.stitch-video-btn', '.stitch-leaderboard-btn',
    '.btn-uiverse-create', '.btn-back-to-tracks', '.create-dropdown-item',
    '.btn-filter-group', '.btn-filter-group-routes', '.btn-leaderboard',
    '.past-bracket-btn', '.pagination-btn', '.standings-pagination-btn',
    '.btn-export-standings',
    // Catálogo oficial, semanas, standings, grupos & rivales, Hall of Fame
    '.champ-filter-group-btn', '.torneo-group-pill', '.glitch-pill-btn',
    '.tuning-filter-btn', '.member-filter-chip', '.theme-stage-btn', '.btn-map-control',
    'button[data-champ-week]', 'button[data-season-week]', 'button[data-season-id]', 'button[data-season-mode]',
    'button[data-season-subview]', 'button[data-standings-mode]', 'button[data-champ-group-tab]',
    'button[data-select-champ-group]', 'button[data-lb-tab]',
    'button[data-cockpit-filter]', 'button[data-torneo-tab]', 'button[data-hof-tab]', 'button[data-tel-type]',
    'button[data-select-pilot]', 'button[data-toggle-ch-done]', 'button[data-torneo-jump]',
    'button[data-routes-cat]', 'button[data-routes-district]', 'button[data-home-cat]',
    'button[data-cockpit-select-rank]', '.v7-roster-item'
  ];

  const whiteCtaSelectors = [
    '.btn-nfs-white-cta',
    '.btn-table-video',
    '.v7-group-footer-btn',
    '#view-download .btn-download-primary',
    '#view-download .btn-download-radmin',
    '#view-download .btn-download-fix',
    '.nfsmwo-floating-cta'
  ];

  // Asegurar que los botones principales de las secciones web, tarjetas y tablas tengan el estilo blanco/negro "JUGAR EN LÍNEA"
  document.querySelectorAll(whiteCtaSelectors.join(', ')).forEach(el => {
    el.classList.remove('glitch-nfs-btn', 'btn-squid-orange');
    el.classList.add('no-glitch');
    if (!el.classList.contains('btn-nfs-white-cta')) {
      el.classList.add('btn-nfs-white-cta');
    }
  });

  document.querySelectorAll(targetSelectors.join(', ')).forEach(el => {
    if (
      el.tagName === 'INPUT' ||
      el.tagName === 'SELECT' ||
      el.tagName === 'TR' ||
      el.classList.contains('no-glitch') ||
      el.classList.contains('btn-nfs-white-cta') ||
      el.classList.contains('stitch-video-btn') ||
      el.classList.contains('stitch-leaderboard-btn') ||
      el.classList.contains('btn-table-video') ||
      el.classList.contains('v7-group-footer-btn') ||
      el.classList.contains('nfsmwo-floating-minimize') ||
      el.classList.contains('nfsmwo-floating-pill') ||
      el.classList.contains('modal-close-btn') ||
      el.classList.contains('nfs-sub-modal-close') ||
      el.classList.contains('btn-mobile-drawer-close') ||
      el.classList.contains('btn-mobile-nav-toggle') ||
      el.classList.contains('discord-floating-close')
    ) return;
    // Remove legacy squid sliding spans so they never cover the glitch layer
    el.querySelectorAll(':scope > .squid-layer').forEach(s => s.remove());
    el.classList.remove('btn-squid-orange');

    if (!el.classList.contains('glitch-nfs-btn') && !el.classList.contains('nav-link-glitch') && !el.classList.contains('dropdown-glitch-item')) {
      el.classList.add('glitch-nfs-btn');
    }

    // Si ya tiene un data-text válido asignado, respetarlo; de lo contrario, extraerlo limpiando SVGs/badges
    let label = el.getAttribute('data-text');
    if (!label || label.trim() === '') {
      const clone = el.cloneNode(true);
      clone.querySelectorAll('svg, img, .uiverse-menu-icon-box, .submenu-icon, .sidebar-badge-count, .nav-chevron, .btn-hover-arrow, .filter-badge-count, .create-dropdown-tag').forEach(node => node.remove());
      label = clone.textContent.trim().replace(/\s+/g, ' ');
    }
    if (label && el.getAttribute('data-text') !== label) {
      el.setAttribute('data-text', label);
    }
  });
}

// Ejecutar al cargar la página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUniversalGlitchSystem);
} else {
  initUniversalGlitchSystem();
}

// Observer para elementos dinámicos inyectados por Firebase o cloner
let isGlitchScanScheduled = false;
const dynamicGlitchObserver = new MutationObserver(() => {
  if (isGlitchScanScheduled) return;
  isGlitchScanScheduled = true;
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => {
      initUniversalGlitchSystem();
      isGlitchScanScheduled = false;
    });
  } else {
    setTimeout(() => {
      initUniversalGlitchSystem();
      isGlitchScanScheduled = false;
    }, 20);
  }
});

const observeTarget = document.body || document.documentElement;
if (observeTarget) {
  dynamicGlitchObserver.observe(observeTarget, {
    childList: true,
    subtree: true
  });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    dynamicGlitchObserver.observe(document.body, { childList: true, subtree: true });
  });
}

// Exponer funciones globalmente
window.initUniversalGlitchSystem = initUniversalGlitchSystem;
window.applyGlitchEffectToAllButtons = initUniversalGlitchSystem;
window.initAllInteractiveButtons = initUniversalGlitchSystem;
window.initGlitchDataText = initUniversalGlitchSystem;

/**
 * ============================================================================
 * NFSMWO FLOATING DRAWER WIDGET (ESTILO DISCORD PILL // SESIÓN INICIO)
 * ============================================================================
 */
function toggleNfsmwoFloatingDrawer(event, forceState) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const container = document.getElementById('nfsmwo-floating-container');
  const trigger = document.getElementById('nfsmwo-floating-btn');
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

// Cierre al hacer click fuera del contenedor de NFSMWO
document.addEventListener('click', function (e) {
  const container = document.getElementById('nfsmwo-floating-container');
  if (container && container.classList.contains('open')) {
    if (!container.contains(e.target)) {
      toggleNfsmwoFloatingDrawer(null, false);
    }
  }
});

// Cierre al presionar la tecla Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const container = document.getElementById('nfsmwo-floating-container');
    if (container && container.classList.contains('open')) {
      toggleNfsmwoFloatingDrawer(null, false);
    }
  }
});

// Exposición global
window.toggleNfsmwoFloatingDrawer = toggleNfsmwoFloatingDrawer;
window.toggleNfsmwoPromo = toggleNfsmwoFloatingDrawer;
