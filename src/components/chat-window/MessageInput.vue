<script setup lang="ts">
  import { ref, nextTick } from 'vue'
  import { useMessageInput } from '@/composables/useMessageInput'
  import BaseTextarea from '@/components/ui/BaseTextarea.vue'
  import BaseButton from '@/components/ui/BaseButton.vue'

  const emit = defineEmits<{ send: [text: string] }>()

  const textareaComponent = ref<InstanceType<typeof BaseTextarea> | null>(null)

  const { text, handleKeydown, handleSubmit, canSend } = useMessageInput((t) => emit('send', t))

  function wrapSelection(before: string, after: string): void {
    const el = textareaComponent.value?.textareaRef
    if (!el) return

    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = text.value.slice(start, end)

    text.value = text.value.slice(0, start) + before + selected + after + text.value.slice(end)

    nextTick(() => {
      el.selectionStart = start + before.length
      el.selectionEnd = end + before.length
      el.focus()
    })
  }

  function applyBold() {
    wrapSelection('**', '**')
  }

  function applyItalic() {
    wrapSelection('*', '*')
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'b') {
      event.preventDefault()
      applyBold()
      return
    }
    if (event.ctrlKey && event.key === 'i') {
      event.preventDefault()
      applyItalic()
      return
    }
    handleKeydown(event)
  }
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

    <div class="message-input__body">
      <BaseTextarea
        ref="textareaComponent"
        v-model="text"
        placeholder="Написать сообщение..."
        :max-rows="5"
        @keydown="onKeydown"
      />
      <BaseButton :disabled="!canSend" @click="handleSubmit">Отправить</BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .message-input {
    display: flex;
    flex-direction: column;
    border-top: 1px solid $color-border;
    background: $color-surface;
    flex-shrink: 0;

    &__toolbar {
      display: flex;
      gap: 2px;
      padding: 6px 16px 0;
    }

    &__fmt-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      font-size: 0.875rem;
      color: $color-text-secondary;
      transition: background $transition-fast;

      &:hover {
        background: rgba($color-primary, 0.08);
        color: $color-primary;
      }
    }

    &__body {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      padding: 8px 16px 12px;
    }
  }
</style>
