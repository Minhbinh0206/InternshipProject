import React from 'react';
import { Select, Typography } from 'antd';
import CustomButton from '../../common/CustomButton/CustomButton';
import type PartType from '../../../types/partType';
const { Text } = Typography;

export type PartTypeMode = 'editable' | 'read-only' | 'detailed';

interface FilterPartTypeProps {
  /** Giá trị part‑type đang chọn (value của option) */
  value: string;
  /** Danh sách tất cả part‑types */
  partTypes: PartType[];
  /** Chế độ hiển thị */
  mode: PartTypeMode;
  /** Callback khi user thay đổi part type */
  onChange?: (value: string) => void;

  /** Tuỳ chọn nút phụ (chỉ hiển thị ở mode = 'editable') */
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

const FilterPartType: React.FC<FilterPartTypeProps> = ({
  value,
  partTypes,
  mode,
  onChange,
  showButton = false,
  buttonText = 'Return to version control',
  onButtonClick
}) => {
  /* PartType đang chọn, dùng hiển thị mô tả */
  const current = partTypes.find(p => p.value === value);

  /* ---------- ĐỌC CHỈ HIỂN THỊ ---------- */
  if (mode === 'read-only') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 24 }}>
        <Text strong>ERP SKU Code:</Text>  <Text>HP.Test.price</Text>
        <Text strong>Part type:</Text>     <Text>{current?.label}</Text>
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
        marginTop: 24,
        marginBottom: 50
      }}
    >
      {/* Chọn Part‑type */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Text strong>Part type:</Text>

        <Select
          value={value}
          style={{ width: 180 }}
          onChange={onChange}
          options={partTypes.map(p => ({ value: p.value, label: p.label }))}
        />

        {/* Mô tả chỉ hiển thị khi mode = 'detailed' */}
        {mode === 'detailed' && (
          <Text type="secondary"><strong>{current?.desc}</strong></Text>
        )}
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
