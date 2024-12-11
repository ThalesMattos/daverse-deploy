import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "./Relatorios.css";

ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const Relatorio = () => {
  const [chartDataArticle, setChartDataArticle] = useState(null);
  const [chartDataUser, setChartDataUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchArticleData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado.");

      const response = await axios.get("http://18.216.79.53:8080/article/get-article-like-data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Artigos recebidos:", response.data);
      const articleData = response.data;

      const labels = articleData.map(item => item.nome);
      const likes = articleData.map(item => item.likesOrScore);

      setChartDataArticle({
        labels: labels,
        datasets: [
          {
            label: "Artigos com Mais Likes",
            data: likes,
            backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff", "#ff6666"],
            hoverBackgroundColor: ["#ff2e63", "#2382d4", "#ff9c32", "#2fa6b6", "#7759e6", "#ff4747"],
          },
        ],
      });
    } catch (error) {
      console.error("Erro ao buscar dados de artigos:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado.");

      const response = await axios.get("http://localhost:8080/user/get-user-like-data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Usuários recebidos:", response.data);
      const userData = response.data;

      const labels = userData.map(item => item.nome);
      const likes = userData.map(item => item.likesOrScore);

      setChartDataUser({
        labels: labels,
        datasets: [
          {
            label: "Usuários com Mais Likes",
            data: likes,
            backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff", "#ff6666"],
            hoverBackgroundColor: ["#ff2e63", "#2382d4", "#ff9c32", "#2fa6b6", "#7759e6", "#ff4747"],
          },
        ],
      });
    } catch (error) {
      console.error("Erro ao buscar dados de usuários:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchArticleData();
    fetchUserData();
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading-message">Carregando dados...</div>;
  }

  return (
    <div className="relatorios-container">
      <h2>Relatórios</h2>

      <div className="chart-container">
        <h3>Artigos com Mais Likes</h3>
        {chartDataArticle ? <Pie data={chartDataArticle} /> : <p>Dados de artigos não carregados.</p>}
      </div>

      <div className="chart-container">
        <h3>Usuários com Mais Likes</h3>
        {chartDataUser ? <Pie data={chartDataUser} /> : <p>Dados de usuários não carregados.</p>}
      </div>
    </div>
  );
};

export default Relatorio;
