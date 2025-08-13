// src/directives/v-footer.ts
import type { DirectiveBinding } from 'vue'

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const maxWidth = binding.value?.maxWidth || '600px'

    // 提取原始内容作为 footer 内容
    const originalChildren = Array.from(el.childNodes)

    el.innerHTML = ''

    // 创建 fixed 底部
    const fixedDiv = document.createElement('div')
    const customClass = binding.value?.class || ''
    const isFooter = binding.value?.isFooter !== false
    const isPopupBottom = binding.value?.isPopupBottom as boolean
    fixedDiv.className = `${isFooter ? 'van-safe-area-bottom' : ''} ${customClass} ${el.className}`.trim()
    if (isPopupBottom) {
      fixedDiv.style.paddingBottom = '20px'
      fixedDiv.style.borderRadius = '20px'
    }
    fixedDiv.style.position = 'fixed'
    fixedDiv.style.bottom = '0'
    fixedDiv.style.backgroundColor = el.style.backgroundColor || 'var(--color-bg)'
    fixedDiv.style.zIndex = '100'
    fixedDiv.style.width = '100%'
    fixedDiv.style.boxSizing = 'content-box'
    fixedDiv.style.maxWidth = maxWidth

    for (const node of originalChildren) {
      fixedDiv.appendChild(node)
    }

    const placeholder = document.createElement('div')

    el.appendChild(fixedDiv)
    el.appendChild(placeholder)

    requestAnimationFrame(() => {
      const height = fixedDiv.getBoundingClientRect().height
      placeholder.style.height = `${height}px`
    })
  },
}
