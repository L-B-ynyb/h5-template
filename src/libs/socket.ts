import { getDeviceId, getToken } from '@/utils/auth'

interface MessagePayload {
  type: string
  message: Record<string, any>
}

class WebSocketClient {
  private static instance: WebSocketClient
  private socket: WebSocket | null = null
  private listeners: Map<string, (data: any) => void> = new Map()
  private url = window.__APP_CONFIG__.WS_URL
  private messageQueue: MessagePayload[] = []

  private reconnectAttempts = 0
  private reconnectTimer: number | null = null

  private constructor() {
    this.connect()
  }

  public static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient()
    }
    return WebSocketClient.instance
  }

  private connect() {
    const token = getToken()
    const deviceId = getDeviceId()
    const query = new URLSearchParams({ token, 'X-Request-Id': deviceId, 'Content-Type': 'application/x-www-form-urlencoded' }).toString()
    this.socket = new WebSocket(`${this.url}?${query}`)

    this.socket.onopen = () => {
      while (this.messageQueue.length > 0) {
        const queued = this.messageQueue.shift()
        if (queued)
          this.send(queued)
      }
    }

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.listeners.forEach(fn => fn(data))
    }

    this.socket.onerror = (err) => {
      console.error('WebSocket error', err)
    }

    this.socket.onclose = (event) => {
      console.warn('WebSocket closed', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      })
      this.reconnect()
    }
  }

  private reconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.reconnectAttempts > 10) {
      console.error('WebSocket reconnect attempts exceeded')
      return
    }
    this.reconnectAttempts++
    this.reconnectTimer = window.setTimeout(() => {
      this.connect()
    }, 2000 * this.reconnectAttempts)
  }

  public offMessage(key: string) {
    this.listeners.delete(key)
  }

  // 设置登录信息
  public setLogin() {
    this.send(
      {
        type: 'SWITCH_ACCOUNT',
        message: {
          token: getToken(),
          device_id: getDeviceId(),
        },
      },
    )
  }

  // 普通发送
  public send(data: MessagePayload) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data))
    }
    else {
      console.warn('Socket not open, queueing message')
      this.messageQueue.push(data)
    }
  }

  // 监听消息
  public onMessage(cb: (data: any) => void) {
    const key = Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    this.listeners.set(key, cb)
    onUnmounted(() => {
      this.offMessage(key)
    })
  }
}

export default WebSocketClient.getInstance()
