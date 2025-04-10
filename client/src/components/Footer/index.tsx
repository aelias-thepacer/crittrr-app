import { useLocation, useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) { //Check if there is a previous page in the history stack
      navigate(-1);
    } else {
      navigate('/');
    }
  }

  return (
    <footer className="w-100 mt-auto bg-secondary p-4">
      <div className="container text-center mb-5">
        {location.pathname !== '/' && (
            <button
            className="btn btn-dark mb-3"
            onClick={handleGoBack}
            style={{
              background: 'linear-gradient(to bottom, #4facfe, #00f2fe)',
              border: '1px solid #000',
              borderRadius: '16px',
              color: 'black', // Set text color to black
            }}
            >
            &larr; Go Back
            </button>
        )}
        <h4>
          Made with{' '}
          <span
            className="emoji"
            role="img"
            aria-label="heart"
            aria-hidden="false"
          >
            ❤️
          </span>{' '}
          by the Crittrr Team!
        </h4>
      </div>
    </footer>
  );
};

export default Footer;
