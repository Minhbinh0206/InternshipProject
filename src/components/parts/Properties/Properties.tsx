import React, { useMemo, useState, useEffect } from 'react';
import { Col, Divider, Form, Input, Row, Select, Tooltip, Typography, Modal } from 'antd';
import { QuestionCircleOutlined, PlusOutlined, QuestionCircleFilled } from '@ant-design/icons';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_PART } from '../../../graphQL/partActions';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../../pages/CreatePart/CreatePart.css';
import { GET_VERSION_BY_ID } from '../../../graphQL/versionQueries';

const { Option } = Select;

interface PropertiesProps {
  customerCode: string;
}

interface Field {
  key: string;
  value: string;
}

const Properties: React.FC<PropertiesProps> = ({ customerCode }) => {
  const [createPart] = useMutation(CREATE_PART);
  const navigation = useNavigate();
  const [searchParams] = useSearchParams();

  const [form] = Form.useForm();
  const [selectedPartType, setSelectedPartType] = useState('Standard');
  const [isChecked, setChecked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [versionId, setVersionId] = useState<number | null>(null);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [selectedPartTypeId, setSelectedPartTypeId] = useState<string | null>(null);

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
    if (customerCode) {
      form.setFieldsValue({
        customerCode: customerCode,
      });
    }
  }, [customerCode, form]);

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

  const getFieldLabel = (key: string): string => {
    return propertyGroups.flatMap(g => g.fields).find(f => f.key === key)?.label || key;
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const input = {
        name: values.name,
        type_id: selectedPartTypeId,
        code: values.customerCode,
        additional_fields: selectedFields.map((field) => ({
          key: field.key,
          value: values[field.key] || '',
        })),
        enable_assembly_groups: isChecked,
      };

      await createPart({ variables: { input } });
      navigation('/parts');
    } catch (error) {
      console.error('Error creating part:', error);
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
                name="customerCode"
                rules={[{ required: true }]}
                validateTrigger="onSubmit"
              >
                <Input disabled value={customerCode} />
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

          {selectedPartType === 'Optic set' && (
            <>
              <Form.Item label="LOR" name="lor" rules={[{ required: true }]} validateTrigger="onSubmit">
                <Input placeholder="Enter LOR" />
              </Form.Item>
              <Form.Item label="Primary Beam Angle" name="primary-beam-angle" rules={[{ required: true }]} validateTrigger="onSubmit">
                <Input placeholder="Enter primary beam angle" />
              </Form.Item>
            </>
          )}

          {selectedPartType === 'Led' && (
            <Row gutter={20} align="top">
              <Col span={5}>
                <Form.Item label="Colour Temperature (K)" name="led-temperature" rules={[{ required: true }]} validateTrigger="onSubmit">
                  <Select defaultValue="30000K">
                    <Option value="27000K">2700K</Option>
                    <Option value="30000K">3000K</Option>
                    <Option value="40000K">4000K</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={19}>
                <Form.Item label="LED Part No" name="led-part-no" rules={[{ required: true }]} validateTrigger="onSubmit">
                  <Input placeholder="..." />
                </Form.Item>
              </Col>
            </Row>
          )}

          {selectedPartType === 'Engine' && (
            <>
              <Form.Item label="LED Lifetime" name="led-lifetime">
                <Input placeholder="..." />
              </Form.Item>
              <Form.Item label="Maximum Drive Current (mA)" name="maximum-drive-current">
                <Input placeholder="..." />
              </Form.Item>
              <Form.Item label="Minimum Drive Current (mA)" name="minimum-drive-current">
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

          <Row gutter={32}>
            {selectedFields.map((field) => (
              <Col span={8} key={field.key}>
                <Form.Item
                  label={getFieldLabel(field.key)}
                  name={field.key}
                  initialValue={field.value}
                >
                  {field.key === 'finish' ? (
                    <Select placeholder="Select Finish" defaultValue={field.value || 'B'}>
                      <Option value="B">Black</Option>
                      <Option value="R">Red</Option>
                      <Option value="Y">Yellow</Option>
                    </Select>
                  ) : (
                    <Input placeholder={`Enter ${field.key}`} />
                  )}
                </Form.Item>
              </Col>
            ))}
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
