import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      email
      favoriteAnimals {
        _id
        commonName
        conservationStatus
        imageLink
        scientificName
      }
      password
      username
    }
  }
}
`;

export const ADD_USER = gql`
mutation AddUser($input: UserInput!) {
  addUser(input: $input) {
    token
    user {
      _id
      email
      password
      username
      favoriteAnimals {
        _id
        commonName
        conservationStatus
        imageLink
        scientificName
      }
    }
  }
}
`;

export const ADD_ANIMAL = gql`
mutation AddAnimal($commonName: String!, $scientificName: String, $conservationStatus: String, $imageLink: String) {
  addAnimal(commonName: $commonName, scientificName: $scientificName, conservationStatus: $conservationStatus, imageLink: $imageLink) {
    _id
    commonName
    conservationStatus
    imageLink
    scientificName
  }
}
`;

export const REMOVE_ANIMAL = gql`
mutation RemoveAnimal($animalId: ID!) {
  removeAnimal(animalId: $animalId) {
    _id
    commonName
    conservationStatus
    imageLink
    scientificName
  }
}
`;
