# F15 — Тестирование (Vitest)

**Фаза:** 6
**Зависит от:** все остальные фичи
**Блокирует:** —

---

## Цель

Покрыть тестами всю бизнес-логику: сервисы, stores, composables, utils. Компоненты — минимально, только критичные случаи.

---

## Настройка

```bash
npm install -D vitest @vue/test-utils @testing-library/vue jsdom
```

**vite.config.ts** — добавить секцию `test`:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
})
```

**src/__tests__/setup.ts:**
```ts
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach } from 'vitest'

beforeEach(() => {
  setActivePinia(createPinia())
})
```

**package.json scripts:**
```json
"test": "vitest",
"test:run": "vitest run",
"test:ui": "vitest --ui"
```

---

## Тесты по модулям

### utils/textFormatter.spec.ts

```ts
import { describe, it, expect } from 'vitest'
import { formatMessageText } from '@/utils/textFormatter'

describe('formatMessageText', () => {
  it('renders bold text', () => {
    expect(formatMessageText('**hello**')).toBe('<strong>hello</strong>')
  })
  it('renders italic text', () => {
    expect(formatMessageText('*hello*')).toBe('<em>hello</em>')
  })
  it('renders bold before italic in nested case', () => {
    expect(formatMessageText('**bold** and *italic*'))
      .toBe('<strong>bold</strong> and <em>italic</em>')
  })
  it('escapes < and > to prevent XSS', () => {
    const result = formatMessageText('<script>evil</script>')
    expect(result).not.toContain('<script>')
    expect(result).toContain('&lt;script&gt;')
  })
  it('converts newlines to <br>', () => {
    expect(formatMessageText('line1\nline2')).toBe('line1<br>line2')
  })
  it('returns plain text unchanged', () => {
    expect(formatMessageText('hello world')).toBe('hello world')
  })
})
```

---

### services/messageGenerator.spec.ts

```ts
import { describe, it, expect } from 'vitest'
import { generateHistory } from '@/services/messageGenerator'
import { HISTORY_MIN, HISTORY_MAX } from '@/constants'

describe('generateHistory', () => {
  it('generates between HISTORY_MIN and HISTORY_MAX messages', () => {
    const history = generateHistory(1)
    expect(history.length).toBeGreaterThanOrEqual(HISTORY_MIN)
    expect(history.length).toBeLessThanOrEqual(HISTORY_MAX)
  })
  it('messages are sorted by timestamp ascending', () => {
    const history = generateHistory(1)
    for (let i = 1; i < history.length; i++) {
      expect(history[i].timestamp).toBeGreaterThanOrEqual(history[i - 1].timestamp)
    }
  })
  it('contains both incoming and outgoing messages', () => {
    const history = generateHistory(1)
    const types = new Set(history.map(m => m.type))
    expect(types.has('incoming')).toBe(true)
    expect(types.has('outgoing')).toBe(true)
  })
  it('all messages have non-empty text', () => {
    const history = generateHistory(1)
    history.forEach(m => expect(m.text.length).toBeGreaterThan(0))
  })
  it('all message ids are unique', () => {
    const history = generateHistory(1)
    const ids = history.map(m => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
```

---

### services/messenger.spec.ts

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { scheduleAutoReply } from '@/services/messenger'
import { AUTO_REPLY_TEXT, AUTO_REPLY_MIN_MS, AUTO_REPLY_MAX_MS } from '@/constants'

describe('scheduleAutoReply', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('calls callback with AUTO_REPLY_TEXT', () => {
    const callback = vi.fn()
    scheduleAutoReply(callback)
    vi.advanceTimersByTime(AUTO_REPLY_MAX_MS)
    expect(callback).toHaveBeenCalledWith(AUTO_REPLY_TEXT)
  })
  it('does not call callback before MIN delay', () => {
    const callback = vi.fn()
    scheduleAutoReply(callback)
    vi.advanceTimersByTime(AUTO_REPLY_MIN_MS - 1)
    expect(callback).not.toHaveBeenCalled()
  })
  it('calls callback exactly once', () => {
    const callback = vi.fn()
    scheduleAutoReply(callback)
    vi.advanceTimersByTime(AUTO_REPLY_MAX_MS * 2)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
```

---

### services/api.spec.ts

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchUsers } from '@/services/api'

describe('fetchUsers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('calls correct URL', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 1, name: 'Test', username: 'test', email: '', phone: '', website: '' }]),
    } as Response)

    await fetchUsers()
    expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users')
  })

  it('throws on non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500 } as Response)
    await expect(fetchUsers()).rejects.toThrow('500')
  })
})
```

---

### stores/usersStore.spec.ts

```ts
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
    store.users.forEach(u => {
      expect(['online', 'offline']).toContain(u.status)
    })
  })

  it('randomizeStatus changes status of correct user', async () => {
    const store = useUsersStore()
    await store.fetchUsers()
    const originalStatus = store.users[0].status
    // Запускаем 10 раз — статус должен поменяться хотя бы раз
    let changed = false
    for (let i = 0; i < 10; i++) {
      store.randomizeStatus(1)
      if (store.users[0].status !== originalStatus) { changed = true; break }
    }
    expect(changed).toBe(true)
  })

  it('getUserById returns correct user', async () => {
    const store = useUsersStore()
    await store.fetchUsers()
    const user = store.getUserById(2)
    expect(user?.name).toBe('Bob')
  })
})
```

---

### stores/chatsStore.spec.ts

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useChatsStore } from '@/stores/chatsStore'
import * as api from '@/services/api'
import { useUsersStore } from '@/stores/usersStore'

describe('chatsStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(api, 'fetchUsers').mockResolvedValue([
      { id: 1, name: 'Alice', username: 'alice', email: '', phone: '', website: '' },
    ])
  })

  afterEach(() => { vi.useRealTimers() })

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
```

---

### composables/useMessageInput.spec.ts

```ts
import { describe, it, expect, vi } from 'vitest'
import { useMessageInput } from '@/composables/useMessageInput'

describe('useMessageInput', () => {
  it('canSend is false for empty text', () => {
    const onSend = vi.fn()
    const { text, canSend } = useMessageInput(onSend)
    text.value = ''
    expect(canSend.value).toBe(false)
  })

  it('canSend is false for whitespace-only text', () => {
    const onSend = vi.fn()
    const { text, canSend } = useMessageInput(onSend)
    text.value = '   '
    expect(canSend.value).toBe(false)
  })

  it('canSend is true for non-empty text', () => {
    const onSend = vi.fn()
    const { text, canSend } = useMessageInput(onSend)
    text.value = 'hello'
    expect(canSend.value).toBe(true)
  })

  it('handleSubmit calls onSend with trimmed text', () => {
    const onSend = vi.fn()
    const { text, handleSubmit } = useMessageInput(onSend)
    text.value = '  hello  '
    handleSubmit()
    expect(onSend).toHaveBeenCalledWith('hello')
  })

  it('handleSubmit clears text after send', () => {
    const onSend = vi.fn()
    const { text, handleSubmit } = useMessageInput(onSend)
    text.value = 'hello'
    handleSubmit()
    expect(text.value).toBe('')
  })

  it('handleSubmit does nothing for empty text', () => {
    const onSend = vi.fn()
    const { text, handleSubmit } = useMessageInput(onSend)
    text.value = ''
    handleSubmit()
    expect(onSend).not.toHaveBeenCalled()
  })

  it('Enter key calls handleSubmit', () => {
    const onSend = vi.fn()
    const { text, handleKeydown } = useMessageInput(onSend)
    text.value = 'hi'
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: false })
    handleKeydown(event)
    expect(onSend).toHaveBeenCalledWith('hi')
  })

  it('Shift+Enter does not submit', () => {
    const onSend = vi.fn()
    const { text, handleKeydown } = useMessageInput(onSend)
    text.value = 'hi'
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true })
    handleKeydown(event)
    expect(onSend).not.toHaveBeenCalled()
  })
})
```

---

## Запуск

```bash
npm run test         # watch mode
npm run test:run     # однократный запуск (CI)
```

---

## Критерий готовности

- [ ] Все тесты проходят (`npm run test:run`)
- [ ] Нет `any` в тестовых файлах
- [ ] `textFormatter` — 6+ тестов, включая XSS
- [ ] `messageGenerator` — проверка диапазона, сортировки, типов
- [ ] `messenger` — фейковые таймеры, проверка callback
- [ ] `usersStore` — fetchUsers, randomizeStatus, getUserById
- [ ] `chatsStore` — openChat, sendMessage, receiveMessage, unreadCount
- [ ] `useMessageInput` — 8 тестов, все ветки логики
