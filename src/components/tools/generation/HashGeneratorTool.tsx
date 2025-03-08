import React, { useState } from 'react';
import { Input, Button, Row, Col, Space, Typography, Radio, Table, message, Card } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

// 定义支持的哈希算法
type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512';

interface HashResult {
  algorithm: string;
  hash: string;
  key: string;
}

const HashGeneratorTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<HashAlgorithm>('sha256');
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // 处理算法选择变化
  const handleAlgorithmChange = (e: RadioChangeEvent) => {
    setSelectedAlgorithm(e.target.value);
  };

  // 计算哈希值
  const calculateHash = async (algorithm: HashAlgorithm, text: string): Promise<string> => {
    // 将字符串转换为Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // 根据选择的算法计算哈希值
    let hashBuffer;
    switch (algorithm) {
      case 'md5':
        // 注意：Web Crypto API不直接支持MD5，这里只是占位
        // 实际应用中可能需要使用第三方库
        throw new Error('MD5算法在Web Crypto API中不受支持，请使用更安全的SHA系列算法');
      case 'sha1':
        hashBuffer = await crypto.subtle.digest('SHA-1', data);
        break;
      case 'sha256':
        hashBuffer = await crypto.subtle.digest('SHA-256', data);
        break;
      case 'sha384':
        hashBuffer = await crypto.subtle.digest('SHA-384', data);
        break;
      case 'sha512':
        hashBuffer = await crypto.subtle.digest('SHA-512', data);
        break;
      default:
        throw new Error('不支持的哈希算法');
    }

    // 将ArrayBuffer转换为十六进制字符串
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  // 生成所有哈希值
  const generateAllHashes = async () => {
    if (!input.trim()) {
      message.warning('请输入要计算哈希值的文本');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const algorithms: HashAlgorithm[] = ['sha1', 'sha256', 'sha384', 'sha512'];
      const results: HashResult[] = [];

      for (const algo of algorithms) {
        try {
          const hash = await calculateHash(algo, input);
          results.push({
            algorithm: algo.toUpperCase(),
            hash,
            key: algo
          });
        } catch (err) {
          console.error(`计算${algo}哈希值时出错:`, err);
          // 继续计算其他算法的哈希值
        }
      }

      setHashResults(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(`计算哈希值时出错: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // 生成单个哈希值
  const generateSingleHash = async () => {
    if (!input.trim()) {
      message.warning('请输入要计算哈希值的文本');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const hash = await calculateHash(selectedAlgorithm, input);

      // 更新或添加结果
      const existingIndex = hashResults.findIndex(result => result.algorithm === selectedAlgorithm.toUpperCase());

      if (existingIndex >= 0) {
        const updatedResults = [...hashResults];
        updatedResults[existingIndex] = {
          algorithm: selectedAlgorithm.toUpperCase(),
          hash,
          key: selectedAlgorithm
        };
        setHashResults(updatedResults);
      } else {
        setHashResults([
          ...hashResults,
          {
            algorithm: selectedAlgorithm.toUpperCase(),
            hash,
            key: selectedAlgorithm
          }
        ]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(`计算${selectedAlgorithm.toUpperCase()}哈希值时出错: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // 复制哈希值到剪贴板
  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash)
      .then(() => message.success('已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  // 清空所有内容
  const handleClear = () => {
    setInput('');
    setHashResults([]);
    setError(null);
  };

  // 表格列定义
  const columns = [
    {
      title: '算法',
      dataIndex: 'algorithm',
      key: 'algorithm',
      width: 100,
    },
    {
      title: '哈希值',
      dataIndex: 'hash',
      key: 'hash',
      render: (text: string) => (
        <div style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
          {text}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: HashResult) => (
        <Button
          icon={<CopyOutlined />}
          onClick={() => handleCopy(record.hash)}
          size="small"
        >
          复制
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>哈希生成器</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="输入">
            <TextArea
              rows={6}
              value={input}
              onChange={handleInputChange}
              placeholder="输入要计算哈希值的文本"
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="哈希算法">
            <Radio.Group value={selectedAlgorithm} onChange={handleAlgorithmChange} buttonStyle="solid">
              <Radio.Button value="sha1">SHA-1</Radio.Button>
              <Radio.Button value="sha256">SHA-256</Radio.Button>
              <Radio.Button value="sha384">SHA-384</Radio.Button>
              <Radio.Button value="sha512">SHA-512</Radio.Button>
            </Radio.Group>

            <div style={{ marginTop: 16 }}>
              <Space>
                <Button type="primary" onClick={generateSingleHash} loading={loading}>
                  生成哈希值
                </Button>
                <Button onClick={generateAllHashes} loading={loading}>
                  生成所有哈希值
                </Button>
                <Button onClick={handleClear}>
                  清空
                </Button>
              </Space>
            </div>
          </Card>
        </Col>

        {error && (
          <Col span={24}>
            <div style={{ color: 'red', marginBottom: 16 }}>
              {error}
            </div>
          </Col>
        )}

        {hashResults.length > 0 && (
          <Col span={24}>
            <Card title="哈希结果">
              <Table
                columns={columns}
                dataSource={hashResults}
                pagination={false}
                rowKey="key"
                size="middle"
              />
            </Card>
          </Col>
        )}

        <Col span={24}>
          <Card title="关于哈希算法">
            <Paragraph>
              哈希函数是一种将任意大小的数据映射到固定大小值的算法。哈希函数的主要特点包括：
            </Paragraph>
            <ul>
              <li>
                <Text strong>确定性</Text>：相同的输入总是产生相同的输出
              </li>
              <li>
                <Text strong>单向性</Text>：从哈希值反向计算原始输入在计算上是不可行的
              </li>
              <li>
                <Text strong>抗碰撞性</Text>：找到两个不同的输入产生相同的哈希值在计算上是困难的
              </li>
            </ul>
            <Paragraph>
              <Text strong>常见用途</Text>：
            </Paragraph>
            <ul>
              <li>数据完整性验证</li>
              <li>密码存储（与盐值结合使用）</li>
              <li>数字签名</li>
              <li>文件校验和</li>
            </ul>
            <Paragraph>
              <Text strong>安全性说明</Text>：SHA-1已被认为不够安全，不应用于安全关键型应用。推荐使用SHA-256或更强的算法。
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HashGeneratorTool;
