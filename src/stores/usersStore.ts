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
    getUserById:
      (state) =>
      (id: number): User | undefined =>
        state.users.find((u) => u.id === id),
  },

  actions: {
    async fetchUsers(): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const apiUsers = await apiFetchUsers()
        this.users = apiUsers.slice(0, CHAT_LIST_LIMIT).map((u) => ({
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
      const user = this.users.find((u) => u.id === userId)
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
