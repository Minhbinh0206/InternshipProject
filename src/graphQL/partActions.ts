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

export const DELETE_PART = gql`
  mutation DeletePart($id: ID!) {
    deletePart(id: $id)
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

export const DUPLICATE_PART = gql`
 mutation duplicateFullPart($part_id: ID!, $code: String!) {
  duplicateFullPart(part_id: $part_id, code: $code) {
    id
    name
    code
    revisions {
      id
      versions {
        id
        name
        code
      }
    }
  }
 }
 `;

// GROUP
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

export const DELETE_GROUP_PART_BY_ID = gql`
  mutation DeleteGroupPartById($id: Int!) {
    deleteGroupPartById(id: $id) 
}
`;

export const CREATE_GROUP = gql`
  mutation CreateGroup($input: CreateGroupInput!) {
    createGroup(input: $input) {
      id
      name
      type_id
    }
  }
`;

export const UPDATE_GROUP = gql`
  mutation UpdateGroup($input: EditGroupInput!) {
    updateGroup(input: $input) {
      id
      name
      is_optional
      type_id
  }
}
`;

export const DELETE_GROUP = gql`
  mutation DeleteGroup($id: ID!) {
    deleteGroup(id: $id)
  }
`;

export const CREATE_AND_ADD_PART_TO_GROUP = gql`
  mutation createAndAddPartToGroup($input: CreatePartInput!) {
    createAndAddPartToGroup(input: $input) {
      id
      name
      code
    }
  }
`;





export const ADD_PROPERTY_TO_CODEBUILDER = gql`
  mutation AddPropertyToCodebuilder($input: AddPropertyToCodebuilderInput!) {
    addPropertyToCodebuilder(input: $input) {
        id
        name
        rule
    }
  }
`;


