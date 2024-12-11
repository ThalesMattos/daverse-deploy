import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./CadastroProduto.css";

const availableTags = [
  { value: "AVENTURA", label: "Aventura" },
  { value: "DD", label: "Dungeons & Dragons" },
  { value: "TERROR", label: "Terror" },
];

const CadastroProduto = () => {
  const [selectedTags, setSelectedTags] = useState([]); 
  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState('');
  const [creator, setCreator] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const navigate = useNavigate();

  const handleTagClick = (value) => {
    if (selectedTags.includes(value)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== value));
    } else {
      setSelectedTags([...selectedTags, value]);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');

    if (!productName || !creator || !description || !price || !contact || selectedTags.length === 0) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const response = await axios.post('http://18.216.79.53:8080/products', {
        nome: productName,
        creator: creator,
        descricao: description,
        valor: parseFloat(price),
        contact: contact,
        tags: selectedTags,
        mediaLink: image,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Produto publicado com sucesso:', response.data);
      alert('Produto publicado com sucesso!');
      navigate('/produtos');
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
  
        if (status === 401 || status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('role');
  
          alert('Você não tem permissão para realizar essa ação. Redirecionando para a página inicial.');
          navigate('/login', { replace: true });
          return;
        }
      }
  
      console.error('Erro ao publicar produto:', error);
      alert('Erro ao publicar produto. Tente novamente.');
    }
  };

  return (
    <div className="cadastro-produto">
      <form onSubmit={handleSubmit}>
        <div className="upload-container">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {image && (
            <div className="image-preview">
              <img src={image} alt="Pré-visualização" />
            </div>
          )}
          {image && (
            <button
              type="button"
              className="remove-image-button"
              onClick={handleRemoveImage}
            >
              Remover Imagem
            </button>
          )}
        </div>

        {/* Informações do produto */}
        <div className="product-info-container">
          <input 
            type="text" 
            placeholder="Nome do Produto" 
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          <input 
            type="text" 
            placeholder="Criador"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            required
          />
          <textarea 
            placeholder="Descrição" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input 
            type="number" 
            placeholder="Preço" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input 
            type="text" 
            placeholder="Contato" 
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />

          {/* Seleção de tags */}
          <div className="tags-container">
            {availableTags.map((tag) => (
              <div
                key={tag.value}
                className={`tag-item ${selectedTags.includes(tag.value) ? "selected" : ""}`}
                onClick={() => handleTagClick(tag.value)}
              >
                {tag.label}
              </div>
            ))}
          </div>
        </div>

        {/* Botão de publicação */}
        <div className="publish-button-container">
          <button type="submit">Publicar</button>
          <button onClick={() => navigate(-1)}>Voltar</button>
        </div>
      </form>
    </div>
  );
};

export default CadastroProduto;
