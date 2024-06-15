import React, { useState } from 'react';
import './Cadastro.css';
import { useNavigate } from 'react-router-dom';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState('');
  const  navigate = useNavigate();
  

  const handleCadastro = () => {
    console.log('Nome:', nome);
    console.log('Email:', email);
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Tipo:', tipo);
    navigate('/dashboard-usuario');
  };

  const handleChangeTipo = (event) => {
    setTipo(event.target.value);
  };

  return (
    <>
    <div className="cadastro-container">
        <h2>Cadastro</h2>
        <div>
            <input type="text" placeholder="Nome"/>
        </div>
        <div>
            <input type="email" placeholder="Email"/>
        </div>
        <div>
            <input type="text" placeholder="Username"/>
        </div>
        <div>
            <input type="password" placeholder="Password"/>
        </div>
        <div>
            <select value={tipo} onChange={handleChangeTipo}>
                <option value=""> Selecione...</option>
                <option value="voluntario"> Voluntário</option>
                <option value="administrador"> Administrador</option>
            </select>
        </div>

        <button className="signup-button" onClick={handleCadastro}>Cadastro</button>
    </div>
    </>
  );
}

export default Cadastro;
