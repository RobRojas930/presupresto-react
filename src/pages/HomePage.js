import styled from 'styled-components';
import React, { useState, useRef, useEffect } from 'react';
import Particles from 'react-tsparticles';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // <-- AGREGA ESTO ARRIBA

import Dashboard from './DashboardPage';
import Transacciones from './TransactionsPage';
import Presupuestos from './BudgetPage';
import Categorias from './CategoriesPage';
import Historico from './HistoryPage';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import AnimatedBg from '../components/animated-bg';

const Logo = styled.img`
  position: relative;
  
  width: 40px;
  height: auto;
  z-index: 10;
  cursor: pointer;
    margin-right: 16px; // <-- Agrega este margen

`;






const HomePage = () => {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);


  // Obtener información de usuario desde localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const user = userData.data || {};
  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', position: 'relative' }}>
      <AnimatedBg />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar color="light" light expand="md">
          <Logo src={process.env.PUBLIC_URL + '/assets/images/logo.png'} alt="Logo" onClick={() => window.location.href = '/'} />
          <NavbarBrand href="/" style={{ color: 'green' }}>Presupresto</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="me-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/dashboard">Dashboard</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/transacciones">Transacciones</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/presupuestos">Presupuestos</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/categorias">Categorias</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/historico">Historico</NavLink>
              </NavItem>
            </Nav>
            {/* Dropdown de usuario */}
            <Nav navbar>
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} nav inNavbar>
                <DropdownToggle nav caret>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#e0e0e0',
                      marginRight: 8,
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#555"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ display: 'block' }}
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                  </span>
                  {user.name || 'Usuario'}
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem header>
                    <strong>{user.name || 'Usuario'}</strong>
                    <div style={{ fontSize: 12, color: '#888' }}>{user.email || ''}</div>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={handleLogout}>Cerrar sesión</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Nav>
          </Collapse>
        </Navbar>
        <Routes>
          <Route path="/" element={<h1>Bienvenido a Presupresto</h1>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transacciones" element={<Transacciones />} />
          <Route path="/presupuestos" element={<Presupuestos />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/historico" element={<Historico />} />
        </Routes>
      </div>
    </div>
  );
}

export default HomePage;
