import React from 'react';
import { Table, Checkbox, Space, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ArrowsAltOutlined, CloseOutlined, DeleteOutlined,
  DoubleRightOutlined, EditOutlined, PlusOutlined, SettingOutlined
} from '@ant-design/icons';
import CustomButton from '../CustomButton/CustomButton';
import './PartAssemblerGroup.css';

const { Title } = Typography;

interface PartRecord {
  key: string;
  id: string;
  version: string;
  publishVersion: string;
  name: string;
  type: string;
  code: string;
}

/* ---------- columns ---------- */
const columns: ColumnsType<PartRecord> = [
  {
    title: '',
    key: 'index',
    width: 100,
    align: 'center',
    className: 'hiddenCollum',                    // 👈 dùng class
    render: (_1, _2, index) => index + 1,
  },
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: 'Version', dataIndex: 'version', key: 'version', width: 90 },
  { title: 'Publish Version', dataIndex: 'publishVersion', key: 'publishVersion', width: 120 },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Type', dataIndex: 'type', key: 'type', width: 100 },
  { title: 'Code', dataIndex: 'code', key: 'code' },
  {
    title: <SettingOutlined style={{ color: 'blue' }} />,
    key: 'action',
    align: 'right',
    className: '',
    render: () => (
      <Space size="small">
        <CustomButton variant="blue"  layout="iconFirst" icon={<EditOutlined />}        text="Edit original" />
        <CustomButton variant="blue"  layout="iconFirst" icon={<DoubleRightOutlined />} text="Quick edit"    />
        <CustomButton variant="blue"  layout="iconFirst" icon={<ArrowsAltOutlined />}   text="Replace Part"  />
        <CustomButton variant="red"   layout="iconFirst" icon={<DeleteOutlined />}      text="Remove"        />
      </Space>
    ),
  },
];

/* ---------- dummy data ---------- */
const data: PartRecord[] = [
  { key: '1', id: '6123', version: '1.0', publishVersion: '1.0', name: 'HP test deploy 0625-2', type: 'standard', code: 'HPIEST.0625-2' },
];

/* ---------- component ---------- */
const PartAssemblerGroup: React.FC = () => (
  <div className="wrapper">
    <header className="headerRow">
      <div className="titleBox">
        <Title level={4} className="title">Part Group 2</Title>
        <CustomButton variant="black" layout="iconFirst" icon={<EditOutlined />} text="Edit group" />
      </div>

      <div className="optionBox">
        <Checkbox>Is an optional group</Checkbox>
        <CustomButton variant="red" layout="textFirst" icon={<CloseOutlined />} text="Remove group" />
      </div>
    </header>

    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey="key"
      className="table"
    />

    <div className="actionRow">
      <CustomButton variant="blue"  layout="iconFirst" icon={<PlusOutlined />} text="Add Part" />
      <CustomButton variant="white" layout="iconFirst" icon={<PlusOutlined />} text="Create and Add new part" />
    </div>
  </div>
);

export default PartAssemblerGroup;
