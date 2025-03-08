import React, { useState } from 'react';
import { Input, Button, Row, Col, Space, Typography, Radio, Slider, message } from 'antd';
import { CopyOutlined, CompressOutlined, ExpandOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';

const { TextArea } = Input;
const { Title, Text } = Typography;

type FormatMode = 'pretty' | 'minify';

// 格式化XML的函数
const formatXml = (xml: string, mode: FormatMode, indentSize: number): string => {
  try {
    // 移除XML声明前的空白
    xml = xml.trim();

    if (mode === 'minify') {
      // 压缩模式：移除所有空白
      xml = xml
        .replace(/>\s+</g, '><') // 移除标签之间的空白
        .replace(/\s+</g, '<') // 移除标签开始前的空白
        .replace(/>\s+/g, '>') // 移除标签结束后的空白
        .replace(/\s+/g, ' ') // 将连续空白替换为单个空格
        .trim();
      return xml;
    }

    // 美化模式
    let formatted = '';
    let indent = 0;

    // 将XML分割为标签和文本
    const tokens = xml.split(/(<\/?[^>]+>)/g);

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (!token.trim()) {
        continue; // 跳过空白标记
      }

      // 检查是否是结束标签
      if (token.startsWith('</')) {
        indent -= 1;
        formatted += '\n' + ' '.repeat(indent * indentSize) + token;
      }
      // 检查是否是自闭合标签
      else if (token.startsWith('<') && token.endsWith('/>')) {
        formatted += '\n' + ' '.repeat(indent * indentSize) + token;
      }
      // 检查是否是开始标签
      else if (token.startsWith('<')) {
        formatted += '\n' + ' '.repeat(indent * indentSize) + token;
        indent += 1;
      }
      // 文本内容
      else {
        formatted += token.trim();
      }
    }

    // 移除开头的换行符
    return formatted.substring(1);
  } catch (error) {
    throw new Error('XML格式化失败');
  }
};

const XmlFormatterTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [mode, setMode] = useState<FormatMode>('pretty');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError(null);
  };

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

  const handleIndentChange = (value: number) => {
    setIndentSize(value);
  };

  const handleFormat = () => {
    if (!input.trim()) {
      message.warning('请输入XML数据');
      return;
    }

    try {
      const formatted = formatXml(input, mode, indentSize);
      setOutput(formatted);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(`XML解析错误: ${errorMessage}`);
      message.error('XML解析错误，请检查输入内容');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
      .then(() => message.success('已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleSampleData = () => {
    const sampleData = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <person id="1">
    <name>张三</name>
    <age>30</age>
    <address>
      <city>北京</city>
      <street>朝阳区</street>
    </address>
    <hobbies>
      <hobby>读书</hobby>
      <hobby>旅行</hobby>
      <hobby>编程</hobby>
    </hobbies>
  </person>
  <person id="2">
    <name>李四</name>
    <age>25</age>
    <address>
      <city>上海</city>
      <street>浦东新区</street>
    </address>
    <hobbies>
      <hobby>游泳</hobby>
      <hobby>摄影</hobby>
    </hobbies>
  </person>
</root>`;

    setInput(sampleData);
    setError(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>XML 格式化</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space>
            <Radio.Group value={mode} onChange={handleModeChange} buttonStyle="solid">
              <Radio.Button value="pretty">
                <ExpandOutlined /> 美化
              </Radio.Button>
              <Radio.Button value="minify">
                <CompressOutlined /> 压缩
              </Radio.Button>
            </Radio.Group>

            {mode === 'pretty' && (
              <span>
                缩进大小:
                <Slider
                  min={1}
                  max={8}
                  value={indentSize}
                  onChange={handleIndentChange}
                  style={{ width: 100, marginLeft: 8, display: 'inline-block' }}
                />
                {indentSize}
              </span>
            )}
          </Space>
        </Col>

        <Col span={24}>
          <TextArea
            rows={10}
            value={input}
            onChange={handleInputChange}
            placeholder="输入XML数据"
          />
        </Col>

        <Col span={24}>
          <Space>
            <Button type="primary" onClick={handleFormat}>
              格式化
            </Button>
            <Button onClick={handleSampleData}>
              示例数据
            </Button>
            <Button onClick={handleClear}>
              清空
            </Button>
          </Space>
        </Col>

        {error && (
          <Col span={24}>
            <div style={{ color: 'red', marginBottom: 16 }}>
              {error}
            </div>
          </Col>
        )}

        <Col span={24}>
          <TextArea
            rows={10}
            value={output}
            readOnly
            placeholder="格式化结果将显示在这里"
          />
        </Col>

        <Col span={24}>
          <Button
            icon={<CopyOutlined />}
            onClick={handleCopy}
            disabled={!output}
          >
            复制结果
          </Button>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Title level={4}>使用说明</Title>
          <ul>
            <li>
              <Text>
                <strong>美化</strong>：将XML格式化为易读的格式，可调整缩进大小
              </Text>
            </li>
            <li>
              <Text>
                <strong>压缩</strong>：将XML压缩为单行，移除所有不必要的空白字符
              </Text>
            </li>
            <li>
              <Text>
                点击"示例数据"按钮可以加载示例XML数据
              </Text>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default XmlFormatterTool;
