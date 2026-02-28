import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Table from "./Table";
import { Modal } from "./Modal";
import { GLOBAL } from './assets/js/services';

function Notas_perfil() {
    const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
    const [modalOpen, setModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [promedio, setPromedio] = useState([]);
    const params = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/profile/${params.id}`);
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
    }, [params.id]); 

    const handleDeleteRow = async (targetIndex) => {
        try {

            const materiaId = rows[targetIndex]._id;

            await axios.delete(`${API_URL}/user/profile/${userId}/${materiaId}`);

            setRows(rows.filter((_, idx) => idx !== targetIndex));
        } catch (error) {
            console.error("Error deleting materia:", error);
        }
    };

    const handleEditRow = (idx) => {
        setRowToEdit(idx);
        setModalOpen(true);
    };

    const handleSubmit = (newRow) => {
        rowToEdit === null
            ? setRows([...rows, newRow])
            : setRows(
                rows.map((currRow, idx) => {
                    if (idx !== rowToEdit) return currRow;
                    return newRow;
                })
            );
    };

    return (
        <div className="App">

            <Table rows={rows} deleteRow={handleDeleteRow} editRow={handleEditRow} />
            <button onClick={() => setModalOpen(true)} className="btn">
                Agregar materia
            </button>
            {modalOpen && (
                <Modal
                    closeModal={() => {
                        setModalOpen(false);
                        setRowToEdit(null);
                    }}
                    onSubmit={handleSubmit}
                    defaultValue={rowToEdit !== null && rows[rowToEdit]}
                />
            )}

        </div>
    );
}

export default Notas_perfil;
