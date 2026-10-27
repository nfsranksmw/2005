/**
 * NFS: Most Wanted (2005) - World Records (NFSRANKSMW)
 * Base de Datos Oficial: Campeonato Blacklist 2026
 * 4 Semanas de Competición + Championship Week • 8 Desafíos por Semana • Grupos Alfa, Beta, Gama y Delta
 * Calendario Oficial: 03 de Octubre al 07 de Noviembre de 2026
 * 
 * Sistema de Puntuación:
 * - 1er Mejor Tiempo: +100 PTS adicionales
 * - 2do Mejor Tiempo: +50 PTS adicionales
 * - 3er Mejor Tiempo: +20 PTS adicionales
 * - Podios: P1 = 25 PTS, P2 = 18 PTS, P3 = 15 PTS, P4 = 12 PTS
 * - Reputación ($ REP): Bonificaciones en efectivo por victoria y récord (+500.000 por cada 1.000 PTS)
 */

const DEFAULT_BLACKLIST_DRIVERS = [
    {
        "rank": 1,
        "name": "ZimanX",
        "alias": "ZimanX",
        "ride": "Porsche Carrera GT",
        "strength": "Porsche Carrera GT • Sabados",
        "rep": 7360000,
        "victories": {
            "p1": 7,
            "p2": 12,
            "p3": 5,
            "p4": 0
        },
        "bestTimes": {
            "first": 7,
            "second": 10,
            "third": 5
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Sabados. Contacto: +584246950722. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "ZIMANX",
        "status": "👑 LÍDER BLACKLIST #1 (OFICIAL)",
        "avatar": "assets/img/drivers/driver-01-zimanx.svg",
        "color": "#ffd700",
        "badge": "👑 #1 OFICIAL",
        "youtube": "https://www.youtube.com/c/ZimanXPro/videos",
        "isRealUser": true,
        "schedule": "Sabados",
        "contact": "+584246950722",
        "bonusPoints": 1300,
        "bonusPts": 1300,
        "points": 1300,
        "totalPts": 1300,
        "totalPoints": 1300,
        "pointsBonusCash": 500000,
        "baseRep": 6860000,
        "totalRep": 7360000,
        "_numericRep": 7360000
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
        "avatar": "assets/img/drivers/driver-02-mystic.svg",
        "color": "#c0c0c0",
        "badge": "🥈 #2 OFICIAL",
        "youtube": "",
        "isRealUser": true,
        "schedule": "From Tuesday to Saturday",
        "contact": "Jollymystic",
        "bonusPoints": 0,
        "bonusPts": 0,
        "totalPoints": 0,
        "points": 0,
        "totalPts": 0,
        "pointsBonusCash": 0,
        "baseRep": 0,
        "totalRep": 0,
        "_numericRep": 0
    },
    {
        "rank": 3,
        "name": "Nebula",
        "alias": "Nebula",
        "ride": "Carrera GT y Lotus Elise",
        "strength": "Carrera GT y Lotus Elise • Sabado desde 20pm en adelante (hora chile)",
        "rep": 7780000,
        "victories": {
            "p1": 9,
            "p2": 7,
            "p3": 8,
            "p4": 0
        },
        "bestTimes": {
            "first": 9,
            "second": 7,
            "third": 6
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Sabado desde 20pm en adelante (hora chile). Contacto: +569 67248491. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "NEBULA",
        "status": "PILOTO OFICIAL #3",
        "avatar": "assets/img/drivers/driver-03-nebula.svg",
        "color": "#cd7f32",
        "badge": "🥉 #3 OFICIAL",
        "youtube": "https://youtube.com/@nebula_1984?si=K0_P-Fy-5fZEizaa",
        "isRealUser": true,
        "schedule": "Sabado desde 20pm en adelante (hora chile)",
        "contact": "+569 67248491",
        "bonusPoints": 1469,
        "bonusPts": 1469,
        "points": 1469,
        "totalPts": 1469,
        "totalPoints": 1469,
        "pointsBonusCash": 500000,
        "baseRep": 7280000,
        "totalRep": 7780000,
        "_numericRep": 7780000
    },
    {
        "rank": 4,
        "name": "xLeMondx",
        "alias": "xLeMondx",
        "ride": "Porsche Carrera GT",
        "strength": "Porsche Carrera GT • lun - sab 8pm - 12 am hora Peru",
        "rep": 4550000,
        "victories": {
            "p1": 6,
            "p2": 7,
            "p3": 0,
            "p4": 0
        },
        "bestTimes": {
            "first": 5,
            "second": 7,
            "third": 0
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: lun - sab 8pm - 12 am hora Peru. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "XLEMONDX",
        "status": "PILOTO OFICIAL #4",
        "avatar": "assets/img/drivers/driver-04-xlemondx.svg",
        "color": "#38bdf8",
        "badge": "#4 OFICIAL",
        "youtube": "https://www.youtube.com/@xLeMondx",
        "isRealUser": true,
        "schedule": "lun - sab 8pm - 12 am hora Peru",
        "contact": "",
        "bonusPoints": 950,
        "bonusPts": 950,
        "points": 950,
        "totalPts": 950,
        "totalPoints": 950,
        "pointsBonusCash": 0,
        "baseRep": 4550000,
        "totalRep": 4550000,
        "_numericRep": 4550000
    },
    {
        "rank": 5,
        "name": "Avenger",
        "alias": "SRTxAvenger™",
        "ride": "Porsche Carrera GT Y LOTUS ELISE",
        "strength": "Porsche Carrera GT Y LOTUS ELISE • Lunes a domingo despues de las 5 pm",
        "rep": 10030000,
        "victories": {
            "p1": 15,
            "p2": 9,
            "p3": 1,
            "p4": 0
        },
        "bestTimes": {
            "first": 15,
            "second": 8,
            "third": 1
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Lunes a domingo despues de las 5 pm. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "SRTXAVENGERT",
        "status": "PILOTO OFICIAL #5",
        "avatar": "assets/img/drivers/driver-05-avenger.svg",
        "color": "#ff7700",
        "badge": "#5 OFICIAL",
        "youtube": "https://www.youtube.com/@avenger7361",
        "isRealUser": true,
        "schedule": "Lunes a domingo despues de las 5 pm",
        "contact": "",
        "bonusPoints": 2030,
        "bonusPts": 2030,
        "points": 2030,
        "totalPts": 2030,
        "totalPoints": 2030,
        "pointsBonusCash": 1000000,
        "baseRep": 9030000,
        "totalRep": 10030000,
        "_numericRep": 10030000
    },
    {
        "rank": 6,
        "name": "DarkShido",
        "alias": "Shido",
        "ride": "BMW M3 GTR",
        "strength": "BMW M3 GTR • sabado desde las 7pm hora venezuela",
        "rep": 6610000,
        "victories": {
            "p1": 11,
            "p2": 5,
            "p3": 0,
            "p4": 0
        },
        "bestTimes": {
            "first": 10,
            "second": 3,
            "third": 0
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: sabado desde las 7pm hora venezuela. Contacto: Discord. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "SHIDO",
        "status": "PILOTO OFICIAL #6",
        "avatar": "assets/img/drivers/driver-06-darkshido.svg",
        "color": "#a855f7",
        "badge": "#6 OFICIAL",
        "youtube": "https://www.youtube.com/@DarkShidoGT",
        "isRealUser": true,
        "schedule": "sabado desde las 7pm hora venezuela",
        "contact": "Discord",
        "bonusPoints": 1270,
        "bonusPts": 1270,
        "points": 1270,
        "totalPts": 1270,
        "totalPoints": 1270,
        "pointsBonusCash": 500000,
        "baseRep": 6110000,
        "totalRep": 6610000,
        "_numericRep": 6610000
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
        "avatar": "assets/img/drivers/driver-07-dannylove.svg",
        "color": "#ec4899",
        "badge": "#7 OFICIAL",
        "youtube": "",
        "isRealUser": true,
        "schedule": "jueves - domingo | 7:30 pm",
        "contact": "+57 302 317 9484",
        "bonusPoints": 550,
        "bonusPts": 550,
        "points": 550,
        "totalPts": 550,
        "totalPoints": 550,
        "pointsBonusCash": 0,
        "baseRep": 3320000,
        "totalRep": 3320000,
        "_numericRep": 3320000
    },
    {
        "rank": 8,
        "name": "Lea4Speed0",
        "alias": "Lea",
        "ride": "Carrera GT & M3 GTR",
        "strength": "Carrera GT & M3 GTR • Domingo 8:00 PM",
        "rep": 7180000,
        "victories": {
            "p1": 15,
            "p2": 2,
            "p3": 0,
            "p4": 0
        },
        "bestTimes": {
            "first": 7,
            "second": 1,
            "third": 0
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Domingo 8:00 PM. Contacto: NA. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "LEA",
        "status": "PILOTO OFICIAL #8",
        "avatar": "assets/img/drivers/driver-08-lea4speed.svg",
        "color": "#10b981",
        "badge": "#8 OFICIAL",
        "youtube": "https://youtube.com/@lea4speed0?si=zXkGE7AQBQ7kvE5I",
        "isRealUser": true,
        "schedule": "Domingo 8:00 PM",
        "contact": "NA",
        "bonusPoints": 800,
        "bonusPts": 800,
        "points": 800,
        "totalPts": 800,
        "totalPoints": 800,
        "pointsBonusCash": 0,
        "baseRep": 7180000,
        "totalRep": 7180000,
        "_numericRep": 7180000
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
        "avatar": "assets/img/drivers/driver-09-ellafreyafan.svg",
        "color": "#3b82f6",
        "badge": "#9 OFICIAL",
        "youtube": "https://www.youtube.com/channel/UCAU0np7Ruu16C7F9dnBVy8A",
        "isRealUser": true,
        "schedule": "Mon-Sun 8PM - 12AM CET",
        "contact": "",
        "bonusPoints": 0,
        "bonusPts": 0,
        "totalPoints": 0,
        "points": 0,
        "totalPts": 0,
        "pointsBonusCash": 0,
        "baseRep": 0,
        "totalRep": 0,
        "_numericRep": 0
    },
    {
        "rank": 10,
        "name": "N6 xBourne",
        "alias": "N6 xBourne",
        "ride": "Porsche Carrera GT y Lotus Elise",
        "strength": "Porsche Carrera GT y Lotus Elise • Horario Flexible",
        "rep": 4980000,
        "victories": {
            "p1": 5,
            "p2": 9,
            "p3": 2,
            "p4": 0
        },
        "bestTimes": {
            "first": 5,
            "second": 9,
            "third": 2
        },
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Horario Flexible. Contacto: jarheadvief. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "N6 XBOURNE",
        "status": "PILOTO OFICIAL #10",
        "avatar": "assets/img/drivers/driver-10-n6xbourne.svg",
        "color": "#f59e0b",
        "badge": "#10 OFICIAL",
        "youtube": "https://www.youtube.com/@N6_xBourne",
        "isRealUser": true,
        "schedule": "Horario Flexible",
        "contact": "jarheadvief",
        "bonusPoints": 990,
        "bonusPts": 990,
        "points": 990,
        "totalPts": 990,
        "totalPoints": 990,
        "pointsBonusCash": 0,
        "baseRep": 4980000,
        "totalRep": 4980000,
        "_numericRep": 4980000
    },
    {
        "rank": 11,
        "name": "RazorV8",
        "alias": "RazorV8",
        "ride": "Ford GT",
        "strength": "Ford GT • Fines de Semana",
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
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Fines de semana. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "RAZORV8",
        "status": "PILOTO OFICIAL #11",
        "avatar": "assets/img/drivers/driver-11-razorv8.svg",
        "color": "#38bdf8",
        "badge": "🏁 #11 OFICIAL",
        "youtube": "",
        "isRealUser": true,
        "schedule": "Fines de Semana",
        "contact": "Comisaría / Desafíos",
        "bonusPoints": 0,
        "bonusPts": 0,
        "totalPoints": 0,
        "points": 0,
        "totalPts": 0,
        "pointsBonusCash": 0,
        "baseRep": 0,
        "totalRep": 0,
        "_numericRep": 0
    },
    {
        "rank": 12,
        "name": "TurboFox",
        "alias": "TurboFox",
        "ride": "Porsche 911 Turbo S",
        "strength": "Porsche 911 Turbo S • Turno Tarde",
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
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Disponibilidad: Turno Tarde. Compite en Rockport City bajo verificación de juego limpio.",
        "signature": "TURBOFOX",
        "status": "PILOTO OFICIAL #12",
        "avatar": "assets/img/drivers/driver-12-turbofox.svg",
        "color": "#ec4899",
        "badge": "🏁 #12 OFICIAL",
        "youtube": "",
        "isRealUser": true,
        "schedule": "Turno Tarde",
        "contact": "Comisaría / Desafíos",
        "bonusPoints": 0,
        "bonusPts": 0,
        "totalPoints": 0,
        "points": 0,
        "totalPts": 0,
        "pointsBonusCash": 0,
        "baseRep": 0,
        "totalRep": 0,
        "_numericRep": 0
    },
    {
        "rank": 13,
        "name": "Sigy",
        "alias": "SRTxSigy",
        "ride": "Porsche Carrera GT",
        "strength": "Porsche Carrera GT • Parrilla Extendida",
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
        "bio": "Piloto Oficial Inscrito en el Campeonato 2026. Registrado desde Administración.",
        "signature": "SRTXSIGY",
        "status": "PILOTO OFICIAL #13",
        "avatar": "assets/img/drivers/driver-13-sigy.svg",
        "color": "#f59e0b",
        "badge": "🏁 #13 OFICIAL",
        "youtube": "",
        "isRealUser": true,
        "schedule": "Horario Flexible",
        "contact": "Comisaría / Desafíos",
        "bonusPoints": 0,
        "bonusPts": 0,
        "totalPoints": 0,
        "points": 0,
        "totalPts": 0,
        "pointsBonusCash": 0,
        "baseRep": 0,
        "totalRep": 0,
        "_numericRep": 0
    },
    {
        "rank": 14,
        "name": "Flow.",
        "alias": "Flow.",
        "ride": "Porsche Carrera GT",
        "strength": "Porsche Carrera GT • Parrilla Extendida",
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
        "avatar": "assets/img/drivers/driver-14-flow.svg",
        "color": "#10b981",
        "badge": "🏁 #14 OFICIAL",
        "youtube": "https://www.youtube.com/@Flow.4148",
        "isRealUser": true,
        "schedule": "desde 10am hasta 10pm",
        "contact": "discord: flow.4148",
        "bonusPoints": 0,
        "bonusPts": 0,
        "points": 0,
        "totalPts": 0,
        "totalPoints": 0,
        "pointsBonusCash": 0,
        "baseRep": 0,
        "totalRep": 0,
        "_numericRep": 0
    },
    {
        "rank": 15,
        "name": "KAYINE",
        "alias": "KAYINE",
        "ride": "BMW M3 GTR",
        "strength": "Porsche Carrera GT • Parrilla Extendida",
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
        "signature": "AVENGER_ALT",
        "status": "PILOTO OFICIAL #15",
        "avatar": "assets/img/drivers/driver-15-skyhigh.svg",
        "color": "#8b5cf6",
        "badge": "🏁 #15 OFICIAL",
        "youtube": "",
        "isRealUser": true,
        "schedule": "Desafíos Semanales",
        "contact": "Comisaría / Desafíos",
        "bonusPoints": 0,
        "bonusPts": 0,
        "points": 0,
        "totalPts": 0,
        "fullName": "SkyHighM3GTR",
        "totalPoints": 0,
        "pointsBonusCash": 0,
        "baseRep": 0,
        "totalRep": 0,
        "_numericRep": 0
    }
];

const CHAMPIONSHIP_WEEKS_DATA = {
    "1": {
        "challenges": [
            {
                "carRestriction": "BMW M3 GTR (Auto Bonus)",
                "groupsResults": [
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:34.450"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:34.800"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "01:35.400"
                        }
                    ],
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:32.120"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ]
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:34.450"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:34.800"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "01:35.400"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:32.120"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:34.450"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:34.800"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "01:35.400"
                        }
                    ],
                    "Grupo Alpha (Líderes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:34.450"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:34.800"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "01:35.400"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:32.120"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Potencia)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w1-ch1",
                "route": "City Perimeter",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Carrera GT y Lotus Elise",
                        "pilot": "Nebula",
                        "repBadge": "💰 $400.000 REP",
                        "repMoney": 400000,
                        "time": "01:34.450"
                    },
                    {
                        "badge": "🥈 +50 PTS",
                        "bonus": 50,
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "pilot": "N6 xBourne",
                        "repBadge": "💰 $250.000 REP",
                        "repMoney": 250000,
                        "time": "01:34.800"
                    },
                    {
                        "badge": "🥉 +20 PTS",
                        "bonus": 20,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $120.000 REP",
                        "repMoney": 120000,
                        "time": "01:35.400"
                    }
                ],
                "type": "Circuito"
            },
            {
                "carRestriction": "Fiat Punto (Stock)",
                "groupsResults": [
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $450.000 REP",
                            "repMoney": 450000,
                            "time": "02:18.700"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "02:20.700"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $140.000 REP",
                            "repMoney": 140000,
                            "time": "02:22.470"
                        }
                    ],
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "02:14.300"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $450.000 REP",
                            "repMoney": 450000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ]
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $450.000 REP",
                            "repMoney": 450000,
                            "time": "02:18.700"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "02:20.700"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $140.000 REP",
                            "repMoney": 140000,
                            "time": "02:22.470"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "02:14.300"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $450.000 REP",
                            "repMoney": 450000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $450.000 REP",
                            "repMoney": 450000,
                            "time": "02:18.700"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "02:20.700"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $140.000 REP",
                            "repMoney": 140000,
                            "time": "02:22.470"
                        }
                    ],
                    "Grupo Alpha (Líderes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $450.000 REP",
                            "repMoney": 450000,
                            "time": "02:18.700"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "02:20.700"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $140.000 REP",
                            "repMoney": 140000,
                            "time": "02:22.470"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "02:14.300"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $450.000 REP",
                            "repMoney": 450000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $450.000 REP",
                            "repMoney": 450000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Potencia)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $450.000 REP",
                            "repMoney": 450000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $450.000 REP",
                            "repMoney": 450000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w1-ch2",
                "route": "Heritage & Campus",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Carrera GT y Lotus Elise",
                        "pilot": "Nebula",
                        "repBadge": "💰 $450.000 REP",
                        "repMoney": 450000,
                        "time": "02:18.700"
                    },
                    {
                        "badge": "🥈 +50 PTS",
                        "bonus": 50,
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "pilot": "N6 xBourne",
                        "repBadge": "💰 $280.000 REP",
                        "repMoney": 280000,
                        "time": "02:20.700"
                    },
                    {
                        "badge": "🥉 +20 PTS",
                        "bonus": 20,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $140.000 REP",
                        "repMoney": 140000,
                        "time": "02:22.470"
                    }
                ],
                "type": "Sprint"
            },
            {
                "carRestriction": "Mazda RX-8 (Junkman)",
                "groupsResults": [
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $350.000 REP",
                            "repMoney": 350000,
                            "time": "00:17.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "00:18.000"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $100.000 REP",
                            "repMoney": 100000,
                            "time": "00:19.400"
                        }
                    ],
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:16.450"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $350.000 REP",
                            "repMoney": 350000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ]
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $350.000 REP",
                            "repMoney": 350000,
                            "time": "00:17.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "00:18.000"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $100.000 REP",
                            "repMoney": 100000,
                            "time": "00:19.400"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:16.450"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $350.000 REP",
                            "repMoney": 350000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $350.000 REP",
                            "repMoney": 350000,
                            "time": "00:17.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "00:18.000"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $100.000 REP",
                            "repMoney": 100000,
                            "time": "00:19.400"
                        }
                    ],
                    "Grupo Alpha (Líderes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $350.000 REP",
                            "repMoney": 350000,
                            "time": "00:17.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "00:18.000"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $100.000 REP",
                            "repMoney": 100000,
                            "time": "00:19.400"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:16.450"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $350.000 REP",
                            "repMoney": 350000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $350.000 REP",
                            "repMoney": 350000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Potencia)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $350.000 REP",
                            "repMoney": 350000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $350.000 REP",
                            "repMoney": 350000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w1-ch3",
                "route": "Bayshore & Boardwalk",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "pilot": "N6 xBourne",
                        "repBadge": "💰 $350.000 REP",
                        "repMoney": 350000,
                        "time": "00:17.000"
                    },
                    {
                        "badge": "🥈 +50 PTS",
                        "bonus": 50,
                        "car": "Carrera GT y Lotus Elise",
                        "pilot": "Nebula",
                        "repBadge": "💰 $200.000 REP",
                        "repMoney": 200000,
                        "time": "00:18.000"
                    },
                    {
                        "badge": "🥉 +20 PTS",
                        "bonus": 20,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $100.000 REP",
                        "repMoney": 100000,
                        "time": "00:19.400"
                    }
                ],
                "type": "Drag"
            },
            {
                "carRestriction": "Cobalt SS (Stock)",
                "groupsResults": [
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:43.670"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:45.270"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "01:47.380"
                        }
                    ],
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:40.850"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ]
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:43.670"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:45.270"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "01:47.380"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:40.850"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:43.670"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:45.270"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "01:47.380"
                        }
                    ],
                    "Grupo Alpha (Líderes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:43.670"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:45.270"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "01:47.380"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:40.850"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Potencia)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w1-ch4",
                "route": "Campus Way",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Carrera GT y Lotus Elise",
                        "pilot": "Nebula",
                        "repBadge": "💰 $400.000 REP",
                        "repMoney": 400000,
                        "time": "01:43.670"
                    },
                    {
                        "badge": "🥈 +50 PTS",
                        "bonus": 50,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $250.000 REP",
                        "repMoney": 250000,
                        "time": "01:45.270"
                    },
                    {
                        "badge": "🥉 +20 PTS",
                        "bonus": 20,
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "pilot": "N6 xBourne",
                        "repBadge": "💰 $120.000 REP",
                        "repMoney": 120000,
                        "time": "01:47.380"
                    }
                ],
                "type": "Circuito"
            },
            {
                "carRestriction": "Subaru WRX (Junkman)",
                "groupsResults": [
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "01:25.190"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:26.360"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $150.000 REP",
                            "repMoney": 150000,
                            "time": "01:27.450"
                        }
                    ],
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:23.200"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ]
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "01:25.190"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:26.360"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $150.000 REP",
                            "repMoney": 150000,
                            "time": "01:27.450"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:23.200"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "01:25.190"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:26.360"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $150.000 REP",
                            "repMoney": 150000,
                            "time": "01:27.450"
                        }
                    ],
                    "Grupo Alpha (Líderes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "01:25.190"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:26.360"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $150.000 REP",
                            "repMoney": 150000,
                            "time": "01:27.450"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:23.200"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Potencia)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w1-ch5",
                "route": "Seaside & Power",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Carrera GT y Lotus Elise",
                        "pilot": "Nebula",
                        "repBadge": "💰 $500.000 REP",
                        "repMoney": 500000,
                        "time": "01:25.190"
                    },
                    {
                        "badge": "🥈 +50 PTS",
                        "bonus": 50,
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "pilot": "N6 xBourne",
                        "repBadge": "💰 $300.000 REP",
                        "repMoney": 300000,
                        "time": "01:26.360"
                    },
                    {
                        "badge": "🥉 +20 PTS",
                        "bonus": 20,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $150.000 REP",
                        "repMoney": 150000,
                        "time": "01:27.450"
                    }
                ],
                "type": "Sprint"
            },
            {
                "carRestriction": "Ford Mustang GT (Stock)",
                "groupsResults": [
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $450.000 REP",
                            "repMoney": 450000,
                            "time": "00:59.830"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $270.000 REP",
                            "repMoney": 270000,
                            "time": "01:00.630"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $130.000 REP",
                            "repMoney": 130000,
                            "time": "01:02.200"
                        }
                    ],
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:57.900"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $380.000 REP",
                            "repMoney": 380000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ]
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $450.000 REP",
                            "repMoney": 450000,
                            "time": "00:59.830"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $270.000 REP",
                            "repMoney": 270000,
                            "time": "01:00.630"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $130.000 REP",
                            "repMoney": 130000,
                            "time": "01:02.200"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:57.900"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $380.000 REP",
                            "repMoney": 380000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "���� $450.000 REP",
                            "repMoney": 450000,
                            "time": "00:59.830"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $270.000 REP",
                            "repMoney": 270000,
                            "time": "01:00.630"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $130.000 REP",
                            "repMoney": 130000,
                            "time": "01:02.200"
                        }
                    ],
                    "Grupo Alpha (Líderes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $450.000 REP",
                            "repMoney": 450000,
                            "time": "00:59.830"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $270.000 REP",
                            "repMoney": 270000,
                            "time": "01:00.630"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $130.000 REP",
                            "repMoney": 130000,
                            "time": "01:02.200"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:57.900"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $380.000 REP",
                            "repMoney": 380000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $380.000 REP",
                            "repMoney": 380000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Potencia)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $380.000 REP",
                            "repMoney": 380000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $380.000 REP",
                            "repMoney": 380000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w1-ch6",
                "route": "Ironwood States",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Carrera GT y Lotus Elise",
                        "pilot": "Nebula",
                        "repBadge": "💰 $450.000 REP",
                        "repMoney": 450000,
                        "time": "00:59.830"
                    },
                    {
                        "badge": "🥈 +50 PTS",
                        "bonus": 50,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $270.000 REP",
                        "repMoney": 270000,
                        "time": "01:00.630"
                    },
                    {
                        "badge": "🥉 +20 PTS",
                        "bonus": 20,
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "pilot": "N6 xBourne",
                        "repBadge": "💰 $130.000 REP",
                        "repMoney": 130000,
                        "time": "01:02.200"
                    }
                ],
                "type": "Circuito"
            },
            {
                "carRestriction": "Lotus Elise (No Junkman)",
                "groupsResults": [
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $380.000 REP",
                            "repMoney": 380000,
                            "time": "00:22.150"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $220.000 REP",
                            "repMoney": 220000,
                            "time": "00:22.890"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $110.000 REP",
                            "repMoney": 110000,
                            "time": "00:23.400"
                        }
                    ],
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:21.100"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ]
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $380.000 REP",
                            "repMoney": 380000,
                            "time": "00:22.150"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $220.000 REP",
                            "repMoney": 220000,
                            "time": "00:22.890"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $110.000 REP",
                            "repMoney": 110000,
                            "time": "00:23.400"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:21.100"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $380.000 REP",
                            "repMoney": 380000,
                            "time": "00:22.150"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $220.000 REP",
                            "repMoney": 220000,
                            "time": "00:22.890"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $110.000 REP",
                            "repMoney": 110000,
                            "time": "00:23.400"
                        }
                    ],
                    "Grupo Alpha (Líderes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $380.000 REP",
                            "repMoney": 380000,
                            "time": "00:22.150"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $220.000 REP",
                            "repMoney": 220000,
                            "time": "00:22.890"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $110.000 REP",
                            "repMoney": 110000,
                            "time": "00:23.400"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:21.100"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Potencia)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w1-ch7",
                "route": "Heritage & Rosewood",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Carrera GT y Lotus Elise",
                        "pilot": "Nebula",
                        "repBadge": "💰 $380.000 REP",
                        "repMoney": 380000,
                        "time": "00:22.150"
                    },
                    {
                        "badge": "🥈 +50 PTS",
                        "bonus": 50,
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "pilot": "N6 xBourne",
                        "repBadge": "💰 $220.000 REP",
                        "repMoney": 220000,
                        "time": "00:22.890"
                    },
                    {
                        "badge": "🥉 +20 PTS",
                        "bonus": 20,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $110.000 REP",
                        "repMoney": 110000,
                        "time": "00:23.400"
                    }
                ],
                "type": "Drag"
            },
            {
                "carRestriction": "Porsche Carrera GT (Junkman)",
                "groupsResults": [
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $490.000 REP",
                            "repMoney": 490000,
                            "time": "01:17.800"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:20.100"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $170.000 REP",
                            "repMoney": 170000,
                            "time": "01:21.000"
                        }
                    ],
                    [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:16.800"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $490.000 REP",
                            "repMoney": 490000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ]
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $490.000 REP",
                            "repMoney": 490000,
                            "time": "01:17.800"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:20.100"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $170.000 REP",
                            "repMoney": 170000,
                            "time": "01:21.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:16.800"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $490.000 REP",
                            "repMoney": 490000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $490.000 REP",
                            "repMoney": 490000,
                            "time": "01:17.800"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:20.100"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $170.000 REP",
                            "repMoney": 170000,
                            "time": "01:21.000"
                        }
                    ],
                    "Grupo Alpha (Líderes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $490.000 REP",
                            "repMoney": 490000,
                            "time": "01:17.800"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:20.100"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $170.000 REP",
                            "repMoney": 170000,
                            "time": "01:21.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:16.800"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DarkShido",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $490.000 REP",
                            "repMoney": 490000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $490.000 REP",
                            "repMoney": 490000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Potencia)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $490.000 REP",
                            "repMoney": 490000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gamma (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $490.000 REP",
                            "repMoney": 490000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w1-ch8",
                "route": "Petersburgs",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Porsche Carrera GT y Lotus Elise",
                        "pilot": "N6 xBourne",
                        "repBadge": "💰 $490.000 REP",
                        "repMoney": 490000,
                        "time": "01:17.800"
                    },
                    {
                        "badge": "🥈 +50 PTS",
                        "bonus": 50,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $250.000 REP",
                        "repMoney": 250000,
                        "time": "01:20.100"
                    },
                    {
                        "badge": "🥉 +20 PTS",
                        "bonus": 20,
                        "car": "Carrera GT y Lotus Elise",
                        "pilot": "Nebula",
                        "repBadge": "💰 $170.000 REP",
                        "repMoney": 170000,
                        "time": "01:21.000"
                    }
                ],
                "type": "Circuito"
            }
        ],
        "dates": "03 Oct 2026 - 09 Oct 2026",
        "groups": [
            {
                "name": "Grupo Alpha (Velocidad Pura)",
                "pilots": [
                    3,
                    10,
                    1
                ],
                "tag": "TIER OFICIAL"
            },
            {
                "name": "Grupo Beta (Duelo Callejero)",
                "pilots": [
                    5,
                    6,
                    4
                ],
                "tag": "TIER OFICIAL"
            },
            {
                "name": "Grupo Gamma (Fuerza & Asfalto)",
                "pilots": [
                    8,
                    7
                ],
                "tag": "TIER OFICIAL"
            }
        ],
        "title": "Semana 1: Calificación & Tríos Iniciales (03 - 09 Oct)",
        "weekNumber": 1
    },
    "2": {
        "challenges": [
            {
                "carRestriction": "Porsche Carrera GT (Junkman)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "04:58.750"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:04.500"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "04:56.960"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:00.600"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "05:02.300"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:22.380"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "05:02.650"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:09.830"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "04:58.750"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:04.500"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "04:56.960"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:00.600"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "05:02.650"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:09.830"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "05:02.300"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:22.380"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "05:02.300"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:22.380"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "04:58.750"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:04.500"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "04:56.960"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:00.600"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "05:02.300"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:22.380"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "05:02.650"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:09.830"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "04:58.750"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:04.500"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "04:56.960"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:00.600"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "05:02.650"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:09.830"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "05:02.300"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:22.380"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $500.000 REP",
                            "repMoney": 500000,
                            "time": "05:02.300"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "05:22.380"
                        }
                    ]
                },
                "id": "w2-ch1",
                "route": "NFS World Loop",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Carrera GT & Lotus Elise",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $500.000 REP",
                        "repMoney": 500000,
                        "time": "04:58.750"
                    },
                    {
                        "badge": "🥈 +50 PTS",
                        "bonus": 50,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $300.000 REP",
                        "repMoney": 300000,
                        "time": "05:04.500"
                    }
                ],
                "type": "Sprint"
            },
            {
                "carRestriction": "Mitsubishi Lancer Evolution (Stock)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "00:57.750"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "00:58.880"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "01:28.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "01:29.230"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "00:57.650"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "00:57.750"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "00:57.960"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "00:59.000"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "00:57.750"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "00:58.880"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "01:28.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "01:29.230"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "00:57.960"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "00:59.000"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "00:57.650"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "00:57.750"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "00:57.650"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "00:57.750"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "00:57.750"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "00:58.880"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "01:28.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "01:29.230"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "00:57.650"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "00:57.750"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "00:57.960"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "00:59.000"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "00:57.750"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "00:58.880"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "01:28.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "01:29.230"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "00:57.960"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "00:59.000"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "00:57.650"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "00:57.750"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $460.000 REP",
                            "repMoney": 460000,
                            "time": "00:57.650"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $280.000 REP",
                            "repMoney": 280000,
                            "time": "00:57.750"
                        }
                    ]
                },
                "id": "w2-ch2",
                "route": "Highlands",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Carrera GT & Lotus Elise",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $460.000 REP",
                        "repMoney": 460000,
                        "time": "00:57.750"
                    },
                    {
                        "badge": "🥈 +50 PTS",
                        "bonus": 50,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $280.000 REP",
                        "repMoney": 280000,
                        "time": "00:58.880"
                    }
                ],
                "type": "Circuito"
            },
            {
                "carRestriction": "Dodge Viper SRT-10 (Junkman)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:20.380"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $240.000 REP",
                            "repMoney": 240000,
                            "time": "00:22.040"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:19.910"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:20.140"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $240.000 REP",
                            "repMoney": 240000,
                            "time": "--:--.---"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:24.920"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $240.000 REP",
                            "repMoney": 240000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:20.380"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $240.000 REP",
                            "repMoney": 240000,
                            "time": "00:22.040"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:19.910"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:24.920"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $240.000 REP",
                            "repMoney": 240000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:20.140"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $240.000 REP",
                            "repMoney": 240000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:20.140"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $240.000 REP",
                            "repMoney": 240000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:20.380"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $240.000 REP",
                            "repMoney": 240000,
                            "time": "00:22.040"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:19.910"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:20.140"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $240.000 REP",
                            "repMoney": 240000,
                            "time": "--:--.---"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:24.920"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $240.000 REP",
                            "repMoney": 240000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:20.380"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $240.000 REP",
                            "repMoney": 240000,
                            "time": "00:22.040"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:19.910"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:24.920"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $240.000 REP",
                            "repMoney": 240000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:20.140"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $240.000 REP",
                            "repMoney": 240000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:20.140"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $240.000 REP",
                            "repMoney": 240000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "id": "w2-ch3",
                "route": "Harbor & Ocean",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $400.000 REP",
                        "repMoney": 400000,
                        "time": "00:20.380"
                    },
                    {
                        "badge": "🥈 +50 PTS",
                        "bonus": 50,
                        "car": "Carrera GT & Lotus Elise",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $240.000 REP",
                        "repMoney": 240000,
                        "time": "00:22.040"
                    }
                ],
                "type": "Drag"
            },
            {
                "carRestriction": "Mazda RX-8 (Stock)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:43.720"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:44.170"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:44.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:45.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:43.470"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:45.640"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:43.670"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:46.960"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:43.720"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:44.170"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:44.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:45.000"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:43.670"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:46.960"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:43.470"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:45.640"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:43.470"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:45.640"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:43.720"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:44.170"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:44.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:45.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:43.470"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:45.640"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:43.670"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:46.960"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:43.720"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:44.170"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:44.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:45.000"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:43.670"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:46.960"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:43.470"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:45.640"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $520.000 REP",
                            "repMoney": 520000,
                            "time": "01:43.470"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "01:45.640"
                        }
                    ]
                },
                "id": "w2-ch4",
                "route": "Diamond & Unión",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $520.000 REP",
                        "repMoney": 520000,
                        "time": "01:43.720"
                    },
                    {
                        "badge": "🥈 +50 PTS",
                        "bonus": 50,
                        "car": "Carrera GT & Lotus Elise",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $310.000 REP",
                        "repMoney": 310000,
                        "time": "01:44.170"
                    }
                ],
                "type": "Sprint"
            },
            {
                "carRestriction": "Lamborghini Gallardo (No Junkman)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:12.930"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $290.000 REP",
                            "repMoney": 290000,
                            "time": "01:14.850"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:16.050"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:15.620"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $290.000 REP",
                            "repMoney": 290000,
                            "time": "01:16.350"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:14.500"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $290.000 REP",
                            "repMoney": 290000,
                            "time": "01:18.230"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:12.930"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $290.000 REP",
                            "repMoney": 290000,
                            "time": "01:14.850"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:16.050"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:14.500"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $290.000 REP",
                            "repMoney": 290000,
                            "time": "01:18.230"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:15.620"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $290.000 REP",
                            "repMoney": 290000,
                            "time": "01:16.350"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:15.620"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $290.000 REP",
                            "repMoney": 290000,
                            "time": "01:16.350"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:12.930"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $290.000 REP",
                            "repMoney": 290000,
                            "time": "01:14.850"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:16.050"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:15.620"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $290.000 REP",
                            "repMoney": 290000,
                            "time": "01:16.350"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:14.500"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $290.000 REP",
                            "repMoney": 290000,
                            "time": "01:18.230"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:12.930"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $290.000 REP",
                            "repMoney": 290000,
                            "time": "01:14.850"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "Lea",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:16.050"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:14.500"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $290.000 REP",
                            "repMoney": 290000,
                            "time": "01:18.230"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:15.620"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $290.000 REP",
                            "repMoney": 290000,
                            "time": "01:16.350"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $480.000 REP",
                            "repMoney": 480000,
                            "time": "01:15.620"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $290.000 REP",
                            "repMoney": 290000,
                            "time": "01:16.350"
                        }
                    ]
                },
                "id": "w2-ch5",
                "route": "Heritage Height",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $480.000 REP",
                        "repMoney": 480000,
                        "time": "01:12.930"
                    },
                    {
                        "badge": "🥈 +50 PTS",
                        "bonus": 50,
                        "car": "Carrera GT & Lotus Elise",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $290.000 REP",
                        "repMoney": 290000,
                        "time": "01:14.850"
                    }
                ],
                "type": "Circuito"
            },
            {
                "carRestriction": "Subaru WRX (Stock)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:03.870"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:06.520"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:06.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:07.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:13.290"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:14.529"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:06.390"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:11.740"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:03.870"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:06.520"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:06.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:07.000"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:06.390"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:11.740"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:13.290"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:14.529"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:13.290"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:14.529"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:03.870"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:06.520"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:06.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:07.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:13.290"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:14.529"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:06.390"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:11.740"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:03.870"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:06.520"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:06.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:07.000"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:06.390"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:11.740"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:13.290"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:14.529"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $510.000 REP",
                            "repMoney": 510000,
                            "time": "02:13.290"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $310.000 REP",
                            "repMoney": 310000,
                            "time": "02:14.529"
                        }
                    ]
                },
                "id": "w2-ch6",
                "route": "Hwy 99 & States",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Carrera GT & Lotus Elise",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $510.000 REP",
                        "repMoney": 510000,
                        "time": "02:03.870"
                    },
                    {
                        "badge": "🥈 +50 PTS",
                        "bonus": 50,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $310.000 REP",
                        "repMoney": 310000,
                        "time": "02:06.520"
                    }
                ],
                "type": "Sprint"
            },
            {
                "carRestriction": "Mercedes-Benz SLR McLaren (Junkman)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:16.010"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:18.650"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:16.460"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:17.540"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:16.010"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:18.650"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:17.540"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:16.460"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:16.460"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:16.010"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:18.650"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:16.460"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:17.540"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:16.010"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:18.650"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:17.540"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:16.460"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $420.000 REP",
                            "repMoney": 420000,
                            "time": "00:16.460"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "BMW M3 GTR",
                            "pilot": "Shido",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "id": "w2-ch7",
                "route": "Seaside & Camden",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Carrera GT & Lotus Elise",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $420.000 REP",
                        "repMoney": 420000,
                        "time": "00:16.010"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $250.000 REP",
                        "repMoney": 250000,
                        "time": "--:--.---"
                    }
                ],
                "type": "Drag"
            },
            {
                "carRestriction": "Ford Mustang GT (Stock)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "01:32.270"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $330.000 REP",
                            "repMoney": 330000,
                            "time": "01:34.520"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $320.000 REP",
                            "repMoney": 320000,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Shido",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "01:33.140"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $330.000 REP",
                            "repMoney": 330000,
                            "time": "01:37.770"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "01:35.040"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $330.000 REP",
                            "repMoney": 330000,
                            "time": "01:36.040"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "01:32.270"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $330.000 REP",
                            "repMoney": 330000,
                            "time": "01:34.520"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $320.000 REP",
                            "repMoney": 320000,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "01:35.040"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $330.000 REP",
                            "repMoney": 330000,
                            "time": "01:36.040"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Shido",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "01:33.140"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $330.000 REP",
                            "repMoney": 330000,
                            "time": "01:37.770"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Shido",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "01:33.140"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $330.000 REP",
                            "repMoney": 330000,
                            "time": "01:37.770"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "01:32.270"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $330.000 REP",
                            "repMoney": 330000,
                            "time": "01:34.520"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $320.000 REP",
                            "repMoney": 320000,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Shido",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "01:33.140"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $330.000 REP",
                            "repMoney": 330000,
                            "time": "01:37.770"
                        }
                    ],
                    "3": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "01:35.040"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $330.000 REP",
                            "repMoney": 330000,
                            "time": "01:36.040"
                        }
                    ],
                    "Grupo Alfa (Velocidad Pura)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & Lotus Elise",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "01:32.270"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $330.000 REP",
                            "repMoney": 330000,
                            "time": "01:34.520"
                        }
                    ],
                    "Grupo Beta (Duelo Callejero)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT & M3 GTR",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "Lea",
                            "repBadge": "💰 $320.000 REP",
                            "repMoney": 320000,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Delta (Competición & Desafío)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "BMW M3 GTR",
                            "pilot": "DannyLove",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "01:35.040"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Nebula",
                            "repBadge": "💰 $330.000 REP",
                            "repMoney": 330000,
                            "time": "01:36.040"
                        }
                    ],
                    "Grupo Gama (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Shido",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "01:33.140"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $330.000 REP",
                            "repMoney": 330000,
                            "time": "01:37.770"
                        }
                    ],
                    "Grupo Gamma (Fuerza & Asfalto)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "Carrera GT y Lotus Elise",
                            "pilot": "Shido",
                            "repBadge": "💰 $550.000 REP",
                            "repMoney": 550000,
                            "time": "01:33.140"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "Porsche Carrera GT",
                            "pilot": "N6 xBourne",
                            "repBadge": "💰 $330.000 REP",
                            "repMoney": 330000,
                            "time": "01:37.770"
                        }
                    ]
                },
                "id": "w2-ch8",
                "route": "Omega",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "Carrera GT & Lotus Elise",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $550.000 REP",
                        "repMoney": 550000,
                        "time": "01:32.270"
                    },
                    {
                        "badge": "🥈 +50 PTS",
                        "bonus": 50,
                        "car": "Porsche Carrera GT",
                        "pilot": "ZimanX",
                        "repBadge": "💰 $330.000 REP",
                        "repMoney": 330000,
                        "time": "01:34.520"
                    }
                ],
                "type": "Circuito"
            }
        ],
        "dates": "10 Oct 2026 - 16 Oct 2026",
        "groups": [
            {
                "name": "Grupo Alpha (Velocidad Pura)",
                "pilots": [
                    1,
                    5
                ],
                "tag": "TIER OFICIAL"
            },
            {
                "name": "Grupo Beta (Duelo Callejero)",
                "pilots": [
                    8,
                    4
                ],
                "tag": "TIER OFICIAL"
            },
            {
                "name": "Grupo Gamma (Fuerza & Asfalto)",
                "pilots": [
                    10,
                    6
                ],
                "tag": "TIER OFICIAL"
            },
            {
                "name": "Grupo Delta",
                "pilots": [
                    3,
                    7
                ],
                "tag": "🏁 TIER COMPETICIÓN"
            }
        ],
        "title": "Semana 2: Rotación de Tríos & Duelos de Velocidad (10 - 16 Oct)",
        "weekNumber": 2
    },
    "3": {
        "challenges": [
            {
                "carRestriction": "Aston Martin DB9 (Junkman)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:17.450"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:17.680"
                        },
                        {
                            "badge": "🥉 +39 PTS",
                            "bonus": 39,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "12:05.70"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:18.800"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:19.120"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:17.450"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:17.680"
                        },
                        {
                            "badge": "🥉 +39 PTS",
                            "bonus": 39,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "12:05.70"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:18.800"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:19.120"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:17.450"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:17.680"
                        },
                        {
                            "badge": "🥉 +39 PTS",
                            "bonus": 39,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "12:05.70"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:18.800"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:19.120"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:17.450"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:17.680"
                        },
                        {
                            "badge": "🥉 +39 PTS",
                            "bonus": 39,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "12:05.70"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:18.800"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:19.120"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w3-ch1",
                "route": "Dunwich Bay",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "",
                        "pilot": "Shido",
                        "repBadge": "💰 $400.000 REP",
                        "repMoney": 400000,
                        "time": "01:17.450"
                    },
                    {
                        "badge": "🥈 +60 PTS",
                        "bonus": 60,
                        "car": "",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $300.000 REP",
                        "repMoney": 300000,
                        "time": "01:17.680"
                    },
                    {
                        "badge": "🥉 +39 PTS",
                        "bonus": 39,
                        "car": "",
                        "pilot": "Nebula",
                        "repBadge": "💰 $200.000 REP",
                        "repMoney": 200000,
                        "time": "12:05.70"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Lea",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "00:00.000"
                    }
                ],
                "type": "Circuito"
            },
            {
                "carRestriction": "Cobalt SS (Stock)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "02:05.990"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "02:06.290"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "02:15.070"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "02:05.520"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "02:07.120"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "02:05.990"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "02:06.290"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "02:15.070"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "02:05.520"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "02:07.120"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "02:05.990"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "02:06.290"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "02:15.070"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "02:05.520"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "02:07.120"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "02:05.990"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "02:06.290"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "02:15.070"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "02:05.520"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "02:07.120"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w3-ch2",
                "route": "Rosewood & State",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "",
                        "pilot": "Shido",
                        "repBadge": "💰 $400.000 REP",
                        "repMoney": 400000,
                        "time": "02:05.990"
                    },
                    {
                        "badge": "🥈 +60 PTS",
                        "bonus": 60,
                        "car": "",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $300.000 REP",
                        "repMoney": 300000,
                        "time": "02:06.290"
                    },
                    {
                        "badge": "🥉 +30 PTS",
                        "bonus": 30,
                        "car": "",
                        "pilot": "Nebula",
                        "repBadge": "💰 $200.000 REP",
                        "repMoney": 200000,
                        "time": "02:15.070"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "00:00.000"
                    }
                ],
                "type": "Sprint"
            },
            {
                "carRestriction": "Subaru WRX (Junkman)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $100.000 REP",
                            "repMoney": 100000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:21.340"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "00:22.660"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $100.000 REP",
                            "repMoney": 100000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:21.340"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "00:22.660"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $100.000 REP",
                            "repMoney": 100000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:21.340"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "00:22.660"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $100.000 REP",
                            "repMoney": 100000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:21.340"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "00:22.660"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w3-ch3",
                "route": "Union & Rockridge",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "",
                        "pilot": "Shido",
                        "repBadge": "💰 $300.000 REP",
                        "repMoney": 300000,
                        "time": "00:00.000"
                    },
                    {
                        "badge": "🥈 +60 PTS",
                        "bonus": 60,
                        "car": "",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $200.000 REP",
                        "repMoney": 200000,
                        "time": "00:00.000"
                    },
                    {
                        "badge": "🥉 +30 PTS",
                        "bonus": 30,
                        "car": "",
                        "pilot": "Nebula",
                        "repBadge": "💰 $100.000 REP",
                        "repMoney": 100000,
                        "time": "00:00.000"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Lea",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "00:00.000"
                    }
                ],
                "type": "Drag"
            },
            {
                "carRestriction": "Lotus Elise (Junkman)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:27.890"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:29.220"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "01:31.790"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:30.600"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:30.950"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:27.890"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:29.220"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "01:31.790"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:30.600"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:30.950"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:27.890"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:29.220"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "01:31.790"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:30.600"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:30.950"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:27.890"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:29.220"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "01:31.790"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:30.600"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:30.950"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w3-ch4",
                "route": "Diamond",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $400.000 REP",
                        "repMoney": 400000,
                        "time": "01:27.890"
                    },
                    {
                        "badge": "🥈 +60 PTS",
                        "bonus": 60,
                        "car": "",
                        "pilot": "Shido",
                        "repBadge": "💰 $300.000 REP",
                        "repMoney": 300000,
                        "time": "01:29.220"
                    },
                    {
                        "badge": "🥉 +30 PTS",
                        "bonus": 30,
                        "car": "",
                        "pilot": "Nebula",
                        "repBadge": "💰 $200.000 REP",
                        "repMoney": 200000,
                        "time": "01:31.790"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Lea",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "00:00.000"
                    }
                ],
                "type": "Circuito"
            },
            {
                "carRestriction": "Fiat Punto (Junkman)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:27.190"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:29.290"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "12:94.20"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:26.200"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:26.660"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:27.190"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:29.290"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "12:94.20"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:26.200"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:26.660"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:27.190"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:29.290"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "12:94.20"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:26.200"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:26.660"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:27.190"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:29.290"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "12:94.20"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:26.200"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:26.660"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w3-ch5",
                "route": "Clubhouse & Hollis",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "",
                        "pilot": "Shido",
                        "repBadge": "💰 $400.000 REP",
                        "repMoney": 400000,
                        "time": "01:27.190"
                    },
                    {
                        "badge": "🥈 +60 PTS",
                        "bonus": 60,
                        "car": "",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $300.000 REP",
                        "repMoney": 300000,
                        "time": "01:29.290"
                    },
                    {
                        "badge": "🥉 +30 PTS",
                        "bonus": 30,
                        "car": "",
                        "pilot": "Nebula",
                        "repBadge": "💰 $200.000 REP",
                        "repMoney": 200000,
                        "time": "12:94.20"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "00:00.000"
                    }
                ],
                "type": "Sprint"
            },
            {
                "carRestriction": "Mitsubishi Lancer Evolution (Stock)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:41.270"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:43.940"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "01:46.670"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:42.690"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:42.940"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:41.270"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:43.940"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "01:46.670"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:42.690"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:42.940"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:41.270"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:43.940"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "01:46.670"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:42.690"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:42.940"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:41.270"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:43.940"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "01:46.670"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:42.690"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:42.940"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w3-ch6",
                "route": "Circle Rose",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "",
                        "pilot": "Shido",
                        "repBadge": "💰 $400.000 REP",
                        "repMoney": 400000,
                        "time": "01:41.270"
                    },
                    {
                        "badge": "🥈 +60 PTS",
                        "bonus": 60,
                        "car": "",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $300.000 REP",
                        "repMoney": 300000,
                        "time": "01:43.940"
                    },
                    {
                        "badge": "🥉 +30 PTS",
                        "bonus": 30,
                        "car": "",
                        "pilot": "Nebula",
                        "repBadge": "💰 $200.000 REP",
                        "repMoney": 200000,
                        "time": "01:46.670"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Lea",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "00:00.000"
                    }
                ],
                "type": "Circuito"
            },
            {
                "carRestriction": "Porsche Cayman S (Junkman)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "00:20.700"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "DarkShido",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "00:21.111"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $100.000 REP",
                            "repMoney": 100000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:20.910"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "00:20.700"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "DarkShido",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "00:21.111"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $100.000 REP",
                            "repMoney": 100000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:20.910"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "00:20.700"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "DarkShido",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "00:21.111"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $100.000 REP",
                            "repMoney": 100000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:20.910"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "00:20.700"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "DarkShido",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "00:21.111"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $100.000 REP",
                            "repMoney": 100000,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "00:20.910"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w3-ch7",
                "route": "Ocean & Harbor",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $300.000 REP",
                        "repMoney": 300000,
                        "time": "00:20.700"
                    },
                    {
                        "badge": "🥈 +60 PTS",
                        "bonus": 60,
                        "car": "",
                        "pilot": "DarkShido",
                        "repBadge": "💰 $200.000 REP",
                        "repMoney": 200000,
                        "time": "00:21.111"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Nebula",
                        "repBadge": "💰 $100.000 REP",
                        "repMoney": 100000,
                        "time": "00:00.000"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Lea",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "00:00.000"
                    }
                ],
                "type": "Drag"
            },
            {
                "carRestriction": "Porsche Carrera GT (Junkman)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:28.090"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:28.390"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "01:29.470"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:28.100"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:41.520"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:28.090"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:28.390"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "01:29.470"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:28.100"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:41.520"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:28.090"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:28.390"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "01:29.470"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:28.100"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:41.520"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Alfa (Cruce de Titanes)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Shido",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:28.090"
                        },
                        {
                            "badge": "🥈 +60 PTS",
                            "bonus": 60,
                            "car": "",
                            "pilot": "Nebula",
                            "repBadge": "💰 $300.000 REP",
                            "repMoney": 300000,
                            "time": "01:28.390"
                        },
                        {
                            "badge": "🥉 +30 PTS",
                            "bonus": 30,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $200.000 REP",
                            "repMoney": 200000,
                            "time": "01:29.470"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Beta (Duelo de Élite)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "xLeMondx",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:28.100"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "ZimanX",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:41.520"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Guerra de Caballos)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "N6 xBourne",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "DannyLove",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "KAYINE",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ]
                },
                "id": "w3-ch8",
                "route": "Switchback",
                "top3": [
                    {
                        "badge": "🥇 +100 PTS",
                        "bonus": 100,
                        "car": "",
                        "pilot": "Shido",
                        "repBadge": "💰 $400.000 REP",
                        "repMoney": 400000,
                        "time": "01:28.090"
                    },
                    {
                        "badge": "🥈 +60 PTS",
                        "bonus": 60,
                        "car": "",
                        "pilot": "Nebula",
                        "repBadge": "💰 $300.000 REP",
                        "repMoney": 300000,
                        "time": "01:28.390"
                    },
                    {
                        "badge": "🥉 +30 PTS",
                        "bonus": 30,
                        "car": "",
                        "pilot": "SRTxAvenger™",
                        "repBadge": "💰 $200.000 REP",
                        "repMoney": 200000,
                        "time": "01:29.470"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Lea",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "00:00.000"
                    }
                ],
                "type": "Circuito"
            }
        ],
        "dates": "17 Oct 2026 - 23 Oct 2026",
        "groups": [
            {
                "name": "Grupo Alpha (Cruce de Titanes)",
                "pilots": [
                    6,
                    5,
                    3,
                    8
                ],
                "tag": "TIER OFICIAL"
            },
            {
                "name": "Grupo Beta (Duelo de Élite)",
                "pilots": [
                    1,
                    4,
                    14
                ],
                "tag": "TIER OFICIAL"
            },
            {
                "name": "Grupo Gamma (Guerra de Caballos)",
                "pilots": [
                    10,
                    7,
                    15
                ],
                "tag": "TIER OFICIAL"
            }
        ],
        "title": "Semana 3: Cruce de Grupos & Ascenso (17 - 23 Oct)",
        "weekNumber": 3
    },
    "4": {
        "challenges": [
            {
                "carRestriction": "Porsche Carrera GT (Junkman)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:21.130"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:23.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:21.130"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:23.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:21.130"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:23.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Lea",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "01:21.130"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "SRTxAvenger™",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "01:23.000"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Flow.",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "00:00.000"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "id": "w4-ch1",
                "route": "City Perimeter",
                "top3": [
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    }
                ],
                "type": "Circuito"
            },
            {
                "carRestriction": "Chevrolet Corvette C6 (Stock)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "id": "w4-ch2",
                "route": "Stadium & Hwy 99",
                "top3": [
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    }
                ],
                "type": "Sprint"
            },
            {
                "carRestriction": "BMW M3 GTR (Auto Bonus)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "id": "w4-ch3",
                "route": "Riverside & Terrace",
                "top3": [
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    }
                ],
                "type": "Drag"
            },
            {
                "carRestriction": "BMW M3 GTR (Auto Bonus)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "id": "w4-ch4",
                "route": "Century Square",
                "top3": [
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    }
                ],
                "type": "Circuito"
            },
            {
                "carRestriction": "BMW M3 GTR (Auto Bonus)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "id": "w4-ch5",
                "route": "Campus Chancellor",
                "top3": [
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    }
                ],
                "type": "Sprint"
            },
            {
                "carRestriction": "BMW M3 GTR (Auto Bonus)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "id": "w4-ch6",
                "route": "Bay Bridge",
                "top3": [
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    }
                ],
                "type": "Circuito"
            },
            {
                "carRestriction": "Fiat Punto (Stock)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "id": "w4-ch7",
                "route": "Boardwalk & Bayshore",
                "top3": [
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    }
                ],
                "type": "Drag"
            },
            {
                "carRestriction": "BMW M3 GTR (Auto Bonus)",
                "groupsResults": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "groupsWinners": {
                    "0": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "1": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "2": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Alpha (Gran Final • Corona)": [
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "0 PTS",
                            "bonus": 0,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "$0 REP",
                            "repMoney": 0,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Beta (Duelo por el Podio)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥉 +20 PTS",
                            "bonus": 20,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $120.000 REP",
                            "repMoney": 120000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gama (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ],
                    "Grupo Gamma (Batalla de Honor)": [
                        {
                            "badge": "🥇 +100 PTS",
                            "bonus": 100,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $400.000 REP",
                            "repMoney": 400000,
                            "time": "--:--.---"
                        },
                        {
                            "badge": "🥈 +50 PTS",
                            "bonus": 50,
                            "car": "",
                            "pilot": "Por disputar",
                            "repBadge": "💰 $250.000 REP",
                            "repMoney": 250000,
                            "time": "--:--.---"
                        }
                    ]
                },
                "id": "w4-ch8",
                "route": "Camden Tunnel",
                "top3": [
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    },
                    {
                        "badge": "0 PTS",
                        "bonus": 0,
                        "car": "",
                        "pilot": "Por disputar",
                        "repBadge": "$0 REP",
                        "repMoney": 0,
                        "time": "--:--.---"
                    }
                ],
                "type": "Circuito"
            }
        ],
        "dates": "24 Oct 2026 - 31 Oct 2026",
        "groups": [
            {
                "name": "Grupo Alpha (Gran Final • Corona)",
                "pilots": [
                    3,
                    4,
                    15,
                    14
                ],
                "tag": "TIER OFICIAL"
            },
            {
                "name": "Grupo Beta (Duelo por el Podio)",
                "pilots": [
                    10,
                    5,
                    8
                ],
                "tag": "TIER OFICIAL"
            },
            {
                "name": "Grupo Gamma (Batalla de Honor)",
                "pilots": [
                    1,
                    6
                ],
                "tag": "TIER OFICIAL"
            }
        ],
        "title": "Semana 4: Gran Final del Campeonato (24 - 31 Oct)",
        "weekNumber": 4
    },
    "5": {
        "title": "Championship Week: Gran Final Absoluta • Corona Blacklist #1",
        "dates": "01 Nov 2026 - 07 Nov 2026",
        "status": "active",
        "statusBadge": "👑 EN DISPUTA DE CORONA",
        "groups": [
            {
                "name": "Grupo Alfa (Gran Final • Corona Blacklist #1)",
                "pilots": [
                    1,
                    5,
                    3,
                    4
                ],
                "tag": "👑 GRAN FINAL #1"
            },
            {
                "name": "Grupo Beta (Duelo de Honor • Podio Mundial)",
                "pilots": [
                    6,
                    7,
                    8,
                    10
                ],
                "tag": "🥈 DUELO PODIO"
            },
            {
                "name": "Grupo Gama (Copa Desafío • Maestros de Rockport)",
                "pilots": [
                    2,
                    9,
                    11,
                    12
                ],
                "tag": "⚔️ COPA DESAFÍO"
            },
            {
                "name": "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)",
                "pilots": [
                    13,
                    14,
                    15
                ],
                "tag": "🎯 LEYENDAS"
            }
        ],
        "challenges": [
            {
                "id": 1,
                "route": "City Perimeter",
                "type": "Circuito",
                "category": "Gran Final",
                "carRestriction": "Porsche Carrera GT (Junkman)",
                "top3": [
                    {
                        "pilot": "ZimanX",
                        "rank": 1,
                        "time": "01:14.280",
                        "car": "Porsche Carrera GT"
                    },
                    {
                        "pilot": "Avenger",
                        "rank": 5,
                        "time": "01:14.650",
                        "car": "Porsche Carrera GT"
                    },
                    {
                        "pilot": "Nebula",
                        "rank": 3,
                        "time": "01:15.120",
                        "car": "Carrera GT"
                    }
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                },
                "groupsResults": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                }
            },
            {
                "id": 2,
                "route": "Point Camden & Seaside",
                "type": "Sprint",
                "category": "Gran Final",
                "carRestriction": "Porsche Carrera GT (Junkman)",
                "top3": [
                    {
                        "pilot": "Avenger",
                        "rank": 5,
                        "time": "01:42.150",
                        "car": "Porsche Carrera GT"
                    },
                    {
                        "pilot": "ZimanX",
                        "rank": 1,
                        "time": "01:42.480",
                        "car": "Porsche Carrera GT"
                    },
                    {
                        "pilot": "xLeMondx",
                        "rank": 4,
                        "time": "01:43.050",
                        "car": "Porsche Carrera GT"
                    }
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                },
                "groupsResults": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                }
            },
            {
                "id": 3,
                "route": "Heritage & Rosewood",
                "type": "Drag",
                "category": "Gran Final",
                "carRestriction": "Lotus Elise (No Junkman)",
                "top3": [
                    {
                        "pilot": "Nebula",
                        "rank": 3,
                        "time": "00:23.180",
                        "car": "Lotus Elise"
                    },
                    {
                        "pilot": "DarkShido",
                        "rank": 6,
                        "time": "00:23.410",
                        "car": "Lotus Elise"
                    },
                    {
                        "pilot": "DannyLove",
                        "rank": 7,
                        "time": "00:23.650",
                        "car": "Lotus Elise"
                    }
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                },
                "groupsResults": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                }
            },
            {
                "id": 4,
                "route": "Petersburgs",
                "type": "Circuito",
                "category": "Gran Final",
                "carRestriction": "BMW M3 GTR",
                "top3": [
                    {
                        "pilot": "Mystic",
                        "rank": 2,
                        "time": "01:20.110",
                        "car": "BMW M3 GTR"
                    },
                    {
                        "pilot": "ZimanX",
                        "rank": 1,
                        "time": "01:20.450",
                        "car": "BMW M3 GTR"
                    },
                    {
                        "pilot": "Lea4Speed0",
                        "rank": 8,
                        "time": "01:20.890",
                        "car": "BMW M3 GTR"
                    }
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                },
                "groupsResults": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                }
            },
            {
                "id": 5,
                "route": "NFS World Loop",
                "type": "Sprint",
                "category": "Gran Final",
                "carRestriction": "Porsche Carrera GT (Junkman)",
                "top3": [
                    {
                        "pilot": "Avenger",
                        "rank": 5,
                        "time": "04:52.340",
                        "car": "Porsche Carrera GT"
                    },
                    {
                        "pilot": "xLeMondx",
                        "rank": 4,
                        "time": "04:53.110",
                        "car": "Porsche Carrera GT"
                    },
                    {
                        "pilot": "ZimanX",
                        "rank": 1,
                        "time": "04:54.020",
                        "car": "Porsche Carrera GT"
                    }
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                },
                "groupsResults": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                }
            },
            {
                "id": 6,
                "route": "Century Square",
                "type": "Circuito",
                "category": "Gran Final",
                "carRestriction": "BMW M3 GTR",
                "top3": [
                    {
                        "pilot": "DarkShido",
                        "rank": 6,
                        "time": "01:19.400",
                        "car": "BMW M3 GTR"
                    },
                    {
                        "pilot": "DannyLove",
                        "rank": 7,
                        "time": "01:19.850",
                        "car": "BMW M3 GTR"
                    },
                    {
                        "pilot": "ellafreyafan",
                        "rank": 9,
                        "time": "01:20.300",
                        "car": "BMW M3 GTR"
                    }
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                },
                "groupsResults": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                }
            },
            {
                "id": 7,
                "route": "Harbor & Ocean",
                "type": "Drag",
                "category": "Gran Final",
                "carRestriction": "Dodge Viper SRT-10 (No Junkman)",
                "top3": [
                    {
                        "pilot": "xLeMondx",
                        "rank": 4,
                        "time": "00:22.950",
                        "car": "Dodge Viper SRT-10"
                    },
                    {
                        "pilot": "Nebula",
                        "rank": 3,
                        "time": "00:23.200",
                        "car": "Dodge Viper SRT-10"
                    },
                    {
                        "pilot": "ZimanX",
                        "rank": 1,
                        "time": "00:23.500",
                        "car": "Dodge Viper SRT-10"
                    }
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                },
                "groupsResults": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                }
            },
            {
                "id": 8,
                "route": "Camden Tunnel",
                "type": "Circuito",
                "category": "Gran Final",
                "carRestriction": "Porsche Carrera GT (Junkman)",
                "top3": [
                    {
                        "pilot": "ZimanX",
                        "rank": 1,
                        "time": "01:31.100",
                        "car": "Porsche Carrera GT"
                    },
                    {
                        "pilot": "Avenger",
                        "rank": 5,
                        "time": "01:31.420",
                        "car": "Porsche Carrera GT"
                    },
                    {
                        "pilot": "Nebula",
                        "rank": 3,
                        "time": "01:31.980",
                        "car": "Carrera GT"
                    }
                ],
                "groupsWinners": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                },
                "groupsResults": {
                    "0": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "1": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "2": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "3": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ],
                    "Grupo Alfa (Gran Final • Corona Blacklist #1)": [
                        {
                            "rank": 1,
                            "pilot": "ZimanX",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 5,
                            "pilot": "Avenger",
                            "car": "Porsche Carrera GT Y LOTUS ELISE",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 3,
                            "pilot": "Nebula",
                            "car": "Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 4,
                            "pilot": "xLeMondx",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Beta (Duelo de Honor • Podio Mundial)": [
                        {
                            "rank": 6,
                            "pilot": "DarkShido",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
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
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 8,
                            "pilot": "Lea4Speed0",
                            "car": "Carrera GT & M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 9,
                            "pilot": "ellafreyafan",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Gama (Copa Desafío • Maestros de Rockport)": [
                        {
                            "rank": 10,
                            "pilot": "N6 xBourne",
                            "car": "Porsche Carrera GT y Lotus Elise",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 11,
                            "pilot": "RazorV8",
                            "car": "Ford GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 12,
                            "pilot": "TurboFox",
                            "car": "Porsche 911 Turbo S",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        },
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#4 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#5 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 10,
                            "badge": "#6 +10 PTS",
                            "repMoney": 80000,
                            "repBadge": "💰 $80.000 REP"
                        }
                    ],
                    "Grupo Delta (Duelo Leyendas • Asfalto Clandestino)": [
                        {
                            "rank": 13,
                            "pilot": "Sigy",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 100,
                            "badge": "🥇 +100 PTS",
                            "repMoney": 400000,
                            "repBadge": "💰 $400.000 REP"
                        },
                        {
                            "rank": 14,
                            "pilot": "Flow.",
                            "car": "Porsche Carrera GT",
                            "time": "--:--.---",
                            "bonus": 50,
                            "badge": "🥈 +50 PTS",
                            "repMoney": 250000,
                            "repBadge": "💰 $250.000 REP"
                        },
                        {
                            "rank": 15,
                            "pilot": "SkyHighM3GTR",
                            "car": "BMW M3 GTR",
                            "time": "--:--.---",
                            "bonus": 20,
                            "badge": "🥉 +20 PTS",
                            "repMoney": 120000,
                            "repBadge": "💰 $120.000 REP"
                        }
                    ]
                }
            }
        ]
    }
};

if (typeof window !== "undefined") {
    window.DEFAULT_BLACKLIST_DRIVERS = DEFAULT_BLACKLIST_DRIVERS;
    window.CHAMPIONSHIP_WEEKS_DATA = CHAMPIONSHIP_WEEKS_DATA;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { DEFAULT_BLACKLIST_DRIVERS, CHAMPIONSHIP_WEEKS_DATA };
}
