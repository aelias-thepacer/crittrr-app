import { useQuery } from '@apollo/client';

import animalList from '../components/AnimalList/index.tsx';

import { QUERY_ANIMALS } from '../utils/queries.ts';

const HomePage = () => {
  const { loading, data } = useQuery(QUERY_ANIMALS);
  const animal = data?.animals || [];

  return (
    <main>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: '1px solid #1a1a1a' }}
        >
          < h1>Welcome to Crittrr!</h1>
        </div>
        <div className="col-12 col-md-8 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <h2>Do you like this animal?</h2>
              <h3>"Click ❤️ to add to favorites!"</h3>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <div>
                <img 
                src="https://via.placeholder.com/150" 
                alt="Animal" 
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '10px' }} 
                />
              </div>
              <button style={{ padding: '10px', backgroundColor: 'darkorange', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                ❌
              </button>
              <button style={{ padding: '10px', backgroundColor: 'lightgreen', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                ❤️
              </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
