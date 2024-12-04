import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import "./Recuperacao.css";

const Recupercao = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(email);
        console.log("Envio");
        setError("");
        setSuccessMessage("");

        try {
            const response = await axios.post('http://localhost:8080/auth/forgot-password', {
                email: email
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setSuccessMessage("Email de recuperação enviado com sucesso!");
        } catch (error) {
            console.error("Error during password recovery:", error);
            if (error.response) {
                setError(error.response.data || "Ocorreu um erro ao enviar o e-mail.");
            } else {
                setError("Erro de rede. Tente novamente mais tarde.");
            }
        }
    };

    return (
        <div className="container">
            <h1>Recuperar senha</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-field">
                    <p>E-mail de recuperação</p>
                    <input type="text" placeholder="E-mail" 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='retrive-link'>
                    <button className="botao" type='submit'>Receber senha</button>
                    <Link to="/login">Cancelar</Link>
                </div>
                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
            </form>
        </div>
    )
}

export default Recupercao;
