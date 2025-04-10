import { Link, useLocation } from 'react-router-dom';
import { type MouseEvent } from 'react';
import Auth from '../../utils/auth';

const NavBar = () => {
  const location = useLocation(); // Get the current location (route)
  const logout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Logs the user out by calling the logout method from Auth
    Auth.logout();
  };

  // Conditionally apply a class to center content if on the Favorites page
  const isFavoritesPage = location.pathname === '/FavoritesPage';

  return (
    <header className="bg-primary text-light mb-4 py-3 flex-row align-center">
      <div
        className={`container flex-row ${isFavoritesPage ? 'justify-center' : 'justify-space-between-lg justify-center align-center'}`}
      >
        <div style={{ textAlign: 'center', flex: 1 }}>
          {/* Only render the "Hello" message if not on the Favorites page */}
          {location.pathname !== '/FavoritesPage' && Auth.loggedIn() && (
            <Link
              className="text-light"
              to="/"
              style={{
              textDecorationColor: 'black',
              textShadow: '3px 2px 2px rgba(255, 255, 255, 0.5)',
              fontWeight: 'bold',
              }}
            >
                <h1 className="m-0 text-default" style={{ display: 'inline' }}>
                Hello {Auth.getProfile().data.username}!
                </h1>
            </Link>
          )}
        </div>
        <div>
          {/* Checking if the user is logged in to conditionally render profile link and logout button */}
          {Auth.loggedIn() ? (
            <>
              <Link className="btn btn-lg btn-info m-2" to="/me">
                {/* Retrieving the logged-in user's profile to display the username */}
                {Auth.getProfile().data.username}'s Favorites
              </Link>
              {/* <Link to="/FavoritesPage">
                Favorites
              </Link> */}
              <button className="btn btn-lg btn-light m-2" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-lg btn-info m-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-lg btn-lightt m-2" to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
