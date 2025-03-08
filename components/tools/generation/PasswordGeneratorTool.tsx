import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Space, Typography, Checkbox, Slider, message, Card } from 'antd';
import { CopyOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

const PasswordGeneratorTool: React.FC = () => {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | 'very-strong'>('strong');

  // 生成密码
  const generatePassword = () => {
    const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = options;

    // 检查至少选择了一个字符集
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      message.error('请至少选择一种字符类型');
      return;
    }

    // 定义字符集
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // 组合选中的字符集
    let chars = '';
    if (includeUppercase) chars += uppercaseChars;
    if (includeLowercase) chars += lowercaseChars;
    if (includeNumbers) chars += numberChars;
    if (includeSymbols) chars += symbolChars;

    // 生成密码
    let newPassword = '';
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(randomValues[i] % chars.length);
    }

    // 确保密码包含所有选中的字符类型
    let validPassword = false;
    while (!validPassword) {
      validPassword = true;

      if (includeUppercase && !/[A-Z]/.test(newPassword)) validPassword = false;
      if (includeLowercase && !/[a-z]/.test(newPassword)) validPassword = false;
      if (includeNumbers && !/[0-9]/.test(newPassword)) validPassword = false;
      if (includeSymbols && !/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(newPassword)) validPassword = false;

      if (!validPassword) {
        // 重新生成密码
        newPassword = '';
        window.crypto.getRandomValues(randomValues);
        for (let i = 0; i < length; i++) {
          newPassword += chars.charAt(randomValues[i] % chars.length);
        }
      }
    }

    setPassword(newPassword);
  };

  // 计算密码强度
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) {
      setPasswordStrength('weak');
      return;
    }

    let score = 0;

    // 长度评分
    score += Math.min(10, pwd.length / 2);

    // 字符多样性评分
    if (/[A-Z]/.test(pwd)) score += 5;
    if (/[a-z]/.test(pwd)) score += 5;
    if (/[0-9]/.test(pwd)) score += 5;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 5;

    // 根据分数确定强度
    if (score < 10) {
      setPasswordStrength('weak');
    } else if (score < 20) {
      setPasswordStrength('medium');
    } else if (score < 25) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('very-strong');
    }
  };

  // 处理选项变更
  const handleOptionChange = (option: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  // 复制密码
  const handleCopy = () => {
    navigator.clipboard.writeText(password)
      .then(() => message.success('密码已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  // 初始生成密码
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    generatePassword();
  }, []);

  // 当密码变化时计算强度
  useEffect(() => {
    calculatePasswordStrength(password);
  }, [password]);

  // 获取密码强度颜色和文本
  const getStrengthInfo = () => {
    switch (passwordStrength) {
      case 'weak':
        return { color: '#ff4d4f', text: '弱' };
      case 'medium':
        return { color: '#faad14', text: '中' };
      case 'strong':
        return { color: '#52c41a', text: '强' };
      case 'very-strong':
        return { color: '#1890ff', text: '非常强' };
      default:
        return { color: '#ff4d4f', text: '弱' };
    }
  };

  const strengthInfo = getStrengthInfo();

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>密码生成器</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row gutter={[8, 8]} align="middle">
              <Col flex="auto">
                <Input.Password
                  value={password}
                  size="large"
                  readOnly
                  style={{ fontSize: '1.2em' }}
                />
              </Col>
              <Col>
                <Space>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={generatePassword}
                    size="large"
                  />
                  <Button
                    icon={<CopyOutlined />}
                    onClick={handleCopy}
                    size="large"
                    disabled={!password}
                  />
                </Space>
              </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
              <Text>密码强度: </Text>
              <Text strong style={{ color: strengthInfo.color }}>
                {strengthInfo.text}
              </Text>
              <div
                style={{
                  height: 8,
                  background: '#f0f0f0',
                  borderRadius: 4,
                  marginTop: 8,
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: passwordStrength === 'weak' ? '25%' :
                          passwordStrength === 'medium' ? '50%' :
                          passwordStrength === 'strong' ? '75%' : '100%',
                    background: strengthInfo.color,
                    transition: 'width 0.3s'
                  }}
                />
              </div>
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="密码选项">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text>密码长度: {options.length}</Text>
                <Slider
                  min={6}
                  max={32}
                  value={options.length}
                  onChange={(value) => handleOptionChange('length', value)}
                />
              </Col>

              <Col span={24}>
                <Space direction="vertical">
                  <Checkbox
                    checked={options.includeUppercase}
                    onChange={(e) => handleOptionChange('includeUppercase', e.target.checked)}
                  >
                    包含大写字母 (A-Z)
                  </Checkbox>

                  <Checkbox
                    checked={options.includeLowercase}
                    onChange={(e) => handleOptionChange('includeLowercase', e.target.checked)}
                  >
                    包含小写字母 (a-z)
                  </Checkbox>

                  <Checkbox
                    checked={options.includeNumbers}
                    onChange={(e) => handleOptionChange('includeNumbers', e.target.checked)}
                  >
                    包含数字 (0-9)
                  </Checkbox>

                  <Checkbox
                    checked={options.includeSymbols}
                    onChange={(e) => handleOptionChange('includeSymbols', e.target.checked)}
                  >
                    包含特殊符号 (!@#$%^&*...)
                  </Checkbox>
                </Space>
              </Col>

              <Col span={24}>
                <Button type="primary" onClick={generatePassword}>
                  生成新密码
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="密码安全提示">
            <ul>
              <li>
                <Text>使用至少12个字符的密码可以有效防止暴力破解</Text>
              </li>
              <li>
                <Text>混合使用大小写字母、数字和特殊符号可以增强密码安全性</Text>
              </li>
              <li>
                <Text>不要在多个网站使用相同的密码</Text>
              </li>
              <li>
                <Text>定期更换密码，特别是重要账户</Text>
              </li>
              <li>
                <Text>考虑使用密码管理器来存储和管理复杂密码</Text>
              </li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PasswordGeneratorTool;
