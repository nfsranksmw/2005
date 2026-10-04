const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const i18nJs = fs.readFileSync('assets/js/i18n.js', 'utf8');

const regex = /data-i18n(?:-html|-placeholder|-title)?=["']([^"']+)["']/g;
const keysInHtml = new Set();
let match;
while ((match = regex.exec(html)) !== null) {
    keysInHtml.add(match[1]);
}

console.log('Unique i18n keys in index.html:', keysInHtml.size);

// Extract just I18N_TRANSLATIONS
const endIdx = i18nJs.indexOf('let currentLanguage');
let safeI18n = i18nJs.slice(0, endIdx);

const vm = require('vm');
const sandbox = {};
vm.createContext(sandbox);
const I18N_TRANSLATIONS = vm.runInContext(safeI18n + '\n;I18N_TRANSLATIONS;', sandbox);
console.log('Available languages:', Object.keys(I18N_TRANSLATIONS));

for (const lang of ['en', 'es', 'pt']) {
    const dict = I18N_TRANSLATIONS[lang] || {};
    const missing = [];
    for (const key of keysInHtml) {
        if (dict[key] === undefined) {
            missing.push(key);
        }
    }
    console.log(`Language [${lang}] missing ${missing.length} keys from index.html:`, missing.slice(0, 30));
}
