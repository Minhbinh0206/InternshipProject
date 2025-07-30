import React, { useEffect, useMemo, useState } from 'react';
import { HomeOutlined, PlusOutlined, QuestionCircleFilled, QuestionCircleOutlined } from '@ant-design/icons';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import { type PartTypeMode } from '../../components/parts/FilterPartType/FilterPartType';
import { Col, Divider, Form, Input, Modal, Row, Select, Tooltip, Typography } from 'antd';
import './CreatePart.css';
import CustomSwitch from '../../components/common/CustomSwitch/CustomSwitch';
import CustomButton from '../../components/common/CustomButton/CustomButton';
import type PartType from '../../types/partType';
import { useQuery } from '@apollo/client';
import { GET_PART_TYPES, GET_PARTS } from '../../graphQL/partQueries';
import { useParams, useNavigate } from 'react-router-dom';
import { GET_PART_BY_ID } from '../../graphQL/partQueries';
import { useMutation } from '@apollo/client';
import { CREATE_PART } from '../../graphQL/partActions';
import { ADD_PART_TO_GROUP } from '../../graphQL/partActions';
import { toast } from 'react-toastify';

const { Option } = Select;

interface CreatePartProps {
    createModalVisible: (visible: boolean) => void;
    groupId?: string;
    hideHeader?: boolean;
}

const CreatePart: React.FC<CreatePartProps> = ({ createModalVisible, groupId, hideHeader = false }) => {
    const [addPartToGroup] = useMutation(ADD_PART_TO_GROUP);
    const [activeKey, setActiveKey] = useState('properties');
    const { data: typeData, loading: typeLoading } = useQuery(GET_PART_TYPES);
    const [mode] = useState<PartTypeMode>('detailed');
    const [isChecked, setChecked] = useState(false);
    const [selectedPartType, setSelectedPartType] = useState('Standard');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [selectedPartTypeId, setSelectedPartTypeId] = useState<string>('1');
    const { data: allPartsData } = useQuery(GET_PARTS);

    const [inputValue, setInputValue] = useState<string>('');
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();

    const { data: partData } = useQuery(GET_PART_BY_ID, {
        variables: { id },
        skip: !id,
    });

    const fetchedPartTypes: PartType[] =
        typeData?.types?.map((t: any) => ({
            id: t.id,
            value: t.name,
            label: t.name,
            desc: 'Some description here...'
        })) ?? [];

    const [createPart] = useMutation(CREATE_PART);

    const [form] = Form.useForm();

    useEffect(() => {
        if (id && partData?.getPartById) {
            const part = partData.getPartById;
            const version = part.selected_version;

            console.log('Part data:', part);

            setSelectedPartTypeId(part.selected_version.type.id);

            // Set form values
            form.setFieldsValue({
                name: version.name,
                customerCode: version.code,
                typeId: version.type.id,
                description: version.description,
                ...version.additional_fields?.reduce((acc: any, field: any) => {
                    acc[field.name] = field.value;
                    return acc;
                }, {}),
                enable_assembly_groups: version.enable_assembly_groups,
            });

            // Cập nhật type liên quan
            setSelectedPartType(part.selected_version.type.name);
            setChecked(part.selected_version.enable_assembly_groups);

            // Cập nhật các custom field
            setSelectedFields(
                version.additional_fields
                    ?.filter((f: any) => f.type_group === 'custom')
                    .map((f: any) => f.name) || []
            );
        }
    }, [partData, id]);

    const partTypeFieldConfig: Record<string, string[]> = {
        Led: ['LED Part No', 'Colour Temperature (K)'],
        'Optic set': ['LOR', 'Primary Beam Angle'],
        Engine: ['LED Lifetime', 'Maximum Drive Current (mA)', 'Minimum Drive Current (mA)'],
    };

    useEffect(() => {
        if (partData?.getPartById?.selected_version?.code && inputValue === '') {
            setInputValue(partData?.getPartById?.selected_version?.code);
        }
        console.log('Part data updated:', partData?.getPartById?.selected_version?.code);
        console.log('value:', inputValue);

    }, [partData]);

    const isDuplicateCode = useMemo(() => {
        if (!inputValue || !allPartsData?.parts) return false;

        return allPartsData.parts.some(
            (part: any) => part.code === inputValue
        );
    }, [inputValue, allPartsData]);


    const requiredFields = useMemo(() => {
        const baseFields = ['name', 'customerCode'];
        const ledFields = ['LED Part No', 'Colour Temperature (K)'];
        const opticSetFields = ['LOR', 'Primary Beam Angle'];

        if (selectedPartType === 'Led') {
            return [...baseFields, ...ledFields];
        }

        if (selectedPartType === 'Optic set') {
            return [...baseFields, ...opticSetFields];
        }

        return baseFields;
    }, [selectedPartType]);

    const formValues = Form.useWatch([], form);

    const isCreateDisabled = requiredFields.some(field => {
        const value = formValues?.[field];
        // Xử lý cho các trường dạng chuỗi
        if (typeof value === 'string') {
            return value.trim() === '';
        }

        // Xử lý cho các trường không phải chuỗi (số, object, v.v.)
        return value === undefined || value === null;
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
        {
            category: 'Ratings',
            fields: [
                { key: 'class', label: 'Class' },
            ],
        },
    ];

    const handleCreate = async () => {
        const partTypeExtraFields = partTypeFieldConfig[selectedPartType] || [];
        const customFields = selectedFields;
        const standardFields = partTypeExtraFields.filter(field => !selectedFields.includes(field));

        try {
            const values = await form.validateFields();
            const input = {
                name: values.name,
                type_id: selectedPartTypeId,
                code: values.customerCode,
                description: values.description,
                additional_fields: [...customFields, ...standardFields]
                    .filter(field => values[field] !== undefined && values[field] !== null)
                    .map(field => ({
                        name: field,
                        value: values[field].toString(),
                        type_group: customFields.includes(field) ? 'custom' : 'standard',
                    })),
                enable_assembly_groups: isChecked,
            };

            console.log(input);

            const { data } = await createPart({ variables: { input } });
            const createdPart = data?.createPart;

            if (createdPart?.id && createdPart?.latest_version_id) {
                // 👇 Add to group
                await addPartToGroup({
                    variables: {
                        input: [
                            {
                                group_id: groupId,
                                part_id: createdPart.id,
                                version_id: createdPart.latest_version_id,
                            }
                        ]
                    }
                });
                console.log('✅ Part added to group');
            }

            navigate(`/parts/modify/${createdPart.id}`);
            toast.success('Part created successfully');

            createModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('❌ Error creating or adding part:', error);
        }
    };

    useEffect(() => {
        if (selectedPartType === 'Luminaire') {
            setChecked(true);
        }
    }, [selectedPartType]);

    const handleAcceptModal = () => {
        setSelectedFields(prev =>
            Array.from(new Set([...prev, ...checkedKeys]))
        );

        setIsModalVisible(false);
        setCheckedKeys([]);
    };

    return (
        <>
            {!hideHeader &&
                (
                    id ? (
                        <PageHeader
                            title="Duplicate part"
                            breadcrumbs={
                                [
                                    { title: '', href: '/', icon: <HomeOutlined /> },
                                    { title: 'Parts', href: '/parts' },
                                    { title: 'Duplicate part' }
                                ]}
                            activeKey={activeKey}
                            onTabChange={setActiveKey}
                            mode={'modify'}
                            partTypes={fetchedPartTypes}
                            selectedPartType={typeLoading ? '...' : selectedPartType}
                            onSelectPartType={(typeName) => {
                                setSelectedPartType(typeName);
                                const found = fetchedPartTypes.find(t => t.value === typeName);
                                setSelectedPartTypeId(found?.id ?? '1');
                            }}

                        />
                    ) : (
                        <PageHeader
                            title="Create new part"
                            breadcrumbs={
                                [
                                    { title: '', href: '/', icon: <HomeOutlined /> },
                                    { title: 'Parts', href: '/parts' },
                                    { title: 'Create new part' }
                                ]}
                            activeKey={activeKey}
                            onTabChange={setActiveKey}
                            mode={mode}
                            partTypes={fetchedPartTypes}
                            selectedPartType={typeLoading ? '...' : selectedPartType}
                            onSelectPartType={(typeName) => {
                                setSelectedPartType(typeName);
                                const found = fetchedPartTypes.find(t => t.value === typeName);
                                setSelectedPartTypeId(found?.id ?? '1');
                            }}

                        />
                    )
                )
            }

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

                    <Form.Item label="Enable assembly groups (combination generator)" colon={false}>
                        <Row align="middle" gutter={16}>
                            <Col>
                                {selectedPartType === 'Luminaire' ? (
                                    <CustomSwitch checked={isChecked} onChange={() => { }} disabled />
                                ) : (
                                    <CustomSwitch checked={isChecked} onChange={() => setChecked(!isChecked)} disabled={!!id} />
                                )}
                            </Col>
                        </Row>
                    </Form.Item>

                    <Row gutter={24} align="top">
                        <Col span={12}>
                            <Form.Item
                                label="Customer Order Code"
                                name="customerCode"
                                validateStatus={
                                    isDuplicateCode ? 'error' : undefined
                                }
                                help={
                                    isDuplicateCode
                                        ? 'Value must be different from original part code'
                                        : undefined
                                }
                                hasFeedback
                                rules={[{ required: true, message: 'Please input the customer order code!' }]}
                            >
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Description" name="description">
                                <Input placeholder="Description" disabled={!!id} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Name" name="name" rules={[{ required: true }]} validateTrigger="onSubmit">
                        <Input placeholder="Part name" disabled={!!id} />
                    </Form.Item>

                    {selectedPartType === 'Optic set' ? (
                        <>
                            <Form.Item label="LOR" name="LOR" rules={[{ required: true }]} validateTrigger="onSubmit">
                                <Input placeholder="Enter LOR" disabled={!!id} />
                            </Form.Item>

                            <Form.Item label="Primary Beam Angle" name="Primary Beam Angle" rules={[{ required: true }]} validateTrigger="onSubmit">
                                <Input placeholder="Enter primary beam angle" disabled={!!id} />
                            </Form.Item>
                        </>
                    ) : selectedPartType === 'Led' ? (
                        <>
                            <Row gutter={20} align="top">
                                <Col span={5}>
                                    <Form.Item label="Colour Temperature (K)" name="Colour Temperature (K)" rules={[{ required: true }]} validateTrigger="onSubmit">
                                        <Select defaultValue="30000K" onChange={(value) => console.log(value)} disabled={!!id}>
                                            <Option value="27000K">2700K</Option>
                                            <Option value="30000K">3000K</Option>
                                            <Option value="40000K">4000K</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={19}>
                                    <Form.Item label="LED Part No" name="LED Part No" rules={[{ required: true }]} validateTrigger="onSubmit">
                                        <Input placeholder="..." disabled={!!id} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    ) : selectedPartType === 'Engine' ? (
                        <>
                            <Form.Item label="LED Lifetime" name="LED Lifetime">
                                <Input placeholder="..." disabled={!!id} />
                            </Form.Item>

                            <Form.Item label="Maximum Drive Current (mA)" name="Maximum Drive Current (mA)">
                                <Input placeholder="..." disabled={!!id} />
                            </Form.Item>

                            <Form.Item label="Minimum Drive Current (mA)" name="Minimum Drive Current (mA)">
                                <Input placeholder="..." disabled={!!id} />
                            </Form.Item>
                        </>
                    ) : (
                        <></>
                    )}


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
                                    label={propertyGroups
                                        .flatMap(group => group.fields)
                                        .find(f => f.key === fieldKey)?.label || fieldKey}
                                    name={fieldKey}
                                >
                                    {fieldKey === 'finish' ? (
                                        <Select placeholder="Select Finish" defaultValue='Black' disabled={!!id}>
                                            <Option value="B">Black</Option>
                                            <Option value="R">Red</Option>
                                            <Option value="Y">Yellow</Option>
                                        </Select>
                                    ) : (
                                        <Input placeholder={`Enter ${fieldKey}`} disabled={!!id} />
                                    )}
                                </Form.Item>
                            </Col>
                        ))}
                    </Row>


                </div>
            </Form>

            {
                !id && (
                    <div style={{ textAlign: 'start', margin: 30 }}>
                        <CustomButton
                            variant='white'
                            layout='iconFirst'
                            icon={<PlusOutlined />}
                            text='Manage Properties'
                            onClick={() => setIsModalVisible(true)}
                        />
                    </div>
                )
            }

            <div style={{ textAlign: 'start', margin: 30 }}>
                <CustomButton
                    variant='blue'
                    text={id ? 'Duplicate Part' : 'Create Part'}
                    layout='noIcon'
                    onClick={handleCreate}
                    disabled={!!(isCreateDisabled || isDuplicateCode)}
                />
            </div>


            <Modal
                title={<span className="modal-title">Manage properties</span>}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <div className='footer-modal'>
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

export default CreatePart;
