import React, { useRef, useState } from 'react';
import {
    Checkbox,
    Input,
    Typography,
    Row,
    Col,
    Space,
    Alert,
    Modal,
    Select,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    InfoCircleOutlined,
    CloseOutlined,
    CheckOutlined,
} from '@ant-design/icons';
import './CodeBuilder.css';
import CustomButton from '../../common/CustomButton/CustomButton';
import { flushSync } from 'react-dom';
import type PartGroup from '../../../types/partGroup';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CodePattern {
    id: number;
    name: string;
    code: string;
    isDefault: boolean;
}

interface ValidateState {
    id: number | null;
    status: 'ok' | 'dup' | 'empty' | null;
}

const CodeBuilder: React.FC = () => {
    const [listCodeBuilders, setListCodeBuilders] = useState<CodePattern[]>([
        {
            id: Date.now(),
            name: 'Unnamed code pattern',
            code: '{this.productCode}',
            isDefault: true
        }
    ]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [tempName, setTempName] = useState('');
    const inputRef = useRef<any>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<string | undefined>();
    const [selectedProperty, setSelectedProperty] = useState<string | undefined>();
    const [validate, setValidate] = useState<ValidateState>({
        id: null,
        status: null,
    });

    /* ---------- List of part groups ---------- */
    const partGroups: PartGroup[] = [
        {
            id: 'group-1',
            name: 'Part Group 1',
            optional: false,
            parts: [
                {
                    key: '1',
                    id: '6123',
                    version: '1.0',
                    publishVersion: '1.0',
                    name: 'HP test deploy 0625-2',
                    type: 'standard',
                    code: 'HPIEST.0625-2',
                },
            ],
        },
        {
            id: 'group-2',
            name: 'Part Group 2',
            optional: true,
            parts: [
                {
                    key: '2',
                    id: '6124',
                    version: '2.0',
                    publishVersion: '2.0',
                    name: 'HP deploy test',
                    type: 'standard',
                    code: 'HPIEST.0626',
                },
            ],
        },
    ];

    const handleRename = (id: number, currentName: string) => {
        setEditingId(id);
        setTempName(currentName);
    };

    const handleBlur = (id: number) => {
        setListCodeBuilders(prev =>
            prev.map(item =>
                item.id === id ? { ...item, name: tempName } : item
            )
        );
        setEditingId(null);
    };

    const handleCancel = (
        e: React.KeyboardEvent<HTMLInputElement>,
        id: number,
        originalName: string,
    ) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            // ép React cập nhật state NGAY LẬP TỨC
            flushSync(() => setTempName(originalName));
            setEditingId(null);           // thoát chế độ rename
            inputRef.current?.blur();     // giờ mới blur -> handleBlur sẽ đọc đúng "Tên CŨ"
        }
    };

    const handleCodeChange = (id: number, newCode: string) => {
        setListCodeBuilders(prev =>
            prev.map(item =>
                item.id === id ? { ...item, code: newCode } : item
            )
        );
    };

    const handleToggleDefault = (id: number) => {
        setListCodeBuilders(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, isDefault: true }
                    : { ...item, isDefault: false }
            )
        );
    };

    const handleRemove = (id: number) => {
        if (listCodeBuilders.length === 1) {
            setShowAlert(!showAlert);
            return;
        }

        setListCodeBuilders(prev => {
            const filtered = prev.filter(item => item.id !== id);

            // nếu xóa ngay phần tử default → gán phần tử đầu thành default
            if (!filtered.some(item => item.isDefault)) {
                filtered[0] = { ...filtered[0], isDefault: true };
            }
            return filtered;
        });
    };

    const handleCreateNew = () => {
        const newItem: CodePattern = {
            id: Date.now(),
            name: 'Unnamed code pattern',
            code: '{this.productCode}',
            isDefault: false
        };
        setListCodeBuilders(prev => [...prev, newItem]);
    };

    const normalize = (s: string) =>
        s.trim().replace(/\s+/g, '').toLowerCase();

    const handleValidate = (id: number) => {
        const current = listCodeBuilders.find(cb => cb.id === id);
        if (!current) return;

        const code = normalize(current.code);

        if (!code) {
            setValidate({ id, status: 'empty' });
            return;
        }

        const dup = listCodeBuilders.some(
            cb => cb.id !== id && normalize(cb.code) === code
        );

        setValidate({ id, status: dup ? 'dup' : 'ok' });
    };

    return (
        <>
            <div className="cb-wrapper">
                <Title level={5} className="cb-heading">
                    Code builder
                </Title>

                {showAlert && (
                    <Alert
                        message="Must have at least 1 Code Builder"
                        type="warning"
                        showIcon
                        closable
                        onClose={() => setShowAlert(false)}
                        style={{ marginTop: 16 }}
                    />
                )}


                {listCodeBuilders.map((item) => (
                    <div className="cb-box" key={item.id}>
                        <Row justify="space-between" align="middle">
                            <Col>
                                {editingId !== item.id ? (
                                    <>
                                        <Text strong className="cb-pattern-name">
                                            {item.name}
                                        </Text>
                                        <Space className="cb-pattern-button">
                                            <CustomButton
                                                variant="black"
                                                layout="iconFirst"
                                                icon={<EditOutlined />}
                                                text="Rename code pattern"
                                                onClick={() => handleRename(item.id, item.name)}
                                            />
                                        </Space>
                                    </>
                                ) : (
                                    <Input
                                        ref={inputRef}
                                        value={tempName}
                                        autoFocus
                                        onChange={(e) => setTempName(e.target.value)}
                                        onBlur={() => handleBlur(item.id)}
                                        onKeyDown={(e) => handleCancel(e, item.id, item.name)}
                                        placeholder="Enter name Code Builder"
                                    />
                                )}
                            </Col>

                            <Col>
                                <Space>
                                    <Checkbox
                                        checked={item.isDefault}
                                        disabled={listCodeBuilders.length === 1}
                                        onChange={() => handleToggleDefault(item.id)}
                                        className="checkbox"
                                    >
                                        Is default for new outcomes
                                    </Checkbox>



                                    <CustomButton
                                        variant="red"
                                        layout="iconFirst"
                                        icon={<CloseOutlined />}
                                        text="Remove code pattern"
                                        onClick={() => handleRemove(item.id)}
                                    />
                                </Space>
                            </Col>
                        </Row>

                        <div className="cb-editor-block">
                            <Text strong>Code editor</Text>
                            <TextArea
                                rows={4}
                                value={item.code}
                                onChange={(e) => handleCodeChange(item.id, e.target.value)}
                            />
                        </div>

                        {/* báo trống */}
                        {validate.id === item.id && validate.status === 'empty' && (
                            <Alert
                                type="error"
                                message="Code Builder content cannot be blank"
                                showIcon closable
                                onClose={() => setValidate({ id: null, status: null })}
                                style={{ marginTop: 12 }}
                            />
                        )}

                        {/* báo trùng */}
                        {validate.id === item.id && validate.status === 'dup' && (
                            <Alert
                                type="error"
                                message="Code Builder content already exists"
                                showIcon closable
                                onClose={() => setValidate({ id: null, status: null })}
                                style={{ marginTop: 12 }}
                            />
                        )}

                        {/* báo hợp lệ */}
                        {validate.id === item.id && validate.status === 'ok' && (
                            <Alert
                                type="success"
                                message="Code Builder content is unique"
                                showIcon closable
                                onClose={() => setValidate({ id: null, status: null })}
                                style={{ marginTop: 12 }}
                            />
                        )}

                        <Row justify="space-between" className="cb-action-bar">
                            <Col>
                                <Space>
                                    <CustomButton
                                        variant="blue"
                                        layout="iconFirst"
                                        icon={<PlusOutlined />}
                                        text="Browse and add properties"
                                        onClick={() => setIsModalVisible(true)}
                                    />
                                    <CustomButton
                                        variant="blue"
                                        layout="iconFirst"
                                        icon={<InfoCircleOutlined />}
                                        text="Validate"
                                        onClick={() => handleValidate(item.id)}
                                    />
                                </Space>
                            </Col>
                            <Col>
                                <CustomButton
                                    disabled
                                    variant="gray"
                                    layout="iconFirst"
                                    icon={<CheckOutlined />}
                                    text="Bulk update occurrences"
                                />
                            </Col>
                        </Row>
                    </div>
                ))}

                <div className="cb-create-new">
                    <CustomButton
                        variant="blue"
                        layout="iconFirst"
                        icon={<PlusOutlined />}
                        text="Create new code pattern"
                        onClick={handleCreateNew}
                    />
                </div>
            </div>

            <Modal
                width={800}
                open={isModalVisible}
                title="Browse and add properties"
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Text italic>
                    Note: A new property accessor will be added to the rule. You must
                    populate appropriate comparison operators (&lt;, &lt;=, &gt;, &gt;=)
                    and logic operators (&&, ==) within your rule script.
                </Text>

                <div style={{ marginTop: 24 }}>
                    <Text strong>Part group or outcome</Text>
                    <Select
                        style={{ width: '100%', marginTop: 8 }}
                        placeholder="Select option..."
                        value={selectedGroup}
                        onChange={(val) => {
                            setSelectedGroup(val);
                            setSelectedProperty(undefined);
                        }}
                    >
                        <Select.Option value='this Item'>This</Select.Option>
                        {partGroups.map((item) => (
                            <Select.Option value={item.id}>{item.name ? item.name : "Không có tên"}</Select.Option>
                        ))}
                    </Select>
                    <Text type="secondary">Select part group to see available properties</Text>
                </div>

                <div style={{ marginTop: 24 }}>
                    <Text strong>Available properties</Text>
                    <Select
                        style={{ width: '100%', marginTop: 8 }}
                        placeholder="Select option..."
                        value={selectedProperty}
                        onChange={(val) => setSelectedProperty(val)}
                    >
                        {selectedGroup === 'outcome' && (
                            <>
                                <Select.Option value="outputPower">Output Power</Select.Option>
                                <Select.Option value="torque">Torque</Select.Option>
                            </>
                        )}
                        {selectedGroup === 'engine' && (
                            <>
                                <Select.Option value="rpm">RPM</Select.Option>
                                <Select.Option value="temperature">Temperature</Select.Option>
                            </>
                        )}
                    </Select>
                </div>

                <Row style={{ marginTop: 32 }} justify="start">
                    <Col>
                        <Space>
                            <CustomButton className='button-modal' variant='gray' text='Add property' layout='noIcon' />
                        </Space>
                    </Col>
                    <Col>
                        <CustomButton className='button-modal' variant='white' text='Cancel' layout='noIcon' onClick={() => setIsModalVisible(false)} />
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default CodeBuilder;
