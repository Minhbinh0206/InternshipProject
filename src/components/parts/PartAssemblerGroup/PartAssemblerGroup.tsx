import React, { useState } from 'react';
import { Table, Checkbox, Space, Typography, Tooltip, Modal, Form, Input, Select, Button } from 'antd';
import { useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  ArrowsAltOutlined, CloseOutlined, DeleteOutlined,
  DoubleRightOutlined, EditOutlined, PlusOutlined,
  QuestionCircleFilled, SettingOutlined, QuestionCircleOutlined
} from '@ant-design/icons';

import CustomButton from '../../common/CustomButton/CustomButton';
import CreatePart from '../../../pages/CreatePart/CreatePart';
import { GET_GROUPS_BY_VERSIONID, GET_PART_TYPES } from '../../../graphQL/partQueries.ts';
import type { ColumnsType } from 'antd/es/table';
import './PartAssemblerGroup.css';
import Addpart from '../Addpart/Addpart.tsx';
import { DELETE_GROUP_PART_BY_ID } from '../../../graphQL/partActions.ts';


const { Title } = Typography;

function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}

const PartAssemblerGroup: React.FC = () => {
  const query = useQueryParams();
  const versionId = query.get('versionId');

  console.log(versionId);
  const { data, loading, error, refetch } = useQuery(GET_GROUPS_BY_VERSIONID, {
    variables: { versionId },
  });

  console.log("ghghghg", data);

  const { data: partTypeData } = useQuery(GET_PART_TYPES);
  console.log(partTypeData);

  const [deleteGroupPartById] = useMutation(DELETE_GROUP_PART_BY_ID);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isCreatePartModalVisible, setCreatePartModalVisible] = useState(false);
  const [isAddPartModalVisible, setAddPartModalVisible] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  console.log("selectedGroupId:", selectedGroupId);
  
  const showEditModal = () => setEditModalVisible(true);
  const handleCancel = () => setEditModalVisible(false);

  const showCreatePartModal = () => setCreatePartModalVisible(true);
  const handleCreatePartCancel = () => setCreatePartModalVisible(false);

  const handleAddPartCancel = () => setAddPartModalVisible(false);

  const handleDeleteGroupPartById = async (groupPartId: string) => {
    const confirm = window.confirm("Co chac chan muon xoa part khoi group?");
    if(!confirm) return;

    try{
      const { data } = await deleteGroupPartById({ 
        variables: { id: parseInt(groupPartId) } }
      );

      if(data?.deleteGroupPartById) {
        alert("Xoa thanh cong");
        refetch();
      } else {
        alert("Xoa that bai");
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi khi tải dữ liệu: {error.message}</p>;

  const partGroups = data?.groups ?? [];

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      key: 'part_id',
      render: (_: any, record: any) => record.part?.id
    },
    {
      title: 'Version',
      key: 'version',
      render: (_: any, record: any) => record.version?.version_code
    },
    {
      title: 'Published Version',
      dataIndex: 'published_version',
      render: (_: any, record: any) => record.part?.selected_version?.version_code
    },
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: any) => record.part?.name
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (_: any, record: any) => record.part?.type.name
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (_: any, record: any) => record.part?.code
    },
    {
      title: <SettingOutlined style={{ float: "right" }} />,
      key: 'action',
      render: (_:any, record: any) => (
        <Space size="small" style={{ float: "right" }}>
          <CustomButton variant="blue" layout="iconFirst" icon={<EditOutlined />} text="Edit original" />
          <CustomButton variant="blue" layout="iconFirst" icon={<DoubleRightOutlined />} text="Quick edit" />
          <CustomButton variant="blue" layout="iconFirst" icon={<ArrowsAltOutlined />} text="Replace Part" />
          <CustomButton variant="red" layout="iconFirst" icon={<DeleteOutlined />} text="Remove" onClick={() => handleDeleteGroupPartById(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 30, marginLeft: 30 }}>
        <Title level={5} style={{ margin: 0, color: 'blue' }}>Part Assembler</Title>
        <Tooltip title="This section lets you manage part groups and parts."><QuestionCircleFilled /></Tooltip>
      </div>

      {partGroups.map((group: any) => (
        <div key={group.id} className="wrapper">
          <header className="headerRow">
            <div className="titleBox">
              <Title level={4} className="title">{group.name}</Title>
              <CustomButton
                variant="black"
                layout="iconFirst"
                icon={<EditOutlined />}
                text="Edit group"
                onClick={showEditModal}
              />
            </div>

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
                  <Input defaultValue={group.name} />
                </Form.Item>

                <Form.Item label="Part Type" name="partType">
                  <Select placeholder="Chọn loại part...">
                    {partTypeData?.types?.map((type: any) => (
                      <Select.Option key={type.id} value={type.id}>
                        {type.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>


                <Button type="primary" disabled block>
                  Update Assembly Group
                </Button>
              </Form>
            </Modal>

            <div className="optionBox">
              <Checkbox defaultChecked={false}>Is an optional group</Checkbox>
              <CustomButton variant="red" layout="textFirst" icon={<CloseOutlined />} text="Remove group" />
            </div>
          </header>

          <Table
            columns={columns}
            dataSource={group.groupParts}
            pagination={false}
            rowKey="id"
            className="table"
          />

          <div className="actionRow">
            <CustomButton
              variant="blue"
              layout="iconFirst"
              icon={<PlusOutlined />}
              text="Add Part"
              //onClick={showAddPartModal}
              onClick={() => {
                setSelectedGroupId(group.id);
                setAddPartModalVisible(true);
              }}
            />

            < CustomButton
              variant="white"
              layout="iconFirst"
              icon={< PlusOutlined />}
              text="Create and Add new part"
              onClick={showCreatePartModal}
            />
            <Modal
              open={isCreatePartModalVisible}
              onCancel={handleCreatePartCancel}
              footer={null}
              width={1200}
            >
              <CreatePart createModalVisible={(visible: boolean) => setCreatePartModalVisible(visible)} groupId={group.id} />
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
        {selectedGroupId &&
          <Addpart
            groupId={selectedGroupId}
            activeTab='part-assembler'
            onSuccess={() => {
              refetch();
              // handleAddPartCancel();
              setSelectedGroupId(null);
            }}
          />}

      </Modal>
    </>
  );
};

export default PartAssemblerGroup;
