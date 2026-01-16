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


  return (

    <div style={{ minHeight: '100vh', width: '100vw', position: 'relative', }}>
      <AnimatedBg />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar color="light" light expand="md">
          <Logo src={process.env.PUBLIC_URL + '/assets/images/logo.png'} alt="Logo" onClick={() => window.location.href = '/'} />

          <NavbarBrand href="/" style={
            {
              color: 'green'
            }
          }
          >Presupresto</NavbarBrand>
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
            <NavbarText>Simple Text</NavbarText>
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
