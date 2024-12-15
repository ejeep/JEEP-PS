import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  // Check if the user is already logged in by looking for a token or user data in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // Redirect to the dashboard if the user is already logged in
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Send a POST request to your backend for authentication
  try {
    const response = await axios.post('https://jeep-ps.onrender.com/users/login', {
      email,
      password,
    });

    if (response.data.success) {
      // If login is successful, store user data and token in localStorage
      const { user } = response.data;
      console.log('User data:', user);  // Debugging the user object
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to the appropriate dashboard based on the user role
      if (user.userRole === 'admin') {
        navigate("/dashboard");        
      } else {
        navigate("/");
      }
    } else {
      setError(response.data.message || "Invalid email or password");
    }
  } catch (error) {
    console.error("Login error:", error);
    setError("There was an error logging in. Please try again.");
  }
};


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>} {/* Display error if any */}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
