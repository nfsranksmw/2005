const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\willi\\.gemini\\antigravity\\brain\\0873d5b7-884e-4661-86a4-758a33d42ae1\\.system_generated\\logs\\transcript_full.jsonl';

const fileStream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineCount = 0;

rl.on('line', (line) => {
  lineCount++;
  if (lineCount === 2248) {
    const obj = JSON.parse(line);
    fs.writeFileSync('scripts/line_2248_full.txt', obj.content, 'utf8');
    console.log('Saved line_2248_full.txt');
  }
});
