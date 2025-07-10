import React, { useEffect, useState } from 'react';
import type { PartTypeMode } from '../../components/parts/FilterPartType/FilterPartType';
import { BarsOutlined, CheckCircleOutlined, EditOutlined, FileTextOutlined, HomeOutlined, QuestionOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import CodeBuilder from '../../components/parts/CodeBuilder/CodeBuilder';
import PartAssemblerGroup from '../../components/parts/PartAssemblerGroup/PartAssemblerGroup';
import AssemblyOutcomes from '../../components/parts/AssemblyOutcome/AssemblyOutcomes';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import RevisionAndVersion from '../../components/parts/RevisionAndVersion/RevisionAndVersion';
import { GET_PART_BY_ID } from "../../graphQL/partQueries";
import { useQuery } from '@apollo/client';

export interface ActiveBarItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
}

const ModifyPart: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [activeKey, setActiveKey] = useState<string>('code-builder');

    const [versionId, setVersionId] = useState<string | null>(null);

    useEffect(() => {
        const currentVersionId = searchParams.get("versionId");
        setVersionId(currentVersionId);
    }, [searchParams]);

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
    const location = useLocation();
    const state = location.state as { name?: string; type?: string; code?: string } | null;

    const { id } = useParams();
    const { data } = useQuery(GET_PART_BY_ID, { variables: { id } });

    console.log('data', data);

    if (!data) {
        return <div>Loading...</div>;
    }

    const part = data?.getPartById;

    const partName = state?.name || part?.name || 'Unknown';
    const partType = state?.type || part?.type || '';
    const partCode = state?.code || part?.code || '';

    console.log('location.state:', location.state);

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
                        selectedPartType=''
                        partTypes={[]}
                        onSelectPartType={() => { }}
                    />

                    {
                        activeKey === 'code-builder' ? (
                            <CodeBuilder />
                        ) : activeKey === 'assembler' ? (
                            <PartAssemblerGroup />
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
