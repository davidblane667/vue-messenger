# Доменные сущности

Все TypeScript-типы проекта с описанием полей и инвариантов.

---

## User

Представляет собеседника в приложении.

```ts
type UserStatus = 'online' | 'offline'

interface User {
  id: number          // Уникальный ID из API (jsonplaceholder user.id)
  name: string        // Полное имя: "Leanne Graham"
  username: string    // Никнейм: "Bret"
  status: UserStatus  // Текущий статус присутствия
}
```

**Инварианты:**
- `id` уникален в рамках всего приложения
- `status` меняется только через `usersStore.randomizeStatus()`
- Из API берутся только первые 5 пользователей

---

## ApiUser

Сырой ответ от jsonplaceholder `/users`. Подмножество используемых полей.

```ts
interface ApiUser {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
  company: {
    name: string
  }
}
```

**Маппинг `ApiUser → User`** происходит в `usersStore.fetchUsers()`:
```ts
const user: User = {
  id: apiUser.id,
  name: apiUser.name,
  username: apiUser.username,
  status: Math.random() > 0.5 ? 'online' : 'offline',
}
```

---

## Message

Единица переписки в чате.

```ts
type MessageType = 'incoming' | 'outgoing'

interface Message {
  id: string          // Уникальный ID: `msg-${Date.now()}-${Math.random()}`
  type: MessageType   // Направление сообщения
  text: string        // Текст (может содержать **bold** и *italic* разметку)
  timestamp: number   // Unix timestamp в мс (Date.now())
  read: boolean       // true если пользователь видел сообщение
}
```

**Инварианты:**
- `id` уникален глобально
- `text` не может быть пустой строкой
- `timestamp` у сгенерированных сообщений упорядочен по возрастанию
- `read: false` только у `incoming` сообщений в неактивных чатах

---

## Chat

Диалог между текущим пользователем и собеседником.

```ts
interface Chat {
  userId: number      // ID собеседника (ключ в chatsStore)
  messages: Message[] // История, отсортированная по timestamp ASC
  unreadCount: number // Кол-во непрочитанных входящих (≥ 0)
}
```

**Инварианты:**
- `userId` ссылается на существующего `User`
- `messages` всегда отсортированы по `timestamp` ASC
- `unreadCount` сбрасывается в 0 при `openChat(userId)`
- `unreadCount` не превышает кол-во входящих с `read: false`

---

## CurrentUser

Статическая константа. Текущий пользователь приложения (не загружается из API).

```ts
interface CurrentUser {
  id: 0               // Зарезервированный ID, не пересекается с API
  name: 'Я'
  username: 'me'
}

const CURRENT_USER: CurrentUser = { id: 0, name: 'Я', username: 'me' }
```

---

## Константы

```ts
const CURRENT_USER_ID = 0
const CHAT_LIST_LIMIT = 5          // Кол-во контактов из API
const HISTORY_MIN = 20             // Минимум сообщений в генерации
const HISTORY_MAX = 30             // Максимум сообщений в генерации
const AUTO_REPLY_MIN_MS = 1000     // Минимальная задержка автоответа
const AUTO_REPLY_MAX_MS = 2000     // Максимальная задержка автоответа
const AUTO_REPLY_TEXT = 'Спасибо за сообщение!)'
const STATUS_CHANGE_PROBABILITY = 0.3  // Шанс смены статуса при открытии чата
const MOBILE_BREAKPOINT = 768      // px
```

---

## Связи между сущностями

```
CurrentUser (singleton)
    │
    │ пишет/читает
    ▼
Chat ──────────── userId ──────────── User
    │                                  │
    │ содержит                         │ имеет
    ▼                                  ▼
Message[]                         UserStatus
(incoming | outgoing)          (online | offline)
```

---

## Расположение типов в коде

Все типы объявляются в одном файле:

```
src/types/index.ts
```

Экспортируются именованными экспортами, импортируются через `import type`:

```ts
import type { User, Message, Chat, UserStatus } from '@/types'
```
