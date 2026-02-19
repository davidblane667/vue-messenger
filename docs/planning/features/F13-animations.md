# F13 — Анимации

**Фаза:** 5
**Зависит от:** F07
**Блокирует:** —

---

## Цель

Плавное появление новых сообщений через Vue `<TransitionGroup>`. Лёгкие анимации, не мешающие UX.

---

## TransitionGroup в MessageList.vue (уже подготовлено в F07)

`MessageList.vue` уже использует `<TransitionGroup name="message">`. Добавляем стили:

```scss
// В MessageList.vue <style>

.message-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

// Исходящие появляются справа
// Достаточно общей анимации — входящие/исходящие используют один TransitionGroup
```

---

## Анимация при открытии чата (опционально)

Если нужно анимировать всю историю при первом открытии — использовать `appear`:

```vue
<TransitionGroup name="message" appear>
  ...
</TransitionGroup>
```

```scss
.message-appear-active {
  transition: opacity 0.3s ease;
  transition-delay: calc(var(--index) * 0.02s); // stagger (если передавать --index)
}
.message-appear-from { opacity: 0; }
```

> Stagger (задержка по индексу) — опционально, только если не тормозит при 30 сообщениях.

---

## Анимация статуса

Плавное изменение цвета индикатора:

```scss
// StatusDot.vue
.status-dot {
  transition: background $transition-fast;
}
```

---

## Правила

- Анимации должны занимать ≤ 250мс — не замедляют взаимодействие
- `prefers-reduced-motion` — уважать системные настройки:

```scss
@media (prefers-reduced-motion: reduce) {
  .message-enter-active,
  .message-appear-active {
    transition: none;
  }
}
```

---

## Критерий готовности

- [ ] Новые сообщения плавно появляются (fade + slide up)
- [ ] Анимация не дёргается, не конфликтует с автоскроллом
- [ ] Смена статуса анимирована цветовым переходом
- [ ] `prefers-reduced-motion` отключает анимации
