import React, { ReactNode } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { HomeOutlined, ToolOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ToolOutlined style={{ fontSize: 24, color: 'white', marginRight: 12 }} />
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
              开发者工具箱
            </Link>
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ marginLeft: 'auto' }}
          items={[
            {
              key: '1',
              label: <Link href="/"><HomeOutlined /></Link>,
            },
          ]}
        />
      </Header>

      <Content style={{ padding: '0 50px', marginTop: 16 }}>
        {children}
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        开发者工具箱 ©{new Date().getFullYear()} Created by hatlonely
      </Footer>
    </Layout>
  );
};

export default MainLayout;
