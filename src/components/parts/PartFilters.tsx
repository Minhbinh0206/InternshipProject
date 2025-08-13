import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PART_TYPES } from "../../graphQL/partQueries";
import SelectBooleanFilter from "../common/SelectBooleanFilter";

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

interface PartFiltersProps {
  typeValue?: string;
  onTypeChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  publishedValue?: string;
  onPublishedChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isAssemblerValue?: string;
  onIsAssemblerChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isAssemblyValue?: string;
  onIsAssemblyChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const TypeFilter = ({
  value,
  onChange,
  onChangeType,
  valueKey = 'id',
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeType?: (type: string) => void; 
  valueKey?: 'id' | 'name';
}) => {
  const { loading, error, data } = useQuery(GET_PART_TYPES);

  if (loading) return <select style={selectStyle}><option>Loading...</option></select>;
  if (error) return <select style={selectStyle}><option>Error</option></select>;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e);
    onChangeType?.(e.target.value);

    console.log('Type: ' , e.target.name);
  };

  return (
    <select style={selectStyle} value={value} onChange={handleChange}>
      <option value="">Type: Any</option>
      {/* {value && selectedType && <option value={value}>{selectedType.name}</option> }  */}
      {data.types.map((type: any) => (
        <option key={type.id} value={type.name}>
          {type.name}
        </option>
      ))}
    </select>
  );
};

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
  isAssemblyValue,
  onIsAssemblyChange,
}) => (
  <>
    <TypeFilter value={typeValue} onChange={onTypeChange} />
    <SelectBooleanFilter label="Published" value={publishedValue} onChange={onPublishedChange} />
    <SelectBooleanFilter label="Assembler" value={isAssemblerValue} onChange={onIsAssemblerChange} />
    <SelectBooleanFilter label="Assembly" value={isAssemblyValue} onChange={onIsAssemblyChange} />
  </>
);

export default PartFilters;