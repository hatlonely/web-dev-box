import React, { useState } from 'react';
import { Input, Button, Row, Col, Space, Typography, Radio, message } from 'antd';
import { SwapOutlined, CopyOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

type EncodeMode = 'encodeURI' | 'encodeURIComponent';

const UrlEncodeTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeMode, setEncodeMode] = useState<EncodeMode>('encodeURIComponent');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
    // 清空输出
    setOutput('');
  };

  const handleEncodeModeChange = (e: RadioChangeEvent) => {
    setEncodeMode(e.target.value);
    // 如果已有输出，重新执行编码
    if (output && mode === 'encode') {
      handleProcess();
    }
  };

  const handleEncode = () => {
    try {
      let encoded = '';
      if (encodeMode === 'encodeURI') {
        encoded = encodeURI(input);
      } else {
        encoded = encodeURIComponent(input);
      }
      setOutput(encoded);
    } catch (error) {
      message.error('编码失败，请检查输入内容');
    }
  };

  const handleDecode = () => {
    try {
      let decoded = '';
      if (encodeMode === 'encodeURI') {
        decoded = decodeURI(input);
      } else {
        decoded = decodeURIComponent(input);
      }
      setOutput(decoded);
    } catch (error) {
      message.error('解码失败，请检查输入内容是否为有效的URL编码字符串');
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

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>URL 编码/解码</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Radio.Group value={mode} onChange={handleModeChange} style={{ marginRight: 16 }}>
            <Radio.Button value="encode">编码</Radio.Button>
            <Radio.Button value="decode">解码</Radio.Button>
          </Radio.Group>

          {mode === 'encode' && (
            <Radio.Group value={encodeMode} onChange={handleEncodeModeChange}>
              <Radio.Button value="encodeURIComponent">encodeURIComponent</Radio.Button>
              <Radio.Button value="encodeURI">encodeURI</Radio.Button>
            </Radio.Group>
          )}
        </Col>

        <Col span={24}>
          <TextArea
            rows={6}
            value={input}
            onChange={handleInputChange}
            placeholder={mode === 'encode' ? '输入要编码的文本' : '输入要解码的URL编码字符串'}
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
          <Button
            icon={<CopyOutlined />}
            onClick={handleCopy}
            disabled={!output}
          >
            复制结果
          </Button>
        </Col>
      </Row>

      {mode === 'encode' && (
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Typography.Paragraph>
              <strong>encodeURIComponent 与 encodeURI 的区别：</strong>
            </Typography.Paragraph>
            <ul>
              <li>
                <Typography.Text>
                  <strong>encodeURIComponent</strong>：编码所有特殊字符，包括 <code>/ ? : @ & = + $ #</code> 等。适用于编码URL参数值。
                </Typography.Text>
              </li>
              <li>
                <Typography.Text>
                  <strong>encodeURI</strong>：不编码URL中的功能字符，如 <code>/ ? : @ & = + $ #</code> 等。适用于编码完整URL。
                </Typography.Text>
              </li>
            </ul>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default UrlEncodeTool;
