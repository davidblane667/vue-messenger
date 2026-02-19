# Architecture Decision Records

ADR — фиксация ключевых архитектурных решений с контекстом и обоснованием.

| ADR | Название | Статус |
|---|---|---|
| [ADR-001](./ADR-001-tech-stack.md) | Технологический стек (Vue 3, TS strict, Vite, Vitest) | Принято |
| [ADR-002](./ADR-002-pinia-options-api.md) | Pinia — Options API стиль | Принято |
| [ADR-003](./ADR-003-custom-ui-kit.md) | Кастомный UI-кит без UI-библиотек | Принято |
| [ADR-004](./ADR-004-vitest.md) | Тестирование с Vitest + Vue Test Utils | Принято |
| [ADR-005](./ADR-005-all-optional-features.md) | Все «опциональные» фичи ТЗ — обязательны | Принято |

## Ключевые правила (из ADR)

- **Никаких `any`** в TypeScript — `tsconfig` с `"strict": true`, `"noImplicitAny": true`
- **Pinia Options API** — `defineStore('name', { state, getters, actions })`
- **Никаких UI-библиотек** — только компоненты из `src/components/ui/`
- **Все "опциональные" фичи реализуются**: форматирование, бейджи, адаптив
- **Тесты — в конце** (F15), после основной функциональности
