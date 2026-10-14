const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\willi\\.gemini\\antigravity\\brain\\0873d5b7-884e-4661-86a4-758a33d42ae1\\.system_generated\\logs\\transcript_full.jsonl';

const fileStream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lineCount = 0;

rl.on('line', (line) => {
  lineCount++;
  if (lineCount === 1291) {
    const obj = JSON.parse(line);
    if (obj.tool_calls && obj.tool_calls[0] && obj.tool_calls[0].args) {
      fs.writeFileSync('scripts/recovered_scratch_update_week2.js', obj.tool_calls[0].args.CodeContent, 'utf8');
      console.log('Saved recovered_scratch_update_week2.js');
    }
  }
});
