import React, { useState } from 'react';
import { Input, Button, Row, Col, Space, Typography, message, Radio, Card } from 'antd';
import { CopyOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight
} from 'react-syntax-highlighter/dist/esm/styles/prism';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Group: RadioGroup, Button: RadioButton } = Radio;

// 定义主题类型
type ThemeType = 'light' | 'dark';

// 定义代码高亮主题映射
const codeThemeMap = {
  light: { value: 'oneLight', style: oneLight },
  dark: { value: 'oneDark', style: oneDark }
};

// Markdown主题样式
const markdownThemes = {
  light: {
    backgroundColor: '#ffffff',
    color: '#333333',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: '1.6',
    h1: { borderBottom: '1px solid #eaecef', paddingBottom: '0.3em', marginBottom: '16px', color: '#24292e' },
    h2: { borderBottom: '1px solid #eaecef', paddingBottom: '0.3em', marginBottom: '16px', color: '#24292e' },
    a: { color: '#0366d6', textDecoration: 'none' },
    blockquote: { padding: '0 1em', color: '#6a737d', borderLeft: '0.25em solid #dfe2e5' },
    code: { backgroundColor: '#f6f8fa', padding: '0.2em 0.4em', borderRadius: '3px', fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace' },
    pre: { backgroundColor: '#f6f8fa', padding: '16px', overflow: 'auto', borderRadius: '3px' },
    table: { borderCollapse: 'collapse', width: '100%', marginBottom: '16px' },
    th: { padding: '6px 13px', border: '1px solid #dfe2e5', fontWeight: '600' },
    td: { padding: '6px 13px', border: '1px solid #dfe2e5' },
  },
  dark: {
    backgroundColor: '#0d1117',
    color: '#c9d1d9',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: '1.6',
    h1: { borderBottom: '1px solid #21262d', paddingBottom: '0.3em', marginBottom: '16px', color: '#c9d1d9' },
    h2: { borderBottom: '1px solid #21262d', paddingBottom: '0.3em', marginBottom: '16px', color: '#c9d1d9' },
    a: { color: '#58a6ff', textDecoration: 'none' },
    blockquote: { padding: '0 1em', color: '#8b949e', borderLeft: '0.25em solid #30363d' },
    code: { backgroundColor: '#161b22', padding: '0.2em 0.4em', borderRadius: '3px', fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace' },
    pre: { backgroundColor: '#161b22', padding: '16px', overflow: 'auto', borderRadius: '3px' },
    table: { borderCollapse: 'collapse', width: '100%', marginBottom: '16px' },
    th: { padding: '6px 13px', border: '1px solid #30363d', fontWeight: '600' },
    td: { padding: '6px 13px', border: '1px solid #30363d' },
  }
};

const MarkdownPreviewTool: React.FC = () => {
  const [markdown, setMarkdown] = useState('');
  const [theme, setTheme] = useState<ThemeType>('light');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown)
      .then(() => message.success('已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  const handleClear = () => {
    setMarkdown('');
  };

  const handleThemeChange = (e: any) => {
    setTheme(e.target.value);
  };

  const handleSampleData = () => {
    const sampleMarkdown = `# Markdown 示例

## 标题

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

## 文本格式

*斜体文本* 或 _斜体文本_

**粗体文本** 或 __粗体文本__

***粗斜体文本*** 或 ___粗斜体文本___

~~删除线文本~~

## 列表

### 无序列表

- 项目1
- 项目2
  - 子项目2.1
  - 子项目2.2
- 项目3

### 有序列表

1. 第一项
2. 第二项
   1. 子项2.1
   2. 子项2.2
3. 第三项

## 链接和图片

[链接文本](https://www.example.com)

![图片描述](https://via.placeholder.com/150)

## 引用

> 这是一段引用文本。
>
> 这是引用的第二段。

## 代码

行内代码 \`const example = "hello world";\`

代码块：

\`\`\`javascript
function greeting(name) {
  return \`Hello, \${name}!\`;
}

console.log(greeting('World'));
\`\`\`

\`\`\`python
def greeting(name):
    return f"Hello, {name}!"

print(greeting('World'))
\`\`\`

\`\`\`java
public class Greeting {
    public static void main(String[] args) {
        String name = "World";
        System.out.println("Hello, " + name + "!");
    }
}
\`\`\`

## 表格

| 姓名 | 年龄 | 职业 |
|------|------|------|
| 张三 | 25 | 工程师 |
| 李四 | 30 | 设计师 |
| 王五 | 28 | 产品经理 |

## 水平线

---

## 任务列表

- [x] 已完成任务
- [ ] 未完成任务
- [ ] 另一个未完成任务
`;

    setMarkdown(sampleMarkdown);
  };

  // 获取当前选中的代码主题样式
  const getSelectedCodeThemeStyle = () => {
    return codeThemeMap[theme].style;
  };

  // 获取当前选中的Markdown主题样式
  const getSelectedMarkdownThemeStyle = () => {
    return markdownThemes[theme];
  };

  // 自定义代码渲染组件
  const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={getSelectedCodeThemeStyle()}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Markdown 预览</Title>

      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Space align="center">
            <Text strong>主题：</Text>
            <RadioGroup value={theme} onChange={handleThemeChange} optionType="button" buttonStyle="solid">
              <RadioButton value="light">亮色</RadioButton>
              <RadioButton value="dark">暗色</RadioButton>
            </RadioGroup>
          </Space>
        </Col>
        <Col span={16} style={{ textAlign: 'right' }}>
          <Space>
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              onClick={handleSampleData}
            >
              示例数据
            </Button>
            <Button
              icon={<DeleteOutlined />}
              onClick={handleClear}
              danger
            >
              清空
            </Button>
            <Button
              icon={<CopyOutlined />}
              onClick={handleCopy}
              disabled={!markdown}
              type="default"
            >
              复制
            </Button>
          </Space>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }}>
        <Row gutter={16}>
          {/* 左侧编辑区域 */}
          <Col span={12}>
            <div style={{ borderRight: '1px solid #f0f0f0', paddingRight: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>编辑</Text>
              </div>
              <TextArea
                autoSize={{ minRows: 15 }}
                value={markdown}
                onChange={handleInputChange}
                placeholder="输入Markdown文本"
                style={{ fontFamily: 'monospace', width: '100%' }}
              />
            </div>
          </Col>

          {/* 右侧预览区域 */}
          <Col span={12}>
            <div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>预览</Text>
              </div>
              <div
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: 4,
                  minHeight: 300,
                  width: '100%',
                  ...getSelectedMarkdownThemeStyle()
                }}
              >
                {markdown ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: CodeBlock
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                ) : (
                  <Text type="secondary">预览区域为空，请在左侧输入Markdown文本</Text>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Title level={4}>使用说明</Title>
          <ul>
            <li>
              <Text>
                在<strong>左侧编辑区域</strong>输入Markdown文本，右侧实时预览渲染效果
              </Text>
            </li>
            <li>
              <Text>
                选择<strong>亮色/暗色主题</strong>可以切换整体风格，包括预览区域和代码高亮
              </Text>
            </li>
            <li>
              <Text>
                支持<strong>表格</strong>、<strong>任务列表</strong>等GitHub风格的Markdown语法
              </Text>
            </li>
            <li>
              <Text>
                点击<strong>示例数据</strong>按钮可以加载Markdown示例
              </Text>
            </li>
            <li>
              <Text>
                点击<strong>复制</strong>按钮可以复制当前Markdown文本
              </Text>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default MarkdownPreviewTool;
