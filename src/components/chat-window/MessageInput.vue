<script setup lang="ts">
  import { useMessageInput } from '@/composables/useMessageInput'
  import BaseTextarea from '@/components/ui/BaseTextarea.vue'
  import BaseButton from '@/components/ui/BaseButton.vue'

  const emit = defineEmits<{ send: [text: string] }>()

  const { text, handleKeydown, handleSubmit, canSend } = useMessageInput((t) => emit('send', t))
</script>

<template>
  <div class="message-input">
    <BaseTextarea
      v-model="text"
      placeholder="Написать сообщение..."
      :max-rows="5"
      @keydown="handleKeydown"
    />
    <BaseButton :disabled="!canSend" @click="handleSubmit">Отправить</BaseButton>
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
