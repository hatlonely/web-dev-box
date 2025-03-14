import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Space, Typography, Table, InputNumber, message, Card, Descriptions, Tag, Divider } from 'antd';
import { CopyOutlined, CalculatorOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import parser, { CronExpression } from 'cron-parser';
import type { ColumnsType } from 'antd/es/table';

const { Title, Paragraph, Text } = Typography;

interface ExecutionTime {
  key: string;
  index: number;
  datetime: string;
  timestamp: number;
  fromNow: string;
}

const CrontabTool: React.FC = () => {
  const [cronExpression, setCronExpression] = useState<string>('*/5 * * * *');
  const [count, setCount] = useState<number>(5);
  const [nextExecutions, setNextExecutions] = useState<ExecutionTime[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expressionDetails, setExpressionDetails] = useState<{
    minutes: string;
    hours: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
  } | null>(null);

  // 解析 cron 表达式的各部分含义
  const parseCronExpression = (expression: string) => {
    // 默认的 cron 格式是：分钟 小时 日期 月份 星期
    const parts = expression.trim().split(/\s+/);

    if (parts.length !== 5) {
      return `无效的 cron 表达式格式，应该有 5 个字段: ${parts.length} 提供`;
    }

    try {
      const [minutes, hours, dayOfMonth, month, dayOfWeek] = parts;

      // 使用 cron-parser 库尝试解析表达式，如果无效会抛出异常
      parser.parse(expression);

      // 解释 cron 表达式的各个部分
      const details = {
        minutes: explainCronPart(minutes, '分钟', 0, 59),
        hours: explainCronPart(hours, '小时', 0, 23),
        dayOfMonth: explainCronPart(dayOfMonth, '日', 1, 31),
        month: explainCronPart(month, '月', 1, 12, true),
        dayOfWeek: explainCronPart(dayOfWeek, '星期', 0, 6, false, true)
      };

      setExpressionDetails(details);
      return null;
    } catch (err: any) {
      return `解析错误: ${err.message}`;
    }
  };

  // 解释 cron 表达式的单个部分
  const explainCronPart = (
    part: string,
    name: string,
    min: number,
    max: number,
    isMonth: boolean = false,
    isDayOfWeek: boolean = false
  ): string => {
    // 处理特殊字符
    if (part === '*') {
      return `每${name}`;
    }

    // 处理带 / 的步进
    if (part.includes('/')) {
      const [range, step] = part.split('/');
      if (range === '*') {
        return `每 ${step} ${name}`;
      } else {
        return `在 ${range} 范围内每 ${step} ${name}`;
      }
    }

    // 处理范围
    if (part.includes('-')) {
      const [start, end] = part.split('-');
      let startText = start;
      let endText = end;

      if (isMonth) {
        startText = getMonthName(parseInt(start));
        endText = getMonthName(parseInt(end));
      } else if (isDayOfWeek) {
        startText = getDayOfWeekName(parseInt(start));
        endText = getDayOfWeekName(parseInt(end));
      }

      return `从 ${startText} 到 ${endText}`;
    }

    // 处理列表
    if (part.includes(',')) {
      const parts = part.split(',');
      let formattedParts = parts;

      if (isMonth) {
        formattedParts = parts.map(p => getMonthName(parseInt(p)));
      } else if (isDayOfWeek) {
        formattedParts = parts.map(p => getDayOfWeekName(parseInt(p)));
      }

      return `在 ${formattedParts.join(', ')} ${name}`;
    }

    // 单个值
    if (!isNaN(parseInt(part))) {
      if (isMonth) {
        return `在 ${getMonthName(parseInt(part))} 月`;
      } else if (isDayOfWeek) {
        return `在 ${getDayOfWeekName(parseInt(part))}`;
      } else {
        return `在 ${name} ${part}`;
      }
    }

    return part;
  };

  // 获取月份名称
  const getMonthName = (month: number): string => {
    const months = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    return months[month] || month.toString();
  };

  // 获取星期名称
  const getDayOfWeekName = (day: number): string => {
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return days[day] || day.toString();
  };

  // 计算下一次执行时间
  const calculateNextExecutions = () => {
    setError(null);

    try {
      // 解析 cron 表达式
      const interval = parser.parse(cronExpression);
      const results: ExecutionTime[] = [];
      const now = dayjs();

      // 计算下 n 次执行时间
      for (let i = 0; i < count; i++) {
        const next = interval.next();
        const nextDate = dayjs(next.toDate());
        const fromNow = getRelativeTimeDescription(now, nextDate);

        results.push({
          key: i.toString(),
          index: i + 1,
          datetime: nextDate.format('YYYY-MM-DD HH:mm:ss'),
          timestamp: nextDate.unix(),
          fromNow
        });
      }

      setNextExecutions(results);

      // 解析表达式的含义
      const parseError = parseCronExpression(cronExpression);
      if (parseError) {
        setError(parseError);
      }
    } catch (err: any) {
      setError(`无效的 cron 表达式: ${err.message}`);
      setNextExecutions([]);
      setExpressionDetails(null);
    }
  };

  // 获取相对时间描述
  const getRelativeTimeDescription = (now: dayjs.Dayjs, futureDate: dayjs.Dayjs): string => {
    const diffSeconds = futureDate.diff(now, 'second');
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} 天 ${diffHours % 24} 小时后`;
    } else if (diffHours > 0) {
      return `${diffHours} 小时 ${diffMinutes % 60} 分钟后`;
    } else {
      return `${diffMinutes} 分钟后`;
    }
  };

  // 设置一些常用的 cron 表达式
  const commonExpressions = [
    { label: '每分钟', value: '* * * * *' },
    { label: '每小时', value: '0 * * * *' },
    { label: '每天午夜', value: '0 0 * * *' },
    { label: '每天早上8点', value: '0 8 * * *' },
    { label: '每周一早上8点', value: '0 8 * * 1' },
    { label: '每月1号午夜', value: '0 0 1 * *' },
    { label: '每季度第一天', value: '0 0 1 1,4,7,10 *' },
    { label: '每年1月1日', value: '0 0 1 1 *' },
    { label: '工作日（周一至周五）早上9点', value: '0 9 * * 1-5' }
  ];

  // 处理表达式选择
  const handleSelectExpression = (expression: string) => {
    setCronExpression(expression);
  };

  // 处理复制到剪贴板
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => message.success('已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  // 表格列定义
  const columns: ColumnsType<ExecutionTime> = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 70
    },
    {
      title: '执行时间',
      dataIndex: 'datetime',
      key: 'datetime'
    },
    {
      title: '时间戳',
      dataIndex: 'timestamp',
      key: 'timestamp'
    },
    {
      title: '距离现在',
      dataIndex: 'fromNow',
      key: 'fromNow'
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          icon={<CopyOutlined />}
          onClick={() => handleCopy(record.datetime)}
        />
      )
    }
  ];

  // 初始化时计算一次
  useEffect(() => {
    calculateNextExecutions();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Crontab 执行时间计算</Title>

      <Paragraph>
        输入 Cron 表达式，计算未来执行时间。Cron 表达式格式为：
        <Text code>分钟 小时 日期 月份 星期</Text>
      </Paragraph>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              placeholder="Cron 表达式，例如：*/5 * * * *"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              addonAfter={
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopy(cronExpression)}
                  style={{ border: 'none', padding: 0 }}
                />
              }
            />

            <Space wrap>
              {commonExpressions.map((item, index) => (
                <Tag
                  key={index}
                  color="blue"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSelectExpression(item.value)}
                >
                  {item.label}: {item.value}
                </Tag>
              ))}
            </Space>
          </Space>
        </Col>

        <Col xs={24} sm={12}>
          <Space>
            <Text>计算未来</Text>
            <InputNumber
              min={1}
              max={100}
              value={count}
              onChange={(value) => setCount(value || 5)}
            />
            <Text>次执行时间</Text>
            <Button
              type="primary"
              icon={<CalculatorOutlined />}
              onClick={calculateNextExecutions}
            >
              计算
            </Button>
          </Space>
        </Col>

        {error && (
          <Col span={24}>
            <div style={{ color: 'red' }}>{error}</div>
          </Col>
        )}

        {expressionDetails && (
          <Col span={24}>
            <Card title={<><InfoCircleOutlined /> Cron 表达式解析</>} size="small">
              <Descriptions bordered size="small" column={{ xs: 1, sm: 2, md: 3 }}>
                <Descriptions.Item label="分钟">{expressionDetails.minutes}</Descriptions.Item>
                <Descriptions.Item label="小时">{expressionDetails.hours}</Descriptions.Item>
                <Descriptions.Item label="日期">{expressionDetails.dayOfMonth}</Descriptions.Item>
                <Descriptions.Item label="月份">{expressionDetails.month}</Descriptions.Item>
                <Descriptions.Item label="星期">{expressionDetails.dayOfWeek}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        )}

        <Col span={24}>
          <Table
            columns={columns}
            dataSource={nextExecutions}
            pagination={false}
            size="middle"
            bordered
          />
        </Col>
      </Row>

      {/* 说明区域 */}
      <Divider />
      <div style={{ marginTop: 16 }}>
        <Title level={4}>Cron 表达式说明</Title>
        <Paragraph>
          Cron 表达式是一种用于表示定时任务执行计划的字符串，广泛应用于 Linux、Unix 和各种编程环境中。
          一个标准的 Cron 表达式由 5 个字段组成，分别表示：分钟、小时、日期、月份和星期。
        </Paragraph>

        <Title level={5}>Cron 表达式格式</Title>
        <Card style={{ marginBottom: 16 }}>
          <Paragraph>
            <Text code>* * * * *</Text>
          </Paragraph>
          <Descriptions bordered size="small" column={{ xs: 1, sm: 2, md: 5 }}>
            <Descriptions.Item label="分钟">0-59</Descriptions.Item>
            <Descriptions.Item label="小时">0-23</Descriptions.Item>
            <Descriptions.Item label="日期">1-31</Descriptions.Item>
            <Descriptions.Item label="月份">1-12</Descriptions.Item>
            <Descriptions.Item label="星期">0-6 (0=周日)</Descriptions.Item>
          </Descriptions>
        </Card>

        <Title level={5}>特殊字符说明</Title>
        <ul>
          <li>
            <Text strong>星号 (*)</Text>：表示匹配该字段的所有值。例如，在"小时"字段中使用 * 表示每小时。
          </li>
          <li>
            <Text strong>逗号 (,)</Text>：用于分隔多个值。例如，在"星期"字段中使用 1,3,5 表示周一、周三和周五。
          </li>
          <li>
            <Text strong>连字符 (-)</Text>：用于表示范围。例如，在"小时"字段中使用 9-17 表示上午 9 点到下午 5 点之间的每小时。
          </li>
          <li>
            <Text strong>斜杠 (/)</Text>：用于指定间隔频率。例如，在"分钟"字段中使用 */15 表示每 15 分钟一次（0, 15, 30, 45 分）。
          </li>
        </ul>

        <Title level={5}>常见示例</Title>
        <Card>
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="每分钟执行一次">* * * * *</Descriptions.Item>
            <Descriptions.Item label="每小时整点执行">0 * * * *</Descriptions.Item>
            <Descriptions.Item label="每天午夜 (0:00) 执行">0 0 * * *</Descriptions.Item>
            <Descriptions.Item label="每天早上 8 点执行">0 8 * * *</Descriptions.Item>
            <Descriptions.Item label="每周一早上 8 点执行">0 8 * * 1</Descriptions.Item>
            <Descriptions.Item label="每月 1 日午夜执行">0 0 1 * *</Descriptions.Item>
            <Descriptions.Item label="每年 1 月 1 日执行">0 0 1 1 *</Descriptions.Item>
            <Descriptions.Item label="工作日（周一至周五）每天早上 9 点执行">0 9 * * 1-5</Descriptions.Item>
            <Descriptions.Item label="每 5 分钟执行一次">*/5 * * * *</Descriptions.Item>
            <Descriptions.Item label="每两小时执行一次">0 */2 * * *</Descriptions.Item>
            <Descriptions.Item label="每两小时的第 15 分钟执行">15 */2 * * *</Descriptions.Item>
            <Descriptions.Item label="每季度第一天执行">0 0 1 1,4,7,10 *</Descriptions.Item>
          </Descriptions>
        </Card>

        <Title level={5}>注意事项</Title>
        <ul>
          <li>
            <Text strong>日期和星期</Text>：当日期和星期字段都被指定（且都不是 *）时，满足任一条件即会触发执行。例如：<Text code>0 0 1 * 1</Text> 表示每月 1 日和每周一的午夜执行。
          </li>
          <li>
            <Text strong>非法日期</Text>：如果指定了不存在的日期（如 2 月 31 日），该执行计划将被忽略。
          </li>
          <li>
            <Text strong>秒级控制</Text>：标准 Cron 不支持秒级控制，一些扩展实现可能支持 6 个字段（包括秒）的表达式。
          </li>
          <li>
            <Text strong>跨月执行</Text>：Cron 不支持类似"每月最后一天"的表达式，通常需要特殊处理。
          </li>
        </ul>

        <Title level={5}>系统差异</Title>
        <Paragraph>
          不同系统的 Cron 实现可能有细微差异。例如：
        </Paragraph>
        <ul>
          <li>
            有些系统使用 0-6 表示周日到周六，而有些则使用 1-7。
          </li>
          <li>
            有些实现支持特殊字符 @yearly, @monthly, @weekly, @daily, @hourly 等简写。
          </li>
          <li>
            某些实现可能支持更复杂的语法，如 L（月/周的最后一天）, W（最近的工作日）, #（第 N 个星期几）等。
          </li>
        </ul>

        <Paragraph>
          <Text type="secondary">
            本工具实现了标准的 Cron 语法解析和执行时间计算，可以帮助您准确预测定时任务的执行时间。
          </Text>
        </Paragraph>
      </div>
    </div>
  );
};

export default CrontabTool;
