# ADR-004: Тестирование с Vitest

**Статус:** Принято
**Дата:** 2026-02-19

---

## Контекст

Проект требует тестового покрытия. Нужно выбрать фреймворк, совместимый с Vite и Vue 3.

## Решение

Использовать **Vitest** + **@vue/test-utils** + **@testing-library/vue**.

```bash
npm install -D vitest @vue/test-utils @testing-library/vue jsdom
```

```ts
// vite.config.ts — добавить секцию test
export default defineConfig({
  // ...
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
  },
})
```

## Что покрывается тестами

### Сервисы (чистые функции — наивысший приоритет)

| Файл | Что тестируем |
|---|---|
| `messageGenerator.ts` | Кол-во сообщений (20–30), сортировка по timestamp, наличие обоих типов |
| `messenger.ts` | Вызов callback после задержки (фейковые таймеры) |
| `api.ts` | Правильный URL, обработка ошибок (мок fetch) |
| Форматирование текста | `**bold**` → `<strong>`, `*italic*` → `<em>`, экранирование |

### Stores (Pinia)

| Стор | Что тестируем |
|---|---|
| `usersStore` | `fetchUsers` меняет `users`, `randomizeStatus` меняет статус одного пользователя |
| `chatsStore` | `openChat` генерирует историю при первом вызове, `sendMessage` добавляет сообщение и меняет `unreadCount` у соседних чатов, `receiveMessage` при неактивном чате увеличивает `unreadCount` |

### Composables

| Composable | Что тестируем |
|---|---|
| `useMessageInput` | Enter → emit send, Shift+Enter → добавляет `\n`, пустое сообщение не emit'ится |
| `useAutoScroll` | После изменения messages → `scrollTop === scrollHeight` |

### Компоненты (если позволяет время)

- `MessageItem` — рендерит текст, применяет класс `--outgoing` / `--incoming`
- `StatusDot` — рендерит правильный класс по `status` prop
- `BaseBadge` — скрыт при `count === 0`, показывает `99+` при `count > 99`
- `MessageInput` — disable кнопки при пустом поле

## Соглашения

- Файлы тестов: `*.spec.ts` рядом с тестируемым файлом или в `src/__tests__/`
- Фейковые таймеры: `vi.useFakeTimers()` для тестирования `setTimeout` в messenger
- Мок Pinia: `setActivePinia(createPinia())` в `beforeEach`
- Мок fetch: `vi.stubGlobal('fetch', vi.fn())` для API-тестов

## Последствия

- Тесты пишутся **после** основной функциональности (последний этап)
- Чистая архитектура (сервисы без зависимости от Vue) облегчает тестирование
- Vitest запускается в режиме `--watch` во время разработки тестов
