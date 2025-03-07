import React from 'react';
import { Tool, ToolCategory } from './types';
import {
  CodeOutlined,
  FieldTimeOutlined,
  SwapOutlined,
  LinkOutlined,
  FileTextOutlined,
  KeyOutlined,
  SearchOutlined,
  FormatPainterOutlined,
  Html5Outlined,
  LockOutlined,
  SafetyOutlined,
  FileTextTwoTone,
  FontSizeOutlined,
} from '@ant-design/icons';

// 导入工具组件
// 编码/解码工具
import Base64Tool from '../components/tools/encoding/Base64Tool';
import UrlEncodeTool from '../components/tools/encoding/UrlEncodeTool';
import HtmlEncodeTool from '../components/tools/encoding/HtmlEncodeTool';
import JwtDecoderTool from '../components/tools/encoding/JwtDecoderTool';

// 转换工具
import TimestampTool from '../components/tools/conversion/TimestampTool';
import BaseConversionTool from '../components/tools/conversion/BaseConversionTool';
import JsonYamlTool from '../components/tools/conversion/JsonYamlTool';

// 格式化工具
import JsonFormatterTool from '../components/tools/formatter/JsonFormatterTool';

// 生成工具
import PasswordGeneratorTool from '../components/tools/generation/PasswordGeneratorTool';
import HashGeneratorTool from '../components/tools/generation/HashGeneratorTool';
import LoremIpsumGeneratorTool from '../components/tools/generation/LoremIpsumGeneratorTool';

// 测试工具
import RegexTesterTool from '../components/tools/tester/RegexTesterTool';

// 注册所有工具
export const tools: Tool[] = [
  // 编码/解码工具
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
    id: 'html-encode',
    name: 'HTML 编码/解码',
    description: '将特殊字符转换为HTML实体，或将HTML实体解码为特殊字符',
    icon: 'Html5Outlined',
    category: ToolCategory.ENCODING,
    component: HtmlEncodeTool,
  },
  {
    id: 'jwt-decoder',
    name: 'JWT 解码器',
    description: '解析和验证JSON Web Token (JWT)，查看头部、载荷和签名',
    icon: 'LockOutlined',
    category: ToolCategory.ENCODING,
    component: JwtDecoderTool,
  },

  // 转换工具
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
  {
    id: 'json-yaml',
    name: 'JSON ⟷ YAML',
    description: '在JSON和YAML格式之间进行转换',
    icon: 'SwapOutlined',
    category: ToolCategory.CONVERSION,
    component: JsonYamlTool,
  },

  // 格式化工具
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '美化或压缩JSON数据，使其更易读或更紧凑',
    icon: 'FormatPainterOutlined',
    category: ToolCategory.FORMATTER,
    component: JsonFormatterTool,
  },

  // 生成工具
  {
    id: 'password-generator',
    name: '密码生成器',
    description: '生成安全、随机的密码，可自定义长度和字符类型',
    icon: 'KeyOutlined',
    category: ToolCategory.GENERATION,
    component: PasswordGeneratorTool,
  },
  {
    id: 'hash-generator',
    name: '哈希生成器',
    description: '计算文本的哈希值，支持SHA-1、SHA-256、SHA-384和SHA-512算法',
    icon: 'SafetyOutlined',
    category: ToolCategory.GENERATION,
    component: HashGeneratorTool,
  },
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum 生成器',
    description: '生成拉丁文或中文的Lorem Ipsum假文本，用于排版和设计',
    icon: 'FontSizeOutlined',
    category: ToolCategory.GENERATION,
    component: LoremIpsumGeneratorTool,
  },

  // 测试工具
  {
    id: 'regex-tester',
    name: '正则表达式测试',
    description: '测试和验证正则表达式，查看匹配结果和捕获组',
    icon: 'SearchOutlined',
    category: ToolCategory.TESTER,
    component: RegexTesterTool,
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
    case 'FileTextOutlined':
      return <FileTextOutlined />;
    case 'KeyOutlined':
      return <KeyOutlined />;
    case 'SearchOutlined':
      return <SearchOutlined />;
    case 'FormatPainterOutlined':
      return <FormatPainterOutlined />;
    case 'Html5Outlined':
      return <Html5Outlined />;
    case 'LockOutlined':
      return <LockOutlined />;
    case 'SafetyOutlined':
      return <SafetyOutlined />;
    case 'FileTextTwoTone':
      return <FileTextTwoTone />;
    case 'FontSizeOutlined':
      return <FontSizeOutlined />;
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
