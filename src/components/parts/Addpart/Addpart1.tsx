import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { SettingOutlined } from "@ant-design/icons";
import { GET_PUBLISHED_PART } from "../../../graphQL/partQueries";
import { Form, Checkbox, Typography, Input, Button } from "antd";
import SearchBar from "../../common/SearchBar";
import { TypeFilter, MoreFiltersButton } from "../PartFilters";

const { Title } = Typography;

const Addpart: React.FC = () => {
    const { loading, error, data } = useQuery(GET_PUBLISHED_PART);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi tải dữ liệu</p>;

    const partList = data?.publishedPart  ?? [];

    console.log(partList);

    //search
    const filteredPartsBySearch = partList.filter((part: any) =>
        part.name.toLowerCase().includes(search.toLowerCase()) ||
        part.code.toLowerCase().includes(search.toLowerCase())
    );

    //Filter Type
    const filteredPartsOfType = partList.filter(
        (part: any) => type === "" || part.type === type
    );

    //cả 2
    const filteredParts = partList.filter(
        (part: any) =>
            (part.name.toLowerCase().includes(search.toLowerCase()) ||
                part.code.toLowerCase().includes(search.toLowerCase())) &&
            (type === "" || part.type === type)
    );

    const handleSearch = () => {
    };

    const handleReset = () => {
        setSearch("");
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setType(e.target.value);
    };

    return (
        <div style={{ padding: 20 }}>
            <Title level={4}>Select existing part</Title>
            <SearchBar
                searchText={search}
                onSearchTextChange={setSearch}
                onSearch={handleSearch}
                onReset={handleReset}
                extraFilter={
                    <>
                        <TypeFilter value={type} onChange={handleTypeChange} />
                        <MoreFiltersButton />
                    </>
                }
            />

            <table style={{ marginTop: 20 }}>
                <thead>
                    <tr className="bg-gray-100" style={{ color: "gray" }}>
                        <th className="p-3" style={{ width: "5%" }}></th>
                        <th className="p-3">ID</th>
                        <th className="p-3" style={{ width: "30%" }}>
                            Name
                        </th>
                        <th className="p-3">Type</th>
                        <th className="p-3" style={{ width: "30%" }}>
                            Code
                        </th>
                        {/* <th className="p-3">
                            <SettingOutlined />
                        </th> */}
                    </tr>
                </thead>
                <tbody>
                    {filteredParts.map((part: any) => (
                        <tr key={`${part.id}-${part.versionId}`} className="border-b">
                            <td className="p-3 text-center">
                                <Form.Item
                                    style={{
                                        margin: 0,
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <input type="Checkbox" />
                                </Form.Item>
                            </td>
                            <td className="p-3 text-blue-600 cursor-pointer">{part.id}</td>
                            <td className="p-3 text-blue-600 cursor-pointer">{part.name}</td>
                            <td className="p-3">{part.type.name}</td>
                            <td className="p-3">{part.code}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            
        </div>
    );
};

export default Addpart;