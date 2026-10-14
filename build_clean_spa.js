const fs = require('fs');
const path = require('path');

console.log('=== Building Clean SPA index.html with Home BG, Routes Filtering & Firebase Leaderboards ===');

// Helper to read code.html
function getHtml(folder) {
  const p = path.join('stitch_nfs_mw_ranks_v7', folder, 'code.html');
  return fs.readFileSync(p, 'utf8');
}

// Helper to extract inner main
function getInnerMain(folder) {
  const html = getHtml(folder);
  const start = html.indexOf('<main');
  if (start === -1) return '';
  const innerStart = html.indexOf('>', start) + 1;
  const end = html.indexOf('</main>', innerStart);
  return html.substring(innerStart, end);
}

// 1. Read master template from Home
const homeHtml = getHtml('nfsmw_ranks_redise_o_de_home');

// Extract head
const headStart = homeHtml.indexOf('<head>');
const headEnd = homeHtml.indexOf('</head>') + 7;
let headContent = homeHtml.substring(headStart + 6, headEnd - 7);

// Add view-section css rule and mobile/laptop helper
const customStyles = `
  <style>
    .view-section { display: none; }
    .view-section.active { display: block; }
    @media (max-width: 1535px) {
      nav[data-active-classes] { display: flex !important; flex-wrap: wrap; }
    }
  </style>
`;
headContent += customStyles;

// 2. Build the Navigation Header with pure Stitch markup and non-intrusive data-action / id anchors
const headerHtml = `
<header class="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
  <div class="hidden lg:block bg-surface-container-low px-gutter-lg">
    <div class="w-full flex items-center justify-between h-7">
      <div class="flex items-center gap-space-lg">
        <div class="flex items-center gap-space-xs">
          <span class="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          <span class="font-label-hud text-label-hud text-primary uppercase">ROCKPORT EN VIVO</span>
          <span class="font-label-data text-label-data text-on-surface-variant">// TKR: 128Hz</span>
          <span class="font-label-data text-label-data text-tertiary">RTT: 12ms</span>
        </div>
        <div class="flex items-center gap-space-xs">
          <span class="font-label-hud text-label-hud text-outline">HEAT LEVEL POLICE RADAR:</span>
          <span class="font-label-data text-label-data text-secondary">CONDICION 5 - STATE PATROL POLICE RADIO ACTIVE</span>
        </div>
      </div>
      <div class="flex items-center gap-space-md">
        <span class="font-label-hud text-label-hud text-outline">GLOBAL V5.12 SPEEDRUN PROTOCOL</span>
        <span class="font-label-data text-label-data text-primary-container">SYNC OK</span>
      </div>
    </div>
  </div>

  <div class="h-20 w-full px-gutter-lg flex items-center justify-between gap-space-md">
    <div class="flex items-center gap-space-lg shrink-0">
      <a class="flex items-center gap-space-sm group cursor-pointer" href="#home" data-action="navigate" data-target="home">
        <img alt="Brand logo. - Primary color: #ffb800 - Font: chivo - Mode: dark - Roundness: rounded-lg" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1U0BusLDj07Q3GnZw_xdgavHc0KuvDl2siSzG3Za8fkR_NqGMW-Oo8i1pQad4EAsIvNOAeQqZCY5gF3e6COlctZ6B2BzHnULOk25InyKmE1iK_sNyI5yFIj6kd-EapjqTRJDOd9MSQVXo-sISbJLlDqHX4rOr715Sue3O3y1oFHzBCW-oeBpSsZ9r76HoGRfynsi0njGc-zlzmydKvXQeKyk9GDHVLTcwN7g_bDwwp7LhAMSXHk0noFDq8"/>
        <div class="flex flex-col">
          <span class="font-headline-sm text-headline-sm text-on-surface uppercase tracking-tight group-hover:text-primary transition-colors">NFSMW<span class="text-primary-container ml-1">RANKS</span></span>
          <span class="font-label-hud text-label-hud text-outline uppercase">BLACK EDITION TELEMETRY</span>
        </div>
      </a>
      <div class="hidden xl:flex items-center relative">
        <div class="relative flex items-center">
          <span class="material-symbols-outlined text-outline absolute left-3 pointer-events-none text-[18px]">search</span>
          <input id="global-search-input" class="bg-surface-container pl-9 pr-14 py-2 w-72 text-on-surface placeholder:text-outline-variant font-label-data text-label-data focus:outline-none focus:bg-surface-container-high transition-all" placeholder="Buscar piloto, circuito, clase de coche..." type="text"/>
          <kbd class="absolute right-2 px-1.5 py-0.5 bg-surface-container-highest text-outline font-label-data text-label-data">Ctrl+K</kbd>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar (100% Pure Stitch Classes & Structure) -->
    <nav id="main-nav" class="hidden 2xl:flex items-center gap-space-xs" data-active-classes="text-on-primary-container bg-primary-container font-headline-sm font-bold">
      <a id="nav-home" aria-current="page" class="px-3 py-2 tracking-widest uppercase transition-colors text-on-primary-container bg-primary-container font-headline-sm font-bold cursor-pointer" data-path="hogar" data-action="navigate" data-target="home" href="#home">HOGAR</a>
      
      <a id="nav-leaderboard" class="px-3 py-2 font-headline-sm text-label-hud tracking-widest uppercase transition-colors text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high cursor-pointer" data-path="tablas-de-clasificacion" data-action="navigate" data-target="leaderboard" href="#leaderboard">TABLAS DE CLASIFICACIÓN</a>
      
      <a id="nav-routes-pistas" class="px-3 py-2 font-headline-sm text-label-hud tracking-widest uppercase transition-colors text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high cursor-pointer" data-path="rutas-y-circuitos" data-action="navigate" data-target="routes-pistas" href="#routes-pistas">RUTAS &amp; CIRCUITOS</a>
      
      <a id="nav-blacklist" class="px-3 py-2 font-headline-sm text-label-hud tracking-widest uppercase transition-colors text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high cursor-pointer" data-path="torneos-y-blacklist" data-action="navigate" data-target="blacklist" href="#blacklist">TORNEOS &amp; BLACKLIST</a>
      
      <a id="nav-telemetria" class="px-3 py-2 font-headline-sm text-label-hud tracking-widest uppercase transition-colors text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high cursor-pointer" data-path="telemetria" data-action="navigate" data-target="telemetria" href="#telemetria">TELEMETRÍA</a>
      
      <!-- Dropdown Comunidad -->
      <div class="relative group">
        <a id="nav-community" class="px-3 py-2 font-headline-sm text-label-hud tracking-widest uppercase transition-colors text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high flex items-center gap-1 cursor-pointer" data-path="comunidad" data-action="navigate" data-target="community" href="#community">
          <span>COMUNIDAD</span>
          <span class="material-symbols-outlined text-[16px] transition-transform group-hover:rotate-180">expand_more</span>
        </a>
        <div class="absolute left-0 top-full hidden group-hover:flex flex-col min-w-[220px] bg-surface-container-high/95 backdrop-blur-md shadow-2xl p-2 border border-surface-container-highest/60 z-50">
          <a href="#halloffame" data-action="navigate" data-target="halloffame" class="px-3 py-2 font-headline-sm text-body-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-highest uppercase flex items-center gap-2 transition-colors">
            <span class="material-symbols-outlined text-[18px] text-primary-container">stars</span>
            <span>Salón de la Fama</span>
          </a>
          <a href="#guides" data-action="navigate" data-target="guides" class="px-3 py-2 font-headline-sm text-body-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-highest uppercase flex items-center gap-2 transition-colors">
            <span class="material-symbols-outlined text-[18px] text-primary-container">tune</span>
            <span>Guías de Tuning</span>
          </a>
          <a href="#rules" data-action="navigate" data-target="rules" class="px-3 py-2 font-headline-sm text-body-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-highest uppercase flex items-center gap-2 transition-colors">
            <span class="material-symbols-outlined text-[18px] text-primary-container">gavel</span>
            <span>Reglamento Oficial</span>
          </a>
          <a href="#map" data-action="navigate" data-target="map" class="px-3 py-2 font-headline-sm text-body-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-highest uppercase flex items-center gap-2 transition-colors">
            <span class="material-symbols-outlined text-[18px] text-primary-container">map</span>
            <span>Mapa Táctico</span>
          </a>
          <a href="#download" data-action="navigate" data-target="download" class="px-3 py-2 font-headline-sm text-body-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-highest uppercase flex items-center gap-2 transition-colors">
            <span class="material-symbols-outlined text-[18px] text-primary-container">download</span>
            <span>Centro de Descargas</span>
          </a>
          <a href="#submit" data-action="navigate" data-target="submit" class="px-3 py-2 font-headline-sm text-body-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-highest uppercase flex items-center gap-2 transition-colors">
            <span class="material-symbols-outlined text-[18px] text-primary-container">upload_file</span>
            <span>Subir Registro</span>
          </a>
          <a href="#challenges" data-action="navigate" data-target="challenges" class="px-3 py-2 font-headline-sm text-body-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-highest uppercase flex items-center gap-2 transition-colors">
            <span class="material-symbols-outlined text-[18px] text-primary-container">flag</span>
            <span>Desafíos & Retos</span>
          </a>
          <a href="#cockpit" data-action="navigate" data-target="cockpit" class="px-3 py-2 font-headline-sm text-body-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-highest uppercase flex items-center gap-2 transition-colors">
            <span class="material-symbols-outlined text-[18px] text-primary-container">speed</span>
            <span>Tactical Cockpit</span>
          </a>
        </div>
      </div>
    </nav>

    <div class="flex items-center gap-space-md shrink-0">
      <a class="hidden sm:flex items-center gap-space-xs px-3 py-1.5 bg-surface-container text-tertiary hover:bg-surface-container-high hover:text-on-surface transition-all" href="https://discord.com" target="_blank">
        <span class="material-symbols-outlined text-[18px]">forum</span>
        <span class="font-label-hud text-label-hud tracking-widest uppercase">DISCORD</span>
      </a>
      <div class="flex items-center gap-space-sm pl-space-sm bg-surface-container-low p-1">
        <div class="text-right hidden md:block">
          <div class="flex items-center justify-end gap-1">
            <span class="font-headline-sm text-body-sm text-primary uppercase">RAZOR #01</span>
            <span class="bg-secondary-container px-1 text-[10px] font-label-data text-on-surface uppercase">BLACKLIST</span>
          </div>
          <div class="font-label-data text-label-data text-outline">BMW M3 GTR E46 // 01:14.28</div>
        </div>
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </div>
      </div>
    </div>
  </div>
</header>
`;

// 3. Process views
console.log('Extracting inner main sections from Stitch screens and enhancing components...');

// Home View: Add background image to hero section
let homeMain = getInnerMain('nfsmw_ranks_redise_o_de_home');
homeMain = homeMain.replace(
  '<section class="relative w-full overflow-hidden bg-surface-container-lowest py-space-xl lg:py-28">',
  '<section class="relative w-full overflow-hidden bg-surface-container-lowest py-space-xl lg:py-28" style="background-image: linear-gradient(180deg, rgba(11, 14, 21, 0.85) 0%, rgba(11, 14, 21, 0.50) 40%, rgba(11, 14, 21, 0.95) 100%), url(\'assets/img/hero-bmw-m3-gtr-banner.jpg\'); background-size: cover; background-position: center 30%; background-repeat: no-repeat;">'
);

// Routes View: Add IDs and attributes for filters & cards container
let rutasMain = getInnerMain('nfsmw_ranks_redise_o_de_rutas');

// Category filter buttons
rutasMain = rutasMain.replace(
  '<div class="flex items-center gap-1 bg-surface-container-low p-1 rounded">',
  '<div class="flex items-center gap-1 bg-surface-container-low p-1 rounded" id="routes-category-filters">'
);

rutasMain = rutasMain.replace(
  '<button class="px-space-sm py-1 bg-primary-container text-on-primary font-label-hud text-label-hud uppercase rounded font-bold transition-all shadow-[0_0_12px_rgba(255,184,0,0.4)]">\n              TODOS (86)\n            </button>',
  '<button id="btn-filter-all" data-cat="all" class="px-space-sm py-1 bg-primary-container text-on-primary font-label-hud text-label-hud uppercase rounded font-bold transition-all shadow-[0_0_12px_rgba(255,184,0,0.4)]">\n              TODOS (86)\n            </button>'
);

rutasMain = rutasMain.replace(
  '<button class="px-space-sm py-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-hud text-label-hud uppercase rounded transition-all">\n              CIRCUITOS (34)\n            </button>',
  '<button id="btn-filter-circuit" data-cat="Circuito" class="px-space-sm py-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-hud text-label-hud uppercase rounded transition-all">\n              CIRCUITOS (29)\n            </button>'
);

rutasMain = rutasMain.replace(
  '<button class="px-space-sm py-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-hud text-label-hud uppercase rounded transition-all">\n              SPRINTS (31)\n            </button>',
  '<button id="btn-filter-sprint" data-cat="Sprint" class="px-space-sm py-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-hud text-label-hud uppercase rounded transition-all">\n              SPRINTS (46)\n            </button>'
);

rutasMain = rutasMain.replace(
  '<button class="px-space-sm py-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-hud text-label-hud uppercase rounded transition-all">\n              DRAGS (12)\n            </button>',
  '<button id="btn-filter-drag" data-cat="Drag" class="px-space-sm py-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-hud text-label-hud uppercase rounded transition-all">\n              DRAGS (11)\n            </button>'
);

// Search input
rutasMain = rutasMain.replace(
  '<input class="w-full bg-surface-container-low pl-9 pr-14 py-2 rounded font-label-data text-label-data text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-high transition-colors" placeholder="Buscar por trazado, récord o coche..." type="text"/>',
  '<input id="routes-search-input" class="w-full bg-surface-container-low pl-9 pr-14 py-2 rounded font-label-data text-label-data text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-high transition-colors" placeholder="Buscar por trazado, récord o coche..." type="text"/>'
);

// Counter
rutasMain = rutasMain.replace(
  '<span class="font-label-data text-label-data text-on-surface-variant">Mostrando 6 de 86 circuitos</span>',
  '<span id="routes-showing-counter" class="font-label-data text-label-data text-on-surface-variant">Mostrando 86 de 86 circuitos</span>'
);

// Grid cards container
rutasMain = rutasMain.replace(
  '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">',
  '<div id="routes-cards-container" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">'
);

// Leaderboard View: Add IDs and attributes for live Firebase table
let lbMain = getInnerMain('nfsmw_ranks_leaderboard_de_ruta_city_perimeter');

// Breadcrumb
lbMain = lbMain.replace(
  '<span class="text-primary-container font-bold uppercase">CITY PERIMETER</span>',
  '<span id="leaderboard-breadcrumb-track" class="text-primary-container font-bold uppercase">CITY PERIMETER</span>'
);

// Category badge
lbMain = lbMain.replace(
  '<span class="text-on-surface-variant">CIRCUITO</span>',
  '<span id="leaderboard-track-category" class="text-on-surface-variant">CIRCUITO</span>'
);

// Return button
lbMain = lbMain.replace(
  '<a class="inline-flex items-center gap-space-xs px-3 py-1.5 bg-surface-container hover:bg-surface-container-high transition-colors rounded" href="#">\n<span class="material-symbols-outlined text-[16px] text-primary">arrow_back</span>\n<span class="font-label-hud text-label-hud uppercase tracking-widest text-on-surface">VOLVER AL ÍNDICE DE RUTAS</span>\n</a>',
  '<a id="leaderboard-back-btn" class="inline-flex items-center gap-space-xs px-3 py-1.5 bg-surface-container hover:bg-surface-container-high transition-colors rounded cursor-pointer" href="#routes-pistas" data-action="navigate" data-target="routes-pistas">\n<span class="material-symbols-outlined text-[16px] text-primary">arrow_back</span>\n<span class="font-label-hud text-label-hud uppercase tracking-widest text-on-surface">VOLVER AL ÍNDICE DE RUTAS</span>\n</a>'
);

// Main track name in hero
lbMain = lbMain.replace(
  '<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-secondary-container">CITY PERIMETER</span>',
  '<span id="leaderboard-track-name" class="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-secondary-container">CITY PERIMETER</span>'
);

// Hero WR elements
lbMain = lbMain.replace(
  '<span class="font-label-timer-lg text-label-timer-lg text-on-surface">01:20.750</span>',
  '<span id="leaderboard-hero-wr-time" class="font-label-timer-lg text-label-timer-lg text-on-surface">01:20.750</span>'
);
lbMain = lbMain.replace(
  '<span class="text-primary font-bold">Lea4Speed0</span>',
  '<span id="leaderboard-hero-wr-driver" class="text-primary font-bold">Lea4Speed0</span>'
);
lbMain = lbMain.replace(
  '<span>Porsche Carrera GT [Junkman]</span>',
  '<span id="leaderboard-hero-wr-car">Porsche Carrera GT [Junkman]</span>'
);

// Category tabs
lbMain = lbMain.replace(
  '<div class="flex flex-wrap items-center gap-1 bg-surface-container-lowest p-1 rounded-lg">',
  '<div id="leaderboard-category-tabs" class="flex flex-wrap items-center gap-1 bg-surface-container-lowest p-1 rounded-lg">'
);

// Table body
lbMain = lbMain.replace(
  '<tbody class="divide-y divide-surface-container-high text-body-sm font-body-sm">',
  '<tbody id="leaderboard-tbody" class="divide-y divide-surface-container-high text-body-sm font-body-sm">'
);

const views = [
  { id: 'view-home', content: homeMain, active: true },
  { id: 'view-leaderboard', content: lbMain },
  { id: 'view-routes-pistas', content: rutasMain },
  { id: 'view-blacklist', folder: 'nfsmw_ranks_blacklist_2026_standings' },
  { id: 'view-challenges', folder: 'nfsmw_ranks_blacklist_event_2026_grupos_desaf_os' },
  { id: 'view-telemetria', folder: 'nfsmw_ranks_expediente_de_piloto_telemetr_a' },
  { id: 'view-cockpit', folder: 'nfsmw_ranks_tactical_dossiers_master_detail_cockpit' },
  { id: 'view-halloffame', folder: 'nfsmw_ranks_hall_of_fame_rockport_legends' },
  { id: 'view-map', folder: 'nfsmw_ranks_mapa_t_ctico_de_rockport' },
  { id: 'view-download', folder: 'nfsmw_ranks_centro_de_descargas_oficial' },
  { id: 'view-guides', folder: 'nfsmw_ranks_gu_as_de_tuning_performance_setups' },
  { id: 'view-rules', folder: 'nfsmw_ranks_reglamento_oficial_homologaci_n' },
  { id: 'view-submit', folder: 'nfsmw_ranks_subir_registro_homologaci_n_de_tiempos' }
];

let mainInnerSections = '';
views.forEach(v => {
  const content = v.content !== undefined ? v.content : getInnerMain(v.folder);
  const activeClass = v.active ? ' active' : '';
  mainInnerSections += `\n<!-- VIEW SECTION: ${v.id} -->\n<section id="${v.id}" class="view-section${activeClass}">\n${content}\n</section>\n`;
});

// 4. Extract footer from Home
const footerStart = homeHtml.indexOf('<footer');
const footerEnd = homeHtml.indexOf('</footer>') + 9;
const footerHtml = homeHtml.substring(footerStart, footerEnd);

// 5. Scripts references
const scriptsBlock = `
  <!-- Scripts de Datos, Firebase y Lógica Central -->
  <script src="src/routes-data.js"></script>
  <script src="src/firebase-config.js"></script>
  <script src="src/app.js"></script>
`;

// 6. Assemble complete HTML file
const completeHtml = `<!DOCTYPE html>
<html class="dark" lang="es">
<head>
${headContent}
</head>
<body class="bg-surface-container-lowest text-on-surface font-body-md text-body-md min-h-screen selection:bg-primary-container selection:text-on-primary-container">
${headerHtml}
<main class="w-full pt-20 bg-surface-container-lowest min-h-screen">
${mainInnerSections}
</main>
${footerHtml}
${scriptsBlock}
</body>
</html>
`;

fs.writeFileSync('index.html', completeHtml, 'utf8');
console.log('Successfully written index.html! File size:', fs.statSync('index.html').size, 'bytes');
