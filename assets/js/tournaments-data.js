/**
 * NFS: Most Wanted (2005) - Salón Histórico de Torneos (NFSRANKSMW)
 * Base de datos oficial de eventos y torneos competitivos anteriores.
 * Datos extraídos y verificados directamente desde Challonge:
 * - 1er Event NFSRANKSMW: https://challonge.com/es/6as1doj5
 * - II Evento NFSRANKSMW: https://challonge.com/es/ev1n0yug
 */

const PAST_TOURNAMENTS_DATA = {
    "ev1n0yug": {
        id: "ev1n0yug",
        title: "II Evento NFSRANKSMW - Junkman Nos",
        shortTitle: "II Evento (Septiembre 2024)",
        edition: "2da Edición Oficial",
        date: "Septiembre de 2024",
        category: "Junkman + Nos",
        format: "Doble Eliminación (Double Elimination)",
        platform: "NFSRANKSMW • Servidor Dedicado",
        hosts: "NFSRANKSMW Staff & Competidores",
        challongeUrl: "https://challonge.com/es/ev1n0yug",
        badge: "SEPT 2024",
        stats: {
            totalPilots: 14,
            totalMatches: 26,
            champion: "Lea4Speed",
            runnerUp: "xLemondx",
            thirdPlace: "Avenger",
            fourthPlace: "AvusRD"
        },
        podium: [
            { place: 1, medal: "🥇", rankName: "CAMPEÓN", name: "Lea4Speed", seed: 5, note: "Invicto en Winners + Gran Final 3-2" },
            { place: 2, medal: "🥈", rankName: "SUBCAMPEÓN", name: "xLemondx", seed: 4, note: "Remontada histórica desde Losers Bracket (6 victorias seguidas)" },
            { place: 3, medal: "🥉", rankName: "3ER LUGAR", name: "Avenger", seed: 3, note: "Finalista de Winners & Losers Final" },
            { place: 4, medal: "🎖️", rankName: "4TO LUGAR", name: "AvusRD", seed: 6, note: "Semifinalista de Losers Bracket" }
        ],
        participants: [
            { seed: 1, name: "Zimanx", finalPos: "Top 5-6" },
            { seed: 2, name: "DarkShido", finalPos: "Top 5-6" },
            { seed: 3, name: "Avenger", finalPos: "🥉 3er Lugar" },
            { seed: 4, name: "xLemondx", finalPos: "🥈 2do Lugar" },
            { seed: 5, name: "Lea4Speed", finalPos: "👑 Campeón (1er Lugar)" },
            { seed: 6, name: "AvusRD", finalPos: "4to Lugar" },
            { seed: 7, name: "xRAP98x", finalPos: "Top 9-12" },
            { seed: 8, name: "SIgy", finalPos: "Top 9-12" },
            { seed: 9, name: "[H2H]*Sentimex", finalPos: "Top 9-12" },
            { seed: 10, name: "NighT", finalPos: "Top 9-12" },
            { seed: 11, name: "SRTxDiego", finalPos: "Top 7-8" },
            { seed: 12, name: "Arkon7e", finalPos: "Top 7-8" },
            { seed: 13, name: "drink toothpaste", finalPos: "Top 13-14" },
            { seed: 14, name: "XR", finalPos: "Top 13-14" }
        ],
        bracketSections: [
            {
                sectionTitle: "🏆 WINNERS BRACKET (CUADRO DE GANADORES)",
                sectionId: "winners",
                rounds: [
                    {
                        roundName: "Ronda 1 (Dieciseisavos / Octavos)",
                        matches: [
                            { id: 1, p1: { seed: 8, name: "SIgy", score: 1, winner: false }, p2: { seed: 9, name: "[H2H]*Sentimex", score: 3, winner: true } },
                            { id: 2, p1: { seed: 4, name: "xLemondx", score: 3, winner: true }, p2: { seed: 13, name: "drink toothpaste", score: 0, winner: false } },
                            { id: 3, p1: { seed: 5, name: "Lea4Speed", score: 3, winner: true }, p2: { seed: 12, name: "Arkon7e", score: 1, winner: false } },
                            { id: 4, p1: { seed: 7, name: "xRAP98x", score: 0, winner: false }, p2: { seed: 10, name: "NighT", score: 3, winner: true } },
                            { id: 5, p1: { seed: 3, name: "Avenger", score: 3, winner: true }, p2: { seed: 14, name: "XR", score: 0, winner: false } },
                            { id: 6, p1: { seed: 6, name: "AvusRD", score: 3, winner: true }, p2: { seed: 11, name: "SRTxDiego", score: 0, winner: false } }
                        ]
                    },
                    {
                        roundName: "Cuartos de Final (Winners Quarters)",
                        matches: [
                            { id: 9, p1: { seed: 1, name: "Zimanx", score: 3, winner: true }, p2: { seed: 9, name: "[H2H]*Sentimex", score: 0, winner: false } },
                            { id: 10, p1: { seed: 4, name: "xLemondx", score: 0, winner: false }, p2: { seed: 5, name: "Lea4Speed", score: 3, winner: true } },
                            { id: 11, p1: { seed: 2, name: "DarkShido", score: 3, winner: true }, p2: { seed: 10, name: "NighT", score: 0, winner: false } },
                            { id: 12, p1: { seed: 3, name: "Avenger", score: 3, winner: true }, p2: { seed: 6, name: "AvusRD", score: 0, winner: false } }
                        ]
                    },
                    {
                        roundName: "Semifinales (Winners Semis)",
                        matches: [
                            { id: 19, p1: { seed: 1, name: "Zimanx", score: 0, winner: false }, p2: { seed: 5, name: "Lea4Speed", score: 3, winner: true } },
                            { id: 20, p1: { seed: 2, name: "DarkShido", score: 0, winner: false }, p2: { seed: 3, name: "Avenger", score: 3, winner: true } }
                        ]
                    },
                    {
                        roundName: "Final de Ganadores (Winners Final)",
                        matches: [
                            { id: 24, p1: { seed: 5, name: "Lea4Speed", score: 3, winner: true }, p2: { seed: 3, name: "Avenger", score: 0, winner: false } }
                        ]
                    }
                ]
            },
            {
                sectionTitle: "🔥 LOSERS BRACKET (CUADRO DE PERDEDORES)",
                sectionId: "losers",
                rounds: [
                    {
                        roundName: "Ronda 1 de Perdedores",
                        matches: [
                            { id: 7, p1: { seed: 13, name: "drink toothpaste", score: 0, winner: false }, p2: { seed: 12, name: "Arkon7e", score: 3, winner: true } },
                            { id: 8, p1: { seed: 14, name: "XR", score: 0, winner: false }, p2: { seed: 11, name: "SRTxDiego", score: 3, winner: true } }
                        ]
                    },
                    {
                        roundName: "Ronda 2 de Perdedores",
                        matches: [
                            { id: 13, p1: { seed: 9, name: "[H2H]*Sentimex", score: 0, winner: false }, p2: { seed: 11, name: "SRTxDiego", score: 3, winner: true } },
                            { id: 14, p1: { seed: 4, name: "xLemondx", score: 3, winner: true }, p2: { seed: 7, name: "xRAP98x", score: 0, winner: false } },
                            { id: 15, p1: { seed: 10, name: "NighT", score: 0, winner: false }, p2: { seed: 12, name: "Arkon7e", score: 3, winner: true } },
                            { id: 16, p1: { seed: 6, name: "AvusRD", score: 3, winner: true }, p2: { seed: 8, name: "SIgy", score: 1, winner: false } }
                        ]
                    },
                    {
                        roundName: "Ronda 3 de Perdedores",
                        matches: [
                            { id: 17, p1: { seed: 4, name: "xLemondx", score: 3, winner: true }, p2: { seed: 11, name: "SRTxDiego", score: 1, winner: false } },
                            { id: 18, p1: { seed: 6, name: "AvusRD", score: 3, winner: true }, p2: { seed: 12, name: "Arkon7e", score: 1, winner: false } }
                        ]
                    },
                    {
                        roundName: "Ronda 4 de Perdedores",
                        matches: [
                            { id: 21, p1: { seed: 1, name: "Zimanx", score: 2, winner: false }, p2: { seed: 6, name: "AvusRD", score: 3, winner: true } },
                            { id: 22, p1: { seed: 2, name: "DarkShido", score: 1, winner: false }, p2: { seed: 4, name: "xLemondx", score: 3, winner: true } }
                        ]
                    },
                    {
                        roundName: "Semifinal de Perdedores (Ronda 5)",
                        matches: [
                            { id: 23, p1: { seed: 6, name: "AvusRD", score: 0, winner: false }, p2: { seed: 4, name: "xLemondx", score: 3, winner: true } }
                        ]
                    },
                    {
                        roundName: "Final de Perdedores (Losers Final)",
                        matches: [
                            { id: 25, p1: { seed: 3, name: "Avenger", score: 2, winner: false }, p2: { seed: 4, name: "xLemondx", score: 3, winner: true } }
                        ]
                    }
                ]
            },
            {
                sectionTitle: "👑 GRAN FINAL DEL TORNEO (CHAMPIONSHIP MATCH)",
                sectionId: "finals",
                rounds: [
                    {
                        roundName: "Gran Final (Match Definitivo)",
                        matches: [
                            { id: 26, p1: { seed: 5, name: "Lea4Speed", score: 3, winner: true, isChampion: true }, p2: { seed: 4, name: "xLemondx", score: 2, winner: false } }
                        ]
                    }
                ]
            }
        ]
    },

    "6as1doj5": {
        id: "6as1doj5",
        title: "1er Event NFSRANKSMW - Junkman Nos",
        shortTitle: "1er Event (Enero 2022)",
        edition: "1ra Edición Histórica",
        date: "08-09 de Enero de 2022",
        category: "Junkman + Nos",
        format: "Doble Eliminación (Double Elimination)",
        platform: "NFSRANKSMW • Servidor Dedicado",
        hosts: "OskarGTR, Zipper, JBRZ, SKYMASTER (GMT -03:00 Chile)",
        challongeUrl: "https://challonge.com/es/6as1doj5",
        badge: "ENE 2022",
        stats: {
            totalPilots: 8,
            totalMatches: 14,
            champion: "Lea4Speed0!!",
            runnerUp: "ZimanX",
            thirdPlace: "xSKYMASTERx",
            fourthPlace: "oskargtr"
        },
        podium: [
            { place: 1, medal: "🥇", rankName: "CAMPEÓN", name: "Lea4Speed0!!", seed: 1, note: "Campeón de la 1ra edición oficial con victoria 3-1 en la Gran Final" },
            { place: 2, medal: "🥈", rankName: "SUBCAMPEÓN", name: "ZimanX", seed: 3, note: "Ganador invicto del Winners Bracket hasta la Gran Final" },
            { place: 3, medal: "🥉", rankName: "3ER LUGAR", name: "xSKYMASTERx", seed: 5, note: "Finalista de Losers Bracket y semifinalista de Winners" },
            { place: 4, medal: "🎖️", rankName: "4TO LUGAR", name: "oskargtr", seed: 4, note: "Semifinalista de Losers Bracket y co-anfitrión del evento" }
        ],
        participants: [
            { seed: 1, name: "Lea4Speed0!!", finalPos: "👑 Campeón (1er Lugar)" },
            { seed: 2, name: "xLeMondx", finalPos: "Top 7-8" },
            { seed: 3, name: "ZimanX", finalPos: "🥈 2do Lugar" },
            { seed: 4, name: "oskargtr", finalPos: "4to Lugar" },
            { seed: 5, name: "xSKYMASTERx", finalPos: "🥉 3er Lugar" },
            { seed: 6, name: "xRAP98x", finalPos: "Top 5-6" },
            { seed: 7, name: "Joako", finalPos: "Top 5-6" },
            { seed: 8, name: "Nebula", finalPos: "Top 7-8" }
        ],
        bracketSections: [
            {
                sectionTitle: "🏆 WINNERS BRACKET (CUADRO DE GANADORES)",
                sectionId: "winners",
                rounds: [
                    {
                        roundName: "Cuartos de Final (Ronda 1)",
                        matches: [
                            { id: 1, p1: { seed: 1, name: "Lea4Speed0!!", score: 3, winner: true }, p2: { seed: 8, name: "Nebula", score: 0, winner: false } },
                            { id: 2, p1: { seed: 4, name: "oskargtr", score: 0, winner: false }, p2: { seed: 5, name: "xSKYMASTERx", score: 3, winner: true } },
                            { id: 3, p1: { seed: 2, name: "xLeMondx", score: 0, winner: false }, p2: { seed: 7, name: "Joako", score: 3, winner: true } },
                            { id: 4, p1: { seed: 3, name: "ZimanX", score: 3, winner: true }, p2: { seed: 6, name: "xRAP98x", score: 0, winner: false } }
                        ]
                    },
                    {
                        roundName: "Semifinales (Ronda 2)",
                        matches: [
                            { id: 7, p1: { seed: 1, name: "Lea4Speed0!!", score: 1, winner: false }, p2: { seed: 5, name: "xSKYMASTERx", score: 3, winner: true } },
                            { id: 8, p1: { seed: 7, name: "Joako", score: 1, winner: false }, p2: { seed: 3, name: "ZimanX", score: 3, winner: true } }
                        ]
                    },
                    {
                        roundName: "Final de Ganadores (Ronda 3)",
                        matches: [
                            { id: 12, p1: { seed: 5, name: "xSKYMASTERx", score: 2, winner: false }, p2: { seed: 3, name: "ZimanX", score: 3, winner: true } }
                        ]
                    }
                ]
            },
            {
                sectionTitle: "🔥 LOSERS BRACKET (CUADRO DE PERDEDORES)",
                sectionId: "losers",
                rounds: [
                    {
                        roundName: "Ronda 1 de Perdedores",
                        matches: [
                            { id: 5, p1: { seed: 8, name: "Nebula", score: 1, winner: false }, p2: { seed: 4, name: "oskargtr", score: 3, winner: true } },
                            { id: 6, p1: { seed: 2, name: "xLeMondx", score: 0, winner: false }, p2: { seed: 6, name: "xRAP98x", score: 3, winner: true } }
                        ]
                    },
                    {
                        roundName: "Ronda 2 de Perdedores",
                        matches: [
                            { id: 9, p1: { seed: 1, name: "Lea4Speed0!!", score: 3, winner: true }, p2: { seed: 6, name: "xRAP98x", score: 0, winner: false } },
                            { id: 10, p1: { seed: 7, name: "Joako", score: 2, winner: false }, p2: { seed: 4, name: "oskargtr", score: 3, winner: true } }
                        ]
                    },
                    {
                        roundName: "Ronda 3 de Perdedores (Semifinal Losers)",
                        matches: [
                            { id: 11, p1: { seed: 4, name: "oskargtr", score: 0, winner: false }, p2: { seed: 1, name: "Lea4Speed0!!", score: 3, winner: true } }
                        ]
                    },
                    {
                        roundName: "Final de Perdedores (Losers Final)",
                        matches: [
                            { id: 13, p1: { seed: 5, name: "xSKYMASTERx", score: 0, winner: false }, p2: { seed: 1, name: "Lea4Speed0!!", score: 3, winner: true } }
                        ]
                    }
                ]
            },
            {
                sectionTitle: "👑 GRAN FINAL DEL TORNEO (CHAMPIONSHIP MATCH)",
                sectionId: "finals",
                rounds: [
                    {
                        roundName: "Gran Final (Match Definitivo)",
                        matches: [
                            { id: 14, p1: { seed: 3, name: "ZimanX", score: 1, winner: false }, p2: { seed: 1, name: "Lea4Speed0!!", score: 3, winner: true, isChampion: true } }
                        ]
                    }
                ]
            }
        ]
    }
};
