import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

//import AnimalList from '../components/AnimalList/index.tsx'; NOT SURE IF THIS IS NEEDED

//import { removeAnimal } from '../utils/local storage.ts';
// For when Stuart adds the localStorage page

import { QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';

const Profile = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user;

  // Redirect to "/me" if the logged-in user's username matches the userParam
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/me" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  return (
    <div>
      <div className="flex-row justify-center mb-3">
        <h2 className="col-12 col-md-10 bg-dark text-light p-3 mb-5">
          Viewing {`${user.username}'s`} profile.
        </h2>
        <div className="col-12 col-md-10 mb-5">


          {(user.favoriteAnimals ?? []).length < 1 ? (
            <h3>{`${user.username}'s`} has no favorite animals yet!</h3>
          ) : (
            <>
              <h3>{`${user.username}'s`} Favorite Animals:</h3>
              Add code here I couldn't figure it out might've been my end might've been Stuart's end
            </>
          )}

        </div>
        {!userParam && (
          <div
            className="col-12 col-md-10 mb-3 p-3"
            style={{ border: '1px dotted #1a1a1a' }}
          >
            {/* Can add stuff here if needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
