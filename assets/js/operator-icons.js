/**
 * NFS: Most Wanted (2005) - World Records (NFSRANKSMW)
 * Sistema de Siluetas SVG de Alto Contraste para Jugadores / Operadores
 * Estilo Tracker.gg / Rainbow Six Siege Operator Badges
 */

(function () {
    'use strict';

    // =======================================================
    // CATÁLOGO DE SILUETAS VECTORIALES SVG DE ALTO CONTRASTE
    // =======================================================
    const OPERATOR_CATALOG = [
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
        {
            id: 'apex_wolf',
            name: 'Apex Wolf',
            title: 'Apex Wolf',
            color: '#f8fafc',
            bgGrad: 'linear-gradient(135deg, rgba(248, 250, 252, 0.35) 0%, #121316 100%)',
            svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 12L66 28L86 24L76 46L88 58L68 64L66 84L50 72L34 84L32 64L12 58L24 46L14 24L34 28L50 12Z" fill="#ffffff"/>
                <path d="M50 28L60 38L72 36L64 48L72 56L58 60L56 70L50 64L44 70L42 60L28 56L36 48L28 36L40 38L50 28Z" fill="#14151a"/>
                <polygon points="42,46 48,48 44,52" fill="#00e5ff"/>
                <polygon points="58,46 52,48 56,52" fill="#00e5ff"/>
                <polygon points="50,56 46,62 54,62" fill="#ffffff"/>
            </svg>`
        },
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
        }
    ];

    // =======================================================
    // ASIGNACIÓN EXPLÍCITA PARA PILOTOS CLAVE Y JEFES
    // =======================================================
    const EXPLICIT_MAP = {
        'ZIMANX': 'viper_strike',
        'ZIPPER': 'phantom_pilot',
        'RAZOR': 'blacklist_boss',
        'BULL': 'iron_minotaur',
        'RONNIE': 'falcon_ace',
        'JV': 'shadow_gambler',
        'WEBSTER': 'arachnid_fang',
        'MING': 'dragon_breath',
        'KAZE': 'tempest_visor',
        'JEWELS': 'prism_valkyrie',
        'EARL': 'iron_anchor',
        'BARON': 'royal_eagle',
        'BIG LOU': 'twin_pistons',
        'BIGLOU': 'twin_pistons',
        'IZZY': 'cyber_lotus',
        'VIC': 'sniper_cross',
        'TAZ': 'desert_stinger',
        'SONNY': 'inferno_skull'
    };

    // Cache interno de asignaciones
    const playerOperatorCache = new Map();

    /**
     * Obtiene el operador correspondiente a un nombre de jugador de manera determinista.
     * Si es un piloto conocido, usa su silueta específica.
     * Si es dinámico, calcula un hash consistente.
     */
    function getPlayerOperator(playerName) {
        if (!playerName || typeof playerName !== 'string') {
            return OPERATOR_CATALOG[0];
        }

        const clean = playerName.trim().toUpperCase();
        if (playerOperatorCache.has(clean)) {
            return playerOperatorCache.get(clean);
        }

        // 1. Verificación explícita
        if (EXPLICIT_MAP[clean]) {
            const found = OPERATOR_CATALOG.find(op => op.id === EXPLICIT_MAP[clean]);
            if (found) {
                playerOperatorCache.set(clean, found);
                return found;
            }
        }

        // 2. Hash determinista
        let hash = 0;
        for (let i = 0; i < clean.length; i++) {
            hash = clean.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % OPERATOR_CATALOG.length;
        const assigned = OPERATOR_CATALOG[index];
        playerOperatorCache.set(clean, assigned);
        return assigned;
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

    // Exponer globalmente en window
    window.NFSOperators = {
        catalog: OPERATOR_CATALOG,
        getPlayerOperator: getPlayerOperator,
        getOperatorBadgeHTML: getOperatorBadgeHTML,
        getDriverCellHTML: getDriverCellHTML
    };

})();
