import React, { useState } from 'react';
import './Account.css';

function Account() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="account-container">
      <h1>Account</h1>
      {isRegister ? (
        <div className="register-section">
          <h2>Register</h2>
          <p>Already have an account? <span onClick={() => setIsRegister(false)}>Sign in</span></p>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm password" />
          <button className="action-btn">Register</button>
        </div>
      ) : (
        <div className="login-section">
          <h2>Sign in</h2>
          <p>Don't have an account? <span onClick={() => setIsRegister(true)}>Register</span></p>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <p className="forgot-password">Forgotten password?</p>
          <button className="action-btn">Sign in</button>
        </div>
      )}
    </div>
  );
}

export default Account;
