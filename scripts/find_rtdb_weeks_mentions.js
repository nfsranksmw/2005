const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\willi\\.gemini\\antigravity\\brain\\0873d5b7-884e-4661-86a4-758a33d42ae1\\.system_generated\\logs\\transcript_full.jsonl';

const fileStream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineCount = 0;

rl.on('line', (line) => {
  lineCount++;
  try {
    if (line.includes('championship_weeks_data.json')) {
      const obj = JSON.parse(line);
      console.log(`Line ${lineCount} [${obj.created_at}] Type: ${obj.type} Source: ${obj.source}`);
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          console.log(`  Tool: ${tc.name}`);
          if (tc.args && tc.args.CommandLine) console.log(`  CommandLine: ${tc.args.CommandLine.slice(0, 150)}`);
        });
      }
    }
  } catch (e) {}
});

rl.on('close', () => {
  console.log('Finished search.');
});
