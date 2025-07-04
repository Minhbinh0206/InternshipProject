import React from "react";
import { SearchOutlined } from "@ant-design/icons";

interface SearchBarProps {
    searchText: string;
    onSearchTextChange: (value: string) => void;
    onSearch: () => void;
    onReset: () => void;
    extraFilter?: React.ReactNode;
}

const SearchBar: React.FC<SearchBarProps> = ({
    searchText,
    onSearchTextChange,
    onSearch,
    onReset,
    extraFilter,
}) => (
    <div
        style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 25,
        }}
    >
        <div
            style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
            }}
        >
            <SearchOutlined
                style={{
                    position: "absolute",
                    left: 12,
                    color: "#bdbdbd",
                    fontSize: 18,
                }}
            />
            <input
                value={searchText}
                onChange={(e) => onSearchTextChange(e.target.value)}
                placeholder="Search"
                style={{
                    padding: "8px 12px 8px 36px",
                    border: "1px solid #e0e0e0",
                    borderRadius: 3,
                    fontSize: 15,
                    width: 220,
                    outline: "none",
                    fontFamily: "inherit",
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch();
                }}
            />
        </div>
        {extraFilter}
        {onReset && (
            <button
                onClick={onReset}
                style={{
                    background: "none",
                    border: "none",
                    color: "#2d6cdf",
                    fontWeight: 500,
                    fontSize: 15,
                    cursor: "pointer",
                    marginLeft: 8,
                }}
            >
                Reset
            </button>
        )}
    </div>
);

export default SearchBar;