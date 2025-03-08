import React, { useState, useCallback } from 'react';
import { Input, Button, Row, Col, Space, Typography, Card, Table, Tabs, Divider, message, Spin } from 'antd';
import { CopyOutlined, SearchOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface DomainInfo {
  key: string;
  field: string;
  value: string;
  description: string;
}

interface DnsRecord {
  key: string;
  type: string;
  name: string;
  value: string;
  ttl: string;
}

interface DomainQueryResult {
  whoisInfo: DomainInfo[];
  dnsRecords: DnsRecord[];
  error?: string;
}

const DomainInfoToolSSR: React.FC = () => {
  const [domain, setDomain] = useState<string>('');
  const [whoisInfo, setWhoisInfo] = useState<DomainInfo[]>([]);
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([]);
  const [isValidDomain, setIsValidDomain] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('1');

  // 验证域名格式
  const isValidDomainName = useCallback((domain: string): boolean => {
    // 域名正则表达式
    const domainPattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    return domainPattern.test(domain) || domain === '';
  }, []);

  // 查询域名信息 - 使用服务端 API
  const fetchDomainInfo = useCallback(async (domain: string) => {
    if (!domain || !isValidDomainName(domain)) {
      setIsValidDomain(false);
      return;
    }

    setIsValidDomain(true);
    setLoading(true);
    setError(null);

    try {
      // 调用服务端 API 获取域名信息
      // 注意：这里使用完整的 URL，确保能够访问到 Next.js 服务器
      const response = await fetch(`http://localhost:3000/api/domain-info?domain=${encodeURIComponent(domain)}`);

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
      }

      const data: DomainQueryResult = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setWhoisInfo(data.whoisInfo);
        setDnsRecords(data.dnsRecords);
      }
    } catch (error) {
      console.error('查询域名信息失败:', error);
      setError('查询域名信息失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [isValidDomainName]);

  // 复制域名到剪贴板
  const handleCopy = () => {
    navigator.clipboard.writeText(domain)
      .then(() => message.success('已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  // 当输入的域名变化时
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDomain(value);
    setIsValidDomain(isValidDomainName(value));
  };

  // 查询按钮点击事件
  const handleQuery = () => {
    fetchDomainInfo(domain);
  };

  // 标签页切换事件
  const handleTabChange = (activeKey: string) => {
    setActiveTab(activeKey);
  };

  const whoisColumns = [
    {
      title: '字段',
      dataIndex: 'field',
      key: 'field',
      width: '20%',
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      width: '40%',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
    },
  ];

  const dnsColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      width: '50%',
    },
    {
      title: 'TTL',
      dataIndex: 'ttl',
      key: 'ttl',
      width: '15%',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>域名信息查询工具 (SSR 版)</Title>

      <Card style={{ marginBottom: 16 }}>
        <Title level={4}>查询域名信息</Title>
        <Row gutter={[16, 16]} align="middle">
          <Col span={18}>
            <TextArea
              value={domain}
              onChange={handleInputChange}
              placeholder="输入域名，如 example.com"
              autoSize={{ minRows: 1, maxRows: 1 }}
              style={{ fontFamily: 'monospace' }}
              status={isValidDomain ? '' : 'error'}
            />
            {!isValidDomain && (
              <Text type="danger" style={{ display: 'block', marginTop: 8 }}>
                无效的域名格式
              </Text>
            )}
          </Col>
          <Col span={6}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleQuery}
                disabled={!isValidDomain || !domain}
              >
                查询
              </Button>
              <Button
                icon={<CopyOutlined />}
                onClick={handleCopy}
                disabled={!domain}
              >
                复制
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Spin tip="正在获取域名信息..." />
          </div>
        </Card>
      ) : error ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Text type="danger">{error}</Text>
          </div>
        </Card>
      ) : (
        (whoisInfo.length > 0 || dnsRecords.length > 0) && (
          <Card>
            <Tabs activeKey={activeTab} onChange={handleTabChange}>
              <TabPane tab="WHOIS 信息" key="1">
                {whoisInfo.length > 0 ? (
                  <Table
                    columns={whoisColumns}
                    dataSource={whoisInfo}
                    pagination={false}
                    bordered
                    size="middle"
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Text type="warning">未找到 WHOIS 信息</Text>
                  </div>
                )}
              </TabPane>
              <TabPane tab="DNS 记录" key="2">
                {dnsRecords.length > 0 ? (
                  <Table
                    columns={dnsColumns}
                    dataSource={dnsRecords}
                    pagination={false}
                    bordered
                    size="middle"
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Text type="warning">未找到 DNS 记录</Text>
                  </div>
                )}
              </TabPane>
            </Tabs>
          </Card>
        )
      )}

      <Divider />

      <Row>
        <Col span={24}>
          <Title level={4}>关于域名信息</Title>
          <Paragraph>
            域名信息查询工具可以帮助您获取域名的注册信息和DNS记录。本工具使用 Next.js 服务端渲染技术，在服务器端执行查询，避免浏览器跨域限制。
          </Paragraph>
          <ul>
            <li>
              <Text>
                <strong>WHOIS 信息</strong>：包含域名的注册商、注册日期、到期日期等注册信息。
              </Text>
            </li>
            <li>
              <Text>
                <strong>DNS 记录</strong>：包含域名的各种DNS记录，如A记录、AAAA记录、MX记录、NS记录、TXT记录等。
              </Text>
            </li>
          </ul>
          <Paragraph>
            <strong>服务端渲染优势：</strong>
          </Paragraph>
          <ul>
            <li>
              <Text>
                <strong>无跨域限制</strong>：服务器可以直接请求任何域名的信息，不受浏览器同源策略限制
              </Text>
            </li>
            <li>
              <Text>
                <strong>更高效的查询</strong>：服务器可以直接使用 DNS 和 WHOIS 协议查询，而不需要依赖第三方 API
              </Text>
            </li>
            <li>
              <Text>
                <strong>更好的性能</strong>：减少客户端的网络请求，提高查询速度
              </Text>
            </li>
          </ul>
          <Paragraph>
            <strong>常见DNS记录类型：</strong>
          </Paragraph>
          <ul>
            <li>
              <Text>
                <strong>A记录</strong>：将域名映射到IPv4地址
              </Text>
            </li>
            <li>
              <Text>
                <strong>AAAA记录</strong>：将域名映射到IPv6地址
              </Text>
            </li>
            <li>
              <Text>
                <strong>CNAME记录</strong>：将一个域名映射到另一个域名
              </Text>
            </li>
            <li>
              <Text>
                <strong>MX记录</strong>：指定邮件服务器
              </Text>
            </li>
            <li>
              <Text>
                <strong>NS记录</strong>：指定域名的DNS服务器
              </Text>
            </li>
            <li>
              <Text>
                <strong>TXT记录</strong>：存储文本信息，通常用于验证域名所有权或SPF记录
              </Text>
            </li>
            <li>
              <Text>
                <strong>SOA记录</strong>：包含域名的管理信息
              </Text>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default DomainInfoToolSSR;
