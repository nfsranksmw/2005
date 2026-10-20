const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\willi\\.gemini\\antigravity\\brain\\0873d5b7-884e-4661-86a4-758a33d42ae1\\.system_generated\\logs\\transcript_full.jsonl';

const fileStream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineCount = 0;

rl.on('line', (line) => {
  lineCount++;
  // Look for any line containing 05:09.830 (the time of Nebula in Week 2 Ch 1 seen in line 2256!)
  if (line.includes('05:09.830')) {
    console.log(`Found 05:09.830 in line ${lineCount}, length: ${line.length}`);
  }
});

rl.on('close', () => {
  console.log('Finished search for 05:09.830.');
});
