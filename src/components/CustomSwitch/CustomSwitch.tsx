import React from 'react';
import { Switch } from 'antd';
import './CustomSwitch.css';

export interface CustomSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ checked, onChange, disabled }) => {
  return (
    <label className="toggle-wrapper">
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="toggle-switch"
        size="default"
      />
      <span className="toggle-label">{checked ? 'Yes' : 'No'}</span>
    </label>
  );
};

export default CustomSwitch;
