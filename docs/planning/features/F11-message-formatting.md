# F11 — Форматирование сообщений (жирный, курсив)

**Фаза:** 5
**Зависит от:** F07, F08
**Блокирует:** —

---

## Цель

Поддержать Markdown-like разметку в сообщениях: `**жирный**` и `*курсив*`. Безопасный рендеринг через `v-html` с санитизацией.

---

## src/utils/textFormatter.ts

```ts
/**
 * Преобразует Markdown-like разметку в безопасный HTML.
 * Поддерживает: **bold**, *italic*, перенос строк.
 * Не допускает произвольный HTML — экранирует его перед обработкой.
 */
export function formatMessageText(raw: string): string {
  // 1. Экранируем HTML-спецсимволы (защита от XSS)
  const escaped = escapeHtml(raw)

  // 2. Применяем форматирование
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')  // **bold**
    .replace(/\*(.+?)\*/g, '<em>$1</em>')               // *italic*
    .replace(/\n/g, '<br>')                             // перенос строки

  // Порядок важен: ** обрабатывается раньше *, иначе *bold* внутри **bold** сломается
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
```

---

## Кнопки форматирования в MessageInput

Добавить в `MessageInput.vue` кнопки Bold / Italic, которые оборачивают выделенный текст или вставляют маркеры в позицию курсора.

```vue
<script setup lang="ts">
// ...
const textareaRef = ref<HTMLTextAreaElement | null>(null)

function wrapSelection(before: string, after: string): void {
  const el = textareaRef.value
  if (!el) return

  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = text.value.slice(start, end)

  const newText = text.value.slice(0, start) + before + selected + after + text.value.slice(end)
  text.value = newText

  // Восстановить позицию курсора
  nextTick(() => {
    el.selectionStart = start + before.length
    el.selectionEnd = end + before.length
    el.focus()
  })
}

const applyBold = () => wrapSelection('**', '**')
const applyItalic = () => wrapSelection('*', '*')
</script>

<template>
  <div class="message-input">
    <div class="message-input__toolbar">
      <button class="message-input__fmt-btn" title="Жирный (Ctrl+B)" @click="applyBold">
        <strong>B</strong>
      </button>
      <button class="message-input__fmt-btn" title="Курсив (Ctrl+I)" @click="applyItalic">
        <em>I</em>
      </button>
    </div>
    <!-- BaseTextarea с ref -->
    ...
  </div>
</template>
```

**Keyboard shortcuts** — добавить в `handleKeydown`:
```ts
if (event.ctrlKey && event.key === 'b') {
  event.preventDefault()
  applyBold()
}
if (event.ctrlKey && event.key === 'i') {
  event.preventDefault()
  applyItalic()
}
```

---

## Обновление MessageItem.vue

`v-html` уже подготовлен в F07:
```vue
<span class="message__text" v-html="formattedText" />
```

`formattedText` использует `formatMessageText` — функция реализована в этой фиче.

---

## Тестирование formatMessageText (F15)

```ts
// __tests__/utils/textFormatter.spec.ts
describe('formatMessageText', () => {
  it('formats bold text', () => {
    expect(formatMessageText('**hello**')).toBe('<strong>hello</strong>')
  })
  it('formats italic text', () => {
    expect(formatMessageText('*hello*')).toBe('<em>hello</em>')
  })
  it('escapes HTML to prevent XSS', () => {
    expect(formatMessageText('<script>alert(1)</script>')).not.toContain('<script>')
  })
  it('converts newlines to <br>', () => {
    expect(formatMessageText('line1\nline2')).toBe('line1<br>line2')
  })
  it('handles bold inside normal text', () => {
    expect(formatMessageText('hello **world** bye')).toBe('hello <strong>world</strong> bye')
  })
})
```

---

## Критерий готовности

- [ ] `**текст**` отображается жирным в пузыре сообщения
- [ ] `*текст*` отображается курсивом
- [ ] `<script>` в тексте сообщения не выполняется (экранируется)
- [ ] Кнопки Bold/Italic в тулбаре оборачивают выделенный текст
- [ ] `Ctrl+B` / `Ctrl+I` работают как shortcuts
- [ ] `formatMessageText` покрыта юнит-тестами в F15
