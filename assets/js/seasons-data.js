/**
 * SEASONS_DATA - Need for Speed: Most Wanted (2005)
 * Definición Oficial de Temporadas de Desafíos Semanales Blacklist:
 * - Temporada 1: Noviembre 2026 (4 Semanas)
 * - Temporada 2: Diciembre 2026 (4 Semanas)
 *
 * Cada semana contiene exactamente 4 pistas oficiales:
 * 1. Circuito (Junkman - Cualquier Auto)
 * 2. Circuito (BMW M3 GTR)
 * 3. Sprint (Junkman - Cualquier Auto)
 * 4. Sprint (BMW M3 GTR)
 */

const SEASONS_DATA = {
    season_1: {
        id: "season_1",
        name: "Blacklist Temporada 1",
        period: "Noviembre 2026",
        subtitle: "Apertura Oficial • 4 Semanas de Gloria en Rockport City",
        badge: "TEMPORADA 1 // NOV 2026",
        status: "active", // active | upcoming | finished
        weeks: [
            {
                weekNum: 1,
                title: "Semana 1: Asalto Urbano",
                dateRange: "01 Nov - 07 Nov 2026",
                challenges: [
                    {
                        id: "s1-w1-c1",
                        track: "City Perimeter",
                        type: "Circuito",
                        category: "Junkman",
                        lapType: "Single Lap",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "01:18.500",
                        reward: {
                            pts: 300,
                            bounty: "$500.000",
                            badge: "Medalla de Oro S1-W1",
                            desc: "300 PTS Blacklist • $500.000 Bounty • Medalla de Oro"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s1-w1-c2",
                        track: "Petersburgs",
                        type: "Circuito",
                        category: "BMW M3 GTR",
                        lapType: "Single Lap",
                        car: "BMW M3 GTR",
                        targetTime: "01:21.000",
                        reward: {
                            pts: 300,
                            bounty: "$500.000",
                            badge: "Trofeo M3 GTR S1-W1",
                            desc: "300 PTS Blacklist • $500.000 Bounty • Trofeo M3 GTR"
                        },
                        icon: "👑",
                        thumb: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s1-w1-c3",
                        track: "Seaside & Power Station",
                        type: "Sprint",
                        category: "Junkman",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "01:14.450",
                        reward: {
                            pts: 300,
                            bounty: "$500.000",
                            badge: "Medalla Sprint S1-W1",
                            desc: "300 PTS Blacklist • $500.000 Bounty • Medalla Sprint"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s1-w1-c4",
                        track: "Rosewood & State",
                        type: "Sprint",
                        category: "BMW M3 GTR",
                        car: "BMW M3 GTR",
                        targetTime: "01:42.000",
                        reward: {
                            pts: 300,
                            bounty: "$500.000",
                            badge: "Emblema Rockport S1-W1",
                            desc: "300 PTS Blacklist • $500.000 Bounty • Emblema Rockport"
                        },
                        icon: "🏁",
                        thumb: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80"
                    }
                ]
            },
            {
                weekNum: 2,
                title: "Semana 2: Curvas de Camden",
                dateRange: "08 Nov - 14 Nov 2026",
                challenges: [
                    {
                        id: "s1-w2-c1",
                        track: "Ironwood States",
                        type: "Circuito",
                        category: "Junkman",
                        lapType: "Single Lap",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "01:12.800",
                        reward: {
                            pts: 350,
                            bounty: "$600.000",
                            badge: "Medalla de Oro S1-W2",
                            desc: "350 PTS Blacklist • $600.000 Bounty • Medalla de Oro"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s1-w2-c2",
                        track: "Hastings",
                        type: "Circuito",
                        category: "BMW M3 GTR",
                        lapType: "Single Lap",
                        car: "BMW M3 GTR",
                        targetTime: "01:34.200",
                        reward: {
                            pts: 350,
                            bounty: "$600.000",
                            badge: "Trofeo M3 GTR S1-W2",
                            desc: "350 PTS Blacklist • $600.000 Bounty • Trofeo M3 GTR"
                        },
                        icon: "👑",
                        thumb: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s1-w2-c3",
                        track: "NFS World Loop",
                        type: "Sprint",
                        category: "Junkman",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "04:53.360",
                        reward: {
                            pts: 350,
                            bounty: "$600.000",
                            badge: "Medalla Sprint S1-W2",
                            desc: "350 PTS Blacklist • $600.000 Bounty • Medalla Sprint"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s1-w2-c4",
                        track: "Diamond Park",
                        type: "Sprint",
                        category: "BMW M3 GTR",
                        car: "BMW M3 GTR",
                        targetTime: "02:08.500",
                        reward: {
                            pts: 350,
                            bounty: "$600.000",
                            badge: "Emblema Rockport S1-W2",
                            desc: "350 PTS Blacklist • $600.000 Bounty • Emblema Rockport"
                        },
                        icon: "🏁",
                        thumb: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80"
                    }
                ]
            },
            {
                weekNum: 3,
                title: "Semana 3: Alta Velocidad en Autovía",
                dateRange: "15 Nov - 21 Nov 2026",
                challenges: [
                    {
                        id: "s1-w3-c1",
                        track: "Camden Tunnel",
                        type: "Circuito",
                        category: "Junkman",
                        lapType: "Single Lap",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "01:05.900",
                        reward: {
                            pts: 400,
                            bounty: "$750.000",
                            badge: "Medalla de Oro S1-W3",
                            desc: "400 PTS Blacklist • $750.000 Bounty • Medalla de Oro"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s1-w3-c2",
                        track: "Highlands",
                        type: "Circuito",
                        category: "BMW M3 GTR",
                        lapType: "Single Lap",
                        car: "BMW M3 GTR",
                        targetTime: "01:28.400",
                        reward: {
                            pts: 400,
                            bounty: "$750.000",
                            badge: "Trofeo M3 GTR S1-W3",
                            desc: "400 PTS Blacklist • $750.000 Bounty • Trofeo M3 GTR"
                        },
                        icon: "👑",
                        thumb: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s1-w3-c3",
                        track: "Forest Green",
                        type: "Sprint",
                        category: "Junkman",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "02:40.000",
                        reward: {
                            pts: 400,
                            bounty: "$750.000",
                            badge: "Medalla Sprint S1-W3",
                            desc: "400 PTS Blacklist • $750.000 Bounty • Medalla Sprint"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s1-w3-c4",
                        track: "Bristol & Bayshore",
                        type: "Sprint",
                        category: "BMW M3 GTR",
                        car: "BMW M3 GTR",
                        targetTime: "02:15.000",
                        reward: {
                            pts: 400,
                            bounty: "$750.000",
                            badge: "Emblema Rockport S1-W3",
                            desc: "400 PTS Blacklist • $750.000 Bounty • Emblema Rockport"
                        },
                        icon: "🏁",
                        thumb: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80"
                    }
                ]
            },
            {
                weekNum: 4,
                title: "Semana 4: Gran Final de Temporada 1",
                dateRange: "22 Nov - 28 Nov 2026",
                challenges: [
                    {
                        id: "s1-w4-c1",
                        track: "Waterfront",
                        type: "Circuito",
                        category: "Junkman",
                        lapType: "Single Lap",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "01:19.500",
                        reward: {
                            pts: 500,
                            bounty: "$1.000.000",
                            badge: "Corona Blacklist T1",
                            desc: "500 PTS Blacklist • $1.000.000 Bounty • Corona Blacklist"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s1-w4-c2",
                        track: "Country Club",
                        type: "Circuito",
                        category: "BMW M3 GTR",
                        lapType: "Single Lap",
                        car: "BMW M3 GTR",
                        targetTime: "01:26.300",
                        reward: {
                            pts: 500,
                            bounty: "$1.000.000",
                            badge: "Corona M3 GTR T1",
                            desc: "500 PTS Blacklist • $1.000.000 Bounty • Corona M3 GTR"
                        },
                        icon: "👑",
                        thumb: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s1-w4-c3",
                        track: "North Bay & Harbor",
                        type: "Sprint",
                        category: "Junkman",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "02:30.000",
                        reward: {
                            pts: 500,
                            bounty: "$1.000.000",
                            badge: "Gran Premio Sprint T1",
                            desc: "500 PTS Blacklist • $1.000.000 Bounty • Gran Premio Sprint"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s1-w4-c4",
                        track: "Bay Bridge & Seaside",
                        type: "Sprint",
                        category: "BMW M3 GTR",
                        car: "BMW M3 GTR",
                        targetTime: "02:22.000",
                        reward: {
                            pts: 500,
                            bounty: "$1.000.000",
                            badge: "Trofeo Supremo T1",
                            desc: "500 PTS Blacklist • $1.000.000 Bounty • Trofeo Supremo"
                        },
                        icon: "🏁",
                        thumb: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80"
                    }
                ]
            }
        ]
    },

    season_2: {
        id: "season_2",
        name: "Blacklist Temporada 2",
        period: "Diciembre 2026",
        subtitle: "Duelo Invernal • 4 Semanas hacia la Cima de Rockport City",
        badge: "TEMPORADA 2 // DIC 2026",
        status: "upcoming",
        weeks: [
            {
                weekNum: 1,
                title: "Semana 1: La Nieve de Rockport",
                dateRange: "01 Dic - 07 Dic 2026",
                challenges: [
                    {
                        id: "s2-w1-c1",
                        track: "Switchback",
                        type: "Circuito",
                        category: "Junkman",
                        lapType: "Single Lap",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "01:25.000",
                        reward: {
                            pts: 300,
                            bounty: "$500.000",
                            badge: "Medalla Invernal S2-W1",
                            desc: "300 PTS Blacklist • $500.000 Bounty • Medalla Invernal"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s2-w1-c2",
                        track: "Dunwich Bay",
                        type: "Circuito",
                        category: "BMW M3 GTR",
                        lapType: "Single Lap",
                        car: "BMW M3 GTR",
                        targetTime: "01:27.400",
                        reward: {
                            pts: 300,
                            bounty: "$500.000",
                            badge: "Trofeo M3 GTR S2-W1",
                            desc: "300 PTS Blacklist • $500.000 Bounty • Trofeo M3 GTR"
                        },
                        icon: "👑",
                        thumb: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s2-w1-c3",
                        track: "Hwy 99 & States",
                        type: "Sprint",
                        category: "Junkman",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "02:12.300",
                        reward: {
                            pts: 300,
                            bounty: "$500.000",
                            badge: "Medalla Sprint S2-W1",
                            desc: "300 PTS Blacklist • $500.000 Bounty • Medalla Sprint"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s2-w1-c4",
                        track: "Camden & Dunwich",
                        type: "Sprint",
                        category: "BMW M3 GTR",
                        car: "BMW M3 GTR",
                        targetTime: "02:18.900",
                        reward: {
                            pts: 300,
                            bounty: "$500.000",
                            badge: "Emblema Rockport S2-W1",
                            desc: "300 PTS Blacklist • $500.000 Bounty • Emblema Rockport"
                        },
                        icon: "🏁",
                        thumb: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80"
                    }
                ]
            },
            {
                weekNum: 2,
                title: "Semana 2: Asfalto Helado",
                dateRange: "08 Dic - 14 Dic 2026",
                challenges: [
                    {
                        id: "s2-w2-c1",
                        track: "Diamond",
                        type: "Circuito",
                        category: "Junkman",
                        lapType: "Single Lap",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "01:14.200",
                        reward: {
                            pts: 350,
                            bounty: "$600.000",
                            badge: "Medalla Invernal S2-W2",
                            desc: "350 PTS Blacklist • $600.000 Bounty • Medalla Invernal"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s2-w2-c2",
                        track: "East Park",
                        type: "Circuito",
                        category: "BMW M3 GTR",
                        lapType: "Single Lap",
                        car: "BMW M3 GTR",
                        targetTime: "01:31.000",
                        reward: {
                            pts: 350,
                            bounty: "$600.000",
                            badge: "Trofeo M3 GTR S2-W2",
                            desc: "350 PTS Blacklist • $600.000 Bounty • Trofeo M3 GTR"
                        },
                        icon: "👑",
                        thumb: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s2-w2-c3",
                        track: "Clubhouse & Lennox",
                        type: "Sprint",
                        category: "Junkman",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "02:05.100",
                        reward: {
                            pts: 350,
                            bounty: "$600.000",
                            badge: "Medalla Sprint S2-W2",
                            desc: "350 PTS Blacklist • $600.000 Bounty • Medalla Sprint"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s2-w2-c4",
                        track: "Industrial & Bristol",
                        type: "Sprint",
                        category: "BMW M3 GTR",
                        car: "BMW M3 GTR",
                        targetTime: "02:11.400",
                        reward: {
                            pts: 350,
                            bounty: "$600.000",
                            badge: "Emblema Rockport S2-W2",
                            desc: "350 PTS Blacklist • $600.000 Bounty • Emblema Rockport"
                        },
                        icon: "🏁",
                        thumb: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80"
                    }
                ]
            },
            {
                weekNum: 3,
                title: "Semana 3: Reto de los Distritos",
                dateRange: "15 Dic - 21 Dic 2026",
                challenges: [
                    {
                        id: "s2-w3-c1",
                        track: "Little Italy",
                        type: "Circuito",
                        category: "Junkman",
                        lapType: "Single Lap",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "01:08.700",
                        reward: {
                            pts: 400,
                            bounty: "$750.000",
                            badge: "Medalla Invernal S2-W3",
                            desc: "400 PTS Blacklist • $750.000 Bounty • Medalla Invernal"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s2-w3-c2",
                        track: "Century Square",
                        type: "Circuito",
                        category: "BMW M3 GTR",
                        lapType: "Single Lap",
                        car: "BMW M3 GTR",
                        targetTime: "01:23.900",
                        reward: {
                            pts: 400,
                            bounty: "$750.000",
                            badge: "Trofeo M3 GTR S2-W3",
                            desc: "400 PTS Blacklist • $750.000 Bounty • Trofeo M3 GTR"
                        },
                        icon: "👑",
                        thumb: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s2-w3-c3",
                        track: "Stadium & Hwy 99",
                        type: "Sprint",
                        category: "Junkman",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "02:24.000",
                        reward: {
                            pts: 400,
                            bounty: "$750.000",
                            badge: "Medalla Sprint S2-W3",
                            desc: "400 PTS Blacklist • $750.000 Bounty • Medalla Sprint"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s2-w3-c4",
                        track: "Beacon & Station",
                        type: "Sprint",
                        category: "BMW M3 GTR",
                        car: "BMW M3 GTR",
                        targetTime: "02:19.500",
                        reward: {
                            pts: 400,
                            bounty: "$750.000",
                            badge: "Emblema Rockport S2-W3",
                            desc: "400 PTS Blacklist • $750.000 Bounty • Emblema Rockport"
                        },
                        icon: "🏁",
                        thumb: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80"
                    }
                ]
            },
            {
                weekNum: 4,
                title: "Semana 4: Gran Final Anual Temporada 2",
                dateRange: "22 Dic - 28 Dic 2026",
                challenges: [
                    {
                        id: "s2-w4-c1",
                        track: "Campus Way",
                        type: "Circuito",
                        category: "Junkman",
                        lapType: "Single Lap",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "01:16.800",
                        reward: {
                            pts: 500,
                            bounty: "$1.000.000",
                            badge: "Rango Leyenda T2",
                            desc: "500 PTS Blacklist • $1.000.000 Bounty • Rango Leyenda T2"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s2-w4-c2",
                        track: "Omega",
                        type: "Circuito",
                        category: "BMW M3 GTR",
                        lapType: "Single Lap",
                        car: "BMW M3 GTR",
                        targetTime: "01:22.400",
                        reward: {
                            pts: 500,
                            bounty: "$1.000.000",
                            badge: "Corona M3 GTR T2",
                            desc: "500 PTS Blacklist • $1.000.000 Bounty • Corona M3 GTR T2"
                        },
                        icon: "👑",
                        thumb: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s2-w4-c3",
                        track: "Beach & Chancellor",
                        type: "Sprint",
                        category: "Junkman",
                        car: "Cualquier Auto (Junkman)",
                        targetTime: "02:18.000",
                        reward: {
                            pts: 500,
                            bounty: "$1.000.000",
                            badge: "Campeón Sprint T2",
                            desc: "500 PTS Blacklist • $1.000.000 Bounty • Campeón Sprint"
                        },
                        icon: "⚡",
                        thumb: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                        id: "s2-w4-c4",
                        track: "Valley & State",
                        type: "Sprint",
                        category: "BMW M3 GTR",
                        car: "BMW M3 GTR",
                        targetTime: "02:14.200",
                        reward: {
                            pts: 500,
                            bounty: "$1.000.000",
                            badge: "Blacklist #1 Legend 2026",
                            desc: "500 PTS Blacklist • $1.000.000 Bounty • Blacklist #1 Legend"
                        },
                        icon: "🏁",
                        thumb: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80"
                    }
                ]
            }
        ]
    }
};

if (typeof window !== 'undefined') {
    window.SEASONS_DATA = SEASONS_DATA;
}
