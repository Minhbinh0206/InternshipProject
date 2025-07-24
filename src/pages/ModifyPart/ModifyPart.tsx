import React, { useEffect, useState } from 'react';
import {
  BarsOutlined,
  CheckCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  HomeOutlined,
  SettingOutlined
} from '@ant-design/icons';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import CodeBuilder from '../../components/parts/CodeBuilder/CodeBuilder';
import PartAssemblerGroup from '../../components/parts/PartAssemblerGroup/PartAssemblerGroup';
import AssemblyOutcomes from '../../components/parts/AssemblyOutcome/AssemblyOutcomes';
import Properties from '../../components/parts/Properties/Properties';
import RevisionAndVersion from '../../components/parts/RevisionAndVersion/RevisionAndVersion';

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { GET_PART_BY_ID } from '../../graphQL/partQueries';
import { GET_VERSION_BY_CODE } from '../../graphQL/versionQueries';

export interface ActiveBarItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

const ModifyPart: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('properties');
  const navigate = useNavigate();
  const { id, revisionId, versionCode } = useParams<{
    id: string;
    revisionId?: string;
    versionCode?: string;
  }>();

  console.log(`ModifyPart: id=${id}, revisionId=${revisionId}, versionCode=${versionCode}`);

  // Get Part by ID
  const { data: partData, loading: partLoading } = useQuery(GET_PART_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const part = partData?.getPartById;
  const selectedVersion = part?.selected_version;

  // Get version data by versionCode (if exists)
  const { data: versionData, loading: versionLoading } = useQuery(GET_VERSION_BY_CODE, {
    variables: {
      input: {
        partId: Number(id),
        revisionId: Number(revisionId),
        versionCode: versionCode,
      },
    },
    skip: !id || !revisionId || !versionCode,
  });

  const version = versionData?.getVerisionByVersionCode;

  // Prefer data from versionCode if available
  const partCode = versionCode ? version?.code || '' : selectedVersion?.code || '';
  const partType = versionCode ? version?.type?.name || '' : selectedVersion?.type?.name || '';
  const versionLabel = version?.version_code && version?.status
    ? `${version.version_code} (${version.status})`
    : version?.version_code || versionCode;

  const enable = version?.enable_assembly_groups;

  const tabs: ActiveBarItem[] = [
    { key: 'properties', label: 'Properties', icon: <FileTextOutlined /> },
    { key: 'assembler', label: 'Part assembler', icon: <BarsOutlined /> },
    { key: 'outcome-settings', label: 'Outcome settings', icon: <SettingOutlined /> },
    { key: 'code-builder', label: 'Code Builder', icon: <EditOutlined /> },
    { key: 'assembly-outcomes', label: 'Assembly Outcomes', icon: <CheckCircleOutlined /> },
  ];

  if (partLoading || (versionCode && versionLoading)) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ flex: 1 }}>
      {!versionCode ? (
        <>
          <PageHeader
            title={partCode}
            breadcrumbs={[
              { title: '', href: '/', icon: <HomeOutlined /> },
              { title: 'Parts', href: '/parts' },
              { title: 'Modify', href: '/parts/modify' },
              { title: partCode, href: `/${partCode}` }
            ]}
            onTabChange={setActiveKey}
            mode="read-only"
            selectedPartType={partType}
            code={partCode}
          />
          <RevisionAndVersion />
        </>
      ) : (
        <>
          <PageHeader
            title={`Modify Part - ${partCode}`}
            breadcrumbs={[
              { title: '', href: '/', icon: <HomeOutlined /> },
              { title: 'Parts', href: '/parts' },
              { title: 'Modify', href: '/parts/modify' },
              { title: partCode, href: `/parts/${id}` },
              {
                title: versionLabel,
                href: `/parts/modify/${id}/${revisionId}/${versionCode}`,
              },
            ]}
            tabs={tabs}
            activeKey={activeKey}
            onTabChange={setActiveKey}
            mode="modify"
            selectedPartType={partType}
          />
          {activeKey === 'properties' ? (
            <Properties
              id={id || ''}
              revisionId={revisionId || ''}
              versionCode={versionCode || ''}
            />
          ) : activeKey === 'code-builder' ? (
            <CodeBuilder />
          ) : activeKey === 'assembler' ? (
            enable && <PartAssemblerGroup versionId={version.id}/>
          ) : activeKey === 'assembly-outcomes' ? (
            <AssemblyOutcomes />
          ) : null}
        </>
      )}
    </div>
  );
};

export default ModifyPart;
