import React, { useState } from "react";
import '../assets/styles/components/_modal.scss';
import axios from "axios";
import { GLOBAL } from '../services/apiConfig';
import { showSuccess, showError, showWarning } from '../utils/alerts';

export const AddSubjectGradeModal = ({ closeModal, onSubmit, defaultValue }) => {
  const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
  const [formState, setFormState] = useState(
    defaultValue || {
      materia: "",
      promedio: "",
    }
  );
  const userId = localStorage.getItem("ID");

  const validateForm = () => {
    const isValidMateria = formState.materia !== "";

    const isValidNota =
      /^\d+(\.\d{1,2})?$/.test(formState.promedio) &&
      parseFloat(formState.promedio) >= 7 &&
      parseFloat(formState.promedio) <= 10;

    if (isValidMateria && isValidNota) {
      return true;
    }

    const errorFields = [];
    if (!isValidMateria) {
      errorFields.push("Seleccionar una materia válida");
    }
    if (!isValidNota) {
      errorFields.push("La nota ingresada debe estar entre 7 y 10");
    }
    showWarning({
      title: 'Datos inválidos',
      text: errorFields.join(", "),
    });
    return false;
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!validateForm()) return;

    try {
      const response = await axios.post(`${API_URL}/user/profile/${userId}`, formState);
      console.log("Response from server:", response);


      if (response.status === 201) {
        console.log("Información enviada correctamente:", response.data);
        onSubmit(formState);
        await showSuccess({
          title: 'Materia agregada',
          text: 'La nota se registró correctamente.',
        });
        closeModal();
        window.location.reload();
      } else {
        console.error("Error al enviar la información. Estado de respuesta:", response.status);
        console.error("Respuesta del servidor:", response.data);
        showError({
          title: 'No se pudo guardar la información',
          text: 'El servidor devolvió un estado inesperado. Intenta nuevamente.',
        });
      }
    } catch (error) {
      console.error("Error al enviar la información:", error);
      showError({
        title: 'Error al guardar la información',
        text: 'No se pudo conectar con el servidor. Inténtalo más tarde.',
      });
    }
  };

  const materiaOpc = [
    "Precálculo",
    "Elementos para el estudio de la ciencia y la tecnología",
    "Matemática discreta I",
    "Fundamentos de programación",
    "Álgebra vectorial y matrices",
    "Cálculo I",
    "Programación de estructuras dinámicas",
    "Matemática discreta II",
    "Física I",
    "Cálculo II",
    "Programación orientada a objetos",
    "Bases de datos",
    "Electricidad y magnetismo",
    "Cálculo III",
    "Programación web",
    "Administración de bases de datos",
    "Optativa humanístico-social I",
    "Análisis numérico",
    "Redes de computadoras",
    "Programación de dispositivos móviles",
    "Análisis de sistemas",
    "Física II",
    "Optativa humanístico-social II",
    "Análisis de algoritmos",
    "Programación de artefactos",
    "Probabilidad y estadística",
    "Seguridad en entornos de desarrollo",
    "Arquitectura de computadoras",
    "Técnicas de simulación de computadoras",
    "Programación N-capas",
    "Fundamentos de inteligencia de negocios",
    "Optativa humanístico-social III",
    "Sistemas operativos",
    "Programación declarativa",
    "Ingeniería de software",
    "Formulación y evaluación de proyectos",
    "Optativa humanístico-social IV",
    "Optativa técnica I",
    "Aplicaciones código abierto",
    "Práctica profesional I",
    "Optativa técnica II",
    "Teoría de lenguaje de programación",
    "Optativa humanístico-social V",
    "Práctica profesional II",
  ];

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") closeModal();
      }}
    >
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="materia">Materia</label>
            <select
              name="materia"
              onChange={handleChange}
              value={formState.materia}
            >
              <option value="" disabled>
                Materia
              </option>
              {materiaOpc.map((option) => (
                <option
                  key={option}
                  value={option}
                  disabled={option === ""}
                >
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="promedio">Nota</label>
            <input
              type="text"
              name="promedio"
              onChange={handleChange}
              value={formState.promedio}
            />
          </div>
          <button type="submit" className="btn">
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
};
