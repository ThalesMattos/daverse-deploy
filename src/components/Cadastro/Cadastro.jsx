import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import { ptBR } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

import "./Cadastro.css";

const Cadastro = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [selectedGender, setSelectedGender] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();

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
      // Verifica se todos os campos estão preenchidos
      if (!username || !password || !passwordConfirm || !name || !surname || !email || !selectedGender || !selectedDate) {
          alert("Por favor, preencha todos os campos.");
          return false;
      }

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

        // console.log(username, password, passwordConfirm, name, surname, email, selectedGender, selectedDate); 
        // console.log("Envio");

        const data = {
            username,
            password,
            name,
            lastName: surname,
            email,
            gender: selectedGender ? selectedGender.value : null,
            birthDate: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
        };

        try {
            const response = await axios.post('http://localhost:8080/auth/register', data);
            console.log("Usuário cadastrado com sucesso:", response.data);
            navigate('/login', { replace: true });
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
        }
    }

    return (
        <div className="containerCadastro">
          <h1>Cadastro</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-field">
                    <p>Usuário</p>
                    <input type="text" placeholder="Usuário" 
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <p>Nome</p>
                    <input type="text" placeholder="Nome" 
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <p>Sobrenome</p>
                    <input type="text" placeholder="Sobrenome" 
                        onChange={(e) => setSurname(e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <p>E-mail</p>
                    <input type="text" placeholder="E-mail" 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <p>Senha</p>
                    <input type="password" placeholder="Senha" 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <p>Confirmar Senha</p>
                    <input type="password" placeholder="Confirmar senha" 
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <p>Gênero</p>
                    <Select options={genders} onChange={(selectedOption) => setSelectedGender(selectedOption)} className="custom-select" classNamePrefix="custom-select"/>
                </div>
                <div className="input-field">
                    <p>Data de nascimento</p>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="dd/MM/yyyy"
                        locale={ptBR}
                        className="custom-datepicker"
                        showYearDropdown 
                        showMonthDropdown 
                        scrollableYearDropdown 
                        yearDropdownItemNumber={140} 
                        maxDate={new Date()} 
                    />
                </div>
                <div className='retrive-link'>
                  <button className="botao" type='submit'>Cadastrar</button>
                  <Link to="/login">Cancelar</Link>
                </div>
            </form>
        </div>
    );
}

export default Cadastro;
