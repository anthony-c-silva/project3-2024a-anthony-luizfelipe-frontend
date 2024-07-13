import React, { useState, useEffect } from 'react';
import './Cadastro.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cadastro() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [abrigoNome, setAbrigoNome] = useState('');
  const [abrigoEndereco, setAbrigoEndereco] = useState('');
  const [abrigoId, setAbrigoId] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);
  const [abrigos, setAbrigos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      fetchAbrigos();
    }
  }, [isAdmin]);

  const fetchAbrigos = async () => {
    try {
      const response = await axios.get('https://project3-2024a-anthony-luizfelipe-backend.onrender.com/abrigos');
      setAbrigos(response.data.abrigos);
    } catch (error) {
      console.error('Erro ao buscar abrigos:', error);
    }
  };

  const handleCadastro = async () => {
    if (isAdmin) {
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
    } else {
      const data = {
        nomeUsuario: username,
        senha: password,
        email: email,
        abrigoId: Number(abrigoId),
      };

      try {
        await axios.post('https://project3-2024a-anthony-luizfelipe-backend.onrender.com/usuarios', data);
        navigate('/login');
      } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
      }
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro</h2>
      <div className='radio-group' >
        <label>
          <input
            type="radio"
            value="admin"
            checked={isAdmin}
            onChange={() => setIsAdmin(true)}
          />
          Administrador
        </label>
        <label>
          <input
            type="radio"
            value="usuario"
            checked={!isAdmin}
            onChange={() => setIsAdmin(false)}
          />
          Usuário
        </label>
      </div>
      <div>
        <input
          type="text"
          placeholder="Nome"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='input-cadastro'
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='input-cadastro'
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='input-cadastro'
        />
      </div>
      {isAdmin ? (
        <>
          <div>
            <input
              type="text"
              placeholder="Nome do Abrigo"
              value={abrigoNome}
              onChange={(e) => setAbrigoNome(e.target.value)}
              className='input-cadastro'
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Endereço do Abrigo"
              value={abrigoEndereco}
              onChange={(e) => setAbrigoEndereco(e.target.value)}
              className='input-cadastro'
            />
          </div>
        </>
      ) : (
        <div>
          <select className='input-cadastro' value={abrigoId} onChange={(e) => setAbrigoId(e.target.value)}>
            <option value="">Selecione um abrigo</option>
            {abrigos.map((abrigo) => (
              <option key={abrigo.id} value={abrigo.id}>
                {abrigo.nome}
              </option>
            ))}
          </select>
        </div>
      )}
      <button className="signup-button" onClick={handleCadastro}>
        Cadastrar-se
      </button>
    </div>
  );
}

export default Cadastro;
