import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Space, Typography, DatePicker, Radio, message } from 'antd';
import { CopyOutlined, SyncOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import dayjs from 'dayjs';

const { Title } = Typography;

type TimestampUnit = 'seconds' | 'milliseconds';

const TimestampTool: React.FC = () => {
  const [timestamp, setTimestamp] = useState<string>('');
  const [dateTime, setDateTime] = useState<dayjs.Dayjs | null>(dayjs());
  const [unit, setUnit] = useState<TimestampUnit>('seconds');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs();
      setCurrentTime(`${now.format('YYYY-MM-DD HH:mm:ss')} (${Math.floor(now.valueOf() / 1000)}秒 | ${now.valueOf()}毫秒)`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimestamp(e.target.value);
  };

  const handleDateTimeChange = (date: dayjs.Dayjs | null) => {
    setDateTime(date);
  };

  const handleUnitChange = (e: RadioChangeEvent) => {
    setUnit(e.target.value);
  };

  const timestampToDateTime = () => {
    if (!timestamp.trim()) {
      message.error('请输入时间戳');
      return;
    }

    try {
      const ts = parseInt(timestamp.trim(), 10);
      if (isNaN(ts)) {
        message.error('无效的时间戳');
        return;
      }

      const date = unit === 'seconds'
        ? dayjs.unix(ts)
        : dayjs(ts);

      setDateTime(date);
    } catch (error) {
      message.error('转换失败');
    }
  };

  const dateTimeToTimestamp = () => {
    if (!dateTime) {
      message.error('请选择日期时间');
      return;
    }

    const ts = unit === 'seconds'
      ? dateTime.unix().toString()
      : dateTime.valueOf().toString();

    setTimestamp(ts);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => message.success('已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  const handleNow = () => {
    const now = dayjs();
    setDateTime(now);
    setTimestamp(unit === 'seconds' ? now.unix().toString() : now.valueOf().toString());
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>时间戳转换</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div style={{ marginBottom: 8 }}>当前时间: {currentTime}</div>
        </Col>

        <Col span={24}>
          <Radio.Group value={unit} onChange={handleUnitChange} style={{ marginBottom: 16 }}>
            <Radio.Button value="seconds">秒 (10位)</Radio.Button>
            <Radio.Button value="milliseconds">毫秒 (13位)</Radio.Button>
          </Radio.Group>
        </Col>

        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col xs={24} sm={12}>
              <Input
                placeholder="时间戳"
                value={timestamp}
                onChange={handleTimestampChange}
                addonAfter={
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={() => handleCopy(timestamp)}
                    disabled={!timestamp}
                    style={{ border: 'none', padding: 0 }}
                  />
                }
              />
            </Col>
            <Col xs={24} sm={12}>
              <Space>
                <Button onClick={timestampToDateTime}>→ 转换为日期时间</Button>
                <Button icon={<SyncOutlined />} onClick={handleNow}>当前时间</Button>
              </Space>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Row gutter={[16, 0]} align="middle">
            <Col xs={24} sm={12}>
              <DatePicker
                showTime
                value={dateTime}
                onChange={handleDateTimeChange}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Button onClick={dateTimeToTimestamp}>→ 转换为时间戳</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default TimestampTool;
