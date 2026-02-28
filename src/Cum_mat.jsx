import { useState, useEffect } from "react";
import axios from "axios";
import Table_mat from "./Table_mat";
import { Modal_mat } from "./Modal_mat";
import { GLOBAL } from './assets/js/services';

function Cum_mat() {
    const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
    const [modalOpen, setModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [promedio, setPromedio] = useState([]);
    const userId = localStorage.getItem("ID");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/profile/${userId}`);
                setRows(response.data.materias_interes);
                setPromedio(response.data.promedio);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleEditRow = (idx) => {
        setRowToEdit(idx);
        setModalOpen(true);
    };

    const handleSubmit = (newRow) => {
        setModalOpen(false);

        if (rowToEdit === null) {
            setRows([...rows, newRow]);
        } else {
            setRows(
                rows.map((currRow, idx) => (idx !== rowToEdit ? currRow : newRow))
            );
            setRowToEdit(null);
        }
    };

    return (
        <div className="App">
            <Table_mat rows={rows} editRow={handleEditRow} />
            <button onClick={() => setModalOpen(true)} className="btn">
                Editar
            </button>
            {modalOpen && (
                <Modal_mat
                    closeModal={() => {
                        setModalOpen(false);
                        setRowToEdit(null);
                    }}
                    onSubmit={handleSubmit}
                    defaultValue={rowToEdit !== null ? rows[rowToEdit] : null}
                />
            )}
        </div>
    );
}

export default Cum_mat;
