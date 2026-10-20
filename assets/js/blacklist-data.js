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
 * - Reputación ($ REP): Bonificaciones en efectivo por victoria y récord (10.000 REP = +1 PTS)
 */

// 15 Plazas Oficiales del Campeonato Blacklist 2026 (Pilotos Inscritos en Tiempo Real)
const DEFAULT_BLACKLIST_DRIVERS = [
    {
        "rank": 1,
        "name": "ZimanX",
        "alias": "ZimanX",
        "ride": "Porsche Carrera GT",
        "strength": "Porsche Carrera GT • Sabados",
        "rep": 4260000,
        "victories": {
            "p1": 3,
            "p2": 8,
            "p3": 5,
            "p4": 0
        },
        "bestTimes": {
            "first": 3,
            "second": 7,
            "third": 5
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Sabados. Contacto: +584246950722. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "ZIMANX",
        "status": "👑 LÍDER BLACKLIST #1 (OFICIAL)",
        "avatar": "assets/img/nfsranksmwlogo.png",
        "color": "#ffd700",
        "badge": "👑 #1 OFICIAL",
        "youtube": "https://www.youtube.com/c/ZimanXPro/videos",
        "isRealUser": true,
        "schedule": "Sabados",
        "contact": "+584246950722",
        "totalScore": 1470,
        "bonusPoints": 750,
        "points": 1470,
        "totalPts": 1470
    },
    {
        "rank": 2,
        "name": "Mystic",
        "alias": "MysticX",
        "ride": "BMW M3 GTR",
        "strength": "BMW M3 GTR • From Tuesday to Saturday",
        "rep": 0,
        "victories": {
            "p1": 0,
            "p2": 0,
            "p3": 0,
            "p4": 0
        },
        "bestTimes": {
            "first": 0,
            "second": 0,
            "third": 0
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: From Tuesday to Saturday. Contacto: Jollymystic. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "MYSTICX",
        "status": "PILOTO OFICIAL #2",
        "avatar": "assets/img/nfsranksmwlogo.png",
        "color": "#c0c0c0",
        "badge": "🥈 #2 OFICIAL",
        "youtube": "",
        "isRealUser": true,
        "schedule": "From Tuesday to Saturday",
        "contact": "Jollymystic",
        "totalScore": 0,
        "bonusPoints": 0,
        "points": 0,
        "totalPts": 0
    },
    {
        "rank": 3,
        "name": "Nebula",
        "alias": "Nebula",
        "ride": "Carrera GT y Lotus Elise",
        "strength": "Carrera GT y Lotus Elise • Sabado desde 20pm en adelante (hora chile)",
        "rep": 6330000,
        "victories": {
            "p1": 10,
            "p2": 6,
            "p3": 1,
            "p4": 0
        },
        "bestTimes": {
            "first": 10,
            "second": 6,
            "third": 1
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Sabado desde 20pm en adelante (hora chile). Contacto: +569 67248491. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "NEBULA",
        "status": "PILOTO OFICIAL #3",
        "avatar": "assets/img/nfsranksmwlogo.png",
        "color": "#cd7f32",
        "badge": "🥉 #3 OFICIAL",
        "youtube": "https://youtube.com/@nebula_1984?si=K0_P-Fy-5fZEizaa",
        "isRealUser": true,
        "schedule": "Sabado desde 20pm en adelante (hora chile)",
        "contact": "+569 67248491",
        "totalScore": 2326,
        "bonusPoints": 1320,
        "points": 2326,
        "totalPts": 2326
    },
    {
        "rank": 4,
        "name": "xLeMondx",
        "alias": "xLeMondx",
        "ride": "Porsche Carrera GT",
        "strength": "Porsche Carrera GT • lun - sab 8pm - 12 am hora Peru",
        "rep": 1250000,
        "victories": {
            "p1": 0,
            "p2": 4,
            "p3": 0,
            "p4": 0
        },
        "bestTimes": {
            "first": 0,
            "second": 4,
            "third": 0
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: lun - sab 8pm - 12 am hora Peru. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "XLEMONDX",
        "status": "PILOTO OFICIAL #4",
        "avatar": "assets/img/nfsranksmwlogo.png",
        "color": "#38bdf8",
        "badge": "#4 OFICIAL",
        "youtube": "https://www.youtube.com/@xLeMondx",
        "isRealUser": true,
        "schedule": "lun - sab 8pm - 12 am hora Peru",
        "contact": "",
        "totalScore": 397,
        "bonusPoints": 200,
        "points": 397,
        "totalPts": 397
    },
    {
        "rank": 5,
        "name": "Avenger",
        "alias": "SRTxAvenger™",
        "ride": "Porsche Carrera GT Y LOTUS ELISE",
        "strength": "Porsche Carrera GT Y LOTUS ELISE • Lunes a domingo despues de las 5 pm",
        "rep": 6480000,
        "victories": {
            "p1": 13,
            "p2": 3,
            "p3": 0,
            "p4": 0
        },
        "bestTimes": {
            "first": 13,
            "second": 3,
            "third": 0
        },
        "totalScore": 2477,
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Lunes a domingo despues de las 5 pm. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "SRTXAVENGERT",
        "status": "PILOTO OFICIAL #5",
        "avatar": "assets/img/nfsranksmwlogo.png",
        "color": "#ff7700",
        "badge": "#5 OFICIAL",
        "youtube": "https://www.youtube.com/@avenger7361",
        "isRealUser": true,
        "schedule": "Lunes a domingo despues de las 5 pm",
        "contact": "",
        "bonusPoints": 1450,
        "points": 2477,
        "totalPts": 2477
    },
    {
        "rank": 6,
        "name": "DarkShido",
        "alias": "Shido",
        "ride": "BMW M3 GTR",
        "strength": "BMW M3 GTR • sabado desde las 7pm hora venezuela",
        "rep": 2760000,
        "victories": {
            "p1": 4,
            "p2": 3,
            "p3": 0,
            "p4": 0
        },
        "bestTimes": {
            "first": 4,
            "second": 1,
            "third": 0
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: sabado desde las 7pm hora venezuela. Contacto: Discord. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "SHIDO",
        "status": "PILOTO OFICIAL #6",
        "avatar": "assets/img/nfsranksmwlogo.png",
        "color": "#a855f7",
        "badge": "#6 OFICIAL",
        "youtube": "https://www.youtube.com/@DarkShidoGT",
        "isRealUser": true,
        "schedule": "sabado desde las 7pm hora venezuela",
        "contact": "Discord",
        "totalScore": 880,
        "bonusPoints": 450,
        "points": 880,
        "totalPts": 880
    },
    {
        "rank": 7,
        "name": "DannyLove",
        "alias": "DannyLove",
        "ride": "BMW M3 GTR",
        "strength": "BMW M3 GTR • jueves - domingo | 7:30 pm",
        "rep": 3320000,
        "victories": {
            "p1": 5,
            "p2": 3,
            "p3": 0,
            "p4": 0
        },
        "bestTimes": {
            "first": 5,
            "second": 1,
            "third": 0
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: jueves - domingo | 7:30 pm. Contacto: +57 302 317 9484. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "DANNYLOVE",
        "status": "PILOTO OFICIAL #7",
        "avatar": "assets/img/nfsranksmwlogo.png",
        "color": "#ec4899",
        "badge": "#7 OFICIAL",
        "youtube": "",
        "isRealUser": true,
        "schedule": "jueves - domingo | 7:30 pm",
        "contact": "+57 302 317 9484",
        "totalScore": 1061,
        "bonusPoints": 550,
        "points": 1061,
        "totalPts": 1061
    },
    {
        "rank": 8,
        "name": "Lea4Speed0",
        "alias": "Lea",
        "ride": "Carrera GT & M3 GTR",
        "strength": "Carrera GT & M3 GTR • Domingo 8:00 PM",
        "rep": 1530000,
        "victories": {
            "p1": 3,
            "p2": 0,
            "p3": 0,
            "p4": 0
        },
        "bestTimes": {
            "first": 3,
            "second": 0,
            "third": 0
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Domingo 8:00 PM. Contacto: NA. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "LEA",
        "status": "PILOTO OFICIAL #8",
        "avatar": "assets/img/nfsranksmwlogo.png",
        "color": "#10b981",
        "badge": "#8 OFICIAL",
        "youtube": "https://youtube.com/@lea4speed0?si=zXkGE7AQBQ7kvE5I",
        "isRealUser": true,
        "schedule": "Domingo 8:00 PM",
        "contact": "NA",
        "totalScore": 528,
        "bonusPoints": 300,
        "points": 528,
        "totalPts": 528
    },
    {
        "rank": 9,
        "name": "ellafreyafan",
        "alias": "NFSMW",
        "ride": "BMW M3 GTR",
        "strength": "BMW M3 GTR • Mon-Sun 8PM - 12AM CET",
        "rep": 0,
        "victories": {
            "p1": 0,
            "p2": 0,
            "p3": 0,
            "p4": 0
        },
        "bestTimes": {
            "first": 0,
            "second": 0,
            "third": 0
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Mon-Sun 8PM - 12AM CET. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "NFSMW",
        "status": "PILOTO OFICIAL #9",
        "avatar": "assets/img/nfsranksmwlogo.png",
        "color": "#3b82f6",
        "badge": "#9 OFICIAL",
        "youtube": "https://www.youtube.com/channel/UCAU0np7Ruu16C7F9dnBVy8A",
        "isRealUser": true,
        "schedule": "Mon-Sun 8PM - 12AM CET",
        "contact": "",
        "totalScore": 0,
        "bonusPoints": 0,
        "points": 0,
        "totalPts": 0
    },
    {
        "rank": 10,
        "name": "N6 xBourne",
        "alias": "N6 xBourne",
        "ride": "Porsche Carrera GT y Lotus Elise",
        "strength": "Porsche Carrera GT y Lotus Elise • Horario Flexible",
        "rep": 4650000,
        "victories": {
            "p1": 5,
            "p2": 8,
            "p3": 2,
            "p4": 0
        },
        "bestTimes": {
            "first": 5,
            "second": 8,
            "third": 2
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Horario Flexible. Contacto: jarheadvief. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "N6 XBOURNE",
        "status": "PILOTO OFICIAL #10",
        "avatar": "assets/img/nfsranksmwlogo.png",
        "color": "#f59e0b",
        "badge": "#10 OFICIAL",
        "youtube": "https://www.youtube.com/@N6_xBourne",
        "isRealUser": true,
        "schedule": "Horario Flexible",
        "contact": "jarheadvief",
        "totalScore": 1704,
        "bonusPoints": 940,
        "points": 1704,
        "totalPts": 1704
    },
    {
        "rank": 11,
        "name": "RazorV8",
        "alias": "RazorV8",
        "ride": "Ford GT",
        "strength": "Ford GT • Piloto Oficial",
        "rep": 0,
        "victories": {
            "p1": 0,
            "p2": 0,
            "p3": 0,
            "p4": 0
        },
        "bestTimes": {
            "first": 0,
            "second": 0,
            "third": 0
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato Blacklist 2026. Disponibilidad: Horario Flexible. Contacto: Discord: Razor#1234. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "RAZORV8",
        "status": "PILOTO OFICIAL #11",
        "avatar": "assets/img/nfsranksmwlogo.png",
        "color": "#ff7700",
        "badge": "#11 OFICIAL",
        "youtube": "",
        "isRealUser": true,
        "schedule": "Horario Flexible",
        "contact": "Discord: Razor#1234",
        "totalScore": 0,
        "bonusPoints": 0,
        "points": 0,
        "totalPts": 0
    },
    {
        "rank": 12,
        "name": "TurboFox",
        "alias": "TurboFox",
        "ride": "Porsche 911 Turbo S",
        "strength": "Porsche 911 Turbo S • Piloto Oficial",
        "rep": 0,
        "victories": {
            "p1": 0,
            "p2": 0,
            "p3": 0,
            "p4": 0
        },
        "bestTimes": {
            "first": 0,
            "second": 0,
            "third": 0
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato Blacklist 2026. Disponibilidad: Horario Flexible. Contacto: Discord: @TurboFox. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "TURBOFOX",
        "status": "PILOTO OFICIAL #12",
        "avatar": "assets/img/nfsranksmwlogo.png",
        "color": "#ff7700",
        "badge": "#12 OFICIAL",
        "youtube": "",
        "isRealUser": true,
        "schedule": "Horario Flexible",
        "contact": "Discord: @TurboFox",
        "totalScore": 0,
        "bonusPoints": 0,
        "points": 0,
        "totalPts": 0
    },
    {
        "rank": 13,
        "name": "Sigy",
        "alias": "SRTxSigy",
        "ride": "Porsche Carrera GT",
        "strength": "Porsche Carrera GT • Piloto Oficial",
        "rep": 0,
        "victories": {
            "p1": 0,
            "p2": 0,
            "p3": 0,
            "p4": 0
        },
        "bestTimes": {
            "first": 0,
            "second": 0,
            "third": 0
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato Blacklist 2026. Disponibilidad: Horario Flexible. Contacto: Registrado por Comisaría (Admin). Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "SRTXSIGY",
        "status": "PILOTO OFICIAL #13",
        "avatar": "assets/img/nfsranksmwlogo.png",
        "color": "#ff7700",
        "badge": "#13 OFICIAL",
        "youtube": "",
        "isRealUser": true,
        "schedule": "Horario Flexible",
        "contact": "Registrado por Comisaría (Admin)",
        "totalScore": 0,
        "bonusPoints": 0,
        "points": 0,
        "totalPts": 0
    },
    {
        "rank": 14,
        "name": "Flow.",
        "alias": "Flow.",
        "ride": "Porsche Carrera GT",
        "strength": "Porsche Carrera GT • Piloto Oficial",
        "rep": 0,
        "victories": {
            "p1": 0,
            "p2": 0,
            "p3": 0,
            "p4": 0
        },
        "bestTimes": {
            "first": 0,
            "second": 0,
            "third": 0
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato Blacklist 2026. Disponibilidad: desde 10am hasta 10pm. Contacto: discord: flow.4148. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "FLOW.",
        "status": "PILOTO OFICIAL #14",
        "avatar": "assets/img/nfsranksmwlogo.png",
        "color": "#ff7700",
        "badge": "#14 OFICIAL",
        "youtube": "https://www.youtube.com/@Flow.4148",
        "isRealUser": true,
        "schedule": "desde 10am hasta 10pm",
        "contact": "discord: flow.4148",
        "totalScore": 0,
        "bonusPoints": 0,
        "points": 0,
        "totalPts": 0
    },
    {
        "rank": 15,
        "name": "SRTxAvengerT",
        "alias": "SRTxAvengerT",
        "ride": "Porsche Carrera GT",
        "strength": "Porsche Carrera GT • Piloto Oficial",
        "rep": 0,
        "victories": {
            "p1": 0,
            "p2": 0,
            "p3": 0,
            "p4": 0
        },
        "bestTimes": {
            "first": 0,
            "second": 0,
            "third": 0
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato Blacklist 2026. Disponibilidad: Desafíos Semanales. Contacto: Comisaría / Desafíos. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "SRTXAVENGERT",
        "status": "PILOTO OFICIAL #15",
        "avatar": "assets/img/nfsranksmwlogo.png",
        "color": "#ff7700",
        "badge": "#15 OFICIAL",
        "youtube": "",
        "isRealUser": true,
        "schedule": "Desafíos Semanales",
        "contact": "Comisaría / Desafíos",
        "totalScore": 0,
        "bonusPoints": 0,
        "points": 0,
        "totalPts": 0
    }
];

// ==============================================================================
// CALENDARIO DEL CAMPEONATO (4 SEMANAS • 5 GRUPOS DE 3 • 8 DESAFÍOS/SEM)
// Calendario Oficial: 03 de Octubre al 31 de Octubre de 2026
// ==============================================================================

const CHAMPIONSHIP_WEEKS_DATA = {
    "1": {
        "weekNumber": 1,
        "title": "Semana 1: Calificación & Tríos Iniciales (03 - 09 Oct)",
        "dates": "03 Oct 2026 - 09 Oct 2026",
        "groups": [
            {
                "name": "Grupo Alpha (Líderes)",
                "pilots": [
                    1,
                    10,
                    3
                ],
                "tag": "🔥 TIER SUPREME"
            },
            {
                "name": "Grupo Beta (Aspirantes)",
                "pilots": [
                    4,
                    5,
                    6
                ],
                "tag": "⚡ TIER HIGH"
            },
            {
                "name": "Grupo Gamma (Fuerza & Potencia)",
                "pilots": [
                    7,
                    8,
                    "open_11"
                ],
                "tag": "⚔️ TIER MID-HIGH"
            },
            {
                "name": "Grupo Delta (Competición)",
                "pilots": [
                    9,
                    2,
                    "open_12"
                ],
                "tag": "🏁 TIER COMPETICIÓN"
            }
        ],
        "challenges": [
            {
                "id": "w1-ch1",
                "route": "City Perimeter",
                "type": "Circuito",
                "carRestriction": "BMW M3 GTR (Auto Bonus)",
                "top3": [
                    {
                        "rank": 3,
                        "pilot": "Nebula",
                        "car": "Carrera GT y Lotus Elise",
                        "time": "01:34.450",
                        "bonus": 100,
                        "repMoney": 400000,
                        "badge": "🥇 +100 PTS",
                        "repBadge": "💰 $400.000 REP"
                    },
                    {
                        "rank": 10,
                        "pilot": "N6 xBourne",
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "time": "01:34.800",
                        "bonus": 50,
                        "repMoney": 250000,
                        "badge": "🥈 +50 PTS",
                        "repBadge": "💰 $250.000 REP"
                    },
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "01:35.400",
                        "bonus": 20,
                        "repMoney": 120000,
                        "badge": "🥉 +20 PTS",
                        "repBadge": "💰 $120.000 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:34.450",
                            "bonus": 100,
                            "repMoney": 400000
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "01:34.800",
                            "bonus": 50,
                            "repMoney": 250000
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:35.400",
                            "bonus": 20,
                            "repMoney": 120000
                        }
                    ],
                    "1": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:32.120",
                            "bonus": 100,
                            "repMoney": 400000
                        },
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "2": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speedo",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 11,
                            "pilot": "Plaza Disponible #11",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "3": [
                        {
                            "rank": 9,
                            "pilot": "EllaFreyaFan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 2,
                            "pilot": "Mystic",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 12,
                            "pilot": "Plaza Disponible #12",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ]
                }
            },
            {
                "id": "w1-ch2",
                "route": "Heritage & Campus",
                "type": "Sprint",
                "carRestriction": "Fiat Punto (Stock)",
                "top3": [
                    {
                        "rank": 3,
                        "pilot": "Nebula",
                        "car": "Carrera GT y Lotus Elise",
                        "time": "02:18.700",
                        "bonus": 100,
                        "repMoney": 450000,
                        "badge": "🥇 +100 PTS",
                        "repBadge": "💰 $450.000 REP"
                    },
                    {
                        "rank": 10,
                        "pilot": "N6 xBourne",
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "time": "02:20.700",
                        "bonus": 50,
                        "repMoney": 280000,
                        "badge": "🥈 +50 PTS",
                        "repBadge": "💰 $280.000 REP"
                    },
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "02:22.470",
                        "bonus": 20,
                        "repMoney": 140000,
                        "badge": "🥉 +20 PTS",
                        "repBadge": "💰 $140.000 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "02:18.700",
                            "bonus": 100,
                            "repMoney": 450000
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "02:20.700",
                            "bonus": 50,
                            "repMoney": 280000
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "02:22.470",
                            "bonus": 20,
                            "repMoney": 140000
                        }
                    ],
                    "1": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "02:14.300",
                            "bonus": 100,
                            "repMoney": 400000
                        },
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "2": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speedo",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 11,
                            "pilot": "Plaza Disponible #11",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "3": [
                        {
                            "rank": 9,
                            "pilot": "EllaFreyaFan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 2,
                            "pilot": "Mystic",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 12,
                            "pilot": "Plaza Disponible #12",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ]
                }
            },
            {
                "id": "w1-ch3",
                "route": "Bayshore & Boardwalk",
                "type": "Drag",
                "carRestriction": "Mazda RX-8 (Junkman)",
                "top3": [
                    {
                        "rank": 10,
                        "pilot": "N6 xBourne",
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "time": "00:17.000",
                        "bonus": 100,
                        "repMoney": 350000,
                        "badge": "🥇 +100 PTS",
                        "repBadge": "💰 $350.000 REP"
                    },
                    {
                        "rank": 3,
                        "pilot": "Nebula",
                        "car": "Carrera GT y Lotus Elise",
                        "time": "00:18.000",
                        "bonus": 50,
                        "repMoney": 200000,
                        "badge": "🥈 +50 PTS",
                        "repBadge": "💰 $200.000 REP"
                    },
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "00:19.400",
                        "bonus": 20,
                        "repMoney": 100000,
                        "badge": "🥉 +20 PTS",
                        "repBadge": "💰 $100.000 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "00:17.000",
                            "bonus": 100,
                            "repMoney": 350000
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "00:18.000",
                            "bonus": 50,
                            "repMoney": 200000
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "00:19.400",
                            "bonus": 20,
                            "repMoney": 100000
                        }
                    ],
                    "1": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "00:16.450",
                            "bonus": 100,
                            "repMoney": 400000
                        },
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "2": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speedo",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 11,
                            "pilot": "Plaza Disponible #11",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "3": [
                        {
                            "rank": 9,
                            "pilot": "EllaFreyaFan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 2,
                            "pilot": "Mystic",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 12,
                            "pilot": "Plaza Disponible #12",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ]
                }
            },
            {
                "id": "w1-ch4",
                "route": "Campus Way",
                "type": "Circuito",
                "carRestriction": "Cobalt SS (Stock)",
                "top3": [
                    {
                        "rank": 3,
                        "pilot": "Nebula",
                        "car": "Carrera GT y Lotus Elise",
                        "time": "01:43.670",
                        "bonus": 100,
                        "repMoney": 400000,
                        "badge": "🥇 +100 PTS",
                        "repBadge": "💰 $400.000 REP"
                    },
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "01:45.270",
                        "bonus": 50,
                        "repMoney": 250000,
                        "badge": "🥈 +50 PTS",
                        "repBadge": "💰 $250.000 REP"
                    },
                    {
                        "rank": 10,
                        "pilot": "N6 xBourne",
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "time": "01:47.380",
                        "bonus": 20,
                        "repMoney": 120000,
                        "badge": "🥉 +20 PTS",
                        "repBadge": "💰 $120.000 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:43.670",
                            "bonus": 100,
                            "repMoney": 400000
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:45.270",
                            "bonus": 50,
                            "repMoney": 250000
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "01:47.380",
                            "bonus": 20,
                            "repMoney": 120000
                        }
                    ],
                    "1": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:40.850",
                            "bonus": 100,
                            "repMoney": 400000
                        },
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "2": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speedo",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 11,
                            "pilot": "Plaza Disponible #11",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "3": [
                        {
                            "rank": 9,
                            "pilot": "EllaFreyaFan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 2,
                            "pilot": "Mystic",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 12,
                            "pilot": "Plaza Disponible #12",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ]
                }
            },
            {
                "id": "w1-ch5",
                "route": "Seaside & Power",
                "type": "Sprint",
                "carRestriction": "Subaru WRX (Junkman)",
                "top3": [
                    {
                        "rank": 3,
                        "pilot": "Nebula",
                        "car": "Carrera GT y Lotus Elise",
                        "time": "01:25.190",
                        "bonus": 100,
                        "repMoney": 500000,
                        "badge": "🥇 +100 PTS",
                        "repBadge": "💰 $500.000 REP"
                    },
                    {
                        "rank": 10,
                        "pilot": "N6 xBourne",
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "time": "01:26.360",
                        "bonus": 50,
                        "repMoney": 300000,
                        "badge": "🥈 +50 PTS",
                        "repBadge": "💰 $300.000 REP"
                    },
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "01:27.450",
                        "bonus": 20,
                        "repMoney": 150000,
                        "badge": "🥉 +20 PTS",
                        "repBadge": "💰 $150.000 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:25.190",
                            "bonus": 100,
                            "repMoney": 500000
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "01:26.360",
                            "bonus": 50,
                            "repMoney": 300000
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:27.450",
                            "bonus": 20,
                            "repMoney": 150000
                        }
                    ],
                    "1": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:23.200",
                            "bonus": 100,
                            "repMoney": 400000
                        },
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "2": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speedo",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 11,
                            "pilot": "Plaza Disponible #11",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "3": [
                        {
                            "rank": 9,
                            "pilot": "EllaFreyaFan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 2,
                            "pilot": "Mystic",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 12,
                            "pilot": "Plaza Disponible #12",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ]
                }
            },
            {
                "id": "w1-ch6",
                "route": "Ironwood States",
                "type": "Circuito",
                "carRestriction": "Ford Mustang GT (Stock)",
                "top3": [
                    {
                        "rank": 3,
                        "pilot": "Nebula",
                        "car": "Carrera GT y Lotus Elise",
                        "time": "00:59.830",
                        "bonus": 100,
                        "repMoney": 450000,
                        "badge": "🥇 +100 PTS",
                        "repBadge": "💰 $450.000 REP"
                    },
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "01:00.630",
                        "bonus": 50,
                        "repMoney": 270000,
                        "badge": "🥈 +50 PTS",
                        "repBadge": "💰 $270.000 REP"
                    },
                    {
                        "rank": 10,
                        "pilot": "N6 xBourne",
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "time": "01:02.200",
                        "bonus": 20,
                        "repMoney": 130000,
                        "badge": "🥉 +20 PTS",
                        "repBadge": "💰 $130.000 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "00:59.830",
                            "bonus": 100,
                            "repMoney": 450000
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:00.630",
                            "bonus": 50,
                            "repMoney": 270000
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "01:02.200",
                            "bonus": 20,
                            "repMoney": 130000
                        }
                    ],
                    "1": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "00:57.900",
                            "bonus": 100,
                            "repMoney": 400000
                        },
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "2": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speedo",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 11,
                            "pilot": "Plaza Disponible #11",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "3": [
                        {
                            "rank": 9,
                            "pilot": "EllaFreyaFan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 2,
                            "pilot": "Mystic",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 12,
                            "pilot": "Plaza Disponible #12",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ]
                }
            },
            {
                "id": "w1-ch7",
                "route": "Heritage & Rosewood",
                "type": "Drag",
                "carRestriction": "Lotus Elise (No Junkman)",
                "top3": [
                    {
                        "rank": 3,
                        "pilot": "Nebula",
                        "car": "Carrera GT y Lotus Elise",
                        "time": "00:22.150",
                        "bonus": 100,
                        "repMoney": 380000,
                        "badge": "🥇 +100 PTS",
                        "repBadge": "💰 $380.000 REP"
                    },
                    {
                        "rank": 10,
                        "pilot": "N6 xBourne",
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "time": "00:22.890",
                        "bonus": 50,
                        "repMoney": 220000,
                        "badge": "🥈 +50 PTS",
                        "repBadge": "💰 $220.000 REP"
                    },
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "00:23.400",
                        "bonus": 20,
                        "repMoney": 110000,
                        "badge": "🥉 +20 PTS",
                        "repBadge": "💰 $110.000 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "00:22.150",
                            "bonus": 100,
                            "repMoney": 380000
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "00:22.890",
                            "bonus": 50,
                            "repMoney": 220000
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "00:23.400",
                            "bonus": 20,
                            "repMoney": 110000
                        }
                    ],
                    "1": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "00:21.100",
                            "bonus": 100,
                            "repMoney": 400000
                        },
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "2": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speedo",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 11,
                            "pilot": "Plaza Disponible #11",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "3": [
                        {
                            "rank": 9,
                            "pilot": "EllaFreyaFan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 2,
                            "pilot": "Mystic",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 12,
                            "pilot": "Plaza Disponible #12",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ]
                }
            },
            {
                "id": "w1-ch8",
                "route": "Petersburgs",
                "type": "Circuito",
                "carRestriction": "Porsche Carrera GT (Junkman)",
                "top3": [
                    {
                        "rank": 10,
                        "pilot": "N6 xBourne",
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "time": "01:17.800",
                        "bonus": 100,
                        "repMoney": 490000,
                        "badge": "🥇 +100 PTS",
                        "repBadge": "💰 $490.000 REP"
                    },
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "01:20.100",
                        "bonus": 50,
                        "repMoney": 250000,
                        "badge": "🥈 +50 PTS",
                        "repBadge": "💰 $250.000 REP"
                    },
                    {
                        "rank": 3,
                        "pilot": "Nebula",
                        "car": "Carrera GT y Lotus Elise",
                        "time": "01:21.000",
                        "bonus": 20,
                        "repMoney": 170000,
                        "badge": "🥉 +20 PTS",
                        "repBadge": "💰 $170.000 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "01:17.800",
                            "bonus": 100,
                            "repMoney": 490000
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:20.100",
                            "bonus": 50,
                            "repMoney": 250000
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:21.000",
                            "bonus": 20,
                            "repMoney": 170000
                        }
                    ],
                    "1": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:16.800",
                            "bonus": 100,
                            "repMoney": 400000
                        },
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "2": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speedo",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 11,
                            "pilot": "Plaza Disponible #11",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ],
                    "3": [
                        {
                            "rank": 9,
                            "pilot": "EllaFreyaFan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 2,
                            "pilot": "Mystic",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        },
                        {
                            "rank": 12,
                            "pilot": "Plaza Disponible #12",
                            "car": "Por Inscribir",
                            "time": "--:--.---",
                            "bonus": 0,
                            "repMoney": 0
                        }
                    ]
                }
            }
        ]
    },
    "2": {
        "weekNumber": 2,
        "title": "Semana 2: Rotación de Tríos & Duelos de Velocidad (10 - 16 Oct)",
        "dates": "10 Oct 2026 - 16 Oct 2026",
        "groups": [
            {
                "name": "Grupo Alfa (Velocidad Pura)",
                "pilots": [
                    1,
                    5,
                    13
                ],
                "tag": "🔥 TIER SUPREME"
            },
            {
                "name": "Grupo Beta (Duelo Callejero)",
                "pilots": [
                    4,
                    8,
                    9
                ],
                "tag": "⚡ TIER HIGH"
            },
            {
                "name": "Grupo Gama (Fuerza & Asfalto)",
                "pilots": [
                    10,
                    6,
                    14
                ],
                "tag": "⚔️ TIER MID-HIGH"
            },
            {
                "name": "Grupo Delta (Competición & Desafío)",
                "pilots": [
                    7,
                    3,
                    11
                ],
                "tag": "🏁 TIER COMPETICIÓN"
            }
        ],
        "challenges": [
            {
                "id": "w2-ch1",
                "route": "NFS World Loop",
                "type": "Sprint",
                "carRestriction": "Porsche Carrera GT (Junkman)",
                "top3": [
                    {
                        "rank": 5,
                        "pilot": "SRTxAvenger™",
                        "car": "Carrera GT & Lotus Elise",
                        "time": "04:58.750",
                        "bonus": 100,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 500000,
                        "repBadge": "💰 $500.000 REP"
                    },
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "05:04.500",
                        "bonus": 50,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 300000,
                        "repBadge": "💰 $300.000 REP"
                    },
                    {
                        "rank": 13,
                        "pilot": "SRTxSigy",
                        "car": "Porsche Carrera GT",
                        "time": "00:00.000",
                        "bonus": 0,
                        "badge": "0 PTS",
                        "repMoney": 0,
                        "repBadge": "$0 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "04:58.750",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "05:04.500",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "04:56.960",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "05:00.600",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "05:02.300",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "05:22.380",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "05:02.650",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "05:09.830",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "04:58.750",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "05:04.500",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "04:56.960",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "05:00.600",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "05:02.300",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "05:22.380",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "05:02.650",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "05:09.830",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "04:58.750",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "05:04.500",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "04:56.960",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "05:00.600",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "05:02.300",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "05:22.380",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "05:02.650",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "05:09.830",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "04:58.750",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "05:04.500",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "04:56.960",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "05:00.600",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "05:02.300",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "05:22.380",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "05:02.650",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 500000,
                            "repBadge": "💰 $500.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "05:09.830",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 300000,
                            "repBadge": "💰 $300.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                }
            },
            {
                "id": "w2-ch2",
                "route": "Highlands",
                "type": "Circuito",
                "carRestriction": "Mitsubishi Lancer Evolution (Stock)",
                "top3": [
                    {
                        "rank": 5,
                        "pilot": "SRTxAvenger™",
                        "car": "Carrera GT & Lotus Elise",
                        "time": "00:57.750",
                        "bonus": 100,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 460000,
                        "repBadge": "💰 $460.000 REP"
                    },
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "00:58.880",
                        "bonus": 50,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 280000,
                        "repBadge": "💰 $280.000 REP"
                    },
                    {
                        "rank": 13,
                        "pilot": "SRTxSigy",
                        "car": "Porsche Carrera GT",
                        "time": "00:00.000",
                        "bonus": 0,
                        "badge": "0 PTS",
                        "repMoney": 0,
                        "repBadge": "$0 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "00:57.750",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 460000,
                            "repBadge": "💰 $460.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "00:58.880",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 280000,
                            "repBadge": "💰 $280.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "00:57.650",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 460000,
                            "repBadge": "💰 $460.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "00:57.750",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 280000,
                            "repBadge": "💰 $280.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "00:57.960",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 460000,
                            "repBadge": "💰 $460.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "00:59.000",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 280000,
                            "repBadge": "💰 $280.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "00:57.750",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 460000,
                            "repBadge": "💰 $460.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "00:58.880",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 280000,
                            "repBadge": "💰 $280.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "00:57.650",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 460000,
                            "repBadge": "💰 $460.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "00:57.750",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 280000,
                            "repBadge": "💰 $280.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "00:57.960",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 460000,
                            "repBadge": "💰 $460.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "00:59.000",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 280000,
                            "repBadge": "💰 $280.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "00:57.750",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 460000,
                            "repBadge": "💰 $460.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "00:58.880",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 280000,
                            "repBadge": "💰 $280.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "00:57.650",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 460000,
                            "repBadge": "💰 $460.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "00:57.750",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 280000,
                            "repBadge": "💰 $280.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "00:57.960",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 460000,
                            "repBadge": "💰 $460.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "00:59.000",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 280000,
                            "repBadge": "💰 $280.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "00:57.750",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 460000,
                            "repBadge": "💰 $460.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "00:58.880",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 280000,
                            "repBadge": "💰 $280.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "00:57.650",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 460000,
                            "repBadge": "💰 $460.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "00:57.750",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 280000,
                            "repBadge": "💰 $280.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "00:57.960",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 460000,
                            "repBadge": "💰 $460.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "00:59.000",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 280000,
                            "repBadge": "💰 $280.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                }
            },
            {
                "id": "w2-ch3",
                "route": "Harbor & Ocean",
                "type": "Drag",
                "carRestriction": "Dodge Viper SRT-10 (No Junkman)",
                "top3": [
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "00:20.380",
                        "bonus": 100,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 400000,
                        "repBadge": "💰 $400.000 REP"
                    },
                    {
                        "rank": 5,
                        "pilot": "SRTxAvenger™",
                        "car": "Carrera GT & Lotus Elise",
                        "time": "00:22.040",
                        "bonus": 50,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 240000,
                        "repBadge": "💰 $240.000 REP"
                    },
                    {
                        "rank": 13,
                        "pilot": "SRTxSigy",
                        "car": "Porsche Carrera GT",
                        "time": "00:00.000",
                        "bonus": 0,
                        "badge": "0 PTS",
                        "repMoney": 0,
                        "repBadge": "$0 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "00:20.380",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "00:22.040",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 240000,
                            "repBadge": "💰 $240.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "00:20.140",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 240000,
                            "repBadge": "💰 $240.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "00:24.920",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 240000,
                            "repBadge": "💰 $240.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "00:20.380",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "00:22.040",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 240000,
                            "repBadge": "💰 $240.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "00:20.140",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 240000,
                            "repBadge": "💰 $240.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "00:24.920",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 240000,
                            "repBadge": "💰 $240.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "00:20.380",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "00:22.040",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 240000,
                            "repBadge": "💰 $240.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "00:20.140",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 240000,
                            "repBadge": "💰 $240.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "00:24.920",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 240000,
                            "repBadge": "💰 $240.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "00:20.380",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "00:22.040",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 240000,
                            "repBadge": "💰 $240.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "00:20.140",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 240000,
                            "repBadge": "💰 $240.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "00:24.920",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 240000,
                            "repBadge": "💰 $240.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                }
            },
            {
                "id": "w2-ch4",
                "route": "Diamond & Unión",
                "type": "Sprint",
                "carRestriction": "Mazda RX-8 (Stock)",
                "top3": [
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "01:43.720",
                        "bonus": 100,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 520000,
                        "repBadge": "💰 $520.000 REP"
                    },
                    {
                        "rank": 5,
                        "pilot": "SRTxAvenger™",
                        "car": "Carrera GT & Lotus Elise",
                        "time": "01:44.170",
                        "bonus": 50,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 310000,
                        "repBadge": "💰 $310.000 REP"
                    },
                    {
                        "rank": 13,
                        "pilot": "SRTxSigy",
                        "car": "Porsche Carrera GT",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "0 PTS",
                        "repMoney": 0,
                        "repBadge": "$0 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:43.720",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:44.170",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "01:44.000",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "01:45.000",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "01:43.470",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "01:45.640",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "01:43.670",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:46.960",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:43.720",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:44.170",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "01:44.000",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "01:45.000",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "01:43.470",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "01:45.640",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "01:43.670",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:46.960",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:43.720",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:44.170",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "01:44.000",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "01:45.000",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "01:43.470",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "01:45.640",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "01:43.670",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:46.960",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:43.720",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:44.170",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "01:44.000",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "01:45.000",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "01:43.470",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "01:45.640",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "01:43.670",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 520000,
                            "repBadge": "💰 $520.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:46.960",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                }
            },
            {
                "id": "w2-ch5",
                "route": "Heritage Height",
                "type": "Circuito",
                "carRestriction": "Lamborghini Gallardo (No Junkman)",
                "top3": [
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "01:12.930",
                        "bonus": 100,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 480000,
                        "repBadge": "💰 $480.000 REP"
                    },
                    {
                        "rank": 5,
                        "pilot": "SRTxAvenger™",
                        "car": "Carrera GT & Lotus Elise",
                        "time": "01:14.850",
                        "bonus": 50,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 290000,
                        "repBadge": "💰 $290.000 REP"
                    },
                    {
                        "rank": 13,
                        "pilot": "SRTxSigy",
                        "car": "Porsche Carrera GT",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "0 PTS",
                        "repMoney": 0,
                        "repBadge": "$0 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:12.930",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 480000,
                            "repBadge": "💰 $480.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:14.850",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 290000,
                            "repBadge": "💰 $290.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "01:15.620",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 480000,
                            "repBadge": "💰 $480.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "01:16.350",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 290000,
                            "repBadge": "💰 $290.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:14.500",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 480000,
                            "repBadge": "💰 $480.000 REP"
                        },
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "01:18.230",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 290000,
                            "repBadge": "💰 $290.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:12.930",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 480000,
                            "repBadge": "💰 $480.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:14.850",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 290000,
                            "repBadge": "💰 $290.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "01:15.620",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 480000,
                            "repBadge": "💰 $480.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "01:16.350",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 290000,
                            "repBadge": "💰 $290.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:14.500",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 480000,
                            "repBadge": "💰 $480.000 REP"
                        },
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "01:18.230",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 290000,
                            "repBadge": "💰 $290.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:12.930",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 480000,
                            "repBadge": "💰 $480.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:14.850",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 290000,
                            "repBadge": "💰 $290.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "01:15.620",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 480000,
                            "repBadge": "💰 $480.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "01:16.350",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 290000,
                            "repBadge": "💰 $290.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:14.500",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 480000,
                            "repBadge": "💰 $480.000 REP"
                        },
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "01:18.230",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 290000,
                            "repBadge": "💰 $290.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:12.930",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 480000,
                            "repBadge": "💰 $480.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:14.850",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 290000,
                            "repBadge": "💰 $290.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "01:15.620",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 480000,
                            "repBadge": "💰 $480.000 REP"
                        },
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "01:16.350",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 290000,
                            "repBadge": "💰 $290.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:14.500",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 480000,
                            "repBadge": "💰 $480.000 REP"
                        },
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "01:18.230",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 290000,
                            "repBadge": "💰 $290.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                }
            },
            {
                "id": "w2-ch6",
                "route": "Hwy 99 & States",
                "type": "Sprint",
                "carRestriction": "Subaru WRX (Stock)",
                "top3": [
                    {
                        "rank": 5,
                        "pilot": "SRTxAvenger™",
                        "car": "Carrera GT & Lotus Elise",
                        "time": "02:03.870",
                        "bonus": 100,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 510000,
                        "repBadge": "💰 $510.000 REP"
                    },
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "02:06.520",
                        "bonus": 50,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 310000,
                        "repBadge": "💰 $310.000 REP"
                    },
                    {
                        "rank": 13,
                        "pilot": "SRTxSigy",
                        "car": "Porsche Carrera GT",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "0 PTS",
                        "repMoney": 0,
                        "repBadge": "$0 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "02:03.870",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "02:06.520",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "02:06.000",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "02:07.000",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "02:13.290",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "02:14.529",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": null,
                            "pilot": "Por disputar",
                            "car": "",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "02:06.390",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "02:11.740",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "02:03.870",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "02:06.520",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "02:06.000",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "02:07.000",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "02:13.290",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "02:14.529",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": null,
                            "pilot": "Por disputar",
                            "car": "",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "02:06.390",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "02:11.740",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "02:03.870",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "02:06.520",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "02:06.000",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "02:07.000",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "02:13.290",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "02:14.529",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": null,
                            "pilot": "Por disputar",
                            "car": "",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "02:06.390",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "02:11.740",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "02:03.870",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "02:06.520",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "02:06.000",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "02:07.000",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "02:13.290",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "02:14.529",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": null,
                            "pilot": "Por disputar",
                            "car": "",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "02:06.390",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 510000,
                            "repBadge": "💰 $510.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "02:11.740",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 310000,
                            "repBadge": "💰 $310.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                }
            },
            {
                "id": "w2-ch7",
                "route": "Seaside & Camden",
                "type": "Drag",
                "carRestriction": "Mercedes-Benz SLR McLaren (No Junkman)",
                "top3": [
                    {
                        "rank": 5,
                        "pilot": "SRTxAvenger™",
                        "car": "Carrera GT & Lotus Elise",
                        "time": "00:16.010",
                        "bonus": 100,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 420000,
                        "repBadge": "💰 $420.000 REP"
                    },
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "00:00.000",
                        "bonus": 0,
                        "badge": "0 PTS",
                        "repMoney": 250000,
                        "repBadge": "💰 $250.000 REP"
                    },
                    {
                        "rank": 13,
                        "pilot": "SRTxSigy",
                        "car": "Porsche Carrera GT",
                        "time": "00:00.000",
                        "bonus": 0,
                        "badge": "0 PTS",
                        "repMoney": 0,
                        "repBadge": "$0 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "00:16.010",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 420000,
                            "repBadge": "💰 $420.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "00:16.460",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 420000,
                            "repBadge": "💰 $420.000 REP"
                        },
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "00:17.540",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 420000,
                            "repBadge": "💰 $420.000 REP"
                        },
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "00:16.010",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 420000,
                            "repBadge": "💰 $420.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "00:16.460",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 420000,
                            "repBadge": "💰 $420.000 REP"
                        },
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "00:17.540",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 420000,
                            "repBadge": "💰 $420.000 REP"
                        },
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "00:16.010",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 420000,
                            "repBadge": "💰 $420.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "00:16.460",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 420000,
                            "repBadge": "💰 $420.000 REP"
                        },
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "00:17.540",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 420000,
                            "repBadge": "💰 $420.000 REP"
                        },
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "00:16.010",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 420000,
                            "repBadge": "💰 $420.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "00:16.460",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 420000,
                            "repBadge": "💰 $420.000 REP"
                        },
                        {
                            "rank": 6,
                            "pilot": "Shido",
                            "car": "BMW M3 GTR",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "00:17.540",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 420000,
                            "repBadge": "💰 $420.000 REP"
                        },
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                }
            },
            {
                "id": "w2-ch8",
                "route": "Omega",
                "type": "Circuito",
                "carRestriction": "Ford Mustang GT (Stock)",
                "top3": [
                    {
                        "rank": 5,
                        "pilot": "SRTxAvenger™",
                        "car": "Carrera GT & Lotus Elise",
                        "time": "01:32.270",
                        "bonus": 100,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 550000,
                        "repBadge": "💰 $550.000 REP"
                    },
                    {
                        "rank": 1,
                        "pilot": "ZimanX",
                        "car": "Porsche Carrera GT",
                        "time": "01:34.520",
                        "bonus": 50,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 330000,
                        "repBadge": "💰 $330.000 REP"
                    },
                    {
                        "rank": 13,
                        "pilot": "SRTxSigy",
                        "car": "Porsche Carrera GT",
                        "time": "00:00.000",
                        "bonus": 0,
                        "badge": "0 PTS",
                        "repMoney": 0,
                        "repBadge": "$0 REP"
                    }
                ],
                "groupsResults": {
                    "0": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:32.270",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 550000,
                            "repBadge": "💰 $550.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:34.520",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 330000,
                            "repBadge": "💰 $330.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:33.140",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 550000,
                            "repBadge": "💰 $550.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "01:37.770",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 330000,
                            "repBadge": "💰 $330.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "01:35.040",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 550000,
                            "repBadge": "💰 $550.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:36.040",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 330000,
                            "repBadge": "💰 $330.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:32.270",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 550000,
                            "repBadge": "💰 $550.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:34.520",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 330000,
                            "repBadge": "💰 $330.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:33.140",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 550000,
                            "repBadge": "💰 $550.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "01:37.770",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 330000,
                            "repBadge": "💰 $330.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "01:35.040",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 550000,
                            "repBadge": "💰 $550.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:36.040",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 330000,
                            "repBadge": "💰 $330.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:32.270",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 550000,
                            "repBadge": "💰 $550.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:34.520",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 330000,
                            "repBadge": "💰 $330.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:33.140",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 550000,
                            "repBadge": "💰 $550.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "01:37.770",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 330000,
                            "repBadge": "💰 $330.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "01:35.040",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 550000,
                            "repBadge": "💰 $550.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:36.040",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 330000,
                            "repBadge": "💰 $330.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "rank": 5,
                            "pilot": "SRTxAvenger™",
                            "car": "Carrera GT & Lotus Elise",
                            "time": "01:32.270",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 550000,
                            "repBadge": "💰 $550.000 REP"
                        },
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "01:34.520",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 330000,
                            "repBadge": "💰 $330.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "SRTxSigy",
                            "car": "Porsche Carrera GT",
                            "time": "00:00.000",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "rank": 8,
                            "pilot": "Lea",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "NFSMW",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:33.140",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 550000,
                            "repBadge": "💰 $550.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "01:37.770",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 330000,
                            "repBadge": "💰 $330.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "rank": 7,
                            "pilot": "DannyLove",
                            "car": "BMW M3 GTR",
                            "time": "01:35.040",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 550000,
                            "repBadge": "💰 $550.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "01:36.040",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 330000,
                            "repBadge": "💰 $330.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 0,
                            "badge": "0 PTS",
                            "repMoney": 0,
                            "repBadge": "$0 REP"
                        }
                    ]
                }
            }
        ]
    },
    "3": {
        "weekNumber": 3,
        "title": "Semana 3: Cruce de Grupos & Ascenso (17 - 23 Oct)",
        "dates": "17 Oct 2026 - 23 Oct 2026",
        "groups": [
            {
                "name": "Grupo Alfa (Cruce de Titanes)",
                "pilots": [
                    1,
                    6,
                    11,
                    "open_16"
                ],
                "tag": "🔥 TIER SUPREME"
            },
            {
                "name": "Grupo Beta (Duelo de Élite)",
                "pilots": [
                    10,
                    4,
                    12,
                    "open_17"
                ],
                "tag": "⚡ TIER HIGH"
            },
            {
                "name": "Grupo Gama (Guerra de Caballos)",
                "pilots": [
                    3,
                    5,
                    13,
                    "open_18"
                ],
                "tag": "⚔️ TIER MID-HIGH"
            }
        ],
        "challenges": [
            {
                "id": "w3-ch1",
                "route": "Dunwich Bay",
                "type": "Circuito",
                "carRestriction": "Aston Martin DB9 (No Junkman)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $550.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $330.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $165.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            },
            {
                "id": "w3-ch2",
                "route": "Rosewood & State",
                "type": "Sprint",
                "carRestriction": "Cobalt SS (Stock)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $540.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $320.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $160.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            },
            {
                "id": "w3-ch3",
                "route": "Union & Rockridge",
                "type": "Drag",
                "carRestriction": "Subaru WRX (No Junkman)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $440.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $260.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $130.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            },
            {
                "id": "w3-ch4",
                "route": "Diamond",
                "type": "Circuito",
                "carRestriction": "Lotus Elise (Stock)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $520.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $310.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $155.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            },
            {
                "id": "w3-ch5",
                "route": "Clubhouse & Hollis",
                "type": "Sprint",
                "carRestriction": "Fiat Punto (No Junkman)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $510.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $300.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $150.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            },
            {
                "id": "w3-ch6",
                "route": "Circle Rose",
                "type": "Circuito",
                "carRestriction": "Mitsubishi Lancer Evolution (Stock)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $530.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $320.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $160.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            },
            {
                "id": "w3-ch7",
                "route": "Ocean & Harbor",
                "type": "Drag",
                "carRestriction": "Porsche Cayman S (No Junkman)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $460.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $280.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $140.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            },
            {
                "id": "w3-ch8",
                "route": "Switchback",
                "type": "Circuito",
                "carRestriction": "Porsche Carrera GT (Junkman)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $560.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $340.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $170.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            }
        ]
    },
    "4": {
        "weekNumber": 4,
        "title": "Semana 4: Gran Final del Campeonato (24 - 31 Oct)",
        "dates": "24 Oct 2026 - 31 Oct 2026",
        "groups": [
            {
                "name": "Grupo Alfa (Gran Final • Corona)",
                "pilots": [
                    1,
                    4,
                    9,
                    14
                ],
                "tag": "👑 CHAMPIONSHIP"
            },
            {
                "name": "Grupo Beta (Duelo por el Podio)",
                "pilots": [
                    10,
                    5,
                    7,
                    12
                ],
                "tag": "🥈 PODIUM RACE"
            },
            {
                "name": "Grupo Gama (Batalla de Honor)",
                "pilots": [
                    3,
                    6,
                    8,
                    13
                ],
                "tag": "⚔️ TOP HONORS"
            },
            {
                "name": "Grupo Delta (Copa de Honor / Repechaje)",
                "pilots": [
                    2,
                    11,
                    15,
                    "open_16"
                ],
                "tag": "🏁 TIER COMPETICIÓN"
            },
            {
                "name": "Grupo Épsilon (Supervivencia & Gloria)",
                "pilots": [
                    "open_17",
                    "open_18",
                    "open_19",
                    "open_20"
                ],
                "tag": "🚀 TIER GLORIA"
            }
        ],
        "challenges": [
            {
                "id": "w4-ch1",
                "route": "City Perimeter",
                "type": "Circuito",
                "carRestriction": "Porsche Carrera GT (Junkman)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $1.000.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $600.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $300.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            },
            {
                "id": "w4-ch2",
                "route": "Stadium & Hwy 99",
                "type": "Sprint",
                "carRestriction": "Chevrolet Corvette C6 (Stock)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $850.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $500.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $250.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            },
            {
                "id": "w4-ch3",
                "route": "Riverside & Terrace",
                "type": "Drag",
                "carRestriction": "Mazda RX-8 (No Junkman)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $750.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $450.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $220.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            },
            {
                "id": "w4-ch4",
                "route": "Century Square",
                "type": "Circuito",
                "carRestriction": "BMW M3 GTR (Auto Bonus)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $900.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $550.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $280.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            },
            {
                "id": "w4-ch5",
                "route": "Campus Chancellor",
                "type": "Sprint",
                "carRestriction": "Ford Mustang GT (Stock)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $800.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $480.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $240.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            },
            {
                "id": "w4-ch6",
                "route": "Bay Bridge",
                "type": "Circuito",
                "carRestriction": "Subaru WRX (No Junkman)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $850.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $520.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $260.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            },
            {
                "id": "w4-ch7",
                "route": "Boardwalk & Bayshore",
                "type": "Drag",
                "carRestriction": "Fiat Punto (Stock)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $780.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $460.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $230.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            },
            {
                "id": "w4-ch8",
                "route": "Camden Tunnel",
                "type": "Circuito",
                "carRestriction": "BMW M3 GTR (Auto Bonus)",
                "top3": [
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥇 +100 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $950.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥈 +50 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $580.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🥉 +20 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $290.000 REP"
                    },
                    {
                        "rank": null,
                        "pilot": "Por disputar",
                        "car": "",
                        "time": "--:--.---",
                        "bonus": 0,
                        "badge": "🔩 +10 PTS",
                        "repMoney": 0,
                        "repBadge": "💰 $80.000 REP"
                    }
                ]
            }
        ]
    }
};

// Compatibilidad de Entornos (Navegador y Node.js)
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
