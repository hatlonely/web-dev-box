import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, Row, Col, Space, Typography, Card, Table, Divider, message, Spin } from 'antd';
import { CopyOutlined, ReloadOutlined, GlobalOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface IpInfo {
  key: string;
  field: string;
  value: string;
  description: string;
}

const IpInfoTool: React.FC = () => {
  const [ipAddress, setIpAddress] = useState<string>('');
  const [ipInfo, setIpInfo] = useState<IpInfo[]>([]);
  const [isValidIp, setIsValidIp] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 验证IP地址格式
  const isValidIpAddress = useCallback((ip: string): boolean => {
    // IPv4正则表达式
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    // IPv6正则表达式 (简化版)
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/;

    return ipv4Pattern.test(ip) || ipv6Pattern.test(ip) || ip === '';
  }, []);

  // 获取IP信息
  const fetchIpInfo = useCallback(async (ip: string) => {
    if (!ip || !isValidIpAddress(ip)) {
      setIsValidIp(false);
      setLoading(false);
      return;
    }

    setIsValidIp(true);
    setLoading(true);
    setError(null);

    // 定义多个IP信息API
    const ipInfoApis = [
      // ipapi.co API
      {
        url: `https://ipapi.co/${ip}/json/`,
        processData: (data: any): IpInfo[] => {
          if (data.error) {
            throw new Error(data.reason || '查询IP信息失败');
          }

          return [
            {
              key: '1',
              field: 'IP地址',
              value: data.ip || '-',
              description: '互联网协议地址'
            },
            {
              key: '2',
              field: '国家/地区',
              value: `${data.country_name || '-'} (${data.country_code || '-'})`,
              description: 'IP所属国家或地区'
            },
            {
              key: '3',
              field: '城市',
              value: `${data.city || '-'}, ${data.region || '-'}`,
              description: 'IP所属城市和地区'
            },
            {
              key: '4',
              field: '邮政编码',
              value: data.postal || '-',
              description: '所在地区邮政编码'
            },
            {
              key: '5',
              field: '经纬度',
              value: `${data.latitude || '-'}, ${data.longitude || '-'}`,
              description: 'IP地理位置坐标'
            },
            {
              key: '6',
              field: '时区',
              value: data.timezone || '-',
              description: 'IP所在时区'
            },
            {
              key: '7',
              field: '网络服务提供商',
              value: data.org || '-',
              description: 'ISP或组织名称'
            },
            {
              key: '8',
              field: '自治系统号码',
              value: data.asn || '-',
              description: 'ASN (Autonomous System Number)'
            },
            {
              key: '9',
              field: '货币',
              value: `${data.currency_name || '-'} (${data.currency || '-'})`,
              description: '所在国家/地区货币'
            }
          ];
        }
      },

      // ip-api.com API (中国可访问)
      {
        url: `http://ip-api.com/json/${ip}?lang=zh-CN&fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`,
        processData: (data: any): IpInfo[] => {
          if (data.status === 'fail') {
            throw new Error(data.message || '查询IP信息失败');
          }

          return [
            {
              key: '1',
              field: 'IP地址',
              value: data.query || '-',
              description: '互联网协议地址'
            },
            {
              key: '2',
              field: '国家/地区',
              value: `${data.country || '-'} (${data.countryCode || '-'})`,
              description: 'IP所属国家或地区'
            },
            {
              key: '3',
              field: '城市',
              value: `${data.city || '-'}, ${data.regionName || '-'}`,
              description: 'IP所属城市和地区'
            },
            {
              key: '4',
              field: '邮政编码',
              value: data.zip || '-',
              description: '所在地区邮政编码'
            },
            {
              key: '5',
              field: '经纬度',
              value: `${data.lat || '-'}, ${data.lon || '-'}`,
              description: 'IP地理位置坐标'
            },
            {
              key: '6',
              field: '时区',
              value: data.timezone || '-',
              description: 'IP所在时区'
            },
            {
              key: '7',
              field: '网络服务提供商',
              value: data.isp || '-',
              description: 'ISP或组织名称'
            },
            {
              key: '8',
              field: '自治系统',
              value: data.as || '-',
              description: 'AS (Autonomous System)'
            },
            {
              key: '9',
              field: '组织',
              value: data.org || '-',
              description: '组织名称'
            }
          ];
        }
      }
    ];

    // 尝试每个API
    for (const api of ipInfoApis) {
      try {
        const response = await fetch(api.url, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        const data = await response.json();
        const info = api.processData(data);

        setIpInfo(info);
        setLoading(false);
        return;
      } catch (error) {
        console.error(`通过 ${api.url} 获取IP信息失败:`, error);
        // 继续尝试下一个API
      }
    }

    // 所有API都失败
    setError('获取IP信息失败，请稍后重试');
    setLoading(false);
  }, [isValidIpAddress]);

  // 获取本机IP地址
  const fetchMyIp = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 尝试多个API来获取IP地址
    const ipApis = [
      // 中国可访问的API
      { url: 'https://forge.speedtest.cn/api/location/info', parser: (data: any) => data.ip },
      { url: 'https://httpbin.org/ip', parser: (data: any) => data.origin.split(',')[0].trim() },
      { url: 'https://api.ipify.org?format=json', parser: (data: any) => data.ip },
      { url: 'http://ip-api.com/json/?fields=query', parser: (data: any) => data.query }
    ];

    for (const api of ipApis) {
      try {
        const response = await fetch(api.url, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        const data = await response.json();
        const ip = api.parser(data);

        if (ip && isValidIpAddress(ip)) {
          setIpAddress(ip);
          fetchIpInfo(ip);
          return;
        }
      } catch (error) {
        console.error(`通过 ${api.url} 获取IP失败:`, error);
        // 继续尝试下一个API
      }
    }

    // 所有API都失败
    setError('获取IP地址失败，请手动输入IP地址');
    setLoading(false);
  }, [fetchIpInfo, isValidIpAddress]);

  // 复制IP地址到剪贴板
  const handleCopy = () => {
    navigator.clipboard.writeText(ipAddress)
      .then(() => message.success('已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  // 当输入的IP地址变化时
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setIpAddress(value);
    setIsValidIp(isValidIpAddress(value));
  };

  // 查询按钮点击事件
  const handleQuery = () => {
    fetchIpInfo(ipAddress);
  };

  // 组件加载时获取本机IP
  useEffect(() => {
    fetchMyIp();
  }, [fetchMyIp]);

  const columns = [
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

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>IP 信息查询工具</Title>

      <Card style={{ marginBottom: 16 }}>
        <Title level={4}>查询 IP 地址信息</Title>
        <Row gutter={[16, 16]} align="middle">
          <Col span={18}>
            <TextArea
              value={ipAddress}
              onChange={handleInputChange}
              placeholder="输入IP地址或使用本机IP"
              autoSize={{ minRows: 1, maxRows: 1 }}
              style={{ fontFamily: 'monospace' }}
              status={isValidIp ? '' : 'error'}
            />
            {!isValidIp && (
              <Text type="danger" style={{ display: 'block', marginTop: 8 }}>
                无效的IP地址格式
              </Text>
            )}
          </Col>
          <Col span={6}>
            <Space>
              <Button
                type="primary"
                icon={<GlobalOutlined />}
                onClick={handleQuery}
                disabled={!isValidIp || !ipAddress}
              >
                查询
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchMyIp}
              >
                本机IP
              </Button>
              <Button
                icon={<CopyOutlined />}
                onClick={handleCopy}
                disabled={!ipAddress}
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
            <Spin tip="正在获取IP信息..." />
          </div>
        </Card>
      ) : error ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Text type="danger">{error}</Text>
          </div>
        </Card>
      ) : (
        ipInfo.length > 0 && (
          <Card>
            <Title level={4}>IP 信息结果</Title>
            <Table
              columns={columns}
              dataSource={ipInfo}
              pagination={false}
              bordered
              size="middle"
            />
          </Card>
        )
      )}

      <Divider />

      <Row>
        <Col span={24}>
          <Title level={4}>关于 IP 地址</Title>
          <Paragraph>
            IP地址（Internet Protocol Address）是互联网协议使用的地址，用于标识网络上的设备。
          </Paragraph>
          <ul>
            <li>
              <Text>
                <strong>IPv4</strong>：由四组数字组成，每组范围为0-255，如 192.168.1.1
              </Text>
            </li>
            <li>
              <Text>
                <strong>IPv6</strong>：由八组十六进制数字组成，如 2001:0db8:85a3:0000:0000:8a2e:0370:7334
              </Text>
            </li>
          </ul>
          <Paragraph>
            IP地址信息可以提供地理位置、网络服务提供商(ISP)等相关数据，但精确度可能因多种因素而异。
          </Paragraph>
        </Col>
      </Row>
    </div>
  );
};

export default IpInfoTool;
