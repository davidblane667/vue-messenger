# F12 — Бейдж непрочитанных сообщений

**Фаза:** 5
**Зависит от:** F06, F07
**Блокирует:** —

---

## Цель

Показывать счётчик непрочитанных входящих сообщений в неактивных чатах. Сбрасывать при открытии чата.

---

## Архитектура (уже заложена в F03)

Поле `unreadCount: number` в интерфейсе `Chat` — часть основной модели данных.

```ts
// chatsStore.ts — уже реализовано в F03:

// При получении сообщения в неактивный чат:
receiveMessage(userId: number, text: string): void {
  const isActive = userId === this.activeChatId
  // ...
  if (!isActive) {
    chat.unreadCount++
  }
},

// При открытии чата:
openChat(userId: number): void {
  // ...
  this.chats[userId].unreadCount = 0
},
```

---

## Getter в chatsStore (F03)

```ts
unreadCount: (state) => (userId: number): number =>
  state.chats[userId]?.unreadCount ?? 0,
```

---

## Использование в ChatList.vue (F06)

Уже передаётся как prop:
```vue
<ChatListItem
  :unread-count="chatsStore.unreadCount(user.id)"
  ...
/>
```

---

## BaseBadge.vue (F02)

Компонент уже реализован. Скрыт при `count === 0`, показывает `99+` при `count > 99`.

```vue
<!-- ChatListItem.vue — уже есть: -->
<BaseBadge :count="unreadCount" />
```

---

## Сценарий работы

```
Открыт чат #1 (activeChatId = 1)
  ↓
Автоответ приходит в чат #2 (неактивный)
  ↓
chatsStore.receiveMessage(2, text)
  → isActive = false
  → chats[2].unreadCount++   // теперь = 1
  ↓
ChatListItem для user #2:
  → unreadCount геттер возвращает 1
  → BaseBadge рендерит "1"
  ↓
Пользователь кликает на чат #2
  ↓
chatsStore.openChat(2)
  → chats[2].unreadCount = 0
  → BaseBadge скрывается
```

---

## Критерий готовности

- [ ] При автоответе в неактивный чат появляется бейдж с числом
- [ ] При открытии чата бейдж исчезает (счётчик = 0)
- [ ] Бейдж скрыт при `unreadCount === 0`
- [ ] Показывает `99+` если `unreadCount > 99`
- [ ] После `F5` (из localStorage) `unreadCount` восстанавливается
