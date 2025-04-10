import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isLoading)
      return
    setIsLoading(true);
    try {
      const { data } = await addUser({
        variables: { input: { ...formState } },
      });
      setIsLoading(false);
      Auth.login(data.addUser.token);
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-lg-10">
        <div className="card" style={{ borderRadius: '15px' }}>
            <h4
              className="card-header text-black p-2 text-center"
              style={{
              background: 'linear-gradient(to bottom,rgb(0, 153, 255),rgb(6, 81, 212))',
              borderTopLeftRadius: '15px',
              borderTopRightRadius: '15px',
              }}
            >
              Sign Up
            </h4>
          <div className="card-body">
            {data ? (
              <p>
                Success! You may now head{' '}
                <Link to="/">back to the homepage.</Link>
              </p>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <input
                  className="form-input"
                  placeholder="Your username"
                  name="username"
                  type="text"
                  value={formState.username}
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Your email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Your password"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                />
                <button
                  className="btn btn-block btn-primary"
                  style={{
                  cursor: 'pointer',
                  background: 'linear-gradient(to bottom,rgb(32, 119, 196),rgb(1, 184, 194))',
                  color: 'black',
                  border: '1px solid #000',
                  fontSize: '1.25rem', // Increased font size
                  }}
                  type="submit"
                >
                  {isLoading ? 'Signing up' : 'Submit'}
                </button>
              </form>
            )}

            {error && (
              <div className="my-3 p-3 bg-danger text-white">
                {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
