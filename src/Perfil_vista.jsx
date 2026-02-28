import React, { useState, useEffect } from "react";
import './assets/styles/components/_perfil.scss';
import axios from "axios";
import { GLOBAL } from './assets/js/services';

function Perfil_editar_vist() {
    const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
    const [userData, setUserData] = useState(null);
    const userId = localStorage.getItem("ID");

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
        </div>
    );
}

export default Perfil_editar_vist;