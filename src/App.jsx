import '../src/assets/styles/App.scss';
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './Login';
import Home from './Home';
import Header from './Header';
import Navbar from './Navbar';
import Correo from './Correo';
import Metabuscador from './components/Metabuscador';
import Perfil_editar from './Perfil_editar';
import Form_curso from './Form_curso';
import Recursos from './Recursos';
import axios from "axios";
import Perfil_editar_cat from './Perfil_vista';
import Perfil_editar_vist from './Perfil_buscar';
import { GLOBAL } from './assets/js/services';

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
                  {userType === 2 && <Perfil_editar />}
                  {userType === 3 && <Perfil_editar_cat />}
                </>
              }
            />
            <Route path="/search/user/:id" element={<Perfil_editar_vist />} />
            <Route path="/home" element={<Home />} />
            <Route path="/messages" element={<Correo />} />
            <Route path="/search" element={<Metabuscador />} />
            <Route path="/recursos" element={<Recursos />} />
            <Route path="/perfil/agregar-curso" element={<Form_curso />} />
          </Route>
        </Route>
        <Route path="/login" index element={<Login />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>

  )
}

export default App;