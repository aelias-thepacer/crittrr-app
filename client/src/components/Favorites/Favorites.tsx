import { useEffect, useState, useRef } from 'react';
import { AnimalType } from '../../interfaces/AnimalType';
import { QUERY_ANIMALS, QUERY_ME } from '../../utils/queries.ts';
import { useQuery } from '@apollo/client';


function Favorites() {
  const [favorites, setFavorites] = useState<AnimalType[]>(useQuery(QUERY_ME).data?.me.favoriteAnimals || [])
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Function to remove an animal from favorites
  const removeFavorite = (animalId: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((animal) => animal._id !== animalId)
    );
  };

  // useEffect(() => {
  //   const favoriteAnimals = JSON.parse(localStorage.getItem('favoriteAnimals') || '[]');
  //   setFavorites(favoriteAnimals);
  // }, []);

  // Handle mouse down event to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollContainerRef.current) {
      isDraggingRef.current = true;
      startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
      scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    }
  };

  // Handle mouse move event to drag horizontally only
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;

    // Calculate the horizontal movement only
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2; // Adjust the speed by multiplying
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  // Handle mouse up event to stop dragging
  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Handle mouse leave event to stop dragging if mouse leaves the container
  const handleMouseLeave = () => {
    isDraggingRef.current = false;
  };

  return (
    <div>
      <div
        className="scroll-container"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {favorites.map((animal) => (
          <div className="card" key={animal._id}>
            <img src={animal.imageLink} alt={animal.commonName} />
            <h3>{animal.commonName}</h3>
            <p><em>{animal.scientificName}</em></p>
            <p>Status: {animal.conservationStatus}</p>
            <button onClick={() => removeFavorite(animal._id)}>Remove</button>
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
          cursor: grab;
        }

        .card {
          flex: 0 0 auto;
          width: 200px;
          border: 1px solid #000;
          border-radius: 12px;
          padding: 1rem;
          background: linear-gradient(to bottom, #4facfe, #00f2fe); /* Gradient blue background */
          box-shadow: 0 6px 14px rgba(0, 25, 100, 0.75);
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

        .card button {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: rgb(253, 38, 38);
          color: white;
          border: solid 1px #000;
          border-radius: 8px;
          cursor: pointer;
        }

        .card button:hover {
          background-color: rgb(185, 18, 18);
        }

        /* Optional: Hide scrollbar on Webkit browsers */
        .scroll-container::-webkit-scrollbar {
          display: none;
        }
        .scroll-container {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        /* Change cursor to grabbing when dragging */
        .scroll-container:active {
          cursor: grabbing;
        }
      `}</style>

      <h2
        style={{
          display: 'inline-block',
          margin: '1rem auto',
          color: '#000',
          fontSize: '1.5rem',
          border: '1px solid black',
          background: 'linear-gradient(to right, #4facfe, #00f2fe)',
          padding: '0.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          width: 'fit-content',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        Favorites: {favorites.length}
      </h2>
    </div>
  );
}

export default Favorites;
