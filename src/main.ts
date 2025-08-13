import { initUserBridgeContext } from '@/utils/auth'
import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import 'virtual:uno.css'
import '@/styles/app.less'
import '@/styles/var.less'
import { i18n } from '@/utils/i18n'

// Vant 桌面端适配
import '@vant/touch-emulator'

/* --------------------------------
Vant 中有个别组件是以函数的形式提供的，
包括 Toast，Dialog，Notify 和 ImagePreview 组件。
在使用函数组件时，unplugin-vue-components
无法自动引入对应的样式，因此需要手动引入样式。
------------------------------------- */
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

import { vLoading } from '@/directives/v-loading'
import vHeader from './directives/v-header'
import vFooter from './directives/v-footer'

async function bootstrap() {
  await initUserBridgeContext()

  const app = createApp(App)
  const head = createHead()

  app.use(head)
  app.use(router)
  app.use(pinia)
  app.use(i18n)
  app.directive('loading', vLoading)
  app.directive('header', vHeader)
  app.directive('footer', vFooter)

  app.mount('#app')
}

bootstrap()
