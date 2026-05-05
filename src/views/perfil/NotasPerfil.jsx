import { useState, useEffect } from "react";
import axios from "axios";
import Table from "../../components/Table";
import { Modal } from "../../components/Modal";
import { GLOBAL } from '../../services/services';

function NotasPerfil() {
    const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
    const [modalOpen, setModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowToEdit, setRowToEdit] = useState(null);
    const userId = localStorage.getItem("ID");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/profile/${userId}`);
                setRows(response.data.materias_interes);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

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

export default NotasPerfil;
