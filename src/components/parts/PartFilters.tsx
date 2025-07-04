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

const PartFilters = () => (
    <>
        <select style={selectStyle}>
            <option value="">Type: Any</option>
            <option value="standard">Standard</option>
            <option value="luminaire">Luminaire</option>
        </select>
        <select style={selectStyle}>
            <option value="">Published: Any</option>
        </select>
        <select style={selectStyle}>
            <option value="">Latest version only: Any</option>
        </select>
        <button style={buttonStyle}>+ More filters</button>
    </>
);

export default PartFilters;