import React, { useState } from 'react';
import { FaUser, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import Logoimage from '../assets/loralogo.png'; // Update this import
import '../styles/LoginScreen.css';

function LoginScreen({ onLogin, onRegisterClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="login-screen">
      <div className="login-image-container">
        <img src={Logoimage} alt="Super Knight" className="login-image" />
      </div>
      <div className="login-form-container">
        <div className="login-container">
          <h1 className="login-title">Enter the Realm</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="login-button">
              <FaSignInAlt className="button-icon" /> Login
            </button>
          </form>
          <button onClick={onRegisterClick} className="register-button">
            <FaUserPlus className="button-icon" /> Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;