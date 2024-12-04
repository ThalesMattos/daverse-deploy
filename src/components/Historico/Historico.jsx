import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import { ptBR } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

import "./Historico.css";

const Historico = () => {
    const navigate = useNavigate();

    const [historico, setHistorico] = useState([]);
    const bodyLimit = 95;

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
            } else {
                try {
                    const response = await axios.get('http://localhost:8080/user/user-history', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }); 
                    setHistorico(response.data);
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
                    console.error("Erro ao carregar artigos:", error);
                }

            }
        };
        fetchData();
    }, [navigate]);

    const truncateText = (text) =>
        text && text.length > bodyLimit ? `${text.slice(0, bodyLimit)}...` : text;

    return (
        <div className="containerCadastro">
            <h1>Histórico de Artigos</h1>
            <ul className="historico-list">
                {historico.length > 0 ? (
                    historico.map((item, index) => (
                        <li key={index} className="historico-item">
                            <h3>{item.title}</h3>
                            <p>{truncateText(item.subtitle)}</p>
                            <p>by: {item.authorUsername}</p>
                        </li>
                    ))
                ) : (
                    <p>Nenhum artigo visto ainda.</p>
                )}
            </ul>
        </div>
    );
}

export default Historico;
