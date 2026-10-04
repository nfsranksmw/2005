const fs = require('fs');
let code = fs.readFileSync('assets/js/app.js', 'utf8');

const target = `            const timeEl = container.querySelector('.stitch-spotlight-metric-val');
            if (timeEl) timeEl.textContent = rows[0].time;
            if (bannerTime) bannerTime.textContent = rows[0].time;
            if (bannerAuthor) bannerAuthor.textContent = \`por \${rows[0].driver}\`;`;

const replacement = `            const vals = container.querySelectorAll('.stitch-spotlight-metric-val');
            if (vals && vals.length >= 3) {
                vals[0].textContent = rows[0].time;
                vals[1].textContent = rows[0].driver;
                if (rows[0].car) vals[2].textContent = rows[0].car;
            }
            if (bannerTime) bannerTime.textContent = rows[0].time;
            if (bannerAuthor) bannerAuthor.textContent = \`por \${rows[0].driver}\`;`;

// Replace regardless of line endings
const normTarget = target.replace(/\r\n/g, '\n');
const normCode = code.replace(/\r\n/g, '\n');

if (normCode.includes(normTarget)) {
    const updated = normCode.replace(normTarget, replacement.replace(/\r\n/g, '\n'));
    fs.writeFileSync('assets/js/app.js', updated, 'utf8');
    console.log('Successfully patched spotlight in app.js!');
} else {
    console.error('Could not find target in app.js');
    process.exit(1);
}
