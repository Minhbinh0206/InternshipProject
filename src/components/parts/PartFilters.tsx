import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PART_TYPES } from "../../graphQL/partQueries";

const selectStyle: React.CSSProperties = {
  border: "1px solid #e0e0e0",
  borderRadius: 3,
  padding: "8px 12px",
  fontSize: 15,
  color: "#2d6cdf",
  background: "#fff",
  fontFamily: "inherit",
  outline: "none",
  marginRight: 4,
  minWidth: 150,
  cursor: "pointer",
};

const buttonStyle: React.CSSProperties = {
  padding: "8px 12px",
  border: "1px solid #e0e0e0",
  borderRadius: 3,
  background: "#fff",
  color: "#2d6cdf",
  fontWeight: 500,
  fontSize: 15,
  cursor: "pointer",
  marginLeft: 4,
  whiteSpace: "nowrap",
};

interface PartFiltersProps {
  typeValue?: string;
  onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const TypeFilter = ({ value, onChange }: { value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => {
  const { loading, error, data } = useQuery(GET_PART_TYPES);

  if (loading) return <select style={selectStyle}><option>Loading...</option></select>;
  if (error) return <select style={selectStyle}><option>Error</option></select>;

  return (
    <select style={selectStyle} value={value} onChange={onChange}>
      <option value="">Type: Any</option>
      {data.types.map((type: any) => (
        <option key={type.name} value={type.name}>
          {type.name}
        </option>
      ))}
    </select>
  );
};

export const PublishedFilter = ({ value, onChange }: { value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
  <select style={selectStyle} value={value} onChange={onChange}>
    <option value="">Published: Any</option>
  </select>
);

export const LatestVersionFilter = ({ value, onChange }: { value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
  <select style={selectStyle} value={value} onChange={onChange}>
    <option value="">Latest version only: Any</option>
  </select>
);

export const MoreFiltersButton = ({ onClick }: { onClick?: () => void }) => (
  <button style={buttonStyle} onClick={onClick}>
    + More filters
  </button>
);

const PartFilters: React.FC<PartFiltersProps> = ({
  typeValue,
  onTypeChange,
}) => (
  <>
    <TypeFilter value={typeValue} onChange={onTypeChange} />
    <PublishedFilter />
    <LatestVersionFilter />
    <MoreFiltersButton />
  </>
);

export default PartFilters;