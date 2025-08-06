import React, { useState } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import PartTable from '../../components/parts/PartTable/PartTable';
import './PartsListPage.css';
import SearchBar from '../../components/common/SearchBar';
import PartFilters from '../../components/parts/PartFilters';

const PartList: React.FC = () => {
    const [filters, setFilters] = useState({
        search: "",
        type: "",
        published: "",
        isAssembler: "",
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSearch = () => {
        console.log("Searching for:", filters);
    };

    const handleReset = () => {
        setFilters({
            search: "",
            type: "",
            published: "",
            isAssembler: ""
        });
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
                onSelectPartType={() => { }}
            />
            <SearchBar
                searchText={filters.search}
                onSearchTextChange={(val) => handleFilterChange("search", val)}
                onSearch={handleSearch}
                onReset={handleReset}
                extraFilter={
                    <PartFilters
                        typeValue={filters.type}
                        onTypeChange={(e) => handleFilterChange("type", e.target.value)}
                        publishedValue={filters.published}
                        onPublishedChange={(e) => handleFilterChange("published", e.target.value)}
                        isAssemblerValue={filters.isAssembler}
                        onIsAssemblerChange={(e) => handleFilterChange("isAssembler", e.target.value)}
                    />
                }
            />
            <PartTable filters={filters} />
        </>
    );
};

export default PartList;
