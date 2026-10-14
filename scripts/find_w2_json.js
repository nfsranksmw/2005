const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\willi\\.gemini\\antigravity\\brain\\0873d5b7-884e-4661-86a4-758a33d42ae1\\.system_generated\\logs\\transcript_full.jsonl';

const fileStream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineCount = 0;

rl.on('line', (line) => {
  lineCount++;
  if (line.includes('w2-ch1') && line.includes('groupsWinners') && line.length > 5000) {
    console.log(`Line ${lineCount} has w2-ch1 with groupsWinners, len: ${line.length}`);
    fs.writeFileSync(`scripts/found_w2_line_${lineCount}.txt`, line.slice(0, 2000), 'utf8');
  }
});

rl.on('close', () => {
  console.log('Search finished.');
});
