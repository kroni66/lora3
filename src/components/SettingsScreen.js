import React, { useState } from 'react';
import '../styles/SettingsScreen.css';
import { X } from 'lucide-react'; // Import the X icon for close button

function SettingsScreen({ username, level, onChangeUsername, onChangePassword, onClose }) {
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUsernameChange = (e) => {
    e.preventDefault();
    if (level >= 100) {
      onChangeUsername(newUsername);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      onChangePassword(currentPassword, newPassword);
    } else {
      alert("New passwords don't match!");
    }
  };

  return (
    <div className="settings-screen">
      <div className="settings-content">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <h2 className="settings-title">Game Settings</h2>
        <form onSubmit={handleUsernameChange} className="settings-form">
          <h3>Change Username</h3>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="New Username"
            disabled={level < 100}
          />
          <button type="submit" disabled={level < 100}>
            Change Username
          </button>
          {level < 100 && (
            <p className="level-requirement">
              Username can be changed only after reaching level 100. Current level: {level}
            </p>
          )}
        </form>
        <form onSubmit={handlePasswordChange} className="settings-form">
          <h3>Change Password</h3>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
          />
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
}

export default SettingsScreen;