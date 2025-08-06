import React from "react";

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

interface SelectBooleanFilterProps {
    label: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    style?: React.CSSProperties;
}

const SelectBooleanFilter: React.FC<SelectBooleanFilterProps> = ({
  label,
  value,
  onChange,
  style = {},
}) => (
  <select style={{ ...selectStyle, ...style }} value={value} onChange={onChange}>
    <option value="">{label}: Any</option>
    <option value="true">{label}: Yes</option>
    <option value="false">{label}: No</option>
  </select>
);

export default SelectBooleanFilter;