import React, { useState, useEffect } from "react";
import './assets/styles/components/_perfil.scss';
import axios from "axios";
import { GLOBAL } from './assets/js/services';

function Perfil_editar_vist() {
    const API_URL = GLOBAL[0].BASE_URL;
    const [userData, setUserData] = useState(null);
    const userId = localStorage.getItem("ID");
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);

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

            await postUsernameLogin({
                username: userData.username,
                email: userData.username,
                password: currentPassword,
            });

            await axios.patch(`${API_URL}/user/profile/${userId}`, {
                password: newPassword,
            });

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
        <div className="perfil-vista">
            <div className="cabecera-vista">
                {userData && (<img className='imagen' src={userData.imagen} alt="Imagen de perfil de Google" />)}
                <div className="container-datos">
                    {userData && (
                        <div>
                            <h1 className="nomP">{userData.nombre}</h1>
                            <h3 className="corP">{userData.username}</h3>
                        </div>
                    )}
                </div>
            </div>

            <div className="password-card">
                <h2>Actualizar contraseña</h2>
                <form className="password-form" onSubmit={handleUpdatePassword}>
                    <input
                        type="password"
                        placeholder="Clave actual"
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        autoComplete="current-password"
                    />
                    <input
                        type="password"
                        placeholder="Nueva clave"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        autoComplete="new-password"
                    />
                    <input
                        type="password"
                        placeholder="Confirmar nueva clave"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        autoComplete="new-password"
                    />
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
        </div>
    );
}

export default Perfil_editar_vist;