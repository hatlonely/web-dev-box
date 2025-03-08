import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Space, Typography, Card, Table, Divider, message } from 'antd';
import { CopyOutlined, ReloadOutlined } from '@ant-design/icons';
import { ObjectId } from 'bson';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface MongoIdInfo {
  key: string;
  field: string;
  value: string;
  description: string;
}

const MongoIdTool: React.FC = () => {
  const [mongoId, setMongoId] = useState<string>('');
  const [idInfo, setIdInfo] = useState<MongoIdInfo[]>([]);
  const [isValidId, setIsValidId] = useState<boolean>(true);

  // 生成新的MongoDB ObjectId
  const generateNewId = () => {
    const newId = new ObjectId().toString();
    setMongoId(newId);
  };

  // 解析MongoDB ObjectId
  const parseMongoId = (id: string) => {
    try {
      if (!id || id.trim() === '') {
        setIdInfo([]);
        setIsValidId(true);
        return;
      }

      const objectId = new ObjectId(id);
      const timestamp = objectId.getTimestamp();
      const hexString = objectId.toString();

      const timestampHex = hexString.substring(0, 8);
      const machineIdHex = hexString.substring(8, 14);
      const processIdHex = hexString.substring(14, 18);
      const counterHex = hexString.substring(18, 24);

      const formattedDate = dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');

      const info: MongoIdInfo[] = [
        {
          key: '1',
          field: '完整ID',
          value: hexString,
          description: '24位十六进制字符串'
        },
        {
          key: '2',
          field: '创建时间',
          value: formattedDate,
          description: 'ObjectId的前4个字节表示时间戳'
        },
        {
          key: '3',
          field: '时间戳（十六进制）',
          value: timestampHex,
          description: '从Unix纪元开始的秒数'
        },
        {
          key: '4',
          field: '机器标识符（十六进制）',
          value: machineIdHex,
          description: '通常是机器主机名的哈希值'
        },
        {
          key: '5',
          field: '进程ID（十六进制）',
          value: processIdHex,
          description: '生成此ObjectId的进程ID'
        },
        {
          key: '6',
          field: '计数器（十六进制）',
          value: counterHex,
          description: '从随机值开始的计数器'
        }
      ];

      setIdInfo(info);
      setIsValidId(true);
    } catch (error) {
      setIsValidId(false);
      setIdInfo([]);
    }
  };

  // 复制MongoDB ID到剪贴板
  const handleCopy = () => {
    navigator.clipboard.writeText(mongoId)
      .then(() => message.success('已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  // 当输入的MongoDB ID变化时，解析它
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMongoId(value);
    parseMongoId(value);
  };

  // 组件加载时生成一个新的MongoDB ID
  useEffect(() => {
    generateNewId();
  }, []);

  // 当MongoDB ID变化时，解析它
  useEffect(() => {
    parseMongoId(mongoId);
  }, [mongoId]);

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
      <Title level={2}>MongoDB ObjectId 工具</Title>

      <Card style={{ marginBottom: 16 }}>
        <Title level={4}>生成 MongoDB ObjectId</Title>
        <Row gutter={[16, 16]} align="middle">
          <Col span={18}>
            <TextArea
              value={mongoId}
              onChange={handleInputChange}
              placeholder="输入或生成MongoDB ObjectId"
              autoSize={{ minRows: 1, maxRows: 1 }}
              style={{ fontFamily: 'monospace' }}
              status={isValidId ? '' : 'error'}
            />
            {!isValidId && (
              <Text type="danger" style={{ display: 'block', marginTop: 8 }}>
                无效的MongoDB ObjectId格式
              </Text>
            )}
          </Col>
          <Col span={6}>
            <Space>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={generateNewId}
              >
                生成新ID
              </Button>
              <Button
                icon={<CopyOutlined />}
                onClick={handleCopy}
                disabled={!mongoId || !isValidId}
              >
                复制
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {isValidId && idInfo.length > 0 && (
        <Card>
          <Title level={4}>ObjectId 解析结果</Title>
          <Table
            columns={columns}
            dataSource={idInfo}
            pagination={false}
            bordered
            size="middle"
          />
        </Card>
      )}

      <Divider />

      <Row>
        <Col span={24}>
          <Title level={4}>MongoDB ObjectId 说明</Title>
          <Text>
            MongoDB的ObjectId是一个12字节的BSON类型，由以下部分组成：
          </Text>
          <ul>
            <li>
              <Text>
                <strong>前4字节</strong>：表示从Unix纪元开始的秒数（时间戳）
              </Text>
            </li>
            <li>
              <Text>
                <strong>中间3字节</strong>：机器标识符（通常是机器主机名的哈希值）
              </Text>
            </li>
            <li>
              <Text>
                <strong>接下来2字节</strong>：进程ID
              </Text>
            </li>
            <li>
              <Text>
                <strong>最后3字节</strong>：从随机值开始的计数器
              </Text>
            </li>
          </ul>
          <Text>
            ObjectId的设计使其在分布式系统中能够生成全局唯一的标识符，同时包含了创建时间信息。
          </Text>
        </Col>
      </Row>
    </div>
  );
};

export default MongoIdTool;
