import React, { useState, useEffect, useCallback } from 'react';
import { Input, Row, Col, Card, Tabs, Empty, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import ToolCard from '../components/common/ToolCard';
import { Tool, ToolCategory } from '../utils/types';
import { tools, getAllCategories, searchTools, getToolsByCategory, getToolIcon } from '../utils/toolsRegistry';

const HomePage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);
  const [categories, setCategories] = useState<ToolCategory[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // 检测屏幕尺寸变化
  const checkIfMobile = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    setCategories(getAllCategories());

    // 初始检查
    checkIfMobile();

    // 监听窗口大小变化
    window.addEventListener('resize', checkIfMobile);

    // 清理监听器
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [checkIfMobile]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    setFilteredTools(searchTools(keyword));
  };

  const handleToolClick = (tool: Tool) => {
    router.push(`/tool/${tool.id}`);
  };

  const renderToolCards = (toolsList: Tool[]) => {
    if (toolsList.length === 0) {
      return <Empty description="没有找到匹配的工具" />;
    }

    return (
      <Row gutter={[16, 16]}>
        {toolsList.map(tool => (
          <Col xs={24} sm={12} md={8} lg={6} key={tool.id}>
            <ToolCard
              tool={{
                ...tool,
                icon: typeof tool.icon === 'string' ? getToolIcon(tool.icon) : tool.icon
              }}
              onClick={handleToolClick}
            />
          </Col>
        ))}
      </Row>
    );
  };

  // 生成Tabs的items配置
  const getTabItems = () => {
    const items = [
      {
        key: 'all',
        label: '全部工具',
        children: renderToolCards(tools)
      }
    ];

    categories.forEach((category: ToolCategory) => {
      items.push({
        key: category,
        label: category,
        children: renderToolCards(getToolsByCategory(category))
      });
    });

    return items;
  };

  return (
    <div style={{ padding: isMobile ? 12 : 24 }}>
      <Card style={{ marginBottom: 24 }}>
        <Input
          size="large"
          placeholder="搜索工具..."
          prefix={<SearchOutlined />}
          value={searchKeyword}
          onChange={handleSearch}
          allowClear
        />
      </Card>

      {searchKeyword ? (
        <div>
          <Divider orientation="left">搜索结果</Divider>
          {renderToolCards(filteredTools)}
        </div>
      ) : (
        <Tabs defaultActiveKey="all" items={getTabItems()} />
      )}
    </div>
  );
};

export default HomePage;
