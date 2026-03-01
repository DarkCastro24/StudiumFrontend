import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './assets/styles/components/_perfil.scss';
import Notas_perfil from './Notas_perfil';
import Cum_mat from "./Cum_mat";
import axios from "axios";
import { GLOBAL } from './assets/js/services';
import Cards from './components/Cards';

function Perfil_editar() {
    const API_URL = GLOBAL[0].BASE_URL;
    const userId = localStorage.getItem("ID");
    const [userData, setUserData] = useState(null);
    const [course, setCourses] = useState([]);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const postUsernameLogin = async (credentials) => {
        const normalizedBaseUrl = API_URL.replace(/\/+$/, '');
        const baseUrlWithoutApi = normalizedBaseUrl.replace(/\/api$/, '');
        const endpoints = [
            `${normalizedBaseUrl}/api/auth/login/username`,
            `${normalizedBaseUrl}/auth/login/username`,
            `${normalizedBaseUrl}/api/auth/login`,
            `${normalizedBaseUrl}/auth/login`,
            `${baseUrlWithoutApi}/api/auth/login/username`,
            `${baseUrlWithoutApi}/auth/login/username`,
            `${baseUrlWithoutApi}/api/auth/login`,
            `${baseUrlWithoutApi}/auth/login`,
        ];

        let lastError;
        for (const endpoint of [...new Set(endpoints)]) {
            try {
                console.log('Ruta de verificación de contraseña enviada:', endpoint);
                console.log('Body de verificación enviado:', credentials);
                return await axios.post(endpoint, credentials);
            } catch (error) {
                const status = error?.response?.status;
                if (status !== 404 && status !== 401) {
                    throw error;
                }
                lastError = error;
            }
        }

        throw lastError;
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${API_URL}/course/`);
                setCourses(response.data);
            } catch (error) {
                console.error('Error al obtener los datos de los cursos', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/profile/${userId}`);
                if (response.status === 200) {
                    setUserData(response.data);
                } else {
                    console.error("Error al obtener los datos del usuario. Estado de respuesta:", response.status);
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error.message);
            }
        };

        fetchCourses();
        fetchUserData();
    }, [userId]);

    const handleUpdatePassword = async (event) => {
        event.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError(true);
            setPasswordMessage('Completa todos los campos de contraseña');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError(true);
            setPasswordMessage('La nueva contraseña y su confirmación no coinciden');
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError(true);
            setPasswordMessage('La nueva contraseña debe tener al menos 8 caracteres');
            return;
        }

        try {
            setIsUpdatingPassword(true);
            setPasswordError(false);
            setPasswordMessage('');

            const updateRoute = `${API_URL}/user/profile/${userId}`;
            const updateBody = {
                password: newPassword,
            };

            await postUsernameLogin({
                username: userData.username,
                email: userData.username,
                password: currentPassword,
            });

            console.log('Ruta de actualización de contraseña enviada:', updateRoute);
            console.log('Body de actualización enviado:', updateBody);

            await axios.patch(updateRoute, updateBody);

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordError(false);
            setPasswordMessage('Contraseña actualizada correctamente');
        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            const mensajeError = error?.response?.data?.message || 'No se pudo actualizar la contraseña';
            setPasswordError(true);
            setPasswordMessage(mensajeError);
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <div className="perfil">
            <div className="cabecera">
                {userData && (<img className='imagen' src={userData.imagen} alt="Imagen de perfil de Google" />)}
                <div className="container-datos">
                    {userData && (
                        <div>
                            <h1 className="nomP">{userData.nombre}</h1>
                            <h3 className="carP">Ingeniería Informática</h3>
                            <h3 className="corP">{userData.username}</h3>
                            <Link to='/perfil/agregar-curso'>
                                <button className="boton-peque">Agregar curso</button>
                            </Link>
                        </div>
                    )}
                </div>
                <div className="container-botones">
                    <Link to='/perfil/agregar-curso'>
                        <button className="boton">Agregar curso</button>
                    </Link>
                </div>
            </div>

            <div className="password-card">
                <h2>Actualizar contraseña</h2>
                <form className="password-form" onSubmit={handleUpdatePassword}>
                    <div className="password-input-wrapper">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Clave actual"
                            value={currentPassword}
                            onChange={(event) => setCurrentPassword(event.target.value)}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowCurrentPassword((prev) => !prev)}
                            aria-label={showCurrentPassword ? 'Ocultar clave actual' : 'Mostrar clave actual'}
                        >
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className="password-input-wrapper">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Nueva clave"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            aria-label={showNewPassword ? 'Ocultar nueva clave' : 'Mostrar nueva clave'}
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className="password-input-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmar nueva clave"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            aria-label={showConfirmPassword ? 'Ocultar confirmación de clave' : 'Mostrar confirmación de clave'}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <button type="submit" className="boton-password" disabled={isUpdatingPassword || !userData}>
                        {isUpdatingPassword ? 'Actualizando...' : 'Actualizar clave'}
                    </button>
                </form>
                {passwordMessage && (
                    <div className={passwordError ? 'password-message error' : 'password-message success'}>
                        {passwordMessage}
                    </div>
                )}
            </div>

            <Cum_mat />
            <Notas_perfil />

            <h2 className="cursos-propios">Cursos impartidos: </h2>
            <div className='cards-container'>
                {course.courses && Array.isArray(course.courses) && course.courses
                    .filter(cursos => cursos.id_tutor === userId)
                    .map(cursos => (
                        <Cards key={cursos._id} titulo={cursos.nombre} 
                        tutor={cursos.nombre_tutor} id={cursos._id} 
                        f_fin={cursos.fecha_fin} 
                        f_inicio={cursos.fecha_inicio} img={cursos.imagen} 
                        h_inicio={cursos.horario} h_fin={""}
                        materia={cursos.materia}></Cards>
                    ))}
            </div>
        </div>
    );
}

export default Perfil_editar;
