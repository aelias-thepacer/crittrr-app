import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation Mutation($input: UserInput!) {
  addUser(input: $input) {
    user {
      username
      _id
    }
    token
  }
}
`;

export const ADD_ANIMAL = gql`
  mutation AddAnimal($commonName: String!, $scientificName: String, $conservationStatus: String, $imageLink: String) {
    addAnimal(commonName: $commonName, scientificName: $scientificName, conservationStatus: $conservationStatus, imageLink: $imageLink) {
      _id
      commonName
      scientificName
      conservationStatus
      imageLink
  }
}
`;

export const REMOVE_ANIMAL = gql`
  mutation RemoveAnimal($animalId: ID!) {
    removeAnimal(animalId: $animalId) {
      _id
      commonName
      scientificName
      conservationStatus
      imageLink
    }
  }
`;
