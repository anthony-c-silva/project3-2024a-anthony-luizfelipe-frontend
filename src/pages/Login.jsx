import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import Cuidar from '../assets/cuidar.svg';
import api from '../services/api';
import { jwtDecode } from "jwt-decode";
import LoginImage from '../assets/mobile-login-cuate.png'; // Adicione a imagem que deseja usar
import Loading from './Loading'; // Importe o componente de Loading

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Estado para controlar a exibição do Loading

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email e senha são obrigatórios');
      return;
    }

    const data = {
      email: email,
      senha: password,
    };

    setLoading(true); // Ativa o Loading antes de fazer a requisição

    try {
      const response = await api.post('/login', data);
      const { token } = response.data;
      localStorage.setItem('token', token);

      const decodedToken = jwtDecode(token);

      const { abrigoId } = decodedToken;
     
      navigate(`/dashboard-adm/${abrigoId}`);
    } catch (error) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false); // Desativa o Loading após a requisição
    }
  };

  return (
    <div className="login-page">
      <div className="login-image-container">
        <img src={LoginImage} alt="Login visual" className="login-image" />
      </div>
      <div className="login-wrapper">
        <div className="login-container">
          <img src={Cuidar} className="logo" alt="React logo" />
          <h2 className="titulo">Login</h2>
          {error && <p className="error-message">{error}</p>}
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
          <button className="login-button" onClick={handleLogin}>Entrar</button>
          <label className='label'>Não tem uma conta? <a className="link" onClick={() => navigate('/cadastro')}>inscreva-se</a></label>
        </div>
      </div>
      {loading && <Loading />}
    </div>
  );
}

export default Login;
