import React, { useState } from 'react';
import PropTypes from 'prop-types';
import icon from './../assets/img/copy-icon.png';
import { useNavigate } from 'react-router-dom';
import { GLOBAL } from '../assets/js/services';

const CardCorreo = ({ titulo, horario, id, onRecipientChange, onCourseChange }) => {
    const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            //console.log(id);
            const response = await fetch(`${API_URL}/tutoring/email/${id}`);
            const jsonData = await response.json();
            //console.log(jsonData);
            onRecipientChange(jsonData.usernames); 
        } catch (error) {
            console.error('Error al realizar fetch:', error);
        }
    };

    const redirectCorreo = () => {
        navigate('/messages', { state: { id } });
        fetchData(); 
    };

    return (
        <div onClick={onCourseChange} className="main-card-correo-container" id={id}>
            <p>{titulo}</p>
            <p>{horario}</p>
            <button onClick={redirectCorreo}>
                <img src={icon} alt='copy-icon'></img>
            </button>
        </div>
    )
}

CardCorreo.propTypes = {
    titulo: PropTypes.string,
    horario: PropTypes.string,
    id: PropTypes.string
}

CardCorreo.defaultProps = {
    id: "0",
    titulo: "Titulo del curso",
    h_inicio: "9:00 AM - 10:00 AM",
}

export default CardCorreo;