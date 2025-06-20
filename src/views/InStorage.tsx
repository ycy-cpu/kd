// src/views/InStorage.tsx
import React, { useState } from 'react'
import { Form, Input, Select, Button, message, Space } from 'antd'
import { storeItem } from '../services/api' // 引入API服务

const InStorage: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      // 使用封装的API服务，确保路径匹配后端接口
      const response = await storeItem(values)
      message.success('入库成功')
      form.resetFields()
    } catch (error: any) {
      message.error(`入库失败: ${error.response?.data?.message || '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Form
        form={form}
        name="in-storage"
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="包裹名称"
          rules={[{ required: true, message: '请输入包裹名称' }]}
        >
          <Input placeholder="请输入包裹名称" />
        </Form.Item>

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
          rules={[
            { required: true, message: '请输入联系电话' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' },
          ]}
        >
          <Input placeholder="请输入联系电话" />
        </Form.Item>

        <Form.Item
          name="category"
          label="包裹类别"
          rules={[{ required: true, message: '请选择包裹类别' }]}
        >
          <Select placeholder="请选择包裹类别">
            <Select.Option value="A">A类 (小件)</Select.Option>
            <Select.Option value="B">B类 (中件)</Select.Option>
            <Select.Option value="C">C类 (大件)</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交入库
            </Button>
            <Button htmlType="reset">重置</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default InStorage