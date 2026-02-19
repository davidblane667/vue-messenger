import { ref, computed } from 'vue'

export function useMessageInput(onSend: (text: string) => void) {
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
    // Shift+Enter — браузер добавляет \n сам, ничего не делаем
  }

  return { text, handleKeydown, handleSubmit, canSend }
}
