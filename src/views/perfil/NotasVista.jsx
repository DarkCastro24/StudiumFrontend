import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TableVistaCat from "../../components/TableVistaCat";
import { GLOBAL } from '../../services/services';

function NotasVista() {
    const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
    const [rows, setRows] = useState([]);

    const params = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/profile/${params.id}`);
                setRows(response.data.materias_interes);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="App">

            <TableVistaCat rows={rows} />

        </div>
    );
}

export default NotasVista;
