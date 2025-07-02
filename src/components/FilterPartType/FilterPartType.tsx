import React from 'react';
import { Select, Typography } from 'antd';
import CustomButton from '../CustomButton/CustomButton';
const { Text } = Typography;

export type PartTypeMode = 'editable' | 'read-only' | 'detailed';

interface FilterPartTypeProps {
  partType: string;
  mode: PartTypeMode;
  onChange?: (value: string) => void;
  showButton?: boolean;       
  buttonText?: string;
  onButtonClick?: () => void;
}

const partTypes = [
  { value: 'standard', label: 'Standard', desc: 'A Standard part with default properties and behaviour' },
  { value: 'custom', label: 'Custom', desc: 'A Custom part with extended behavior' },
  { value: 'assembler', label: 'Assembler', desc: 'This is an assembler.' },
];

const FilterPartType: React.FC<FilterPartTypeProps> = ({
  partType,
  mode,
  onChange,
  showButton = false,
}) => {
  const current = partTypes.find(p => p.value === partType);

  if (mode === 'read-only') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 24 }}>
        <Text strong>ERP SKU Code:</Text> <Text>HP.Test.price</Text>
        <Text strong>Part type:</Text> <Text>{current?.label}</Text>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginTop: 24,
      marginBottom: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Text strong>Part type:</Text>
        <Select
          value={partType}
          style={{ width: 180 }}
          onChange={onChange}
          options={partTypes.map(p => ({ value: p.value, label: p.label }))}
        />
        <Text
          type="secondary"
          strong={mode === 'detailed'} 
        >
          {current?.desc}
        </Text>
      </div>

      {mode === 'editable' && showButton && (
        <CustomButton variant='white' layout='noIcon' text='Return to version control' />
      )}
    </div>
  );
};

export default FilterPartType;
