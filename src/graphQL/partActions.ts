import { gql } from '@apollo/client';

export const CREATE_PART = gql`
  mutation CreatePart($input: CreatePartInput!) {
    createPart(input: $input) {
      id
      name
      type{
        id
      }
    }
  }
`;
