import React, { useState } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import PartTable from '../../components/parts/PartTable/PartTable';
import './PartsListPage.css';
import SearchBar from '../../components/common/SearchBar';
import PartFilters from '../../components/parts/PartFilters';

const PartList: React.FC = () => {
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [publishedValue, setPublishedValue] = useState("");
    const [isAssembler, setIsAssembler] = useState("");

    const handleSearch = () => {
        console.log("Searching for:", search);
    };

    const handleReset = () => {
        setSearch("");
        setSelectedType("");
    };

    return (
        <>
            <PageHeader
                title="Parts"
                breadcrumbs={[
                    { title: '', href: '/', icon: <HomeOutlined /> },
                    { title: 'Parts', href: '/parts' },
                ]}
                partTypes={[]}
                selectedPartType=''
                onSelectPartType={() => {}}
            />
            <SearchBar
                searchText={search}
                onSearchTextChange={setSearch}
                onSearch={handleSearch}
                onReset={handleReset}
                extraFilter={
                <PartFilters 
                typeValue={selectedType}
                onTypeChange={(e) => setSelectedType(e.target.value)}
                publishedValue={publishedValue}
                onPublishedChange={(e) => setPublishedValue(e.target.value)}
                />
            }
            />
            <PartTable 
                searchText={search} 
                typeFilter={selectedType}
                publishedFilter={publishedValue}
                />
        </>
    );
};

export default PartList;
