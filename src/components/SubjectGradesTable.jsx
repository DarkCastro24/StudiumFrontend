import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { BsFillTrashFill } from "react-icons/bs";
import '../assets/styles/components/_table.scss'
import { GLOBAL } from '../services/apiConfig';
import { showConfirm, showSuccess, showError } from '../utils/alerts';

const SubjectGradesTable = ({ rows, deleteRow }) => {
    const API_URL = GLOBAL.map((e) => e.BASE_URL);
    const userId = localStorage.getItem("ID");

    const deleteOneMateria = async (_id, rowIndex) => {
        if (!_id) {
            showError({
                title: 'Error',
                text: 'No se pudo identificar la materia a eliminar.',
            });
            return;
        }

        const confirmed = await showConfirm({
            title: '¿Eliminar materia?',
            text: 'Esta acción eliminará la materia de tu perfil de forma permanente.',
            icon: 'warning',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
        });

        if (!confirmed) return;

        try {
            const response = await axios.delete(
                `${API_URL}/user/profile/${userId}/${_id}`
            );

            if (response.status === 200) {
                deleteRow(rowIndex);
                showSuccess({
                    title: 'Materia eliminada',
                    text: 'La materia se eliminó correctamente.',
                });
            } else {
                showError({
                    title: 'No se pudo eliminar la materia',
                    text: 'La operación no se completó. Intenta nuevamente.',
                });
            }
        } catch (error) {
            console.error("Error al eliminar la materia:", error.message);
            showError({
                title: 'Error al eliminar la materia',
                text: error.message || 'Ocurrió un error inesperado.',
            });
        }
    };


    return (
        <div className="table-wrapper">
            <table className="table">
                <thead>
                    <tr>
                        <th className="expand">Materia</th>
                        <th>Nota</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx}>
                            <td className="fila">{row.materia}</td>
                            <td className="expand">{row.promedio}</td>
                            <td className="fit">
                                <span className="actions">
                                    <BsFillTrashFill
                                        className="delete-btn"
                                        onClick={() => deleteOneMateria(row._id, idx)}
                                    />
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Validacion de props
SubjectGradesTable.propTypes = {
    rows: PropTypes.arrayOf(
        PropTypes.shape({
            materia: PropTypes.string.isRequired,
            promedio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired,
    deleteRow: PropTypes.func.isRequired,
    editRow: PropTypes.func.isRequired,
};

export default SubjectGradesTable;
