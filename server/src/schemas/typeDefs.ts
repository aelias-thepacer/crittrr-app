const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    favoriteAnimals: [Animal]
  }

  type Animal {
    _id: ID
    commonName: String
    scientificName: String
    conservationStatus: String
    imageLink: String
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }
  
  type Auth {
    token: ID!
    user: User
  }

  type Query {
    animals: [Animal]
    me: User
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    addAnimal(commonName: String!, scientificName: String, conservationStatus: String, imageLink: String): Animal
    removeAnimal(animalId: ID!): Animal
  }
`;

export default typeDefs;
