import React, { useEffect, useState } from 'react';
import { Select, message } from 'antd';
import { useMutation } from '@apollo/client';
import { UPDATE_PART } from '../../../graphQL/versionActions';

const { Option } = Select;

interface AutoSaveSelectProps {
  name: string;
  value: string;
  versionId: number;
  options: { label: string; value: string }[];
  isAdditional?: boolean;
  dataType?: string;
  typeGroup?: string;
}

const AutoSaveSelect: React.FC<AutoSaveSelectProps> = ({
  name,
  value,
  versionId,
  options,
  isAdditional = false,
  dataType = 'string',
  typeGroup = 'custom',
}) => {
  const [selected, setSelected] = useState(value);
  const [updatePart] = useMutation(UPDATE_PART);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setSelected(newValue);

    const inputPayload: any = {
      version_id: versionId,
    };

    if (isAdditional) {
      inputPayload.additional_fields = [
        {
          name,
          value: newValue,
          data_type: dataType,
          type_group: typeGroup,
        },
      ];
    } else {
      inputPayload[name] = newValue;
    }

    updatePart({
      variables: {
        input: inputPayload,
      },
    })
      .then(() => message.success(`${name} updated`))
      .catch(() => message.error(`Failed to update ${name}`));
  };

  return (
    <Select value={selected} onChange={handleChange}>
      {options.map((opt) => (
        <Option key={opt.value} value={opt.value}>
          {opt.label}
        </Option>
      ))}
    </Select>
  );
};

export default AutoSaveSelect;
