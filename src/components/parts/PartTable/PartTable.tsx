import React, { useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { SettingOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import CustomButton from "../../common/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import { FILTER_PARTS } from "../../../graphQL/partQueries";
import { DELETE_PART } from "../../../graphQL/partActions";
import Loading from "../../layout/Loading/Loading";
import { toast } from "react-toastify";
import "./PartTable.css";

interface Filters {
  search: string;
  type?: string;
  published?: string | boolean;
  isAssembler?: string;
}

interface PartItem {
  id: number;
  name: string;
  code: string;
  type: string;
  versionId?: number;
  revisionId?: number;
}

interface PartTableProps {
  filters: Filters;
}

const mapFiltersToGraphQL = (filters: Filters) => {
  const gqlFilter: any = {};
  if (filters.search) gqlFilter.keyword = filters.search;
  if (filters.type) gqlFilter.type_id = filters.type;
  if (filters.published !== "") gqlFilter.published = filters.published === "true";
  if (filters.isAssembler !== "") gqlFilter.is_assembler = filters.isAssembler === "true";
  return gqlFilter;
};

const extractPreferredVersion = (part: any) => {
  const versions = (part.revisions || []).flatMap((r: any) =>
    (r.versions || []).map((v: any) => ({ ...v, revisionId: r.id }))
  );

  return versions.find((v) => v.status === "Published")
    || versions.find((v) => v.status === "Draft")
    || versions[0];
};

const PartTable: React.FC<PartTableProps> = ({ filters }) => {
  const navigate = useNavigate();
  const gqlFilter = useMemo(() => mapFiltersToGraphQL(filters), [filters]);

  const [deletePart] = useMutation(DELETE_PART, {
    refetchQueries: [{ query: FILTER_PARTS, variables: { filter: gqlFilter } }],
  });

  const { loading, error, data } = useQuery(FILTER_PARTS, {
    variables: { filter: gqlFilter },
  });

  if (loading) return <Loading />;
  if (error) return <p>Lỗi tải dữ liệu: {error.message}</p>;

  const partList: PartItem[] = (data?.filterParts || [])
    .map((part: any) => {
      const v = extractPreferredVersion(part);
      return v
        ? {
            id: Number(part.id),
            revisionId: Number(v.revisionId),
            versionId: Number(v.id),
            name: v.name,
            code: v.code ?? "",
            type: v.type?.name ?? "",
          }
        : null;
    })
    .filter(Boolean)
    .reverse();

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this part?")) return;
    try {
      await deletePart({ variables: { id } });
      toast.success("Part deleted successfully");
    } catch (err) {
      toast.error("Failed to delete part");
      console.error(err);
    }
  };

  const goTo = (path: string, state?: any) => navigate(path, { state });

  return (
    <table>
      <thead>
        <tr className="bg-gray-100 text-gray-600">
          <th className="p-3">ID</th>
          <th className="p-3" style={{ width: "30%" }}>Name</th>
          <th className="p-3">Type</th>
          <th className="p-3" style={{ width: "30%" }}>Code</th>
          <th className="p-3"><SettingOutlined /></th>
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
                onClick={() => goTo(`/parts/modify/${part.id}`, part)}
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
                onClick={() => goTo(`/parts/duplicate/${part.id}`)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PartTable;

