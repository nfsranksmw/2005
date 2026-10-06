/**
 * NFS: Most Wanted (2005) - World Records (NFSRANKSMW)
 * Catálogo Oficial de Emblemas Vectoriales SVG Estilo Google Stitch
 * 
 * GARANTÍA DE UNICIDAD ESTRICTA:
 * - Cada jugador tiene un icono SVG exclusivo y permanente con borde de neón brillante.
 * - Iconografía minimalista de alto contraste idéntica al diseño Google Stitch.
 * - Sincronización total entre Leaderboards de Rutas, Blacklist, Inscripciones y Standings.
 */

(function () {
    'use strict';

    function safeText(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[m]));
    }

    // =======================================================
    // CATÁLOGO OFICIAL DE EMBLEMAS VECTORIALES (ESTILO GOOGLE STITCH)
    // =======================================================
    const OPERATOR_CATALOG = [
        // 1. Lea4Speed0 / Leo Speed (Cronómetro / Stopwatch)
        {
            id: 'stitch_chrono_blade',
            name: 'Chrono Blade',
            title: 'Cronómetro Digital (Chrono Blade)',
            color: '#00e5ff',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="17" r="10" stroke="#00e5ff" stroke-width="2"/><rect x="14.5" y="3" width="3" height="3" rx="0.8" fill="#00e5ff"/><path d="M12 3H20" stroke="#00e5ff" stroke-width="1.4" stroke-linecap="round"/><path d="M16 11V17L20.5 19.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="17" r="1.5" fill="#00e5ff"/></svg>`
        },
        // 2. SRTxAvenger / SRTxAvenger™ (Lobo Alfa Crest)
        {
            id: 'stitch_apex_wolf',
            name: 'Apex Wolf',
            title: 'Lobo Alfa (Apex Wolf)',
            color: '#ff7a00',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 5L20 10L25 9L23 16L26 21L16 27L6 21L9 16L7 9L12 10L16 5Z" fill="#ffffff"/><path d="M16 11L18.5 14.5L21.5 14L19 18L21 21L16 24L11 21L13 18L10.5 14L13.5 14.5L16 11Z" fill="#111622"/><path d="M16 14L14 18H18L16 14Z" fill="#ff7a00"/><circle cx="13.5" cy="16.5" r="1" fill="#ff7a00"/><circle cx="18.5" cy="16.5" r="1" fill="#ff7a00"/><path d="M16 20L14.5 22.5H17.5L16 20Z" fill="#ffffff"/></svg>`
        },
        // 3. Xman (Escudo Real con Corona Alada / W)
        {
            id: 'stitch_valiant_shield',
            name: 'Valiant Shield',
            title: 'Escudo Real (Valiant Shield)',
            color: '#00a2ff',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 5L25 8.5V17C25 22.5 21.2 26.5 16 28C10.8 26.5 7 22.5 7 17V8.5L16 5Z" fill="#00a2ff" fill-opacity="0.25" stroke="#00a2ff" stroke-width="2"/><path d="M11 12L13.5 19L16 14.5L18.5 19L21 12H23L19.5 22H17.5L16 17.5L14.5 22H12.5L9 12H11Z" fill="#ffffff"/><circle cx="16" cy="11" r="1.5" fill="#00a2ff"/></svg>`
        },
        // 4. Saitkb (Marcador Espectral / Ghost Pin)
        {
            id: 'stitch_ghost_pin',
            name: 'Ghost Pin',
            title: 'Marcador Espectral (Ghost Pin)',
            color: '#b55fe6',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 5C11.5 5 8 8.8 8 13.5C8 19.5 15 26.2 15.5 26.7C15.8 27 16.2 27 16.5 26.7C17 26.2 24 19.5 24 13.5C24 8.8 20.5 5 16 5Z" fill="#b55fe6" fill-opacity="0.25" stroke="#b55fe6" stroke-width="1.8"/><ellipse cx="16" cy="13.5" rx="4.5" ry="5.5" fill="#ffffff"/><circle cx="14" cy="13" r="1.2" fill="#111622"/><circle cx="18" cy="13" r="1.2" fill="#111622"/></svg>`
        },
        // 5. ZimanX / ZimanX™️ / ZimanX™ (Punta de Flecha / Chevron Diamante)
        {
            id: 'stitch_viper_strike',
            name: 'Viper Strike',
            title: 'Punta de Flecha (Viper Strike)',
            color: '#ff4500',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 5L24 13L16 27L8 13L16 5Z" fill="#ff4500" fill-opacity="0.25" stroke="#ff4500" stroke-width="1.8"/><path d="M16 9L21 14L16 23L11 14L16 9Z" fill="#ffffff"/><polygon points="16,12 18.5,15 16,19 13.5,15" fill="#ff4500"/><circle cx="16" cy="15.5" r="1.2" fill="#ffffff"/></svg>`
        },
        // 6. Skymaster (Yelmo de Caballero Cruzado con Visera de Cruz)
        {
            id: 'stitch_crusader_helm',
            name: 'Crusader Helm',
            title: 'Yelmo Cruzado (Crusader Helm)',
            color: '#00dbe9',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13C10 9 12.5 6 16 6C19.5 6 22 9 22 13V20C22 23.5 19.5 26 16 26C12.5 26 10 23.5 10 20V13Z" fill="#ffffff"/><rect x="10" y="11" width="12" height="3" fill="#00dbe9"/><path d="M11 17H21M16 14V23" stroke="#111622" stroke-width="2.2" stroke-linecap="round"/><circle cx="13" cy="20" r="0.8" fill="#111622"/><circle cx="19" cy="20" r="0.8" fill="#111622"/></svg>`
        },
        // 7. JS (Casco de Carrera con Visera Panorámica)
        {
            id: 'stitch_racing_helmet',
            name: 'Racing Helmet',
            title: 'Casco de Carrera (Racing Helmet)',
            color: '#00b4d8',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6C11 6 8 9.5 8 14.5V19C8 22.5 11 25.5 15 25.8V26H17V25.8C21 25.5 24 22.5 24 19V14.5C24 9.5 21 6 16 6Z" fill="#ffffff"/><rect x="10.5" y="13.5" width="11" height="5" rx="2" fill="#111622"/><path d="M12 15.5H20" stroke="#00b4d8" stroke-width="1.5" stroke-linecap="round"/><rect x="14.5" y="4.5" width="3" height="2" rx="0.5" fill="#00b4d8"/></svg>`
        },
        // 8. Darkrai (Relámpago Dorado Eléctrico)
        {
            id: 'stitch_thunder_bolt',
            name: 'Thunder Bolt',
            title: 'Relámpago Dorado (Thunder Bolt)',
            color: '#ffc400',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 5L9 16H15L13 27L23 14H16.5L18 5Z" fill="#ffffff"/><path d="M17 7L10.5 15H15.5L14 24L21.5 14H16L17 7Z" fill="#ffc400"/></svg>`
        },
        // 9. Gabriel Noriega (Máscara Gladiador Espartano)
        {
            id: 'stitch_spartan_gladiator',
            name: 'Spartan Gladiator',
            title: 'Máscara Gladiador (Spartan Gladiator)',
            color: '#8b5cf6',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 5L23 9V17C23 22 19.5 25.5 16 27C12.5 25.5 9 22 9 17V9L16 5Z" fill="#ffffff"/><path d="M12 12H20V14.5H12V12Z" fill="#111622"/><path d="M15 16H17V22H15V16Z" fill="#8b5cf6"/><path d="M12.5 17H13.8V21H12.5V17Z" fill="#8b5cf6"/><path d="M18.2 17H19.5V21H18.2V17Z" fill="#8b5cf6"/></svg>`
        },
        // 10. DannyLove (As Alado de Corazón)
        {
            id: 'stitch_winged_ace',
            name: 'Winged Ace',
            title: 'As Alado (Winged Ace)',
            color: '#ffb800',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 11C18 7.5 22.5 8.5 22.5 12.5C22.5 16.5 17 20.5 16 21.5C15 20.5 9.5 16.5 9.5 12.5C9.5 8.5 14 7.5 16 11Z" fill="#ffffff"/><path d="M9 13.5C6 11.5 3 13 4 17C5.5 16 7.5 15.5 9.5 15.5" stroke="#ffb800" stroke-width="2" stroke-linecap="round"/><path d="M23 13.5C26 11.5 29 13 28 17C26.5 16 24.5 15.5 22.5 15.5" stroke="#ffb800" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="14" r="2" fill="#ffb800"/></svg>`
        },
        // 11. Airmax (Dardo Supersónico / Cohete)
        {
            id: 'stitch_supersonic_dart',
            name: 'Supersonic Dart',
            title: 'Dardo Supersónico (Supersonic Dart)',
            color: '#ffb800',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6L21 16H18.5V21L16 24L13.5 21V16H11L16 6Z" fill="#ffffff"/><polygon points="16,13 18,17 16,21 14,17" fill="#ffb800"/><polygon points="16,22 17.5,25 16,27 14.5,25" fill="#ff5708"/></svg>`
        },
        // 12. X1PROCL (Caza Estelar Stealth)
        {
            id: 'stitch_stealth_starfighter',
            name: 'Stealth Starfighter',
            title: 'Caza Estelar (Stealth Starfighter)',
            color: '#718096',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6L19 14L27 19L22 21L20 25L16 22L12 25L10 21L5 19L13 14L16 6Z" fill="#ffffff"/><polygon points="16,10 18,15 16,19 14,15" fill="#111622"/><circle cx="16" cy="15" r="1.5" fill="#718096"/></svg>`
        },
        // 13. DarkShido / Shido (Shuriken Octagonal)
        {
            id: 'stitch_ninja_star',
            name: 'Ninja Shuriken',
            title: 'Estrella Ninja (Ninja Shuriken)',
            color: '#00ffcc',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 5L18.5 12L25.5 9.5L23 16.5L30 19L23 21.5L25.5 28.5L18.5 26L16 33L13.5 26L6.5 28.5L9 21.5L2 19L9 16.5L6.5 9.5L13.5 12L16 5Z" transform="scale(0.8) translate(4, 3)" fill="#ffffff"/><circle cx="16" cy="16" r="3.5" fill="#00ffcc"/><circle cx="16" cy="16" r="1.8" fill="#111622"/></svg>`
        },
        // 14. Nebula (Planeta Saturno Anillado)
        {
            id: 'stitch_cosmic_saturn',
            name: 'Cosmic Saturn',
            title: 'Planeta Orbital (Cosmic Saturn)',
            color: '#ec4899',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="16" rx="12" ry="4.5" transform="rotate(-25 16 16)" stroke="#ec4899" stroke-width="2"/><circle cx="16" cy="16" r="7" fill="#ffffff"/><path d="M10 15C11 18 14 21 18 21C21 21 23 19 23 17" stroke="#111622" stroke-width="1.8" stroke-linecap="round"/></svg>`
        },
        // 15. Mike (Colmillo Esmeralda)
        {
            id: 'stitch_viper_fang',
            name: 'Viper Fang',
            title: 'Colmillo Esmeralda (Viper Fang)',
            color: '#10b981',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 5L24 11V21L16 27L8 21V11L16 5Z" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="1.8"/><path d="M16 9L21 14V19L16 23L11 19V14L16 9Z" fill="#ffffff"/><polygon points="16,12 19,16 16,20 13,16" fill="#10b981"/></svg>`
        },
        // 16. 5TATIC (Núcleo de Reactor)
        {
            id: 'stitch_reactor_core',
            name: 'Reactor Core',
            title: 'Núcleo de Plasma (Reactor Core)',
            color: '#06b6d4',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="3" fill="#ffffff"/><path d="M16 6A10 10 0 0 1 25.5 12" stroke="#06b6d4" stroke-width="2.2" stroke-linecap="round"/><path d="M25.5 20A10 10 0 0 1 16 26" stroke="#06b6d4" stroke-width="2.2" stroke-linecap="round"/><path d="M10.5 22A10 10 0 0 1 8 16" stroke="#06b6d4" stroke-width="2.2" stroke-linecap="round"/><circle cx="16" cy="16" r="1.5" fill="#06b6d4"/></svg>`
        },
        // 17. 13MwRR (Doble Turbina)
        {
            id: 'stitch_twin_turbo',
            name: 'Twin Turbo',
            title: 'Doble Turbina (Twin Turbo)',
            color: '#e11d48',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="9" stroke="#e11d48" stroke-width="2"/><path d="M16 7V16L22 13M16 25V16L10 19" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="16" r="2.5" fill="#e11d48"/></svg>`
        },
        // 18. ARS3N (Llama de Dragón)
        {
            id: 'stitch_dragon_fire',
            name: 'Dragon Fire',
            title: 'Llama de Dragón (Dragon Fire)',
            color: '#f97316',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6C17 10 20 12 21 15C22.5 19.5 19 24 16 26C13 24 9.5 19.5 11 15C12 12 15 10 16 6Z" fill="#ffffff"/><path d="M16 12C16.8 14.5 18.5 16 18.5 18C18.5 20.5 17 22.5 16 23C15 22.5 13.5 20.5 13.5 18C13.5 16 15.2 14.5 16 12Z" fill="#f97316"/></svg>`
        },
        // 19. HighPriest (Corona Gótica)
        {
            id: 'stitch_sacred_crown',
            name: 'Sacred Crown',
            title: 'Corona Gótica (Sacred Crown)',
            color: '#a855f7',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 22L10 12L13 16L16 8L19 16L22 12L24 22H8Z" fill="#ffffff"/><path d="M11 20H21V22H11V20Z" fill="#a855f7"/><circle cx="16" cy="14" r="1.5" fill="#a855f7"/></svg>`
        },
        // 20. InfacTus612 (Mira Táctica Crosshair)
        {
            id: 'stitch_sniper_crosshair',
            name: 'Sniper Crosshair',
            title: 'Mira Táctica (Sniper Crosshair)',
            color: '#0284c7',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="9" stroke="#ffffff" stroke-width="2"/><circle cx="16" cy="16" r="4.5" stroke="#0284c7" stroke-width="1.8"/><path d="M16 4V10M16 22V28M4 16H10M22 16H28" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="16" r="1.5" fill="#0284c7"/></svg>`
        },
        // 21. Silentiumm (Visor Fantasma)
        {
            id: 'stitch_phantom_visor',
            name: 'Phantom Visor',
            title: 'Visor Fantasma (Phantom Visor)',
            color: '#6366f1',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12C8 8.5 11.5 6 16 6C20.5 6 24 8.5 24 12V18C24 22 20.5 25 16 26C11.5 25 8 22 8 18V12Z" fill="#ffffff"/><path d="M10 14H22V17H10V14Z" fill="#111622"/><path d="M12 15.5H20" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round"/></svg>`
        },
        // 22. Zonda (Halo Cuádruple Pagani)
        {
            id: 'stitch_quad_exhaust',
            name: 'Quad Exhaust',
            title: 'Halo Cuádruple (Quad Exhaust)',
            color: '#eab308',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="9" stroke="#eab308" stroke-width="2"/><circle cx="13.5" cy="13.5" r="2" fill="#ffffff"/><circle cx="18.5" cy="13.5" r="2" fill="#ffffff"/><circle cx="13.5" cy="18.5" r="2" fill="#ffffff"/><circle cx="18.5" cy="18.5" r="2" fill="#ffffff"/></svg>`
        },
        // 23. ssjoen (Chevron Aerodinámico)
        {
            id: 'stitch_velocity_chevron',
            name: 'Velocity Chevron',
            title: 'Chevron Aero (Velocity Chevron)',
            color: '#14b8a6',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 11L16 16L25 11L16 6L7 11Z" fill="#ffffff"/><path d="M7 17L16 22L25 17L16 12L7 17Z" fill="#14b8a6"/><path d="M10 23L16 26L22 23" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/></svg>`
        },
        // 24. Zipper (Piloto Aviador)
        {
            id: 'stitch_cyber_pilot',
            name: 'Cyber Pilot',
            title: 'Piloto Aviador (Cyber Pilot)',
            color: '#ffd700',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 14C7 9 11 5 16 5C21 5 25 9 25 14V19C25 24 21 27 16 27C11 27 7 24 7 19V14Z" fill="#ffffff"/><rect x="9.5" y="11" width="5.5" height="4.5" rx="1.5" fill="#111622"/><rect x="17" y="11" width="5.5" height="4.5" rx="1.5" fill="#111622"/><path d="M15 13H17" stroke="#ffd700" stroke-width="1.5"/><circle cx="12.2" cy="13.2" r="1.2" fill="#ffd700"/><circle cx="19.8" cy="13.2" r="1.2" fill="#ffd700"/></svg>`
        },
        // 25. Djalil (Tigre Alfa)
        {
            id: 'stitch_shadow_tiger',
            name: 'Shadow Tiger',
            title: 'Tigre Sombrío (Shadow Tiger)',
            color: '#f59e0b',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6L21 11L26 8L24 16L27 21L16 27L5 21L8 16L6 8L11 11L16 6Z" fill="#ffffff"/><polygon points="16,13 18.5,17 16,21 13.5,17" fill="#f59e0b"/><circle cx="12" cy="15" r="1.2" fill="#111622"/><circle cx="20" cy="15" r="1.2" fill="#111622"/></svg>`
        },
        // 26. Nightriderz (Máscara Oni Cyber)
        {
            id: 'stitch_cyber_oni',
            name: 'Cyber Oni',
            title: 'Máscara Oni (Cyber Oni)',
            color: '#ef4444',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 6L11 12H21L24 6L21 15L24 22L16 27L8 22L11 15L8 6Z" fill="#ffffff"/><path d="M12 15L15 17L12 19M20 15L17 17L20 19" stroke="#ef4444" stroke-width="1.8" stroke-linecap="round"/><circle cx="16" cy="22" r="1.5" fill="#ef4444"/></svg>`
        },
        // 27. Rog (Insignia Interceptor Policial)
        {
            id: 'stitch_interceptor_shield',
            name: 'Interceptor Star',
            title: 'Insignia Interceptor (Interceptor)',
            color: '#38bdf8',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="16,5 19,12 27,13 21,18 23,26 16,22 9,26 11,18 5,13 13,12" fill="#ffffff"/><circle cx="16" cy="16" r="4.5" fill="#38bdf8"/><circle cx="16" cy="16" r="2" fill="#ffffff"/></svg>`
        },
        // 28. Mia (Alas Valkiria)
        {
            id: 'stitch_valkyrie_wings',
            name: 'Valkyrie Wings',
            title: 'Alas Valkiria (Valkyrie Wings)',
            color: '#f43f5e',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 18L7 10L11 19L6 17L10 23L16 25L22 23L26 17L21 19L25 10L16 18Z" fill="#ffffff"/><polygon points="16,13 18,17 16,21 14,17" fill="#f43f5e"/></svg>`
        },
        // 29. Cross (Biohazard Táctico)
        {
            id: 'stitch_tox_hazard',
            name: 'Tox Hazard',
            title: 'Biohazard Táctico (Tox Hazard)',
            color: '#eab308',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="9.5" stroke="#eab308" stroke-width="2"/><path d="M16 9V14M10 20L14 17M22 20L18 17" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/><circle cx="16" cy="16" r="2.5" fill="#eab308"/></svg>`
        },
        // 30. Razor / Clarence Callahan (Jefe Blacklist #1)
        {
            id: 'stitch_blacklist_boss',
            name: 'Blacklist Boss',
            title: 'Jefe #1 Razor (Blacklist Boss)',
            color: '#e2263c',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 5L24 10V18C24 23 20 26.5 16 28C12 26.5 8 23 8 18V10L16 5Z" fill="#e2263c" fill-opacity="0.3" stroke="#e2263c" stroke-width="1.8"/><path d="M11 12H21V19C21 22 18.5 24 16 24.5C13.5 24 11 22 11 19V12Z" fill="#ffffff"/><circle cx="13.5" cy="15.5" r="1.3" fill="#111622"/><circle cx="18.5" cy="15.5" r="1.3" fill="#111622"/><path d="M14 20H18" stroke="#e2263c" stroke-width="1.5" stroke-linecap="round"/></svg>`
        },
        // 31. Bull / Toru Sato (Minotauro de Hierro)
        {
            id: 'stitch_iron_minotaur',
            name: 'Iron Minotaur',
            title: 'Minotauro Bull (Iron Minotaur)',
            color: '#f59e0b',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9C9 8 13 11 14 15L12 17C10 13 8 12 6 9Z" fill="#ffffff"/><path d="M26 9C23 8 19 11 18 15L20 17C22 13 24 12 26 9Z" fill="#ffffff"/><path d="M11 14H21L19 25L16 27L13 25L11 14Z" fill="#ffffff"/><circle cx="13.5" cy="18" r="1" fill="#f59e0b"/><circle cx="18.5" cy="18" r="1" fill="#f59e0b"/><polygon points="16,21 17.5,23 14.5,23" fill="#111622"/></svg>`
        },
        // 32. Ronnie / Ronald McCrea (Halcón)
        {
            id: 'stitch_falcon_ace',
            name: 'Falcon Ace',
            title: 'Halcón Ronnie (Falcon Ace)',
            color: '#38bdf8',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6L21 12L28 14L21 19L22 26L16 22L10 26L11 19L4 14L11 12L16 6Z" fill="#ffffff"/><polygon points="16,11 19,16 16,20 13,16" fill="#38bdf8"/></svg>`
        },
        // 33. JV / Joe Vega (As de Picas)
        {
            id: 'stitch_shadow_gambler',
            name: 'Shadow Gambler',
            title: 'As de Picas JV (Shadow Gambler)',
            color: '#8b5cf6',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6C13 11 8 15 8 18C8 21 11 23 14 22L13 26H19L18 22C21 23 24 21 24 18C24 15 19 11 16 6Z" fill="#ffffff"/><circle cx="16" cy="16" r="2.5" fill="#8b5cf6"/></svg>`
        },
        // 34. Webster / Wes Allen (Colmillo Arácnido)
        {
            id: 'stitch_arachnid_fang',
            name: 'Arachnid Fang',
            title: 'Colmillo Webster (Arachnid Fang)',
            color: '#06b6d4',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6L24 11V21L16 26L8 21V11L16 6Z" stroke="#06b6d4" stroke-width="1.8"/><circle cx="16" cy="16" r="4" fill="#ffffff"/><path d="M16 6V12M16 20V26M8 11L13 14M19 18L24 21M24 11L19 14M13 18L8 21" stroke="#ffffff" stroke-width="1.5"/></svg>`
        },
        // 35. Ming / Hector Domingo (Aliento de Dragón)
        {
            id: 'stitch_dragon_breath',
            name: 'Dragon Breath',
            title: 'Dragón Ming (Dragon Breath)',
            color: '#10b981',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 5C17 9 20 11 22 14C23.5 18 20 23 16 26C12 23 8.5 18 10 14C12 11 15 9 16 5Z" fill="#ffffff"/><circle cx="16" cy="17" r="3" fill="#10b981"/><circle cx="16" cy="17" r="1.5" fill="#ffffff"/></svg>`
        },
        // 36. Kaze / Kira Nakazato (Vórtice Tempestad)
        {
            id: 'stitch_tempest_visor',
            name: 'Tempest Visor',
            title: 'Tempestad Kaze (Tempest Visor)',
            color: '#ec4899',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="10" stroke="#ec4899" stroke-width="2"/><path d="M16 8C19 8 22 11 22 14C22 17 19 19 16 19C13 19 11 17 11 15" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="16" r="1.5" fill="#ec4899"/></svg>`
        },
        // 37. Jewels / Jade Barrett (Diamante Prisma)
        {
            id: 'stitch_prism_valkyrie',
            name: 'Prism Valkyrie',
            title: 'Diamante Jewels (Prism Valkyrie)',
            color: '#14b8a6',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="11,7 21,7 26,13 16,26 6,13" fill="#ffffff"/><polygon points="13,9 19,9 23,13 16,22 9,13" fill="#14b8a6"/><polygon points="14,11 18,11 20,13 16,19 12,13" fill="#ffffff"/></svg>`
        },
        // 38. Earl / Eugene James (Ancla de Hierro)
        {
            id: 'stitch_iron_anchor',
            name: 'Iron Anchor',
            title: 'Ancla Earl (Iron Anchor)',
            color: '#64748b',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="9" r="3" stroke="#ffffff" stroke-width="2"/><path d="M16 12V24M11 14H21M8 19C9 24 13 26 16 26C19 26 23 24 24 19" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="20" r="1.5" fill="#64748b"/></svg>`
        },
        // 39. Baron / Karl Smit (Águila Imperial)
        {
            id: 'stitch_royal_eagle',
            name: 'Royal Eagle',
            title: 'Águila Baron (Royal Eagle)',
            color: '#eab308',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6L20 12L27 10L23 18L26 25L16 22L6 25L9 18L5 10L12 12L16 6Z" fill="#ffffff"/><circle cx="16" cy="15" r="2.5" fill="#eab308"/></svg>`
        },
        // 40. Vic / Victor Vasquez (Cruz Táctica)
        {
            id: 'stitch_sniper_cross',
            name: 'Sniper Cross',
            title: 'Cruz Vic (Sniper Cross)',
            color: '#2563eb',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="9" stroke="#2563eb" stroke-width="2"/><path d="M16 5V27M5 16H27" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="16" r="3" fill="#2563eb"/><circle cx="16" cy="16" r="1.2" fill="#ffffff"/></svg>`
        },
        // 41. Izzy / Isabel Diaz (Loto Cyber)
        {
            id: 'stitch_cyber_lotus',
            name: 'Cyber Lotus',
            title: 'Loto Izzy (Cyber Lotus)',
            color: '#22c55e',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6C14 11 14 18 16 23C18 18 18 11 16 6Z" fill="#ffffff"/><path d="M11 10C11 14 13 19 16 23C14 18 12 14 11 10Z" fill="#22c55e"/><path d="M21 10C21 14 19 19 16 23C18 18 20 14 21 10Z" fill="#22c55e"/></svg>`
        },
        // 42. Big Lou / Lou Park (Pistones Cruzados)
        {
            id: 'stitch_twin_pistons',
            name: 'Twin Pistons',
            title: 'Pistones Big Lou (Twin Pistons)',
            color: '#ea580c',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="7" width="6" height="8" rx="1" fill="#ffffff"/><rect x="19" y="7" width="6" height="8" rx="1" fill="#ffffff"/><path d="M10 15L15 25M22 15L17 25" stroke="#ea580c" stroke-width="2.5" stroke-linecap="round"/><circle cx="16" cy="25" r="2" fill="#ffffff"/></svg>`
        },
        // 43. Taz / Vince Kilic (Aguijón del Desierto)
        {
            id: 'stitch_desert_stinger',
            name: 'Desert Stinger',
            title: 'Aguijón Taz (Desert Stinger)',
            color: '#d97706',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6C18 10 22 12 21 16C20 19 17 20 16 23C15 20 12 19 11 16C10 12 14 10 16 6Z" fill="#ffffff"/><polygon points="16,13 18,17 16,21 14,17" fill="#d97706"/><circle cx="16" cy="25" r="1.5" fill="#ffffff"/></svg>`
        },
        // 44. Sonny / Ho Seun (Cráneo Llameante)
        {
            id: 'stitch_inferno_skull',
            name: 'Inferno Skull',
            title: 'Cráneo Sonny (Inferno Skull)',
            color: '#f43f5e',
            svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 13C9 8.5 12 6 16 6C20 6 23 8.5 23 13C23 17 21 19 20 22H12C11 19 9 17 9 13Z" fill="#ffffff"/><circle cx="13" cy="14" r="1.5" fill="#111622"/><circle cx="19" cy="14" r="1.5" fill="#111622"/><path d="M14 20H18" stroke="#f43f5e" stroke-width="1.5" stroke-linecap="round"/></svg>`
        }
    ];

    // =======================================================
    // ASIGNACIONES CANÓNICAS EXPLÍCITAS (LÍDERES, PILOTOS Y JEFES)
    // =======================================================
    const CANONICAL_MAP = {
        // 1. Ciudad Perímetro / Google Stitch Leaderboard
        'LEA4SPEED0': 'stitch_chrono_blade',
        'LEOSPEED': 'stitch_chrono_blade',
        'LEO SPEED': 'stitch_chrono_blade',
        'SRTXAVENGER': 'stitch_apex_wolf',
        'SRTXAVENGER™': 'stitch_apex_wolf',
        'XMAN': 'stitch_valiant_shield',
        'SAITKB': 'stitch_ghost_pin',
        'ZIMANX': 'stitch_viper_strike',
        'ZIMANX™️': 'stitch_viper_strike',
        'ZIMANX™': 'stitch_viper_strike',
        'SKYMASTER': 'stitch_crusader_helm',
        'JS': 'stitch_racing_helmet',
        'DARKRAI': 'stitch_thunder_bolt',
        'GABRIEL NORIEGA': 'stitch_spartan_gladiator',
        'DANNYLOVE': 'stitch_winged_ace',
        'AIRMAX': 'stitch_supersonic_dart',
        'X1PROCL': 'stitch_stealth_starfighter',
        'DARKSHIDO': 'stitch_ninja_star',
        'SHIDO': 'stitch_ninja_star',
        'NEBULA': 'stitch_cosmic_saturn',

        // 2. Pilotos de la Comunidad y Roster de Récords
        'MIKE': 'stitch_viper_fang',
        '5TATIC': 'stitch_reactor_core',
        '13MWRR': 'stitch_twin_turbo',
        'ARS3N': 'stitch_dragon_fire',
        'HIGHPRIEST': 'stitch_sacred_crown',
        'INFACTUS612': 'stitch_sniper_crosshair',
        'SILENTIUMM': 'stitch_phantom_visor',
        'ZONDA': 'stitch_quad_exhaust',
        'SSJOEN': 'stitch_velocity_chevron',
        'ZIPPER': 'stitch_cyber_pilot',
        'DJALIL': 'stitch_shadow_tiger',
        'NIGHTRIDERZ': 'stitch_cyber_oni',
        'ROG': 'stitch_interceptor_shield',
        'MIA': 'stitch_valkyrie_wings',
        'CROSS': 'stitch_tox_hazard',

        // 3. Blacklist Jefes
        'RAZOR': 'stitch_blacklist_boss',
        'CLARENCE CALLAHAN': 'stitch_blacklist_boss',
        'BULL': 'stitch_iron_minotaur',
        'TORU SATO': 'stitch_iron_minotaur',
        'RONNIE': 'stitch_falcon_ace',
        'RONALD MCCREA': 'stitch_falcon_ace',
        'JV': 'stitch_shadow_gambler',
        'JOE VEGA': 'stitch_shadow_gambler',
        'WEBSTER': 'stitch_arachnid_fang',
        'WES ALLEN': 'stitch_arachnid_fang',
        'MING': 'stitch_dragon_breath',
        'HECTOR DOMINGO': 'stitch_dragon_breath',
        'KAZE': 'stitch_tempest_visor',
        'KIRA NAKAZATO': 'stitch_tempest_visor',
        'JEWELS': 'stitch_prism_valkyrie',
        'JADE BARRETT': 'stitch_prism_valkyrie',
        'EARL': 'stitch_iron_anchor',
        'EUGENE JAMES': 'stitch_iron_anchor',
        'BARON': 'stitch_royal_eagle',
        'KARL SMIT': 'stitch_royal_eagle',
        'VIC': 'stitch_sniper_cross',
        'VICTOR VASQUEZ': 'stitch_sniper_cross',
        'IZZY': 'stitch_cyber_lotus',
        'ISABEL DIAZ': 'stitch_cyber_lotus',
        'BIG LOU': 'stitch_twin_pistons',
        'LOU PARK': 'stitch_twin_pistons',
        'BIGLOU': 'stitch_twin_pistons',
        'TAZ': 'stitch_desert_stinger',
        'VINCE KILIC': 'stitch_desert_stinger',
        'SONNY': 'stitch_inferno_skull',
        'HO SEUN': 'stitch_inferno_skull'
    };

    // =======================================================
    // REGISTRO DE ASIGNACIÓN ÚNICA Y MAPA DE ALIAS
    // =======================================================
    const STORAGE_KEY = 'nfs_player_operator_registry_v5';

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
     */
    function linkPlayerAliases(name, alias) {
        const normName = normalizeKey(name);
        const normAlias = normalizeKey(alias);

        if (!normName && !normAlias) return;

        const canonical = normAlias || normName;

        if (normName) aliasToCanonical.set(normName, canonical);
        if (normAlias) aliasToCanonical.set(normAlias, canonical);

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
            if (typeof localStorage !== 'undefined') {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (typeof parsed === 'object' && parsed !== null) {
                        Object.entries(parsed).forEach(([player, opId]) => {
                            const normKey = normalizeKey(player);
                            const opExists = OPERATOR_CATALOG.some(o => o.id === opId) || opId.startsWith('stitch_procedural_');
                            if (opExists) {
                                playerToOperatorId.set(normKey, opId);
                                claimedOperatorIds.add(opId);
                            }
                        });
                    }
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
            if (typeof localStorage !== 'undefined') {
                const obj = {};
                playerToOperatorId.forEach((opId, player) => {
                    obj[player] = opId;
                });
                localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
            }
        } catch (e) {}
    }

    /**
     * Generador Procedural Estilo Google Stitch para pilotos nuevos dinámicos.
     * Garantiza un SVG minimalista, de alto contraste con borde de neón.
     */
    function generateProceduralOperator(playerId, seedNumber) {
        const colors = [
            '#00e5ff', '#ff7a00', '#00a2ff', '#b55fe6', '#ff4500',
            '#00dbe9', '#ffc400', '#8b5cf6', '#ffb800', '#10b981',
            '#ec4899', '#f97316', '#06b6d4', '#eab308', '#22c55e', '#a855f7'
        ];
        const color = colors[seedNumber % colors.length];

        const shapes = [
            // 0: Hexágono Prisma
            `<polygon points="16,6 25,11 25,21 16,26 7,21 7,11" stroke="${color}" stroke-width="2"/><circle cx="16" cy="16" r="3.5" fill="#ffffff"/>`,
            // 1: Caza Delta
            `<path d="M16 6L23 23L16 19L9 23L16 6Z" fill="#ffffff"/><circle cx="16" cy="17" r="1.5" fill="${color}"/>`,
            // 2: Diamante Núcleo
            `<polygon points="16,6 26,16 16,26 6,16" stroke="${color}" stroke-width="2"/><rect x="13.5" y="13.5" width="5" height="5" transform="rotate(45 16 16)" fill="#ffffff"/>`,
            // 3: Mira Retícula
            `<circle cx="16" cy="16" r="9" stroke="#ffffff" stroke-width="1.8"/><path d="M16 5V27M5 16H27" stroke="${color}" stroke-width="1.8"/><circle cx="16" cy="16" r="2.5" fill="#ffffff"/>`,
            // 4: Escudo Octagonal
            `<path d="M10 7H22L26 11V21L22 25H10L6 21V11L10 7Z" fill="#ffffff"/><circle cx="16" cy="16" r="4" fill="${color}"/>`,
            // 5: Rosa Náutica
            `<polygon points="16,5 19,13 27,16 19,19 16,27 13,19 5,16 13,13" fill="#ffffff"/><circle cx="16" cy="16" r="2.5" fill="${color}"/>`,
            // 6: Visera de Carrera
            `<path d="M8 12C8 8 11.5 6 16 6C20.5 6 24 8 24 12V18C24 22 20.5 24 16 24C11.5 24 8 22 8 18V12Z" fill="#ffffff"/><rect x="10.5" y="13" width="11" height="5" rx="2" fill="#111622"/><path d="M12 15.5H20" stroke="${color}" stroke-width="1.5"/>`,
            // 7: Átomo Orbital
            `<circle cx="16" cy="16" r="3.5" fill="#ffffff"/><ellipse cx="16" cy="16" rx="10" ry="4" stroke="${color}" stroke-width="1.8" transform="rotate(30 16 16)"/><ellipse cx="16" cy="16" rx="10" ry="4" stroke="${color}" stroke-width="1.8" transform="rotate(-30 16 16)"/>`,
            // 8: Impulsor Turbo
            `<circle cx="16" cy="16" r="9" stroke="${color}" stroke-width="2"/><path d="M16 7V16L22 13M16 25V16L10 19" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="16" r="2" fill="${color}"/>`,
            // 9: Llama Chevron
            `<path d="M16 6L24 14L20 18L16 14L12 18L8 14L16 6Z" fill="#ffffff"/><polygon points="16,13 19,16 16,20 13,16" fill="${color}"/>`,
            // 10: Relámpago Flash
            `<path d="M17 5L9 16H15L13 27L23 14H16.5L17 5Z" fill="#ffffff"/><polygon points="16,8 11.5,15 15,15 14,23 20.5,14 16,14" fill="${color}"/>`,
            // 11: Corona Espartana
            `<path d="M16 5L24 9V17C24 22 20.5 25.5 16 27C11.5 25.5 8 22 8 17V9L16 5Z" fill="#ffffff"/><path d="M12 12H20V14.5H12V12Z" fill="#111622"/><path d="M15 16H17V22H15V16Z" fill="${color}"/>`,
            // 12: Alas Aerodinámicas
            `<path d="M6 13L16 18L26 13L16 8L6 13Z" fill="#ffffff"/><path d="M6 19L16 24L26 19L16 14L6 19Z" fill="${color}"/>`,
            // 13: Dial Cronógrafo
            `<circle cx="16" cy="16" r="10" stroke="${color}" stroke-width="2"/><path d="M16 10V16L20 18" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="16" r="1.5" fill="${color}"/>`,
            // 14: Tri-Pico
            `<polygon points="16,6 26,24 6,24" stroke="${color}" stroke-width="2"/><polygon points="16,12 21,21 11,21" fill="#ffffff"/>`,
            // 15: Shuriken Vortex
            `<polygon points="16,5 19,13 27,16 19,19 16,27 13,19 5,16 13,13" fill="${color}"/><circle cx="16" cy="16" r="3.5" fill="#ffffff"/>`
        ];

        const chosenShape = shapes[seedNumber % shapes.length];
        const svg = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">${chosenShape}</svg>`;

        return {
            id: playerId,
            name: `Piloto #${seedNumber + 1}`,
            title: `Insignia #${seedNumber + 1}`,
            color: color,
            svg: svg
        };
    }

    /**
     * Obtiene el operador correspondiente a un nombre de jugador de manera determinista y con garantía de UNICIDAD.
     */
    function getPlayerOperator(playerName) {
        if (!playerName || typeof playerName !== 'string') {
            return OPERATOR_CATALOG[0];
        }

        const raw = playerName.trim();
        const norm = normalizeKey(raw);

        // 1. Verificar si este nombre (o un alias vinculado) ya tiene asignación canónica
        let opId = playerToOperatorId.get(norm);
        if (!opId && aliasToCanonical.has(norm)) {
            const canonical = aliasToCanonical.get(norm);
            opId = playerToOperatorId.get(canonical);
        }

        // Si no está registrado pero está en CANONICAL_MAP directamente
        if (!opId && CANONICAL_MAP[norm]) {
            opId = CANONICAL_MAP[norm];
            playerToOperatorId.set(norm, opId);
            claimedOperatorIds.add(opId);
        }

        if (opId) {
            const found = OPERATOR_CATALOG.find(op => op.id === opId);
            if (found) return found;
            if (opId.startsWith('stitch_procedural_')) {
                const seed = parseInt(opId.split('_')[2], 10) || 0;
                return generateProceduralOperator(opId, seed);
            }
        }

        // 2. Si no tiene asignación, encontrar un operador NO RECLAMADO en el catálogo
        let hash = 0;
        for (let i = 0; i < norm.length; i++) {
            hash = norm.charCodeAt(i) + ((hash << 5) - hash);
        }
        const prefIdx = Math.abs(hash) % OPERATOR_CATALOG.length;

        let selectedOp = null;

        for (let i = 0; i < OPERATOR_CATALOG.length; i++) {
            const candidateIdx = (prefIdx + i) % OPERATOR_CATALOG.length;
            const candidate = OPERATOR_CATALOG[candidateIdx];
            if (!claimedOperatorIds.has(candidate.id)) {
                selectedOp = candidate;
                break;
            }
        }

        // 3. Si todos están ocupados, generar procedural único
        if (!selectedOp) {
            const procId = `stitch_procedural_${claimedOperatorIds.size}`;
            selectedOp = generateProceduralOperator(procId, claimedOperatorIds.size);
        }

        // 4. Registrar y persistir
        playerToOperatorId.set(norm, selectedOp.id);
        claimedOperatorIds.add(selectedOp.id);

        if (aliasToCanonical.has(norm)) {
            const canonical = aliasToCanonical.get(norm);
            playerToOperatorId.set(canonical, selectedOp.id);
        }

        persistRegistry();
        return selectedOp;
    }

    /**
     * Genera el HTML del contenedor del badge estilo Google Stitch.
     */
    function getOperatorBadgeHTML(driverName, extraClass = '') {
        const op = getPlayerOperator(driverName);
        const cls = extraClass ? `operator-badge-box stitch-operator-badge ${extraClass}` : 'operator-badge-box stitch-operator-badge';
        return `
            <div class="${cls}" style="--op-color: ${op.color}; --op-bg: #111622;" title="Piloto: ${safeText(driverName)} (${op.title || op.name})">
                ${op.svg}
            </div>
        `.trim();
    }

    /**
     * Genera la celda completa del piloto: Silueta SVG + Nombre
     */
    function getDriverCellHTML(driverName, extraInfoHTML = '') {
        const badgeHTML = getOperatorBadgeHTML(driverName);
        const nameClean = (driverName || 'Desconocido').trim();
        return `
            <div class="driver-name-cell-wrapper notranslate" translate="no">
                ${badgeHTML}
                <div class="driver-cell-info-col">
                    <span class="driver-name-text notranslate" translate="no">${nameClean}</span>
                    ${extraInfoHTML ? `<div class="driver-cell-extra-info">${extraInfoHTML}</div>` : ''}
                </div>
            </div>
        `.trim();
    }

    // Inicializar registro al cargar
    initRegistry();

    // Exponer globalmente en window
    const root = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this);
    root.NFSOperators = {
        catalog: OPERATOR_CATALOG,
        getPlayerOperator: getPlayerOperator,
        getOperatorBadgeHTML: getOperatorBadgeHTML,
        getDriverCellHTML: getDriverCellHTML,
        linkPlayerAliases: linkPlayerAliases
    };

})();
