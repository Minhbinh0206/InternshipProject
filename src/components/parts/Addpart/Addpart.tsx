import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { SettingOutlined } from "@ant-design/icons";
import { FILTER_PARTS, GET_PUBLISHED_PART } from "../../../graphQL/partQueries";
import { Form, Checkbox, Typography, Input, Button, message } from "antd";

import SearchBar from "../../common/SearchBar";
import { TypeFilter } from "../PartFilters";
import CustomButton from "../../common/CustomButton/CustomButton";
import { useMutation } from "@apollo/client";
import { ADD_PART_TO_GROUP } from "../../../graphQL/partActions";
import { toast } from "react-toastify";
import { DELETE_GROUP_PART_BY_ID } from "../../../graphQL/partActions";
import Loading from "../../layout/Loading/Loading";

interface AddpartProps {
    groupId: string;
    selectedType?: string | null; 
    onSuccess?: () => void;
    activeTab: string;
    existingParts: any[];
}

const { Title } = Typography;

const Addpart: React.FC<AddpartProps> = ({ groupId, onSuccess, selectedType, existingParts }) => {
    const { loading, error, data, refetch } = useQuery(GET_PUBLISHED_PART, {
        variables: {
            groupId: groupId,
        },

    });
    const [addPartToGroup] = useMutation(ADD_PART_TO_GROUP);

    const [search, setSearch] = useState("");
    const [type, setType] = useState(selectedType || "");
    const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
    const [selectedParts, setSelectedParts] = useState<any[]>([]);
    console.log("Selected Type ID:", selectedType);

    useEffect(() => {
        if (selectedType) {
            setType(selectedType);
        }
    }, [selectedType]);

    if (loading) return <Loading />;
    if (error) return <p>Lỗi tải dữ liệu</p>;
    const [type, setType] = useState("");
    const [deleteGroupPartById] = useMutation(DELETE_GROUP_PART_BY_ID);
    const [checkedParts, setCheckedParts] = useState<number[]>([]);


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

    const filteredParts = partList.filter(
        (part: any) =>
            (part.name.toLowerCase().includes(search.toLowerCase()) ||
                part.code.toLowerCase().includes(search.toLowerCase())) &&
            (type === "" || part.type === type)
    );

    useEffect(() => {
        if (existingParts && data?.publishedPart) {
            const checkedIds = existingParts.map((p: any) => Number(p.part.id));
            setCheckedParts(checkedIds);
        }
    }, [data, existingParts ]);


    const handleSearch = () => {
    };

    const handleReset = () => {
        setSearch("");
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setType(e.target.value);
    };

    const handleCheckboxChange = (part: any, checked: boolean) => {
        setCheckedParts(prev =>
            checked
                ? [...prev, part.id]
                : prev.filter(id => id !== part.id)
        );
    };

    const handleAccept = async () => {
        const existingPartIds = existingParts.map((p: any) => Number(p.part.id)); // đảm bảo là number

        const partsToAdd = checkedParts.filter(id => !existingPartIds.includes(id));
        const partsToRemove = existingPartIds.filter(id => !checkedParts.includes(id));
        try {
            // 1. Add mới
            if (partsToAdd.length > 0) {
                const input = partsToAdd.map(partId => ({
                    group_id: groupId,
                    part_id: partId
                }));

                await addPartToGroup({ variables: { input } });
            }


            // 2. Gỡ part cũ
            for (const id of partsToRemove) {
                const partRemove = existingParts.find((p: any) => Number(p.part.id) === Number(id))

                console.log('partRemove', partRemove);
                console.log(partRemove.id);
                
                await deleteGroupPartById({ variables: { id: Number(partRemove.id) } });
            }

            console.log("✅ To add:", partsToAdd);
            console.log("✅ To remove:", partsToRemove);

            toast.success("Cập nhật part thành công!");
            await refetch();
            onSuccess?.();
        } catch (error) {
            toast.error("Lỗi khi cập nhật part.");
        }
    };

    if (loading) return <Loading />;
    if (error) return <p>Lỗi tải dữ liệu</p>;

    console.log('Exist part', existingParts);
    console.log('Checked part', checkedParts);

    //cả 2
    const filteredParts = partList.filter(
        (part: any) =>
            (part.name.toLowerCase().includes(search.toLowerCase()) ||
                part.code.toLowerCase().includes(search.toLowerCase())) &&
            (type === "" || part.type === type)
    );

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
                        <TypeFilter value={type} onChange={handleTypeChange} valueKey="name"/>
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
                                        checked={checkedParts.includes(part.id)}
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