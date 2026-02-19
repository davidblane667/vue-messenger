<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import type { User } from '@/types'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import BaseAvatar from '@/components/ui/BaseAvatar.vue'
  import StatusDot from '@/components/ui/StatusDot.vue'

  defineProps<{ user: User }>()

  const router = useRouter()
  const { isMobile } = useBreakpoint()

  function goBack() {
    router.push('/chats')
  }
</script>

<template>
  <header class="chat-header">
    <button v-if="isMobile" class="chat-header__back" title="Назад" @click="goBack">←</button>
    <BaseAvatar :name="user.name" :size="38" />
    <div class="chat-header__info">
      <span class="chat-header__name">{{ user.name }}</span>
      <div class="chat-header__status">
        <StatusDot :status="user.status" :size="8" />
        <span class="chat-header__status-text">
          {{ user.status === 'online' ? 'в сети' : 'не в сети' }}
        </span>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
  .chat-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
    height: $header-height;
    border-bottom: 1px solid $color-border;
    background: $color-surface;
    flex-shrink: 0;

    &__back {
      font-size: 1.25rem;
      color: $color-primary;
      padding: 4px 8px;
      border-radius: 6px;
      transition: background $transition-fast;
      flex-shrink: 0;

      &:hover {
        background: rgba($color-primary, 0.08);
      }

      @include desktop {
        display: none;
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__name {
      font-weight: 600;
      font-size: 0.95rem;
    }

    &__status {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    &__status-text {
      font-size: 0.75rem;
      color: $color-text-secondary;
    }
  }
</style>
