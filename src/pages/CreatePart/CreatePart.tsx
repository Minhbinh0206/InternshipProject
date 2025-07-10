import React, { useState } from 'react';
import { BarsOutlined, CloseOutlined, FileTextOutlined, HomeOutlined, LoadingOutlined, PlusOutlined, QuestionCircleFilled, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import { type PartTypeMode } from '../../components/parts/FilterPartType/FilterPartType';
import { Button, Col, Divider, Form, Input, Modal, Row, Select, Tooltip, Typography } from 'antd';
import './CreatePart.css';
import CustomSwitch from '../../components/common/CustomSwitch/CustomSwitch';
import CustomButton from '../../components/common/CustomButton/CustomButton';
import type PartType from '../../types/partType';

import type ActiveBarItem from '../../types/activeBarItem';
const { Option } = Select;

const CreatePart: React.FC = () => {
    const [activeKey, setActiveKey] = useState('properties');

    const partTypes: PartType[] = [
        { value: 'standard', label: 'Standard', desc: 'A Standard part with default properties and behaviour' },
        { value: 'optic-set', label: 'Optic set', desc: '...' },
        { value: 'led', label: 'Led', desc: '...' },
        { value: 'driver', label: 'Driver', desc: '...' },
        { value: 'luminaire', label: 'Luminaire', desc: '...' },
        { value: 'engine', label: 'Engine', desc: '...' },
        { value: 'optic', label: 'Optic', desc: '...' }
    ];

    const tabs: ActiveBarItem[] = [
        { key: 'properties', label: 'Properties', icon: <FileTextOutlined />, children: <div>Properties content</div> },
        { key: 'raw-data', label: 'Part raw data', icon: <SearchOutlined />, children: <div>Raw data content</div> },
        { key: 'assembler', label: 'Part assembler', icon: <BarsOutlined />, children: <div>Assembler contentaaa</div> },
        { key: 'supply', label: 'Supply chain', icon: <LoadingOutlined />, children: <div>Supply chain content</div> },
        { key: 'compatible', label: 'Part compatible', icon: <LoadingOutlined />, children: <div>Compatible content</div> },
    ];

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

    const [mode, setMode] = useState<PartTypeMode>('detailed');
    const [isChecked, setChecked] = useState(false);
    const [selectedPartType, setSelectedPartType] = useState('standard');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
    const [selectedFields, setSelectedFields] = useState<string[]>([]);

    const handleAcceptModal = () => {
        setSelectedFields(prev =>
            Array.from(new Set([...prev, ...checkedKeys]))
        );

        setIsModalVisible(false);
        setCheckedKeys([]);
    };


    return (
        <>

            <PageHeader
                title="Create new part"
                breadcrumbs={
                    [
                        { title: '', href: '/', icon: <HomeOutlined /> },
                        { title: 'Parts', href: '/parts' },
                        { title: 'Create new part' }
                    ]}
                tabs={tabs}
                activeKey={activeKey}
                onTabChange={setActiveKey}
                mode={mode}
                partTypes={partTypes}
                selectedPartType={selectedPartType}
                onSelectPartType={setSelectedPartType}
            />

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
                            {selectedPartType === 'luminaire' ? (
                                <CustomSwitch checked={true} onChange={() => setChecked(!isChecked)} disabled />
                            ) : (
                                <CustomSwitch checked={isChecked} onChange={() => setChecked(!isChecked)} />
                            )}
                        </Col>
                    </Row>
                </Form.Item>

                <Row gutter={24} align="top">
                    <Col span={10}>
                        <Form.Item label="Customer Order Code" name="customerCode" rules={[{ required: true }]}>
                            <Input placeholder="Enter unique code" />
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item label="Description" name="description">
                            <Input placeholder="Description" />
                        </Form.Item>
                    </Col>
                    <Col span={4} className="remove-btn">
                        <Button type="link" danger onClick={() => console.log('remove field')}>
                            Remove field <CloseOutlined />
                        </Button>
                    </Col>
                </Row>

                <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                    <Input placeholder="Part name" />
                </Form.Item>

                {selectedPartType === 'optic-set' ? (
                    <>
                        <Form.Item label="LOR" name="lor" rules={[{ required: true }]}>
                            <Input placeholder="Enter LOR" />
                        </Form.Item>

                        <Form.Item label="Primary Beam Angle" name="primary-beam-angle" rules={[{ required: true }]}>
                            <Input placeholder="Enter primary beam angle" />
                        </Form.Item>
                    </>
                ) : selectedPartType === 'led' ? (
                    <>
                        <Row gutter={20} align="top">
                            <Col span={5}>
                                <Form.Item label="Colour Temperature (K)" name="led-part-no" rules={[{ required: true }]}>
                                    <Select defaultValue="30000K" onChange={(value) => console.log(value)}>
                                        <Option value="27000K">2700K</Option>
                                        <Option value="30000K">3000K</Option>
                                        <Option value="40000K">4000K</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={19}>
                                <Form.Item label="LED Part No" name="led-part-no" rules={[{ required: true }]}>
                                    <Input placeholder="..." />
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                ) : selectedPartType === 'engine' ? (
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
                ) : (
                    <></>
                )}

                <Row gutter={32}>
                    {selectedFields.map((fieldKey, index) => (
                        <Col span={8} key={fieldKey}>
                            <Form.Item
                                label={propertyGroups
                                    .flatMap(group => group.fields)
                                    .find(f => f.key === fieldKey)?.label || fieldKey}
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

                <CustomButton
                    variant='white'
                    layout='iconFirst'
                    icon={<PlusOutlined />}
                    text='Manage Properties'
                    onClick={() => setIsModalVisible(true)}
                />
            </div>

            <div style={{ textAlign: 'start', margin: 30 }}>
                <CustomButton variant='gray' text='Create Part' layout='noIcon' />
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
