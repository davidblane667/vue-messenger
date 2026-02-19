<script setup lang="ts">
  type ButtonVariant = 'primary' | 'ghost'

  withDefaults(
    defineProps<{
      variant?: ButtonVariant
      disabled?: boolean
      type?: 'button' | 'submit'
    }>(),
    {
      variant: 'primary',
      disabled: false,
      type: 'button',
    },
  )

  defineEmits<{
    click: [event: MouseEvent]
  }>()
</script>

<template>
  <button
    class="base-button"
    :class="[`base-button--${variant}`, { 'base-button--disabled': disabled }]"
    :type="type"
    :disabled="disabled"
    @click="!disabled && $emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
  .base-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    transition:
      background $transition-fast,
      opacity $transition-fast;
    white-space: nowrap;

    &--primary {
      background: $color-primary;
      color: #fff;

      &:hover:not(:disabled) {
        background: $color-primary-hover;
      }
    }

    &--ghost {
      background: transparent;
      color: $color-primary;
      border: 1px solid $color-primary;

      &:hover:not(:disabled) {
        background: rgba($color-primary, 0.06);
      }
    }

    &--disabled,
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
</style>
