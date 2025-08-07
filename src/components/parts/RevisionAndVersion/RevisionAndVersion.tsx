import React, { useState } from 'react';
import { Table, Typography, Space, Tag, Tooltip, Modal, message } from 'antd';
import {
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    QuestionCircleFilled,
    SettingTwoTone,
} from '@ant-design/icons';
import './RevisionAndVersion.css';
import CustomButton from '../../common/CustomButton/CustomButton';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PART_BY_ID } from '../../../graphQL/partQueries';
import { useNavigate, useParams } from 'react-router-dom';
import { CREATE_REVISION, UPDATE_VERSION_STATUS } from '../../../graphQL/partActions';
import { DELETE_VERSION } from '../../../graphQL/versionActions';
import Loading from '../../layout/Loading/Loading';
import { toast } from 'react-toastify';

const { Text, Title, Link } = Typography;


const RevisionAndVersion: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, loading, error, refetch } = useQuery(GET_PART_BY_ID, {
        variables: { id },
    });
    const [updateVersionStatus] = useMutation(UPDATE_VERSION_STATUS);
    const [createRevision] = useMutation(CREATE_REVISION);
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
    const [deleteVersion] = useMutation(DELETE_VERSION);
    const part = data?.getPartById;
    const [versionStatus] = useState({
        published: 'Published',
        draft: 'Draft',
        archieve: 'Archieve'
    });

    if (!part) return <Loading />;
    if (!part.revisions?.length) return <p>No revisions available.</p>;

    const handleView = (part: {
        id: number;
        revisionId?: number;
        versionId?: number;
        versionCode: string;
        type: string;
        code: string;
        name: string;
    }) => {
        navigate(`/parts/modify/${part.id}`);

        setTimeout(() => {
            navigate(
                `/parts/modify/${part.id}/${part.revisionId}/${part.versionCode}`,
                {
                    replace: false,
                    state: {
                        partId: part.id,
                        versionCode: part.versionCode,
                        versionId: part.versionId,
                        name: part.name,
                        code: part.code,
                        type: part.type,
                        activeTab: 'properties',
                    },
                }
            );
        }, 0);
    };

    const dataSource = part?.revisions
        ?.slice()
        .sort((a: any, b: any) => b.revision_code.localeCompare(a.revision_code))
        .map((revision: any, revIndex: any) => {
            return {
                name: revision.latestVersion.name,
                type: revision.latestVersion.type,
                code: revision.latestVersion.code,
                key: revision.id,
                order: revIndex + 1,
                revision: revision.revision_code,
                updatedAt: revision.updated_at,
                updatedBy: revision.creator.email,
                latestVersionCode: revision.latestVersion?.version_code,
                latestVersion: revision.latestVersion,
                isPublished: revision.latestVersion?.status === 'Published',
                latestStatus: revision.latestVersion?.status ?? '-',
                versions: revision.versions.map((v: any, i: any) => ({
                    key: v.id,
                    order: i + 1,
                    version: v.version_code,
                    updatedAt: v.updated_at,
                    updatedBy: v.creator.email,
                    type: v.type.name,
                    code: v.code,
                    name: v.name,
                    latestStatus: v.status,
                    basedUpon: v.based_upon_version_id ?? '-',
                })),

            };

        }) ?? [];

    if (dataSource.length > 0 && expandedRowKeys.length === 0) {
        setExpandedRowKeys([dataSource[0].key]);
    }

    const parentCols = [
        {
            title: '',
            dataIndex: 'order',
            width: 150,
            render: (val: number) => <Link>{val}</Link>,
        },
        { title: 'Revision', dataIndex: 'revision' },
        { title: 'Updated at', dataIndex: 'updatedAt', width: 200 },
        { title: 'Updated by', dataIndex: 'updatedBy', width: 220 },
        { title: 'Latest version', dataIndex: 'latestVersionCode' },
        {
            title: 'Is published?',
            dataIndex: 'isPublished',
            render: (v: boolean) => (v ? 'Yes' : 'No'),
        },
        {
            title: 'Latest status',
            dataIndex: 'latestStatus',
            render: (t: string) => <Tag color="blue">{t}</Tag>,
        },
        {
            title: <SettingTwoTone />,
            key: 'actions',
            align: 'right' as const,
            width: 600,
            render: (_: any, record: any) => (
                <Space>
                    <CustomButton
                        variant="blue"
                        layout="iconFirst"
                        text="Edit lasted version"
                        icon={<EditOutlined />}
                        onClick={() => {
                            handleView({
                                id: part.id,
                                revisionId: record.key,
                                versionId: record.latestVersion?.id,
                                versionCode: record.latestVersion?.version_code,
                                type: record.latestVersion?.type.name,
                                code: record.latestVersion?.code,
                                name: record.latestVersion?.name
                            });
                        }}
                    />
                    <div style={{ margin: 10 }}>
                        <CustomButton
                            variant="blue"
                            layout="noIcon"
                            text="Version"
                            className="button-active-box"
                            onClick={() => {
                                if (expandedRowKeys.includes(record.key)) {
                                    setExpandedRowKeys(expandedRowKeys.filter((k) => k !== record.key));
                                } else {
                                    setExpandedRowKeys([...expandedRowKeys, record.key]);
                                }
                            }}
                        />
                        <CustomButton
                            variant="white"
                            layout="noIcon"
                            text="Relationships"
                            className="button-active-box"
                        />
                    </div>
                </Space>
            ),
        }

    ];

    const handlePublishConfirm = async (versionId: string) => {
        if (!versionId) return;

        const hide = message.loading('Publishing...');
        try {
            await updateVersionStatus({
                variables: {
                    id: versionId,
                },
            });

            hide();
            toast.success('Version published successfully');
            await refetch();
        } catch (error) {
            hide();
            console.error('Publish error:', error);
            toast.error('Failed to publish version');
        }
    };

    const handleDeleteVersionConfirm = async (versionId: string) => {
        if (!versionId) return;

        const hideLoading = message.loading("Deleting version...", 0); // loading vô thời hạn
        try {
            await deleteVersion({
                variables: {
                    id: versionId,
                },
            });

            hideLoading(); // ẩn loading
            toast.success("Version deleted successfully");

            await refetch(); // cập nhật lại dữ liệu
        } catch (error) {
            console.error("Delete version error:", error);
            hideLoading(); // dù lỗi cũng cần ẩn loading
            toast.error("Failed to delete version");
        }
    };

    const handleCreateRevision = async (version: any) => {
        try {

            // Gọi mutation với phiên bản truyền vào, không dùng selectedVersion
            await createRevision({
                variables: {
                    id: version.key,
                },
            });

            refetch(); // Cập nhật lại dữ liệu sau khi tạo revision
            toast.success('Revision created successfully');
        } catch (error) {
            console.error('Create revision error:', error);
        }
    };

    if (loading) return <Loading />;
    if (error) return <p>Error loading part data.</p>;

    return (
        <div className="container">
            <div className="title-container">
                <Title level={4} className="title">
                    Revision and version control
                </Title>
                <Tooltip title="This section lets you manage part groups and parts.">
                    <QuestionCircleFilled />
                </Tooltip>
            </div>

            {dataSource.map((item: any) => (
                <div key={item.key}>
                    {/* Bảng cha */}
                    <Table
                        columns={parentCols}
                        dataSource={[item]}
                        rowKey="key"
                        pagination={false}
                        className="parentTable"
                    />

                    {/* Bảng con và note */}
                    {expandedRowKeys.includes(item.key) && (
                        <div className="child-expanded-wrapper">
                            <div className="noteRow">
                                <div>
                                    <Text strong>Author:</Text>
                                    <Text style={{ marginLeft: 10 }}>{item.updatedBy}</Text>
                                </div>
                                <Text strong style={{ fontSize: 20, color: '#bbb', fontStyle: 'italic' }}>Versions</Text>
                            </div>

                            <Table
                                columns={[
                                    {
                                        title: '',
                                        dataIndex: 'order',
                                        width: 70,
                                        render: (_: any, __: any, index: number) => <Link>{index + 1}</Link>,
                                    },
                                    { title: 'Version', dataIndex: 'version', render: (t: any) => <Link>{t}</Link> },
                                    { title: 'Updated at', dataIndex: 'updatedAt', render: (t: string) => <Link>{t}</Link> },
                                    { title: 'Updated by', dataIndex: 'updatedBy', render: (t: string) => <Link>{t}</Link> },
                                    {
                                        title: 'Latest status',
                                        dataIndex: 'latestStatus',
                                        render: (t: string) => <Tag color="blue">{t}</Tag>,
                                    },
                                    { title: 'Based upon', dataIndex: 'basedUpon' },
                                    {
                                        title: <SettingTwoTone />,
                                        key: 'actions',
                                        align: 'right' as const,
                                        render: (_: any, record: any) => (
                                            <Space>
                                                <CustomButton
                                                    variant="white"
                                                    layout="iconFirst"
                                                    icon={<PlusOutlined />}
                                                    text="Create revision"
                                                    onClick={() =>
                                                        handleCreateRevision(record)
                                                    }
                                                />

                                                {!(record.latestStatus === versionStatus.published) && (
                                                    <CustomButton
                                                        variant="blue"
                                                        layout="noIcon"
                                                        text="Publish"
                                                        onClick={() => {
                                                            Modal.confirm({
                                                                title: 'Confirm Publish',
                                                                content: 'Are you sure you want to publish this version? All other versions in this revision will be archived.',
                                                                okText: 'Yes, publish',
                                                                cancelText: 'Cancel',
                                                                onOk: () => handlePublishConfirm(record.key),
                                                            });
                                                        }}
                                                    />
                                                )}

                                                <CustomButton
                                                    variant="white"
                                                    layout="iconFirst"
                                                    icon={<EyeOutlined />}
                                                    text="View"
                                                    onClick={() =>
                                                        handleView({
                                                            id: part.id,
                                                            revisionId: item.key,
                                                            versionId: record.key,
                                                            versionCode: record.version,
                                                            type: record.type,
                                                            code: record.code,
                                                            name: record.name
                                                        })
                                                    }
                                                />

                                                {(record.latestStatus === versionStatus.draft) && (
                                                    <CustomButton
                                                        variant="red"
                                                        layout="noIcon"
                                                        text="Delete"
                                                        onClick={() => {
                                                            Modal.confirm({
                                                                title: 'Confirm Delete',
                                                                content: 'Are you sure you want to delete this version?',
                                                                okText: 'Yes, delete',
                                                                cancelText: 'Cancel',
                                                                okButtonProps: { danger: true },
                                                                onOk: () => handleDeleteVersionConfirm(record.key),
                                                            });
                                                        }}
                                                    />
                                                )}
                                            </Space>
                                        ),
                                    }
                                ]}
                                dataSource={[...item.versions].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())}
                                pagination={false}
                                rowKey="key"
                                className="childTable"
                            />
                        </div>
                    )}
                </div>
            ))}

        </div>
    );
};

export default RevisionAndVersion;
