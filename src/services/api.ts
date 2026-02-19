import type { ApiUser } from '@/types'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

export async function fetchUsers(): Promise<ApiUser[]> {
  const response = await fetch(`${BASE_URL}/users`)

  if (!response.ok) {
    throw new Error(`Ошибка загрузки пользователей: ${response.status}`)
  }

  return response.json() as Promise<ApiUser[]>
}
