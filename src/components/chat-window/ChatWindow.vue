<script setup lang="ts">
  import { computed } from 'vue'
  import { useChatsStore } from '@/stores/chatsStore'
  import { useUsersStore } from '@/stores/usersStore'
  import ChatHeader from './ChatHeader.vue'
  import MessageList from './MessageList.vue'
  import MessageInput from './MessageInput.vue'

  const chatsStore = useChatsStore()
  const usersStore = useUsersStore()

  const activeUser = computed(() =>
    chatsStore.activeChatId !== null ? usersStore.getUserById(chatsStore.activeChatId) : undefined,
  )

  const messages = computed(() => chatsStore.activeChat?.messages ?? [])

  function onSend(text: string) {
    chatsStore.sendMessage(text)
  }
</script>

<template>
  <div class="chat-window">
    <ChatHeader v-if="activeUser" :user="activeUser" />
    <MessageList :messages="messages" />
    <MessageInput @send="onSend" />
  </div>
</template>

<style lang="scss" scoped>
  .chat-window {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
</style>
