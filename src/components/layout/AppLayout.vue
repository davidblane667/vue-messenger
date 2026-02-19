<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useUsersStore } from '@/stores/usersStore'
  import { useChatsStore } from '@/stores/chatsStore'
  import ChatList from '@/components/chat-list/ChatList.vue'
  import ChatWindow from '@/components/chat-window/ChatWindow.vue'

  const usersStore = useUsersStore()
  const chatsStore = useChatsStore()

  const hasActiveChat = computed(() => chatsStore.activeChatId !== null)

  onMounted(() => {
    if (usersStore.users.length === 0) {
      usersStore.fetchUsers()
    }
  })
</script>

<template>
  <div class="app-layout">
    <aside class="app-layout__sidebar">
      <ChatList />
    </aside>
    <main class="app-layout__main">
      <ChatWindow v-if="hasActiveChat" />
      <div v-else class="app-layout__placeholder">
        <p>Выберите чат, чтобы начать общение</p>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
  .app-layout {
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: $color-surface;

    &__sidebar {
      width: $chat-list-width;
      flex-shrink: 0;
      border-right: 1px solid $color-border;
      overflow-y: auto;
      @include scrollbar-thin;
    }

    &__main {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    &__placeholder {
      @include flex-center;
      height: 100%;
      color: $color-text-secondary;
      font-size: 0.95rem;
    }
  }
</style>
