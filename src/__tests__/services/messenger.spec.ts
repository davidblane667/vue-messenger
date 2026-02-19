import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { scheduleAutoReply } from '@/services/messenger'
import { AUTO_REPLY_TEXT, AUTO_REPLY_MIN_MS, AUTO_REPLY_MAX_MS } from '@/constants'

describe('scheduleAutoReply', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

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
