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
        }
      }
    }
  }
`;
