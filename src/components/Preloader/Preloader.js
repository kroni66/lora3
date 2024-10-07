import React from 'react';
import './Preloader.css';
import loraLogo from '../../assets/loralogo.png';

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="spinner">
        <img src={loraLogo} alt="Lora Logo" className="logo" />
      </div>
    </div>
  );
};

export default Preloader;