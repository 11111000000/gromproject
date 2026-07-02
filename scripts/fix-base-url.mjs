// scripts/fix-base-url.mjs
// Добавляет import.meta.env.BASE_URL ко всем внутренним ссылкам в .astro файлах
// БЕЗ двойных слешей: ${BASE_URL}/path (BASE_URL уже с /)

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function walk(dir, files = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (f.endsWith('.astro')) files.push(p);
  }
  return files;
}

let totalChanged = 0;
const files = walk('apps/web/src');

for (const f of files) {
  let content = readFileSync(f, 'utf-8');
  const orig = content;

  // 1. href="/ → href={`${import.meta.env.BASE_URL}` (без ведущего /)
  content = content.replace(/href="\/([^"]*)"/g, (match, path) => {
    return `href={\`\${import.meta.env.BASE_URL}${path}\`}`;
  });

  // 2. href={`/...  → href={`${import.meta.env.BASE_URL}...  (без ведущего /)
  content = content.replace(/href=\{`\/([^`]+)`\}/g, (match, path) => {
    return `href={\`\${import.meta.env.BASE_URL}${path}\`}`;
  });

  if (content !== orig) {
    writeFileSync(f, content);
    totalChanged++;
    console.log(`✓ ${f}`);
  }
}

console.log(`\nUpdated ${totalChanged} files`);
