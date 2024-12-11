import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Conteudo.css";
import rpg from "../../images/rpg1.png";
import rpg2 from "../../images/rpg2.png";
import axios from "axios";

const Conteudo = () => {
  const imagestop = [
    {
      image: rpg,
      title: "The impact of technology",
      text: "A tecnologia de RPG está mudando, fique ligado nas novidades",
    },
    {
      image: rpg2,
      title: "D&D new update",
      text: "O update do D&D trouxe novas melhorias",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [medias, setMedias] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedMedias, setSelectedMedias] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const bodyLimit = 170;
  const navigate = useNavigate();

  const nextImage = () =>
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imagestop.length);
  const prevImage = () =>
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + imagestop.length) % imagestop.length
    );

  const truncateText = (text) =>
    text && text.length > bodyLimit ? `${text.slice(0, bodyLimit)}...` : text;

  const handleTagClick = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    filterArticles(updatedTags, selectedMedias);
  };

  const handleMediaClick = (media) => {
    const updatedMedias = selectedMedias.includes(media)
      ? selectedMedias.filter((mt) => mt !== media)
      : [...selectedMedias, media];
    setSelectedMedias(updatedMedias);
    filterArticles(selectedTags, updatedMedias);
  };

  const filterArticles = (tags, medias) => {
    const filtered = images.filter(
      (image) =>
        (tags.length === 0 || tags.every((tag) => image.tags.includes(tag))) &&
        (medias.length === 0 ||
          medias.every((media) => image.medias.includes(media)))
    );
    setFilteredImages(filtered);
  };

  const handleHistorico = async (event, id) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://18.216.79.53:8080/article/views",
        {
          articleId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      console.error("Erro ao cadastrar histórico", error);
    }
  };

  const handleOpenContent = (event, content) => {
    localStorage.setItem("selectedContent", JSON.stringify(content));
    handleHistorico(event, content.id);
    navigate(`/visualizar-artigo/${content.id}`);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://18.216.79.53:8080/article");
        const storedTags = localStorage.getItem('filterTags');
        
        if (!isMounted) return;

        const fetchedImages = response.data.map((article) => ({
          id: article.id,
          image: article.image,
          title: article.title,
          body: article.body,
          subtitle: article.subtitle,
          authorUsername: article.authorUsername,
          tags: article.tags || [],
          medias: article.mediaTypeTag || [],
          totalScore: article.articleStats.totalScore,
        }));

        setImages(fetchedImages);
        
        setTags([
          ...new Set(response.data.flatMap((article) => article.tags || [])),
        ]);
        setMedias([
          ...new Set(
            response.data.flatMap((article) => article.mediaTypeTag || [])
          ),
        ]);

        if (storedTags) {
          try {
            const parsedTags = JSON.parse(storedTags);
            
            if (Array.isArray(parsedTags) && parsedTags.length > 0) {
              console.log('Applying stored tags:', parsedTags);
              setSelectedTags(parsedTags);
              
              const filtered = fetchedImages.filter(
                (image) => parsedTags.every((tag) => image.tags.includes(tag))
              );
              console.log('Filtered results:', filtered);
              
              if (isMounted) {
                setFilteredImages(filtered);
              }
            }
            
            localStorage.removeItem('filterTags');
          } catch (parseError) {
            console.error('Error parsing stored tags:', parseError);
            localStorage.removeItem('filterTags');
          }
        } else {
          if (isMounted) {
            setFilteredImages(fetchedImages);
          }
        }

      } catch (error) {
        console.error("Erro ao obter dados do usuário:", error);
        if (isMounted) {
          setImages([...imagestop]);
          setFilteredImages([...imagestop]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchArticles();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedTags.length > 0) {
      filterArticles(selectedTags, selectedMedias);
    }
  }, [selectedTags]);

  return (
    <div>
      <div className="content-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-button">
            <Link to="/">Home</Link>
          </button>
          <button className="toolbar-button">
            <Link to="/gratuitos">Gratuitos</Link>
          </button>
          <button
            className="toolbar-button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            Filtro
          </button>
        </div>
        <div className="toolbar-right">
          <input
            type="text"
            className="filter-search"
            placeholder="Buscar por filtros..."
          />
        </div>
      </div>

      {isFilterOpen && (
        <div className="sidebar">
          <h3>Filtrar por Tags</h3>
          <div className="tag-selector">
            {tags.map((tag) => (
              <div
                key={tag}
                className={`tag ${selectedTags.includes(tag) ? "selected" : ""}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
          <h3>Filtrar por Tipo de Mídia</h3>
          <div className="tag-selector">
            {medias.map((media) => (
              <div
                key={media}
                className={`media-tag ${selectedMedias.includes(media) ? "selected" : ""}`}
                onClick={() => handleMediaClick(media)}
              >
                {media}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="carousel">
        <button className="carousel-button" onClick={prevImage}>
          ❮
        </button>
        <img
          src={imagestop[currentIndex].image}
          alt={`Slide ${currentIndex}`}
          className="carousel-image"
        />
        <button className="carousel-button" onClick={nextImage}>
          ❯
        </button>
      </div>

      <div className="articles">
        {filteredImages.map((imageItem, index) => (
          <button
            key={index}
            className="article"
            onClick={(event) => handleOpenContent(event, imageItem)}
          >
            <img
              src={imageItem.image}
              alt={`Article ${index}`}
              className="article-image"
            />
            <h3>{imageItem.title}</h3>
            <p>{truncateText(imageItem.body)}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Conteudo;
