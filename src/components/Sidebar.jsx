import React from 'react';
import './Sidebar.css';
import {jwtDecode} from "jwt-decode";
import { Link } from 'react-router-dom';

const Sidebar = ({ toggleSidebar, isOpen }) => {
  const token = localStorage.getItem('token');
  let isAdm;
  let isAdmin;
  if (token) {
  const decodedToken = jwtDecode(token);
    isAdm = decodedToken.isAdmin;
    if(isAdm == true){
      isAdmin = "Administrador";
    }else{
      isAdmin = "Voluntario";
    }
  }
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <button className="close-sidebar" onClick={toggleSidebar}>
          &times;
        </button>
        <div >
          <span className="user-isAdmin">Usuario: {isAdmin}</span>
        </div>
        <ul>
        {/* <li><Link className='abrigo-link' to="/dashboard-abrigos" onClick={toggleSidebar}>Abrigos</Link></li> */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
