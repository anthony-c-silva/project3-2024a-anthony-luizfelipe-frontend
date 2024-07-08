import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cuidar from '../assets/cuidar.svg';
import './TelaInicial.css';

function TelaInicial() {
  const [count, setCount] = useState('');
  const navigate = useNavigate();

  return (
    <div className="tela-inicial">
      <div className="logo-container">
        <img src={Cuidar} className="logo react" alt="React logo" />
      </div>
      
      <h1 className="titulo">Gestão de Abrigos</h1>
      
      <div className="descricao-container">
        <p className="descricao">
          Faça a gestão de abrigos de forma simples e eficiente
        </p>
      </div>

      <div className="botoes-container">
        <button className="botao" onClick={() => navigate('/login')}>Login</button>
        <button className="botao" onClick={() => navigate('/cadastro')}>Cadastro</button>
      </div>
    </div>
  );
}

export default TelaInicial;
