const { readFileSync } = require('fs');

for (const f of ['plugin.js', 'catalog/desktop/plugin.js']) {
  const s = readFileSync(f, 'utf8');
  const liveStart = s.indexOf('function LiveCard()');
  const chipStart = s.indexOf('function Chip()');
  const body = s.slice(liveStart, chipStart);
  const lines = body.split('\n');
  
  console.log('=== ' + f + ' ===');
  let found = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
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
    const allCalls = refs.every(r => r.next === '(' || r.next === '`');
    if (allCalls) continue;
    console.log('  L' + (liveStart + i + 1) + ': ' + line.trim());
    found = true;
  }
  if (!found) console.log('  (no dangling stored references)');
}