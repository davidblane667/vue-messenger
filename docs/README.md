# Vue Messenger — Документация проекта

SPA-мессенджер на Vue 3 + TypeScript + Pinia (тестовое задание).

---

## Навигация

### domain/ — Предметная область
Определения и доменные сущности — читать в первую очередь.

| Файл | Содержание |
|---|---|
| [glossary.md](./domain/glossary.md) | Термины, определения, жизненный цикл чата |
| [entities.md](./domain/entities.md) | TypeScript-интерфейсы, константы, связи между сущностями |

---

### adr/ — Архитектурные решения
Зафиксированные технические решения с обоснованием.

| ADR | Решение |
|---|---|
| [ADR-001](./adr/ADR-001-tech-stack.md) | Стек: Vue 3, TS strict (no any), Vite, Vitest |
| [ADR-002](./adr/ADR-002-pinia-options-api.md) | Pinia Options API (state / getters / actions) |
| [ADR-003](./adr/ADR-003-custom-ui-kit.md) | Кастомный UI-кит вместо библиотек |
| [ADR-004](./adr/ADR-004-vitest.md) | Vitest: что, как и когда покрывать |
| [ADR-005](./adr/ADR-005-all-optional-features.md) | «Опциональные» фичи ТЗ — все обязательны |

---

### planning/ — Планирование реализации

| Файл | Содержание |
|---|---|
| [overview.md](./planning/overview.md) | Глобальный план, фазы, зависимости между фичами, итоговая структура проекта |

#### Фичи (planning/features/)

| ID | Фича | Фаза |
|---|---|---|
| [F01](./planning/features/F01-project-setup.md) | Инициализация проекта (Vite, SCSS, алиасы) | 1 |
| [F02](./planning/features/F02-ui-kit.md) | UI-кит: BaseButton, BaseAvatar, StatusDot, BaseBadge, BaseTextarea, BaseSpinner | 1 |
| [F03](./planning/features/F03-types-and-stores.md) | TypeScript-типы + Pinia stores (usersStore, chatsStore) | 1 |
| [F04](./planning/features/F04-api-and-services.md) | Сервисы: api, messageGenerator, messenger | 1 |
| [F05](./planning/features/F05-layout-and-routing.md) | Layout и роутинг (AppLayout, useBreakpoint) | 2 |
| [F06](./planning/features/F06-chat-list.md) | Список чатов (ChatList, ChatListItem) | 3 |
| [F07](./planning/features/F07-chat-window.md) | Окно чата и история сообщений (MessageList, MessageItem, useAutoScroll) | 3 |
| [F08](./planning/features/F08-message-input.md) | Поле ввода и отправка (MessageInput, useMessageInput) | 3 |
| [F09](./planning/features/F09-user-statuses.md) | Статусы online/offline с реактивным обновлением | 3 |
| [F10](./planning/features/F10-persistence.md) | Персистентность через localStorage | 4 |
| [F11](./planning/features/F11-message-formatting.md) | Форматирование: **bold**, *italic*, Ctrl+B/I | 5 |
| [F12](./planning/features/F12-unread-badges.md) | Бейдж непрочитанных сообщений | 5 |
| [F13](./planning/features/F13-animations.md) | Анимации появления сообщений (TransitionGroup) | 5 |
| [F14](./planning/features/F14-adaptive-layout.md) | Адаптивный дизайн: мобильный вид с отдельными роутами | 5 |
| [F15](./planning/features/F15-testing.md) | Vitest: тесты сервисов, stores, composables, utils | 6 |
| [F16](./planning/features/F16-repository.md) | Репозиторий GitHub, README, финальный пуш | 7 |

---

## Быстрая шпаргалка

```
Стек:       Vue 3 + TypeScript (strict, no any) + Pinia Options API + Vue Router 4 + SCSS + Vite
Линтинг:    ESLint 9 (flat config) + Prettier — npm run lint / npm run format
Тесты:      Vitest + @vue/test-utils (фаза 6, после основного)
UI:         только src/components/ui/ — никаких сторонних библиотек
Хранилище:  pinia-plugin-persistedstate, persist: true в обоих stores
API:        https://jsonplaceholder.typicode.com/users (5 первых юзеров)
Адаптив:    <768px → отдельные роуты /chats и /chat/:id
Публикация: GitHub (фаза 7) — gh repo create + git push
```
