# F14 — Адаптивный дизайн

**Фаза:** 5
**Зависит от:** F05, F06, F07
**Блокирует:** —

---

## Цель

На мобильных устройствах (< 768px): список чатов и окно чата отображаются по очереди на весь экран. Навигация через Vue Router.

---

## Стратегия

На **desktop** (≥ 768px): `/` → `AppLayout` (оба блока рядом).

На **mobile** (< 768px):
- `/` → редирект на `/chats`
- `/chats` → `ChatListView` (только список, 100vw)
- `/chat/:id` → `ChatView` (только чат, 100vw)

---

## Обновление router/index.ts

```ts
import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ChatListView from '@/views/ChatListView.vue'
import ChatView from '@/views/ChatView.vue'
import { MOBILE_BREAKPOINT } from '@/constants'

const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      // Guard: на mobile редиректим на /chats
      beforeEnter: (_to, _from, next) => {
        isMobile() ? next('/chats') : next()
      },
    },
    {
      path: '/chats',
      component: ChatListView,
    },
    {
      path: '/chat/:id',
      component: ChatView,
      props: (route) => ({ chatId: Number(route.params['id']) }),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
```

---

## Обновление ChatListItem.vue — навигация на mobile

При клике на мобильном — переходим на роут `/chat/:id` вместо просто вызова `openChat`:

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useChatsStore } from '@/stores/chatsStore'

const router = useRouter()
const { isMobile } = useBreakpoint()
const chatsStore = useChatsStore()

function handleClick() {
  chatsStore.openChat(props.user.id)
  if (isMobile.value) {
    router.push(`/chat/${props.user.id}`)
  }
}
</script>
```

---

## Обновление ChatHeader.vue — кнопка «Назад»

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBreakpoint } from '@/composables/useBreakpoint'

const router = useRouter()
const { isMobile } = useBreakpoint()
</script>

<template>
  <header class="chat-header">
    <button
      v-if="isMobile"
      class="chat-header__back"
      @click="router.push('/chats')"
    >
      ←
    </button>
    <BaseAvatar :name="user.name" :size="38" />
    <!-- ... -->
  </header>
</template>

<style lang="scss" scoped>
.chat-header__back {
  padding: 8px;
  color: $color-primary;
  font-size: 1.2rem;
  flex-shrink: 0;

  @include desktop {
    display: none;
  }
}
</style>
```

---

## SCSS — скрытие панелей

```scss
// AppLayout.vue — desktop только
@include mobile {
  // AppLayout не используется на mobile (роутер редиректит)
  // Дополнительный guard через SCSS не нужен
}
```

---

## ChatView.vue — получение chatId через props

```vue
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
  height: 100dvh;  // dvh для мобильных (учитывает адресную строку)
  display: flex;
  flex-direction: column;
}
</style>
```

---

## Критерий готовности

- [ ] На desktop (≥ 768px): двухпанельный layout на `/`
- [ ] На mobile (< 768px): переход на `/` → редирект на `/chats`
- [ ] Клик по чату на mobile → переход на `/chat/:id`
- [ ] Кнопка «Назад» в шапке чата на mobile → `/chats`
- [ ] Кнопка «Назад» не видна на desktop
- [ ] `height: 100dvh` в `ChatView` — без обрезки адресной строкой браузера
- [ ] Ресайз окна с desktop на mobile — кнопка «Назад» появляется
