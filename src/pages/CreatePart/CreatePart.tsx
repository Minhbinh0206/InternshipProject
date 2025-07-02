import React, { useState } from 'react';
import { BarsOutlined, CloseOutlined, FileTextOutlined, HomeOutlined, LoadingOutlined, PlusOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import PageHeader from '../../components/PageHeader/PageHeader';
import { type PartTypeMode } from '../../components/FilterPartType/FilterPartType';
import { Button, Col, Divider, Form, Input, Row, Tooltip, Typography } from 'antd';
import './CreatePart.css';
import CustomSwitch from '../../components/CustomSwitch/CustomSwitch';
import CustomButton from '../../components/CustomButton/CustomButton';

export interface ActiveBarItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

const CreatePart: React.FC = () => {
    const [activeKey, setActiveKey] = useState('properties');

    const tabs: ActiveBarItem[] = [
        { key: 'properties', label: 'Properties', icon: <FileTextOutlined />, children: <div>Properties content</div> },
        { key: 'raw-data', label: 'Part raw data', icon: <SearchOutlined />, children: <div>Raw data content</div> },
        { key: 'assembler', label: 'Part assembler', icon: <BarsOutlined />, children: <div>Assembler contentaaa</div> },
        { key: 'supply', label: 'Supply chain', icon: <LoadingOutlined />, children: <div>Supply chain content</div> },
        { key: 'compatible', label: 'Part compatible', icon: <LoadingOutlined />, children: <div>Compatible content</div> },
    ];

    const [mode, setMode] = useState<PartTypeMode>('detailed');
    const [isChecked, setChecked] = useState(false);

    return (
        <>
            <PageHeader
                title="Create new part"
                breadcrumbs={[
                    { title: '', href: '/', icon: <HomeOutlined /> },
                    { title: 'Parts', href: '/parts' },
                    { title: 'Create new part' }
                ]}
                tabs={tabs}
                activeKey={activeKey}
                onTabChange={setActiveKey}
                mode={mode}
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
                            <CustomSwitch checked={isChecked} onChange={() => setChecked(!isChecked)} />
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

                <CustomButton variant='white' layout='iconFirst' icon={<PlusOutlined />} text='Manage Properties'/>
            </div>
        </>
    );
};

export default CreatePart;
