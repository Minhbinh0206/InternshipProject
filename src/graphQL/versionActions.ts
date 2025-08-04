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

export const EDIT_RULE_CODE_BUILDER = gql`
  mutation storeRuleToCodebuilder ($input: StoreRuleToInput!) {
    storeRuleToCodebuilder(input: $input) {
        id 
        name
        rule
    }
}`;

export const UPDATE_FIELDS_CODE_BUILDER = gql`
mutation updateCodebuilder($input: UpdateCodebuilderInput!) {
    updateCodebuilder(input: $input) {
        name
        rule
        isDefault
    }
}`;

export const DELETE_CODE_BUILDER = gql`
  mutation deleteCodebuilder($id: ID!) {
      deleteCodebuilder(id: $id)
  }`;

export const CREATE_CODEBUILDER = gql`
  mutation createCodebuilder($input: CreateCodebuilderInput!){
    createCodebuilder(input: $input){
        id 
        name
        rule
        isDefault
    }
}`;
