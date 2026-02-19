import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUsersStore } from '@/stores/usersStore'
import * as api from '@/services/api'

describe('usersStore', () => {
  beforeEach(() => {
    vi.spyOn(api, 'fetchUsers').mockResolvedValue([
      { id: 1, name: 'Alice', username: 'alice', email: '', phone: '', website: '' },
      { id: 2, name: 'Bob', username: 'bob', email: '', phone: '', website: '' },
    ])
  })

  it('fetchUsers populates users', async () => {
    const store = useUsersStore()
    await store.fetchUsers()
    expect(store.users.length).toBe(2)
    expect(store.users[0].name).toBe('Alice')
  })

  it('each user gets a status after fetchUsers', async () => {
    const store = useUsersStore()
    await store.fetchUsers()
    store.users.forEach((u) => {
      expect(['online', 'offline']).toContain(u.status)
    })
  })

  it('randomizeStatus changes status of correct user', async () => {
    const store = useUsersStore()
    await store.fetchUsers()
    const originalStatus = store.users[0].status
    let changed = false
    for (let i = 0; i < 20; i++) {
      store.randomizeStatus(1)
      if (store.users[0].status !== originalStatus) {
        changed = true
        break
      }
    }
    expect(changed).toBe(true)
  })

  it('getUserById returns correct user', async () => {
    const store = useUsersStore()
    await store.fetchUsers()
    const user = store.getUserById(2)
    expect(user?.name).toBe('Bob')
  })

  it('getUserById returns undefined for unknown id', async () => {
    const store = useUsersStore()
    await store.fetchUsers()
    expect(store.getUserById(999)).toBeUndefined()
  })
})
