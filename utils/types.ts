import { ReactNode } from 'react';

export enum ToolCategory {
  ENCODING = '编码/解码',
  CONVERSION = '转换工具',
  FORMATTER = '格式化工具',
  GENERATION = '生成工具',
  TESTER = '测试工具',
  TEXT = '文本工具',
  NETWORK = '网络工具',
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string | ReactNode;
  category: ToolCategory;
  component: React.ComponentType;
}
