# ADR-003: Кастомный UI-кит без UI-библиотек

**Статус:** Принято
**Дата:** 2026-02-19

---

## Контекст

ТЗ запрещает использование UI-библиотек (Element Plus, Vuetify, Quasar, Ant Design Vue и т.д.). При этом приложение требует повторяющихся UI-элементов (кнопки, аватары, индикаторы, бейджи, поля ввода).

## Решение

Разработать **минимальный собственный UI-кит** — набор базовых компонентов в `src/components/ui/`.

### Компоненты UI-кита

| Компонент | Назначение |
|---|---|
| `BaseButton.vue` | Кнопка с вариантами (primary, ghost) и состоянием disabled |
| `BaseAvatar.vue` | Круглый аватар с инициалами и цветовым фоном по имени |
| `StatusDot.vue` | Цветной индикатор статуса online/offline |
| `BaseBadge.vue` | Числовой бейдж для счётчика непрочитанных |
| `BaseTextarea.vue` | Автоматически растягивающийся textarea |
| `BaseSpinner.vue` | Индикатор загрузки |

### Архитектурные принципы UI-кита

1. **Только отображение** — компоненты не обращаются к сторам, получают все данные через props
2. **TypeScript-пропсы** — каждый props с явным типом через `defineProps<{...}>()`
3. **Эмиты** — типизированные через `defineEmits<{...}>()`
4. **SCSS-модули** — стили инкапсулированы (`<style lang="scss" scoped>`)
5. **Slot-based расширение** — там где нужна гибкость, используются слоты

### Пример: BaseButton

```vue
<script setup lang="ts">
type ButtonVariant = 'primary' | 'ghost'

defineProps<{
  variant?: ButtonVariant
  disabled?: boolean
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="base-button"
    :class="[`base-button--${variant ?? 'primary'}`, { 'base-button--disabled': disabled }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
```

### Пример: BaseAvatar

```vue
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ name: string; size?: number }>()

const initials = computed(() =>
  props.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
)

// Детерминированный цвет по имени (не меняется при ре-рендере)
const COLORS = ['#f44336', '#9c27b0', '#3f51b5', '#009688', '#ff9800', '#795548']
const color = computed(() =>
  COLORS[props.name.charCodeAt(0) % COLORS.length]
)
</script>
```

## Последствия

- Нет зависимостей от сторонних библиотек — полный контроль над стилями и поведением
- Базовые компоненты разрабатываются в начале проекта (Feature F02) и используются во всех остальных фичах
- Незначительное увеличение времени на разработку компенсируется отсутствием overhead'а от тяжёлых библиотек
