# F08 — Поле ввода и отправка сообщений

**Фаза:** 3
**Зависит от:** F07
**Блокирует:** F11

---

## Цель

Реализовать поле ввода с отправкой по `Enter`, переносом по `Shift+Enter`, блокировкой пустых сообщений и кнопкой «Отправить».

---

## src/composables/useMessageInput.ts

```ts
import { ref } from 'vue'

interface UseMessageInputReturn {
  text: Ref<string>
  handleKeydown: (event: KeyboardEvent) => void
  handleSubmit: () => void
  canSend: Ref<boolean>
}

import { ref, computed, type Ref } from 'vue'

export function useMessageInput(onSend: (text: string) => void): UseMessageInputReturn {
  const text = ref('')

  const canSend = computed(() => text.value.trim().length > 0)

  function handleSubmit(): void {
    if (!canSend.value) return
    onSend(text.value.trim())
    text.value = ''
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
    // Shift+Enter — браузер сам добавляет \n, ничего не делаем
  }

  return { text, handleKeydown, handleSubmit, canSend }
}
```

---

## src/components/chat-window/MessageInput.vue

```vue
<script setup lang="ts">
import { useMessageInput } from '@/composables/useMessageInput'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const emit = defineEmits<{ send: [text: string] }>()

const { text, handleKeydown, handleSubmit, canSend } = useMessageInput(
  (t) => emit('send', t)
)
</script>

<template>
  <div class="message-input">
    <BaseTextarea
      v-model="text"
      placeholder="Написать сообщение..."
      :max-rows="5"
      @keydown="handleKeydown"
    />
    <BaseButton
      :disabled="!canSend"
      @click="handleSubmit"
    >
      Отправить
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.message-input {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid $color-border;
  background: $color-surface;
  flex-shrink: 0;
}
</style>
```

---

## Поведение

| Действие | Результат |
|---|---|
| Ввод текста | `text` обновляется, `canSend` становится `true` |
| `Enter` (без Shift) | `handleSubmit()` → `emit('send', text)` → очистка поля |
| `Shift+Enter` | Стандартный перенос строки в `textarea`, textarea растёт |
| Клик «Отправить» | То же что Enter |
| Поле пустое | Кнопка `disabled`, Enter игнорируется |
| `ChatWindow.onSend(text)` | Вызывает `chatsStore.sendMessage(text)` |

---

## Критерий готовности

- [ ] `Enter` отправляет сообщение и очищает поле
- [ ] `Shift+Enter` добавляет перенос строки, `textarea` увеличивается
- [ ] Кнопка `disabled` при пустом/пробельном тексте
- [ ] После отправки — автоскролл вниз (через `useAutoScroll` в MessageList)
- [ ] Через 1–2с появляется автоответ и тоже скроллит вниз
- [ ] `canSend` реактивно меняется при вводе/удалении
