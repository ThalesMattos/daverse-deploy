import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../../images/universo.png';
import { FaBell, FaUserAlt } from 'react-icons/fa'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';  

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [Username, setUsername] = useState(""); 
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); 

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setUsername(token ? localStorage.getItem('username') : "");
    setRole(token ? localStorage.getItem('role') : "");
  };

  useEffect(() => {
    checkLoginStatus(); 
  }, [location.pathname]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setIsLoggedIn(false);
      setUsername("");
      setRole("");
      setIsDropdownOpen(false);
      navigate('/');
    } else {
      navigate('/login');
    }
  };
  const handleHistorico = () => {
    if (isLoggedIn) {
      navigate('/historico');
      setIsDropdownOpen(false);
    }
  };

  const handleCriacaoArtigo = () => {
    if (isLoggedIn) {
      navigate('/criacaoartigo');
      setIsDropdownOpen(false);
    }
  };
  const handleAdminPage = () => {
    if (isLoggedIn) {
      navigate('/admin');
      setIsDropdownOpen(false);
    }
  };

  const handleEditPerfil = () => {
    if (isLoggedIn) {
      navigate('/editperfil');
      setIsDropdownOpen(false);
    }
  };

  return (
    <nav className='navbar'>
      <div className='logo-container'>
        <div className='logo'>
          <img src={logo} alt="Logo do site" />
        </div>
        <span className='logo-text'>Daverse</span>
      </div>
      <ul className='nav-links'>
        <li><a href="/">CONTEÚDOS</a></li>
        <li><a href="/produtos">PRODUTOS</a></li>
        <li><a href="/servicos">SERVIÇOS</a></li>
      </ul>
      <div className="navbar-actions">
        <div className="notification-icon">
          <FaBell />
          <span className="notification-count">3</span>
        </div>

        {isLoggedIn ? (
          <div className="user-menu">
            <button className="user-button" onClick={toggleDropdown}>
              <FaUserAlt className="user-icon" />
              <span>{Username || "Usuário"}</span>
            </button>

            {isDropdownOpen && (
              <div className="user-dropdown">
                <ul>
                <li><button onClick={handleEditPerfil}>Perfil</button></li>
                {["ADMIN"].includes(role) && (
                    <>
                      <li><button onClick={handleAdminPage}>Administrar</button></li>
                    </>
                  )}
                {["ADMIN", "CONTENT_CREATOR"].includes(role) && (
                    <>
                      <li><button onClick={handleCriacaoArtigo}>Criação artigo</button></li>
                    </>
                  )}
                <li><button onClick={handleHistorico}>Historico</button></li>
                <li><button onClick={handleLoginLogout}>Sair</button></li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button className="login-button" onClick={handleLoginLogout}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
