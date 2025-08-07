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
    Table,
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
import { GET_ADDITIONAL_FIELDS_GROUPS, GET_CODE_BY_CODEBUILDER, GET_GROUPS_BY_VERSIONID, VALIDATE_CODE } from '../../../graphQL/partQueries';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_LIST_CODE_BUILDER, GET_VERSION_BY_CODE } from '../../../graphQL/versionQueries';
import { useMutation } from '@apollo/client';
import { ADD_PROPERTY_TO_CODEBUILDER } from '../../../graphQL/partActions';
import { CREATE_CODEBUILDER, DELETE_CODE_BUILDER, EDIT_RULE_CODE_BUILDER, UPDATE_FIELDS_CODE_BUILDER } from '../../../graphQL/versionActions';
import { toast } from 'react-toastify';
import Loading from '../../layout/Loading/Loading';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CodePattern {
    id: number;
    name: string;
    rule: string;
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
    console.log('CodeBuilder versionId:', versionId);

    const { data: codeBuildersData, loading: codeLoading, refetch } = useQuery(GET_LIST_CODE_BUILDER, {
        variables: { versionId }
    });
    const [listCodeBuilders, setListCodeBuilders] = useState<CodePattern[]>([]);

    useEffect(() => {
        if (codeBuildersData?.getCodeBuilderByVersion) {
            setListCodeBuilders(codeBuildersData.getCodeBuilderByVersion);
        }
    }, [codeBuildersData]);

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
    const [selectedCodeBuilderId, setSelectedCodeBuilderId] = useState<number | undefined>();
    const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>();
    const [selectedProperty, setSelectedProperty] = useState<string | undefined>();
    const [updateCodebuilder] = useMutation(UPDATE_FIELDS_CODE_BUILDER);
    const [isCanceling, setIsCanceling] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [isModalGeneratedCodeVisible, setIsModalGeneratedCodeVisible] = useState(false);
    const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
    const [validate, setValidate] = useState<ValidateState>({
        id: null,
        status: null,
    });

    const [fetchCodes, { data: generatedData, loading: loadingGeneratedCodes }] = useLazyQuery(
        GET_CODE_BY_CODEBUILDER,
        {
            fetchPolicy: 'network-only', // 👈 Bắt buộc fetch từ server, không dùng cache
            onCompleted: (data) => {
                const codes = data.getCodeByCodebuilder?.map((item: any) => item.generatedCode) || [];
                setGeneratedCodes(codes);
            },
        }
    );

    useEffect(() => {
        if (isModalGeneratedCodeVisible && selectedCodeBuilderId) {
            fetchCodes({ variables: { codebuilderId: selectedCodeBuilderId } });
        }
    }, [isModalGeneratedCodeVisible, selectedCodeBuilderId]);

    const [fieldsGroup, setFieldsGroup] = useState<any[]>([]);
    const [storeRuleToCodebuilder] = useMutation(EDIT_RULE_CODE_BUILDER);
    const [addPropertyToCodebuilder, { loading: addingProperty }] = useMutation(ADD_PROPERTY_TO_CODEBUILDER);
    const [createCodeBuilder] = useMutation(CREATE_CODEBUILDER);
    const [deleteCodebuilder] = useMutation(DELETE_CODE_BUILDER);
    const { data, refetch: groupRefect } = useQuery(GET_GROUPS_BY_VERSIONID, {
        variables: { versionId },
    });

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

    const [validateCodeQuery] = useLazyQuery(VALIDATE_CODE, {
        fetchPolicy: 'no-cache', // 👈 Thêm dòng này để luôn gọi lại query
        onCompleted: (data) => {
            if (currentId === null) return;
            const isValid = data?.validateGeneratedCode;
            setValidate({ id: currentId, status: isValid ? 'ok' : 'dup' });

            if (!isValid) {
                toast.error('Code generated already exist');
            } else {
                toast.success('Code generated is unique');
            }
        },
        onError: (error) => {
            console.error('❌ validateCodeQuery bị lỗi:', error);
            toast.error(`Lỗi validate: ${error.message}`);
            if (currentId === null) return;
            setValidate({ id: currentId, status: 'dup' });
        },
    });

    const version = versionData?.getVersionByVersionCode;

    /* ---------- List of part groups ---------- */
    const { data: fieldsData, refetch: fieldsRefect } = useQuery(GET_ADDITIONAL_FIELDS_GROUPS, {
        variables: { groupId: selectedGroupId },
        fetchPolicy: 'network-only'
    });
    const partGroups = data?.groups || [];

    console.log(partGroups);

    useEffect(() => {
        const selectedGroup = partGroups.find((group: any) => group.id === selectedGroupId);

        if (selectedGroupId === 'this Item') {
            if (version) {
                const customFields = [];

                if (version.name) {
                    customFields.push({
                        id: 'name',
                        name: 'name',
                        value: version.name,
                    });
                }

                if (version.type?.name) {
                    customFields.push({
                        id: 'typeName',
                        name: 'type',
                        value: version.type.name,
                    });
                }

                if (version.code) {
                    customFields.push({
                        id: 'code',
                        name: 'code',
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
        } else if (selectedGroup) {
            const groupParts = selectedGroup.groupParts || [];

            // ✅ Nếu không có part nào trong group
            if (groupParts.length === 0) {
                setFieldsGroup([]);
                return;
            }

            const additionalFields = fieldsData?.getAdditionalFieldsFromGroup || [];
            const version = additionalFields[0]?.version || {};

            const versionFields = [
                {
                    id: 'version_name',
                    name: 'name',
                    value: version.name || 'N/A',
                },
                {
                    id: 'version_code',
                    name: 'code',
                    value: version.code || 'N/A',
                },
                {
                    id: 'version_type',
                    name: 'type',
                    value: version.type?.name || 'N/A',
                },
            ];

            if (additionalFields.length === 0) {
                setFieldsGroup(versionFields);
                return;
            }

            const fieldItems = additionalFields.map((field: any, index: number) => ({
                id: `field_${index}`,
                name: field.name,
                value: field.value || 'N/A',
            }));

            setFieldsGroup([...versionFields, ...fieldItems]);
        } else {
            setFieldsGroup([]);
        }
    }, [selectedGroupId, versionData, fieldsData, partGroups]);

    useEffect(() => {
        if (isModalVisible && selectedGroupId) {
            fieldsRefect({ variables: { groupId: selectedGroupId } });
        }
    }, [isModalVisible, selectedGroupId]);

    useEffect(() => {
        console.log("🌀 fieldsData changed:", fieldsData);
    }, [fieldsData]);

    const handleRename = (id: number, currentName: string) => {
        setEditingId(id);
        setTempName(currentName);
    };

    const handleBlur = async (id: number) => {
        if (isCanceling) {
            setIsCanceling(false); // reset lại cờ
            return; // không gọi mutation
        }

        if (tempName.trim() === '') {
            toast.warning('Name cannot be empty');
            return;
        }

        setShowAlert(false);

        try {
            await updateCodebuilder({
                variables: {
                    input: {
                        id,
                        name: tempName,
                    },
                },
            });

            setListCodeBuilders(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, name: tempName } : item
                )
            );
            toast.success('Name updated successfully');
        } catch (error) {
            console.error("Lỗi khi cập nhật tên:", error);
            toast.error('Name update failed');
        }

        setEditingId(null);
    };

    const handleCancel = (
        e: React.KeyboardEvent<HTMLInputElement>,
        originalName: string,
    ) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            setIsCanceling(true);
            flushSync(() => setTempName(originalName));
            setEditingId(null);
            inputRef.current?.blur();
            toast.info('Cancelled renaming');
        }
    };

    const ruleRef = useRef<{ [id: number]: string }>({});

    const handleCodeChange = (id: number, newRule: string) => {
        ruleRef.current[id] = newRule; // Lưu rule mới nhất vào ref
        setListCodeBuilders(prev =>
            prev.map(item =>
                item.id === id ? { ...item, rule: newRule } : item
            )
        );
    };

    const handleCodeBlur = async (id: number) => {
        const rule = ruleRef.current[id]; // Lấy rule mới nhất từ ref
        try {
            await storeRuleToCodebuilder({
                variables: {
                    input: {
                        id,
                        rule,
                    },
                },
            });
            toast.success('Rule updated successfully');
        } catch (err) {
            toast.error('Rule updated failed');
        }
    };

    const handleToggleDefault = async (id: number) => {
        try {
            // Gọi API để đặt item có id là default
            await updateCodebuilder({
                variables: {
                    input: {
                        id: id,
                        is_default: true,
                    },
                },
            });

            // Sau khi thành công, cập nhật lại local state
            setListCodeBuilders(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, isDefault: true }
                        : { ...item, isDefault: false }
                )
            );
        } catch (error) {
            console.error('Lỗi khi cập nhật isDefault:', error);
        }
    };

    const handleRemove = (id: number, rule: string) => {
        if (listCodeBuilders.length === 1) {
            setShowAlert(!showAlert);
            return;
        }

        Modal.confirm({
            title: 'Xác nhận xoá',
            content: `Bạn có chắc chắn muốn xoá rule ${rule} này?`,
            okText: 'Xoá',
            okType: 'danger',
            cancelText: 'Huỷ',
            onOk: async () => {
                try {
                    await deleteCodebuilder({ variables: { id } });

                    setListCodeBuilders(prev => {
                        const filtered = prev.filter(item => item.id !== id);

                        // Nếu xóa phần tử default → gán phần tử đầu làm default
                        if (!filtered.some(item => item.isDefault)) {
                            filtered[0] = { ...filtered[0], isDefault: true };
                        }

                        return filtered;
                    });

                    toast.success('Remove code builder successfully');

                    await refetch();
                } catch (error) {
                    console.error('Lỗi khi xoá:', error);
                    toast.error('Remove failed');
                }
            },
        });
    };

    useEffect(() => {
        console.log("Cập nhật listCodeBuilders:", listCodeBuilders);
    }, [listCodeBuilders]);

    const handleCreateNew = async () => {
        try {
            const response = await createCodeBuilder({
                variables: {
                    input: {
                        name: 'Unnamed code pattern',
                        rule: '{this.code}',
                        is_default: false,
                        version_id: versionId, // phải là trường đúng tên
                    }
                }
            });

            console.log(response);

            const createdItem = response.data?.createCodebuilder;
            if (!createdItem) {
                toast.error('Tạo code builder thất bại');
                return;
            }

            // Thêm trường originalRule để dùng cho so sánh
            setListCodeBuilders(prev => [
                ...prev,
                { ...createdItem, originalRule: createdItem.rule },
            ]);

            toast.success('Tạo code builder thành công');
            await refetch();
        } catch (error) {
            console.error('Lỗi khi tạo code builder', error);
            toast.error('Tạo code builder thất bại');
        }
    };

    const normalize = (s: string) =>
        s.trim().replace(/\s+/g, '').toLowerCase();

    const handleValidate = (id: number) => {
        const current = listCodeBuilders.find(cb => cb.id === id);
        if (!current) return;

        const code = normalize(current.rule);
        if (!code) {
            setValidate({ id, status: 'empty' });
            return;
        }

        setCurrentId(id);
        validateCodeQuery({ variables: { codebuilderId: String(id) } });

        console.log('Gọi validateCodeQuery:', {
            id,
            current,
            data
        });
    };

    if (codeLoading) {
        return <Loading />
    }

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

                {listCodeBuilders.map((item: any, index: number) => (
                    <div className="cb-box" key={item.id || index} id={item.id}>
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
                                        onKeyDown={(e) => handleCancel(e, item.id)}
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
                                        onClick={() => handleRemove(item.id, item.rule)}
                                    />
                                </Space>
                            </Col>
                        </Row>


                        <div className="cb-editor-block">
                            <Input
                                style={{ cursor: 'pointer' }}
                                placeholder='Code generated'
                                readOnly
                                onClick={() => {
                                    console.log('id', item.id);

                                    fetchCodes({ variables: { codebuilderId: item.id } });
                                    setIsModalGeneratedCodeVisible(true);
                                }}
                            />

                            <Text strong>Code editor</Text>
                            <TextArea
                                value={item.rule}
                                onChange={(e) => handleCodeChange(item.id, e.target.value)}
                                onBlur={() => handleCodeBlur(item.id)}
                            />

                        </div>

                        <Row justify="space-between" className="cb-action-bar">
                            <Col>
                                <Space>
                                    <CustomButton
                                        variant="blue"
                                        layout="iconFirst"
                                        icon={<PlusOutlined />}
                                        text="Browse and add properties"
                                        onClick={async () => {
                                            setSelectedCodeBuilderId(item.id);
                                            setIsModalVisible(true);
                                        }}

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
                            <Select.Option key={item.id} value={item.id}>
                                {item.name || "Không có tên"}
                            </Select.Option>
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
                        onChange={(val) => {
                            setSelectedProperty(val);
                        }}
                        disabled={!selectedGroupId}
                    >
                        {fieldsGroup.map((item: any, index: number) => (
                            <Select.Option
                                key={item.id || `field_${index}`}
                                value={item.name}
                            >
                                {item.name || "Không có tên"}
                            </Select.Option>
                        ))}
                    </Select>

                </div>

                <Row style={{ marginTop: 32 }} justify="start">
                    <Col>
                        <Space>
                            {/* <CustomButton className='button-modal' variant='gray' text='Add property' layout='noIcon' /> */}
                            <CustomButton
                                className='button-modal'
                                variant='blue'
                                text={addingProperty ? 'Adding...' : 'Add property'}
                                layout='noIcon'
                                onClick={async () => {
                                    if (!selectedGroupId || !selectedProperty) return;

                                    await groupRefect();

                                    try {
                                        await addPropertyToCodebuilder({
                                            variables: {
                                                input: {
                                                    id: selectedCodeBuilderId,
                                                    group_id: selectedGroupId === 'this Item' ? null : selectedGroupId,
                                                    field_name: selectedProperty,
                                                },
                                            },
                                        });

                                        setIsModalVisible(false);
                                        setSelectedGroupId(undefined);
                                        setSelectedProperty(undefined);

                                        toast.success('Adding new properties successfully');

                                    } catch (error: any) {
                                        console.error("Lỗi khi thêm property:", error);
                                        toast.error('Failed to add property');
                                    }
                                }}
                            />

                        </Space>
                    </Col>
                    <Col>
                        <CustomButton className='button-modal' variant='white' text='Cancel' layout='noIcon' onClick={() => setIsModalVisible(false)} />
                    </Col>
                </Row>
            </Modal>

            <Modal
                title="Danh sách Generated Code"
                open={isModalGeneratedCodeVisible}
                onCancel={() => setIsModalGeneratedCodeVisible(false)}
                footer={null}
                width={600}
            >
                <Table
                    loading={loadingGeneratedCodes}
                    dataSource={generatedCodes.map((code, index) => ({
                        key: index,
                        stt: index + 1,
                        code,
                    }))}
                    columns={[
                        { title: 'STT', dataIndex: 'stt', key: 'stt', width: 80 },
                        { title: 'Code', dataIndex: 'code', key: 'code' },
                    ]}
                    pagination={false}
                />
            </Modal>

        </>
    );
};

export default CodeBuilder;
