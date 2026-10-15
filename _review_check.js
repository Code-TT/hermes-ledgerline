const { readFileSync } = require('fs');
const s = readFileSync('plugin.js', 'utf8');
const liveStart = s.indexOf('function LiveCard()');
const chipStart = s.indexOf('function Chip()');
const body = s.slice(liveStart, chipStart);
const lines = body.split('\n');

console.log('=== LiveCard lines referencing bare stored variable ===');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Find all stored word boundaries
  let idx = 0;
  const refs = [];
  while ((idx = line.indexOf('stored', idx)) !== -1) {
    const preceding = idx === 0 ? '' : line[idx-1];
    const following = idx + 6 < line.length ? line[idx+6] : '';
    const isWord = /[a-zA-Z0-9$_]/.test(preceding) === false && /[a-zA-Z0-9$_]/.test(following) === false;
    if (isWord) refs.push({ idx, next: following });
    idx += 6;
  }
  if (refs.length === 0) continue;
  // Check if every use is a function call (stored(...)) or tagged template (stored`...`)
  const allCalls = refs.every(r => r.next === '(' || r.next === '`');
  if (allCalls) continue;
  console.log('L' + (liveStart + i + 1) + ': ' + line.trim().substring(0, 140));
}