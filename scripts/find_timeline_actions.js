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
    if (ts.startsWith('2026-10-13') || ts.startsWith('2026-10-14')) {
      if (obj.type === 'USER_INPUT') {
        console.log(`Line ${lineCount} [${ts}] USER_INPUT: ${String(obj.content).slice(0, 120)}...`);
      } else if (obj.tool_calls && obj.tool_calls.length > 0) {
        obj.tool_calls.forEach(tc => {
          if (tc.name === 'replace_file_content' || tc.name === 'write_to_file' || tc.name === 'run_command') {
            const target = tc.args ? (tc.args.TargetFile || tc.args.CommandLine || '') : '';
            if (target.includes('admin') || target.includes('blacklist') || target.includes('week') || target.includes('tournament') || target.includes('Firebase') || target.includes('PUT') || target.includes('records')) {
              console.log(`Line ${lineCount} [${ts}] TOOL: ${tc.name} -> ${target.slice(0, 100)}`);
              if (tc.args && tc.args.Instruction) console.log(`   Instruction: ${tc.args.Instruction}`);
            }
          }
        });
      }
    }
  } catch (e) {}
});

rl.on('close', () => {
  console.log('Finished timeline search.');
});
