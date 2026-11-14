#!/usr/bin/env node
// scripts/check-themes.mjs — проверка контраста тем оформления.
//
// Источник истины — apps/web/src/lib/themes.mjs (там же палитра, из которой
// Base.astro генерирует CSS). Скрипт считает контраст всех смысловых пар
// токенов и падает с ненулевым кодом, если какая-то пара ниже порога.
//
// Пороги: WCAG 2.1 AA — 4.5:1 для текста, 3:1 для границ и UI-элементов.
//
// Запуск: npm run check:themes

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { THEMES } = await import(resolve(__dirname, '../apps/web/src/lib/themes.mjs'));

/** Разбор #rgb / #rrggbb. */
function parseHex(hex) {
  let h = String(hex).trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/** Относительная яркость по WCAG. */
function luminance(rgb) {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Контраст между двумя цветами. */
function contrast(a, b) {
  const ca = parseHex(a);
  const cb = parseHex(b);
  if (!ca || !cb) return null;
  const la = luminance(ca);
  const lb = luminance(cb);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Пары токенов, которые реально встречаются на странице.
 * [foreground, background, минимальный контраст, что проверяем]
 */
const PAIRS = [
  ['text', 'bg', 4.5, 'основной текст на фоне'],
  ['text', 'surface', 4.5, 'основной текст на карточке'],
  ['muted', 'bg', 4.5, 'вторичный текст на фоне'],
  ['muted', 'surface', 4.5, 'вторичный текст на карточке'],
  ['heading', 'bg', 4.5, 'заголовок на фоне'],
  ['accent-fg', 'accent', 4.5, 'текст на кнопке'],
  ['accent-text', 'bg', 4.5, 'акцент-текст на фоне'],
  ['accent-text', 'surface', 4.5, 'акцент-текст на карточке'],
  ['accent-text', 'band-bg', 4.5, 'акцент-текст на полосе'],
  ['accent-border', 'bg', 3, 'граница акцента на фоне'],
  ['accent-border', 'band-bg', 3, 'граница акцента на полосе'],
  ['band-fg', 'band-bg', 4.5, 'текст на инверсной полосе'],
  ['band-accent', 'band-bg', 4.5, 'акцент на инверсной полосе'],
  ['header-fg', 'header-bg', 4.5, 'текст в шапке'],
  ['header-accent', 'header-bg', 4.5, 'акцент в шапке'],
  ['footer-fg', 'footer-bg', 4.5, 'текст в подвале'],
  ['footer-accent', 'footer-bg', 4.5, 'акцент в подвале'],
];

let failures = 0;
const rows = [];

for (const theme of THEMES) {
  for (const [fg, bg, min, label] of PAIRS) {
    const fgValue = theme.tokens[fg];
    const bgValue = theme.tokens[bg];
    if (!fgValue || !bgValue) {
      console.error(`❌ ${theme.key}: нет токена ${!fgValue ? fg : bg}`);
      failures++;
      continue;
    }
    const ratio = contrast(fgValue, bgValue);
    if (ratio === null) {
      console.error(`❌ ${theme.key}: не разобран цвет ${fg}=${fgValue} / ${bg}=${bgValue}`);
      failures++;
      continue;
    }
    const ok = ratio >= min;
    if (!ok) failures++;
    rows.push({
      theme: theme.key,
      label,
      pair: `${fg} / ${bg}`,
      ratio: ratio.toFixed(2),
      min: min.toFixed(1),
      ok: ok ? '✓' : '✗',
    });
  }
}

const width = Math.max(...rows.map((r) => r.label.length));
console.log('Тема     Проверка'.padEnd(width + 12) + 'Пара                Контраст  Норма');
console.log('-'.repeat(width + 52));
for (const r of rows) {
  console.log(
    `${r.theme.padEnd(9)}${r.label.padEnd(width)}  ${r.pair.padEnd(20)} ${r.ratio.padStart(6)}   ${r.min}  ${r.ok}`
  );
}

if (failures > 0) {
  console.error(`\n❌ Провалов контраста: ${failures}`);
  process.exit(1);
}
console.log(`\n✅ Контраст в норме: ${THEMES.length} тем × ${PAIRS.length} пар = ${rows.length} проверок`);
