#!/usr/bin/env node
// scripts/build-i18n.mjs — генерирует apps/web/public/i18n.json из
// apps/web/src/i18n/translations.ts.
//
// Источник истины — translations.ts (235 ключей на язык). Раньше словарь
// был продублирован в этом файле (60 ключей) и в public/i18n.json (116),
// из-за чего переключатель языка на клиенте молча терял половину строк.
//
// Node 22 умеет strip-types, поэтому .ts импортируется напрямую.

import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { t } = await import(resolve(__dirname, '../apps/web/src/i18n/translations.ts'));

const outDir = resolve(__dirname, '../apps/web/public');
mkdirSync(outDir, { recursive: true });

const outFile = resolve(outDir, 'i18n.json');
writeFileSync(outFile, JSON.stringify(t, null, 2) + '\n', 'utf-8');

const langs = Object.keys(t);
const counts = langs.map((l) => `${l}=${Object.keys(t[l]).length}`);
console.log(`✅ i18n.json written to ${outFile} (${counts.join(', ')})`);

// Сверка ключей между языками: расхождение = баг в словаре.
const ref = Object.keys(t[langs[0]]).sort();
for (const lang of langs.slice(1)) {
  const keys = Object.keys(t[lang]).sort();
  const missing = ref.filter((k) => !keys.includes(k));
  const extra = keys.filter((k) => !ref.includes(k));
  if (missing.length || extra.length) {
    console.warn(`⚠️  ${lang}: нет ${missing.length} (${missing.slice(0, 8).join(', ')}) / лишних ${extra.length}`);
    process.exitCode = 1;
  }
}
