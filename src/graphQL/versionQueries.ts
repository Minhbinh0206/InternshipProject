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
  query GetVersionByVersionCode($input: GetVerisionByVersionCodeInput!) {
    getVerisionByVersionCode(input: $input) {
      id
      name
      code
      version_code
      type {
        name
      }
      status
    }
  }
`;