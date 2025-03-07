import React, { useState } from 'react';
import { Input, Button, Row, Col, Space, Typography, message, Tabs } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const MarkdownPreviewTool: React.FC = () => {
  const [markdown, setMarkdown] = useState('');
  const [activeTab, setActiveTab] = useState('edit');

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

## 表格

| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 单元格1 | 单元格2 | 单元格3 |
| 单元格4 | 单元格5 | 单元格6 |

## 水平线

---

## 任务列表

- [x] 已完成任务
- [ ] 未完成任务
- [ ] 另一个未完成任务
`;

    setMarkdown(sampleMarkdown);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Markdown 预览</Title>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        style={{ marginBottom: 16 }}
      >
        <TabPane tab="编辑" key="edit">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <TextArea
                rows={20}
                value={markdown}
                onChange={handleInputChange}
                placeholder="输入Markdown文本"
                style={{ fontFamily: 'monospace' }}
              />
            </Col>

            <Col span={24}>
              <Space>
                <Button onClick={handleSampleData}>
                  示例数据
                </Button>
                <Button onClick={handleClear}>
                  清空
                </Button>
                <Button
                  icon={<CopyOutlined />}
                  onClick={handleCopy}
                  disabled={!markdown}
                >
                  复制
                </Button>
              </Space>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="预览" key="preview">
          <div
            style={{
              padding: 16,
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              minHeight: 400,
              overflow: 'auto'
            }}
          >
            {markdown ? (
              <ReactMarkdown>{markdown}</ReactMarkdown>
            ) : (
              <Text type="secondary">预览区域为空，请在编辑选项卡中输入Markdown文本</Text>
            )}
          </div>
        </TabPane>
      </Tabs>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Title level={4}>使用说明</Title>
          <ul>
            <li>
              <Text>
                在<strong>编辑</strong>选项卡中输入Markdown文本
              </Text>
            </li>
            <li>
              <Text>
                切换到<strong>预览</strong>选项卡查看渲染后的效果
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
