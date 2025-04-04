import { useState, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ANIMALS } from '../utils/queries.ts';

interface AnimalType {
  _id: string;
  commonName: string;
  scientificName: string;
  conservationStatus: string;
  imageLink: string;
}

const HomePage = () => {
  // Fetch animal data from query
  const { loading, data } = useQuery(QUERY_ANIMALS);
  const animals: AnimalType[] = data?.animals || [];

  // Track state of the current animal and its index 
  const [index, setIndex] = useState(0);

  // State to store user's favorite animals
  const [favorites, setFavorites] = useState<AnimalType[]>([]);

  // Refs to access the card DOM element and track dragging start position
  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number>(0);

  // Handle drag/touch start
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    // Get initial X position from mouse or touch
    const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartX.current = startX;

    // Function to handle movement during drag/swipe
    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentX =
        'touches' in moveEvent
          ? (moveEvent as TouchEvent).touches[0].clientX
          : (moveEvent as MouseEvent).clientX;

      const deltaX = currentX - dragStartX.current;

      // Move the card based on drag
      if (cardRef.current) {
        cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 15}deg)`;
      }
    };

    // Function to handle when the user releases the card
    const handleUp = () => {
      const endX = cardRef.current?.getBoundingClientRect().left || 0;
      const deltaX = endX - dragStartX.current;

      // Determine swipe direction based on drag distance
      if (Math.abs(deltaX) > 100) {
        const direction = deltaX > 0 ? 'right' : 'left';
        handleSwipe(direction);
      } else {
        // Reset position if swipe was not far enough
        if (cardRef.current) {
          cardRef.current.style.transform = 'translateX(0px) rotate(0deg)';
        }
      }

      // Remove event listeners after drag ends
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };

    // Add event listeners for drag movement and release
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleUp);
  };

  // Handle swipe left or right
  const handleSwipe = (direction: 'left' | 'right') => {
    const currentAnimal = animals[index];

    // If swiped right, add animal to favorites and store in localStorage
    if (direction === 'right') {
      setFavorites((prev) => [...prev, currentAnimal]);

      const favoriteAnimals = JSON.parse(localStorage.getItem('favoriteAnimals') || '[]');
      const alreadyFavorited = favoriteAnimals.some((a: AnimalType) => a._id === currentAnimal._id);

      if (!alreadyFavorited) {
        favoriteAnimals.push(currentAnimal);
        localStorage.setItem('favoriteAnimals', JSON.stringify(favoriteAnimals));
        alert(`${currentAnimal.commonName} added to favorites!`);
      } else {
        alert(`${currentAnimal.commonName} is already in favorites!`);
      }
    }

    // Animate the card flying off screen
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease';
      cardRef.current.style.transform = `translateX(${direction === 'right' ? '1000px' : '-1000px'}) rotate(${direction === 'right' ? 45 : -45}deg)`;
    }

    // Reset card, then go to next animal
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.transition = '';
        cardRef.current.style.transform = '';
      }
      setIndex((prev) => prev + 1);
    }, 300);
  };

  // Show loading state while data is being fetched
  if (loading) return <div>Loading...</div>;

  // Get the currently displayed animal
  const currentAnimal = animals[index];

  // Main 
  return (
    <main style={{ textAlign: 'center', padding: '20px' }}>
      <div className="flex-row justify-center">
        {/* Header section */}
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: '1px solid #1a1a1a' }}
        >
          <h1>Welcome to Crittrr!</h1>
          <h2>Swipe right to ❤️ or left to ❌</h2>
        </div>

        {/* Show animal card if available, otherwise show a message */}
        {currentAnimal ? (
          <div
            ref={cardRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            style={{
              width: '260px',
              margin: '0 auto',
              background: '#fff',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              cursor: 'grab',
            }}
          >
            {/* Display animal image and info */}
            <img
              src={currentAnimal.imageLink}
              alt={currentAnimal.commonName}
              style={{
                width: '100%',
                height: '180px',
                objectFit: 'cover',
                borderRadius: '12px',
                marginBottom: '12px',
              }}
            />
            <h3>{currentAnimal.commonName}</h3>
            <p><em>{currentAnimal.scientificName}</em></p>
            <p>{currentAnimal.conservationStatus}</p>
          </div>
        ) : (
          <p>No more animals to show.</p>
        )}
      </div>
    </main>
  );
};

export default HomePage;
