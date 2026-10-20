const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\willi\\.gemini\\antigravity\\brain\\0873d5b7-884e-4661-86a4-758a33d42ae1\\.system_generated\\logs\\transcript_full.jsonl';

const fileStream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineCount = 0;

rl.on('line', (line) => {
  lineCount++;
  if (line.includes('04:58.750') && line.includes('00:57.750')) {
    console.log(`Found Ch 0 + Ch 1 in line ${lineCount}, length: ${line.length}`);
  }
});

rl.on('close', () => {
  console.log('Search finished.');
});
