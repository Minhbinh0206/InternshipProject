import { gql } from "@apollo/client";

export const GET_PARTS = gql`
  query {
    parts {
      id
      name
      type{
        name
      }
      code
      revisions {
        id
        versions {
          id
          name
          code
          status
          type {
            name
          }
        }
      }
    }
}
`;

export const GET_PART_TYPES = gql`
  query {
    types {
      id
      name
    }
  }
`;

export const GET_PART_BY_ID = gql`
  query GetPartById($id: ID!) {
    getPartById(id: $id) {
      id
      selected_version {
          id
          status
          version_code
          description
          code
          enable_assembly_groups
          type {
            id
            name
          }
          name
          additional_fields {
            name
            value
            type_group
          }
        }
      revisions {
        id
        revision_code
        updated_at
        latestVersion {
          id
          status
          version_code
          code
          type {
            name
          }
          name
        }
        creator {
          email
        }
        versions {
          id
          name
          type {
            name
          }
          code
          version_code
          updated_at
          additional_fields {
            name
            type_group
          }
          creator {
            email
          }
          status
        }
      }

    }
  }
`;

export const GET_PART_ENABLE_BY_ID = gql`
  query getLatestVersion($partId: ID!) {
    getLatestVersion(partId: $partId) {
      version_code
      status
      id
      enable_assembly_groups
    }
  }
`;

export const GET_GROUPS_BY_VERSIONID = gql`
  query groups($versionId: ID!) {
    groups(versionId: $versionId) {
      id
      name
      type_id
      assembler_id
       groupParts {
            id
            version {
                version_code
            }
            part {
                id
                name
                code
                selected_version {
                    version_code
                }
                type {
                    name
                }
            } 
        }
    }
  }
`;

export const GET_PUBLISHED_PART = gql`
  query publishedPart ($groupId: ID!){
    publishedPart (groupId: $groupId){
      id
      revisions {
        id
        versions {
          id
          name
          code
          status
          type {
            name
          }
        }
      }
    }
  }
`;

export const GET_ADDITIONAL_FIELDS_GROUPS = gql`
  query getAdditionalFields($groupId: ID!) {
    getAdditionalFieldsFromGroup(groupId: $groupId) {
        name
        version{
          name 
          code
          type {
            name
          }
        }
    }
}
`;

export const FILTER_PARTS = gql`
  query FilterParts($filter: PartFilterInput) {
    filterParts(filter: $filter) {
      id
      revisions {
        versions {
          id
          status
          name
          code
          type {
            name
          }
        }
      }
    }
  }
`;

export const VALIDATE_CODE = gql`
  query validateGeneratedCode($codebuilderId: ID!) {
    validateGeneratedCode(codebuilderId: $codebuilderId)
  }
`;

export const GET_CODE_BY_CODEBUILDER = gql`
  query GetCodeByCodebuilder($codebuilderId: ID!) {
    getCodeByCodebuilder(codebuilderId: $codebuilderId) {
      generatedCode
    }
  }
`;





