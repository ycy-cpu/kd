// src/views/OutStorage.tsx
import React, { useState } from 'react'
import { Form, Input, Button, message, Table, Space } from 'antd'
import axios from 'axios'

// 定义包裹信息接口
interface PackageInfo {
  id: number
  name: string
  recipient: string
  phone: string
  category: string
  shelf_id: number
  row_num: number
  in_time: string
}

const OutStorage: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [packageList, setPackageList] = useState<PackageInfo[]>([])
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(null)
  const [history, setHistory] = useState<any[]>([])

  const onSearch = async (values: any) => {
    setLoading(true)
    try {
      const response = await axios.get('/api/in-storage', {
        params: { phone: values.phone, recipient: values.recipient },
        timeout: 10000, // 设置超时时间
      })

      if (response.data && response.data.data) {
        setPackageList(response.data.data)
        
        if (response.data.data.length > 0) {
          setSelectedPackage(response.data.data[0])
          message.success(`找到 ${response.data.data.length} 个包裹`)
        } else {
          setSelectedPackage(null)
          message.warning('未找到对应包裹')
        }
      } else {
        setPackageList([])
        setSelectedPackage(null)
        message.warning('未找到对应包裹')
      }
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        message.error('查询超时，请重试')
      } else {
        message.error(`查询失败: ${error.response?.data?.message || '未知错误'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const onRetrieve = async () => {
    if (!selectedPackage) return

    setLoading(true)
    try {
      await axios.post('/api/out-storage', {
        id: selectedPackage.id, // 添加ID参数
        name: selectedPackage.name,
        recipient: selectedPackage.recipient,
        phone: selectedPackage.phone,
      })

      setHistory([
        {
          key: Date.now(),
          name: selectedPackage.name,
          recipient: selectedPackage.recipient,
          phone: selectedPackage.phone,
          time: new Date().toLocaleString(),
        },
        ...history,
      ])

      // 刷新列表
      setPackageList(packageList.filter(item => item.id !== selectedPackage.id))
      if (packageList.length > 1) {
        setSelectedPackage(packageList[0])
      } else {
        setSelectedPackage(null)
      }
      
      message.success('出库成功')
    } catch (error: any) {
      message.error(`出库失败: ${error.response?.data?.message || '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: '包裹名称', dataIndex: 'name', key: 'name' },
    { title: '收件人', dataIndex: 'recipient', key: 'recipient' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { title: '出库时间', dataIndex: 'time', key: 'time' },
  ]

  return (
    <div>
      <Form form={form} layout="inline" onFinish={onSearch}>
        <Form.Item
          name="recipient"
          label="收件人"
          rules={[{ required: true, message: '请输入收件人' }]}
        >
          <Input placeholder="请输入收件人" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="联系电话"
          rules={[{ required: true, message: '请输入联系电话' }]}
        >
          <Input placeholder="请输入联系电话" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            查询包裹
          </Button>
        </Form.Item>
      </Form>

      {packageList.length > 0 && (
        <div style={{ margin: '20px 0' }}>
          <Table
            dataSource={packageList}
            columns={[
              { title: '包裹名称', dataIndex: 'name', key: 'name' },
              { title: '收件人', dataIndex: 'recipient', key: 'recipient' },
              { title: '联系电话', dataIndex: 'phone', key: 'phone' },
              { title: '存放位置', dataIndex: 'shelf_id', key: 'shelf_id',
                render: (shelf_id, record) => `${shelf_id}号货架-${record.row_num}行`
              },
              { title: '入库时间', dataIndex: 'in_time', key: 'in_time',
                render: (in_time) => new Date(in_time).toLocaleString()
              },
              {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                  <Button 
                    onClick={() => setSelectedPackage(record)}
                    disabled={loading}
                    type={selectedPackage?.id === record.id ? 'primary' : 'default'}
                  >
                    {selectedPackage?.id === record.id ? '已选择' : '选择'}
                  </Button>
                ),
              },
            ]}
            pagination={false}
          />
        </div>
      )}

      {selectedPackage && (
        <div style={{ margin: '20px 0', padding: '16px', border: '1px solid #e8e8e8', borderRadius: '4px' }}>
          <h3>包裹详情</h3>
          <p>包裹名称: {selectedPackage.name}</p>
          <p>收件人: {selectedPackage.recipient}</p>
          <p>联系电话: {selectedPackage.phone}</p>
          <p>类别: {selectedPackage.category}</p>
          <p>存放位置: {selectedPackage.shelf_id}号货架-{selectedPackage.row_num}行</p>
          <p>入库时间: {new Date(selectedPackage.in_time).toLocaleString()}</p>
          
          <Button type="primary" onClick={onRetrieve} loading={loading}>
            确认出库
          </Button>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>最近出库记录</h3>
        <Table columns={columns} dataSource={history} pagination={false} />
      </div>
    </div>
  )
}

export default OutStorage