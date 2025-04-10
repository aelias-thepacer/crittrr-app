import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ANIMALS, QUERY_ME } from '../utils/queries.ts';
import { useMutation } from '@apollo/client';
import { ADD_ANIMAL } from '../utils/mutations.ts';

import { AnimalType } from '../interfaces/AnimalType.tsx';

const HomePage = () => {
  // Fetch animal data from queries
  const { loading, data } = useQuery(QUERY_ANIMALS);
  const { data: meData } = useQuery(QUERY_ME); // Separate query for user data
  const animals: AnimalType[] = data?.animals || [];

  // State to store the current animal
  const [currentAnimal, setCurrentAnimal] = useState<AnimalType | null>(null);

  // State to store user's favorite animals
  const [favorites, setFavorites] = useState<AnimalType[]>([]);

  const [addAnimal] = useMutation(ADD_ANIMAL);

  // State to store the recently added animal
  const [recentlyAddedAnimal, setRecentlyAddedAnimal] = useState<AnimalType | null>(null);

  // State for showing the success message
  const [showMessage, setShowMessage] = useState(false);

  // State for showing the login message
  const [loginMessage, setLoginMessage] = useState(false);

  // State for showing the dislike message
  const [dislikeMessage, setDislikeMessage] = useState(false);

  // Timeout reference to manage the message visibility timer
  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update favorites when `meData` becomes available
  useEffect(() => {
    if (meData?.me?.favoriteAnimals) {
      setFavorites(meData.me.favoriteAnimals);
    }
  }, [meData]);

  const handleAddAnimal = async (animal: AnimalType) => {
    if (!meData?.me) {
      // User is not logged in, show login message
      setLoginMessage(true);

      // Clear the previous timeout if it exists
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }

      // Start a new timeout to hide the message after 3 seconds
      messageTimeoutRef.current = setTimeout(() => {
        setLoginMessage(false);
        messageTimeoutRef.current = null; // Reset the timeout reference
      }, 3000);

      return;
    }

    try {
      console.log('Adding animal:', animal);
      const animalInput = {
        _id: animal._id,
        commonName: animal.commonName,
        scientificName: animal.scientificName,
      };
      const { data } = await addAnimal({
        variables: { animalData: animalInput },
      });
      console.log('Animal added:', data.addAnimal);

      // Set the recently added animal and show the success message
      setRecentlyAddedAnimal(animal);
      setShowMessage(true);

      // Clear the previous timeout if it exists
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }

      // Start a new timeout to hide the message after 3 seconds
      messageTimeoutRef.current = setTimeout(() => {
        setShowMessage(false);
        messageTimeoutRef.current = null; // Reset the timeout reference
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

    // Track the distance moved
    let deltaX = 0;

    // Function to handle movement during drag/swipe
    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentX =
        'touches' in moveEvent
          ? (moveEvent as TouchEvent).touches[0].clientX
          : (moveEvent as MouseEvent).clientX;

      // Calculate the distance moved, from start to current position
      deltaX = currentX - dragStartX.current;

      // Move the card based on drag
      if (cardRef.current) {
        cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 15}deg)`; // Adjust rotation based on drag distance
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
          cardRef.current.style.transition = 'transform 0.3s ease';
          cardRef.current.style.transform = 'translateX(0px) rotate(0deg)';
          setTimeout(() => {
            if (cardRef.current) {
              cardRef.current.style.transition = '';
            }
          }, 300);
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
      if (direction === 'right') {
        // Reset other messages
        setDislikeMessage(false);

        // Check if the user is logged in
        if (!meData?.me) {
          // Set the recently added animal to show its name in the login message
          setRecentlyAddedAnimal(currentAnimal);

          // Show the login message
          setLoginMessage(true);

          // Clear the previous timeout if it exists
          if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
          }

          // Start a new timeout to hide the message after 3 seconds
          messageTimeoutRef.current = setTimeout(() => {
            setLoginMessage(false);
            messageTimeoutRef.current = null; // Reset the timeout reference
          }, 3000);
        } else {
          // Add animal to favorites if logged in
          setFavorites((prev) => [...prev, currentAnimal]);

          // Check if the animal is already in favorites
          const alreadyFavorited = favorites.some(
            (animal) => animal._id === currentAnimal._id
          );

          if (!alreadyFavorited) {
            handleAddAnimal(currentAnimal);
            setFavorites((prev) => [...prev, currentAnimal]);
          }

          // Show "Animal added" message
          setRecentlyAddedAnimal(currentAnimal);
          setShowMessage(true);

          // Clear the previous timeout if it exists
          if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
          }

          // Start a new timeout to hide the message after 3 seconds
          messageTimeoutRef.current = setTimeout(() => {
            setShowMessage(false);
            messageTimeoutRef.current = null; // Reset the timeout reference
          }, 3000);
        }
      } else if (direction === 'left') {
        // Reset other messages
        setLoginMessage(false);
        setShowMessage(false);

        // Set the recently added animal to show its name in the dislike message
        setRecentlyAddedAnimal(currentAnimal);

        // Show dislike message
        setDislikeMessage(true);

        // Clear the previous timeout if it exists
        if (messageTimeoutRef.current) {
          clearTimeout(messageTimeoutRef.current);
        }

        // Start a new timeout to hide the dislike message after 3 seconds
        messageTimeoutRef.current = setTimeout(() => {
          setDislikeMessage(false);
          messageTimeoutRef.current = null; // Reset the timeout reference
        }, 3000);
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
              transition: 'transform 02s ease-in-out',
              cursor: 'grab',
              color: '#000', // Ensure text is readable on gradient
              willChange: 'transform', // Optimize for performance
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
      {showMessage && recentlyAddedAnimal && (
        <div style={messageStyle}>
          {recentlyAddedAnimal.commonName} added to favorites!
        </div>
      )}

      {/* Show "Login required" message */}
      {loginMessage && (
        <div style={messageStyle}>
          You need to login to add {recentlyAddedAnimal?.commonName || 'this animal'} to favorites
        </div>
      )}

      {/* Show "Dislike" message */}
      {dislikeMessage && recentlyAddedAnimal && (
        <div style={messageStyle}>
          You didn't like {recentlyAddedAnimal.commonName}.
        </div>
      )}
    </main>
  );
};

// Add some basic styles for the message
const messageStyle: React.CSSProperties = {
  display: 'inline-block', // Ensures it only takes the space it needs
  padding: '5px 10px', // Smaller padding for breathability
  background: 'linear-gradient(to bottom, #4facfe, #00f2fe)',
  color: 'black',
  border: '1px solid #000',
  borderRadius: '5px',
  transition: 'opacity 0.5s ease-in-out',
  marginTop: '10px', // Adds a little space from the text above
  textAlign: 'center', // Ensures the text is centered
};

export default HomePage;
