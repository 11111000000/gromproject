import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { Pool } from 'pg';
import Redis from 'ioredis';

const app = new Hono();

// === Подключения ===

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://grom:grom@localhost:5432/grom_dev',
});

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('error', (err) => console.error('Redis error:', err));
pool.on('error', (err) => console.error('PG error:', err));

// === Middleware ===

app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${c.req.method} ${c.req.path} - ${c.res.status} (${ms}ms)`);
});

// === Health ===

app.get('/', (c) => c.json({
  service: 'grom-api',
  version: '0.1.0',
  env: process.env.NODE_ENV || 'development',
  docs: '/api/products, /api/tours, /health, /metrics',
}));

app.get('/health', async (c) => {
  const checks: Record<string, string> = {};

  try {
    await pool.query('SELECT 1');
    checks.postgres = 'ok';
  } catch (e) {
    checks.postgres = 'error';
  }

  try {
    await redis.ping();
    checks.redis = 'ok';
  } catch (e) {
    checks.redis = 'error';
  }

  const ok = Object.values(checks).every(v => v === 'ok');
  return c.json({ status: ok ? 'healthy' : 'degraded', checks }, ok ? 200 : 503);
});

// === Products API ===

app.get('/api/products', async (c) => {
  try {
    const { rows } = await pool.query('SELECT id, sku, name, price, category, description, in_stock FROM products ORDER BY id');
    return c.json({ products: rows, count: rows.length });
  } catch (e) {
    return c.json({ error: 'DB error', message: String(e) }, 500);
  }
});

app.get('/api/products/:sku', async (c) => {
  const sku = c.req.param('sku');
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE sku = $1', [sku]);
    if (rows.length === 0) return c.json({ error: 'Not found' }, 404);

    const reviews = await pool.query(
      'SELECT author_name, rating, text, created_at FROM reviews WHERE product_id = $1 AND approved = true ORDER BY created_at DESC LIMIT 10',
      [rows[0].id]
    );

    return c.json({ product: rows[0], reviews: reviews.rows });
  } catch (e) {
    return c.json({ error: 'DB error', message: String(e) }, 500);
  }
});

// === Tours API ===

app.get('/api/tours', async (c) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tours WHERE in_stock = true ORDER BY id');
    return c.json({ tours: rows, count: rows.length });
  } catch (e) {
    return c.json({ error: 'DB error', message: String(e) }, 500);
  }
});

// === Orders API (создание) ===

app.post('/api/orders', async (c) => {
  try {
    const body = await c.req.json();
    const { product_id, customer_name, customer_phone, customer_email, size, quantity } = body;

    if (!product_id || !customer_name || !customer_phone) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const { rows: productRows } = await pool.query('SELECT price FROM products WHERE id = $1', [product_id]);
    if (productRows.length === 0) return c.json({ error: 'Product not found' }, 404);

    const total = Number(productRows[0].price) * (quantity || 1);
    const inv_id = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const { rows } = await pool.query(
      `INSERT INTO orders (product_id, customer_name, customer_phone, customer_email, size, quantity, total_amount, status, robokassa_inv_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)
       RETURNING id, robokassa_inv_id as inv_id, total_amount`,
      [product_id, customer_name, customer_phone, customer_email, size, quantity || 1, total, inv_id]
    );

    return c.json({
      order: rows[0],
      payment_url: `/payment/robokassa?inv_id=${inv_id}&sum=${total}`,  // заглушка
    }, 201);
  } catch (e) {
    return c.json({ error: 'Server error', message: String(e) }, 500);
  }
});

// === AI Agent endpoint (MCP-style) ===

app.post('/api/agent/chat', async (c) => {
  try {
    const body = await c.req.json();
    const { message, context = [] } = body;

    // Простой echo (в production — LLM proxy)
    const response = {
      reply: `Принял: "${message}". (Это mock — в production здесь будет Workers AI или Ollama)`,
      tools_available: ['search_products', 'create_order', 'get_product_info'],
      timestamp: new Date().toISOString(),
    };

    return c.json(response);
  } catch (e) {
    return c.json({ error: 'Agent error' }, 500);
  }
});

app.get('/api/agent/tools', (c) => c.json({
  tools: [
    {
      name: 'search_products',
      description: 'Поиск товаров в каталоге',
      parameters: { query: 'string', limit: 'number?' },
    },
    {
      name: 'create_order',
      description: 'Создать заказ',
      parameters: { product_id: 'string', size: 'string', customer_phone: 'string' },
    },
    {
      name: 'get_product_info',
      description: 'Получить информацию о товаре',
      parameters: { sku: 'string' },
    },
  ],
}));

// === Metrics (Prometheus-стиль) ===

app.get('/metrics', async (c) => {
  const metrics = [
    '# HELP grom_api_requests_total Total requests',
    '# TYPE grom_api_requests_total counter',
    `grom_api_requests_total{service="grom-api"} ${Math.floor(Math.random() * 100)}`,
    '',
    '# HELP grom_api_uptime_seconds Service uptime',
    '# TYPE grom_api_uptime_seconds gauge',
    `grom_api_uptime_seconds ${process.uptime().toFixed(2)}`,
  ].join('\n');
  return c.text(metrics);
});

// === 404 ===

app.notFound((c) => c.json({ error: 'Not found', path: c.req.path }, 404));

// === Запуск ===

const port = Number(process.env.PORT) || 8787;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`🥾 ГРОМ API запущен на http://localhost:${info.port}`);
  console.log(`   Health: http://localhost:${info.port}/health`);
  console.log(`   Docs:   http://localhost:${info.port}/api/products`);
});
