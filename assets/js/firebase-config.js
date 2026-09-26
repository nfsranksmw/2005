/**
 * NFSRANKSMW - Configuración Central de Firebase Realtime Database y Firebase Auth
 * https://nfsranks.online
 */

(function () {
    const FIREBASE_RTDB_BASE_URL = "https://nfsranks-blacklist-default-rtdb.firebaseio.com";
    const FIREBASE_PROJECT_ID = "nfsranks-blacklist";

    // Configuración oficial de Firebase Web SDK
    const firebaseConfig = {
        apiKey: "AIzaSyBAM5vOZ2hhzb6CFScBgLszMrjL12Q_bPg",
        authDomain: "nfsranks-blacklist.firebaseapp.com",
        databaseURL: "https://nfsranks-blacklist-default-rtdb.firebaseio.com",
        projectId: "nfsranks-blacklist",
        storageBucket: "nfsranks-blacklist.firebasestorage.app",
        messagingSenderId: "624599324701",
        appId: "1:624599324701:web:390c7a5249a306dd1a8ef4",
        measurementId: "G-F5X2ZW9MR6"
    };

    // Inicialización condicional de Firebase Web SDK si las librerías compatibles están presentes
    let firebaseApp = null;
    let firebaseAuth = null;
    let firebaseDatabase = null;

    if (typeof firebase !== 'undefined') {
        try {
            if (!firebase.apps || !firebase.apps.length) {
                firebaseApp = firebase.initializeApp(firebaseConfig);
            } else {
                firebaseApp = firebase.app();
            }
            if (typeof firebase.auth === 'function') {
                firebaseAuth = firebase.auth();
            }
            if (typeof firebase.database === 'function') {
                firebaseDatabase = firebase.database();
            }
        } catch (e) {
            console.warn("Aviso inicializando Firebase Web SDK:", e);
        }
    }

    // Exportación global en window sin colisión de identificadores
    window.FIREBASE_RTDB_BASE_URL = FIREBASE_RTDB_BASE_URL;
    window.FIREBASE_PROJECT_ID = FIREBASE_PROJECT_ID;
    window.firebaseConfig = firebaseConfig;

    window.NFS_FIREBASE = {
        RTDB_URL: FIREBASE_RTDB_BASE_URL,
        config: firebaseConfig,
        app: firebaseApp,
        auth: firebaseAuth,
        db: firebaseDatabase,

        /**
         * Sanitiza una clave de ruta o categoría para compatibilidad con Firebase RTDB
         */
        sanitizeKey: function (str) {
            if (!str) return "general";
            return String(str)
                .trim()
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9_-]/g, "_")
                .replace(/[.#$[\]]/g, "_");
        },

        /**
         * Convierte una cadena de tiempo (ej: "01:23.456", "4.56.26", "1:23.45", "45.120", "35:42:00", "19s 810ms") a milisegundos enteros
         */
        parseTimeToMs: function (timeStr) {
            if (!timeStr || typeof timeStr !== 'string') return null;
            const clean = timeStr.trim().toLowerCase();
            if (!clean || clean === '--' || clean === '-' || clean === 'n/a' || clean === 'none') return null;

            // 1. Formato con texto: "0m 24s 010ms" o "19s 810ms"
            const textMatch = clean.match(/(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+(?:[.,]\d+)?)s)?\s*(?:(\d+)ms)?/);
            if (textMatch && (textMatch[1] || textMatch[2] || textMatch[3] || textMatch[4])) {
                const h = parseInt(textMatch[1] || '0', 10);
                const m = parseInt(textMatch[2] || '0', 10);
                const sec = parseFloat((textMatch[3] || '0').replace(',', '.'));
                const msRaw = textMatch[4];
                let ms = 0;
                if (msRaw) {
                    let padded = msRaw;
                    if (padded.length === 1) padded += '00';
                    else if (padded.length === 2) padded += '0';
                    else if (padded.length > 3) padded = padded.slice(0, 3);
                    ms = parseInt(padded, 10);
                }
                const total = (h * 3600 + m * 60 + sec) * 1000 + ms;
                if (total > 0) return Math.round(total);
            }

            // 2. Formato con dos puntos decimales: "4.56.26" o "4.59.04" (minutos.segundos.centésimas)
            const dotParts = clean.split('.');
            if (dotParts.length === 3 && !clean.includes(':')) {
                const mins = parseInt(dotParts[0], 10);
                const secs = parseInt(dotParts[1], 10);
                let msStr = dotParts[2] || '0';
                if (msStr.length === 1) msStr += '00';
                else if (msStr.length === 2) msStr += '0';
                else if (msStr.length > 3) msStr = msStr.slice(0, 3);
                const ms = parseInt(msStr, 10);
                if (!isNaN(mins) && !isNaN(secs) && !isNaN(ms)) {
                    return (mins * 60 * 1000) + (secs * 1000) + ms;
                }
            }

            // 3. Formato con dos puntos: "35:42:00" vs "01:23.456"
            if (clean.includes(':')) {
                const parts = clean.split(':');
                if (parts.length === 3) {
                    const p1 = parseInt(parts[0], 10);
                    const p2 = parseInt(parts[1], 10);
                    const p3 = parseInt(parts[2], 10);
                    // Si p3 === 0 y p1 < 60, es segundos : centésimas : 00 (ej: 35:42:00)
                    if (p3 === 0 && p1 < 60) {
                        let msStr = parts[1] || '0';
                        if (msStr.length === 1) msStr += '00';
                        else if (msStr.length === 2) msStr += '0';
                        return (p1 * 1000) + parseInt(msStr, 10);
                    }
                    return (p1 * 3600000) + (p2 * 60000) + (p3 * 1000);
                } else if (parts.length === 2) {
                    const mins = parseInt(parts[0], 10);
                    const secParts = parts[1].split('.');
                    const secs = parseInt(secParts[0], 10);
                    let msStr = (secParts[1] || '0').replace(/[^0-9]/g, '0');
                    if (msStr.length === 1) msStr += '00';
                    else if (msStr.length === 2) msStr += '0';
                    else if (msStr.length > 3) msStr = msStr.slice(0, 3);
                    const ms = parseInt(msStr, 10);
                    if (!isNaN(mins) && !isNaN(secs)) {
                        return (mins * 60 * 1000) + (secs * 1000) + (isNaN(ms) ? 0 : ms);
                    }
                }
            }

            // 4. Formato SS.mmm
            if (clean.includes('.')) {
                const parts = clean.split('.');
                const secs = parseInt(parts[0], 10);
                let msStr = parts[1] || '0';
                if (msStr.length === 1) msStr += '00';
                else if (msStr.length === 2) msStr += '0';
                else if (msStr.length > 3) msStr = msStr.slice(0, 3);
                const ms = parseInt(msStr, 10);
                if (!isNaN(secs)) {
                    return (secs * 1000) + (isNaN(ms) ? 0 : ms);
                }
            }

            const secsOnly = parseInt(clean, 10);
            return isNaN(secsOnly) ? null : secsOnly * 1000;
        },

        /**
         * Formatea milisegundos a representación estándar F1 (MM:SS.mmm)
         */
        formatMsToTime: function (ms) {
            if (ms === null || ms === undefined || isNaN(ms)) return '--:--.---';
            const totalSecs = Math.floor(ms / 1000);
            const remMs = ms % 1000;
            const mins = Math.floor(totalSecs / 60);
            const secs = totalSecs % 60;
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(remMs).padStart(3, '0')}`;
        }
    };
})();
