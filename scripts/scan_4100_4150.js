const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\willi\\.gemini\\antigravity\\brain\\0873d5b7-884e-4661-86a4-758a33d42ae1\\.system_generated\\logs\\transcript_full.jsonl';

const fileStream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineCount = 0;

rl.on('line', (line) => {
  lineCount++;
  if (lineCount >= 4100 && lineCount <= 4150) {
    try {
      const obj = JSON.parse(line);
      console.log(`\nLine ${lineCount} [${obj.created_at}] Type: ${obj.type} Source: ${obj.source}`);
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          console.log(`  Tool: ${tc.name}`);
          if (tc.args) {
            console.log(`    TargetFile: ${tc.args.TargetFile || ''}`);
            console.log(`    Instruction: ${tc.args.Instruction || ''}`);
            if (tc.args.CommandLine) console.log(`    CommandLine: ${tc.args.CommandLine}`);
          }
        });
      }
      if (obj.type === 'USER_INPUT') {
        console.log(`  USER_INPUT: ${obj.content}`);
      }
    } catch (e) {}
  }
});

rl.on('close', () => {
  console.log('Finished 4100-4150 scan.');
});
