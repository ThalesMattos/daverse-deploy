import React, { useEffect, useState } from 'react';
import './VisualizarProduto.css';
import ReportError from '../RepostErro/ReportError';

const VisualizarProduto = () => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const storedProduct = localStorage.getItem('selectedProduct');
        if (storedProduct) {
            const parsedProduct = JSON.parse(storedProduct);
            setProduct(parsedProduct);
        }
    }, []);

    if (!product) {
        return <div className="error-message">Produto não encontrado</div>;
    }

    return (
        <div className="visualizar-produto">
            <div className="product-left">
                <div className="product-image">
                    <img src={product.mediaLink} alt={product.nome} className="product-image" />
                </div>
                <p className="product-price">R$ {product.valor.toFixed(2)}</p>
                <p className="product-contact">Contato: {product.contact}</p>
            </div>
            <div className="product-right">
                <h1 className="product-name">{product.nome}</h1>
                <h4 className="product-creator">Criador: {product.creator}</h4>
                <p className="product-tags">{product.tags.join(', ')}</p>
                <h4>Descrição:</h4>
                <p className="product-description">{product.descricao}</p>
            </div>
        </div>
    );
};

export default VisualizarProduto;
