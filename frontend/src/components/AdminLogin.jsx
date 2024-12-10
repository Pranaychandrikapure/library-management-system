import { useState } from 'react';
import { adminLogin } from '../api';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await adminLogin(username, password);
      console.log("API Response:", response);

      if (response && response.access_token) {
        const access_token = response.access_token;
        localStorage.setItem("token", access_token);
        console.log("Token saved to local storage:", access_token);
        navigate('/admin-dashboard');
      } else {
        console.error("No access token in response");
        setError("Login failed, please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow-sm p-4" style={{ width: '30rem' }}>
        <h2 className="text-center mb-4">Admin Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="adminUsername" className="form-label">
              Admin Username
            </label>
            <input
              type="text"
              className="form-control form-control-md"
              id="adminUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="adminPassword" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control form-control-md"
              id="adminPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
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

export default AdminLogin;
