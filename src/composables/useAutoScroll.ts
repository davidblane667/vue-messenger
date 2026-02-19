import { watch, nextTick, type Ref } from 'vue'

export function useAutoScroll(containerRef: Ref<HTMLElement | null>, trigger: Ref<unknown>) {
  watch(
    trigger,
    async () => {
      await nextTick()
      const el = containerRef.value
      if (el) {
        el.scrollTop = el.scrollHeight
      }
    },
    { deep: true },
  )
}
