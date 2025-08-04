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
  publishedValue?: string;
  onPublishedChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isAssemblerValue?: string;
  onIsAssemblerChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const TypeFilter = ({ 
  value, 
  onChange, 
  valueKey ='id', 
} : { 
  value?: string; 
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
  valueKey?: 'id' | 'name';
}) => {
  const { loading, error, data } = useQuery(GET_PART_TYPES);

  if (loading) return <select style={selectStyle}><option>Loading...</option></select>;
  if (error) return <select style={selectStyle}><option>Error</option></select>;

  const selectedType = data.types.find((type: any) => type[valueKey] === value);

  return (
    <select style={selectStyle} value={value} onChange={onChange}>
      <option value="">Type: Any</option>
      {/* {value && selectedType && <option value={value}>{selectedType.name}</option> }  */}
      {data.types.map((type: any) => (
        <option key={type.id} value={type[valueKey]}>
          {type.name}
        </option>
      ))}
    </select>
  );
};

export const PublishedFilter = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <select style={selectStyle} value={value} onChange={onChange}>
    <option value="">Published: Any</option>
    <option value="true">Published: Yes</option>
    <option value="false">Published: No</option>
  </select>
);


export const IsAssembler = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <select style={selectStyle} value={value} onChange={onChange}>
    <option value="">Assembler: Any</option>
    <option value="true">Assembler: Yes</option>
    <option value="false">Assembler: No</option>
  </select>
);

export const IsAssembly = ({ value, onChange }: { value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
  <select style={selectStyle} value={value} onChange={onChange}>
    <option value="">Assembly: Any</option>
    <option value="">Assembly: Yes</option>
    <option value="">Assembly: No</option>
  </select>
);
// export const MoreFiltersButton = ({ onClick }: { onClick?: () => void }) => (
//   <button style={buttonStyle} onClick={onClick}>
//     + More filters
//   </button>
// );

const PartFilters: React.FC<PartFiltersProps> = ({
  typeValue,
  onTypeChange,
  publishedValue,
  onPublishedChange,
  isAssemblerValue,
  onIsAssemblerChange,
}) => (
  <>
    <TypeFilter value={typeValue} onChange={onTypeChange} />
    <PublishedFilter value={publishedValue} onChange={onPublishedChange} />
    <IsAssembler value={isAssemblerValue} onChange={onIsAssemblerChange} />
    <IsAssembly /> 
  </>
);

export default PartFilters;