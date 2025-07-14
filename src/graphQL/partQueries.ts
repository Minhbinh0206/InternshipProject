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
        creator {
          email
        }
        versions {
          id
          name
          updated_at
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
  query GetPartEnableById($id: ID!) {
    getPartById(id: $id) {
      revisions {
        id
        versions {
          id
          enable_assembly_groups
        }
      }
    }
  }
`;

export const GET_TYPES = gql`
  query GetTypes {
     types {
      name
    }
  }
`;


