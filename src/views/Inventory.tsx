// src/views/Inventory.tsx
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

const Inventory: React.FC = () => {
  const [dataSource, setDataSource] = useState<PackageInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (searchValue = '') => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get('/api/in-storage', {
        params: { search: searchValue },
      })
      setDataSource(response.data as PackageInfo[])
    } catch (error: any) {
      setError(
        `获取库存数据失败: ${error.response?.data?.message || '未知错误'}`,
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    fetchData(value)
  }

  const handleRetrieve = async (record: PackageInfo) => {
    try {
      await axios.post('/api/out-storage', {
        id: record.id,
        name: record.name,
        recipient: record.recipient,
        phone: record.phone,
      })
      fetchData(searchText)
      message.success('出库成功')
    } catch (error: any) {
      message.error(`出库失败: ${error.response?.data?.message || '未知错误'}`)
    }
  }

  const columns: ColumnType<PackageInfo>[] = [
    {
      title: '包裹名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '收件人',
      dataIndex: 'recipient',
      key: 'recipient',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      render: (text: 'A' | 'B' | 'C') => {
        const categoryMap = {
          A: 'A类 (小件)',
          B: 'B类 (中件)',
          C: 'C类 (大件)',
        }
        return categoryMap[text] || text
      },
    },
    {
      title: '存放位置',
      key: 'location',
      render: (_: unknown, record: PackageInfo) =>
        `${record.shelf_id}号货架-${record.row_num}行`,
    },
    {
      title: '入库时间',
      dataIndex: 'in_time',
      key: 'in_time',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: PackageInfo) => (
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
          placeholder="搜索包裹名称/收件人/电话"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ width: 600 }}
        />
      </Space>

      {dataSource.length > 0 ? (
        <Table<PackageInfo>
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            total: dataSource.length,
          }}
        />
      ) : loading ? (
        <div style={{ padding: 20 }}>加载中...</div>
      ) : (
        <div style={{ padding: 20, color: '#666' }}>未找到库存数据</div>
      )}
    </div>
  )
}

export default Inventory
