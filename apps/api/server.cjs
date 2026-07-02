const { createServer } = require('http');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://grom:grom@localhost:5432/grom_dev',
});

const PRODUCTS = [
  { sku: '001', name: 'Озёрные коньки «ГРОМ» неокрашенные', price: 7800, rating: 5.0, reviews: 109, badge: 'Хит', category: 'finished' },
  { sku: '002', name: 'Озёрные коньки «ГРОМ» окрашенные', price: 9200, rating: 5.0, reviews: 109, badge: 'Хит', category: 'finished' },
  { sku: '003', name: 'Лезвие «ГРОМ» неокрашенное', price: 6600, rating: 0, reviews: 0, category: 'blades' },
  { sku: '004', name: 'Лезвие «ГРОМ» окрашенное', price: 8000, rating: 0, reviews: 0, category: 'blades' },
  { sku: '005', name: 'Чехол для коньков (байсов)', price: 1200, rating: 0, reviews: 0, category: 'accessories', badge: 'Хит' },
  { sku: '006', name: 'Механическое крепление (SNS/NNN)', price: 1200, rating: 0, reviews: 0, category: 'accessories' },
];

const TOURS = [
  { slug: 'baikal-olkhon', name: 'Байкал & Ольхон', desc: 'Ледовые пещеры, шаманские скалы.', days: 5, price: 45000, season: 'winter' },
  { slug: 'sayany-tunka', name: 'Саяны & Тунка', desc: 'Горные озёра, термальные источники.', days: 7, price: 65000, season: 'all' },
  { slug: 'datsans-etno', name: 'Дацаны & этнотуры', desc: 'Иволгинский дацан, юртовые лагеря.', days: 4, price: 38000, season: 'all' },
];

const json = (res, data, status = 200) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
};

const server = createServer(async (req, res) => {
  const start = Date.now();
  const { method, url } = req;

  if (method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }

  try {
    if (url === '/' || url === '') {
      return json(res, { service: 'grom-api', version: '0.1.0', docs: '/api/products, /api/tours, /health' });
    }
    if (url === '/health') {
      const pg = await pool.query('SELECT 1').then(() => 'ok').catch(() => 'error');
      return json(res, { status: pg === 'ok' ? 'healthy' : 'degraded', checks: { postgres: pg } });
    }
    if (url === '/api/products') {
      return json(res, { products: PRODUCTS, count: PRODUCTS.length });
    }
    if (url.startsWith('/api/products/')) {
      const sku = url.split('/').pop();
      const p = PRODUCTS.find(p => p.sku === sku);
      if (!p) return json(res, { error: 'Not found' }, 404);
      try {
        const { rows: reviews } = await pool.query('SELECT author_name, rating, text, created_at FROM reviews WHERE product_id = (SELECT id FROM products WHERE sku = $1) AND approved = true ORDER BY created_at DESC LIMIT 10', [sku]);
        return json(res, { product: p, reviews });
      } catch { return json(res, { product: p, reviews: [] }); }
    }
    if (url === '/api/tours') {
      return json(res, { tours: TOURS, count: TOURS.length });
    }
    if (url === '/api/orders' && method === 'POST') {
      let body = ''; req.on('data', c => body += c);
      req.on('end', async () => {
        try {
          const { product_id, customer_name, customer_phone } = JSON.parse(body);
          const inv = `inv_${Date.now()}`;
          return json(res, { order: { id: inv, status: 'pending' }, payment_url: `/pay?inv=${inv}` }, 201);
        } catch { return json(res, { error: 'Invalid JSON' }, 400); }
      });
      return;
    }
    if (url === '/api/agent/tools') {
      return json(res, { tools: ['search_products', 'create_order', 'get_product_info', 'list_tours', 'book_tour'] });
    }
    if (url === '/api/agent/chat' && method === 'POST') {
      let body = ''; req.on('data', c => body += c);
      req.on('end', () => {
        try {
          const { message } = JSON.parse(body);
          return json(res, { reply: `Принял: "${message}". Доступны товары: ${PRODUCTS.length} SKU, туры: ${TOURS.length}.`, t: new Date().toISOString() });
        } catch { return json(res, { error: 'Invalid JSON' }, 400); }
      });
      return;
    }
    json(res, { error: 'Not found', path: url }, 404);
  } catch (e) {
    json(res, { error: String(e) }, 500);
  } finally {
    console.log(`${method} ${url} - ${res.statusCode} (${Date.now() - start}ms)`);
  }
});

const port = Number(process.env.PORT) || 8787;
server.listen(port, '0.0.0.0', () => {
  console.log(`🥾 ГРОМ API на http://localhost:${port}`);
  console.log(`   Health: http://localhost:${port}/health`);
  console.log(`   Docs:   http://localhost:${port}/api/products`);
});
