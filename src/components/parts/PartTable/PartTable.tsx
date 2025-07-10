import React from "react";
import { useQuery } from "@apollo/client";
import { SettingOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import CustomButton from "../../common/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import { GET_PARTS } from "../../../graphQL/partQueries";
import "./PartTable.css";

const PartTable: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_PARTS);
  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi tải dữ liệu</p>;

  const handleView = (part: { id: number; revisionId?: number; versionId?: number }) => {
    navigate(`/parts/modify/${part.id}/${part.revisionId ?? 3}/${part.versionId ?? "3.0"}`);
  };

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

  console.log(JSON.stringify(data.parts, null, 2));

  const handleEdit = (part: { id: number; revisionId?: number; versionId?: number; name: string; type: string; code: string; }) => {
    navigate(
      `/parts/modify/${part.id}`,
      { state: { name: part.name, type: part.type, code: part.code } }
    );
  };

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
        {partList.map((part: any, index: number) => (
          <tr key={index} className="border-b">
            <td
              className="p-3 text-blue-600 cursor-pointer"
              onClick={() => handleView(part)}
            >
              {part.id}
            </td>
            <td
              className="p-3 text-blue-600 cursor-pointer"
              onClick={() => handleView(part)}
            >
              {part.version}
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
              <CustomButton variant="red" layout="iconFirst" icon={<DeleteOutlined />} text="Delete" style={{ marginRight: 10 }} />
              <CustomButton variant="white" layout="iconFirst" icon={<CopyOutlined />} text="Duplicate" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PartTable;
