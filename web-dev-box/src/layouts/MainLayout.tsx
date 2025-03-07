import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { GithubOutlined, ToolOutlined } from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const MainLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ToolOutlined style={{ fontSize: 24, color: 'white', marginRight: 12 }} />
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
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
              label: <Link to="/">首页</Link>,
            },
            {
              key: '2',
              label: (
                <a href="https://github.com/hatlonely/web-dev-box" target="_blank" rel="noopener noreferrer">
                  <GithubOutlined /> GitHub
                </a>
              ),
            },
          ]}
        />
      </Header>

      <Content style={{ padding: '0 50px', marginTop: 16 }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        开发者工具箱 ©{new Date().getFullYear()} Created by hatlonely
      </Footer>
    </Layout>
  );
};

export default MainLayout;
