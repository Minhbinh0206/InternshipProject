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
  console.log('Properties component rendered with:', { id, revisionId, versionCode });

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

  // useEffect(() => {
  //   console.log("DEBUG - versionData after update:", versionData);
  // }, [versionData]);


  // useEffect(() => {
  //   if (versionData?.getVersionByVersionCode) {
  //     const version = versionData.getVersionByVersionCode;
  //     setChecked(version.enable_assembly_groups);
  //   }
  // }, [versionData]);


  const version = versionData?.getVersionByVersionCode;
  const partType = version?.type?.name || '';

  useEffect(() => {
  //   const version = versionData?.getVersionByVersionCode;
  //   if (!version) return;

  //   const fields = version?.additional_fields;
  //   console.log('Fields from version:', fields);

  //   if (fields && Array.isArray(fields)) {
  //     const transformed = fields.map((f: any) => ({
  //       key: f.name,
  //       value: f.value,
  //     }));
  //     setSelectedFields(transformed);
  //     const initialValues: Record<string, string> = {};
  //     transformed.forEach(f => {
  //       initialValues[f.key] = f.value;
  //     });
  //     form.setFieldsValue(initialValues);
  //   }
  // }, [versionData]);
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
    // const found = customFields.find((f) => f.key === key);
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


  // useEffect(() => {
  //   if (!versionData?.getVersionByVersionCode) return;

  //   const version = versionData.getVersionByVersionCode;

  //   form.setFieldsValue({
  //     name: version.name,
  //     code: version.code,
  //     description: version.description,
  //     ...version.additional_fields?.reduce((acc: any, field: any) => {
  //       acc[field.name] = field.value;
  //       return acc;
  //     }, {}),
  //   });

  //   setSelectedFields(
  //     version.additional_fields?.map((f: any) => ({
  //       key: f.name,
  //       value: f.value,
  //     })) || []
  //   );
  // }, [versionData]);

  // useEffect(() => {
  //   if (versionData?.getVersionByVersionCode) {
  //     const version = versionData.getVersionByVersionCode;

  //     form.setFieldsValue({
  //       name: version.name,
  //       code: version.code,
  //       description: version.description,
  //       ...version.additional_fields?.reduce((acc: any, field: any) => {
  //         acc[field.name] = field.value;
  //         return acc;
  //       }, {}),
  //     });

  //     const allFields: Field[] = version.additional_fields?.map((f: any) => ({
  //       key: f.name,
  //       value: f.value,
  //     })) || [];

  //     // setSelectedFields(allFields);
  //     setSelectedFields(prev => {
  //       const merge = [...prev];
  //       allFields.forEach(newField => {
  //         const idx = merge.findIndex(f => f.key === newField.key);
  //         if (idx >= 0) merge[idx] = newField;
  //         else merge.push(newField)
  //       })
  //       return merge;
  //     })
  //   }
  // }, [versionData]);

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
                <AutoSaveInput form={form} name="description" value={version?.description || ''} versionId={version?.id} versionCode={versionCode} refetch={refetch} />
              </Form.Item>
            </Col>

          </Row>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true }]}
            validateTrigger="onSubmit"
          >
            <AutoSaveInput form={form} name="name" value={version?.name || ''} versionId={version?.id} versionCode={versionCode} refetch={refetch} />
          </Form.Item>

          {(partType in FIELD_DEFINITIONS) && FIELD_DEFINITIONS[partType as keyof typeof FIELD_DEFINITIONS].map((field, index) => (
            <Form.Item
              key={index}
              label={field.label}
              name={field.name}
              // initialValue={getFieldValue(field.name)}
              rules={[{ required: field.rule }]}
              validateTrigger="onSubmit"
            >
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
                          // defaultValue={matchedField.value || 'B'}
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
          onClick={handleOpenModalCustomProperties}
        />
      </div>

      <ModalCustomProperties
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAccept={handleAcceptModal}
        propertyGroups={propertyGroups}
        checkedKeys={checkedKeys}
        setCheckedKeys={setCheckedKeys}
      />
    </>
  );
};

export default Properties;
