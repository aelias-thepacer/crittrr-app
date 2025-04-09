import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
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
mutation addUser($input: UserInput!) {
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
mutation addAnimal($animalData: animalInput) {
  addAnimal(animalInput: $animalData) {
    email
  }
}
`;

export const REMOVE_ANIMAL = gql`
mutation removeAnimal($animalData: animalInput) {
  removeAnimal(animalInput: $animalData) {
    email
  }
}
`;
