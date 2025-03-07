// 工具分类枚举
export enum ToolCategory {
  ENCODING = '编码/解码',
  CONVERSION = '格式转换',
  TIME = '时间工具',
  TEXT = '文本处理',
  GENERATION = '生成工具',
  NETWORK = '网络工具',
  FORMATTER = '格式化工具',
  TESTER = '测试工具',
  GRAPHICS = '图形工具'
}

// 工具接口定义
export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string | React.ReactNode;
  category: ToolCategory;
  component: React.ComponentType;
}
