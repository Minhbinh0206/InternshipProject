import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { SettingOutlined } from "@ant-design/icons";
import { GET_PUBLISHED_PART } from "../../../graphQL/partQueries";
import { Form, Checkbox, Typography, Input, Button, message } from "antd";
import SearchBar from "../../common/SearchBar";
import { TypeFilter, MoreFiltersButton } from "../PartFilters";
import CustomButton from "../../common/CustomButton/CustomButton";
import { useMutation } from "@apollo/client";
import { ADD_PART_TO_GROUP } from "../../../graphQL/partActions";

interface AddpartProps {
    groupId: string;
    onSuccess?: () => void;
    activeTab: string;
}

const { Title } = Typography;

const Addpart: React.FC<AddpartProps> = ({ groupId, onSuccess, activeTab }) => {
    const { loading, error, data } = useQuery(GET_PUBLISHED_PART, {
        variables: { groupId: groupId },
    });
    const [addPartToGroup] = useMutation(ADD_PART_TO_GROUP);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [selectedParts, setSelectedParts] = useState<any[]>([]);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi tải dữ liệu</p>;

    console.log("fgffg", data);
    // Lấy ds part publish
    // const partList = data.parts.flatMap((part: any) =>
    //     part.revisions.flatMap((revision: any) =>
    //         revision.versions
    //             .filter((v: any) => v.status === "Published")
    //             .map((v: any) => ({
    //                 id: Number(part.id),
    //                 revisionId: Number(revision.id),
    //                 versionId: Number(v.id),
    //                 name: v.name,
    //                 code: v.code ?? "",
    //                 type: v.type?.name ?? "",
    //             }))
    //     )
    // );

    // const partList = data.parts.map((part: any) => {
    //     let allVersions: any[] = [];

    //     part.revisions.forEach((revision: any) => {
    //         allVersions = [...allVersions, ...revision.versions.map((v: any) => ({
    //             ...v,
    //             revisionId: revision.id
    //         }))];
    //     });

    //     const publishedVersions = allVersions.find((v: any) => v.status === "Published");

    //     if (!publishedVersions) return null;

    //     return {
    //         id: Number(part.id),
    //         revisionId: Number(publishedVersions?.revisionId),
    //         versionId: Number(publishedVersions?.id),
    //         name: publishedVersions?.name,
    //         code: publishedVersions?.code ?? "",
    //         type: publishedVersions?.type?.name ?? "",
    //     };
    // }).filter(Boolean)

    const partList = data?.publishedPart?.map((part: any) => {
        const version = part.revisions[0]?.versions[0];
        if (!version) return null;

        return {
            id: Number(part.id),
            revisionId: Number(part.revisions[0]?.id),
            versionId: Number(version.id),
            name: version.name,
            code: version.code ?? "",
            type: version.type?.name ?? "",
        };

    }).filter(Boolean);

    console.log('1111111', partList);

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

    const handleCheckboxChange = (part: any, checked: boolean) => {
        if (checked) {
            setSelectedParts([...selectedParts, part]);
        } else {
            setSelectedParts(selectedParts.filter(p => p.versionId !== part.versionId));
        }
    };

    const handleAccept = async () => {
        const input = selectedParts.map(part => ({
            group_id: groupId,
            part_id: part.id,
            // version_id: part.versionId
        }));

        try {
            const { data } = await addPartToGroup({ variables: { input } });
            console.log("Thêm thành công:", data.addPartToGroup);
            message.success("Thêm part vào group thành công!");
            onSuccess?.();
        } catch (err) {
            message.error("Lỗi khi thêm part vào group.");
        }
        activeTab = 'part-assembler'
        window.location.reload();
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
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleCheckboxChange(part, e.target.checked)}
                                    />
                                </Form.Item>
                            </td>
                            <td className="p-3 text-blue-600 cursor-pointer">{part.id}</td>
                            <td className="p-3 text-blue-600 cursor-pointer">{part.name}</td>
                            <td className="p-3">{part.type}</td>
                            <td className="p-3">{part.code}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <CustomButton
                className='button-modal'
                variant='blue'
                layout='noIcon'
                text='Add Part'
                onClick={handleAccept}
            />

        </div>
    );
};

export default Addpart;