import React, { ReactNode, useState, useEffect } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { HomeOutlined, ToolOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  // 检测屏幕尺寸变化
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 初始检查
    checkIfMobile();

    // 监听窗口大小变化
    window.addEventListener('resize', checkIfMobile);

    // 清理监听器
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ToolOutlined style={{ fontSize: 24, color: 'white', marginRight: 12 }} />
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
              开发者工具箱
            </Link>
          </Title>
        </div>
        <div>
          <Link href="/" style={{ color: 'white', fontSize: '18px', display: 'flex', alignItems: 'center' }}>
            <HomeOutlined />
          </Link>
        </div>
      </Header>

      <Content style={{ padding: isMobile ? '0 12px' : '0 24px', marginTop: 16 }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          {children}
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        开发者工具箱 ©{new Date().getFullYear()} Created by hatlonely
      </Footer>
    </Layout>
  );
};

export default MainLayout;
