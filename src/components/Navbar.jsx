import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import Avatar from 'react-avatar';
import './Navbar.css';
import logo from '../assets/cuidar.svg';
import hamburgerIcon from '../assets/hamburger.svg';
import Sidebar from './Sidebar';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let abrigoId;
  let nomeUser;
  if (token) {
    const decodedToken = jwtDecode(token);
    abrigoId = decodedToken.abrigoId;
    nomeUser = decodedToken.nome;
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src={hamburgerIcon}
          alt="Menu"
          className="hamburger-icon"
          onClick={toggleSidebar}
        />
        <img src={logo} alt="Logo" className="navbar-logo" />
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
                <Link to="#" className="dropdown-item">Perfil</Link>
                <Link to="/" className="dropdown-item" onClick={handleLogout}>Sair</Link>
              </div>
            )}
          </li>
        </ul>
      </div>
      <Sidebar toggleSidebar={toggleSidebar} isOpen={sidebarOpen} /> {/* Render Sidebar */}
    </nav>
  );
};

export default Navbar;
