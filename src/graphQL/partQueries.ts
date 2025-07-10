import { gql } from "@apollo/client";

export const GET_PARTS = gql`
  query {
    parts {
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

export const GET_PART_BY_ID = gql`
  query GetPartById($id: ID!) {
    getPartById(id: $id) {
      id
      revisions {
        id
        revision_code
        versions {
          id
          name
          status
        }
      }
    }
  }
`;