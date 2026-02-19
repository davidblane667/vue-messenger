/**
 * Преобразует Markdown-like разметку в безопасный HTML.
 * Поддерживает: **bold**, *italic*, перенос строк.
 * Экранирует HTML перед обработкой — защита от XSS.
 */
export function formatMessageText(raw: string): string {
  return escapeHtml(raw)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // **bold**
    .replace(/\*(.+?)\*/g, '<em>$1</em>') // *italic*
    .replace(/\n/g, '<br>') // перенос строки
  // Порядок важен: ** раньше *, иначе *x* внутри **x** сломается
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
