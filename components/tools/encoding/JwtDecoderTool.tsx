import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Space, Typography, Tabs, Card, message, Divider } from 'antd';
import { CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const JwtDecoderTool: React.FC = () => {
  const [jwtToken, setJwtToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [expiryStatus, setExpiryStatus] = useState<'valid' | 'expired' | 'unknown'>('unknown');

  // 解析JWT令牌
  const decodeJwt = (token: string) => {
    if (!token.trim()) {
      setError('请输入JWT令牌');
      setHeader('');
      setPayload('');
      setSignature('');
      setExpiryStatus('unknown');
      return;
    }

    try {
      // 检查JWT格式
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('无效的JWT格式，应该包含三个部分（header.payload.signature）');
      }

      // 解码header
      const headerBase64 = parts[0];
      const decodedHeader = atob(headerBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const headerJson = JSON.parse(decodedHeader);
      setHeader(JSON.stringify(headerJson, null, 2));

      // 解码payload
      const payloadBase64 = parts[1];
      const decodedPayload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payloadJson = JSON.parse(decodedPayload);
      setPayload(JSON.stringify(payloadJson, null, 2));

      // 设置签名（不解码）
      setSignature(parts[2]);

      // 检查过期时间
      if (payloadJson.exp) {
        const expiryDate = new Date(payloadJson.exp * 1000);
        const now = new Date();
        if (expiryDate > now) {
          setExpiryStatus('valid');
        } else {
          setExpiryStatus('expired');
        }
      } else {
        setExpiryStatus('unknown');
      }

      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(`JWT解析错误: ${errorMessage}`);
      setHeader('');
      setPayload('');
      setSignature('');
      setExpiryStatus('unknown');
    }
  };

  // 当JWT令牌变化时自动解析
  useEffect(() => {
    if (jwtToken.trim()) {
      decodeJwt(jwtToken);
    }
  }, [jwtToken]);

  // 复制内容到剪贴板
  const handleCopy = (content: string, description: string) => {
    navigator.clipboard.writeText(content)
      .then(() => message.success(`已复制${description}到剪贴板`))
      .catch(() => message.error('复制失败'));
  };

  // 清空所有内容
  const handleClear = () => {
    setJwtToken('');
    setHeader('');
    setPayload('');
    setSignature('');
    setError(null);
    setExpiryStatus('unknown');
  };

  // 加载示例JWT
  const handleLoadExample = () => {
    // 这是一个示例JWT，包含一些常见字段
    const exampleJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IuW8oOS4iemYs-WOhSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxOTc2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    setJwtToken(exampleJwt);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>JWT 解码器</Title>

      {/* 选项和操作按钮区域 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        {/* 左侧：操作按钮 */}
        <Col>
          <Button
            type="primary"
            onClick={() => decodeJwt(jwtToken)}
            size="middle"
            style={{ marginRight: 8 }}
          >
            解码
          </Button>
          <Button
            onClick={handleLoadExample}
            size="middle"
            style={{ marginRight: 8 }}
          >
            示例JWT
          </Button>
          <Button
            onClick={handleClear}
            size="middle"
          >
            清空
          </Button>
        </Col>
      </Row>

      {/* 输入区域 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <TextArea
            rows={6}
            value={jwtToken}
            onChange={(e) => setJwtToken(e.target.value)}
            placeholder="输入JWT令牌（格式：xxxxx.yyyyy.zzzzz）"
          />
        </Col>

        {error && (
          <Col span={24}>
            <div style={{ color: 'red', marginBottom: 16 }}>
              {error}
            </div>
          </Col>
        )}

        {expiryStatus !== 'unknown' && (
          <Col span={24}>
            <div
              style={{
                padding: '8px 16px',
                borderRadius: 4,
                marginBottom: 16,
                backgroundColor: expiryStatus === 'valid' ? '#f6ffed' : '#fff2f0',
                border: `1px solid ${expiryStatus === 'valid' ? '#b7eb8f' : '#ffccc7'}`
              }}
            >
              <Text
                strong
                style={{ color: expiryStatus === 'valid' ? '#52c41a' : '#ff4d4f' }}
              >
                {expiryStatus === 'valid' ? '令牌有效' : '令牌已过期'}
              </Text>
            </div>
          </Col>
        )}

        {(header || payload || signature) && (
          <Col span={24}>
            <Tabs defaultActiveKey="payload">
              <TabPane tab="载荷 (Payload)" key="payload">
                <Card
                  title="解码后的载荷"
                  extra={
                    <Button
                      icon={<CopyOutlined />}
                      size="small"
                      onClick={() => handleCopy(payload, '载荷')}
                      disabled={!payload}
                    >
                      复制
                    </Button>
                  }
                >
                  <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {payload || '无法解析载荷'}
                  </pre>
                </Card>
              </TabPane>

              <TabPane tab="头部 (Header)" key="header">
                <Card
                  title="解码后的头部"
                  extra={
                    <Button
                      icon={<CopyOutlined />}
                      size="small"
                      onClick={() => handleCopy(header, '头部')}
                      disabled={!header}
                    >
                      复制
                    </Button>
                  }
                >
                  <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {header || '无法解析头部'}
                  </pre>
                </Card>
              </TabPane>

              <TabPane tab="签名 (Signature)" key="signature">
                <Card
                  title="签名（Base64编码）"
                  extra={
                    <Button
                      icon={<CopyOutlined />}
                      size="small"
                      onClick={() => handleCopy(signature, '签名')}
                      disabled={!signature}
                    >
                      复制
                    </Button>
                  }
                >
                  <Paragraph style={{ wordBreak: 'break-all' }}>
                    {signature || '无法获取签名'}
                  </Paragraph>
                  <Paragraph type="secondary">
                    注意：签名是使用密钥生成的，无法解码。这里只显示Base64编码的原始签名。
                  </Paragraph>
                </Card>
              </TabPane>
            </Tabs>
          </Col>
        )}

        {/* 说明区域 */}
        <Divider />
        <div style={{ marginTop: 16 }}>
          <Title level={4}><InfoCircleOutlined /> 关于JWT</Title>
          <Paragraph>
            JSON Web Token (JWT) 是一种开放标准 (RFC 7519)，它定义了一种紧凑且自包含的方式，用于在各方之间安全地传输信息作为JSON对象。
          </Paragraph>
          <Paragraph>
            JWT由三部分组成，以点（.）分隔：
          </Paragraph>
          <ul>
            <li>
              <Text strong>头部 (Header)</Text> - 通常包含令牌类型和使用的签名算法
            </li>
            <li>
              <Text strong>载荷 (Payload)</Text> - 包含声明（claims）。声明是关于实体（通常是用户）和其他数据的声明
            </li>
            <li>
              <Text strong>签名 (Signature)</Text> - 用于验证消息在传输过程中没有被更改，并且对于使用私钥签名的令牌，它还可以验证JWT的发送方是否为它所称的发送方
            </li>
          </ul>
        </div>
      </Row>
    </div>
  );
};

export default JwtDecoderTool;
