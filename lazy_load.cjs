const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src/components').concat(walk('./src/pages'));
let count = 0;

files.forEach(file => {
    const text = fs.readFileSync(file, 'utf8');
    // Find <img tags that don't already have loading=
    const newText = text.replace(/<img(?!\s+[^>]*\bloading=)/g, '<img loading="lazy"');
    if (newText !== text) {
        fs.writeFileSync(file, newText);
        count++;
        console.log('Updated: ' + file);
    }
});

console.log('Total fixed: ' + count);
