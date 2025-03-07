import React, { useState } from 'react';
import { Input, Button, Row, Col, Space, Typography, Radio, Slider, Checkbox, message, Card } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';

const { TextArea } = Input;
const { Title, Text } = Typography;

// Lorem Ipsum 文本库
const LOREM_IPSUM_TEXT = {
  latin: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
    'Deserunt mollit anim id est laborum.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
    'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
    'Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt.',
    'Ut labore et dolore magnam aliquam quaerat voluptatem.',
    'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis.',
    'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.',
    'Quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas.',
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.',
    'Praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias.',
    'Excepturi sint occaecati cupiditate non provident, similique sunt in culpa.',
    'Qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    'Et harum quidem rerum facilis est et expedita distinctio.',
    'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.'
  ],
  chinese: [
    '天下皆知美之为美，斯恶已。皆知善之为善，斯不善已。',
    '故有无相生，难易相成，长短相形，高下相倾，音声相和，前后相随。',
    '人法地，地法天，天法道，道法自然。',
    '上善若水。水善利万物而不争，处众人之所恶，故几于道。',
    '居善地，心善渊，与善仁，言善信，政善治，事善能，动善时。',
    '夫唯不争，故无尤。',
    '道可道，非常道。名可名，非常名。',
    '无名天地之始；有名万物之母。',
    '故常无，欲以观其妙；常有，欲以观其徼。',
    '此两者，同出而异名，同谓之玄。玄之又玄，众妙之门。',
    '天长地久。天地所以能长且久者，以其不自生，故能长生。',
    '是以圣人后其身而身先；外其身而身存。',
    '非以其无私邪？故能成其私。',
    '知人者智，自知者明。胜人者有力，自胜者强。',
    '知足者富。强行者有志。不失其所者久。死而不亡者寿。',
    '大方无隅，大器晚成，大音希声，大象无形，道隐无名。',
    '夫唯道，善贷且成。',
    '道生一，一生二，二生三，三生万物。',
    '万物负阴而抱阳，冲气以为和。',
    '人之所恶，唯孤、寡、不谷，而王公以为称。'
  ]
};

type LanguageType = 'latin' | 'chinese';
type OutputType = 'paragraphs' | 'sentences';

const LoremIpsumGeneratorTool: React.FC = () => {
  const [language, setLanguage] = useState<LanguageType>('latin');
  const [outputType, setOutputType] = useState<OutputType>('paragraphs');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  // 处理语言选择变化
  const handleLanguageChange = (e: RadioChangeEvent) => {
    setLanguage(e.target.value);
  };

  // 处理输出类型变化
  const handleOutputTypeChange = (e: RadioChangeEvent) => {
    setOutputType(e.target.value);
  };

  // 处理数量变化
  const handleCountChange = (value: number) => {
    setCount(value);
  };

  // 生成随机整数
  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // 生成Lorem Ipsum文本
  const generateLoremIpsum = () => {
    const sentences = LOREM_IPSUM_TEXT[language];
    let result = '';

    if (outputType === 'sentences') {
      // 生成随机句子
      const selectedSentences: string[] = [];
      for (let i = 0; i < count; i++) {
        const randomIndex = getRandomInt(0, sentences.length - 1);
        selectedSentences.push(sentences[randomIndex]);
      }
      result = selectedSentences.join(' ');
    } else {
      // 生成段落
      for (let i = 0; i < count; i++) {
        const paragraphLength = getRandomInt(3, 7);
        const paragraphSentences: string[] = [];

        for (let j = 0; j < paragraphLength; j++) {
          const randomIndex = getRandomInt(0, sentences.length - 1);
          paragraphSentences.push(sentences[randomIndex]);
        }

        result += paragraphSentences.join(' ');

        if (i < count - 1) {
          result += '\n\n';
        }
      }
    }

    setOutput(result);
  };

  // 复制到剪贴板
  const handleCopy = () => {
    navigator.clipboard.writeText(output)
      .then(() => message.success('已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  // 清空输出
  const handleClear = () => {
    setOutput('');
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Lorem Ipsum 生成器</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="设置">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>语言：</Text>
                  <Radio.Group value={language} onChange={handleLanguageChange} buttonStyle="solid">
                    <Radio.Button value="latin">拉丁文</Radio.Button>
                    <Radio.Button value="chinese">中文</Radio.Button>
                  </Radio.Group>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Text strong>输出类型：</Text>
                  <Radio.Group value={outputType} onChange={handleOutputTypeChange} buttonStyle="solid">
                    <Radio.Button value="paragraphs">段落</Radio.Button>
                    <Radio.Button value="sentences">句子</Radio.Button>
                  </Radio.Group>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Text strong>数量：{count}</Text>
                  <Slider
                    min={1}
                    max={10}
                    value={count}
                    onChange={handleCountChange}
                  />
                </div>
              </Col>
            </Row>

            <div style={{ marginTop: 16 }}>
              <Space>
                <Button type="primary" onClick={generateLoremIpsum}>
                  生成文本
                </Button>
                <Button onClick={handleClear}>
                  清空
                </Button>
              </Space>
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Card
            title="生成结果"
            extra={
              <Button
                icon={<CopyOutlined />}
                onClick={handleCopy}
                disabled={!output}
              >
                复制
              </Button>
            }
          >
            <TextArea
              rows={10}
              value={output}
              readOnly
              placeholder="点击生成文本按钮生成Lorem Ipsum文本"
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="关于Lorem Ipsum">
            <Text>
              Lorem Ipsum是排版和印刷行业使用的假文本。自16世纪以来，Lorem Ipsum一直是行业的标准假文本，当时一位不知名的印刷商使用了一个字母样本，并将其打乱，制作了一个字母样本书。
            </Text>
            <br /><br />
            <Text>
              它不仅经历了五个世纪，还经历了电子排版的飞跃，基本保持不变。它在1960年代随着包含Lorem Ipsum段落的Letraset纸的发布而流行起来，最近随着Aldus PageMaker等桌面出版软件包含Lorem Ipsum版本而普及。
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoremIpsumGeneratorTool;
