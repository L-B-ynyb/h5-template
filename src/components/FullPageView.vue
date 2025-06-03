<script setup lang='tsx'>
defineProps({
  headerBg: {
    type: Object,
  },
  footerBg: {
    type: Object,
  },
  hasFooter: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div class="flex flex-col h-100vh">
    <div class="van-safe-area-top" :style=" headerBg ">
      <slot name="header" />
    </div>
    <div class="flex-1 overflow-auto">
      <slot />
    </div>
    <div v-if="hasFooter" :style=" footerBg " class="van-safe-area-bottom">
      <slot name="footer" />
    </div>
  </div>
</template>
