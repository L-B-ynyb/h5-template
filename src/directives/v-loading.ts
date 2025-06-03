// src/directives/v-loading.ts
import type { Directive } from 'vue'
import { createApp, h } from 'vue'
import { Loading } from 'vant'

// 用于创建 loading 实例
function createLoadingMask() {
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.top = '0'
  container.style.left = '0'
  container.style.right = '0'
  container.style.bottom = '0'
  container.style.background = 'rgba(255, 255, 255, 0.6)'
  container.style.display = 'flex'
  container.style.alignItems = 'center'
  container.style.justifyContent = 'center'
  container.style.zIndex = '9999'

  const app = createApp({
    render() {
      return h(Loading, {
        type: 'spinner',
        size: '24',
        color: '#1989fa',
      })
    },
  })
  app.mount(container)

  return container
}

// v-loading 指令实现
export const vLoading: Directive = {
  mounted(el, binding) {
    const mask = createLoadingMask()
    el.__vLoadingMask = mask

    const style = getComputedStyle(el)
    if (style.position === 'static' || !style.position) {
      el.style.position = 'relative'
    }

    if (binding.value) {
      el.appendChild(mask)
    }
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      if (binding.value) {
        el.appendChild(el.__vLoadingMask)
      }
      else {
        el.__vLoadingMask?.remove()
      }
    }
  },
  unmounted(el) {
    el.__vLoadingMask?.remove()
    delete el.__vLoadingMask
  },
}
