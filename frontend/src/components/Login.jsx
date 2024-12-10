import { useState } from 'react';
import { login } from '../api'; // Import login function
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      const token = response?.data?.access_token;

      if (token) {
        localStorage.setItem('token', token); // Store token in localStorage
        navigate('/books'); // Redirect to BookList page
      } else {
        setError('Invalid response structure or missing token');
      }
    } catch (error) {
      setError(error.response?.data?.msg || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow-sm p-4" style={{ width: '30rem' }}>
        <h2 className="text-center mb-4">Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control form-control-md"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control form-control-md"
              id="exampleInputPassword1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
