import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import '../src/assets/styles/components/_tableMat.scss';
import { GLOBAL } from './assets/js/services';

const Table_mat_vista = () => {
    const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const params = useParams();

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/profile/${params.id}`);
            if (response.status === 200) {
                setUserData(response.data);
            } else {
                setError(`Error al obtener los datos del usuario. Estado de respuesta: ${response.status}`);
            }
        } catch (error) {
            setError(`Error al obtener los datos del usuario: ${error.message}`);
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

    if (error) {
        return <p>Error: {error}</p>;
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

export default Table_mat_vista;
