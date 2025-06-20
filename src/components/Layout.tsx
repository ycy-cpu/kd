// src/components/Layout.tsx
import { Layout, Menu } from 'antd'
// 改为按需导入具体图标
import { HomeOutlined, InboxOutlined, TableOutlined } from '@ant-design/icons'

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
// 添加仓库中存在的出库图标替代（如 ExportOutlined）
import { ExportOutlined } from '@ant-design/icons'
import React from 'react'
// 或直接导入所需类型
import type { ReactNode } from 'react'

const { Header, Sider, Content } = Layout

function BasicLayout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">首页</Link>
          </Menu.Item>
          <Menu.Item key="/in-storage" icon={<InboxOutlined />}>
            <Link to="/in-storage">入库管理</Link>
          </Menu.Item>
          <Menu.Item key="/out-storage" icon={<ExportOutlined />}>
            <Link to="/out-storage">出库管理</Link>
          </Menu.Item>
          <Menu.Item key="/inventory" icon={<TableOutlined />}>
            <Link to="/inventory">库存查询</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default BasicLayout
