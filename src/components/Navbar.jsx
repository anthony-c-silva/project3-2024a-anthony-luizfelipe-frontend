import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import Avatar from 'react-avatar';
import './Navbar.css';
import logo from '../assets/cuidar.svg';

const Navbar = () => {
  const token = localStorage.getItem('token');
  let abrigoId;
  let nomeUser;
  if (token) {
    const decodedToken = jwtDecode(token);
    abrigoId = decodedToken.abrigoId;
    nomeUser = decodedToken.nome;
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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
          <li>
            <div className="user-profile" onClick={toggleDropdown}>
              <Avatar name={nomeUser} round size="40" />
              <span className="user-name">{nomeUser}</span>
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="#" className="dropdown-item ">Perfil</Link>
                <Link to="/" className="dropdown-item">Sair</Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
