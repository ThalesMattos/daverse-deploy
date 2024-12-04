import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import { ptBR } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

import "./Inscrição.css";

const Inscrição = () => {

    const [name, setName] = useState("");
    const [stageName, setStageName] = useState("");
    const [email, setEmail] = useState("");
    const [socialMedia, setSocialMedia] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            fullName: name,
            stageName,
            email,
            socialMedia,
            text: description
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8080/forms/content-creator', data, { 
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Form enviado com sucesso");
        } catch (error) {
            if (error.response) {
                const { status } = error.response;
          
                if (status === 401 || status === 403) {
                  localStorage.removeItem('token');
                  localStorage.removeItem('username');
                  localStorage.removeItem('role');
          
                  alert('Erro, seu login possivelmente expirou, entre novamente');
                  return;
                }
              }
            console.error("Erro ao enviar form:", error);
        }
    }
    return (
        <div className="containerCadastro">
          <h1>Formulário de inscrição criador de conteúdo</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-field">
                    <p>Nome completo</p>
                    <input type="text" placeholder="Nome completo" 
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <p>Nome artístico</p>
                    <input type="text" placeholder="Nome artístico" 
                        onChange={(e) => setStageName(e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <p>E-mail</p>
                    <input type="text" placeholder="E-mail" 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <p>Principal rede social</p>
                    <input type="text" placeholder="@Instagram" 
                        onChange={(e) => setSocialMedia(e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <p>Descrição</p>
                    <textarea 
                        placeholder="Escreva uma descrição sobre você" 
                        rows="5"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className='retrive-linkForms'>
                    <button type='button' className="botaoVoltar" onClick={() => navigate(-1)}>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                  <button className="botaoForms" type='submit'>Enviar</button>
                </div>
            </form>
        </div>
    );
}

export default Inscrição;
