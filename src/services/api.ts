// src/services/api.ts
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { AxiosHeaders } from 'axios'

// 定义通用响应结构
interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  code?: number
}

// 创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 确保headers存在
    if (!config.headers) {
      config.headers = new AxiosHeaders()
    }

    // 添加认证信息，如token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }

    return config
  },
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data

    // 根据业务逻辑处理响应
    if (!res.success) {
      console.error('业务错误:', res.message)
      return Promise.reject(new Error(res.message || '未知错误'))
    }

    return res.data
  },
  (error) => {
    // 处理HTTP错误
    const status = error.response?.status
    switch (status) {
      case 401:
        console.error('未授权，请登录')
        // 跳转到登录页
        break
      case 403:
        console.error('权限不足')
        break
      case 500:
        console.error('服务器内部错误')
        break
    }

    return Promise.reject(error)
  },
)

// 定义具体的API方法
export const storeItem = (data: {
  name: string
  recipient: string
  phone: string
  category: string
}) => {
  return service.post<ApiResponse<void>>('/in-storage', data)
}

export default service
