import React, { useEffect, useState } from 'react';
import { Input, message } from 'antd';
import { useMutation } from '@apollo/client';
import { UPDATE_PART } from '../../../graphQL/versionActions';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';


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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id, revisionId, versionCode } = useParams<{
    id: string;
    revisionId?: string;
    versionCode?: string;
  }>();

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const saveChange = () => {
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

        const updated = res?.data?.updatePart;
        const returnedCode = updated?.version_code;

        if (returnedCode && returnedCode !== versionCode) {
          navigate(`/parts/modify/${id}/${revisionId}/${returnedCode}`, { replace: true });
        }

        toast.success(`${name} updated`);
      })
      .catch((err) => {
        console.error(err);
        toast.error(`Failed to update ${name}`);
      })
      .finally(() => setLoading(false));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setInternalValue(value);
    }
  };

  return (
    <Input
      value={internalValue}
      onChange={(e) => setInternalValue(e.target.value)}
      onBlur={saveChange}
      onKeyDown={handleKeyDown}
      disabled={loading}
    />
  );
};

export default AutoSaveInput;
