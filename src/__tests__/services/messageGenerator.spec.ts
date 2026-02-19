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
    const types = new Set(history.map((m) => m.type))
    expect(types.has('incoming')).toBe(true)
    expect(types.has('outgoing')).toBe(true)
  })

  it('all messages have non-empty text', () => {
    const history = generateHistory(1)
    history.forEach((m) => expect(m.text.length).toBeGreaterThan(0))
  })

  it('all message ids are unique', () => {
    const history = generateHistory(1)
    const ids = history.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
