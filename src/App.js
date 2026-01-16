
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { createGlobalStyle } from 'styled-components';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
    background: #f5f6fa;
  }
`;

// Simulación de autenticación

function App() {
  const user = localStorage.getItem('user');
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path='/*' element={user !== null ? <HomePage /> : <LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
