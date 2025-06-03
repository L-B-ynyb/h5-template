import jsBridge from '@/utils/jsBridge'
import { STORAGE_DEVICE_ID_KEY, STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import { useLocalStorage } from '@vueuse/core'

const token = useLocalStorage(STORAGE_TOKEN_KEY, '')
const deviceId = useLocalStorage(STORAGE_DEVICE_ID_KEY, '')

export async function initUserBridgeContext() {
  try {
    const res = await jsBridge.call('getUserInfo')
    if (res) {
      localStorage.setItem('userInfo', JSON.stringify(res))
    }
    if (res?.token) {
      localStorage.setItem(STORAGE_TOKEN_KEY, res.token)
    }
    if (res?.device_id) {
      localStorage.setItem(STORAGE_DEVICE_ID_KEY, res.device_id)
    }
  }
  catch (err) {
    console.warn('[JSBridge] 获取用户信息失败，使用默认值:', err)
    localStorage.setItem(
      STORAGE_TOKEN_KEY,
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTYwMzcwNjMsImp0aSI6Inl5QnpTQ3RlY0IiLCJpYXQiOjE3NDgyNjEwNjMsImlzcyI6IjlwNnlqdW9hVnhuMFZ3d21TdHRJY20zWEp3bWNmUkNrIiwibmJmIjoxNzQ4MjYxMDYzLCJzdWIiOiI4MDAwMDI1NCIsImFwcGlkIjoxLCJzaXRlIjo0LCJwbGF0Zm9ybSI6Im1vYmlsZSIsInVpZCI6IjgwMDAwMjU0IiwibXBfdWlkIjoiIiwiZGV2aWNlX2lkIjoiMzYyMWRmZjAtYmQ3Zi00ZTkyLTk0OGMtZTcxNzMxNDViNmM2IiwidHJhbnNhY3Rpb25fYWNjb3VudCI6MjAwMTAxLCJ0cmFuc2FjdGlvbl9hY2NvdW50X3R5cGUiOjAsInRyYW5zYWN0aW9uX3BsYXRmb3JtIjoiTVQ1IiwibG9naW5fdGltZSI6MTc0ODI2MTA2M30.la7CFIccK4lw7PUgvhGzMfk1F7gAEYzyDKparN41MyU', // 你的默认 token
    )
    localStorage.setItem(STORAGE_DEVICE_ID_KEY, '3621dff0-bd7f-4e92-948c-e7173145b6c6')
  }
}

function isLogin() {
  return !!token.value
}

function getToken() {
  return token.value
}

function setToken(newToken: string) {
  token.value = newToken
}

function clearToken() {
  token.value = null
}

// device
function getDeviceId() {
  return deviceId.value
}
function setDeviceId(newDeviceId: string) {
  deviceId.value = newDeviceId
}
function clearDeviceId() {
  deviceId.value = null
}

export { isLogin, getToken, setToken, clearToken, getDeviceId, setDeviceId, clearDeviceId }
