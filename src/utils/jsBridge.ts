declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        [key: string]: {
          postMessage: (data: any) => any
        }
      }
    }
    CMSScriptMessageChannel?: {
      postMessage: (data: any) => any
    }
    CMSJsCallBack?: (data: any) => void
    CMSCallJsMessage?: (data: any) => void
  }
}

let callId = 0
const callbackMap = {}
const eventMap = {}

/**
 * H5 调用 APP 方法
 * @param {string} method - 方法名（如 showToast）
 * @param {object} data - 参数（可选）
 * @returns {Promise<any>}
 */

function callNative(method, data = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const methodId = `cb_${method}_${Date.now()}_${++callId}`
    const payload = {
      method,
      params: {
        ...data,
        methodId,
      },
    }
    callbackMap[methodId] = function (res) {
      if (res.code === '1') {
        resolve(res.data)
      }
      else {
        reject(new Error(res.data?.msg || '调用失败'))
      }
      delete callbackMap[methodId]
    }
    try {
      if (window.webkit?.messageHandlers?.CMSScriptMessageChannel) {
        window.webkit.messageHandlers.CMSScriptMessageChannel.postMessage(payload)
      }
      else if (window.CMSScriptMessageChannel) {
        window.CMSScriptMessageChannel.postMessage(JSON.stringify(payload))
      }
      else {
        reject(new Error('JSBridge 通道不存在'))
      }
    }
    catch (err) {
      const errorResponse = {
        code: '0',
        method,
        data: {
          msg: err.message || '调用异常',
        },
      }
      reject(errorResponse)
    }
  })
}

function onAppMessage({ code = '0', methodId, method, data = {} }) {
  if (methodId && callbackMap[methodId]) {
    callbackMap[methodId]({ code, methodId, data })
  }
  if (method && eventMap[method]) {
    const eventData = { code: '1', method, data }
    eventMap[method].forEach(fn => fn(eventData))
  }
}

/**
 * 注册事件监听（App 主动通知 H5）
 * @param {string} event 事件名
 * @param {Function} callback 回调函数
 */
function on(event, callback) {
  if (!eventMap[event]) {
    eventMap[event] = []
  }
  eventMap[event].push(callback)
}

window.CMSJsCallBack = onAppMessage
window.CMSCallJsMessage = onAppMessage

export default {
  call: callNative,
  on,
}
