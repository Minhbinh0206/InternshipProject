import React, { useState } from 'react';
import { Typography, Breadcrumb } from 'antd';
import {
  HomeOutlined,
} from '@ant-design/icons';
import 'antd/dist/reset.css';
import './PageHeader.css';
import ActiveBar, { type ActiveBarItem } from '../ActiveBar/ActiveBar';
import FilterPartType, { type PartTypeMode } from '../FilterPartType/FilterPartType';

const { Title } = Typography;

interface BreadcrumbItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  tabs?: ActiveBarItem[];
  activeKey?: string;
  onTabChange?: (key: string) => void;
  mode?: PartTypeMode; // ✅ mode là optional
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  tabs,
  activeKey,
  onTabChange,
  mode,
}) => {
  const [partType, setPartType] = useState('standard');

  return (
    <div style={{ background: '#f5f5f5', padding: 32, width: '100%' }}>
      {/* Breadcrumb */}
      <Breadcrumb>
        {breadcrumbs?.length ? (
          breadcrumbs.map((b, i) => (
            <Breadcrumb.Item key={i} href={b.href}>
              {b.icon} {b.title}
            </Breadcrumb.Item>
          ))
        ) : (
          <Breadcrumb.Item href="/">
            <HomeOutlined /> Home
          </Breadcrumb.Item>
        )}
      </Breadcrumb>

      {/* Title */}
      <Title level={3} style={{ textAlign: 'start', margin: '15px 0' }}>
        {title}
      </Title>

      {mode && (
        <FilterPartType
          partType={partType}
          onChange={setPartType}
          mode={mode} 
          showButton={mode === 'editable'}
          onButtonClick={() => console.log('Click nút')}
        />
      )}

      {/* ActiveBar (nếu có) */}
      {Array.isArray(tabs) && tabs.length > 0 && activeKey && onTabChange && (
        <ActiveBar
          items={tabs.map(t => ({ key: t.key, label: t.label, icon: t.icon }))}
          activeKey={activeKey}
          onChange={onTabChange}
        />
      )}

    </div>
  );
};


export default PageHeader;
