<script setup lang="ts">
  import type { User } from '@/types'
  import BaseAvatar from '@/components/ui/BaseAvatar.vue'
  import StatusDot from '@/components/ui/StatusDot.vue'

  defineProps<{ user: User }>()
</script>

<template>
  <header class="chat-header">
    <!-- Кнопка «Назад» для мобильного — добавляется в F14 -->
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
