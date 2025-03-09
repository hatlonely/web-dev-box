import React, { useState } from 'react';
import { Input, Button, Row, Col, Space, Typography, Radio, message, Divider } from 'antd';
import { SwapOutlined, CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Group: RadioGroup, Button: RadioButton } = Radio;

const HtmlEncodeTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
    // 清空输出
    setOutput('');
  };

  const handleEncode = () => {
    if (!input.trim()) {
      message.warning('请输入要编码的文本');
      return;
    }

    try {
      // 使用DOM API进行HTML编码
      const textarea = document.createElement('textarea');
      textarea.textContent = input;
      const encoded = textarea.innerHTML;
      setOutput(encoded);
    } catch (error) {
      message.error('编码失败，请检查输入内容');
    }
  };

  const handleDecode = () => {
    if (!input.trim()) {
      message.warning('请输入要解码的HTML编码字符串');
      return;
    }

    try {
      // 使用DOM API进行HTML解码
      const textarea = document.createElement('textarea');
      textarea.innerHTML = input;
      const decoded = textarea.textContent || '';
      setOutput(decoded);
    } catch (error) {
      message.error('解码失败，请检查输入内容是否为有效的HTML编码字符串');
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
  };

  // 复制结果
  const handleCopy = () => {
    // 创建一个文本区域元素来执行复制操作
    const textArea = document.createElement('textarea');
    textArea.value = output;

    // 确保文本区域不可见
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);

    try {
      // 选择文本并尝试复制
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      if (successful) {
        message.success('已复制到剪贴板');
      } else {
        message.error('复制失败，请手动复制');
      }
    } catch (err) {
      console.error('复制过程中发生错误:', err);
      message.error('复制失败，请手动复制');
    } finally {
      // 清理DOM
      document.body.removeChild(textArea);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>HTML 编码/解码</Title>

      {/* 选项和操作按钮区域 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        {/* 左侧：操作按钮 */}
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
            style={{ marginRight: 8 }}
          >
            切换模式
          </Button>
          <Button
            onClick={handleClear}
            size="middle"
          >
            清空
          </Button>
        </Col>

        {/* 右侧：编码/解码选项 */}
        <Col>
          <RadioGroup
            value={mode}
            onChange={handleModeChange}
            optionType="button"
            buttonStyle="solid"
          >
            <RadioButton value="encode">编码</RadioButton>
            <RadioButton value="decode">解码</RadioButton>
          </RadioGroup>
        </Col>
      </Row>

      {/* 输入区域 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <TextArea
            rows={8}
            value={input}
            onChange={handleInputChange}
            placeholder={mode === 'encode' ? '输入要编码的文本' : '输入要解码的HTML编码字符串'}
          />
        </Col>

        <Col span={24}>
          <TextArea
            rows={8}
            value={output}
            readOnly
            placeholder="结果将显示在这里"
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

      {/* 说明区域 */}
      <Divider />
      <div style={{ marginTop: 16 }}>
        <Title level={4}>HTML编码说明</Title>
        <Paragraph>
          HTML编码用于将特殊字符转换为HTML实体，以便在HTML文档中安全地显示这些字符。
        </Paragraph>
        <ul>
          <li>
            <Text>
              <strong>HTML编码</strong>：将特殊字符转换为HTML实体，如 <code>&lt;</code> 转换为 <code>&amp;lt;</code>
            </Text>
          </li>
          <li>
            <Text>
              <strong>HTML解码</strong>：将HTML实体转换回特殊字符，如 <code>&amp;lt;</code> 转换为 <code>&lt;</code>
            </Text>
          </li>
          <li>
            <Text>
              常见的HTML实体包括：<code>&amp;lt;</code> (&lt;), <code>&amp;gt;</code> (&gt;), <code>&amp;amp;</code> (&amp;), <code>&amp;quot;</code> ("), <code>&amp;apos;</code> ('), <code>&amp;nbsp;</code> (空格)
            </Text>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HtmlEncodeTool;
