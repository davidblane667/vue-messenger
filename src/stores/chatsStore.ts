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
      state.activeChatId !== null ? (state.chats[state.activeChatId] ?? null) : null,

    lastMessage:
      (state) =>
      (userId: number): Message | null =>
        state.chats[userId]?.messages.at(-1) ?? null,

    unreadCount:
      (state) =>
      (userId: number): number =>
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

      // Реактивная смена статуса при открытии чата (ADR-005)
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
