import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../assets/styles/components/_perfil.scss';
import axios from "axios";
import AcademicProgressSectionView from "./perfil/AcademicProgressSectionView";
import { GLOBAL } from '../services/apiConfig';
import SubjectGradesSectionView from "./perfil/SubjectGradesSectionView";
import CourseCard from '../components/CourseCard';
import { useUserData } from '../hooks/useUserData';

function UserProfilePage() {
    const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
    const params = useParams();
    const { userData } = useUserData(params.id);
    const [course, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${API_URL}/course/`);
                setCourses(response.data);
            } catch (error) {
                console.error('Error al obtener los datos de los cursos', error);
            }
        };

        fetchCourses();
    }, [API_URL]);

    return (
        <div className="perfil">
            <div className="cabecera-busqueda">
                {userData && (<img className='imagen' src={userData.imagen} alt="Imagen de perfil del usuario" />)}
                <div className="container-datos-user">
                    {userData && (
                        <div>
                            <h1 className="nomP">{userData.nombre}</h1>
                            <h3 className="carP">Ingeniería Informática</h3>
                            <h3 className="corP">{userData.username}</h3>
                        </div>
                    )}

                </div>

            </div>

            <AcademicProgressSectionView />
            <SubjectGradesSectionView />

            <h2 className="cursos-propios">Cursos impartidos: </h2>
            <div className='cards-container'>
                {course.courses && Array.isArray(course.courses) && course.courses
                    .filter(cursos => cursos.id_tutor === params.id) 
                    .map(cursos => (
                        <CourseCard key={cursos._id} titulo={cursos.nombre} tutor={cursos.nombre_tutor} id={cursos._id} f_fin={cursos.fecha_fin} f_inicio={cursos.fecha_inicio} img={cursos.imagen} h_inicio={cursos.horario} h_fin={""} materia={cursos.materia}></CourseCard>
                    ))}

            </div>
        </div>
    );
}

export default UserProfilePage;
