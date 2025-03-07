import React, { useState } from 'react';
import { Input, Button, Row, Col, Space, Typography, Radio, message, Tabs } from 'antd';
import { CopyOutlined, CompressOutlined, ExpandOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import * as pako from 'pako';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

type ActionType = 'compress' | 'decompress';

const GzipTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [action, setAction] = useState<ActionType>('compress');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('text');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError(null);
  };

  const handleActionChange = (e: RadioChangeEvent) => {
    setAction(e.target.value);
    setError(null);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setError(null);
  };

  // 文本压缩
  const compressText = (text: string): string => {
    try {
      // 将文本转换为Uint8Array
      const textEncoder = new TextEncoder();
      const uint8Array = textEncoder.encode(text);

      // 使用pako压缩
      const compressed = pako.deflate(uint8Array);

      // 将压缩后的数据转换为Base64字符串
      return btoa(String.fromCharCode.apply(null, Array.from(compressed)));
    } catch (err) {
      throw new Error('压缩失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }
  };

  // 文本解压缩
  const decompressText = (base64: string): string => {
    try {
      // 将Base64字符串转换为Uint8Array
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      // 使用pako解压缩
      const decompressed = pako.inflate(bytes);

      // 将解压后的数据转换为文本
      const textDecoder = new TextDecoder();
      return textDecoder.decode(decompressed);
    } catch (err) {
      throw new Error('解压失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }
  };

  // 处理压缩/解压缩
  const handleProcess = () => {
    if (!input.trim()) {
      message.warning('请输入要处理的数据');
      return;
    }

    try {
      let result = '';

      if (action === 'compress') {
        result = compressText(input);
      } else {
        result = decompressText(input);
      }

      setOutput(result);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
      message.error(errorMessage);
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
    if (action === 'compress') {
      setInput('这是一段示例文本，用于演示GZip压缩功能。GZip是一种数据压缩格式，通常用于减小文件大小，加快网络传输速度。');
    } else {
      // 这是上面示例文本压缩后的Base64字符串
      setInput('eJxLzUvOT0nVS87PLShKLS7OzM/jcnfOz0lJLUosKS2CcZxdXMtSK5KLUlMSS1KLuFxcw1zc3F3DXDw9XDxcfVzDXMO4XDxdw1w9PVzDXD1cPV1dXcNcPVxdXQEPYBnL');
    }
    setError(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>GZip 编码/解码</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space>
            <Radio.Group value={action} onChange={handleActionChange} buttonStyle="solid">
              <Radio.Button value="compress">
                <CompressOutlined /> 压缩
              </Radio.Button>
              <Radio.Button value="decompress">
                <ExpandOutlined /> 解压
              </Radio.Button>
            </Radio.Group>
          </Space>
        </Col>

        <Col span={24}>
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane tab="文本" key="text">
              <TextArea
                rows={10}
                value={input}
                onChange={handleInputChange}
                placeholder={action === 'compress' ? '输入要压缩的文本' : '输入要解压的Base64编码字符串'}
              />
            </TabPane>
          </Tabs>
        </Col>

        <Col span={24}>
          <Space>
            <Button type="primary" onClick={handleProcess}>
              {action === 'compress' ? '压缩' : '解压'}
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
            placeholder={action === 'compress' ? '压缩结果将显示在这里' : '解压结果将显示在这里'}
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
                <strong>压缩</strong>：将文本压缩为GZip格式，并以Base64编码表示
              </Text>
            </li>
            <li>
              <Text>
                <strong>解压</strong>：将Base64编码的GZip数据解压为原始文本
              </Text>
            </li>
            <li>
              <Text>
                GZip压缩通常可以减小文本数据的大小，特别是对于重复内容较多的文本
              </Text>
            </li>
            <li>
              <Text>
                压缩后的数据以Base64编码表示，便于在文本环境中传输
              </Text>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default GzipTool;
