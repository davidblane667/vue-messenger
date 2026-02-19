<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { Message } from '@/types'
  import { useAutoScroll } from '@/composables/useAutoScroll'
  import MessageItem from './MessageItem.vue'

  const props = defineProps<{ messages: Message[] }>()

  const containerRef = ref<HTMLElement | null>(null)
  const trigger = computed(() => props.messages)

  useAutoScroll(containerRef, trigger)
</script>

<template>
  <div ref="containerRef" class="message-list">
    <TransitionGroup name="message" tag="div" class="message-list__inner">
      <MessageItem v-for="msg in messages" :key="msg.id" :message="msg" />
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
  .message-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px 16px;
    background: $color-bg;
    @include scrollbar-thin;

    &__inner {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  }
</style>

<!-- Глобальные стили для TransitionGroup (F13 дополнит) -->
<style lang="scss">
  .message-enter-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  .message-enter-from {
    opacity: 0;
    transform: translateY(8px);
  }

  @media (prefers-reduced-motion: reduce) {
    .message-enter-active {
      transition: none;
    }
  }
</style>
