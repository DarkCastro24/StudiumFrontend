import React, { useState } from "react";
import '../assets/styles/components/_modal.scss';
import axios from "axios";
import { GLOBAL } from '../services/apiConfig';
import { showSuccess, showError, showWarning } from '../utils/alerts';

export const EditAcademicProgressModal = ({ closeModal, onSubmit, defaultValue }) => {
    const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
    const [formState, setFormState] = useState(
        defaultValue || {
            cum: "",
            num_materias: "",
        }
    );
    const userId = localStorage.getItem("ID");

    const validateForm = () => {
        const isValidNumMaterias =
            /^\d+$/.test(formState.num_materias) &&
            parseInt(formState.num_materias) >= 0 &&
            parseInt(formState.num_materias) <= 44;

        const isValidCum =
            /^\d+(\.\d{1,2})?$/.test(formState.cum) &&
            parseFloat(formState.cum) >= 6 &&
            parseFloat(formState.cum) <= 10;

        if (isValidNumMaterias && isValidCum) {
            return true;
        }

        const errorFields = [];
        if (!isValidNumMaterias) {
            errorFields.push("El número de materias debe ser un valor entre 0 y 44");
        }
        if (!isValidCum) {
            errorFields.push("El CUM ingresado debe estar entre 6 y 10");
        }
        showWarning({
            title: 'Datos inválidos',
            text: errorFields.join(", "),
        });
        return false;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.patch(`${API_URL}/user/profile/${userId}`, formState);

            console.log("Response from server:", response);

            if (response.status === 200 || response.status === 201) {
                console.log("Información enviada correctamente:", response.data);
                onSubmit(formState);
                await showSuccess({
                    title: 'Información actualizada',
                    text: 'Tus datos académicos se guardaron correctamente.',
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

    return (
        <div
            className="modal-container"
            onClick={(e) => {
                if (e.target.className === "modal") closeModal();
            }}
        >
            <div className="modal">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="cum">CUM:</label>
                        <input
                            type="text"
                            name="cum"
                            onChange={handleChange}
                            value={formState.cum}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="num_materias">Materias aprobadas:</label>
                        <input
                            type="text"
                            name="num_materias"
                            onChange={handleChange}
                            value={formState.num_materias}
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
