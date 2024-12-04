import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Servicos.css';

const Servicos = () => {
  const navigate = useNavigate();
  return (
    <div>
   <button className='consultoria' onClick={() => navigate('consultoria')}>Inscrever-se para consultoria de um produto</button>
   <button className='criador' onClick={() => navigate('inscricao')}>Inscrever-se para se tornar um criador de conteúdo</button>
   </div>
  )
}

export default Servicos