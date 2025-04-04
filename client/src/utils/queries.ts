import { gql } from '@apollo/client';

export const QUERY_ANIMALS = gql`
  query getAnimals {
    animals {
    _id
    commonName
    conservationStatus
    imageLink
    scientificName
  }
  }
`;
// removed due to superfluousness
// export const QUERY_FAVORITE_ANIMALS = gql`
//   query getFavoriteAnimals($username: String!) {
//     favoriteAnimals(username: $username) {
//       _id
//       commonName
//       scientificName
//       conservationStatus
//       imageLink
//     }
//   }
// `;
export const QUERY_ME = gql`
query Me {
  me {
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
`;
