import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Input, Typography, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const { Title } = Typography;

// 计算器组件
const CalculatorTool: React.FC = () => {
  // 状态定义
  const [display, setDisplay] = useState('0'); // 当前显示值
  const [history, setHistory] = useState(''); // 历史计算过程
  const [memory, setMemory] = useState<number | null>(null); // 内存值
  const [waitingForOperand, setWaitingForOperand] = useState(true); // 是否等待输入操作数
  const [pendingOperator, setPendingOperator] = useState<string | null>(null); // 待执行的运算符
  const [pendingValue, setPendingValue] = useState<number | null>(null); // 待计算的左操作数
  
  // 使用 ref 来跟踪最新的状态值，避免键盘事件处理中的异步状态问题
  const displayRef = useRef(display);
  const historyRef = useRef(history);
  const waitingForOperandRef = useRef(waitingForOperand);
  const pendingOperatorRef = useRef(pendingOperator);
  const pendingValueRef = useRef(pendingValue);
  
  // 每当状态更新，更新 ref 值
  useEffect(() => {
    displayRef.current = display;
    historyRef.current = history;
    waitingForOperandRef.current = waitingForOperand;
    pendingOperatorRef.current = pendingOperator;
    pendingValueRef.current = pendingValue;
  }, [display, history, waitingForOperand, pendingOperator, pendingValue]);

  // 处理键盘输入
  const handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;
    
    // 只阻止空格键的默认行为，避免页面滚动
    if (key === ' ') {
      event.preventDefault();
    }

    // 数字键 0-9
    if (/^[0-9]$/.test(key)) {
      handleKeyDigit(key);
      return;
    }

    // 运算符
    switch (key) {
      case '+':
        handleKeyOperator('+');
        break;
      case '-':
        handleKeyOperator('-');
        break;
      case '*':
      case 'x':
      case 'X':
        handleKeyOperator('×');
        break;
      case '/':
        handleKeyOperator('÷');
        break;
      case '=':
        handleKeyEquals();
        break;
      case 'Enter':
        // 确保不是输入法组合键事件
        if (!event.isComposing) {
          handleKeyEquals();
        }
        break;
      case 'Backspace':
      case 'Delete':
        handleKeyClearEntry();
        break;
      case 'Escape':
        handleKeyClear();
        break;
      case '.':
      case ',':
        handleKeyDecimalPoint();
        break;
      case '%':
        handleKeyPercent();
        break;
    }
  };
  
  // 为键盘事件添加特定的处理函数

  // 键盘数字输入处理 - 使用 ref 来解决异步问题
  const handleKeyDigit = (digit: string) => {
    if (waitingForOperandRef.current) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      // 使用 ref 获取当前最新的 display 值
      const currentDisplay = displayRef.current;
      setDisplay(currentDisplay === '0' ? digit : currentDisplay + digit);
    }
  };
  
  // 键盘小数点输入处理
  const handleKeyDecimalPoint = () => {
    if (waitingForOperandRef.current) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else {
      // 使用 ref 获取当前最新的 display 值
      const currentDisplay = displayRef.current;
      if (currentDisplay.indexOf('.') === -1) {
        setDisplay(currentDisplay + '.');
      }
    }
  };
  
  // 键盘清除处理
  const handleKeyClear = () => {
    setDisplay('0');
    setHistory('');
    setWaitingForOperand(true);
    setPendingOperator(null);
    setPendingValue(null);
  };
  
  // 键盘清除当前输入处理
  const handleKeyClearEntry = () => {
    setDisplay('0');
    setWaitingForOperand(true);
  };
  
  // 键盘运算符处理
  const handleKeyOperator = (operator: string) => {
    // 获取当前显示的数值（使用ref以获取最新值）
    const currentValue = parseFloat(displayRef.current);
    
    // 使用ref获取最新的状态
    const isWaitingForOperand = waitingForOperandRef.current;
    const currPendingOperator = pendingOperatorRef.current;
    const currPendingValue = pendingValueRef.current;

    // 检查是否有待处理的运算符
    if (currPendingOperator !== null && !isWaitingForOperand) {
      // 如果有待处理的运算符并且已经输入了右操作数，则执行计算
      const result = calculate(currPendingValue!, currentValue, currPendingOperator);
      
      // 更新显示和状态
      setDisplay(result.toString());
      setPendingValue(result);
      
      // 更新历史过程
      setHistory(`${currPendingValue} ${currPendingOperator} ${currentValue} = ${result} ${operator} `);
    } else {
      // 否则，将当前值保存为左操作数
      setPendingValue(currentValue);
      
      // 更新历史过程
      setHistory(`${currentValue} ${operator} `);
    }
    
    // 设置新的运算符和等待输入状态
    setPendingOperator(operator);
    setWaitingForOperand(true);
  };
  
  // 键盘等号处理
  const handleKeyEquals = () => {
    // 获取当前显示的数值（使用ref以获取最新值）
    const currentValue = parseFloat(displayRef.current);
    
    // 使用ref获取最新的状态
    const isWaitingForOperand = waitingForOperandRef.current;
    const currPendingOperator = pendingOperatorRef.current;
    const currPendingValue = pendingValueRef.current;

    // 只有当有待处理的运算符并且已经输入了右操作数时，才执行计算
    if (currPendingOperator !== null && !isWaitingForOperand) {
      const result = calculate(currPendingValue!, currentValue, currPendingOperator);
      
      // 更新历史计算过程
      setHistory(`${currPendingValue} ${currPendingOperator} ${currentValue} = `);
      
      // 更新显示和状态
      setDisplay(result.toString());
      setPendingValue(null);
      setPendingOperator(null);
    }
    
    // 计算完成后，设置为等待输入状态
    setWaitingForOperand(true);
  };
  
  // 键盘百分比处理
  const handleKeyPercent = () => {
    // 获取当前显示的数值（使用ref以获取最新值）
    const value = parseFloat(displayRef.current);
    setDisplay((value / 100).toString());
    setWaitingForOperand(true);
  };

  // 添加和移除键盘事件监听器
  useEffect(() => {
    // 组件挂载时添加键盘事件监听
    window.addEventListener('keydown', handleKeyDown);

    // 组件卸载时移除事件监听
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 重置计算器
  const handleClear = () => {
    setDisplay('0');
    setHistory('');
    setWaitingForOperand(true);
    setPendingOperator(null);
    setPendingValue(null);
  };

  // 清除当前输入
  const handleClearEntry = () => {
    setDisplay('0');
    setWaitingForOperand(true);
  };

  // 处理按钮点击的数字输入
  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      // 如果等待输入新操作数，则重置显示值
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      // 否则追加到当前显示值
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  // 处理小数点
  const handleDecimalPoint = () => {
    if (waitingForOperand) {
      // 如果等待输入新操作数，则以0.开始
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      // 如果当前显示值中没有小数点，则添加小数点
      setDisplay(display + '.');
    }
  };

  // 执行计算
  const calculate = (leftOperand: number, rightOperand: number, operator: string): number => {
    switch (operator) {
      case '+':
        return leftOperand + rightOperand;
      case '-':
        return leftOperand - rightOperand;
      case '×':
        return leftOperand * rightOperand;
      case '÷':
        if (rightOperand === 0) {
          message.error('除数不能为零');
          return leftOperand;
        }
        return leftOperand / rightOperand;
      case '%':
        return leftOperand % rightOperand;
      default:
        return rightOperand;
    }
  };

  // 处理运算符
  const handleOperator = (operator: string) => {
    // 获取当前显示的数值
    const currentValue = parseFloat(display);

    // 检查是否有待处理的运算符
    if (pendingOperator !== null && !waitingForOperand) {
      // 如果有待处理的运算符并且已经输入了右操作数，则执行计算
      const result = calculate(pendingValue!, currentValue, pendingOperator);
      
      // 更新显示和状态
      setDisplay(result.toString());
      setPendingValue(result);
      
      // 更新历史过程，将已完成的计算添加到历史
      setHistory(`${pendingValue} ${pendingOperator} ${currentValue} = ${result} ${operator} `);
    } else {
      // 否则，将当前值保存为左操作数
      setPendingValue(currentValue);
      
      // 更新历史，开始新的一轮计算
      setHistory(`${currentValue} ${operator} `);
    }
    
    // 设置新的运算符和等待输入状态
    setPendingOperator(operator);
    setWaitingForOperand(true);
  };

  // 处理等号按钮
  const handleEquals = () => {
    // 获取当前显示的数值
    const currentValue = parseFloat(display);

    // 只有当有待处理的运算符并且已经输入了右操作数时，才执行计算
    if (pendingOperator !== null && !waitingForOperand) {
      const result = calculate(pendingValue!, currentValue, pendingOperator);
      
      // 更新历史计算过程
      setHistory(`${pendingValue} ${pendingOperator} ${currentValue} = `);
      
      // 更新显示和状态
      setDisplay(result.toString());
      setPendingValue(null);
      setPendingOperator(null);
    }
    
    // 计算完成后，设置为等待输入状态
    setWaitingForOperand(true);
  };

  // 处理正负号切换
  const handleToggleSign = () => {
    const value = parseFloat(display);
    setDisplay((value * -1).toString());
  };

  // 处理复制结果
  const handleCopy = () => {
    navigator.clipboard.writeText(display)
      .then(() => message.success('已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  // 处理记忆功能
  const handleMemory = (operation: 'MC' | 'MR' | 'M+' | 'M-') => {
    const value = parseFloat(display);
    
    switch (operation) {
      case 'MC': // 清除内存
        setMemory(null);
        break;
      case 'MR': // 读取内存
        if (memory !== null) {
          setDisplay(memory.toString());
          setWaitingForOperand(true);
        }
        break;
      case 'M+': // 加入内存
        setMemory((memory || 0) + value);
        setWaitingForOperand(true);
        break;
      case 'M-': // 从内存减去
        setMemory((memory || 0) - value);
        setWaitingForOperand(true);
        break;
    }
  };

  // 处理百分比
  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay((value / 100).toString());
    setWaitingForOperand(true);
  };

  // 处理开方
  const handleSquareRoot = () => {
    const value = parseFloat(display);
    if (value < 0) {
      message.error('不能对负数开平方根');
      return;
    }
    setDisplay(Math.sqrt(value).toString());
    setWaitingForOperand(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>计算器</Title>
      <p>支持键盘输入：数字键、加减乘除(+, -, *, /)、小数点(.)、等号(=或Enter)、退格键(Backspace)和Esc键</p>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div style={{ 
            backgroundColor: '#f5f5f5',
            borderRadius: '4px 4px 0 0',
            padding: '8px 14px',
            minHeight: '28px',
            textAlign: 'right',
            color: '#888',
            fontSize: '16px',
            borderBottom: '1px solid #d9d9d9'
          }}>
            {history}
          </div>
          <Input
            value={display}
            readOnly
            data-testid="calculator-display"
            style={{ 
              fontSize: '28px', 
              textAlign: 'right',
              padding: '12px',
              marginBottom: '16px',
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0
            }}
            suffix={
              <Button
                type="text"
                icon={<CopyOutlined />}
                onClick={handleCopy}
                style={{ border: 'none', padding: 0 }}
              />
            }
          />
        </Col>
        
        <Col span={24}>
          <Row gutter={[8, 8]}>
            {/* 第一行：内存与清除按钮 */}
            <Col span={6}>
              <Button 
                onClick={() => handleMemory('MC')} 
                style={{ width: '100%' }}
                disabled={memory === null}
              >
                MC
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={() => handleMemory('MR')} 
                style={{ width: '100%' }}
                disabled={memory === null}
              >
                MR
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={() => handleMemory('M+')} 
                style={{ width: '100%' }}
              >
                M+
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={() => handleMemory('M-')} 
                style={{ width: '100%' }}
              >
                M-
              </Button>
            </Col>
            
            {/* 第二行：清除功能和特殊操作 */}
            <Col span={6}>
              <Button 
                onClick={handleClear} 
                data-testid="clear"
                danger
                style={{ width: '100%' }}
              >
                C
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={handleClearEntry} 
                style={{ width: '100%' }}
              >
                CE
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={handlePercent} 
                style={{ width: '100%' }}
              >
                %
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={handleSquareRoot} 
                style={{ width: '100%' }}
              >
                √
              </Button>
            </Col>
            
            {/* 第三行：数字7-9和除号 */}
            <Col span={6}>
              <Button 
                onClick={() => handleDigit('7')} 
                style={{ width: '100%' }}
              >
                7
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={() => handleDigit('8')} 
                style={{ width: '100%' }}
              >
                8
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={() => handleDigit('9')} 
                style={{ width: '100%' }}
              >
                9
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={() => handleOperator('÷')} 
                style={{ width: '100%' }}
                type={pendingOperator === '÷' && !waitingForOperand ? 'primary' : 'default'}
              >
                ÷
              </Button>
            </Col>
            
            {/* 第四行：数字4-6和乘号 */}
            <Col span={6}>
              <Button 
                onClick={() => handleDigit('4')} 
                style={{ width: '100%' }}
              >
                4
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={() => handleDigit('5')} 
                style={{ width: '100%' }}
              >
                5
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={() => handleDigit('6')} 
                style={{ width: '100%' }}
              >
                6
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={() => handleOperator('×')} 
                style={{ width: '100%' }}
                type={pendingOperator === '×' && !waitingForOperand ? 'primary' : 'default'}
              >
                ×
              </Button>
            </Col>
            
            {/* 第五行：数字1-3和减号 */}
            <Col span={6}>
              <Button 
                onClick={() => handleDigit('1')} 
                data-testid="digit-1"
                style={{ width: '100%' }}
              >
                1
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={() => handleDigit('2')} 
                data-testid="digit-2"
                style={{ width: '100%' }}
              >
                2
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={() => handleDigit('3')} 
                data-testid="digit-3"
                style={{ width: '100%' }}
              >
                3
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={() => handleOperator('-')} 
                style={{ width: '100%' }}
                type={pendingOperator === '-' && !waitingForOperand ? 'primary' : 'default'}
              >
                -
              </Button>
            </Col>
            
            {/* 第六行：0, ., 等号, 加号 */}
            <Col span={6}>
              <Button 
                onClick={handleToggleSign} 
                style={{ width: '100%' }}
              >
                ±
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={() => handleDigit('0')} 
                data-testid="digit-0"
                style={{ width: '100%' }}
              >
                0
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={handleDecimalPoint}
                data-testid="digit-decimal" 
                style={{ width: '100%' }}
              >
                .
              </Button>
            </Col>
            <Col span={6}>
              <Button 
                onClick={() => handleOperator('+')} 
                data-testid="operator-plus"
                style={{ width: '100%' }}
                type={pendingOperator === '+' && !waitingForOperand ? 'primary' : 'default'}
              >
                +
              </Button>
            </Col>
            
            {/* 第七行：等号 */}
            <Col span={24}>
              <Button 
                onClick={handleEquals} 
                data-testid="operator-equals"
                type="primary"
                style={{ width: '100%' }}
              >
                =
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default CalculatorTool;
