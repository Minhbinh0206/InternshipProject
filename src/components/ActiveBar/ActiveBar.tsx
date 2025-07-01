import React from 'react';
import { Tabs } from 'antd';
import './ActiveBar.css';

export interface ActiveBarItem {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
}

interface ActiveBarProps {
  items: ActiveBarItem[];
  defaultActiveKey?: string;
  onChange?: (activeKey: string) => void;
  underlineWidth?: number | string;
}

const ActiveBar: React.FC<ActiveBarProps> = ({
  items,
  defaultActiveKey,
  onChange,
}) => {
  return (
    <Tabs
      className="active-bar"
      items={items}
      defaultActiveKey={defaultActiveKey ?? items[0]?.key}
      onChange={onChange}
      animated={false}
      tabBarGutter={24}
      moreIcon={null} 
    />
  );
};

export default ActiveBar;
