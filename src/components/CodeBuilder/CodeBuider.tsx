import React, { useState } from 'react';
import { Typography, Button, Checkbox, Input, Space, Tooltip } from 'antd';
import {
  PlusOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CodeBuilder: React.FC = () => {
  const [code, setCode] = useState('{this.productCode}');
  const [isDefault, setIsDefault] = useState(true);

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 4, border: '1px solid #eee' }}>
      <Space style={{ marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>
          Code builder
        </Title>
        <Tooltip title="This is used to generate dynamic code patterns">
          <InfoCircleOutlined style={{ color: '#999' }} />
        </Tooltip>
      </Space>

      <div
        style={{
          background: '#f5f5f5',
          padding: 24,
          borderRadius: 4,
          marginBottom: 24,
        }}
      >
        {/* Top controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text strong style={{ color: '#1890ff' }}>
            Unnamed code pattern
          </Text>

          <Space>
            <Checkbox checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)}>
              Is default for new outcomes
            </Checkbox>
            <Button icon={<EditOutlined />} style={{ background: '#000', color: '#fff' }}>
              Rename code pattern
            </Button>
            <Button icon={<DeleteOutlined />} danger>
              Remove code pattern
            </Button>
          </Space>
        </div>

        {/* Code editor */}
        <TextArea
          rows={4}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter pattern code here"
          style={{ marginBottom: 16 }}
        />

        {/* Bottom buttons */}
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            Browse and add properties
          </Button>
          <Button icon={<InfoCircleOutlined />}>Validate</Button>
        </Space>
      </div>

      {/* Create new */}
      <div style={{ textAlign: 'center' }}>
        <Button type="primary" icon={<PlusOutlined />}>
          Create new code pattern
        </Button>
      </div>
    </div>
  );
};

export default CodeBuilder;
