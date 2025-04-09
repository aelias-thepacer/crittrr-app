import { useState, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ANIMALS, QUERY_ME } from '../utils/queries.ts';
import { useMutation } from '@apollo/client';
import { ADD_ANIMAL } from '../utils/mutations.ts';

import { AnimalType } from '../interfaces/AnimalType.tsx';

const HomePage = () => {
  // Fetch animal data from query
  const { loading, data } = useQuery(QUERY_ANIMALS);
  const animals: AnimalType[] = data?.animals || [];

  // State to store the current animal
  const [currentAnimal, setCurrentAnimal] = useState<AnimalType | null>(null);

  // State to store user's favorite animals
  const [favorites, setFavorites] = useState<AnimalType[]>(useQuery(QUERY_ME).data?.me.favoriteAnimals || []);

  const [addAnimal] = useMutation(ADD_ANIMAL);

  // State for showing the success message
  const [showMessage, setShowMessage] = useState(false);

  const handleAddAnimal = async (animal: AnimalType) => {
    try {
      const { data } = await addAnimal({
        variables: { ...animal },
      });
      console.log('Animal added:', data.addAnimal);
      // Show the success message when the animal is added
      setShowMessage(true);

      // Hide the message after 3 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding animal:', error);
    }
  };

  // Refs to access the card DOM element and track dragging start position
  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number>(0);

  // Handle drag/touch start
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    // Disable text selection while dragging
    document.body.style.userSelect = 'none';

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

      // Enable text selection again after drag ends
      document.body.style.userSelect = '';

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

  // Function to randomize the current animal
  const randomizeAnimal = () => {
    if (animals.length > 0) {
      const randomIndex = Math.floor(Math.random() * animals.length);
      setCurrentAnimal(animals[randomIndex]);
    } else {
      setCurrentAnimal(null);
    }
  };

  // Handle swipe left or right
  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentAnimal) {
      // If swiped right, add animal to favorites and store in localStorage
      if (direction === 'right') {
        setFavorites((prev) => [...prev, currentAnimal]);

        // Check if the animal is already in favorites
        const alreadyFavorited = favorites.some(
          (animal) => animal._id === currentAnimal._id
        );

        if (!alreadyFavorited) {
          handleAddAnimal(currentAnimal);
          // Add to favorites
          setFavorites((prev) => [...prev, currentAnimal]);
        }
      }

      // Animate the card flying off screen
      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.3s ease';
        cardRef.current.style.transform = `translateX(${direction === 'right' ? '40000px' : '-40000px'}) rotate(${direction === 'right' ? 45 : -45}deg)`;
      }

      // Reset card, then go to next animal
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = '';
          cardRef.current.style.transform = '';
        }
        randomizeAnimal();
      }, 300);
    }
  };

  // Show loading state while data is being fetched
  if (loading) return <div>Loading...</div>;

  // Get the currently displayed animal
  if (!currentAnimal && animals.length > 0) {
    randomizeAnimal();
  }

  return (
    <main style={{ textAlign: 'center', padding: '20px' }}>
      <div className="flex-row justify-center">
        {/* Header section */}
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{
            border: '1px solid rgb(0, 0, 0)',
            background: 'linear-gradient(to right, #4facfe, #00f2fe)', // Blue gradient background
            borderRadius: '8px', // Optional: Add rounded corners
            color: '#000', // Optional: Ensure text is readable on gradient
          }}
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
              background: 'linear-gradient(to bottom, #4facfe, #00f2fe)', // Gradient blue background
              border: '1px solid #000', // Optional: Border for better visibility
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              cursor: 'grab',
              color: '#000', // Ensure text is readable on gradient
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
                pointerEvents: 'none', // Prevent image from capturing mouse events
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

      {/* Show "Animal added" message */}
      {showMessage && (
        <div style={messageStyle}>
          Animal added to favorites!
        </div>
      )}
    </main>
  );
};

// Add some basic styles for the message
const messageStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '10px 20px',
  backgroundColor: 'linear-gradient(to bottom, #4facfe, #00f2fe)',
  color: 'white',
  borderRadius: '5px',
  zIndex: 1000,
  transition: 'opacity 0.5s ease-in-out',
};

export default HomePage;
