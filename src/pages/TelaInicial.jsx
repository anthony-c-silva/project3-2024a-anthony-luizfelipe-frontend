import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cuidar from '../assets/cuidar.svg';
import './TelaInicial.css';

function TelaInicial() {
  const [count, setCount] = useState('');
  const navigate = useNavigate();

  return (
    <>
      <div>
        <img src={Cuidar} className="logo react" alt="React logo" />
      </div>
      
      <h1 className='titulo'>Gestão de Abrigos</h1>
      
      <div>
        <p className=''>
          Faça a gestão de abrigos de forma simples e eficiente
        </p>
      </div>

      <div className="button-container">
        <button className="login-button" onClick={() => navigate('/login')}>Login</button>
        <button className="signup-button" onClick={() => navigate('/cadastro')}>Cadastro</button>
      </div>
      
    </>
  );
}

export default TelaInicial;
