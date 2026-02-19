# F07 — Окно чата и история сообщений

**Фаза:** 3
**Зависит от:** F02, F03, F05
**Блокирует:** F08, F11, F13

---

## Цель

Реализовать правую панель: шапку с именем и статусом собеседника, прокручиваемый список сообщений с автоскроллом.

---

## src/composables/useAutoScroll.ts

```ts
import { watch, nextTick, type Ref } from 'vue'

export function useAutoScroll(
  containerRef: Ref<HTMLElement | null>,
  trigger: Ref<unknown>
) {
  watch(
    trigger,
    async () => {
      await nextTick()
      const el = containerRef.value
      if (el) {
        el.scrollTop = el.scrollHeight
      }
    },
    { deep: true }
  )
}
```

---

## src/components/chat-window/ChatWindow.vue

```vue
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
  chatsStore.activeChatId !== null
    ? usersStore.getUserById(chatsStore.activeChatId)
    : undefined
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
```

---

## src/components/chat-window/ChatHeader.vue

```vue
<script setup lang="ts">
import type { User } from '@/types'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import StatusDot from '@/components/ui/StatusDot.vue'

defineProps<{ user: User }>()
</script>

<template>
  <header class="chat-header">
    <BaseAvatar :name="user.name" :size="38" />
    <div class="chat-header__info">
      <span class="chat-header__name">{{ user.name }}</span>
      <div class="chat-header__status">
        <StatusDot :status="user.status" :size="8" />
        <span class="chat-header__status-text">{{ user.status === 'online' ? 'в сети' : 'не в сети' }}</span>
      </div>
    </div>
    <!-- кнопка «Назад» для mobile — реализуется в F14 -->
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
```

---

## src/components/chat-window/MessageList.vue

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Message } from '@/types'
import { useAutoScroll } from '@/composables/useAutoScroll'
import MessageItem from './MessageItem.vue'

const props = defineProps<{ messages: Message[] }>()

const containerRef = ref<HTMLElement | null>(null)
const messagesTrigger = computed(() => props.messages)

useAutoScroll(containerRef, messagesTrigger)
</script>

<template>
  <div ref="containerRef" class="message-list">
    <TransitionGroup name="message">
      <MessageItem
        v-for="msg in messages"
        :key="msg.id"
        :message="msg"
      />
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: $color-bg;
  @include scrollbar-thin;
}

// TransitionGroup анимации (детально в F13)
.message-enter-active { transition: all 0.25s ease; }
.message-enter-from { opacity: 0; transform: translateY(8px); }
</style>
```

---

## src/components/chat-window/MessageItem.vue

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/types'
import { formatMessageText } from '@/utils/textFormatter'

const props = defineProps<{ message: Message }>()

const timeLabel = computed(() =>
  new Intl.DateTimeFormat('ru', { hour: '2-digit', minute: '2-digit' })
    .format(new Date(props.message.timestamp))
)

// formatMessageText — заглушка до F11, в F11 добавит разметку
const formattedText = computed(() => formatMessageText(props.message.text))
</script>

<template>
  <div
    class="message"
    :class="`message--${message.type}`"
  >
    <div class="message__bubble">
      <!-- v-html для форматированного текста (F11 добавит bold/italic) -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span class="message__text" v-html="formattedText" />
      <time class="message__time">{{ timeLabel }}</time>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message {
  display: flex;

  &--outgoing { justify-content: flex-end; }
  &--incoming { justify-content: flex-start; }

  &__bubble {
    max-width: 70%;
    padding: 8px 12px;
    border-radius: $border-radius-bubble;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &--outgoing &__bubble {
    background: $color-msg-out;
    border-bottom-right-radius: 4px;
  }

  &--incoming &__bubble {
    background: $color-msg-in;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }

  &__text {
    font-size: 0.9rem;
    line-height: 1.45;
    word-break: break-word;
  }

  &__time {
    font-size: 0.68rem;
    color: rgba(0, 0, 0, 0.4);
    align-self: flex-end;
  }
}
</style>
```

---

## Критерий готовности

- [ ] `ChatWindow` рендерит шапку, список и поле ввода
- [ ] Шапка показывает имя и статус активного собеседника
- [ ] История из 20–30 сообщений отображается при открытии чата
- [ ] Исходящие — справа (зелёный фон), входящие — слева (белый)
- [ ] Время под каждым сообщением в формате `ЧЧ:ММ`
- [ ] Автоскролл к последнему сообщению при открытии
- [ ] `useAutoScroll` срабатывает при добавлении нового сообщения
