/**
 * NFSRANKSMW - Script de Migración Histórica de Google Sheets a Firebase RTDB (Node.js)
 * Ejecutar con: node scripts/migrate_sheets_to_firebase.js
 */

const fs = require('fs');
const path = require('path');

const FIREBASE_RTDB_BASE_URL = "https://nfsranks-blacklist-default-rtdb.firebaseio.com";

// Leer routes-data.js
const routesFilePath = path.join(__dirname, '..', 'assets', 'js', 'routes-data.js');
let fileContent = fs.readFileSync(routesFilePath, 'utf8');

// Extraer routesData
let routesData = [];
try {
    const sandbox = {};
    const fn = new Function('routesData', fileContent + '; return routesData;');
    routesData = fn();
} catch (e) {
    console.error("Error interpretando routes-data.js:", e.message);
    process.exit(1);
}

function sanitizeKey(str) {
    if (!str) return "general";
    return String(str)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9_-]/g, "_")
        .replace(/[.#$[\]]/g, "_");
}

function parseTimeToMs(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return null;
    const clean = timeStr.trim();
    if (!clean || clean === '--' || clean === '-') return null;

    if (clean.includes(':')) {
        const parts = clean.split(':');
        const mins = parseInt(parts[0], 10);
        if (isNaN(mins)) return null;

        const secParts = parts[1].split('.');
        const secs = parseInt(secParts[0], 10);
        if (isNaN(secs)) return null;

        let msStr = secParts[1] || '0';
        if (msStr.length === 1) msStr = msStr + '00';
        else if (msStr.length === 2) msStr = msStr + '0';
        else if (msStr.length > 3) msStr = msStr.slice(0, 3);
        const ms = parseInt(msStr, 10);

        return (mins * 60 * 1000) + (secs * 1000) + ms;
    }

    if (clean.includes('.')) {
        const parts = clean.split('.');
        const secs = parseInt(parts[0], 10);
        if (isNaN(secs)) return null;

        let msStr = parts[1] || '0';
        if (msStr.length === 1) msStr = msStr + '00';
        else if (msStr.length === 2) msStr = msStr + '0';
        else if (msStr.length > 3) msStr = msStr.slice(0, 3);
        const ms = parseInt(msStr, 10);

        return (secs * 1000) + ms;
    }

    return null;
}

async function fetchCsvRecords(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) return [];
        const text = await res.text();
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) return [];

        const records = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            const driver = cols[1] || '';
            const time = cols[2] || '';
            if (!driver || !time || time === '--' || time === '-') continue;

            const timeMs = parseTimeToMs(time);
            records.push({
                rank: `#${records.length + 1}`,
                driver: driver,
                time: time,
                timeMs: timeMs,
                car: cols[3] || 'BMW M3 GTR',
                device: cols[4] || 'PC',
                gearbox: cols[5] || 'Manual',
                date: cols[6] || '',
                yt: cols[7] || '#',
                verified: true
            });
        }

        records.sort((a, b) => {
            if (a.timeMs !== null && b.timeMs !== null && a.timeMs !== b.timeMs) return a.timeMs - b.timeMs;
            return 0;
        });

        return records.map((r, idx) => ({ ...r, rank: `#${idx + 1}` }));
    } catch (e) {
        console.warn(`Error descargando CSV ${url}:`, e.message);
        return [];
    }
}

async function runMigration() {
    console.log(`Iniciando migración de ${routesData.length} pistas a Firebase RTDB...`);

    for (let i = 0; i < routesData.length; i++) {
        const route = routesData[i];
        const routeKey = sanitizeKey(route.name);
        console.log(`[${i + 1}/${routesData.length}] Migrando ${route.name} (${route.type})...`);

        if (route.type === 'Circuito') {
            const categories = [
                { key: 'junkman_single', url: route.sheets.junkmanSingle },
                { key: 'junkman_fast',   url: route.sheets.junkmanFast },
                { key: 'bmw_single',     url: route.sheets.bmwSingle },
                { key: 'bmw_fast',       url: route.sheets.bmwFast }
            ];
            for (const cat of categories) {
                if (!cat.url) continue;
                const records = await fetchCsvRecords(cat.url);
                if (records.length > 0) {
                    await fetch(`${FIREBASE_RTDB_BASE_URL}/leaderboards/${routeKey}/${cat.key}.json`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(records)
                    });
                }
            }
        } else {
            const categories = [
                { key: 'junkman', url: route.sheets.junkman },
                { key: 'bmw',     url: route.sheets.bmw }
            ];
            for (const cat of categories) {
                if (!cat.url) continue;
                const records = await fetchCsvRecords(cat.url);
                if (records.length > 0) {
                    await fetch(`${FIREBASE_RTDB_BASE_URL}/leaderboards/${routeKey}/${cat.key}.json`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(records)
                    });
                }
            }
        }
    }

    console.log("¡Migración finalizada con éxito!");
}

runMigration().catch(console.error);
