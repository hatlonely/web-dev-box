import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Space, Typography, message } from 'antd';
import { SwapOutlined, CopyOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

const Base64Tool: React.FC = () => {
  // 添加默认输入文本
  const [input, setInput] = useState('Hello, World!');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [debugInfo, setDebugInfo] = useState<string>('');

  // 添加调试信息
  useEffect(() => {
    setDebugInfo(`当前输入: "${input}"`);
  }, [input]);

  // 组件加载时自动执行一次编码
  useEffect(() => {
    handleEncode();
  }, []); // 空依赖数组，只在组件挂载时执行一次

  const handleEncode = () => {
    try {
      if (!input.trim()) {
        message.warning('请输入要编码的文本');
        return;
      }

      const encoded = btoa(input);
      setOutput(encoded);
      setDebugInfo(`编码成功: "${input}" => "${encoded}"`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      setDebugInfo(`编码失败: ${errorMessage}`);
      message.error('编码失败，请检查输入内容');
    }
  };

  const handleDecode = () => {
    try {
      if (!input.trim()) {
        message.warning('请输入要解码的Base64字符串');
        return;
      }

      const decoded = atob(input);
      setOutput(decoded);
      setDebugInfo(`解码成功: "${input}" => "${decoded}"`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      setDebugInfo(`解码失败: ${errorMessage}`);
      message.error('解码失败，请检查输入内容是否为有效的Base64字符串');
    }
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const handleSwitch = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
    setDebugInfo(`模式切换为: ${mode === 'encode' ? '解码' : '编码'}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
      .then(() => {
        message.success('已复制到剪贴板');
        setDebugInfo('复制成功');
      })
      .catch(() => {
        message.error('复制失败');
        setDebugInfo('复制失败');
      });
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Base64 编码/解码</Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <TextArea
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '输入要编码的文本' : '输入要解码的Base64字符串'}
          />
        </Col>
        <Col span={24}>
          <Space>
            <Button type="primary" onClick={handleProcess}>
              {mode === 'encode' ? '编码' : '解码'}
            </Button>
            <Button icon={<SwapOutlined />} onClick={handleSwitch}>
              切换模式
            </Button>
          </Space>
        </Col>
        <Col span={24}>
          <TextArea
            rows={6}
            value={output}
            readOnly
            placeholder="结果将显示在这里"
          />
        </Col>
        <Col span={24}>
          <Space>
            <Button
              icon={<CopyOutlined />}
              onClick={handleCopy}
              disabled={!output}
            >
              复制结果
            </Button>
            <Text type="secondary">输入长度: {input.length}</Text>
            <Text type="secondary">输出长度: {output.length}</Text>
          </Space>
        </Col>

        {/* 调试信息 */}
        <Col span={24}>
          <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
            <Text type="secondary">调试信息: {debugInfo}</Text>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Base64Tool;
