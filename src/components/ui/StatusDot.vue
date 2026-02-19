<script setup lang="ts">
  import type { UserStatus } from '@/types'

  withDefaults(
    defineProps<{
      status: UserStatus
      size?: number
    }>(),
    { size: 10 },
  )
</script>

<template>
  <span
    class="status-dot"
    :class="`status-dot--${status}`"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :title="status === 'online' ? 'В сети' : 'Не в сети'"
  ></span>
</template>

<style lang="scss" scoped>
  .status-dot {
    display: inline-block;
    border-radius: 50%;
    flex-shrink: 0;
    transition: background $transition-fast;

    &--online {
      background: $color-online;
    }

    &--offline {
      background: $color-offline;
    }
  }
</style>
