import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Card, Typography, Breadcrumb } from 'antd';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { tools } from '../../utils/toolsRegistry';

const { Title } = Typography;

const ToolPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  // 查找对应的工具
  const tool = tools.find(t => t.id === id);

  // 如果工具不存在，显示错误信息
  if (!tool) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Title level={2}>工具未找到</Title>
          <p>抱歉，您请求的工具不存在。</p>
          <Button type="primary" onClick={() => router.push('/')}>
            返回首页
          </Button>
        </Card>
      </div>
    );
  }

  // 渲染工具组件
  const ToolComponent = tool.component;

  // 生成Breadcrumb的items配置
  const breadcrumbItems = [
    {
      title: (
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <HomeOutlined /> 首页
        </Link>
      ),
    },
    {
      title: tool.category,
    },
    {
      title: tool.name,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />

      <Button
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => router.push('/')}
      >
        返回首页
      </Button>

      <Card>
        <ToolComponent />
      </Card>
    </div>
  );
};

export default ToolPage;
