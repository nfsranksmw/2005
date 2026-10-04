const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'assets', 'js', 'app.js');
let code = fs.readFileSync(appPath, 'utf8');

console.log("Original app.js length:", code.length);

// 1. Update renderLoadMoreButton and removeLoadMoreButton
const oldLoadMoreBlock = `function renderLoadMoreButton(tbodyId, onClickHandler) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const tableContainer = tbody.closest('.table-container') || tbody.parentElement;
    let btnContainer = tableContainer.nextElementSibling;

    if (!btnContainer || !btnContainer.classList.contains('load-more-wrapper')) {
        btnContainer = document.createElement('div');
        btnContainer.className = 'load-more-wrapper';
        btnContainer.style.cssText = 'text-align: center; margin: 18px 0 30px 0;';
        tableContainer.parentNode.insertBefore(btnContainer, tableContainer.nextSibling);
    }

    const loadMoreText = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.t) ? window.nfsI18n.t('btn_load_more_drivers') : 'Load more drivers';
    btnContainer.innerHTML = \`
        <button class="btn-load-more" data-i18n="btn_load_more_drivers">
            \`;`;

// Replace renderLoadMoreButton & removeLoadMoreButton robustly
code = code.replace(/function renderLoadMoreButton\(tbodyId, onClickHandler\) \{[\s\S]*?function removeLoadMoreButton\(tbodyId\) \{[\s\S]*?const tableContainer = tbody\.closest\('\.table-container'\) \|\| tbody\.parentElement;[\s\S]*?const btnContainer = tableContainer\.nextElementSibling;[\s\S]*?if \(btnContainer && btnContainer\.classList\.contains\('load-more-wrapper'\)\) \{[\s\S]*?btnContainer\.remove\(\);[\s\S]*?\}[\s\S]*?\}/,
`function renderLoadMoreButton(tbodyId, onClickHandler) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const tableContainer = tbody.closest('.stitch-table-card') || tbody.closest('.table-container') || tbody.parentElement;
    let btnContainer = tableContainer.nextElementSibling;

    if (!btnContainer || !btnContainer.classList.contains('load-more-wrapper')) {
        btnContainer = document.createElement('div');
        btnContainer.className = 'load-more-wrapper';
        btnContainer.style.cssText = 'text-align: center; margin: 18px 0 30px 0;';
        tableContainer.parentNode.insertBefore(btnContainer, tableContainer.nextSibling);
    }

    const loadMoreText = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.t) ? window.nfsI18n.t('btn_load_more_drivers') : 'Load more drivers';
    btnContainer.innerHTML = \`
        <button class="btn-load-more" data-i18n="btn_load_more_drivers">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="vertical-align:-1.5px; margin-right:4px;"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
            \${loadMoreText}
        </button>
    \`;

    const btn = btnContainer.querySelector('.btn-load-more');
    btn.onclick = onClickHandler;
}

function removeLoadMoreButton(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    const tableContainer = tbody.closest('.stitch-table-card') || tbody.closest('.table-container') || tbody.parentElement;
    const btnContainer = tableContainer.nextElementSibling;
    if (btnContainer && btnContainer.classList.contains('load-more-wrapper')) {
        btnContainer.remove();
    }
}`);

// 2. Replace Past Tournaments renderers (lines ~5910-6126)
const oldPastBlockRegex = /function renderPastTournamentHero\(t\) \{[\s\S]*?function renderPastTournamentStats\(t\) \{[\s\S]*?function renderPastTournamentBrackets\(t\) \{[\s\S]*?function renderPastTournamentPodium\(t\) \{[\s\S]*?function renderPastTournamentParticipants\(t\) \{[\s\S]*?tbody\.innerHTML = html;\s*\}/;

const newPastBlock = `function renderPastTournamentHero(t) {
    const heroEl = document.getElementById('past-tournament-hero');
    if (!heroEl) return;
    const curLang = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en';

    const organizedText = (curLang === 'es')
        ? \`Organizado y disputado bajo las normas oficiales de <strong>\${t.platform}</strong>. \${t.hosts ? \`Coordinación y arbitraje: <span style="color: var(--nfs-orange);">\${t.hosts}</span>.\` : ''}\`
        : ((curLang === 'pt')
            ? \`Organizado e disputado sob as regras oficiais de <strong>\${t.platform}</strong>. \${t.hosts ? \`Coordenação e arbitragem: <span style="color: var(--nfs-orange);">\${t.hosts}</span>.\` : ''}\`
            : \`Organized and disputed under the official rules of <strong>\${t.platform}</strong>. \${t.hosts ? \`Coordination and arbitration: <span style="color: var(--nfs-orange);">\${t.hosts}</span>.\` : ''}\`);

    const btnText = (curLang === 'es')
        ? 'Ver Bracket Oficial en Challonge'
        : ((curLang === 'pt') ? 'Ver Chave Oficial no Challonge' : 'View Official Bracket on Challonge');

    heroEl.innerHTML = \`
        <div class="past-hero-content">
            <div class="past-hero-badges">
                <span class="past-badge-edition">\${t.edition}</span>
                <span class="past-badge-date">📅 \${t.date}</span>
                <span class="past-badge-category">⚙️ \${t.category}</span>
                <span class="past-badge-format">⚔️ \${t.format}</span>
            </div>
            <h2 class="past-hero-title">\${t.title}</h2>
            <p class="past-hero-desc">
                \${organizedText}
            </p>
        </div>
        <div class="past-hero-actions">
            <a href="\${t.challongeUrl}" target="_blank" rel="noopener noreferrer" class="btn-challonge-link-hero">
                <span>🔗</span> \${btnText}
            </a>
        </div>
    \`;
}

function renderPastTournamentStats(t) {
    const statsEl = document.getElementById('past-tournament-stats-bar');
    if (!statsEl) return;
    const curLang = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en';

    const lblChamp = (curLang === 'es') ? 'CAMPEÓN HISTÓRICO' : ((curLang === 'pt') ? 'CAMPEÃO HISTÓRICO' : 'HISTORICAL CHAMPION');
    const lblRunner = (curLang === 'es') ? 'SUBCAMPEÓN' : ((curLang === 'pt') ? 'VICE-CAMPEÃO' : 'RUNNER-UP');
    const lblDrivers = (curLang === 'es') ? 'PILOTOS EN EL CUADRO' : ((curLang === 'pt') ? 'PILOTOS NA CHAVE' : 'DRIVERS IN BRACKET');
    const unitDrivers = (curLang === 'es') ? 'Corredores' : ((curLang === 'pt') ? 'Pilotos' : 'Drivers');
    const lblMatches = (curLang === 'es') ? 'PARTIDAS DISPUTADAS' : ((curLang === 'pt') ? 'PARTIDAS DISPUTADAS' : 'MATCHES PLAYED');
    const unitMatches = (curLang === 'es') ? 'Enfrentamientos' : ((curLang === 'pt') ? 'Confrontos' : 'Matches');

    statsEl.innerHTML = \`
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">👑</span>
            <div class="challenge-summary-content">
                <span class="challenge-summary-label">\${lblChamp}</span>
                <span class="challenge-summary-val" style="color: #ffd700; font-weight: 800;">\${t.stats.champion} 🥇</span>
            </div>
        </div>
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">🥈</span>
            <div class="challenge-summary-content">
                <span class="challenge-summary-label">\${lblRunner}</span>
                <span class="challenge-summary-val" style="color: #e2e8f0;">\${t.stats.runnerUp}</span>
            </div>
        </div>
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">🏎️</span>
            <div class="challenge-summary-content">
                <span class="challenge-summary-label">\${lblDrivers}</span>
                <span class="challenge-summary-val" style="color: #38bdf8; font-family: var(--font-mono);">\${t.stats.totalPilots} \${unitDrivers}</span>
            </div>
        </div>
        <div class="challenge-summary-item">
            <span class="challenge-summary-icon">⚔️</span>
            <div class="challenge-summary-content">
                <span class="challenge-summary-label">\${lblMatches}</span>
                <span class="challenge-summary-val" style="color: var(--green-neon); font-family: var(--font-mono);">\${t.stats.totalMatches} \${unitMatches}</span>
            </div>
        </div>
    \`;
}

function renderPastTournamentBrackets(t) {
    const container = document.getElementById('past-brackets-container');
    if (!container) return;
    const curLang = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en';

    let html = '';

    t.bracketSections.forEach(sec => {
        const roundWord = sec.rounds.length === 1 ? ((curLang === 'es' || curLang === 'pt') ? 'Ronda' : 'Round') : ((curLang === 'es' || curLang === 'pt') ? 'Rondas' : 'Rounds');
        html += \`
            <div class="bracket-section-block bracket-section-\${sec.sectionId}">
                <div class="bracket-section-header">
                    <h3>\${sec.sectionTitle}</h3>
                    <span class="bracket-rounds-count">\${sec.rounds.length} \${roundWord}</span>
                </div>
                <div class="bracket-tree-scrollable">
                    <div class="bracket-tree">
        \`;

        sec.rounds.forEach((round, rIdx) => {
            html += \`
                <div class="bracket-round">
                    <div class="bracket-round-header">
                        <span class="round-number">R\${rIdx + 1}</span>
                        <h4>\${round.roundName}</h4>
                    </div>
                    <div class="bracket-matches-col">
            \`;

            round.matches.forEach(m => {
                const p1Winner = m.p1.winner;
                const p2Winner = m.p2.winner;
                const isGrandFinal = sec.sectionId === 'finals' || m.id === 26 || m.id === 14;
                const grandFinalText = (curLang === 'es') ? '👑 GRAN FINAL' : ((curLang === 'pt') ? '👑 GRANDE FINAL' : '👑 GRAND FINAL');
                const winnerLabel = (curLang === 'es') ? 'Vencedor:' : ((curLang === 'pt') ? 'Vencedor:' : 'Winner:');
                const pendingLabel = (curLang === 'es') ? 'Por disputar' : ((curLang === 'pt') ? 'A disputar' : 'TBD');

                html += \`
                    <div class="bracket-match-card \${isGrandFinal ? 'match-grand-final' : ''}">
                        <div class="match-meta">
                            <span class="match-id-badge">MATCH #\${m.id}</span>
                            \${isGrandFinal ? \`<span class="grand-final-badge">\${grandFinalText}</span>\` : ''}
                        </div>
                        <div class="match-competitors">
                            <!-- Jugador 1 -->
                            <div class="match-player-row \${p1Winner ? 'is-winner' : 'is-loser'}">
                                <span class="player-seed">#\${m.p1.seed}</span>
                                <span class="player-name">\${m.p1.name}</span>
                                \${p1Winner ? '<span class="winner-crown-icon">👑</span>' : ''}
                                <span class="player-score \${p1Winner ? 'score-winner' : ''}">\${m.p1.score}</span>
                            </div>
                            <div class="match-row-divider"></div>
                            <!-- Jugador 2 -->
                            <div class="match-player-row \${p2Winner ? 'is-winner' : 'is-loser'}">
                                <span class="player-seed">#\${m.p2.seed}</span>
                                <span class="player-name">\${m.p2.name}</span>
                                \${p2Winner ? '<span class="winner-crown-icon">👑</span>' : ''}
                                <span class="player-score \${p2Winner ? 'score-winner' : ''}">\${m.p2.score}</span>
                            </div>
                        </div>
                        <div class="match-status-footer">
                            <span class="match-verdict">
                                \${winnerLabel} <strong style="color: \${p1Winner || p2Winner ? 'var(--green-neon)' : 'var(--text-muted)'};">\${p1Winner ? m.p1.name : (p2Winner ? m.p2.name : pendingLabel)}</strong>
                            </span>
                        </div>
                    </div>
                \`;
            });

            html += \`
                    </div>
                </div>
            \`;
        });

        html += \`
                    </div>
                </div>
            </div>
        \`;
    });

    container.innerHTML = html;
}

function renderPastTournamentPodium(t) {
    const container = document.getElementById('past-podium-container');
    if (!container) return;
    const curLang = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en';

    let html = \`
        <div class="past-podium-grid">
    \`;

    t.podium.forEach(item => {
        const medalClass = item.place === 1 ? 'podium-gold' : (item.place === 2 ? 'podium-silver' : (item.place === 3 ? 'podium-bronze' : 'podium-honor'));
        const seedText = (curLang === 'es') ? \`CABEZA DE SERIE #\${item.seed}\` : ((curLang === 'pt') ? \`CABEÇA DE CHAVE #\${item.seed}\` : \`TOP SEED #\${item.seed}\`);
        html += \`
            <div class="past-podium-card \${medalClass}">
                <div class="podium-card-glow"></div>
                <div class="podium-place-badge">
                    <span class="podium-medal">\${item.medal}</span>
                    <span class="podium-rank-text">\${item.rankName}</span>
                </div>
                <div class="podium-driver-info">
                    <span class="podium-seed">\${seedText}</span>
                    <h3 class="podium-driver-name">\${item.name}</h3>
                </div>
                <div class="podium-driver-note">
                    <p>\${item.note}</p>
                </div>
                <div class="podium-card-footer">
                    <span class="podium-event-tag">\${t.shortTitle}</span>
                </div>
            </div>
        \`;
    });

    html += \`
        </div>
    \`;

    container.innerHTML = html;
}

function renderPastTournamentParticipants(t) {
    const tbody = document.getElementById('tbody-past-participants');
    if (!tbody) return;
    const curLang = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en';

    let html = '';
    t.participants.forEach(p => {
        const isPodium = p.finalPos.includes('Campeón') || p.finalPos.includes('Campeão') || p.finalPos.includes('Champion') || p.finalPos.includes('Lugar') || p.finalPos.includes('Place') || p.finalPos.includes('Campe');
        const posClass = (p.finalPos.includes('Campeón') || p.finalPos.includes('Campeão') || p.finalPos.includes('Champion') || p.finalPos.includes('Campe')) ? 'pos-champion' : (p.finalPos.includes('2do') || p.finalPos.includes('2nd') ? 'pos-silver' : (p.finalPos.includes('3er') || p.finalPos.includes('3rd') ? 'pos-bronze' : ''));

        const statusNote = (p.finalPos.includes('Campeón') || p.finalPos.includes('Champion') || p.finalPos.includes('Campe'))
            ? ((curLang === 'es') ? '🏆 Gran Finalista Vencedor' : ((curLang === 'pt') ? '🏆 Grande Finalista Vencedor' : '🏆 Grand Final Winner'))
            : (p.finalPos.includes('2do') || p.finalPos.includes('2nd'))
                ? ((curLang === 'es') ? '⚔️ Gran Finalista' : ((curLang === 'pt') ? '⚔️ Grande Finalista' : '⚔️ Grand Finalist'))
                : ((curLang === 'es') ? 'Completó cuadro de llaves' : ((curLang === 'pt') ? 'Completou chave do torneio' : 'Completed tournament bracket'));

        const verifiedBadge = (curLang === 'es') ? '✓ Verificado Challonge' : ((curLang === 'pt') ? '✓ Verificado Challonge' : '✓ Challonge Verified');

        html += \`
            <tr class="\${isPodium ? 'row-podium' : ''}">
                <td style="font-family: var(--font-mono); font-weight: 700; color: var(--nfs-orange); text-align: center;">#\${p.seed}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <strong style="color: #ffffff; font-size: 14px; font-family: 'Chivo', sans-serif;">\${p.name}</strong>
                        \${(p.finalPos.includes('Campeón') || p.finalPos.includes('Champion') || p.finalPos.includes('Campe')) ? '<span class="crown-badge">👑 1°</span>' : ''}
                    </div>
                </td>
                <td>
                    <span class="past-final-pos \${posClass}">\${p.finalPos}</span>
                </td>
                <td style="color: var(--text-muted); font-size: 13px;">
                    \${statusNote}
                </td>
                <td>
                    <span class="badge-verified-challonge">\${verifiedBadge}</span>
                </td>
            </tr>
        \`;
    });

    tbody.innerHTML = html;
}`;

code = code.replace(oldPastBlockRegex, newPastBlock);

// 3. Update HOME_LIVE_LEADERBOARD_RECORDS routeType to English
code = code.replace(
    /const HOME_LIVE_LEADERBOARD_RECORDS = \[[\s\S]*?\];/,
`const HOME_LIVE_LEADERBOARD_RECORDS = [
    { rank: 1, driver: "Lea4Speed0", time: "1:20.750", car: "Carrera GT", route: "City Perimeter", routeType: "Circuit" },
    { rank: 2, driver: "SRTxAvenger", time: "1:20.767", car: "Carrera GT", route: "City Perimeter", routeType: "Circuit" },
    { rank: 3, driver: "Skymaster", time: "1:14.65", car: "Carrera GT", route: "Seaside & Power Station", routeType: "Sprint" },
    { rank: 4, driver: "5TATIC", time: "0m 14s 230ms", car: "Carrera GT", route: "Seaside & Camden", routeType: "Drag" },
    { rank: 5, driver: "ZimanX", time: "1:20.87", car: "Carrera GT", route: "City Perimeter", routeType: "Circuit" }
];`
);

// 4. Update syncLiveLeaderboard pin icon
code = code.replace(/<div class="live-lb-track">.*? \$\{route\.name\} \(\$\{route\.type\}\)<\/div>/g,
    `<div class="live-lb-track">📍 \${route.name} (\${route.type})</div>`);

// 5. Update renderStitchDenseTelemetryStream to ensure curLang is defined
code = code.replace(/function renderStitchDenseTelemetryStream\(route\) \{[\s\S]*?const baseWR = getStitchRouteWRData\(route\);/,
`function renderStitchDenseTelemetryStream(route) {
    const container = document.getElementById('stitch-telemetry-stream-container');
    if (!container || !route) return;

    const curLang = (typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en';
    const baseWR = getStitchRouteWRData(route);`);

// 6. Update getStitchRouteMetadata for multilingual support
code = code.replace(/function getStitchRouteMetadata\(route\) \{[\s\S]*?return \{ district, laps, surface, heat \};\s*\}/,
`function getStitchRouteMetadata(route, lang) {
    const curLang = lang || ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage) ? window.nfsI18n.getCurrentLanguage() : 'en');
    const name = route.name || '';
    const type = route.type || 'Circuito';
    const lower = name.toLowerCase();

    let district = 'Downtown Rockport';
    if (lower.includes('camden') || lower.includes('beach') || lower.includes('coast') || lower.includes('ocean') || lower.includes('dock') || lower.includes('highlands')) {
        district = 'Camden Beach';
    } else if (lower.includes('rosewood') || lower.includes('campus') || lower.includes('ironwood') || lower.includes('union') || lower.includes('omega') || lower.includes('industrial') || lower.includes('stewart')) {
        district = 'Rosewood';
    } else if (lower.includes('turnpike') || lower.includes('dam') || lower.includes('petersburg') || lower.includes('highway') || lower.includes('north bay') || lower.includes('bay') || lower.includes('broadwalk')) {
        district = 'Rockport Turnpike';
    }

    let laps = (type === 'Circuito') 
        ? ((curLang === 'es') ? '2 Vueltas (5.4 km)' : ((curLang === 'pt') ? '2 Voltas (5.4 km)' : '2 Laps (5.4 km)'))
        : (type === 'Sprint' 
            ? ((curLang === 'es') ? 'Punto a Punto (7.2 km)' : ((curLang === 'pt') ? 'Ponto a Ponto (7.2 km)' : 'Point to Point (7.2 km)'))
            : ((curLang === 'es') ? '400 Metros (Drag)' : ((curLang === 'pt') ? '400 Metros (Drag)' : '400 Meters (Drag)')));

    if (lower.includes('perimeter')) laps = (curLang === 'es') ? '3 Vueltas (7.8 km)' : ((curLang === 'pt') ? '3 Voltas (7.8 km)' : '3 Laps (7.8 km)');
    if (lower.includes('highlands')) laps = (curLang === 'es') ? '3 Vueltas (8.2 km)' : ((curLang === 'pt') ? '3 Voltas (8.2 km)' : '3 Laps (8.2 km)');
    if (lower.includes('point camden')) laps = (curLang === 'es') ? 'Punto a Punto (8.4 km)' : ((curLang === 'pt') ? 'Ponto a Ponto (8.4 km)' : 'Point to Point (8.4 km)');
    if (lower.includes('dam')) laps = (curLang === 'es') ? 'Punto a Punto (6.2 km)' : ((curLang === 'pt') ? 'Ponto a Ponto (6.2 km)' : 'Point to Point (6.2 km)');

    let surface = (curLang === 'es') ? 'Asfalto Seco / Grip 100%' : ((curLang === 'pt') ? 'Asfalto Seco / Grip 100%' : 'Dry Asphalt / Grip 100%');
    if (district === 'Camden Beach') surface = (curLang === 'es') ? 'Asfalto / Muelle Húmedo' : ((curLang === 'pt') ? 'Asfalto / Cais Úmido' : 'Asphalt / Wet Docks');
    if (district === 'Rockport Turnpike') surface = (curLang === 'es') ? 'Asfalto / Autopista Rápida' : ((curLang === 'pt') ? 'Asfalto / Rodovia Rápida' : 'Asphalt / Fast Highway');

    let heat = (curLang === 'es') ? 'Riesgo Policial: Heat 4+' : ((curLang === 'pt') ? 'Risco Policial: Heat 4+' : 'Police Risk: Heat 4+');
    if (type === 'Drag') heat = (curLang === 'es') ? 'Tráfico Denso / Heat 3+' : ((curLang === 'pt') ? 'Tráfego Denso / Heat 3+' : 'Dense Traffic / Heat 3+');

    return { district, laps, surface, heat };
}`);

// 7. Update renderStitchSpotlight labels
code = code.replace('PISTA DESTACADA DE LA SEMANA',
    `\${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'PISTA DESTACADA DE LA SEMANA' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'PISTA DESTACADA DA SEMANA' : 'FEATURED TRACK OF THE WEEK')}`);

code = code.replace('SECTOR OFICIAL • \${meta.district.toUpperCase()}',
    `\${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'SECTOR OFICIAL' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'SETOR OFICIAL' : 'OFFICIAL SECTOR')} • \${meta.district.toUpperCase()}`);

code = code.replace('MAPA VECTORIAL V1.3',
    `\${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'MAPA VECTORIAL V1.3' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'MAPA VETORIAL V1.3' : 'VECTOR MAP V1.3')}`);

code = code.replace('SECTORES: S1 / S2 / S3',
    `\${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'SECTORES: S1 / S2 / S3' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'SETORES: S1 / S2 / S3' : 'SECTORS: S1 / S2 / S3')}`);

code = code.replace('ELEVACIÓN: +48m',
    `\${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'ELEVACIÓN: +48m' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'ELEVAÇÃO: +48m' : 'ELEVATION: +48m')}`);

code = code.replace('CURVAS CLAVE: 11',
    `\${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'CURVAS CLAVE: 11' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'CURVAS PRINCIPAIS: 11' : 'KEY APEXES: 11')}`);

code = code.replace('NITRO ZONE: 4 PUNTOS',
    `\${(typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'es') ? 'ZONA NITRO: 4 PUNTOS' : ((typeof window.nfsI18n !== 'undefined' && window.nfsI18n.getCurrentLanguage() === 'pt') ? 'ZONA NITRO: 4 PONTOS' : 'NITRO ZONE: 4 SPOTS')}`);

// 8. Update nfs:languageChanged event listener
code = code.replace(/window\.addEventListener\('nfs:languageChanged', \(e\) => \{[\s\S]*?\}\);/,
`window.addEventListener('nfs:languageChanged', (e) => {
    // Re-renderizar módulos dinámicos cuando cambie el idioma
    if (typeof currentChampionshipWeek !== 'undefined') {
        renderChampionshipGroups(currentChampionshipWeek);
        renderChampionshipChallenges(currentChampionshipWeek);
    }
    if (typeof renderBlacklistUI === 'function') {
        renderBlacklistUI();
    }
    if (typeof renderAllTacticalCards === 'function') {
        renderAllTacticalCards();
    }
    if (typeof updateChampionshipRosterLabels === 'function') {
        updateChampionshipRosterLabels();
    }
    if (typeof renderChallengesUI === 'function') {
        renderChallengesUI();
    }
    if (typeof currentPastTournamentKey !== 'undefined' && typeof renderPastTournament === 'function') {
        renderPastTournament(currentPastTournamentKey);
    }
    if (typeof renderDiscordMembers === 'function') {
        renderDiscordMembers(currentMembersRoleFilter, currentMembersSearchQuery);
    }
    if (typeof renderTuningGuides === 'function') {
        renderTuningGuides(currentTuningDrivetrainFilter, currentTuningSearchQuery);
    }
    if (typeof renderStitchRoutesMosaic === 'function') {
        renderStitchRoutesMosaic();
    }
    if (typeof renderHomeLiveLeaderboard === 'function') {
        renderHomeLiveLeaderboard();
    }
    if (typeof generateHallOfFame === 'function') {
        generateHallOfFame();
    }
    if (typeof generateGlobalLeaderboards === 'function') {
        generateGlobalLeaderboards();
    }
});`);

fs.writeFileSync(appPath, code, 'utf8');
console.log("Successfully patched app.js! New length:", code.length);
