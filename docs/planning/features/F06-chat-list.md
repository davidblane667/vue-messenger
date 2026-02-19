# F06 — Список чатов

**Фаза:** 3
**Зависит от:** F02, F03, F04, F05
**Блокирует:** F09, F12, F14

---

## Цель

Реализовать левую панель: список контактов с именем, превью последнего сообщения, временем и статусом. Клик открывает чат.

---

## src/components/chat-list/ChatList.vue

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useUsersStore } from '@/stores/usersStore'
import { useChatsStore } from '@/stores/chatsStore'
import ChatListItem from './ChatListItem.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'

const usersStore = useUsersStore()
const chatsStore = useChatsStore()

const users = computed(() => usersStore.users)
const loading = computed(() => usersStore.loading)
const error = computed(() => usersStore.error)
</script>

<template>
  <div class="chat-list">
    <div v-if="loading" class="chat-list__loader">
      <BaseSpinner />
    </div>
    <div v-else-if="error" class="chat-list__error">
      {{ error }}
    </div>
    <template v-else>
      <ChatListItem
        v-for="user in users"
        :key="user.id"
        :user="user"
        :is-active="chatsStore.activeChatId === user.id"
        :last-message="chatsStore.lastMessage(user.id)"
        :unread-count="chatsStore.unreadCount(user.id)"
        @click="chatsStore.openChat(user.id)"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.chat-list {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__loader,
  &__error {
    @include flex-center;
    padding: 24px;
    color: $color-text-secondary;
  }
}
</style>
```

---

## src/components/chat-list/ChatListItem.vue

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { User, Message } from '@/types'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import StatusDot from '@/components/ui/StatusDot.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const props = defineProps<{
  user: User
  isActive: boolean
  lastMessage: Message | null
  unreadCount: number
}>()

defineEmits<{ click: [] }>()

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
  <div
    class="chat-item"
    :class="{ 'chat-item--active': isActive }"
    @click="$emit('click')"
  >
    <div class="chat-item__avatar-wrap">
      <BaseAvatar :name="user.name" />
      <StatusDot :status="user.status" class="chat-item__status-dot" />
    </div>

    <div class="chat-item__info">
      <div class="chat-item__top">
        <span class="chat-item__name">{{ user.name }}</span>
        <span class="chat-item__time">{{ timeLabel }}</span>
      </div>
      <div class="chat-item__bottom">
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
  transition: background $transition-fast;
  border-bottom: 1px solid $color-border;

  &:hover { background: darken($color-surface, 2%); }
  &--active { background: lighten($color-primary, 40%); }

  &__avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }

  &__status-dot {
    position: absolute;
    bottom: 0;
    right: 0;
    border: 2px solid $color-surface;
    border-radius: 50%;
  }

  &__info {
    flex: 1;
    min-width: 0;  // критично для ellipsis во flex-контейнере
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  &__top,
  &__bottom {
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
```

---

## Критерий готовности

- [ ] Отображается 3–5 чатов с именами пользователей
- [ ] `StatusDot` виден поверх аватара (position: absolute)
- [ ] Превью последнего сообщения обрезается с `...` при переполнении
- [ ] Время отображается в формате `ЧЧ:ММ`
- [ ] Клик → открывает чат (вызывает `openChat`)
- [ ] Активный чат подсвечивается
- [ ] `BaseBadge` виден у чатов с `unreadCount > 0`
- [ ] Состояние загрузки и ошибки отображаются
