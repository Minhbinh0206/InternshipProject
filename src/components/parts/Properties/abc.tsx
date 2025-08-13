import React, { useState, useEffect } from 'react';
import { Col, Divider, Form, Input, Row, Select, Tooltip, Typography, Modal } from 'antd';
import { QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import { useQuery, useMutation } from '@apollo/client';
import { UPDATE_PART } from '../../../graphQL/versionActions';
import '../../../pages/CreatePart/CreatePart.css';
import { GET_VERSION_BY_CODE } from '../../../graphQL/versionQueries';
import AutoSaveInput from '../OnblurProcessing/AutoSaveInput';
import AutoSaveSelect from '../OnblurProcessing/AutoSaveSelect';
import { toast } from 'react-toastify';
import CustomSwitch from '../../common/CustomSwitch/CustomSwitch';
import ModalCustomProperties from '../ModalCustomProperties/ModalCustomProperties';
import { propertyGroups } from '../../utils/propertyGroups';
import { FIELD_DEFINITIONS } from '../../../types/standardFields';

const { Option } = Select;

interface PropertiesProps {
  id: string;
  revisionId: string;
  versionCode: string;
}

interface Field {
  key: string;
  value: string;
}

const Properties: React.FC<PropertiesProps> = ({ id, revisionId, versionCode }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [updatePart] = useMutation(UPDATE_PART);
  const [isChecked, setChecked] = useState(false);

  const { data: versionData, refetch } = useQuery(GET_VERSION_BY_CODE, {
    variables: { 
      input: { 
        partId: Number(id), 
        revisionId: Number(revisionId), 
        versionCode 
      } 
    },
    skip: !id || !revisionId || !versionCode,
  });

  const version = versionData?.getVersionByVersionCode;
  const partType = version?.type?.name || '';

  useEffect(() => {
    if (version) {
      setChecked(version.enable_assembly_groups);
      form.setFieldsValue({
        name: version.name,
        code: version.code,
        description: version.description,
        ...version.additional_fields?.reduce((acc: any, field: any) => {
          acc[field.name] = field.value;
          return acc;
        }, {}),
      });
      setSelectedFields(
        version.additional_fields?.map((f: any) => ({ key: f.name, value: f.value })) || []
      );
    }
  }, [version, form]);

  const standardKeys = propertyGroups.flatMap(g => g.fields.map(f => f.key));
  const standardFields = selectedFields.filter(f => standardKeys.includes(f.key));

  const getFieldValue = (key: string) => {
    const found = selectedFields.find((f) => f.key === key);
    return found ? found.value : undefined;
  };

  const handleOpenModalCustomProperties = () => {
    const selectedKeys = selectedFields.map(f => f.key);
    setCheckedKeys(selectedKeys);
    setIsModalVisible(true);
  };

  const handleAcceptModal = () => {
    const newFields: Field[] = checkedKeys
      .filter(key => !selectedFields.some(f => f.key === key))
      .map(key => ({ key, value: '' }));
    setSelectedFields(prev => [...prev, ...newFields]);
    setIsModalVisible(false);
    setCheckedKeys([]);
  };

  return (
    <>
      <Form form={form}>
        <div className="section-card">
          <Typography.Title level={5}>Standard properties</Typography.Title>
          <Form.Item label="Enable assembly groups">
            <CustomSwitch
              checked={isChecked}
              onChange={() => {
                setChecked(!isChecked);
                updatePart({ 
                  variables: { 
                    input: { 
                      version_id: version.id, 
                      enable_assembly_groups: !isChecked,
                    },
                  },
                })
                  .then(() => toast.success("Enable assembly groups updated"))
                  .catch(() => toast.error("Failed to update assembly groups"));
              }}
              disabled={false}
            />
          </Form.Item>

          <Form.Item label="Customer Order Code" name="code">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <AutoSaveInput form={form} name="description" value={version?.description || ''} versionId={version?.id} versionCode={versionCode} refetch={refetch} />
          </Form.Item>

          <Form.Item label="Name" name="name">
            <AutoSaveInput form={form} name="name" value={version?.name || ''} versionId={version?.id} versionCode={versionCode} refetch={refetch} />
          </Form.Item>

          {(partType in FIELD_DEFINITIONS) && FIELD_DEFINITIONS[partType as keyof typeof FIELD_DEFINITIONS].map((field, index) => (
            <Form.Item key={index} label={field.label} name={field.name}>
              {field.type === 'input' ? (
                <AutoSaveInput
                  form={form}
                  name={field.name}
                  value={getFieldValue(field.name) || ''}
                  versionId={version?.id}
                  versionCode={versionCode}
                  isAdditional
                  dataType="string"
                  typeGroup="custom"
                  refetch={refetch}
                />
              ) : (
                <AutoSaveSelect
                  name={field.name}
                  value={getFieldValue(field.name) || ''}
                  versionId={version?.id}
                  versionCode={versionCode}
                  isAdditional
                  dataType="string"
                  typeGroup="custom"
                  options={field.options || []}
                />
              )}
            </Form.Item>
          ))}
        </div>
      </Form>

      <div style={{ margin: 30 }}>
        <CustomButton variant='white' icon={<PlusOutlined />} text='Manage Properties' onClick={handleOpenModalCustomProperties} />
      </div>

      <ModalCustomProperties open={isModalVisible} onClose={() => setIsModalVisible(false)} onAccept={handleAcceptModal} propertyGroups={propertyGroups} checkedKeys={checkedKeys} setCheckedKeys={setCheckedKeys} />
    </>
  );
};

export default Properties;
