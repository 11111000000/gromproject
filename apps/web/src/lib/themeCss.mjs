/**
 * Контракт оформления ГРОМ: как Tailwind-классы соотносятся с токенами темы.
 *
 * Ключевая идея — «контекстные переменные». CSS-переменные наследуются, поэтому
 * тёмная/светлая поверхность переопределяет их для своих потомков:
 *
 *   :root            → светлая поверхность страницы
 *   .bg-thunder      → инверсная полоса (герой, PRO, отзывы, калькулятор)
 *   .bg-thunder/95   → шапка
 *   .bg-steel        → подвал
 *
 * Благодаря этому весь существующий код страниц (`text-frost`, `text-bolt`,
 * `border-frost/30`, `bg-frost/5`) становится правильным в любой теме без
 * переписывания вёрстки.
 */

import { THEMES, DEFAULT_THEME, getTheme, themeCssVars } from './themes.mjs';

const CONTRACT_CSS = `
/* ═══════════════════════════════════════════════════════════════════
   1. КОНТЕКСТНЫЕ ПЕРЕМЕННЫЕ
   ═══════════════════════════════════════════════════════════════════ */
:root {
  --ctx-fg: var(--text);
  --ctx-accent: var(--accent-text);
  --ctx-accent-border: var(--accent-border);
  --ctx-frost: var(--bg);
  --ctx-card: var(--surface);
  --ctx-border: var(--border);
}

/* Инверсная полоса: герой, PRO-серия, отзывы, калькулятор */
.bg-thunder {
  background-color: var(--band-bg) !important;
  --ctx-fg: var(--band-fg);
  --ctx-accent: var(--band-accent);
  --ctx-accent-border: var(--band-border);
  --ctx-frost: var(--surface);
  --ctx-card: var(--surface);
  --ctx-border: var(--band-border);
}

/* Шапка */
.bg-thunder\\/95,
.bg-thunder\\/98 {
  background-color: var(--header-bg) !important;
  --ctx-fg: var(--header-fg);
  --ctx-accent: var(--header-accent);
  --ctx-accent-border: var(--border);
  --ctx-frost: var(--surface);
  --ctx-card: var(--surface);
  --ctx-border: var(--border);
}

/* Подвал */
.bg-steel {
  background-color: var(--footer-bg) !important;
  --ctx-fg: var(--footer-fg);
  --ctx-accent: var(--footer-accent);
  --ctx-accent-border: var(--footer-accent);
  --ctx-frost: var(--surface);
  --ctx-card: var(--surface);
  --ctx-border: var(--border);
}

/* ═══════════════════════════════════════════════════════════════════
   2. КЛАСС → ТОКЕН
   ═══════════════════════════════════════════════════════════════════ */
.text-thunder                     { color: var(--heading) !important; }
.text-steel                       { color: var(--text) !important; }
.text-bolt                        { color: var(--ctx-accent) !important; }
.text-ice                         { color: var(--accent-2) !important; }

.text-frost                       { color: var(--ctx-fg) !important; }
.text-frost\\/80                   { color: var(--ctx-fg) !important; opacity: 0.8; }
.text-frost\\/70                   { color: var(--ctx-fg) !important; opacity: 0.7; }
.text-frost\\/60                   { color: var(--ctx-fg) !important; opacity: 0.6; }
.text-frost\\/75                   { color: var(--ctx-fg) !important; opacity: 0.75; }
.text-frost\\/85                   { color: var(--ctx-fg) !important; opacity: 0.85; }
.text-frost\\/50                   { color: var(--ctx-fg) !important; opacity: 0.5; }
.text-frost\\/40                   { color: var(--ctx-fg) !important; opacity: 0.4; }
.text-frost\\/90                   { color: var(--ctx-fg) !important; opacity: 0.9; }
.placeholder\\:text-frost\\/40::placeholder { color: var(--ctx-fg) !important; opacity: 0.45; }

.text-frost-dark                  { color: var(--heading) !important; }
.text-frost-dark\\/80,
.text-frost-dark\\/70,
.text-frost-dark\\/60,
.text-frost-dark\\/50              { color: var(--text) !important; opacity: 0.85; }

.bg-frost                         { background-color: var(--ctx-frost) !important; }
.bg-white                         { background-color: var(--surface) !important; }
.bg-white\\/5                      { background-color: rgba(var(--ink-rgb), 0.05) !important; }
.bg-bolt                          { background-color: var(--accent) !important; color: var(--accent-fg) !important; }
.bg-ice                           { background-color: var(--accent-2) !important; }
.bg-frost-dark\\/30                { background-color: rgba(var(--ink-rgb), 0.08) !important; }
.bg-frost\\/5                      { background-color: rgba(var(--ink-rgb), 0.05) !important; }
.bg-frost\\/10                     { background-color: rgba(var(--ink-rgb), 0.10) !important; }
.bg-bolt\\/5                       { background-color: rgba(var(--accent-rgb), 0.05) !important; }
.bg-bolt\\/10                      { background-color: rgba(var(--accent-rgb), 0.10) !important; }
.bg-bolt\\/20                      { background-color: rgba(var(--accent-rgb), 0.20) !important; }
.bg-bolt\\/30                      { background-color: rgba(var(--accent-rgb), 0.30) !important; }
.bg-ice-dark                      { background-color: var(--accent-2) !important; }

.border-frost-dark                 { border-color: var(--ctx-border) !important; }
.border-frost\\/30                  { border-color: rgba(var(--ink-rgb), 0.30) !important; }
.border-frost\\/40                  { border-color: rgba(var(--ink-rgb), 0.40) !important; }
.border-frost\\/20                  { border-color: rgba(var(--ink-rgb), 0.20) !important; }
.border-frost\\/10                  { border-color: rgba(var(--ink-rgb), 0.10) !important; }
.border-bolt                       { border-color: var(--ctx-accent-border) !important; }
.border-bolt\\/40                   { border-color: rgba(var(--accent-rgb), 0.40) !important; }
.border-bolt\\/20                   { border-color: rgba(var(--accent-rgb), 0.20) !important; }
.border-ice\\/30, .border-ice\\/40  { border-color: rgba(var(--accent-rgb), 0.40) !important; }

/* Варианты с hover/focus — Tailwind генерирует их отдельными селекторами,
   поэтому переопределять приходится здесь же. */
.hover\\:border-bolt:hover        { border-color: var(--ctx-accent-border) !important; }
.hover\\:text-bolt:hover          { color: var(--ctx-accent) !important; }
.hover\\:bg-bolt:hover            { background-color: var(--accent) !important; }
.hover\\:bg-bolt\\/5:hover        { background-color: rgba(var(--accent-rgb), 0.05) !important; }
.hover\\:bg-bolt\\/10:hover       { background-color: rgba(var(--accent-rgb), 0.10) !important; }
.focus\\:border-bolt:focus        { border-color: var(--ctx-accent-border) !important; }
.group:hover .group-hover\\:text-bolt { color: var(--ctx-accent) !important; }

/* ═══════════════════════════════════════════════════════════════════
   3. ПЕРЕКЛЮЧАТЕЛЬ ТЕМ И ЯЗЫКА
   ═══════════════════════════════════════════════════════════════════ */
.theme-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(var(--ink-rgb), 0.06);
  border: 1px solid rgba(var(--ink-rgb), 0.14);
  padding: 2px 4px;
}
.theme-btn {
  border: 1px solid transparent;
  cursor: pointer;
  transition: all .2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  background: transparent;
  color: var(--ctx-fg);
  font-family: inherit;
}
.theme-btn:hover { border-color: var(--ctx-accent); }
.theme-btn.active {
  border-color: var(--ctx-accent);
  background: rgba(var(--accent-rgb), 0.18);
}
#lang-switcher .theme-btn {
  padding: 2px 5px;
  font-weight: 700;
  letter-spacing: .04em;
}

.theme-current {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 3px 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: var(--ctx-fg);
  white-space: nowrap;
}
.theme-current:hover { color: var(--ctx-accent); }
.theme-swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid rgba(var(--ink-rgb), 0.25);
  background: linear-gradient(135deg, var(--sw-bg, #e9f2f7) 50%, var(--sw-accent, #1a6f9c) 50%);
}
.theme-caret { font-size: 9px; opacity: .6; }

.theme-panel {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  z-index: 60;
  width: 236px;
  max-height: 70vh;
  overflow-y: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: 0 18px 40px -12px rgba(10, 25, 41, .45);
  padding: 6px;
  display: none;
}
.theme-panel.is-open { display: block; }
.theme-panel-title {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .16em;
  color: var(--muted);
  padding: 8px 8px 4px;
}
.theme-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  text-align: left;
  padding: 6px 8px;
  font-size: 12px;
  color: var(--text);
  cursor: pointer;
  background: transparent;
  border: 1px solid transparent;
}
.theme-row:hover { background: var(--surface-2); }
.theme-row.active {
  border-color: var(--accent-border);
  background: rgba(var(--accent-rgb), .10);
}
.theme-row .theme-row-note {
  font-size: 10px;
  color: var(--muted);
  margin-left: auto;
  text-align: right;
}
.theme-row .theme-swatch { width: 18px; height: 18px; }

/* На узких экранах в шапке остаётся только кружок — название не помещается. */
@media (max-width: 640px) {
  .theme-current-name { display: none; }
  .theme-current { padding: 3px 2px; }
  .theme-panel { right: -8px; width: 210px; }
  .theme-row .theme-row-note { display: none; }
}
`;

/**
 * Полный CSS тем: блоки переменных + контракт «класс → токен».
 *
 * Селектор темы — `html[data-theme=…]`, а не просто `[data-theme=…]`:
 * в переключателе строки тем тоже несут атрибут data-theme, и общий
 * селектор применял бы к такой строке чужой набор токенов.
 *
 * @returns {string}
 */
export function buildThemeCss() {
  const fallback = getTheme(DEFAULT_THEME);
  const blocks = [
    '/* Темы ГРОМ — сгенерировано из src/lib/themes.mjs. Правьте палитру там. */',
    `:root { ${themeCssVars(fallback)} }`,
    ...THEMES.map((t) => `html[data-theme="${t.key}"] { ${themeCssVars(t)} }`),
    CONTRACT_CSS,
  ];
  return blocks.join('\n');
}
