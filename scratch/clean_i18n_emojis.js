const fs = require('fs');
let content = fs.readFileSync('assets/js/i18n.js', 'utf8');

const navKeys = [
    'nav_challenges_menu',
    'nav_challenges_weekly',
    'nav_blacklist_roster',
    'nav_championship',
    'nav_blacklist_cards',
    'nav_championship_register',
    'nav_past_tournaments',
    'nav_guides',
    'nav_rules',
    'nav_search_driver',
    'nav_submit_time',
    'nav_dropdown_download',
    'nav_dropdown_map',
    'nav_members',
    'nav_dropdown_members',
    'nav_map',
    'filter_circuits',
    'filter_sprints',
    'filter_drags',
    'filter_all'
];

let lines = content.split('\n');
let modifiedCount = 0;

lines = lines.map(line => {
    for (const key of navKeys) {
        const regex = new RegExp(`(${key}:\\s*\")([^\"]*)(\")`);
        if (regex.test(line)) {
            line = line.replace(regex, (match, p1, p2, p3) => {
                // Remove leading emojis and whitespace
                const cleanedVal = p2.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}⚡⚔💀📝🏛⚙📋🔍🚀📥🗺👥🏆🎮🚦]+\s*/gu, '');
                if (cleanedVal !== p2) {
                    modifiedCount++;
                }
                return `${p1}${cleanedVal}${p3}`;
            });
        }
    }
    return line;
});

fs.writeFileSync('assets/js/i18n.js', lines.join('\n'), 'utf8');
console.log(`Cleaned ${modifiedCount} emoji occurrences in i18n.js`);
