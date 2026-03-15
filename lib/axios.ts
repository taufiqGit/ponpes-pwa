import axios from 'axios'
import { useAuthStore } from '@/store/auth'

export const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_URL_API ??
    'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

let hasHandledAuthError = false

function handleAuthError() {
  if (typeof window === 'undefined') return
  if (hasHandledAuthError) return
  hasHandledAuthError = true

  try {
    localStorage.removeItem('auth_token')
  } catch {}

  try {
    useAuthStore.getState().clearUser()
  } catch {}

  const path = window.location?.pathname ?? ''
  if (path !== '/login') {
    window.location.replace('/login')
    return
  }

  window.location.reload()
}

axiosInstance.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config

  const token = localStorage.getItem('auth_token')

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => {
    if (response?.status === 401 || response?.status === 403) {
      handleAuthError()
      return Promise.reject(new Error('Unauthorized'))
    }
    return response
  },
  (error) => {
    const status = error?.response?.status
    if (status === 401 || status === 403) {
      handleAuthError()
    }
    return Promise.reject(error)
  },
)
