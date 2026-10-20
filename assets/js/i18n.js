/**
 * NFSMW RANKS // i18next Internationalization Module
 * Primary Language: English ('en')
 * Secondary Language: Spanish ('es')
 * Strict Exception: Proper names of Routes and Drivers/Pilots are NEVER translated.
 */

(function () {
  // 1. Comprehensive Translation Resources
  const enTranslations = {
    // Navigation & Global Header
    "nav.home": "HOME",
    "nav.leaderboards": "LEADERBOARDS",
    "nav.routes": "ROUTES & CIRCUITS",
    "nav.challenges_tournament": "CHALLENGES & TOURNAMENT",
    "nav.weekly_challenges": "Weekly Challenges",
    "nav.blacklist_groups": "Blacklist Groups & Rivals",
    "nav.standings": "Championship Standings",
    "nav.register": "Tournament Registration",
    "nav.tutorial": "Tournament Tutorial",
    "nav.past_tournaments": "Past Tournaments (Challonge)",
    "nav.halloffame": "HALL OF FAME",
    "nav.telemetry": "TELEMETRY",
    "nav.community": "COMMUNITY",
    "nav.tuning_guides": "Tuning Guides",
    "nav.rules": "Official Rules",
    "nav.map": "Tactical Map",
    "nav.download": "Download Center",
    "nav.submit": "Submit Record",
    "nav.discord": "DISCORD",
    "nav.telemetry_subtitle": "BLACK EDITION TELEMETRY",

    // Section 1: Home (#view-home)
    "home.season_badge": "SEASON 2026",
    "home.challenge_badge": "BLACKLIST 15 QUALIFYING CHALLENGE",
    "home.headline_line1": "WORLD RECORDS",
    "home.headline_line2": "OF ROCKPORT",
    "home.hero_description": "The definitive precision telemetry network, sub-millisecond audited 128Hz lap times, and anti-cheat arbitration for Need for Speed: Most Wanted (2005).",
    "home.search_placeholder": "Search driver, track, official record, or Blacklist rival...",
    "home.search_btn": "SEARCH",
    "home.active_pilots": "ACTIVE DRIVERS",
    "home.routes_circuits": "ROUTES & CIRCUITS",
    "home.blacklist_rivals": "BLACKLIST RIVALS",
    "home.tickrate_freq": "TICKRATE FREQUENCY",
    "home.btn_explorer_rankings": "EXPLORER RANKINGS",
    "home.btn_hall_of_fame": "HALL OF FAME",
    "home.btn_discord_server": "DISCORD SERVER",
    "home.revival_badge": "SEASON 2026 // BLACKLIST 15 CHALLENGE",
    "home.revival_title": "RELIVE THE LEGEND OF THE 15 BLACKLIST DRIVERS. BECOME #1.",
    "home.revival_desc": "Need for Speed: Most Wanted (2005) elevated to eSports standard. Real-time sub-frame telemetry validation, certified YouTube records, and the most demanding tournament in Rockport.",
    "home.btn_view_tournament_tutorial": "VIEW TOURNAMENT & TUTORIAL",
    "home.btn_register_now": "REGISTER NOW",
    "home.btn_view_standings": "VIEW STANDINGS",
    "home.tournament_badge": "OFFICIAL TOURNAMENT • ROCKPORT CITY 2026",
    "home.tournament_edition": "// BLACKLIST SERIES EDITION IV",
    "home.tournament_title": "DRIVERS CHAMPIONSHIP // MOST WANTED BLACKLIST 2026",
    "home.tournament_desc": "The ultimate championship of speed, consistency, and direct 1v1 showdowns. Four weeks of official qualification with locked-memory telemetry to crown the undisputed king of the Rockport Blacklist.",
    "home.kpi_drivers": "+15 Drivers",
    "home.kpi_drivers_sub": "Dynamic Grid",
    "home.kpi_weeks": "4 Weeks",
    "home.kpi_weeks_sub": "Full Rotation",
    "home.kpi_routes": "32 Routes",
    "home.kpi_routes_sub": "8 Challenges/Week",
    "home.video_badge": "OFFICIAL PROMO VIDEO // SEASON 01",
    "home.video_sub": "Trailer & Telemetry Showcase",
    "home.card_live_radar": "LIVE TELEMETRY RADAR",
    "home.card_live_radar_sub": "AUDITED REAL-TIME TELEMETRY STREAM",
    "home.card_community": "DISCORD COMMUNITY & SUPPORT",
    "home.card_community_desc": "Join our active community of speedrunners and competitive drivers. Share tuning setups, discuss regulations, and report runs.",

    // Section 2: Leaderboards (#view-leaderboard)
    "leaderboard.title": "GLOBAL LEADERBOARD",
    "leaderboard.subtitle": "Audited lap records and speed benchmarks for all circuits.",
    "leaderboard.search_placeholder": "Search driver or vehicle...",
    "leaderboard.filter_all": "All",
    "leaderboard.col_pos": "POS",
    "leaderboard.col_driver": "DRIVER",
    "leaderboard.col_car": "VEHICLE",
    "leaderboard.col_time": "TIME",
    "leaderboard.col_gap": "GAP",
    "leaderboard.col_date": "DATE",
    "leaderboard.col_status": "STATUS",
    "leaderboard.col_telemetry": "TELEMETRY",

    // Section 3: Routes & Circuits (#view-routes-pistas)
    "routes.title": "OFFICIAL ROUTES & CIRCUITS CATALOG",
    "routes.subtitle": "Explore homologated Rockport City routes divided by format and technical complexity.",
    "routes.btn_all": "ALL TRACKS",
    "routes.btn_circuits": "CIRCUITS",
    "routes.btn_sprints": "SPRINTS",
    "routes.btn_drag": "DRAG",
    "routes.search_placeholder": "Search route or circuit...",
    "routes.badge_length": "LENGTH",
    "routes.badge_laps": "LAPS",
    "routes.badge_record": "CURRENT RECORD",
    "routes.badge_holder": "RECORD HOLDER",
    "routes.btn_view_board": "VIEW LEADERBOARD",

    // Section 4: Weekly Challenges (#view-challenges)
    "challenges.title": "WEEKLY CHAMPIONSHIP CHALLENGES",
    "challenges.subtitle": "8 official routes per week with restricted cars and $REP bounty rewards.",
    "challenges.kpi_deadline": "DEADLINE",
    "challenges.kpi_pot": "ACCUMULATED REWARD",
    "challenges.kpi_active": "ACTIVE CHALLENGES",
    "challenges.kpi_status": "STATUS",
    "challenges.restricted_car": "RESTRICTED VEHICLE",
    "challenges.rep_reward": "REP REWARD",
    "challenges.target_time": "TARGET TIME",
    "challenges.btn_submit_run": "SUBMIT TIME",

    // Section 5: Blacklist Groups & Rivals (#view-blacklist)
    "blacklist.title": "BLACKLIST 2026 CHAMPIONSHIP: GROUPS & CHALLENGES",
    "blacklist.subtitle": "Official 4-Week Championship: 15 legendary Rivals, 8 weekly challenges across rotating groups and 1v1 showdowns.",
    "blacklist.kpi_leader": "BLACKLIST LEADER",
    "blacklist.kpi_pot": "TOTAL REP POT",
    "blacklist.kpi_progress": "WEEKLY PROGRESS",
    "blacklist.kpi_status": "TOURNAMENT STATUS",
    "blacklist.groups_title": "RACING GROUPS",
    "blacklist.groups_sub": "(OFFICIAL GROUPS • WEEKLY ROTATION)",
    "blacklist.groups_desc": "Direct driver duels to contest the 8 weekly routes and challenges. Best times accumulate direct $REP bonuses.",
    "blacklist.challenges_title": "WEEKLY CHAMPIONSHIP CHALLENGES",
    "blacklist.challenges_sub": "8 ROUTES PER GROUP // BEST-TIME BONUS SYSTEM",
    "blacklist.open_slot": "Open Slot",
    "blacklist.awaiting_driver": "Awaiting Driver",
    "blacklist.assigned_drivers": "Drivers Assigned to Group:",
    "blacklist.contains_open": "Contains Open Slots",
    "blacklist.in_progress": "IN PROGRESS",
    "blacklist.homologated_groups": "Homologated Groups",

    // Section 6: Championship Standings (#view-championship-standings)
    "standings.title": "OFFICIAL CHAMPIONSHIP STANDINGS",
    "standings.subtitle": "Live matrix of points, accumulated reputation, and challenge victories for the Blacklist 2026 Championship.",
    "standings.search_placeholder": "Search driver or alias...",
    "standings.sort_points": "TOTAL POINTS",
    "standings.sort_rep": "REP CASH",
    "standings.sort_victories": "VICTORIES (P1)",
    "standings.col_rank": "POS",
    "standings.col_pilot": "DRIVER / ALIAS",
    "standings.col_assigned_car": "ASSIGNED VEHICLE",
    "standings.col_total_points": "TOTAL POINTS",
    "standings.col_total_rep": "REP REWARD",
    "standings.col_status": "STATUS",

    // Section 7: Championship Registration (#view-championship-register)
    "register.title": "BLACKLIST 2026 CHAMPIONSHIP REGISTRATION",
    "register.subtitle": "Join the most demanding competitive league in Rockport City. Complete the registration form below.",
    "register.field_alias": "Driver Alias / In-Game Name",
    "register.field_car": "Selected Vehicle",
    "register.field_discord": "Discord Username",
    "register.field_country": "Country / Region",
    "register.field_platform": "Platform / Device",
    "register.field_rules": "I have read and accept the official competition rules.",
    "register.btn_submit": "SUBMIT REGISTRATION",

    // Section 8: Tutorial (#view-tutorial)
    "tutorial.title": "TOURNAMENT TUTORIAL & PARTICIPATION GUIDE",
    "tutorial.subtitle": "Learn how to record runs, submit telemetry, and verify your times according to competition standards.",

    // Section 9: Past Tournaments (#view-past-tournaments)
    "past_tournaments.title": "PAST TOURNAMENTS & HISTORICAL ARCHIVE",
    "past_tournaments.subtitle": "Explore previous brackets, official winners, and historical standings from previous editions.",

    // Section 10: Telemetry (#view-telemetria)
    "telemetry.title": "ADVANCED TELEMETRY LABORATORY",
    "telemetry.subtitle": "High-precision telemetry curves, speed profiles, and micro-sector delta analytics.",

    // Section 11: Tactical Dossier (#view-blacklist-cards)
    "dossier.title": "TACTICAL DOSSIER: BLACKLIST RIVALS",
    "dossier.subtitle": "Complete telemetry files, biographies, and strengths of the 15 legendary drivers.",
    "dossier.label_rep": "REPUTATION",
    "dossier.label_pts": "TOTAL PTS",
    "dossier.label_victories": "VICTORIES",
    "dossier.label_car": "FAVORITE VEHICLE",
    "dossier.label_bio": "TACTICAL BIO",
    "dossier.label_strengths": "RIVAL STRENGTHS",
    "dossier.search_driver": "Search pilot in dossier...",
    "dossier.filter_all": "ALL",

    // Section 12: Hall of Fame (#view-halloffame)
    "halloffame.title": "ROCKPORT HALL OF FAME",
    "halloffame.subtitle": "Honoring the fastest drivers, undefeated champions, and legacy record holders.",

    // Section 13: Tactical Map (#view-map)
    "map.title": "ROCKPORT CITY TACTICAL MAP",
    "map.subtitle": "Interactive layout of districts, speedtraps, and circuit checkpoints.",

    // Section 14: Download Center (#view-download)
    "download.title": "DOWNLOAD & TOOLS CENTER",
    "download.subtitle": "Official patches, telemetry loggers, widescreen fixes, and anti-cheat modules.",

    // Section 15: Tuning Guides (#view-guides)
    "guides.title": "TUNING & GEAR RATIO GUIDES",
    "guides.subtitle": "Aerodynamic balance, suspension stiffness, nitrous delivery, and brake bias setups.",

    // Section 16: Official Rules (#view-rules)
    "rules.title": "OFFICIAL COMPETITION REGULATIONS",
    "rules.subtitle": "Strict rules for homologation, software mods, video submissions, and sportsmanship.",

    // Section 17: Submit Record (#view-submit)
    "submit.title": "SUBMIT TELEMETRY RECORD",
    "submit.subtitle": "Submit your run for official verification by Rockport Police Department stewards.",
    "submit.field_route": "Route / Track",
    "submit.field_driver": "Driver Name / Alias",
    "submit.field_time": "Lap Time (mm:ss.sss)",
    "submit.field_video": "YouTube Video URL (Proof)",
    "submit.field_screenshot": "Screenshot / Photo URL",
    "submit.field_notes": "Telemetry Notes / Setup Details",
    "submit.btn_submit_record": "SEND RECORD FOR REVIEW",

    // Footer & Partner Links
    "footer.powered_by": "PRODUCED BY & POWERED BY"
  };

  const esTranslations = {
    // Navigation & Global Header
    "nav.home": "INICIO",
    "nav.leaderboards": "TABLAS DE CLASIFICACIÓN",
    "nav.routes": "RUTAS & CIRCUITOS",
    "nav.challenges_tournament": "DESAFÍOS & TORNEO",
    "nav.weekly_challenges": "Desafíos Semanales",
    "nav.blacklist_groups": "Grupos y Rivales Blacklist",
    "nav.standings": "Clasificación del Campeonato",
    "nav.register": "Inscripción al Torneo",
    "nav.tutorial": "Tutorial del Torneo",
    "nav.past_tournaments": "Torneos Pasados (Challonge)",
    "nav.halloffame": "SALÓN DE LA FAMA",
    "nav.telemetry": "TELEMETRÍA",
    "nav.community": "COMUNIDAD",
    "nav.tuning_guides": "Guías de Tuning",
    "nav.rules": "Reglamento Oficial",
    "nav.map": "Mapa Táctico",
    "nav.download": "Centro de Descargas",
    "nav.submit": "Subir Registro",
    "nav.discord": "DISCORD",
    "nav.telemetry_subtitle": "TELEMETRÍA BLACK EDITION",

    // Section 1: Home (#view-home)
    "home.season_badge": "TEMPORADA 2026",
    "home.challenge_badge": "RETO BLACKLIST 15 CLASIFICATORIA",
    "home.headline_line1": "RÉCORDS MUNDIALES",
    "home.headline_line2": "DE ROCKPORT",
    "home.hero_description": "La red definitiva de telemetría de precisión, tiempos de vuelta auditados milimétricamente a 128Hz y arbitraje anti-trampas de Need for Speed: Most Wanted (2005).",
    "home.search_placeholder": "Buscar piloto, circuito, récord oficial o rival Blacklist...",
    "home.search_btn": "CONSULTAR",
    "home.active_pilots": "PILOTOS ACTIVOS",
    "home.routes_circuits": "RUTAS & CIRCUITOS",
    "home.blacklist_rivals": "RIVALES BLACKLIST",
    "home.tickrate_freq": "FRECUENCIA TICKRATE",
    "home.btn_explorer_rankings": "CLASIFICACIONES DE EXPLORADORES",
    "home.btn_hall_of_fame": "SALÓN DE LA FAMA",
    "home.btn_discord_server": "SERVIDOR DISCORD",
    "home.revival_badge": "TEMPORADA 2026 // RETO LISTA NEGRA 15",
    "home.revival_title": "REVIVE LA LEYENDA DE LOS 15 CORREDORES DE LA BLACKLIST. CONVIÉRTETE EN EL #1.",
    "home.revival_desc": "Need for Speed: Most Wanted (2005) llevado al estándar de eSports. Validación telemétrica con sub-frames en tiempo real, récords de YouTube certificados y el torneo más exigente de Rockport.",
    "home.btn_view_tournament_tutorial": "VER TORNEO Y TUTORIAL",
    "home.btn_register_now": "INSCRÍBETE AHORA",
    "home.btn_view_standings": "VER CLASIFICACIONES",
    "home.tournament_badge": "TORNEO OFICIAL • ROCKPORT CITY 2026",
    "home.tournament_edition": "// SERIE BLACKLIST EDICIÓN IV",
    "home.tournament_title": "CAMPEONATO DE CONDUCTORES // LISTA NEGRA DE LOS MÁS BUSCADOS 2026",
    "home.tournament_desc": "El campeonato definitivo de velocidad, regularidad y duelos directos 1v1. Cuatro semanas de clasificación oficial con telemetría de memoria locked para coronar al rey absoluto de la Blacklist de Rockport.",
    "home.kpi_drivers": "+15 Pilotos",
    "home.kpi_drivers_sub": "Parrilla Dinámica",
    "home.kpi_weeks": "4 Semanas",
    "home.kpi_weeks_sub": "Rotación Completa",
    "home.kpi_routes": "32 Rutas",
    "home.kpi_routes_sub": "8 Desafíos/Semana",
    "home.video_badge": "VIDEO PROMO OFICIAL // TEMPORADA 01",
    "home.video_sub": "Trailer & Muestra de Telemetría",
    "home.card_live_radar": "RADAR DE TELEMETRÍA EN VIVO",
    "home.card_live_radar_sub": "STREAM DE TELEMETRÍA AUDITADA EN TIEMPO REAL",
    "home.card_community": "COMUNIDAD DISCORD & SOPORTE",
    "home.card_community_desc": "Únete a nuestra activa comunidad de speedrunners y pilotos competitivos. Comparte reglajes, debate normativas y reporta carreras.",

    // Section 2: Leaderboards (#view-leaderboard)
    "leaderboard.title": "TABLA DE CLASIFICACIÓN GENERAL",
    "leaderboard.subtitle": "Récords de vuelta auditados y benchmarks de velocidad de todos los circuitos.",
    "leaderboard.search_placeholder": "Buscar piloto o vehículo...",
    "leaderboard.filter_all": "Todos",
    "leaderboard.col_pos": "POS",
    "leaderboard.col_driver": "PILOTO",
    "leaderboard.col_car": "VEHÍCULO",
    "leaderboard.col_time": "TIEMPO",
    "leaderboard.col_gap": "DIFERENCIA",
    "leaderboard.col_date": "FECHA",
    "leaderboard.col_status": "ESTADO",
    "leaderboard.col_telemetry": "TELEMETRÍA",

    // Section 3: Routes & Circuits (#view-routes-pistas)
    "routes.title": "CATÁLOGO OFICIAL DE RUTAS & CIRCUITOS",
    "routes.subtitle": "Explora las rutas homologadas de Rockport City divididas por formato y complejidad técnica.",
    "routes.btn_all": "TODAS LAS PISTAS",
    "routes.btn_circuits": "CIRCUITOS",
    "routes.btn_sprints": "SPRINTS",
    "routes.btn_drag": "DRAG / ACELERACIÓN",
    "routes.search_placeholder": "Buscar ruta o circuito...",
    "routes.badge_length": "LONGITUD",
    "routes.badge_laps": "VUELTAS",
    "routes.badge_record": "RÉCORD ACTUAL",
    "routes.badge_holder": "TITULAR",
    "routes.btn_view_board": "VER CLASIFICACIÓN",

    // Section 4: Weekly Challenges (#view-challenges)
    "challenges.title": "DESAFÍOS SEMANALES DEL CAMPEONATO",
    "challenges.subtitle": "8 rutas oficiales por semana con coches restringidos y recompensas en bonos de $REP.",
    "challenges.kpi_deadline": "FECHA LÍMITE",
    "challenges.kpi_pot": "RECOMPENSA ACUMULADA",
    "challenges.kpi_active": "DESAFÍOS ACTIVOS",
    "challenges.kpi_status": "ESTADO",
    "challenges.restricted_car": "COCHE RESTRINGIDO",
    "challenges.rep_reward": "RECOMPENSA REP",
    "challenges.target_time": "TIEMPO OBJETIVO",
    "challenges.btn_submit_run": "SUBIR TIEMPO",

    // Section 5: Blacklist Groups & Rivals (#view-blacklist)
    "blacklist.title": "CAMPEONATO BLACKLIST 2026: GRUPOS & DESAFÍOS",
    "blacklist.subtitle": "Campeonato Oficial de 4 Semanas: 15 Rivales legendarios, 8 Desafíos semanales por grupos rotativos y duelos 1v1.",
    "blacklist.kpi_leader": "LÍDER BLACKLIST",
    "blacklist.kpi_pot": "TOTAL REP POT",
    "blacklist.kpi_progress": "PROGRESO SEMANAL",
    "blacklist.kpi_status": "ESTADO DEL TORNEO",
    "blacklist.groups_title": "RACING GROUPS",
    "blacklist.groups_sub": "(GRUPOS OFICIALES • ROTACIÓN SEMANAL)",
    "blacklist.groups_desc": "Duelos directos de pilotos para disputar las 8 rutas y desafíos semanales. Los mejores tiempos acumulan bonos directos de $REP.",
    "blacklist.challenges_title": "WEEKLY CHAMPIONSHIP CHALLENGES",
    "blacklist.challenges_sub": "8 RUTAS POR GRUPO // SISTEMA DE BONOS POR MEJOR TIEMPO",
    "blacklist.open_slot": "Plaza Disponible",
    "blacklist.awaiting_driver": "Esperando Piloto",
    "blacklist.assigned_drivers": "Pilotos Asignados al Grupo:",
    "blacklist.contains_open": "Contiene Plazas Disponibles",
    "blacklist.in_progress": "EN CURSO",
    "blacklist.homologated_groups": "Grupos Homologados",

    // Section 6: Championship Standings (#view-championship-standings)
    "standings.title": "CLASIFICACIÓN OFICIAL DEL CAMPEONATO",
    "standings.subtitle": "Matriz en vivo de puntos, reputación acumulada y victorias por desafío del Campeonato Blacklist 2026.",
    "standings.search_placeholder": "Buscar piloto o alias...",
    "standings.sort_points": "PUNTOS TOTALES",
    "standings.sort_rep": "DINERO REP",
    "standings.sort_victories": "VICTORIAS (P1)",
    "standings.col_rank": "POS",
    "standings.col_pilot": "PILOTO / ALIAS",
    "standings.col_assigned_car": "AUTO ASIGNADO",
    "standings.col_total_points": "PUNTOS TOTALES",
    "standings.col_total_rep": "RECOMPENSA REP",
    "standings.col_status": "ESTADO",

    // Section 7: Championship Registration (#view-championship-register)
    "register.title": "INSCRIPCIÓN AL CAMPEONATO BLACKLIST 2026",
    "register.subtitle": "Únete a la liga competitiva más exigente de Rockport City. Completa el formulario de inscripción a continuación.",
    "register.field_alias": "Alias de Corredor / Nombre en Juego",
    "register.field_car": "Vehículo Seleccionado",
    "register.field_discord": "Usuario de Discord",
    "register.field_country": "País / Región",
    "register.field_platform": "Plataforma / Dispositivo",
    "register.field_rules": "He leído y acepto el reglamento oficial de la competición.",
    "register.btn_submit": "ENVIAR INSCRIPCIÓN",

    // Section 8: Tutorial (#view-tutorial)
    "tutorial.title": "TUTORIAL DEL TORNEO & GUÍA DE PARTICIPACIÓN",
    "tutorial.subtitle": "Aprende a grabar tus carreras, enviar telemetría y homologar tus tiempos según las normas de competición.",

    // Section 9: Past Tournaments (#view-past-tournaments)
    "past_tournaments.title": "HISTORIAL DE TORNEOS & ARCHIVO COMPETITIVO",
    "past_tournaments.subtitle": "Explora los cuadros eliminatorios previos, ganadores oficiales y clasificaciones históricas de ediciones anteriores.",

    // Section 10: Telemetry (#view-telemetria)
    "telemetry.title": "LABORATORIO DE TELEMETRÍA AVANZADA",
    "telemetry.subtitle": "Curvas de telemetría de alta precisión, perfiles de velocidad y analítica de deltas por micro-sectores.",

    // Section 11: Tactical Dossier (#view-blacklist-cards)
    "dossier.title": "TACTICAL DOSSIER: RIVALES DE LA BLACKLIST",
    "dossier.subtitle": "Archivos de telemetría completa, biografías y fortalezas de los 15 corredores legendarios.",
    "dossier.label_rep": "REPUTACIÓN",
    "dossier.label_pts": "PTS TOTALES",
    "dossier.label_victories": "VICTORIAS",
    "dossier.label_car": "VEHÍCULO FAVORITO",
    "dossier.label_bio": "BIOGRAFÍA TÁCTICA",
    "dossier.label_strengths": "FORTALEZAS DEL RIVAL",
    "dossier.search_driver": "Buscar piloto en dossier...",
    "dossier.filter_all": "TODOS",

    // Section 12: Hall of Fame (#view-halloffame)
    "halloffame.title": "SALÓN DE LA FAMA DE ROCKPORT",
    "halloffame.subtitle": "Homenaje a los pilotos más veloces, campeones invictos y plusmarquistas históricos.",

    // Section 13: Tactical Map (#view-map)
    "map.title": "MAPA TÁCTICO DE ROCKPORT CITY",
    "map.subtitle": "Distribución interactiva de distritos, radares y puntos de control de circuitos.",

    // Section 14: Download Center (#view-download)
    "download.title": "CENTRO DE DESCARGAS & HERRAMIENTAS",
    "download.subtitle": "Parches oficiales, loggers de telemetría, widescreen fixes y módulos anti-trampas.",

    // Section 15: Tuning Guides (#view-guides)
    "guides.title": "GUÍAS DE TUNING & RELACIONES DE TRANSMISIÓN",
    "guides.subtitle": "Equilibrio aerodinámico, rigidez de suspensión, entrega de nitro y balance de frenos.",

    // Section 16: Official Rules (#view-rules)
    "rules.title": "REGLAMENTO OFICIAL DE COMPETICIÓN",
    "rules.subtitle": "Normas estrictas de homologación, mods de software, envío de videos y juego limpio.",

    // Section 17: Submit Record (#view-submit)
    "submit.title": "SUBIR REGISTRO DE TELEMETRÍA",
    "submit.subtitle": "Envía tu carrera para verificación oficial por los comisarios del Departamento de Policía de Rockport.",
    "submit.field_route": "Ruta / Pista",
    "submit.field_driver": "Nombre de Piloto / Alias",
    "submit.field_time": "Tiempo de Vuelta (mm:ss.sss)",
    "submit.field_video": "URL de Video de YouTube (Prueba)",
    "submit.field_screenshot": "URL de Captura de Pantalla / Foto",
    "submit.field_notes": "Notas de Telemetría / Detalles del Setup",
    "submit.btn_submit_record": "ENVIAR REGISTRO A REVISIÓN",

    // Footer & Partner Links
    "footer.powered_by": "PRODUCIDO Y PATROCINADO POR"
  };

  // 2. Bilingual Text Matcher Dictionary for DOM Text Node Walk
  // EXCLUSION GUARANTEE: Neither Route names nor Driver names are in this list.
  const BILINGUAL_PAIRS = [
    // Navigation & Global UI
    { en: "PRODUCED BY & POWERED BY", es: "PRODUCIDO Y PATROCINADO POR" },
    { en: "HOME", es: "INICIO" },
    { en: "LEADERBOARDS", es: "TABLAS DE CLASIFICACIÓN" },
    { en: "ROUTES & CIRCUITS", es: "RUTAS & CIRCUITOS" },
    { en: "CHALLENGES & TOURNAMENT", es: "DESAFÍOS & TORNEO" },
    { en: "Weekly Challenges", es: "Desafíos Semanales" },
    { en: "Blacklist Groups & Rivals", es: "Grupos y Rivales Blacklist" },
    { en: "Championship Standings", es: "Clasificación del Campeonato" },
    { en: "Tournament Registration", es: "Inscripción al Torneo" },
    { en: "Tournament Tutorial", es: "Tutorial del Torneo" },
    { en: "Past Tournaments (Challonge)", es: "Torneos Pasados (Challonge)" },
    { en: "HALL OF FAME", es: "SALÓN DE LA FAMA" },
    { en: "TELEMETRY", es: "TELEMETRÍA" },
    { en: "COMMUNITY", es: "COMUNIDAD" },
    { en: "Tuning Guides", es: "Guías de Tuning" },
    { en: "Official Rules", es: "Reglamento Oficial" },
    { en: "Tactical Map", es: "Mapa Táctico" },
    { en: "Download Center", es: "Centro de Descargas" },
    { en: "Submit Record", es: "Subir Registro" },
    { en: "BLACK EDITION TELEMETRY", es: "TELEMETRÍA BLACK EDITION" },

    // Home view texts
    { en: "SEASON 2026", es: "TEMPORADA 2026" },
    { en: "BLACKLIST 15 QUALIFYING CHALLENGE", es: "RETO BLACKLIST 15 CLASIFICATORIA" },
    { en: "WORLD RECORDS", es: "RÉCORDS MUNDIALES" },
    { en: "OF ROCKPORT", es: "DE ROCKPORT" },
    {
      en: "The definitive precision telemetry network, sub-millisecond audited 128Hz lap times, and anti-cheat arbitration of Need for Speed: Most Wanted (2005).",
      es: "La red definitiva de telemetría de precisión, tiempos de vuelta auditados milimétricamente a 128Hz y arbitraje anti-trampas de Need for Speed: Most Wanted (2005)."
    },
    { en: "SEARCH", es: "CONSULTAR" },
    { en: "ACTIVE DRIVERS", es: "PILOTOS ACTIVOS" },
    { en: "BLACKLIST RIVALS", es: "RIVALES BLACKLIST" },
    { en: "TICKRATE FREQUENCY", es: "FRECUENCIA TICKRATE" },
    { en: "EXPLORER RANKINGS", es: "CLASIFICACIONES DE EXPLORADORES" },
    { en: "DISCORD SERVER", es: "SERVIDOR DISCORD" },
    { en: "SEASON 2026 // BLACKLIST 15 CHALLENGE", es: "TEMPORADA 2026 // RETO LISTA NEGRA 15" },
    {
      en: "RELIVE THE LEGEND OF THE 15 BLACKLIST DRIVERS. BECOME #1.",
      es: "REVIVE LA LEYENDA DE LOS 15 CORREDORES DE LA BLACKLIST. CONVIÉRTETE EN EL #1."
    },
    {
      en: "Need for Speed: Most Wanted (2005) elevated to eSports standard. Real-time sub-frame telemetry validation, certified YouTube records, and the most demanding tournament in Rockport.",
      es: "Need for Speed: Most Wanted (2005) llevado al estándar de eSports. Validación telemétrica con sub-frames en tiempo real, récords de YouTube certificados y el torneo más exigente de Rockport."
    },
    { en: "VIEW TOURNAMENT & TUTORIAL", es: "VER TORNEO Y TUTORIAL" },
    { en: "REGISTER NOW", es: "INSCRÍBETE AHORA" },
    { en: "VIEW STANDINGS", es: "VER CLASIFICACIONES" },
    { en: "OFFICIAL TOURNAMENT • ROCKPORT CITY 2026", es: "TORNEO OFICIAL • ROCKPORT CITY 2026" },
    { en: "// BLACKLIST SERIES EDITION IV", es: "// SERIE BLACKLIST EDICIÓN IV" },
    {
      en: "DRIVERS CHAMPIONSHIP // MOST WANTED BLACKLIST 2026",
      es: "CAMPEONATO DE CONDUCTORES // LISTA NEGRA DE LOS MÁS BUSCADOS 2026"
    },
    {
      en: "The ultimate championship of speed, consistency, and direct 1v1 showdowns. Four weeks of official qualification with locked-memory telemetry to crown the undisputed king of the Rockport Blacklist.",
      es: "El campeonato definitivo de velocidad, regularidad y duelos directos 1v1. Cuatro semanas de clasificación oficial con telemetría de memoria locked para coronar al rey absoluto de la Blacklist de Rockport."
    },
    { en: "+15 Drivers", es: "+15 Pilotos" },
    { en: "Dynamic Grid", es: "Parrilla Dinámica" },
    { en: "4 Weeks", es: "4 Semanas" },
    { en: "Full Rotation", es: "Rotación Completa" },
    { en: "32 Routes", es: "32 Rutas" },
    { en: "8 Challenges/Week", es: "8 Desafíos/Semana" },
    { en: "OFFICIAL PROMO VIDEO // SEASON 01", es: "VIDEO PROMO OFICIAL // TEMPORADA 01" },
    { en: "Trailer & Telemetry Showcase", es: "Trailer & Muestra de Telemetría" },
    { en: "LIVE TELEMETRY RADAR", es: "RADAR DE TELEMETRÍA EN VIVO" },
    { en: "AUDITED REAL-TIME TELEMETRY STREAM", es: "STREAM DE TELEMETRÍA AUDITADA EN TIEMPO REAL" },
    { en: "DISCORD COMMUNITY & SUPPORT", es: "COMUNIDAD DISCORD & SOPORTE" },
    {
      en: "Join our active community of speedrunners and competitive drivers. Share tuning setups, discuss regulations, and report runs.",
      es: "Únete a nuestra activa comunidad de speedrunners y pilotos competitivos. Comparte reglajes, debate normativas y reporta carreras."
    },

    // Routes view texts
    { en: "OFFICIAL ROUTES & CIRCUITS CATALOG", es: "CATÁLOGO OFICIAL DE RUTAS & CIRCUITOS" },
    {
      en: "Explore homologated Rockport City routes divided by format and technical complexity.",
      es: "Explora las rutas homologadas de Rockport City divididas por formato y complejidad técnica."
    },
    { en: "ALL TRACKS", es: "TODAS LAS PISTAS" },
    { en: "CIRCUITS", es: "CIRCUITOS" },
    { en: "SPRINTS", es: "SPRINTS" },
    { en: "DRAG", es: "DRAG / ACELERACIÓN" },
    { en: "LENGTH", es: "LONGITUD" },
    { en: "LAPS", es: "VUELTAS" },
    { en: "CURRENT RECORD", es: "RÉCORD ACTUAL" },
    { en: "RECORD HOLDER", es: "TITULAR" },
    { en: "VIEW LEADERBOARD", es: "VER CLASIFICACIÓN" },

    // Challenges view texts
    { en: "WEEKLY CHAMPIONSHIP CHALLENGES", es: "DESAFÍOS SEMANALES DEL CAMPEONATO" },
    {
      en: "8 official routes per week with restricted cars and $REP bounty rewards.",
      es: "8 rutas oficiales por semana con coches restringidos y recompensas en bonos de $REP."
    },
    { en: "DEADLINE", es: "FECHA LÍMITE" },
    { en: "ACCUMULATED REWARD", es: "RECOMPENSA ACUMULADA" },
    { en: "ACTIVE CHALLENGES", es: "DESAFÍOS ACTIVOS" },
    { en: "RESTRICTED VEHICLE", es: "COCHE RESTRINGIDO" },
    { en: "REP REWARD", es: "RECOMPENSA REP" },
    { en: "TARGET TIME", es: "TIEMPO OBJETIVO" },
    { en: "SUBMIT TIME", es: "SUBIR TIEMPO" },

    // Blacklist & Tournament Groups texts
    { en: "BLACKLIST 2026 CHAMPIONSHIP: GROUPS & CHALLENGES", es: "CAMPEONATO BLACKLIST 2026: GRUPOS & DESAFÍOS" },
    {
      en: "Official 4-Week Championship: 15 legendary Rivals, 8 weekly challenges across rotating groups and 1v1 showdowns.",
      es: "Campeonato Oficial de 4 Semanas: 15 Rivales legendarios, 8 Desafíos semanales por grupos rotativos y duelos 1v1."
    },
    { en: "BLACKLIST LEADER", es: "LÍDER BLACKLIST" },
    { en: "TOTAL REP POT", es: "TOTAL REP POT" },
    { en: "WEEKLY PROGRESS", es: "PROGRESO SEMANAL" },
    { en: "TOURNAMENT STATUS", es: "ESTADO DEL TORNEO" },
    { en: "IN PROGRESS", es: "EN CURSO" },
    { en: "(OFFICIAL GROUPS • WEEKLY ROTATION)", es: "(GRUPOS OFICIALES • ROTACIÓN SEMANAL)" },
    {
      en: "Direct driver duels to contest the 8 weekly routes and challenges. Best times accumulate direct $REP bonuses.",
      es: "Duelos directos de pilotos para disputar las 8 rutas y desafíos semanales. Los mejores tiempos acumulan bonos directos de $REP."
    },
    {
      en: "8 ROUTES PER GROUP // BEST-TIME BONUS SYSTEM",
      es: "8 RUTAS POR GRUPO // SISTEMA DE BONOS POR MEJOR TIEMPO"
    },
    { en: "Open Slot", es: "Plaza Disponible" },
    { en: "Awaiting Driver", es: "Esperando Piloto" },
    { en: "Drivers Assigned to Group:", es: "Pilotos Asignados al Trío / Grupo:" },
    { en: "Drivers Assigned to Group:", es: "Pilotos Asignados al Cuarteto / Grupo:" },
    { en: "Contains Open Slots", es: "Contiene Plazas Disponibles" },
    { en: "Homologated Groups", es: "Grupos Homologados" },
    { en: "OFFICIAL GROUPS", es: "GRUPOS OFICIALES" },

    // Standings view texts
    { en: "OFFICIAL CHAMPIONSHIP STANDINGS", es: "CLASIFICACIÓN OFICIAL DEL CAMPEONATO" },
    {
      en: "Live matrix of points, accumulated reputation, and challenge victories for the Blacklist 2026 Championship.",
      es: "Matriz en vivo de puntos, reputación acumulada y victorias por desafío del Campeonato Blacklist 2026."
    },
    { en: "TOTAL POINTS", es: "PUNTOS TOTALES" },
    { en: "REP CASH", es: "DINERO REP" },
    { en: "VICTORIES (P1)", es: "VICTORIAS (P1)" },
    { en: "DRIVER / ALIAS", es: "PILOTO / ALIAS" },
    { en: "ASSIGNED VEHICLE", es: "AUTO ASIGNADO" },

    // Registration view texts
    { en: "BLACKLIST 2026 CHAMPIONSHIP REGISTRATION", es: "INSCRIPCIÓN AL CAMPEONATO BLACKLIST 2026" },
    {
      en: "Join the most demanding competitive league in Rockport City. Complete the registration form below.",
      es: "Únete a la liga competitiva más exigente de Rockport City. Completa el formulario de inscripción a continuación."
    },
    { en: "Driver Alias / In-Game Name", es: "Alias de Corredor / Nombre en Juego" },
    { en: "Selected Vehicle", es: "Vehículo Seleccionado" },
    { en: "Discord Username", es: "Usuario de Discord" },
    { en: "Country / Region", es: "País / Región" },
    { en: "Platform / Device", es: "Plataforma / Dispositivo" },
    { en: "I have read and accept the official competition rules.", es: "He leído y acepto el reglamento oficial de la competición." },
    { en: "SUBMIT REGISTRATION", es: "ENVIAR INSCRIPCIÓN" },

    // Tutorial view texts
    { en: "TOURNAMENT TUTORIAL & PARTICIPATION GUIDE", es: "TUTORIAL DEL TORNEO & GUÍA DE PARTICIPACIÓN" },
    {
      en: "Learn how to record runs, submit telemetry, and verify your times according to competition standards.",
      es: "Aprende a grabar tus carreras, enviar telemetría y homologar tus tiempos según las normas de competición."
    },

    // Past Tournaments view texts
    { en: "PAST TOURNAMENTS & HISTORICAL ARCHIVE", es: "HISTORIAL DE TORNEOS & ARCHIVO COMPETITIVO" },
    {
      en: "Explore previous brackets, official winners, and historical standings from previous editions.",
      es: "Explora los cuadros eliminatorios previos, ganadores oficiales y clasificaciones históricas de ediciones anteriores."
    },

    // Telemetry view texts
    { en: "ADVANCED TELEMETRY LABORATORY", es: "LABORATORIO DE TELEMETRÍA AVANZADA" },
    {
      en: "High-precision telemetry curves, speed profiles, and micro-sector delta analytics.",
      es: "Curvas de telemetría de alta precisión, perfiles de velocidad y analítica de deltas por micro-sectores."
    },

    // Tactical Dossier view texts
    { en: "TACTICAL DOSSIER: BLACKLIST RIVALS", es: "TACTICAL DOSSIER: RIVALES DE LA BLACKLIST" },
    {
      en: "Complete telemetry files, biographies, and strengths of the 15 legendary drivers.",
      es: "Archivos de telemetría completa, biografías y fortalezas de los 15 corredores legendarios."
    },
    { en: "REPUTATION", es: "REPUTACIÓN" },
    { en: "TOTAL PTS", es: "PTS TOTALES" },
    { en: "VICTORIES", es: "VICTORIAS" },
    { en: "FAVORITE VEHICLE", es: "VEHÍCULO FAVORITO" },
    { en: "TACTICAL BIO", es: "BIOGRAFÍA TÁCTICA" },
    { en: "RIVAL STRENGTHS", es: "FORTALEZAS DEL RIVAL" },

    // Hall of Fame view texts
    { en: "ROCKPORT HALL OF FAME", es: "SALÓN DE LA FAMA DE ROCKPORT" },
    {
      en: "Honoring the fastest drivers, undefeated champions, and legacy record holders.",
      es: "Homenaje a los pilotos más veloces, campeones invictos y plusmarquistas históricos."
    },

    // Map view texts
    { en: "ROCKPORT CITY TACTICAL MAP", es: "MAPA TÁCTICO DE ROCKPORT CITY" },
    {
      en: "Interactive layout of districts, speedtraps, and circuit checkpoints.",
      es: "Distribución interactiva de distritos, radares y puntos de control de circuitos."
    },

    // Download Center view texts
    { en: "DOWNLOAD & TOOLS CENTER", es: "CENTRO DE DESCARGAS & HERRAMIENTAS" },
    {
      en: "Official patches, telemetry loggers, widescreen fixes, and anti-cheat modules.",
      es: "Parches oficiales, loggers de telemetría, widescreen fixes y módulos anti-trampas."
    },

    // Tuning Guides view texts
    { en: "TUNING & GEAR RATIO GUIDES", es: "GUÍAS DE TUNING & RELACIONES DE TRANSMISIÓN" },
    {
      en: "Aerodynamic balance, suspension stiffness, nitrous delivery, and brake bias setups.",
      es: "Equilibrio aerodinámico, rigidez de suspensión, entrega de nitro y balance de frenos."
    },

    // Rules view texts
    { en: "OFFICIAL COMPETITION REGULATIONS", es: "REGLAMENTO OFICIAL DE COMPETICIÓN" },
    {
      en: "Strict rules for homologation, software mods, video submissions, and sportsmanship.",
      es: "Normas estrictas de homologación, mods de software, envío de videos y juego limpio."
    },

    // Submit Record view texts
    { en: "SUBMIT TELEMETRY RECORD", es: "SUBIR REGISTRO DE TELEMETRÍA" },
    {
      en: "Submit your run for official verification by Rockport Police Department stewards.",
      es: "Envía tu carrera para verificación oficial por los comisarios del Departamento de Policía de Rockport."
    },
    { en: "Route / Track", es: "Ruta / Pista" },
    { en: "Driver Name / Alias", es: "Nombre de Piloto / Alias" },
    { en: "Lap Time (mm:ss.sss)", es: "Tiempo de Vuelta (mm:ss.sss)" },
    { en: "YouTube Video URL (Proof)", es: "URL de Video de YouTube (Prueba)" },
    { en: "Screenshot / Photo URL", es: "URL de Captura de Pantalla / Foto" },
    { en: "Telemetry Notes / Setup Details", es: "Notas de Telemetría / Detalles del Setup" },
    { en: "SEND RECORD FOR REVIEW", es: "ENVIAR REGISTRO A REVISIÓN" },

    // Additional Navigation & Shared UI
    { en: "HALL OF FAME", es: "HALL DE LA FAMA" },
    { en: "SALÓN DE LA FAMA", es: "HALL OF FAME" },
    { en: "Driver Dossiers (1 - 15)", es: "Dossiers de Pilotos (1 - 15)" },

    // Routes & Circuits Catalog
    { en: "ROUTES & CIRCUITS EXPLORER", es: "EXPLORADOR DE RUTAS Y CIRCUITOS" },
    {
      en: "86 Official Rockport City Tracks • Real-time telemetry and World Records verified under Any% Speedrun Compliant rules.",
      es: "86 Trazados Oficiales de Rockport City • Telemetría en tiempo real y Récords Mundiales verificados bajo normativa Any% Speedrun Compliant."
    },
    { en: "Cataloged Tracks", es: "Pistas Catalogadas" },
    { en: "Sectors", es: "Sectores" },
    { en: "Last Registered Record", es: "Último Récord Registrado" },
    { en: "Dominant Meta Car", es: "Meta Coche Dominante" },
    { en: "Official Rules", es: "Reglamento Oficial" },
    { en: "VECTOR MAP V1.3", es: "MAPA VECTORIAL V1.3" },
    { en: "SECTORS: S1 / S2 / S3", es: "SECTORES: S1 / S2 / S3" },
    { en: "ELEVATION: +48m", es: "ELEVACIÓN: +48m" },
    { en: "KEY APEXES: 11", es: "CURVAS CLAVE: 11" },
    { en: "NITRO ZONE: 4 SPOTS", es: "NITRO ZONE: 4 PUNTOS" },
    { en: "Search by track, record or car...", es: "Buscar por trazado, récord o coche..." },
    { en: "Search driver, track, official record, or Blacklist rival...", es: "Buscar piloto, circuito, récord oficial o rival Blacklist..." },
    { en: "ALL DISTRICTS (86)", es: "TODOS LOS DISTRITOS (86)" },
    { en: "Sort: World Record (WR)", es: "Ordenar: Récord Mundial (WR)" },
    { en: "Sort: Highest Activity", es: "Ordenar: Mayor Actividad" },
    { en: "Sort: Name (A-Z)", es: "Ordenar: Nombre (A-Z)" },
    { en: "Sort: Last Updated", es: "Ordenar: Última Actualización" },
    { en: "Grid View", es: "Vista en Mosaico" },
    { en: "Dense Table View", es: "Vista en Tabla Densa" },
    { en: "ALL", es: "TODOS" },
    { en: "CIRCUITS", es: "CIRCUITOS" },
    { en: "SPRINTS", es: "SPRINTS" },
    { en: "DRAGS", es: "DRAGS" },
    { en: "KNOCKOUT", es: "ELIMINADOR" },
    { en: "Circuit", es: "Circuito" },
    { en: "Sprint", es: "Sprint" },
    { en: "Drag", es: "Drag" },
    { en: "View Leaderboard", es: "Ver Leaderboard" },
    { en: "WORLD RECORD (WR)", es: "RÉCORD MUNDIAL (WR)" },
    { en: "Category", es: "Categoría" },
    { en: "Modality", es: "Modalidad" },
    { en: "Status", es: "Estado" },
    { en: "Audited 128Hz", es: "Auditado 128Hz" },
    { en: "LEADER TIME", es: "TIEMPO LÍDER" },
    { en: "● LEADER TIME", es: "● TIEMPO LÍDER" },
    { en: "4 WEEKS", es: "4 SEMANAS" },
    { en: "WEEKLY CHALLENGES", es: "DESAFÍOS DE LA SEMANA" },
    { en: "Blacklist Season 1 • 4 circuits per week", es: "Blacklist Temporada 1 • 4 circuitos por semana" },
    { en: "Week 1: Urban Assault", es: "Semana 1: Asalto Urbano" },
    { en: "Week 2: Camden Curves", es: "Semana 2: Camden Curves" },
    { en: "Week 3: Highways & Tunnels", es: "Semana 3: Autopistas y Túneles" },
    { en: "Week 4: Grand Final S1", es: "Semana 4: Gran Final S1" },
    { en: "ACTIVE", es: "ACTIVO" },
    { en: "FINAL", es: "FINAL" },

    // Tactical Dossier & Blacklist Cards
    { en: "Search driver in dossier...", es: "Buscar piloto en dossier..." },
    { en: "CHAMPIONSHIP LEADER", es: "LÍDER DEL CAMPEONATO" },
    { en: "CHAMPIONSHIP PODIUM", es: "PODIO DEL CAMPEONATO" },
    { en: "DOSSIER", es: "FICHA" },
    { en: "View Dossier File", es: "Ver Ficha Dossier" },

    // Footer & Community
    {
      en: "Leading federated platform for timekeeping, anti-cheat arbitration, and precision telemetry for Need for Speed: Most Wanted (2005). Lap-time audits locked at 60/120fps with engine memory validation.",
      es: "Plataforma líder y federada para cronometraje, arbitraje anti-trampas y telemetría de precisión de Need for Speed: Most Wanted (2005). Auditoría de tiempos en base a frame-rate locked 60/120fps y validación de memorias de motor."
    },
    { en: "RANKINGS", es: "CLASIFICACIONES" },
    { en: "RESOURCES & TELEMETRY", es: "RECURSOS & TELEMETRÍA" },
    { en: "SYSTEM STATUS", es: "ESTADO DEL SISTEMA" },
    { en: "CENTRAL ROCKPORT NODE", es: "NODO ROCKPORT CENTRAL" },
    { en: "OPERATIONAL", es: "OPERATIVO" },
    { en: "VERIFICATION ENGINE", es: "MOTOR DE VERIFICACIÓN" },
    { en: "ACTIVE (99.98%)", es: "ACTIVO (99.98%)" },
    { en: "PENDING SUBMISSIONS", es: "SUBMISIONES PENDIENTES" },
    { en: "14 DRIVERS", es: "14 CORREDORES" },
    { en: "LATEST WORLD RECORD", es: "ÚLTIMO RECORD MUNDIAL" },
    { en: "24M AGO", es: "HACE 24M" },
    { en: "VIEW COMPLETE PROTOCOL", es: "CONSULTAR PROTOCOLO COMPLETO" },
    { en: "RANKING TERMS", es: "TÉRMINOS DE RANKING" },
    { en: "PRIVACY & LOGS", es: "PRIVACIDAD & LOGS" },
    { en: "DISCORD SERVER", es: "DISCORD SERVER" },
    { en: "GITHUB REPO", es: "GITHUB REPO" },
    { en: "JOIN OFFICIAL DISCORD", es: "UNIRSE AL DISCORD OFICIAL" }
  ];

  // 3. Proper Names Whitelist (Strict Protection: NEVER translated)
  const PROTECTED_NAMES = new Set([
    // Routes
    "City Perimeter", "Heritage Heights", "Dunwich Bay", "Point Camden",
    "Omega Loop", "North Broadway", "Rosewood & Heritage", "Petersburg Dam",
    "Beacon & Somerset", "NFS World Loop", "Campus Way", "Ironwood & Hillcrest",
    "Hwy 201 & Lyons", "Diamond & Union", "Waterfront & Chancellor", "Camden & Boundary",
    "Hwy 99 & Route 55", "Heritage & North Broadway", "Boundary & Diamond",
    // Blacklist Drivers / Pilots
    "Razor", "Bull", "Ronnie", "Torque", "Webster", "Baron", "Big Lou",
    "Izzy", "Sonny", "Avenger", "SRTxAvenger™", "Nebula", "ZimanX",
    "N6 xBourne", "Earl", "Jewels", "JV", "Kaze", "Ming", "Vic", "Taz",
    "Clarence Callahan", "Toru Sato", "Ronald McCrea", "Joe Vega", "Eugene James",
    "Victor Vasquez", "Kira Nakazato", "Lou Park", "Hector Domingo", "Wes Allen",
    "Vince Kilic", "Jade Barrett", "Karl Smit", "Ho Seun"
  ]);

  // 4. State & Initialization
  let currentLanguage = 'en';

  function initI18n() {
    try {
      const stored = (typeof localStorage !== 'undefined') ? localStorage.getItem('nfs_lang') : null;
      currentLanguage = (stored === 'es') ? 'es' : 'en'; // English is primary by default!
    } catch (e) {
      currentLanguage = 'en';
    }

    if (typeof i18next !== 'undefined') {
      i18next.init({
        lng: currentLanguage,
        fallbackLng: 'en',
        debug: false,
        resources: {
          en: { translation: enTranslations },
          es: { translation: esTranslations }
        }
      }, function (err, t) {
        if (err) console.warn('[i18n] Error initializing i18next:', err);
        applyTranslations();
      });
    } else {
      // Standalone fallback if i18next script is deferred
      applyTranslations();
    }
  }

  // 5. Apply Translations Across DOM
  function applyTranslations() {
    const isEn = (currentLanguage === 'en');

    // Update document language attribute
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = currentLanguage;
    }

    // A. Elements with data-i18n attributes
    if (typeof document !== 'undefined') {
      const i18nElements = document.querySelectorAll('[data-i18n]');
      i18nElements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        const trans = (typeof i18next !== 'undefined' && i18next.exists(key))
          ? i18next.t(key)
          : (isEn ? enTranslations[key] : esTranslations[key]);
        if (trans) {
          el.textContent = trans;
        }
      });

      // B. Elements with data-i18n-html attributes
      const i18nHtmlElements = document.querySelectorAll('[data-i18n-html]');
      i18nHtmlElements.forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (!key) return;
        const trans = (typeof i18next !== 'undefined' && i18next.exists(key))
          ? i18next.t(key)
          : (isEn ? enTranslations[key] : esTranslations[key]);
        if (trans) {
          el.innerHTML = trans;
        }
      });

      // C. Elements with data-i18n-placeholder
      const i18nPlaceholders = document.querySelectorAll('[data-i18n-placeholder]');
      i18nPlaceholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (!key) return;
        const trans = (typeof i18next !== 'undefined' && i18next.exists(key))
          ? i18next.t(key)
          : (isEn ? enTranslations[key] : esTranslations[key]);
        if (trans) {
          el.placeholder = trans;
        }
      });

      // D. Full DOM Text-Node Walk with Bilingual Matcher
      translateDOMTextNodes(currentLanguage);

      // D2. Generic Placeholders & Tooltips
      translatePlaceholdersAndTitles(currentLanguage);

      // E. Update Language Selector Dropdown UI
      updateLangDropdownUI(currentLanguage);

      // F. Trigger Dynamic Controllers Re-render
      refreshDynamicControllers(currentLanguage);
    }
  }

  // Helper: Walk DOM and translate recognized phrases
  function translateDOMTextNodes(targetLang) {
    if (typeof document === 'undefined') return;
    const isEn = (targetLang === 'en');

    // Build replacement map
    const sourceToTarget = new Map();
    BILINGUAL_PAIRS.forEach(pair => {
      if (isEn) {
        // Spanish -> English
        sourceToTarget.set(pair.es.trim(), pair.en.trim());
      } else {
        // English -> Spanish
        sourceToTarget.set(pair.en.trim(), pair.es.trim());
      }
    });

    const walker = document.createTreeWalker(
      document.body || document.documentElement,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node || !node.nodeValue) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          // Skip scripts, styles, inputs, protected elements
          const tag = parent.tagName.toLowerCase();
          if (tag === 'script' || tag === 'style' || tag === 'textarea' || tag === 'code' || tag === 'pre') {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.closest('#lang-selector-wrapper')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let currentNode;
    while ((currentNode = walker.nextNode())) {
      const trimmed = currentNode.nodeValue.trim();
      if (!trimmed || trimmed.length < 2) continue;

      // STRICT PROTECTION: If this text is a protected route or driver name, never translate!
      if (PROTECTED_NAMES.has(trimmed)) continue;

      if (sourceToTarget.has(trimmed)) {
        const replacement = sourceToTarget.get(trimmed);
        const leadingSpace = currentNode.nodeValue.match(/^\s*/)[0];
        const trailingSpace = currentNode.nodeValue.match(/\s*$/)[0];
        currentNode.nodeValue = leadingSpace + replacement + trailingSpace;
      }
    }
  }

  // Update top-right language dropdown UI
  function updateLangDropdownUI(lang) {
    if (typeof document === 'undefined') return;
    const label = document.getElementById('current-lang-label');
    if (label) {
      label.textContent = (lang === 'es') ? 'ESPAÑOL (ES)' : 'ENGLISH (EN)';
    }

    const checkEn = document.getElementById('lang-check-en');
    const checkEs = document.getElementById('lang-check-es');
    const optEn = document.getElementById('lang-opt-en');
    const optEs = document.getElementById('lang-opt-es');

    if (checkEn && checkEs) {
      if (lang === 'en') {
        checkEn.classList.remove('hidden');
        checkEs.classList.add('hidden');
        if (optEn) optEn.className = "flex items-center justify-between gap-2 px-3 py-2 text-left font-label-hud text-[11px] uppercase tracking-wider rounded bg-surface-container-highest transition-colors cursor-pointer text-primary-container font-black";
        if (optEs) optEs.className = "flex items-center justify-between gap-2 px-3 py-2 text-left font-label-hud text-[11px] uppercase tracking-wider rounded hover:bg-surface-container-highest transition-colors cursor-pointer text-on-surface-variant hover:text-on-surface";
      } else {
        checkEn.classList.add('hidden');
        checkEs.classList.remove('hidden');
        if (optEs) optEs.className = "flex items-center justify-between gap-2 px-3 py-2 text-left font-label-hud text-[11px] uppercase tracking-wider rounded bg-surface-container-highest transition-colors cursor-pointer text-primary-container font-black";
        if (optEn) optEn.className = "flex items-center justify-between gap-2 px-3 py-2 text-left font-label-hud text-[11px] uppercase tracking-wider rounded hover:bg-surface-container-highest transition-colors cursor-pointer text-on-surface-variant hover:text-on-surface";
      }
    }
  }

  // Helper: Translate placeholders and tooltip titles
  function translatePlaceholdersAndTitles(targetLang) {
    if (typeof document === 'undefined') return;
    const isEn = (targetLang === 'en');
    const sourceToTarget = new Map();
    BILINGUAL_PAIRS.forEach(pair => {
      if (isEn) {
        sourceToTarget.set(pair.es.trim(), pair.en.trim());
      } else {
        sourceToTarget.set(pair.en.trim(), pair.es.trim());
      }
    });

    // Translate placeholder attributes on inputs and textareas
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
      const ph = el.getAttribute('placeholder');
      if (ph && sourceToTarget.has(ph.trim())) {
        el.placeholder = sourceToTarget.get(ph.trim());
      }
    });

    // Translate title attributes on buttons and links
    document.querySelectorAll('[title]').forEach(el => {
      const title = el.getAttribute('title');
      if (title && sourceToTarget.has(title.trim())) {
        el.setAttribute('title', sourceToTarget.get(title.trim()));
      }
    });

    // Update Uiverse animated tournament button in navbar
    const navBtn = document.getElementById('nav-uiverse-tourney-btn');
    if (navBtn) {
      navBtn.setAttribute('data-text', currentLanguage === 'es' ? 'TORNEO 2026' : 'TOURNAMENT 2026');
      navBtn.setAttribute('data-hover', currentLanguage === 'es' ? 'INSCRIBIRSE' : 'REGISTER NOW');
    }

    // Update Glitch navigation buttons & dropdown items (fat-eagle-24 yellow-orange gradient)
    const glitchNavTranslations = {
      'nav-home': { es: 'HOME', en: 'HOME' },
      'nav-routes-pistas': { es: 'RUTAS & CIRCUITOS', en: 'ROUTES & CIRCUITS' },
      'nav-blacklist': { es: 'CHALLENGES & TOURNAMENT ▾', en: 'CHALLENGES & TOURNAMENT ▾' },
      'nav-challenges': { es: 'Weekly Challenges', en: 'Weekly Challenges' },
      'nav-blacklist-groups': { es: 'Blacklist Groups & Rivals', en: 'Blacklist Groups & Rivals' },
      'nav-championship-standings': { es: 'Championship Standings', en: 'Championship Standings' },
      'nav-blacklist-cards': { es: 'Driver Dossiers (1 - 15)', en: 'Driver Dossiers (1 - 15)' },
      'nav-championship-register': { es: 'Tournament Registration', en: 'Tournament Registration' },
      'nav-tutorial': { es: 'Tournament Tutorial', en: 'Tournament Tutorial' },
      'nav-past-tournaments': { es: 'Past Tournaments (Challonge)', en: 'Past Tournaments (Challonge)' },
      'nav-halloffame': { es: 'HALL DE LA FAMA', en: 'HALL OF FAME' },
      'nav-telemetria': { es: 'TELEMETRÍA', en: 'TELEMETRY' },
      'nav-community': { es: 'COMUNIDAD ▾', en: 'COMMUNITY ▾' },
      'nav-guides': { es: 'Guías de Tuning', en: 'Tuning Guides' },
      'nav-rules': { es: 'Reglamento Oficial', en: 'Official Rules' },
      'nav-map': { es: 'Mapa Táctico', en: 'Tactical Map' },
      'nav-download': { es: 'Centro de Descargas', en: 'Download Center' },
      'nav-submit': { es: 'Subir Registro', en: 'Submit Record' }
    };
    Object.entries(glitchNavTranslations).forEach(([id, trans]) => {
      const el = document.getElementById(id);
      if (el) {
        const text = trans[currentLanguage] || trans['es'];
        el.setAttribute('data-glitch', text);
      }
    });
  }

  // Re-render active controllers with the new language
  function refreshDynamicControllers(lang) {
    if (typeof window === 'undefined') return;
    try {
      if (typeof window.renderWeekTimelinePills === 'function') window.renderWeekTimelinePills();
      if (typeof window.renderTournamentKPIStrip === 'function') window.renderTournamentKPIStrip();
      if (typeof window.renderGroupsGrid === 'function') window.renderGroupsGrid();
      if (typeof window.updateGroupFilterButtons === 'function') window.updateGroupFilterButtons();
      if (typeof window.renderWeeklyChallenges === 'function') window.renderWeeklyChallenges();
      if (typeof window.renderStandingsKPIStrip === 'function') window.renderStandingsKPIStrip();
      if (typeof window.renderStandingsMatrix === 'function') window.renderStandingsMatrix();
      if (typeof window.renderDossierSidebar === 'function') window.renderDossierSidebar();
      if (typeof window.renderWeekNavigationPills === 'function') window.renderWeekNavigationPills();
      if (typeof window.renderSummaryBar === 'function') window.renderSummaryBar();
      if (typeof window.renderChallengesGrid === 'function') window.renderChallengesGrid();
      if (typeof window.filterRoutes === 'function') window.filterRoutes();
    } catch (e) {
      console.warn('[i18n] Note during dynamic controller refresh:', e);
    }
  }

  // 6. Public API
  function changeLanguage(lang) {
    if (lang !== 'en' && lang !== 'es') lang = 'en';
    currentLanguage = lang;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('nfs_lang', lang);
      }
    } catch (e) {}

    if (typeof i18next !== 'undefined' && typeof i18next.changeLanguage === 'function') {
      i18next.changeLanguage(lang, function () {
        applyTranslations();
      });
    } else {
      applyTranslations();
    }

    // Close dropdown menu
    const menu = document.getElementById('lang-dropdown-menu');
    if (menu) menu.classList.add('hidden');

    // Dispatch global custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
  }

  function toggleLanguageDropdown(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const menu = document.getElementById('lang-dropdown-menu');
    if (!menu) return;
    menu.classList.toggle('hidden');
  }

  // Close dropdown on outside click
  if (typeof document !== 'undefined') {
    document.addEventListener('click', function (e) {
      const wrapper = document.getElementById('lang-selector-wrapper');
      const menu = document.getElementById('lang-dropdown-menu');
      if (menu && wrapper && !wrapper.contains(e.target)) {
        menu.classList.add('hidden');
      }
    });
  }

  // Global exposure
  if (typeof window !== 'undefined') {
    window.changeLanguage = changeLanguage;
    window.toggleLanguageDropdown = toggleLanguageDropdown;
    window.applyTranslations = applyTranslations;
    window.getCurrentLanguage = () => currentLanguage;
    window.t = function (key, defaultVal) {
      if (typeof i18next !== 'undefined' && i18next.exists(key)) {
        return i18next.t(key);
      }
      const dict = (currentLanguage === 'es') ? esTranslations : enTranslations;
      return dict[key] || defaultVal || key;
    };
  }

  if (typeof module !== 'undefined') {
    module.exports = {
      enTranslations,
      esTranslations,
      BILINGUAL_PAIRS,
      PROTECTED_NAMES,
      changeLanguage,
      applyTranslations,
      getCurrentLanguage: () => currentLanguage
    };
  }

  // Auto-run on DOMContentLoaded or immediate execution
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initI18n);
    } else {
      initI18n();
    }
  }
})();
