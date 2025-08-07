import React, { useEffect, useState } from 'react';
import { Table, Checkbox, Space, Typography, Tooltip, Modal, Form, Input, Select, Button } from 'antd';
import { useLocation, useParams } from 'react-router-dom';

import { useMutation, useQuery } from '@apollo/client';
import {
  ArrowsAltOutlined, CloseOutlined, DeleteOutlined,
  EditOutlined, PlusOutlined,
  QuestionCircleFilled, SettingOutlined, QuestionCircleOutlined
} from '@ant-design/icons';

import CustomButton from '../../common/CustomButton/CustomButton';
import CreatePart from '../../../pages/CreatePart/CreatePart';
import { GET_GROUPS_BY_VERSIONID, GET_PART_TYPES } from '../../../graphQL/partQueries.ts';
import type { ColumnsType } from 'antd/es/table';
import './PartAssemblerGroup.css';
import Addpart from '../Addpart/Addpart.tsx';
import { DELETE_GROUP_PART_BY_ID, CREATE_GROUP, UPDATE_GROUP, DELETE_GROUP, CREATE_PART, CREATE_AND_ADD_PART_TO_GROUP } from '../../../graphQL/partActions.ts';
import { TypeFilter } from '../PartFilters.tsx';
import { toast } from 'react-toastify';
import Loading from '../../layout/Loading/Loading.tsx';

const { Title } = Typography;

interface PartAssemblerGroupProps {
  versionId?: string;
}

const PartAssemblerGroup: React.FC<PartAssemblerGroupProps> = ({ versionId }) => {
  const partId = useParams<{ id: string }>();

  const [form] = Form.useForm();

  const { data, loading, error, refetch } = useQuery(GET_GROUPS_BY_VERSIONID, {
    variables: { versionId },
  });
  const [groupRefetch, setGroupRefetch] = useState(0);
  const { data: partTypeData } = useQuery(GET_PART_TYPES);
  const [deleteGroupPartById] = useMutation(DELETE_GROUP_PART_BY_ID);
  const [createGroup] = useMutation(CREATE_GROUP);
  const [updateGroup] = useMutation(UPDATE_GROUP);
  const [deleteGroup] = useMutation(DELETE_GROUP);
  const [createAndAddPart] = useMutation(CREATE_AND_ADD_PART_TO_GROUP);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  console.log('Type assembler: ', selectedType);
  
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editMode, setEditMode] = useState<'create' | 'edit'>('edit');
  const [currentGroupData, setCurrentGroupData] = useState<any>(null);
  const [isCreatePartModalVisible, setCreatePartModalVisible] = useState(false);
  const [isAddPartModalVisible, setAddPartModalVisible] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  // const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  // const [type, setType] = useState<string | null>(null);
  const [type, setType] = useState<string>('');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  console.log("selectedGroupId:", selectedGroupId);

  useEffect(() => {
    for (const typeId of partTypeData?.types ?? []) {
      if (typeId.id === selectedTypeId) {
        setType(typeId.name);
        break;

      }
    }
  })

  const showEditModal = (group: any) => {
    setEditMode('edit');
    setCurrentGroupData(group);
    setEditModalVisible(true);
    form.setFieldsValue({
      name: group.name,
      partType: group.type_id ? Number(group.type_id) : undefined,
    });
  }

  useEffect(() => {
    refetch();
  }, [groupRefetch]);


  const showCreateGroupModal = () => {
    setEditMode('create');
    setCurrentGroupData(null);
    setEditModalVisible(true);
    form.resetFields();
  }

  const handleCancel = () => setEditModalVisible(false);
  const showCreatePartModal = () => setCreatePartModalVisible(true);
  const handleCreatePartCancel = () => setCreatePartModalVisible(false);
  const handleAddPartCancel = () => setAddPartModalVisible(false);

  const handleDeleteGroupPartById = async (groupPartId?: number | string) => {
    const id = parseInt(String(groupPartId), 10);

    if (!id || isNaN(id)) {
      console.error("Invalid groupPartId:", groupPartId);
      return;
    }

    const confirm = window.confirm("Bạn có chắc chắn muốn xóa part khỏi group?");
    if (!confirm) return;

    try {
      const { data } = await deleteGroupPartById({
        variables: { id }
      });

      if (data?.deleteGroupPartById) {
        toast.success("Xóa thành công");
        const handleDeleteGroupPartById = async (groupPartId?: number | string) => {
          const id = parseInt(String(groupPartId), 10);

          if (!id || isNaN(id)) {
            console.error("Invalid groupPartId:", groupPartId);
            return;
          }

          const confirm = window.confirm("Bạn có chắc chắn muốn xóa part khỏi group?");
          if (!confirm) return;

          try {
            const { data } = await deleteGroupPartById({
              variables: { id }
            });

            if (data?.deleteGroupPartById) {
              setGroupRefetch((prev: any) => prev + 1);
              toast.success("Xóa thành công");
              refetch();
            } else {
              toast.error("Xóa thất bại");
            }
          } catch (err) {
            console.error("Lỗi khi xóa:", err);
          }
        };
        refetch();
      } else {
        toast.error("Xóa thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };

  console.log("versionId", versionId);

  const handleDeleteGroup = async (groupId: number) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa group này?");

    if (!confirm) return;
    try {
      const { data } = await deleteGroup({
        variables: { id: groupId }
      });

      if (data?.deleteGroup) {
        toast.success("Xóa group thành công");
        refetch();
      } else {
        toast.error("Xóa group thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi xóa group:", error);
      toast.error("Lỗi khi xóa group");
    }
  }


  if (loading) return <Loading />;
  if (error) return <p>Lỗi khi tải dữ liệu: {error.message}</p>;

  const partGroups = [...(data?.groups ?? [])]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());


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
      render: (_: any, record: any) => (
        <Space size="small" style={{ float: "right" }}>
          <CustomButton variant="blue" layout="iconFirst" icon={<EditOutlined />} text="Edit original" />
          <CustomButton variant="blue" layout="iconFirst" icon={<ArrowsAltOutlined />} text="Replace Part" />
          <CustomButton
            variant="red"
            layout="iconFirst"
            icon={<DeleteOutlined />}
            text="Remove"
            onClick={() => {
              handleDeleteGroupPartById(record.id);
            }
            } />
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
                onClick={() => showEditModal(group)}
              />
            </div>

            <div className="optionBox">
              {/* <Checkbox defaultChecked={false}>Is an optional group</Checkbox> */}
              <CustomButton variant="red" layout="textFirst" icon={<CloseOutlined />} text="Remove group" onClick={() => handleDeleteGroup(group.id)} />
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
              onClick={async () => {
                await refetch(); // 💡 Đảm bảo partGroups được cập nhật trước
                setSelectedGroupId(group.id);
                console.log("Group ID", group.id);
                setSelectedTypeId(group.type_id);
                console.log("Group Type ID:", group.type_id);
                setAddPartModalVisible(true);
              }}

            />

            <CustomButton
              variant="white"
              layout="iconFirst"
              icon={< PlusOutlined />}
              text="Create and Add new part"
              onClick={showCreatePartModal}
            />

          </div>

          {/* Modal Create and Add new part  */}
          <Modal
            open={isCreatePartModalVisible}
            onCancel={handleCreatePartCancel}
            footer={null}
            width={1200}
          >
            <div style={{ marginBottom: 24 }}>
              <CreatePart
                groupId={group.id}
                createModalVisible={(visible: boolean) => setCreatePartModalVisible(visible)}
                hideHeader
                hideFooter
                isDuplicate={false}
              />
            </div>
          </Modal>
          {/* End Modal Create and Add new part  */}
        </div>
      ))}

      <CustomButton variant="blue" layout="textFirst" icon={<CloseOutlined />} text="Create group"
        onClick={showCreateGroupModal} />

      {/* Modal edit, create */}
      <Modal
        title={editMode === 'edit' ? "Edit Assembly Group" : "Create Assembly Group"}
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
        <Form layout="vertical" form={form} onFinish={async (values) => {
          const input = {
            name: values.name,
            type_id: values.partType || null,
            version_id: versionId,
            assembler_id: partId.id,
            is_optional: false,
          };

          try {
            if (editMode === 'edit') {
              await updateGroup({
                variables: {
                  input: {
                    ...input,
                    id: currentGroupData.id
                  }
                }
              });
              toast.success("Cập nhật group thành công!");
            } else {
              await createGroup({
                variables: {
                  input: {
                    ...input,
                    version_id: versionId,
                    assembler_id: partId.id,
                  },
                },
              });
              toast.success("Tạo group mới thành công!");
            }

            refetch();
            setEditModalVisible(false);
            form.resetFields();
          } catch (error) {
            console.error(`${editMode === 'edit' ? 'Update' : 'Create'} group error:`, error);
          }
        }}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter group name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Part Type" name="partType">
            <Select placeholder="Chọn loại part...">
              {partTypeData?.types?.map((type: any) => (
                <Select.Option key={type.id} value={Number(type.id)}>
                  {type.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            {editMode === 'edit' ? 'Update Assembly Group' : 'Create Assembly Group'}
          </Button>
        </Form>
      </Modal >
      {/* End Modal edit */}

      {/* Modal Add part  */}
      <Modal
        open={isAddPartModalVisible}
        onCancel={handleAddPartCancel}
        footer={null}
        width={1200}
      >
        {selectedGroupId &&
          <Addpart
            groupId={selectedGroupId}
            selectedType={type}
            activeTab='part-assembler'
            existingParts={data?.groups?.find((g: any) => g.id === selectedGroupId)?.groupParts ?? []}
            onSuccess={() => {
              refetch();
              setAddPartModalVisible(false);
              setSelectedGroupId(null);
            }}
          />}

      </Modal>
    </>
  );
};


export default PartAssemblerGroup;
