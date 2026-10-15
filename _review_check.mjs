import { readFileSync } from 'fs';
const s = readFileSync('plugin.js', 'utf8');
const liveStart = s.indexOf('function LiveCard()');
const chipStart = s.indexOf('function Chip()');
const body = s.slice(liveStart, chipStart);
const lines = body.split('\n');

console.log('=== LiveCard lines using bare `stored` (not as function call nor storedId/Tree/Cost/Session) ===');
for (let i = 0; i < lines.length; i++) {
  const m = [...lines[i].matchAll(/\bstored\b/g)];
  if (m.length === 0) continue;
  // skip if every use is stored(...), stored`...`, or .stored
  const allAreCalls = m.every(m => {
    const after = lines[i].slice(m.index + 6).trimStart();
    return after.startsWith('(') || after.startsWith('`') || false;
  });
  if (allAreCalls) continue;
  console.log(`L${liveStart + i}: ${lines[i].trim().substring(0, 140)}`);
}