import "./App.css";
import Login from "./components/Login/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Recuperacao from "./components/Recuperação/Recupercao";
import Cadastro from "./components/Cadastro/Cadastro";
import Editperfil from "./components/EdiçãoPerfil/Edit";
import Conteudo from "./components/Conteudo/Conteudo";
import CriacaoArtigo from "./components/CriaçãoArtigo/CriacaoArtigo";
import VisualizarArtigo from "./components/VisualizarArtigos/VisualizarArtigo";
import Inscricao from "./components/Inscrição/Inscrição";
import Consultoria from "./components/Consultoria/Consultoria";
import Servicos from "./components/Serviços/Servicos";
import CadastroProduto from "./components/Admin/CadastroProduto/CadastroProduto";
import Produtos from "./components/Produtos/Produtos";
import Historico from "./components/Historico/Historico";
import VisualizarProduto from "./components/VisualizarProduto/VisualizarProduto";
import Administrador from "./components/Admin/Admin";
import AdminForms from "./components/Admin/AdminForms/AdminForms";
import AdminUsuario from "./components/Admin/AdminUsuario/AdminUsuario";
import ProtectedRoute from "./ProtectedRoute";
import Relatorio from "./components/Admin/Relatorios/Relatorios";
import Relatorios from "./components/Admin/Relatorios/Relatorios";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Conteudo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recuperacao" element={<Recuperacao />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/editperfil" element={<Editperfil />} />
            <Route path="/criacaoartigo" element={<CriacaoArtigo />} />
            <Route path="/visualizar-artigo/:artigoId" element={<VisualizarArtigo />} />
            <Route path="/servicos/inscricao" element={<Inscricao />} />
            <Route path="/servicos/consultoria" element={<Consultoria />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produto/:productId" element={<VisualizarProduto />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/admin/*" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Routes>
                    <Route path="/" element={<Administrador />} />
                    <Route path="cadastro-produto" element={<CadastroProduto />} />
                    <Route path="adminForms" element={<AdminForms />} />
                    <Route path="adminUsuario" element={<AdminUsuario />} />
                    <Route path="relatorio" element={<Relatorios />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
