# F09 — Статусы пользователей

**Фаза:** 3
**Зависит от:** F06
**Блокирует:** —

---

## Цель

Реализовать отображение и реактивное изменение статусов online/offline. Статус виден в списке чатов и в шапке активного чата одновременно — без дополнительных emit'ов, через реактивность Pinia.

---

## Логика

### Начальный статус
При `usersStore.fetchUsers()` каждому пользователю случайно присваивается `online` или `offline`:
```ts
status: (Math.random() > 0.5 ? 'online' : 'offline') as UserStatus
```

### Смена при открытии чата
В `chatsStore.openChat()` вызывается `usersStore.maybeRandomizeStatus(userId)` с вероятностью 30%.
Это демонстрирует реактивность: статус меняется в двух местах одновременно без пропа сверху вниз.

```ts
// usersStore.ts
maybeRandomizeStatus(userId: number): void {
  if (Math.random() < STATUS_CHANGE_PROBABILITY) {
    this.randomizeStatus(userId)
  }
},

randomizeStatus(userId: number): void {
  const user = this.users.find(u => u.id === userId)
  if (user) {
    user.status = (Math.random() > 0.5 ? 'online' : 'offline') as UserStatus
  }
},
```

### Реактивное обновление
Оба компонента (`ChatListItem` и `ChatHeader`) получают `user` объект из стора. Т.к. Pinia использует реактивные объекты — изменение `user.status` в экшне моментально обновляет оба компонента.

---

## Визуализация

**`StatusDot.vue`** (реализован в F02):

```vue
<template>
  <span
    class="status-dot"
    :class="`status-dot--${status}`"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :title="status === 'online' ? 'В сети' : 'Не в сети'"
  />
</template>

<style lang="scss" scoped>
.status-dot {
  display: inline-block;
  border-radius: 50%;

  &--online  { background: $color-online; }
  &--offline { background: $color-offline; }
}
</style>
```

---

## Где используется

| Компонент | Использование |
|---|---|
| `ChatListItem.vue` | `<StatusDot :status="user.status" />` — поверх аватара (position: absolute) |
| `ChatHeader.vue` | `<StatusDot :status="user.status" />` + текст «в сети» / «не в сети» |

---

## Критерий готовности

- [ ] При загрузке у каждого пользователя есть статус
- [ ] `StatusDot` зелёный при `online`, серый при `offline`
- [ ] При нескольких кликах на один чат статус иногда меняется
- [ ] Изменение статуса видно **одновременно** в списке и в шапке
- [ ] Заголовок (`title`) на `StatusDot` показывает «В сети» / «Не в сети»
