import React, { useEffect, useState } from 'react';
import { Input, Form } from 'antd';
import type { FormInstance } from 'antd';
import { useMutation } from '@apollo/client';
import { UPDATE_PART } from '../../../graphQL/versionActions';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

interface AutoSaveInputProps {
  form?: FormInstance;
  name: string;
  value: string;
  versionId: number;
  isAdditional?: boolean;
  dataType?: string;
  typeGroup?: string;
  refetch?: () => void;
  versionCode?: string;
}

const AutoSaveInput: React.FC<AutoSaveInputProps> = ({
  form: formProp,
  name,
  value,
  versionId,
  isAdditional = false,
  dataType = 'string',
  typeGroup = 'custom',
  refetch,
  versionCode
}) => {
  const formInstance: FormInstance | undefined =
    formProp || (Form as any).useFormInstance ? (Form as any).useFormInstance() : undefined;

  const [internalValue, setInternalValue] = useState(value);
  const [updatePart] = useMutation(UPDATE_PART);
  const [loading, setLoading] = useState(false);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);

  const navigate = useNavigate();
  const { id, revisionId } = useParams<{ id: string; revisionId?: string }>();

  useEffect(() => {
    setInternalValue(value);
    if (formInstance) {
      formInstance.setFieldsValue({ [name]: value });
    }
  }, [value, name, formInstance]);

  const saveChange = async () => {
    if (!formInstance || loading || isCreatingDraft) return;

    if (isAdditional && (!internalValue || internalValue.trim() === '')) return;
    if (value === internalValue && !isAdditional) return;

    formInstance.setFieldsValue({ [name]: internalValue });
    const allFields = formInstance.getFieldsValue(true);
    const standardFields = ['name', 'code', 'description'];

    const inputPayload: any = {
      version_id: versionId,
      additional_fields: []
    };

    standardFields.forEach(field => {
      if (allFields[field] !== undefined) {
        inputPayload[field] = allFields[field];
      }
    });

    Object.keys(allFields).forEach(key => {
      if (!standardFields.includes(key)) {
        inputPayload.additional_fields.push({
          name: key,
          value: allFields[key],
          data_type: dataType,
          type_group: typeGroup
        });
      }
    });

    setLoading(true);

    try {
      const res = await updatePart({ variables: { input: inputPayload } });
      if ((res as any).errors) throw new Error((res as any).errors[0]?.message || 'Update failed');

      const updated = (res as any).data?.updatePart;
      const returnedCode = updated?.version_code;

      if (returnedCode && returnedCode !== versionCode) {
        setIsCreatingDraft(true);
        navigate(`/parts/modify/${id}/${revisionId}/${returnedCode}`, { replace: true });
      }

      toast.success(`${name} updated`);
      if (refetch) refetch();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update ${name}`);
    } finally {
      setLoading(false);
      setIsCreatingDraft(false);
    }
  };

  return (
    <Input
      value={internalValue}
      onChange={e => setInternalValue(e.target.value)}
      onBlur={saveChange}
      onKeyDown={e => {
        if (e.key === 'Escape') {
          setInternalValue(value);
          formInstance?.setFieldsValue({ [name]: value });
        }
      }}
      disabled={loading}
    />
  );
};

export default AutoSaveInput;
