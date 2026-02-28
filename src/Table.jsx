import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import '../src/assets/styles/components/_table.scss'
import { GLOBAL } from './assets/js/services';

const Table = ({ rows, deleteRow }) => {
    const API_URL = GLOBAL.map((e) => e.BASE_URL);
    const userId = localStorage.getItem("ID");

    const deleteOneMateria = async (_id, rowIndex) => {
        try {
            if (!_id) {
                throw new Error("materiaId is required!");
            }

            const response = await axios.delete(
                `${API_URL}/user/profile/${userId}/${_id}`
            );

            if (response.status === 200) {
                deleteRow(rowIndex);
                console.log("Materia eliminada exitosamente");
            } else {
                console.log("La eliminación falló");
            }
        } catch (error) {
            console.error("Error al eliminar la materia:", error.message);
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
Table.propTypes = {
    rows: PropTypes.arrayOf(
        PropTypes.shape({
            materia: PropTypes.string.isRequired,
            promedio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired,
    deleteRow: PropTypes.func.isRequired,
    editRow: PropTypes.func.isRequired,
};

export default Table;
