<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useChatsStore } from '@/stores/chatsStore'
  import ChatWindow from '@/components/chat-window/ChatWindow.vue'

  const props = defineProps<{ chatId: number }>()

  const chatsStore = useChatsStore()

  onMounted(() => {
    chatsStore.openChat(props.chatId)
  })
</script>

<template>
  <div class="chat-view">
    <ChatWindow />
  </div>
</template>

<style lang="scss" scoped>
  .chat-view {
    width: 100%;
    height: 100dvh;
    display: flex;
    flex-direction: column;
  }
</style>
