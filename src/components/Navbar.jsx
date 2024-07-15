
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import {jwtDecode} from "jwt-decode";
import logo from '../assets/cuidar.svg'; 

const Navbar = () => {
  const token = localStorage.getItem('token');
  let abrigoId;

  if (token) {
    const decodedToken = jwtDecode(token);
    abrigoId = decodedToken.abrigoId; // Certifique-se de que o campo é 'abrigoId'
  }
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <ul className="navbar-links">
          <li><Link to="/dashboard-usuario">Abrigos</Link></li>
          <li><Link to={`/dashboard-adm/${abrigoId}`}>Itens</Link></li>
        </ul>
      </div>
      <div className="navbar-right">
        <ul>
          <li><Link to="/">Sair</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
