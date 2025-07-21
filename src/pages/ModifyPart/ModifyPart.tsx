import React, { useEffect, useState } from 'react';
import {
  BarsOutlined,
  CheckCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  HomeOutlined,
  QuestionOutlined,
  SearchOutlined,
  SettingOutlined
} from '@ant-design/icons';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import CodeBuilder from '../../components/parts/CodeBuilder/CodeBuilder';
import PartAssemblerGroup from '../../components/parts/PartAssemblerGroup/PartAssemblerGroup';
import AssemblyOutcomes from '../../components/parts/AssemblyOutcome/AssemblyOutcomes';
import Properties from '../../components/parts/Properties/Properties';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import RevisionAndVersion from '../../components/parts/RevisionAndVersion/RevisionAndVersion';
import {
  GET_PART_BY_ID,
  GET_PART_ENABLE_BY_ID,
} from "../../graphQL/partQueries";
import { useQuery } from '@apollo/client';

export interface ActiveBarItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

const ModifyPart: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeKey, setActiveKey] = useState<string>('properties');
  const [versionId, setVersionId] = useState<string | null>(null);
  const { id } = useParams();
  const location = useLocation();
  const state = location.state as { name?: string; type?: string; code?: string } | null;

  const { data: enableData } = useQuery(GET_PART_ENABLE_BY_ID, {
    variables: { partId: id },
    skip: !id,
  });

  const versionDetails = enableData?.getLatestVersion;
  const enable = versionDetails?.enable_assembly_groups;
  const versionCode = versionDetails?.version_code || '';
  const versionStatus = versionDetails?.status || '';

  const versionLabel = versionCode && versionStatus
    ? `${versionCode} (${versionStatus})`
    : versionId;

  const { data } = useQuery(GET_PART_BY_ID, { variables: { id } });
  const part = data?.getPartById;

  const partName = state?.name || part?.name || 'Unknown';
  const partCode = state?.code || part?.code || '';
  const partType = state?.type || part?.type || '';
  
  // Lấy versionId từ query string
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

  console.log(`Part Type: ${partType}, Part Name: ${partName}, Part Code: ${partCode}`);
  

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
              { title: 'Modify', href: '/modifies' },
              { title: partName, href: `/${partName}` },
              { title: versionLabel, href: `/${versionId}` },
            ]}
            tabs={tabs}
            activeKey={activeKey}
            onTabChange={setActiveKey}
            mode='modify'
            selectedPartType={partType}
          />
          {
            activeKey === 'properties' ? (
              <Properties code={partCode} partType={partType} />
            ) : activeKey === 'code-builder' ? (
              <CodeBuilder />
            ) : activeKey === 'assembler' ? (
              enable && <PartAssemblerGroup />
            ) : activeKey === 'assembly-outcomes' ? (
              <AssemblyOutcomes />
            ) : null
          }
        </>
      )}
    </div>
  );
};

export default ModifyPart;
