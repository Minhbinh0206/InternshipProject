import React, { useState, useEffect } from 'react';
import { Col, Divider, Form, Input, Row, Select, Tooltip, Typography, Modal, message } from 'antd';
import { QuestionCircleOutlined, PlusOutlined, QuestionCircleFilled } from '@ant-design/icons';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import { useQuery, useMutation } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import { UPDATE_PART } from '../../../graphQL/versionActions';
import '../../../pages/CreatePart/CreatePart.css';
import { GET_VERSION_BY_ID } from '../../../graphQL/versionQueries';
import type PartType from '../../../types/partType';
import { GET_PART_TYPES } from '../../../graphQL/partQueries';

const { Option } = Select;

interface PropertiesProps {
  code: string;
  partType: string;
}

interface Field {
  key: string;
  value: string;
}

const Properties: React.FC<PropertiesProps> = ({ code, partType }) => {
  const [searchParams] = useSearchParams();

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [versionId, setVersionId] = useState<number | null>(null);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const { data: typeData } = useQuery(GET_PART_TYPES);
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [updatePart] = useMutation(UPDATE_PART);

  const fetchedPartTypes: PartType[] =
    typeData?.types?.map((t: any) => ({
      id: t.id,
      value: t.name,
      label: t.name,
      desc: 'Some description here...'
    })) ?? [];

  useEffect(() => {
    const currentVersionId = searchParams.get("versionId");
    if (currentVersionId) {
      setVersionId(Number(currentVersionId));
    }
  }, [searchParams]);

  const { data, loading, error } = useQuery(GET_VERSION_BY_ID, {
    variables: { id: versionId },
    skip: !versionId,
  });

  useEffect(() => {
    console.log('versionId:', versionId);
    console.log('loading:', loading);
    console.log('error:', error);
    console.log('versionData:', data);
  }, [loading, error, data]);

  useEffect(() => {
    if (code) {
      form.setFieldsValue({
        code: code,
      });
    }
  }, [code, form]);

  useEffect(() => {
    const fields = data?.getVersion?.additional_fields;
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
  }, [data]);

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

  const handleConfirmEdit = async () => {
    try {
      const values = await form.validateFields();

      if (!versionId) {
        message.error('Không có versionId hợp lệ');
        return;
      }

      const { name, description, code, ...rest } = values;

      const additional_fields = Object.entries(rest).map(([key, value]) => ({
        name: key,
        value: String(value),
        data_type: typeof value === 'number' ? 'number' : 'string',
        type_group: 'custom',
      }));

      const matchedType = fetchedPartTypes.find((type) => type.label === partType);

      if (!matchedType) {
        message.error('Không tìm thấy type_id tương ứng với partType');
        return;
      }

      const input = {
        version_id: versionId,
        name,
        description,
        code,
        type_id: parseInt(matchedType.id, 10),
        additional_fields,
      };

      const res = await updatePart({
        variables: { input },
      });

      message.success('Cập nhật thành công!');
      window.location.reload();
      console.log('Response updatePart:', res);
    } catch (err: any) {
      console.error('Lỗi cập nhật:', err);
      message.error('Cập nhật thất bại!');
    }
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
    const fields = data?.getVersion?.additional_fields;
    const versionName = data?.getVersion?.name;
    const description = data?.getVersion?.description;

    console.log(fields);

    const initialValues: Record<string, string> = {};

    if (fields && Array.isArray(fields)) {
      fields.forEach(f => {
        initialValues[f.name] = f.value;
      });
    }

    if (versionName) {
      initialValues.name = versionName;
    }

    if (description) {
      initialValues.description = description;
    }

    form.setFieldsValue(initialValues);
  }, [data]);

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
                <Input disabled value={code} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Description" name="description">
                <Input placeholder="Description" value={data?.getVersion?.des} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Name" name="name" rules={[{ required: true }]} validateTrigger="onSubmit">
            <Input placeholder="Part name" value={data?.getVersion?.name} />
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
