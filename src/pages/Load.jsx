import React from 'react';
import './Load.css';

function Load() {
  return (
    <div className='loading-overlay-load'>
      <div className="loading-spinner"></div>
      <p>Carregando Itens...</p>
    </div>
  );
}

export default Load;
