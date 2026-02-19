<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      name: string
      size?: number
    }>(),
    { size: 42 },
  )

  const initials = computed(() =>
    props.name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  )

  // Детерминированный цвет — одно имя всегда один цвет
  const AVATAR_COLORS = [
    '#f44336',
    '#9c27b0',
    '#3f51b5',
    '#009688',
    '#ff9800',
    '#795548',
    '#607d8b',
  ]

  const bgColor = computed(() => AVATAR_COLORS[props.name.charCodeAt(0) % AVATAR_COLORS.length])

  const fontSize = computed(() => `${Math.round(props.size * 0.38)}px`)
</script>

<template>
  <div
    class="base-avatar"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      background: bgColor,
      fontSize,
    }"
    :title="name"
  >
    {{ initials }}
  </div>
</template>

<style lang="scss" scoped>
  .base-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #fff;
    font-weight: 600;
    flex-shrink: 0;
    user-select: none;
  }
</style>
