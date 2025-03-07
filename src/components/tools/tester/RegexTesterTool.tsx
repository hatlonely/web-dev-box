import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Space, Typography, Switch, Table, message, Card, Tag } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface MatchResult {
  key: string;
  index: number;
  match: string;
  groups: string[];
}

const RegexTesterTool: React.FC = () => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState<React.ReactNode>(null);

  // 标志位开关状态
  const [globalFlag, setGlobalFlag] = useState(true);
  const [caseInsensitiveFlag, setCaseInsensitiveFlag] = useState(false);
  const [multilineFlag, setMultilineFlag] = useState(false);
  const [dotAllFlag, setDotAllFlag] = useState(false);

  // 更新标志位
  useEffect(() => {
    let newFlags = '';
    if (globalFlag) newFlags += 'g';
    if (caseInsensitiveFlag) newFlags += 'i';
    if (multilineFlag) newFlags += 'm';
    if (dotAllFlag) newFlags += 's';
    setFlags(newFlags);
  }, [globalFlag, caseInsensitiveFlag, multilineFlag, dotAllFlag]);

  // 执行正则表达式匹配
  const handleTest = () => {
    if (!pattern.trim()) {
      message.warning('请输入正则表达式');
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const results: MatchResult[] = [];
      let match;
      let counter = 0;

      // 如果有全局标志，查找所有匹配项
      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          const groups = match.slice(1);
          results.push({
            key: `match-${counter++}`,
            index: match.index,
            match: match[0],
            groups: groups
          });
        }
      } else {
        // 没有全局标志，只查找第一个匹配项
        match = regex.exec(testString);
        if (match) {
          const groups = match.slice(1);
          results.push({
            key: `match-${counter++}`,
            index: match.index,
            match: match[0],
            groups: groups
          });
        }
      }

      setMatchResults(results);
      setError(null);
      highlightMatches(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(`正则表达式错误: ${errorMessage}`);
      setMatchResults([]);
      setHighlightedText(null);
    }
  };

  // 高亮显示匹配结果
  const highlightMatches = (results: MatchResult[]) => {
    if (results.length === 0) {
      setHighlightedText(<Text>{testString}</Text>);
      return;
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    // 按顺序处理每个匹配项
    results.forEach((result, idx) => {
      // 添加匹配项之前的文本
      if (result.index > lastIndex) {
        elements.push(
          <Text key={`text-${idx}-before`}>
            {testString.substring(lastIndex, result.index)}
          </Text>
        );
      }

      // 添加高亮的匹配项
      elements.push(
        <Text
          key={`text-${idx}-match`}
          mark
          strong
          style={{ backgroundColor: '#1890ff33', padding: '0 2px' }}
        >
          {result.match}
        </Text>
      );

      lastIndex = result.index + result.match.length;
    });

    // 添加最后一个匹配项之后的文本
    if (lastIndex < testString.length) {
      elements.push(
        <Text key="text-last">
          {testString.substring(lastIndex)}
        </Text>
      );
    }

    setHighlightedText(<>{elements}</>);
  };

  // 表格列定义
  const columns: ColumnsType<MatchResult> = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: '位置',
      dataIndex: 'index',
      key: 'index',
      width: 100,
    },
    {
      title: '匹配内容',
      dataIndex: 'match',
      key: 'match',
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: '捕获组',
      dataIndex: 'groups',
      key: 'groups',
      render: (groups) => (
        <Space wrap>
          {groups.length > 0 ? (
            groups.map((group: string, index: number) => (
              <Tag color="blue" key={index}>
                ${index + 1}: {group}
              </Tag>
            ))
          ) : (
            <Text type="secondary">无捕获组</Text>
          )}
        </Space>
      ),
    },
  ];

  // 示例正则表达式
  const examples = [
    { name: '邮箱验证', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', testString: 'test@example.com, invalid-email, another.valid@email.co.uk' },
    { name: '手机号码', pattern: '1[3-9]\\d{9}', testString: '13812345678, 19987654321, 12345678901, 1234567890' },
    { name: 'URL提取', pattern: 'https?://[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=]+', testString: 'Visit https://example.com or http://test.co.uk/page?param=1' },
    { name: '日期格式', pattern: '\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])', testString: '2023-01-15, 2022-13-01, 2024-02-30' },
  ];

  // 加载示例
  const loadExample = (example: { name: string, pattern: string, testString: string }) => {
    setPattern(example.pattern);
    setTestString(example.testString);
    setError(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>正则表达式测试工具</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="正则表达式">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="输入正则表达式，例如: \d+"
                  addonBefore="/"
                  addonAfter={`/${flags}`}
                />
              </Col>

              <Col span={24}>
                <Space wrap>
                  <Space>
                    <Switch
                      checked={globalFlag}
                      onChange={setGlobalFlag}
                      size="small"
                    />
                    <Text>全局匹配 (g)</Text>
                  </Space>

                  <Space>
                    <Switch
                      checked={caseInsensitiveFlag}
                      onChange={setCaseInsensitiveFlag}
                      size="small"
                    />
                    <Text>忽略大小写 (i)</Text>
                  </Space>

                  <Space>
                    <Switch
                      checked={multilineFlag}
                      onChange={setMultilineFlag}
                      size="small"
                    />
                    <Text>多行模式 (m)</Text>
                  </Space>

                  <Space>
                    <Switch
                      checked={dotAllFlag}
                      onChange={setDotAllFlag}
                      size="small"
                    />
                    <Text>点匹配所有 (s)</Text>
                  </Space>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="测试文本">
            <TextArea
              rows={6}
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="输入要测试的文本"
            />
          </Card>
        </Col>

        <Col span={24}>
          <Space>
            <Button type="primary" onClick={handleTest}>
              测试
            </Button>

            <Button
              onClick={() => {
                setPattern('');
                setTestString('');
                setMatchResults([]);
                setError(null);
                setHighlightedText(null);
              }}
            >
              清空
            </Button>
          </Space>
        </Col>

        {error && (
          <Col span={24}>
            <div style={{ color: 'red', marginBottom: 16 }}>
              {error}
            </div>
          </Col>
        )}

        <Col span={24}>
          <Card title="示例">
            <Space wrap>
              {examples.map((example, index) => (
                <Button key={index} onClick={() => loadExample(example)}>
                  {example.name}
                </Button>
              ))}
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="匹配结果" extra={<Text>找到 {matchResults.length} 个匹配</Text>}>
            {highlightedText && (
              <div style={{ marginBottom: 16, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
                <Paragraph>{highlightedText}</Paragraph>
              </div>
            )}

            <Table
              columns={columns}
              dataSource={matchResults}
              pagination={false}
              size="small"
              locale={{ emptyText: '没有找到匹配项' }}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="正则表达式参考">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Title level={5}>常用元字符</Title>
                <ul>
                  <li><Text code>.</Text> - 匹配除换行符外的任意字符</li>
                  <li><Text code>\d</Text> - 匹配数字</li>
                  <li><Text code>\w</Text> - 匹配字母、数字、下划线</li>
                  <li><Text code>\s</Text> - 匹配空白字符</li>
                  <li><Text code>^</Text> - 匹配开头</li>
                  <li><Text code>$</Text> - 匹配结尾</li>
                </ul>
              </Col>

              <Col xs={24} sm={12}>
                <Title level={5}>常用量词</Title>
                <ul>
                  <li><Text code>*</Text> - 匹配0次或多次</li>
                  <li><Text code>+</Text> - 匹配1次或多次</li>
                  <li><Text code>?</Text> - 匹配0次或1次</li>
                  <li><Text code>{'{n}'}</Text> - 匹配恰好n次</li>
                  <li><Text code>{'{n,}'}</Text> - 匹配至少n次</li>
                  <li><Text code>{'{n,m}'}</Text> - 匹配n到m次</li>
                </ul>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RegexTesterTool;
