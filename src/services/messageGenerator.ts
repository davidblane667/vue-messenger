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

  // Гарантируем оба типа: ~1/3 исходящих, ~2/3 входящих
  const types: MessageType[] = Array.from({ length: count }, (_, i) =>
    i % 3 === 0 ? 'outgoing' : 'incoming',
  )
  // Перемешиваем
  types.sort(() => Math.random() - 0.5)

  const messages: Message[] = types.map((type, i) => ({
    id: `gen-${userId}-${i}`,
    type,
    text: randomFrom(SAMPLE_TEXTS),
    timestamp: randomTimestampInPast24h(),
    read: true,
  }))

  return messages.sort((a, b) => a.timestamp - b.timestamp)
}
