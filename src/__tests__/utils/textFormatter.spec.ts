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
    expect(formatMessageText('**bold** and *italic*')).toBe(
      '<strong>bold</strong> and <em>italic</em>',
    )
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
