import React from "react";
import PropTypes from "prop-types";
import '../src/assets/styles/components/_table.scss'

const Table_vista = ({ rows }) => {

    return (
        <div className="table-wrapper">
            <table className="table">
                <thead>
                    <tr>
                        <th className="expand">Materia</th>
                        <th>Nota</th>

                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx}>
                            <td className="fila">{row.materia}</td>
                            <td className="expand">{row.promedio}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default Table_vista;
