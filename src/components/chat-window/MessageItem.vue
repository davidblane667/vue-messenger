<script setup lang="ts">
  import { computed } from 'vue'
  import type { Message } from '@/types'
  import { formatMessageText } from '@/utils/textFormatter'

  const props = defineProps<{ message: Message }>()

  const timeLabel = computed(() =>
    new Intl.DateTimeFormat('ru', { hour: '2-digit', minute: '2-digit' }).format(
      new Date(props.message.timestamp),
    ),
  )

  // formatMessageText — заглушка до F11, полная реализация в F11
  const formattedText = computed(() => formatMessageText(props.message.text))
</script>

<template>
  <div class="message" :class="`message--${message.type}`">
    <div class="message__bubble">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span class="message__text" v-html="formattedText"></span>
      <time class="message__time">{{ timeLabel }}</time>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .message {
    display: flex;

    &--outgoing {
      justify-content: flex-end;
    }

    &--incoming {
      justify-content: flex-start;
    }

    &__bubble {
      max-width: 70%;
      padding: 8px 12px;
      border-radius: $border-radius-bubble;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &--outgoing &__bubble {
      background: $color-msg-out;
      border-bottom-right-radius: 4px;
    }

    &--incoming &__bubble {
      background: $color-msg-in;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    }

    &__text {
      font-size: 0.9rem;
      line-height: 1.45;
      word-break: break-word;
      white-space: pre-wrap;
    }

    &__time {
      font-size: 0.68rem;
      color: rgba(0, 0, 0, 0.4);
      align-self: flex-end;
      white-space: nowrap;
    }
  }
</style>
