# Деплой Cemented Future — Бесплатный хостинг

## Важно понять перед деплоем

Проект использует Node.js `fs` (чтение/запись файла `data/db.json`).  
Это работает только на **серверах с постоянной файловой системой**.  
Serverless-платформы (Vercel, Netlify, Cloudflare Workers) **не подойдут** без замены БД.

---

## Вариант 1: Railway (Рекомендуется — проще всего)

**Почему Railway:** $5 бесплатных кредитов в месяц, постоянная файловая система, деплой через GitHub за 5 минут. Код менять не нужно.

### Шаги

**1. Создай GitHub репозиторий**

```bash
# В папке проекта
git init
git add .
git commit -m "feat: initial commit"
```

Зайди на [github.com](https://github.com) → **New repository** → назови `cemented-future` → создай.

```bash
git remote add origin https://github.com/ВАШ_USERNAME/cemented-future.git
git push -u origin main
```

**2. Зарегистрируйся на Railway**

- Зайди на [railway.app](https://railway.app)
- Нажми **Start a New Project**
- Войди через GitHub

**3. Создай проект**

- Нажми **New Project** → **Deploy from GitHub repo**
- Выбери `cemented-future`
- Railway автоматически определит Node.js проект

**4. Настрой переменные окружения**

В Railway → вкладка **Variables** добавь:

```
NODE_ENV=production
ADMIN_PASSWORD=твой_пароль
```

> Если у тебя есть другие `.env` переменные — добавь их сюда.

**5. Настрой команды сборки и запуска**

В Railway → вкладка **Settings** → **Build & Deploy**:

| Поле | Значение |
|------|----------|
| Build Command | `npm install && npm run build` |
| Start Command | `node .output/server/index.mjs` |

> `.output/server/index.mjs` — стандартный выход nitro. Если не работает, попробуй `node dist/server/index.mjs`.

**6. Добавь постоянный диск (Persistent Volume)**

В Railway → вкладка **Volumes** → **Add Volume**:
- Mount Path: `/app/data`
- Это сохранит `data/db.json` между перезапусками

**7. Получи публичный URL**

В Railway → вкладка **Settings** → **Networking** → **Generate Domain**.  
Получишь URL вида: `https://cemented-future-production.up.railway.app`

---

## Вариант 2: Render (Бесплатно, но с ограничениями)

**Минусы:** Засыпает через 15 минут бездействия. Файловая система сбрасывается при каждом деплое (данные теряются если не подключить диск).

### Шаги

**1. Залей код на GitHub** (см. шаг 1 из Railway)

**2. Зарегистрируйся на [render.com](https://render.com)**

**3. Создай Web Service**

- **New** → **Web Service**
- Подключи GitHub репозиторий
- Настройки:

| Поле | Значение |
|------|----------|
| Runtime | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `node .output/server/index.mjs` |
| Instance Type | Free |

**4. Добавь диск (чтобы данные не терялись)**

В Render бесплатный диск **недоступен** на free tier.  
→ Либо плати $7/мес за диск, либо используй Railway.

**5. Добавь переменные окружения**

В разделе **Environment** добавь те же переменные что в `.env`.

---

## Вариант 3: Fly.io (Технически лучший вариант)

**Почему Fly.io:** 3 маленьких VM бесплатно навсегда + 3GB постоянного хранилища.

### Шаги

**1. Установи flyctl**

```bash
# macOS
brew install flyctl

# Или через curl
curl -L https://fly.io/install.sh | sh
```

**2. Войди в аккаунт**

```bash
fly auth login
```

**3. Создай приложение**

```bash
cd "/Users/erdaulettojbekov/Desktop/Cemented Future"
fly launch
```

Fly задаст вопросы:
- App name: `cemented-future`
- Region: выбери ближайший (например `ams` — Амстердам)
- Database: **No** (используем JSON файл)

**4. Создай `Dockerfile`** (если fly не создал автоматически)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

**5. Добавь постоянный volume для данных**

```bash
fly volumes create cemented_data --size 1 --region ams
```

**6. Добавь в `fly.toml`**

```toml
[mounts]
  source = "cemented_data"
  destination = "/app/data"
```

**7. Деплой**

```bash
fly deploy
```

**8. Установи переменные окружения**

```bash
fly secrets set NODE_ENV=production ADMIN_PASSWORD=твой_пароль
```

---

## Сравнительная таблица

| | Railway | Render | Fly.io |
|---|---|---|---|
| Цена | $5/мес кредит | Бесплатно | Бесплатно |
| Постоянный диск | ✅ Да | ❌ Нет (free) | ✅ Да |
| Скорость деплоя | ⚡ Быстро | ⚡ Быстро | 🐢 Медленнее |
| Сложность | ★☆☆ | ★☆☆ | ★★☆ |
| Сон при бездействии | ❌ Нет | ✅ Да | ❌ Нет |
| Рекомендую | ✅ **Да** | ⚠️ Условно | ✅ Да |

---

## Частые проблемы

### Ошибка: `Cannot find module '.output/server/index.mjs'`

Проверь что за папку создаёт `npm run build`:

```bash
npm run build
ls .output/  # или ls dist/
```

Используй правильный путь в Start Command.

### Данные пропадают после перезапуска

Ты не настроил persistent volume. Следуй шагу с Volume в инструкции выше.

### Порт не открывается

Nitro слушает переменную `PORT`. В Railway и Render она выставляется автоматически.  
Если нет — добавь `PORT=3000` в переменные окружения.

### Ошибка с файловой системой

Убедись что путь к volume совпадает с `DB_DIR` в `src/lib/db.server.ts`:

```typescript
const DB_DIR = join(process.cwd(), "data"); // должно быть /app/data
```

---

## Итог — с чего начать

1. Создай GitHub репозиторий и залей код
2. Зарегистрируйся на [railway.app](https://railway.app)
3. Подключи репозиторий
4. Добавь Volume `/app/data`
5. Настрой переменные окружения
6. Деплой займёт ~3 минуты
