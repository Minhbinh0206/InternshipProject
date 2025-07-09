import React, { useState } from 'react';
import type { PartTypeMode } from '../../types/FilterPartType/FilterPartType';
import { BarsOutlined, CheckCircleOutlined, EditOutlined, FileTextOutlined, HomeOutlined, LoadingOutlined, QuestionOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import CodeBuilder from '../../components/parts/CodeBuilder/CodeBuilder';
import PartAssemblerGroup from '../../components/parts/PartAssemblerGroup/PartAssemblerGroup';
import AssemblyOutcomes from '../../components/parts/AssemblyOutcome/AssemblyOutcomes';

export interface ActiveBarItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
}

const ModifyPart: React.FC = () => {
    const [activeKey, setActiveKey] = useState('code-builder');

    const tabs: ActiveBarItem[] = [
        { key: 'properties', label: 'Properties', icon: <FileTextOutlined /> },
        { key: 'raw-data', label: 'Part raw data', icon: <SearchOutlined /> },
        { key: 'assembler', label: 'Part assembler', icon: <BarsOutlined /> },
        { key: 'outcome-settings', label: 'Outcome settings', icon: <SettingOutlined /> },
        { key: 'supply', label: 'Supply chain', icon: <QuestionOutlined /> },
        { key: 'code-builder', label: 'Code Builder', icon: <EditOutlined /> },
        { key: 'assembly-outcomes', label: 'Assembly Outcomes', icon: <CheckCircleOutlined /> },
        { key: 'compatible', label: 'Part compatible', icon: <QuestionOutlined /> },
    ];

    const [mode, setMode] = useState<PartTypeMode>('editable');
    const [isChecked, setChecked] = useState(false);

    return (
        <div style={{ flex: 1}}>
            <PageHeader
                title="Modify Part"
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
                onSelectPartType={() => {}}
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
        </div>
    );
};

export default ModifyPart;