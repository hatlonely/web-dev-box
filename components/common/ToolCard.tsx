import React from 'react';
import { Card } from 'antd';
import { Tool } from '../../utils/types';

interface ToolCardProps {
  tool: Tool;
  onClick: (tool: Tool) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <Card
      hoverable
      style={{ width: '100%', marginBottom: 16 }}
      cover={
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 120,
          fontSize: 48,
          color: '#1890ff',
          background: '#f0f2f5'
        }}>
          {typeof tool.icon === 'string' ? tool.icon : tool.icon}
        </div>
      }
      onClick={() => onClick(tool)}
    >
      <Card.Meta
        title={tool.name}
        description={tool.description}
      />
    </Card>
  );
};

export default ToolCard;
