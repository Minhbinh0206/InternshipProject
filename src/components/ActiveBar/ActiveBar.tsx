import React from 'react';
import { Tabs } from 'antd';
import './ActiveBar.css';

export interface ActiveBarItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;           // NEW
}

interface ActiveBarProps {
  items: ActiveBarItem[];
  activeKey?: string;
  onChange?: (activeKey: string) => void;
}

const ActiveBar: React.FC<ActiveBarProps> = ({
  items,
  activeKey,
  onChange,
}) => {
  // ghép icon + label thành một ReactNode
  const tabItems = items.map(({ key, label, icon }) => ({
    key,
    label: (
      <span className="active-bar-label">
        {icon && <span className="active-bar-icon">{icon}</span>}
        {label}
      </span>
    ),
  }));

  return (
    <Tabs
      className="active-bar"
      items={tabItems}
      activeKey={activeKey}
      onChange={onChange}
      animated={false}
      tabBarGutter={24}
      moreIcon={null}
    />
  );
};

export default ActiveBar;
