import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./AdminForms.css";

const AdminForms = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [contentCreatorTable, setContentCreatorTable] = useState([]);
  const [consultoriaTable, setConsultoriaTable] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://18.216.79.53:8080/forms", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setContentCreatorTable(response.data.contentCreators);
        setConsultoriaTable(response.data.consultancies);

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
        console.error("Erro ao obter dados do usuário:", error);
        setContentCreatorTable([]);
        setConsultoriaTable([]);
      }
    };
    fetchForms();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleAnularCriador = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    
    if (selectedRows.length === 0) {
      alert("Nenhum criador de conteúdo foi selecionado.");
      return;
    }
    try {
      const response = await axios.delete("http://18.216.79.53:8080/forms/erase-form", {
        data: { ids: selectedRows },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        alert("Cargos dos criadores de conteúdo aprovados com sucesso!");
        setContentCreatorTable((prevTable) =>
          prevTable.filter((item) => !selectedRows.includes(item.id))
        );
        setSelectedRows([]);
      } else {
        console.error("Erro ao reprovar os criadores de conteúdo:", response.data);
        alert("Falha ao aprovar os criadores de conteúdo.");
      }
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
      console.error("Erro na requisição para reprovar criadores de conteúdo:", error);
      alert("Erro na comunicação com o servidor.");
    }

  }

  const handleConfirmarCriador = async (event) => {
    event.preventDefault();
    
    const token = localStorage.getItem('token');
  
    if (selectedRows.length === 0) {
      alert("Nenhum criador de conteúdo foi selecionado.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://18.216.79.53:8080/forms/approve-content-creator",
        { ids: selectedRows },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        alert("Cargos dos criadores de conteúdo aprovados com sucesso!");
        setContentCreatorTable((prevTable) =>
          prevTable.filter((item) => !selectedRows.includes(item.id))
        );
        setSelectedRows([]);
      } else {
        console.error("Erro ao aprovar os criadores de conteúdo:", response.data);
        alert("Falha ao aprovar os criadores de conteúdo.");
      }
    } catch (error) {
      console.error("Erro na requisição para aprovar criadores de conteúdo:", error);
      alert("Erro na comunicação com o servidor.");
    }
  };

  return (
    <div className="admin-container">
      <div className="container-tabela">
        <h3>Solicitações criador de conteúdo</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Selecionar</th>
                <th>Usuário</th>
                <th>Nome</th>
                <th>Nome Artístico</th>
                <th>Email</th>
                <th>Rede Social</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              {contentCreatorTable.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleCheckboxChange(row.id)}
                    />
                  </td>
                  <td>{row.author}</td>
                  <td>{row.fullName}</td>
                  <td>{row.stageName}</td>
                  <td>{row.email}</td>
                  <td>{row.socialMedia}</td>
                  <td>{row.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='botoes-tabela'>
          <button className="botao-anular" onClick={handleAnularCriador} >Anular</button>
          <button className="botao" onClick={handleConfirmarCriador}>Confirmar</button>
        </div>
      </div>

      <div className="container-tabela">
        <h3>Solicitações de consultoria</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Email</th>
                <th>Descrição</th>
                <th>Arquivo</th>
              </tr>
            </thead>
            <tbody>
              {consultoriaTable.map((row) => (
                <tr key={row.id}>
                  <td>{row.author}</td>
                  <td>{row.email}</td>
                  <td>{row.text}</td>
                  <td>
                    <a href={row.fileLink} target="_blank" rel="noopener noreferrer">
                      Baixar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminForms;
