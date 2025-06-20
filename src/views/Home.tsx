// src/views/Home.tsx
import React, { useEffect, useState } from 'react'
import { Statistic, Card, Row, Col, Divider, Timeline, message } from 'antd'
import { PageHeader } from '@ant-design/pro-layout'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import axios from 'axios'

const Home: React.FC = () => {
  const [stats, setStats] = useState({
    totalPackages: 0,
    todayIn: 0,
    todayOut: 0,
    overdue: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/storage/statistics')
        console.log('统计数据响应:', response.data)
        setStats(response.data)
      } catch (error) {
        console.error('获取统计数据失败:', error)
        message.error('获取数据失败，请检查网络连接')
      }
    }

    fetchStats()
  }, [])

  return (
    <div>
      <PageHeader title="快递管理系统" subTitle="欢迎使用仓储管理平台" />
      <Divider orientation="left">数据概览</Divider>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总包裹数"
              value={stats.totalPackages}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日入库"
              value={stats.todayIn}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日出库"
              value={stats.todayOut}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="超期包裹"
              value={stats.overdue}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home
