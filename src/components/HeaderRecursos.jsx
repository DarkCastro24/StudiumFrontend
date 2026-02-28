import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as LuIcons from "react-icons/lu";
import { GLOBAL } from '../assets/js/services';
import axios from 'axios';

const HeaderRecursos = ({ id, img, tittle, tutor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setIsModalError] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModalError = () => {
    setIsModalError(true);
  };

  const closeModalError = () => {
    setIsModalError(false);
  };

  // LOCAL STORAGE
  const mail = localStorage.getItem('EMAIL');
  const name = localStorage.getItem('NAME');
  const API_URL = GLOBAL.map((e) => { return e.BASE_URL });

  const handleAddMail = async () => {
    const formData = {
      username: mail,
      nombre: name,
    };
    try {
      const response = await axios.post(`${API_URL}/tutoring/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      openModal();
      // console.log(response.data);
      return response.data;
    } catch (error) {
      openModalError();
      //console.error('Error in the request:', error);
      throw error;
    }
  };

  return (
    <div className="HeaderRecursos" id={id}>
      <img src={img} alt='Curso-img'></img>
      <article>
        <h1>{tittle}</h1>
        <p>{tutor}</p>
        <button onClick={handleAddMail}><LuIcons.LuMail />Unirse</button>
      </article>
      {isModalOpen && (
        <div className="modal-correo">
          <div className="modal-content-correo">
            <h2>¡Ahora eres miembro de este curso!</h2>
            <button className="boton-confirm" onClick={closeModal}>Aceptar</button>
          </div>
        </div>
      )}
      {modalError && (
          <div className="modal-correo">
            <div className="modal-content-correo">
              <h2>¡Usted ya está inscrito a este curso!</h2>
              <button className="boton-confirm" onClick={closeModalError}>Aceptar</button>
            </div>
          </div>
        )}
    </div>
  );
};

HeaderRecursos.propTypes = {
  id: PropTypes.string,
  tittle: PropTypes.string,
  img: PropTypes.string,
  tutor: PropTypes.string,
};

HeaderRecursos.defaultProps = {
  id: "0",
  img: "https://vilmanunez.com/wp-content/uploads/2016/03/herramientas-y-recursos-para-crear-curso-online.png",
  tittle: "Titulo del curso",
  tutor: "Nombre del tutor",
};

export default HeaderRecursos;
