import React, { useState } from 'react';
import axios from 'axios';
import "./AdminUsuario.css";

const AdminUsuario = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!searchQuery.trim()) {
      alert("Digite um nome para buscar.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    debugger;

    try {
      const response = await axios.get(`http://localhost:8080/user/search-by-name`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: { username: searchQuery },
      });

      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      alert("Não foi possível buscar os usuários.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        `http://localhost:8080/user/change-user-role`,
        { userId: userId, userRole: newRole },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        alert("Cargo alterado com sucesso!");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        console.error("Erro ao alterar cargo:", response.data);
        alert("Falha ao alterar o cargo do usuário.");
      }
    } catch (error) {
      console.error("Erro na requisição para alterar cargo:", error);
      alert("Erro na comunicação com o servidor.");
    }
  };

  return (
    <div className="admin-container">
      <h2>Gerenciar Usuários</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Digite o nome do usuário..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Buscar
        </button>
      </form>

      {loading && <p>Carregando...</p>}

      {users.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Cargo Atual</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="role-button"
                      onClick={() => handleRoleChange(user.id, 'USER')}
                    >
                      User
                    </button>
                    <button
                      className="role-button"
                      onClick={() => handleRoleChange(user.id, 'CONTENT_CREATOR')}
                    >
                      Content Creator
                    </button>
                    <button
                      className="role-button"
                      onClick={() => handleRoleChange(user.id, 'ADMIN')}
                    >
                      Admin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsuario;
