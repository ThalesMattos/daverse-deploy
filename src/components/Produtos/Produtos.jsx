import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Produtos.css";

const Produtos = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/products");
        const fetchedProducts = response.data.map((product) => ({
          id: product.id,
          image: product.mediaLink,
          name: product.nome,
          tags: product.tags || [],
          creator: product.creator,
          valor: product.valor,
          descricao: product.descricao,
          contact: product.contact,
        }));
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setTags([
          ...new Set(response.data.flatMap((product) => product.tags || [])),
        ]);
      } catch (error) {
        console.error("Erro ao obter dados dos produtos:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleTagClick = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    filterProducts(updatedTags);
  };

  const filterProducts = (tags) => {
    const filtered = products.filter(
      (product) =>
        tags.length === 0 || tags.every((tag) => product.tags.includes(tag))
    );
    setFilteredProducts(filtered);
  };

  const handleProductClick = (product) => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    navigate(`/produto/${product.id}`);
  };

  return (
    <div>
      <div className="content-toolbar">
        <button
          className="toolbar-button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          Filtro
        </button>
      </div>
      <div className="produtos-page">
        {isFilterOpen && (
          <div className="sidebar">
            <h3>Filtrar por Tags</h3>
            <div className="tag-selector">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className={`tag ${
                    selectedTags.includes(tag) ? "selected" : ""
                  }`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="products">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="product-item"
              onClick={() => handleProductClick(product)}
            >
              <img
                src={product.image}
                alt={`Produto ${index}`}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p className="product-tags">{product.tags.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Produtos;
