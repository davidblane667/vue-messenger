<script setup lang="ts">
  withDefaults(
    defineProps<{
      size?: number
    }>(),
    { size: 24 },
  )
</script>

<template>
  <span
    class="base-spinner"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="status"
    aria-label="Загрузка..."
  ></span>
</template>

<style lang="scss" scoped>
  .base-spinner {
    display: inline-block;
    border: 3px solid rgba($color-primary, 0.15);
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
