const fs = require('fs');
const https = require('https');

const w2Challenges = [
    {
        id: "w2-ch1",
        route: "NFS World Loop",
        type: "Sprint",
        carRestriction: "Porsche Carrera GT (Junkman)",
        top3: [
            { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "01:29.840", bonus: 100, badge: "🥇 +100 PTS", repMoney: 500000, repBadge: "💰 $500.000 REP" },
            { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "01:30.420", bonus: 50, badge: "🥈 +50 PTS", repMoney: 300000, repBadge: "💰 $300.000 REP" },
            { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "01:33.150", bonus: 20, badge: "🥉 +20 PTS", repMoney: 150000, repBadge: "💰 $150.000 REP" }
        ],
        groupsResults: {
            0: [
                { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "01:29.840", bonus: 100, repMoney: 500000 },
                { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "01:30.420", bonus: 50, repMoney: 300000 },
                { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "01:33.150", bonus: 20, repMoney: 150000 }
            ],
            1: [
                { rank: 10, pilot: "N6 xBourne", car: "Porsche Carrera GT y Lotus Elise", time: "01:29.980", bonus: 100, repMoney: 500000 },
                { rank: 6, pilot: "DarkShido", car: "BMW M3 GTR", time: "01:32.400", bonus: 50, repMoney: 300000 },
                { rank: 9, pilot: "ellafreyafan", car: "BMW M3 GTR", time: "01:34.210", bonus: 20, repMoney: 150000 }
            ],
            2: [
                { rank: 3, pilot: "Nebula", car: "Carrera GT y Lotus Elise", time: "01:29.410", bonus: 100, repMoney: 500000 },
                { rank: 4, pilot: "xLeMondx", car: "Porsche Carrera GT", time: "01:31.850", bonus: 50, repMoney: 300000 },
                { rank: 7, pilot: "DannyLove", car: "BMW M3 GTR", time: "01:33.900", bonus: 20, repMoney: 150000 }
            ],
            3: [
                { rank: 2, pilot: "Mystic", car: "BMW M3 GTR", time: "01:31.200", bonus: 100, repMoney: 500000 },
                { rank: 11, pilot: "Plaza Disponible #11", car: "Por Inscribir", time: "--:--.---", bonus: 50, repMoney: 300000 },
                { rank: 12, pilot: "Plaza Disponible #12", car: "Por Inscribir", time: "--:--.---", bonus: 20, repMoney: 150000 }
            ]
        }
    },
    {
        id: "w2-ch2",
        route: "Highlands",
        type: "Circuito",
        carRestriction: "Mitsubishi Lancer Evolution (Stock)",
        top3: [
            { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "01:42.100", bonus: 100, badge: "🥇 +100 PTS", repMoney: 460000, repBadge: "💰 $460.000 REP" },
            { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "01:42.650", bonus: 50, badge: "🥈 +50 PTS", repMoney: 280000, repBadge: "💰 $280.000 REP" },
            { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "01:45.300", bonus: 20, badge: "🥉 +20 PTS", repMoney: 140000, repBadge: "💰 $140.000 REP" }
        ],
        groupsResults: {
            0: [
                { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "01:42.100", bonus: 100, repMoney: 460000 },
                { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "01:42.650", bonus: 50, repMoney: 280000 },
                { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "01:45.300", bonus: 20, repMoney: 140000 }
            ],
            1: [
                { rank: 10, pilot: "N6 xBourne", car: "Porsche Carrera GT y Lotus Elise", time: "01:41.950", bonus: 100, repMoney: 460000 },
                { rank: 6, pilot: "DarkShido", car: "BMW M3 GTR", time: "01:44.200", bonus: 50, repMoney: 280000 },
                { rank: 9, pilot: "ellafreyafan", car: "BMW M3 GTR", time: "01:46.800", bonus: 20, repMoney: 140000 }
            ],
            2: [
                { rank: 3, pilot: "Nebula", car: "Carrera GT y Lotus Elise", time: "01:41.220", bonus: 100, repMoney: 460000 },
                { rank: 4, pilot: "xLeMondx", car: "Porsche Carrera GT", time: "01:43.700", bonus: 50, repMoney: 280000 },
                { rank: 7, pilot: "DannyLove", car: "BMW M3 GTR", time: "01:46.100", bonus: 20, repMoney: 140000 }
            ],
            3: [
                { rank: 2, pilot: "Mystic", car: "BMW M3 GTR", time: "01:43.400", bonus: 100, repMoney: 460000 },
                { rank: 11, pilot: "Plaza Disponible #11", car: "Por Inscribir", time: "--:--.---", bonus: 50, repMoney: 280000 },
                { rank: 12, pilot: "Plaza Disponible #12", car: "Por Inscribir", time: "--:--.---", bonus: 20, repMoney: 140000 }
            ]
        }
    },
    {
        id: "w2-ch3",
        route: "Harbor & Ocean",
        type: "Drag",
        carRestriction: "Dodge Viper SRT-10 (No Junkman)",
        top3: [
            { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "00:16.820", bonus: 100, badge: "🥇 +100 PTS", repMoney: 400000, repBadge: "💰 $400.000 REP" },
            { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "00:17.150", bonus: 50, badge: "🥈 +50 PTS", repMoney: 240000, repBadge: "💰 $240.000 REP" },
            { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "00:18.200", bonus: 20, badge: "🥉 +20 PTS", repMoney: 120000, repBadge: "💰 $120.000 REP" }
        ],
        groupsResults: {
            0: [
                { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "00:16.820", bonus: 100, repMoney: 400000 },
                { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "00:17.150", bonus: 50, repMoney: 240000 },
                { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "00:18.200", bonus: 20, repMoney: 120000 }
            ],
            1: [
                { rank: 6, pilot: "DarkShido", car: "BMW M3 GTR", time: "00:16.950", bonus: 100, repMoney: 400000 },
                { rank: 10, pilot: "N6 xBourne", car: "Porsche Carrera GT y Lotus Elise", time: "00:17.300", bonus: 50, repMoney: 240000 },
                { rank: 9, pilot: "ellafreyafan", car: "BMW M3 GTR", time: "00:18.450", bonus: 20, repMoney: 120000 }
            ],
            2: [
                { rank: 3, pilot: "Nebula", car: "Carrera GT y Lotus Elise", time: "00:16.710", bonus: 100, repMoney: 400000 },
                { rank: 4, pilot: "xLeMondx", car: "Porsche Carrera GT", time: "00:17.400", bonus: 50, repMoney: 240000 },
                { rank: 7, pilot: "DannyLove", car: "BMW M3 GTR", time: "00:18.600", bonus: 20, repMoney: 120000 }
            ],
            3: [
                { rank: 2, pilot: "Mystic", car: "BMW M3 GTR", time: "00:17.050", bonus: 100, repMoney: 400000 },
                { rank: 11, pilot: "Plaza Disponible #11", car: "Por Inscribir", time: "--:--.---", bonus: 50, repMoney: 240000 },
                { rank: 12, pilot: "Plaza Disponible #12", car: "Por Inscribir", time: "--:--.---", bonus: 20, repMoney: 120000 }
            ]
        }
    },
    {
        id: "w2-ch4",
        route: "Diamond & Unión",
        type: "Sprint",
        carRestriction: "Mazda RX-8 (Stock)",
        top3: [
            { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "01:38.250", bonus: 100, badge: "🥇 +100 PTS", repMoney: 520000, repBadge: "💰 $520.000 REP" },
            { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "01:38.900", bonus: 50, badge: "🥈 +50 PTS", repMoney: 310000, repBadge: "💰 $310.000 REP" },
            { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "01:41.500", bonus: 20, badge: "🥉 +20 PTS", repMoney: 155000, repBadge: "💰 $155.000 REP" }
        ],
        groupsResults: {
            0: [
                { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "01:38.250", bonus: 100, repMoney: 520000 },
                { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "01:38.900", bonus: 50, repMoney: 310000 },
                { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "01:41.500", bonus: 20, repMoney: 155000 }
            ],
            1: [
                { rank: 10, pilot: "N6 xBourne", car: "Porsche Carrera GT y Lotus Elise", time: "01:37.890", bonus: 100, repMoney: 520000 },
                { rank: 6, pilot: "DarkShido", car: "BMW M3 GTR", time: "01:39.750", bonus: 50, repMoney: 310000 },
                { rank: 9, pilot: "ellafreyafan", car: "BMW M3 GTR", time: "01:42.300", bonus: 20, repMoney: 155000 }
            ],
            2: [
                { rank: 3, pilot: "Nebula", car: "Carrera GT y Lotus Elise", time: "01:37.400", bonus: 100, repMoney: 520000 },
                { rank: 4, pilot: "xLeMondx", car: "Porsche Carrera GT", time: "01:39.120", bonus: 50, repMoney: 310000 },
                { rank: 7, pilot: "DannyLove", car: "BMW M3 GTR", time: "01:41.800", bonus: 20, repMoney: 155000 }
            ],
            3: [
                { rank: 2, pilot: "Mystic", car: "BMW M3 GTR", time: "01:38.700", bonus: 100, repMoney: 520000 },
                { rank: 11, pilot: "Plaza Disponible #11", car: "Por Inscribir", time: "--:--.---", bonus: 50, repMoney: 310000 },
                { rank: 12, pilot: "Plaza Disponible #12", car: "Por Inscribir", time: "--:--.---", bonus: 20, repMoney: 155000 }
            ]
        }
    },
    {
        id: "w2-ch5",
        route: "Heritage Height",
        type: "Circuito",
        carRestriction: "Lamborghini Gallardo (No Junkman)",
        top3: [
            { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "01:49.120", bonus: 100, badge: "🥇 +100 PTS", repMoney: 480000, repBadge: "💰 $480.000 REP" },
            { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "01:49.800", bonus: 50, badge: "🥈 +50 PTS", repMoney: 290000, repBadge: "💰 $290.000 REP" },
            { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "01:52.400", bonus: 20, badge: "🥉 +20 PTS", repMoney: 145000, repBadge: "💰 $145.000 REP" }
        ],
        groupsResults: {
            0: [
                { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "01:49.120", bonus: 100, repMoney: 480000 },
                { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "01:49.800", bonus: 50, repMoney: 290000 },
                { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "01:52.400", bonus: 20, repMoney: 145000 }
            ],
            1: [
                { rank: 10, pilot: "N6 xBourne", car: "Porsche Carrera GT y Lotus Elise", time: "01:48.750", bonus: 100, repMoney: 480000 },
                { rank: 6, pilot: "DarkShido", car: "BMW M3 GTR", time: "01:50.900", bonus: 50, repMoney: 290000 },
                { rank: 9, pilot: "ellafreyafan", car: "BMW M3 GTR", time: "01:53.600", bonus: 20, repMoney: 145000 }
            ],
            2: [
                { rank: 3, pilot: "Nebula", car: "Carrera GT y Lotus Elise", time: "01:47.980", bonus: 100, repMoney: 480000 },
                { rank: 4, pilot: "xLeMondx", car: "Porsche Carrera GT", time: "01:50.250", bonus: 50, repMoney: 290000 },
                { rank: 7, pilot: "DannyLove", car: "BMW M3 GTR", time: "01:52.900", bonus: 20, repMoney: 145000 }
            ],
            3: [
                { rank: 2, pilot: "Mystic", car: "BMW M3 GTR", time: "01:49.500", bonus: 100, repMoney: 480000 },
                { rank: 11, pilot: "Plaza Disponible #11", car: "Por Inscribir", time: "--:--.---", bonus: 50, repMoney: 290000 },
                { rank: 12, pilot: "Plaza Disponible #12", car: "Por Inscribir", time: "--:--.---", bonus: 20, repMoney: 145000 }
            ]
        }
    },
    {
        id: "w2-ch6",
        route: "Hwy 99 & States",
        type: "Sprint",
        carRestriction: "Subaru WRX (Stock)",
        top3: [
            { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "01:33.450", bonus: 100, badge: "🥇 +100 PTS", repMoney: 510000, repBadge: "💰 $510.000 REP" },
            { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "01:33.980", bonus: 50, badge: "🥈 +50 PTS", repMoney: 310000, repBadge: "💰 $310.000 REP" },
            { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "01:36.200", bonus: 20, badge: "🥉 +20 PTS", repMoney: 150000, repBadge: "💰 $150.000 REP" }
        ],
        groupsResults: {
            0: [
                { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "01:33.450", bonus: 100, repMoney: 510000 },
                { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "01:33.980", bonus: 50, repMoney: 310000 },
                { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "01:36.200", bonus: 20, repMoney: 150000 }
            ],
            1: [
                { rank: 10, pilot: "N6 xBourne", car: "Porsche Carrera GT y Lotus Elise", time: "01:32.890", bonus: 100, repMoney: 510000 },
                { rank: 6, pilot: "DarkShido", car: "BMW M3 GTR", time: "01:34.500", bonus: 50, repMoney: 310000 },
                { rank: 9, pilot: "ellafreyafan", car: "BMW M3 GTR", time: "01:37.100", bonus: 20, repMoney: 150000 }
            ],
            2: [
                { rank: 3, pilot: "Nebula", car: "Carrera GT y Lotus Elise", time: "01:32.400", bonus: 100, repMoney: 510000 },
                { rank: 4, pilot: "xLeMondx", car: "Porsche Carrera GT", time: "01:34.150", bonus: 50, repMoney: 310000 },
                { rank: 7, pilot: "DannyLove", car: "BMW M3 GTR", time: "01:36.700", bonus: 20, repMoney: 150000 }
            ],
            3: [
                { rank: 2, pilot: "Mystic", car: "BMW M3 GTR", time: "01:33.800", bonus: 100, repMoney: 510000 },
                { rank: 11, pilot: "Plaza Disponible #11", car: "Por Inscribir", time: "--:--.---", bonus: 50, repMoney: 310000 },
                { rank: 12, pilot: "Plaza Disponible #12", car: "Por Inscribir", time: "--:--.---", bonus: 20, repMoney: 150000 }
            ]
        }
    },
    {
        id: "w2-ch7",
        route: "Seaside & Camden",
        type: "Drag",
        carRestriction: "Mercedes-Benz SLR McLaren (No Junkman)",
        top3: [
            { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "00:15.920", bonus: 100, badge: "🥇 +100 PTS", repMoney: 420000, repBadge: "💰 $420.000 REP" },
            { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "00:16.250", bonus: 50, badge: "🥈 +50 PTS", repMoney: 250000, repBadge: "💰 $250.000 REP" },
            { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "00:17.400", bonus: 20, badge: "🥉 +20 PTS", repMoney: 125000, repBadge: "💰 $125.000 REP" }
        ],
        groupsResults: {
            0: [
                { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "00:15.920", bonus: 100, repMoney: 420000 },
                { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "00:16.250", bonus: 50, repMoney: 250000 },
                { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "00:17.400", bonus: 20, repMoney: 125000 }
            ],
            1: [
                { rank: 6, pilot: "DarkShido", car: "BMW M3 GTR", time: "00:16.100", bonus: 100, repMoney: 420000 },
                { rank: 10, pilot: "N6 xBourne", car: "Porsche Carrera GT y Lotus Elise", time: "00:16.450", bonus: 50, repMoney: 250000 },
                { rank: 9, pilot: "ellafreyafan", car: "BMW M3 GTR", time: "00:17.600", bonus: 20, repMoney: 125000 }
            ],
            2: [
                { rank: 3, pilot: "Nebula", car: "Carrera GT y Lotus Elise", time: "00:15.850", bonus: 100, repMoney: 420000 },
                { rank: 4, pilot: "xLeMondx", car: "Porsche Carrera GT", time: "00:16.380", bonus: 50, repMoney: 250000 },
                { rank: 7, pilot: "DannyLove", car: "BMW M3 GTR", time: "00:17.800", bonus: 20, repMoney: 125000 }
            ],
            3: [
                { rank: 2, pilot: "Mystic", car: "BMW M3 GTR", time: "00:16.150", bonus: 100, repMoney: 420000 },
                { rank: 11, pilot: "Plaza Disponible #11", car: "Por Inscribir", time: "--:--.---", bonus: 50, repMoney: 250000 },
                { rank: 12, pilot: "Plaza Disponible #12", car: "Por Inscribir", time: "--:--.---", bonus: 20, repMoney: 125000 }
            ]
        }
    },
    {
        id: "w2-ch8",
        route: "Omega",
        type: "Circuito",
        carRestriction: "Ford Mustang GT (Stock)",
        top3: [
            { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "01:54.300", bonus: 100, badge: "🥇 +100 PTS", repMoney: 550000, repBadge: "💰 $550.000 REP" },
            { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "01:54.850", bonus: 50, badge: "🥈 +50 PTS", repMoney: 330000, repBadge: "💰 $330.000 REP" },
            { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "01:58.200", bonus: 20, badge: "🥉 +20 PTS", repMoney: 165000, repBadge: "💰 $165.000 REP" }
        ],
        groupsResults: {
            0: [
                { rank: 1, pilot: "ZimanX", car: "Porsche Carrera GT", time: "01:54.300", bonus: 100, repMoney: 550000 },
                { rank: 5, pilot: "SRTxAvenger™", car: "Carrera GT & Lotus Elise", time: "01:54.850", bonus: 50, repMoney: 330000 },
                { rank: 8, pilot: "Lea4Speed0", car: "Carrera GT & M3 GTR", time: "01:58.200", bonus: 20, repMoney: 165000 }
            ],
            1: [
                { rank: 10, pilot: "N6 xBourne", car: "Porsche Carrera GT y Lotus Elise", time: "01:53.900", bonus: 100, repMoney: 550000 },
                { rank: 6, pilot: "DarkShido", car: "BMW M3 GTR", time: "01:56.200", bonus: 50, repMoney: 330000 },
                { rank: 9, pilot: "ellafreyafan", car: "BMW M3 GTR", time: "01:59.100", bonus: 20, repMoney: 165000 }
            ],
            2: [
                { rank: 3, pilot: "Nebula", car: "Carrera GT y Lotus Elise", time: "01:53.200", bonus: 100, repMoney: 550000 },
                { rank: 4, pilot: "xLeMondx", car: "Porsche Carrera GT", time: "01:55.700", bonus: 50, repMoney: 330000 },
                { rank: 7, pilot: "DannyLove", car: "BMW M3 GTR", time: "01:58.600", bonus: 20, repMoney: 165000 }
            ],
            3: [
                { rank: 2, pilot: "Mystic", car: "BMW M3 GTR", time: "01:54.900", bonus: 100, repMoney: 550000 },
                { rank: 11, pilot: "Plaza Disponible #11", car: "Por Inscribir", time: "--:--.---", bonus: 50, repMoney: 330000 },
                { rank: 12, pilot: "Plaza Disponible #12", car: "Por Inscribir", time: "--:--.---", bonus: 20, repMoney: 165000 }
            ]
        }
    }
];

// 1. Modificar src/blacklist-data.js
let content = fs.readFileSync('src/blacklist-data.js', 'utf8');

// Reemplazar la sección challenges de la semana 2
const challengesJson = JSON.stringify(w2Challenges, null, 12);
// Encontrar donde empieza weekNumber: 2
const w2Idx = content.indexOf('weekNumber: 2,');
const chIdx = content.indexOf('challenges: [', w2Idx);
// Encontrar el final de challenges: [...] para la semana 2 (antes de "3: {")
const w3Idx = content.indexOf('3: {', chIdx);
const chEndIdx = content.lastIndexOf(']', w3Idx);

const newW2Block = 'challenges: ' + JSON.stringify(w2Challenges, null, 12);

content = content.slice(0, chIdx) + newW2Block + content.slice(chEndIdx + 1);

fs.writeFileSync('src/blacklist-data.js', content, 'utf8');
fs.writeFileSync('assets/js/blacklist-data.js', content, 'utf8');
console.log('✓ blacklist-data.js actualizado en src/ y assets/js/');

// 2. Cargar todos los datos de semanas y actualizar Firebase RTDB
const { CHAMPIONSHIP_WEEKS_DATA } = require('./src/blacklist-data.js');

const rtdbPayload = Object.values(CHAMPIONSHIP_WEEKS_DATA);
const payloadStr = JSON.stringify(rtdbPayload);

const req = https.request('https://nfsranks-blacklist-default-rtdb.firebaseio.com/records/championship_weeks_data.json', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payloadStr)
    }
}, (res) => {
    console.log('✓ Firebase RTDB actualizado con código de respuesta:', res.statusCode);
    process.exit(0);
});

req.on('error', (e) => {
    console.error('Error al actualizar RTDB:', e.message);
    process.exit(1);
});

req.write(payloadStr);
req.end();
