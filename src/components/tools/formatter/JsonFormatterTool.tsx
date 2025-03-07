import React, { useState } from 'react';
import { Input, Button, Row, Col, Space, Typography, Slider, message, Radio } from 'antd';
import { CopyOutlined, CompressOutlined, ExpandOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';

const { TextArea } = Input;
const { Title, Text } = Typography;

type FormatMode = 'pretty' | 'minify';

const JsonFormatterTool: React.FC = () => {
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
      message.warning('请输入JSON数据');
      return;
    }

    try {
      // 解析JSON以验证其有效性
      const jsonObj = JSON.parse(input);

      let formatted: string;
      if (mode === 'pretty') {
        // 美化格式
        formatted = JSON.stringify(jsonObj, null, indentSize);
      } else {
        // 压缩格式
        formatted = JSON.stringify(jsonObj);
      }

      setOutput(formatted);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(`JSON解析错误: ${errorMessage}`);
      message.error('JSON解析错误，请检查输入内容');
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
    const sampleData = {
      name: "开发者工具箱",
      version: "1.0.0",
      description: "集成常用的开发工具",
      tools: [
        {
          id: "json-formatter",
          name: "JSON格式化",
          category: "格式化工具"
        },
        {
          id: "base64",
          name: "Base64编码/解码",
          category: "编码/解码"
        }
      ],
      settings: {
        theme: "light",
        language: "zh-CN"
      }
    };

    setInput(JSON.stringify(sampleData));
    setError(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>JSON 格式化</Title>

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
            placeholder="输入JSON数据"
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
                <strong>美化</strong>：将JSON格式化为易读的格式，可调整缩进大小
              </Text>
            </li>
            <li>
              <Text>
                <strong>压缩</strong>：将JSON压缩为单行，移除所有不必要的空白字符
              </Text>
            </li>
            <li>
              <Text>
                点击"示例数据"按钮可以加载示例JSON数据
              </Text>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default JsonFormatterTool;
