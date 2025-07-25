import React, { useEffect, useRef, useState } from 'react';
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
import { GET_ADDITIONAL_FIELDS_GROUPS, GET_GROUPS_BY_VERSIONID } from '../../../graphQL/partQueries';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_VERSION_BY_CODE } from '../../../graphQL/versionQueries';
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

interface CodeBuilderProps {
    versionId: string;
}

const CodeBuilder: React.FC<CodeBuilderProps> = ({ versionId }) => {
    const [listCodeBuilders, setListCodeBuilders] = useState<CodePattern[]>([
        {
            id: Date.now(),
            name: 'Unnamed code pattern',
            code: '{this.productCode}',
            isDefault: true
        }
    ]);
    const { id, revisionId, versionCode } = useParams<{
        id: string;
        revisionId?: string;
        versionCode?: string;
    }>();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [tempName, setTempName] = useState('');
    const inputRef = useRef<any>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>();
    const [selectedProperty, setSelectedProperty] = useState<string | undefined>();
    const [validate, setValidate] = useState<ValidateState>({
        id: null,
        status: null,
    });
    const [fieldsGroup, setFieldsGroup] = useState<any[]>([]);

    const { data } = useQuery(GET_GROUPS_BY_VERSIONID, {
        variables: { versionId },
    });

    const { data: fieldsData } = useQuery(GET_ADDITIONAL_FIELDS_GROUPS, {
        variables: { groupId: selectedGroupId },
    });
    console.log(fieldsData);

    const { data: versionData } = useQuery(GET_VERSION_BY_CODE, {
        variables: {
            input: {
                partId: Number(id),
                revisionId: Number(revisionId),
                versionCode: versionCode,
            },
        },
        skip: !id || !revisionId || !versionCode,
    });

    const version = versionData?.getVersionByVersionCode;
    /* ---------- List of part groups ---------- */
    const partGroups = data?.groups || [];
    useEffect(() => {
        if (selectedGroupId === 'this Item') {
            if (version) {
                const customFields = [];

                if (version.name) {
                    customFields.push({
                        id: 'name',
                        name: 'Name',
                        value: version.name,
                    });
                }

                if (version.type?.name) {
                    customFields.push({
                        id: 'typeName',
                        name: 'Type',
                        value: version.type.name,
                    });
                }

                if (version.code) {
                    customFields.push({
                        id: 'code',
                        name: 'Code',
                        value: version.code,
                    });
                }

                if (Array.isArray(version.additional_fields)) {
                    version.additional_fields.forEach((field: any, index: number) => {
                        customFields.push({
                            id: `additional_${index}`,
                            name: field.name,
                            value: field.value,
                        });
                    });
                }

                setFieldsGroup(customFields);
            } else {
                setFieldsGroup([]);
            }
        } else {
            const additionalFields = fieldsData?.getAdditionalFieldsFromGroup || [];

            if (additionalFields.length === 0) {
                setFieldsGroup([]);
                return;
            }

            const version = additionalFields[0].version || {};

            // Các field name riêng
            const fieldItems = additionalFields.map((field: any, index: number) => ({
                id: `field_${index}`,
                name: field.name,
                value: '', // Hoặc giá trị mặc định tùy bạn
            }));

            // Các trường version (chỉ lấy 1 lần)
            const versionFields = [
                {
                    id: 'version_name',
                    name: 'Name',
                    value: version.name || 'N/A',
                },
                {
                    id: 'version_code',
                    name: 'Code',
                    value: version.code || 'N/A',
                },
                {
                    id: 'version_type',
                    name: 'Type',
                    value: version.type?.name || 'N/A',
                },
            ];

            setFieldsGroup([...versionFields, ...fieldItems]);
        }
    }, [selectedGroupId, versionData, fieldsData]);

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
                        value={selectedGroupId}
                        onChange={(val) => {
                            setSelectedGroupId(val);
                            setSelectedProperty(undefined);
                        }}
                    >
                        <Select.Option value='this Item'>This</Select.Option>
                        {partGroups.map((item: any) => (
                            <Select.Option value={item.id}>{item.name ? item.name : "Không có tên"}</Select.Option>
                        ))}
                    </Select>
                    <Text >Select part group to see available properties</Text>
                </div>

                <div style={{ marginTop: 24 }}>
                    <Text strong>Available properties</Text>
                    <Select
                        style={{ width: '100%', marginTop: 8 }}
                        placeholder="Select property..."
                        value={selectedProperty}
                        onChange={(val) => setSelectedProperty(val)}
                        disabled={!selectedGroupId}
                    >
                        {fieldsGroup.map((item: any, index: number) => (
                            <Select.Option key={item.id ?? `fallback-${index}`} value={item.id}>
                                {item.name || "Không có tên"}
                            </Select.Option>
                        ))}
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
