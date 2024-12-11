import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import { ptBR } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import perfil from '../../images/perfil.png';

import "./Edit.css";

const Edit = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [selectedGender, setSelectedGender] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
            } else {
                try {
                    const response = await axios.get('http://18.216.79.53:8080/user/get-user-info', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const { userName, name, lastName, email, gender, birthDate } = response.data;
                    setUsername(userName);
                    setName(name);
                    setSurname(lastName);
                    setEmail(email);
                    setSelectedGender(genders.find(g => g.value === gender));
                    const birthDateObject = new Date(birthDate + 'T00:00:00');
                    setSelectedDate(birthDateObject);
                } catch (error) {
                    console.error("Erro ao obter dados do usuário:", error);
                }

            }
        };
        fetchData();
    }, [navigate]);

    const genders = [
        { value: 'HOMEM_CIS', label: 'Homem cis' },
        { value: 'MULHER_CIS', label: 'Mulher cis' },   
        { value: 'HOMEM_TRANS', label: 'Homem trans' },
        { value: 'MULHER_TRANS', label: 'Mulher trans' },
        { value: 'NB', label: 'Não binário' },
        { value: 'OUTROS', label: 'Outros' },
        { value: 'NI', label: 'Prefiro não informar' }
    ];

    const validateForm = () => {

        if (password) {
            // Verifica tamanho da senha
            if (password.length < 6) {
                alert("As senhas deve ter no mínimo 6 caracteres.");
                return false;
            }
        
            // Verifica se as senhas são iguais
            if (password !== passwordConfirm) {
                alert("As senhas não coincidem.");
                return false;
            }
        }

  
      // Verifica se o email é válido
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
          alert("Por favor, insira um e-mail válido.");
          return false;
      }

      // Validação da data de nascimento: deve ter pelo menos 6 anos
      const today = new Date();
      const birthDate = new Date(selectedDate);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (age < 6 || (age === 6 && monthDifference < 0)) {
          alert("Você deve ter pelo menos 6 anos para se cadastrar.");
          return false;
      }

  
      return true;
  };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
          return;
      }

        const data = {
            username,
            password, //: password != "" ? password : null,
            name,
            lastName: surname,
            email,
            gender: selectedGender ? selectedGender.value : null,
            birthDate: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
        };
        debugger;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://18.216.79.53:8080/user/update-user-details', data,  { 
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Usuário editado com sucesso");
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
            console.error("Erro ao editar usuário:", error);
        }
    }

    return (
        <div className="containerPai">
            <div className="containerCadastroFoto">
                <img src={perfil} alt="Perfil" className="imagePerfilEdit"/>
                
                <button className="botao" type='submitPublicar'>Publicar</button>
            </div>
            <div className="containerCadastroEdit">
            <h1>Edição perfil</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-fieldEdit">
                        <p>Usuário</p>
                        <input type="text" placeholder="Usuário" value={username} readOnly={true}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-fieldEdit">
                        <p>Nome</p>
                        <input type="text" placeholder="Nome" value={name} readOnly={true}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="input-fieldEdit">
                        <p>Sobrenome</p>
                        <input type="text" placeholder="Sobrenome" value={surname} readOnly={true}
                            onChange={(e) => setSurname(e.target.value)}
                        />
                    </div>
                    <div className="input-fieldEdit">
                        <p>E-mail</p>
                        <input type="text" placeholder="E-mail" value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-fieldEdit">
                        <p>Senha</p>
                        <input type="password" placeholder="Senha" 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="input-fieldEdit">
                        <p>Confirmar Senha</p>
                        <input type="password" placeholder="Confirmar senha" 
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                    </div>
                    <div className="input-field">
                        <p>Gênero</p>
                        <Select value={selectedGender} options={genders} onChange={(selectedOption) => setSelectedGender(selectedOption)} className="custom-select" classNamePrefix="custom-select"/>
                    </div>
                    <div className="input-fieldEdit">
                        <p>Data de nascimento</p>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd/MM/yyyy"
                            locale={ptBR}
                            className="custom-datepickerEdit"
                            showYearDropdown 
                            showMonthDropdown 
                            scrollableYearDropdown 
                            yearDropdownItemNumber={140} 
                            maxDate={new Date()} 
                        />
                    </div>
                    <div className='retrive-link'>
                    <button className="botao" type='submit'>Atualizar perfil</button>
                    <Link to="/">Cancelar</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Edit;
