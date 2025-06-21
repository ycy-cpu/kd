import React, { useEffect, useState } from 'react'
import { Table, Input, Button, Space, Popconfirm, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import axios from 'axios'
import { ColumnType } from 'antd/lib/table'

// 定义包裹信息接口
interface PackageInfo {
  id: number
  name: string
  recipient: string
  phone: string
  category: 'A' | 'B' | 'C'
  shelf_id: number
  row_num: number
  in_time: string
}

// 定义搜索参数类型
type SearchParams = {
  name?: string
  recipient?: string
  phone?: string
}

const Inventory: React.FC = () => {
  const [dataSource, setDataSource] = useState<PackageInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState<SearchParams>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (params: SearchParams = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get('/api/in-storage', { params })

      // 调试日志：检查响应数据类型
      console.log('API响应类型:', typeof response.data)
      console.log('API响应内容:', response.data)

      // 严格验证数据格式
      const rawData = response.data
      const safeData = Array.isArray(rawData)
        ? rawData.filter((item) => typeof item === 'object' && item !== null)
        : []

      console.log('处理后的数据:', safeData)

      // 确保每个项都有必要的字段
      const validatedData = safeData.map((item) => ({
        id: item.id || Math.random(), // 确保有id字段
        name: item.name || '',
        recipient: item.recipient || '',
        phone: item.phone || '',
        category: item.category || 'A',
        shelf_id: item.shelf_id || 0,
        row_num: item.row_num || 0,
        in_time: item.in_time || new Date().toISOString(),
      }))

      setDataSource(validatedData as PackageInfo[])
    } catch (error: any) {
      setError(`获取库存数据失败: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // 优化搜索处理
  const handleSearch = (field: keyof SearchParams, value: string) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }))
    fetchData({ ...searchParams, [field]: value })
  }

  // 出库操作
  const handleRetrieve = async (record: PackageInfo) => {
    try {
      await axios.post('/api/out-storage', { id: record.id })
      fetchData(searchParams) // 使用当前搜索条件刷新
      message.success('出库成功')
    } catch (error: any) {
      message.error(`出库失败: ${error.message}`)
    }
  }

  // 表格列定义
  const columns: ColumnType<PackageInfo>[] = [
    { title: '包裹名称', dataIndex: 'name', key: 'name' },
    { title: '收件人', dataIndex: 'recipient', key: 'recipient' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { title: '类别', dataIndex: 'category', key: 'category' },
    {
      title: '存放位置',
      key: 'location',
      render: (_, record) => `${record.shelf_id}号货架-${record.row_num}行`,
    },
    { title: '入库时间', dataIndex: 'in_time', key: 'in_time' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="确认出库?"
            onConfirm={() => handleRetrieve(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="primary" size="small">
              出库
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="搜索包裹名称"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={(value) => handleSearch('name', value)}
          style={{ width: 200 }}
        />
        <Input.Search
          placeholder="搜索收件人"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={(value) => handleSearch('recipient', value)}
          style={{ width: 200 }}
        />
        <Input.Search
          placeholder="搜索电话"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={(value) => handleSearch('phone', value)}
          style={{ width: 200 }}
        />
      </Space>

      <Table<PackageInfo>
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default Inventory
