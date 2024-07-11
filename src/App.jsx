import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import TelaInicial from './pages/TelaInicial.jsx';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import DashboardUsuario from './pages/DashboardUsuario.jsx';
import DashboardAbrigo from './pages/DashboardAbrigo.jsx';
import Navbar from './components/Navbar.jsx';

const App = () => {
  const location = useLocation();
  const showNavbar = location.pathname.includes('/dashboard-usuario') || location.pathname.includes('/dashboard-abrigo');

  return (
    <>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? 'content-with-navbar' : ''}>
        <Routes>
          <Route path="/" element={<TelaInicial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/dashboard-usuario" element={<DashboardUsuario />} />
          <Route path="/dashboard-abrigo/:id" element={<DashboardAbrigo />} />
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
