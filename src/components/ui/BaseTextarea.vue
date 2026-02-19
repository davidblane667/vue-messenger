<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue'

  const props = withDefaults(
    defineProps<{
      modelValue: string
      placeholder?: string
      disabled?: boolean
      maxRows?: number
    }>(),
    {
      placeholder: '',
      disabled: false,
      maxRows: 5,
    },
  )

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    keydown: [event: KeyboardEvent]
  }>()

  const textareaRef = ref<HTMLTextAreaElement | null>(null)
  const LINE_HEIGHT = 20 // px

  function autoResize() {
    const el = textareaRef.value
    if (!el) return
    el.style.height = 'auto'
    const maxHeight = LINE_HEIGHT * props.maxRows + 16 // padding
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
  }

  watch(
    () => props.modelValue,
    async () => {
      await nextTick()
      autoResize()
    },
  )

  function onInput(e: Event) {
    emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
  }

  // Экспонируем ref для родительских компонентов (например, для wrapSelection в F11)
  defineExpose({ textareaRef })
</script>

<template>
  <textarea
    ref="textareaRef"
    class="base-textarea"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    rows="1"
    @input="onInput"
    @keydown="$emit('keydown', $event)"
  ></textarea>
</template>

<style lang="scss" scoped>
  .base-textarea {
    width: 100%;
    resize: none;
    border: 1px solid $color-border;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 0.9rem;
    line-height: 20px;
    color: $color-text;
    background: $color-surface;
    outline: none;
    transition: border-color $transition-fast;
    overflow-y: auto;
    @include scrollbar-thin;

    &:focus {
      border-color: $color-primary;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &::placeholder {
      color: $color-text-secondary;
    }
  }
</style>
