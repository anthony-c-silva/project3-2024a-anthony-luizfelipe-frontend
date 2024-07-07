import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import Cuidar from '../assets/cuidar.svg';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email e senha são obrigatórios');
      return;
    }

    const data = {
      email: email,
      senha: password,
    };

    try {
      const response = await axios.post('https://project3-2024a-anthony-luizfelipe-backend.onrender.com/login', data);
      const { token } = response.data;
      localStorage.setItem('token', token);

      const decodedToken = jwtDecode(token);
      const { id } = decodedToken;

      navigate(`/dashboard-abrigo/${id}`);
    } catch (error) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="login-container">
      <div>
        <img src={Cuidar} className="logo react" alt="React logo" />
      </div>
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
      <button className="login-button" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
