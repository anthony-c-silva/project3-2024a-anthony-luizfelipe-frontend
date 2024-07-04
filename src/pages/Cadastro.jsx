import React, { useState } from 'react';
import './Cadastro.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cadastro() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [abrigoNome, setAbrigoNome] = useState('');
  const [abrigoEndereco, setAbrigoEndereco] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async () => {
    const data = {
      nomeUsuario: username,
      senha: password,
      email: email,
      abrigo: {
        nome: abrigoNome,
        endereco: abrigoEndereco,
      },
    };

    try {
      await axios.post('https://project3-2024a-anthony-luizfelipe-backend.onrender.com/primeiro-admin', data);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao cadastrar administrador:', error);
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Administrador</h2>
      <div>
        <input
          type="text"
          placeholder="Nome"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Nome do Abrigo"
          value={abrigoNome}
          onChange={(e) => setAbrigoNome(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Endereço do Abrigo"
          value={abrigoEndereco}
          onChange={(e) => setAbrigoEndereco(e.target.value)}
        />
      </div>
      <button className="signup-button" onClick={handleCadastro}>
        Cadastro
      </button>
    </div>
  );
}

export default Cadastro;
