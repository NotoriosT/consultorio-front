import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/Axion'; // Importa a instância configurada do Axios
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home'); // Redireciona para /home se o token existir
        }
    }, [navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await api.post('/auth/login', {
                username,
                password,
            });

            const token = response.data.token;
            localStorage.setItem('token', token); // Armazena o token no localStorage

            navigate('/home'); // Redireciona para a página principal após o login
        } catch (error) {
            setError('Usuário ou senha inválidos.');
        }
    };

    return (
        <div className="container-fluid login-container">
            <div className="row justify-content-center align-items-center min-vh-100">
                <div className="col-md-6 col-lg-4 login-box">
                    <div className="text-center">
                        <img src="/img/logo.png" alt="Logo" className="logo mb-4" />
                        <h1 className="title mb-4">Seja Bem Vindo</h1>
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <form className="form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Usuário</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control mb-3"
                                placeholder="Usuário"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Senha</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control mb-3"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
