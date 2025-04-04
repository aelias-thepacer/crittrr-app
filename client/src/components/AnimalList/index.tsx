interface animal {
  _id: string;
  animalType: string;
  animalName: string;
  animalImage: string;
}

interface animalListProps {
  animals: animal[];
  animalImage: string;
}

const AnimalList: React.FC<animalListProps> = ({ animals, animalImage }) => {
  if (!animals.length) {
    return <h3>No Animals Favorited Yet</h3>;
  }

  return (
    <div>
      <h3>{animalImage}</h3>
      {animals &&
        animals.map((animal) => (
          <div key={animal._id} className="card mb-3">
            <h4 className="card-header bg-primary text-light p-2 m-0">
              {animal.animalImage} <br />
            </h4>
            <div className="card-body bg-light p-2">
              <p>{animal.animalImage}</p>
            </div>
          </div>
        ))}
    </div>
  );
};
export default AnimalList;
