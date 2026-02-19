<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useUsersStore } from '@/stores/usersStore'
  import ChatList from '@/components/chat-list/ChatList.vue'

  const usersStore = useUsersStore()

  onMounted(() => {
    if (usersStore.users.length === 0) usersStore.fetchUsers()
  })
</script>

<template>
  <div class="chat-list-view">
    <ChatList />
  </div>
</template>

<style lang="scss" scoped>
  .chat-list-view {
    width: 100%;
    height: 100dvh;
    overflow-y: auto;
    @include scrollbar-thin;
  }
</style>
