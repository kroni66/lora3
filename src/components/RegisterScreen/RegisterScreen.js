import React, { useState, useEffect } from 'react';
import '../../styles/RegisterScreen.css';
import RegisterForm from './RegisterForm';
import ClassSelection from './ClassSelection';
import GenderSelection from './GenderSelection';
import AvatarSelection from './AvatarSelection';

function RegisterScreen({ onRegister, onCancel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [gender, setGender] = useState('m');
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedClass && gender) {
      const avatarPaths = [];
      for (let i = 1; i <= 20; i++) {
        try {
          const avatarPath = require(`../../assets/classes/avatar/${selectedClass.name.toLowerCase()}/${selectedClass.name.toLowerCase()}_${gender}_${i}.webp`);
          avatarPaths.push(avatarPath);
        } catch (error) {
          console.warn(`Failed to load avatar: ${selectedClass.name.toLowerCase()}_${gender}_${i}.webp`);
        }
      }
      setAvatars(avatarPaths);
      setSelectedAvatar(avatarPaths[0]);
    } else {
      setAvatars([]);
      setSelectedAvatar(null);
    }
  }, [selectedClass, gender]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (selectedClass && selectedAvatar) {
      const avatarCode = `${selectedClass.name.toLowerCase()}_${gender}_${selectedAvatar.split('_').pop().split('.')[0]}`;
      try {
        await onRegister(username, password, selectedClass.id, avatarCode);
      } catch (error) {
        console.error('Registration error:', error);
        setError('An error occurred during registration. Please try again.');
      }
    } else {
      setError('Please select a class and an avatar before registering.');
    }
  };

  return (
    <div className="register-screen" style={{backgroundImage: `url(${selectedClass ? selectedClass.bg : '../../assets/castle.jpeg'})`}}>
      <div className="register-container">
        <h2 className="register-title">Register</h2>
        {error && <div className="error-message">{error}</div>}
        <RegisterForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          onCancel={onCancel}
          isFormValid={!!selectedClass && !!selectedAvatar}
        />
        <ClassSelection
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
        />
        <GenderSelection
          gender={gender}
          setGender={setGender}
        />
        {selectedClass && gender && (
          <AvatarSelection
            avatars={avatars}
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={setSelectedAvatar}
          />
        )}
      </div>
    </div>
  );
}

export default RegisterScreen;