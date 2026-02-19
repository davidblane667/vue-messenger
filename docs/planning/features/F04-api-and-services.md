# F04 — API и сервисы

**Фаза:** 1
**Зависит от:** F01, F03
**Блокирует:** F06, F07, F08

---

## Цель

Реализовать три изолированных сервиса без зависимостей от Vue/Pinia — чистые функции, легко тестируемые.

---

## src/services/api.ts

Обёртка над `fetch` для работы с jsonplaceholder.

```ts
import type { ApiUser } from '@/types'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

export async function fetchUsers(): Promise<ApiUser[]> {
  const response = await fetch(`${BASE_URL}/users`)

  if (!response.ok) {
    throw new Error(`Ошибка загрузки пользователей: ${response.status}`)
  }

  return response.json() as Promise<ApiUser[]>
}
```

**Контракт:**
- При сетевой ошибке или не-2xx статусе — выбрасывает `Error`
- Вызывающий код (`usersStore`) отвечает за обработку ошибки

---

## src/services/messageGenerator.ts

Генерация реалистичной истории переписки.

```ts
import type { Message, MessageType } from '@/types'
import { HISTORY_MIN, HISTORY_MAX } from '@/constants'

const SAMPLE_TEXTS = [
  'Привет!',
  'Как дела?',
  'Всё хорошо, спасибо!',
  'Когда встречаемся?',
  'Завтра в 18:00 подойдёт?',
  'Окей, договорились 👍',
  'Видел последние новости?',
  'Нет, что-то случилось?',
  'Расскажу при встрече',
  'Ты свободен в эти выходные?',
  'К сожалению, нет. Следующие?',
  'Договорились, жду!',
  'Можешь прислать файл?',
  'Уже отправил, проверь почту',
  'Получил, спасибо!',
  'Как продвигается проект?',
  'Почти готово, осталось немного',
  'Отлично, удачи!',
  'Созвонимся позже?',
  'Да, напишу когда освобожусь',
]

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomTimestampInPast24h(): number {
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  return now - Math.floor(Math.random() * dayMs)
}

export function generateHistory(userId: number): Message[] {
  const count = HISTORY_MIN + Math.floor(Math.random() * (HISTORY_MAX - HISTORY_MIN + 1))
  const messages: Message[] = []

  // Гарантируем оба типа сообщений
  const types: MessageType[] = Array.from({ length: count }, (_, i) =>
    i % 3 === 0 ? 'outgoing' : 'incoming'
  )
  // Перемешиваем
  types.sort(() => Math.random() - 0.5)

  for (let i = 0; i < count; i++) {
    messages.push({
      id: `gen-${userId}-${i}`,
      type: types[i],
      text: randomFrom(SAMPLE_TEXTS),
      timestamp: randomTimestampInPast24h(),
      read: true,
    })
  }

  return messages.sort((a, b) => a.timestamp - b.timestamp)
}
```

---

## src/services/messenger.ts

Эмуляция асинхронного получения сообщения.

```ts
import { AUTO_REPLY_MIN_MS, AUTO_REPLY_MAX_MS, AUTO_REPLY_TEXT } from '@/constants'

export function scheduleAutoReply(callback: (text: string) => void): void {
  const delay = AUTO_REPLY_MIN_MS + Math.random() * (AUTO_REPLY_MAX_MS - AUTO_REPLY_MIN_MS)
  setTimeout(() => callback(AUTO_REPLY_TEXT), delay)
}
```

**Контракт:**
- Принимает callback, вызывает его через случайный интервал 1000–2000мс
- Передаёт в callback текст автоответа из константы
- Не знает ничего о Vue/Pinia/Store — просто таймер + callback

---

## src/utils/textFormatter.ts

*(Подробнее в F11, здесь — заготовка файла)*

```ts
export function formatMessageText(raw: string): string {
  // Реализация в F11
  return raw
}
```

---

## Критерий готовности

- [ ] `fetchUsers()` возвращает массив `ApiUser[]` из реального запроса
- [ ] `generateHistory(1)` возвращает 20–30 элементов, отсортированных по `timestamp` ASC
- [ ] В массиве из `generateHistory` присутствуют оба типа (`incoming` и `outgoing`)
- [ ] `scheduleAutoReply` вызывает callback через ~1–2с
- [ ] Нет импортов из Vue/Pinia в сервисах — чистые функции
- [ ] `npm run type-check` — без ошибок
