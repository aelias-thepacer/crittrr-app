// Import `<Link>` component from React Router for internal hyperlinks
// LOOK OVER THIS PAGE I ALMOST GARUNTEE IT IS INCORRET IN 1 WAY OR ANOTHER
// I JUST EDITED THE EXISTING THOUGHT STUFF THIS IS INCORRECT WE NEED TO EDIT THIS <3
// ITS JUST PLACEHOLDER TO FIX SOMETHING ELSE
// SOME OF THIS STUFF CAN BE DELETED I BELIEVE

import { Link } from 'react-router-dom';

interface animal {
  _id: string;
  animalType: string;
  animalName: string;
  animalImage: string;
  createdAt: string;
}

interface animalListProps {
  animals: animal[];
  animalImage: string;
}

const animalList: React.FC<animalListProps> = ({ animals, animalImage }) => {
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
              <span style={{ fontSize: '1rem' }}>
                had this thought on {new Date(Number(animal.createdAt)).toLocaleString()}
              </span>
            </h4>
            <div className="card-body bg-light p-2">
              <p>{animal.animalImage}</p>
            </div>
            {/* Create a link to this thought's page to view its comments using `<Link>` component */}
            <Link
              className="btn btn-primary btn-block btn-squared"
              to={`/thoughts/${animal._id}`}
            >
              Join the discussion on this thought.
            </Link>
          </div>
        ))}
    </div>
  );
};

export default animalList;
