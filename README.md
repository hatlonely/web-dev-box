# 开发者工具箱

一个集成了常用开发工具的Web应用，旨在提高开发效率。

## 功能特点

- 使用React和Ant Design构建的现代化用户界面
- 所有组件均显示为中文
- 按类别组织的工具集合
- 支持搜索功能
- 响应式设计，适配不同屏幕尺寸

## 包含工具

### 编码/解码工具
- Base64 编码/解码：将文本转换为Base64编码，或将Base64编码解码为文本
- URL 编码/解码：对URL进行编码或解码，支持encodeURI和encodeURIComponent
- HTML 编码/解码：将特殊字符转换为HTML实体，或将HTML实体解码为特殊字符
- JWT 解码器：解析和验证JSON Web Token (JWT)，查看头部、载荷和签名
- GZip 编码/解码：使用GZip算法压缩或解压文本数据

### 转换工具
- 时间戳转换：在时间戳和日期时间之间进行转换，支持秒和毫秒
- 进制转换：在二进制、八进制、十进制和十六进制之间进行转换
- JSON ⟷ YAML：在JSON和YAML格式之间进行转换

### 格式化工具
- JSON 格式化：美化或压缩JSON数据，使其更易读或更紧凑
- XML 格式化：美化或压缩XML数据，调整缩进和格式

### 生成工具
- 密码生成器：生成安全、随机的密码，可自定义长度和字符类型
- 哈希生成器：计算文本的哈希值，支持SHA-1、SHA-256、SHA-384和SHA-512算法
- Lorem Ipsum 生成器：生成拉丁文或中文的Lorem Ipsum假文本，用于排版和设计

### 测试工具
- 正则表达式测试：测试和验证正则表达式，查看匹配结果和捕获组

### 文本工具
- Markdown 预览：编辑和预览Markdown文本，实时查看渲染效果

## 技术栈

- React：前端框架
- TypeScript：类型安全的JavaScript超集
- Ant Design：UI组件库
- React Router：路由管理
- Pako：GZip压缩库
- React Markdown：Markdown渲染

## 安装与运行

### 前提条件

- Node.js (v14.0.0+)
- npm (v6.0.0+)

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm start
```

应用将在 [http://localhost:3000](http://localhost:3000) 运行。

### 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `build` 目录中。

## 项目结构

```
web-dev-box/
├── public/                 # 静态资源
├── src/                    # 源代码
│   ├── components/         # 组件
│   │   ├── common/         # 通用组件
│   │   └── tools/          # 工具组件
│   │       ├── conversion/ # 转换工具
│   │       ├── encoding/   # 编码/解码工具
│   │       ├── formatter/  # 格式化工具
│   │       ├── generation/ # 生成工具
│   │       ├── tester/     # 测试工具
│   │       └── text/       # 文本工具
│   ├── layouts/            # 布局组件
│   ├── pages/              # 页面组件
│   └── utils/              # 工具函数
├── package.json            # 项目配置
└── tsconfig.json           # TypeScript配置
```

## 扩展新工具

要添加新工具，请按照以下步骤操作：

1. 在 `src/components/tools/` 下的相应类别目录中创建新的工具组件
2. 在 `src/utils/toolsRegistry.tsx` 中注册新工具
3. 确保为新工具提供适当的图标、名称和描述

## 贡献

欢迎贡献新的工具或改进现有工具！

## 许可证

MIT
