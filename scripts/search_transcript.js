const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\willi\\.gemini\\antigravity\\brain\\0873d5b7-884e-4661-86a4-758a33d42ae1\\.system_generated\\logs\\transcript_full.jsonl';

const fileStream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineCount = 0;
let matchingLines = [];

rl.on('line', (line) => {
  lineCount++;
  if (line.includes('w2-ch1') || line.includes('NFS World Loop') || (line.includes('weekNumber') && line.includes('2'))) {
    matchingLines.push({ lineIndex: lineCount, length: line.length });
  }
});

rl.on('close', () => {
  console.log('Total lines in transcript_full:', lineCount);
  console.log('Matching lines with Week 2:', matchingLines.length);
  matchingLines.forEach(m => console.log('Line ' + m.lineIndex + ', len: ' + m.length));
});
