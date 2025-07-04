import React, { useEffect } from "react";
//import { useDispatch, useSelector } from "react-redux";
//import { fetchParts } from "../../../redux/slices/partsSlice";
//import { RootState, AppDispatch } from "../../../redux/store";
import { SettingOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import CustomButton from "../../CustomButton/CustomButton";
import './PartTable.css';

const parts = [
    { id: 1, name: "Part A", type: "Standard", code: "A001" },
    { id: 2, name: "Part B", type: "Luminaire", code: "B002" },
    { id: 3, name: "Part C", type: "Standard", code: "C003" }
];

const PartTable: React.FC = () => {
    // const dispatch = useDispatch<AppDispatch>();
    // const parts = useSelector((state: RootState) => state.parts.list);
    // const status = useSelector((state: RootState) => state.parts.status);

    // useEffect(() => {
    //     dispatch(fetchParts());
    // }, [dispatch]);

    return (
        <table>
            <thead >
                <tr className="bg-gray-100" style={{ color: 'gray' }}>
                    <th className="p-3">ID</th>
                    <th className="p-3" style={{ width: '30%' }}>Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3" style={{ width: '30%' }}>Code</th>
                    <th className="p-3"><SettingOutlined /></th>
                </tr>
            </thead>
            <tbody>
                {parts.map((part) => (
                    <tr key={part.id} className="border-b">
                        <td className="p-3 text-blue-600">{part.id}</td>
                        <td className="p-3">{part.name}</td>
                        <td className="p-3">{part.type}</td>
                        <td className="p-3">{part.code}</td>
                        <td className="p-3 flex gap-2">
                            <CustomButton variant='blue' layout='iconFirst' icon={<EditOutlined />} text='Edit' style={{ marginRight: '5px' }} />
                            <CustomButton variant='red' layout='iconFirst' icon={<DeleteOutlined />} text='Delete' style={{ marginRight: '5px' }} />
                            <CustomButton variant='white' layout='iconFirst' icon={<CopyOutlined />} text='Duplicate' style={{ color: 'blue' }} />
                        </td>
                    </tr>
                ))}

            </tbody>
        </table>
    );
};

export default PartTable;

