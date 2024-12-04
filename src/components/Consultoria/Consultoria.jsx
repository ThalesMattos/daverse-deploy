import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Consultoria.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Consultoria = () => {
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [fileError, setFileError] = useState("");
    const navigate = useNavigate();
    const maxCharacters = 800;
    const maxLines = 14;

    const handleSubmit = async (event) => {
        event.preventDefault();

        setDescriptionError("");
        setFileError("");

        let valid = true;

        if (!description) {
            setDescriptionError("Descrição é obrigatória.");
            valid = false;
        }

        if (!file) {
            setFileError("Arquivo é obrigatório.");
            valid = false;
        }

        if (!valid) return;

        const formData = new FormData();
        formData.append('text', description);
        formData.append('document', file);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/forms/consultancy', formData, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setDescription("");
            setFile(null);
            setFileName("");
            toast.success("Enviado com sucesso! \nEm verificação, aguarde via e-mail",{
                autoClose: 3000,
            });
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
            console.error("Erro ao enviar form:", error);
            toast.error("Erro ao enviar o formulário. Tente novamente.", {
                autoClose: 3000,
            });
        }
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        const lineCount = (value.match(/\n/g) || []).length + 1;

        if (lineCount <= maxLines && value.length <= maxCharacters) {
            setDescription(value);
            if (descriptionError) setDescriptionError("");
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setFileError("Apenas arquivos PDF são aceitos.");
                setFile(null);
                setFileName("");
                return;
            } else {
                setFile(selectedFile);
                setFileName(selectedFile.name);
                if (fileError) setFileError(""); 
            }
        } else {
            setFile(null);
            setFileName("");
        }
    };

    return (
        <div className="containerCadastro">
          <h1>Formulário de inscrição consultoria</h1>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div className="input-field">
                    <p>Descreva um pouco sobre você e sua ideia</p>
                    <textarea 
                        placeholder="Escreva uma descrição sobre você" 
                        rows="14"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    {descriptionError && <p className="error-message">{descriptionError}</p>}
                    <small style={{ color: '#ffffff' }}>{description.length}/{maxCharacters} caracteres</small>
                    
                </div>
                <div className="upload-field">
                    <label htmlFor="file-upload" className="upload-button">
                        <i className="fas fa-upload"></i> Upload Arquivo
                        <input
                            type="file"
                            id="file-upload"
                            accept=".pdf"
                            onChange={handleFileChange}
                        />
                    </label>
                    {fileName && <p className="file-name">Arquivo selecionado: {fileName}</p>}
                    {fileError && <p className="error-message">{fileError}</p>}
                </div>
                <div className='retrive-linkFormsConsultoria'>
                    <button type='button' className="botaoVoltar" onClick={() => navigate(-1)}>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <button className="botaoForms" type='submit'>Enviar</button>
                </div>
            </form>
        </div>
    );
}

export default Consultoria;
