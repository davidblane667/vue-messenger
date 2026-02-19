import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchUsers } from '@/services/api'

describe('fetchUsers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('calls correct URL', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, name: 'Test', username: 'test', email: '', phone: '', website: '' },
        ]),
    } as Response)

    await fetchUsers()
    expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users')
  })

  it('throws on non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500 } as Response)
    await expect(fetchUsers()).rejects.toThrow('500')
  })
})
