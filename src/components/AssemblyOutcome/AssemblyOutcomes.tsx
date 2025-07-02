import React, { useState } from 'react';
import {
  Button,
  Input,
  Row,
  Col,
  Typography,
  Tooltip,
  Tabs,
  Table,
  Space
} from 'antd';
import {
  QuestionCircleOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
  StopOutlined,
  SyncOutlined,
  PlusOutlined,
  SettingOutlined,
  QuestionCircleFilled,
  QuestionOutlined
} from '@ant-design/icons';
import CustomButton from '../CustomButton/CustomButton';

const { Title, Paragraph, Text } = Typography;

const tabItems = [
  { key: 'active', label: 'Active (0)' },
  { key: 'blocked', label: 'Blocked (0)' },
  { key: 'decommissioned', label: 'Decommissioned (0)' },
];

interface Outcome {
  key: string;
  part: string;
  code: string;
  description: string;
  sku: string;
  primaryFinish: string;
  secondaryFinish: string;
  publishedVersion: string;
}

const mockData: Outcome[] = [];

const AssemblyOutcomes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div style={{ padding: 32 }}>
      {/* --- Header + Tooltip --- */}
      <Row align="middle" gutter={8}>
        <Col>
          <Title level={5} style={{ margin: 0, color: '#1677ff' }}>Assembly outcomes</Title>
        </Col>
        <Col>
          <Tooltip title="More info about assembly outcomes">
            <QuestionCircleFilled style={{ color: '#1677ff' }} />
          </Tooltip>
        </Col>
      </Row>

      {/* --- Cảnh báo --- */}
      <Row align="middle" gutter={8} style={{ margin: '16px 0' }}>
        <Col>
          <ExclamationCircleFilled style={{ color: 'red' }} />
        </Col>
        <Col>
          <Text type="danger">
            Please solve conflicting properties before validating code builder!
          </Text>
        </Col>
      </Row>

      {/* --- Search + Reset --- */}
      <Row align="middle" gutter={12} style={{ marginBottom: 12, width: '30%' }}>
        <Col flex="auto">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            allowClear
            style={{ padding: 10 }}
          />
        </Col>
        <Col>
          <Button type="link">Reset</Button>
        </Col>
      </Row>

      {/* --- Tabs --- */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 8 }}
      />

      {/* --- Description --- */}
      <Paragraph style={{ maxWidth: '50%' }}>
        Active assembly outcomes are potential part assemblies. You can create these parts and have them link to this assembler. If you edit your assembler's parts, created assemblies that no longer meet these outcomes will be
      </Paragraph>

      {/* --- Action Buttons Row --- */}
      <Row gutter={12} align="middle" style={{ margin: '20px 0' }}>
        {/* Cột trái – giữ nguyên */}
        <Col>
          <CustomButton variant="blue" layout="noIcon" text="Refresh outcomes" />
          <CustomButton variant="blue" layout="noIcon" text="?" />
        </Col>

        {/* Cột phải – đẩy hết về bên phải */}
        <Col flex="auto" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space wrap>
            <CustomButton disabled variant="gray" layout="noIcon" text="Block assembly outcomes" />
            <CustomButton disabled variant="gray" layout="noIcon" text="Update and recalculate all modified assemblies" />
            <CustomButton disabled variant="gray" layout="noIcon" text="Create all new assembly outcomes" />
            <CustomButton variant="blue" layout="noIcon" text="?" />
          </Space>
        </Col>
      </Row>

    </div>
  );
};

export default AssemblyOutcomes;
