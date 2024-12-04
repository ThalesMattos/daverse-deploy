import React from 'react';
import { useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";

import "./Admin.css";

const Admin = () => {
    const navigate = useNavigate();
    return (
    <div className="admin-container">
        <div className="admin-actions">
            <button onClick={() => navigate('cadastro-produto')}>Cadastro de produto</button>
            <button onClick={() => navigate('adminForms')}>Formularios</button>
            <button onClick={() => navigate('adminUsuario')}>Modificar usuário</button>
            <button onClick={() => navigate('relatorio')}>Visualizar relatório</button>
        </div>
    </div>

    )
}

export default Admin;
