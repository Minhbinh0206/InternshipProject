import { gql } from "@apollo/client";

export const UPDATE_PART = gql`
  mutation UpdatePart($input: UpdatePartInput!) {
    updatePart(input: $input) {
      id
      name
      version_code
      status
      additional_fields {
        name
        value
        data_type
        type_group
      }
    }
  }
`;

export const DELETE_VERSION = gql`
    mutation deleteDraftVersion($id: ID!) {
        deleteDraftVersion(version_id: $id)
    }
`;

export const UPDATE_STANDARD_FIELD = gql`
  mutation UpdateStandardFieldByVersionCode($input: VersionFieldUpdateInput!) {
    updateStandardFieldByVersionCode(input: $input) {
      id
      name
      description
      code
    }
  }
`;
