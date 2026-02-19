import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useChatsStore } from '@/stores/chatsStore'
import * as api from '@/services/api'

describe('chatsStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(api, 'fetchUsers').mockResolvedValue([
      { id: 1, name: 'Alice', username: 'alice', email: '', phone: '', website: '' },
    ])
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('openChat creates history on first open', () => {
    const store = useChatsStore()
    store.openChat(1)
    expect(store.chats[1]).toBeDefined()
    expect(store.chats[1].messages.length).toBeGreaterThan(0)
  })

  it('openChat does not regenerate history on second open', () => {
    const store = useChatsStore()
    store.openChat(1)
    const firstCount = store.chats[1].messages.length
    store.openChat(1)
    expect(store.chats[1].messages.length).toBe(firstCount)
  })

  it('openChat resets unreadCount', () => {
    const store = useChatsStore()
    store.openChat(1)
    store.chats[1].unreadCount = 5
    store.openChat(1)
    expect(store.chats[1].unreadCount).toBe(0)
  })

  it('sendMessage adds outgoing message', () => {
    const store = useChatsStore()
    store.openChat(1)
    const before = store.chats[1].messages.length
    store.sendMessage('hello')
    expect(store.chats[1].messages.length).toBe(before + 1)
    expect(store.chats[1].messages.at(-1)?.type).toBe('outgoing')
    expect(store.chats[1].messages.at(-1)?.text).toBe('hello')
  })

  it('sendMessage schedules auto reply', () => {
    const store = useChatsStore()
    store.openChat(1)
    const before = store.chats[1].messages.length
    store.sendMessage('hello')
    vi.runAllTimers()
    expect(store.chats[1].messages.length).toBe(before + 2)
    expect(store.chats[1].messages.at(-1)?.type).toBe('incoming')
  })

  it('receiveMessage increments unreadCount when chat inactive', () => {
    const store = useChatsStore()
    store.openChat(1)
    store.activeChatId = null
    store.receiveMessage(1, 'hi')
    expect(store.chats[1].unreadCount).toBe(1)
  })

  it('receiveMessage does not increment unreadCount for active chat', () => {
    const store = useChatsStore()
    store.openChat(1)
    store.receiveMessage(1, 'hi')
    expect(store.chats[1].unreadCount).toBe(0)
  })
})
