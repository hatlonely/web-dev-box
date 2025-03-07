import React, { useState } from 'react';
import { Input, Button, Row, Col, Select, Typography, Space, message } from 'antd';
import { SwapOutlined, CopyOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

type BaseType = 2 | 8 | 10 | 16;

const BaseConversionTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fromBase, setFromBase] = useState<BaseType>(10);
  const [toBase, setToBase] = useState<BaseType>(16);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFromBaseChange = (value: BaseType) => {
    setFromBase(value);
  };

  const handleToBaseChange = (value: BaseType) => {
    setToBase(value);
  };

  const validateInput = (input: string, base: BaseType): boolean => {
    let regex: RegExp;
    switch (base) {
      case 2:
        regex = /^[01]+$/;
        break;
      case 8:
        regex = /^[0-7]+$/;
        break;
      case 10:
        regex = /^[0-9]+$/;
        break;
      case 16:
        regex = /^[0-9A-Fa-f]+$/;
        break;
      default:
        return false;
    }
    return regex.test(input);
  };

  const handleConvert = () => {
    if (!input.trim()) {
      message.error('请输入要转换的数值');
      return;
    }

    if (!validateInput(input, fromBase)) {
      message.error(`输入不是有效的${fromBase}进制数值`);
      return;
    }

    try {
      // 先转为十进制
      const decimal = parseInt(input, fromBase);

      // 再从十进制转为目标进制
      let result = decimal.toString(toBase);

      // 对于16进制，转为大写
      if (toBase === 16) {
        result = result.toUpperCase();
      }

      setOutput(result);
    } catch (error) {
      message.error('转换失败');
    }
  };

  const handleSwap = () => {
    setFromBase(toBase);
    setToBase(fromBase);
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
      <Title level={2}>进制转换</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col xs={24} sm={8}>
              <Select
                value={fromBase}
                onChange={handleFromBaseChange}
                style={{ width: '100%' }}
              >
                <Option value={2}>二进制 (Base 2)</Option>
                <Option value={8}>八进制 (Base 8)</Option>
                <Option value={10}>十进制 (Base 10)</Option>
                <Option value={16}>十六进制 (Base 16)</Option>
              </Select>
            </Col>
            <Col xs={24} sm={16}>
              <Input
                placeholder={`输入${fromBase}进制数值`}
                value={input}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Space>
            <Button type="primary" onClick={handleConvert}>转换</Button>
            <Button icon={<SwapOutlined />} onClick={handleSwap}>交换进制</Button>
          </Space>
        </Col>

        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col xs={24} sm={8}>
              <Select
                value={toBase}
                onChange={handleToBaseChange}
                style={{ width: '100%' }}
              >
                <Option value={2}>二进制 (Base 2)</Option>
                <Option value={8}>八进制 (Base 8)</Option>
                <Option value={10}>十进制 (Base 10)</Option>
                <Option value={16}>十六进制 (Base 16)</Option>
              </Select>
            </Col>
            <Col xs={24} sm={16}>
              <Input
                placeholder="转换结果"
                value={output}
                readOnly
                addonAfter={
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={handleCopy}
                    disabled={!output}
                    style={{ border: 'none', padding: 0 }}
                  />
                }
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default BaseConversionTool;
