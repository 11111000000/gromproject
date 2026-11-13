#!/usr/bin/env node
// scripts/build-sitemap.mjs — генерирует sitemap.xml по фактическим
// маршрутам собранного сайта.
//
// Зачем: sitemap, написанный руками, разъезжается с реальными страницами
// (в предыдущей версии в нём не было /pro/ и /sravnenie/, а после удаления
// страницы запись оставалась). Источник истины — dist/.
//
// Использование:
//   node scripts/build-sitemap.mjs [distDir] [siteUrl]
//   по умолчанию: apps/web/dist, https://grom.sibres.tech

import { readdirSync, statSync, writeFileSync, rmSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, join, relative } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const distDir = resolve(process.argv[2] ?? resolve(__dirname, '../apps/web/dist'));
const siteUrl = (process.argv[3] ?? 'https://grom.sibres.tech').replace(/\/$/, '');

if (!existsSync(distDir)) {
  console.error(`ERROR: dist не найден: ${distDir} (сначала npm run build)`);
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

// Страница = index.html внутри директории. 404.html в корне исключаем.
// Вместе с путём сразу берём mtime файла — из него делается <lastmod>.
const pages = walk(distDir)
  .filter((f) => f.endsWith('index.html'))
  .map((f) => {
    const rel = relative(distDir, dirname(f)).split('\\').join('/');
    const path = rel === '' ? '/' : `/${rel}/`;
    return { path, lastmod: statSync(f).mtime.toISOString().slice(0, 10) };
  })
  .filter((p) => p.path !== '/404/')
  .sort((a, b) => a.path.localeCompare(b.path));

const PRIORITY = {
  '/': '1.0',
  '/catalog/': '0.9',
  '/tours/': '0.9',
};
const FREQ = {
  '/': 'weekly',
  '/catalog/': 'weekly',
  '/product/': 'monthly',
  '/tours/': 'weekly',
};

function priorityFor(path) {
  if (PRIORITY[path]) return PRIORITY[path];
  if (path.startsWith('/product/')) return '0.8';
  if (path.startsWith('/tours/')) return '0.7';
  return '0.6';
}

function freqFor(path) {
  for (const [prefix, freq] of Object.entries(FREQ)) {
    if (path.startsWith(prefix)) return freq;
  }
  return 'monthly';
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map(
    (p) =>
      `  <url>\n    <loc>${siteUrl}${p.path}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${freqFor(p.path)}</changefreq>\n    <priority>${priorityFor(p.path)}</priority>\n  </url>`
  ),
  '</urlset>',
  '',
].join('\n');

const outFile = join(distDir, 'sitemap.xml');
// public/sitemap.xml копируется Astro в dist/ первым — перезаписываем.
rmSync(outFile, { force: true });
writeFileSync(outFile, xml, 'utf-8');

console.log(`✅ sitemap.xml: ${pages.length} страниц → ${outFile}`);
for (const p of pages) console.log(`   ${siteUrl}${p.path}`);
