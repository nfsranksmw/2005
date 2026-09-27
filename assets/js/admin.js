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
let currentLbRecords = [];
let isMigrating = false;

/**
 * Máscara estricta de tiempo de carrera (MM:SS.mmm)
 */
function applyRaceTimeMask(input) {
    if (!input) return;
    let val = input.value.replace(/[^0-9]/g, '');
    if (val.length > 7) val = val.substring(0, 7);
    if (val.length === 0) {
        input.value = '';
        return;
    }
    let res = '';
    if (val.length <= 2) {
        res = val;
    } else if (val.length <= 4) {
        res = val.substring(0, 2) + ':' + val.substring(2);
    } else {
        res = val.substring(0, 2) + ':' + val.substring(2, 4) + '.' + val.substring(4);
    }
    input.value = res;
}

/**
 * Genera el HTML de opciones de las 86 pistas oficiales agrupadas
 */
function getRouteSelectOptionsHTML(selectedRouteName) {
    if (typeof routesData === 'undefined' || !routesData.length) return '';
    const normSelected = (selectedRouteName || '').trim().toLowerCase();
    const circuitTracks = routesData.filter(r => r.type === 'Circuito');
    const sprintTracks = routesData.filter(r => r.type === 'Sprint');
    const dragTracks = routesData.filter(r => r.type === 'Drag');

    const renderGrp = (label, list) => {
        let optHtml = `<optgroup label="${label}">`;
        list.forEach(r => {
            const isSel = (r.name.trim().toLowerCase() === normSelected) ? 'selected' : '';
            optHtml += `<option value="${escapeHtml(r.name)}" ${isSel}>${escapeHtml(r.name)}</option>`;
        });
        optHtml += `</optgroup>`;
        return optHtml;
    };

    return renderGrp('🏁 Circuitos', circuitTracks) + 
           renderGrp('⚡ Sprints', sprintTracks) + 
           renderGrp('🔥 Drags', dragTracks);
}

/**
 * Ajusta la disponibilidad del selector de tipo de vuelta según el tipo de pista
 */
function handleSubCardRouteChange(subKey) {
    const routeSelect = document.getElementById(`edit-route-${subKey}`);
    const lapTypeSelect = document.getElementById(`edit-laptype-${subKey}`);
    if (!routeSelect || !lapTypeSelect || typeof routesData === 'undefined') return;

    const matched = routesData.find(r => r.name.toLowerCase() === routeSelect.value.trim().toLowerCase());
    if (matched) {
        if (matched.type !== 'Circuito') {
            lapTypeSelect.disabled = true;
            lapTypeSelect.style.opacity = '0.5';
        } else {
            lapTypeSelect.disabled = false;
            lapTypeSelect.style.opacity = '1';
        }
    }
}

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
    if (tabId === 'championship') loadChampionshipAdmin();
    if (tabId === 'challenges') loadSeasonChallengesEditor();
}

// =======================================================
// FIREBASE RTDB: MÉTODOS ROBUSTOS DE LECTURA Y ESCRITURA
// =======================================================
/**
 * Obtiene datos desde Firebase Realtime Database con soporte de SDK,
 * autenticación REST con token y caché local de contingencia.
 */
async function rtdbGet(path) {
    if (!path) return null;
    const cleanPath = path.replace(/^\/+|\/+$/g, '');

    // 1. Intentar Firebase Database SDK si está inicializado
    if (typeof firebase !== 'undefined' && typeof firebase.database === 'function') {
        try {
            const db = firebase.database();
            const snap = await db.ref(cleanPath).once('value');
            if (snap.exists()) {
                const val = snap.val();
                if (val !== null && val !== undefined) {
                    try {
                        localStorage.setItem(`nfs_rtdb_${cleanPath.replace(/[^a-zA-Z0-9_-]/g, '_')}`, JSON.stringify(val));
                    } catch (e) {}
                    return val;
                }
            }
        } catch (sdkErr) {
            console.warn("rtdbGet SDK notice:", sdkErr);
        }
    }

    // 2. Intentar REST con token de usuario autenticado si existe
    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    let token = '';
    try {
        if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function' && firebase.auth().currentUser) {
            token = await firebase.auth().currentUser.getIdToken(false);
        }
    } catch (e) {}

    const authQuery = token ? `?auth=${token}` : '';
    try {
        const res = await fetch(`${baseUrl}/${cleanPath}.json${authQuery}`);
        if (res.ok) {
            const json = await res.json();
            if (json !== null && json !== undefined) {
                try {
                    localStorage.setItem(`nfs_rtdb_${cleanPath.replace(/[^a-zA-Z0-9_-]/g, '_')}`, JSON.stringify(json));
                } catch (e) {}
                return json;
            }
        }
    } catch (fetchErr) {
        console.warn("rtdbGet REST notice:", fetchErr);
    }

    // 3. Fallback a caché local persistente
    try {
        const cached = localStorage.getItem(`nfs_rtdb_${cleanPath.replace(/[^a-zA-Z0-9_-]/g, '_')}`);
        if (cached) return JSON.parse(cached);
    } catch (e) {}

    return null;
}

/**
 * Guarda datos en Firebase Realtime Database con soporte prioritario de SDK,
 * autenticación REST con token y caché local instantánea de contingencia.
 */
async function rtdbPut(path, data) {
    if (!path) throw new Error("Ruta de Firebase no especificada.");
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    let writeErr = null;

    // Respaldo en caché local de inmediato
    try {
        localStorage.setItem(`nfs_rtdb_${cleanPath.replace(/[^a-zA-Z0-9_-]/g, '_')}`, JSON.stringify(data));
    } catch (e) {}

    // 1. Intentar Firebase Database SDK (vía WebSocket autenticado)
    if (typeof firebase !== 'undefined' && typeof firebase.database === 'function') {
        try {
            await firebase.database().ref(cleanPath).set(data);
            return true;
        } catch (sdkErr) {
            console.warn("rtdbPut SDK notice:", sdkErr);
            writeErr = sdkErr;
        }
    }

    // 2. Intentar REST con token de Firebase Auth
    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    let token = '';
    try {
        if (typeof firebase !== 'undefined' && typeof firebase.auth === 'function' && firebase.auth().currentUser) {
            token = await firebase.auth().currentUser.getIdToken(false);
        }
    } catch (e) {}

    const authQuery = token ? `?auth=${token}` : '';
    try {
        const res = await fetch(`${baseUrl}/${cleanPath}.json${authQuery}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            return true;
        } else {
            const errText = await res.text();
            console.warn("rtdbPut REST error:", res.status, errText);
            // Si el error fue 401 y hay sesión de emergencia/local
            if (res.status === 401 && (!currentUser || currentUser.isEmergency)) {
                console.info("Permiso denegado en nube pero respaldado localmente.");
                return true;
            }
            throw new Error(`HTTP ${res.status}: ${errText || 'Error de permisos o red en Firebase'}`);
        }
    } catch (fetchErr) {
        console.warn("rtdbPut REST exception:", fetchErr);
        if (!writeErr) writeErr = fetchErr;
    }

    // Si falló por red/permisos pero está en sesión de emergencia
    if (currentUser && currentUser.isEmergency) {
        console.warn("Guardado completado en almacenamiento local.");
        return true;
    }

    if (writeErr) {
        throw writeErr;
    }
    return true;
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
        const isCircuit = typeof routesData !== 'undefined' ? 
            (routesData.find(r => r.name.toLowerCase() === (sub.route || '').toLowerCase())?.type === 'Circuito') : true;

        html += `
            <div class="sub-card ${statusClass}" id="sub-card-${sub._key}">
                <div class="sub-card-header">
                    <div class="sub-route-title">
                        <span>🏁 ${escapeHtml(sub.route || 'Ruta no especificada')}</span>
                        <span class="sub-badge-category">${escapeHtml(sub.category || 'Junkman')} ${sub.lapType ? '• ' + escapeHtml(sub.lapType) : ''}</span>
                        ${sub.seasonId ? `<span class="badge-season-tag" style="background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.4); color: #22d3ee; font-size: 10.5px; font-weight: bold; padding: 2px 7px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">🏆 ${sub.seasonId === 'season_1' ? 'Temporada 1' : 'Temporada 2'} • S${sub.weekNum || 1}</span>` : ''}
                        <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">[${sub.id || sub._key}]</span>
                    </div>
                    <span class="sub-badge-status ${badgeClass}">${statusLabel}</span>
                </div>

                <div class="sub-card-body" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                    <div>
                        <span class="sub-cell-label">👤 Piloto / Nick</span>
                        <input type="text" class="sub-inline-input" id="edit-driver-${sub._key}" value="${escapeHtml(sub.driver || '')}" title="Editar piloto">
                    </div>
                    <div>
                        <span class="sub-cell-label">⏱️ Tiempo Declarado</span>
                        <input type="text" class="sub-inline-input" id="edit-time-${sub._key}" value="${escapeHtml(sub.time || '')}" placeholder="01:20.750" maxlength="9" oninput="applyRaceTimeMask(this)" style="font-family: var(--font-mono); font-weight: 700; color: var(--nfs-orange);" title="Editar tiempo">
                    </div>
                    <div>
                        <span class="sub-cell-label">🏁 Pista Oficial</span>
                        <select class="sub-inline-input" id="edit-route-${sub._key}" onchange="handleSubCardRouteChange('${sub._key}')" title="Modificar pista oficial">
                            ${getRouteSelectOptionsHTML(sub.route)}
                        </select>
                    </div>
                    <div>
                        <span class="sub-cell-label">🏆 Categoría Técnica</span>
                        <select class="sub-inline-input" id="edit-category-${sub._key}" title="Modificar categoría">
                            <option value="Junkman" ${(sub.category === 'Junkman' || !sub.category) ? 'selected' : ''}>Junkman</option>
                            <option value="BMW M3 GTR" ${sub.category === 'BMW M3 GTR' ? 'selected' : ''}>BMW M3 GTR</option>
                        </select>
                    </div>
                    <div>
                        <span class="sub-cell-label">🔄 Tipo de Vuelta</span>
                        <select class="sub-inline-input" id="edit-laptype-${sub._key}" ${!isCircuit ? 'disabled style="opacity: 0.5;"' : ''} title="Modificar tipo de vuelta">
                            <option value="Single Lap" ${(sub.lapType === 'Single Lap' || !sub.lapType) ? 'selected' : ''}>Single Lap</option>
                            <option value="Fast Lap" ${sub.lapType === 'Fast Lap' ? 'selected' : ''}>Fast Lap</option>
                        </select>
                    </div>
                    <div>
                        <span class="sub-cell-label">🚗 Vehículo</span>
                        <input type="text" class="sub-inline-input" id="edit-car-${sub._key}" value="${escapeHtml(sub.car || 'BMW M3 GTR')}" title="Editar vehículo">
                    </div>
                    <div>
                        <span class="sub-cell-label">⚙️ Transmisión</span>
                        <select class="sub-inline-input" id="edit-gearbox-${sub._key}" title="Modificar transmisión">
                            <option value="Manual" ${(sub.gearbox === 'Manual' || !sub.gearbox) ? 'selected' : ''}>Manual</option>
                            <option value="Automático" ${sub.gearbox === 'Automático' ? 'selected' : ''}>Automático</option>
                        </select>
                    </div>
                    <div>
                        <span class="sub-cell-label">🎮 Control / Mando</span>
                        <select class="sub-inline-input" id="edit-device-${sub._key}" title="Modificar dispositivo">
                            ${window.NFS_HARDWARE ? window.NFS_HARDWARE.getSelectOptionsHTML(sub.device) : `
                                <option value="Teclado">Teclado</option>
                                <option value="PlayStation 5 (DualSense)">PlayStation 5 (DualSense)</option>
                                <option value="PlayStation 4 (DualShock 4)">PlayStation 4 (DualShock 4)</option>
                                <option value="PlayStation 3 (DualShock 3)">PlayStation 3 (DualShock 3)</option>
                                <option value="Xbox One / Series X">Xbox One / Series X</option>
                                <option value="Xbox 360">Xbox 360</option>
                                <option value="Logitech F310">Logitech F310</option>
                                <option value="Logitech F710">Logitech F710</option>
                                <option value="Logitech Dual Action">Logitech Dual Action</option>
                                <option value="Volante">Volante</option>
                                <option value="Mando Genérico">Mando Genérico / Pad</option>
                            `}
                        </select>
                    </div>
                    <div>
                        <span class="sub-cell-label">📅 Fecha de Récord</span>
                        <input type="date" class="sub-inline-input" id="edit-date-${sub._key}" value="${sub.date || new Date().toISOString().split('T')[0]}" title="Modificar fecha">
                    </div>
                    <div>
                        <span class="sub-cell-label">🌐 Modalidad</span>
                        <select class="sub-inline-input" id="edit-mode-${sub._key}" title="Modificar modalidad">
                            <option value="Online" ${(sub.mode === 'Online' || !sub.mode) ? 'selected' : ''}>Online</option>
                            <option value="Offline" ${sub.mode === 'Offline' ? 'selected' : ''}>Offline</option>
                        </select>
                    </div>
                    <div style="grid-column: 1 / -1;">
                        <span class="sub-cell-label">🎬 Enlace de Video (YouTube / Twitch)</span>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <input type="url" class="sub-inline-input" id="edit-video-${sub._key}" value="${escapeHtml(videoLink)}" placeholder="https://www.youtube.com/watch?v=..." style="flex: 1;" title="Editar enlace de video">
                            ${videoLink ? `
                                <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="openVideoPreview(document.getElementById('edit-video-${sub._key}').value)">
                                    ▶ Previsualizar
                                </button>
                                <a href="${escapeHtml(videoLink)}" target="_blank" rel="noopener noreferrer" class="admin-btn admin-btn-outline admin-btn-sm" style="color: #ff5555; border-color: rgba(255, 85, 85, 0.4);">
                                    ↗ Abrir
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <div class="sub-card-footer">
                    <div class="sub-telemetry-meta">
                        ${sub.startMark && sub.endMark ? `<span>📐 Marcas: <strong>${sub.startMark}</strong> → <strong>${sub.endMark}</strong> (Δ: <strong>${sub.diff || '--'}</strong>)</span>` : ''}
                        <span>Estado: <strong>${statusLabel}</strong></span>
                    </div>

                    <div class="sub-actions-group">
                        <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="saveSubmissionDraft('${sub._key}')" title="Guardar todos los cambios en la solicitud">
                            💾 Guardar Cambios
                        </button>
                        ${status !== 'approved' ? `
                            <button type="button" class="admin-btn admin-btn-success admin-btn-sm" onclick="approveSubmission('${sub._key}')" title="Guardar y homologar en el Leaderboard">
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
// 4. GUARDADO DE CAMBIOS, APROBACIÓN Y RECHAZO
// =======================================================
async function saveSubmissionDraft(subKey) {
    const sub = allSubmissions[subKey];
    if (!sub) return;

    const driverVal = document.getElementById(`edit-driver-${subKey}`)?.value.trim() || sub.driver;
    const timeVal = document.getElementById(`edit-time-${subKey}`)?.value.trim() || sub.time;
    const carVal = document.getElementById(`edit-car-${subKey}`)?.value.trim() || sub.car;
    const routeVal = document.getElementById(`edit-route-${subKey}`)?.value.trim() || sub.route;
    const categoryVal = document.getElementById(`edit-category-${subKey}`)?.value.trim() || sub.category;
    const lapTypeVal = document.getElementById(`edit-laptype-${subKey}`)?.value.trim() || sub.lapType;
    const gearboxVal = document.getElementById(`edit-gearbox-${subKey}`)?.value.trim() || sub.gearbox;
    const deviceVal = document.getElementById(`edit-device-${subKey}`)?.value.trim() || sub.device;
    const dateVal = document.getElementById(`edit-date-${subKey}`)?.value.trim() || sub.date;
    const modeVal = document.getElementById(`edit-mode-${subKey}`)?.value.trim() || sub.mode;
    const videoVal = document.getElementById(`edit-video-${subKey}`)?.value.trim() || sub.videoUrl;

    const parseFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.parseTimeToMs) ? window.NFS_FIREBASE.parseTimeToMs : null;
    const timeMs = parseFn ? parseFn(timeVal) : sub.timeMs;

    const updatedSub = {
        ...sub,
        driver: driverVal,
        time: timeVal,
        timeMs: timeMs,
        car: carVal,
        route: routeVal,
        category: categoryVal,
        lapType: lapTypeVal,
        gearbox: gearboxVal,
        device: deviceVal,
        date: dateVal,
        mode: modeVal,
        videoUrl: videoVal
    };

    try {
        await rtdbPut(`submissions/${subKey}`, updatedSub);
        allSubmissions[subKey] = updatedSub;
        showToast("✓ Cambios guardados en la solicitud", "success");
        renderSubmissionsList();
    } catch (e) {
        showToast(`Error guardando cambios: ${e.message}`, "error");
    }
}

async function approveSubmission(subKey) {
    const sub = allSubmissions[subKey];
    if (!sub) return;

    // Obtener todos los campos editados
    const driverInput = document.getElementById(`edit-driver-${subKey}`);
    const timeInput = document.getElementById(`edit-time-${subKey}`);
    const carInput = document.getElementById(`edit-car-${subKey}`);
    const routeInput = document.getElementById(`edit-route-${subKey}`);
    const categoryInput = document.getElementById(`edit-category-${subKey}`);
    const lapTypeInput = document.getElementById(`edit-laptype-${subKey}`);
    const gearboxInput = document.getElementById(`edit-gearbox-${subKey}`);
    const deviceInput = document.getElementById(`edit-device-${subKey}`);
    const dateInput = document.getElementById(`edit-date-${subKey}`);
    const modeInput = document.getElementById(`edit-mode-${subKey}`);
    const videoInput = document.getElementById(`edit-video-${subKey}`);

    const finalDriver = driverInput ? driverInput.value.trim() : sub.driver;
    const finalTime = timeInput ? timeInput.value.trim() : sub.time;
    const finalCar = carInput ? carInput.value.trim() : (sub.car || 'BMW M3 GTR');
    const finalRoute = routeInput ? routeInput.value.trim() : (sub.route || 'City Perimeter');
    const finalCategory = categoryInput ? categoryInput.value.trim() : (sub.category || 'Junkman');
    const finalLapType = lapTypeInput ? lapTypeInput.value.trim() : (sub.lapType || 'Single Lap');
    const finalGearbox = gearboxInput ? gearboxInput.value.trim() : (sub.gearbox || 'Manual');
    const finalDevice = deviceInput ? deviceInput.value.trim() : (sub.device || 'Teclado');
    const finalDate = dateInput ? dateInput.value.trim() : (sub.date || new Date().toISOString().split('T')[0]);
    const finalMode = modeInput ? modeInput.value.trim() : (sub.mode || 'Online');
    const finalVideo = videoInput ? videoInput.value.trim() : (sub.videoUrl || sub.video || sub.yt || '');

    if (!finalDriver || !finalTime) {
        alert("El piloto y el tiempo son obligatorios para homologar.");
        return;
    }

    const parseFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.parseTimeToMs) ? window.NFS_FIREBASE.parseTimeToMs : null;
    const finalTimeMs = parseFn ? parseFn(finalTime) : (sub.timeMs || null);

    if (finalTimeMs === null) {
        alert("Formato de tiempo inválido. Usa MM:SS.mmm (ej: 01:20.750).");
        return;
    }

    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    const sanitizeFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.sanitizeKey) ? window.NFS_FIREBASE.sanitizeKey : (str => str.toLowerCase().replace(/[^a-z0-9_-]/g, '_'));

    // Calcular tipo de pista y clave de categoría en Firebase
    const routes = typeof routesData !== 'undefined' ? routesData : [];
    const matchedRoute = routes.find(r => r.name.toLowerCase() === finalRoute.toLowerCase());
    const isCircuit = matchedRoute ? (matchedRoute.type === 'Circuito') : true;

    let categoryKey = 'junkman_single';
    if (isCircuit) {
        if (finalCategory === 'BMW M3 GTR') {
            categoryKey = (finalLapType === 'Fast Lap') ? 'bmw_fast' : 'bmw_single';
        } else {
            categoryKey = (finalLapType === 'Fast Lap') ? 'junkman_fast' : 'junkman_single';
        }
    } else {
        categoryKey = (finalCategory === 'BMW M3 GTR') ? 'bmw' : 'junkman';
    }

    const routeKey = sanitizeFn(finalRoute);

    showToast("Homologando tiempo en el Leaderboard...", "info");

    try {
        // 1. Obtener la tabla actual del Leaderboard para esa pista y categoría
        const targetLbPath = `leaderboards/${routeKey}/${categoryKey}`;
        let existingRecords = [];
        const lbData = await rtdbGet(targetLbPath);
        if (Array.isArray(lbData)) {
            existingRecords = lbData.filter(Boolean);
        } else if (lbData && typeof lbData === 'object') {
            existingRecords = Object.values(lbData).filter(Boolean);
        }

        const newRecord = {
            rank: "#--",
            driver: finalDriver,
            time: finalTime,
            timeMs: finalTimeMs,
            car: finalCar,
            device: finalDevice,
            gearbox: finalGearbox,
            date: finalDate,
            yt: finalVideo || '#',
            videoUrl: finalVideo || '#',
            video: finalVideo || '#',
            submissionId: sub.id || subKey,
            verified: true
        };

        // Comprobar si el piloto ya tenía un tiempo en esta tabla
        const existingIdx = existingRecords.findIndex(r =>
            r && r.driver && r.driver.trim().toLowerCase() === finalDriver.toLowerCase()
        );

        if (existingIdx !== -1) {
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
        await rtdbPut(targetLbPath, existingRecords);

        const assignedRank = existingRecords.find(r => (r.driver || '').toLowerCase() === finalDriver.toLowerCase())?.rank || "#1";

        // 3. Actualizar estado de la solicitud en /submissions a 'approved'
        const updatedSub = {
            ...sub,
            driver: finalDriver,
            car: finalCar,
            time: finalTime,
            timeMs: finalTimeMs,
            route: finalRoute,
            category: finalCategory,
            lapType: finalLapType,
            routeKey: routeKey,
            categoryKey: categoryKey,
            gearbox: finalGearbox,
            device: finalDevice,
            date: finalDate,
            mode: finalMode,
            videoUrl: finalVideo,
            status: "approved",
            assignedRank: assignedRank,
            approvedAt: new Date().toISOString(),
            approvedBy: currentUser ? currentUser.email : 'Admin'
        };

        await rtdbPut(`submissions/${subKey}`, updatedSub);

        allSubmissions[subKey] = updatedSub;
        updateSubmissionMetrics();
        renderSubmissionsList();

        // 4. Notificar automáticamente a Discord Webhook
        if (window.NFS_DISCORD_NOTIFIER) {
            window.NFS_DISCORD_NOTIFIER.notifyApproval({
                driver: finalDriver,
                route: finalRoute,
                category: `${finalCategory} ${isCircuit ? '• ' + finalLapType : ''}`,
                categoryKey: categoryKey,
                time: finalTime,
                car: finalCar,
                rank: assignedRank,
                device: finalDevice,
                gearbox: finalGearbox,
                date: finalDate,
                videoUrl: finalVideo,
                moderator: currentUser ? (currentUser.displayName || currentUser.email) : 'Comisaría Oficial',
                rewardDesc: sub.rewardDesc || null,
                seasonName: sub.seasonName || (sub.seasonId ? (sub.seasonId === 'season_1' ? 'Blacklist Temporada 1 (Noviembre 2026)' : 'Blacklist Temporada 2 (Diciembre 2026)') : null),
                weekTitle: sub.weekTitle || (sub.weekNum ? `Semana ${sub.weekNum}` : null)
            }).catch(e => console.warn("Discord notify error:", e));
        }

        showToast(`✓ ¡Récord homologado! Asignado puesto ${assignedRank} en ${finalRoute}. Publicado en Discord (ES / EN).`, "success");
    } catch (err) {
        console.error("Error homologando solicitud:", err);
        showToast(`Error al homologar: ${err.message}`, "error");
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

        await rtdbPut(`submissions/${subKey}`, updatedSub);

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

    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 25px; color: var(--text-muted);">Cargando registros oficiales...</td></tr>`;

    const sanitizeFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.sanitizeKey) ? window.NFS_FIREBASE.sanitizeKey : (str => str.toLowerCase().replace(/[^a-z0-9_-]/g, '_'));
    const routeKey = sanitizeFn(currentLbRoute.name);

    try {
        const data = await rtdbGet(`leaderboards/${routeKey}/${currentLbCategory}`);

        let records = [];
        if (Array.isArray(data)) {
            records = data.filter(Boolean);
        } else if (data && typeof data === 'object') {
            records = Object.values(data).filter(Boolean);
        }

        currentLbRecords = records;

        if (records.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 30px; color: var(--text-muted); font-family: var(--font-heading);">No hay tiempos oficiales registrados en esta tabla aún.</td></tr>`;
            return;
        }

        let html = '';
        records.forEach((row, idx) => {
            const rankNum = idx + 1;
            const rankBadge = rankNum === 1 ? 'rank-gold' : rankNum === 2 ? 'rank-silver' : rankNum === 3 ? 'rank-bronze' : 'rank-normal';
            const videoLink = row.videoUrl || row.video || row.yt || '';

            const videoCellHtml = videoLink ? 
                `<button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="openVideoPreview('${escapeHtml(videoLink)}')" title="Ver video de la carrera" style="padding: 4px 8px; font-size: 11px;">▶ Ver</button>` :
                `<span style="color: var(--text-muted); font-size: 11px;">--</span>`;

            html += `
                <tr>
                    <td><span class="table-rank-badge ${rankBadge}">#${rankNum}</span></td>
                    <td><strong style="color: #fff;">${escapeHtml(row.driver || '--')}</strong></td>
                    <td style="font-family: var(--font-mono); font-weight: 700; color: var(--nfs-orange); font-size: 14px;">${row.time || '--:--.---'}</td>
                    <td>${escapeHtml(row.car || 'BMW M3 GTR')}</td>
                    <td>${window.NFS_HARDWARE ? window.NFS_HARDWARE.getBadgeHTML(row.device, row.gearbox) : `<span style="color: var(--cyan-neon); font-size: 11.5px;">${escapeHtml(row.device || 'PC')} / ${escapeHtml(row.gearbox || 'Manual')}</span>`}</td>
                    <td style="color: var(--text-muted); font-size: 11px; font-family: var(--font-mono);">${row.date || '--'}</td>
                    <td style="text-align: center;">${videoCellHtml}</td>
                    <td>
                        <div style="display: flex; gap: 6px; justify-content: center;">
                            <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="openEditLeaderboardModal(${idx})" title="Editar todos los parámetros de este tiempo" style="padding: 4px 8px; font-size: 11.5px;">
                                ✏️ Editar
                            </button>
                            <button type="button" class="admin-btn admin-btn-danger admin-btn-sm" onclick="deleteLeaderboardRow(${idx})" title="Eliminar registro" style="padding: 4px 8px; font-size: 11.5px;">
                                🗑️
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 25px; color: var(--f1-red);">Error consultando la tabla: ${err.message}</td></tr>`;
    }
}

async function deleteLeaderboardRow(rowIndex) {
    if (!currentLbRoute) return;
    if (!confirm(`¿Eliminar este registro de la posición #${rowIndex + 1}?`)) return;

    const sanitizeFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.sanitizeKey) ? window.NFS_FIREBASE.sanitizeKey : (str => str.toLowerCase().replace(/[^a-z0-9_-]/g, '_'));
    const routeKey = sanitizeFn(currentLbRoute.name);
    const targetPath = `leaderboards/${routeKey}/${currentLbCategory}`;

    try {
        let data = await rtdbGet(targetPath);
        let records = [];
        if (Array.isArray(data)) {
            records = data.filter(Boolean);
        } else if (data && typeof data === 'object') {
            records = Object.values(data).filter(Boolean);
        } else if (Array.isArray(currentLbRecords)) {
            records = [...currentLbRecords];
        }

        if (!records.length || rowIndex < 0 || rowIndex >= records.length) {
            showToast("Índice no válido o registro ya eliminado", "error");
            return;
        }

        records.splice(rowIndex, 1);

        // Recalcular posiciones
        records = records.map((item, idx) => ({
            ...item,
            rank: `#${idx + 1}`
        }));

        await rtdbPut(targetPath, records);
        currentLbRecords = records;

        showToast("Registro eliminado del Leaderboard", "info");
        loadLeaderboardTab();
    } catch (err) {
        showToast(`Error: ${err.message}`, "error");
    }
}

/**
 * Abre modal para agregar un tiempo nuevo manualmente al leaderboard
 */
function openAddLeaderboardModal() {
    const modal = document.getElementById('modal-lb-entry');
    const titleEl = document.getElementById('modal-lb-entry-title');
    const idxInput = document.getElementById('modal-lb-edit-index');
    const saveBtn = document.getElementById('btn-save-lb-entry');
    if (!modal) return;

    if (titleEl) titleEl.innerText = "➕ Agregar Nuevo Tiempo al Leaderboard";
    if (idxInput) idxInput.value = "-1";
    if (saveBtn) saveBtn.innerHTML = "💾 Guardar en Leaderboard";

    const routeSel = document.getElementById('modal-lb-route');
    if (routeSel) {
        routeSel.innerHTML = getRouteSelectOptionsHTML(currentLbRoute ? currentLbRoute.name : '');
    }

    updateModalLbCategories();

    // Valores por defecto
    document.getElementById('modal-lb-driver').value = '';
    document.getElementById('modal-lb-time').value = '';
    document.getElementById('modal-lb-car').value = 'BMW M3 GTR';
    document.getElementById('modal-lb-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-lb-gearbox').value = 'Manual';
    
    const deviceAddSel = document.getElementById('modal-lb-device');
    if (deviceAddSel && window.NFS_HARDWARE) {
        deviceAddSel.innerHTML = window.NFS_HARDWARE.getSelectOptionsHTML('Teclado');
    } else if (deviceAddSel) {
        deviceAddSel.value = 'Teclado';
    }
    
    document.getElementById('modal-lb-video').value = '';
    
    const notifyDiscordCheck = document.getElementById('modal-lb-notify-discord');
    if (notifyDiscordCheck) notifyDiscordCheck.checked = true;

    modal.style.display = 'flex';
}

/**
 * Abre modal para modificar todos los parámetros de un tiempo existente en el leaderboard
 */
function openEditLeaderboardModal(rowIndex) {
    if (!currentLbRecords || !currentLbRecords[rowIndex]) {
        showToast("Registro no encontrado", "error");
        return;
    }
    const rec = currentLbRecords[rowIndex];

    const modal = document.getElementById('modal-lb-entry');
    const titleEl = document.getElementById('modal-lb-entry-title');
    const idxInput = document.getElementById('modal-lb-edit-index');
    const saveBtn = document.getElementById('btn-save-lb-entry');
    if (!modal) return;

    if (titleEl) titleEl.innerText = `✏️ Modificar Registro #${rowIndex + 1} (${rec.driver || 'Piloto'})`;
    if (idxInput) idxInput.value = rowIndex.toString();
    if (saveBtn) saveBtn.innerHTML = "💾 Guardar Cambios";

    const routeSel = document.getElementById('modal-lb-route');
    if (routeSel) {
        routeSel.innerHTML = getRouteSelectOptionsHTML(currentLbRoute ? currentLbRoute.name : '');
    }

    updateModalLbCategories(currentLbCategory);

    // Cargar todos los datos del registro en los campos del modal
    document.getElementById('modal-lb-driver').value = rec.driver || '';
    document.getElementById('modal-lb-time').value = rec.time || '';
    document.getElementById('modal-lb-car').value = rec.car || 'BMW M3 GTR';
    document.getElementById('modal-lb-date').value = rec.date || new Date().toISOString().split('T')[0];
    document.getElementById('modal-lb-gearbox').value = rec.gearbox || 'Manual';
    
    const deviceEditSel = document.getElementById('modal-lb-device');
    if (deviceEditSel && window.NFS_HARDWARE) {
        deviceEditSel.innerHTML = window.NFS_HARDWARE.getSelectOptionsHTML(rec.device || 'Teclado');
    } else if (deviceEditSel) {
        deviceEditSel.value = rec.device || 'Teclado';
    }
    
    document.getElementById('modal-lb-video').value = rec.videoUrl || rec.video || rec.yt || '';

    const notifyDiscordCheck = document.getElementById('modal-lb-notify-discord');
    if (notifyDiscordCheck) notifyDiscordCheck.checked = false;

    modal.style.display = 'flex';
}

/**
 * Cierra el modal de edición/adición de registros en leaderboard
 */
function closeLeaderboardEntryModal() {
    const modal = document.getElementById('modal-lb-entry');
    if (modal) modal.style.display = 'none';
}

/**
 * Actualiza las opciones del selector de categoría en el modal según la pista elegida
 */
function updateModalLbCategories(selectedCat) {
    const routeSel = document.getElementById('modal-lb-route');
    const catSel = document.getElementById('modal-lb-category');
    if (!routeSel || !catSel || typeof routesData === 'undefined') return;

    const matchedRoute = routesData.find(r => r.name === routeSel.value) || currentLbRoute;
    const isCircuit = matchedRoute ? (matchedRoute.type === 'Circuito') : true;

    if (isCircuit) {
        catSel.innerHTML = `
            <option value="junkman_single">Junkman - Single Lap</option>
            <option value="junkman_fast">Junkman - Fast Lap</option>
            <option value="bmw_single">BMW M3 GTR - Single Lap</option>
            <option value="bmw_fast">BMW M3 GTR - Fast Lap</option>
        `;
    } else {
        catSel.innerHTML = `
            <option value="junkman">Junkman</option>
            <option value="bmw">BMW M3 GTR</option>
        `;
    }

    if (selectedCat && catSel.querySelector(`option[value="${selectedCat}"]`)) {
        catSel.value = selectedCat;
    }
}

/**
 * Maneja el cambio de pista en el modal
 */
function handleModalLbRouteChange() {
    updateModalLbCategories();
}

/**
 * Guarda los cambios o agrega el nuevo tiempo al leaderboard en Firebase RTDB
 */
async function saveLeaderboardEntry(event) {
    if (event) event.preventDefault();

    const idxInput = document.getElementById('modal-lb-edit-index');
    const editIdx = parseInt(idxInput ? idxInput.value : '-1', 10);

    const routeVal = document.getElementById('modal-lb-route')?.value || (currentLbRoute ? currentLbRoute.name : '');
    const categoryVal = document.getElementById('modal-lb-category')?.value || currentLbCategory;
    const driverVal = document.getElementById('modal-lb-driver')?.value.trim();
    const timeVal = document.getElementById('modal-lb-time')?.value.trim();
    const carVal = document.getElementById('modal-lb-car')?.value.trim() || 'BMW M3 GTR';
    const dateVal = document.getElementById('modal-lb-date')?.value || new Date().toISOString().split('T')[0];
    const gearboxVal = document.getElementById('modal-lb-gearbox')?.value || 'Manual';
    const deviceVal = document.getElementById('modal-lb-device')?.value || 'Teclado';
    const videoVal = document.getElementById('modal-lb-video')?.value.trim() || '';
    const notifyDiscord = document.getElementById('modal-lb-notify-discord')?.checked || false;

    if (!driverVal || !timeVal) {
        alert("El nombre del piloto y el tiempo son obligatorios.");
        return;
    }

    // Convertir tiempo a ms
    const parseFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.parseTimeToMs) ? window.NFS_FIREBASE.parseTimeToMs : null;
    let timeMs = parseFn ? parseFn(timeVal) : null;
    if (timeMs === null) {
        const parts = timeVal.split(/[:.]/);
        if (parts.length === 3) {
            timeMs = (parseInt(parts[0], 10) * 60000) + (parseInt(parts[1], 10) * 1000) + parseInt(parts[2].padEnd(3, '0').substring(0, 3), 10);
        } else if (parts.length === 2) {
            timeMs = (parseInt(parts[0], 10) * 1000) + parseInt(parts[1].padEnd(3, '0').substring(0, 3), 10);
        }
    }
    if (timeMs === null || isNaN(timeMs)) {
        alert("Formato de tiempo inválido. Usa MM:SS.mmm (ej: 01:20.750).");
        return;
    }

    const saveBtn = document.getElementById('btn-save-lb-entry');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerText = "Guardando en Firebase...";
    }

    const sanitizeFn = (window.NFS_FIREBASE && window.NFS_FIREBASE.sanitizeKey) ? window.NFS_FIREBASE.sanitizeKey : (str => str.toLowerCase().replace(/[^a-z0-9_-]/g, '_'));
    const targetRouteKey = sanitizeFn(routeVal);
    const targetPath = `leaderboards/${targetRouteKey}/${categoryVal}`;

    try {
        const recordObj = {
            rank: "#--",
            driver: driverVal,
            time: timeVal,
            timeMs: timeMs,
            car: carVal,
            date: dateVal,
            gearbox: gearboxVal,
            device: deviceVal,
            videoUrl: videoVal,
            yt: videoVal,
            video: videoVal
        };

        // Obtener la tabla de destino
        const targetData = await rtdbGet(targetPath);
        let targetRecords = [];
        if (Array.isArray(targetData)) {
            targetRecords = targetData.filter(Boolean);
        } else if (targetData && typeof targetData === 'object') {
            targetRecords = Object.values(targetData).filter(Boolean);
        }

        const isSameRouteAndCat = currentLbRoute && (currentLbRoute.name === routeVal) && (currentLbCategory === categoryVal);

        // Si targetRecords vino vacío pero estamos editando la tabla actualmente mostrada, usar currentLbRecords como respaldo
        if (targetRecords.length === 0 && isSameRouteAndCat && Array.isArray(currentLbRecords) && currentLbRecords.length > 0) {
            targetRecords = JSON.parse(JSON.stringify(currentLbRecords));
        }

        if (editIdx >= 0 && isSameRouteAndCat) {
            // Actualizar registro existente in-situ asegurando que yt, video y videoUrl se sincronicen
            const existingRow = targetRecords[editIdx] || (currentLbRecords ? currentLbRecords[editIdx] : {}) || {};
            targetRecords[editIdx] = {
                ...existingRow,
                ...recordObj,
                videoUrl: videoVal,
                yt: videoVal,
                video: videoVal
            };
        } else if (editIdx >= 0 && !isSameRouteAndCat) {
            // Se movió de pista o categoría: remover de la tabla vieja
            const oldRouteKey = sanitizeFn(currentLbRoute.name);
            const oldPath = `leaderboards/${oldRouteKey}/${currentLbCategory}`;
            let oldData = await rtdbGet(oldPath);
            let oldRecords = [];
            if (Array.isArray(oldData)) {
                oldRecords = oldData.filter(Boolean);
            } else if (oldData && typeof oldData === 'object') {
                oldRecords = Object.values(oldData).filter(Boolean);
            } else if (Array.isArray(currentLbRecords)) {
                oldRecords = [...currentLbRecords];
            }

            if (oldRecords.length > editIdx) {
                oldRecords.splice(editIdx, 1);
                oldRecords = oldRecords.map((item, idx) => ({ ...item, rank: `#${idx + 1}` }));
                await rtdbPut(oldPath, oldRecords);
            }

            // Agregar a la tabla de destino
            targetRecords.push(recordObj);
        } else {
            // Agregar nuevo registro manual
            targetRecords.push(recordObj);
        }

        // Ordenar por tiempo (timeMs) ascendente
        targetRecords.sort((a, b) => {
            const msA = a.timeMs !== undefined ? a.timeMs : (parseFn ? parseFn(a.time) : 99999999);
            const msB = b.timeMs !== undefined ? b.timeMs : (parseFn ? parseFn(b.time) : 99999999);
            if (msA !== null && msB !== null && msA !== msB) return msA - msB;
            return (a.driver || '').localeCompare(b.driver || '');
        });

        // Recalcular posiciones
        targetRecords = targetRecords.map((item, idx) => ({
            ...item,
            rank: `#${idx + 1}`
        }));

        // Guardar tabla ordenada en Firebase RTDB
        await rtdbPut(targetPath, targetRecords);

        // Si se editó en la misma vista, actualizar inmediatamente la variable en memoria
        if (isSameRouteAndCat) {
            currentLbRecords = targetRecords;
        }

        const assignedRank = targetRecords.find(r => (r.driver || '').toLowerCase() === driverVal.toLowerCase() && r.time === timeVal)?.rank || "#1";

        // Notificar a Discord Webhook si está marcado
        if (notifyDiscord && window.NFS_DISCORD_NOTIFIER) {
            const isEditing = (editIdx !== -1);
            const catFormatted = categoryVal.replace(/_/g, ' ').toUpperCase();
            window.NFS_DISCORD_NOTIFIER.notifyApproval({
                driver: driverVal,
                route: routeVal,
                category: catFormatted,
                categoryKey: categoryVal,
                time: timeVal,
                car: carVal,
                rank: assignedRank,
                device: deviceVal,
                gearbox: gearboxVal,
                date: dateVal,
                videoUrl: videoVal,
                isUpdate: isEditing,
                actionType: isEditing ? 'update' : 'create',
                moderator: currentUser ? (currentUser.displayName || currentUser.email) : 'Comisaría Oficial'
            }).catch(e => console.warn("Discord notify error:", e));
        }

        closeLeaderboardEntryModal();
        const discordToast = notifyDiscord ? " • Publicado en Discord (ES / EN)" : "";
        showToast(`✓ Registro guardado. Puesto asignado: ${assignedRank} en ${routeVal}${discordToast}.`, "success");

        // Sincronizar vista si cambió de pista o categoría
        if (typeof routesData !== 'undefined') {
            const foundRoute = routesData.find(r => r.name === routeVal);
            if (foundRoute) {
                currentLbRoute = foundRoute;
                const routeSelect = document.getElementById('lb-select-route');
                if (routeSelect) routeSelect.value = routeVal;
                updateCategorySelectorForRoute(foundRoute);
                currentLbCategory = categoryVal;
                const catSelect = document.getElementById('lb-select-category');
                if (catSelect) catSelect.value = categoryVal;
            }
        }

        loadLeaderboardTab();
    } catch (err) {
        console.error("Error al guardar en leaderboard:", err);
        showToast(`Error al guardar: ${err.message}`, "error");
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = (editIdx !== -1) ? "💾 Guardar Cambios" : "💾 Guardar en Leaderboard";
        }
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

// =======================================================
// 8. GESTIÓN OFICIAL DEL CAMPEONATO BLACKLIST 2026
//    (GRUPOS DE CARRERA & LOS 8 DESAFÍOS SEMANALES)
// =======================================================

let currentChampAdminWeek = 1;
let cachedChampWeeksData = null;
let registeredChampionshipParticipants = [];

const FALLBACK_TOURNAMENT_PARTICIPANTS = [
    { rank: 1, alias: "ZimanX", name: "ZimanX", ride: "Porsche Carrera GT" },
    { rank: 2, alias: "MysticX", name: "MysticX", ride: "Ford GT" },
    { rank: 3, alias: "Nebula", name: "Nebula", ride: "Lamborghini Murciélago" },
    { rank: 4, alias: "xLeMondx", name: "xLeMondx", ride: "Mercedes-Benz SLR" },
    { rank: 5, alias: "Avenger", name: "SRTxAvengerT", ride: "Dodge Viper SRT-10" },
    { rank: 6, alias: "DarkShido", name: "Shido", ride: "Aston Martin DB9" },
    { rank: 7, alias: "DannyLove", name: "DannyLove", ride: "Chevrolet Corvette C6" },
    { rank: 8, alias: "Lea", name: "Lea4Speed0", ride: "Porsche 911 Turbo S" },
    { rank: 9, alias: "NFSMW", name: "ellafreyafan", ride: "BMW M3 GTR" }
];

const GREEK_GROUP_NAMES = ["Alfa", "Beta", "Gama", "Delta", "Épsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Ómicron", "Pi", "Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi", "Psi", "Omega"];

function getDefaultChampionshipGroups() {
    return [
        { name: "Grupo Alfa (Líderes)", pilots: [1, 2, 3], tag: "🔥 TIER SUPREME" },
        { name: "Grupo Beta (Aspirantes)", pilots: [4, 5, 6], tag: "⚡ TIER HIGH" },
        { name: "Grupo Gama (Fuerza & Potencia)", pilots: [7, 8, 9], tag: "⚔️ TIER MID-HIGH" },
        { name: "Grupo Delta (Técnica & Derrapes)", pilots: [10, 11, 12], tag: "🎯 TIER MID" },
        { name: "Grupo Épsilon (Defensa de Posición)", pilots: [13, 14, 15], tag: "🛡️ TIER ENTRY" }
    ];
}

async function loadChampionshipRegisteredParticipants() {
    try {
        const local = localStorage.getItem('nfs_championship_participants_v1');
        if (local) {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) {
                registeredChampionshipParticipants = parsed;
            }
        }
    } catch (e) {}

    try {
        const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) 
            ? window.NFS_FIREBASE.RTDB_URL 
            : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
        const res = await fetch(`${baseUrl}/championship_participants.json`);
        if (res.ok) {
            const data = await res.json();
            if (data) {
                const list = [];
                if (Array.isArray(data)) {
                    list.push(...data.filter(Boolean));
                } else if (typeof data === 'object') {
                    Object.keys(data).forEach(key => {
                        if (data[key]) list.push({ ...data[key], _firebaseKey: key });
                    });
                }
                list.sort((a, b) => new Date(a.registeredAt || 0) - new Date(b.registeredAt || 0));
                if (list.length > 0) {
                    registeredChampionshipParticipants = list;
                    try {
                        localStorage.setItem('nfs_championship_participants_v1', JSON.stringify(list));
                    } catch (e) {}
                }
            }
        }
    } catch (e) {
        console.warn("Aviso al consultar participantes del campeonato:", e);
    }
}

function getChampionshipParticipantsList() {
    if (registeredChampionshipParticipants && registeredChampionshipParticipants.length > 0) {
        return registeredChampionshipParticipants;
    }
    return FALLBACK_TOURNAMENT_PARTICIPANTS;
}

function getChampionshipDefaultWeeksData() {
    if (typeof window !== 'undefined' && window.CHAMPIONSHIP_WEEKS_DATA) {
        return window.CHAMPIONSHIP_WEEKS_DATA;
    }
    if (typeof CHAMPIONSHIP_WEEKS_DATA !== 'undefined') {
        return CHAMPIONSHIP_WEEKS_DATA;
    }
    return null;
}

function getChampionshipDefaultDrivers() {
    if (typeof window !== 'undefined' && window.DEFAULT_BLACKLIST_DRIVERS) {
        return window.DEFAULT_BLACKLIST_DRIVERS;
    }
    if (typeof DEFAULT_BLACKLIST_DRIVERS !== 'undefined') {
        return DEFAULT_BLACKLIST_DRIVERS;
    }
    return [];
}

function resolveDriverRank(val) {
    if (!val) return null;
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= 30) return num;
    const clean = String(val).toLowerCase().replace(/^#\s*\d+\s*/, '').trim();

    const participants = getChampionshipParticipantsList();
    const pIdx = participants.findIndex(p => 
        (p.alias && p.alias.toLowerCase() === clean) || 
        (p.name && p.name.toLowerCase() === clean) || 
        (p.alias && p.alias.toLowerCase().includes(clean))
    );
    if (pIdx !== -1) return (participants[pIdx].rank || (pIdx + 1));

    const drivers = getChampionshipDefaultDrivers();
    const match = drivers.find(d => 
        (d.alias && d.alias.toLowerCase() === clean) || 
        (d.name && d.name.toLowerCase() === clean) || 
        (d.alias && d.alias.toLowerCase().includes(clean))
    );
    return match ? match.rank : null;
}

function getBlacklistDriverSelectOptionsHTML(selectedRankOrName) {
    const participants = getChampionshipParticipantsList();
    const blDrivers = getChampionshipDefaultDrivers();

    const cleanSelected = String(selectedRankOrName || '').toLowerCase().trim();
    const selRank = parseInt(selectedRankOrName, 10);

    // 1. Pilotos Inscritos en el Torneo
    const participantsOptions = participants.map((p, idx) => {
        const rank = p.rank || (idx + 1);
        const name = p.name || `Piloto ${rank}`;
        const alias = p.alias || name;
        const ride = p.ride || 'Vehículo Oficial';
        const displayLabel = alias !== name ? `${alias} (${name})` : alias;
        
        const isSel = (!isNaN(selRank) && selRank === rank) || 
                      (cleanSelected && (alias.toLowerCase() === cleanSelected || name.toLowerCase() === cleanSelected || String(rank) === cleanSelected));

        return `<option value="${rank}" ${isSel ? 'selected' : ''}>🏆 #${rank} ${escapeHtml(displayLabel)} [${escapeHtml(ride)}]</option>`;
    }).join('');

    // 2. Pilotos Oficiales Blacklist (Rivales)
    const blacklistOptions = blDrivers.map(d => {
        const isSel = (!isNaN(selRank) && selRank === d.rank) ||
                      (cleanSelected && (d.alias.toLowerCase() === cleanSelected || d.name.toLowerCase() === cleanSelected || String(d.rank) === cleanSelected));
        return `<option value="${d.rank}" ${isSel ? 'selected' : ''}>🏁 #${d.rank} ${escapeHtml(d.alias)} - ${escapeHtml(d.name)} (${escapeHtml(d.ride)})</option>`;
    }).join('');

    return `
        <optgroup label="🏆 PILOTOS INSCRITOS EN EL TORNEO 2026">
            ${participantsOptions}
        </optgroup>
        <optgroup label="🏁 PILOTOS OFICIALES BLACKLIST / RIVALES">
            ${blacklistOptions}
        </optgroup>
    `;
}

function populateBlacklistPilotsDatalist() {
    const datalist = document.getElementById('bl-pilots-datalist');
    if (!datalist) return;
    const participants = getChampionshipParticipantsList();
    const blDrivers = getChampionshipDefaultDrivers();

    let html = '';
    participants.forEach((p, idx) => {
        const rank = p.rank || (idx + 1);
        const name = p.name || `Piloto ${rank}`;
        const alias = p.alias || name;
        html += `<option value="${escapeHtml(alias)}">#${rank} ${escapeHtml(alias)} (${escapeHtml(p.ride || 'Vehículo Oficial')})</option>`;
        if (name !== alias) {
            html += `<option value="${escapeHtml(name)}">#${rank} ${escapeHtml(name)} (${escapeHtml(alias)})</option>`;
        }
    });

    blDrivers.forEach(d => {
        html += `<option value="${escapeHtml(d.alias)}">#${d.rank} ${escapeHtml(d.alias)} (${escapeHtml(d.ride)})</option>`;
    });

    datalist.innerHTML = html;
}

function getActiveChampWeekData(weekNum) {
    const defaults = getChampionshipDefaultWeeksData();
    let src = cachedChampWeeksData || defaults;
    if (!src) return null;

    let week = src[weekNum] || src[String(weekNum)];
    if (!week && Array.isArray(src)) {
        week = src.find(w => w && (w.weekNumber === weekNum || w.weekNum === weekNum)) || src[weekNum];
    }
    if (!week && defaults) {
        week = defaults[weekNum] || defaults[String(weekNum)];
    }
    return week;
}

async function loadChampionshipAdmin() {
    const statusBadge = document.getElementById('champ-admin-status-badge');
    if (statusBadge) statusBadge.textContent = "⏳ Cargando datos...";

    // 1. Cargar participantes registrados
    await loadChampionshipRegisteredParticipants();
    populateBlacklistPilotsDatalist();

    const defaults = getChampionshipDefaultWeeksData();

    // Carga inmediata de memoria local o defaults para renderizado instantáneo (0ms)
    if (!cachedChampWeeksData) {
        try {
            const local = localStorage.getItem('nfs_championship_weeks_data_v1');
            if (local) {
                cachedChampWeeksData = JSON.parse(local);
            }
        } catch (e) {}
    }

    if (!cachedChampWeeksData && defaults) {
        cachedChampWeeksData = JSON.parse(JSON.stringify(defaults));
    }

    // Renderizar de inmediato para que nunca quede la pantalla en blanco
    selectChampionshipAdminWeek(currentChampAdminWeek);
    if (statusBadge) statusBadge.textContent = "🟢 Datos Activos";

    // 2. Comprobar en segundo plano si Firebase RTDB tiene datos más recientes
    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) 
        ? window.NFS_FIREBASE.RTDB_URL 
        : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";

    try {
        const res = await fetch(`${baseUrl}/championship/weeks_data.json`);
        if (res.ok) {
            const data = await res.json();
            if (data && typeof data === 'object') {
                cachedChampWeeksData = data;
                localStorage.setItem('nfs_championship_weeks_data_v1', JSON.stringify(data));
                if (typeof window !== 'undefined' && window.CHAMPIONSHIP_WEEKS_DATA) {
                    Object.assign(window.CHAMPIONSHIP_WEEKS_DATA, data);
                }
                selectChampionshipAdminWeek(currentChampAdminWeek);
                if (statusBadge) statusBadge.textContent = "🟢 Sincronizado RTDB";
            }
        }
    } catch (e) {
        console.warn("Aviso al consultar RTDB para el campeonato:", e);
    }
}

function selectChampionshipAdminWeek(weekNum) {
    currentChampAdminWeek = weekNum;

    for (let i = 1; i <= 4; i++) {
        const btn = document.getElementById(`btn-champ-week-${i}`);
        if (btn) {
            if (i === weekNum) {
                btn.className = "admin-btn admin-btn-sm champ-admin-week-btn active";
            } else {
                btn.className = "admin-btn admin-btn-sm champ-admin-week-btn admin-btn-outline";
            }
        }
    }

    renderChampionshipAdminGroups();
    renderChampionshipAdminChallenges();
}

function renderChampionshipAdminGroups() {
    const container = document.getElementById('champ-admin-groups-container');
    if (!container) return;

    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    if (weekData && (!weekData.groups || !Array.isArray(weekData.groups) || weekData.groups.length === 0)) {
        weekData.groups = getDefaultChampionshipGroups();
    }

    const groups = (weekData && Array.isArray(weekData.groups) && weekData.groups.length > 0)
        ? weekData.groups
        : getDefaultChampionshipGroups();

    container.innerHTML = groups.map((grp, grpIdx) => {
        const pilots = Array.isArray(grp.pilots) ? grp.pilots : [grpIdx * 3 + 1, grpIdx * 3 + 2, grpIdx * 3 + 3];
        return `
            <div class="admin-group-card" id="admin-group-card-${grpIdx}" style="background: rgba(18,22,34,0.75); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 10px; transition: border-color 0.2s ease;">
                <div class="admin-group-header-row" style="display: flex; align-items: center; gap: 8px; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 6px; flex: 1;">
                        <span style="font-size:18px;">👥</span>
                        <input type="text" id="grp-name-${grpIdx}" class="admin-form-input" style="font-weight:700; font-family:var(--font-heading); flex: 1;" value="${escapeHtml(grp.name || `Grupo #${grpIdx+1}`)}" placeholder="Nombre del Grupo">
                        <input type="text" id="grp-tag-${grpIdx}" class="admin-form-input" style="width:130px; font-size:11px; text-align:center;" value="${escapeHtml(grp.tag || 'TIER OFICIAL')}" placeholder="Etiqueta / Tag">
                    </div>
                    <div style="display: flex; gap: 6px; align-items: center;">
                        <button type="button" class="admin-btn admin-btn-xs" onclick="saveChampionshipSingleGroup(${grpIdx})" title="Guardar cambios de este grupo" style="background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.5); color: #6ee7b7; padding: 6px 10px; font-size: 11px; border-radius: 6px; cursor: pointer; white-space: nowrap; transition: all 0.2s ease;">
                            💾 Guardar
                        </button>
                        <button type="button" class="admin-btn admin-btn-xs" onclick="deleteChampionshipAdminGroup(${grpIdx})" title="Eliminar este grupo" style="background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.5); color: #fca5a5; padding: 6px 10px; font-size: 11px; border-radius: 6px; cursor: pointer; white-space: nowrap; transition: all 0.2s ease;">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
                <div style="font-size:11px; color:var(--text-muted); font-weight:700; margin-top:2px;">Pilotos Asignados al Trío / Grupo:</div>
                <div class="admin-group-pilots-list" style="display: flex; flex-direction: column; gap: 8px;">
                    ${[0, 1, 2].map(slotIdx => {
                        const pRank = pilots[slotIdx] || (grpIdx * 3 + slotIdx + 1);
                        return `
                            <div class="admin-group-pilot-row" style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size:11px; color:var(--nfs-orange); font-weight:800; min-width:24px;">#${slotIdx + 1}</span>
                                <select id="grp-p${slotIdx}-${grpIdx}" class="admin-form-input" style="padding:6px 10px; font-size:12px; font-weight:600; cursor:pointer; flex: 1;">
                                    ${getBlacklistDriverSelectOptionsHTML(pRank)}
                                </select>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function getChampionshipGroupsFromUI() {
    const groupCards = document.querySelectorAll('#champ-admin-groups-container .admin-group-card');
    const updatedGroups = [];
    groupCards.forEach((card, grpIdx) => {
        const nameEl = document.getElementById(`grp-name-${grpIdx}`);
        const tagEl = document.getElementById(`grp-tag-${grpIdx}`);
        const p0 = document.getElementById(`grp-p0-${grpIdx}`)?.value;
        const p1 = document.getElementById(`grp-p1-${grpIdx}`)?.value;
        const p2 = document.getElementById(`grp-p2-${grpIdx}`)?.value;

        updatedGroups.push({
            name: nameEl ? nameEl.value.trim() : `Grupo #${grpIdx + 1}`,
            tag: tagEl ? tagEl.value.trim() : 'TIER OFICIAL',
            pilots: [
                parseInt(p0, 10) || resolveDriverRank(p0) || (grpIdx * 3 + 1),
                parseInt(p1, 10) || resolveDriverRank(p1) || (grpIdx * 3 + 2),
                parseInt(p2, 10) || resolveDriverRank(p2) || (grpIdx * 3 + 3)
            ]
        });
    });
    return updatedGroups;
}

async function saveChampionshipSingleGroup(grpIdx) {
    const nameEl = document.getElementById(`grp-name-${grpIdx}`);
    const grpName = nameEl ? nameEl.value.trim() : `Grupo #${grpIdx + 1}`;
    await saveChampionshipAdminGroupsOnly();
    showToast(`✓ ¡${grpName} guardado con éxito!`, "success");
}

async function saveChampionshipAdminGroupsOnly() {
    const groups = getChampionshipGroupsFromUI();
    if (!groups || groups.length === 0) {
        showToast("No hay grupos para guardar.", "warning");
        return;
    }

    const defaults = getChampionshipDefaultWeeksData();
    if (!cachedChampWeeksData) {
        cachedChampWeeksData = defaults ? JSON.parse(JSON.stringify(defaults)) : {};
    }

    if (!cachedChampWeeksData[currentChampAdminWeek] && !cachedChampWeeksData[String(currentChampAdminWeek)]) {
        if (defaults && (defaults[currentChampAdminWeek] || defaults[String(currentChampAdminWeek)])) {
            cachedChampWeeksData[currentChampAdminWeek] = JSON.parse(JSON.stringify(defaults[currentChampAdminWeek] || defaults[String(currentChampAdminWeek)]));
        } else {
            cachedChampWeeksData[currentChampAdminWeek] = { groups: [], challenges: [] };
        }
    }

    const weekObj = cachedChampWeeksData[currentChampAdminWeek] || cachedChampWeeksData[String(currentChampAdminWeek)];
    weekObj.groups = groups;

    showToast(`💾 Guardando grupos de la Semana ${currentChampAdminWeek}...`, "info");
    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) 
        ? window.NFS_FIREBASE.RTDB_URL 
        : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";

    try {
        localStorage.setItem('nfs_championship_weeks_data_v1', JSON.stringify(cachedChampWeeksData));
        if (typeof window !== 'undefined' && window.CHAMPIONSHIP_WEEKS_DATA) {
            Object.assign(window.CHAMPIONSHIP_WEEKS_DATA, cachedChampWeeksData);
        }

        const res = await fetch(`${baseUrl}/championship/weeks_data/${currentChampAdminWeek}/groups.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(groups)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showToast(`✓ ¡Grupos de la Semana ${currentChampAdminWeek} guardados con éxito en RTDB!`, "success");
    } catch (err) {
        console.error("Error al guardar grupos de la semana actual:", err);
        showToast(`⚠️ Guardado en caché local (Error nube: ${err.message})`, "warning");
    }

    const statusBadge = document.getElementById('champ-admin-status-badge');
    if (statusBadge) statusBadge.textContent = "🟢 Grupos Actualizados";
}

async function saveChampionshipGroupsToAllWeeks() {
    const groups = getChampionshipGroupsFromUI();
    if (!groups || groups.length === 0) {
        showToast("No hay grupos para guardar.", "warning");
        return;
    }

    if (!confirm(`¿Confirmas que deseas guardar y aplicar estos ${groups.length} grupos a TODAS las semanas (1, 2, 3 y 4) del Campeonato Blacklist?`)) {
        return;
    }

    const defaults = getChampionshipDefaultWeeksData();
    if (!cachedChampWeeksData) {
        cachedChampWeeksData = defaults ? JSON.parse(JSON.stringify(defaults)) : {};
    }

    // Replicar en todas las 4 semanas
    for (let w = 1; w <= 4; w++) {
        if (!cachedChampWeeksData[w] && !cachedChampWeeksData[String(w)]) {
            if (defaults && (defaults[w] || defaults[String(w)])) {
                cachedChampWeeksData[w] = JSON.parse(JSON.stringify(defaults[w] || defaults[String(w)]));
            } else {
                cachedChampWeeksData[w] = { groups: [], challenges: [] };
            }
        }
        const weekObj = cachedChampWeeksData[w] || cachedChampWeeksData[String(w)];
        weekObj.groups = JSON.parse(JSON.stringify(groups));
    }

    showToast("💾 Guardando y aplicando en todos los grupos y semanas del campeonato...", "info");
    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) 
        ? window.NFS_FIREBASE.RTDB_URL 
        : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";

    try {
        localStorage.setItem('nfs_championship_weeks_data_v1', JSON.stringify(cachedChampWeeksData));
        if (typeof window !== 'undefined' && window.CHAMPIONSHIP_WEEKS_DATA) {
            Object.assign(window.CHAMPIONSHIP_WEEKS_DATA, cachedChampWeeksData);
        }

        const res = await fetch(`${baseUrl}/championship/weeks_data.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cachedChampWeeksData)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showToast(`✓ ¡Guardado con éxito! Se aplicaron los ${groups.length} grupos a todas las semanas (1 a 4).`, "success");
    } catch (err) {
        console.error("Error al guardar en todos los grupos:", err);
        showToast(`⚠️ Guardado en caché local para todos los grupos (Error nube: ${err.message})`, "warning");
    }

    const statusBadge = document.getElementById('champ-admin-status-badge');
    if (statusBadge) statusBadge.textContent = "🟢 Todos los Grupos Guardados";
}

function addChampionshipAdminGroup() {
    const defaults = getChampionshipDefaultWeeksData();
    if (!cachedChampWeeksData) {
        cachedChampWeeksData = defaults ? JSON.parse(JSON.stringify(defaults)) : {};
    }
    if (!cachedChampWeeksData[currentChampAdminWeek] && !cachedChampWeeksData[String(currentChampAdminWeek)]) {
        if (defaults && (defaults[currentChampAdminWeek] || defaults[String(currentChampAdminWeek)])) {
            cachedChampWeeksData[currentChampAdminWeek] = JSON.parse(JSON.stringify(defaults[currentChampAdminWeek] || defaults[String(currentChampAdminWeek)]));
        } else {
            cachedChampWeeksData[currentChampAdminWeek] = { groups: getDefaultChampionshipGroups(), challenges: [] };
        }
    }

    const weekData = cachedChampWeeksData[currentChampAdminWeek] || cachedChampWeeksData[String(currentChampAdminWeek)];
    if (!weekData.groups || !Array.isArray(weekData.groups)) {
        weekData.groups = getDefaultChampionshipGroups();
    }

    const newIdx = weekData.groups.length;
    const greekName = GREEK_GROUP_NAMES[newIdx] || `Grupo #${newIdx + 1}`;
    const startPilot = newIdx * 3 + 1;

    const newGroup = {
        name: `Grupo ${greekName}`,
        tag: "🏁 TIER COMPETICIÓN",
        pilots: [startPilot, startPilot + 1, startPilot + 2]
    };

    weekData.groups.push(newGroup);
    renderChampionshipAdminGroups();
    showToast(`✓ ¡Nuevo ${newGroup.name} agregado! Puedes asignar sus pilotos y guardarlo.`, "success");

    setTimeout(() => {
        const lastInput = document.getElementById(`grp-name-${newIdx}`);
        if (lastInput) {
            lastInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            lastInput.focus();
        }
    }, 120);
}

function deleteChampionshipAdminGroup(grpIdx) {
    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    if (!weekData || !Array.isArray(weekData.groups)) return;

    const grp = weekData.groups[grpIdx];
    const grpName = grp ? (grp.name || `Grupo #${grpIdx + 1}`) : `Grupo #${grpIdx + 1}`;

    if (!confirm(`¿Estás seguro de eliminar "${grpName}" de la Semana ${currentChampAdminWeek}?`)) {
        return;
    }

    weekData.groups.splice(grpIdx, 1);
    renderChampionshipAdminGroups();
    showToast(`Grupo "${grpName}" eliminado. Recuerda hacer clic en "Guardar Semana en RTDB".`, "info");
}


function renderChampionshipAdminChallenges() {
    const container = document.getElementById('champ-admin-challenges-container');
    if (!container) return;

    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    const defaults = getChampionshipDefaultWeeksData();
    const defaultWeek = defaults ? (defaults[currentChampAdminWeek] || defaults[String(currentChampAdminWeek)]) : null;
    const defaultChallenges = defaultWeek && Array.isArray(defaultWeek.challenges) ? defaultWeek.challenges : [];

    let challenges = (weekData && Array.isArray(weekData.challenges) && weekData.challenges.length > 0)
        ? weekData.challenges
        : defaultChallenges;

    if (!challenges || challenges.length === 0) {
        challenges = Array.from({ length: 8 }, (_, idx) => ({
            id: `w${currentChampAdminWeek}-ch${idx+1}`,
            route: `Pista Oficial #${idx+1}`,
            type: "Circuito",
            carRestriction: "Libre / Stock",
            top3: [
                { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 400000, repBadge: "💰 $400.000 REP" },
                { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 250000, repBadge: "💰 $250.000 REP" },
                { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 120000, repBadge: "💰 $120.000 REP" }
            ]
        }));
    }

    container.innerHTML = challenges.map((ch, idx) => {
        const top3 = Array.isArray(ch.top3) ? ch.top3 : [{}, {}, {}];
        const g1 = top3[0] || {};
        const g2 = top3[1] || {};
        const g3 = top3[2] || {};

        return `
            <div class="admin-challenge-card" id="champ-admin-ch-${idx}">
                <!-- Cabecera del Desafío -->
                <div class="admin-challenge-meta-row">
                    <span style="font-family:var(--font-heading); font-size:18px; font-weight:900; color:var(--nfs-orange);">
                        #0${idx + 1}
                    </span>
                    <div>
                        <label class="admin-field-label">🏁 Circuito / Ruta Oficial</label>
                        <input type="text" id="ch-route-${idx}" class="admin-form-input" style="font-weight:700; font-family:var(--font-heading);" value="${escapeHtml(ch.route || '')}" placeholder="Nombre de la ruta">
                    </div>
                    <div>
                        <label class="admin-field-label">🏎️ Tipo de Carrera</label>
                        <select id="ch-type-${idx}" class="admin-form-input" style="width:130px;">
                            <option value="Circuito" ${ch.type === 'Circuito' ? 'selected' : ''}>Circuito</option>
                            <option value="Sprint" ${ch.type === 'Sprint' ? 'selected' : ''}>Sprint</option>
                            <option value="Drag" ${ch.type === 'Drag' ? 'selected' : ''}>Drag</option>
                        </select>
                    </div>
                    <div>
                        <label class="admin-field-label">🚗 Auto Restrictivo</label>
                        <input type="text" id="ch-car-${idx}" class="admin-form-input" style="width:200px;" value="${escapeHtml(ch.carRestriction || '')}" placeholder="Ej: BMW M3 GTR / Stock">
                    </div>
                </div>

                <!-- Casillas de Ganadores: Oro, Silver, Bronce -->
                <div class="admin-winners-grid">
                    <!-- Ganador Oro (1° Puesto) -->
                    <div class="admin-winner-box admin-winner-gold">
                        <div class="admin-winner-header">
                            <span style="color:#fbbf24; font-weight:800; font-size:12px;">🥇 GANADOR ORO (1° PUESTO)</span>
                            <span style="color:var(--nfs-orange); font-size:11px; font-weight:700;">+100 PTS</span>
                        </div>
                        <div>
                            <label class="admin-field-label">Piloto Ganador</label>
                            <input type="text" id="ch-p1-pilot-${idx}" list="bl-pilots-datalist" class="admin-form-input" style="font-weight:700;" value="${escapeHtml(g1.pilot === 'Por disputar' ? '' : (g1.pilot || ''))}" placeholder="Nombre o Nick del Piloto">
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                            <div>
                                <label class="admin-field-label">Auto Utilizado</label>
                                <input type="text" id="ch-p1-car-${idx}" class="admin-form-input" value="${escapeHtml(g1.car || '')}" placeholder="Vehículo">
                            </div>
                            <div>
                                <label class="admin-field-label">Tiempo (mm:ss.ddd)</label>
                                <input type="text" id="ch-p1-time-${idx}" class="admin-form-input" style="font-family:var(--font-mono); font-weight:700; color:#fbbf24;" maxlength="9" oninput="applyRaceTimeMask(this)" value="${escapeHtml(g1.time === '--:--.---' ? '' : (g1.time || ''))}" placeholder="01:14.230">
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                            <div>
                                <label class="admin-field-label">Bono Puntos</label>
                                <input type="number" id="ch-p1-bonus-${idx}" class="admin-form-input" value="${g1.bonus || 100}">
                            </div>
                            <div>
                                <label class="admin-field-label">Recompensa REP ($)</label>
                                <input type="number" id="ch-p1-rep-${idx}" class="admin-form-input" value="${g1.repMoney || 400000}">
                            </div>
                        </div>
                    </div>

                    <!-- Ganador Silver (2° Puesto) -->
                    <div class="admin-winner-box admin-winner-silver">
                        <div class="admin-winner-header">
                            <span style="color:#e2e8f0; font-weight:800; font-size:12px;">🥈 GANADOR SILVER (2° PUESTO)</span>
                            <span style="color:var(--nfs-orange); font-size:11px; font-weight:700;">+50 PTS</span>
                        </div>
                        <div>
                            <label class="admin-field-label">Piloto Segundo</label>
                            <input type="text" id="ch-p2-pilot-${idx}" list="bl-pilots-datalist" class="admin-form-input" style="font-weight:700;" value="${escapeHtml(g2.pilot === 'Por disputar' ? '' : (g2.pilot || ''))}" placeholder="Nombre o Nick del Piloto">
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                            <div>
                                <label class="admin-field-label">Auto Utilizado</label>
                                <input type="text" id="ch-p2-car-${idx}" class="admin-form-input" value="${escapeHtml(g2.car || '')}" placeholder="Vehículo">
                            </div>
                            <div>
                                <label class="admin-field-label">Tiempo (mm:ss.ddd)</label>
                                <input type="text" id="ch-p2-time-${idx}" class="admin-form-input" style="font-family:var(--font-mono); font-weight:700; color:#e2e8f0;" maxlength="9" oninput="applyRaceTimeMask(this)" value="${escapeHtml(g2.time === '--:--.---' ? '' : (g2.time || ''))}" placeholder="01:16.890">
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                            <div>
                                <label class="admin-field-label">Bono Puntos</label>
                                <input type="number" id="ch-p2-bonus-${idx}" class="admin-form-input" value="${g2.bonus || 50}">
                            </div>
                            <div>
                                <label class="admin-field-label">Recompensa REP ($)</label>
                                <input type="number" id="ch-p2-rep-${idx}" class="admin-form-input" value="${g2.repMoney || 250000}">
                            </div>
                        </div>
                    </div>

                    <!-- Ganador Bronce (3° Puesto) -->
                    <div class="admin-winner-box admin-winner-bronze">
                        <div class="admin-winner-header">
                            <span style="color:#fdba74; font-weight:800; font-size:12px;">🥉 GANADOR BRONCE (3° PUESTO)</span>
                            <span style="color:var(--nfs-orange); font-size:11px; font-weight:700;">+20 PTS</span>
                        </div>
                        <div>
                            <label class="admin-field-label">Piloto Tercero</label>
                            <input type="text" id="ch-p3-pilot-${idx}" list="bl-pilots-datalist" class="admin-form-input" style="font-weight:700;" value="${escapeHtml(g3.pilot === 'Por disputar' ? '' : (g3.pilot || ''))}" placeholder="Nombre o Nick del Piloto">
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                            <div>
                                <label class="admin-field-label">Auto Utilizado</label>
                                <input type="text" id="ch-p3-car-${idx}" class="admin-form-input" value="${escapeHtml(g3.car || '')}" placeholder="Vehículo">
                            </div>
                            <div>
                                <label class="admin-field-label">Tiempo (mm:ss.ddd)</label>
                                <input type="text" id="ch-p3-time-${idx}" class="admin-form-input" style="font-family:var(--font-mono); font-weight:700; color:#fdba74;" maxlength="9" oninput="applyRaceTimeMask(this)" value="${escapeHtml(g3.time === '--:--.---' ? '' : (g3.time || ''))}" placeholder="01:19.450">
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                            <div>
                                <label class="admin-field-label">Bono Puntos</label>
                                <input type="number" id="ch-p3-bonus-${idx}" class="admin-form-input" value="${g3.bonus || 20}">
                            </div>
                            <div>
                                <label class="admin-field-label">Recompensa REP ($)</label>
                                <input type="number" id="ch-p3-rep-${idx}" class="admin-form-input" value="${g3.repMoney || 120000}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function saveChampionshipAdmin() {
    const defaults = getChampionshipDefaultWeeksData();
    if (!cachedChampWeeksData) {
        cachedChampWeeksData = defaults ? JSON.parse(JSON.stringify(defaults)) : {};
    }

    if (!cachedChampWeeksData[currentChampAdminWeek] && !cachedChampWeeksData[String(currentChampAdminWeek)]) {
        if (defaults && (defaults[currentChampAdminWeek] || defaults[String(currentChampAdminWeek)])) {
            cachedChampWeeksData[currentChampAdminWeek] = JSON.parse(JSON.stringify(defaults[currentChampAdminWeek] || defaults[String(currentChampAdminWeek)]));
        } else {
            cachedChampWeeksData[currentChampAdminWeek] = { groups: [], challenges: [] };
        }
    }

    const weekData = cachedChampWeeksData[currentChampAdminWeek] || cachedChampWeeksData[String(currentChampAdminWeek)];
    if (!weekData.groups) weekData.groups = [];
    if (!weekData.challenges) weekData.challenges = [];

    // 1. Guardar todos los Grupos Dinámicamente
    weekData.groups = getChampionshipGroupsFromUI();


    // 2. Guardar los 8 Desafíos
    for (let idx = 0; idx < 8; idx++) {
        if (!weekData.challenges[idx]) weekData.challenges[idx] = { id: `w${currentChampAdminWeek}-ch${idx+1}` };
        const ch = weekData.challenges[idx];

        const routeEl = document.getElementById(`ch-route-${idx}`);
        const typeEl = document.getElementById(`ch-type-${idx}`);
        const carEl = document.getElementById(`ch-car-${idx}`);

        if (routeEl) ch.route = routeEl.value.trim();
        if (typeEl) ch.type = typeEl.value;
        if (carEl) ch.carRestriction = carEl.value.trim();

        if (!ch.top3 || !Array.isArray(ch.top3)) {
            ch.top3 = [{}, {}, {}];
        }

        // Ganador Oro
        const p1Pilot = document.getElementById(`ch-p1-pilot-${idx}`)?.value.trim() || 'Por disputar';
        const p1Car = document.getElementById(`ch-p1-car-${idx}`)?.value.trim() || '';
        const p1Time = document.getElementById(`ch-p1-time-${idx}`)?.value.trim() || '--:--.---';
        const p1Bonus = parseInt(document.getElementById(`ch-p1-bonus-${idx}`)?.value || '100', 10);
        const p1Rep = parseInt(document.getElementById(`ch-p1-rep-${idx}`)?.value || '400000', 10);
        ch.top3[0] = {
            pilot: p1Pilot,
            car: p1Car,
            time: p1Time,
            bonus: p1Bonus,
            badge: `🥇 +${p1Bonus} PTS`,
            repMoney: p1Rep,
            repBadge: `💰 $${p1Rep.toLocaleString('de-DE')} REP`
        };

        // Ganador Silver
        const p2Pilot = document.getElementById(`ch-p2-pilot-${idx}`)?.value.trim() || 'Por disputar';
        const p2Car = document.getElementById(`ch-p2-car-${idx}`)?.value.trim() || '';
        const p2Time = document.getElementById(`ch-p2-time-${idx}`)?.value.trim() || '--:--.---';
        const p2Bonus = parseInt(document.getElementById(`ch-p2-bonus-${idx}`)?.value || '50', 10);
        const p2Rep = parseInt(document.getElementById(`ch-p2-rep-${idx}`)?.value || '250000', 10);
        ch.top3[1] = {
            pilot: p2Pilot,
            car: p2Car,
            time: p2Time,
            bonus: p2Bonus,
            badge: `🥈 +${p2Bonus} PTS`,
            repMoney: p2Rep,
            repBadge: `💰 $${p2Rep.toLocaleString('de-DE')} REP`
        };

        // Ganador Bronce
        const p3Pilot = document.getElementById(`ch-p3-pilot-${idx}`)?.value.trim() || 'Por disputar';
        const p3Car = document.getElementById(`ch-p3-car-${idx}`)?.value.trim() || '';
        const p3Time = document.getElementById(`ch-p3-time-${idx}`)?.value.trim() || '--:--.---';
        const p3Bonus = parseInt(document.getElementById(`ch-p3-bonus-${idx}`)?.value || '20', 10);
        const p3Rep = parseInt(document.getElementById(`ch-p3-rep-${idx}`)?.value || '120000', 10);
        ch.top3[2] = {
            pilot: p3Pilot,
            car: p3Car,
            time: p3Time,
            bonus: p3Bonus,
            badge: `🥉 +${p3Bonus} PTS`,
            repMoney: p3Rep,
            repBadge: `💰 $${p3Rep.toLocaleString('de-DE')} REP`
        };
    }

    // 3. Persistir en Firebase RTDB y localStorage
    showToast(`Guardando Semana ${currentChampAdminWeek} en Firebase RTDB...`, "info");
    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";

    try {
        localStorage.setItem('nfs_championship_weeks_data_v1', JSON.stringify(cachedChampWeeksData));
        if (typeof window !== 'undefined' && window.CHAMPIONSHIP_WEEKS_DATA) {
            Object.assign(window.CHAMPIONSHIP_WEEKS_DATA, cachedChampWeeksData);
        }

        const res = await fetch(`${baseUrl}/championship/weeks_data.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cachedChampWeeksData)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showToast(`✓ ¡Semana ${currentChampAdminWeek} guardada con éxito en Firebase RTDB!`, "success");
    } catch (err) {
        console.error("Error guardando campeonato en RTDB:", err);
        showToast(`⚠️ Guardado en caché local (Error nube: ${err.message})`, "warning");
    }
}

async function syncChampionshipWinnersWithStandings() {
    await saveChampionshipAdmin();

    if (!confirm("¿Deseas sincronizar los ganadores de los desafíos configurados con la Clasificación General del Campeonato?")) {
        return;
    }

    showToast("Sincronizando puntos y victorias de pilotos...", "info");
    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";

    try {
        // Cargar pilotos base de la Blacklist
        let drivers = getChampionshipDefaultDrivers();
        if (drivers && drivers.length > 0) {
            drivers = JSON.parse(JSON.stringify(drivers));
        } else {
            drivers = [];
        }

        // Leer si hay pilotos guardados previamente
        try {
            const drRes = await fetch(`${baseUrl}/championship/blacklist_drivers.json`);
            if (drRes.ok) {
                const data = await drRes.json();
                if (Array.isArray(data) && data.length > 0) drivers = data;
            }
        } catch (err) {}

        // Reinicializar contadores de victorias de campeonato
        drivers.forEach(d => {
            d.victories = { p1: 0, p2: 0, p3: 0, p4: 0 };
            d.bestTimes = { first: 0, second: 0, third: 0 };
        });

        // Iterar todas las semanas del campeonato para computar ganadores
        const weeksSource = cachedChampWeeksData || getChampionshipDefaultWeeksData() || {};
        Object.keys(weeksSource).forEach(wKey => {
            const wData = weeksSource[wKey];
            if (!wData || !Array.isArray(wData.challenges)) return;

            wData.challenges.forEach(ch => {
                if (!ch.top3 || !Array.isArray(ch.top3)) return;

                // 1° Oro
                if (ch.top3[0] && ch.top3[0].pilot && ch.top3[0].pilot !== 'Por disputar') {
                    const pName = ch.top3[0].pilot.trim().toLowerCase();
                    const d = drivers.find(x => (x.alias && x.alias.toLowerCase() === pName) || (x.name && x.name.toLowerCase() === pName) || String(x.rank) === pName);
                    if (d) {
                        d.victories.p1++;
                        d.bestTimes.first++;
                        d.rep = (d.rep || 0) + (ch.top3[0].repMoney || 400000);
                    }
                }
                // 2° Silver
                if (ch.top3[1] && ch.top3[1].pilot && ch.top3[1].pilot !== 'Por disputar') {
                    const pName = ch.top3[1].pilot.trim().toLowerCase();
                    const d = drivers.find(x => (x.alias && x.alias.toLowerCase() === pName) || (x.name && x.name.toLowerCase() === pName) || String(x.rank) === pName);
                    if (d) {
                        d.victories.p2++;
                        d.bestTimes.second++;
                        d.rep = (d.rep || 0) + (ch.top3[1].repMoney || 250000);
                    }
                }
                // 3° Bronce
                if (ch.top3[2] && ch.top3[2].pilot && ch.top3[2].pilot !== 'Por disputar') {
                    const pName = ch.top3[2].pilot.trim().toLowerCase();
                    const d = drivers.find(x => (x.alias && x.alias.toLowerCase() === pName) || (x.name && x.name.toLowerCase() === pName) || String(x.rank) === pName);
                    if (d) {
                        d.victories.p3++;
                        d.bestTimes.third++;
                        d.rep = (d.rep || 0) + (ch.top3[2].repMoney || 120000);
                    }
                }
            });
        });

        // Guardar pilotos actualizados
        localStorage.setItem('nfs_blacklist_championship_2026_v4', JSON.stringify(drivers));
        try {
            await fetch(`${baseUrl}/championship/blacklist_drivers.json`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(drivers)
            });
            showToast("⚡ ¡Clasificación General sincronizada con éxito en Firebase RTDB!", "success");
        } catch (eCloud) {
            showToast("⚡ Sincronizado en caché local (sin conexión a Firebase RTDB)", "warning");
        }
    } catch (e) {
        console.error("Error sincronizando clasificación general:", e);
        showToast(`❌ Error al sincronizar: ${e.message}`, "error");
    }
}

// =======================================================
// 9. EDITOR DE FICHAS DE DESAFÍOS SEMANALES (TEMPORADA 1 & 2)
//    (TIEMPOS DIAMANTE, ORO, PLATA, BRONCE Y RECOMPENSAS)
// =======================================================

let currentChallengesEditorSeason = 'season_1';
let currentChallengesEditorWeek = 1;
let customSeasonsChallengesData = {};

function handleChallengesEditorSeasonChange() {
    const sel = document.getElementById('challenges-editor-season-select');
    if (sel) currentChallengesEditorSeason = sel.value;
    loadSeasonChallengesEditor();
}

function handleChallengesEditorWeekChange() {
    const sel = document.getElementById('challenges-editor-week-select');
    if (sel) currentChallengesEditorWeek = parseInt(sel.value, 10) || 1;
    loadSeasonChallengesEditor();
}

async function loadSeasonChallengesEditor() {
    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    const statusBadge = document.getElementById('challenges-editor-sync-badge');
    if (statusBadge) statusBadge.textContent = "⏳ Cargando Fichas...";

    try {
        const res = await fetch(`${baseUrl}/seasons_custom_challenges.json`);
        if (res.ok) {
            const data = await res.json();
            if (data && typeof data === 'object') {
                customSeasonsChallengesData = data;
                localStorage.setItem('nfs_seasons_custom_challenges_v1', JSON.stringify(data));
            }
        }
    } catch (e) {}

    if (!customSeasonsChallengesData || Object.keys(customSeasonsChallengesData).length === 0) {
        try {
            const local = localStorage.getItem('nfs_seasons_custom_challenges_v1');
            if (local) customSeasonsChallengesData = JSON.parse(local);
        } catch (e) {}
    }

    if (statusBadge) statusBadge.textContent = "🟢 Fichas Sincronizadas";
    renderSeasonChallengesEditor();
}

function renderSeasonChallengesEditor() {
    const container = document.getElementById('challenges-editor-cards-container');
    if (!container) return;

    if (typeof SEASONS_DATA === 'undefined' || !SEASONS_DATA[currentChallengesEditorSeason]) {
        container.innerHTML = '<p style="color:var(--text-muted); padding:20px;">Temporada no encontrada en el sistema.</p>';
        return;
    }

    const season = SEASONS_DATA[currentChallengesEditorSeason];
    const weekData = season.weeks.find(w => w.weekNum === currentChallengesEditorWeek) || season.weeks[0];
    const defaultChallenges = weekData ? weekData.challenges : [];

    // Comprobar si hay sobrescritura personalizada
    const customList = (customSeasonsChallengesData[currentChallengesEditorSeason] && customSeasonsChallengesData[currentChallengesEditorSeason][`week_${currentChallengesEditorWeek}`]) || null;
    const challengesToRender = defaultChallenges.map((defCh, idx) => {
        const custCh = customList ? customList.find(c => c.id === defCh.id) : null;
        return custCh ? { ...defCh, ...custCh } : defCh;
    });

    container.innerHTML = challengesToRender.map((ch, idx) => {
        const tiers = (typeof SEASONS_DATA.getChallengeTiers === 'function') 
            ? SEASONS_DATA.getChallengeTiers(ch) 
            : {
                diamond: { time: ch.targetTime, pts: 500, bounty: "$1.000.000" },
                gold: { time: ch.targetTime, pts: 300, bounty: "$500.000" },
                silver: { time: ch.targetTime, pts: 180, bounty: "$250.000" },
                bronze: { time: ch.targetTime, pts: 100, bounty: "$100.000" }
            };

        const isCircuit = ch.type === 'Circuito';
        const isBMW = (ch.category || '').includes('BMW');

        return `
            <div class="admin-fichas-card" id="fichas-card-${idx}">
                <div class="admin-fichas-header">
                    <span style="font-family:var(--font-heading); font-size:16px; font-weight:800; color:${isBMW ? '#60a5fa' : '#4ade80'};">
                        FICHA #${idx + 1} // ${ch.type.toUpperCase()} • ${ch.category}
                    </span>
                    <input type="hidden" id="fe-id-${idx}" value="${ch.id}">
                    <span style="font-size:11px; color:var(--text-muted); font-family:var(--font-mono);">${ch.id}</span>
                </div>

                <div style="display:grid; grid-template-columns:1.5fr 1fr; gap:10px;">
                    <div>
                        <label class="admin-field-label">Circuito / Pista *</label>
                        <input type="text" id="fe-track-${idx}" class="admin-form-input" style="font-weight:700; font-family:var(--font-heading);" value="${escapeHtml(ch.track || '')}">
                    </div>
                    <div>
                        <label class="admin-field-label">Tipo de Trazado</label>
                        <select id="fe-type-${idx}" class="admin-form-input">
                            <option value="Circuito" ${ch.type === 'Circuito' ? 'selected' : ''}>Circuito</option>
                            <option value="Sprint" ${ch.type === 'Sprint' ? 'selected' : ''}>Sprint</option>
                        </select>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <div>
                        <label class="admin-field-label">Categoría Oficial</label>
                        <select id="fe-cat-${idx}" class="admin-form-input">
                            <option value="Junkman" ${!isBMW ? 'selected' : ''}>Junkman (Cualquier Auto)</option>
                            <option value="BMW M3 GTR" ${isBMW ? 'selected' : ''}>BMW M3 GTR</option>
                        </select>
                    </div>
                    <div>
                        <label class="admin-field-label">Vehículo Reglamentario</label>
                        <input type="text" id="fe-car-${idx}" class="admin-form-input" value="${escapeHtml(ch.car || '')}">
                    </div>
                </div>

                <!-- SECCIÓN DE LOS 4 RANGOS: DIAMANTE, ORO, PLATA, BRONCE -->
                <div style="margin-top:6px;">
                    <div style="font-size:11px; font-weight:800; color:#cbd5e1; margin-bottom:8px; display:flex; justify-content:space-between;">
                        <span>⏱️ REGISTRO DE TIEMPOS Y RECOMPENSAS POR RANGO</span>
                        <span style="color:var(--nfs-orange);">Logros Semanales</span>
                    </div>

                    <div class="admin-tiers-editor-table">
                        <!-- Diamante -->
                        <div class="admin-tier-editor-row" style="background:rgba(56, 189, 248, 0.05); border-color:rgba(56,189,248,0.25);">
                            <span style="font-size:11px; font-weight:800; color:#38bdf8;">💎 DIAMANTE</span>
                            <div>
                                <label style="font-size:8.5px; color:var(--text-muted);">Tiempo Meta</label>
                                <input type="text" id="fe-dia-time-${idx}" class="admin-form-input" style="padding:4px 8px; font-family:var(--font-mono); font-weight:700; color:#38bdf8;" maxlength="9" oninput="applyRaceTimeMask(this)" value="${escapeHtml(tiers.diamond.time || '')}" placeholder="01:16.800">
                            </div>
                            <div>
                                <label style="font-size:8.5px; color:var(--text-muted);">Puntos (PTS)</label>
                                <input type="number" id="fe-dia-pts-${idx}" class="admin-form-input" style="padding:4px 8px;" value="${tiers.diamond.pts || 500}">
                            </div>
                            <div>
                                <label style="font-size:8.5px; color:var(--text-muted);">Bounty Dinero ($)</label>
                                <input type="text" id="fe-dia-bounty-${idx}" class="admin-form-input" style="padding:4px 8px;" value="${escapeHtml(tiers.diamond.bounty || '$1.000.000')}">
                            </div>
                        </div>

                        <!-- Oro / Gold -->
                        <div class="admin-tier-editor-row" style="background:rgba(251, 191, 36, 0.05); border-color:rgba(251,191,36,0.25);">
                            <span style="font-size:11px; font-weight:800; color:#fbbf24;">🥇 ORO / GOLD</span>
                            <div>
                                <label style="font-size:8.5px; color:var(--text-muted);">Tiempo Meta</label>
                                <input type="text" id="fe-gold-time-${idx}" class="admin-form-input" style="padding:4px 8px; font-family:var(--font-mono); font-weight:700; color:#fbbf24;" maxlength="9" oninput="applyRaceTimeMask(this)" value="${escapeHtml(tiers.gold.time || '')}" placeholder="01:18.500">
                            </div>
                            <div>
                                <label style="font-size:8.5px; color:var(--text-muted);">Puntos (PTS)</label>
                                <input type="number" id="fe-gold-pts-${idx}" class="admin-form-input" style="padding:4px 8px;" value="${tiers.gold.pts || 300}">
                            </div>
                            <div>
                                <label style="font-size:8.5px; color:var(--text-muted);">Bounty Dinero ($)</label>
                                <input type="text" id="fe-gold-bounty-${idx}" class="admin-form-input" style="padding:4px 8px;" value="${escapeHtml(tiers.gold.bounty || '$500.000')}">
                            </div>
                        </div>

                        <!-- Plata / Silver -->
                        <div class="admin-tier-editor-row" style="background:rgba(226, 232, 240, 0.03); border-color:rgba(226,232,240,0.18);">
                            <span style="font-size:11px; font-weight:800; color:#e2e8f0;">🥈 PLATA</span>
                            <div>
                                <label style="font-size:8.5px; color:var(--text-muted);">Tiempo Meta</label>
                                <input type="text" id="fe-sil-time-${idx}" class="admin-form-input" style="padding:4px 8px; font-family:var(--font-mono); font-weight:700; color:#e2e8f0;" maxlength="9" oninput="applyRaceTimeMask(this)" value="${escapeHtml(tiers.silver.time || '')}" placeholder="01:21.000">
                            </div>
                            <div>
                                <label style="font-size:8.5px; color:var(--text-muted);">Puntos (PTS)</label>
                                <input type="number" id="fe-sil-pts-${idx}" class="admin-form-input" style="padding:4px 8px;" value="${tiers.silver.pts || 180}">
                            </div>
                            <div>
                                <label style="font-size:8.5px; color:var(--text-muted);">Bounty Dinero ($)</label>
                                <input type="text" id="fe-sil-bounty-${idx}" class="admin-form-input" style="padding:4px 8px;" value="${escapeHtml(tiers.silver.bounty || '$250.000')}">
                            </div>
                        </div>

                        <!-- Bronce / Bronze -->
                        <div class="admin-tier-editor-row" style="background:rgba(249, 115, 22, 0.03); border-color:rgba(249,115,22,0.18);">
                            <span style="font-size:11px; font-weight:800; color:#fdba74;">🥉 BRONCE</span>
                            <div>
                                <label style="font-size:8.5px; color:var(--text-muted);">Tiempo Meta</label>
                                <input type="text" id="fe-bro-time-${idx}" class="admin-form-input" style="padding:4px 8px; font-family:var(--font-mono); font-weight:700; color:#fdba74;" maxlength="9" oninput="applyRaceTimeMask(this)" value="${escapeHtml(tiers.bronze.time || '')}" placeholder="01:25.000">
                            </div>
                            <div>
                                <label style="font-size:8.5px; color:var(--text-muted);">Puntos (PTS)</label>
                                <input type="number" id="fe-bro-pts-${idx}" class="admin-form-input" style="padding:4px 8px;" value="${tiers.bronze.pts || 100}">
                            </div>
                            <div>
                                <label style="font-size:8.5px; color:var(--text-muted);">Bounty Dinero ($)</label>
                                <input type="text" id="fe-bro-bounty-${idx}" class="admin-form-input" style="padding:4px 8px;" value="${escapeHtml(tiers.bronze.bounty || '$100.000')}">
                            </div>
                        </div>
                    </div>
                </div>

                <div style="margin-top:4px;">
                    <label class="admin-field-label">🎖️ Trofeo / Medalla Descriptiva</label>
                    <input type="text" id="fe-badge-${idx}" class="admin-form-input" value="${escapeHtml((ch.reward && ch.reward.badge) || 'Medalla Oficial')}">
                </div>
            </div>
        `;
    }).join('');
}

async function saveSeasonChallengesEditor() {
    showToast(`Guardando fichas de la Semana ${currentChallengesEditorWeek} en Firebase RTDB...`, "info");
    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";

    const updatedChallenges = [];
    for (let idx = 0; idx < 4; idx++) {
        const id = document.getElementById(`fe-id-${idx}`)?.value || `s-w-c${idx+1}`;
        const track = document.getElementById(`fe-track-${idx}`)?.value.trim() || '';
        const type = document.getElementById(`fe-type-${idx}`)?.value || 'Circuito';
        const category = document.getElementById(`fe-cat-${idx}`)?.value || 'Junkman';
        const car = document.getElementById(`fe-car-${idx}`)?.value.trim() || '';
        const badge = document.getElementById(`fe-badge-${idx}`)?.value.trim() || 'Medalla Oficial';

        const diaTime = document.getElementById(`fe-dia-time-${idx}`)?.value.trim() || '01:16.800';
        const diaPts = parseInt(document.getElementById(`fe-dia-pts-${idx}`)?.value || '500', 10);
        const diaBounty = document.getElementById(`fe-dia-bounty-${idx}`)?.value.trim() || '$1.000.000';

        const goldTime = document.getElementById(`fe-gold-time-${idx}`)?.value.trim() || '01:18.500';
        const goldPts = parseInt(document.getElementById(`fe-gold-pts-${idx}`)?.value || '300', 10);
        const goldBounty = document.getElementById(`fe-gold-bounty-${idx}`)?.value.trim() || '$500.000';

        const silTime = document.getElementById(`fe-sil-time-${idx}`)?.value.trim() || '01:21.000';
        const silPts = parseInt(document.getElementById(`fe-sil-pts-${idx}`)?.value || '180', 10);
        const silBounty = document.getElementById(`fe-sil-bounty-${idx}`)?.value.trim() || '$250.000';

        const broTime = document.getElementById(`fe-bro-time-${idx}`)?.value.trim() || '01:25.000';
        const broPts = parseInt(document.getElementById(`fe-bro-pts-${idx}`)?.value || '100', 10);
        const broBounty = document.getElementById(`fe-bro-bounty-${idx}`)?.value.trim() || '$100.000';

        const chObj = {
            id: id,
            track: track,
            type: type,
            category: category,
            car: car,
            targetTime: goldTime,
            reward: {
                pts: goldPts,
                bounty: goldBounty,
                badge: badge,
                desc: `${goldPts} PTS Blacklist • ${goldBounty} Bounty • ${badge}`
            },
            tiers: {
                diamond: { name: "Diamante", time: diaTime, pts: diaPts, bounty: diaBounty, badge: "💎 Logro Diamante" },
                gold: { name: "Oro / Gold", time: goldTime, pts: goldPts, bounty: goldBounty, badge: "🥇 Logro Oro" },
                silver: { name: "Plata / Silver", time: silTime, pts: silPts, bounty: silBounty, badge: "🥈 Logro Plata" },
                bronze: { name: "Bronce / Bronze", time: broTime, pts: broPts, bounty: broBounty, badge: "🥉 Logro Bronce" }
            }
        };

        updatedChallenges.push(chObj);
    }

    if (!customSeasonsChallengesData[currentChallengesEditorSeason]) {
        customSeasonsChallengesData[currentChallengesEditorSeason] = {};
    }
    customSeasonsChallengesData[currentChallengesEditorSeason][`week_${currentChallengesEditorWeek}`] = updatedChallenges;

    // Actualizar SEASONS_DATA en memoria
    if (typeof SEASONS_DATA !== 'undefined' && SEASONS_DATA[currentChallengesEditorSeason]) {
        const wObj = SEASONS_DATA[currentChallengesEditorSeason].weeks.find(w => w.weekNum === currentChallengesEditorWeek);
        if (wObj) {
            updatedChallenges.forEach(u => {
                const ex = wObj.challenges.find(c => c.id === u.id);
                if (ex) Object.assign(ex, u);
            });
        }
    }

    try {
        localStorage.setItem('nfs_seasons_custom_challenges_v1', JSON.stringify(customSeasonsChallengesData));

        const res = await fetch(`${baseUrl}/seasons_custom_challenges.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customSeasonsChallengesData)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showToast("✓ ¡Fichas de desafíos y tiempos actualizados exitosamente en Firebase RTDB!", "success");
    } catch (e) {
        console.warn("Error guardando en RTDB:", e);
        showToast(`⚠️ Guardado en caché local (Error nube: ${e.message})`, "warning");
    }
}

function restoreDefaultSeasonChallenges() {
    if (!confirm("¿Restaurar las 4 fichas de esta semana a los valores y tiempos oficiales de fábrica?")) return;
    if (customSeasonsChallengesData[currentChallengesEditorSeason]) {
        delete customSeasonsChallengesData[currentChallengesEditorSeason][`week_${currentChallengesEditorWeek}`];
    }
    localStorage.setItem('nfs_seasons_custom_challenges_v1', JSON.stringify(customSeasonsChallengesData));
    renderSeasonChallengesEditor();
    showToast("Fichas restauradas a valores oficiales. Pulsa 'Guardar Fichas y Tiempos' para sincronizar con Firebase.", "info");
}

// Exposición global de funciones para llamadas desde atributos HTML
window.applyRaceTimeMask = applyRaceTimeMask;
window.getRouteSelectOptionsHTML = getRouteSelectOptionsHTML;
window.handleSubCardRouteChange = handleSubCardRouteChange;
window.saveSubmissionDraft = saveSubmissionDraft;
window.approveSubmission = approveSubmission;
window.rejectSubmission = rejectSubmission;
window.deleteSubmission = deleteSubmission;
window.initRouteSelectors = initRouteSelectors;
window.handleLbRouteChange = handleLbRouteChange;
window.handleLbCategoryChange = handleLbCategoryChange;
window.loadLeaderboardTab = loadLeaderboardTab;
window.deleteLeaderboardRow = deleteLeaderboardRow;
window.openAddLeaderboardModal = openAddLeaderboardModal;
window.openEditLeaderboardModal = openEditLeaderboardModal;
window.closeLeaderboardEntryModal = closeLeaderboardEntryModal;
window.handleModalLbRouteChange = handleModalLbRouteChange;
window.saveLeaderboardEntry = saveLeaderboardEntry;
window.openVideoPreview = openVideoPreview;
window.closeVideoPreview = closeVideoPreview;
window.switchAdminTab = switchAdminTab;
window.filterSubmissions = filterSubmissions;
window.loadSubmissions = loadSubmissions;
window.loadSeasonStandingsAdmin = loadSeasonStandingsAdmin;
window.handleSeasonAdminChange = handleSeasonAdminChange;
window.handleSeasonAdminWeekChange = handleSeasonAdminWeekChange;
window.recalcAndPublishSeasonStandings = recalcAndPublishSeasonStandings;
window.openAddSeasonPilotModal = openAddSeasonPilotModal;
window.editSeasonPilot = editSeasonPilot;
window.deleteSeasonPilot = deleteSeasonPilot;
window.loadChampionshipAdmin = loadChampionshipAdmin;
window.selectChampionshipAdminWeek = selectChampionshipAdminWeek;
window.renderChampionshipAdminGroups = renderChampionshipAdminGroups;
window.renderChampionshipAdminChallenges = renderChampionshipAdminChallenges;
window.saveChampionshipAdmin = saveChampionshipAdmin;
window.syncChampionshipWinnersWithStandings = syncChampionshipWinnersWithStandings;
window.handleChallengesEditorSeasonChange = handleChallengesEditorSeasonChange;
window.handleChallengesEditorWeekChange = handleChallengesEditorWeekChange;
window.loadSeasonChallengesEditor = loadSeasonChallengesEditor;
window.renderSeasonChallengesEditor = renderSeasonChallengesEditor;
window.saveSeasonChallengesEditor = saveSeasonChallengesEditor;
window.restoreDefaultSeasonChallenges = restoreDefaultSeasonChallenges;
window.addChampionshipAdminGroup = addChampionshipAdminGroup;
window.deleteChampionshipAdminGroup = deleteChampionshipAdminGroup;
window.loadChampionshipRegisteredParticipants = loadChampionshipRegisteredParticipants;
window.getChampionshipGroupsFromUI = getChampionshipGroupsFromUI;
window.saveChampionshipSingleGroup = saveChampionshipSingleGroup;
window.saveChampionshipAdminGroupsOnly = saveChampionshipAdminGroupsOnly;
window.saveChampionshipGroupsToAllWeeks = saveChampionshipGroupsToAllWeeks;


