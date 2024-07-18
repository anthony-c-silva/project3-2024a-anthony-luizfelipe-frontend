import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import TelaInicial from './pages/TelaInicial.jsx';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import DashboardAbrigos from './pages/DashboardAbrigo.jsx';
import DashboardAdm from './pages/DashboardAdm.jsx';
import Navbar from './components/Navbar.jsx';

const App = () => {
  const location = useLocation();
  const showNavbar = location.pathname.includes('/dashboard-abrigos') || location.pathname.includes('/dashboard-adm');

  return (
    <>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? 'content-with-navbar' : ''}>
        <Routes>
          <Route path="/" element={<TelaInicial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/dashboard-abrigos" element={<DashboardAbrigos />} />
          <Route path="/dashboard-adm/:id" element={<DashboardAdm />} />
          
        </Routes>
      </div>
    </>
  );
};

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
