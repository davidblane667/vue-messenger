# F16 — Создание репозитория и публикация

**Фаза:** 7 (финальная)
**Зависит от:** F15 (все фичи готовы, тесты проходят)
**Блокирует:** —

---

## Цель

Опубликовать готовый проект на GitHub: чистая история коммитов, правильный `.gitignore`, README с инструкцией запуска.

---

## Шаги

### 1. Подготовка .gitignore

В корне проекта (Vite генерирует автоматически, проверить наличие):

```gitignore
# Dependencies
node_modules/

# Build output
dist/
dist-ssr/

# Editor
.vscode/*
!.vscode/extensions.json
.idea/

# Env files
*.local
.env
.env.*

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# Test coverage
coverage/
```

---

### 2. Финальная проверка перед коммитом

```bash
# Убедиться что всё собирается
npm run build

# TypeScript без ошибок
npm run type-check

# ESLint без ошибок
npm run lint

# Все тесты проходят
npm run test:run
```

Все четыре команды должны завершиться с кодом `0`.

---

### 3. Инициализация Git и первый коммит

```bash
git init
git add .
git commit -m "feat: initial project setup

- Vue 3 + TypeScript (strict) + Vite
- Pinia (Options API) + Vue Router 4
- SCSS with variables and mixins
- ESLint (flat config) + Prettier
- pinia-plugin-persistedstate"
```

---

### 4. История коммитов (рекомендуемая структура)

Каждая фаза — отдельный коммит или серия коммитов:

```bash
feat: add domain types and Pinia stores (usersStore, chatsStore)
feat: add services (api, messageGenerator, messenger)
feat: add base UI kit components
feat: add app layout and routing
feat: add chat list with status indicators
feat: add chat window with message history and auto-scroll
feat: add message input (Enter/Shift+Enter, auto-reply)
feat: add localStorage persistence
feat: add message text formatting (bold, italic)
feat: add unread message badge
feat: add message appear animations
feat: add mobile adaptive layout
test: add Vitest coverage for services, stores, composables
docs: add project documentation
```

---

### 5. Создание репозитория на GitHub

**Через GitHub CLI (`gh`):**

```bash
# Создать публичный репозиторий
gh repo create vue-messenger --public --source=. --remote=origin --push

# Или: создать с описанием
gh repo create vue-messenger \
  --public \
  --description "SPA messenger built with Vue 3, TypeScript, Pinia (Options API)" \
  --source=. \
  --remote=origin \
  --push
```

**Через веб-интерфейс:**
```bash
# После создания репо на github.com:
git remote add origin https://github.com/<username>/vue-messenger.git
git branch -M main
git push -u origin main
```

---

### 6. README.md проекта

Создать `README.md` в корне **проекта** (не `docs/`):

```markdown
# Vue Messenger

SPA-мессенджер на Vue 3 + TypeScript + Pinia.

## Стек

- Vue 3 (Composition API, `<script setup>`)
- TypeScript (strict, no `any`)
- Pinia (Options API) + pinia-plugin-persistedstate
- Vue Router 4
- SCSS
- Vite
- Vitest

## Запуск

\```bash
npm install
npm run dev
\```

## Сборка

\```bash
npm run build
\```

## Тесты

\```bash
npm run test:run
\```

## Линтинг

\```bash
npm run lint        # проверка
npm run lint:fix    # автоисправление
npm run format      # Prettier форматирование
\```

## Архитектура

Подробная документация в папке [`docs/`](./docs/README.md).
```

---

### 7. Проверка после пуша

```bash
# Убедиться что удалённый репозиторий корректен
gh repo view --web

# Проверить что все файлы загружены
gh api repos/<username>/vue-messenger/git/trees/main?recursive=1 | grep path
```

---

## Критерий готовности

- [ ] `npm run build` завершается без ошибок
- [ ] `npm run type-check` — 0 ошибок
- [ ] `npm run lint` — 0 ошибок
- [ ] `npm run test:run` — все тесты green
- [ ] `.gitignore` исключает `node_modules/` и `dist/`
- [ ] Репозиторий создан на GitHub и доступен публично
- [ ] `git log --oneline` показывает осмысленную историю коммитов
- [ ] `README.md` в корне проекта с инструкцией запуска
- [ ] Папка `docs/` присутствует в репозитории
