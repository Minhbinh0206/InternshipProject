import React, { useEffect, useState } from 'react';
import type { PartTypeMode } from '../../components/parts/FilterPartType/FilterPartType';
import { BarsOutlined, CheckCircleOutlined, EditOutlined, FileTextOutlined, HomeOutlined, QuestionOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import CodeBuilder from '../../components/parts/CodeBuilder/CodeBuilder';
import PartAssemblerGroup from '../../components/parts/PartAssemblerGroup/PartAssemblerGroup';
import AssemblyOutcomes from '../../components/parts/AssemblyOutcome/AssemblyOutcomes';
import { useSearchParams } from 'react-router-dom';
import RevisionAndVersion from '../../components/parts/RevisionAndVersion/RevisionAndVersion';

export interface ActiveBarItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
}

const ModifyPart: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [activeKey, setActiveKey] = useState<string>('code-builder');
    const name = useState('I dont know');

    // cập nhật activeKey nếu có query param "key"
    useEffect(() => {
        const keyParam = searchParams.get("key");
        if (keyParam) setActiveKey(keyParam);
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
        { key: 'edit', label: 'Revision & Version', icon: <EditOutlined /> }, // 👉 nếu muốn hiện tab edit
    ];

    const [mode, setMode] = useState<PartTypeMode>('editable');

    return (
        <div style={{ flex: 1 }}>
            {
                activeKey === 'edit' ? (
                    <>
                        <PageHeader
                            title="Modify Part - I dont know"
                            breadcrumbs={[
                                { title: '', href: '/', icon: <HomeOutlined /> },
                                { title: 'Parts', href: '/parts' },
                                { title: `Modify`, href: '/modify' },
                                { title: `Modify - I dont know`, href: '/I-dont-know' }
                            ]}
                            onTabChange={setActiveKey}
                            mode='read-only'
                            selectedPartType=''
                            partTypes={[]}
                            onSelectPartType={() => { }}
                        />

                        <RevisionAndVersion />
                    </>
                ) : (
                    <>
                        <PageHeader
                            title="Modify Part - I dont know"
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
