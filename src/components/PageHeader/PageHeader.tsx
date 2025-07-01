import React, { useState } from 'react';
import { Typography, Select, Tabs, Breadcrumb, Row, Col } from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  SearchOutlined,
  BarsOutlined,
  GatewayOutlined,
  InsertRowRightOutlined,
} from '@ant-design/icons';
import 'antd/dist/reset.css';  
import './PageHeader.css';    

const { Title, Text } = Typography;
const { Option } = Select;

const partTypes = [
  { value: 'standard', label: 'Standard', desc: 'A Standard part with default properties and behaviour' },
  { value: 'custom', label: 'Custom', desc: 'A Custom part with extended behavior' },
];

interface BreadcrumbItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[]; // optional breadcrumb array
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs }) => {
  const [partType, setPartType] = useState('standard');
  const description = partTypes.find(p => p.value === partType)?.desc;

  const tabs = [
    {
      key: 'properties',
      label: (
        <>
          <FileTextOutlined /> Properties
        </>
      ),
      children: <div style={{ padding: 20 }}>Properties content here</div>,
    },
    {
      key: 'raw-data',
      label: (
        <>
          <SearchOutlined /> Part raw data
        </>
      ),
      children: <div style={{ padding: 20 }}>Raw data content</div>,
    },
    {
      key: 'assembler',
      label: (
        <>
          <BarsOutlined /> Part assembler
        </>
      ),
      children: <div style={{ padding: 20 }}>Assembler content</div>,
    },
    {
      key: 'supply',
      label: (
        <>
          <GatewayOutlined /> Supply chain
        </>
      ),
      children: <div style={{ padding: 20 }}>Supply chain content</div>,
    },
    {
      key: 'compatible',
      label: (
        <>
          <InsertRowRightOutlined /> Part compatible
        </>
      ),
      children: <div style={{ padding: 20 }}>Compatible content</div>,
    },
  ];

  return (
    <div style={{
      background: '#f5f5f5',
      padding: 32,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }}>
      {/* Breadcrumb */}
      <Breadcrumb>
        {breadcrumbs ? (
          breadcrumbs.map((item, index) => (
            <Breadcrumb.Item key={index} href={item.href} className="link-item">
              {item.icon} {item.title}
            </Breadcrumb.Item>
          ))
        ) : (
          <>
            <Breadcrumb.Item className='link-item' href="/">
              <HomeOutlined className='link-icon' />
            </Breadcrumb.Item>
          </>
        )}
      </Breadcrumb>

      {/* Title */}
      <Title level={3} style={{ marginTop: 15, marginBottom: 15 }}>{title}</Title>

      {/* Select */}
      <Row align="middle" gutter={16}>
        <Col>
          <Text strong>Part type:</Text>
        </Col>
        <Col>
          <Select
            value={partType}
            style={{ width: 180 }}
            onChange={setPartType}
          >
            {partTypes.map(p => (
              <Option value={p.value} key={p.value}>{p.label}</Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Text type="secondary">{description}</Text>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs style={{ marginTop: 32 }} defaultActiveKey="properties" items={tabs} />
    </div>
  );
};

export default PageHeader;
