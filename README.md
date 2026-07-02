# ГРОМ38 — локальная разработка

Полностью локальная среда для разработки новой версии сайта **гром38.рф**.

## 🏗 Стек

- **Astro 5** (фронт) — статический сайт, Tailwind CSS
- **Hono** (бэк) — лёгкий API, Node.js
- **PostgreSQL 16** — данные (заказы, бронирования, отзывы)
- **Redis 7** — кэш, сессии
- **MinIO** — S3 mock (для фото)
- **MailHog** — email mock
- **Adminer** — DB UI

## 🚀 Быстрый старт

### 1. Установить зависимости
```bash
cd /home/za/Desktop/Grom/GromProject
npm install
```

### 2. Запустить Docker-сервисы
```bash
docker compose up -d
```

### 3. Запустить фронт + бэк
```bash
# Вариант A: в одном терминале
npm run dev

# Вариант B: в разных терминалах
npm run dev:web   # Astro на :4321
npm run dev:api   # Hono на :8787
```

## 🌐 URL'ы

| Сервис | URL | Учётные данные |
|---|---|---|
| **Astro (фронт)** | http://localhost:4321 | — |
| **Hono API (бэк)** | http://localhost:8787 | — |
| API Health | http://localhost:8787/health | — |
| API Products | http://localhost:8787/api/products | — |
| API Tours | http://localhost:8787/api/tours | — |
| API Agent | http://localhost:8787/api/agent/tools | — |
| **PostgreSQL** | localhost:5432 | grom / grom / grom_dev |
| **Redis** | localhost:6379 | — |
| **MinIO Console** | http://localhost:9001 | minioadmin / minioadmin |
| **MinIO S3** | http://localhost:9000 | — |
| **MailHog UI** | http://localhost:8025 | — |
| **Adminer (DB UI)** | http://localhost:8081 | postgres / grom / grom / grom_dev |

## 📁 Структура

```
GromProject/
├── apps/
│   ├── web/          # Astro 5 (фронт)
│   └── api/          # Hono (бэк)
├── packages/
│   └── db/
│       └── migrations/
│           └── 0001_initial.sql
├── docker-compose.yml
├── package.json
└── README.md
```

## 🛠 Команды

```bash
# Docker
docker compose up -d          # запустить
docker compose down           # остановить
docker compose logs -f        # логи
docker compose ps             # статус

# Dev
npm run dev                   # всё
npm run dev:web               # только фронт
npm run dev:api               # только бэк

# Production build
npm run build
```

## 📊 Каталог товаров (seed)

| SKU | Название | Цена | Рейтинг |
|---|---|---|---|
| 001 | Озёрные коньки неокрашенные | 7 800 ₽ | 5.0 (109) |
| 002 | Озёрные коньки окрашенные | 9 200 ₽ | 5.0 (109) |
| 003 | Лезвие неокрашенное | 6 600 ₽ | — |
| 004 | Лезвие окрашенное | 8 000 ₽ | — |
| 005 | Чехол | 1 200 ₽ | — |
| 006 | Крепление | 1 200 ₽ | — |

## 🗺 Туры (seed)

- **Байкал & Ольхон** (5 дней, 45 000 ₽)
- **Саяны & Тунка** (7 дней, 65 000 ₽)
- **Дацаны & этнотуры** (4 дня, 38 000 ₽)

## 🤖 AI-агент

```bash
# В будущем
curl http://localhost:8787/api/agent/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Какие лезвия есть в наличии?"}'
```

## 📚 Документация

См. `../Obsidian/` — база знаний проекта.

- [[../Obsidian/07-Technical/Local-Dev-Environment|Полный гайд]]
- [[../Obsidian/07-Technical/Stack-Recommendation|Стек]]
- [[../Obsidian/07-Technical/Hosting-RF-Recommendation|Хостинг]]
