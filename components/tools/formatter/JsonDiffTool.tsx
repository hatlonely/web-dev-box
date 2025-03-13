import React, { useState } from 'react';
import { Input, Button, Row, Col, Space, Typography, message, Card } from 'antd';
import { CopyOutlined, DiffOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

// 定义差异类型
type DiffType = 'added' | 'removed' | 'changed' | 'unchanged';

// 定义差异项结构
interface DiffItem {
  key: string;
  type: DiffType;
  leftValue?: any;
  rightValue?: any;
  path: string[];
}

const JsonDiffTool: React.FC = () => {
  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');
  const [diffResult, setDiffResult] = useState<DiffItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [leftError, setLeftError] = useState<string | null>(null);
  const [rightError, setRightError] = useState<string | null>(null);

  // 处理左侧输入变化
  const handleLeftInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLeftInput(e.target.value);
    setLeftError(null);
    setError(null);
  };

  // 处理右侧输入变化
  const handleRightInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRightInput(e.target.value);
    setRightError(null);
    setError(null);
  };

  // 清空所有输入和结果
  const handleClear = () => {
    setLeftInput('');
    setRightInput('');
    setDiffResult([]);
    setError(null);
    setLeftError(null);
    setRightError(null);
  };

  // 加载示例数据
  const handleSampleData = () => {
    const leftSample = {
      "name": "开发者工具箱",
      "version": "1.0.0",
      "tools": [
        { "id": "json-formatter", "active": true },
        { "id": "base64", "active": false }
      ],
      "settings": {
        "theme": "light",
        "language": "zh-CN"
      }
    };

    const rightSample = {
      "name": "开发者工具箱",
      "version": "1.1.0",
      "settings": {
        "language": "zh-CN",
        "theme": "dark"
      },
      "tools": [
        { "id": "json-formatter", "active": true },
        { "id": "base64", "active": true },
        { "id": "json-diff", "active": true }
      ]
    };

    setLeftInput(JSON.stringify(leftSample, null, 2));
    setRightInput(JSON.stringify(rightSample, null, 2));
    setLeftError(null);
    setRightError(null);
    setError(null);
  };

  // 复制结果
  const handleCopy = () => {
    const diffText = diffResult
      .map(item => {
        const pathStr = item.path.join('.');
        const prefix = item.path.length > 0 ? `${pathStr}: ` : '';
        
        switch (item.type) {
          case 'added':
            return `+ ${prefix}${JSON.stringify(item.rightValue)}`;
          case 'removed':
            return `- ${prefix}${JSON.stringify(item.leftValue)}`;
          case 'changed':
            return `~ ${prefix}${JSON.stringify(item.leftValue)} -> ${JSON.stringify(item.rightValue)}`;
          default:
            return '';
        }
      })
      .filter(line => line)
      .join('\n');

    navigator.clipboard.writeText(diffText)
      .then(() => message.success('已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  // 比较两个对象并返回差异
  const compareObjects = (
    left: any, 
    right: any, 
    currentPath: string[] = [], 
    result: DiffItem[] = []
  ): DiffItem[] => {
    // 处理两者类型不同的情况
    if (typeof left !== typeof right) {
      result.push({
        key: currentPath.join('.') || 'root',
        type: 'changed',
        leftValue: left,
        rightValue: right,
        path: [...currentPath]
      });
      return result;
    }

    // 处理基本类型
    if (typeof left !== 'object' || left === null || right === null) {
      if (left !== right) {
        result.push({
          key: currentPath.join('.') || 'root',
          type: 'changed',
          leftValue: left,
          rightValue: right,
          path: [...currentPath]
        });
      }
      return result;
    }

    // 处理数组
    if (Array.isArray(left) && Array.isArray(right)) {
      // 比较数组长度
      const maxLength = Math.max(left.length, right.length);
      for (let i = 0; i < maxLength; i++) {
        const newPath = [...currentPath, i.toString()];
        if (i >= left.length) {
          // 右侧数组有额外元素
          result.push({
            key: newPath.join('.'),
            type: 'added',
            rightValue: right[i],
            path: newPath
          });
        } else if (i >= right.length) {
          // 左侧数组有额外元素
          result.push({
            key: newPath.join('.'),
            type: 'removed',
            leftValue: left[i],
            path: newPath
          });
        } else {
          // 两边都有，递归比较
          compareObjects(left[i], right[i], newPath, result);
        }
      }
      return result;
    }

    // 处理对象
    // 收集所有的键
    const allKeys = new Set([...Object.keys(left), ...Object.keys(right)]);

    for (const key of allKeys) {
      const newPath = [...currentPath, key];
      
      if (!(key in left)) {
        // 右侧对象有额外属性
        result.push({
          key: newPath.join('.'),
          type: 'added',
          rightValue: right[key],
          path: newPath
        });
      } else if (!(key in right)) {
        // 左侧对象有额外属性
        result.push({
          key: newPath.join('.'),
          type: 'removed',
          leftValue: left[key],
          path: newPath
        });
      } else {
        // 两边都有，递归比较
        compareObjects(left[key], right[key], newPath, result);
      }
    }

    return result;
  };

  // 执行diff操作
  const handleCompare = () => {
    // 清空之前的错误和结果
    setError(null);
    setLeftError(null);
    setRightError(null);
    setDiffResult([]);

    // 验证输入
    if (!leftInput.trim() && !rightInput.trim()) {
      setError("请输入JSON数据进行比较");
      return;
    }

    let leftJson: any;
    let rightJson: any;

    // 解析左侧JSON
    try {
      leftJson = leftInput.trim() ? JSON.parse(leftInput) : {};
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setLeftError(`左侧JSON解析错误: ${errorMessage}`);
      return;
    }

    // 解析右侧JSON
    try {
      rightJson = rightInput.trim() ? JSON.parse(rightInput) : {};
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setRightError(`右侧JSON解析错误: ${errorMessage}`);
      return;
    }

    // 执行对比
    const differences = compareObjects(leftJson, rightJson);
    setDiffResult(differences);

    // 如果没有差异，显示提示
    if (differences.length === 0) {
      message.info('两个JSON完全相同');
    }
  };

  // 根据diff类型返回样式
  const getDiffStyle = (type: DiffType) => {
    switch (type) {
      case 'added':
        return { backgroundColor: 'rgba(46, 204, 113, 0.2)', padding: '2px 4px', borderRadius: '2px' };
      case 'removed':
        return { backgroundColor: 'rgba(231, 76, 60, 0.2)', padding: '2px 4px', borderRadius: '2px' };
      case 'changed':
        return { backgroundColor: 'rgba(241, 196, 15, 0.2)', padding: '2px 4px', borderRadius: '2px' };
      default:
        return {};
    }
  };

  // 根据diff类型返回标签文字
  const getDiffLabel = (type: DiffType) => {
    switch (type) {
      case 'added':
        return '新增';
      case 'removed':
        return '删除';
      case 'changed':
        return '修改';
      default:
        return '';
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>JSON Diff 对比工具</Title>
      <Text>比较两个JSON之间的差异，自动处理键顺序不一致的问题</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <div style={{ marginBottom: 8 }}>
            <Text strong>左侧 JSON:</Text>
          </div>
          <TextArea
            rows={12}
            value={leftInput}
            onChange={handleLeftInputChange}
            placeholder="输入第一个JSON"
            style={{ borderColor: leftError ? '#ff4d4f' : undefined }}
          />
          {leftError && (
            <div style={{ color: '#ff4d4f', marginTop: 8 }}>
              {leftError}
            </div>
          )}
        </Col>

        <Col xs={24} md={12}>
          <div style={{ marginBottom: 8 }}>
            <Text strong>右侧 JSON:</Text>
          </div>
          <TextArea
            rows={12}
            value={rightInput}
            onChange={handleRightInputChange}
            placeholder="输入第二个JSON"
            style={{ borderColor: rightError ? '#ff4d4f' : undefined }}
          />
          {rightError && (
            <div style={{ color: '#ff4d4f', marginTop: 8 }}>
              {rightError}
            </div>
          )}
        </Col>

        <Col span={24}>
          <Space>
            <Button type="primary" icon={<DiffOutlined />} onClick={handleCompare}>
              比较
            </Button>
            <Button onClick={handleSampleData}>
              示例数据
            </Button>
            <Button icon={<DeleteOutlined />} onClick={handleClear}>
              清空
            </Button>
            <Button 
              icon={<CopyOutlined />} 
              onClick={handleCopy}
              disabled={diffResult.length === 0}
            >
              复制差异
            </Button>
          </Space>
        </Col>

        {error && (
          <Col span={24}>
            <div style={{ color: '#ff4d4f', marginBottom: 16 }}>
              {error}
            </div>
          </Col>
        )}

        <Col span={24}>
          <Title level={4}>比较结果：</Title>
          {diffResult.length === 0 ? (
            <Text>进行比较后，结果将显示在这里</Text>
          ) : (
            <Card style={{ maxHeight: '400px', overflow: 'auto' }}>
              {diffResult.map((diff, index) => (
                <div key={index} style={{ marginBottom: 8 }}>
                  <div style={getDiffStyle(diff.type)}>
                    <Text style={{ marginRight: 8 }}>
                      <strong>{diff.path.join('.') || 'root'}</strong>
                    </Text>
                    <Text
                      type={
                        diff.type === 'added' 
                          ? 'success' 
                          : diff.type === 'removed' 
                            ? 'danger' 
                            : diff.type === 'changed' 
                              ? 'warning' 
                              : undefined
                      }
                    >
                      [{getDiffLabel(diff.type)}]
                    </Text>
                    {diff.type === 'added' && (
                      <div>新值: {JSON.stringify(diff.rightValue)}</div>
                    )}
                    {diff.type === 'removed' && (
                      <div>旧值: {JSON.stringify(diff.leftValue)}</div>
                    )}
                    {diff.type === 'changed' && (
                      <div>
                        <div>旧值: {JSON.stringify(diff.leftValue)}</div>
                        <div>新值: {JSON.stringify(diff.rightValue)}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Card>
          )}
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Title level={4}>使用说明</Title>
          <ul>
            <li>
              <Text>
                在左右两侧输入框中分别输入要比较的JSON数据
              </Text>
            </li>
            <li>
              <Text>
                点击"比较"按钮查看差异结果
              </Text>
            </li>
            <li>
              <Text>
                <strong>绿色</strong>表示在右侧JSON中新增的内容
              </Text>
            </li>
            <li>
              <Text>
                <strong>红色</strong>表示在右侧JSON中删除的内容
              </Text>
            </li>
            <li>
              <Text>
                <strong>黄色</strong>表示在两侧JSON中修改的内容
              </Text>
            </li>
            <li>
              <Text>
                工具会自动处理JSON键顺序不一致的问题，确保准确比较
              </Text>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default JsonDiffTool;