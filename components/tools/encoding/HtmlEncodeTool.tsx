import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  // 检测屏幕尺寸变化
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 初始检查
    checkIfMobile();

    // 监听窗口大小变化
    window.addEventListener('resize', checkIfMobile);

    // 清理监听器
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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
    <div style={{ padding: isMobile ? 12 : 24 }}>
      <Title level={2}>HTML 编码/解码</Title>

      {/* 选项和操作按钮区域 */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 16 }}
        gutter={[0, isMobile ? 16 : 0]}
      >
        {/* 左侧：操作按钮 */}
        <Col xs={24} sm={12}>
          <Space wrap size={isMobile ? 'small' : 'middle'}>
            <Button
              type="primary"
              onClick={handleProcess}
              size={isMobile ? 'small' : 'middle'}
            >
              {mode === 'encode' ? '编码' : '解码'}
            </Button>
            <Button
              icon={<SwapOutlined />}
              onClick={handleSwitch}
              size={isMobile ? 'small' : 'middle'}
            >
              {isMobile ? '' : '切换模式'}
            </Button>
            <Button
              onClick={handleClear}
              size={isMobile ? 'small' : 'middle'}
            >
              清空
            </Button>
          </Space>
        </Col>

        {/* 右侧：编码/解码选项 */}
        <Col xs={24} sm={12} style={{ textAlign: isMobile ? 'left' : 'right' }}>
          <RadioGroup
            value={mode}
            onChange={handleModeChange}
            optionType="button"
            buttonStyle="solid"
            size={isMobile ? 'small' : 'middle'}
          >
            <RadioButton value="encode">编码</RadioButton>
            <RadioButton value="decode">解码</RadioButton>
          </RadioGroup>
        </Col>
      </Row>

      {/* 输入区域 */}
      <Row gutter={[16, isMobile ? 8 : 16]}>
        <Col span={24}>
          <TextArea
            rows={isMobile ? 6 : 8}
            value={input}
            onChange={handleInputChange}
            placeholder={mode === 'encode' ? '输入要编码的文本' : '输入要解码的HTML编码字符串'}
            style={{ fontSize: isMobile ? 14 : 16 }}
          />
        </Col>

        <Col span={24}>
          <TextArea
            rows={isMobile ? 6 : 8}
            value={output}
            readOnly
            placeholder="结果将显示在这里"
            style={{ fontSize: isMobile ? 14 : 16 }}
          />
        </Col>

        <Col span={24}>
          <Button
            icon={<CopyOutlined />}
            onClick={handleCopy}
            disabled={!output}
            size={isMobile ? 'small' : 'middle'}
          >
            复制结果
          </Button>
        </Col>
      </Row>

      {/* 说明区域 */}
      <Divider />
      <div style={{ marginTop: isMobile ? 8 : 16 }}>
        <Title level={isMobile ? 5 : 4}>HTML编码说明</Title>
        <Paragraph style={{ fontSize: isMobile ? 13 : 14 }}>
          HTML编码用于将特殊字符转换为HTML实体，以便在HTML文档中安全地显示这些字符。
        </Paragraph>
        <ul style={{ fontSize: isMobile ? 13 : 14, paddingLeft: isMobile ? 20 : 40 }}>
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
          {!isMobile && (
            <li>
              <Text>
                常见的HTML实体包括：<code>&amp;lt;</code> (&lt;), <code>&amp;gt;</code> (&gt;), <code>&amp;amp;</code> (&amp;), <code>&amp;quot;</code> ("), <code>&amp;apos;</code> ('), <code>&amp;nbsp;</code> (空格)
              </Text>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HtmlEncodeTool;
