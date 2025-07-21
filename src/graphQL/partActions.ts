import { gql } from '@apollo/client';

export const CREATE_PART = gql`
  mutation CreatePart($input: CreatePartInput!) {
    createPart(input: $input) {
      id
      name
      description
      type{
        id
      }
      revisions {
        versions {
          enable_assembly_groups
        }
      }
    }
  }
`;

export const UPDATE_VERSION_STATUS = gql`
  mutation UpdateVersionStatus($id: ID!) {
    updateVersionStatus(id: $id) {
      id
      status
    }
  }
`;

export const CREATE_REVISION = gql`
  mutation createRevision($id: ID!) {
    createRevision(id: $id) {
      id
      revision_code
    }
  }
`;