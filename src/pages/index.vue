<script setup lang="ts">
import { computed, ref } from 'vue'
import jsBridge from '@/utils/jsBridge'

import { showToast } from 'vant'
import router from '@/router'

const isPartner = ref(false)
const getBg = computed(() => ({
  background: 'yellow',
}))

const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)

async function back() {
  try {
    await jsBridge.call('close')
  }
  catch {
    router.back()
  }
}

const inviteCode = ref('')

async function share() {
  const invite_code = inviteCode.value || ''
  const host = import.meta.env.VITE_APP_DAVMU_WAP_HOST
  const shareLink = `${host}/davmu/partner/invite?invite_code=${invite_code}`
  try {
    await jsBridge.call('more', { shareLink, shareTypes: [5] })
  }
  catch (error) {
    showToast(`
    分享失败${error}
    当前非App环境
    已将链接复制到剪切板，您可自行分享
    `)
    navigator.clipboard.writeText(shareLink)
  }
}
</script>

<template>
  <FullPageView :header-bg="{ ...getBg, backgroundPosition: 'top' }" :footer-bg="{ ...getBg, backgroundPosition: 'bottom' }">
    <template #header>
      <NavBar icon-color="black" @back="back">
        <div class="text-black flex j-c">
          招募合伙人
        </div>
      </NavBar>
    </template>
    <div class="px-14px py-12px" :style="{ ...getBg, backgroundPosition: 'center' }">
      content
      <VanButton @click="router.push('/sub')">
        go to sub
      </VanButton>
    </div>
    <template #footer>
      <div class="p-14px" :style="{ paddingBottom: isIOS ? '0' : '14px' }">
        <div v-if="!isPartner" class="text-20px text-white rounded-full bg-#9C5A00 flex h-48px a-c j-c" @click="isPartner = true">
          立刻成为合伙人
        </div>
        <div v-else class="text-20px text-white rounded-full bg-#9C5A00 flex h-48px a-c j-c" @click="share">
          立即分享 马上赚现金
        </div>
      </div>
    </template>
  </FullPageView>
</template>

<route lang="json5">
{
  name: 'partner',
  meta: {
    title: '邀请合伙人',
    i18n: 'partner'
  },
}
</route>
