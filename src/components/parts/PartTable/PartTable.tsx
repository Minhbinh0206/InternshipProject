import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import CustomButton from "../../common/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import { FILTER_PARTS } from "../../../graphQL/partQueries";
import { DELETE_PART } from "../../../graphQL/partActions";
import "./PartTable.css";
import Loading from "../../layout/Loading/Loading";
import { toast } from "react-toastify";

interface PartTableProps {
  searchText: string;
  typeFilter?: string;
  publishedFilter?: string | boolean;
  isAssembler?: string;
}

interface PartItem {
  id: number;
  name: string;
  code: string;
  type: string;
  versionId?: number;
  revisionId?: number;
  status?: string;
}

const PartTable: React.FC<PartTableProps> = ({
  searchText,
  typeFilter,
  publishedFilter,
  isAssembler,
}) => {

  const navigate = useNavigate();


  const filter: any = {};
  if (searchText) filter.keyword = searchText;
  if (typeFilter) filter.type_id = typeFilter;
  if (publishedFilter !== undefined && publishedFilter !== "") {
    filter.published = publishedFilter === "true";
  }
  if (isAssembler !== undefined && isAssembler !== "") {
    filter.is_assembler = isAssembler === "true";
  }


  const [deletePartMutation] = useMutation(DELETE_PART, {
    refetchQueries: [
      {
        query: FILTER_PARTS,
        variables: { filter },
      },
    ],
  });

  const { loading, error, data } = useQuery(FILTER_PARTS, {
    variables: { filter },
  });


  if (loading) return <Loading />;
  if (error) return <p>Lỗi tải dữ liệu + {error.message}  </p>;

  const partList: PartItem[] = (data?.filterParts || []).map((part: any) => {
    let allVersions: any[] = [];
    if (Array.isArray(part.revisions)) {
      part.revisions.forEach((revision: any) => {
        allVersions = [
          ...allVersions,
          ...(revision.versions || []).map((v: any) => ({
            ...v,
            revisionId: revision.id,
          })),
        ];
      });
    }
    const preferredVersion =
      allVersions.find((v) => v.status === "Published") ||
      allVersions.find((v) => v.status === "Draft") ||
      allVersions[0];

    if (!preferredVersion) return null;

    return {
      id: Number(part.id),
      revisionId: Number(preferredVersion.revisionId),
      versionId: Number(preferredVersion.id),
      name: preferredVersion.name,
      code: preferredVersion.code ?? "",
      type: preferredVersion.type?.name ?? "",
    };
  }).filter(Boolean)
    .reverse();


  const handleDelete = async (partId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this part?");
    if (!confirmed) return;

    try {
      await deletePartMutation({ variables: { id: partId } });
      console.log(`Deleted part with ID: ${partId}`);
    } catch (error) {
      console.error("Error deleting part:", error);
      toast.error("Failed to delete part.");
    }

  };

  const handleEdit = (part: PartItem) => {
    navigate(`/parts/modify/${part.id}`, {
      state: {
        name: part.name,
        type: part.type,
        code: part.code,
        id: part.id,
      },
    });
  };

  const handleDuplicate = (part: PartItem) => {
    navigate(`/parts/duplicate/${part.id}`);
  };

  return (
    <table>
      <thead>
        <tr className="bg-gray-100" style={{ color: "gray" }}>
          <th className="p-3">ID</th>
          <th className="p-3" style={{ width: "30%" }}>Name</th>
          <th className="p-3">Type</th>
          <th className="p-3" style={{ width: "30%" }}>Code</th>
          <th className="p-3">
            <SettingOutlined />
          </th>
        </tr>
      </thead>
      <tbody>
        {partList.map((part, index) => (
          <tr key={index} className="border-b">
            <td className="p-3 text-blue-600 cursor-pointer">{part.id}</td>
            <td className="p-3 text-blue-600 cursor-pointer">{part.name}</td>
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
