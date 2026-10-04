/**
 * NFS: Most Wanted (2005) - World Records (NFSRANKSMW)
 * Base de Datos Oficial: Campeonato Blacklist 2026
 * 4 Semanas de Competición • 8 Desafíos por Semana (8 Rutas) • 5 Grupos de 3 Pilotos (15 Participantes)
 * Calendario Oficial: 03 de Octubre al 31 de Octubre de 2026
 * 
 * Sistema de Puntuación:
 * - 1er Mejor Tiempo: +100 PTS adicionales
 * - 2do Mejor Tiempo: +50 PTS adicionales
 * - 3er Mejor Tiempo: +20 PTS adicionales
 * - Podios: P1 = 25 PTS, P2 = 18 PTS, P3 = 15 PTS, P4 = 12 PTS
 * - Reputación ($ REP): Bonificaciones en efectivo por victoria y récord
 */

// 15 Plazas Oficiales del Campeonato Blacklist 2026 (Pilotos Inscritos en Tiempo Real)
const DEFAULT_BLACKLIST_DRIVERS = [
    {
        rank: 1,
        name: "ZimanX",
        alias: "ZimanX",
        ride: "Porsche Carrera GT",
        strength: "Porsche Carrera GT • Sabados",
        rep: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Sabados. Contacto: +584246950722. Compite en Rockport City bajo verificación de juego limpio.",
        signature: "ZIMANX",
        status: "👑 LÍDER BLACKLIST #1 (OFICIAL)",
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#ffd700",
        badge: "👑 #1 OFICIAL",
        youtube: "https://www.youtube.com/c/ZimanXPro/videos",
        isRealUser: true,
        schedule: "Sabados",
        contact: "+584246950722"
    },
    {
        rank: 2,
        name: "Mystic",
        alias: "MysticX",
        ride: "BMW M3 GTR",
        strength: "BMW M3 GTR • From Tuesday to Saturday",
        rep: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: From Tuesday to Saturday. Contacto: Jollymystic. Compite en Rockport City bajo verificación de juego limpio.",
        signature: "MYSTICX",
        status: "PILOTO OFICIAL #2",
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#c0c0c0",
        badge: "🥈 #2 OFICIAL",
        youtube: "",
        isRealUser: true,
        schedule: "From Tuesday to Saturday",
        contact: "Jollymystic"
    },
    {
        rank: 3,
        name: "Nebula",
        alias: "Nebula",
        ride: "Carrera GT y Lotus Elise",
        strength: "Carrera GT y Lotus Elise • Sabado desde 20pm en adelante (hora chile)",
        rep: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Sabado desde 20pm en adelante (hora chile). Contacto: +569 67248491. Compite en Rockport City bajo verificación de juego limpio.",
        signature: "NEBULA",
        status: "PILOTO OFICIAL #3",
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#cd7f32",
        badge: "🥉 #3 OFICIAL",
        youtube: "https://youtube.com/@nebula_1984?si=K0_P-Fy-5fZEizaa",
        isRealUser: true,
        schedule: "Sabado desde 20pm en adelante (hora chile)",
        contact: "+569 67248491"
    },
    {
        rank: 4,
        name: "xLeMondx",
        alias: "xLeMondx",
        ride: "Porsche Carrera GT",
        strength: "Porsche Carrera GT • lun - sab 8pm - 12 am hora Peru",
        rep: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: lun - sab 8pm - 12 am hora Peru. Compite en Rockport City bajo verificación de juego limpio.",
        signature: "XLEMONDX",
        status: "PILOTO OFICIAL #4",
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#38bdf8",
        badge: "#4 OFICIAL",
        youtube: "https://www.youtube.com/@xLeMondx",
        isRealUser: true,
        schedule: "lun - sab 8pm - 12 am hora Peru",
        contact: ""
    },
    {
        rank: 5,
        name: "Avenger",
        alias: "SRTxAvengerT",
        ride: "Porsche Carrera GT Y LOTUS ELISE",
        strength: "Porsche Carrera GT Y LOTUS ELISE • Lunes a domingo despues de las 5 pm",
        rep: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Lunes a domingo despues de las 5 pm. Compite en Rockport City bajo verificación de juego limpio.",
        signature: "SRTXAVENGERT",
        status: "PILOTO OFICIAL #5",
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#ff7700",
        badge: "#5 OFICIAL",
        youtube: "https://www.youtube.com/@avenger7361",
        isRealUser: true,
        schedule: "Lunes a domingo despues de las 5 pm",
        contact: ""
    },
    {
        rank: 6,
        name: "DarkShido",
        alias: "Shido",
        ride: "BMW M3 GTR",
        strength: "BMW M3 GTR • sabado desde las 7pm hora venezuela",
        rep: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: sabado desde las 7pm hora venezuela. Contacto: Discord. Compite en Rockport City bajo verificación de juego limpio.",
        signature: "SHIDO",
        status: "PILOTO OFICIAL #6",
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#a855f7",
        badge: "#6 OFICIAL",
        youtube: "https://www.youtube.com/@DarkShidoGT",
        isRealUser: true,
        schedule: "sabado desde las 7pm hora venezuela",
        contact: "Discord"
    },
    {
        rank: 7,
        name: "DannyLove",
        alias: "DannyLove",
        ride: "BMW M3 GTR",
        strength: "BMW M3 GTR • jueves - domingo | 7:30 pm",
        rep: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: jueves - domingo | 7:30 pm. Contacto: +57 302 317 9484. Compite en Rockport City bajo verificación de juego limpio.",
        signature: "DANNYLOVE",
        status: "PILOTO OFICIAL #7",
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#ec4899",
        badge: "#7 OFICIAL",
        youtube: "",
        isRealUser: true,
        schedule: "jueves - domingo | 7:30 pm",
        contact: "+57 302 317 9484"
    },
    {
        rank: 8,
        name: "Lea4Speed0",
        alias: "Lea",
        ride: "Carrera GT & M3 GTR",
        strength: "Carrera GT & M3 GTR • Domingo 8:00 PM",
        rep: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Domingo 8:00 PM. Contacto: NA. Compite en Rockport City bajo verificación de juego limpio.",
        signature: "LEA",
        status: "PILOTO OFICIAL #8",
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#10b981",
        badge: "#8 OFICIAL",
        youtube: "https://youtube.com/@lea4speed0?si=zXkGE7AQBQ7kvE5I",
        isRealUser: true,
        schedule: "Domingo 8:00 PM",
        contact: "NA"
    },
    {
        rank: 9,
        name: "ellafreyafan",
        alias: "NFSMW",
        ride: "BMW M3 GTR",
        strength: "BMW M3 GTR • Mon-Sun 8PM - 12AM CET",
        rep: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Mon-Sun 8PM - 12AM CET. Compite en Rockport City bajo verificación de juego limpio.",
        signature: "NFSMW",
        status: "PILOTO OFICIAL #9",
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#3b82f6",
        badge: "#9 OFICIAL",
        youtube: "https://www.youtube.com/channel/UCAU0np7Ruu16C7F9dnBVy8A",
        isRealUser: true,
        schedule: "Mon-Sun 8PM - 12AM CET",
        contact: ""
    },
    {
        rank: 10,
        name: "N6 xBourne",
        alias: "N6 xBourne",
        ride: "Porsche Carrera GT y Lotus Elise",
        strength: "Porsche Carrera GT y Lotus Elise • Horario Flexible",
        rep: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Horario Flexible. Contacto: jarheadvief. Compite en Rockport City bajo verificación de juego limpio.",
        signature: "N6 XBOURNE",
        status: "PILOTO OFICIAL #10",
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#f59e0b",
        badge: "#10 OFICIAL",
        youtube: "https://www.youtube.com/@N6_xBourne",
        isRealUser: true,
        schedule: "Horario Flexible",
        contact: "jarheadvief"
    },
    {
        rank: 11,
        name: "Plaza Disponible",
        alias: "Disponible #11",
        ride: "Por Inscribir",
        strength: "Cupo Abierto • Campeonato 2026",
        rep: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: "Plaza Oficial #11 disponible para la parrilla del Campeonato Blacklist 2026. Completa el formulario de inscripción para reclamar este lugar.",
        signature: "DISPONIBLE",
        status: "PLAZA DISPONIBLE #11",
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#64748b",
        badge: "PLAZA #11",
        youtube: "",
        isRealUser: false,
        schedule: "Por Definir",
        contact: ""
    },
    {
        rank: 12,
        name: "Plaza Disponible",
        alias: "Disponible #12",
        ride: "Por Inscribir",
        strength: "Cupo Abierto • Campeonato 2026",
        rep: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: "Plaza Oficial #12 disponible para la parrilla del Campeonato Blacklist 2026. Completa el formulario de inscripción para reclamar este lugar.",
        signature: "DISPONIBLE",
        status: "PLAZA DISPONIBLE #12",
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#64748b",
        badge: "PLAZA #12",
        youtube: "",
        isRealUser: false,
        schedule: "Por Definir",
        contact: ""
    },
    {
        rank: 13,
        name: "Plaza Disponible",
        alias: "Disponible #13",
        ride: "Por Inscribir",
        strength: "Cupo Abierto • Campeonato 2026",
        rep: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: "Plaza Oficial #13 disponible para la parrilla del Campeonato Blacklist 2026. Completa el formulario de inscripción para reclamar este lugar.",
        signature: "DISPONIBLE",
        status: "PLAZA DISPONIBLE #13",
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#64748b",
        badge: "PLAZA #13",
        youtube: "",
        isRealUser: false,
        schedule: "Por Definir",
        contact: ""
    },
    {
        rank: 14,
        name: "Plaza Disponible",
        alias: "Disponible #14",
        ride: "Por Inscribir",
        strength: "Cupo Abierto • Campeonato 2026",
        rep: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: "Plaza Oficial #14 disponible para la parrilla del Campeonato Blacklist 2026. Completa el formulario de inscripción para reclamar este lugar.",
        signature: "DISPONIBLE",
        status: "PLAZA DISPONIBLE #14",
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#64748b",
        badge: "PLAZA #14",
        youtube: "",
        isRealUser: false,
        schedule: "Por Definir",
        contact: ""
    },
    {
        rank: 15,
        name: "Plaza Disponible",
        alias: "Disponible #15",
        ride: "Por Inscribir",
        strength: "Cupo Abierto • Campeonato 2026",
        rep: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: "Plaza Oficial #15 disponible para la parrilla del Campeonato Blacklist 2026. Completa el formulario de inscripción para reclamar este lugar.",
        signature: "DISPONIBLE",
        status: "PLAZA DISPONIBLE #15",
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#64748b",
        badge: "PLAZA #15",
        youtube: "",
        isRealUser: false,
        schedule: "Por Definir",
        contact: ""
    }
];

// ==============================================================================
// CALENDARIO DEL CAMPEONATO (4 SEMANAS • 5 GRUPOS DE 3 • 8 DESAFÍOS/SEM)
// Calendario Oficial: 03 de Octubre al 31 de Octubre de 2026
// ==============================================================================

const CHAMPIONSHIP_WEEKS_DATA = {
    1: {
        weekNumber: 1,
        title: "Semana 1: Calificación & Tríos Iniciales (03 - 09 Oct)",
        dates: "03 Oct 2026 - 09 Oct 2026",
        groups: [
            { name: "Grupo Alpha (Líderes)", pilots: [1, 10, 3], tag: "🔥 TIER SUPREME" },
            { name: "Grupo Beta (Aspirantes)", pilots: [4, 5, 6], tag: "⚡ TIER HIGH" },
            { name: "Grupo Gamma (Fuerza & Potencia)", pilots: [7, 8, 9], tag: "⚔️ TIER MID-HIGH" }
        ],
        challenges: [
            {
                id: "w1-ch1",
                route: "City Perimeter",
                type: "Circuito",
                carRestriction: "BMW M3 GTR (Auto Bonus)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 400000, repBadge: "💰 $400.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 250000, repBadge: "💰 $250.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 120000, repBadge: "💰 $120.000 REP" }
                ]
            },
            {
                id: "w1-ch2",
                route: "Heritage & Campus",
                type: "Sprint",
                carRestriction: "Fiat Punto (Stock)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 450000, repBadge: "💰 $450.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 280000, repBadge: "💰 $280.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 140000, repBadge: "💰 $140.000 REP" }
                ]
            },
            {
                id: "w1-ch3",
                route: "Bayshore & Boardwalk",
                type: "Drag",
                carRestriction: "Mazda RX-8 (No Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 350000, repBadge: "💰 $350.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 200000, repBadge: "💰 $200.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 100000, repBadge: "💰 $100.000 REP" }
                ]
            },
            {
                id: "w1-ch4",
                route: "Campus Way",
                type: "Circuito",
                carRestriction: "Cobalt SS (Stock)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 400000, repBadge: "💰 $400.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 250000, repBadge: "💰 $250.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 120000, repBadge: "💰 $120.000 REP" }
                ]
            },
            {
                id: "w1-ch5",
                route: "Seaside & Power Station",
                type: "Sprint",
                carRestriction: "Subaru WRX (No Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 500000, repBadge: "💰 $500.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 300000, repBadge: "💰 $300.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 150000, repBadge: "💰 $150.000 REP" }
                ]
            },
            {
                id: "w1-ch6",
                route: "Ironwood States",
                type: "Circuito",
                carRestriction: "Ford Mustang GT (Stock)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 450000, repBadge: "💰 $450.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 270000, repBadge: "💰 $270.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 130000, repBadge: "💰 $130.000 REP" }
                ]
            },
            {
                id: "w1-ch7",
                route: "Heritage & Rosewood",
                type: "Drag",
                carRestriction: "Lotus Elise (No Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 380000, repBadge: "💰 $380.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 220000, repBadge: "💰 $220.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 110000, repBadge: "💰 $110.000 REP" }
                ]
            },
            {
                id: "w1-ch8",
                route: "Petersburgs",
                type: "Circuito",
                carRestriction: "Porsche Carrera GT (Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 480000, repBadge: "💰 $480.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 290000, repBadge: "💰 $290.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 140000, repBadge: "💰 $140.000 REP" }
                ]
            }
        ]
    },
    2: {
        weekNumber: 2,
        title: "Semana 2: Rotación de Tríos & Duelos de Velocidad (10 - 16 Oct)",
        dates: "10 Oct 2026 - 16 Oct 2026",
        groups: [
            { name: "Grupo Alfa (Velocidad Pura)", pilots: [1, 5, 8], tag: "🔥 TIER SUPREME" },
            { name: "Grupo Beta (Duelo Callejero)", pilots: [10, 6, 9], tag: "⚡ TIER HIGH" },
            { name: "Grupo Gama (Fuerza & Asfalto)", pilots: [3, 4, 7], tag: "⚔️ TIER MID-HIGH" }
        ],
        challenges: [
            {
                id: "w2-ch1",
                route: "NFS World Loop",
                type: "Sprint",
                carRestriction: "Porsche Carrera GT (Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 500000, repBadge: "💰 $500.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 300000, repBadge: "💰 $300.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 150000, repBadge: "💰 $150.000 REP" }
                ]
            },
            {
                id: "w2-ch2",
                route: "Highlands",
                type: "Circuito",
                carRestriction: "Mitsubishi Lancer Evolution (Stock)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 460000, repBadge: "💰 $460.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 280000, repBadge: "💰 $280.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 140000, repBadge: "💰 $140.000 REP" }
                ]
            },
            {
                id: "w2-ch3",
                route: "Harbor & Ocean",
                type: "Drag",
                carRestriction: "Dodge Viper SRT-10 (No Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 400000, repBadge: "💰 $400.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 240000, repBadge: "💰 $240.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 120000, repBadge: "💰 $120.000 REP" }
                ]
            },
            {
                id: "w2-ch4",
                route: "Diamond & Unión",
                type: "Sprint",
                carRestriction: "Mazda RX-8 (Stock)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 520000, repBadge: "💰 $520.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 310000, repBadge: "💰 $310.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 155000, repBadge: "💰 $155.000 REP" }
                ]
            },
            {
                id: "w2-ch5",
                route: "Heritage Height",
                type: "Circuito",
                carRestriction: "Lamborghini Gallardo (No Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 480000, repBadge: "💰 $480.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 290000, repBadge: "💰 $290.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 145000, repBadge: "💰 $145.000 REP" }
                ]
            },
            {
                id: "w2-ch6",
                route: "Hwy 99 & States",
                type: "Sprint",
                carRestriction: "Subaru WRX (Stock)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 510000, repBadge: "💰 $510.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 310000, repBadge: "💰 $310.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 150000, repBadge: "💰 $150.000 REP" }
                ]
            },
            {
                id: "w2-ch7",
                route: "Seaside & Camden",
                type: "Drag",
                carRestriction: "Mercedes-Benz SLR McLaren (No Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 420000, repBadge: "💰 $420.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 250000, repBadge: "💰 $250.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 125000, repBadge: "💰 $125.000 REP" }
                ]
            },
            {
                id: "w2-ch8",
                route: "Omega",
                type: "Circuito",
                carRestriction: "Ford Mustang GT (Stock)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 550000, repBadge: "💰 $550.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 330000, repBadge: "💰 $330.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 165000, repBadge: "💰 $165.000 REP" }
                ]
            }
        ]
    },
    3: {
        weekNumber: 3,
        title: "Semana 3: Cruce de Grupos & Ascenso (17 - 23 Oct)",
        dates: "17 Oct 2026 - 23 Oct 2026",
        groups: [
            { name: "Grupo Alfa (Cruce de Titanes)", pilots: [1, 6, 7], tag: "🔥 TIER SUPREME" },
            { name: "Grupo Beta (Duelo de Élite)", pilots: [10, 4, 8], tag: "⚡ TIER HIGH" },
            { name: "Grupo Gama (Guerra de Caballos)", pilots: [3, 5, 9], tag: "⚔️ TIER MID-HIGH" }
        ],
        challenges: [
            {
                id: "w3-ch1",
                route: "Dunwich Bay",
                type: "Circuito",
                carRestriction: "Aston Martin DB9 (No Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 550000, repBadge: "💰 $550.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 330000, repBadge: "💰 $330.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 165000, repBadge: "💰 $165.000 REP" }
                ]
            },
            {
                id: "w3-ch2",
                route: "Rosewood & State",
                type: "Sprint",
                carRestriction: "Cobalt SS (Stock)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 540000, repBadge: "💰 $540.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 320000, repBadge: "💰 $320.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 160000, repBadge: "💰 $160.000 REP" }
                ]
            },
            {
                id: "w3-ch3",
                route: "Union & Rockridge",
                type: "Drag",
                carRestriction: "Subaru WRX (No Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 440000, repBadge: "💰 $440.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 260000, repBadge: "💰 $260.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 130000, repBadge: "💰 $130.000 REP" }
                ]
            },
            {
                id: "w3-ch4",
                route: "Diamond",
                type: "Circuito",
                carRestriction: "Lotus Elise (Stock)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 520000, repBadge: "💰 $520.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 310000, repBadge: "💰 $310.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 155000, repBadge: "💰 $155.000 REP" }
                ]
            },
            {
                id: "w3-ch5",
                route: "Clubhouse & Hollis",
                type: "Sprint",
                carRestriction: "Fiat Punto (No Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 510000, repBadge: "💰 $510.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 300000, repBadge: "💰 $300.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 150000, repBadge: "💰 $150.000 REP" }
                ]
            },
            {
                id: "w3-ch6",
                route: "Circle Rose",
                type: "Circuito",
                carRestriction: "Mitsubishi Lancer Evolution (Stock)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 530000, repBadge: "💰 $530.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 320000, repBadge: "💰 $320.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 160000, repBadge: "💰 $160.000 REP" }
                ]
            },
            {
                id: "w3-ch7",
                route: "Ocean & Harbor",
                type: "Drag",
                carRestriction: "Porsche Cayman S (No Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 460000, repBadge: "💰 $460.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 280000, repBadge: "💰 $280.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 140000, repBadge: "💰 $140.000 REP" }
                ]
            },
            {
                id: "w3-ch8",
                route: "Switchback",
                type: "Circuito",
                carRestriction: "Porsche Carrera GT (Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 560000, repBadge: "💰 $560.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 340000, repBadge: "💰 $340.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 170000, repBadge: "💰 $170.000 REP" }
                ]
            }
        ]
    },
    4: {
        weekNumber: 4,
        title: "Semana 4: Gran Final del Campeonato (24 - 31 Oct)",
        dates: "24 Oct 2026 - 31 Oct 2026",
        groups: [
            { name: "Grupo Alfa (Gran Final • Corona)", pilots: [1, 4, 9], tag: "👑 CHAMPIONSHIP" },
            { name: "Grupo Beta (Duelo por el Podio)", pilots: [10, 5, 7], tag: "🥈 PODIUM RACE" },
            { name: "Grupo Gama (Batalla de Honor)", pilots: [3, 6, 8], tag: "⚔️ TOP HONORS" }
        ],
        challenges: [
            {
                id: "w4-ch1",
                route: "City Perimeter",
                type: "Circuito",
                carRestriction: "Porsche Carrera GT (Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 1000000, repBadge: "💰 $1.000.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 600000, repBadge: "💰 $600.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 300000, repBadge: "💰 $300.000 REP" }
                ]
            },
            {
                id: "w4-ch2",
                route: "Stadium & Hwy 99",
                type: "Sprint",
                carRestriction: "Chevrolet Corvette C6 (Stock)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 850000, repBadge: "💰 $850.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 500000, repBadge: "💰 $500.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 250000, repBadge: "💰 $250.000 REP" }
                ]
            },
            {
                id: "w4-ch3",
                route: "Riverside & Terrace",
                type: "Drag",
                carRestriction: "Mazda RX-8 (No Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 750000, repBadge: "💰 $750.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 450000, repBadge: "💰 $450.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 220000, repBadge: "💰 $220.000 REP" }
                ]
            },
            {
                id: "w4-ch4",
                route: "Century Square",
                type: "Circuito",
                carRestriction: "BMW M3 GTR (Auto Bonus)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 900000, repBadge: "💰 $900.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 550000, repBadge: "💰 $550.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 280000, repBadge: "💰 $280.000 REP" }
                ]
            },
            {
                id: "w4-ch5",
                route: "Campus Chancellor",
                type: "Sprint",
                carRestriction: "Ford Mustang GT (Stock)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 800000, repBadge: "💰 $800.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 480000, repBadge: "💰 $480.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 240000, repBadge: "💰 $240.000 REP" }
                ]
            },
            {
                id: "w4-ch6",
                route: "Bay Bridge",
                type: "Circuito",
                carRestriction: "Subaru WRX (No Junkman)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 850000, repBadge: "💰 $850.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 520000, repBadge: "💰 $520.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 260000, repBadge: "💰 $260.000 REP" }
                ]
            },
            {
                id: "w4-ch7",
                route: "Boardwalk & Bayshore",
                type: "Drag",
                carRestriction: "Fiat Punto (Stock)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 780000, repBadge: "💰 $780.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 460000, repBadge: "💰 $460.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 230000, repBadge: "💰 $230.000 REP" }
                ]
            },
            {
                id: "w4-ch8",
                route: "Camden Tunnel",
                type: "Circuito",
                carRestriction: "BMW M3 GTR (Auto Bonus)",
                top3: [
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 950000, repBadge: "💰 $950.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 580000, repBadge: "💰 $580.000 REP" },
                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 290000, repBadge: "💰 $290.000 REP" }
                ]
            }
        ]
    }
};

// Exportación Global para compatibilidad en Browser y Node
if (typeof window !== 'undefined') {
    window.DEFAULT_BLACKLIST_DRIVERS = DEFAULT_BLACKLIST_DRIVERS;
    window.CHAMPIONSHIP_WEEKS_DATA = CHAMPIONSHIP_WEEKS_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DEFAULT_BLACKLIST_DRIVERS,
        CHAMPIONSHIP_WEEKS_DATA
    };
}
