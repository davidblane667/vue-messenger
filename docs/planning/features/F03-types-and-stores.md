# F03 — Типы и Pinia-сторы

**Фаза:** 1
**Зависит от:** F01
**Блокирует:** F04, F06, F07, F08, F09, F10

---

## Цель

Определить все TypeScript-типы и реализовать оба Pinia-стора по **Options API**. После этой фичи вся логика данных рабочая и проверяема в консоли DevTools.

---

## src/types/index.ts

```ts
// ─── Пользователи ────────────────────────────────────────────

export interface ApiUser {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
}

export type UserStatus = 'online' | 'offline'

export interface User {
  id: number
  name: string
  username: string
  status: UserStatus
}

// ─── Сообщения ────────────────────────────────────────────────

export type MessageType = 'incoming' | 'outgoing'

export interface Message {
  id: string
  type: MessageType
  text: string
  timestamp: number   // Date.now()
  read: boolean
}

// ─── Чат ──────────────────────────────────────────────────────

export interface Chat {
  userId: number
  messages: Message[]
  unreadCount: number
}
```

---

## src/constants/index.ts

```ts
export const CURRENT_USER_ID = 0
export const CHAT_LIST_LIMIT = 5
export const HISTORY_MIN = 20
export const HISTORY_MAX = 30
export const AUTO_REPLY_MIN_MS = 1000
export const AUTO_REPLY_MAX_MS = 2000
export const AUTO_REPLY_TEXT = 'Спасибо за сообщение!)'
export const STATUS_CHANGE_PROBABILITY = 0.3
export const MOBILE_BREAKPOINT = 768
```

---

## src/stores/usersStore.ts

```ts
import { defineStore } from 'pinia'
import type { User, UserStatus } from '@/types'
import { fetchUsers as apiFetchUsers } from '@/services/api'
import { CHAT_LIST_LIMIT, STATUS_CHANGE_PROBABILITY } from '@/constants'

interface UsersState {
  users: User[]
  loading: boolean
  error: string | null
}

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: [],
    loading: false,
    error: null,
  }),

  getters: {
    getUserById: (state) => (id: number): User | undefined =>
      state.users.find(u => u.id === id),
  },

  actions: {
    async fetchUsers(): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const apiUsers = await apiFetchUsers()
        this.users = apiUsers.slice(0, CHAT_LIST_LIMIT).map(u => ({
          id: u.id,
          name: u.name,
          username: u.username,
          status: (Math.random() > 0.5 ? 'online' : 'offline') as UserStatus,
        }))
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Неизвестная ошибка'
      } finally {
        this.loading = false
      }
    },

    randomizeStatus(userId: number): void {
      const user = this.users.find(u => u.id === userId)
      if (user) {
        user.status = (Math.random() > 0.5 ? 'online' : 'offline') as UserStatus
      }
    },

    maybeRandomizeStatus(userId: number): void {
      if (Math.random() < STATUS_CHANGE_PROBABILITY) {
        this.randomizeStatus(userId)
      }
    },
  },

  persist: true,
})
```

---

## src/stores/chatsStore.ts

```ts
import { defineStore } from 'pinia'
import type { Chat, Message } from '@/types'
import { generateHistory } from '@/services/messageGenerator'
import { scheduleAutoReply } from '@/services/messenger'
import { useUsersStore } from './usersStore'

interface ChatsState {
  chats: Record<number, Chat>
  activeChatId: number | null
}

export const useChatsStore = defineStore('chats', {
  state: (): ChatsState => ({
    chats: {},
    activeChatId: null,
  }),

  getters: {
    activeChat: (state): Chat | null =>
      state.activeChatId !== null
        ? state.chats[state.activeChatId] ?? null
        : null,

    lastMessage: (state) => (userId: number): Message | null =>
      state.chats[userId]?.messages.at(-1) ?? null,

    unreadCount: (state) => (userId: number): number =>
      state.chats[userId]?.unreadCount ?? 0,
  },

  actions: {
    openChat(userId: number): void {
      this.activeChatId = userId

      if (!this.chats[userId]) {
        this.chats[userId] = {
          userId,
          messages: generateHistory(userId),
          unreadCount: 0,
        }
      } else {
        this.chats[userId].unreadCount = 0
      }

      // Реактивная смена статуса (ADR-005)
      const usersStore = useUsersStore()
      usersStore.maybeRandomizeStatus(userId)
    },

    sendMessage(text: string): void {
      if (this.activeChatId === null) return
      const chat = this.chats[this.activeChatId]
      if (!chat) return

      const message: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        type: 'outgoing',
        text,
        timestamp: Date.now(),
        read: true,
      }
      chat.messages.push(message)

      const userId = this.activeChatId
      scheduleAutoReply((replyText) => {
        this.receiveMessage(userId, replyText)
      })
    },

    receiveMessage(userId: number, text: string): void {
      const chat = this.chats[userId]
      if (!chat) return

      const isActive = userId === this.activeChatId
      const message: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        type: 'incoming',
        text,
        timestamp: Date.now(),
        read: isActive,
      }
      chat.messages.push(message)

      if (!isActive) {
        chat.unreadCount++
      }
    },
  },

  persist: true,
})
```

---

## Критерий готовности

- [ ] TypeScript компилируется без ошибок (`npm run type-check`)
- [ ] Нет `any` ни в одном файле
- [ ] В DevTools → Pinia: оба стора видны
- [ ] `usersStore.fetchUsers()` можно вызвать из консоли — `users` заполняется
- [ ] `chatsStore.openChat(1)` → `chats[1].messages` содержит 20–30 сообщений
- [ ] `chatsStore.sendMessage('test')` → через 1–2с в `chats[1].messages` появляется `incoming`
