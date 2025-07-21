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


export const ADD_PART_TO_GROUP = gql`
  mutation AddPartToGroup($input: [CreateGroupPartInput!]!) {
    addPartToGroup(input: $input) {
      id
      group_id
      part_id
      version_id
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