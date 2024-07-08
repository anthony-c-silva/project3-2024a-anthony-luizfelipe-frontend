import React from 'react';
import './Loading.css';

function Loading() {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p>Carregando...</p>
    </div>
  );
}

export default Loading;
