<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      count: number
      max?: number
    }>(),
    { max: 99 },
  )

  const label = computed(() => (props.count > props.max ? `${props.max}+` : String(props.count)))
</script>

<template>
  <span v-if="count > 0" class="base-badge">
    {{ label }}
  </span>
</template>

<style lang="scss" scoped>
  .base-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    background: $color-badge;
    color: #fff;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 600;
    flex-shrink: 0;
  }
</style>
