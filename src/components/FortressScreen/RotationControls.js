import React from 'react';
import { FaArrowUp, FaArrowRight, FaArrowDown, FaArrowLeft } from 'react-icons/fa';

const RotationControls = ({ onRotate }) => {
  return (
    <div className="rotation-controls">
      <button onClick={() => onRotate(0)} className="rotate-button rotate-up"><FaArrowUp /></button>
      <button onClick={() => onRotate(90)} className="rotate-button rotate-right"><FaArrowRight /></button>
      <button onClick={() => onRotate(180)} className="rotate-button rotate-down"><FaArrowDown /></button>
      <button onClick={() => onRotate(270)} className="rotate-button rotate-left"><FaArrowLeft /></button>
    </div>
  );
};

export default RotationControls;