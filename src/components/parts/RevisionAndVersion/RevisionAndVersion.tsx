import React from 'react';
import { Table, Typography, Space, Tag, Tooltip } from 'antd';
import {
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    QuestionCircleFilled,
    SettingTwoTone,
} from '@ant-design/icons';
import './RevisionAndVersion.css';
import CustomButton from '../../common/CustomButton/CustomButton';

const { Text, Title, Link } = Typography;

/* ========== MOCK DATA ========== */
const dataSource = [
    {
        key: '1',
        order: 1,
        revision: '1.0',
        updatedAt: '02/07/25 10:40:10',
        updatedBy: 'system',
        latestVersion: 'v1.0',
        isPublished: false,
        latestStatus: 'Draft',
        versions: [
            {
                key: '1-1',
                order: 1,
                version: 'v1.0',
                updatedAt: '02/07/25 10:40:10',
                updatedBy: 'system',
                latestStatus: 'Draft',
                basedUpon: '-',
            },
        ],
    },
];

/* ========== PARENT TABLE COLUMNS ========== */
const parentCols = [
    {
        title: '',
        dataIndex: 'order',
        width: 150,
        render: (val: number) => <Link>{val}</Link>,
    },
    { title: 'Revision', dataIndex: 'revision' },
    { title: 'Updated at', dataIndex: 'updatedAt' },
    { title: 'Updated by', dataIndex: 'updatedBy' },
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
        render: () => (
            <Space>
                <CustomButton variant='blue' layout='iconFirst' text='Edit lasted version' icon={<EditOutlined />} />
                <div style={{ margin: 10 }}>
                    <CustomButton variant='blue' layout='noIcon' text='Version' className='button-active-box' />
                    <CustomButton variant='white' layout='noIcon' text='Relationships' className='button-active-box' />
                </div>
            </Space>
        ),
    },
];

/* ========== CHILD TABLE COLUMNS ========== */
const childCols = [
    {
        title: '',
        dataIndex: 'order',
        width: 70,
        render: (val: number) => <Link>{val}</Link>,
    },
    { title: 'Version', dataIndex: 'version', render: (t: any) => <Link>{t}</Link> },
    { title: 'Updated at', dataIndex: 'updatedAt' },
    { title: 'Updated by', dataIndex: 'updatedBy' },
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
        render: () => (
            <Space>
                <CustomButton variant="white" layout="iconFirst" icon={<PlusOutlined />} text="Create revision" />
                <CustomButton variant="blue" layout="noIcon" text="Publish" />
                <CustomButton variant="white" layout="iconFirst" icon={<EyeOutlined />} text="View" />
            </Space>
        ),
    }
];

/* ========== COMPONENT ========== */
const RevisionAndVersion: React.FC = () => {
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

            {dataSource.map((item) => (
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
                    <div className="child-expanded-wrapper">
                        <div className="noteRow">
                            <Text strong>Author:</Text> {item.updatedBy}
                        </div>

                        <Text strong className="noteRowTitle">Versions</Text>

                        <Table
                            columns={childCols}
                            dataSource={item.versions}
                            pagination={false}
                            rowKey="key"
                            className="childTable"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RevisionAndVersion;
