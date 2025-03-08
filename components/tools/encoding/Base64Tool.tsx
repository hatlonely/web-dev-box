import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Space, Typography, message, Radio, Checkbox, Card, Divider } from 'antd';
import { SwapOutlined, CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Group: RadioGroup, Button: RadioButton } = Radio;

// Base64 算法类型
type Base64Variant = 'standard' | 'urlsafe';

// 填充方法
type PaddingMethod = 'with-padding' | 'no-padding';

// 自定义 Base64 编码函数
const customBase64Encode = (input: string, variant: Base64Variant, padding: PaddingMethod): string => {
  // 标准 Base64 字符集
  const stdChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  // URL 安全 Base64 字符集
  const urlSafeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

  // 选择字符集
  const chars = variant === 'standard' ? stdChars : urlSafeChars;

  // 使用浏览器内置的 btoa 函数进行标准 Base64 编码
  let encoded = btoa(input);

  // 如果是 URL 安全变体，替换 + 和 / 为 - 和 _
  if (variant === 'urlsafe') {
    encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_');
  }

  // 处理填充
  if (padding === 'no-padding') {
    encoded = encoded.replace(/=+$/, '');
  }

  return encoded;
};

// 自定义 Base64 解码函数
const customBase64Decode = (input: string, variant: Base64Variant): string => {
  // 如果是 URL 安全变体，先替换 - 和 _ 为 + 和 /
  let processedInput = input;
  if (variant === 'urlsafe') {
    processedInput = processedInput.replace(/-/g, '+').replace(/_/g, '/');
  }

  // 添加必要的填充
  while (processedInput.length % 4 !== 0) {
    processedInput += '=';
  }

  // 使用浏览器内置的 atob 函数进行解码
  return atob(processedInput);
};

const Base64Tool: React.FC = () => {
  // 状态变量
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [variant, setVariant] = useState<Base64Variant>('standard');
  const [padding, setPadding] = useState<PaddingMethod>('with-padding');
  const [debugInfo, setDebugInfo] = useState<string>('');

  // 添加调试信息
  useEffect(() => {
    setDebugInfo(`当前输入: "${input}"`);
  }, [input]);

  // 组件加载时自动执行一次编码
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    handleEncode();
  }, []); // 空依赖数组，只在组件挂载时执行一次

  const handleEncode = () => {
    try {
      if (!input.trim()) {
        message.warning('请输入要编码的文本');
        return;
      }

      const encoded = customBase64Encode(input, variant, padding);
      setOutput(encoded);
      setDebugInfo(`编码成功: "${input}" => "${encoded}" (${variant === 'standard' ? '标准' : 'URL安全'} Base64, ${padding === 'with-padding' ? '有填充' : '无填充'})`);
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

      const decoded = customBase64Decode(input, variant);
      setOutput(decoded);
      setDebugInfo(`解码成功: "${input}" => "${decoded}" (${variant === 'standard' ? '标准' : 'URL安全'} Base64)`);
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

      {/* 选项和操作按钮区域 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        {/* 左侧：编码和切换模式按钮 */}
        <Col>
          <Button
            type="primary"
            onClick={handleProcess}
            size="middle"
            style={{ marginRight: 8 }}
          >
            {mode === 'encode' ? '编码' : '解码'}
          </Button>
          <Button
            icon={<SwapOutlined />}
            onClick={handleSwitch}
            size="middle"
          >
            切换模式
          </Button>
        </Col>

        {/* 右侧：base64算法和填充选项 */}
        <Col>
          <RadioGroup
            value={variant}
            onChange={(e) => {
              setVariant(e.target.value);
              // 当算法变更时，如果有输出，则重新处理
              if (output) handleProcess();
            }}
            optionType="button"
            buttonStyle="solid"
            style={{ marginRight: 8 }}
          >
            <RadioButton value="standard">标准 Base64</RadioButton>
            <RadioButton value="urlsafe">URL 安全 Base64</RadioButton>
          </RadioGroup>

          <RadioGroup
            value={padding}
            onChange={(e) => {
              setPadding(e.target.value);
              // 当填充方法变更时，如果有输出且是编码模式，则重新处理
              if (output && mode === 'encode') handleProcess();
            }}
            optionType="button"
            buttonStyle="solid"
          >
            <RadioButton value="with-padding">使用填充 (=)</RadioButton>
            <RadioButton value="no-padding">不使用填充</RadioButton>
          </RadioGroup>
        </Col>
      </Row>

      {/* 输入区域 */}
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
      </Row>

      {/* 说明区域 */}
      <Divider />
      <Card title={<><InfoCircleOutlined /> Base64 编码说明</>}>
        <Paragraph>
          Base64 是一种基于 64 个可打印字符来表示二进制数据的编码方式，常用于在 HTTP 环境下传输二进制数据。
        </Paragraph>

        <Title level={5}>Base64 算法类型</Title>
        <ul>
          <li>
            <Text strong>标准 Base64</Text>：使用 A-Z, a-z, 0-9, +, / 字符集，以 = 作为填充。适用于大多数场景。
          </li>
          <li>
            <Text strong>URL 安全 Base64</Text>：使用 A-Z, a-z, 0-9, -, _ 字符集，替换了标准 Base64 中的 + 和 /。适用于 URL、文件名等场景，避免特殊字符导致的问题。
          </li>
        </ul>

        <Title level={5}>填充方法</Title>
        <ul>
          <li>
            <Text strong>使用填充 (=)</Text>：标准 Base64 编码会在末尾添加 = 字符作为填充，确保编码后的字符串长度是 4 的倍数。
          </li>
          <li>
            <Text strong>不使用填充</Text>：去除末尾的 = 字符，使编码结果更简短。在某些场景（如 JWT）中常用。
          </li>
        </ul>

        <Paragraph>
          <Text type="secondary">注意：解码时会自动处理填充问题，无论输入是否有填充都能正确解码。</Text>
        </Paragraph>
      </Card>
    </div>
  );
};

export default Base64Tool;
