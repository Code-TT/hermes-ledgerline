const { readFileSync } = require('fs');
const s = readFileSync('plugin.js', 'utf8');
const lines = s.split('\n');
const liveStart = s.indexOf('function LiveCard()');
const liveEnd = s.indexOf('function Chip()');

console.log('Lines that use `stored` as a variable (not a function call) in LiveCard:');
console.log('==========================================');
for (let i = s.indexOf('', liveStart); i >= 0; ) {
  const idx = s.indexOf(`\n`, i);
  if (idx === -1 || idx >= liveEnd) break;
  const line = s.slice(i, idx);
  i = idx + 1;
  
  // Find stored word boundary occurrences
  let pos = 0;
  const refs = [];
  while ((pos = line.indexOf('stored', pos)) !== -1) {
    const before = pos > 0 ? line[pos-1] : ' ';
    const after = pos + 6 < line.length ? line[pos+6] : ' ';
    const isWord = !/[a-zA-Z0-9$_]/.test(before) && !/[a-zA-Z0-9$_]/.test(after);
    if (isWord) refs.push({ index: pos, next: after });
    pos += 6;
  }
  if (refs.length === 0) continue;
  
  const allCalls = refs.every(r => r.next === '(' || r.next === '`');
  if (allCalls) continue;
  
  // Show actual line number
  const lineNum = s.substring(0, i - 1).split('\n').length;
  console.log(`L${lineNum}: ${line.trim()}`);
}