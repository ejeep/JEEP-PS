import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      // Redirect to the admin dashboard if the user is already logged in
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if credentials match (this should be replaced with an actual authentication check)
    if (email === "espejomcosmund@gmail.com" && password === "ejeepps") {
      // Store user data in localStorage (email and a simple token for this example)
      const userData = {
        email,
        token: "admin-token", // A simple static token; in real apps, use a JWT or something more secure
      };
      localStorage.setItem('user', JSON.stringify(userData)); // Store user data

      navigate("/dashboard"); // Redirect to AdminDashboard
    } else {
      setError("Invalid email or password");
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
