import { useQuery } from '@apollo/client';
import { QUERY_ANIMALS } from '../utils/queries.ts';

//import { saveAnimal, getSavedAnimals } from '../utils/localStorage.ts';
// For when Stuart adds the localStorage page

interface AnimalType {
  _id: string,
  commonName: string,
  scientificName: string,
  conservationStatus: string,
  imageLink: string
}

const HomePage = () => {
  const { loading, data } = useQuery(QUERY_ANIMALS);
  const animals: AnimalType[] = data?.animals || [];

  return (
    <main>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: '1px solid #1a1a1a' }}
        >
          < h1>Welcome to Crittrr!</h1>
        </div>
        <div className="mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <h2>Do you like this animal?</h2>
              <h3>"Click ❤️ to add to favorites!"</h3>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {animals.map((theAnimal: AnimalType) =>
                  <div
                    key={theAnimal._id}
                    style={{
                      width: '250px',
                      backgroundColor: '#fff',
                      borderRadius: '16px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      overflow: 'hidden',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      fontFamily: 'sans-serif',
                      margin: '10px',
                    }}
                  >
                    <img
                      src={theAnimal.imageLink}
                      alt={theAnimal.commonName}
                      style={{
                        width: '160px',
                        height: '160px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        marginBottom: '12px',
                      }}
                    />
                    <h5 style={{ fontSize: '18px', margin: '6px 0', fontWeight: '600' }}>
                      {theAnimal.commonName}
                    </h5>
                    <p style={{ fontStyle: 'italic', color: '#555', margin: '4px 0' }}>
                      {theAnimal.scientificName}
                    </p>
                    <p style={{ color: '#777', fontSize: '14px', margin: '4px 0 12px' }}>
                      {theAnimal.conservationStatus}
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        style={{
                          padding: '10px 16px',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '16px',
                        }}
                      >
                        ❌
                      </button>
                        <button
                        style={{
                          padding: '10px 16px',
                          backgroundColor: '#2ecc71',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '16px',
                        }}
                        onClick={() => {
                          const favoriteAnimals = JSON.parse(localStorage.getItem('favoriteAnimals') || '[]');
                          if (!favoriteAnimals.some((animal: AnimalType) => animal._id === theAnimal._id)) {
                          favoriteAnimals.push(theAnimal);
                          localStorage.setItem('favoriteAnimals', JSON.stringify(favoriteAnimals));
                          alert(`${theAnimal.commonName} added to favorites!`);
                          } else {
                          alert(`${theAnimal.commonName} is already in favorites!`);
                          }
                        }}
                        >
                        ❤️
                        </button>
                    </div>
                  </div>

                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
