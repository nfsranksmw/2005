const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\willi\\.gemini\\antigravity\\brain\\0873d5b7-884e-4661-86a4-758a33d42ae1\\.system_generated\\logs\\transcript_full.jsonl';

const fileStream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineCount = 0;

rl.on('line', (line) => {
  lineCount++;
  if (lineCount >= 2330 && lineCount <= 2340) {
    const obj = JSON.parse(line);
    console.log(`Line ${lineCount} [${obj.created_at}] Type: ${obj.type} Source: ${obj.source}`);
    if (obj.tool_calls) {
      obj.tool_calls.forEach(tc => {
        console.log(`  Tool: ${tc.name}`);
        if (tc.args && tc.args.CommandLine) console.log(`  CommandLine: ${tc.args.CommandLine}`);
      });
    }
    if (obj.content) {
      console.log(`  Content: ${String(obj.content).slice(0, 500)}`);
    }
  }
});
