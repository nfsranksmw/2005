/**
 * NFSRANKSMW - Lógica del Panel de Comisaría & Administración (admin.html)
 * Gestión de Autenticación Firebase, Homologación de Solicitudes, Leaderboards y Migración
 */

// Estado global del panel
let currentUser = null;
let allSubmissions = {};
let currentSubmissionFilter = 'pending';
let currentLbRoute = null;
let currentLbCategory = 'junkman_single';
let isMigrating = false;

document.addEventListener('DOMContentLoaded', () => {
    initAdminAuth();
    initRouteSelectors();
});

// =======================================================
// 1. SISTEMA DE AUTENTICACIÓN FIREBASE AUTH
// =======================================================
function initAdminAuth() {
    const authForm = document.getElementById('form-admin-login');
    if (authForm) {
        authForm.addEventListener('submit', handleAdminLogin);
    }

    // Verificar si Firebase Auth SDK está inicializado
    if (typeof firebase !== 'undefined' && firebase.auth) {
        try {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    onAdminAuthenticated(user);
                } else {
                    onAdminLoggedOut();
                }
            });
        } catch (e) {
            console.warn("Aviso inicializando Auth State listener:", e);
            checkEmergencyAccess();
        }
    } else {
        checkEmergencyAccess();
    }
}

function checkEmergencyAccess() {
    // Si la sesión fue guardada previamente en localStorage
    const savedAdmin = localStorage.getItem('nfs_admin_session');
    if (savedAdmin) {
        onAdminAuthenticated({ email: savedAdmin, isEmergency: true });
    } else {
        onAdminLoggedOut();
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-pass');
    const errBox = document.getElementById('login-error-msg');
    const btn = document.getElementById('btn-login-submit');

    const email = emailInput.value.trim();
    const pass = passInput.value;

    errBox.style.display = 'none';
    btn.disabled = true;
    btn.innerText = "Verificando Credenciales...";

    // 1. Intentar Firebase Auth Web SDK
    if (typeof firebase !== 'undefined' && firebase.auth && window.NFS_FIREBASE && window.NFS_FIREBASE.config.apiKey) {
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, pass);
            onAdminAuthenticated(userCredential.user);
            showToast("Sesión iniciada correctamente", "success");
            return;
        } catch (authErr) {
            console.warn("Error en Firebase Auth:", authErr);
            // Mostrar error específico de Firebase
            errBox.innerText = `Error de autenticación: ${authErr.message || 'Credenciales inválidas'}`;
            errBox.style.display = 'block';
            btn.disabled = false;
            btn.innerText = "Acceder al Panel de Control";
            return;
        }
    }

    // 2. Si no hay apiKey configurada aún, mostrar asistente para configurar la API Key de Firebase
    if (!window.NFS_FIREBASE || !window.NFS_FIREBASE.config.apiKey) {
        promptFirebaseApiKeySetup(email, pass);
        btn.disabled = false;
        btn.innerText = "Acceder al Panel de Control";
        return;
    }

    btn.disabled = false;
    btn.innerText = "Acceder al Panel de Control";
}

function promptFirebaseApiKeySetup(attemptedEmail, attemptedPass) {
    const key = prompt("Para autenticarte con Firebase Auth se requiere la Web API Key de tu proyecto Firebase (nfsranks-blacklist-default-rtdb).\n\nIngresa tu Web API Key (la encuentras en Firebase Console > Project Settings):");
    if (key && key.trim()) {
        localStorage.setItem('nfs_firebase_api_key', key.trim());
        window.NFS_FIREBASE.config.apiKey = key.trim();
        if (typeof firebase !== 'undefined') {
            try {
                if (firebase.apps && firebase.apps.length) {
                    firebase.app().delete().then(() => {
                        firebase.initializeApp(window.NFS_FIREBASE.config);
                        location.reload();
                    });
                } else {
                    firebase.initializeApp(window.NFS_FIREBASE.config);
                    location.reload();
                }
            } catch (e) {
                location.reload();
            }
        }
    }
}

function handleAdminLogout() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
        try {
            firebase.auth().signOut();
        } catch (e) {}
    }
    localStorage.removeItem('nfs_admin_session');
    onAdminLoggedOut();
    showToast("Sesión cerrada", "info");
}

function onAdminAuthenticated(user) {
    currentUser = user;
    document.getElementById('view-login').style.display = 'none';
    document.getElementById('view-dashboard').style.display = 'block';
    document.getElementById('admin-nav-user').style.display = 'flex';
    document.getElementById('admin-user-email').innerText = user.email || 'Comisario Oficial';

    // Cargar datos del panel
    loadSubmissions();
    loadLeaderboardTab();
}

function onAdminLoggedOut() {
    currentUser = null;
    document.getElementById('view-login').style.display = 'flex';
    document.getElementById('view-dashboard').style.display = 'none';
    document.getElementById('admin-nav-user').style.display = 'none';
}

// =======================================================
// 2. NAVEGACIÓN POR PESTAÑAS DEL DASHBOARD
// =======================================================
function switchAdminTab(tabId) {
    document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(sec => sec.style.display = 'none');

    const activeBtn = document.getElementById(`tab-btn-${tabId}`);
    if (activeBtn) activeBtn.classList.add('active');

    const targetSec = document.getElementById(`sec-${tabId}`);
    if (targetSec) targetSec.style.display = 'block';

    if (tabId === 'submissions') loadSubmissions();
    if (tabId === 'leaderboard') loadLeaderboardTab();
    if (tabId === 'seasons') loadSeasonStandingsAdmin();
}

// =======================================================
// 3. COLA DE MODERACIÓN & HOMOLOGACIÓN (/submissions)
// =======================================================
async function loadSubmissions() {
    const listContainer = document.getElementById('submissions-list-container');
    const loadingEl = document.getElementById('submissions-loading');
    if (!listContainer) return;

    if (loadingEl) loadingEl.style.display = 'block';
    listContainer.innerHTML = '';

    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    try {
        const res = await fetch(`${baseUrl}/submissions.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        allSubmissions = data || {};
        updateSubmissionMetrics();
        renderSubmissionsList();
    } catch (err) {
        console.error("Error cargando solicitudes de Firebase:", err);
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--f1-red);">
                <p>⚠️ No se pudieron obtener las solicitudes de Firebase Realtime Database.</p>
                <small>${err.message}</small>
            </div>
        `;
    } finally {
        if (loadingEl) loadingEl.style.display = 'none';
    }
}

function updateSubmissionMetrics() {
    const items = Object.values(allSubmissions).filter(Boolean);
    const pendingCount = items.filter(s => (s.status || 'pending').toLowerCase() === 'pending').length;
    const approvedCount = items.filter(s => (s.status || '').toLowerCase() === 'approved').length;
    const rejectedCount = items.filter(s => (s.status || '').toLowerCase() === 'rejected').length;

    const badgePending = document.getElementById('badge-submissions-pending');
    if (badgePending) {
        badgePending.innerText = pendingCount;
        badgePending.className = `badge-count ${pendingCount === 0 ? 'zero' : ''}`;
    }

    const metricPending = document.getElementById('metric-pending-val');
    if (metricPending) metricPending.innerText = pendingCount;

    const metricApproved = document.getElementById('metric-approved-val');
    if (metricApproved) metricApproved.innerText = approvedCount;

    const metricRejected = document.getElementById('metric-rejected-val');
    if (metricRejected) metricRejected.innerText = rejectedCount;

    const metricTotal = document.getElementById('metric-total-val');
    if (metricTotal) metricTotal.innerText = items.length;
}

function filterSubmissions(status, btnEl) {
    currentSubmissionFilter = status;
    document.querySelectorAll('.status-pill-btn').forEach(btn => btn.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    renderSubmissionsList();
}

function renderSubmissionsList() {
    const container = document.getElementById('submissions-list-container');
    if (!container) return;

    let items = Object.entries(allSubmissions).map(([key, val]) => ({
        ...val,
        _key: key
    }));

    // Filtrado
    if (currentSubmissionFilter !== 'all') {
        items = items.filter(s => (s.status || 'pending').toLowerCase() === currentSubmissionFilter.toLowerCase());
    }

    // Ordenar de más reciente a más antiguo
    items.sort((a, b) => new Date(b.timestamp || b.date || 0) - new Date(a.timestamp || a.date || 0));

    if (items.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px 20px; background: var(--admin-card-bg); border: 1px dashed var(--admin-card-border); border-radius: 10px;">
                <div style="font-size: 32px; margin-bottom: 10px;">🏁</div>
                <h4 style="margin: 0 0 6px 0; font-family: var(--font-heading); font-size: 16px; text-transform: uppercase;">No hay solicitudes en esta categoría</h4>
                <p style="color: var(--text-muted); font-size: 12.5px; margin: 0;">Los tiempos enviados desde el formulario público aparecerán aquí para tu revisión.</p>
            </div>
        `;
        return;
    }

    let html = '';
    items.forEach(sub => {
        const status = (sub.status || 'pending').toLowerCase();
        const statusClass = status === 'approved' ? 'sub-approved' : status === 'rejected' ? 'sub-rejected' : 'sub-pending';
        const badgeClass = status === 'approved' ? 'status-badge-approved' : status === 'rejected' ? 'status-badge-rejected' : 'status-badge-pending';
        const statusLabel = status === 'approved' ? '✓ Aprobado' : status === 'rejected' ? '✗ Rechazado' : '⏳ Pendiente';

        const videoLink = sub.videoUrl || sub.video || sub.yt || '';
        const isYT = videoLink.includes('youtube.com') || videoLink.includes('youtu.be');
        const isTwitch = videoLink.includes('twitch.tv');

        html += `
            <div class="sub-card ${statusClass}" id="sub-card-${sub._key}">
                <div class="sub-card-header">
                    <div class="sub-route-title">
                        <span>🏁 ${sub.route || 'Ruta no especificada'}</span>
                        <span class="sub-badge-category">${sub.category || 'Junkman'} ${sub.lapType ? '• ' + sub.lapType : ''}</span>
                        ${sub.seasonId ? `<span class="badge-season-tag" style="background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.4); color: #22d3ee; font-size: 10.5px; font-weight: bold; padding: 2px 7px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">🏆 ${sub.seasonId === 'season_1' ? 'Temporada 1' : 'Temporada 2'} • S${sub.weekNum || 1}</span>` : ''}
                        <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">[${sub.id || sub._key}]</span>
                    </div>
                    <span class="sub-badge-status ${badgeClass}">${statusLabel}</span>
                </div>

                <div class="sub-card-body">
                    <div>
                        <span class="sub-cell-label">👤 Piloto</span>
                        <input type="text" class="sub-inline-input" id="edit-driver-${sub._key}" value="${escapeHtml(sub.driver || '')}" title="Editar piloto antes de homologar">
                    </div>
                    <div>
                        <span class="sub-cell-label">🚗 Vehículo</span>
                        <input type="text" class="sub-inline-input" id="edit-car-${sub._key}" value="${escapeHtml(sub.car || 'BMW M3 GTR')}" title="Editar vehículo">
                    </div>
                    <div>
                        <span class="sub-cell-label">⏱️ Tiempo Declarado</span>
                        <input type="text" class="sub-inline-input" id="edit-time-${sub._key}" value="${sub.time || '--:--.---'}" style="font-family: var(--font-mono); font-weight: 700; color: var(--nfs-orange);" title="Editar tiempo">
                    </div>
                    <div>
                        <span class="sub-cell-label">🎮 Hardware</span>
                        <span class="sub-cell-val" style="font-size: 12px; color: var(--cyan-neon);">${sub.device || 'PC'} • ${sub.gearbox || 'Manual'}</span>
                    </div>
                    <div>
                        <span class="sub-cell-label">📅 Fecha de Envío</span>
                        <span class="sub-cell-val" style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono);">${sub.date || '--'}</span>
                    </div>
                </div>

                <div class="sub-card-footer">
                    <div class="sub-telemetry-meta">
                        ${sub.startMark && sub.endMark ? `<span>📐 Marcas: <strong>${sub.startMark}</strong> → <strong>${sub.endMark}</strong> (Δ: <strong>${sub.diff || '--'}</strong>)</span>` : ''}
                        <span>🌐 Modalidad: <strong>${sub.mode || 'Online'}</strong></span>
                        ${videoLink ? `
                            <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="openVideoPreview('${escapeHtml(videoLink)}')">
                                ▶ Previsualizar Video
                            </button>
                            <a href="${escapeHtml(videoLink)}" target="_blank" rel="noopener noreferrer" class="admin-btn admin-btn-outline admin-btn-sm" style="color: #ff5555; border-color: rgba(255, 85, 85, 0.4);">
                                ↗ Abrir Video
                            </a>
                        ` : '<span style="color: var(--f1-red); font-style: italic;">Sin video</span>'}
                    </div>

                    <div class="sub-actions-group">
                        ${status !== 'approved' ? `
                            <button type="button" class="admin-btn admin-btn-success admin-btn-sm" onclick="approveSubmission('${sub._key}')">
                                ✓ Aprobar y Homologar
                            </button>
                        ` : `
                            <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="approveSubmission('${sub._key}')" title="Actualiza el registro en el leaderboard">
                                🔄 Re-Homologar
                            </button>
                        `}
                        ${status !== 'rejected' ? `
                            <button type="button" class="admin-btn admin-btn-danger admin-btn-sm" onclick="rejectSubmission('${sub._key}')">
                                ✗ Rechazar
                            </button>
                        ` : ''}
                        <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" style="color: #fca5a5;" onclick="deleteSubmission('${sub._key}')" title="Eliminar de la cola">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// =======================================================
// 4. APROBACIÓN, RECHAZO Y RE-RANKING DE SOLICITUDES
// =======================================================
async function approveSubmission(subKey) {
    const sub = allSubmissions[subKey];
    if (!sub) return;

    // Obtener campos editados en línea
    const driverInput = document.getElementById(`edit-driver-${subKey}`);
    const carInput = document.getElementById(`edit-car-${subKey}`);
    const timeInput = document.getElementById(`edit-time-${subKey}`);

    const finalDriver = driverInput ? driverInput.value.trim() : sub.driver;
    const finalCar = carInput ? carInput.value.trim() : sub.car;
    const finalTime = timeInput ? timeInput.value.trim() : sub.time;

    if (!finalDriver || !finalTime) {
        alert("El piloto y el tiempo son obligatorios para homologar.");
        return;
    }

    const parseFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.parseTimeToMs) ? window.NFS_FIREBASE.parseTimeToMs : null;
    const finalTimeMs = parseFn ? parseFn(finalTime) : (sub.timeMs || null);

    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    const sanitizeFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.sanitizeKey) ? window.NFS_FIREBASE.sanitizeKey : (str => str.toLowerCase().replace(/[^a-z0-9_-]/g, '_'));

    const routeKey = sub.routeKey || sanitizeFn(sub.route);
    const categoryKey = sub.categoryKey || 'junkman_single';

    showToast("Homologando tiempo en el Leaderboard...", "info");

    try {
        // 1. Obtener la tabla actual del Leaderboard para esa pista y categoría
        const lbEndpoint = `${baseUrl}/leaderboards/${routeKey}/${categoryKey}.json`;
        let existingRecords = [];
        const lbRes = await fetch(lbEndpoint);
        if (lbRes.ok) {
            const lbData = await lbRes.json();
            if (Array.isArray(lbData)) {
                existingRecords = lbData.filter(Boolean);
            } else if (lbData && typeof lbData === 'object') {
                existingRecords = Object.values(lbData).filter(Boolean);
            }
        }

        const newRecord = {
            rank: "#--",
            driver: finalDriver,
            time: finalTime,
            timeMs: finalTimeMs,
            car: finalCar,
            device: sub.device || 'PC',
            gearbox: sub.gearbox || 'Manual',
            date: sub.date || new Date().toISOString().split('T')[0],
            yt: sub.videoUrl || sub.video || sub.yt || '#',
            submissionId: sub.id || subKey,
            verified: true
        };

        // Comprobar si el piloto ya tenía un tiempo en esta tabla
        const existingIdx = existingRecords.findIndex(r =>
            r && r.driver && r.driver.trim().toLowerCase() === finalDriver.toLowerCase()
        );

        if (existingIdx !== -1) {
            // Actualizar si es mejor tiempo o sobreescribir con la homologación del comisario
            existingRecords[existingIdx] = newRecord;
        } else {
            existingRecords.push(newRecord);
        }

        // Ordenar estrictamente ascendente por milisegundos
        existingRecords.sort((a, b) => {
            const msA = a.timeMs !== undefined ? a.timeMs : (parseFn ? parseFn(a.time) : 99999999);
            const msB = b.timeMs !== undefined ? b.timeMs : (parseFn ? parseFn(b.time) : 99999999);
            if (msA !== null && msB !== null && msA !== msB) return msA - msB;
            return (a.driver || '').localeCompare(b.driver || '');
        });

        // Recalcular posiciones #1, #2, #3...
        existingRecords = existingRecords.map((item, idx) => ({
            ...item,
            rank: `#${idx + 1}`
        }));

        // 2. Guardar tabla actualizada en /leaderboards
        const saveLbRes = await fetch(lbEndpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(existingRecords)
        });
        if (!saveLbRes.ok) throw new Error("Error al guardar en /leaderboards");

        // 3. Actualizar estado de la solicitud en /submissions a 'approved'
        const updatedSub = {
            ...sub,
            driver: finalDriver,
            car: finalCar,
            time: finalTime,
            timeMs: finalTimeMs,
            status: "approved",
            approvedAt: new Date().toISOString(),
            approvedBy: currentUser ? currentUser.email : 'Admin'
        };

        await fetch(`${baseUrl}/submissions/${subKey}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedSub)
        });

        allSubmissions[subKey] = updatedSub;
        updateSubmissionMetrics();
        renderSubmissionsList();

        const assignedRank = `#${existingRecords.findIndex(r => r.driver.toLowerCase() === finalDriver.toLowerCase()) + 1}`;

        // 4. Notificar automáticamente a Discord Webhook
        if (window.NFS_DISCORD_NOTIFIER) {
            window.NFS_DISCORD_NOTIFIER.notifyApproval({
                driver: finalDriver,
                route: sub.route,
                category: sub.category || (categoryKey.includes('bmw') ? 'BMW M3 GTR' : 'Junkman'),
                categoryKey: categoryKey,
                time: finalTime,
                car: finalCar,
                device: sub.device || 'PC',
                gearbox: sub.gearbox || 'Manual',
                rank: assignedRank,
                videoUrl: sub.videoUrl || sub.video || sub.yt || '',
                moderator: currentUser ? (currentUser.displayName || currentUser.email) : 'Comisaría Oficial',
                date: sub.date,
                seasonName: sub.seasonName || (sub.seasonId ? (sub.seasonId === 'season_1' ? 'Blacklist Temporada 1 (Noviembre 2026)' : 'Blacklist Temporada 2 (Diciembre 2026)') : null),
                weekTitle: sub.weekTitle || (sub.weekNum ? `Semana ${sub.weekNum}` : null),
                rewardDesc: sub.rewardDesc || null
            }).catch(e => console.warn("Discord notify error:", e));
        }

        showToast(`✓ ¡Récord homologado! Asignado puesto ${assignedRank} en ${sub.route}. Notificación enviada a Discord.`, "success");
    } catch (err) {
        console.error("Error homologando solicitud:", err);
        showToast(`❌ Error: ${err.message}`, "error");
    }
}

async function rejectSubmission(subKey) {
    const sub = allSubmissions[subKey];
    if (!sub) return;

    const reasonPrompt = prompt(`Ingresa el motivo del rechazo para la solicitud de ${sub.driver} en ${sub.route}:`, "Tiempo no homologable por discrepancia en telemetría o corte de video.");
    if (reasonPrompt === null) return; // Cancelado

    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    try {
        const updatedSub = {
            ...sub,
            status: "rejected",
            rejectionReason: reasonPrompt || "No cumple los requisitos reglamentarios.",
            rejectedAt: new Date().toISOString(),
            rejectedBy: currentUser ? currentUser.email : 'Admin'
        };

        await fetch(`${baseUrl}/submissions/${subKey}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedSub)
        });

        allSubmissions[subKey] = updatedSub;
        updateSubmissionMetrics();
        renderSubmissionsList();

        // Notificar automáticamente a Discord Webhook
        if (window.NFS_DISCORD_NOTIFIER) {
            window.NFS_DISCORD_NOTIFIER.notifyRejection({
                driver: sub.driver,
                route: sub.route,
                time: sub.time,
                car: sub.car,
                videoUrl: sub.videoUrl || sub.video || sub.yt || '',
                moderator: currentUser ? (currentUser.displayName || currentUser.email) : 'Comisaría Oficial',
                reason: reasonPrompt || "No cumple los requisitos de homologación de telemetría."
            }).catch(e => console.warn("Discord notify error:", e));
        }

        showToast("Solicitud rechazada y registrada en Discord", "info");
    } catch (err) {
        showToast(`Error: ${err.message}`, "error");
    }
}

async function deleteSubmission(subKey) {
    const sub = allSubmissions[subKey];
    if (!confirm("¿Eliminar definitivamente esta solicitud de la cola de moderación?")) return;

    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    try {
        await fetch(`${baseUrl}/submissions/${subKey}.json`, { method: 'DELETE' });
        
        // Notificar automáticamente a Discord Webhook
        if (window.NFS_DISCORD_NOTIFIER && sub) {
            window.NFS_DISCORD_NOTIFIER.notifyDeletion({
                driver: sub.driver,
                route: sub.route,
                time: sub.time,
                moderator: currentUser ? (currentUser.displayName || currentUser.email) : 'Comisaría Oficial'
            }).catch(e => console.warn("Discord notify error:", e));
        }

        delete allSubmissions[subKey];
        updateSubmissionMetrics();
        renderSubmissionsList();
        showToast("Solicitud eliminada de la cola y notificada a Discord", "info");
    } catch (err) {
        showToast(`Error: ${err.message}`, "error");
    }
}

// =======================================================
// 5. GESTOR DIRECTO DE TABLAS LEADERBOARD (/leaderboards)
// =======================================================
function initRouteSelectors() {
    const routeSelect = document.getElementById('lb-select-route');
    if (!routeSelect) return;

    routeSelect.innerHTML = '';
    if (typeof routesData === 'undefined' || !routesData.length) return;

    const circuitTracks = routesData.filter(r => r.type === 'Circuito');
    const sprintTracks = routesData.filter(r => r.type === 'Sprint');
    const dragTracks = routesData.filter(r => r.type === 'Drag');

    const addGroup = (label, list) => {
        const grp = document.createElement('optgroup');
        grp.label = `${label} (${list.length})`;
        list.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.name;
            opt.textContent = t.alias ? `${t.name} (${t.alias})` : t.name;
            grp.appendChild(opt);
        });
        routeSelect.appendChild(grp);
    };

    addGroup('🏁 Circuitos', circuitTracks);
    addGroup('⚡ Sprints', sprintTracks);
    addGroup('🔥 Drags', dragTracks);

    currentLbRoute = routesData[0];
    updateCategorySelectorForRoute(currentLbRoute);
}

function handleLbRouteChange() {
    const routeSelect = document.getElementById('lb-select-route');
    if (!routeSelect || typeof routesData === 'undefined') return;

    const matched = routesData.find(r => r.name === routeSelect.value);
    if (matched) {
        currentLbRoute = matched;
        updateCategorySelectorForRoute(matched);
        loadLeaderboardTab();
    }
}

function updateCategorySelectorForRoute(route) {
    const catSelect = document.getElementById('lb-select-category');
    if (!catSelect) return;

    catSelect.innerHTML = '';
    if (route.type === 'Circuito') {
        catSelect.innerHTML = `
            <option value="junkman_single">Junkman - Single Lap</option>
            <option value="junkman_fast">Junkman - Fast Lap</option>
            <option value="bmw_single">BMW M3 GTR - Single Lap</option>
            <option value="bmw_fast">BMW M3 GTR - Fast Lap</option>
        `;
    } else {
        catSelect.innerHTML = `
            <option value="junkman">Junkman</option>
            <option value="bmw">BMW M3 GTR</option>
        `;
    }
    currentLbCategory = catSelect.value;
}

function handleLbCategoryChange() {
    const catSelect = document.getElementById('lb-select-category');
    if (catSelect) {
        currentLbCategory = catSelect.value;
        loadLeaderboardTab();
    }
}

async function loadLeaderboardTab() {
    const tbody = document.getElementById('lb-table-body');
    const routeTitleEl = document.getElementById('lb-current-title');
    if (!tbody || !currentLbRoute) return;

    if (routeTitleEl) {
        routeTitleEl.innerText = `${currentLbRoute.name} (${currentLbRoute.type}) • ${currentLbCategory.replace('_', ' ').toUpperCase()}`;
    }

    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 25px; color: var(--text-muted);">Cargando registros oficiales...</td></tr>`;

    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    const sanitizeFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.sanitizeKey) ? window.NFS_FIREBASE.sanitizeKey : (str => str.toLowerCase().replace(/[^a-z0-9_-]/g, '_'));
    const routeKey = sanitizeFn(currentLbRoute.name);

    try {
        const res = await fetch(`${baseUrl}/leaderboards/${routeKey}/${currentLbCategory}.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        let records = [];
        if (Array.isArray(data)) {
            records = data.filter(Boolean);
        } else if (data && typeof data === 'object') {
            records = Object.values(data).filter(Boolean);
        }

        if (records.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--text-muted); font-family: var(--font-heading);">No hay tiempos oficiales registrados en esta tabla aún.</td></tr>`;
            return;
        }

        let html = '';
        records.forEach((row, idx) => {
            const rankNum = idx + 1;
            const rankBadge = rankNum === 1 ? 'rank-gold' : rankNum === 2 ? 'rank-silver' : rankNum === 3 ? 'rank-bronze' : 'rank-normal';

            html += `
                <tr>
                    <td><span class="table-rank-badge ${rankBadge}">#${rankNum}</span></td>
                    <td><strong style="color: #fff;">${escapeHtml(row.driver || '--')}</strong></td>
                    <td style="font-family: var(--font-mono); font-weight: 700; color: var(--nfs-orange); font-size: 14px;">${row.time || '--:--.---'}</td>
                    <td>${escapeHtml(row.car || 'BMW M3 GTR')}</td>
                    <td style="color: var(--cyan-neon); font-size: 11.5px;">${row.device || 'PC'} / ${row.gearbox || 'Manual'}</td>
                    <td style="color: var(--text-muted); font-size: 11px; font-family: var(--font-mono);">${row.date || '--'}</td>
                    <td>
                        <button type="button" class="admin-btn admin-btn-danger admin-btn-sm" onclick="deleteLeaderboardRow(${idx})" title="Eliminar registro">
                            🗑️
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 25px; color: var(--f1-red);">Error consultando la tabla: ${err.message}</td></tr>`;
    }
}

async function deleteLeaderboardRow(rowIndex) {
    if (!currentLbRoute) return;
    if (!confirm(`¿Eliminar este registro de la posición #${rowIndex + 1}?`)) return;

    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    const sanitizeFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.sanitizeKey) ? window.NFS_FIREBASE.sanitizeKey : (str => str.toLowerCase().replace(/[^a-z0-9_-]/g, '_'));
    const routeKey = sanitizeFn(currentLbRoute.name);
    const endpoint = `${baseUrl}/leaderboards/${routeKey}/${currentLbCategory}.json`;

    try {
        const res = await fetch(endpoint);
        let records = await res.json();
        if (!Array.isArray(records) && typeof records === 'object') {
            records = Object.values(records).filter(Boolean);
        }
        if (!Array.isArray(records)) return;

        records.splice(rowIndex, 1);

        // Recalcular posiciones
        records = records.map((item, idx) => ({
            ...item,
            rank: `#${idx + 1}`
        }));

        await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(records)
        });

        showToast("Registro eliminado del Leaderboard", "info");
        loadLeaderboardTab();
    } catch (err) {
        showToast(`Error: ${err.message}`, "error");
    }
}

// =======================================================
// 6. HERRAMIENTA DE MIGRACIÓN HISTÓRICA 1-CLIC
// =======================================================
async function startOneClickMigration() {
    if (isMigrating) return;
    if (typeof routesData === 'undefined' || !routesData.length) {
        alert("No se cargó la base de datos de rutas (routesData).");
        return;
    }

    if (!confirm(`Se procesarán las 86 pistas oficiales de Need for Speed: Most Wanted (2005) desde sus CSVs de Google Sheets y se migrarán a Firebase Realtime Database.\n\n¿Deseas continuar?`)) {
        return;
    }

    isMigrating = true;
    const btn = document.getElementById('btn-start-migration');
    const box = document.getElementById('migration-progress-box');
    const fill = document.getElementById('progress-bar-fill');
    const label = document.getElementById('migration-status-label');
    const logConsole = document.getElementById('migration-log');

    if (btn) btn.disabled = true;
    if (box) box.style.display = 'block';
    if (logConsole) logConsole.innerHTML = '';

    const log = (msg) => {
        if (!logConsole) return;
        const line = document.createElement('div');
        line.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
        logConsole.appendChild(line);
        logConsole.scrollTop = logConsole.scrollHeight;
    };

    log("Iniciando migración integral a Firebase Realtime Database...");
    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    const sanitizeFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.sanitizeKey) ? window.NFS_FIREBASE.sanitizeKey : (str => str.toLowerCase().replace(/[^a-z0-9_-]/g, '_'));
    const parseFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.parseTimeToMs) ? window.NFS_FIREBASE.parseTimeToMs : (str => null);

    const totalRoutes = routesData.length;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < totalRoutes; i++) {
        const route = routesData[i];
        const routeKey = sanitizeFn(route.name);
        const percent = Math.round(((i + 1) / totalRoutes) * 100);

        if (fill) fill.style.width = `${percent}%`;
        if (label) label.innerText = `Procesando ${i + 1} de ${totalRoutes} (${percent}%): ${route.name}...`;

        log(`🏎️ Migrando ${route.name} (${route.type})...`);

        try {
            if (route.type === 'Circuito') {
                const cats = [
                    { key: 'junkman_single', url: route.sheets.junkmanSingle },
                    { key: 'junkman_fast',   url: route.sheets.junkmanFast },
                    { key: 'bmw_single',     url: route.sheets.bmwSingle },
                    { key: 'bmw_fast',       url: route.sheets.bmwFast }
                ];
                for (const cat of cats) {
                    if (!cat.url) continue;
                    const records = await fetchAndParseCsv(cat.url, parseFn);
                    if (records.length > 0) {
                        await fetch(`${baseUrl}/leaderboards/${routeKey}/${cat.key}.json`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(records)
                        });
                        log(`  ✓ ${cat.key}: ${records.length} registros guardados.`);
                    }
                }
            } else {
                const cats = [
                    { key: 'junkman', url: route.sheets.junkman },
                    { key: 'bmw',     url: route.sheets.bmw }
                ];
                for (const cat of cats) {
                    if (!cat.url) continue;
                    const records = await fetchAndParseCsv(cat.url, parseFn);
                    if (records.length > 0) {
                        await fetch(`${baseUrl}/leaderboards/${routeKey}/${cat.key}.json`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(records)
                        });
                        log(`  ✓ ${cat.key}: ${records.length} registros guardados.`);
                    }
                }
            }
            successCount++;
        } catch (routeErr) {
            console.warn(`Error migrando ${route.name}:`, routeErr);
            log(`  ❌ Error en ${route.name}: ${routeErr.message}`);
            failCount++;
        }

        // Breve pausa para no saturar conexiones simultáneas
        await new Promise(r => setTimeout(r, 60));
    }

    isMigrating = false;
    if (btn) btn.disabled = false;
    if (label) label.innerText = `¡Migración completada! Éxito: ${successCount} pistas, Errores: ${failCount}`;
    log(`🏁 PROCESO FINALIZADO. ${successCount} pistas migradas correctamente a Firebase RTDB.`);
    showToast("¡Migración histórica completada con éxito!", "success");
}

async function fetchAndParseCsv(csvUrl, parseTimeToMsFn) {
    const res = await fetch(csvUrl);
    if (!res.ok) return [];
    const text = await res.text();
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return [];

    // Buscar fila de cabecera dinámica
    let headerIdx = -1;
    for (let k = 0; k < Math.min(5, lines.length); k++) {
        const testLine = lines[k].toLowerCase();
        if ((testLine.includes('driver') || testLine.includes('player') || testLine.includes('piloto')) &&
            (testLine.includes('time') || testLine.includes('tiempo'))) {
            headerIdx = k;
            break;
        }
    }
    if (headerIdx < 0) headerIdx = 0;

    const headerCols = lines[headerIdx].split(',').map(c => c.trim().replace(/^"|"$/g, '').toLowerCase());
    let colIdxDriver = 1, colIdxTime = 2, colIdxDevice = 3, colIdxCar = 4, colIdxGearbox = 5, colIdxDate = 6, colIdxVideo = 7;

    for (let c = 0; c < headerCols.length; c++) {
        const hc = headerCols[c];
        if (hc.includes('driver') || hc.includes('player') || hc.includes('piloto')) colIdxDriver = c;
        else if (hc.startsWith('time') || hc.startsWith('tiempo')) colIdxTime = c;
        else if (hc.includes('device') || hc.includes('dispositivo') || hc.includes('mando') || hc.includes('input')) colIdxDevice = c;
        else if (hc.includes('car') || hc.includes('vehic') || hc.includes('auto') || hc.includes('coche')) colIdxCar = c;
        else if (hc.includes('gear') || hc.includes('caja') || hc.includes('trans')) colIdxGearbox = c;
        else if (hc.includes('date') || hc.includes('fecha')) colIdxDate = c;
        else if (hc.includes('video') || hc.includes('link') || hc.includes('yt') || hc.includes('youtube')) colIdxVideo = c;
    }

    const records = [];
    for (let i = headerIdx + 1; i < lines.length; i++) {
        // Regex para respetar comas dentro de comillas (ej: "September 19th, 2022")
        const cols = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length <= Math.max(colIdxDriver, colIdxTime)) continue;

        const driver = cols[colIdxDriver] || '';
        const time = cols[colIdxTime] || '';
        if (!driver || !time || time === '--' || time === '-') continue;

        const device = cols[colIdxDevice] || 'PC';
        const car = cols[colIdxCar] || 'BMW M3 GTR';
        const gearbox = cols[colIdxGearbox] || 'Manual';
        const date = cols[colIdxDate] || '';
        const video = cols[colIdxVideo] || '#';

        const timeMs = parseTimeToMsFn ? parseTimeToMsFn(time) : null;

        records.push({
            rank: `#${records.length + 1}`,
            driver: driver,
            time: time,
            timeMs: timeMs,
            car: car,
            device: device,
            gearbox: gearbox,
            date: date,
            yt: video.startsWith('http') ? video : '#',
            verified: true
        });
    }

    // Ordenar numéricamente por tiempo
    records.sort((a, b) => {
        if (a.timeMs !== null && b.timeMs !== null) return a.timeMs - b.timeMs;
        if (a.timeMs !== null) return -1;
        if (b.timeMs !== null) return 1;
        return 0;
    });

    return records.map((rec, idx) => ({
        ...rec,
        rank: `#${idx + 1}`
    }));
}

// =======================================================
// 7. PREVISUALIZADOR MODAL DE VIDEO (YOUTUBE / TWITCH)
// =======================================================
function openVideoPreview(url) {
    const modal = document.getElementById('admin-video-modal');
    const iframe = document.getElementById('admin-video-iframe');
    if (!modal || !iframe) return;

    let embedUrl = '';
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
        } else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        } else if (url.includes('embed/')) {
            videoId = url.split('embed/')[1].split('?')[0];
        }
        if (videoId) {
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
    }
    // Twitch
    else if (url.includes('twitch.tv')) {
        const parts = url.split('twitch.tv/videos/');
        if (parts[1]) {
            const vidId = parts[1].split('?')[0];
            const parentHost = window.location.hostname || 'localhost';
            embedUrl = `https://player.twitch.tv/?video=${vidId}&parent=${parentHost}&autoplay=true`;
        }
    }

    if (!embedUrl) {
        window.open(url, '_blank');
        return;
    }

    iframe.src = embedUrl;
    modal.style.display = 'flex';
}

function closeVideoPreview() {
    const modal = document.getElementById('admin-video-modal');
    const iframe = document.getElementById('admin-video-iframe');
    if (iframe) iframe.src = '';
    if (modal) modal.style.display = 'none';
}

// =======================================================
// 8. TOAST NOTIFICATIONS & UTILIDADES
// =======================================================
function showToast(message, type = 'info') {
    let toast = document.getElementById('admin-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'admin-toast';
        toast.className = 'admin-toast';
        document.body.appendChild(toast);
    }

    toast.className = `admin-toast toast-${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3800);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// =======================================================
// 9. GESTOR DE CLASIFICACIÓN DE TEMPORADAS BLACKLIST (/seasons)
// =======================================================
let currentSeasonAdminId = 'season_1';
let currentSeasonAdminWeek = 'all';
let currentSeasonStandings = [];

async function loadSeasonStandingsAdmin() {
    renderSeasonAdminChallenges();
    const tbody = document.getElementById('tbody-season-standings-admin');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 30px;">Cargando clasificación de la temporada...</td></tr>`;

    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    try {
        const res = await fetch(`${baseUrl}/seasons/${currentSeasonAdminId}/standings.json`);
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
                currentSeasonStandings = data.filter(Boolean);
            } else if (data && typeof data === 'object') {
                currentSeasonStandings = Object.values(data).filter(Boolean);
            } else {
                currentSeasonStandings = [];
            }
        } else {
            currentSeasonStandings = [];
        }

        renderSeasonStandingsAdminTable();
    } catch (e) {
        console.warn("Error cargando clasificación de temporada:", e);
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #f87171; padding: 25px;">No se pudo cargar la clasificación: ${e.message}</td></tr>`;
    }
}

function handleSeasonAdminChange() {
    const sel = document.getElementById('season-admin-select-season');
    if (sel) currentSeasonAdminId = sel.value;
    loadSeasonStandingsAdmin();
}

function handleSeasonAdminWeekChange() {
    const sel = document.getElementById('season-admin-select-week');
    if (sel) currentSeasonAdminWeek = sel.value;
    renderSeasonAdminChallenges();
    renderSeasonStandingsAdminTable();
}

function renderSeasonAdminChallenges() {
    const container = document.getElementById('season-admin-challenges-preview');
    if (!container || typeof SEASONS_DATA === 'undefined') return;

    const season = SEASONS_DATA[currentSeasonAdminId];
    if (!season) return;

    const weekNum = currentSeasonAdminWeek === 'all' ? 1 : parseInt(currentSeasonAdminWeek, 10);
    const weekData = season.weeks.find(w => w.weekNum === weekNum) || season.weeks[0];

    container.innerHTML = `
        <div style="grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-family: var(--font-heading); font-size: 13px; font-weight: 700; color: var(--nfs-orange);">
                ⚡ 4 Retos Oficiales • ${weekData.title} (${weekData.dateRange})
            </span>
            <span style="font-size: 11px; color: var(--text-muted);">
                2 Circuitos (Junkman + BMW) & 2 Sprints (Junkman + BMW)
            </span>
        </div>
    ` + weekData.challenges.map(ch => `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; justify-content: space-between; font-size: 10.5px; font-weight: 700;">
                <span style="color: ${ch.category.includes('BMW') ? '#60a5fa' : '#4ade80'};">${ch.type.toUpperCase()} • ${ch.category}</span>
                <span style="color: var(--nfs-orange);">${ch.icon}</span>
            </div>
            <div style="font-family: var(--font-heading); font-size: 13px; font-weight: 700; color: #fff;">${ch.track}</div>
            <div style="font-size: 10.5px; color: var(--text-muted);">Auto: <strong style="color: #cbd5e1;">${ch.car}</strong></div>
            <div style="font-size: 10.5px; color: var(--text-muted);">Objetivo: <strong style="color: var(--nfs-orange);">${ch.targetTime}</strong></div>
            <div style="font-size: 10px; color: #fbbf24; margin-top: auto; padding-top: 4px; border-top: 1px dashed rgba(255,255,255,0.06);">
                🎁 ${ch.reward.desc}
            </div>
        </div>
    `).join('');
}

function renderSeasonStandingsAdminTable() {
    const tbody = document.getElementById('tbody-season-standings-admin');
    if (!tbody) return;

    if (!currentSeasonStandings || currentSeasonStandings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; color: var(--text-muted); padding: 35px; font-size: 12.5px;">
                    No hay tabla publicada para esta temporada. Pulsa <strong>"⚡ Recalcular y Publicar en RTDB"</strong> para generar la clasificación a partir de los tiempos homologados.
                </td>
            </tr>
        `;
        return;
    }

    let rows = currentSeasonStandings.slice();
    // Ordenar por puntos totales descendente
    rows.sort((a, b) => (b.totalPts || 0) - (a.totalPts || 0));

    tbody.innerHTML = rows.map((p, idx) => {
        const isPodium = idx < 3;
        const posBadge = idx === 0 ? '👑 1°' : idx === 1 ? '🥈 2°' : idx === 2 ? '🥉 3°' : `#${idx + 1}`;
        const posColor = idx === 0 ? 'color: #fbbf24; font-weight: bold;' : idx === 1 ? 'color: #e2e8f0; font-weight: bold;' : idx === 2 ? 'color: #f97316; font-weight: bold;' : 'color: var(--text-muted);';

        return `
            <tr style="${isPodium ? 'background: rgba(245, 158, 11, 0.04);' : ''}">
                <td style="text-align: center; font-family: var(--font-mono); ${posColor}">${posBadge}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-family: var(--font-heading); font-size: 13.5px; font-weight: 700; color: #fff;">${escapeHtml(p.driver)}</span>
                        ${p.badgeTitle ? `<span style="font-size: 9.5px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.15); padding: 1px 5px; border-radius: 3px; color: #cbd5e1;">${escapeHtml(p.badgeTitle)}</span>` : ''}
                    </div>
                </td>
                <td style="text-align: center; font-family: var(--font-mono); font-weight: 600; color: #94a3b8;">${p.s1 !== undefined ? p.s1 + ' pts' : '--'}</td>
                <td style="text-align: center; font-family: var(--font-mono); font-weight: 600; color: #94a3b8;">${p.s2 !== undefined ? p.s2 + ' pts' : '--'}</td>
                <td style="text-align: center; font-family: var(--font-mono); font-weight: 600; color: #94a3b8;">${p.s3 !== undefined ? p.s3 + ' pts' : '--'}</td>
                <td style="text-align: center; font-family: var(--font-mono); font-weight: 600; color: #94a3b8;">${p.s4 !== undefined ? p.s4 + ' pts' : '--'}</td>
                <td style="text-align: center; font-family: var(--font-mono); font-size: 14px; font-weight: 800; color: var(--nfs-orange);">${p.totalPts || 0} PTS</td>
                <td>
                    <div style="font-size: 11px; color: #38bdf8; font-weight: 600;">💰 ${p.totalBounty || '$0'}</div>
                    <div style="font-size: 10px; color: #a855f7;">🎖️ ${p.rewardMedals || 'Completador Oficial'}</div>
                </td>
                <td style="text-align: center;">
                    <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="editSeasonPilot('${escapeHtml(p.driver)}')" title="Editar puntuación">✏️</button>
                    <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" style="color:#f87171;" onclick="deleteSeasonPilot('${escapeHtml(p.driver)}')" title="Quitar de la temporada">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

async function recalcAndPublishSeasonStandings() {
    const season = (typeof SEASONS_DATA !== 'undefined') ? SEASONS_DATA[currentSeasonAdminId] : null;
    if (!season) {
        alert("Configuración de temporada no encontrada.");
        return;
    }

    if (!confirm(`¿Deseas recalcular la clasificación oficial de "${season.name}" y publicarla en Firebase RTDB con notificación a Discord?`)) {
        return;
    }

    showToast("Calculando puntuaciones y homologaciones de la temporada...", "info");

    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    const sanitizeFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.sanitizeKey) ? window.NFS_FIREBASE.sanitizeKey : (str => str.toLowerCase().replace(/[^a-z0-9_-]/g, '_'));

    try {
        // 1. Obtener todas las solicitudes aprobadas
        const subRes = await fetch(`${baseUrl}/submissions.json`);
        let allSubs = {};
        if (subRes.ok) allSubs = (await subRes.json()) || {};

        const approvedSubs = Object.values(allSubs).filter(s => s && (s.status || '').toLowerCase() === 'approved');

        // Puntuaciones base por puesto: 1st=25, 2nd=18, 3rd=15, 4th=12, 5th=10, 6th=8, 7th=6, 8th=4, 9th=2, 10th=1
        const POINT_SCALE = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

        // Mapa de pilotos: driver -> { driver, s1, s2, s3, s4, totalPts, totalBounty, recordsCount }
        const driversMap = {};

        function getOrCreateDriver(driverName) {
            const key = driverName.trim().toLowerCase();
            if (!driversMap[key]) {
                driversMap[key] = {
                    driver: driverName.trim(),
                    s1: 0,
                    s2: 0,
                    s3: 0,
                    s4: 0,
                    totalPts: 0,
                    totalBountyNum: 0,
                    recordsCount: 0,
                    badgeTitle: "Aspirante Blacklist"
                };
            }
            return driversMap[key];
        }

        // Si ya había pilotos en currentSeasonStandings, preservamos su base
        if (Array.isArray(currentSeasonStandings)) {
            currentSeasonStandings.forEach(p => {
                if (p && p.driver) {
                    const d = getOrCreateDriver(p.driver);
                    d.s1 = p.s1 || 0;
                    d.s2 = p.s2 || 0;
                    d.s3 = p.s3 || 0;
                    d.s4 = p.s4 || 0;
                }
            });
        }

        // 2. Procesar cada una de las 4 semanas y sus 4 pistas oficiales
        for (const week of season.weeks) {
            const wNum = week.weekNum;
            const weekKey = `s${wNum}`;

            for (const ch of week.challenges) {
                const routeKey = sanitizeFn(ch.track);
                const isCircuit = ch.type === 'Circuito';
                const isBMW = ch.category.includes('BMW');
                const catKey = isCircuit ? (isBMW ? 'bmw_single' : 'junkman_single') : (isBMW ? 'bmw' : 'junkman');

                // Consultar Leaderboard para este reto
                try {
                    const lbRes = await fetch(`${baseUrl}/leaderboards/${routeKey}/${catKey}.json`);
                    if (lbRes.ok) {
                        const lbData = await lbRes.json();
                        let records = [];
                        if (Array.isArray(lbData)) records = lbData.filter(Boolean);
                        else if (lbData && typeof lbData === 'object') records = Object.values(lbData).filter(Boolean);

                        // Asignar puntos del top 10
                        records.slice(0, 10).forEach((rec, rankIdx) => {
                            if (rec && rec.driver) {
                                const d = getOrCreateDriver(rec.driver);
                                const pts = POINT_SCALE[rankIdx] || 1;
                                d[weekKey] = (d[weekKey] || 0) + pts;
                                d.recordsCount++;
                                d.totalBountyNum += (pts * 15000);
                            }
                        });
                    }
                } catch (e) {
                    console.warn(`Error leyendo leaderboard para ${ch.track}:`, e);
                }
            }
        }

        // 3. Procesar envíos directos con flag de temporada
        approvedSubs.forEach(sub => {
            if (sub.seasonId === currentSeasonAdminId && sub.driver) {
                const d = getOrCreateDriver(sub.driver);
                const wKey = `s${sub.weekNum || 1}`;
                d[wKey] = (d[wKey] || 0) + 15; // Bono de homologación de temporada
                d.totalBountyNum += 100000;
            }
        });

        // 4. Consolidar tabla ordenada
        let finalStandings = Object.values(driversMap);
        finalStandings.forEach(d => {
            d.totalPts = (d.s1 || 0) + (d.s2 || 0) + (d.s3 || 0) + (d.s4 || 0);
            d.totalBounty = `$${(d.totalBountyNum || d.totalPts * 20000).toLocaleString('de-DE')}`;
            if (d.totalPts >= 200) d.badgeTitle = "Rey de Rockport City";
            else if (d.totalPts >= 120) d.badgeTitle = "Élite Blacklist #1";
            else if (d.totalPts >= 60) d.badgeTitle = "Veterano Oficial";
            else d.badgeTitle = "Aspirante Blacklist";
            d.rewardMedals = d.totalPts >= 100 ? "Oro & Trofeo Legend" : "Plata de Temporada";
        });

        finalStandings.sort((a, b) => b.totalPts - a.totalPts);

        finalStandings = finalStandings.map((item, idx) => ({
            ...item,
            rank: `#${idx + 1}`
        }));

        // 5. Guardar en Firebase Realtime Database
        const saveRes = await fetch(`${baseUrl}/seasons/${currentSeasonAdminId}/standings.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalStandings)
        });

        if (!saveRes.ok) throw new Error("Fallo al guardar clasificación en Firebase RTDB");

        currentSeasonStandings = finalStandings;
        renderSeasonStandingsAdminTable();

        // 6. Notificar a Discord Webhook
        if (window.NFS_DISCORD_NOTIFIER) {
            const top3 = finalStandings.slice(0, 3);
            window.NFS_DISCORD_NOTIFIER.notifySeasonStandings({
                seasonName: season.name,
                period: season.period,
                totalPilots: finalStandings.length,
                top3: top3,
                moderator: currentUser ? (currentUser.displayName || currentUser.email) : 'Comisaría Oficial NFS MW'
            }).catch(e => console.warn("Discord notify error:", e));
        }

        showToast(`✓ ¡Clasificación de ${season.name} publicada en Firebase y notificada a Discord!`, "success");
    } catch (err) {
        console.error("Error al recalcular temporada:", err);
        showToast(`❌ Error: ${err.message}`, "error");
    }
}

function openAddSeasonPilotModal() {
    const driverName = prompt("Nombre / Nick del piloto a añadir a la clasificación:");
    if (!driverName || !driverName.trim()) return;

    const ptsStr = prompt(`Puntos iniciales para ${driverName.trim()} (ej: 50):`, "25");
    const pts = parseInt(ptsStr || '0', 10);

    const newPilot = {
        rank: `#${currentSeasonStandings.length + 1}`,
        driver: driverName.trim(),
        s1: pts,
        s2: 0,
        s3: 0,
        s4: 0,
        totalPts: pts,
        totalBounty: `$${(pts * 20000).toLocaleString('de-DE')}`,
        badgeTitle: "Piloto Invitado",
        rewardMedals: "Medalla Oficial"
    };

    currentSeasonStandings.push(newPilot);
    renderSeasonStandingsAdminTable();
    showToast(`Piloto ${newPilot.driver} añadido. Recuerda pulsar "⚡ Recalcular y Publicar en RTDB" para guardar los cambios.`, "info");
}

function editSeasonPilot(driverName) {
    const p = currentSeasonStandings.find(x => x.driver.toLowerCase() === driverName.toLowerCase());
    if (!p) return;

    const s1 = prompt(`Puntos Semana 1 para ${p.driver}:`, p.s1 || 0);
    const s2 = prompt(`Puntos Semana 2 para ${p.driver}:`, p.s2 || 0);
    const s3 = prompt(`Puntos Semana 3 para ${p.driver}:`, p.s3 || 0);
    const s4 = prompt(`Puntos Semana 4 para ${p.driver}:`, p.s4 || 0);

    p.s1 = parseInt(s1 || '0', 10);
    p.s2 = parseInt(s2 || '0', 10);
    p.s3 = parseInt(s3 || '0', 10);
    p.s4 = parseInt(s4 || '0', 10);
    p.totalPts = p.s1 + p.s2 + p.s3 + p.s4;
    p.totalBounty = `$${(p.totalPts * 20000).toLocaleString('de-DE')}`;

    renderSeasonStandingsAdminTable();
    showToast(`Puntos actualizados para ${p.driver}. Pulsa "⚡ Recalcular y Publicar en RTDB" para sincronizar.`, "info");
}

function deleteSeasonPilot(driverName) {
    if (!confirm(`¿Eliminar a ${driverName} de la clasificación de esta temporada?`)) return;
    currentSeasonStandings = currentSeasonStandings.filter(x => x.driver.toLowerCase() !== driverName.toLowerCase());
    renderSeasonStandingsAdminTable();
    showToast(`Piloto ${driverName} retirado de la tabla local. Guarda los cambios para publicar.`, "info");
}
