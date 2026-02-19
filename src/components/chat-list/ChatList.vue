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
    <div v-if="loading" class="chat-list__state">
      <BaseSpinner />
    </div>
    <p v-else-if="error" class="chat-list__state chat-list__error">
      {{ error }}
    </p>
    <template v-else>
      <ChatListItem
        v-for="user in users"
        :key="user.id"
        :user="user"
        :is-active="chatsStore.activeChatId === user.id"
        :last-message="chatsStore.lastMessage(user.id)"
        :unread-count="chatsStore.unreadCount(user.id)"
        @select="chatsStore.openChat(user.id)"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
  .chat-list {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__state {
      @include flex-center;
      padding: 32px 16px;
      color: $color-text-secondary;
      font-size: 0.875rem;
    }

    &__error {
      color: $color-badge;
    }
  }
</style>
