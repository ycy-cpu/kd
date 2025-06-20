import axios from 'axios'

const service = axios.create({
  baseURL: 'http://localhost:5000/api', // 后端API基础路径
  timeout: 10000
})

// 请求拦截器（添加token等）
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

export default service