-- ГРОМ38 — начальная миграция
-- Заказы, бронирования туров, отзывы

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    size VARCHAR(20),
    quantity INTEGER DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    robokassa_inv_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tours (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_days INTEGER,
    price DECIMAL(10, 2) NOT NULL,
    max_people INTEGER,
    season VARCHAR(50),
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    tour_date DATE NOT NULL,
    people_count INTEGER DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    robokassa_inv_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    author_name VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed данные (на основе реального каталога ГРОМ)
INSERT INTO products (sku, name, price, category, description) VALUES
('001', 'Озёрные коньки «ГРОМ» неокрашенные (байсы/нордики)', 7800.00, 'finished',
 'Российские озёрные коньки собственной разработки. Сталь 420, толщина 2 мм. Под лыжные ботинки NNN/SNS. 109 отзывов с рейтингом 5.00.'),
('002', 'Озёрные коньки «ГРОМ» окрашенные (байсы/нордики)', 9200.00, 'finished',
 'Премиум-версия с антикоррозийным покрытием. Сталь 420, толщина 2 мм. Под лыжные ботинки NNN/SNS. 109 отзывов с рейтингом 5.00.'),
('003', 'Лезвие «ГРОМ» неокрашенное', 6600.00, 'blades',
 'Стальное лезвие для открытого льда. Длина 480 мм. Под лыжные ботинки NNN/SNS.'),
('004', 'Лезвие «ГРОМ» окрашенное', 8000.00, 'blades',
 'Лезвие с антикоррозийным покрытием. Длина 480 мм. Под лыжные ботинки NNN/SNS.'),
('005', 'Чехол для коньков (байсов)', 1200.00, 'accessories',
 'Чехол для хранения и транспортировки озёрных коньков. Плотная мебельная ткань с ворсом.'),
('006', 'Механическое крепление (SNS/NNN)', 1200.00, 'accessories',
 'Крепление с металлическими несущими для лыжных ботинок NNN/SNS.')
ON CONFLICT (sku) DO NOTHING;

INSERT INTO tours (slug, name, description, duration_days, price, max_people, season) VALUES
('baikal-olkhon', 'Байкал & Ольхон',
 'Ледовые пещеры, шаманские скалы, чистейший лёд и незабываемые закаты. Зимний тур на Байкал.', 5, 45000.00, 8, 'winter'),
('sayany-tunka', 'Саяны & Тунка',
 'Горные озёра, термальные источники, треккинг к вулканам и бурятские стойбища.', 7, 65000.00, 6, 'all'),
('datsans-etno', 'Дацаны & этнотуры',
 'Иволгинский дацан, буддийские философии, юртовые лагеря и бурятская кухня.', 4, 38000.00, 10, 'all')
ON CONFLICT (slug) DO NOTHING;

-- Несколько отзывов (для демо)
INSERT INTO reviews (product_id, author_name, rating, text) VALUES
(1, 'Антон', 5, 'Откатал за сезон порядка 700км, не точил. Коньки практически едут сами.'),
(1, 'Алексей', 5, 'Все прекрасно! Прекрасная обработка металла, прекрасная форма лезвий.'),
(1, 'Анна', 5, 'Все отлично! Товар полностью соответствует описанию, продавец помог с размером.'),
(1, 'Михаил', 5, 'Очень лёгкие байсы, продавец порядочный, рекомендую.'),
(1, 'Сергей', 5, 'Коньки шикарные, сразу видно, что держишь в руках вещь.');

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(tour_date);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
