import { useState, useEffect } from "react";
import axios from "axios";
import { GLOBAL } from '../../services/apiConfig';
import AcademicProgressCardView from "../../components/AcademicProgressCardView";

function AcademicProgressSectionView() {
    const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
    const [rows, setRows] = useState([]);
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
    }, [API_URL, userId]);

    return (
        <div className="App">
            <AcademicProgressCardView rows={rows} />
        </div>
    );
}

export default AcademicProgressSectionView;
