const fs = require('fs');

const origLanguagesBlock = `const I18N_LANGUAGES = {
    en: { code: 'EN', flag: '🇺🇸', name: 'English', native: 'English (Primary)' },
    es: { code: 'ES', flag: '🇪🇸', name: 'Español', native: 'Español (Secundario)' },
    pt: { code: 'PT', flag: '🇧🇷', name: 'Português', native: 'Português' },
    zh: { code: 'ZH', flag: '🇨🇳', name: 'Chino', native: '中文' },
    ja: { code: 'JA', flag: '🇯🇵', name: 'Japonés', native: '日本語' },
    ru: { code: 'RU', flag: '🇷🇺', name: 'Ruso', native: 'Русский' },
    it: { code: 'IT', flag: '🇮🇹', name: 'Italiano', native: 'Italiano' },
    fr: { code: 'FR', flag: '🇫🇷', name: 'Francés', native: 'Français' },
    af: { code: 'AF', flag: '🇿🇦', name: 'Africano', native: 'Afrikaans' }
};`;

let content = fs.readFileSync('assets/js/i18n.js', 'utf8');

// Replace the messed up I18N_LANGUAGES block
const langStart = content.indexOf('const I18N_LANGUAGES = {');
const transStart = content.indexOf('const I18N_TRANSLATIONS = {');

content = content.slice(0, langStart) + origLanguagesBlock + '\n\n' + content.slice(transStart);

// Now load the newKeys from add_i18n_keys.js
const { newKeys } = require('./new_keys_definition.js');

// Now inject inside I18N_TRANSLATIONS
const transIdx = content.indexOf('const I18N_TRANSLATIONS = {');
let transSection = content.slice(transIdx);

const languages = ['es', 'en', 'pt', 'zh', 'ja', 'ru', 'it', 'fr', 'af'];

languages.forEach(lang => {
    // Find `${lang}: {` inside transSection
    // Notice inside I18N_TRANSLATIONS: `    ${lang}: {`
    const marker = `    ${lang}: {`;
    const idx = transSection.indexOf(marker);
    if (idx === -1) {
        console.error('Could not find marker for ' + lang);
        return;
    }

    let injection = '\n';
    for (const [key, trans] of Object.entries(newKeys)) {
        const val = trans[lang] || trans['en'] || trans['es'];
        injection += `        ${key}: ${JSON.stringify(val)},\n`;
    }

    transSection = transSection.slice(0, idx + marker.length) + injection + transSection.slice(idx + marker.length);
});

content = content.slice(0, transIdx) + transSection;

fs.writeFileSync('assets/js/i18n.js', content, 'utf8');
console.log('Successfully repaired and injected keys into I18N_TRANSLATIONS!');
