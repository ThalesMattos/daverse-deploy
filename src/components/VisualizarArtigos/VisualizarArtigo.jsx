import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./VisualizarArtigo.css";
import ReportError from '../RepostErro/ReportError';

const VisualizarArtigo = () => {
  const [content, setContent] = useState(null);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [errorDescription, setErrorDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const rateLoad = async (contentId) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `http://18.216.79.53:8080/article/check-if-user-liked-article/${contentId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLiked(response.data);
      } catch (error) {
        if (error.response) {
          const { status } = error.response;
    
          if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
    
            return;
          }
        }
        console.error("Erro ao verificar se o usuário curtiu o artigo: ", error);
      }
    };
  
    const storedContent = localStorage.getItem('selectedContent');
    if (storedContent) {
      const parsedContent = JSON.parse(storedContent);
      setContent(parsedContent);
      rateLoad(parsedContent.id);
    }
  }, []);

  if (!content) {
    return <div className="error-message">Conteúdo não encontrado</div>;
}

  const rateArticle = async () => {
    if (!content || !content.id || loading ) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://18.216.79.53:8080/article/rate/${content.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedContent = { ...content, totalScore: response.data };
      setContent(updatedContent);
      setLiked(!liked);
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
      console.error("Erro ao enviar avaliação: ", error);
    } finally {
      setLoading(false);
    }
  };
  const handleReportError = async () => {
    if (!errorDescription.trim()) {
      alert("Por favor, descreva o erro antes de enviar.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Você precisa estar logado para reportar um erro.");
        return;
      }
      debugger;

      await axios.post(
        `http://18.216.79.53:8080/article/report-error/${content.id}`,
        { errorDescription: errorDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Erro reportado com sucesso!");
      setShowReportPopup(false);
      setErrorDescription("");
    } catch (error) {
      console.error("Erro ao reportar: ", error);
      alert("Não foi possível reportar o erro.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="containerArtigo">
    <h1 className="artigo-titulo">{content.title}</h1>
    
    <div className="artigo-infos">
      <h2 className="artigo-subs">Por: {content.authorUsername}</h2>
      <h2 className="artigo-subs">Total likes: {content.totalScore}</h2>
      <div
        className={`rating-hearth ${liked ? 'liked' : ''}`}
        onClick={rateArticle}
        title="Avaliar"
      >❤</div>
      <div
        className={`rating-star ${favorited ? 'favorited' : ''}`}
        onClick={null}
        title="Favoritar"
      >★</div>
      <div
          className="rating-warning"
          onClick={() => setShowReportPopup(true)}
          title="Reportar erro"
        >⚠</div>
    </div>
    
    <h2 className="artigo-subtitulo">{content.subtitle}</h2>
        
    {/* <body className="artigo-corpo"  >{content.body}</body> */}
    <div className="artigo-corpo">
    {content.body.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
    
    <div className="artigo-tags">
      {content.tags.map((tag, index) => (
        <span key={index} className="artigo-tag">
          {tag}
        </span>
      ))}
    </div>
    
    <div className="artigo-acoes">
      <button onClick={() => navigate(-1)}>Voltar para Conteúdos</button>
    </div>

    <div className="artigo-acoes">
      <button onClick={() => {
        localStorage.setItem('filterTags', JSON.stringify(content.tags));
        navigate('/');
      }}>Ver Conteúdos similares</button>
    </div>

    {showReportPopup && (
    <div className="modal">
      <div className="modal-content">
        <h3>Reportar Erro</h3>
        <textarea
          value={errorDescription}
          onChange={(e) => setErrorDescription(e.target.value)}
          placeholder="Descreva o erro encontrado."
        ></textarea>
        <div className="modal-actions">
          <button onClick={() => setShowReportPopup(false)}>Cancelar</button>
          <button onClick={handleReportError} disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  )}
  </div>
  );
};

export default VisualizarArtigo;