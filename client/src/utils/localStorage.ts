export const getSavedAnimals = () => {
    const getSavedAnimals = localStorage.getItem('favoriteAnimals')
      ? JSON.parse(localStorage.getItem('favoriteAnimals')!)
      : [];
  
    return getSavedAnimals;
  };
  
//   export const saveAnimal = (theAnimal: AnimalType) => {
//     const favoriteAnimals = JSON.parse(localStorage.getItem('favoriteAnimals') || '[]');
//     if (!favoriteAnimals.some((animal: AnimalType) => animal._id === theAnimal._id)) {
//     favoriteAnimals.push(theAnimal);
//     localStorage.setItem('favoriteAnimals', JSON.stringify(favoriteAnimals));
//     alert(`${theAnimal.commonName} added to favorites!`);
//     } else {
//     alert(`${theAnimal.commonName} is already in favorites!`);
//     }
//   };
  
  export const removeAnimal = (animalId: string) => {
    const savedAnimalIds = localStorage.getItem('favoriteAnimals')
      ? JSON.parse(localStorage.getItem('favoriteAnimals')!)
      : null;
  
    if (!savedAnimalIds) {
      return false;
    }

    const updatedSavedBookIds = savedAnimalIds?.filter((savedAnimalId: string) => savedAnimalId !== animalId);
    localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

    return true;
  };
  