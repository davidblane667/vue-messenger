# F02 — UI-кит (базовые компоненты)

**Фаза:** 1
**Зависит от:** F01
**Блокирует:** F05, F06, F07, F08

---

## Цель

Реализовать набор переиспользуемых базовых компонентов. Все компоненты: только props/emits, без обращений к stores, без сайд-эффектов.

---

## Компоненты

### BaseButton.vue

**Props:**
```ts
variant?: 'primary' | 'ghost'  // default: 'primary'
disabled?: boolean               // default: false
type?: 'button' | 'submit'      // default: 'button'
```

**Emits:** `click: [event: MouseEvent]`

**Поведение:**
- В состоянии `disabled`: `opacity: 0.5`, `cursor: not-allowed`, не эмитит `click`
- `primary` — залитый фон `$color-primary`, белый текст
- `ghost` — прозрачный фон, border, текст `$color-primary`

---

### BaseAvatar.vue

**Props:**
```ts
name: string      // Имя для инициалов и расчёта цвета
size?: number     // px, default: 42
```

**Поведение:**
- Инициалы: первые буквы первых двух слов имени → `"Leanne Graham"` → `"LG"`
- Цвет фона: детерминированный по `charCodeAt(0)` — одно имя всегда один цвет
- Форма: круг (`border-radius: 50%`)

```ts
const AVATAR_COLORS = ['#f44336', '#9c27b0', '#3f51b5', '#009688', '#ff9800', '#795548', '#607d8b']

const color = computed(() =>
  AVATAR_COLORS[props.name.charCodeAt(0) % AVATAR_COLORS.length]
)
```

---

### StatusDot.vue

**Props:**
```ts
status: 'online' | 'offline'
size?: number  // px, default: 10
```

**Поведение:**
- `online` → `background: $color-online` (зелёный)
- `offline` → `background: $color-offline` (серый)
- Форма: круг

---

### BaseBadge.vue

**Props:**
```ts
count: number
max?: number  // default: 99
```

**Поведение:**
- Скрыт при `count === 0`
- Показывает `count` при `count ≤ max`
- Показывает `99+` при `count > max` (с дефолтным max=99)
- Форма: минимально круглая пилюля, фон `$color-badge`

---

### BaseTextarea.vue

**Props:**
```ts
modelValue: string
placeholder?: string
disabled?: boolean
maxRows?: number  // default: 5
```

**Emits:**
```ts
'update:modelValue': [value: string]
keydown: [event: KeyboardEvent]
```

**Поведение:**
- `v-model` через `modelValue` / `update:modelValue`
- Авторастяжение по высоте: при вводе `textarea` растёт до `maxRows` строк
- Реализация auto-resize: `watch(modelValue)` → сбрасываем `height: auto` → устанавливаем `height: scrollHeight + 'px'`

---

### BaseSpinner.vue

**Props:**
```ts
size?: number  // px, default: 24
color?: string // default: $color-primary
```

**Поведение:**
- CSS-анимация вращающегося кольца (без SVG, только `border + border-radius`)

```scss
.base-spinner {
  border: 3px solid rgba(0,0,0,0.1);
  border-top-color: v-bind(color);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## Структура файлов

```
src/components/ui/
├── BaseButton.vue
├── BaseAvatar.vue
├── StatusDot.vue
├── BaseBadge.vue
├── BaseTextarea.vue
└── BaseSpinner.vue
```

---

## Критерий готовности

- [ ] Все компоненты рендерятся без ошибок
- [ ] TypeScript: нет `any`, все props типизированы через `defineProps<{}>()`
- [ ] `BaseButton` не реагирует на клики в `disabled`
- [ ] `BaseAvatar` показывает правильные инициалы
- [ ] `BaseBadge` скрыт при `count === 0`
- [ ] `BaseTextarea` растёт при вводе многострочного текста
- [ ] `StatusDot` меняет цвет по `status`
