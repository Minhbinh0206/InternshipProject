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
          version_code
          updated_at
          additional_fields {
            name
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
      assembler_id
      groupParts {
        id
        part {
        id
          name
          type {
            name
          }
          code
        }
        version_id
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

