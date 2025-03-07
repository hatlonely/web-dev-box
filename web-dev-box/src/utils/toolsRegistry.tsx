import React from 'react';
import { Tool, ToolCategory } from './types';
import {
  CodeOutlined,
  FieldTimeOutlined,
  SwapOutlined,
  LinkOutlined,
} from '@ant-design/icons';

// 导入工具组件
import Base64Tool from '../components/tools/encoding/Base64Tool';
import UrlEncodeTool from '../components/tools/encoding/UrlEncodeTool';
import TimestampTool from '../components/tools/conversion/TimestampTool';
import BaseConversionTool from '../components/tools/conversion/BaseConversionTool';

// 注册所有工具
export const tools: Tool[] = [
  {
    id: 'base64',
    name: 'Base64 编码/解码',
    description: '将文本转换为Base64编码，或将Base64编码解码为文本',
    icon: 'CodeOutlined',
    category: ToolCategory.ENCODING,
    component: Base64Tool,
  },
  {
    id: 'url-encode',
    name: 'URL 编码/解码',
    description: '对URL进行编码或解码，支持encodeURI和encodeURIComponent',
    icon: 'LinkOutlined',
    category: ToolCategory.ENCODING,
    component: UrlEncodeTool,
  },
  {
    id: 'timestamp',
    name: '时间戳转换',
    description: '在时间戳和日期时间之间进行转换，支持秒和毫秒',
    icon: 'FieldTimeOutlined',
    category: ToolCategory.CONVERSION,
    component: TimestampTool,
  },
  {
    id: 'base-conversion',
    name: '进制转换',
    description: '在二进制、八进制、十进制和十六进制之间进行转换',
    icon: 'SwapOutlined',
    category: ToolCategory.CONVERSION,
    component: BaseConversionTool,
  },
];

// 获取工具图标组件
export const getToolIcon = (iconName: string): React.ReactNode => {
  switch (iconName) {
    case 'CodeOutlined':
      return <CodeOutlined />;
    case 'LinkOutlined':
      return <LinkOutlined />;
    case 'FieldTimeOutlined':
      return <FieldTimeOutlined />;
    case 'SwapOutlined':
      return <SwapOutlined />;
    default:
      return <CodeOutlined />;
  }
};

// 按分类获取工具
export const getToolsByCategory = (category: ToolCategory): Tool[] => {
  return tools.filter(tool => tool.category === category);
};

// 获取所有分类
export const getAllCategories = (): ToolCategory[] => {
  return Array.from(new Set(tools.map(tool => tool.category)));
};

// 搜索工具
export const searchTools = (keyword: string): Tool[] => {
  if (!keyword.trim()) {
    return tools;
  }

  const lowerKeyword = keyword.toLowerCase();
  return tools.filter(
    tool =>
      tool.name.toLowerCase().includes(lowerKeyword) ||
      tool.description.toLowerCase().includes(lowerKeyword) ||
      tool.category.toLowerCase().includes(lowerKeyword)
  );
};
