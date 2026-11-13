// Прод-домен сайта — в одном месте.
//
// Astro подставляет import.meta.env.SITE из `site` в astro.config.mjs,
// поэтому canonical, hreflang, Open Graph и JSON-LD всегда указывают
// на домен, заданный при сборке. Домен в коде больше не дублируется.
export const SITE_URL = (import.meta.env.SITE || 'https://grom.sibres.tech').replace(/\/$/, '');
