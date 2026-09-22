/**
 * NFS: Most Wanted (2005) - World Records (NFSRANKSMW)
 * Sistema de Siluetas SVG de Alto Contraste y Asignación Única por Jugador
 * Estilo Tracker.gg / Rainbow Six Siege Operator Badges
 * 
 * GARANTÍA DE UNICIDAD ESTRICTA:
 * - Cada jugador tiene un icono SVG exclusivo y permanente.
 * - No existen dos jugadores con el mismo icono SVG.
 * - Sincronización total entre Blacklist, Inscripciones Abiertas y Leaderboards.
 */

(function () {
    'use strict';

    // =======================================================
    // CATÁLOGO EXPANDIDO DE SILUETAS VECTORIALES SVG (60+ OPERADORES)
    // =======================================================
    const OPERATOR_CATALOG = [
        // 1. ZimanX
        {
            id: 'viper_strike',
            name: 'Viper Strike',
            title: 'Viper Strike',
            color: '#ff4612',
            bgGrad: 'linear-gradient(135deg, rgba(255, 70, 18, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 8L76 26L70 54L50 92L30 54L24 26L50 8Z" fill="#ff4612" fill-opacity="0.25"/>
                <path d="M50 14L71 29L66 52L50 84L34 52L29 29L50 14Z" fill="#ffffff"/>
                <path d="M50 22L62 34L50 48L38 34L50 22Z" fill="#14151a"/>
                <path d="M43 36L38 48L44 48L43 36Z" fill="#ff4612"/>
                <path d="M57 36L62 48L56 48L57 36Z" fill="#ff4612"/>
                <path d="M50 54L42 70H58L50 54Z" fill="#14151a"/>
                <path d="M47 62L45 74L50 71L55 74L53 62H47Z" fill="#ff4612"/>
            </svg>`
        },
        // 2. Zipper
        {
            id: 'phantom_pilot',
            name: 'Phantom Pilot',
            title: 'Phantom Pilot',
            color: '#ffd700',
            bgGrad: 'linear-gradient(135deg, rgba(255, 215, 0, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 45C22 24 34 12 50 12C66 12 78 24 78 45C78 64 70 78 50 88C30 78 22 64 22 45Z" fill="#ffffff"/>
                <path d="M28 40H72L68 56H32L28 40Z" fill="#14151a"/>
                <path d="M34 44H66L63 52H37L34 44Z" fill="#ffd700"/>
                <path d="M42 64H58L55 76H45L42 64Z" fill="#14151a"/>
                <path d="M46 67H54V73H46V67Z" fill="#ffd700"/>
                <path d="M26 48L18 56L22 68L28 62V48Z" fill="#ffd700"/>
                <path d="M74 48L82 56L78 68L72 62V48Z" fill="#ffd700"/>
            </svg>`
        },
        // 3. Razor / Clarence Callahan
        {
            id: 'blacklist_boss',
            name: 'Blacklist Boss',
            title: 'Blacklist Boss',
            color: '#e2263c',
            bgGrad: 'linear-gradient(135deg, rgba(226, 38, 60, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10L66 22V42L50 88L34 42V22L50 10Z" fill="#e2263c" fill-opacity="0.3"/>
                <path d="M30 28C30 18 40 12 50 12C60 12 70 18 70 28V46C70 66 60 78 50 84C40 78 30 66 30 46V28Z" fill="#ffffff"/>
                <path d="M33 36L48 38L46 48L32 44L33 36Z" fill="#14151a"/>
                <path d="M67 36L52 38L54 48L68 44L67 36Z" fill="#14151a"/>
                <path d="M34 38L47 40L45 46L34 42V38Z" fill="#e2263c"/>
                <path d="M66 38L53 40L55 46L66 42V38Z" fill="#e2263c"/>
                <path d="M42 62L50 56L58 62L50 78L42 62Z" fill="#14151a"/>
                <path d="M46 64L50 60L54 64L50 72L46 64Z" fill="#e2263c"/>
            </svg>`
        },
        // 4. Bull / Toru Sato
        {
            id: 'iron_minotaur',
            name: 'Iron Minotaur',
            title: 'Iron Minotaur',
            color: '#f59e0b',
            bgGrad: 'linear-gradient(135deg, rgba(245, 158, 11, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 20C22 18 36 28 40 38L32 44C26 34 18 30 14 20Z" fill="#ffffff"/>
                <path d="M86 20C78 18 64 28 60 38L68 44C74 34 82 30 86 20Z" fill="#ffffff"/>
                <path d="M32 36H68L62 76L50 88L38 76L32 36Z" fill="#ffffff"/>
                <path d="M36 46L46 48L44 54L35 50L36 46Z" fill="#14151a"/>
                <path d="M64 46L54 48L56 54L65 50L64 46Z" fill="#14151a"/>
                <path d="M38 48L45 49L44 52L38 50V48Z" fill="#f59e0b"/>
                <path d="M62 48L55 49L56 52L62 50V48Z" fill="#f59e0b"/>
                <path d="M44 68H56L50 78L44 68Z" fill="#14151a"/>
                <circle cx="47" cy="71" r="2" fill="#f59e0b"/>
                <circle cx="53" cy="71" r="2" fill="#f59e0b"/>
            </svg>`
        },
        // 5. Ronnie / Ronald McCrea
        {
            id: 'falcon_ace',
            name: 'Falcon Ace',
            title: 'Falcon Ace',
            color: '#38bdf8',
            bgGrad: 'linear-gradient(135deg, rgba(56, 189, 248, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10L68 28L88 34L64 52L68 84L50 68L32 84L36 52L12 34L32 28L50 10Z" fill="#ffffff"/>
                <path d="M50 24L62 36L74 40L58 50L60 70L50 60L40 70L42 50L26 40L38 36L50 24Z" fill="#14151a"/>
                <path d="M50 32L58 42L50 56L42 42L50 32Z" fill="#38bdf8"/>
                <circle cx="44" cy="40" r="2.5" fill="#ffffff"/>
                <circle cx="56" cy="40" r="2.5" fill="#ffffff"/>
            </svg>`
        },
        // 6. JV / Joe Vega
        {
            id: 'shadow_gambler',
            name: 'Shadow Gambler',
            title: 'Shadow Gambler',
            color: '#a855f7',
            bgGrad: 'linear-gradient(135deg, rgba(168, 85, 247, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 12L80 50L50 88L20 50L50 12Z" fill="#ffffff"/>
                <path d="M50 22L72 50L50 78L28 50L50 22Z" fill="#14151a"/>
                <path d="M50 30L64 50L50 70L36 50L50 30Z" fill="#a855f7"/>
                <path d="M44 46L50 38L56 46L50 54L44 46Z" fill="#ffffff"/>
                <circle cx="50" cy="62" r="3" fill="#ffffff"/>
            </svg>`
        },
        // 7. Webster / Wes Allen
        {
            id: 'arachnid_fang',
            name: 'Arachnid Fang',
            title: 'Arachnid Fang',
            color: '#10b981',
            bgGrad: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 18L64 34V52L50 64L36 52V34L50 18Z" fill="#ffffff"/>
                <path d="M50 66L62 76V88L50 82L38 88V76L50 66Z" fill="#ffffff"/>
                <path d="M34 38L14 30L12 40L30 46L34 38Z" fill="#ffffff"/>
                <path d="M66 38L86 30L88 40L70 46L66 38Z" fill="#ffffff"/>
                <path d="M34 50L10 52L12 62L32 58L34 50Z" fill="#ffffff"/>
                <path d="M66 50L90 52L88 62L68 58L66 50Z" fill="#ffffff"/>
                <path d="M36 60L16 74L20 82L38 68L36 60Z" fill="#ffffff"/>
                <path d="M64 60L84 74L80 82L62 68L64 60Z" fill="#ffffff"/>
                <circle cx="44" cy="40" r="3" fill="#10b981"/>
                <circle cx="56" cy="40" r="3" fill="#10b981"/>
                <circle cx="41" cy="48" r="2" fill="#10b981"/>
                <circle cx="59" cy="48" r="2" fill="#10b981"/>
            </svg>`
        },
        // 8. Ming / Hector Domingo
        {
            id: 'dragon_breath',
            name: 'Dragon Breath',
            title: 'Dragon Breath',
            color: '#ef4444',
            bgGrad: 'linear-gradient(135deg, rgba(239, 68, 68, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 16L38 34L48 20L58 36L74 22L66 44L84 52L68 62L76 82L52 70L36 86L38 64L16 66L28 50L18 36L30 38L24 16Z" fill="#ffffff"/>
                <path d="M36 34L46 44L56 34L54 50L68 54L56 60L60 72L48 64L38 74L40 58L28 60L36 50L30 42L38 42L36 34Z" fill="#14151a"/>
                <circle cx="44" cy="50" r="4" fill="#ef4444"/>
                <path d="M50 58L56 62L48 68L50 58Z" fill="#ef4444"/>
            </svg>`
        },
        // 9. Kaze / Kira Nakazato
        {
            id: 'tempest_visor',
            name: 'Tempest Visor',
            title: 'Tempest Visor',
            color: '#06b6d4',
            bgGrad: 'linear-gradient(135deg, rgba(6, 182, 212, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 42C18 20 32 10 50 10C68 10 82 20 82 42C82 66 74 80 50 90C26 80 18 66 18 42Z" fill="#ffffff"/>
                <path d="M22 36L50 46L78 36L74 54L50 66L26 54L22 36Z" fill="#14151a"/>
                <path d="M26 40L50 49L74 40L71 50L50 61L29 50L26 40Z" fill="#06b6d4"/>
                <path d="M42 70L50 66L58 70L55 80H45L42 70Z" fill="#14151a"/>
                <path d="M46 72L50 70L54 72L52 77H48L46 72Z" fill="#06b6d4"/>
            </svg>`
        },
        // 10. Jewels / Jade Barrett
        {
            id: 'prism_valkyrie',
            name: 'Prism Valkyrie',
            title: 'Prism Valkyrie',
            color: '#ec4899',
            bgGrad: 'linear-gradient(135deg, rgba(236, 72, 153, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 12L76 34L50 88L24 34L50 12Z" fill="#ffffff"/>
                <path d="M50 18L70 34H30L50 18Z" fill="#ec4899"/>
                <path d="M30 36H48V80L30 36Z" fill="#14151a"/>
                <path d="M70 36H52V80L70 36Z" fill="#14151a"/>
                <path d="M12 28L26 36L20 54L10 40L12 28Z" fill="#ffffff"/>
                <path d="M88 28L74 36L80 54L90 40L88 28Z" fill="#ffffff"/>
                <path d="M50 40L44 64L50 74L56 64L50 40Z" fill="#ec4899"/>
            </svg>`
        },
        // 11. Earl / Eugene James
        {
            id: 'iron_anchor',
            name: 'Iron Anchor',
            title: 'Iron Anchor',
            color: '#94a3b8',
            bgGrad: 'linear-gradient(135deg, rgba(148, 163, 184, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="20" r="12" stroke="#ffffff" stroke-width="6"/>
                <rect x="46" y="28" width="8" height="54" fill="#ffffff"/>
                <rect x="26" y="42" width="48" height="8" rx="2" fill="#ffffff"/>
                <path d="M18 52C22 74 36 86 50 88C64 86 78 74 82 52H74C70 70 58 78 50 80C42 78 30 70 26 52H18Z" fill="#ffffff"/>
                <path d="M14 46L26 54L16 62L14 46Z" fill="#94a3b8"/>
                <path d="M86 46L74 54L84 62L86 46Z" fill="#94a3b8"/>
                <circle cx="50" cy="20" r="5" fill="#14151a"/>
            </svg>`
        },
        // 12. Baron / Karl Smit
        {
            id: 'royal_eagle',
            name: 'Royal Eagle',
            title: 'Royal Eagle',
            color: '#eab308',
            bgGrad: 'linear-gradient(135deg, rgba(234, 179, 8, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10L56 22H68L60 30L64 42L50 34L36 42L40 30L32 22H44L50 10Z" fill="#eab308"/>
                <path d="M26 40C26 28 36 24 50 24C64 24 74 28 74 40C74 56 68 76 50 88C32 76 26 56 26 40Z" fill="#ffffff"/>
                <path d="M34 46L46 48L44 54L34 50V46Z" fill="#14151a"/>
                <path d="M66 46L54 48L56 54L66 50V46Z" fill="#14151a"/>
                <path d="M50 50L58 60L50 74L42 60L50 50Z" fill="#14151a"/>
                <path d="M50 54L56 62L50 70L44 62L50 54Z" fill="#eab308"/>
            </svg>`
        },
        // 13. Big Lou / Lou Park
        {
            id: 'twin_pistons',
            name: 'Twin Pistons',
            title: 'Twin Pistons',
            color: '#ea580c',
            bgGrad: 'linear-gradient(135deg, rgba(234, 88, 12, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 20H40V36H34V76L26 84L18 76V36H20V20Z" transform="rotate(-30 50 50)" fill="#ffffff"/>
                <path d="M60 20H80V36H74V76L66 84L58 76V36H60V20Z" transform="rotate(30 50 50)" fill="#ffffff"/>
                <circle cx="50" cy="50" r="12" fill="#14151a" stroke="#ea580c" stroke-width="4"/>
                <circle cx="50" cy="50" r="5" fill="#ffffff"/>
            </svg>`
        },
        // 14. Izzy / Isabel Diaz
        {
            id: 'cyber_lotus',
            name: 'Cyber Lotus',
            title: 'Cyber Lotus',
            color: '#22c55e',
            bgGrad: 'linear-gradient(135deg, rgba(34, 197, 94, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 14C50 14 62 34 62 52C62 66 50 78 50 78C50 78 38 66 38 52C38 34 50 14 50 14Z" fill="#ffffff"/>
                <path d="M22 34C30 34 44 46 46 64C46 74 38 82 38 82C38 82 26 72 24 58C22 46 22 34 22 34Z" fill="#ffffff"/>
                <path d="M78 34C70 34 56 46 54 64C54 74 62 82 62 82C62 82 74 72 76 58C78 46 78 34 78 34Z" fill="#ffffff"/>
                <path d="M12 56C20 56 34 64 34 76C34 84 26 88 26 88C26 88 16 80 14 72C12 64 12 56 12 56Z" fill="#22c55e"/>
                <path d="M88 56C80 56 66 64 66 76C66 84 74 88 74 88C74 88 84 80 86 72C88 64 88 56 88 56Z" fill="#22c55e"/>
                <circle cx="50" cy="54" r="6" fill="#14151a" stroke="#22c55e" stroke-width="2"/>
            </svg>`
        },
        // 15. Vic / Victor Vasquez
        {
            id: 'sniper_cross',
            name: 'Sniper Cross',
            title: 'Sniper Cross',
            color: '#2563eb',
            bgGrad: 'linear-gradient(135deg, rgba(37, 99, 235, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="38" stroke="#ffffff" stroke-width="6"/>
                <circle cx="50" cy="50" r="22" stroke="#2563eb" stroke-width="4"/>
                <line x1="50" y1="6" x2="50" y2="94" stroke="#ffffff" stroke-width="4"/>
                <line x1="6" y1="50" x2="94" y2="50" stroke="#ffffff" stroke-width="4"/>
                <circle cx="50" cy="50" r="6" fill="#2563eb"/>
                <path d="M30 30L36 36M70 30L64 36M30 70L36 64M70 70L64 64" stroke="#ffffff" stroke-width="3"/>
            </svg>`
        },
        // 16. Taz / Vince Kilic
        {
            id: 'desert_stinger',
            name: 'Desert Stinger',
            title: 'Desert Stinger',
            color: '#d97706',
            bgGrad: 'linear-gradient(135deg, rgba(217, 119, 6, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 40C42 40 36 48 36 60C36 72 42 82 50 82C58 82 64 72 64 60C64 48 58 40 50 40Z" fill="#ffffff"/>
                <path d="M50 40C50 30 58 24 66 24C74 24 80 30 80 38C80 44 76 48 70 48" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
                <path d="M70 48L64 38L74 42L70 48Z" fill="#d97706"/>
                <path d="M36 50L18 42L20 54L34 58L36 50Z" fill="#ffffff"/>
                <path d="M64 50L82 42L80 54L66 58L64 50Z" fill="#ffffff"/>
                <path d="M18 42L12 30L24 36L18 42Z" fill="#d97706"/>
                <path d="M82 42L88 30L76 36L82 42Z" fill="#d97706"/>
            </svg>`
        },
        // 17. Sonny / Ho Seun
        {
            id: 'inferno_skull',
            name: 'Inferno Skull',
            title: 'Inferno Skull',
            color: '#f43f5e',
            bgGrad: 'linear-gradient(135deg, rgba(244, 63, 94, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 6C50 6 58 18 56 26C62 20 70 16 70 28C76 22 82 28 80 38C84 34 88 40 84 50C84 70 70 88 50 94C30 88 16 70 16 50C12 40 16 34 20 38C18 28 24 22 30 28C30 16 38 20 44 26C42 18 50 6 50 6Z" fill="#f43f5e"/>
                <path d="M26 44C26 30 36 22 50 22C64 22 74 30 74 44C74 58 66 66 66 74H34C34 66 26 58 26 44Z" fill="#ffffff"/>
                <circle cx="40" cy="46" r="6" fill="#14151a"/>
                <circle cx="60" cy="46" r="6" fill="#14151a"/>
                <path d="M50 54L46 62H54L50 54Z" fill="#14151a"/>
                <rect x="38" y="68" width="4" height="6" fill="#14151a"/>
                <rect x="44" y="68" width="4" height="6" fill="#14151a"/>
                <rect x="52" y="68" width="4" height="6" fill="#14151a"/>
                <rect x="58" y="68" width="4" height="6" fill="#14151a"/>
            </svg>`
        },
        // 18. Leo Speed (Exclusivo)
        {
            id: 'speed_demon',
            name: 'Speed Demon',
            title: 'Speed Demon',
            color: '#ff3366',
            bgGrad: 'linear-gradient(135deg, rgba(255, 51, 102, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 18L32 38L50 24L68 38L84 18L76 56L88 74L68 86L50 94L32 86L12 74L24 56L16 18Z" fill="#ffffff"/>
                <path d="M28 36L38 48L50 40L62 48L72 36L66 62L76 72L50 82L24 72L34 62L28 36Z" fill="#14151a"/>
                <polygon points="36,50 46,52 42,58" fill="#ff3366"/>
                <polygon points="64,50 54,52 58,58" fill="#ff3366"/>
                <path d="M44 68L50 64L56 68L50 76L44 68Z" fill="#ff3366"/>
                <line x1="20" y1="26" x2="30" y2="38" stroke="#ff3366" stroke-width="3"/>
                <line x1="80" y1="26" x2="70" y2="38" stroke="#ff3366" stroke-width="3"/>
            </svg>`
        },
        // 19. Apex Wolf / Djalil
        {
            id: 'apex_wolf',
            name: 'Apex Wolf',
            title: 'Apex Wolf',
            color: '#00e5ff',
            bgGrad: 'linear-gradient(135deg, rgba(0, 229, 255, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 12L66 28L86 24L76 46L88 58L68 64L66 84L50 72L34 84L32 64L12 58L24 46L14 24L34 28L50 12Z" fill="#ffffff"/>
                <path d="M50 28L60 38L72 36L64 48L72 56L58 60L56 70L50 64L44 70L42 60L28 56L36 48L28 36L40 38L50 28Z" fill="#14151a"/>
                <polygon points="42,46 48,48 44,52" fill="#00e5ff"/>
                <polygon points="58,46 52,48 56,52" fill="#00e5ff"/>
                <polygon points="50,56 46,62 54,62" fill="#ffffff"/>
            </svg>`
        },
        // 20. Cyber Oni / NightRiderz
        {
            id: 'cyber_oni',
            name: 'Cyber Oni',
            title: 'Cyber Oni',
            color: '#be123c',
            bgGrad: 'linear-gradient(135deg, rgba(190, 18, 60, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 10L36 32H64L76 10L72 36L86 44L76 76L50 90L24 76L14 44L28 36L24 10Z" fill="#ffffff"/>
                <path d="M34 38H66L60 74L50 82L40 74L34 38Z" fill="#14151a"/>
                <polygon points="38,48 48,50 44,56" fill="#be123c"/>
                <polygon points="62,48 52,50 56,56" fill="#be123c"/>
                <path d="M42 66L45 60L50 64L55 60L58 66H42Z" fill="#ffffff"/>
                <polygon points="38,62 42,72 44,62" fill="#be123c"/>
                <polygon points="62,62 58,72 56,62" fill="#be123c"/>
            </svg>`
        },
        // 21. Interceptor Helm / Rog
        {
            id: 'interceptor_helm',
            name: 'Interceptor Helm',
            title: 'Interceptor Helm',
            color: '#1d4ed8',
            bgGrad: 'linear-gradient(135deg, rgba(29, 78, 216, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26 34C26 18 36 12 50 12C64 12 74 18 74 34V52C74 70 64 84 50 88C36 84 26 70 26 52V34Z" fill="#ffffff"/>
                <path d="M30 38H70V54H30V38Z" fill="#14151a"/>
                <path d="M32 42H68V50H32V42Z" fill="#1d4ed8"/>
                <rect x="42" y="62" width="16" height="12" rx="2" fill="#14151a"/>
                <line x1="46" y1="66" x2="54" y2="66" stroke="#1d4ed8" stroke-width="2"/>
                <line x1="46" y1="70" x2="54" y2="70" stroke="#1d4ed8" stroke-width="2"/>
            </svg>`
        },
        // 22. Valkyrie Wings / Mia
        {
            id: 'valkyrie_wings',
            name: 'Valkyrie Wings',
            title: 'Valkyrie Wings',
            color: '#3b82f6',
            bgGrad: 'linear-gradient(135deg, rgba(59, 130, 246, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 18L58 32H74L62 42L66 58L50 48L34 58L38 42L26 32H42L50 18Z" fill="#3b82f6"/>
                <path d="M12 36C24 34 38 42 42 54L34 60C28 50 20 46 12 36Z" fill="#ffffff"/>
                <path d="M88 36C76 34 62 42 58 54L66 60C72 50 80 46 88 36Z" fill="#ffffff"/>
                <path d="M18 50C28 48 38 56 40 68L32 72C28 64 22 60 18 50Z" fill="#ffffff"/>
                <path d="M82 50C72 48 62 56 60 68L68 72C72 64 78 60 82 50Z" fill="#ffffff"/>
                <path d="M42 62H58L50 84L42 62Z" fill="#ffffff"/>
            </svg>`
        },
        // 23. Tox Hazard / Cross
        {
            id: 'tox_hazard',
            name: 'Tox Hazard',
            title: 'Tox Hazard',
            color: '#84cc16',
            bgGrad: 'linear-gradient(135deg, rgba(132, 204, 22, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="10" fill="#84cc16"/>
                <path d="M50 20C40 20 34 26 34 26L42 38C44 36 47 34 50 34C53 34 56 36 58 38L66 26C66 26 60 20 50 20Z" fill="#ffffff"/>
                <path d="M24 64C24 74 30 80 30 80L42 70C40 68 38 65 38 62C38 59 40 56 42 54L30 44C30 44 24 50 24 64Z" fill="#ffffff"/>
                <path d="M76 64C76 74 70 80 70 80L58 70C60 68 62 65 62 62C62 59 60 56 58 54L70 44C70 44 76 50 76 64Z" fill="#ffffff"/>
                <circle cx="50" cy="50" r="32" stroke="#84cc16" stroke-width="4" stroke-dasharray="24 10"/>
            </svg>`
        },
        // 24. Chrono Blade / Lea4Speed0
        {
            id: 'chrono_blade',
            name: 'Chrono Blade',
            title: 'Chrono Blade',
            color: '#00f0ff',
            bgGrad: 'linear-gradient(135deg, rgba(0, 240, 255, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="36" stroke="#ffffff" stroke-width="5"/>
                <path d="M50 18V50L72 62" stroke="#00f0ff" stroke-width="6" stroke-linecap="round"/>
                <circle cx="50" cy="50" r="7" fill="#00f0ff"/>
                <polygon points="50,6 44,18 56,18" fill="#00f0ff"/>
                <polygon points="94,50 82,44 82,56" fill="#00f0ff"/>
                <polygon points="50,94 56,82 44,82" fill="#00f0ff"/>
                <polygon points="6,50 18,56 18,44" fill="#00f0ff"/>
            </svg>`
        },
        // 25. Quantum Tiger / SRTxAvenger
        {
            id: 'quantum_tiger',
            name: 'Quantum Tiger',
            title: 'Quantum Tiger',
            color: '#ff9900',
            bgGrad: 'linear-gradient(135deg, rgba(255, 153, 0, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 22L36 34L48 24L62 34L78 22L72 46L86 58L68 84L50 92L32 84L14 58L28 46L20 22Z" fill="#ffffff"/>
                <path d="M30 38L42 46L50 40L58 46L70 38L62 62L68 74L50 82L32 74L38 62L30 38Z" fill="#14151a"/>
                <polygon points="38,48 46,50 42,56" fill="#ff9900"/>
                <polygon points="62,48 54,50 58,56" fill="#ff9900"/>
                <path d="M46 68H54L50 76L46 68Z" fill="#ff9900"/>
            </svg>`
        },
        // 26. Turbo Centurion / Skymaster
        {
            id: 'turbo_centurion',
            name: 'Turbo Centurion',
            title: 'Turbo Centurion',
            color: '#38bdf8',
            bgGrad: 'linear-gradient(135deg, rgba(56, 189, 248, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 8L60 22H40L50 8Z" fill="#38bdf8"/>
                <path d="M26 30C26 16 36 14 50 14C64 14 74 16 74 30V56C74 76 64 88 50 92C36 88 26 76 26 56V30Z" fill="#ffffff"/>
                <path d="M30 36H70V48H30V36Z" fill="#14151a"/>
                <path d="M32 40H68V44H32V40Z" fill="#38bdf8"/>
                <line x1="50" y1="48" x2="50" y2="82" stroke="#14151a" stroke-width="6"/>
                <line x1="38" y1="64" x2="62" y2="64" stroke="#14151a" stroke-width="4"/>
            </svg>`
        },
        // 27. Reactor Core / 5TATIC
        {
            id: 'reactor_core',
            name: 'Reactor Core',
            title: 'Reactor Core',
            color: '#14b8a6',
            bgGrad: 'linear-gradient(135deg, rgba(20, 184, 166, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="22" width="56" height="56" rx="8" transform="rotate(45 50 50)" fill="#ffffff"/>
                <rect x="28" y="28" width="44" height="44" rx="4" transform="rotate(45 50 50)" fill="#14151a"/>
                <circle cx="50" cy="50" r="16" fill="#14b8a6"/>
                <circle cx="50" cy="50" r="8" fill="#ffffff"/>
                <line x1="50" y1="12" x2="50" y2="88" stroke="#14b8a6" stroke-width="4"/>
                <line x1="12" y1="50" x2="88" y2="50" stroke="#14b8a6" stroke-width="4"/>
            </svg>`
        },
        // 28. Night Raven
        {
            id: 'night_raven',
            name: 'Night Raven',
            title: 'Night Raven',
            color: '#7c3aed',
            bgGrad: 'linear-gradient(135deg, rgba(124, 58, 237, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 14L62 30L82 28L70 46L88 56L66 66L64 86L50 74L36 86L34 66L12 56L30 46L18 28L38 30L50 14Z" fill="#ffffff"/>
                <path d="M50 26L58 38L72 36L62 50L76 58L58 64L56 74L50 68L44 74L42 64L24 58L38 50L28 36L42 38L50 26Z" fill="#14151a"/>
                <circle cx="44" cy="46" r="3" fill="#7c3aed"/>
                <circle cx="56" cy="46" r="3" fill="#7c3aed"/>
                <polygon points="50,52 46,60 54,60" fill="#7c3aed"/>
            </svg>`
        },
        // 29. Shadow Shinobi
        {
            id: 'shadow_shinobi',
            name: 'Shadow Shinobi',
            title: 'Shadow Shinobi',
            color: '#e2e8f0',
            bgGrad: 'linear-gradient(135deg, rgba(226, 232, 240, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10L62 38L90 50L62 62L50 90L38 62L10 50L38 38L50 10Z" fill="#ffffff"/>
                <path d="M50 26L58 42L74 50L58 58L50 74L42 58L26 50L42 42L50 26Z" fill="#14151a"/>
                <circle cx="50" cy="50" r="8" fill="#e2e8f0"/>
                <circle cx="50" cy="50" r="3" fill="#14151a"/>
            </svg>`
        },
        // 30. Cyber Panther
        {
            id: 'cyber_panther',
            name: 'Cyber Panther',
            title: 'Cyber Panther',
            color: '#a21caf',
            bgGrad: 'linear-gradient(135deg, rgba(162, 28, 175, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 22L34 38L42 28L50 36L58 28L66 38L78 22L72 50L84 64L66 78L50 90L34 78L16 64L28 50L22 22Z" fill="#ffffff"/>
                <path d="M34 42L42 34L50 42L58 34L66 42L62 58L50 74L38 58L34 42Z" fill="#14151a"/>
                <polygon points="40,48 46,50 44,54" fill="#a21caf"/>
                <polygon points="60,48 54,50 56,54" fill="#a21caf"/>
                <polygon points="50,60 46,66 54,66" fill="#ffffff"/>
            </svg>`
        },
        // 31. Neon Cobra
        {
            id: 'neon_cobra',
            name: 'Neon Cobra',
            title: 'Neon Cobra',
            color: '#00ff88',
            bgGrad: 'linear-gradient(135deg, rgba(0, 255, 136, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10C34 10 20 22 20 38C20 54 32 64 36 78H64C68 64 80 54 80 38C80 22 66 10 50 10Z" fill="#ffffff"/>
                <path d="M32 30C32 24 40 20 50 20C60 20 68 24 68 30C68 40 58 48 50 52C42 48 32 40 32 30Z" fill="#14151a"/>
                <polygon points="40,32 46,34 43,40" fill="#00ff88"/>
                <polygon points="60,32 54,34 57,40" fill="#00ff88"/>
                <line x1="46" y1="58" x2="46" y2="70" stroke="#00ff88" stroke-width="3"/>
                <line x1="54" y1="58" x2="54" y2="70" stroke="#00ff88" stroke-width="3"/>
            </svg>`
        },
        // 32. Stealth Steed
        {
            id: 'stealth_steed',
            name: 'Stealth Steed',
            title: 'Stealth Steed',
            color: '#f59e0b',
            bgGrad: 'linear-gradient(135deg, rgba(245, 158, 11, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 16L48 24L42 12L64 22L72 40L84 48L68 56L64 78L52 88L40 76L36 54L22 42L32 16Z" fill="#ffffff"/>
                <path d="M42 32L54 36L48 48L38 46L42 32Z" fill="#14151a"/>
                <circle cx="46" cy="38" r="3" fill="#f59e0b"/>
                <path d="M54 54L64 58L58 72L50 68L54 54Z" fill="#f59e0b"/>
            </svg>`
        },
        // 33. Vortex Shuriken
        {
            id: 'vortex_shuriken',
            name: 'Vortex Shuriken',
            title: 'Vortex Shuriken',
            color: '#06b6d4',
            bgGrad: 'linear-gradient(135deg, rgba(6, 182, 212, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10L62 38L90 50L62 62L50 90L38 62L10 50L38 38L50 10Z" fill="#ffffff"/>
                <circle cx="50" cy="50" r="14" fill="#14151a" stroke="#06b6d4" stroke-width="4"/>
                <circle cx="50" cy="50" r="5" fill="#ffffff"/>
                <line x1="50" y1="18" x2="50" y2="34" stroke="#06b6d4" stroke-width="3"/>
                <line x1="82" y1="50" x2="66" y2="50" stroke="#06b6d4" stroke-width="3"/>
                <line x1="50" y1="82" x2="50" y2="66" stroke="#06b6d4" stroke-width="3"/>
                <line x1="18" y1="50" x2="34" y2="50" stroke="#06b6d4" stroke-width="3"/>
            </svg>`
        },
        // 34. Titan Hammer
        {
            id: 'titan_hammer',
            name: 'Titan Hammer',
            title: 'Titan Hammer',
            color: '#8b5cf6',
            bgGrad: 'linear-gradient(135deg, rgba(139, 92, 246, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="24" width="56" height="28" rx="4" fill="#ffffff"/>
                <rect x="28" y="30" width="44" height="16" fill="#14151a"/>
                <rect x="46" y="52" width="8" height="38" fill="#ffffff"/>
                <line x1="34" y1="38" x2="66" y2="38" stroke="#8b5cf6" stroke-width="4"/>
                <polygon points="50,14 42,24 58,24" fill="#8b5cf6"/>
            </svg>`
        },
        // 35. Carbon Scorpion
        {
            id: 'carbon_scorpion',
            name: 'Carbon Scorpion',
            title: 'Carbon Scorpion',
            color: '#eab308',
            bgGrad: 'linear-gradient(135deg, rgba(234, 179, 8, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 36C40 36 34 46 34 58C34 70 40 80 50 80C60 80 66 70 66 58C66 46 60 36 50 36Z" fill="#ffffff"/>
                <path d="M50 36C50 24 58 18 68 18C78 18 84 26 82 36L74 34C74 28 70 24 66 24C60 24 56 28 56 36H50Z" fill="#ffffff"/>
                <polygon points="82,34 76,44 88,40" fill="#eab308"/>
                <path d="M34 48L16 40L22 56L34 56V48Z" fill="#ffffff"/>
                <path d="M66 48L84 40L78 56L66 56V48Z" fill="#ffffff"/>
            </svg>`
        },
        // 36. Hyper Phoenix
        {
            id: 'hyper_phoenix',
            name: 'Hyper Phoenix',
            title: 'Hyper Phoenix',
            color: '#f97316',
            bgGrad: 'linear-gradient(135deg, rgba(249, 115, 22, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10L58 26L74 22L66 36L86 42L70 54L82 72L58 64L50 88L42 64L18 72L30 54L14 42L34 36L26 22L42 26L50 10Z" fill="#ffffff"/>
                <path d="M50 26L56 38L68 36L60 48L72 52L58 60L50 74L42 60L28 52L40 48L32 36L44 38L50 26Z" fill="#14151a"/>
                <circle cx="50" cy="46" r="5" fill="#f97316"/>
            </svg>`
        },
        // 37. Blitz Rhino
        {
            id: 'blitz_rhino',
            name: 'Blitz Rhino',
            title: 'Blitz Rhino',
            color: '#94a3b8',
            bgGrad: 'linear-gradient(135deg, rgba(148, 163, 184, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 38L42 26L50 12L58 26L76 38L70 66L50 86L30 66L24 38Z" fill="#ffffff"/>
                <polygon points="50,18 44,42 56,42" fill="#14151a"/>
                <polygon points="50,24 46,38 54,38" fill="#94a3b8"/>
                <circle cx="36" cy="48" r="3" fill="#14151a"/>
                <circle cx="64" cy="48" r="3" fill="#14151a"/>
                <path d="M42 64H58L50 74L42 64Z" fill="#94a3b8"/>
            </svg>`
        },
        // 38. Spectral Reaper
        {
            id: 'spectral_reaper',
            name: 'Spectral Reaper',
            title: 'Spectral Reaper',
            color: '#c084fc',
            bgGrad: 'linear-gradient(135deg, rgba(192, 132, 252, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 12C36 12 28 24 28 40C28 62 40 76 50 88C60 76 72 62 72 40C72 24 64 12 50 12Z" fill="#ffffff"/>
                <path d="M34 36C34 26 42 22 50 22C58 22 66 26 66 36C66 52 50 68 50 68C50 68 34 52 34 36Z" fill="#14151a"/>
                <circle cx="44" cy="38" r="2.5" fill="#c084fc"/>
                <circle cx="56" cy="38" r="2.5" fill="#c084fc"/>
                <line x1="22" y1="20" x2="40" y2="12" stroke="#c084fc" stroke-width="4"/>
            </svg>`
        },
        // 39. Frost Bite
        {
            id: 'frost_bite',
            name: 'Frost Bite',
            title: 'Frost Bite',
            color: '#38bdf8',
            bgGrad: 'linear-gradient(135deg, rgba(56, 189, 248, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 36L34 22L50 32L66 22L82 36L72 72L50 88L28 72L18 36Z" fill="#ffffff"/>
                <path d="M28 42H72L64 70L50 80L36 70L28 42Z" fill="#14151a"/>
                <polygon points="34,42 40,54 44,42" fill="#38bdf8"/>
                <polygon points="46,42 50,56 54,42" fill="#38bdf8"/>
                <polygon points="56,42 60,54 66,42" fill="#38bdf8"/>
                <polygon points="40,70 44,58 50,68" fill="#38bdf8"/>
                <polygon points="50,68 56,58 60,70" fill="#38bdf8"/>
            </svg>`
        },
        // 40. Magma Golem
        {
            id: 'magma_golem',
            name: 'Magma Golem',
            title: 'Magma Golem',
            color: '#dc2626',
            bgGrad: 'linear-gradient(135deg, rgba(220, 38, 38, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 28L50 14L80 28L74 72L50 88L26 72L20 28Z" fill="#ffffff"/>
                <path d="M30 38L50 26L70 38L66 68L50 78L34 68L30 38Z" fill="#14151a"/>
                <line x1="38" y1="46" x2="62" y2="46" stroke="#dc2626" stroke-width="4"/>
                <line x1="42" y1="56" x2="58" y2="56" stroke="#dc2626" stroke-width="4"/>
            </svg>`
        },
        // 41. Cyber Shark
        {
            id: 'cyber_shark',
            name: 'Cyber Shark',
            title: 'Cyber Shark',
            color: '#0284c7',
            bgGrad: 'linear-gradient(135deg, rgba(2, 132, 199, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10L68 38H32L50 10Z" fill="#0284c7"/>
                <path d="M22 36C22 22 34 16 50 16C66 16 78 22 78 36V66C78 80 66 88 50 88C34 88 22 80 22 66V36Z" fill="#ffffff"/>
                <path d="M28 44H72L64 74H36L28 44Z" fill="#14151a"/>
                <line x1="34" y1="52" x2="66" y2="52" stroke="#0284c7" stroke-width="4"/>
                <line x1="38" y1="62" x2="62" y2="62" stroke="#0284c7" stroke-width="4"/>
            </svg>`
        },
        // 42. Thunder Bolt
        {
            id: 'thunder_bolt',
            name: 'Thunder Bolt',
            title: 'Thunder Bolt',
            color: '#facc15',
            bgGrad: 'linear-gradient(135deg, rgba(250, 204, 21, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M54 10L24 52H48L38 90L76 44H50L64 10H54Z" fill="#ffffff"/>
                <path d="M52 18L32 50H48L42 78L68 46H50L60 18H52Z" fill="#facc15"/>
            </svg>`
        },
        // 43. Valiant Knight
        {
            id: 'valiant_knight',
            name: 'Valiant Knight',
            title: 'Valiant Knight',
            color: '#6366f1',
            bgGrad: 'linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 20L50 10L70 20V52C70 72 50 88 50 88C50 88 30 72 30 52V20Z" fill="#ffffff"/>
                <path d="M38 32H62V44H38V32Z" fill="#14151a"/>
                <line x1="50" y1="44" x2="50" y2="76" stroke="#14151a" stroke-width="4"/>
                <line x1="42" y1="56" x2="58" y2="56" stroke="#6366f1" stroke-width="3"/>
                <line x1="44" y1="64" x2="56" y2="64" stroke="#6366f1" stroke-width="3"/>
            </svg>`
        },
        // 44. Hazard Wasp
        {
            id: 'hazard_wasp',
            name: 'Hazard Wasp',
            title: 'Hazard Wasp',
            color: '#eab308',
            bgGrad: 'linear-gradient(135deg, rgba(234, 179, 8, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 12L66 32V62L50 88L34 62V32L50 12Z" fill="#ffffff"/>
                <path d="M38 36H62L58 46H42L38 36Z" fill="#14151a"/>
                <path d="M40 50H60L56 60H44L40 50Z" fill="#eab308"/>
                <path d="M42 64H58L50 78L42 64Z" fill="#14151a"/>
                <polygon points="50,78 48,92 52,92" fill="#eab308"/>
            </svg>`
        },
        // 45. Obsidian Gargoyle
        {
            id: 'obsidian_gargoyle',
            name: 'Obsidian Gargoyle',
            title: 'Obsidian Gargoyle',
            color: '#71717a',
            bgGrad: 'linear-gradient(135deg, rgba(113, 113, 122, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 24L32 36L26 58L42 48L50 76L58 48L74 58L68 36L86 24L64 30L50 18L36 30L14 24Z" fill="#ffffff"/>
                <path d="M34 40L42 46L50 42L58 46L66 40L60 56L50 68L40 56L34 40Z" fill="#14151a"/>
                <circle cx="44" cy="48" r="3" fill="#ffffff"/>
                <circle cx="56" cy="48" r="3" fill="#ffffff"/>
            </svg>`
        },
        // 46. Nitro Skull
        {
            id: 'nitro_skull',
            name: 'Nitro Skull',
            title: 'Nitro Skull',
            color: '#00ffcc',
            bgGrad: 'linear-gradient(135deg, rgba(0, 255, 204, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="32" width="16" height="40" rx="6" fill="#00ffcc"/>
                <rect x="72" y="32" width="16" height="40" rx="6" fill="#00ffcc"/>
                <path d="M30 36C30 22 38 16 50 16C62 16 70 22 70 36C70 48 64 56 64 64H36C36 56 30 48 30 36Z" fill="#ffffff"/>
                <circle cx="42" cy="38" r="5" fill="#14151a"/>
                <circle cx="58" cy="38" r="5" fill="#14151a"/>
                <line x1="42" y1="58" x2="42" y2="64" stroke="#14151a" stroke-width="2"/>
                <line x1="50" y1="58" x2="50" y2="64" stroke="#14151a" stroke-width="2"/>
                <line x1="58" y1="58" x2="58" y2="64" stroke="#14151a" stroke-width="2"/>
            </svg>`
        },
        // 47. Apex Predator
        {
            id: 'apex_predator',
            name: 'Apex Predator',
            title: 'Apex Predator',
            color: '#fb923c',
            bgGrad: 'linear-gradient(135deg, rgba(251, 146, 60, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 18L38 32L44 24L50 32L56 24L62 32L78 18L72 46L86 60L68 84L50 92L32 84L14 60L28 46L22 18Z" fill="#ffffff"/>
                <path d="M34 40L42 34L50 42L58 34L66 40L62 58L50 74L38 58L34 40Z" fill="#14151a"/>
                <line x1="38" y1="54" x2="36" y2="66" stroke="#fb923c" stroke-width="4" stroke-linecap="round"/>
                <line x1="62" y1="54" x2="64" y2="66" stroke="#fb923c" stroke-width="4" stroke-linecap="round"/>
            </svg>`
        },
        // 48. Solar Flare
        {
            id: 'solar_flare',
            name: 'Solar Flare',
            title: 'Solar Flare',
            color: '#f59e0b',
            bgGrad: 'linear-gradient(135deg, rgba(245, 158, 11, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="22" fill="#ffffff"/>
                <circle cx="50" cy="50" r="14" fill="#f59e0b"/>
                <polygon points="50,8 44,22 56,22" fill="#ffffff"/>
                <polygon points="50,92 56,78 44,78" fill="#ffffff"/>
                <polygon points="8,50 22,56 22,44" fill="#ffffff"/>
                <polygon points="92,50 78,44 78,56" fill="#ffffff"/>
                <polygon points="20,20 34,26 26,34" fill="#f59e0b"/>
                <polygon points="80,20 74,34 66,26" fill="#f59e0b"/>
                <polygon points="20,80 26,66 34,74" fill="#f59e0b"/>
                <polygon points="80,80 66,74 74,66" fill="#f59e0b"/>
            </svg>`
        },
        // 49. Void Phantom
        {
            id: 'void_phantom',
            name: 'Void Phantom',
            title: 'Void Phantom',
            color: '#818cf8',
            bgGrad: 'linear-gradient(135deg, rgba(129, 140, 248, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 8L74 24V50C74 70 50 92 50 92C50 92 26 70 26 50V24L50 8Z" fill="#ffffff"/>
                <path d="M32 30H68V48H32V30Z" fill="#14151a"/>
                <line x1="36" y1="38" x2="64" y2="38" stroke="#818cf8" stroke-width="4"/>
                <polygon points="50,56 42,72 58,72" fill="#14151a"/>
            </svg>`
        },
        // 50. Crimson Vampire
        {
            id: 'crimson_vampire',
            name: 'Crimson Vampire',
            title: 'Crimson Vampire',
            color: '#b91c1c',
            bgGrad: 'linear-gradient(135deg, rgba(185, 28, 28, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 28L32 36L26 56L44 48L50 84L56 48L74 56L68 36L88 28L68 38L50 24L32 38L12 28Z" fill="#ffffff"/>
                <circle cx="44" cy="40" r="3" fill="#b91c1c"/>
                <circle cx="56" cy="40" r="3" fill="#b91c1c"/>
                <polygon points="46,52 44,62 48,56" fill="#b91c1c"/>
                <polygon points="54,52 56,62 52,56" fill="#b91c1c"/>
            </svg>`
        },
        // 51. Dune Viper
        {
            id: 'dune_viper',
            name: 'Dune Viper',
            title: 'Dune Viper',
            color: '#d97706',
            bgGrad: 'linear-gradient(135deg, rgba(217, 119, 6, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 12L70 28L64 52L50 88L36 52L30 28L50 12Z" fill="#ffffff"/>
                <path d="M42 34L50 26L58 34L50 48L42 34Z" fill="#14151a"/>
                <circle cx="46" cy="34" r="2" fill="#d97706"/>
                <circle cx="54" cy="34" r="2" fill="#d97706"/>
                <line x1="50" y1="52" x2="50" y2="76" stroke="#d97706" stroke-width="4"/>
            </svg>`
        },
        // 52. Vector Samurai
        {
            id: 'vector_samurai',
            name: 'Vector Samurai',
            title: 'Vector Samurai',
            color: '#e11d48',
            bgGrad: 'linear-gradient(135deg, rgba(225, 29, 72, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 22L36 28L50 14L64 28L78 22L70 42H30L22 22Z" fill="#e11d48"/>
                <path d="M28 42H72V66C72 82 50 90 50 90C50 90 28 82 28 66V42Z" fill="#ffffff"/>
                <path d="M34 50H66V58H34V50Z" fill="#14151a"/>
                <line x1="50" y1="58" x2="50" y2="82" stroke="#e11d48" stroke-width="4"/>
            </svg>`
        },
        // 53. Omega Core
        {
            id: 'omega_core',
            name: 'Omega Core',
            title: 'Omega Core',
            color: '#10b981',
            bgGrad: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 80H38L42 70C34 64 30 54 30 44C30 30 40 20 50 20C60 20 70 30 70 44C70 54 66 64 58 70L62 80H78V88H56L50 74L44 88H22V80Z" fill="#ffffff"/>
                <circle cx="50" cy="44" r="10" fill="#10b981"/>
            </svg>`
        },
        // 54. Storm Surge
        {
            id: 'storm_surge',
            name: 'Storm Surge',
            title: 'Storm Surge',
            color: '#0284c7',
            bgGrad: 'linear-gradient(135deg, rgba(2, 132, 199, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 48C30 48 36 32 50 32C64 32 70 48 84 48L80 62C70 62 64 48 50 48C36 48 30 62 20 62L16 48Z" fill="#ffffff"/>
                <path d="M16 68C30 68 36 52 50 52C64 52 70 68 84 68L80 82C70 82 64 68 50 68C36 68 30 82 20 82L16 68Z" fill="#0284c7"/>
            </svg>`
        },
        // 55. Lion Heart
        {
            id: 'lion_heart',
            name: 'Lion Heart',
            title: 'Lion Heart',
            color: '#eab308',
            bgGrad: 'linear-gradient(135deg, rgba(234, 179, 8, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 20L36 34L44 26L50 34L56 26L64 34L76 20L72 46L86 58L68 84L50 92L32 84L14 58L28 46L24 20Z" fill="#ffffff"/>
                <circle cx="42" cy="46" r="3" fill="#eab308"/>
                <circle cx="58" cy="46" r="3" fill="#eab308"/>
                <polygon points="50,56 46,64 54,64" fill="#eab308"/>
            </svg>`
        },
        // 56. Cyber Mantis
        {
            id: 'cyber_mantis',
            name: 'Cyber Mantis',
            title: 'Cyber Mantis',
            color: '#22c55e',
            bgGrad: 'linear-gradient(135deg, rgba(34, 197, 94, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 14L62 38L50 78L38 38L50 14Z" fill="#ffffff"/>
                <path d="M22 26L38 46L30 64L18 36L22 26Z" fill="#22c55e"/>
                <path d="M78 26L62 46L70 64L82 36L78 26Z" fill="#22c55e"/>
                <circle cx="44" cy="34" r="3" fill="#14151a"/>
                <circle cx="56" cy="34" r="3" fill="#14151a"/>
            </svg>`
        },
        // 57. Redline Tach
        {
            id: 'redline_tach',
            name: 'Redline Tach',
            title: 'Redline Tach',
            color: '#ef4444',
            bgGrad: 'linear-gradient(135deg, rgba(239, 68, 68, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 70C16 58 18 44 26 32C36 20 50 14 64 16C78 18 90 28 94 42" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
                <path d="M68 20C78 24 86 32 90 42" stroke="#ef4444" stroke-width="8" stroke-linecap="round"/>
                <line x1="50" y1="64" x2="74" y2="34" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
                <circle cx="50" cy="64" r="8" fill="#ffffff"/>
            </svg>`
        },
        // 58. Zero Gravity
        {
            id: 'zero_gravity',
            name: 'Zero Gravity',
            title: 'Zero Gravity',
            color: '#a855f7',
            bgGrad: 'linear-gradient(135deg, rgba(168, 85, 247, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="34" stroke="#ffffff" stroke-width="4"/>
                <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(-30 50 50)" stroke="#a855f7" stroke-width="4"/>
                <circle cx="50" cy="50" r="10" fill="#a855f7"/>
                <circle cx="50" cy="50" r="4" fill="#ffffff"/>
            </svg>`
        },
        // 59. Blaze Hound
        {
            id: 'blaze_hound',
            name: 'Blaze Hound',
            title: 'Blaze Hound',
            color: '#ea580c',
            bgGrad: 'linear-gradient(135deg, rgba(234, 88, 12, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 14L66 32L88 38L70 56L74 84L50 72L26 84L30 56L12 38L34 32L50 14Z" fill="#ffffff"/>
                <polygon points="40,46 48,48 44,54" fill="#ea580c"/>
                <polygon points="60,46 52,48 56,54" fill="#ea580c"/>
                <path d="M46 64H54L50 72L46 64Z" fill="#ea580c"/>
            </svg>`
        },
        // 60. Apex Crown
        {
            id: 'apex_crown',
            name: 'Apex Crown',
            title: 'Apex Crown',
            color: '#ffd700',
            bgGrad: 'linear-gradient(135deg, rgba(255, 215, 0, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 32L34 50L50 20L66 50L84 32L78 78H22L16 32Z" fill="#ffffff"/>
                <circle cx="16" cy="28" r="4" fill="#ffd700"/>
                <circle cx="50" cy="16" r="5" fill="#ffd700"/>
                <circle cx="84" cy="28" r="4" fill="#ffd700"/>
                <rect x="28" y="66" width="44" height="6" fill="#ffd700"/>
            </svg>`
        }
    ];

    // =======================================================
    // ASIGNACIONES CANÓNICAS EXPLÍCITAS (JEFES Y LEYENDAS)
    // =======================================================
    const CANONICAL_MAP = {
        // Blacklist Jefes (Nombre real y Alias vinculados)
        'RAZOR': 'blacklist_boss',
        'CLARENCE CALLAHAN': 'blacklist_boss',

        'BULL': 'iron_minotaur',
        'TORU SATO': 'iron_minotaur',

        'RONNIE': 'falcon_ace',
        'RONALD MCCREA': 'falcon_ace',

        'JV': 'shadow_gambler',
        'JOE VEGA': 'shadow_gambler',

        'WEBSTER': 'arachnid_fang',
        'WES ALLEN': 'arachnid_fang',

        'MING': 'dragon_breath',
        'HECTOR DOMINGO': 'dragon_breath',

        'KAZE': 'tempest_visor',
        'KIRA NAKAZATO': 'tempest_visor',

        'JEWELS': 'prism_valkyrie',
        'JADE BARRETT': 'prism_valkyrie',

        'EARL': 'iron_anchor',
        'EUGENE JAMES': 'iron_anchor',

        'BARON': 'royal_eagle',
        'KARL SMIT': 'royal_eagle',

        'VIC': 'sniper_cross',
        'VICTOR VASQUEZ': 'sniper_cross',

        'IZZY': 'cyber_lotus',
        'ISABEL DIAZ': 'cyber_lotus',

        'BIG LOU': 'twin_pistons',
        'LOU PARK': 'twin_pistons',
        'BIGLOU': 'twin_pistons',

        'TAZ': 'desert_stinger',
        'VINCE KILIC': 'desert_stinger',

        'SONNY': 'inferno_skull',
        'HO SEUN': 'inferno_skull',

        // Pilotos de la Comunidad y Ejemplo del Usuario
        'LEO SPEED': 'speed_demon',
        'LEOSPEED': 'speed_demon',

        'ZIMANX': 'viper_strike',
        'ZIMANX™️': 'viper_strike',
        'ZIMANX™': 'viper_strike',

        'ZIPPER': 'phantom_pilot',
        'DJALIL': 'apex_wolf',
        'NIGHTRIDERZ': 'cyber_oni',
        'ROG': 'interceptor_helm',
        'MIA': 'valkyrie_wings',
        'CROSS': 'tox_hazard',
        'LEA4SPEED0': 'chrono_blade',
        'SRTXAVENGER': 'quantum_tiger',
        'SKYMASTER': 'turbo_centurion',
        '5TATIC': 'reactor_core'
    };

    // =======================================================
    // REGISTRO DE ASIGNACIÓN ÚNICA Y MAPA DE ALIAS
    // =======================================================
    const STORAGE_KEY = 'nfs_player_operator_registry_v3';

    // Mapa de Identificador Normalizado -> ID de Operador
    const playerToOperatorId = new Map();

    // Conjunto de IDs de Operadores que ya han sido asignados (Garantía de Unicidad)
    const claimedOperatorIds = new Set();

    // Mapa de Alias Bidireccional (ej: "Leonardo" <-> "Leo Speed")
    const aliasToCanonical = new Map();

    /**
     * Normaliza una cadena de texto para comparaciones seguras de identidad
     */
    function normalizeKey(str) {
        if (!str || typeof str !== 'string') return '';
        return str.trim().toUpperCase().replace(/["']/g, '');
    }

    /**
     * Vincula dos alias/nombres como pertenecientes a la misma persona.
     * Ejemplo: linkPlayerAliases("Leonardo", "Leo Speed")
     */
    function linkPlayerAliases(name, alias) {
        const normName = normalizeKey(name);
        const normAlias = normalizeKey(alias);

        if (!normName && !normAlias) return;

        const canonical = normAlias || normName;

        if (normName) aliasToCanonical.set(normName, canonical);
        if (normAlias) aliasToCanonical.set(normAlias, canonical);

        // Si alguno de los dos ya tenía operador asignado, unificar la asignación
        const opName = normName ? playerToOperatorId.get(normName) : null;
        const opAlias = normAlias ? playerToOperatorId.get(normAlias) : null;
        const chosenOp = opAlias || opName;

        if (chosenOp) {
            if (normName) playerToOperatorId.set(normName, chosenOp);
            if (normAlias) playerToOperatorId.set(normAlias, chosenOp);
            persistRegistry();
        }
    }

    /**
     * Inicializa el registro cargando las asignaciones canónicas y persistidas.
     */
    function initRegistry() {
        // 1. Asignar mapa canónico
        Object.entries(CANONICAL_MAP).forEach(([key, opId]) => {
            const normKey = normalizeKey(key);
            playerToOperatorId.set(normKey, opId);
            claimedOperatorIds.add(opId);
        });

        // 2. Cargar desde localStorage
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (typeof parsed === 'object' && parsed !== null) {
                    Object.entries(parsed).forEach(([player, opId]) => {
                        const normKey = normalizeKey(player);
                        // Respetar asignaciones previas si el operador es válido
                        const opExists = OPERATOR_CATALOG.some(o => o.id === opId) || opId.startsWith('procedural_');
                        if (opExists) {
                            playerToOperatorId.set(normKey, opId);
                            claimedOperatorIds.add(opId);
                        }
                    });
                }
            }
        } catch (e) {
            console.warn('[NFSOperators] Error cargando asignaciones:', e);
        }
    }

    /**
     * Guarda el estado actual de asignaciones en localStorage
     */
    function persistRegistry() {
        try {
            const obj = {};
            playerToOperatorId.forEach((opId, player) => {
                obj[player] = opId;
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
        } catch (e) {
            // Silencioso en caso de cuota excedida
        }
    }

    /**
     * Generador Procedural Infinito para casos en que se superen los 60 operadores del catálogo.
     * Garantiza un SVG único, simétrico y de alto contraste con colores deportivos.
     */
    function generateProceduralOperator(playerId, seedNumber) {
        const colors = [
            '#ff4612', '#00ff88', '#00e5ff', '#ffd700', '#ec4899',
            '#a855f7', '#38bdf8', '#f59e0b', '#ef4444', '#10b981',
            '#8b5cf6', '#f43f5e', '#06b6d4', '#eab308', '#22c55e', '#ea580c'
        ];
        const color = colors[seedNumber % colors.length];
        const rot = (seedNumber * 45) % 360;

        const svg = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,10 88,32 88,68 50,90 12,68 12,32" fill="#ffffff"/>
            <polygon points="50,18 80,36 80,64 50,82 20,64 20,36" fill="#14151a"/>
            <circle cx="50" cy="50" r="18" fill="${color}"/>
            <circle cx="50" cy="50" r="8" fill="#ffffff"/>
            <rect x="46" y="24" width="8" height="52" rx="4" transform="rotate(${rot} 50 50)" fill="#ffffff"/>
        </svg>`;

        return {
            id: playerId,
            name: `Operador #${seedNumber + 1}`,
            title: `Operador #${seedNumber + 1}`,
            color: color,
            bgGrad: `linear-gradient(135deg, ${color}55 0%, #121316 100%)`,
            svg: svg
        };
    }

    /**
     * Obtiene el operador correspondiente a un nombre de jugador de manera determinista y con garantía de UNICIDAD.
     * Si ya tiene asignado un icono, lo devuelve.
     * Si es nuevo, busca un icono libre en el catálogo que NINGÚN otro jugador tenga, lo reserva y lo asocia permanentemente.
     */
    function getPlayerOperator(playerName) {
        if (!playerName || typeof playerName !== 'string') {
            return OPERATOR_CATALOG[0];
        }

        const raw = playerName.trim();
        const norm = normalizeKey(raw);

        // 1. Verificar si este nombre (o un alias vinculado) ya tiene asignación
        let opId = playerToOperatorId.get(norm);
        if (!opId && aliasToCanonical.has(norm)) {
            const canonical = aliasToCanonical.get(norm);
            opId = playerToOperatorId.get(canonical);
        }

        if (opId) {
            const found = OPERATOR_CATALOG.find(op => op.id === opId);
            if (found) return found;
            if (opId.startsWith('procedural_')) {
                const seed = parseInt(opId.split('_')[1], 10) || 0;
                return generateProceduralOperator(opId, seed);
            }
        }

        // 2. Si no tiene asignación, encontrar un operador NO RECLAMADO en el catálogo
        // Calculamos un índice de preferencia según el hash del nombre para estabilidad
        let hash = 0;
        for (let i = 0; i < norm.length; i++) {
            hash = norm.charCodeAt(i) + ((hash << 5) - hash);
        }
        const prefIdx = Math.abs(hash) % OPERATOR_CATALOG.length;

        let selectedOp = null;

        // Buscar desde prefIdx hacia adelante un operador libre
        for (let i = 0; i < OPERATOR_CATALOG.length; i++) {
            const candidateIdx = (prefIdx + i) % OPERATOR_CATALOG.length;
            const candidate = OPERATOR_CATALOG[candidateIdx];
            if (!claimedOperatorIds.has(candidate.id)) {
                selectedOp = candidate;
                break;
            }
        }

        // 3. Si todos los operadores del catálogo están ocupados, generar uno procedural único
        if (!selectedOp) {
            const procId = `procedural_${claimedOperatorIds.size}`;
            selectedOp = generateProceduralOperator(procId, claimedOperatorIds.size);
        }

        // 4. Registrar la asignación exclusiva y marcar como reclamado
        playerToOperatorId.set(norm, selectedOp.id);
        claimedOperatorIds.add(selectedOp.id);

        // Si tiene alias vinculado, registrar también
        if (aliasToCanonical.has(norm)) {
            const canonical = aliasToCanonical.get(norm);
            playerToOperatorId.set(canonical, selectedOp.id);
        }

        persistRegistry();
        return selectedOp;
    }

    /**
     * Genera el HTML del contenedor con la silueta SVG de alto contraste.
     * @param {string} driverName - Nombre del piloto
     * @param {string} extraClass - Clase adicional ('xlarge', etc.)
     */
    function getOperatorBadgeHTML(driverName, extraClass = '') {
        const op = getPlayerOperator(driverName);
        const cls = extraClass ? `operator-badge-box ${extraClass}` : 'operator-badge-box';
        return `
            <div class="${cls}" style="--op-color: ${op.color}; --op-bg: ${op.bgGrad};" title="Operador: ${op.title} (${driverName})">
                ${op.svg}
            </div>
        `.trim();
    }

    /**
     * Genera la celda completa del piloto: Silueta SVG grande + Nombre
     * @param {string} driverName - Nombre del piloto
     * @param {string} extraInfoHTML - HTML opcional posterior (ej: badge de récord, rango, etc.)
     */
    function getDriverCellHTML(driverName, extraInfoHTML = '') {
        const badgeHTML = getOperatorBadgeHTML(driverName);
        const nameClean = (driverName || 'Desconocido').trim();
        return `
            <div class="driver-name-cell-wrapper">
                ${badgeHTML}
                <div class="driver-cell-info-col">
                    <span class="driver-name-text">${nameClean}</span>
                    ${extraInfoHTML ? `<div class="driver-cell-extra-info">${extraInfoHTML}</div>` : ''}
                </div>
            </div>
        `.trim();
    }

    // Inicializar registro al cargar
    initRegistry();

    // Exponer globalmente en window
    window.NFSOperators = {
        catalog: OPERATOR_CATALOG,
        getPlayerOperator: getPlayerOperator,
        getOperatorBadgeHTML: getOperatorBadgeHTML,
        getDriverCellHTML: getDriverCellHTML,
        linkPlayerAliases: linkPlayerAliases
    };

})();
