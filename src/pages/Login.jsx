import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('Username:', username);
    console.log('Password:', password);
    navigate('/dashboard-usuario');
  };

  return (
    <>
    <div className="login-container">
        <h2>Login</h2>
        <div>
            <input type="text" placeholder="Username"/>
        </div>
        <div>
            <input type="password" placeholder="Password"/>
        </div>
        <button className="login-button" onClick={handleLogin}>Login</button>
    </div>
    </>
  );
}

export default Login;
