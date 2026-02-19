// ─── Пользователи ─────────────────────────────────────────────

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
  timestamp: number // Date.now()
  read: boolean
}

// ─── Чат ──────────────────────────────────────────────────────

export interface Chat {
  userId: number
  messages: Message[]
  unreadCount: number
}
