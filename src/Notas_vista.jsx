import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Table_mat_vista from "./Table_vista_cat";
import { GLOBAL } from './assets/js/services';

function Notas_perfil() {
    const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
    const [modalOpen, setModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [promedio, setPromedio] = useState([]);

    const params = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/profile/${params.id}`);
                setRows(response.data.materias_interes);
                setPromedio(response.data.promedio);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="App">

            <Table_mat_vista rows={rows} />

        </div>
    );
}

export default Notas_perfil;
