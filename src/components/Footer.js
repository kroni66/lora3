import React from 'react';
import '../styles/Footer.css';
import { Settings, LogOut, Info, Mail } from 'lucide-react';

function Footer({ onSettingsClick, onLogout, isLoggedIn, onMailboxClick, unreadMessages }) {
  return (
    <footer className="game-footer">
      <div className="footer-content">
        <div className="footer-info">
          <Info size={16} />
          <span>Lora MMORPG v1.0</span>
        </div>
        {isLoggedIn && (
          <div className="footer-buttons">
            <button onClick={onMailboxClick} className="footer-button mailbox-button">
              <Mail size={20} />
              <span className="button-text">Mailbox</span>
              {unreadMessages > 0 && <span className="notification-badge">{unreadMessages}</span>}
            </button>
            <button onClick={onSettingsClick} className="footer-button settings-button">
              <Settings size={20} />
              <span className="button-text">Settings</span>
            </button>
            <button onClick={onLogout} className="footer-button logout-button">
              <LogOut size={20} />
              <span className="button-text">Logout</span>
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}

export default Footer;