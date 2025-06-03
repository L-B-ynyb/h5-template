<script setup>
import { ref } from 'vue'

const props = defineProps({
  list: {
    type: Array,
  },
})

const emit = defineEmits(['change'])

const activeIndex = ref(0)

function handleClick(index) {
  activeIndex.value = index
  emit('change', index)
}
</script>

<template>
  <div class="flex gap-12px">
    <div
      v-for="(i, index) in props.list"
      :key="index"
      class="text-14px rounded-12px flex h-26px w-62px a-c j-c"
      :style="{
        backgroundColor: activeIndex === index ? '#3E7DFE' : '#FFF',
        color: activeIndex === index ? '#FFFFFF' : '#2B2B2E',
      }"
      @click="handleClick(index)"
    >
      {{ i }}
    </div>
  </div>
</template>
