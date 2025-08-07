import React from 'react';
import { Select, Typography } from 'antd';
import CustomButton from '../../common/CustomButton/CustomButton';
import type PartType from '../../../types/partType';
const { Text } = Typography;

export type PartTypeMode = 'editable' | 'read-only' | 'detailed' | 'modify' | 'addToGroup';

interface FilterPartTypeProps {
  value?: string;
  partTypes?: PartType[];
  mode: PartTypeMode;
  selectedPartType?: string;
  onChange?: (value: string) => void;
  code?: string;

  /** Tuỳ chọn nút phụ (chỉ hiển thị ở mode = 'editable') */
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

const FilterPartType: React.FC<FilterPartTypeProps> = ({
  value,
  partTypes,
  mode,
  selectedPartType,
  onChange,
  code,
  showButton = false,
  buttonText = 'Return to version control',
  onButtonClick
}) => {

  /* ---------- ĐỌC CHỈ HIỂN THỊ ---------- */
  if (mode === 'read-only') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 24 }}>
        <Text strong>ERP SKU Code:</Text>  <Text>{code}</Text>
        <Text strong>Part type:</Text>     <Text>{selectedPartType}</Text>
      </div>
    );
  }

  /* ---------- EDIT / DETAILED ---------- */
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: mode === 'addToGroup' ? 0 : 24,
        marginBottom: mode === 'addToGroup' ? 0 : 50,
        marginLeft: mode === 'addToGroup' ? 30 : 0
      }}
    >
      {/* Chọn Part‑type */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {
          !(mode === 'addToGroup') && (<Text strong>Part type:</Text>)
        }
        
        <Select
          value={value}
          style={{ width: 180 }}
          onChange={onChange}
          disabled={mode === 'modify'}
          options={partTypes?.map(p => ({ value: p.value, label: p.label }))}
        />

      </div>

      {/* Nút phụ (chỉ mode editable) */}
      {mode === 'editable' && showButton && (
        <CustomButton
          variant="white"
          layout="noIcon"
          text={buttonText}
          onClick={onButtonClick}
        />
      )}
    </div>
  );
};

export default FilterPartType;
