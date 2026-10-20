const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\willi\\.gemini\\antigravity\\brain\\0873d5b7-884e-4661-86a4-758a33d42ae1\\.system_generated\\logs\\transcript_full.jsonl';

const fileStream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineCount = 0;
const targets = [353, 554, 1291, 3201, 3436, 3951, 4130, 4228, 4393];

rl.on('line', (line) => {
  lineCount++;
  if (targets.includes(lineCount)) {
    try {
      const obj = JSON.parse(line);
      console.log(`Line ${lineCount} [${obj.created_at}] Type: ${obj.type} Source: ${obj.source}`);
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          console.log(`  Tool call: ${tc.name} TargetFile: ${tc.args ? tc.args.TargetFile || tc.args.AbsolutePath || '' : ''}`);
          if (tc.args && tc.args.Instruction) console.log(`  Instruction: ${tc.args.Instruction}`);
          if (tc.args && tc.args.CommandLine) console.log(`  CommandLine: ${tc.args.CommandLine.slice(0, 100)}`);
        });
      }
      if (obj.content && typeof obj.content === 'string') {
        console.log(`  Content preview: ${obj.content.slice(0, 150)}...`);
      }
    } catch (e) {
      console.log(`Line ${lineCount}: parse error`, e);
    }
  }
});

rl.on('close', () => {
  console.log('Done reading target lines.');
});
