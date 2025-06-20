// src/services/inventory.ts
import service from './api'

// 获取库存列表
export const getInventoryList = () => {
  return service.get('/inventory')
}

// 入库操作
export const storeItem = (data: {
  name: string
  recipient: string
  phone: string
  category: string
}) => {
  return service.post('/storage', data)
}

// 出库操作
export const retrieveItem = (data: {
  name: string
  recipient: string
  phone: string
}) => {
  return service.post('/out-storage', data)
}
