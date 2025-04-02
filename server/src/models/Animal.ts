import { Schema, model, Document } from 'mongoose';

// Define an interface for the Animal document
interface IAnimal extends Document {
  commonName: string;
  scientificName: string;
  conservationStatus: string;
  imageLink: string;
}

// Define the schema for the Animal document
const animalSchema = new Schema<IAnimal>(
  {
    commonName: {
      type: String,
      required: true,
    },
    scientificName: {
      type: String,
      required: true,
    },
    conservationStatus: {
      type: String,
      required: false,
    },
    imageLink: {
      type: String,
      required: true,
    },
  },
);

const Animal = model<IAnimal>('Animal', animalSchema);

export default Animal;
