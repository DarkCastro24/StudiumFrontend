import './assets/styles/App.scss';
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './views/Login';
import Home from './views/Home';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Correo from './views/Correo';
import Metabuscador from './views/Metabuscador';
import PerfilEditar from './views/PerfilEditar';
import FormCurso from './views/FormCurso';
import Recursos from './views/Recursos';
import axios from "axios";
import PerfilVista from './views/PerfilVista';
import PerfilBuscar from './views/PerfilBuscar';
import { GLOBAL } from './services/services';

const AppLayout = () => (
  <>
    <Header />
    <Navbar />
    <Outlet />
  </>
);

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const id = localStorage.getItem('ID');
  useEffect(() => {
    if (!id) {
      navigate('/login');
    }
  }, [id, navigate]);

  return children ? children : <Outlet />;
};

function App() {
  const id = localStorage.getItem('ID');
  const [userType, setUserType] = useState('');
  const API_URL = GLOBAL.map((e) => { return e.BASE_URL });

  useEffect(() => {
    if (!id) return; // No hacer petición si no hay usuario logueado
    const fetchUserType = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/profile/${id}`);
        setUserType(response.data.tipo);
      } catch (error) {
        console.error('Error al obtener el tipo de usuario', error);
      }
    };
    fetchUserType();
  }, [id]);

  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/perfil"
              element={
                <>
                  {userType === 2 && <PerfilEditar />}
                  {userType === 3 && <PerfilVista />}
                </>
              }
            />
            <Route path="/search/user/:id" element={<PerfilBuscar />} />
            <Route path="/home" element={<Home />} />
            <Route path="/messages" element={<Correo />} />
            <Route path="/search" element={<Metabuscador />} />
            <Route path="/recursos" element={<Recursos />} />
            <Route path="/perfil/agregar-curso" element={<FormCurso />} />
          </Route>
        </Route>
        <Route path="/login" index element={<Login />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>

  )
}

export default App;