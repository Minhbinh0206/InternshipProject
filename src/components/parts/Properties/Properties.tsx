import React, { useState, useEffect } from 'react';
import { Col, Divider, Form, Input, Row, Select, Tooltip, Typography, Modal } from 'antd';
import { QuestionCircleOutlined, PlusOutlined, QuestionCircleFilled } from '@ant-design/icons';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import { useQuery, useMutation } from '@apollo/client';
import { UPDATE_PART } from '../../../graphQL/versionActions';
import '../../../pages/CreatePart/CreatePart.css';
import { GET_VERSION_BY_CODE } from '../../../graphQL/versionQueries';
import AutoSaveInput from '../OnblurProcessing/AutoSaveInput';
import AutoSaveSelect from '../OnblurProcessing/AutoSaveSelect';
import { toast } from 'react-toastify';
import CustomSwitch from '../../common/CustomSwitch/CustomSwitch';
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
  console.log('Properties component rendered with:', { id, revisionId, versionCode });

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [updatePart] = useMutation(UPDATE_PART)
  const [isChecked, setChecked] = useState(false);

  // Get version data by versionCode (if exists)
  const { data: versionData, refetch } = useQuery(GET_VERSION_BY_CODE, {
    variables: {
      input: {
        partId: Number(id),
        revisionId: Number(revisionId),
        versionCode: versionCode,
      },
    },
    skip: !id || !revisionId || !versionCode,
  });

  useEffect(() => {
    console.log("DEBUG - versionData after update:", versionData);
  }, [versionData]);


  useEffect(() => {
    if (versionData?.getVersionByVersionCode) {
      const version = versionData.getVersionByVersionCode;
      setChecked(version.enable_assembly_groups);
    }
  }, [versionData]);

  // useEffect(() => {
  //   if (version) {
  //     setChecked(version.enable_assembly_groups);
  //   }
  // }, [version]);


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

          <Form.Item label="Enable assembly groups (combination generator)" colon={false}>
            <Row align="middle" gutter={16}>
              <Col>
                {version?.enable_assembly_groups ? (
                  <CustomSwitch checked={isChecked} onChange={() => { }} disabled />
                ) : (
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
                        .catch((err) => {
                          console.error(err);
                          toast.error("Failed to update assembly groups");
                        })
                    }}
                    disabled
                  />
                )}
              </Col>
            </Row>

          </Form.Item>

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
                <AutoSaveInput name="description" value={version?.description || ''} versionId={version?.id} refetch={refetch} />
              </Form.Item>
            </Col>

          </Row>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true }]}
            validateTrigger="onSubmit"
          >
            <AutoSaveInput name="name" value={version?.name || ''} versionId={version?.id} refetch={refetch} />
          </Form.Item>

          {(partType in FIELD_DEFINITIONS) && FIELD_DEFINITIONS[partType as keyof typeof FIELD_DEFINITIONS].map((field, index) => (
            <Form.Item
              key={index}
              label={field.label}
              name={field.name}
              initialValue={getFieldValue(field.name)}
              rules={[{ required: field.rule }]}
              validateTrigger="onSubmit"
            >
              {field.type === 'input' ? (
                <AutoSaveInput
                  name={field.name}
                  value={getFieldValue(field.name) || ''}
                  versionId={version?.id}
                  isAdditional={true}
                  dataType="string"
                  typeGroup="custom"
                  refetch={refetch}
                />
              ) : (
                <AutoSaveSelect
                  name={field.name}
                  value={getFieldValue(field.name) || ''}
                  versionId={version?.id}
                  isAdditional={true}
                  dataType="string"
                  typeGroup="custom"
                  options={field.options || []}
                />
              )}
            </Form.Item>
          ))}


          {/* {partType === 'Optic set' && (
            <>
              <Form.Item
                label="LOR"
                name="lor"
                initialValue={getFieldValue('lor')}
                rules={[{ required: true }]}
                validateTrigger="onSubmit"
              >
          <AutoSaveInput
            name="lor"
            value={getFieldValue('lor') || ''}
            versionId={version?.id}
            isAdditional={true}
            dataType="string"
            typeGroup="custom"
            refetch={refetch}
          />
        </Form.Item>
        <Form.Item
          label="Primary Beam Angle"
          name="primary Beam Angle"
          initialValue={getFieldValue('primary Beam Angle')}
          rules={[{ required: true }]}
          validateTrigger="onSubmit"
        >
          <AutoSaveInput
            name="primary Beam Angle"
            value={getFieldValue('primary Beam Angle') || ''}
            versionId={version?.id}
            isAdditional={true}
            dataType="string"
            typeGroup="custom"
            refetch={refetch}
          />
        </Form.Item>
      </>
          )}

      {partType === 'Led' && (
        <Row gutter={20} align="top">
          <Col span={5}>
            <Form.Item
              label="Colour Temperature (K)"
              name="colour Temperature"
              initialValue={getFieldValue('colour Temperature')}
              rules={[{ required: true }]}
              validateTrigger="onSubmit"
            >
              <AutoSaveSelect
                name="colour Temperature"
                value={getFieldValue('colour Temperature') || ''}
                versionId={version?.id}
                isAdditional={true}
                dataType="string"
                typeGroup="custom"
                options={[
                  { label: '2700K', value: '27000K' },
                  { label: '3000K', value: '30000K' },
                  { label: '4000K', value: '40000K' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={19}>
            <Form.Item
              label="LED Part No"
              name="led Part No"
              initialValue={getFieldValue('led Part No')}
              rules={[{ required: true }]}
              validateTrigger="onSubmit"
            >
              <AutoSaveInput
                name="led Part No"
                value={getFieldValue('led Part No') || ''}
                versionId={version?.id}
                isAdditional={true}
                dataType="string"
                typeGroup="custom"
                refetch={refetch}
              />
            </Form.Item>
          </Col>
        </Row>
      )}

      {partType === 'Engine' && (
        <>
          <Form.Item
            label="LED Lifetime"
            name="led Lifetime"
            initialValue={getFieldValue('led Lifetime')}
          >
            <AutoSaveInput
              name="led Lifetime"
              value={getFieldValue('led Lifetime') || ''}
              versionId={version?.id}
              isAdditional={true}
              dataType="string"
              typeGroup="custom"
              refetch={refetch}
            />
          </Form.Item>
          <Form.Item
            label="Maximum Drive Current (mA)"
            name="maximum Drive Current"
            initialValue={getFieldValue('maximum Drive Current')}
          >
            <AutoSaveInput
              name="maximum Drive Current"
              value={getFieldValue('maximum Drive Current') || ''}
              versionId={version?.id}
              isAdditional={true}
              dataType="string"
              typeGroup="custom"
              refetch={refetch}
            />
          </Form.Item>
          <Form.Item
            label="Minimum Drive Current (mA)"
            name="minimum Drive Current"
            initialValue={getFieldValue('minimum Drive Current')}
          >
            <AutoSaveInput
              name="minimum Drive Current"
              value={getFieldValue('minimum Drive Current') || ''}
              versionId={version?.id}
              isAdditional={true}
              dataType="string"
              typeGroup="custom"
              refetch={refetch}
            />
          </Form.Item>
        </>
      )} */}

        </div >

        <Divider />

        {/* <div className="custom-section">
          <div className='title-container'>
            <Typography.Title level={5} className="custom-section-title">
              Inherited properties&nbsp;
            </Typography.Title>
            <Tooltip title="I don't know what to put in here.">
              <QuestionCircleOutlined style={{ fontSize: 14 }} />
            </Tooltip>
          </div>
        </div>

        <Divider /> */}

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
                          onChange={(value) => {
                            updatePart({
                              variables: {
                                input: {
                                  version_id: version?.id,
                                  additional_fields: [
                                    {
                                      name: field.key,
                                      value,
                                      data_type: 'string',
                                      type_group: 'custom',
                                    },
                                  ],
                                },
                              },
                            })
                              .then(() => toast.success(`${field.label} updated`))
                              .catch(() => toast.error(`Failed to update ${field.label}`));
                          }}
                        >
                          <Option value="B">Black</Option>
                          <Option value="R">Red</Option>
                          <Option value="Y">Yellow</Option>
                        </Select>
                      ) : (
                        // <Input placeholder={`Enter ${field.label}`} />
                        <AutoSaveInput
                          name={field.key}
                          value={matchedField.value || ''}
                          versionId={version?.id}
                          isAdditional={true}
                          dataType="string"
                          typeGroup="custom"
                        />
                      )}
                    </Form.Item>
                  </Col>
                );
              });
            })}
          </Row>
        </div>
      </Form >

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
