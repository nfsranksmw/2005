/**
 * NFS: Most Wanted (2005) - World Records (NFSRANKSMW)
 * Base de Datos Oficial: Campeonato Blacklist 2026
 * 4 Semanas de Competición • 4 Desafíos por Semana • 5 Grupos de 3 Pilotos (15 Participantes)
 * Calendario Oficial: 03 de Octubre al 31 de Octubre de 2026
 * 
 * Sistema de Puntuación:
 * - 1er Mejor Tiempo: +100 PTS adicionales
 * - 2do Mejor Tiempo: +50 PTS adicionales
 * - 3er Mejor Tiempo: +20 PTS adicionales
 * - Podios: P1 = 25 PTS, P2 = 18 PTS, P3 = 15 PTS, P4 = 12 PTS
 * - Reputación ($ REP): Bonificaciones en efectivo por victoria y récord
 */

// 15 Pilotos Oficiales de la Blacklist
const DEFAULT_BLACKLIST_DRIVERS = [
    {
        rank: 1,
        name: "Clarence Callahan",
        alias: "Razor",
        ride: "BMW M3 GTR",
        strength: "Everything (Dominio Total)",
        rep: 3450000,
        victories: { p1: 20, p2: 5, p3: 2, p4: 1 },
        bestTimes: { first: 6, second: 3, third: 1 }, // 6x100 + 3x50 + 1x20 = 770 pts bono
        bio: "Razor se catapultó a la cima de la Blacklist usando tu propia máquina. Ahora controla cada palmo de Rockport City como si fuera de su propiedad. Hará absolutamente cualquier cosa por mantener su ventaja, incluyendo jugar con tu mente. Recuerda: no confíes en nada de lo que diga.",
        signature: "RAZOR",
        status: "LÍDER BLACKLIST #1",
        avatar: "assets/img/blacklist/razor.jpg",
        color: "#ffd700",
        badge: "👑 #1 SUPREME"
    },
    {
        rank: 2,
        name: "Toru Sato",
        alias: "Bull",
        ride: "Mercedes-Benz SLR McLaren",
        strength: "Sprints de Alta Velocidad",
        rep: 2890000,
        victories: { p1: 16, p2: 7, p3: 4, p4: 2 },
        bestTimes: { first: 4, second: 4, third: 2 }, // 4x100 + 4x50 + 2x20 = 640 pts bono
        bio: "La mano derecha de Razor. Jamás corre sin apostar fuerte y su SLR McLaren tiene modificaciones de aceleración bruta. Si crees que te dará espacio en la curva de salida, estás muy equivocado.",
        signature: "BULL",
        status: "DEFENSOR TOP 2",
        avatar: "assets/img/blacklist/bull.jpg",
        color: "#c0c0c0",
        badge: "🥈 #2 ELITE"
    },
    {
        rank: 3,
        name: "Ronald McCrea",
        alias: "Ronnie",
        ride: "Aston Martin DB9",
        strength: "Circuitos & Trazado Técnico",
        rep: 2420000,
        victories: { p1: 14, p2: 6, p3: 5, p4: 2 },
        bestTimes: { first: 3, second: 5, third: 3 }, // 3x100 + 5x50 + 3x20 = 610 pts bono
        bio: "Hijo de familia rica con recursos ilimitados para piezas de competición. Ronnie perfecciona cada sector hasta milésimas de segundo. No lo subestimes en carreras con curvas encadenadas.",
        signature: "RONNIE",
        status: "DEFENSOR TOP 3",
        avatar: "assets/img/blacklist/ronnie.jpg",
        color: "#cd7f32",
        badge: "🥉 #3 PODIUM"
    },
    {
        rank: 4,
        name: "Joe Vega",
        alias: "JV",
        ride: "Dodge Viper SRT-10",
        strength: "Speedtraps & Drags",
        rep: 2050000,
        victories: { p1: 11, p2: 8, p3: 5, p4: 3 },
        bestTimes: { first: 3, second: 3, third: 4 }, // 300 + 150 + 80 = 530 pts
        bio: "Pasa las noches en los clubes nocturnos y los días pulverizando los radares de velocidad. Su Viper tiene una potencia de salida descomunal y su tiempo de reacción en el cambio de marcha es letal.",
        signature: "JV",
        status: "RETADOR TOP 4",
        avatar: "assets/img/blacklist/jv.jpg",
        color: "#ff2a4b",
        badge: "TOP 4 CONTENDER"
    },
    {
        rank: 5,
        name: "Wes Allen",
        alias: "Webster",
        ride: "Chevrolet Corvette C6",
        strength: "Circuitos Cerrados",
        rep: 1830000,
        victories: { p1: 10, p2: 7, p3: 4, p4: 4 },
        bestTimes: { first: 2, second: 4, third: 3 }, // 200 + 200 + 60 = 460 pts
        bio: "Webster habla constantemente de rendimiento automotriz y telemetría avanzada. Cree que el resto de corredores son amateurs comparados con su disciplina de pista profesional.",
        signature: "WEBSTER",
        status: "RETADOR TOP 5",
        avatar: "assets/img/blacklist/webster.jpg",
        color: "#00d2ff",
        badge: "TOP 5 RACER"
    },
    {
        rank: 6,
        name: "Hector Domingo",
        alias: "Ming",
        ride: "Lamborghini Gallardo",
        strength: "Radares de Velocidad",
        rep: 1640000,
        victories: { p1: 9, p2: 8, p3: 5, p4: 3 },
        bestTimes: { first: 2, second: 3, third: 4 }, // 200 + 150 + 80 = 430 pts
        bio: "Orgullo absoluto sobre ruedas. Su Gallardo es prácticamente intocable en rectas largas de autopista. Ha dejado atrás a la policía del condado más veces de las que puede contar.",
        signature: "MING",
        status: "ACTIVO",
        avatar: "assets/img/blacklist/ming.jpg",
        color: "#39ff14",
        badge: "TOP 6 SPEED"
    },
    {
        rank: 7,
        name: "Kira Nakazato",
        alias: "Kaze",
        ride: "Mercedes-Benz CLK 500",
        strength: "Daño & Evasión de Bloqueos",
        rep: 1420000,
        victories: { p1: 8, p2: 6, p3: 6, p4: 5 },
        bestTimes: { first: 2, second: 2, third: 4 }, // 200 + 100 + 80 = 380 pts
        bio: "Kaze es impredecible y no le teme a la destrucción de carrocería. Si intentas adelantarla por el interior de una horquilla, prepárate para sentir el impacto de su parachoques.",
        signature: "KAZE",
        status: "ACTIVO",
        avatar: "assets/img/blacklist/kaze.jpg",
        color: "#ff007f",
        badge: "TOP 7 FORCE"
    },
    {
        rank: 8,
        name: "Jade Barrett",
        alias: "Jewels",
        ride: "Ford Mustang GT",
        strength: "Drags & Aceleración Nitro",
        rep: 1250000,
        victories: { p1: 7, p2: 8, p3: 4, p4: 4 },
        bestTimes: { first: 2, second: 2, third: 2 }, // 200 + 100 + 40 = 340 pts
        bio: "Apasionada del músculo americano y del rugido de los motores V8 modificados. Domina la salida en parada completa y el uso milimétrico de la inyección de óxido nitroso.",
        signature: "JEWELS",
        status: "ACTIVO",
        avatar: "assets/img/blacklist/jewels.jpg",
        color: "#ffaa00",
        badge: "TOP 8 MUSCLE"
    },
    {
        rank: 9,
        name: "Eugene James",
        alias: "Earl",
        ride: "Mitsubishi Lancer Evolution VIII",
        strength: "Sprint en Pavimento Mojado & Curvas",
        rep: 1120000,
        victories: { p1: 6, p2: 7, p3: 7, p4: 5 },
        bestTimes: { first: 1, second: 3, third: 3 }, // 100 + 150 + 60 = 310 pts
        bio: "Nacido en la costa este industrial. Conoce cada bache y trampa de la bahía de Camden. La tracción total de su Evo le da una estabilidad insuperable en curvas rápidas.",
        signature: "EARL",
        status: "ACTIVO",
        avatar: "assets/img/blacklist/earl.jpg",
        color: "#00f0ff",
        badge: "TOP 9 AWD"
    },
    {
        rank: 10,
        name: "Karl Smit",
        alias: "Baron",
        ride: "Porsche Cayman S",
        strength: "Persecuciones & Maniobras Policiales",
        rep: 980000,
        victories: { p1: 5, p2: 6, p3: 7, p4: 6 },
        bestTimes: { first: 1, second: 2, third: 3 }, // 100 + 100 + 60 = 260 pts
        bio: "Se hace llamar 'Baron' por su colección de deportivos europeos de lujo. Su estilo de conducción es limpio y calculador, evitando a toda costa cualquier roce con el rival.",
        signature: "BARON",
        status: "ACTIVO",
        avatar: "assets/img/blacklist/baron.jpg",
        color: "#9d4edd",
        badge: "TOP 10 EURO"
    },
    {
        rank: 11,
        name: "Victor Vasquez",
        alias: "Vic",
        ride: "Toyota Supra",
        strength: "Resistencia en Vueltas Largas",
        rep: 870000,
        victories: { p1: 5, p2: 6, p3: 5, p4: 7 },
        bestTimes: { first: 1, second: 1, third: 3 }, // 100 + 50 + 60 = 210 pts
        bio: "Veterano de las carreras ilegales de Rockport. Su Supra 2JZ tiene una puesta a punto impecable que no pierde compresión ni en las carreras más extensas del mapa.",
        signature: "VIC",
        status: "ACTIVO",
        avatar: "assets/img/blacklist/vic.jpg",
        color: "#ff3333",
        badge: "TOP 11 TURBO"
    },
    {
        rank: 12,
        name: "Isabel Diaz",
        alias: "Izzy",
        ride: "Mazda RX-8",
        strength: "Derrapes & Curvas Cerradas",
        rep: 760000,
        victories: { p1: 4, p2: 7, p3: 6, p4: 5 },
        bestTimes: { first: 0, second: 2, third: 3 }, // 0 + 100 + 60 = 160 pts
        bio: "Proviene de una familia entera de mecánicos. Conoce las especificaciones de cada motor rotativo de memoria. Difícil de batir en circuitos estrechos con giros técnicos.",
        signature: "IZZY",
        status: "ACTIVO",
        avatar: "assets/img/blacklist/izzy.jpg",
        color: "#00ffaa",
        badge: "TOP 12 ROTARY"
    },
    {
        rank: 13,
        name: "Lou Park",
        alias: "Big Lou",
        ride: "Mitsubishi Eclipse GT",
        strength: "Tolls & Cuellos de Botella",
        rep: 660000,
        victories: { p1: 3, p2: 6, p3: 6, p4: 8 },
        bestTimes: { first: 0, second: 1, third: 2 }, // 0 + 50 + 40 = 90 pts
        bio: "Famoso por su estilo arrogante y por intimidar a sus oponentes antes de que el semáforo se ponga en verde. Sin embargo, su Eclipse tiene un paso por curva muy respetable.",
        signature: "BIG LOU",
        status: "ACTIVO",
        avatar: "assets/img/blacklist/biglou.jpg",
        color: "#e63946",
        badge: "TOP 13 STREET"
    },
    {
        rank: 14,
        name: "Vince Kilic",
        alias: "Taz",
        ride: "Lexus IS 300",
        strength: "Trazado Urbano",
        rep: 550000,
        victories: { p1: 3, p2: 5, p3: 7, p4: 9 },
        bestTimes: { first: 0, second: 1, third: 1 }, // 0 + 50 + 20 = 70 pts
        bio: "Odia a la policía con toda su alma y suele usar los clavos y patrullas para deshacerse de los retadores que intentan seguir su estela por el centro comercial de Rockport.",
        signature: "TAZ",
        status: "ACTIVO",
        avatar: "assets/img/blacklist/taz.jpg",
        color: "#f4a261",
        badge: "TOP 14 ROOKIE"
    },
    {
        rank: 15,
        name: "Ho Seun",
        alias: "Sonny",
        ride: "Volkswagen Golf GTI",
        strength: "Circuitos Cortos",
        rep: 450000,
        victories: { p1: 2, p2: 5, p3: 6, p4: 10 },
        bestTimes: { first: 0, second: 0, third: 2 }, // 0 + 0 + 40 = 40 pts
        bio: "La puerta de entrada a la Blacklist. Sonny ha invertido todo su dinero en equipar su Golf GTI con piezas de calle de primer nivel. Vencerlo es el primer paso para llegar hasta Razor.",
        signature: "SONNY",
        status: "GUARDIÁN #15",
        avatar: "assets/img/blacklist/sonny.jpg",
        color: "#48cae4",
        badge: "TOP 15 GATE"
    }
];

// ==============================================================================
// CALENDARIO DEL CAMPEONATO (4 SEMANAS • 5 GRUPOS DE 3 • 4 DESAFÍOS/SEM)
// Calendario Oficial: 03 de Octubre al 31 de Octubre de 2026
// ==============================================================================

const CHAMPIONSHIP_WEEKS_DATA = {
    1: {
        weekNumber: 1,
        title: "Semana 1: Calificación & Tríos Iniciales (03 - 09 Oct)",
        dates: "03 Oct 2026 - 09 Oct 2026",
        groups: [
            { name: "Grupo Alpha (Líderes)", pilots: [1, 2, 3], tag: "🔥 TIER SUPREME" },
            { name: "Grupo Beta (Aspirantes)", pilots: [4, 5, 6], tag: "⚡ TIER HIGH" },
            { name: "Grupo Gamma (Fuerza & Potencia)", pilots: [7, 8, 9], tag: "⚔️ TIER MID-HIGH" },
            { name: "Grupo Delta (Técnica & Derrapes)", pilots: [10, 11, 12], tag: "🎯 TIER MID" },
            { name: "Grupo Épsilon (Defensa de Posición)", pilots: [13, 14, 15], tag: "🛡️ TIER ENTRY" }
        ],
        challenges: [
            {
                id: "w1-ch1",
                route: "City Perimeter",
                type: "Circuito",
                top3: [
                    { rank: 1, pilot: "Razor", car: "BMW M3 GTR", time: "01:18.450", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 2, pilot: "Bull", car: "Mercedes SLR", time: "01:19.120", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 3, pilot: "Ronnie", car: "Aston Martin DB9", time: "01:19.890", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            },
            {
                id: "w1-ch2",
                route: "Heritage Heights",
                type: "Sprint",
                top3: [
                    { rank: 2, pilot: "Bull", car: "Mercedes SLR", time: "02:04.310", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 1, pilot: "Razor", car: "BMW M3 GTR", time: "02:04.880", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 4, pilot: "JV", car: "Dodge Viper", time: "02:05.420", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            },
            {
                id: "w1-ch3",
                route: "Bay Bridge Drag",
                type: "Drag",
                top3: [
                    { rank: 4, pilot: "JV", car: "Dodge Viper", time: "00:23.110", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 8, pilot: "Jewels", car: "Ford Mustang GT", time: "00:23.450", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 1, pilot: "Razor", car: "BMW M3 GTR", time: "00:23.680", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            },
            {
                id: "w1-ch4",
                route: "Camden & Industrial",
                type: "Circuito",
                top3: [
                    { rank: 3, pilot: "Ronnie", car: "Aston Martin DB9", time: "01:42.200", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 5, pilot: "Webster", car: "Corvette C6", time: "01:42.750", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 9, pilot: "Earl", car: "Lancer Evo VIII", time: "01:43.150", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            }
        ]
    },
    2: {
        weekNumber: 2,
        title: "Semana 2: Rotación de Tríos & Duelos de Velocidad (10 - 16 Oct)",
        dates: "10 Oct 2026 - 16 Oct 2026",
        groups: [
            { name: "Grupo Alpha (Rotación 1)", pilots: [1, 4, 7], tag: "🔥 TIER 1 ROTATION" },
            { name: "Grupo Beta (Rotación 2)", pilots: [2, 5, 8], tag: "⚡ TIER 2 ROTATION" },
            { name: "Grupo Gamma (Rotación 3)", pilots: [3, 6, 9], tag: "⚔️ TIER 3 ROTATION" },
            { name: "Grupo Delta (Rotación 4)", pilots: [10, 13, 14], tag: "🎯 TIER 4 ROTATION" },
            { name: "Grupo Épsilon (Rotación 5)", pilots: [11, 12, 15], tag: "🛡️ TIER 5 ROTATION" }
        ],
        challenges: [
            {
                id: "w2-ch1",
                route: "Haston & Valley",
                type: "Sprint",
                top3: [
                    { rank: 1, pilot: "Razor", car: "BMW M3 GTR", time: "01:45.300", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 2, pilot: "Bull", car: "Mercedes SLR", time: "01:45.900", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 5, pilot: "Webster", car: "Corvette C6", time: "01:46.400", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            },
            {
                id: "w2-ch2",
                route: "Rosewood & Heritage",
                type: "Circuito",
                top3: [
                    { rank: 3, pilot: "Ronnie", car: "Aston Martin DB9", time: "01:29.800", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 1, pilot: "Razor", car: "BMW M3 GTR", time: "01:30.150", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 6, pilot: "Ming", car: "Lamborghini Gallardo", time: "01:30.700", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            },
            {
                id: "w2-ch3",
                route: "Highway 99 Drag",
                type: "Drag",
                top3: [
                    { rank: 4, pilot: "JV", car: "Dodge Viper", time: "00:20.950", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 8, pilot: "Jewels", car: "Ford Mustang GT", time: "00:21.200", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 2, pilot: "Bull", car: "Mercedes SLR", time: "00:21.500", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            },
            {
                id: "w2-ch4",
                route: "Petersburg Dam",
                type: "Sprint",
                top3: [
                    { rank: 5, pilot: "Webster", car: "Corvette C6", time: "02:15.100", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 7, pilot: "Kaze", car: "Mercedes CLK 500", time: "02:15.650", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 3, pilot: "Ronnie", car: "Aston Martin DB9", time: "02:16.100", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            }
        ]
    },
    3: {
        weekNumber: 3,
        title: "Semana 3: Cruce de Grupos & Ascenso (17 - 23 Oct)",
        dates: "17 Oct 2026 - 23 Oct 2026",
        groups: [
            { name: "Grupo Alpha (Cruce 1)", pilots: [1, 5, 9], tag: "🔥 TIER CROSS 1" },
            { name: "Grupo Beta (Cruce 2)", pilots: [2, 6, 10], tag: "⚡ TIER CROSS 2" },
            { name: "Grupo Gamma (Cruce 3)", pilots: [3, 7, 11], tag: "⚔️ TIER CROSS 3" },
            { name: "Grupo Delta (Cruce 4)", pilots: [4, 8, 12], tag: "🎯 TIER CROSS 4" },
            { name: "Grupo Épsilon (Cruce 5)", pilots: [13, 14, 15], tag: "🛡️ TIER CROSS 5" }
        ],
        challenges: [
            {
                id: "w3-ch1",
                route: "Coast & Dunwich",
                type: "Circuito",
                top3: [
                    { rank: 1, pilot: "Razor", car: "BMW M3 GTR", time: "01:34.200", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 3, pilot: "Ronnie", car: "Aston Martin DB9", time: "01:34.700", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 7, pilot: "Kaze", car: "Mercedes CLK 500", time: "01:35.200", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            },
            {
                id: "w3-ch2",
                route: "Grey Point Sprint",
                type: "Sprint",
                top3: [
                    { rank: 2, pilot: "Bull", car: "Mercedes SLR", time: "01:52.400", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 5, pilot: "Webster", car: "Corvette C6", time: "01:52.900", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 10, pilot: "Baron", car: "Porsche Cayman S", time: "01:53.400", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            },
            {
                id: "w3-ch3",
                route: "Waterfront Drag",
                type: "Drag",
                top3: [
                    { rank: 4, pilot: "JV", car: "Dodge Viper", time: "00:21.600", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 1, pilot: "Razor", car: "BMW M3 GTR", time: "00:21.850", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 8, pilot: "Jewels", car: "Ford Mustang GT", time: "00:22.100", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            },
            {
                id: "w3-ch4",
                route: "Campus Way",
                type: "Circuito",
                top3: [
                    { rank: 6, pilot: "Ming", car: "Lamborghini Gallardo", time: "01:28.900", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 2, pilot: "Bull", car: "Mercedes SLR", time: "01:29.350", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 12, pilot: "Izzy", car: "Mazda RX-8", time: "01:29.900", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            }
        ]
    },
    4: {
        weekNumber: 4,
        title: "Semana 4: Gran Final del Campeonato (24 - 31 Oct)",
        dates: "24 Oct 2026 - 31 Oct 2026",
        groups: [
            { name: "Grupo Alpha (Duelo de Corona)", pilots: [1, 2, 3], tag: "👑 TITAN FINAL" },
            { name: "Grupo Beta (Batalla de Honor)", pilots: [4, 5, 6], tag: "⚔️ ELITE FINAL" },
            { name: "Grupo Gamma (Puestos Top 10)", pilots: [7, 8, 9], tag: "🔥 MID FINAL" },
            { name: "Grupo Delta (Zona de Puntos)", pilots: [10, 11, 12], tag: "🎯 RACER FINAL" },
            { name: "Grupo Épsilon (Supervivencia)", pilots: [13, 14, 15], tag: "🛡️ GATE FINAL" }
        ],
        challenges: [
            {
                id: "w4-ch1",
                route: "Master Track: City Perimeter Reverse",
                type: "Circuito",
                top3: [
                    { rank: 1, pilot: "Razor", car: "BMW M3 GTR", time: "01:17.900", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 2, pilot: "Bull", car: "Mercedes SLR", time: "01:18.250", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 3, pilot: "Ronnie", car: "Aston Martin DB9", time: "01:18.800", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            },
            {
                id: "w4-ch2",
                route: "Grand Camden Sprint",
                type: "Sprint",
                top3: [
                    { rank: 2, pilot: "Bull", car: "Mercedes SLR", time: "02:01.800", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 1, pilot: "Razor", car: "BMW M3 GTR", time: "02:02.200", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 4, pilot: "JV", car: "Dodge Viper", time: "02:02.750", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            },
            {
                id: "w4-ch3",
                route: "Ultimate Drag Arena",
                type: "Drag",
                top3: [
                    { rank: 4, pilot: "JV", car: "Dodge Viper", time: "00:19.850", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 8, pilot: "Jewels", car: "Ford Mustang GT", time: "00:20.100", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 1, pilot: "Razor", car: "BMW M3 GTR", time: "00:20.350", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            },
            {
                id: "w4-ch4",
                route: "Rockport Grand Prix (Finale)",
                type: "Circuito",
                top3: [
                    { rank: 1, pilot: "Razor", car: "BMW M3 GTR", time: "01:33.400", bonus: 100, badge: "🥇 +100 PTS" },
                    { rank: 2, pilot: "Bull", car: "Mercedes SLR", time: "01:33.900", bonus: 50, badge: "🥈 +50 PTS" },
                    { rank: 3, pilot: "Ronnie", car: "Aston Martin DB9", time: "01:34.350", bonus: 20, badge: "🥉 +20 PTS" }
                ]
            }
        ]
    }
};
