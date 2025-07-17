import React, { useMemo, useState, useEffect } from 'react';
import { Col, Divider, Form, Input, Row, Select, Tooltip, Typography, Modal } from 'antd';
import { QuestionCircleOutlined, PlusOutlined, QuestionCircleFilled } from '@ant-design/icons';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import type PartType from '../../../types/partType';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PART_TYPES } from '../../../graphQL/partQueries';
import { CREATE_PART } from '../../../graphQL/partActions';
import { useNavigate } from 'react-router-dom';
import '../../../pages/CreatePart/CreatePart.css';

const { Option } = Select;

interface PropertiesProps {
  customerCode: string;
}

const Properties: React.FC<PropertiesProps> = ({ customerCode }) => {
  const { data: typeData } = useQuery(GET_PART_TYPES);
  const [createPart] = useMutation(CREATE_PART);
  const navigation = useNavigate();

  const [form] = Form.useForm();
  const [selectedPartType, setSelectedPartType] = useState('Standard');
  const [isChecked, setChecked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedPartTypeId, setSelectedPartTypeId] = useState<string | null>(null);

  useEffect(() => {
    if (customerCode) {
      form.setFieldsValue({
        customerCode: customerCode,
      });
    }
  }, [customerCode, form]);

  const fetchedPartTypes: PartType[] =
    typeData?.types?.map((t: any) => ({
      id: t.id,
      value: t.name,
      label: t.name,
    })) ?? [];

  const requiredFields = useMemo(() => {
    const baseFields = ['name', 'customerCode'];
    return baseFields;
  }, [selectedPartType]);

  const formValues = Form.useWatch([], form);

  const isCreateDisabled = requiredFields.some(field => {
    const value = formValues?.[field];
    return !value || value.trim?.() === '';
  });

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
  ];

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const input = {
        name: values.name,
        type_id: selectedPartTypeId,
        code: values.customerCode,
        additional_fields: selectedFields.map((key) => ({
          key,
          value: values[key] || '',
        })),
        enable_assembly_groups: isChecked,
      };

      console.log('Create input:', input);
      await createPart({ variables: { input } });
    } catch (error) {
      console.error('Error creating part:', error);
    }
  };

  const handleAcceptModal = () => {
    setSelectedFields(prev =>
      Array.from(new Set([...prev, ...checkedKeys]))
    );
    setIsModalVisible(false);
    setCheckedKeys([]);
  };

  return (
    <>
      <Form form={form}>
        {/* ---------- STANDARD PROPERTIES ---------- */}
        <div className="section-card">
          <div className='title-container'>
            <Typography.Title level={5} className="section-title">
              Standard properties&nbsp;
            </Typography.Title>
            <Tooltip title="I don't know what to put in here.">
              <QuestionCircleOutlined style={{ fontSize: 14 }} />
            </Tooltip>
          </div>

          <Row gutter={16} style={{ marginBottom: 16, alignItems: "start" }}>
            <Col span={8}>
              <Form.Item label="Assembler SKU Code Pattern" style={{ marginBottom: 0 }}>
                <Select defaultValue="Unarmed code pattern" style={{ width: '100%' }}>
                  <Option value="Unarmed code pattern">Unarmed code pattern</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: 'flex', alignItems: 'end' }}>
              <CustomButton text="Regenerate code" disabled />
            </Col>
          </Row>

          <Row gutter={24} align="top">
            <Col span={12}>
              <Form.Item
                label="Customer Order Code"
                name="customerCode"
                rules={[{ required: true }]}
                validateTrigger="onSubmit"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Description" name="description">
                <Input placeholder="Description" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Name" name="name" rules={[{ required: true }]} validateTrigger="onSubmit">
            <Input placeholder="Part name" />
          </Form.Item>

          {/* Part Type Specific Fields */}
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
            <>
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
            </>
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

        {/* ---------- INHERITED PROPERTIES ---------- */}
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

        {/* ---------- CUSTOM PROPERTIES ---------- */}
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
            {selectedFields.map((fieldKey) => (
              <Col span={8} key={fieldKey}>
                <Form.Item
                  label={propertyGroups.flatMap(g => g.fields).find(f => f.key === fieldKey)?.label || fieldKey}
                  name={fieldKey}
                >
                  {fieldKey === 'finish' ? (
                    <Select placeholder="Select Finish" defaultValue='Black'>
                      <Option value="B">Black</Option>
                      <Option value="R">Red</Option>
                      <Option value="Y">Yellow</Option>
                    </Select>
                  ) : (
                    <Input placeholder={`Enter ${fieldKey}`} />
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

      {/* ---------- MODAL ---------- */}
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
