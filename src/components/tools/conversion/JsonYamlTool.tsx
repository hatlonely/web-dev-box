import React, { useState } from 'react';
import { Input, Button, Row, Col, Space, Typography, message, Radio } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import yaml from 'js-yaml';

const { TextArea } = Input;
const { Title, Text } = Typography;

type ConversionMode = 'json2yaml' | 'yaml2json';

const JsonYamlTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<ConversionMode>('json2yaml');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError(null);
  };

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
    setOutput('');
    setError(null);
  };

  const handleConvert = () => {
    if (!input.trim()) {
      message.warning(mode === 'json2yaml' ? '请输入JSON数据' : '请输入YAML数据');
      return;
    }

    try {
      if (mode === 'json2yaml') {
        // JSON to YAML
        const jsonData = JSON.parse(input);
        const yamlStr = yaml.dump(jsonData, {
          indent: 2,
          lineWidth: -1,
          noRefs: true,
        });
        setOutput(yamlStr);
      } else {
        // YAML to JSON
        const jsonData = yaml.load(input);
        const jsonStr = JSON.stringify(jsonData, null, 2);
        setOutput(jsonStr);
      }
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
      message.error(mode === 'json2yaml' ? 'JSON解析错误' : 'YAML解析错误');
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

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>JSON ⟷ YAML 转换</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Radio.Group value={mode} onChange={handleModeChange} buttonStyle="solid">
            <Radio.Button value="json2yaml">JSON → YAML</Radio.Button>
            <Radio.Button value="yaml2json">YAML → JSON</Radio.Button>
          </Radio.Group>
        </Col>

        <Col span={24}>
          <TextArea
            rows={10}
            value={input}
            onChange={handleInputChange}
            placeholder={mode === 'json2yaml' ? '输入JSON数据' : '输入YAML数据'}
          />
        </Col>

        <Col span={24}>
          <Space>
            <Button type="primary" onClick={handleConvert}>
              转换
            </Button>
            <Button onClick={handleClear}>
              清空
            </Button>
          </Space>
        </Col>

        {error && (
          <Col span={24}>
            <div style={{ color: 'red', marginBottom: 16 }}>
              错误: {error}
            </div>
          </Col>
        )}

        <Col span={24}>
          <TextArea
            rows={10}
            value={output}
            readOnly
            placeholder="转换结果将显示在这里"
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
                <strong>JSON → YAML</strong>: 将JSON格式数据转换为YAML格式
              </Text>
            </li>
            <li>
              <Text>
                <strong>YAML → JSON</strong>: 将YAML格式数据转换为JSON格式
              </Text>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default JsonYamlTool;
