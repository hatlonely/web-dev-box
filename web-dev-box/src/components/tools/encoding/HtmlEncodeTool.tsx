import React, { useState } from 'react';
import { Input, Button, Row, Col, Space, Typography, Radio, message } from 'antd';
import { SwapOutlined, CopyOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';

const { TextArea } = Input;
const { Title, Text } = Typography;

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

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
      .then(() => message.success('已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>HTML 编码/解码</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Radio.Group value={mode} onChange={handleModeChange} buttonStyle="solid">
            <Radio.Button value="encode">编码</Radio.Button>
            <Radio.Button value="decode">解码</Radio.Button>
          </Radio.Group>
        </Col>

        <Col span={24}>
          <TextArea
            rows={8}
            value={input}
            onChange={handleInputChange}
            placeholder={mode === 'encode' ? '输入要编码的文本' : '输入要解码的HTML编码字符串'}
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
            <Button onClick={handleClear}>
              清空
            </Button>
          </Space>
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

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Title level={4}>HTML编码说明</Title>
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
        </Col>
      </Row>
    </div>
  );
};

export default HtmlEncodeTool;
