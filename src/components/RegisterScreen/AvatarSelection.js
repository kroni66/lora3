import React, { useState } from 'react';

function AvatarSelection({ avatars, selectedAvatar, setSelectedAvatar }) {
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });

  const handleAvatarHover = (event, avatar) => {
    const rect = event.target.getBoundingClientRect();
    setPreviewPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY
    });
    setPreviewAvatar(avatar);
  };

  return (
    <div className="avatar-selection">
      <h3>Choose your avatar:</h3>
      <div className="avatar-options">
        {avatars.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`Avatar ${index + 1}`}
            className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
            onClick={() => setSelectedAvatar(avatar)}
            onMouseEnter={(e) => handleAvatarHover(e, avatar)}
            onMouseLeave={() => setPreviewAvatar(null)}
          />
        ))}
      </div>
      {previewAvatar && (
        <div 
          className="avatar-preview tooltip" 
          style={{ 
            left: `${previewPosition.x}px`, 
            top: `${previewPosition.y - 100}px`
          }}
        >
          <img src={previewAvatar} alt="Avatar Preview" />
        </div>
      )}
    </div>
  );
}

export default AvatarSelection;