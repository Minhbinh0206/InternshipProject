import { gql } from "@apollo/client";

export const GET_VERSION_BY_ID = gql`
  query getVersion($id: ID!) {
        getVersion(id: $id) {
        id
        name
        type {
          name
        }
        code
        description
        version_code
        additional_fields {
            id
            name
            value
            type_group
        }
    }
  }
`;

export const GET_VERSION_BY_CODE = gql`
  query GetVersionByVersionCode($input: GetVersionByVersionCodeInput!) {
    getVersionByVersionCode(input: $input) {
      id
      name
      code
      version_code
      description
      enable_assembly_groups
      additional_fields {
        name
        value
        type_group
      }
      type {
        name
      }
      status
    }
  }
`;

export const GET_LIST_CODE_BUILDER = gql`
  query getCodeBuilderByVersion($versionId: ID!) {
    getCodeBuilderByVersion(versionId: $versionId) {
      id
      name
      rule
      isDefault
    }
  }
`;

