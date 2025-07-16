import React, { useEffect, useState } from 'react';
import type { PartTypeMode } from '../../components/parts/FilterPartType/FilterPartType';
import { BarsOutlined, CheckCircleOutlined, EditOutlined, FileTextOutlined, HomeOutlined, QuestionOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import CodeBuilder from '../../components/parts/CodeBuilder/CodeBuilder';
import PartAssemblerGroup from '../../components/parts/PartAssemblerGroup/PartAssemblerGroup';
import AssemblyOutcomes from '../../components/parts/AssemblyOutcome/AssemblyOutcomes';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import RevisionAndVersion from '../../components/parts/RevisionAndVersion/RevisionAndVersion';
import { GET_PART_BY_ID, GET_PART_ENABLE_BY_ID, GET_PART_TYPES } from "../../graphQL/partQueries";
import { useQuery } from '@apollo/client';
import type PartType from '../../types/partType';

export interface ActiveBarItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
}

const ModifyPart: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [activeKey, setActiveKey] = useState<string>('code-builder');
    const [partType, setPartType] = useState('');
    const { data: typeData, loading: typeLoading, error: typeError } = useQuery(GET_PART_TYPES);
    const [versionId, setVersionId] = useState<string | null>(null);
    const location = useLocation();
    const state = location.state as { name?: string; type?: string; code?: string } | null;
    const { id } = useParams();
    console.log(id);

    const { data: enableData } = useQuery(GET_PART_ENABLE_BY_ID, {
        variables: { partId: id },
        skip: !id, 
    });
    const enable = enableData?.getLatestVersion.enable_assembly_groups

    const { data } = useQuery(GET_PART_BY_ID, { variables: { id } });
    const part = data?.getPartById;

    console.log('part', part);

    const partName = state?.name || part?.name || 'Unknown';
    const partCode = state?.code || part?.code || '';

    console.log('location.state:', location.state);
    useEffect(() => {
        const currentVersionId = searchParams.get("versionId");
        setVersionId(currentVersionId);
    }, [searchParams]);

    const fetchedPartTypes: PartType[] =
        typeData?.types?.map((t: any) => ({
            id: t.id,
            value: t.name,
            label: t.name,
            desc: 'Some description here...'
        })) ?? [];

    useEffect(() => {
        if (!part) return;

        const type = state?.type || part?.type;
        if (type) {
            setPartType(type);
        }
    }, [state, part]);


    const tabs: ActiveBarItem[] = [
        { key: 'properties', label: 'Properties', icon: <FileTextOutlined /> },
        { key: 'raw-data', label: 'Part raw data', icon: <SearchOutlined /> },
        { key: 'assembler', label: 'Part assembler', icon: <BarsOutlined /> },
        { key: 'outcome-settings', label: 'Outcome settings', icon: <SettingOutlined /> },
        { key: 'supply', label: 'Supply chain', icon: <QuestionOutlined /> },
        { key: 'code-builder', label: 'Code Builder', icon: <EditOutlined /> },
        { key: 'assembly-outcomes', label: 'Assembly Outcomes', icon: <CheckCircleOutlined /> },
        { key: 'compatible', label: 'Part compatible', icon: <QuestionOutlined /> },
        { key: 'edit', label: 'Revision & Version', icon: <EditOutlined /> },
    ];

    const [mode, setMode] = useState<PartTypeMode>('editable');


    console.log('enable Data', enable);

    if (!data || !partType) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ flex: 1 }}>
            {!searchParams.get("versionId") ? (
                <>
                    <PageHeader
                        title={partName}
                        breadcrumbs={[
                            { title: '', href: '/', icon: <HomeOutlined /> },
                            { title: 'Parts', href: '/parts' },
                            { title: `Modify`, href: '/parts/modify' },
                            { title: partName, href: `/${partName}` }
                        ]}
                        onTabChange={setActiveKey}
                        mode='read-only'
                        selectedPartType={partType}
                        code={partCode}
                    />

                    <RevisionAndVersion />
                </>
            ) : (
                <>
                    <PageHeader
                        title={`Modify Part - ${partName}`}
                        breadcrumbs={[
                            { title: '', href: '/', icon: <HomeOutlined /> },
                            { title: 'Parts', href: '/parts' },
                            { title: 'Modify', href: '/modifies' }
                        ]}
                        tabs={tabs}
                        activeKey={activeKey}
                        onTabChange={setActiveKey}
                        mode={mode}
                        selectedPartType={partType}
                        partTypes={fetchedPartTypes}
                        onSelectPartType={(value) => {
                            console.log("Selected Part Type:", value);
                            setPartType(value);
                        }}
                    />

                    {
                        activeKey === 'code-builder' ? (
                            <CodeBuilder />
                        ) : activeKey === 'assembler' ? (
                            enable && <PartAssemblerGroup />
                        ) : activeKey === 'assembly-outcomes' ? (
                            <AssemblyOutcomes />
                        ) : null
                    }
                </>
            )
            }
        </div>
    );
};

export default ModifyPart;
