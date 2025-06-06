import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Favorites from '../components/Favorites/Favorites';


//import { removeAnimal } from '../utils/local storage.ts';
// For when Stuart adds the localStorage page

import { QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';

const Profile = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(QUERY_ME, {
    variables: { username: userParam },
    fetchPolicy: 'network-only', // Always fetch the latest data from the server
  });

  const user = data?.me || data?.user;

  // Redirect to "/me" if the logged-in user's username matches the userParam
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/me" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (!user?.username) {
  //   return (
  //     <h4>
  //       You need to be logged in to see this. Use the navigation links above to
  //       sign up or log in!
  //     </h4>
  //   );
  // }

  return (
    <div>
      <div className="flex-row justify-center mb-3">
        <h2 className="col-12 col-md-10 text-default p-3 mb-5 text-center" style={{ borderRadius: '10px', background: 'linear-gradient(to right, #4facfe, #00f2fe)', border: '1px solid black' }}>
          Viewing {`${user?.username ?? 'user'}'s`} Favorites.
        </h2>
        <div className="col-12 col-md-10 mb-5">


          <Favorites />


        </div>
        {!userParam && (
          <div
            className="col-12 col-md-10 mb-3 p-3"
          // style={{ border: '1px dotted #1a1a1a' }}
          >
            {/* Can add stuff here if needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
