# F10 — Персистентность (localStorage)

**Фаза:** 4
**Зависит от:** F03
**Блокирует:** —

---

## Цель

Сохранять историю чатов и статусы пользователей между перезагрузками страницы. После `F5` — все данные восстанавливаются.

---

## Реализация через pinia-plugin-persistedstate

Плагин уже подключён в `main.ts` (F01). В сторах добавляется опция `persist`:

```ts
// usersStore.ts
export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({ ... }),
  // ...
  persist: true,  // сохраняет весь state в localStorage под ключом 'users'
})

// chatsStore.ts
export const useChatsStore = defineStore('chats', {
  state: (): ChatsState => ({ ... }),
  // ...
  persist: true,  // сохраняет под ключом 'chats'
})
```

### Выборочное сохранение (опционально)

Если нужно исключить `loading` и `error` из сохранения:

```ts
persist: {
  pick: ['users'],  // сохранять только поле users, без loading/error
}
```

---

## Логика при старте приложения

```
AppLayout.onMounted():
  ↓
  usersStore.users.length === 0 ?
    ↓ YES                    ↓ NO
  fetchUsers()          (данные из localStorage уже в store)
    ↓
  Заполняем users
```

> Проверка `users.length === 0` предотвращает повторный запрос если данные уже в localStorage.

---

## Что сохраняется

| Store | Поля | Ключ в localStorage |
|---|---|---|
| `usersStore` | `users` (включая статусы) | `users` |
| `chatsStore` | `chats`, `activeChatId` | `chats` |

---

## Потенциальные проблемы

### Устаревшие данные
Если структура `Message` или `User` изменилась, старые данные из localStorage могут быть несовместимы.

**Решение на будущее:** добавить версионирование. Пока не требуется.

### Размер localStorage
История 5 чатов × 30 сообщений = ~150 сообщений. Размер незначительный (~50–100 KB).

### activeChatId после перезагрузки
`activeChatId` сохраняется. При следующем запуске `ChatWindow` может отображаться если он был открыт. Это ожидаемое поведение (как в реальных мессенджерах).

---

## Критерий готовности

- [ ] Открыть чат, отправить сообщение → `F5` → история сохранена
- [ ] Статусы пользователей не сбрасываются после перезагрузки
- [ ] Список пользователей не запрашивается повторно если есть в localStorage
- [ ] В DevTools → Application → localStorage: ключи `users` и `chats` существуют
- [ ] `activeChatId` восстанавливается (активный чат остаётся открытым)
