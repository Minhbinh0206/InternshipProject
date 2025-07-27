import React, { useState, useEffect } from 'react';
import { Col, Divider, Form, Input, Row, Select, Tooltip, Typography, Modal, message } from 'antd';
import { QuestionCircleOutlined, PlusOutlined, QuestionCircleFilled } from '@ant-design/icons';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import { useQuery, useMutation } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import { UPDATE_PART } from '../../../graphQL/versionActions';
import '../../../pages/CreatePart/CreatePart.css';
import type PartType from '../../../types/partType';
import { GET_PART_TYPES } from '../../../graphQL/partQueries';
import { UPDATE_STANDARD_FIELD } from '../../../graphQL/versionActions';
import { GET_VERSION_BY_CODE } from '../../../graphQL/versionQueries';

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
  console.log('Properties component rendered with:', { id, revisionId, versionCode });

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const { data: typeData } = useQuery(GET_PART_TYPES);
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [updateStandardField] = useMutation(UPDATE_STANDARD_FIELD);

  // Get version data by versionCode (if exists)
  const { data: versionData } = useQuery(GET_VERSION_BY_CODE, {
    variables: {
      input: {
        partId: Number(id),
        revisionId: Number(revisionId),
        versionCode: versionCode,
      },
    },
    skip: !id || !revisionId || !versionCode,
  });

  const version = versionData?.getVersionByVersionCode;
  const partType = version?.type?.name || '';

  useEffect(() => {
    const fields = version?.additional_fields;
    console.log('Fields from version:', fields);

    if (fields && Array.isArray(fields)) {
      const transformed = fields.map((f: any) => ({
        key: f.name,
        value: f.value,
      }));
      setSelectedFields(transformed);
      const initialValues: Record<string, string> = {};
      transformed.forEach(f => {
        initialValues[f.key] = f.value;
      });
      form.setFieldsValue(initialValues);
    }
  }, [versionData]);

  const propertyGroups = [
    {
      category: 'Design',
      fields: [
        { key: 'finish', label: 'Finish' },
        { key: 'material', label: 'Material' },
      ],
    },
    {
      category: 'Dimensions',
      fields: [
        { key: 'height', label: 'Height' },
        { key: 'length', label: 'Length' },
        { key: 'width', label: 'Width' },
      ],
    },
    {
      category: 'Ratings',
      fields: [
        { key: 'class', label: 'Class' },
      ],
    },
  ];

  const standardKeys = propertyGroups.flatMap(g => g.fields.map(f => f.key));

  const standardFields = selectedFields.filter(f => standardKeys.includes(f.key));
  const customFields = selectedFields.filter(f => !standardKeys.includes(f.key));

  const getFieldValue = (key: string) => {
    const found = customFields.find((f) => f.key === key);
    return found ? found.value : undefined;
  };

  const handleAcceptModal = () => {
    const newFields: Field[] = checkedKeys
      .filter(key => !selectedFields.some(f => f.key === key))
      .map(key => ({ key, value: '' }));
    setSelectedFields(prev => [...prev, ...newFields]);
    setIsModalVisible(false);
    setCheckedKeys([]);
  };

  useEffect(() => {
    if (versionData?.getVersionByVersionCode) {
      const version = versionData.getVersionByVersionCode;

      form.setFieldsValue({
        name: version.name,
        code: version.code,
        description: version.description,
        ...version.additional_fields?.reduce((acc: any, field: any) => {
          acc[field.name] = field.value;
          return acc;
        }, {}),
      });

      const allFields: Field[] = version.additional_fields?.map((f: any) => ({
        key: f.name,
        value: f.value,
      })) || [];

      setSelectedFields(allFields);
    }
  }, [versionData]);

  return (
    <>
      <Form form={form}>
        <div className="section-card">
          <div className='title-container'>
            <Typography.Title level={5} className="section-title">
              Standard properties&nbsp;
            </Typography.Title>
            <Tooltip title="I don't know what to put in here.">
              <QuestionCircleOutlined style={{ fontSize: 14 }} />
            </Tooltip>
          </div>

          <Row gutter={24} align="top">
            <Col span={12}>
              <Form.Item
                label="Customer Order Code"
                name="code"
                rules={[{ required: true }]}
                validateTrigger="onSubmit"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Description" name="description">
                <Input
                  placeholder="Description"
                  onBlur={(e) => {
                    const value = e.target.value;
                    updateStandardField({
                      variables: {
                        input: {
                          part_id: Number(id),
                          revision_id: Number(revisionId),
                          version_code: versionCode,
                          data: value,
                          field: 'description',
                        },
                      },
                    })
                      .then(() => message.success('Description updated'))
                      .catch(() => message.error('Update failed'));
                  }}
                />
              </Form.Item>

            </Col>
          </Row>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true }]}
            validateTrigger="onSubmit"
          >
            <Input
              placeholder="Part name"
              onBlur={(e) => {
                const value = e.target.value;
                updateStandardField({
                  variables: {
                    input: {
                      part_id: Number(id),
                      revision_id: Number(revisionId),
                      version_code: versionCode,
                      data: value,
                      field: 'name',
                    },
                  },
                })
                  .then(() => {
                    message.success('Name updated successfully');
                  })
                  .catch((error) => {
                    console.error('GraphQL update error:', error);
                    message.error(error.message || 'Failed to update name');
                  });

              }}
            />
          </Form.Item>

          {partType === 'Optic set' && (
            <>
              <Form.Item
                label="LOR"
                name="LOR"
                initialValue={getFieldValue('LOR')}
                rules={[{ required: true }]}
                validateTrigger="onSubmit"
              >
                <Input placeholder="Enter LOR" />
              </Form.Item>
              <Form.Item
                label="Primary Beam Angle"
                name="Primary Beam Angle"
                initialValue={getFieldValue('Primary Beam Angle')}
                rules={[{ required: true }]}
                validateTrigger="onSubmit"
              >
                <Input placeholder="Enter primary beam angle" />
              </Form.Item>
            </>
          )}

          {partType === 'Led' && (
            <Row gutter={20} align="top">
              <Col span={5}>
                <Form.Item
                  label="Colour Temperature (K)"
                  name="Colour Temperature (K)"
                  initialValue={getFieldValue('Colour Temperature (K)')}
                  rules={[{ required: true }]}
                  validateTrigger="onSubmit"
                >
                  <Select>
                    <Option value="27000K">2700K</Option>
                    <Option value="30000K">3000K</Option>
                    <Option value="40000K">4000K</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={19}>
                <Form.Item
                  label="LED Part No"
                  name="LED Part No"
                  initialValue={getFieldValue('LED Part No')}
                  rules={[{ required: true }]}
                  validateTrigger="onSubmit"
                >
                  <Input placeholder="..." />
                </Form.Item>
              </Col>
            </Row>
          )}

          {partType === 'Engine' && (
            <>
              <Form.Item
                label="LED Lifetime"
                name="LED Lifetime"
                initialValue={getFieldValue('LED Lifetime')}
              >
                <Input placeholder="..." />
              </Form.Item>
              <Form.Item
                label="Maximum Drive Current (mA)"
                name="Maximum Drive Current (mA)"
                initialValue={getFieldValue('Maximum Drive Current (mA)')}
              >
                <Input placeholder="..." />
              </Form.Item>
              <Form.Item
                label="Minimum Drive Current (mA)"
                name="Minimum Drive Current (mA)"
                initialValue={getFieldValue('Minimum Drive Current (mA)')}
              >
                <Input placeholder="..." />
              </Form.Item>
            </>
          )}

        </div>

        <Divider />

        <div className="custom-section">
          <div className='title-container'>
            <Typography.Title level={5} className="custom-section-title">
              Inherited properties&nbsp;
            </Typography.Title>
            <Tooltip title="I don't know what to put in here.">
              <QuestionCircleOutlined style={{ fontSize: 14 }} />
            </Tooltip>
          </div>
        </div>

        <Divider />

        <div className="custom-section">
          <div className='title-container'>
            <Typography.Title level={5} className="custom-section-title">
              Custom properties&nbsp;
            </Typography.Title>
            <Tooltip title="I don't know what to put in here.">
              <QuestionCircleOutlined style={{ fontSize: 14 }} />
            </Tooltip>
          </div>

          <Row gutter={[32, 16]}>
            {propertyGroups.map(group => {
              const groupFields = group.fields.filter(f =>
                standardFields.find(sf => sf.key === f.key)
              );

              if (groupFields.length === 0) return null;

              return groupFields.map(field => {
                const matchedField = standardFields.find(f => f.key === field.key);
                if (!matchedField) return null;

                return (
                  <Col span={8} key={field.key}>
                    <Form.Item
                      label={field.label}
                      name={field.key}
                      initialValue={matchedField.value}
                    >
                      {field.key === 'finish' ? (
                        <Select
                          placeholder="Select Finish"
                          defaultValue={matchedField.value || 'B'}
                        >
                          <Option value="B">Black</Option>
                          <Option value="R">Red</Option>
                          <Option value="Y">Yellow</Option>
                        </Select>
                      ) : (
                        <Input placeholder={`Enter ${field.label}`} />
                      )}
                    </Form.Item>
                  </Col>
                );
              });
            })}
          </Row>
        </div>
      </Form>

      <div style={{ textAlign: 'start', margin: 30 }}>
        <CustomButton
          variant='white'
          layout='iconFirst'
          icon={<PlusOutlined />}
          text='Manage Properties'
          onClick={() => setIsModalVisible(true)}
        />
      </div>

      <Modal
        title={<span className="modal-title">Manage properties</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <div className='footer-modal' key="footer">
            <CustomButton className='button-modal' variant='blue' layout='noIcon' text='Accept' onClick={handleAcceptModal} />
            <CustomButton className='button-modal' variant='white' layout='noIcon' text='Cancel' onClick={() => setIsModalVisible(false)} />
          </div>
        ]}
        width={1000}
        className="manage-properties-modal"
      >
        <Typography.Title level={5} className="custom-properties-title">
          <span>Custom properties</span>&nbsp;
          <Tooltip title="I don't know what to put in here.">
            <QuestionCircleFilled style={{ fontSize: 14 }} />
          </Tooltip>
        </Typography.Title>

        <Row gutter={32}>
          {propertyGroups.map(group => (
            <Col span={8} key={group.category}>
              <div className="category-title">{group.category}</div>
              {group.fields.map(f => (
                <label key={f.key} className="field-row">
                  <input
                    type="checkbox"
                    checked={checkedKeys.includes(f.key)}
                    onChange={e => {
                      setCheckedKeys(prev =>
                        e.target.checked
                          ? [...prev, f.key]
                          : prev.filter(k => k !== f.key)
                      );
                    }}
                  />
                  <span className="field-label">{f.label}</span>
                </label>
              ))}
            </Col>
          ))}
        </Row>
      </Modal>
    </>
  );
};

export default Properties;
