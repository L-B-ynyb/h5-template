import type { DirectiveBinding } from 'vue'

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const maxWidth = binding.value?.maxWidth || '600px'

    // 提取原始内容作为 header 内容
    const originalChildren = Array.from(el.childNodes)

    el.innerHTML = ''

    // 创建 fixed 头部
    const fixedDiv = document.createElement('div')
    const customClass = binding.value?.class || ''
    const isHeader = binding.value?.isHeader !== false
    fixedDiv.className = `${isHeader ? 'van-safe-area-top' : ''} ${customClass} ${el.className}`.trim()
    fixedDiv.style.position = 'fixed'
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
