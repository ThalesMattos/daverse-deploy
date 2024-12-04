import React, { useState } from "react";
import axios from 'axios';
import './CriacaoArtigo.css';

const Publicar = ({
  titulo,
  setTitulo,
  subtitulo,
  setSubtitulo,
  corpo,
  setCorpo,
  selectedTags,
  handleTagClick,
  availableTags,
  selectedMedia,
  handleMediaClick,
  availableMedia
}) => {
  return (
    <form className="form-container">
      <div className="input-container">
        <input
          type="text"
          className="titulo-input"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required 
        />
      </div>
      <div className="input-container">
        <input
          type="text"
          className="subtitulo-input"
          placeholder="Subtítulo"
          value={subtitulo}
          onChange={(e) => setSubtitulo(e.target.value)}
          required 
        />
      </div>
      <div className="input-container">
        <textarea
          className="corpo-textarea"
          placeholder="Corpo do artigo"
          value={corpo}
          onChange={(e) => setCorpo(e.target.value)}
          required 
        />
      </div>

      {/* Seção de Tags */}
      <div className="tags-container">
        {availableTags.map((tag) => (
          <div
            key={tag.value}
            className={`tag-item ${selectedTags.includes(tag.value) ? 'selected' : ''}`}
            onClick={() => handleTagClick(tag.value)}
          >
            {tag.label}
          </div>
        ))}
      </div>

      {/* Seção de Mídia */}
      <div className="media-container">
        <h3>Tipo de Mídia</h3>
        {availableMedia.map((media) => (
          <div
            key={media.value}
            className={`media-item ${selectedMedia.includes(media.value) ? 'selected' : ''}`}
            onClick={() => handleMediaClick(media.value)}
          >
            {media.label}
          </div>
        ))}
      </div>
    </form>
  );
};

const CriacaoArtigo = () => {
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [corpo, setCorpo] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);

  const availableTags = [
    { value: 'AVENTURA', label: 'Aventura' },
    { value: 'DD', label: 'D&D' },
    { value: 'TERROR', label: 'Terror' },
  ];

  const availableMedia = [
    { value: 'VIDEO', label: 'Vídeo' },
    { value: 'VIDEO_CURTO', label: 'Video Curto' },
    { value: 'ARTIGO', label: 'Artigo' },
  ];

  const handleTagClick = (tagValue) => {
    if (selectedTags.includes(tagValue)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== tagValue));
    } else {
      setSelectedTags([...selectedTags, tagValue]);
    }
  };

  const handleMediaClick = (mediaValue) => {
    if (selectedMedia.includes(mediaValue)) {
      setSelectedMedia(selectedMedia.filter((media) => media !== mediaValue));
    } else {
      setSelectedMedia([...selectedMedia, mediaValue]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');

    if (!titulo || !subtitulo || !corpo || selectedTags.length === 0 || selectedMedia.length === 0) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/article/publish', {
        title: titulo, 
        subtitle: subtitulo, 
        body: corpo,
        tags: selectedTags,
        mediaTags: selectedMedia
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Artigo publicado com sucesso:', response.data);
      alert('Artigo publicado com sucesso!');
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
      console.error('Erro ao publicar artigo:', error);
      alert('Erro ao publicar artigo. Tente novamente.');
    }
  };

  return (
    <div className="containerCriacaoArtigo">
      <Publicar
        titulo={titulo}
        setTitulo={setTitulo}
        subtitulo={subtitulo}
        setSubtitulo={setSubtitulo}
        corpo={corpo}
        setCorpo={setCorpo}
        selectedTags={selectedTags}
        handleTagClick={handleTagClick}
        availableTags={availableTags}
        selectedMedia={selectedMedia}
        handleMediaClick={handleMediaClick}
        availableMedia={availableMedia}
      />
      <button onClick={handleSubmit} className="submit-button">Publicar</button>
    </div>
  );
};

export default CriacaoArtigo;
