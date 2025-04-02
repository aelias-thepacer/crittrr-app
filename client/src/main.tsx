import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'


import App from './App.jsx';
import HomePage from './pages/HomePage.js';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile.js';
import ErrorPage from './pages/Error';
// import FavoritesPage from './pages/FavoritesPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      }, {
        path: '/login',
        element: <Login />
       }, //{
      //   path: '/FavoritesPage',
      //   element: <FavoritesPage />
      // },
      {
        path: '/signup',
        element: <Signup />
      }, {
        path: '/profiles/:username',
        element: <Profile />
      }, {
        path: '/me',
        element: <Profile />
      }
    ]
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
