import { User, Animal } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js'; 

// Define types for the arguments
interface AddUserArgs {
  input:{
    username: string;
    email: string;
    password: string;
  }
}

interface LoginUserArgs {
  email: string;
  password: string;
}

/*
interface UserArgs {
  username: string;
}
*/

interface AnimalArgs {
  animalId: string;
  commonName: string;
  scientificName: string;
  conservationStatus: string;
  imageLink: string;
}

interface AddAnimalArgs {
  input:{
    commonName: string;
    scientificName: string;
    conservationStatus: string;
    imageLink: string;
  }
}

const resolvers = {
  Query: {
    // Query to get the authenticated user's information
    // The 'me' query relies on the context to check if the user is authenticated
    me: async (_parent: any, _args: any, context: any) => {
      // If the user is authenticated, find and return the user's information along with their favorite animals
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });
        return userData;
      }
      // If the user is not authenticated, throw an AuthenticationError
      throw new AuthenticationError('Not logged in.');
    },

    // Query to get all animals
    animals: async () => {
      // Find and return all animals from the database
      return Animal.find();
    },
    // removed due to superfluousness
    // Query to get a specific user's favorite animals
    // favoriteAnimals: async (_parent: any, { username }: UserArgs) => {
    //   // Find the user by username and populate their favoriteAnimals
    //   const params = username ? { username } : {};
    //   return User.find(params).populate('favoriteAnimals');
    // }
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      // Create a new user with the provided username, email, and password
      const user = await User.create({ ...input });
    
      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);
    
      // Return the token and the user
      return { token, user };
    },
    
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      // Find a user with the provided email
      const user = await User.findOne({ email });
    
      // If no user is found, throw an AuthenticationError
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);
    
      // If the password is incorrect, throw an AuthenticationError
      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);
    
      // Return the token and the user
      return { token, user };
    },
    addAnimal: async (_parent: any, input: AddAnimalArgs, context: any) => {
      if (context.user) {
        // add animal to favoriteAnimals array
        const favedAnimal = await Animal.create({ ...input });
        // add animal to user's favoriteAnimals array
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { favoriteAnimals: favedAnimal._id } },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      return
      // else throw AuthenticationError;
      // ('You need to be logged in!');
    },
    removeAnimal: async (_parent: any, { animalId }: AnimalArgs, context: any) => {
      if (context.user) {
        // remove animal from user's favoriteAnimals array
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { favoriteAnimals: animalId } },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

export default resolvers;
