import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../assets/styles/components/_tableMat.scss';
import { GLOBAL } from '../services/services';
import { showError } from '../utils/alerts';

const TableMatVista = () => {
    const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const params = useParams();

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/profile/${params.id}`);
            if (response.status === 200) {
                setUserData(response.data);
            } else {
                showError({
                    title: 'No se pudieron obtener los datos',
                    text: `Error al obtener los datos del usuario. Estado: ${response.status}`,
                });
            }
        } catch (error) {
            showError({
                title: 'Error al cargar el perfil',
                text: error.message || 'Ocurrió un error inesperado.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <p>Cargando datos...</p>;
    }

    return (
        <div className="container-notas">
            <div className="notas">
                <div className="cum">
                    <h2>CUM:</h2>
                    <span className="texto">{userData && userData.cum}</span>
                </div>
                <div className="materias">
                    <h2>Materias aprobadas:</h2>
                    <span className="texto">{userData && userData.num_materias}</span>
                </div>
            </div>
        </div>
    );
};

export default TableMatVista;
