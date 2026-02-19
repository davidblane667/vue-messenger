import { describe, it, expect, vi } from 'vitest'
import { useMessageInput } from '@/composables/useMessageInput'

describe('useMessageInput', () => {
  it('canSend is false for empty text', () => {
    const { text, canSend } = useMessageInput(vi.fn())
    text.value = ''
    expect(canSend.value).toBe(false)
  })

  it('canSend is false for whitespace-only text', () => {
    const { text, canSend } = useMessageInput(vi.fn())
    text.value = '   '
    expect(canSend.value).toBe(false)
  })

  it('canSend is true for non-empty text', () => {
    const { text, canSend } = useMessageInput(vi.fn())
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
