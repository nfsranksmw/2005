const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\willi\\.gemini\\antigravity\\brain\\0873d5b7-884e-4661-86a4-758a33d42ae1\\.system_generated\\logs\\transcript_full.jsonl';

const fileStream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineCount = 0;

rl.on('line', (line) => {
  lineCount++;
  // If line contains both '04:58.750' and '05:04.500' (the exact times of Ch 0 G0 in week 2)
  if (line.includes('04:58.750') && line.includes('05:04.500')) {
    console.log(`Found exact times in line ${lineCount}, len: ${line.length}`);
  }
});

rl.on('close', () => {
  console.log('Done searching.');
});
