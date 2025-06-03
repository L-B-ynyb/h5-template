<script setup lang='ts'>
import back_white from '@/assets/images/navBar/back_white.png'
import back_black from '@/assets/images/navBar/back_black.png'
import { useRouter } from 'vue-router'

const props = defineProps({
  isBack: {
    default: true,
  },
  height: {
    type: Number,
    default: 44,
  },
  iconColor: {
    type: String as PropType<'white' | 'black'>,
    default: 'white',
    validator: (val: string) => ['white', 'black'].includes(val),
  },
})
const emits = defineEmits(['back'])
const router = useRouter()
const backIcon = computed(() => {
  return props.iconColor === 'black' ? back_black : back_white
})

const instance = getCurrentInstance()
function goBack() {
  const hasListener = !!instance?.vnode.props?.onBack
  if (hasListener) {
    emits('back')
  }
  else {
    router.back()
  }
}
</script>

<template>
  <div class="pos-relative" :style="{ height: `${height}px` }">
    <div class="px-22px flex h-full w-full a-c j-b pos-absolute">
      <div>
        <div v-if="isBack" @click="goBack">
          <img :src="backIcon" width="24" height="24">
        </div>
        <slot name="left" />
      </div>
      <div>
        <slot name="right" />
      </div>
    </div>

    <div class="flex h-full a-c j-c">
      <slot />
    </div>
  </div>
</template>
