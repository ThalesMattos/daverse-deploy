import React, { useState } from 'react';
import axios from 'axios';
import './ReportError.css';

const ReportError = ({ contentId, onClose }) => {
    const [errorType, setErrorType] = useState('');
    const [errorDescription, setErrorDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const errorTypes = [
        'Informação incorreta',
        'Conteúdo ofensivo',
        'Problema de formatação',
        'Link quebrado',
        'Erro gramatical',
        'Outro'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(`http://localhost:8080/article/report-error/${contentId}`, {
                errorType,
                errorDescription
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201) {
                setMessage('Erro reportado com sucesso! Obrigado pela sua contribuição.');
                setTimeout(() => onClose(), 2000);
            }
        } catch (error) {
            setMessage('Ocorreu um erro ao enviar o relatório. Por favor, tente novamente.');
            console.error('Erro ao reportar:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="report-error-overlay">
            <div className="report-error-modal">
                <div className="report-error-content">
                    <h2>Reportar Erro no Conteúdo</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="errorType">Tipo de Erro:</label>
                            <select
                                id="errorType"
                                value={errorType}
                                onChange={(e) => setErrorType(e.target.value)}
                                required
                            >
                                <option value="">Selecione o tipo de erro</option>
                                {errorTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="errorDescription">Descrição do Erro:</label>
                            <textarea
                                id="errorDescription"
                                value={errorDescription}
                                onChange={(e) => setErrorDescription(e.target.value)}
                                required
                                rows="4"
                                placeholder="Por favor, descreva o erro em detalhes"
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Enviando...' : 'Enviar Relatório'}
                            </button>
                            <button type="button" onClick={onClose} className="cancel-button">
                                Cancelar
                            </button>
                        </div>
                    </form>
                    {message && <p className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default ReportError;