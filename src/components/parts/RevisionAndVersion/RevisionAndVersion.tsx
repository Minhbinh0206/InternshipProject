import React, { useState } from 'react';
import { Table, Typography, Space, Tag, Tooltip, Modal } from 'antd';
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
import { UPDATE_VERSION_STATUS } from '../../../graphQL/partActions';

const { Text, Title, Link } = Typography;


const RevisionAndVersion: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, loading, error } = useQuery(GET_PART_BY_ID, {
        variables: { id },
    });
    const [updateVersionStatus] = useMutation(UPDATE_VERSION_STATUS);
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState<any>(null);
    const [selectedVersionsList, setSelectedVersionsList] = useState<any[]>([]);

    const part = data?.getPartById;

    if (!part) return <p>Part not found.</p>;
    if (!part.revisions?.length) return <p>No revisions available.</p>;

    console.log('part', part);

    const handleView = (part: { id: number; revisionId?: number; versionId?: number; version: string; type: string; code: string; name: string }) => {
        navigate(
            `/parts/modify/${part.id}/${part.revisionId}/?versionId=${part.versionId}`,
            // `/parts/modify/${part.id}/${part.revisionId}/${part.versionId}`,
             {
                replace: true,
                state: {
                    partId: part.id,
                    versionId: part.versionId,
                    name: part.name,
                    version: part.code
                },
            }
        );
    };

    const dataSource = part?.revisions
        ?.slice() 
            .sort((a: any, b: any) => b.revision_code.localeCompare(a.revision_code))
            .map((revision: any, revIndex: any) => {
                return {
                    key: revision.id,
                    order: revIndex + 1,
                    revision: revision.revision_code,
                    updatedAt: revision.updated_at,
                    updatedBy: revision.creator.email,
                    latestVersion: revision.latestVersion?.version_code,
                    isPublished: revision.latestVersion?.status === 'Published',
                    latestStatus: revision.latestVersion?.status ?? '-',
                    versions: revision.versions.map((v: any, i: any) => ({
                        key: v.id,
                        order: i + 1,
                        version: v.version_code,
                        updatedAt: v.updated_at,
                        updatedBy: v.creator.email,
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
        { title: 'Latest version', dataIndex: 'latestVersion' },
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

    const openCustomModal = (version: any, versions: any[]) => {
        setSelectedVersion(version);
        setSelectedVersionsList(versions);
        setIsModalVisible(true);
    };

    const handlePublishConfirm = async () => {
        try {
            if (!selectedVersion) return;

            // 1. Publish version được chọn
            await updateVersionStatus({
                variables: {
                    id: selectedVersion.key,
                },
            });

            setIsModalVisible(false);
            setSelectedVersion(null);
            setSelectedVersionsList([]);

            window.location.reload();
        } catch (error) {
            console.error('Publish error:', error);
        }
    };


    if (loading) return <p>Loading...</p>;
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
                                        render: (val: number) => <Link>{val}</Link>,
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
                                                <CustomButton variant="white" layout="iconFirst" icon={<PlusOutlined />} text="Create revision" />
                                                {!(record.latestStatus === 'Published') && (
                                                    <CustomButton
                                                        variant="blue"
                                                        layout="noIcon"
                                                        text="Publish"
                                                        onClick={() =>
                                                            openCustomModal(record, item.versions)
                                                        }
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
                                                            version: record.version,
                                                            type: part.type,
                                                            code: part.code,
                                                            name: record.name
                                                        })
                                                    }
                                                />
                                            </Space>
                                        ),
                                    }
                                ]}
                                dataSource={item.versions}
                                pagination={false}
                                rowKey="key"
                                className="childTable"
                            />
                        </div>
                    )}
                </div>
            ))}
            <Modal
                title="Confirm Publish"
                visible={isModalVisible}
                onOk={handlePublishConfirm}
                onCancel={() => setIsModalVisible(false)}
                okText="Yes, publish"
                cancelText="Cancel"
            >
                <p>Are you sure you want to publish this version? All other versions in this revision will be archived.</p>
            </Modal>

        </div>
    );
};

export default RevisionAndVersion;
