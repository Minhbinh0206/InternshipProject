import React, { useState } from 'react';
import { Checkbox, Input, Typography, Row, Col, Space } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    InfoCircleOutlined,
    CloseOutlined,
    CheckOutlined,
} from '@ant-design/icons';
import './CodeBuilder.css';
import CustomButton from '../../common/CustomButton/CustomButton';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CodeBuilder: React.FC = () => {
    const [code, setCode] = useState('{this.productCode}');
    const [isDefault, setIsDefault] = useState(false);

    return (
        <div className="cb-wrapper" style={{ margin: 0 }}>
            <Title level={5} className="cb-heading">
                Code builder
            </Title>
            <div className="cb-box">
                <Row justify="space-between" align="middle">
                    <Col>
                        <Text strong className="cb-pattern-name">Unnamed code pattern</Text>

                        <Space className='cb-pattern-button'>
                            <CustomButton variant='black' layout='iconFirst' icon={<EditOutlined />} text='Rename code pattern' />
                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <Checkbox
                                checked={isDefault}
                                onChange={(e) => setIsDefault(e.target.checked)}
                                className='checkbox'
                            >
                                Is default for new outcomes
                            </Checkbox>

                            <CustomButton variant='red' layout='iconFirst' icon={<CloseOutlined />} text='Remove code pattern' />
                        </Space>
                    </Col>
                </Row>

                <div className="cb-editor-block">
                    <Text strong>Code editor</Text>
                    <TextArea
                        rows={4}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>

                <Row justify="space-between" className="cb-action-bar">
                    <Col>
                        <Space>
                            <CustomButton variant='blue' layout='iconFirst' icon={<PlusOutlined />} text='Browse and add properties' />
                            <CustomButton variant='blue' layout='iconFirst' icon={<InfoCircleOutlined />} text='Validate' />
                        </Space>
                    </Col>
                    <Col>
                        <CustomButton disabled variant='gray' layout='iconFirst' icon={<CheckOutlined />} text='Bulk update occurrences' />
                    </Col>
                </Row>
            </div>
            <div className="cb-create-new">
                <CustomButton variant='blue' layout='iconFirst' icon={<PlusOutlined />} text='Create new code pattern' />
            </div>
        </div>
    );
};

export default CodeBuilder;
