import './assets/styles/App.scss';
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './views/LoginPage';
import HomePage from './views/HomePage';
import AppHeader from './components/AppHeader';
import SidebarMenu from './components/SidebarMenu';
import MessagesPage from './views/MessagesPage';
import SearchPage from './views/SearchPage';
import StudentProfilePage from './views/StudentProfilePage';
import CreateCoursePage from './views/CreateCoursePage';
import CourseResourcesPage from './views/CourseResourcesPage';
import axios from "axios";
import TeacherProfilePage from './views/TeacherProfilePage';
import UserProfilePage from './views/UserProfilePage';
import { GLOBAL } from './services/apiConfig';

const AppLayout = () => (
  <>
    <AppHeader />
    <SidebarMenu />
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
                  {userType === 2 && <StudentProfilePage />}
                  {userType === 3 && <TeacherProfilePage />}
                </>
              }
            />
            <Route path="/search/user/:id" element={<UserProfilePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/recursos" element={<CourseResourcesPage />} />
            <Route path="/perfil/agregar-curso" element={<CreateCoursePage />} />
          </Route>
        </Route>
        <Route path="/login" index element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>

  )
}

export default App;