import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useMutation } from '@apollo/client';
import { UPDATE_PART } from '../../../graphQL/versionActions';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;

interface AutoSaveSelectProps {
  name: string;
  value: string;
  versionId: number;
  options: { label: string; value: string }[];
  isAdditional?: boolean;
  dataType?: string;
  typeGroup?: string;
  versionCode?: string;
}

const AutoSaveSelect: React.FC<AutoSaveSelectProps> = ({
  name,
  value,
  versionId,
  options,
  isAdditional = false,
  dataType = 'string',
  typeGroup = 'custom',
  versionCode
}) => {
  const [selected, setSelected] = useState(value);
  const [updatePart] = useMutation(UPDATE_PART);
  const [loading, setLoading] = useState(false);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);

  const navigate = useNavigate();
  const { id, revisionId } = useParams<{ id: string; revisionId?: string }>();

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = async (newValue: string) => {
    if (loading || isCreatingDraft) return;

    setSelected(newValue);
    const inputPayload: any = { version_id: versionId };

    if (isAdditional) {
      inputPayload.additional_fields = [
        { name, value: newValue, data_type: dataType, type_group: typeGroup }
      ];
    } else {
      inputPayload[name] = newValue;
    }

    setLoading(true);

    try {
      const res = await updatePart({ variables: { input: inputPayload } });
      if (res.errors) throw new Error(res.errors[0]?.message || 'Update failed');

      const updated = res?.data?.updatePart;
      const returnedCode = updated?.version_code;

      if (returnedCode && returnedCode !== versionCode) {
        setIsCreatingDraft(true);
        navigate(`/parts/modify/${id}/${revisionId}/${returnedCode}`, { replace: true });
      }

      toast.success(`${name} updated`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update ${name}`);
    } finally {
      setLoading(false);
      setIsCreatingDraft(false);
    }
  };

  return (
    <Select value={selected} onChange={handleChange} disabled={loading}>
      {options.map(opt => (
        <Option key={opt.value} value={opt.value}>
          {opt.label}
        </Option>
      ))}
    </Select>
  );
};

export default AutoSaveSelect;
