# ADR-002: Pinia — Options API стиль

**Статус:** Принято
**Дата:** 2026-02-19

---

## Контекст

Pinia поддерживает два стиля определения стора:
1. **Setup Store** — функция, аналогичная `setup()` в Composition API
2. **Options Store** — объект с `state`, `getters`, `actions` (аналог Vuex)

## Решение

Используем **Options Store** (`defineStore` с объектом опций).

```ts
// ✅ Options Store — используем этот стиль
export const useChatsStore = defineStore('chats', {
  state: () => ({
    chats: {} as Record<number, Chat>,
    activeChatId: null as number | null,
  }),
  getters: {
    activeChat: (state): Chat | null =>
      state.activeChatId !== null ? state.chats[state.activeChatId] ?? null : null,
    lastMessage: (state) => (userId: number): Message | null => {
      const chat = state.chats[userId]
      return chat?.messages.at(-1) ?? null
    },
  },
  actions: {
    openChat(userId: number): void {
      this.activeChatId = userId
      // ...
    },
    sendMessage(text: string): void {
      // ...
    },
  },
  persist: true,
})
```

```ts
// ❌ Setup Store — не используем
export const useChatsStore = defineStore('chats', () => {
  const chats = ref<Record<number, Chat>>({})
  // ...
  return { chats }
})
```

## Обоснование

- Чёткое разделение state / getters / actions упрощает читаемость и ревью
- `this` в actions ссылается на весь стор — удобно для взаимодействия между полями
- Плагин `pinia-plugin-persistedstate` с опцией `persist: true` работает идентично для обоих стилей
- Строгая структура снижает вероятность случайной мутации state вне actions

## Соглашения

- `state()` — фабричная функция, возвращает объект. Типы выводятся автоматически или указываются через `as`
- `getters` — чистые функции без побочных эффектов
- `actions` — единственное место мутации state. Могут быть `async`
- Сторы не вызывают друг друга напрямую через `inject` — только через `useXxxStore()` внутри action
- Именование: `useXxxStore` — camelCase с префиксом `use` и суффиксом `Store`

## Последствия

- Нельзя использовать `watch`, `computed` и другие composables напрямую внутри определения стора
- При необходимости реакции на изменения — использовать `$subscribe` или `watch` снаружи стора в composable
