const fs = require('fs');
const vm = require('vm');

const i18nRaw = fs.readFileSync('assets/js/i18n.js', 'utf8');

// Extract the pre-dictionary and post-dictionary code
const dictStartMarker = 'const I18N_TRANSLATIONS = {';
const dictEndMarker = 'let currentLanguage = ';

const preDict = i18nRaw.slice(0, i18nRaw.indexOf(dictStartMarker));
const dictCode = i18nRaw.slice(i18nRaw.indexOf(dictStartMarker), i18nRaw.indexOf(dictEndMarker));
const postDict = i18nRaw.slice(i18nRaw.indexOf(dictEndMarker));

// Parse the current dictionaries
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(dictCode + '\n;this.translations = I18N_TRANSLATIONS;', sandbox);
const T = sandbox.translations;

console.log('Original keys - es:', Object.keys(T.es).length, 'en:', Object.keys(T.en).length, 'pt:', Object.keys(T.pt).length);

// Additional translations to add/overwrite for complete coverage
const newTranslations = {
    // Stitch Home & Common
    stitch_ticker_live: {
        en: "OFFICIAL LEADERBOARDS & SPEEDRUN RECORDS",
        es: "CLASIFICACIONES OFICIALES Y RÉCORDS DE VELOCIDAD",
        pt: "CLASSIFICAÇÕES OFICIAIS E RECORDES DE VELOCIDADE"
    },
    stitch_season_title: {
        en: "ROAD TO BLACKLIST 2026",
        es: "CAMINO A LA BLACKLIST 2026",
        pt: "CAMINHO PARA A BLACKLIST 2026"
    },
    hero_title_records_main: {
        en: "NEED FOR SPEED: MOST WANTED",
        es: "NEED FOR SPEED: MOST WANTED",
        pt: "NEED FOR SPEED: MOST WANTED"
    },
    hero_title_rockport: {
        en: "ROCKPORT WORLD RECORDS",
        es: "RÉCORDS MUNDIALES DE ROCKPORT",
        pt: "RECORDES MUNDIAIS DE ROCKPORT"
    },
    hero_search_placeholder: {
        en: "Search route, driver, vehicle or category...",
        es: "Buscar ruta, piloto, vehículo o categoría...",
        pt: "Buscar rota, piloto, veículo ou categoria..."
    },
    hero_stat_drivers: {
        en: "Active Drivers",
        es: "Pilotos Activos",
        pt: "Pilotos Ativos"
    },
    hero_stat_routes_full: {
        en: "Official Tracks",
        es: "Pistas Oficiales",
        pt: "Pistas Oficiais"
    },
    hero_stat_blacklist: {
        en: "Blacklist Rivals",
        es: "Rivales Blacklist",
        pt: "Rivais Blacklist"
    },
    stitch_action_explorer: {
        en: "Explore Leaderboards",
        es: "Explorar Clasificaciones",
        pt: "Explorar Classificações"
    },
    stitch_live_badge: {
        en: "REAL TIME",
        es: "TIEMPO REAL",
        pt: "TEMPO REAL"
    },
    stitch_card_live_title: {
        en: "LIVE STANDINGS",
        es: "CLASIFICACIÓN EN VIVO",
        pt: "CLASSIFICAÇÃO AO VIVO"
    },
    stitch_card_live_desc: {
        en: "Top world records • Season 2026",
        es: "Mejores récords mundiales • Temporada 2026",
        pt: "Melhores recordes mundiais • Temporada 2026"
    },
    stitch_btn_explore_all: {
        en: "EXPLORE ALL LEADERBOARDS",
        es: "EXPLORAR TODAS LAS CLASIFICACIONES",
        pt: "EXPLORAR TODAS AS CLASSIFICAÇÕES"
    },
    stitch_view_standings: {
        en: "VIEW STANDINGS",
        es: "VER CLASIFICACIÓN",
        pt: "VER CLASSIFICAÇÃO"
    },
    stitch_groups_challenges: {
        en: "GROUPS & CHALLENGES",
        es: "GRUPOS & RETOS",
        pt: "GRUPOS & DESAFIOS"
    },

    // Routes & Tracks Explorer (view-routes-pistas)
    nav_routes_pistas: {
        en: "Routes & Tracks",
        es: "Rutas o Pistas",
        pt: "Rotas e Pistas"
    },
    routes_pistas_sup: {
        en: "SECTOR DATABASE // 2005 ARCHIVE",
        es: "BASE DE DATOS DE SECTORES // ARCHIVO 2005",
        pt: "BANCO DE DADOS DE SETORES // ARQUIVO 2005"
    },
    routes_pistas_gps_feed: {
        en: "GPS TELEMETRY FEED: ONLINE",
        es: "FEED TELEMETRÍA GPS: ONLINE",
        pt: "FEED TELEMETRIA GPS: ONLINE"
    },
    routes_pistas_title: {
        en: "ROUTES & TRACKS EXPLORER",
        es: "EXPLORADOR DE RUTAS Y PISTAS",
        pt: "EXPLORADOR DE ROTAS E PISTAS"
    },
    routes_pistas_desc: {
        en: "86 Official Rockport City Tracks • Real-Time Telemetry & World Records verified under Any% Speedrun Compliant regulations.",
        es: "86 Trazados Oficiales de Rockport City • Telemetría en tiempo real y Récords Mundiales verificados bajo normativa Any% Speedrun Compliant.",
        pt: "86 Pistas Oficiais de Rockport City • Telemetria em tempo real e Recordes Mundiais verificados sob regulamento Any% Speedrun Compliant."
    },
    stat_cataloged_tracks: {
        en: "Cataloged Tracks",
        es: "Pistas Catalogadas",
        pt: "Pistas Catalogadas"
    },
    stat_cataloged_unit: {
        en: "Sectors",
        es: "Sectores",
        pt: "Setores"
    },
    stat_latest_record: {
        en: "Latest Registered Record",
        es: "Último Récord Registrado",
        pt: "Último Recorde Registrado"
    },
    stat_meta_car: {
        en: "Dominant Meta Car",
        es: "Meta Coche Dominante",
        pt: "Carro Meta Dominante"
    },
    stat_rules_official: {
        en: "Official Regulations",
        es: "Reglamento Oficial",
        pt: "Regulamento Oficial"
    },
    stat_rules_compliant: {
        en: "No-Reset / Any% Speedrun Compliant",
        es: "No-Reset / Cumple Any% Speedrun",
        pt: "No-Reset / Compatível com Any% Speedrun"
    },
    routes_search_placeholder: {
        en: "Search track by name, record or car...",
        es: "Buscar por trazado, récord o coche...",
        pt: "Buscar por pista, recorde ou carro..."
    },
    routes_filter_all_districts: {
        en: "ALL DISTRICTS (86)",
        es: "TODOS LOS DISTRITOS (86)",
        pt: "TODOS OS DISTRITOS (86)"
    },
    routes_sort_wr: {
        en: "Sort: World Record (WR)",
        es: "Ordenar: Récord Mundial (WR)",
        pt: "Ordenar: Recorde Mundial (WR)"
    },
    routes_sort_name: {
        en: "Sort: Name (A-Z)",
        es: "Ordenar: Nombre (A-Z)",
        pt: "Ordenar: Nome (A-Z)"
    },
    routes_sort_activity: {
        en: "Sort: Most Active",
        es: "Ordenar: Mayor Actividad",
        pt: "Ordenar: Maior Atividade"
    },
    routes_cat_all: {
        en: "ALL (86)",
        es: "TODOS (86)",
        pt: "TODOS (86)"
    },
    routes_cat_circuits: {
        en: "CIRCUITS (29)",
        es: "CIRCUITOS (29)",
        pt: "CIRCUITOS (29)"
    },
    routes_cat_sprints: {
        en: "SPRINTS (46)",
        es: "SPRINTS (46)",
        pt: "SPRINTS (46)"
    },
    routes_cat_drags: {
        en: "DRAGS (11)",
        es: "DRAGS (11)",
        pt: "DRAGS (11)"
    },
    routes_competition_tracks: {
        en: "Competition Tracks",
        es: "Trazados de Competición",
        pt: "Pistas de Competição"
    },
    routes_badge_verified_wr: {
        en: "Verified WR",
        es: "WR Verificado",
        pt: "WR Verificado"
    },
    routes_badge_noreset: {
        en: "No-Reset Homologated",
        es: "No-Reset Homologado",
        pt: "No-Reset Homologado"
    },
    track_top_speed: {
        en: "Top Speed",
        es: "Vel. Punta",
        pt: "Vel. Máxima"
    },
    track_split_s1: {
        en: "Split S1",
        es: "Split S1",
        pt: "Split S1"
    },
    track_records_count: {
        en: "Records",
        es: "Registros",
        pt: "Registros"
    },
    btn_show_all_tracks: {
        en: "Show All 86 Official Tracks",
        es: "Ver Todos los 86 Circuitos Oficiales",
        pt: "Ver Todas as 86 Pistas Oficiais"
    },
    btn_show_fewer_tracks: {
        en: "Show Fewer Tracks (6 featured)",
        es: "Ver Menos Trazados (6 destacados)",
        pt: "Ver Menos Pistas (6 destacadas)"
    },

    // Challenges View
    challenges_sup: {
        en: "NEED FOR SPEED: MOST WANTED // ROCKPORT SEASONS 2026",
        es: "NEED FOR SPEED: MOST WANTED // TEMPORADAS ROCKPORT 2026",
        pt: "NEED FOR SPEED: MOST WANTED // TEMPORADAS ROCKPORT 2026"
    },
    challenges_title: {
        en: "CHALLENGES",
        es: "DESAFÍOS",
        pt: "DESAFIOS"
    },
    challenges_glow: {
        en: "// BLACKLIST SEASONS",
        es: "// TEMPORADAS BLACKLIST",
        pt: "// TEMPORADAS BLACKLIST"
    },
    challenges_desc: {
        en: "Compete in the 4 official weekly trials (2 Circuits and 2 Sprints in Junkman and BMW M3 GTR categories), homologate your times and conquer the reward pot in the official season standings.",
        es: "Compite en las 4 pruebas semanales oficiales (2 Circuitos y 2 Sprints en categorías Junkman y BMW M3 GTR), homologa tus tiempos y conquista el pozo de recompensas en la clasificación oficial de la temporada.",
        pt: "Compita nas 4 provas semanais oficiais (2 Circuitos e 2 Sprints nas categorias Junkman e BMW M3 GTR), homologue seus tempos e conquiste o pote de recompensas na classificação oficial da temporada."
    },
    btn_subtab_challenges: {
        en: "⚡ Weekly Challenges",
        es: "⚡ Desafíos Semanales",
        pt: "⚡ Desafios Semanais"
    },
    btn_subtab_season_standings: {
        en: "🏆 Season Standings",
        es: "🏆 Clasificación de Temporada",
        pt: "🏆 Classificação da Temporada"
    },
    btn_subtab_blacklist_event: {
        en: "💀 Blacklist Event 2026",
        es: "💀 Evento Blacklist 2026",
        pt: "💀 Evento Blacklist 2026"
    },
    summary_active_week: {
        en: "ACTIVE WEEK",
        es: "SEMANA ACTIVA",
        pt: "SEMANA ATIVA"
    },
    summary_weekly_trials: {
        en: "WEEKLY TRIALS",
        es: "PRUEBAS SEMANALES",
        pt: "PROVAS SEMANAIS"
    },
    summary_regulatory_format: {
        en: "REGULATORY FORMAT",
        es: "FORMATO REGLAMENTARIO",
        pt: "FORMATO REGULAMENTAR"
    },
    summary_weekly_pot: {
        en: "WEEKLY POT",
        es: "POZO SEMANAL",
        pt: "POTE SEMANAL"
    },
    btn_submit_record: {
        en: "🚀 Submit Record",
        es: "🚀 Enviar Récord",
        pt: "🚀 Enviar Recorde"
    },
    btn_refresh_table: {
        en: "🔄 Refresh Table",
        es: "🔄 Actualizar Tabla",
        pt: "🔄 Atualizar Tabela"
    },
    th_week_1: {
        en: "Week 1",
        es: "Semana 1",
        pt: "Semana 1"
    },
    th_week_2: {
        en: "Week 2",
        es: "Semana 2",
        pt: "Semana 2"
    },
    th_week_3: {
        en: "Week 3",
        es: "Semana 3",
        pt: "Semana 3"
    },
    th_week_4: {
        en: "Week 4",
        es: "Semana 4",
        pt: "Semana 4"
    },
    th_total_points: {
        en: "Total Points",
        es: "Puntos Totales",
        pt: "Pontos Totais"
    },
    th_accumulated_reward: {
        en: "Accumulated Reward Pot",
        es: "Bolsa Acumulada",
        pt: "Bolsa Acumulada"
    },
    th_honorary_tier: {
        en: "Honorary Tier",
        es: "Rango Honorífico",
        pt: "Nível Honorário"
    },

    // Blacklist Event View
    bl_sup: {
        en: "OFFICIAL TOURNAMENT // ROCKPORT CITY ELITE",
        es: "TORNEO OFICIAL // ÉLITE DE ROCKPORT CITY",
        pt: "TORNEIO OFICIAL // ELITE DE ROCKPORT CITY"
    },
    bl_title: {
        en: "BLACKLIST EVENT",
        es: "EVENTO BLACKLIST",
        pt: "EVENTO BLACKLIST"
    },
    bl_glow: {
        en: "// RANKS 2026",
        es: "// RANKS 2026",
        pt: "// RANKS 2026"
    },
    bl_desc: {
        en: "Official 4-Week Championship: 15 Drivers, 8 Challenges per week and rotation in 5 groups. Top times earn point bonuses and reputation ($ REP).",
        es: "Campeonato Oficial de 4 Semanas: 15 Pilotos, 8 Desafíos por semana y rotación en 5 grupos. Los mejores tiempos obtienen bonificaciones de puntos y reputación ($ REP).",
        pt: "Campeonato Oficial de 4 Semanas: 15 Pilotos, 8 Desafios por semana e rotação em 5 grupos. Os melhores tempos ganham bônus de pontos e reputação ($ REP)."
    },
    bl_promo_badge: {
        en: "OFFICIAL CHAMPIONSHIP • ROCKPORT BLACKLIST 2026",
        es: "CAMPEONATO OFICIAL • ROCKPORT BLACKLIST 2026",
        pt: "CAMPEONATO OFICIAL • ROCKPORT BLACKLIST 2026"
    },
    bl_promo_title: {
        en: "15 RIVALS // 4 WEEKS // $23.5M REP IN PRIZES",
        es: "15 RIVALES // 4 SEMANAS // $23.5M REP EN PREMIOS",
        pt: "15 RIVAIS // 4 SEMANAS // $23.5M REP EM PRÊMIOS"
    },
    bl_promo_desc: {
        en: "Four weeks of qualifying to the limit: City Circuits, high-speed Coastal Sprints, Drag acceleration Speed Traps, and the 1v1 Grand Final against #1 boss Razor.",
        es: "Cuatro semanas de clasificación al límite: Circuitos urbanos, Sprints costeros de alta velocidad, Speed Traps de aceleración Drag y la Gran Final 1v1 contra el jefe #1 Razor.",
        pt: "Quatro semanas de classificação no limite: Circuitos urbanos, Sprints costeiros de alta velocidade, Speed Traps de arrancada Drag e a Grande Final 1v1 contra o chefe #1 Razor."
    },
    bl_btn_register: {
        en: "Register for Blacklist 2026",
        es: "Inscribirme en Blacklist 2026",
        pt: "Inscrever-me na Blacklist 2026"
    },
    bl_btn_tutorial: {
        en: "How the Tournament Works (Tutorial)",
        es: "Cómo funciona el Torneo (Tutorial)",
        pt: "Como funciona o Torneio (Tutorial)"
    },
    bl_btn_standings: {
        en: "View General Standings",
        es: "Ver Clasificación General",
        pt: "Ver Classificação Geral"
    },
    bl_subtab_groups: {
        en: "Groups & Challenges",
        es: "Grupos & Retos",
        pt: "Grupos & Desafios"
    },
    bl_subtab_standings: {
        en: "Standings Table",
        es: "Tabla de Clasificación",
        pt: "Tabela de Classificação"
    },
    bl_subtab_dossiers: {
        en: "Tactical Dossiers",
        es: "Fichas Técnicas",
        pt: "Fichas Técnicas"
    },
    bl_subtab_register: {
        en: "Register for Tournament",
        es: "Inscribirse al Torneo",
        pt: "Inscrever-se no Torneio"
    },
    bl_subtab_past: {
        en: "Past Tournaments",
        es: "Torneos Anteriores",
        pt: "Torneios Anteriores"
    },
    bl_stat_leader: {
        en: "BLACKLIST #1 LEADER",
        es: "LÍDER BLACKLIST #1",
        pt: "LÍDER BLACKLIST #1"
    },
    bl_stat_rep: {
        en: "TOTAL REP POT",
        es: "POZO TOTAL REP",
        pt: "POTE TOTAL REP"
    },
    bl_stat_week: {
        en: "CHAMPIONSHIP WEEK",
        es: "SEMANA DE CAMPEONATO",
        pt: "SEMANA DE CAMPEONATO"
    },
    bl_stat_status: {
        en: "TOURNAMENT STATUS",
        es: "ESTADO DEL TORNEO",
        pt: "STATUS DO TORNEIO"
    },
    bl_racing_groups_title: {
        en: "RACING GROUPS (OFFICIAL GROUPS • WEEKLY ROTATION)",
        es: "GRUPOS DE CARRERA (GRUPOS OFICIALES • ROTACIÓN SEMANAL)",
        pt: "GRUPOS DE CORRIDA (GRUPOS OFICIAIS • ROTAÇÃO SEMANAL)"
    },
    bl_racing_groups_sub: {
        en: "Direct 3-driver face-offs to dispute the 8 routes and weekly challenges",
        es: "Enfrentamientos directos de 3 pilotos para disputar las 8 rutas y retos semanales",
        pt: "Confrontos diretos de 3 pilotos para disputar as 8 rotas e desafios semanais"
    },
    bl_weekly_challenges_title: {
        en: "WEEKLY CHAMPIONSHIP CHALLENGES (8 ROUTES PER GROUP) // BEST TIME BONUSES",
        es: "DESAFÍOS SEMANALES DEL CAMPEONATO (8 RUTAS POR GRUPO) // BONOS MEJOR TIEMPO",
        pt: "DESAFIOS SEMANAIS DO CAMPEONATO (8 ROTAS POR GRUPO) // BÔNUS MELHOR TEMPO"
    },

    // Standings View
    champ_standings_sup: {
        en: "OFFICIAL CUMULATIVE TABLE // ROCKPORT CITY",
        es: "TABLA ACUMULADA OFICIAL // ROCKPORT CITY",
        pt: "TABELA ACUMULADA OFICIAL // ROCKPORT CITY"
    },
    champ_standings_title: {
        en: "STANDINGS",
        es: "CLASIFICACIÓN",
        pt: "CLASSIFICAÇÃO"
    },
    champ_standings_glow: {
        en: "// BLACKLIST 2026 STANDINGS",
        es: "// CLASIFICACIÓN BLACKLIST 2026",
        pt: "// CLASSIFICAÇÃO BLACKLIST 2026"
    },
    champ_standings_desc: {
        en: "Cumulative standings of drivers classified by total points, race podiums, time bonuses, and reputation ($ REP).",
        es: "Clasificación acumulada de pilotos ordenada por puntos totales, podios en carrera, bonificaciones de tiempo y reputación ($ REP).",
        pt: "Classificação acumulada de pilotos ordenada por pontos totais, pódios em corrida, bônus de tempo e reputação ($ REP)."
    },
    champ_stat_cur_leader: {
        en: "CURRENT CHAMPIONSHIP LEADER",
        es: "LÍDER ACTUAL DEL CAMPEONATO",
        pt: "LÍDER ATUAL DO CAMPEONATO"
    },
    champ_stat_rep: {
        en: "TOTAL REP POT",
        es: "POZO TOTAL REP",
        pt: "POTE TOTAL REP"
    },
    champ_stat_season: {
        en: "OFFICIAL SEASON",
        es: "TEMPORADA OFICIAL",
        pt: "TEMPORADA OFICIAL"
    },
    champ_stat_pilots: {
        en: "COMPETING DRIVERS",
        es: "PILOTOS EN COMPETICIÓN",
        pt: "PILOTOS EM COMPETIÇÃO"
    },
    champ_table_title: {
        en: "OFFICIAL CHAMPIONSHIP GENERAL STANDINGS (TOP 15)",
        es: "CLASIFICACIÓN GENERAL OFICIAL DEL CAMPEONATO (TOP 15)",
        pt: "CLASSIFICAÇÃO GERAL OFICIAL DO CAMPEONATO (TOP 15)"
    },
    view_cards_horizontal: {
        en: "Horizontal Cards",
        es: "Ficha Horizontal",
        pt: "Ficha Horizontal"
    },
    view_table_classic: {
        en: "Table",
        es: "Tabla",
        pt: "Tabela"
    },
    col_time_bonus: {
        en: "Time Bonus",
        es: "Bonificación de Tiempo",
        pt: "Bônus de Tempo"
    },
    col_group: {
        en: "Group",
        es: "Grupo",
        pt: "Grupo"
    },
    col_status: {
        en: "Status",
        es: "Estado",
        pt: "Status"
    },

    // Blacklist Cards / Tactical Dossiers
    cards_sup: {
        en: "TACTICAL DOSSIERS // DRIVER TELEMETRY",
        es: "FICHAS TÉCNICAS // TELEMETRÍA DE PILOTOS",
        pt: "FICHAS TÉCNICAS // TELEMETRIA DE PILOTOS"
    },
    cards_title: {
        en: "TACTICAL DOSSIERS",
        es: "FICHAS TÉCNICAS",
        pt: "FICHAS TÉCNICAS"
    },
    cards_glow: {
        en: "// OFFICIAL BLACKLIST",
        es: "// BLACKLIST OFICIAL",
        pt: "// BLACKLIST OFICIAL"
    },
    cards_desc: {
        en: "Official technical and tactical dossiers of Rockport City racers, ranked in strict order with vehicles, statistics, and reputation.",
        es: "Fichas técnicas y tácticas oficiales de los corredores de Rockport City, ordenadas con sus vehículos, estadísticas y reputación.",
        pt: "Fichas técnicas e táticas oficiais dos pilotos de Rockport City, ordenadas com seus veículos, estatísticas e reputação."
    },
    quick_jump_title: {
        en: "⚡ QUICK JUMP TO DRIVER:",
        es: "⚡ SALTO RÁPIDO A PILOTO:",
        pt: "⚡ SALTO RÁPIDO PARA O PILOTO:"
    },

    // Registration View
    reg_sup: {
        en: "OFFICIAL GRID // ROCKPORT REGISTRATION",
        es: "PARRILLA OFICIAL // REGISTRO DE ROCKPORT",
        pt: "GRID OFICIAL // REGISTRO DE ROCKPORT"
    },
    reg_title: {
        en: "TOURNAMENT REGISTRATION",
        es: "INSCRIPCIÓN AL TORNEO",
        pt: "INSCRIÇÃO NO TORNEIO"
    },
    reg_glow: {
        en: "// BLACKLIST EVENT 2026",
        es: "// EVENTO BLACKLIST 2026",
        pt: "// EVENTO BLACKLIST 2026"
    },
    reg_desc: {
        en: "Join the official starting grid of the Rockport City 2026 Blacklist Championship. Register with your vehicle and schedule availability to secure your official slot.",
        es: "Únete a la parrilla oficial de salida del Campeonato Blacklist 2026 de Rockport City. Regístrate con tu vehículo y disponibilidad para asegurar tu plaza.",
        pt: "Junte-se ao grid oficial de largada do Campeonato Blacklist 2026 de Rockport City. Inscreva-se com seu veículo e disponibilidade para garantir sua vaga."
    },
    reg_stat_slots: {
        en: "CHAMPIONSHIP SLOTS",
        es: "PLAZAS DEL CAMPEONATO",
        pt: "VAGAS DO CAMPEONATO"
    },
    reg_stat_status: {
        en: "REGISTRATION STATUS",
        es: "ESTADO DE INSCRIPCIONES",
        pt: "STATUS DAS INSCRIÇÕES"
    },
    reg_stat_verification: {
        en: "FAIR PLAY VERIFICATION",
        es: "VERIFICACIÓN FAIR PLAY",
        pt: "VERIFICAÇÃO FAIR PLAY"
    },
    reg_stat_db: {
        en: "CLOUD DATABASE",
        es: "BASE DE DATOS CLOUD",
        pt: "BANCO DE DADOS CLOUD"
    },
    reg_form_badge: {
        en: "OFFICIAL FORM",
        es: "FORMULARIO OFICIAL",
        pt: "FORMULÁRIO OFICIAL"
    },
    reg_form_title: {
        en: "Driver Registration // Event Rank 2026",
        es: "Registro de Pilotos // Event Rank 2026",
        pt: "Registro de Pilotos // Event Rank 2026"
    },
    reg_form_desc: {
        en: "Complete your information to compete in the 4 weeks of competition and face Rockport's best racers.",
        es: "Completa tus datos para competir en las 4 semanas de competición y enfrentarte a los mejores pilotos de Rockport.",
        pt: "Complete seus dados para competir nas 4 semanas de competição e enfrentar os melhores pilotos de Rockport."
    },
    reg_label_name: {
        en: "Driver Name / Nick *",
        es: "Nombre de Piloto / Nick *",
        pt: "Nome do Piloto / Nick *"
    },
    reg_label_alias: {
        en: "Racing Alias / Tag",
        es: "Alias / Tag de Carreras",
        pt: "Apelido / Tag de Corridas"
    },
    reg_label_car: {
        en: "Official Competition Vehicle *",
        es: "Vehículo Oficial de Competición *",
        pt: "Veículo Oficial de Competição *"
    },
    reg_label_schedule: {
        en: "Schedule Availability *",
        es: "Disponibilidad Horaria *",
        pt: "Disponibilidade de Horário *"
    },
    reg_label_youtube: {
        en: "YouTube Channel or Video Link (Optional)",
        es: "Canal de YouTube o Enlace de Video (Opcional)",
        pt: "Canal do YouTube ou Link de Vídeo (Opcional)"
    },
    reg_label_contact: {
        en: "Contact Method (Discord / WhatsApp)",
        es: "Método de Contacto (Discord / WhatsApp)",
        pt: "Método de Contato (Discord / WhatsApp)"
    },
    reg_btn_submit: {
        en: "🚀 REGISTER FOR THE 2026 CHAMPIONSHIP",
        es: "🚀 INSCRIBIRME AL CAMPEONATO 2026",
        pt: "🚀 INSCREVER-ME NO CAMPEONATO 2026"
    },
    reg_panel_title: {
        en: "Real-Time Registered Drivers",
        es: "Pilotos Inscritos en Tiempo Real",
        pt: "Pilotos Inscritos em Tempo Real"
    },
    reg_panel_desc: {
        en: "Registered participants occupy official slots 1 to 15 in order of arrival.",
        es: "Los participantes registrados ocupan las plazas oficiales del 1 al 15 por orden de llegada.",
        pt: "Os participantes registrados ocupam as vagas oficiais de 1 a 15 por ordem de chegada."
    },

    // Past Tournaments View
    past_sup: {
        en: "HISTORICAL REGISTRY // CHALLONGE ARCHIVE",
        es: "REGISTRO HISTÓRICO // ARCHIVO CHALLONGE",
        pt: "REGISTRO HISTÓRICO // ARQUIVO CHALLONGE"
    },
    past_title: {
        en: "HISTORICAL HALL",
        es: "SALÓN HISTÓRICO",
        pt: "SALÃO HISTÓRICO"
    },
    past_glow: {
        en: "// NFSRANKSMW PAST EVENTS",
        es: "// EVENTOS ANTERIORES NFSRANKSMW",
        pt: "// EVENTOS ANTERIORES NFSRANKSMW"
    },
    past_desc: {
        en: "Official registry of historical competitions: brackets, verified scores, and crowned champions.",
        es: "Registro oficial de competiciones históricas: llaves eliminatorias, puntuaciones verificadas y campeones coronados.",
        pt: "Registro oficial de competições históricas: chaves eliminatórias, pontuações verificadas e campeões coroados."
    },
    past_mode_brackets: {
        en: "Match Brackets",
        es: "Llaves de Enfrentamiento",
        pt: "Chaves de Confronto"
    },
    past_mode_podium: {
        en: "Honor Roll & Podium",
        es: "Cuadro de Honor & Podio",
        pt: "Quadro de Honra & Pódio"
    },
    past_mode_roster: {
        en: "Participants Roster",
        es: "Roster de Participantes",
        pt: "Lista de Participantes"
    },
    past_roster_title: {
        en: "OFFICIAL REGISTERED DRIVERS ROSTER",
        es: "ROSTER OFICIAL DE PILOTOS REGISTRADOS",
        pt: "LISTA OFICIAL DE PILOTOS REGISTRADOS"
    },
    past_roster_sub: {
        en: "Seeded by tournament ranking and final placement reached",
        es: "Clasificados según ranking del torneo y puesto final alcanzado",
        pt: "Classificados segundo ranking do torneio e colocação final alcançada"
    },
    past_btn_challonge: {
        en: "View on Official Challonge",
        es: "Ver en Challonge Oficial",
        pt: "Ver no Challonge Oficial"
    },

    // Hall of Fame View
    hof_sup: {
        en: "HALL OF FAME // ROCKPORT LEGENDS",
        es: "SALÓN DE LA FAMA // LEYENDAS DE ROCKPORT",
        pt: "HALL DA FAMA // LENDAS DE ROCKPORT"
    },
    hof_title: {
        en: "HALL OF FAME",
        es: "SALÓN DE LA FAMA",
        pt: "HALL DA FAMA"
    },
    hof_glow: {
        en: "// ROCKPORT LEGENDS",
        es: "// LEYENDAS DE ROCKPORT",
        pt: "// LENDAS DE ROCKPORT"
    },
    hof_desc: {
        en: "Honor roll of drivers with the highest number of world records and victories in community history.",
        es: "Cuadro de honor de los pilotos con mayor número de récords mundiales y victorias en la historia de la comunidad.",
        pt: "Quadro de honra dos pilotos com o maior número de recordes mundiais e vitórias na história da comunidade."
    },
    hof_th_rank: {
        en: "Rank",
        es: "Rango",
        pt: "Posição"
    },
    hof_th_driver: {
        en: "Driver",
        es: "Piloto",
        pt: "Piloto"
    },
    hof_th_records: {
        en: "World Records",
        es: "Récords Mundiales",
        pt: "Recordes Mundiais"
    },
    hof_th_device: {
        en: "Device / Platform",
        es: "Dispositivo / Plataforma",
        pt: "Dispositivo / Plataforma"
    },
    hof_th_badge: {
        en: "Honor Badge",
        es: "Insignia de Honor",
        pt: "Insígnia de Honra"
    },

    // Top Global Drivers View
    gd_sup: {
        en: "GLOBAL RANKINGS // TOTAL PODIUMS",
        es: "RANKING GLOBAL // PODIOS TOTALES",
        pt: "RANKING GLOBAL // PÓDIOS TOTAIS"
    },
    gd_title: {
        en: "GLOBAL TOP",
        es: "TOP GLOBAL",
        pt: "TOP GLOBAL"
    },
    gd_glow: {
        en: "// TOTAL PODIUMS",
        es: "// PODIOS TOTALES",
        pt: "// PÓDIOS TOTAIS"
    },
    gd_desc: {
        en: "Cumulative driver ranking based on total 1st, 2nd, and 3rd places achieved across all official routes.",
        es: "Ranking acumulado de pilotos según la suma total de 1º, 2º y 3º puestos obtenidos en todas las rutas oficiales.",
        pt: "Ranking acumulado de pilotos segundo a soma total de 1º, 2º e 3º lugares obtidos em todas as rotas oficiais."
    },
    gd_th_rank: {
        en: "Global Rank",
        es: "Rango Global",
        pt: "Posição Global"
    },
    gd_th_p1: {
        en: "1st Places",
        es: "1º Lugares",
        pt: "1º Lugares"
    },
    gd_th_p2: {
        en: "2nd Places",
        es: "2º Lugares",
        pt: "2º Lugares"
    },
    gd_th_p3: {
        en: "3rd Places",
        es: "3º Lugares",
        pt: "3º Lugares"
    },
    gd_th_total: {
        en: "Total Podiums",
        es: "Podios Totales",
        pt: "Pódios Totais"
    },

    // Top Global Routes View
    gr_sup: {
        en: "CATEGORY BREAKDOWN // RACE DISCIPLINES",
        es: "DESGLOSE POR CATEGORÍAS // DISCIPLINAS",
        pt: "DIVISÃO POR CATEGORIAS // DISCIPLINAS"
    },
    gr_title: {
        en: "STANDINGS",
        es: "CLASIFICACIONES",
        pt: "CLASSIFICAÇÕES"
    },
    gr_glow: {
        en: "// BY CATEGORIES",
        es: "// POR CATEGORÍAS",
        pt: "// POR CATEGORIAS"
    },
    gr_desc: {
        en: "Breakdown of leading drivers segmented by discipline: Endurance Circuits, High-Speed Sprints, and Drags.",
        es: "Desglose de los pilotos líderes ordenados por disciplina: Circuitos de resistencia, Sprints de alta velocidad y Drags.",
        pt: "Divisão dos pilotos líderes ordenados por disciplina: Circuitos de resistência, Sprints de alta velocidade e Drags."
    },
    gr_tab_all: {
        en: "All Routes",
        es: "Todas las Rutas",
        pt: "Todas as Rotas"
    },
    gr_tab_circuits: {
        en: "Circuits Only",
        es: "Solo Circuitos",
        pt: "Apenas Circuitos"
    },
    gr_tab_sprints: {
        en: "Sprints Only",
        es: "Solo Sprints",
        pt: "Apenas Sprints"
    },
    gr_tab_drags: {
        en: "Drags Only",
        es: "Solo Drags",
        pt: "Apenas Drags"
    },

    // Guides & Tuning
    guides_sup: {
        en: "TUNING WORKSHOP // TELEMETRY SETUPS",
        es: "TALLER DE TUNING // SETUPS Y TELEMETRÍA",
        pt: "OFICINA DE TUNING // SETUPS E TELEMETRIA"
    },
    tuning_filter_rwd: {
        en: "🏎️ Rear-Wheel Drive (RWD)",
        es: "🏎️ Tracción Trasera (RWD)",
        pt: "🏎️ Tração Traseira (RWD)"
    },
    tuning_filter_awd: {
        en: "⚡ All-Wheel Drive (AWD)",
        es: "⚡ Tracción Total (AWD)",
        pt: "⚡ Tração Integral (AWD)"
    },
    tuning_filter_fwd: {
        en: "🚗 Front-Wheel Drive (FWD)",
        es: "🚗 Tracción Delantera (FWD)",
        pt: "🚗 Tração Dianteira (FWD)"
    },

    // Rules View
    rules_sup: {
        en: "SPORTING CODE // FAIR PLAY & INTEGRITY",
        es: "CÓDIGO DEPORTIVO // FAIR PLAY E INTEGRIDAD",
        pt: "CÓDIGO ESPORTIVO // FAIR PLAY E INTEGRIDADE"
    },

    // Download View
    dl_sup: {
        en: "OFFICIAL MEDIA // ORIGINAL PC GAME & PATCHES",
        es: "MEDIOS OFICIALES // JUEGO ORIGINAL PC Y PARCHES",
        pt: "MÍDIA OFICIAL // JOGO ORIGINAL PC E PATCHES"
    },
    dl_glow: {
        en: "// NEED FOR SPEED: MOST WANTED (2005)",
        es: "// NEED FOR SPEED: MOST WANTED (2005)",
        pt: "// NEED FOR SPEED: MOST WANTED (2005)"
    },

    // Map View
    map_sup: {
        en: "SATELLITE TELEMETRY // ROCKPORT CITY GPS",
        es: "TELEMETRÍA SATELITAL // ROCKPORT CITY GPS",
        pt: "TELEMETRIA VIA SATÉLITE // ROCKPORT CITY GPS"
    },
    map_title_main: {
        en: "ROCKPORT CITY LIVE MAP",
        es: "MAPA EN VIVO DE ROCKPORT CITY",
        pt: "MAPA AO VIVO DE ROCKPORT CITY"
    },
    map_desc_main: {
        en: "Interactive topographic GPS radar of Rockport City. Discover districts, speed traps, and race tracks.",
        es: "Radar GPS topográfico interactivo de Rockport City. Explora distritos, radares de velocidad y pistas.",
        pt: "Radar GPS topográfico interativo de Rockport City. Explore distritos, radares de velocidade e pistas."
    }
};

// Apply to dictionaries
for (const [key, val] of Object.entries(newTranslations)) {
    T.en[key] = val.en;
    T.es[key] = val.es;
    T.pt[key] = val.pt;
}

// Make sure any key in T.es that is missing in T.en or T.pt is filled in
for (const [key, esVal] of Object.entries(T.es)) {
    if (T.en[key] === undefined) {
        T.en[key] = esVal; // fallback
    }
    if (T.pt[key] === undefined) {
        // Simple accurate translation fallback or copy
        T.pt[key] = T.en[key] || esVal;
    }
}

// Also ensure every key in T.en is in T.es and T.pt
for (const [key, enVal] of Object.entries(T.en)) {
    if (T.es[key] === undefined) {
        T.es[key] = enVal;
    }
    if (T.pt[key] === undefined) {
        T.pt[key] = enVal;
    }
}

console.log('Updated keys - es:', Object.keys(T.es).length, 'en:', Object.keys(T.en).length, 'pt:', Object.keys(T.pt).length);

// Re-generate dictionary code
function serializeDict(dict, indent = '        ') {
    const lines = [];
    const keys = Object.keys(dict).sort();
    for (const k of keys) {
        const val = dict[k];
        const sanitizedVal = typeof val === 'string' ? JSON.stringify(val) : JSON.stringify(val);
        lines.push(`${indent}${k}: ${sanitizedVal},`);
    }
    // remove trailing comma from last line
    if (lines.length > 0) {
        lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1);
    }
    return lines.join('\n');
}

let newDictCode = 'const I18N_TRANSLATIONS = {\n';
newDictCode += '    es: {\n' + serializeDict(T.es) + '\n    },\n\n';
newDictCode += '    en: {\n' + serializeDict(T.en) + '\n    },\n\n';
newDictCode += '    pt: {\n' + serializeDict(T.pt) + '\n    },\n\n';

for (const lang of ['zh', 'ja', 'ru', 'it', 'fr', 'af']) {
    if (T[lang]) {
        // Also ensure missing keys fallback to en in other languages
        for (const [k, v] of Object.entries(T.en)) {
            if (T[lang][k] === undefined) {
                T[lang][k] = v;
            }
        }
        newDictCode += `    ${lang}: {\n` + serializeDict(T[lang]) + '\n    },\n\n';
    }
}
// remove trailing ',\n\n'
newDictCode = newDictCode.trimEnd();
if (newDictCode.endsWith(',')) {
    newDictCode = newDictCode.slice(0, -1);
}
newDictCode += '\n};\n\n';

const finalFileContent = preDict + newDictCode + postDict;
fs.writeFileSync('assets/js/i18n.js', finalFileContent, 'utf8');
console.log('Successfully wrote updated assets/js/i18n.js');
