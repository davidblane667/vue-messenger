import { AUTO_REPLY_MIN_MS, AUTO_REPLY_MAX_MS, AUTO_REPLY_TEXT } from '@/constants'

export function scheduleAutoReply(callback: (text: string) => void): void {
  const delay = AUTO_REPLY_MIN_MS + Math.random() * (AUTO_REPLY_MAX_MS - AUTO_REPLY_MIN_MS)
  setTimeout(() => callback(AUTO_REPLY_TEXT), delay)
}
