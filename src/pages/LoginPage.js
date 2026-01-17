import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import Swal from 'sweetalert2';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f5f6fa;
`;

const Form = styled.form`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 300px;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem;
  background: #2d98da;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
`;

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.auth);


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Aquí iría la lógica de autenticación
        const result = await dispatch(login({ email, password }));
        if (login.fulfilled.match(result)) {
            const message = result.payload.message;
                window.location.href = '/';

            Swal.fire(message, '', 'success');
            
        } else if (login.rejected.match(result)) {
            const errorMsg = result.payload?.message || result.error?.message || 'Error';
            Swal.fire(errorMsg, '', 'error');
        }
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>
                <Input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <Button type="submit">Entrar</Button>
            </Form>
        </Container>
    );
}

export default LoginPage;
