import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const response = await axios.post('http://18.216.79.53:8080/auth/login', {
                username: username,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Login successful");
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('role', response.data.role);
            navigate('/', { replace: true });
        } catch (error) {
            console.error("Error during login:", error);
            setError("Falha no login. Verifique suas credenciais.");
        }
    };

    return (
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-field">
                    <p>Usuário</p>
                    <input 
                        type="text" 
                        placeholder="Usuário" 
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                </div>
                <div className="input-field">
                    <p>Senha</p>
                    <input 
                        type="password" 
                        placeholder="Senha" 
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>

                {error && <p className="error">{error}</p>} 

                <button className="botao" type='submit'>Entrar</button>

                <div className='signup-link'>
                    <p>Não tem login ainda? <Link to="/cadastro">Cadastre-se</Link></p>
                </div>
                <div className='recall-login'>
                    <Link to="/recuperacao">Esqueci minha senha</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
