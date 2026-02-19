<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import type { User, Message } from '@/types'
  import { useBreakpoint } from '@/composables/useBreakpoint'
  import BaseAvatar from '@/components/ui/BaseAvatar.vue'
  import StatusDot from '@/components/ui/StatusDot.vue'
  import BaseBadge from '@/components/ui/BaseBadge.vue'

  const props = defineProps<{
    user: User
    isActive: boolean
    lastMessage: Message | null
    unreadCount: number
  }>()

  const emit = defineEmits<{ select: [] }>()

  const router = useRouter()
  const { isMobile } = useBreakpoint()

  function handleSelect() {
    emit('select')
    if (isMobile.value) {
      router.push(`/chat/${props.user.id}`)
    }
  }

  const previewText = computed(() => {
    if (!props.lastMessage) return 'Нет сообщений'
    const prefix = props.lastMessage.type === 'outgoing' ? 'Вы: ' : ''
    return prefix + props.lastMessage.text
  })

  const timeLabel = computed(() => {
    if (!props.lastMessage) return ''
    return new Intl.DateTimeFormat('ru', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(props.lastMessage.timestamp))
  })
</script>

<template>
  <div class="chat-item" :class="{ 'chat-item--active': isActive }" @click="handleSelect()">
    <div class="chat-item__avatar-wrap">
      <BaseAvatar :name="user.name" :size="44" />
      <StatusDot :status="user.status" :size="12" class="chat-item__dot" />
    </div>

    <div class="chat-item__info">
      <div class="chat-item__row">
        <span class="chat-item__name">{{ user.name }}</span>
        <span class="chat-item__time">{{ timeLabel }}</span>
      </div>
      <div class="chat-item__row">
        <span class="chat-item__preview">{{ previewText }}</span>
        <BaseBadge :count="unreadCount" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .chat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid $color-border;
    transition: background $transition-fast;

    &:hover {
      background: rgba($color-primary, 0.04);
    }

    &--active {
      background: rgba($color-primary, 0.08);
    }

    &__avatar-wrap {
      position: relative;
      flex-shrink: 0;
    }

    &__dot {
      position: absolute;
      bottom: 1px;
      right: 1px;
      border: 2px solid $color-surface;
      border-radius: 50%;
    }

    &__info {
      flex: 1;
      min-width: 0; // критично для ellipsis внутри flex
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    &__name {
      font-weight: 600;
      font-size: 0.9rem;
      @include ellipsis;
    }

    &__time {
      font-size: 0.75rem;
      color: $color-text-secondary;
      flex-shrink: 0;
    }

    &__preview {
      font-size: 0.8rem;
      color: $color-text-secondary;
      flex: 1;
      min-width: 0;
      @include ellipsis;
    }
  }
</style>
