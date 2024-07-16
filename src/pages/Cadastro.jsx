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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
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

  const validateForm = () => {
    let formErrors = {};
    if (!username) formErrors.username = "Nome é obrigatório";
    if (!email) formErrors.email = "Email é obrigatório";
    if (!password) formErrors.password = "Senha é obrigatória";
    if (isAdmin) {
      if (!abrigoNome) formErrors.abrigoNome = "Nome do abrigo é obrigatório";
      if (!abrigoEndereco) formErrors.abrigoEndereco = "Endereço do abrigo é obrigatório";
    } else {
      if (!abrigoId) formErrors.abrigoId = "Abrigo é obrigatório";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleCadastro = async () => {
    if (!validateForm()) return;

    const data = isAdmin ? {
      nomeUsuario: username,
      senha: password,
      email: email,
      abrigo: {
        nome: abrigoNome,
        endereco: abrigoEndereco,
      },
    } : {
      nomeUsuario: username,
      senha: password,
      email: email,
      abrigoId: Number(abrigoId),
    };

    try {
      const url = isAdmin 
        ? 'https://project3-2024a-anthony-luizfelipe-backend.onrender.com/primeiro-admin' 
        : 'https://project3-2024a-anthony-luizfelipe-backend.onrender.com/usuarios';
      await axios.post(url, data);
      setShowConfirmation(true);
    } catch (error) {
      setServerError(error.response?.data?.error || 'Erro ao cadastrar usuário');
      console.error('Erro ao cadastrar:', error);
    }
  };

  const handleModalClose = () => {
    setShowConfirmation(false);
    navigate('/login');
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro</h2>
      <div className='radio-group'>
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
          Voluntário
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
        {errors.username && <span className="error">{errors.username}</span>}
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='input-cadastro'
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div>
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='input-cadastro'
        />
        {errors.password && <span className="error">{errors.password}</span>}
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
            {errors.abrigoNome && <span className="error">{errors.abrigoNome}</span>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Endereço do Abrigo"
              value={abrigoEndereco}
              onChange={(e) => setAbrigoEndereco(e.target.value)}
              className='input-cadastro'
            />
            {errors.abrigoEndereco && <span className="error">{errors.abrigoEndereco}</span>}
          </div>
        </>
      ) : (
        <div>
          <select className='input-select' value={abrigoId} onChange={(e) => setAbrigoId(e.target.value)}>
            <option value="">Selecione um abrigo</option>
            {abrigos.map((abrigo) => (
              <option key={abrigo.id} value={abrigo.id}>
                {abrigo.nome}
              </option>
            ))}
          </select>
          {errors.abrigoId && <span className="error">{errors.abrigoId}</span>}
        </div>
      )}
      <button className="signup-button" onClick={handleCadastro}>
        Cadastrar-se
      </button>
      {serverError && <span className="error">{serverError}</span>}
      
      {showConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <h3>Cadastro realizado com sucesso!</h3>
            <p>Seu cadastro foi concluído com sucesso.</p>
            <button onClick={handleModalClose}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cadastro;
