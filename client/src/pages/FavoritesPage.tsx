// import { useEffect, useState } from 'react';
// import { QUERY_ANIMALS } from '../utils/queries.ts';
// import { useQuery } from '@apollo/client';

// interface Species {
//   _id: string;
//   name: string;
//   imageURL: string;
//   status: string;
// }

// const FavoritesPage = () => {
//   const [favorites, setFavorite] = useState<Species[]>([]);
//   const { loading, data } = useQuery(QUERY_ANIMALS);

//   useEffect(() => {
//     const stored = localStorage.getItem('favorites');
//     if (stored) {
//       setFavorite(JSON.parse(stored));
//     }
//   }, []);

//   const removeFavorite = (id: string) => {
//     const updated = favorites.filter((species: { _id: string; }) => species._id !== id);
//     setFavorite(updated);
//     localStorage.setItem('favorites', JSON.stringify(updated));
//   };

//   return (
//     <main>
//       <div className="flex-row justify-center">
//         <div className="col-12 col-md-10 mb-3 p-3" style={{ border: '1px solid #1a1a1a' }}>
//           <h1>Welcome to Crittrr Favorites!</h1>
//         </div>

//         <div className="col-12 col-md-8 mb-3">
//           {loading ? (
//             <div>Loading...</div>
//           ) : favorites.length === 0 ? (
//             <p className="text-center">You haven't favorited any species yet.</p>
//           ) : (
//             <div className="row">
//               {favorites.map((species) => (
//                 <div className="col-12 col-sm-6 col-md-4 mb-4" key={species._id}>
//                   <div className="card h-100 shadow-sm">
//                     <img
//                       src={species.imageURL}
//                       alt={species.name}
//                       className="card-img-top"
//                       style={{ height: '200px', objectFit: 'cover' }}
//                     />
//                     <div className="card-body d-flex flex-column">
//                       <h5 className="card-title">{species.name}</h5>
//                       <p className="card-text text-muted">Status: {species.status}</p>
//                       <button
//                         className="btn btn-danger mt-auto"
//                         onClick={() => removeFavorite(species._id)}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// };

// export default FavoritesPage;
