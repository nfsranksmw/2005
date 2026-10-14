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
                } else if (localStorage.getItem('nfs_admin_session')) {
                    checkEmergencyAccess();
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

    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab') || (window.location.hash ? window.location.hash.replace('#', '') : null);
    if (initialTab && typeof switchAdminTab === 'function') {
        setTimeout(() => switchAdminTab(initialTab), 50);
    }
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

    const tableContainer = document.querySelector('.admin-table-container');
    if (tableContainer) {
        tableContainer.classList.remove('admin-table-bmw', 'admin-table-junkman');
        if (currentLbCategory && currentLbCategory.startsWith('bmw')) {
            tableContainer.classList.add('admin-table-bmw');
        } else {
            tableContainer.classList.add('admin-table-junkman');
        }
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
                    <td><strong class="notranslate" translate="no" style="color: #fff;">${escapeHtml(row.driver || '--')}</strong></td>
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
                        <span class="notranslate" translate="no" style="font-family: var(--font-heading); font-size: 13.5px; font-weight: 700; color: #fff;">${escapeHtml(p.driver)}</span>
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
let currentChampAdminGroup = 0;
let cachedChampWeeksData = null;
let registeredChampionshipParticipants = [];
let championshipOfficialDrivers = [];

const FALLBACK_TOURNAMENT_PARTICIPANTS = [
    { rank: 1, alias: "ZimanX", name: "ZimanX", ride: "Porsche Carrera GT" },
    { rank: 2, alias: "MysticX", name: "Mystic", ride: "BMW M3 GTR" },
    { rank: 3, alias: "Nebula", name: "Nebula", ride: "Carrera GT y Lotus Elise" },
    { rank: 4, alias: "xLeMondx", name: "xLeMondx", ride: "Porsche Carrera GT" },
    { rank: 5, alias: "SRTxAvenger™", name: "Avenger", ride: "Porsche Carrera GT Y LOTUS ELISE" },
    { rank: 6, alias: "Shido", name: "DarkShido", ride: "BMW M3 GTR" },
    { rank: 7, alias: "DannyLove", name: "DannyLove", ride: "BMW M3 GTR" },
    { rank: 8, alias: "Lea", name: "Lea4Speed0", ride: "Carrera GT & M3 GTR" },
    { rank: 9, alias: "NFSMW", name: "ellafreyafan", ride: "BMW M3 GTR" },
    { rank: 10, alias: "N6 xBourne", name: "N6 xBourne", ride: "Porsche Carrera GT y Lotus Elise" },
    { rank: 11, alias: "RazorV8", name: "RazorV8", ride: "Ford GT" },
    { rank: 12, alias: "TurboFox", name: "TurboFox", ride: "Porsche 911 Turbo S" },
    { rank: 13, alias: "SRTxSigy", name: "Sigy", ride: "Porsche Carrera GT" },
    { rank: 14, alias: "Flow.", name: "Flow.", ride: "Porsche Carrera GT" },
    { rank: 15, alias: "SRTxAvengerT", name: "SRTxAvengerT", ride: "Porsche Carrera GT" }
];

const NFS_MW_2005_STORY_RIVALS = [
    { rank: 1, alias: "Razor", name: "Clarence Callahan", ride: "BMW M3 GTR / Mustang GT" },
    { rank: 2, alias: "Bull", name: "Toru Sato", ride: "Mercedes-Benz SLR McLaren" },
    { rank: 3, alias: "Ronnie", name: "Ronald McCrea", ride: "Aston Martin DB9" },
    { rank: 4, alias: "JV", name: "Joe Vega", ride: "Dodge Viper SRT-10" },
    { rank: 5, alias: "Webster", name: "Wes Allen", ride: "Chevrolet Corvette C6" },
    { rank: 6, alias: "Ming", name: "Hector Sanchez", ride: "Lamborghini Gallardo" },
    { rank: 7, alias: "Kaze", name: "Kira Nakazato", ride: "Mercedes-Benz CLK 500" },
    { rank: 8, alias: "Jewels", name: "Jade Barrett", ride: "Ford Mustang GT" },
    { rank: 9, alias: "Earl", name: "Eugene James", ride: "Mitsubishi Lancer Evolution VIII" },
    { rank: 10, alias: "Baron", name: "Karl Smit", ride: "Porsche Cayman S" },
    { rank: 11, alias: "Big Lou", name: "Lou Park", ride: "Mitsubishi Eclipse GT" },
    { rank: 12, alias: "Izzy", name: "Isabel Diaz", ride: "Mazda RX-8" },
    { rank: 13, alias: "Vic", name: "Victor Vasquez", ride: "Toyota Supra" },
    { rank: 14, alias: "Taz", name: "Vince Kilic", ride: "Lexus IS 300" },
    { rank: 15, alias: "Sonny", name: "Ho Seun", ride: "Volkswagen Golf GTI" }
];

const GREEK_GROUP_NAMES = ["Alfa", "Beta", "Gama", "Delta", "Épsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Ómicron", "Pi", "Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi", "Psi", "Omega"];

function getDefaultChampionshipGroups(weekNum = 1) {
    const w = parseInt(weekNum, 10) || 1;
    if (typeof CHAMPIONSHIP_WEEKS_DATA !== 'undefined' && CHAMPIONSHIP_WEEKS_DATA[w] && Array.isArray(CHAMPIONSHIP_WEEKS_DATA[w].groups) && CHAMPIONSHIP_WEEKS_DATA[w].groups.length > 0) {
        return JSON.parse(JSON.stringify(CHAMPIONSHIP_WEEKS_DATA[w].groups));
    }
    const defaultRotations = {
        1: [
            { name: "Grupo Alpha (Líderes)", pilots: [1, 10, 3], tag: "🔥 TIER SUPREME" },
            { name: "Grupo Beta (Aspirantes)", pilots: [4, 5, 6], tag: "⚡ TIER HIGH" },
            { name: "Grupo Gamma (Fuerza & Potencia)", pilots: [7, 8, "open_11"], tag: "⚔️ TIER MID-HIGH" },
            { name: "Grupo Delta (Competición)", pilots: [9, 2, "open_12"], tag: "🏁 TIER COMPETICIÓN" }
        ],
        2: [
            { name: "Grupo Alfa (Velocidad Pura)", pilots: [1, 5, 8], tag: "🔥 TIER SUPREME" },
            { name: "Grupo Beta (Duelo Callejero)", pilots: [10, 6, 9], tag: "⚡ TIER HIGH" },
            { name: "Grupo Gama (Fuerza & Asfalto)", pilots: [3, 4, 7], tag: "⚔️ TIER MID-HIGH" },
            { name: "Grupo Delta (Competición & Desafío)", pilots: [2, "open_11", "open_12"], tag: "🏁 TIER COMPETICIÓN" }
        ],
        3: [
            { name: "Grupo Alfa (Cruce de Titanes)", pilots: [1, 6, 11, "open_16"], tag: "🔥 TIER SUPREME" },
            { name: "Grupo Beta (Duelo de Élite)", pilots: [10, 4, 12, "open_17"], tag: "⚡ TIER HIGH" },
            { name: "Grupo Gama (Guerra de Caballos)", pilots: [3, 5, 13, "open_18"], tag: "⚔️ TIER MID-HIGH" }
        ],
        4: [
            { name: "Grupo Alfa (Gran Final • Corona)", pilots: [1, 4, 9, 14], tag: "👑 CHAMPIONSHIP" },
            { name: "Grupo Beta (Duelo por el Podio)", pilots: [10, 5, 7, 12], tag: "🥈 PODIUM RACE" },
            { name: "Grupo Gama (Batalla de Honor)", pilots: [3, 6, 8, 13], tag: "⚔️ TOP HONORS" },
            { name: "Grupo Delta (Copa de Honor / Repechaje)", pilots: [2, 11, 15, "open_16"], tag: "🏁 TIER COMPETICIÓN" },
            { name: "Grupo Épsilon (Supervivencia & Gloria)", pilots: ["open_17", "open_18", "open_19", "open_20"], tag: "🚀 TIER GLORIA" }
        ]
    };
    return defaultRotations[w] ? JSON.parse(JSON.stringify(defaultRotations[w])) : JSON.parse(JSON.stringify(defaultRotations[1]));
}

async function loadChampionshipRegisteredParticipants() {
    try {
        localStorage.removeItem('nfs_championship_participants_v1');
        const local = localStorage.getItem('nfs_championship_participants_v2');
        if (local) {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) {
                registeredChampionshipParticipants = parsed.filter(p => p && typeof p === 'object' && (p.name || p.alias));
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
                    list.push(...data.filter(p => p && typeof p === 'object' && (p.name || p.alias)));
                } else if (typeof data === 'object') {
                    Object.keys(data).forEach(key => {
                        if (key === 'weeks_data') return;
                        const p = data[key];
                        if (p && typeof p === 'object' && (p.name || p.alias)) {
                            list.push({ ...p, _firebaseKey: key });
                        }
                    });
                }
                list.sort((a, b) => new Date(a.registeredAt || 0) - new Date(b.registeredAt || 0));
                list.forEach((p, idx) => {
                    if (!p.rank || typeof p.rank !== 'number') {
                        p.rank = idx + 1;
                    }
                });
                if (list.length > 0) {
                    registeredChampionshipParticipants = list;
                    try {
                        localStorage.setItem('nfs_championship_participants_v2', JSON.stringify(list));
                    } catch (e) {}
                }
            }
        }
    } catch (e) {
        console.warn("Aviso al consultar participantes del campeonato:", e);
    }
}

async function loadChampionshipOfficialDrivers() {
    try {
        const local = localStorage.getItem('nfs_blacklist_championship_2026_v5') || 
                      localStorage.getItem('nfs_blacklist_championship_2026_v4');
        if (local) {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) {
                championshipOfficialDrivers = parsed;
            }
        }
    } catch (e) {}

    try {
        const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) 
            ? window.NFS_FIREBASE.RTDB_URL 
            : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
        const res = await fetch(`${baseUrl}/records/blacklist_championship_2026.json?_t=${Date.now()}`);
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                championshipOfficialDrivers = data;
                try {
                    localStorage.setItem('nfs_blacklist_championship_2026_v5', JSON.stringify(data));
                } catch (e) {}
            }
        }
    } catch (e) {
        console.warn("Aviso al consultar blacklist_championship_2026:", e);
    }

    // Unificar participantes registrados en la lista oficial
    const participants = getChampionshipParticipantsList();
    if (!championshipOfficialDrivers || championshipOfficialDrivers.length === 0) {
        championshipOfficialDrivers = participants.map((p, idx) => ({
            rank: p.rank || (idx + 1),
            alias: p.alias || p.name || `Piloto ${idx + 1}`,
            name: p.name || p.alias || `Piloto ${idx + 1}`,
            ride: p.ride || 'Vehículo Oficial',
            strength: `${p.ride || 'Vehículo Oficial'} • Piloto Oficial`,
            rep: p.rep || 1000000,
            points: p.points || 0,
            victories: p.victories || { p1: 0, p2: 0, p3: 0, p4: 0 },
            bestTimes: p.bestTimes || { first: 0, second: 0, third: 0 },
            bio: p.bio || `Piloto Oficial Inscrito en el Campeonato Blacklist 2026.`,
            status: `PILOTO OFICIAL #${p.rank || (idx + 1)}`,
            avatar: p.avatar || "assets/img/nfsranksmwlogo.png",
            color: "#ff7700",
            badge: `👑 #${p.rank || (idx + 1)} OFICIAL`,
            isRealUser: true
        }));
    } else {
        participants.forEach((p, idx) => {
            const pRank = p.rank || (idx + 1);
            const pAlias = (p.alias || p.name || '').trim();
            const pName = (p.name || p.alias || '').trim();
            const existing = championshipOfficialDrivers.find(d => 
                d.rank === pRank || 
                (pAlias && (d.alias || '').toLowerCase() === pAlias.toLowerCase()) ||
                (pName && (d.name || '').toLowerCase() === pName.toLowerCase())
            );
            if (existing) {
                if (p.alias) existing.alias = p.alias;
                if (p.name) existing.name = p.name;
                if (p.ride && (!existing.ride || existing.ride === 'Vehículo Oficial')) existing.ride = p.ride;
                if (!existing.rank) existing.rank = pRank;
            } else {
                championshipOfficialDrivers.push({
                    rank: pRank,
                    alias: pAlias,
                    name: pName,
                    ride: p.ride || 'Vehículo Oficial',
                    strength: `${p.ride || 'Vehículo Oficial'} • Parrilla Extendida`,
                    rep: 1000000,
                    points: 0,
                    victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
                    bestTimes: { first: 0, second: 0, third: 0 },
                    bio: `Piloto Oficial Inscrito en el Campeonato 2026.`,
                    status: `PILOTO OFICIAL #${pRank}`,
                    avatar: "assets/img/nfsranksmwlogo.png",
                    color: "#ff7700",
                    badge: `PLAZA #${pRank}`,
                    isRealUser: true
                });
            }
        });
    }

    championshipOfficialDrivers.sort((a, b) => (a.rank || 0) - (b.rank || 0));

    if (typeof window !== 'undefined') {
        window.DEFAULT_BLACKLIST_DRIVERS = championshipOfficialDrivers;
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

function normalizeChampionshipWeeksData(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const normalized = {};
    if (Array.isArray(raw)) {
        raw.forEach((w, idx) => {
            if (!w) return;
            const wNum = (w.weekNumber || w.weekNum) ? parseInt(w.weekNumber || w.weekNum, 10) : (idx + 1);
            if (!isNaN(wNum) && wNum >= 1 && wNum <= 4) {
                w.weekNumber = wNum;
                normalized[wNum] = w;
                normalized[String(wNum)] = w;
            }
        });
    } else {
        Object.keys(raw).forEach(k => {
            const w = raw[k];
            if (!w) return;
            const parsedK = parseInt(k, 10);
            const wNum = (w.weekNumber || w.weekNum) ? parseInt(w.weekNumber || w.weekNum, 10) : parsedK;
            if (!isNaN(wNum) && wNum >= 1 && wNum <= 4) {
                w.weekNumber = wNum;
                normalized[wNum] = w;
                normalized[String(wNum)] = w;
            }
        });
    }
    return normalized;
}

function getChampionshipDefaultDrivers() {
    if (championshipOfficialDrivers && championshipOfficialDrivers.length > 0) {
        return championshipOfficialDrivers;
    }
    if (typeof window !== 'undefined' && window.DEFAULT_BLACKLIST_DRIVERS && window.DEFAULT_BLACKLIST_DRIVERS.length > 0) {
        return window.DEFAULT_BLACKLIST_DRIVERS;
    }
    const participants = getChampionshipParticipantsList();
    if (participants && participants.length > 0) {
        return participants.map((p, idx) => ({
            rank: p.rank || (idx + 1),
            alias: p.alias || p.name || `Piloto ${idx + 1}`,
            name: p.name || p.alias || `Piloto ${idx + 1}`,
            ride: p.ride || 'Vehículo Oficial'
        }));
    }
    return FALLBACK_TOURNAMENT_PARTICIPANTS;
}

function resolveDriverRank(val) {
    if (!val) return null;
    if (typeof val === 'string' && (val.startsWith('open') || val.startsWith('cpu_'))) return val;
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= 50) return num;
    const clean = String(val).toLowerCase().replace(/^#\s*\d+\s*/, '').trim();

    const drivers = getChampionshipDefaultDrivers();
    const match = drivers.find(d => 
        (d.alias && d.alias.toLowerCase() === clean) || 
        (d.name && d.name.toLowerCase() === clean) || 
        (d.alias && d.alias.toLowerCase().includes(clean))
    );
    if (match) return match.rank;

    const participants = getChampionshipParticipantsList();
    const pIdx = participants.findIndex(p => 
        (p.alias && p.alias.toLowerCase() === clean) || 
        (p.name && p.name.toLowerCase() === clean) || 
        (p.alias && p.alias.toLowerCase().includes(clean))
    );
    if (pIdx !== -1) return (participants[pIdx].rank || (pIdx + 1));

    return null;
}

function getBlacklistDriverSelectOptionsHTML(selectedRankOrName) {
    const drivers = getChampionshipDefaultDrivers();

    const cleanSelected = String(selectedRankOrName || '').toLowerCase().trim();
    const selRank = parseInt(selectedRankOrName, 10);

    // 1. Inscribir Nuevo Piloto (Manual)
    const registerNewOption = `
        <optgroup label="➕ NUEVO PILOTO (INSCRIBIR)">
            <option value="__register_new__">➕ Inscribir Nuevo Piloto (Escribir Nombre)...</option>
        </optgroup>
    `;

    // 2. Plazas Disponibles (Esperando Piloto)
    const openSlots = [
        "open_11", "open_12", "open_13", "open_14", "open_15",
        "open_16", "open_17", "open_18", "open_19", "open_20", "open"
    ];
    const openSlotsHTML = `
        <optgroup label="🟢 PLAZAS DISPONIBLES (ESPERANDO PILOTO)">
            ${openSlots.map(s => {
                const isSel = cleanSelected === s;
                const label = s === 'open' 
                    ? '🟢 Plaza Vacante Libre (Esperando Piloto)' 
                    : `🟢 Plaza Disponible #${s.replace('open_', '')} (Esperando Piloto)`;
                return `<option value="${s}" ${isSel ? 'selected' : ''}>${label}</option>`;
            }).join('')}
        </optgroup>
    `;

    // 3. Pilotos Oficiales del Campeonato (Inscritos y Homologados)
    const officialOptions = drivers.map(d => {
        const dRank = d.rank;
        const isSel = (!cleanSelected.startsWith('open') && !cleanSelected.startsWith('cpu_')) && (
            (!isNaN(selRank) && selRank === dRank) ||
            (cleanSelected && (
                (d.alias && d.alias.toLowerCase() === cleanSelected) || 
                (d.name && d.name.toLowerCase() === cleanSelected) || 
                String(dRank) === cleanSelected
            ))
        );
        const namePart = (d.name && d.name !== d.alias) ? ` (${escapeHtml(d.name)})` : '';
        return `<option value="${dRank}" ${isSel ? 'selected' : ''}>🏁 #${dRank} ${escapeHtml(d.alias)}${namePart} [${escapeHtml(d.ride || 'Vehículo Oficial')}]</option>`;
    }).join('');

    // 4. Rivales IA / Story Mode (NFS MW 2005) - Para Sparring o Relleno CPU sin colisión
    const storyRivals = (typeof NFS_MW_2005_STORY_RIVALS !== 'undefined' && Array.isArray(NFS_MW_2005_STORY_RIVALS))
        ? NFS_MW_2005_STORY_RIVALS
        : [];
    const storyOptions = storyRivals.map(d => {
        const cpuVal = `cpu_${d.rank}`;
        const isSel = cleanSelected === cpuVal || cleanSelected === `cpu_${d.alias.toLowerCase()}`;
        return `<option value="${cpuVal}" ${isSel ? 'selected' : ''}>🎮 #${d.rank} ${escapeHtml(d.alias)} - ${escapeHtml(d.name)} [${escapeHtml(d.ride)}] (IA CPU)</option>`;
    }).join('');

    return `
        ${registerNewOption}
        ${openSlotsHTML}
        <optgroup label="🏁 PILOTOS OFICIALES DEL TORNEO (INSCRITOS • BLACKLIST 2026)">
            ${officialOptions}
        </optgroup>
        <optgroup label="🎮 RIVALES IA / STORY MODE (NFS MW 2005 - SPARRING CPU)">
            ${storyOptions}
        </optgroup>
    `;
}

function populateBlacklistPilotsDatalist() {
    let datalist = document.getElementById('bl-pilots-datalist');
    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = 'bl-pilots-datalist';
        document.body.appendChild(datalist);
    }
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

function populateRoutesDatalist() {
    let datalist = document.getElementById('bl-routes-datalist');
    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = 'bl-routes-datalist';
        document.body.appendChild(datalist);
    }
    const routes = (typeof routesData !== 'undefined' && Array.isArray(routesData)) ? routesData : [];
    datalist.innerHTML = routes.map(r => `<option value="${escapeHtml(r.name)}">${escapeHtml(r.type || '')}</option>`).join('');
}

function getActiveChampWeekData(weekNum) {
    const num = parseInt(weekNum, 10);
    const defaults = getChampionshipDefaultWeeksData();
    let result = null;
    
    if (cachedChampWeeksData) {
        if (Array.isArray(cachedChampWeeksData)) {
            result = cachedChampWeeksData.find(w => w && (w.weekNumber === num || w.weekNum === num));
        } else if (typeof cachedChampWeeksData === 'object') {
            result = cachedChampWeeksData[num] || cachedChampWeeksData[String(num)];
        }
    }

    if (!result && defaults) {
        if (Array.isArray(defaults)) {
            result = defaults.find(w => w && (w.weekNumber === num || w.weekNum === num));
        } else if (typeof defaults === 'object') {
            result = defaults[num] || defaults[String(num)];
        }
    }

    // Para Semana 3 y Semana 4: garantizar 5 grupos (Alfa, Beta, Gama, Delta, Épsilon) con 4 plazas cada uno
    if (result && num >= 3) {
        const defG = getDefaultChampionshipGroups(num);
        if (!Array.isArray(result.groups) || result.groups.length < 5) {
            if (!Array.isArray(result.groups) || result.groups.length === 0) {
                result.groups = JSON.parse(JSON.stringify(defG));
            } else {
                for (let g = result.groups.length; g < defG.length; g++) {
                    result.groups.push(JSON.parse(JSON.stringify(defG[g])));
                }
            }
        }
        result.groups.forEach((grp, gIdx) => {
            if (!Array.isArray(grp.pilots)) grp.pilots = [];
            while (grp.pilots.length < 4) {
                const defVal = (defG[gIdx] && defG[gIdx].pilots && defG[gIdx].pilots[grp.pilots.length]) 
                    ? defG[gIdx].pilots[grp.pilots.length] 
                    : `open_${gIdx * 4 + grp.pilots.length + 1}`;
                grp.pilots.push(defVal);
            }
        });
    }

    return result;
}

async function loadChampionshipAdmin() {
    const statusBadge = document.getElementById('champ-admin-status-badge');
    if (statusBadge) statusBadge.textContent = "⏳ Cargando datos...";

    // 1. Cargar participantes registrados y oficiales del torneo
    await loadChampionshipRegisteredParticipants();
    await loadChampionshipOfficialDrivers();
    populateBlacklistPilotsDatalist();
    populateRoutesDatalist();

    const defaults = getChampionshipDefaultWeeksData();

    // Carga inmediata de memoria local o defaults para renderizado instantáneo (0ms)
    if (!cachedChampWeeksData) {
        try {
            const local = localStorage.getItem('nfs_championship_weeks_data_v3') || 
                          localStorage.getItem('nfs_championship_weeks_data_v2') || 
                          localStorage.getItem('nfs_championship_weeks_data_v1');
            if (local) {
                const parsed = JSON.parse(local);
                cachedChampWeeksData = normalizeChampionshipWeeksData(parsed);
            }
        } catch (e) {}
    }

    if (!cachedChampWeeksData && defaults) {
        cachedChampWeeksData = normalizeChampionshipWeeksData(JSON.parse(JSON.stringify(defaults)));
    }

    // Renderizar de inmediato para que nunca quede la pantalla en blanco
    selectChampionshipAdminWeek(currentChampAdminWeek);
    if (statusBadge) statusBadge.textContent = "🟢 Datos Activos";

    // 2. Comprobar en segundo plano si Firebase RTDB tiene datos más recientes
    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) 
        ? window.NFS_FIREBASE.RTDB_URL 
        : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";

    try {
        let data = null;

        // Intentar nodo records (nodo público verificado y permanente)
        try {
            const res1 = await fetch(`${baseUrl}/records/championship_weeks_data.json`);
            if (res1.ok) {
                const j1 = await res1.json();
                if (j1 && typeof j1 === 'object') data = j1;
            }
        } catch (e) {}

        // Fallback a rtdbGet con auth
        if (!data && typeof rtdbGet === 'function') {
            data = await rtdbGet('championship/weeks_data');
        }

        if (data && typeof data === 'object') {
            cachedChampWeeksData = normalizeChampionshipWeeksData(data);
            localStorage.removeItem('nfs_championship_weeks_data_v1');
            localStorage.removeItem('nfs_championship_weeks_data_v2');
            localStorage.setItem('nfs_championship_weeks_data_v3', JSON.stringify(cachedChampWeeksData));
            if (typeof window !== 'undefined' && window.CHAMPIONSHIP_WEEKS_DATA) {
                Object.assign(window.CHAMPIONSHIP_WEEKS_DATA, cachedChampWeeksData);
            }
            selectChampionshipAdminWeek(currentChampAdminWeek);
            if (statusBadge) statusBadge.textContent = "🟢 Sincronizado RTDB";
        }
    } catch (e) {
        console.warn("Aviso al consultar RTDB para el campeonato:", e);
    }
}

function getGroupIcon(idx) {
    const icons = ["🔥", "⚡", "⚔️", "🎯", "👑", "🏁", "💨", "🛡️"];
    return icons[idx % icons.length];
}

function getChampionshipDriverByRank(rank) {
    if (rank === undefined || rank === null || rank === '') {
        return { rank: null, alias: 'Por Definir', name: 'Por Definir', ride: 'Vehículo Oficial' };
    }
    if (typeof rank === 'string' && rank.startsWith('open')) {
        const matchNum = rank.match(/open_(\d+)/);
        const slotNum = matchNum ? matchNum[1] : '';
        const label = slotNum ? `Plaza #${slotNum} (Disponible)` : 'Plaza Disponible';
        return { rank: rank, alias: label, name: label, ride: 'Esperando Piloto' };
    }
    if (typeof rank === 'string' && rank.startsWith('cpu_')) {
        const cpuNum = parseInt(rank.replace('cpu_', ''), 10);
        const storyRivals = (typeof NFS_MW_2005_STORY_RIVALS !== 'undefined' && Array.isArray(NFS_MW_2005_STORY_RIVALS)) ? NFS_MW_2005_STORY_RIVALS : [];
        const match = storyRivals.find(d => d.rank === cpuNum);
        if (match) {
            return { rank: rank, alias: `${match.alias} (IA)`, name: match.name, ride: match.ride };
        }
        return { rank: rank, alias: `CPU #${cpuNum}`, name: `CPU #${cpuNum}`, ride: 'Vehículo Oficial' };
    }

    const num = parseInt(rank, 10);
    const strLower = String(rank).toLowerCase().trim();

    // 1. Buscar primero en los pilotos oficiales del campeonato
    const drivers = getChampionshipDefaultDrivers();
    if (drivers && Array.isArray(drivers)) {
        const d = drivers.find((x, i) => 
            (!isNaN(num) && (x.rank === num || i + 1 === num)) ||
            (x.alias && x.alias.toLowerCase() === strLower) ||
            (x.name && x.name.toLowerCase() === strLower)
        );
        if (d) return { rank: d.rank || num, alias: d.alias || d.name, name: d.name || d.alias, ride: d.ride || 'Vehículo Oficial' };
    }

    // 2. Buscar en participantes registrados
    const participants = getChampionshipParticipantsList();
    if (participants && Array.isArray(participants)) {
        const p = participants.find((x, i) => 
            (!isNaN(num) && (x.rank === num || i + 1 === num)) ||
            (x.alias && x.alias.toLowerCase() === strLower) ||
            (x.name && x.name.toLowerCase() === strLower)
        );
        if (p) return { rank: p.rank || num || (i + 1), alias: p.alias || p.name, name: p.name || p.alias, ride: p.ride || 'Vehículo Oficial' };
    }

    const fallbackLabel = (!isNaN(num)) ? `Piloto #${num}` : String(rank);
    return { rank: !isNaN(num) ? num : rank, alias: fallbackLabel, name: fallbackLabel, ride: 'Vehículo Oficial' };
}

function quickAssignPilotToWinner(chIdx, posIdx, pilotName, pilotRide) {
    const pilotInput = document.getElementById(`ch-p${posIdx}-pilot-${chIdx}`);
    const carInput = document.getElementById(`ch-p${posIdx}-car-${chIdx}`);
    const timeInput = document.getElementById(`ch-p${posIdx}-time-${chIdx}`);

    if (pilotInput) {
        pilotInput.value = pilotName;
    }
    if (carInput && (!carInput.value || carInput.value.trim() === '')) {
        carInput.value = pilotRide || '';
    }
    if (timeInput) {
        timeInput.focus();
    }
}

function selectChampionshipAdminGroup(grpIdx) {
    currentChampAdminGroup = grpIdx;
    renderChampionshipAdminGroupPills();
    renderChampionshipAdminChallenges();
}

function renderChampionshipAdminGroupPills() {
    const container = document.getElementById('champ-admin-group-pills');
    const infoEl = document.getElementById('champ-admin-group-active-info');
    const saveGroupBtn = document.getElementById('btn-save-champ-group-challenges');
    if (!container) return;

    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    const groups = (weekData && Array.isArray(weekData.groups) && weekData.groups.length > 0)
        ? weekData.groups
        : getDefaultChampionshipGroups(currentChampAdminWeek);

    if (currentChampAdminGroup >= groups.length) {
        currentChampAdminGroup = 0;
    }

    container.innerHTML = groups.map((grp, grpIdx) => {
        const isActive = grpIdx === currentChampAdminGroup;
        const icon = getGroupIcon(grpIdx);
        return `
            <button type="button" class="admin-btn admin-btn-sm champ-admin-group-btn ${isActive ? 'active' : 'admin-btn-outline'}" 
                onclick="selectChampionshipAdminGroup(${grpIdx})"
                title="Editar los 8 desafíos y ganadores de ${escapeHtml(grp.name)}">
                <span>${icon}</span> ${escapeHtml(grp.name)}
            </button>
        `;
    }).join('');

    const activeGrp = groups[currentChampAdminGroup] || groups[0];
    if (saveGroupBtn && activeGrp) {
        saveGroupBtn.innerHTML = `💾 Guardar los 8 Desafíos (${escapeHtml(activeGrp.name)})`;
        saveGroupBtn.title = `Guardar todos los 8 desafíos y ganadores para ${escapeHtml(activeGrp.name)} en la Semana ${currentChampAdminWeek}`;
    }

    if (infoEl && activeGrp) {
        const numSlots = (currentChampAdminWeek >= 3 || (Array.isArray(activeGrp.pilots) && activeGrp.pilots.length >= 4)) ? 4 : 3;
        const pilots = Array.isArray(activeGrp.pilots) ? activeGrp.pilots : Array.from({ length: numSlots }, (_, i) => currentChampAdminGroup * numSlots + i + 1);
        const pilotObjs = pilots.map(p => getChampionshipDriverByRank(p));
        const colors = ['var(--nfs-orange)', '#38bdf8', '#a7f3d0', '#fbbf24', '#c084fc'];

        infoEl.innerHTML = `
            <span style="font-weight: 700; color: #fff;">${pilots.length >= 4 ? 'Cuarteto' : 'Trío'} ${escapeHtml(activeGrp.name)}:</span>
            ${pilotObjs.map((p, idx) => `<span style="color: ${colors[idx % colors.length]}; font-weight: 700;">🏎️ #${idx + 1} ${escapeHtml(p.alias)}</span>`).join(' <span style="color: #64748b;">•</span> ')}
        `;
    }
}

function selectChampionshipAdminWeek(weekNum) {
    // Si la UI de la semana actual tiene grupos renderizados, capturarlos en memoria antes de cambiar de semana
    if (document.getElementById('champ-admin-groups-container')) {
        const currentUIGroups = getChampionshipGroupsFromUI();
        const curWeekData = getActiveChampWeekData(currentChampAdminWeek);
        if (curWeekData && currentUIGroups && currentUIGroups.length > 0) {
            curWeekData.groups = currentUIGroups;
        }
    }

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
    renderChampionshipAdminGroupPills();
    renderChampionshipAdminChallenges();
}

function renderChampionshipAdminGroups() {
    const container = document.getElementById('champ-admin-groups-container');
    if (!container) return;

    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    if (weekData && (!weekData.groups || !Array.isArray(weekData.groups) || weekData.groups.length === 0)) {
        weekData.groups = getDefaultChampionshipGroups(currentChampAdminWeek);
    }

    const groups = (weekData && Array.isArray(weekData.groups) && weekData.groups.length > 0)
        ? weekData.groups
        : getDefaultChampionshipGroups(currentChampAdminWeek);

    container.innerHTML = groups.map((grp, grpIdx) => {
        const numSlots = (currentChampAdminWeek >= 3 || (Array.isArray(grp.pilots) && grp.pilots.length >= 4)) ? 4 : 3;
        const pilots = Array.isArray(grp.pilots) ? grp.pilots : Array.from({ length: numSlots }, (_, i) => grpIdx * numSlots + i + 1);
        while (pilots.length < numSlots) {
            pilots.push(`open_${grpIdx * numSlots + pilots.length + 1}`);
        }
        const hasOpenSlots = pilots.some(p => String(p).startsWith('open'));
        const slotIndices = Array.from({ length: numSlots }, (_, i) => i);
        return `
            <div class="admin-group-card" id="admin-group-card-${grpIdx}" style="background: rgba(18,22,34,0.75); border: 1px solid ${hasOpenSlots ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.08)'}; border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 10px; transition: border-color 0.2s ease;">
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
                        <button type="button" class="admin-btn admin-btn-xs" onclick="deleteChampionshipAdminGroup(${grpIdx})" title="Eliminar este grupo únicamente de la semana activa" style="background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.5); color: #fca5a5; padding: 6px 10px; font-size: 11px; border-radius: 6px; cursor: pointer; white-space: nowrap; transition: all 0.2s ease;">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top:2px;">
                    <div style="font-size:11px; color:var(--text-muted); font-weight:700;">Pilotos Asignados al ${numSlots >= 4 ? 'Cuarteto' : 'Trío'} / Grupo:</div>
                    ${hasOpenSlots ? `<span style="font-size:10px; font-weight:800; color:#34d399; background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.3); padding:2px 6px; border-radius:4px;">🟢 Contiene Plazas Disponibles</span>` : ''}
                </div>
                <div class="admin-group-pilots-list" style="display: flex; flex-direction: column; gap: 8px;">
                    ${slotIndices.map(slotIdx => {
                        const pRank = pilots[slotIdx] !== undefined ? pilots[slotIdx] : `open_${grpIdx * numSlots + slotIdx + 1}`;
                        const isOpen = String(pRank).startsWith('open');
                        return `
                            <div class="admin-group-pilot-row" style="display: flex; align-items: center; gap: 8px; ${isOpen ? 'background: rgba(16,185,129,0.08); border: 1px dashed rgba(16,185,129,0.35); border-radius: 6px; padding: 4px 8px;' : ''}">
                                <span style="font-size:11px; color:${isOpen ? '#34d399' : 'var(--nfs-orange)'}; font-weight:800; min-width:24px;">#${slotIdx + 1}</span>
                                <select id="grp-p${slotIdx}-${grpIdx}" class="admin-form-input" onchange="onGroupPilotSelectChanged(this, ${grpIdx}, ${slotIdx})" style="padding:6px 10px; font-size:12px; font-weight:600; cursor:pointer; flex: 1; ${isOpen ? 'border-color: rgba(16,185,129,0.5); color: #6ee7b7;' : ''}">
                                    ${getBlacklistDriverSelectOptionsHTML(pRank)}
                                </select>
                                ${isOpen ? `
                                    <button type="button" class="admin-btn admin-btn-xs" onclick="openAssignPilotToSlotModal(${grpIdx}, ${slotIdx})" title="Asignar piloto a esta plaza disponible" style="background: rgba(16,185,129,0.22); border: 1px solid #10b981; color: #a7f3d0; padding: 5px 10px; font-size: 11px; border-radius: 4px; cursor: pointer; white-space: nowrap; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                                        ➕ Asignar
                                    </button>
                                ` : `
                                    <button type="button" class="admin-btn admin-btn-xs" onclick="openAssignPilotToSlotModal(${grpIdx}, ${slotIdx})" title="Reasignar piloto en esta casilla" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: var(--text-muted); padding: 5px 8px; font-size: 11px; border-radius: 4px; cursor: pointer; white-space: nowrap;">
                                        ✏️
                                    </button>
                                `}
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
    const parsePilotVal = (val, defaultRank) => {
        if (val === undefined || val === null || val === '') return defaultRank;
        const strVal = String(val).trim();
        if (strVal.startsWith('open') || strVal.startsWith('cpu_')) return strVal;
        const parsed = parseInt(strVal, 10);
        if (!isNaN(parsed)) return parsed;
        if (typeof resolveDriverRank === 'function') {
            const resolved = resolveDriverRank(strVal);
            if (resolved) return resolved;
        }
        return strVal || defaultRank;
    };

    groupCards.forEach((card, grpIdx) => {
        const nameEl = document.getElementById(`grp-name-${grpIdx}`);
        const tagEl = document.getElementById(`grp-tag-${grpIdx}`);
        const slotRows = card.querySelectorAll('.admin-group-pilot-row');
        const slotCount = slotRows.length || (currentChampAdminWeek >= 3 ? 4 : 3);
        const pilots = [];
        for (let slotIdx = 0; slotIdx < slotCount; slotIdx++) {
            const pEl = document.getElementById(`grp-p${slotIdx}-${grpIdx}`);
            const defaultRank = (grpIdx * slotCount + slotIdx + 1 > 15) 
                ? `open_${grpIdx * slotCount + slotIdx + 1}` 
                : (grpIdx * slotCount + slotIdx + 1);
            pilots.push(parsePilotVal(pEl ? pEl.value : null, defaultRank));
        }

        updatedGroups.push({
            name: nameEl ? nameEl.value.trim() : `Grupo #${grpIdx + 1}`,
            tag: tagEl ? tagEl.value.trim() : 'TIER OFICIAL',
            pilots: pilots
        });
    });
    return updatedGroups;
}

/**
 * Persiste los datos de semanas y desafíos en Firebase RTDB y caché local,
 * sincronizando en tiempo real con la web pública (index.html y subpáginas).
 */
async function persistChampionshipWeeksData(data) {
    if (!data) return false;

    const normalized = normalizeChampionshipWeeksData(data) || data;
    cachedChampWeeksData = normalized;

    // 1. Respaldo local instantáneo (0ms) en localStorage
    try {
        localStorage.removeItem('nfs_championship_weeks_data_v1');
        localStorage.removeItem('nfs_championship_weeks_data_v2');
        localStorage.setItem('nfs_championship_weeks_data_v3', JSON.stringify(normalized));
    } catch (e) {
        console.warn("Error guardando nfs_championship_weeks_data_v3 en localStorage:", e);
    }

    if (typeof window !== 'undefined' && window.CHAMPIONSHIP_WEEKS_DATA) {
        Object.assign(window.CHAMPIONSHIP_WEEKS_DATA, normalized);
    }

    // 2. Difusión en tiempo real entre pestañas abiertas de comisaría y web pública
    try {
        if (typeof BroadcastChannel !== 'undefined') {
            const bc = new BroadcastChannel('nfs_championship_sync');
            bc.postMessage({ type: 'CHAMPIONSHIP_WEEKS_UPDATED', week: currentChampAdminWeek, data: normalized });
            bc.close();
        }
    } catch (e) {}

    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) 
        ? window.NFS_FIREBASE.RTDB_URL 
        : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";

    let ok = false;

    // Preparar array ordenado de 4 semanas para que RTDB mantenga un array 0-indexed [0..3]
    let rtdbPayload = normalized;
    if (normalized && typeof normalized === 'object' && !Array.isArray(normalized)) {
        const arr = [];
        for (let w = 1; w <= 4; w++) {
            const wObj = normalized[w] || normalized[String(w)];
            if (wObj) {
                wObj.weekNumber = w;
                arr.push(wObj);
            }
        }
        if (arr.length === 4) {
            rtdbPayload = arr;
        }
    }

    // 3. Guardado en nodo público oficial /records/championship_weeks_data (NUNCA bajo championship_participants)
    try {
        const res = await fetch(`${baseUrl}/records/championship_weeks_data.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rtdbPayload)
        });
        if (res.ok) {
            ok = true;
        }
    } catch (e) {
        console.warn("Aviso al guardar en nodo público de RTDB:", e);
    }

    // 4. Guardado autenticado en /championship/weeks_data usando rtdbPut (con token Firebase Auth)
    try {
        if (typeof rtdbPut === 'function') {
            await rtdbPut('championship/weeks_data', rtdbPayload);
            ok = true;
        }
    } catch (e) {
        console.warn("Aviso al guardar en nodo de administración championship/weeks_data:", e);
    }

    const statusBadge = document.getElementById('champ-admin-status-badge');
    if (statusBadge) statusBadge.textContent = "🟢 Sincronizado en Nube & Web";

    // 5. Sincronizar automáticamente clasificaciones y reputación de pilotos
    try {
        if (typeof syncChampionshipWinnersInternal === 'function') {
            await syncChampionshipWinnersInternal();
        }
    } catch (eSync) {}

    return ok;
}

function formatRotatedGroupName(baseName, defaultBase, subtitle) {
    const raw = (baseName || defaultBase).trim();
    if (/\(.*?\)/.test(raw)) {
        return raw.replace(/\(.*?\)/, `(${subtitle})`);
    }
    return `${raw} (${subtitle})`;
}

async function saveChampionshipSingleGroup(grpIdx) {
    const groups = getChampionshipGroupsFromUI();
    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    if (weekData) {
        weekData.groups = groups;
    }
    const grpName = (groups[grpIdx] && groups[grpIdx].name) ? groups[grpIdx].name : `Grupo #${grpIdx + 1}`;
    await persistChampionshipWeeksData(cachedChampWeeksData);
    renderChampionshipAdminGroupPills();
    renderChampionshipAdminChallenges();
    showToast(`✓ ¡${grpName} guardado y sincronizado con la web!`, "success");
}

async function saveChampionshipAdminGroupsOnly() {
    const groups = getChampionshipGroupsFromUI();
    if (!groups || groups.length === 0) {
        showToast("No hay grupos para guardar.", "warning");
        return;
    }

    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    if (weekData) {
        weekData.groups = groups;
    }

    showToast(`💾 Guardando grupos de la Semana ${currentChampAdminWeek}...`, "info");
    const ok = await persistChampionshipWeeksData(cachedChampWeeksData);
    renderChampionshipAdminGroupPills();
    renderChampionshipAdminChallenges();
    if (ok) {
        showToast(`✓ ¡Grupos de la Semana ${currentChampAdminWeek} guardados y sincronizados con la web!`, "success");
    } else {
        showToast(`✓ ¡Grupos guardados en caché local!`, "info");
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

    if (!confirm(`¿Confirmas que deseas aplicar y sincronizar la rotación de estos ${groups.length} grupos a TODAS las semanas (1, 2, 3 y 4) del Campeonato Blacklist?`)) {
        return;
    }

    const numGroups = groups.length;
    // Semana 1: siempre los grupos configurados
    const w1Data = getActiveChampWeekData(1);
    if (w1Data) {
        w1Data.groups = JSON.parse(JSON.stringify(groups));
    }

    const tier0 = groups.map(g => (g.pilots && g.pilots[0] !== undefined) ? g.pilots[0] : 1);
    const tier1 = groups.map(g => (g.pilots && g.pilots[1] !== undefined) ? g.pilots[1] : 2);
    const tier2 = groups.map(g => (g.pilots && g.pilots[2] !== undefined) ? g.pilots[2] : 3);
    const tier3 = groups.map((g, gIdx) => (g.pilots && g.pilots[3] !== undefined) ? g.pilots[3] : `open_${(gIdx * 4) + 4}`);

    for (let w = 2; w <= 4; w++) {
        const wObj = getActiveChampWeekData(w);
        if (!wObj) continue;
        const shift1 = (w - 1) % numGroups;
        const shift2 = ((w - 1) * 2) % numGroups;
        const shift3 = ((w - 1) * 3) % numGroups;
        const numSlotsForWeek = (w >= 3) ? 4 : (groups.some(g => g.pilots && g.pilots.length >= 4) ? 4 : 3);

        wObj.groups = groups.map((bg, gIdx) => {
            let defaultName = bg.name;
            if (numGroups === 3 || numGroups === 4) {
                const subnames = {
                    2: ["Velocidad Pura", "Duelo Callejero", "Fuerza & Asfalto", "Competición & Desafío"],
                    3: ["Cruce de Titanes", "Duelo de Élite", "Guerra de Caballos", "Competición & Ascenso"],
                    4: ["Gran Final • Corona", "Duelo por el Podio", "Batalla de Honor", "Copa de Honor / Repechaje"]
                };
                const sub = (subnames[w] && subnames[w][gIdx]) || `Rotación ${w}`;
                const prefix = bg.name.includes('(') ? bg.name.split('(')[0].trim() : `Grupo #${gIdx + 1}`;
                defaultName = `${prefix} (${sub})`;
            }

            const rotatedPilots = [
                tier0[gIdx],
                tier1[(gIdx + shift1) % numGroups],
                tier2[(gIdx + shift2) % numGroups]
            ];
            if (numSlotsForWeek >= 4) {
                const p4 = tier3[(gIdx + shift3) % numGroups];
                rotatedPilots.push(p4 !== undefined ? p4 : `open_${(gIdx * 4) + 4}`);
            }

            return {
                name: defaultName,
                tag: bg.tag || (w === 4 ? "👑 CHAMPIONSHIP" : "TIER OFICIAL"),
                pilots: rotatedPilots
            };
        });
    }

    showToast("💾 Guardando y aplicando rotación en todas las semanas del campeonato...", "info");
    const ok = await persistChampionshipWeeksData(cachedChampWeeksData);
    renderChampionshipAdminGroupPills();
    renderChampionshipAdminChallenges();
    if (ok) {
        showToast(`✓ ¡Guardado con éxito! Se aplicó la rotación de los ${groups.length} grupos a todas las semanas y están sincronizados con la web.`, "success");
    } else {
        showToast(`✓ ¡Grupos guardados en caché local!`, "info");
    }

    const statusBadge = document.getElementById('champ-admin-status-badge');
    if (statusBadge) statusBadge.textContent = "🟢 Todos los Grupos Guardados";
}

async function addChampionshipAdminGroup() {
    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    if (!weekData) return;

    const currentGroups = getChampionshipGroupsFromUI();
    const newIdx = currentGroups.length;
    const greekName = GREEK_GROUP_NAMES[newIdx] || `Grupo #${newIdx + 1}`;
    const numSlots = (currentChampAdminWeek >= 3) ? 4 : 3;
    const startPilot = newIdx * numSlots + 1;

    const pilots = [];
    for (let s = 0; s < numSlots; s++) {
        const pNum = startPilot + s;
        if (pNum <= 15) {
            pilots.push(pNum);
        } else {
            pilots.push(`open_${newIdx * numSlots + s + 1}`);
        }
    }

    const newGroup = {
        name: `Grupo ${greekName}`,
        tag: "🏁 TIER COMPETICIÓN",
        pilots: pilots
    };

    currentGroups.push(newGroup);
    weekData.groups = currentGroups;

    renderChampionshipAdminGroups();
    renderChampionshipAdminGroupPills();
    renderChampionshipAdminChallenges();

    await persistChampionshipWeeksData(cachedChampWeeksData);
    showToast(`✓ ¡Nuevo ${newGroup.name} agregado únicamente a la Semana ${currentChampAdminWeek} y sincronizado con la web!`, "success");

    setTimeout(() => {
        const lastInput = document.getElementById(`grp-name-${newIdx}`);
        if (lastInput) {
            lastInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            lastInput.focus();
        }
    }, 120);
}

async function deleteChampionshipAdminGroup(grpIdx) {
    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    if (!weekData) return;

    const currentGroups = getChampionshipGroupsFromUI();
    if (!currentGroups || currentGroups.length <= grpIdx) return;

    const grp = currentGroups[grpIdx];
    const grpName = grp ? (grp.name || `Grupo #${grpIdx + 1}`) : `Grupo #${grpIdx + 1}`;

    const ok = confirm(`¿Estás seguro de que deseas eliminar "${grpName}" únicamente de la Semana ${currentChampAdminWeek}?\n\n• Esta acción afectará SOLAMENTE a la Semana ${currentChampAdminWeek}.\n• Los grupos de las demás semanas permanecerán intactos.`);
    if (!ok) return;

    currentGroups.splice(grpIdx, 1);
    weekData.groups = currentGroups;

    const remainingGroups = (getActiveChampWeekData(currentChampAdminWeek)?.groups) || [];
    if (currentChampAdminGroup >= remainingGroups.length) {
        currentChampAdminGroup = Math.max(0, remainingGroups.length - 1);
    }

    renderChampionshipAdminGroups();
    renderChampionshipAdminGroupPills();
    renderChampionshipAdminChallenges();

    await persistChampionshipWeeksData(cachedChampWeeksData);
    showToast(`✓ Grupo "${grpName}" eliminado únicamente de la Semana ${currentChampAdminWeek} y sincronizado con la web.`, "success");
}

let assignSlotPilotMode = 'existing'; // 'existing' | 'new'

function toggleAssignSlotPilotMode() {
    const btn = document.getElementById('btn-toggle-assign-new-pilot');
    const existingWrap = document.getElementById('assign-slot-existing-wrap');
    const newWrap = document.getElementById('assign-slot-new-wrap');
    if (!existingWrap || !newWrap) return;

    if (assignSlotPilotMode === 'existing') {
        assignSlotPilotMode = 'new';
        existingWrap.style.display = 'none';
        newWrap.style.display = 'flex';
        if (btn) btn.innerHTML = '📋 Seleccionar de la Lista';
        const nameInput = document.getElementById('assign-slot-new-pilot-name');
        if (nameInput) setTimeout(() => nameInput.focus(), 60);
    } else {
        assignSlotPilotMode = 'existing';
        existingWrap.style.display = 'block';
        newWrap.style.display = 'none';
        if (btn) btn.innerHTML = '✍️ Inscribir Nuevo Piloto';
    }
}

/**
 * Registra un nuevo participante en memoria local, localStorage y Firebase RTDB.
 */
async function registerNewChampionshipParticipant(participantData) {
    if (!registeredChampionshipParticipants || !Array.isArray(registeredChampionshipParticipants) || registeredChampionshipParticipants.length === 0) {
        registeredChampionshipParticipants = JSON.parse(JSON.stringify(FALLBACK_TOURNAMENT_PARTICIPANTS));
    }

    if (!participantData.id) {
        participantData.id = "reg_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
    }
    if (!participantData.registeredAt) {
        participantData.registeredAt = new Date().toISOString();
    }
    participantData.isRealUser = true;

    // Calcular próximo rango secuencial
    let maxRank = 0;
    registeredChampionshipParticipants.forEach((p, idx) => {
        const r = p.rank || (idx + 1);
        if (typeof r === 'number' && r > maxRank) maxRank = r;
    });
    const nextRank = Math.max(maxRank + 1, registeredChampionshipParticipants.length + 1);
    participantData.rank = participantData.rank || nextRank;

    registeredChampionshipParticipants.push(participantData);

    // 1. Persistir en localStorage
    try {
        localStorage.setItem('nfs_championship_participants_v2', JSON.stringify(registeredChampionshipParticipants));
    } catch (e) {
        console.warn("Aviso al guardar participantes en localStorage:", e);
    }

    // 2. Extender también championshipOfficialDrivers y window.DEFAULT_BLACKLIST_DRIVERS
    const newOfficialEntry = {
        rank: participantData.rank,
        name: participantData.name,
        alias: participantData.alias || participantData.name,
        ride: participantData.ride || 'Vehículo Oficial',
        strength: `${participantData.ride || 'Vehículo Oficial'} • Parrilla Extendida`,
        rep: 1000000,
        points: 0,
        victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
        bestTimes: { first: 0, second: 0, third: 0 },
        bio: `Piloto Oficial Inscrito en el Campeonato 2026. Registrado desde Administración.`,
        signature: (participantData.alias || participantData.name).toUpperCase(),
        status: `PILOTO OFICIAL #${participantData.rank}`,
        avatar: "assets/img/nfsranksmwlogo.png",
        color: "#ff7700",
        badge: `PLAZA #${participantData.rank}`,
        youtube: participantData.youtube || '',
        isRealUser: true,
        schedule: participantData.schedule || 'Horario Flexible',
        contact: participantData.contact || ''
    };

    if (!championshipOfficialDrivers.some(d => d.rank === participantData.rank || (d.alias && d.alias.toLowerCase() === participantData.alias.toLowerCase()))) {
        championshipOfficialDrivers.push(newOfficialEntry);
        championshipOfficialDrivers.sort((a, b) => (a.rank || 0) - (b.rank || 0));
    }
    if (typeof window !== 'undefined') {
        window.DEFAULT_BLACKLIST_DRIVERS = championshipOfficialDrivers;
    }
    try {
        localStorage.setItem('nfs_blacklist_championship_2026_v5', JSON.stringify(championshipOfficialDrivers));
    } catch (e) {}

    // 3. Actualizar datalist para autocompletar desafíos
    populateBlacklistPilotsDatalist();

    // 4. Guardar en Firebase RTDB (/championship_participants.json y /records/blacklist_championship_2026.json)
    try {
        const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) 
            ? window.NFS_FIREBASE.RTDB_URL 
            : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
        await fetch(`${baseUrl}/championship_participants.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(participantData)
        });
        await fetch(`${baseUrl}/records/blacklist_championship_2026.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(championshipOfficialDrivers)
        });
    } catch (e) {
        console.info("Aviso al guardar participante en Firebase RTDB:", e.message);
    }

    return participantData;
}

/**
 * Abre el modal para asignar un piloto oficial o registrar uno nuevo a una plaza disponible.
 */
function openAssignPilotToSlotModal(targetGrpIdx, targetSlotIdx) {
    const modal = document.getElementById('modal-assign-slot');
    if (!modal) return;

    // Resetear a modo existente
    assignSlotPilotMode = 'existing';
    const btnToggle = document.getElementById('btn-toggle-assign-new-pilot');
    const existingWrap = document.getElementById('assign-slot-existing-wrap');
    const newWrap = document.getElementById('assign-slot-new-wrap');
    if (btnToggle) btnToggle.innerHTML = '✍️ Inscribir Nuevo Piloto';
    if (existingWrap) existingWrap.style.display = 'block';
    if (newWrap) newWrap.style.display = 'none';

    const newNameInput = document.getElementById('assign-slot-new-pilot-name');
    const newCarInput = document.getElementById('assign-slot-new-pilot-car');
    const newContactInput = document.getElementById('assign-slot-new-pilot-contact');
    if (newNameInput) newNameInput.value = '';
    if (newCarInput) newCarInput.value = 'BMW M3 GTR';
    if (newContactInput) newContactInput.value = '';

    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    const groups = (weekData && Array.isArray(weekData.groups) && weekData.groups.length > 0)
        ? weekData.groups
        : getDefaultChampionshipGroups(currentChampAdminWeek);

    // 1. Llenar selector de grupos
    const grpSelect = document.getElementById('assign-slot-group-select');
    if (grpSelect) {
        grpSelect.innerHTML = groups.map((g, idx) => {
            const hasOpen = Array.isArray(g.pilots) && g.pilots.some(p => String(p).startsWith('open'));
            return `<option value="${idx}">${escapeHtml(g.name || `Grupo #${idx + 1}`)} ${hasOpen ? '🟢 [Plaza Disponible]' : ''}</option>`;
        }).join('');

        if (targetGrpIdx !== undefined && targetGrpIdx !== null && targetGrpIdx >= 0 && targetGrpIdx < groups.length) {
            grpSelect.value = String(targetGrpIdx);
        } else {
            const firstOpenGrpIdx = groups.findIndex(g => Array.isArray(g.pilots) && g.pilots.some(p => String(p).startsWith('open')));
            if (firstOpenGrpIdx >= 0) {
                grpSelect.value = String(firstOpenGrpIdx);
            } else {
                grpSelect.value = "0";
            }
        }
    }

    // 2. Llenar casillas del grupo seleccionado
    onAssignModalGroupChanged(targetSlotIdx);

    // 3. Llenar selector de pilotos (Inscritos y Rivales Blacklist)
    const pilotSelect = document.getElementById('assign-slot-pilot-select');
    if (pilotSelect) {
        pilotSelect.innerHTML = getBlacklistDriverSelectOptionsHTML('');
    }

    modal.style.display = 'flex';
}

function closeAssignPilotToSlotModal() {
    const modal = document.getElementById('modal-assign-slot');
    if (modal) modal.style.display = 'none';
}

function onAssignModalGroupChanged(preferredSlotIdx) {
    const grpSelect = document.getElementById('assign-slot-group-select');
    const slotSelect = document.getElementById('assign-slot-number-select');
    if (!grpSelect || !slotSelect) return;

    const grpIdx = parseInt(grpSelect.value, 10) || 0;
    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    const groups = (weekData && Array.isArray(weekData.groups) && weekData.groups.length > 0)
        ? weekData.groups
        : getDefaultChampionshipGroups(currentChampAdminWeek);
    const grp = groups[grpIdx] || { pilots: [1, 2, 3] };
    const pilots = Array.isArray(grp.pilots) ? grp.pilots : [1, 2, 3];
    const participants = getChampionshipParticipantsList();
    const blDrivers = getChampionshipDefaultDrivers();

    const numSlots = (currentChampAdminWeek >= 3 || pilots.length >= 4) ? 4 : 3;
    const slotIndices = Array.from({ length: Math.max(pilots.length, numSlots) }, (_, sIdx) => sIdx);

    slotSelect.innerHTML = slotIndices.map(sIdx => {
        const val = pilots[sIdx] !== undefined ? pilots[sIdx] : `open_${(grpIdx * 4) + sIdx + 1}`;
        const isOpen = String(val).startsWith('open');
        let label = `Casilla #${sIdx + 1}: `;
        if (isOpen) {
            const slotNum = String(val).replace('open_', '');
            label += `🟢 DISPONIBLE (Plaza #${slotNum})`;
        } else {
            const num = parseInt(val, 10);
            const pInfo = (!isNaN(num)) ? (participants.find(p => p.rank === num) || blDrivers.find(d => d.rank === num)) : null;
            const pName = pInfo ? (pInfo.alias || pInfo.name) : `#${val}`;
            label += `Ocupado por ${pName}`;
        }
        return `<option value="${sIdx}">${label}</option>`;
    }).join('');

    if (preferredSlotIdx !== undefined && preferredSlotIdx !== null) {
        slotSelect.value = String(preferredSlotIdx);
    } else {
        const openSlotIdx = pilots.findIndex(p => String(p).startsWith('open'));
        if (openSlotIdx >= 0) {
            slotSelect.value = String(openSlotIdx);
        }
    }
}

async function confirmAssignPilotToSlot() {
    const grpSelect = document.getElementById('assign-slot-group-select');
    const slotSelect = document.getElementById('assign-slot-number-select');

    if (!grpSelect || !slotSelect) return;

    const grpIdx = parseInt(grpSelect.value, 10);
    const slotIdx = parseInt(slotSelect.value, 10);

    if (isNaN(grpIdx) || isNaN(slotIdx)) {
        alert("Por favor selecciona grupo y casilla.");
        return;
    }

    let chosenPilotVal = '';

    if (assignSlotPilotMode === 'new') {
        const nameInput = document.getElementById('assign-slot-new-pilot-name');
        const carInput = document.getElementById('assign-slot-new-pilot-car');
        const contactInput = document.getElementById('assign-slot-new-pilot-contact');

        const newName = nameInput ? nameInput.value.trim() : '';
        if (!newName) {
            alert("Por favor escribe el nombre del nuevo piloto a inscribir.");
            if (nameInput) nameInput.focus();
            return;
        }

        const newCar = carInput ? carInput.value.trim() : 'BMW M3 GTR';
        const newContact = contactInput ? contactInput.value.trim() : '';

        // Registrar nuevo participante
        const createdParticipant = await registerNewChampionshipParticipant({
            name: newName,
            alias: newName,
            ride: newCar || 'BMW M3 GTR',
            contact: newContact || 'Registrado por Comisaría (Admin)',
            schedule: 'Horario Flexible',
            youtube: '',
            registeredAt: new Date().toISOString(),
            isRealUser: true
        });

        chosenPilotVal = String(createdParticipant.rank);
    } else {
        const pilotSelect = document.getElementById('assign-slot-pilot-select');
        if (!pilotSelect || !pilotSelect.value) {
            alert("Por favor selecciona un piloto de la lista.");
            return;
        }
        chosenPilotVal = pilotSelect.value;
    }

    // Actualizar valor en UI inmediata
    const targetSelect = document.getElementById(`grp-p${slotIdx}-${grpIdx}`);
    if (targetSelect) {
        targetSelect.value = chosenPilotVal;
    }

    // Actualizar en caché de semanas
    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    if (weekData && Array.isArray(weekData.groups) && weekData.groups[grpIdx]) {
        if (!Array.isArray(weekData.groups[grpIdx].pilots)) {
            weekData.groups[grpIdx].pilots = [1, 2, 3];
        }
        const parsedVal = (!isNaN(parseInt(chosenPilotVal, 10)) && !chosenPilotVal.startsWith('open'))
            ? parseInt(chosenPilotVal, 10)
            : chosenPilotVal;
        weekData.groups[grpIdx].pilots[slotIdx] = parsedVal;
    }

    // Guardar cambios del grupo y difundir a Firebase RTDB
    await saveChampionshipSingleGroup(grpIdx);

    // Re-renderizar grupos en admin para actualizar el visual
    renderChampionshipAdminGroups();

    closeAssignPilotToSlotModal();

    showToast(`✓ ¡Piloto asignado exitosamente a la Casilla #${slotIdx + 1} de ${weekData?.groups[grpIdx]?.name || `Grupo #${grpIdx + 1}`}!`, "success");
}

/**
 * Abre el modal dedicado para registrar un nuevo piloto al torneo.
 */
function openRegisterNewChampPilotModal(targetGrpIdx, targetSlotIdx) {
    const modal = document.getElementById('modal-register-new-champ-pilot');
    if (!modal) return;

    // Limpiar campos
    const nameInput = document.getElementById('reg-new-champ-pilot-name');
    const aliasInput = document.getElementById('reg-new-champ-pilot-alias');
    const carInput = document.getElementById('reg-new-champ-pilot-car');
    const contactInput = document.getElementById('reg-new-champ-pilot-contact');
    const applyAllCheck = document.getElementById('reg-new-champ-pilot-apply-all-weeks');

    if (nameInput) nameInput.value = '';
    if (aliasInput) aliasInput.value = '';
    if (carInput) carInput.value = 'BMW M3 GTR';
    if (contactInput) contactInput.value = '';
    if (applyAllCheck) applyAllCheck.checked = false;

    // Llenar select de grupos
    const grpSelect = document.getElementById('reg-new-champ-pilot-group-select');
    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    const groups = (weekData && Array.isArray(weekData.groups) && weekData.groups.length > 0)
        ? weekData.groups
        : getDefaultChampionshipGroups(currentChampAdminWeek);

    if (grpSelect) {
        let opts = `<option value="-1">-- No asignar aún (Solo registrar en lista de pilotos) --</option>`;
        groups.forEach((g, idx) => {
            const hasOpen = Array.isArray(g.pilots) && g.pilots.some(p => String(p).startsWith('open'));
            opts += `<option value="${idx}">${escapeHtml(g.name || `Grupo #${idx + 1}`)} ${hasOpen ? '🟢 [Plaza Libre]' : ''}</option>`;
        });
        grpSelect.innerHTML = opts;

        if (targetGrpIdx !== undefined && targetGrpIdx !== null && targetGrpIdx >= 0 && targetGrpIdx < groups.length) {
            grpSelect.value = String(targetGrpIdx);
        } else {
            grpSelect.value = "-1";
        }
    }

    onRegisterNewPilotGroupChanged(targetSlotIdx);

    modal.style.display = 'flex';
    if (nameInput) setTimeout(() => nameInput.focus(), 60);
}

function closeRegisterNewChampPilotModal() {
    const modal = document.getElementById('modal-register-new-champ-pilot');
    if (modal) modal.style.display = 'none';
}

function onRegisterNewPilotGroupChanged(preferredSlotIdx) {
    const grpSelect = document.getElementById('reg-new-champ-pilot-group-select');
    const slotSelect = document.getElementById('reg-new-champ-pilot-slot-select');
    if (!grpSelect || !slotSelect) return;

    const grpIdx = parseInt(grpSelect.value, 10);
    const defaultNumSlots = (currentChampAdminWeek >= 3) ? 4 : 3;
    if (grpIdx < 0 || isNaN(grpIdx)) {
        slotSelect.disabled = true;
        slotSelect.innerHTML = Array.from({ length: defaultNumSlots }, (_, i) => `<option value="${i}">Casilla #${i + 1}</option>`).join('');
        return;
    }

    slotSelect.disabled = false;
    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    const groups = (weekData && Array.isArray(weekData.groups) && weekData.groups.length > 0)
        ? weekData.groups
        : getDefaultChampionshipGroups(currentChampAdminWeek);
    const grp = groups[grpIdx] || { pilots: [1, 2, 3] };
    const pilots = Array.isArray(grp.pilots) ? grp.pilots : [1, 2, 3];
    const participants = getChampionshipParticipantsList();
    const blDrivers = getChampionshipDefaultDrivers();

    const numSlots = (currentChampAdminWeek >= 3 || pilots.length >= 4) ? 4 : 3;
    const slotIndices = Array.from({ length: Math.max(pilots.length, numSlots) }, (_, sIdx) => sIdx);

    slotSelect.innerHTML = slotIndices.map(sIdx => {
        const val = pilots[sIdx] !== undefined ? pilots[sIdx] : `open_${(grpIdx * 4) + sIdx + 1}`;
        const isOpen = String(val).startsWith('open');
        let label = `Casilla #${sIdx + 1}: `;
        if (isOpen) {
            const slotNum = String(val).replace('open_', '');
            label += `🟢 DISPONIBLE (Plaza #${slotNum})`;
        } else {
            const num = parseInt(val, 10);
            const pInfo = (!isNaN(num)) ? (participants.find(p => p.rank === num) || blDrivers.find(d => d.rank === num)) : null;
            const pName = pInfo ? (pInfo.alias || pInfo.name) : `#${val}`;
            label += `Reemplazar a ${pName}`;
        }
        return `<option value="${sIdx}">${label}</option>`;
    }).join('');

    if (preferredSlotIdx !== undefined && preferredSlotIdx !== null && preferredSlotIdx >= 0) {
        slotSelect.value = String(preferredSlotIdx);
    } else {
        const openIdx = pilots.findIndex(p => String(p).startsWith('open'));
        if (openIdx >= 0) {
            slotSelect.value = String(openIdx);
        }
    }
}

async function confirmRegisterNewChampPilot() {
    const nameInput = document.getElementById('reg-new-champ-pilot-name');
    const aliasInput = document.getElementById('reg-new-champ-pilot-alias');
    const carInput = document.getElementById('reg-new-champ-pilot-car');
    const contactInput = document.getElementById('reg-new-champ-pilot-contact');
    const grpSelect = document.getElementById('reg-new-champ-pilot-group-select');
    const slotSelect = document.getElementById('reg-new-champ-pilot-slot-select');
    const applyAllCheck = document.getElementById('reg-new-champ-pilot-apply-all-weeks');

    const name = nameInput ? nameInput.value.trim() : '';
    if (!name) {
        alert("Por favor escribe el nombre o nick del piloto a inscribir.");
        if (nameInput) nameInput.focus();
        return;
    }

    const alias = (aliasInput && aliasInput.value.trim()) ? aliasInput.value.trim() : name;
    const ride = (carInput && carInput.value.trim()) ? carInput.value.trim() : 'BMW M3 GTR';
    const contact = contactInput ? contactInput.value.trim() : '';
    const grpIdx = grpSelect ? parseInt(grpSelect.value, 10) : -1;
    const slotIdx = slotSelect ? parseInt(slotSelect.value, 10) : 0;
    const applyAll = applyAllCheck ? applyAllCheck.checked : false;

    // Verificar si ya existe un piloto con el mismo nombre
    const participants = getChampionshipParticipantsList();
    const exists = participants.some(p => 
        (p.name && p.name.toLowerCase() === name.toLowerCase()) || 
        (p.alias && p.alias.toLowerCase() === name.toLowerCase())
    );
    if (exists) {
        if (!confirm(`Ya existe un participante registrado con el nombre o alias "${name}". ¿Deseas inscribirlo de todos modos como nuevo registro?`)) {
            return;
        }
    }

    // 1. Inscribir piloto en la base de datos
    const newParticipant = await registerNewChampionshipParticipant({
        name: name,
        alias: alias,
        ride: ride,
        contact: contact || 'Registrado por Comisaría (Admin)',
        schedule: 'Horario Flexible',
        youtube: '',
        registeredAt: new Date().toISOString(),
        isRealUser: true
    });

    // 2. Si se eligió un grupo, asignarlo de inmediato
    if (grpIdx >= 0 && !isNaN(grpIdx)) {
        const weekData = getActiveChampWeekData(currentChampAdminWeek);
        if (weekData && Array.isArray(weekData.groups) && weekData.groups[grpIdx]) {
            if (!Array.isArray(weekData.groups[grpIdx].pilots)) {
                weekData.groups[grpIdx].pilots = [1, 2, 3];
            }
            weekData.groups[grpIdx].pilots[slotIdx] = newParticipant.rank;
        }

        if (applyAll) {
            for (let w = 1; w <= 4; w++) {
                const wData = getActiveChampWeekData(w);
                if (wData && Array.isArray(wData.groups) && wData.groups[grpIdx]) {
                    if (!Array.isArray(wData.groups[grpIdx].pilots)) {
                        wData.groups[grpIdx].pilots = [1, 2, 3];
                    }
                    wData.groups[grpIdx].pilots[slotIdx] = newParticipant.rank;
                }
            }
        }

        await persistChampionshipWeeksData(cachedChampWeeksData);
    }

    // 3. Refrescar interfaces
    renderChampionshipAdminGroups();
    renderChampionshipAdminGroupPills();
    renderChampionshipAdminChallenges();
    populateBlacklistPilotsDatalist();

    closeRegisterNewChampPilotModal();

    const assignedMsg = grpIdx >= 0 
        ? ` e integrado a la Casilla #${slotIdx + 1} del Grupo #${grpIdx + 1}` 
        : ` (disponible en la parrilla para grupos y desafíos)`;
    showToast(`✓ ¡Piloto "${newParticipant.alias}" inscrito exitosamente en el campeonato${assignedMsg}!`, "success");
}

function onGroupPilotSelectChanged(selectEl, grpIdx, slotIdx) {
    if (!selectEl) return;
    if (selectEl.value === '__register_new__') {
        openRegisterNewChampPilotModal(grpIdx, slotIdx);
        // Restaurar el select al piloto previo mientras se abre el modal
        const weekData = getActiveChampWeekData(currentChampAdminWeek);
        const grp = weekData?.groups?.[grpIdx];
        const currentP = grp?.pilots?.[slotIdx] !== undefined ? grp.pilots[slotIdx] : (grpIdx * 3 + slotIdx + 1);
        selectEl.value = String(currentP);
        return;
    }
    // Auto-actualizar el valor en memoria para la semana activa inmediatamente
    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    if (weekData && Array.isArray(weekData.groups) && weekData.groups[grpIdx]) {
        if (!Array.isArray(weekData.groups[grpIdx].pilots)) {
            weekData.groups[grpIdx].pilots = [grpIdx * 3 + 1, grpIdx * 3 + 2, grpIdx * 3 + 3];
        }
        const val = selectEl.value;
        const parsedVal = (!isNaN(parseInt(val, 10)) && !val.startsWith('open') && !val.startsWith('cpu_'))
            ? parseInt(val, 10)
            : val;
        weekData.groups[grpIdx].pilots[slotIdx] = parsedVal;
    }
}

function ensurePilotRegisteredByName(pilotName, car) {
    if (!pilotName || pilotName === 'Por disputar' || pilotName === '--:--.---') return;
    const clean = pilotName.trim();
    if (!clean) return;
    const participants = getChampionshipParticipantsList();
    const exists = participants.some(p => 
        (p.alias && p.alias.toLowerCase() === clean.toLowerCase()) || 
        (p.name && p.name.toLowerCase() === clean.toLowerCase())
    );
    if (!exists) {
        registerNewChampionshipParticipant({
            name: clean,
            alias: clean,
            ride: (car && car.trim()) ? car.trim() : "BMW M3 GTR",
            schedule: "Desafíos Semanales",
            contact: "Comisaría / Desafíos",
            youtube: "",
            registeredAt: new Date().toISOString(),
            isRealUser: true
        });
    }
}

/**
 * Abre el modal para eliminar un jugador del torneo
 */
function openDeleteChampPilotModal() {
    const modal = document.getElementById('modal-delete-champ-pilot');
    const select = document.getElementById('del-champ-pilot-select');
    const preview = document.getElementById('del-champ-pilot-preview');
    if (!modal || !select) return;

    // Obtener lista completa de pilotos
    const participants = getChampionshipParticipantsList() || [];
    const blDrivers = getChampionshipDefaultDrivers() || [];

    // Combinar sin duplicados
    const allPilotsMap = new Map();
    participants.forEach(p => {
        if (p && (p.alias || p.name)) {
            const key = (p.alias || p.name).toLowerCase();
            allPilotsMap.set(key, { ...p, isParticipant: true });
        }
    });
    blDrivers.forEach(d => {
        if (d && (d.alias || d.name)) {
            const key = (d.alias || d.name).toLowerCase();
            if (!allPilotsMap.has(key)) {
                allPilotsMap.set(key, { ...d, isOfficial: true });
            }
        }
    });

    const sortedPilots = Array.from(allPilotsMap.values()).sort((a, b) => {
        return (a.alias || a.name || '').localeCompare(b.alias || b.name || '');
    });

    select.innerHTML = '<option value="">-- Selecciona un jugador para eliminar --</option>' + 
        sortedPilots.map(p => {
            const name = p.alias || p.name;
            const rank = p.rank ? `#${p.rank}` : '';
            const car = p.ride || p.car || 'Vehículo';
            return `<option value="${escapeHtml(name)}" data-rank="${p.rank || ''}" data-car="${escapeHtml(car)}">${rank ? rank + ' - ' : ''}${escapeHtml(name)} (${escapeHtml(car)})</option>`;
        }).join('');

    if (preview) preview.style.display = 'none';
    modal.style.display = 'flex';
}

function closeDeleteChampPilotModal() {
    const modal = document.getElementById('modal-delete-champ-pilot');
    if (modal) modal.style.display = 'none';
}

function onDeletePilotSelectChanged() {
    const select = document.getElementById('del-champ-pilot-select');
    const preview = document.getElementById('del-champ-pilot-preview');
    const details = document.getElementById('del-champ-pilot-details');
    if (!select || !preview || !details) return;

    const val = select.value.trim();
    if (!val) {
        preview.style.display = 'none';
        return;
    }

    const participants = getChampionshipParticipantsList() || [];
    const blDrivers = getChampionshipDefaultDrivers() || [];
    const p = participants.find(x => (x.alias && x.alias.toLowerCase() === val.toLowerCase()) || (x.name && x.name.toLowerCase() === val.toLowerCase())) ||
              blDrivers.find(x => (x.alias && x.alias.toLowerCase() === val.toLowerCase()) || (x.name && x.name.toLowerCase() === val.toLowerCase())) ||
              { alias: val, ride: 'BMW M3 GTR', rank: 'N/A' };

    details.innerHTML = `
        <div><strong>Piloto:</strong> <span style="color: #f59e0b; font-weight: 700;">${escapeHtml(p.alias || p.name)}</span> ${p.rank ? `(Rango #${p.rank})` : ''}</div>
        <div><strong>Vehículo:</strong> ${escapeHtml(p.ride || p.car || 'Vehículo')}</div>
        ${p.totalScore !== undefined ? `<div><strong>Puntos en Torneo:</strong> ${p.totalScore} PTS</div>` : ''}
        ${p.rep ? `<div><strong>Recompensa REP:</strong> $${p.rep.toLocaleString('de-DE')}</div>` : ''}
    `;
    preview.style.display = 'block';
}

async function confirmDeleteChampPilot() {
    const select = document.getElementById('del-champ-pilot-select');
    const vacateCheck = document.getElementById('del-champ-pilot-vacate-slots');
    if (!select || !select.value) {
        alert("Por favor selecciona un jugador para eliminar.");
        return;
    }

    const pilotName = select.value.trim();
    const shouldVacate = vacateCheck ? vacateCheck.checked : true;

    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente a "${pilotName}" del campeonato?\n\nEsta acción eliminará su registro de participantes y liberará sus casillas en los grupos.`)) {
        return;
    }

    const btnConfirm = document.getElementById('btn-confirm-delete-champ-pilot');
    if (btnConfirm) {
        btnConfirm.disabled = true;
        btnConfirm.innerHTML = '⏳ Eliminando...';
    }

    try {
        const normName = pilotName.toLowerCase();
        let targetRank = null;

        // 1. Eliminar de registeredChampionshipParticipants
        if (Array.isArray(registeredChampionshipParticipants)) {
            const foundP = registeredChampionshipParticipants.find(p => 
                (p.alias && p.alias.toLowerCase() === normName) || 
                (p.name && p.name.toLowerCase() === normName)
            );
            if (foundP) targetRank = foundP.rank;
            registeredChampionshipParticipants = registeredChampionshipParticipants.filter(p => 
                !(p.alias && p.alias.toLowerCase() === normName) && 
                !(p.name && p.name.toLowerCase() === normName)
            );
            try {
                localStorage.setItem('nfs_championship_participants_v2', JSON.stringify(registeredChampionshipParticipants));
            } catch (e) {}
        }

        // 2. Eliminar de championshipOfficialDrivers
        if (Array.isArray(championshipOfficialDrivers)) {
            const foundD = championshipOfficialDrivers.find(d => 
                (d.alias && d.alias.toLowerCase() === normName) || 
                (d.name && d.name.toLowerCase() === normName)
            );
            if (foundD && !targetRank) targetRank = foundD.rank;
            championshipOfficialDrivers = championshipOfficialDrivers.filter(d => 
                !(d.alias && d.alias.toLowerCase() === normName) && 
                !(d.name && d.name.toLowerCase() === normName)
            );
            if (typeof window !== 'undefined') {
                window.DEFAULT_BLACKLIST_DRIVERS = championshipOfficialDrivers;
            }
            try {
                localStorage.setItem('nfs_blacklist_championship_2026_v5', JSON.stringify(championshipOfficialDrivers));
            } catch (e) {}
        }

        // 3. Liberar casillas en cachedChampWeeksData (Semanas 1 a 4) si shouldVacate
        if (shouldVacate && cachedChampWeeksData) {
            for (let w = 1; w <= 4; w++) {
                const wData = cachedChampWeeksData[w] || cachedChampWeeksData[String(w)];
                if (!wData) continue;

                // En grupos
                if (Array.isArray(wData.groups)) {
                    wData.groups.forEach((grp, gIdx) => {
                        if (Array.isArray(grp.pilots)) {
                            grp.pilots = grp.pilots.map((pVal, slotIdx) => {
                                const isMatch = (targetRank !== null && pVal === targetRank) ||
                                                (typeof pVal === 'string' && pVal.toLowerCase() === normName);
                                if (isMatch) {
                                    const numSlots = (w >= 3 || grp.pilots.length >= 4) ? 4 : 3;
                                    return `open_${(gIdx * numSlots) + slotIdx + 1}`;
                                }
                                return pVal;
                            });
                        }
                    });
                }

                // En desafíos (top3, groupsWinners, groupsResults)
                if (Array.isArray(wData.challenges)) {
                    wData.challenges.forEach(ch => {
                        const cleanList = (list) => {
                            if (!Array.isArray(list)) return;
                            list.forEach(entry => {
                                if (entry && entry.pilot && (entry.pilot.toLowerCase() === normName || (targetRank && entry.rank === targetRank))) {
                                    entry.pilot = 'Por disputar';
                                    entry.time = '--:--.---';
                                    entry.bonus = 0;
                                    entry.repMoney = 0;
                                    entry.badge = '0 PTS';
                                    entry.repBadge = '$0 REP';
                                }
                            });
                        };
                        cleanList(ch.top3);
                        if (ch.groupsWinners) Object.values(ch.groupsWinners).forEach(cleanList);
                        if (ch.groupsResults) Object.values(ch.groupsResults).forEach(cleanList);
                    });
                }
            }
        }

        // 4. Persistir cambios en semanas
        await persistChampionshipWeeksData(cachedChampWeeksData);

        // 5. Guardar actualización en Firebase RTDB
        try {
            const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) 
                ? window.NFS_FIREBASE.RTDB_URL 
                : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
            
            await Promise.all([
                fetch(`${baseUrl}/records/blacklist_championship_2026.json`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(championshipOfficialDrivers)
                }),
                fetch(`${baseUrl}/championship_participants.json`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registeredChampionshipParticipants)
                })
            ]);
        } catch (e) {
            console.warn("Aviso actualizando Firebase al eliminar piloto:", e);
        }

        // 6. Notificar a otras ventanas vía BroadcastChannel
        try {
            if (typeof BroadcastChannel !== 'undefined') {
                const bc = new BroadcastChannel('nfs_championship_sync');
                bc.postMessage({ type: 'DRIVER_DELETED', pilot: pilotName, timestamp: Date.now() });
                bc.close();
            }
        } catch (e) {}

        // 7. Refrescar UI en admin
        renderChampionshipAdminGroups();
        renderChampionshipAdminGroupPills();
        renderChampionshipAdminChallenges();
        populateBlacklistPilotsDatalist();

        closeDeleteChampPilotModal();
        showToast(`✓ ¡El jugador "${pilotName}" ha sido eliminado del torneo exitosamente!`, "success");
    } catch (err) {
        console.error("Error eliminando piloto:", err);
        showToast(`Error al eliminar piloto: ${err.message}`, "error");
    } finally {
        if (btnConfirm) {
            btnConfirm.disabled = false;
            btnConfirm.innerHTML = '🗑️ Confirmar Eliminación';
        }
    }
}

async function generateChampionshipRotations() {
    const week1Data = getActiveChampWeekData(1);
    if (!week1Data) {
        showToast("No se encontraron datos para la Semana 1.", "error");
        return;
    }

    let baseGroups = (currentChampAdminWeek === 1) ? getChampionshipGroupsFromUI() : week1Data.groups;
    if (!baseGroups || baseGroups.length === 0) {
        baseGroups = week1Data.groups || getDefaultChampionshipGroups(1);
    }

    const numGroups = baseGroups.length;
    if (numGroups < 2) {
        showToast("Se necesitan al menos 2 grupos para generar rotaciones.", "warning");
        return;
    }

    const confirmMsg = `¿Deseas generar automáticamente la rotación de grupos para las Semanas 2, 3 y 4 basándote en los ${numGroups} grupos de la Semana 1?\n\n• Se mantendrán los nombres de los grupos.\n• Los tríos de pilotos se rotarán de manera equilibrada para que cada semana enfrenten rivales distintos.\n• Los cambios se guardarán y sincronizarán inmediatamente con la web pública.`;
    if (!confirm(confirmMsg)) {
        return;
    }

    if (currentChampAdminWeek === 1) {
        week1Data.groups = baseGroups;
    }

    if (numGroups === 3) {
        const g0 = baseGroups[0].pilots || [1, 10, 3];
        const g1 = baseGroups[1].pilots || [4, 5, 6];
        const g2 = baseGroups[2].pilots || [7, 8, 9];

        const w2Data = getActiveChampWeekData(2);
        if (w2Data) {
            w2Data.groups = [
                { name: formatRotatedGroupName(baseGroups[0].name, "Grupo Alfa", "Velocidad Pura"), tag: baseGroups[0].tag || "🔥 TIER SUPREME", pilots: [g0[0], g1[1], g2[1]] },
                { name: formatRotatedGroupName(baseGroups[1].name, "Grupo Beta", "Duelo Callejero"), tag: baseGroups[1].tag || "⚡ TIER HIGH", pilots: [g0[1], g1[2], g2[2]] },
                { name: formatRotatedGroupName(baseGroups[2].name, "Grupo Gama", "Fuerza & Asfalto"), tag: baseGroups[2].tag || "⚔️ TIER MID-HIGH", pilots: [g0[2], g1[0], g2[0]] }
            ];
        }

        const w3Data = getActiveChampWeekData(3);
        if (w3Data) {
            w3Data.groups = [
                { name: formatRotatedGroupName(baseGroups[0].name, "Grupo Alfa", "Cruce de Titanes"), tag: baseGroups[0].tag || "🔥 TIER SUPREME", pilots: [g0[0], g1[2], g2[0]] },
                { name: formatRotatedGroupName(baseGroups[1].name, "Grupo Beta", "Duelo de Élite"), tag: baseGroups[1].tag || "⚡ TIER HIGH", pilots: [g0[1], g1[0], g2[1]] },
                { name: formatRotatedGroupName(baseGroups[2].name, "Grupo Gama", "Guerra de Caballos"), tag: baseGroups[2].tag || "⚔️ TIER MID-HIGH", pilots: [g0[2], g1[1], g2[2]] }
            ];
        }

        const w4Data = getActiveChampWeekData(4);
        if (w4Data) {
            w4Data.groups = [
                { name: formatRotatedGroupName(baseGroups[0].name, "Grupo Alfa", "Gran Final • Corona"), tag: "👑 CHAMPIONSHIP", pilots: [g0[0], g1[0], g2[2]] },
                { name: formatRotatedGroupName(baseGroups[1].name, "Grupo Beta", "Duelo por el Podio"), tag: "🥈 PODIUM RACE", pilots: [g0[1], g1[1], g2[0]] },
                { name: formatRotatedGroupName(baseGroups[2].name, "Grupo Gama", "Batalla de Honor"), tag: "⚔️ TOP HONORS", pilots: [g0[2], g1[2], g2[1]] }
            ];
        }
    } else {
        const tier0 = baseGroups.map(g => g.pilots[0]);
        const tier1 = baseGroups.map(g => g.pilots[1]);
        const tier2 = baseGroups.map(g => g.pilots[2]);

        for (let w = 2; w <= 4; w++) {
            const wObj = getActiveChampWeekData(w);
            if (!wObj) continue;
            const shift1 = (w - 1) % numGroups;
            const shift2 = ((w - 1) * 2) % numGroups;

            wObj.groups = baseGroups.map((bg, gIdx) => ({
                name: bg.name,
                tag: bg.tag || "TIER OFICIAL",
                pilots: [
                    tier0[gIdx],
                    tier1[(gIdx + shift1) % numGroups],
                    tier2[(gIdx + shift2) % numGroups]
                ]
            }));
        }
    }

    renderChampionshipAdminGroups();
    renderChampionshipAdminGroupPills();
    renderChampionshipAdminChallenges();

    showToast("💾 Guardando rotación de grupos en todas las semanas...", "info");
    const ok = await persistChampionshipWeeksData(cachedChampWeeksData);
    if (ok) {
        showToast("✓ ¡Rotación automática para Semanas 2, 3 y 4 generada y sincronizada con éxito!", "success");
    } else {
        showToast("✓ Rotación generada y guardada en memoria local.", "info");
    }
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

    const isWeek4Slots = (currentChampAdminWeek >= 3);
    if (!challenges || challenges.length === 0) {
        challenges = Array.from({ length: 8 }, (_, idx) => {
            const defTop = [
                { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 400000, repBadge: "💰 $400.000 REP" },
                { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 250000, repBadge: "💰 $250.000 REP" },
                { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 120000, repBadge: "💰 $120.000 REP" }
            ];
            if (isWeek4Slots) {
                defTop.push({ rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 10, badge: "🔩 +10 PTS", repMoney: 80000, repBadge: "💰 $80.000 REP" });
            }
            return {
                id: `w${currentChampAdminWeek}-ch${idx+1}`,
                route: `Pista Oficial #${idx+1}`,
                type: "Circuito",
                carRestriction: "Libre / Stock",
                top3: defTop
            };
        });
    }

    const groups = (weekData && Array.isArray(weekData.groups) && weekData.groups.length > 0)
        ? weekData.groups
        : getDefaultChampionshipGroups(currentChampAdminWeek);

    if (currentChampAdminGroup >= groups.length) {
        currentChampAdminGroup = 0;
    }

    const grp = groups[currentChampAdminGroup] || groups[0] || { name: 'Grupo Alfa', pilots: [1, 2, 3] };
    const grpName = grp.name || `Grupo #${currentChampAdminGroup + 1}`;
    const grpPilotsRanks = Array.isArray(grp.pilots) ? grp.pilots : [currentChampAdminGroup * 3 + 1, currentChampAdminGroup * 3 + 2, currentChampAdminGroup * 3 + 3];
    const grpPilots = grpPilotsRanks.map(r => getChampionshipDriverByRank(r));

    container.innerHTML = challenges.map((ch, idx) => {
        let top3 = null;
        if (ch.groupsWinners && ch.groupsWinners[currentChampAdminGroup]) {
            top3 = ch.groupsWinners[currentChampAdminGroup];
        } else if (ch.groupsWinners && ch.groupsWinners[grpName]) {
            top3 = ch.groupsWinners[grpName];
        } else if (ch.groupsResults && ch.groupsResults[grpName]) {
            top3 = ch.groupsResults[grpName];
        } else if (ch.groupsResults && ch.groupsResults[currentChampAdminGroup]) {
            top3 = ch.groupsResults[currentChampAdminGroup];
        } else if (currentChampAdminGroup === 0 && Array.isArray(ch.top3) && ch.top3.length > 0) {
            top3 = ch.top3;
        }

        const isWeek4 = (currentChampAdminWeek >= 3 || (top3 && top3.length >= 4) || (grpPilots && grpPilots.length >= 4));
        const minLen = isWeek4 ? 4 : 3;
        if (!top3 || !Array.isArray(top3) || top3.length < minLen) {
            top3 = [
                { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 400000, repBadge: "💰 $400.000 REP" },
                { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 250000, repBadge: "💰 $250.000 REP" },
                { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 120000, repBadge: "💰 $120.000 REP" }
            ];
            if (isWeek4) {
                top3.push({ rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 10, badge: "🔩 +10 PTS", repMoney: 80000, repBadge: "💰 $80.000 REP" });
            }
        }
        if (isWeek4 && top3.length < 4) {
            top3.push({ rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 10, badge: "🔩 +10 PTS", repMoney: 80000, repBadge: "💰 $80.000 REP" });
        }

        const g1 = top3[0] || {};
        const g2 = top3[1] || {};
        const g3 = top3[2] || {};
        const g4 = top3[3] || {};

        return `
            <div class="admin-challenge-card" id="champ-admin-ch-${idx}">
                <!-- Cabecera Superior del Desafío con Botón de Guardado Individual -->
                <div class="admin-challenge-card-header">
                    <div class="admin-challenge-title-group">
                        <span class="admin-challenge-badge-num">#0${idx + 1}</span>
                        <span style="font-family: var(--font-heading); font-size: 14.5px; font-weight: 800; color: #ffffff;">
                            DESAFÍO SEMANAL #${idx + 1} // ${escapeHtml(grpName.toUpperCase())}
                        </span>
                        <span class="status-badge" style="font-size: 10px; padding: 3px 8px; background: rgba(255,119,0,0.15); color: var(--nfs-orange); border: 1px solid rgba(255,119,0,0.4);">
                            SEMANA ${currentChampAdminWeek} • ${escapeHtml(grpName)}
                        </span>
                    </div>
                    <div class="admin-challenge-actions">
                        <button type="button" class="admin-btn admin-btn-xs" onclick="saveChampionshipSingleChallenge(${idx})" 
                            style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-weight: 700; border: none; box-shadow: 0 2px 6px rgba(16,185,129,0.35); padding: 5px 12px; font-size: 11px; border-radius: 5px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;"
                            title="Guardar este desafío individual para ${escapeHtml(grpName)}">
                            💾 Guardar Desafío #${idx + 1} (${escapeHtml(grpName)})
                        </button>
                        <button type="button" class="admin-btn admin-btn-xs admin-btn-outline" onclick="resetChampionshipSingleChallenge(${idx})"
                            style="padding: 5px 10px; font-size: 11px; border-color: rgba(255,255,255,0.2); color: var(--text-muted);"
                            title="Restablecer este desafío a sus valores predeterminados">
                            ↺ Resetear
                        </button>
                    </div>
                </div>

                <!-- Fila de Metadatos del Desafío (Circuito, Tipo, Auto Restrictivo) -->
                <div class="admin-challenge-meta-row">
                    <div>
                        <label class="admin-field-label">🏁 Circuito / Ruta Oficial</label>
                        <input type="text" id="ch-route-${idx}" list="bl-routes-datalist" class="admin-form-input" style="font-weight: 700; font-family: var(--font-heading); color: #ffffff; width: 100%;" value="${escapeHtml(ch.route || '')}" placeholder="Selecciona o escribe el circuito...">
                    </div>
                    <div>
                        <label class="admin-field-label">🏎️ Tipo de Carrera</label>
                        <select id="ch-type-${idx}" class="admin-form-input" style="width: 100%; font-weight: 700;">
                            <option value="Circuito" ${ch.type === 'Circuito' ? 'selected' : ''}>Circuito</option>
                            <option value="Sprint" ${ch.type === 'Sprint' ? 'selected' : ''}>Sprint</option>
                            <option value="Drag" ${ch.type === 'Drag' ? 'selected' : ''}>Drag</option>
                        </select>
                    </div>
                    <div>
                        <label class="admin-field-label">🚗 Auto Restrictivo</label>
                        <input type="text" id="ch-car-${idx}" class="admin-form-input" style="width: 100%; font-weight: 700; color: var(--nfs-orange);" value="${escapeHtml(ch.carRestriction || '')}" placeholder="Ej: BMW M3 GTR / Stock / Libre">
                    </div>
                </div>

                <!-- Casillas de Ganadores: Oro, Silver, Bronce y Zinc para este Grupo -->
                <div class="admin-winners-grid">
                    <!-- Ganador Oro (1° Puesto) -->
                    <div class="admin-winner-box admin-winner-gold">
                        <div class="admin-winner-header">
                            <span style="color: #fbbf24; font-weight: 800; font-size: 12px;">🥇 GANADOR ORO (1° PUESTO)</span>
                            <span style="color: var(--nfs-orange); font-size: 11px; font-weight: 700;">+${(g1.bonus !== undefined && g1.bonus !== null && g1.bonus !== '') ? g1.bonus : 100} PTS</span>
                        </div>
                        <div style="display: flex; gap: 4px; align-items: center; margin-bottom: 2px; flex-wrap: wrap;">
                            <span style="font-size: 10px; color: var(--text-muted); font-weight: 700;">⚡ Asignar:</span>
                            ${grpPilots.map(p => `
                                <button type="button" class="admin-winner-quick-chip" onclick="quickAssignPilotToWinner(${idx}, 1, '${escapeHtml(p.alias)}', '${escapeHtml(p.ride)}')">
                                    ${escapeHtml(p.alias)}
                                </button>
                            `).join('')}
                        </div>
                        <div>
                            <label class="admin-field-label">Piloto Ganador</label>
                            <input type="text" id="ch-p1-pilot-${idx}" list="bl-pilots-datalist" class="admin-form-input" style="font-weight: 700;" value="${escapeHtml(g1.pilot === 'Por disputar' ? '' : (g1.pilot || ''))}" placeholder="Nombre o Nick del Piloto">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <div>
                                <label class="admin-field-label">Auto Utilizado</label>
                                <input type="text" id="ch-p1-car-${idx}" class="admin-form-input" value="${escapeHtml(g1.car || '')}" placeholder="Vehículo">
                            </div>
                            <div>
                                <label class="admin-field-label">Tiempo (mm:ss.ddd)</label>
                                <input type="text" id="ch-p1-time-${idx}" class="admin-form-input" style="font-family: var(--font-mono); font-weight: 700; color: #fbbf24;" maxlength="9" oninput="applyRaceTimeMask(this)" value="${escapeHtml(isZeroOrNullTime(g1.time) ? '' : (g1.time || ''))}" placeholder="01:14.230">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <div>
                                <label class="admin-field-label">Bono Puntos</label>
                                <input type="number" id="ch-p1-bonus-${idx}" class="admin-form-input" min="0" value="${(g1.bonus !== undefined && g1.bonus !== null && g1.bonus !== '') ? g1.bonus : 100}" placeholder="0">
                            </div>
                            <div>
                                <label class="admin-field-label">Recompensa REP ($)</label>
                                <input type="number" id="ch-p1-rep-${idx}" class="admin-form-input" min="0" value="${(g1.repMoney !== undefined && g1.repMoney !== null && g1.repMoney !== '') ? g1.repMoney : 400000}" placeholder="0">
                            </div>
                        </div>
                    </div>

                    <!-- Ganador Silver (2° Puesto) -->
                    <div class="admin-winner-box admin-winner-silver">
                        <div class="admin-winner-header">
                            <span style="color: #e2e8f0; font-weight: 800; font-size: 12px;">🥈 GANADOR SILVER (2° PUESTO)</span>
                            <span style="color: var(--nfs-orange); font-size: 11px; font-weight: 700;">+${(g2.bonus !== undefined && g2.bonus !== null && g2.bonus !== '') ? g2.bonus : 50} PTS</span>
                        </div>
                        <div style="display: flex; gap: 4px; align-items: center; margin-bottom: 2px; flex-wrap: wrap;">
                            <span style="font-size: 10px; color: var(--text-muted); font-weight: 700;">⚡ Asignar:</span>
                            ${grpPilots.map(p => `
                                <button type="button" class="admin-winner-quick-chip" onclick="quickAssignPilotToWinner(${idx}, 2, '${escapeHtml(p.alias)}', '${escapeHtml(p.ride)}')">
                                    ${escapeHtml(p.alias)}
                                </button>
                            `).join('')}
                        </div>
                        <div>
                            <label class="admin-field-label">Piloto Segundo</label>
                            <input type="text" id="ch-p2-pilot-${idx}" list="bl-pilots-datalist" class="admin-form-input" style="font-weight: 700;" value="${escapeHtml(g2.pilot === 'Por disputar' ? '' : (g2.pilot || ''))}" placeholder="Nombre o Nick del Piloto">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <div>
                                <label class="admin-field-label">Auto Utilizado</label>
                                <input type="text" id="ch-p2-car-${idx}" class="admin-form-input" value="${escapeHtml(g2.car || '')}" placeholder="Vehículo">
                            </div>
                            <div>
                                <label class="admin-field-label">Tiempo (mm:ss.ddd)</label>
                                <input type="text" id="ch-p2-time-${idx}" class="admin-form-input" style="font-family: var(--font-mono); font-weight: 700; color: #e2e8f0;" maxlength="9" oninput="applyRaceTimeMask(this)" value="${escapeHtml(isZeroOrNullTime(g2.time) ? '' : (g2.time || ''))}" placeholder="01:16.890">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <div>
                                <label class="admin-field-label">Bono Puntos</label>
                                <input type="number" id="ch-p2-bonus-${idx}" class="admin-form-input" min="0" value="${(g2.bonus !== undefined && g2.bonus !== null && g2.bonus !== '') ? g2.bonus : 50}" placeholder="0">
                            </div>
                            <div>
                                <label class="admin-field-label">Recompensa REP ($)</label>
                                <input type="number" id="ch-p2-rep-${idx}" class="admin-form-input" min="0" value="${(g2.repMoney !== undefined && g2.repMoney !== null && g2.repMoney !== '') ? g2.repMoney : 250000}" placeholder="0">
                            </div>
                        </div>
                    </div>

                    <!-- Ganador Bronce (3° Puesto) -->
                    <div class="admin-winner-box admin-winner-bronze">
                        <div class="admin-winner-header">
                            <span style="color: #fdba74; font-weight: 800; font-size: 12px;">🥉 GANADOR BRONCE (3° PUESTO)</span>
                            <span style="color: var(--nfs-orange); font-size: 11px; font-weight: 700;">+${(g3.bonus !== undefined && g3.bonus !== null && g3.bonus !== '') ? g3.bonus : 20} PTS</span>
                        </div>
                        <div style="display: flex; gap: 4px; align-items: center; margin-bottom: 2px; flex-wrap: wrap;">
                            <span style="font-size: 10px; color: var(--text-muted); font-weight: 700;">⚡ Asignar:</span>
                            ${grpPilots.map(p => `
                                <button type="button" class="admin-winner-quick-chip" onclick="quickAssignPilotToWinner(${idx}, 3, '${escapeHtml(p.alias)}', '${escapeHtml(p.ride)}')">
                                    ${escapeHtml(p.alias)}
                                </button>
                            `).join('')}
                        </div>
                        <div>
                            <label class="admin-field-label">Piloto Tercero</label>
                            <input type="text" id="ch-p3-pilot-${idx}" list="bl-pilots-datalist" class="admin-form-input" style="font-weight: 700;" value="${escapeHtml(g3.pilot === 'Por disputar' ? '' : (g3.pilot || ''))}" placeholder="Nombre o Nick del Piloto">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <div>
                                <label class="admin-field-label">Auto Utilizado</label>
                                <input type="text" id="ch-p3-car-${idx}" class="admin-form-input" value="${escapeHtml(g3.car || '')}" placeholder="Vehículo">
                            </div>
                            <div>
                                <label class="admin-field-label">Tiempo (mm:ss.ddd)</label>
                                <input type="text" id="ch-p3-time-${idx}" class="admin-form-input" style="font-family: var(--font-mono); font-weight: 700; color: #fdba74;" maxlength="9" oninput="applyRaceTimeMask(this)" value="${escapeHtml(isZeroOrNullTime(g3.time) ? '' : (g3.time || ''))}" placeholder="01:19.450">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <div>
                                <label class="admin-field-label">Bono Puntos</label>
                                <input type="number" id="ch-p3-bonus-${idx}" class="admin-form-input" min="0" value="${(g3.bonus !== undefined && g3.bonus !== null && g3.bonus !== '') ? g3.bonus : 20}" placeholder="0">
                            </div>
                            <div>
                                <label class="admin-field-label">Recompensa REP ($)</label>
                                <input type="number" id="ch-p3-rep-${idx}" class="admin-form-input" min="0" value="${(g3.repMoney !== undefined && g3.repMoney !== null && g3.repMoney !== '') ? g3.repMoney : 120000}" placeholder="0">
                            </div>
                        </div>
                    </div>

                    ${isWeek4 ? `
                    <!-- Ganador Zinc / Aluminio (4° Puesto) -->
                    <div class="admin-winner-box admin-winner-zinc">
                        <div class="admin-winner-header">
                            <span style="color: #94a3b8; font-weight: 800; font-size: 12px;">🔩 GANADOR ZINC / ALUMINIO (4° PUESTO)</span>
                            <span style="color: var(--nfs-orange); font-size: 11px; font-weight: 700;">+${(g4.bonus !== undefined && g4.bonus !== null && g4.bonus !== '') ? g4.bonus : 10} PTS</span>
                        </div>
                        <div style="display: flex; gap: 4px; align-items: center; margin-bottom: 2px; flex-wrap: wrap;">
                            <span style="font-size: 10px; color: var(--text-muted); font-weight: 700;">⚡ Asignar:</span>
                            ${grpPilots.map(p => `
                                <button type="button" class="admin-winner-quick-chip" onclick="quickAssignPilotToWinner(${idx}, 4, '${escapeHtml(p.alias)}', '${escapeHtml(p.ride)}')">
                                    ${escapeHtml(p.alias)}
                                </button>
                            `).join('')}
                        </div>
                        <div>
                            <label class="admin-field-label">Piloto Cuarto</label>
                            <input type="text" id="ch-p4-pilot-${idx}" list="bl-pilots-datalist" class="admin-form-input" style="font-weight: 700;" value="${escapeHtml(g4.pilot === 'Por disputar' ? '' : (g4.pilot || ''))}" placeholder="Nombre o Nick del Piloto">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <div>
                                <label class="admin-field-label">Auto Utilizado</label>
                                <input type="text" id="ch-p4-car-${idx}" class="admin-form-input" value="${escapeHtml(g4.car || '')}" placeholder="Vehículo">
                            </div>
                            <div>
                                <label class="admin-field-label">Tiempo (mm:ss.ddd)</label>
                                <input type="text" id="ch-p4-time-${idx}" class="admin-form-input" style="font-family: var(--font-mono); font-weight: 700; color: #94a3b8;" maxlength="9" oninput="applyRaceTimeMask(this)" value="${escapeHtml(isZeroOrNullTime(g4.time) ? '' : (g4.time || ''))}" placeholder="01:21.100">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <div>
                                <label class="admin-field-label">Bono Puntos</label>
                                <input type="number" id="ch-p4-bonus-${idx}" class="admin-form-input" min="0" value="${(g4.bonus !== undefined && g4.bonus !== null && g4.bonus !== '') ? g4.bonus : 10}" placeholder="0">
                            </div>
                            <div>
                                <label class="admin-field-label">Recompensa REP ($)</label>
                                <input type="number" id="ch-p4-rep-${idx}" class="admin-form-input" min="0" value="${(g4.repMoney !== undefined && g4.repMoney !== null && g4.repMoney !== '') ? g4.repMoney : 80000}" placeholder="0">
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>

                <!-- Barra inferior de guardado rápido -->
                <div style="display: flex; justify-content: flex-end; align-items: center; gap: 8px; margin-top: 4px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.04);">
                    <span style="font-size: 10.5px; color: var(--text-muted); margin-right: auto;">Desafío #${idx + 1} de la Semana ${currentChampAdminWeek} • ${escapeHtml(grpName)}</span>
                    <button type="button" class="admin-btn admin-btn-xs" onclick="saveChampionshipSingleChallenge(${idx})" 
                        style="background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.5); color: #6ee7b7; padding: 4px 10px; font-size: 11px; border-radius: 4px; cursor: pointer;">
                        💾 Guardar Cambios (${escapeHtml(grpName)})
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function getChampionshipChallengeFromUI(idx) {
    const routeEl = document.getElementById(`ch-route-${idx}`);
    const typeEl = document.getElementById(`ch-type-${idx}`);
    const carEl = document.getElementById(`ch-car-${idx}`);

    const parseBonusInput = (rawVal) => {
        if (rawVal === undefined || rawVal === null) return 0;
        const s = String(rawVal).trim();
        if (s === '' || s === '0') return 0;
        const n = parseInt(s, 10);
        return (!isNaN(n) && n >= 1) ? n : 0;
    };

    const parseRepInput = (rawVal) => {
        if (rawVal === undefined || rawVal === null) return 0;
        const s = String(rawVal).trim();
        if (s === '' || s === '0') return 0;
        const n = parseInt(s, 10);
        return (!isNaN(n) && n >= 1) ? n : 0;
    };

    const p1Pilot = document.getElementById(`ch-p1-pilot-${idx}`)?.value.trim() || 'Por disputar';
    const p1Car = document.getElementById(`ch-p1-car-${idx}`)?.value.trim() || '';
    const p1TimeRaw = (document.getElementById(`ch-p1-time-${idx}`)?.value || '').trim();
    const p1Time = p1TimeRaw ? p1TimeRaw : '--:--.---';
    const p1BonusRaw = document.getElementById(`ch-p1-bonus-${idx}`)?.value;
    const p1Bonus = parseBonusInput(p1BonusRaw);
    const p1RepRaw = document.getElementById(`ch-p1-rep-${idx}`)?.value;
    const p1Rep = parseRepInput(p1RepRaw);

    const p2Pilot = document.getElementById(`ch-p2-pilot-${idx}`)?.value.trim() || 'Por disputar';
    const p2Car = document.getElementById(`ch-p2-car-${idx}`)?.value.trim() || '';
    const p2TimeRaw = (document.getElementById(`ch-p2-time-${idx}`)?.value || '').trim();
    const p2Time = p2TimeRaw ? p2TimeRaw : '--:--.---';
    const p2BonusRaw = document.getElementById(`ch-p2-bonus-${idx}`)?.value;
    const p2Bonus = parseBonusInput(p2BonusRaw);
    const p2RepRaw = document.getElementById(`ch-p2-rep-${idx}`)?.value;
    const p2Rep = parseRepInput(p2RepRaw);

    const p3Pilot = document.getElementById(`ch-p3-pilot-${idx}`)?.value.trim() || 'Por disputar';
    const p3Car = document.getElementById(`ch-p3-car-${idx}`)?.value.trim() || '';
    const p3TimeRaw = (document.getElementById(`ch-p3-time-${idx}`)?.value || '').trim();
    const p3Time = p3TimeRaw ? p3TimeRaw : '--:--.---';
    const p3BonusRaw = document.getElementById(`ch-p3-bonus-${idx}`)?.value;
    const p3Bonus = parseBonusInput(p3BonusRaw);
    const p3RepRaw = document.getElementById(`ch-p3-rep-${idx}`)?.value;
    const p3Rep = parseRepInput(p3RepRaw);

    const winners = [
        {
            pilot: p1Pilot,
            car: p1Car,
            time: p1Time,
            bonus: p1Bonus,
            badge: p1Bonus > 0 ? `🥇 +${p1Bonus} PTS` : '0 PTS',
            repMoney: p1Rep,
            repBadge: p1Rep > 0 ? `💰 $${p1Rep.toLocaleString('de-DE')} REP` : '$0 REP'
        },
        {
            pilot: p2Pilot,
            car: p2Car,
            time: p2Time,
            bonus: p2Bonus,
            badge: p2Bonus > 0 ? `🥈 +${p2Bonus} PTS` : '0 PTS',
            repMoney: p2Rep,
            repBadge: p2Rep > 0 ? `💰 $${p2Rep.toLocaleString('de-DE')} REP` : '$0 REP'
        },
        {
            pilot: p3Pilot,
            car: p3Car,
            time: p3Time,
            bonus: p3Bonus,
            badge: p3Bonus > 0 ? `🥉 +${p3Bonus} PTS` : '0 PTS',
            repMoney: p3Rep,
            repBadge: p3Rep > 0 ? `💰 $${p3Rep.toLocaleString('de-DE')} REP` : '$0 REP'
        }
    ];

    const p4PilotEl = document.getElementById(`ch-p4-pilot-${idx}`);
    if (p4PilotEl || currentChampAdminWeek >= 3) {
        const p4Pilot = p4PilotEl?.value.trim() || 'Por disputar';
        const p4Car = document.getElementById(`ch-p4-car-${idx}`)?.value.trim() || '';
        const p4TimeRaw = (document.getElementById(`ch-p4-time-${idx}`)?.value || '').trim();
        const p4Time = p4TimeRaw ? p4TimeRaw : '--:--.---';
        const p4BonusRaw = document.getElementById(`ch-p4-bonus-${idx}`)?.value;
        const p4Bonus = parseBonusInput(p4BonusRaw);
        const p4RepRaw = document.getElementById(`ch-p4-rep-${idx}`)?.value;
        const p4Rep = parseRepInput(p4RepRaw);

        winners.push({
            pilot: p4Pilot,
            car: p4Car,
            time: p4Time,
            bonus: p4Bonus,
            badge: p4Bonus > 0 ? `🔩 +${p4Bonus} PTS` : '0 PTS',
            repMoney: p4Rep,
            repBadge: p4Rep > 0 ? `💰 $${p4Rep.toLocaleString('de-DE')} REP` : '$0 REP'
        });
    }

    return {
        id: `w${currentChampAdminWeek}-ch${idx + 1}`,
        route: routeEl ? routeEl.value.trim() : `Pista Oficial #${idx + 1}`,
        type: typeEl ? typeEl.value : 'Circuito',
        carRestriction: carEl ? carEl.value.trim() : 'Libre / Stock',
        top3: winners
    };
}

async function saveChampionshipSingleChallenge(idx) {
    const chData = getChampionshipChallengeFromUI(idx);
    if (chData.top3 && Array.isArray(chData.top3)) {
        chData.top3.forEach(t => {
            if (t && t.pilot) ensurePilotRegisteredByName(t.pilot, t.car);
        });
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
    const weekData = cachedChampWeeksData[currentChampAdminWeek] || cachedChampWeeksData[String(currentChampAdminWeek)];
    if (!weekData.challenges) weekData.challenges = [];
    if (!weekData.challenges[idx]) {
        weekData.challenges[idx] = {
            id: `w${currentChampAdminWeek}-ch${idx + 1}`,
            route: chData.route,
            type: chData.type,
            carRestriction: chData.carRestriction
        };
    }

    const targetCh = weekData.challenges[idx];
    targetCh.route = chData.route;
    targetCh.type = chData.type;
    targetCh.carRestriction = chData.carRestriction;

    const grp = (weekData.groups && weekData.groups[currentChampAdminGroup]) || { name: `Grupo #${currentChampAdminGroup + 1}` };
    const grpName = grp.name || `Grupo #${currentChampAdminGroup + 1}`;

    if (!targetCh.groupsWinners) targetCh.groupsWinners = {};
    targetCh.groupsWinners[currentChampAdminGroup] = chData.top3;
    targetCh.groupsWinners[grpName] = chData.top3;

    if (!targetCh.groupsResults) targetCh.groupsResults = {};
    targetCh.groupsResults[grpName] = chData.top3;
    targetCh.groupsResults[currentChampAdminGroup] = chData.top3;

    if (currentChampAdminGroup === 0) {
        targetCh.top3 = chData.top3;
    }

    showToast(`💾 Guardando Desafío #${idx + 1} para ${grpName}...`, "info");
    const ok = await persistChampionshipWeeksData(cachedChampWeeksData);
    if (ok) {
        showToast(`✓ ¡Desafío #${idx + 1} (${targetCh.route}) de ${grpName} guardado y sincronizado con la web!`, "success");
    } else {
        showToast(`✓ ¡Desafío #${idx + 1} guardado en caché local!`, "info");
    }
}

async function saveChampionshipAllChallenges() {
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
    if (!weekData.challenges) weekData.challenges = [];

    const grp = (weekData.groups && weekData.groups[currentChampAdminGroup]) || { name: `Grupo #${currentChampAdminGroup + 1}` };
    const grpName = grp.name || `Grupo #${currentChampAdminGroup + 1}`;

    for (let idx = 0; idx < 8; idx++) {
        const chData = getChampionshipChallengeFromUI(idx);
        if (chData.top3 && Array.isArray(chData.top3)) {
            chData.top3.forEach(t => {
                if (t && t.pilot) ensurePilotRegisteredByName(t.pilot, t.car);
            });
        }
        if (!weekData.challenges[idx]) {
            weekData.challenges[idx] = {
                id: `w${currentChampAdminWeek}-ch${idx + 1}`,
                route: chData.route,
                type: chData.type,
                carRestriction: chData.carRestriction
            };
        }
        const targetCh = weekData.challenges[idx];
        targetCh.route = chData.route;
        targetCh.type = chData.type;
        targetCh.carRestriction = chData.carRestriction;

        if (!targetCh.groupsWinners) targetCh.groupsWinners = {};
        targetCh.groupsWinners[currentChampAdminGroup] = chData.top3;
        targetCh.groupsWinners[grpName] = chData.top3;

        if (!targetCh.groupsResults) targetCh.groupsResults = {};
        targetCh.groupsResults[grpName] = chData.top3;
        targetCh.groupsResults[currentChampAdminGroup] = chData.top3;

        if (currentChampAdminGroup === 0) {
            targetCh.top3 = chData.top3;
        }
    }

    showToast(`💾 Guardando los 8 desafíos de ${grpName} (Semana ${currentChampAdminWeek})...`, "info");
    const ok = await persistChampionshipWeeksData(cachedChampWeeksData);
    if (ok) {
        showToast(`✓ ¡Los 8 desafíos de ${grpName} (Semana ${currentChampAdminWeek}) guardados y sincronizados con la web!`, "success");
    } else {
        showToast(`✓ ¡Desafíos guardados en caché local!`, "info");
    }
}

function resetChampionshipSingleChallenge(idx) {
    const defaults = getChampionshipDefaultWeeksData();
    const defWeek = defaults ? (defaults[currentChampAdminWeek] || defaults[String(currentChampAdminWeek)]) : null;
    const defCh = defWeek && defWeek.challenges && defWeek.challenges[idx] ? defWeek.challenges[idx] : null;

    const weekData = getActiveChampWeekData(currentChampAdminWeek);
    const groups = (weekData && Array.isArray(weekData.groups) && weekData.groups.length > 0)
        ? weekData.groups
        : getDefaultChampionshipGroups(currentChampAdminWeek);
    const grp = groups[currentChampAdminGroup] || groups[0] || { name: `Grupo #${currentChampAdminGroup + 1}` };
    const grpName = grp.name || `Grupo #${currentChampAdminGroup + 1}`;

    if (!confirm(`¿Restablecer el Desafío #${idx + 1} de ${grpName} a sus valores predeterminados?`)) return;

    if (weekData && weekData.challenges && weekData.challenges[idx]) {
        const targetCh = weekData.challenges[idx];
        let defaultTop3 = (defCh && Array.isArray(defCh.top3)) ? defCh.top3 : [
            { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 100, badge: "🥇 +100 PTS", repMoney: 400000, repBadge: "💰 $400.000 REP" },
            { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 50, badge: "🥈 +50 PTS", repMoney: 250000, repBadge: "💰 $250.000 REP" },
            { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20, badge: "🥉 +20 PTS", repMoney: 120000, repBadge: "💰 $120.000 REP" }
        ];
        if (currentChampAdminWeek >= 3 && defaultTop3.length < 4) {
            defaultTop3 = [
                ...defaultTop3,
                { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 10, badge: "🔩 +10 PTS", repMoney: 80000, repBadge: "💰 $80.000 REP" }
            ];
        }

        if (!targetCh.groupsWinners) targetCh.groupsWinners = {};
        targetCh.groupsWinners[currentChampAdminGroup] = JSON.parse(JSON.stringify(defaultTop3));
        if (!targetCh.groupsResults) targetCh.groupsResults = {};
        targetCh.groupsResults[grpName] = JSON.parse(JSON.stringify(defaultTop3));
        targetCh.groupsResults[currentChampAdminGroup] = JSON.parse(JSON.stringify(defaultTop3));
        if (currentChampAdminGroup === 0) {
            targetCh.top3 = JSON.parse(JSON.stringify(defaultTop3));
        }

        renderChampionshipAdminChallenges();
        showToast(`Desafío #${idx + 1} de ${grpName} restablecido. Haz clic en "Guardar" para persistir el cambio.`, "info");
    }
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

    // 2. Guardar los 8 Desafíos para el grupo activo
    const grp = (weekData.groups && weekData.groups[currentChampAdminGroup]) || { name: `Grupo #${currentChampAdminGroup + 1}` };
    const grpName = grp.name || `Grupo #${currentChampAdminGroup + 1}`;

    for (let idx = 0; idx < 8; idx++) {
        const chData = getChampionshipChallengeFromUI(idx);
        if (!weekData.challenges[idx]) {
            weekData.challenges[idx] = {
                id: `w${currentChampAdminWeek}-ch${idx + 1}`,
                route: chData.route,
                type: chData.type,
                carRestriction: chData.carRestriction
            };
        }
        const targetCh = weekData.challenges[idx];
        targetCh.route = chData.route;
        targetCh.type = chData.type;
        targetCh.carRestriction = chData.carRestriction;

        if (!targetCh.groupsWinners) targetCh.groupsWinners = {};
        targetCh.groupsWinners[currentChampAdminGroup] = chData.top3;
        targetCh.groupsWinners[grpName] = chData.top3;

        if (!targetCh.groupsResults) targetCh.groupsResults = {};
        targetCh.groupsResults[grpName] = chData.top3;
        targetCh.groupsResults[currentChampAdminGroup] = chData.top3;

        if (currentChampAdminGroup === 0) {
            targetCh.top3 = chData.top3;
        }
    }

    // 3. Persistir en Firebase RTDB y localStorage con sincronización en tiempo real
    showToast(`Guardando Semana ${currentChampAdminWeek} completa en Firebase RTDB...`, "info");
    const ok = await persistChampionshipWeeksData(cachedChampWeeksData);
    if (ok) {
        showToast(`✓ ¡Semana ${currentChampAdminWeek} completa guardada y sincronizada con la web!`, "success");
    } else {
        showToast(`✓ ¡Semana ${currentChampAdminWeek} guardada en caché local!`, "info");
    }
}

/**
 * Determina si una marca de tiempo representa una participación nula o no registrada:
 * cadenas vacías, marcadores de posición ("--:--.---", "DNS", "DNF", "TBD"),
 * o ceros absolutos ("00:00:00", "00:00.000", "0:00.000", etc.).
 */
function isZeroOrNullTime(timeStr) {
    if (!timeStr) return true;
    const clean = String(timeStr).trim().toUpperCase();
    if (clean === '' || clean === '--:--.---' || clean === '--:--:--' || clean === '--:--' || clean === '--' || clean === '-' ||
        clean === '00:00.000' || clean === '00:00:00' || clean === '00:00' || clean === '0:00.000' || clean === '0:00:00' ||
        clean === '0' || clean === '0.0' || clean === '00.00' ||
        clean === 'DNS' || clean === 'DNF' || clean === 'DSQ' || clean === 'TBD' ||
        clean === 'NULO' || clean === 'NULL' || clean === 'NONE' || clean === 'POR DISPUTAR' || clean === 'EN ESPERA') {
        return true;
    }
    const digitsOnly = clean.replace(/[^0-9]/g, '');
    if (digitsOnly.length > 0 && digitsOnly.split('').every(ch => ch === '0')) {
        return true;
    }
    return false;
}

async function syncChampionshipWinnersInternal() {
    const baseUrl = (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ? window.NFS_FIREBASE.RTDB_URL : "https://nfsranks-blacklist-default-rtdb.firebaseio.com";

    try {
        let drivers = getChampionshipDefaultDrivers();
        if (drivers && drivers.length > 0) {
            drivers = JSON.parse(JSON.stringify(drivers));
        } else {
            drivers = [];
        }

        // Cargar participantes si existen para sincronizar sus nombres y alias en la lista
        const participants = getChampionshipParticipantsList();
        if (Array.isArray(participants) && participants.length > 0) {
            participants.forEach((p, idx) => {
                if (idx < 15 && drivers[idx]) {
                    drivers[idx].name = p.name;
                    drivers[idx].alias = p.alias || p.name;
                    drivers[idx].ride = p.ride || drivers[idx].ride;
                }
            });
        }

        // Reinicializar contadores de victorias, tiempos, bonos y reputación
        drivers.forEach(d => {
            d.victories = { p1: 0, p2: 0, p3: 0, p4: 0 };
            d.bestTimes = { first: 0, second: 0, third: 0 };
            d.bonusPoints = 0;
            d.rep = 0;
        });

        // Helper para resolver piloto de forma robusta
        const matchDriver = (pilotStr) => {
            if (!pilotStr || pilotStr === 'Por disputar' || pilotStr === 'En espera') return null;
            const clean = String(pilotStr).trim().toLowerCase();
            const num = parseInt(clean, 10);
            if (!isNaN(num) && String(num) === clean) {
                return drivers.find(d => d.rank === num);
            }
            let found = drivers.find(d => 
                (d.alias && d.alias.trim().toLowerCase() === clean) ||
                (d.name && d.name.trim().toLowerCase() === clean)
            );
            if (found) return found;

            found = drivers.find(d => {
                const dAlias = (d.alias || '').trim().toLowerCase();
                const dName = (d.name || '').trim().toLowerCase();
                if (dAlias && (clean.includes(dAlias) || dAlias.includes(clean))) return true;
                if (dName && (clean.includes(dName) || dName.includes(clean))) return true;
                return false;
            });
            return found || null;
        };

        // Iterar las semanas del campeonato para computar ganadores por grupo (Alfa, Beta, Gama, Delta...)
        // Regla Oficial: Por ahora exclusivamente las semanas 1 y 2 están en curso (disputadas).
        // Las semanas 3 y 4 solo se contabilizan si ya tienen eventos disputados con tiempos válidos guardados desde admin.html.
        const weeksSource = cachedChampWeeksData || getChampionshipDefaultWeeksData() || {};
        Object.keys(weeksSource).forEach(wKey => {
            const wData = weeksSource[wKey];
            if (!wData || !Array.isArray(wData.challenges)) return;

            const wNum = parseInt(wData.weekNumber || wKey, 10);
            if (wNum > 2) {
                // Verificar si la semana 3 o 4 ya fue disputada (eventos con tiempos reales guardados por comisaría)
                const hasDisputedEvents = wData.challenges.some(ch => {
                    const map = ch.groupsResults || ch.groupsWinners;
                    if (map && typeof map === 'object') {
                        return Object.values(map).some(grp => Array.isArray(grp) && grp.some(entry => entry && entry.pilot && entry.pilot !== 'Por disputar' && !isZeroOrNullTime(entry.time)));
                    }
                    return false;
                });
                if (!hasDisputedEvents) return;
            }

            wData.challenges.forEach(ch => {
                let groupsToProcess = [];
                if (Array.isArray(wData.groups) && wData.groups.length > 0) {
                    weekDataGroupLoop:
                    for (let grpIdx = 0; grpIdx < wData.groups.length; grpIdx++) {
                        const grp = wData.groups[grpIdx];
                        const grpName = grp.name || `Grupo #${grpIdx + 1}`;
                        let grpTop3 = null;
                        if (ch.groupsWinners) {
                            grpTop3 = ch.groupsWinners[grpIdx] || ch.groupsWinners[grpName] || ch.groupsWinners[String(grpIdx)];
                        }
                        if (!grpTop3 && ch.groupsResults) {
                            grpTop3 = ch.groupsResults[grpName] || ch.groupsResults[grpIdx] || ch.groupsResults[String(grpIdx)];
                        }
                        if (!grpTop3 && grpIdx === 0 && Array.isArray(ch.top3)) {
                            grpTop3 = ch.top3;
                        }
                        if (Array.isArray(grpTop3) && grpTop3.length > 0) {
                            groupsToProcess.push(grpTop3);
                        }
                    }
                }

                if (groupsToProcess.length === 0) {
                    const sourceMap = ch.groupsWinners || ch.groupsResults;
                    if (sourceMap && typeof sourceMap === 'object') {
                        const numKeys = Object.keys(sourceMap).filter(k => !isNaN(parseInt(k, 10)));
                        const targetKeys = numKeys.length > 0 ? numKeys : Object.keys(sourceMap);
                        targetKeys.forEach(k => {
                            if (Array.isArray(sourceMap[k]) && sourceMap[k].length > 0) {
                                groupsToProcess.push(sourceMap[k]);
                            }
                        });
                    } else if (Array.isArray(ch.top3)) {
                        groupsToProcess.push(ch.top3);
                    }
                }

                groupsToProcess.forEach(top3List => {
                    if (!Array.isArray(top3List)) return;

                    top3List.forEach((entry, posIdx) => {
                        if (!entry || !entry.pilot || entry.pilot === 'Por disputar' || entry.pilot === 'En espera' || entry.pilot.toLowerCase().startsWith('plaza disponible')) return;
                        const d = matchDriver(entry.pilot);
                        if (!d) return;

                        const time = (entry.time || '').trim();
                        const isNullTime = isZeroOrNullTime(time);

                        // 1. Bono Puntos: ÚNICAMENTE se suman si el tiempo está registrado (no nulo) y el valor es >= 1.
                        // Si el tiempo no está registrado (casilla vacía o nula) o el bono es 0 o vacío: NO suma bono puntos.
                        let bVal = 0;
                        if (!isNullTime) {
                            if (entry.bonus !== undefined && entry.bonus !== null && entry.bonus !== '') {
                                const parsedB = parseInt(entry.bonus, 10);
                                bVal = (!isNaN(parsedB) && parsedB >= 1) ? parsedB : 0;
                            }
                        }

                        // 2. Recompensa REP (Dinero): Anclada a la posición del jugador (Oro, Silver, Bronce, Zinc).
                        // ÚNICAMENTE si la casilla está en 0 o vacía: NO suma dinero de recompensa ($0).
                        let rVal = 0;
                        if (entry.repMoney !== undefined && entry.repMoney !== null && entry.repMoney !== '') {
                            const parsedR = parseInt(entry.repMoney, 10);
                            rVal = (!isNaN(parsedR) && parsedR >= 1) ? parsedR : 0;
                        } else if (entry.rep !== undefined && entry.rep !== null && entry.rep !== '') {
                            const parsedR = parseInt(entry.rep, 10);
                            rVal = (!isNaN(parsedR) && parsedR >= 1) ? parsedR : 0;
                        }

                        // Validar si este puesto realmente participó / fue disputado
                        const hasValidResult = (!isNullTime) || (rVal > 0) || (bVal > 0);
                        if (!hasValidResult) return;

                        // Sumar bono puntos (solo si hay tiempo registrado y bVal >= 1)
                        if (bVal > 0) d.bonusPoints = (d.bonusPoints || 0) + bVal;

                        // Sumar dinero REP (anclado a la posición, rVal >= 1)
                        if (rVal > 0) d.rep = (d.rep || 0) + rVal;

                        if (posIdx === 0) {
                            d.victories.p1 = (d.victories.p1 || 0) + 1;
                            if (bVal > 0 || !isNullTime) d.bestTimes.first = (d.bestTimes.first || 0) + 1;
                        } else if (posIdx === 1) {
                            d.victories.p2 = (d.victories.p2 || 0) + 1;
                            if (bVal > 0 || !isNullTime) d.bestTimes.second = (d.bestTimes.second || 0) + 1;
                        } else if (posIdx === 2) {
                            d.victories.p3 = (d.victories.p3 || 0) + 1;
                            if (bVal > 0 || !isNullTime) d.bestTimes.third = (d.bestTimes.third || 0) + 1;
                        } else if (posIdx === 3) {
                            d.victories.p4 = (d.victories.p4 || 0) + 1;
                        }
                    });
                });
            });
        });

        // Calcular puntaje total consolidados para cada piloto
        drivers.forEach(d => {
            const v = d.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
            const p1Pts = (v.p1 || 0) * 25;
            const p2Pts = (v.p2 || 0) * 18;
            const p3Pts = (v.p3 || 0) * 15;
            const p4Pts = (v.p4 || 0) * 12;
            const bonusPts = (typeof d.bonusPoints === 'number') ? d.bonusPoints : 0;
            const repPts = Math.floor((d.rep || 0) / 10000);
            d.points = p1Pts + p2Pts + p3Pts + p4Pts + bonusPts + repPts;
            d.totalPts = d.points;
        });

        // Guardar pilotos actualizados en localStorage (v5 y v4 para retrocompatibilidad)
        localStorage.setItem('nfs_blacklist_championship_2026_v5', JSON.stringify(drivers));
        localStorage.setItem('nfs_blacklist_championship_2026_v4', JSON.stringify(drivers));

        try {
            await fetch(`${baseUrl}/records/blacklist_championship_2026.json`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(drivers)
            });
            await fetch(`${baseUrl}/championship/blacklist_drivers.json`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(drivers)
            });
        } catch (eCloud) {}

        try {
            if (typeof BroadcastChannel !== 'undefined') {
                const bc = new BroadcastChannel('nfs_championship_sync');
                bc.postMessage({ type: 'DRIVERS_UPDATED', drivers: drivers });
                bc.close();
            }
        } catch (eBc) {}

        return true;
    } catch (e) {
        console.error("Error sincronizando clasificación general:", e);
        return false;
    }
}

async function syncChampionshipWinnersWithStandings() {
    await saveChampionshipAdmin();

    showToast("⚡ Sincronizando puntos y victorias con la Clasificación General...", "info");
    const ok = await syncChampionshipWinnersInternal();
    if (ok) {
        showToast("⚡ ¡Clasificación General sincronizada con éxito en Firebase RTDB y Web!", "success");
    } else {
        showToast("⚡ Sincronizado en caché local", "warning");
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
window.saveChampionshipSingleChallenge = saveChampionshipSingleChallenge;
window.saveChampionshipAllChallenges = saveChampionshipAllChallenges;
window.syncChampionshipWinnersInternal = syncChampionshipWinnersInternal;
window.selectChampionshipAdminGroup = selectChampionshipAdminGroup;
window.renderChampionshipAdminGroupPills = renderChampionshipAdminGroupPills;
window.quickAssignPilotToWinner = quickAssignPilotToWinner;
window.generateChampionshipRotations = generateChampionshipRotations;
window.openAssignPilotToSlotModal = openAssignPilotToSlotModal;
window.closeAssignPilotToSlotModal = closeAssignPilotToSlotModal;
window.onAssignModalGroupChanged = onAssignModalGroupChanged;
window.confirmAssignPilotToSlot = confirmAssignPilotToSlot;
window.toggleAssignSlotPilotMode = toggleAssignSlotPilotMode;
window.registerNewChampionshipParticipant = registerNewChampionshipParticipant;
window.openRegisterNewChampPilotModal = openRegisterNewChampPilotModal;
window.closeRegisterNewChampPilotModal = closeRegisterNewChampPilotModal;
window.onRegisterNewPilotGroupChanged = onRegisterNewPilotGroupChanged;
window.confirmRegisterNewChampPilot = confirmRegisterNewChampPilot;
window.onGroupPilotSelectChanged = onGroupPilotSelectChanged;
window.ensurePilotRegisteredByName = ensurePilotRegisteredByName;
window.loadChampionshipOfficialDrivers = loadChampionshipOfficialDrivers;
window.getChampionshipDefaultDrivers = getChampionshipDefaultDrivers;
window.getBlacklistDriverSelectOptionsHTML = getBlacklistDriverSelectOptionsHTML;
window.getChampionshipDriverByRank = getChampionshipDriverByRank;
window.getActiveChampWeekData = getActiveChampWeekData;
window.getCurrentChampAdminWeek = () => currentChampAdminWeek;
window.NFS_MW_2005_STORY_RIVALS = NFS_MW_2005_STORY_RIVALS;
window.FALLBACK_TOURNAMENT_PARTICIPANTS = FALLBACK_TOURNAMENT_PARTICIPANTS;


