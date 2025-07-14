import React from 'react';
import { Table, Checkbox, Space, Typography, Tooltip, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ArrowsAltOutlined, CloseOutlined, DeleteOutlined,
  DoubleRightOutlined, EditOutlined, PlusOutlined, QuestionCircleFilled, SettingOutlined, QuestionCircleOutlined
} from '@ant-design/icons';
import CustomButton from '../../common/CustomButton/CustomButton';
import './PartAssemblerGroup.css';
import type PartItem from '../../../types/part';
import type PartGroup from '../../../types/partGroup';
import { useState } from 'react';
import { Form, Input, Select, Button } from 'antd';
import CreatePart from '../../../pages/CreatePart/CreatePart';
import Addpart from '../Addpart/Addpart';

const { Title } = Typography;

/* ---------- Table columns ---------- */
const columns: ColumnsType<PartItem> = [
  {
    title: '',
    key: 'index',
    width: 100,
    align: 'center',
    className: 'hiddenCollum',
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
    render: () => (
      <Space size="small">
        <CustomButton variant="blue" layout="iconFirst" icon={<EditOutlined />} text="Edit original" />
        <CustomButton variant="blue" layout="iconFirst" icon={<DoubleRightOutlined />} text="Quick edit" />
        <CustomButton variant="blue" layout="iconFirst" icon={<ArrowsAltOutlined />} text="Replace Part" />
        <CustomButton variant="red" layout="iconFirst" icon={<DeleteOutlined />} text="Remove" />
      </Space>
    ),
  },
];

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

/* ---------- Component ---------- */
const PartAssemblerGroup: React.FC = () => {
  // State và hàm toggle modal
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isCreatePartModalVisible, setCreatePartModalVisible] = useState(false);
  const [isAddPartModalVisible, setAddPartModalVisible] = useState(false);

  const showEditModal = () => setEditModalVisible(true);
  const handleCancel = () => setEditModalVisible(false);;

  const showCreatePartModal = () => setCreatePartModalVisible(true);
  const handleCreatePartCancel = () => setCreatePartModalVisible(false);

  const showAddPartModal = () => setAddPartModalVisible(true);
  const handleAddPartCancel = () => setAddPartModalVisible(false);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 30, marginLeft: 30 }}>
        <Title level={5} style={{ margin: 0, color: 'blue' }}>Part Assembler</Title>
        <Tooltip title="This section lets you manage part groups and parts."><QuestionCircleFilled /></Tooltip>
      </div>

      {partGroups.map((group) => (
        <div key={group.id} className="wrapper">
          <header className="headerRow">
            <div className="titleBox">
              <Title level={4} className="title">{group.name}</Title>
              <CustomButton
                variant="black"
                layout="iconFirst"
                icon={<EditOutlined />}
                text="Edit group"
                onClick={showEditModal} />
            </div>
            {/* Modal Edit Assembly Group */}
            <Modal
              title="Edit Assembly Group"
              open={isEditModalVisible}
              onCancel={handleCancel}
              footer={null}
              width={800}
            >
              <div style={{ marginBottom: 16 }}>
                <Typography.Text strong style={{ color: 'blue' }}>Standard properties</Typography.Text>
                <Tooltip title="...">
                  <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </div>
              <Form layout="vertical">
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter group name' }]}
                >
                  <Input defaultValue="Standard Group Default" />
                </Form.Item>
                <Form.Item label="Part Type" name="partType">
                  <Select placeholder="Select option...">
                    <Select.Option value="type1">Type 1</Select.Option>
                    <Select.Option value="type2">Type 2</Select.Option>
                  </Select>
                </Form.Item>
                <Button type="primary" disabled block>
                  Update Assembly Group
                </Button>
              </Form>
            </Modal>
            {/* End Modal Edit Assembly Group */}

            <div className="optionBox">
              <Checkbox defaultChecked={group.optional}>Is an optional group</Checkbox>
              <CustomButton variant="red" layout="textFirst" icon={<CloseOutlined />} text="Remove group" />
            </div>
          </header>

          <Table
            columns={columns}
            dataSource={group.parts}
            pagination={false}
            rowKey="key"
            className="table"
          />

          <div className="actionRow">
            <CustomButton
              variant="blue"
              layout="iconFirst"
              icon={<PlusOutlined />}
              text="Add Part"
              onClick={showAddPartModal}
            />


            <CustomButton
              variant="white"
              layout="iconFirst"
              icon={<PlusOutlined />}
              text="Create and Add new part"
              onClick={showCreatePartModal}
            />
            <Modal
              open={isCreatePartModalVisible}
              onCancel={handleCreatePartCancel}
              footer={null}
              width={1200}
            >
              <CreatePart />
            </Modal>
          </div>
        </div>
      ))}

      <Modal
        open={isAddPartModalVisible}
        onCancel={handleAddPartCancel}
        footer={null}
        width={1200}
      >
        <Addpart />
      </Modal>
    </>
  );
};

export default PartAssemblerGroup;
