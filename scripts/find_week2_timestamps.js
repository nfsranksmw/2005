const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\willi\\.gemini\\antigravity\\brain\\0873d5b7-884e-4661-86a4-758a33d42ae1\\.system_generated\\logs\\transcript_full.jsonl';

const fileStream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineCount = 0;

rl.on('line', (line) => {
  lineCount++;
  try {
    const obj = JSON.parse(line);
    const ts = obj.created_at || '';
    // Check if line contains CHAMPIONSHIP_WEEKS_DATA or week 2 challenges
    const str = JSON.stringify(obj);
    if (str.includes('"2":') && str.includes('Semana 2') && str.includes('challenges')) {
      console.log(`Line ${lineCount} [${ts}] Type: ${obj.type} Source: ${obj.source}`);
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          console.log(`  Tool call: ${tc.name} on ${tc.args ? tc.args.TargetFile || tc.args.AbsolutePath || '' : ''}`);
        });
      }
    }
  } catch (e) {}
});

rl.on('close', () => {
  console.log('Done scanning timestamps.');
});
