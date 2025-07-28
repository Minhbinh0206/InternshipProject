import React, { useEffect, useState } from 'react';
import { Input, message } from 'antd';
import { useMutation } from '@apollo/client';
import { UPDATE_PART } from '../../../graphQL/versionActions';

interface AutoSaveInputProps {
  name: string;
  value: string;
  versionId: number;
  // additional properties
  isAdditional?: boolean; 
  dataType?: string;      
  typeGroup?: string;  
  refetch?: () => void;   
  // end
}

const AutoSaveInput: React.FC<AutoSaveInputProps> = ({
  name,
  value,
  versionId,
    // additional properties
  isAdditional = false,
  dataType = 'string',
  typeGroup = 'custom',
    // end
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [updatePart] = useMutation(UPDATE_PART);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const[loading, setLoading] = useState(false);

  const handleBlur = () => {
    if (internalValue === value || loading) return;

    const inputPayload: any = {
      version_id: versionId,
    };

    if (isAdditional) {
      inputPayload.additional_fields = [
        {
          name,
          value: internalValue,
          data_type: dataType,
          type_group: typeGroup,
        },
      ];
    } else {
      inputPayload[name] = internalValue;
    }

    setLoading(true);

    updatePart({
      variables: {
        input: inputPayload,
      },
    })
       .then((res) => {
    if (res.errors) {
      throw new Error(res.errors[0]?.message || 'Update failed'); 
    }
    message.success(`${name} updated`);
  })
      .catch((err) => {
        console.error(err);
        message.error(`Failed to update ${name}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Input
      value={internalValue}
      onChange={(e) => setInternalValue(e.target.value)}
      onBlur={handleBlur}
    />
  );
};

export default AutoSaveInput;
