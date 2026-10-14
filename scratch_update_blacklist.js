const fs = require('fs');

let code = fs.readFileSync('assets/js/blacklist-data.js', 'utf8');

// Buscamos todas las apariciones de "🥉 +20 PTS" en Week 3 y Week 4 y añadimos la posición 4
const p3SearchPattern = `{ rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 20,`;

const lines = code.split('\n');
let currentWeek = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('3: {') && lines[i+1] && lines[i+1].includes('weekNumber: 3')) {
        currentWeek = 3;
    } else if (line.includes('4: {') && lines[i+1] && lines[i+1].includes('weekNumber: 4')) {
        currentWeek = 4;
    }

    if ((currentWeek === 3 || currentWeek === 4) && line.includes('badge: "🥉 +20 PTS"')) {
        // Encontramos la línea del 3° puesto
        // La siguiente línea suele ser `repBadge: ... }`
        let j = i;
        while (j < lines.length && !lines[j].includes('}')) {
            j++;
        }
        // lines[j] tiene el cierre de la llave del 3er puesto
        // Añadimos una coma si no tiene y la línea del 4to puesto
        if (!lines[j].endsWith(',')) {
            lines[j] = lines[j] + ',';
        }
        const p4Line = `                    { rank: null, pilot: "Por disputar", car: "", time: "--:--.---", bonus: 10, badge: "🔩 +10 PTS", repMoney: 80000, repBadge: "💰 $80.000 REP" }`;
        lines.splice(j + 1, 0, p4Line);
        i = j + 1; // avanzar el índice
    }
}

fs.writeFileSync('assets/js/blacklist-data.js', lines.join('\n'), 'utf8');
console.log('Successfully updated Week 3 and Week 4 challenges with position 4 (Zinc/Aluminio)');
