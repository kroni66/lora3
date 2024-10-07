import React from 'react';

function RegisterForm({ username, setUsername, password, setPassword, handleSubmit, onCancel, isFormValid }) {
  return (
    <form onSubmit={handleSubmit} className="register-form">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="register-button" disabled={!isFormValid}>Register</button>
      <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
    </form>
  );
}

export default RegisterForm;