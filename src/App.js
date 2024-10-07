import React, { useState, useEffect } from 'react';
import './styles/App.css';
import LoginScreen from './components/LoginScreen';
import GameScreen from './components/GameScreen';
import RegisterScreen from './components/RegisterScreen';
import SettingsScreen from './components/SettingsScreen';
import Footer from './components/Footer';
import Mailbox from './components/Mailbox/Mailbox';
import Preloader from './components/Preloader/Preloader';
import { calculateExperienceForLevel, MAX_LEVEL } from './utils/PlayerLevel';
import { QuestProvider } from './components/Quests/QuestContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [experience, setExperience] = useState(0);
  const [level, setLevel] = useState(1);
  const [showRegister, setShowRegister] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('tavern');
  const [desireForAdventure, setDesireForAdventure] = useState(0);
  const [playerClass, setPlayerClass] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMailbox, setShowMailbox] = useState(false);

  const [strength, setStrength] = useState(10);
  const [defense, setDefense] = useState(10);
  const [intelligence, setIntelligence] = useState(10);
  const [dexterity, setDexterity] = useState(10);

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [gold, setGold] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [avatarCode, setAvatarCode] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      fetchUserProgress(storedUsername);
    }
    if (isLoggedIn) {
      fetchUnreadMessages();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUnreadMessages = async () => {
        try {
          const response = await fetch(`http://localhost/api/index.php/messages/unread?username=${username}`);
          const data = await response.json();
          if (data.success) {
            setUnreadMessages(data.unreadCount);
          }
        } catch (error) {
          console.error('Error fetching unread messages:', error);
        }
      };

      fetchUnreadMessages();
    }
  }, [isLoggedIn, username]);

  const handleLogin = async (username, password) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost/api/index.php/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
        setUsername(username);
        localStorage.setItem('username', username);
        await fetchUserProgress(username);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setExperience(0);
    setLevel(1);
    localStorage.removeItem('username');
  };

  const handleBeerClick = async () => {
    if (currentLocation === 'tavern') {
      const newExperience = experience + 10;
      const newLevel = calculateLevel(newExperience);
      const newDesire = Math.min(desireForAdventure + 10, 100);
      
      setExperience(newExperience);
      setLevel(newLevel);
      setDesireForAdventure(newDesire);

      // Save progress to backend
      await saveUserProgress(username, newExperience, newLevel, newDesire, strength, defense, intelligence, dexterity, gold);
    }
  };

  const calculateLevel = (experience) => {
    if (experience < 100) return 1;
    let level = 1;
    while (level < MAX_LEVEL && calculateExperienceForLevel(level + 1) <= experience) {
      level++;
    }
    return level;
  };

  const fetchUserProgress = async (username) => {
    try {
      const response = await fetch(`http://localhost/api/index.php/progress?username=${username}`);
      const data = await response.json();

      if (data.success) {
        setExperience(data.experience);
        setLevel(data.level);
        setDesireForAdventure(data.desireForAdventure);
        setPlayerClass(data.class);
        setStrength(data.strength);
        setDefense(data.defense);
        setIntelligence(data.intelligence);
        setDexterity(data.dexterity);
        setGold(data.gold);
        setAvatarCode(data.avatar || ''); // Ensure avatarCode is set, use empty string if not provided
      } else {
        console.error('Error fetching user progress:', data.message);
      }
    } catch (error) {
      console.error('Error fetching user progress:', error.message);
    }
  };

  const saveUserProgress = async (username, experience, level, desireForAdventure, strength, defense, intelligence, dexterity, gold) => {
    try {
      const response = await fetch('http://localhost/api/index.php/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          experience,
          level,
          desireForAdventure,
          strength,
          defense,
          intelligence,
          dexterity,
          gold
        }),
      });

      const data = await response.json();

      if (!data.success) {
        console.error('Error saving user progress:', data.message);
      }
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  };

  const handleRegister = async (username, password, selectedClass, avatarCode) => {
    try {
      const response = await fetch('http://localhost/api/index.php/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, class: selectedClass, avatar: avatarCode }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Registration successful! Please log in.');
        setShowRegister(false);
      } else {
        console.error('Registration failed:', data.message);
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(`An error occurred during registration: ${error.message}`);
    }
  };

  const handleLocationChange = (location) => {
    setCurrentLocation(location);
    // You can add logic here to fetch location-specific data if needed
  };

  const handleChangeUsername = async (newUsername) => {
    try {
      const response = await fetch('http://localhost/api/index.php/change-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, newUsername }),
      });

      const data = await response.json();

      if (data.success) {
        setUsername(newUsername);
        localStorage.setItem('username', newUsername);
        alert('Username changed successfully!');
      } else {
        alert(data.message || 'Failed to change username');
      }
    } catch (error) {
      console.error('Error changing username:', error);
      alert('An error occurred while changing username');
    }
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch('http://localhost/api/index.php/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, currentPassword, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Password changed successfully!');
      } else {
        alert(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('An error occurred while changing password');
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleUpdateAttributes = async (updatedAttributes, pointsSpent) => {
    setStrength(updatedAttributes.strength);
    setDefense(updatedAttributes.defense);
    setIntelligence(updatedAttributes.intelligence);
    setDexterity(updatedAttributes.dexterity);

    // Deduct spent points from experience
    const newExperience = experience - (pointsSpent * 100);
    setExperience(newExperience);

    // Save progress to backend
    await saveUserProgress(
      username,
      newExperience,
      level,
      desireForAdventure,
      updatedAttributes.strength,
      updatedAttributes.defense,
      updatedAttributes.intelligence,
      updatedAttributes.dexterity
    );
  };

  const toggleMailbox = () => {
    setShowMailbox(!showMailbox);
    if (!showMailbox) {
      setUnreadMessages(0);
    }
  };

  const fetchUnreadMessages = async () => {
    try {
      const response = await fetch(`http://localhost/api/index.php/messages/unread?username=${username}`);
      const data = await response.json();
      if (data.success) {
        setUnreadMessages(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  };

  return (
    <div className="App">
      <QuestProvider>
        {isLoading && <Preloader />}
        <div className="content-wrapper">
          {isLoggedIn ? (
            <>
              <GameScreen
                username={username}
                experience={experience}
                level={level}
                desireForAdventure={desireForAdventure}
                playerClass={playerClass}
                onBeerClick={handleBeerClick}
                onLocationChange={handleLocationChange}
                strength={strength}
                defense={defense}
                intelligence={intelligence}
                dexterity={dexterity}
                onUpdateAttributes={handleUpdateAttributes}
                gold={gold}
                onUpdateGold={(newGold) => setGold(newGold)}
                avatarCode={avatarCode} // Make sure avatarCode is passed here
              />
              {showSettings && (
                <SettingsScreen
                  username={username}
                  level={level}
                  onChangeUsername={handleChangeUsername}
                  onChangePassword={handleChangePassword}
                  onClose={toggleSettings}
                />
              )}
            </>
          ) : showRegister ? (
            <RegisterScreen onRegister={handleRegister} onCancel={() => setShowRegister(false)} />
          ) : (
            <LoginScreen onLogin={handleLogin} onRegisterClick={() => setShowRegister(true)} />
          )}
        </div>
        <Footer 
          onSettingsClick={toggleSettings} 
          onLogout={handleLogout} 
          isLoggedIn={isLoggedIn}
          onMailboxClick={toggleMailbox}
          unreadMessages={unreadMessages}
        />
        {showMailbox && (
          <Mailbox
            isOpen={showMailbox}
            onClose={toggleMailbox}
            username={username}
            onMessageRead={() => setUnreadMessages(Math.max(0, unreadMessages - 1))}
          />
        )}
      </QuestProvider>
    </div>
  );
}

export default App;