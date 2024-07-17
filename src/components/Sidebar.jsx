import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ toggleSidebar, isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <button className="close-sidebar" onClick={toggleSidebar}>
          &times;
        </button>
        <ul>
          <li><Link to="/" onClick={toggleSidebar}>Home</Link></li>
          <li><Link to="/dashboard" onClick={toggleSidebar}>Dashboard</Link></li>
          <li><Link to="/settings" onClick={toggleSidebar}>Settings</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
