import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { SettingOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import CustomButton from "../../common/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import { GET_PARTS } from "../../../graphQL/partQueries";
import { DELETE_PART } from "../../../graphQL/partActions";
import "./PartTable.css";

interface PartTableProps {
  searchText: string;
  typeFilter?: string;
}

const PartTable: React.FC<PartTableProps> = ({ searchText, typeFilter }) => {
  const navigate = useNavigate();
  const [deletePartMutation] = useMutation(DELETE_PART, {
    refetchQueries: [{ query: GET_PARTS }],
  });
  const { loading, error, data } = useQuery(GET_PARTS);
  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi tải dữ liệu</p>;

  const partList = data.parts.map((part: any) => {
    let allVersions: any[] = [];

    part.revisions.forEach((revision: any) => {
      allVersions = [...allVersions, ...revision.versions.map((v: any) => ({
        ...v,
        revisionId: revision.id,
      }))];
    });

    const preferredVersion =
      allVersions.find((v: any) => v.status === 'Published') ??
      allVersions.find((v: any) => v.status === 'Draft');

    if (!preferredVersion) return null;

    return {
      id: Number(part.id),
      revisionId: Number(preferredVersion.revisionId),
      versionId: Number(preferredVersion.id),
      name: preferredVersion.name,
      code: preferredVersion.code ?? '',
      type: preferredVersion.type?.name ?? '',
    };
  }).filter(Boolean);

  const handleDelete = async (partId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this part?");
    if (!confirmed) return;

    try {
      await deletePartMutation({
        variables: { id: partId },
      });
      console.log(`Deleted part with ID: ${partId}`);
    } catch (error) {
      console.error("Error deleting part:", error);
      alert("Failed to delete part.");
    }
  };

  const handleEdit = (part: { id: number; revisionId?: number; versionId?: number; name: string; type: string; code: string; }) => {
    navigate(
      `/parts/modify/${part.id}`,
      { state: { name: part.name, type: part.type, code: part.code, id: part.id } }
    );
  };

  const handleDuplicate = (part: { id: number }) => {
    navigate(
      `/parts/duplicate/${part.id}`,
    );
  };

  const filteredList = partList.filter((part: any) => {
    const matchesSearch =
      part.name.toLowerCase().includes(searchText.toLowerCase()) ||
      part.code.toLowerCase().includes(searchText.toLowerCase()) ||
      part.type.toLowerCase().includes(searchText.toLowerCase());

    const matchesType =
      !typeFilter || part.type.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesType;
  });

  return (
    <table>
      <thead>
        <tr className="bg-gray-100" style={{ color: "gray" }}>
          <th className="p-3">ID</th>
          <th className="p-3" style={{ width: "30%" }}>Name</th>
          <th className="p-3">Type</th>
          <th className="p-3" style={{ width: "30%" }}>Code</th>
          <th className="p-3"><SettingOutlined /></th>
        </tr>
      </thead>
      <tbody>
        {filteredList.map((part: any, index: number) => (
          <tr key={index} className="border-b">
            <td
              className="p-3 text-blue-600 cursor-pointer"
            >
              {part.id}
            </td>
            <td
              className="p-3 text-blue-600 cursor-pointer"
            >
              {part.name}
            </td>
            <td className="p-3">{part.type}</td>
            <td className="p-3">{part.code}</td>
            <td className="p-3 flex gap-2">
              <CustomButton
                variant="blue"
                layout="iconFirst"
                icon={<EditOutlined />}
                text="Edit"
                style={{ marginRight: 10 }}
                onClick={() => handleEdit(part)}
              />

              <CustomButton
                variant="red"
                layout="iconFirst"
                icon={<DeleteOutlined />}
                text="Delete"
                style={{ marginRight: 10 }}
                onClick={() => handleDelete(part.id)}
              />

              <CustomButton
                variant="white"
                layout="iconFirst"
                icon={<CopyOutlined />}
                text="Duplicate"
                onClick={() => handleDuplicate(part)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PartTable;
