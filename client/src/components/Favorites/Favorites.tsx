import { useEffect, useState } from 'react';
import { AnimalType } from '../../interfaces/AnimalType';

function Favorites() {
  const [favorites, setFavorites] = useState<AnimalType[]>([]);

  useEffect(() => {
    const favoriteAnimals = JSON.parse(localStorage.getItem('favoriteAnimals') || '[]');
    setFavorites(favoriteAnimals);
  }, []);

  return (
    <div>
      <h2>Favorites: {favorites.length}</h2>
      <div className="scroll-container">
        {favorites.map((animal) => (
          <div className="card" key={animal._id}>
            <img src={animal.imageLink} alt={animal.commonName} />
            <h3>{animal.commonName}</h3>
            <p><em>{animal.scientificName}</em></p>
            <p>Status: {animal.conservationStatus}</p>
          </div>
        ))}
      </div>

      <style>{`
        .scroll-container {
          display: flex;
          overflow-x: auto;
          padding: 1rem;
          gap: 1rem;
          scroll-snap-type: x mandatory;
        }

        .card {
          flex: 0 0 auto;
          width: 200px;
          border: 1px solid #ccc;
          border-radius: 12px;
          padding: 1rem;
          background: #fff;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          scroll-snap-align: start;
        }

        .card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
        }

        .card h3 {
          margin: 0.5rem 0 0.2rem;
          font-size: 1.1rem;
        }

        .card p {
          margin: 0.2rem 0;
          font-size: 0.9rem;
        }

        /* Optional: Hide scrollbar on Webkit browsers */
        .scroll-container::-webkit-scrollbar {
          display: none;
        }
        .scroll-container {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}

export default Favorites;
