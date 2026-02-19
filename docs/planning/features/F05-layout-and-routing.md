# F05 — Layout и роутинг

**Фаза:** 2
**Зависит от:** F01, F02, F03
**Блокирует:** F06, F07, F14

---

## Цель

Настроить маршрутизацию и создать двухпанельный layout. После этой фичи скелет приложения виден в браузере, маршруты работают.

---

## src/router/index.ts

```ts
import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ChatListView from '@/views/ChatListView.vue'
import ChatView from '@/views/ChatView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      // Desktop: оба блока рядом
      path: '/',
      component: AppLayout,
    },
    {
      // Mobile: только список чатов
      path: '/chats',
      component: ChatListView,
    },
    {
      // Mobile: только окно чата
      path: '/chat/:id',
      component: ChatView,
      props: true,
    },
  ],
})

export default router
```

---

## src/composables/useBreakpoint.ts

Реактивное определение мобильного viewport.

```ts
import { ref, onMounted, onUnmounted } from 'vue'
import { MOBILE_BREAKPOINT } from '@/constants'

export function useBreakpoint() {
  const isMobile = ref(window.innerWidth <= MOBILE_BREAKPOINT)

  function update() {
    isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT
  }

  onMounted(() => window.addEventListener('resize', update))
  onUnmounted(() => window.removeEventListener('resize', update))

  return { isMobile }
}
```

---

## src/components/layout/AppLayout.vue

Desktop: два блока рядом через flexbox. Вызывает `fetchUsers()` при монтировании.

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useUsersStore } from '@/stores/usersStore'
import { useChatsStore } from '@/stores/chatsStore'
import ChatList from '@/components/chat-list/ChatList.vue'
import ChatWindow from '@/components/chat-window/ChatWindow.vue'

const usersStore = useUsersStore()
const chatsStore = useChatsStore()

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
      <ChatWindow v-if="chatsStore.activeChatId !== null" />
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
```

---

## src/views/ChatListView.vue (mobile)

```vue
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
  height: 100vh;
  overflow-y: auto;
  @include scrollbar-thin;
}
</style>
```

---

## src/views/ChatView.vue (mobile)

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useChatsStore } from '@/stores/chatsStore'
import ChatWindow from '@/components/chat-window/ChatWindow.vue'

const route = useRoute()
const chatsStore = useChatsStore()

const chatId = Number(route.params['id'])

onMounted(() => {
  chatsStore.openChat(chatId)
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
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
```

---

## Критерий готовности

- [ ] Переход по `/` показывает двухпанельный layout
- [ ] `v-if` placeholder виден когда нет активного чата
- [ ] `useBreakpoint` реактивно меняет `isMobile` при ресайзе окна
- [ ] Роуты `/chats` и `/chat/:id` рендерят соответствующие view-компоненты
- [ ] `fetchUsers()` вызывается один раз при монтировании (не повторно если `users.length > 0`)
