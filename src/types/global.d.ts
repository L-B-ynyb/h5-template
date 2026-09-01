export {}

declare global {
  interface Window {
    // 运行时注入的应用配置（如 WS_URL），避免 socket.ts 类型报错
    __APP_CONFIG__?: {
      WS_URL?: string
    }
  }
}
