import BarCard from './components/BarCard';
import HeaderRecursos from './components/HeaderRecursos';
import ContentRecursos from './components/ContentRecursos';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GLOBAL } from './assets/js/services';
import { Modal_agregar_recurso } from './Modal_agregar_recurso';
import { BsFillTrashFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className='MODALC'>
      <h2>Confirmar Eliminación</h2>
      <p>¿Estás seguro de que deseas eliminar este curso?</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};
ConfirmationModal.propTypes = {
  isOpen: PropTypes.any,
  onClose: PropTypes.any,
  onConfirm: PropTypes.any
};
const Recursos = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalO, setIsModalO] = useState(false);
  //VARIABLES GLOBALES
  const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
  //LOCAL STORAGE
  const id_user = localStorage.getItem('ID');
  //console.log("USER:" + id_user);
  //DATOS DE LA OTRA PAGINA
  const location = useLocation();
  const { id } = location.state || [];
  //console.log("CURSE:" + id);
  //FUNCIONES
  const [course, setCourses] = useState([]);
  //const [resurce, setResurces] = useState([]);
  useEffect(() => {
    // Función para cargar los datos
    const fetchDataCursos = async () => {
      try {
        const response = await axios.get(`${API_URL}/course/${id}`);
        //console.log(response.data);
        setCourses(response.data); // Guardar los datos en el estado
      } catch (error) {
        console.error('Error al obtener los datos', error);
      }
    };
    fetchDataCursos();// Llamada a la función de carga de datos
  }, []);
  const owner = course.id_tutor;
  const id_curso = course._id;
  const navigate = useNavigate();
  const redirectHome = () => {
    navigate('/home');
  };
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API_URL}/course/${id}`);
      console.log('Elemento eliminado:', response.data);
      setIsModalOpen(false);
      redirectHome();
      // Aquí puedes agregar lógica adicional después de la eliminación exitosa.
    } catch (error) {
      console.error('Hubo un error al eliminar:', error);
      // Manejar el error aquí.
    }
  };

  return (
    <div className="bigContainerRecursos">
      <article className="header">
        <HeaderRecursos key={course._id} img={course.imagen} owner={course.id_tutor} id={course._id} tittle={course.nombre} tutor={course.nombre_tutor}></HeaderRecursos>
      </article>
      <div className='containerTwo'>
        <article className="descripcion">
          <ContentRecursos descripcion={course.descripcion} objectives={course.objetivos} id={course._id} key={course._id} materia={course.materia} f_inicio={course.fecha_inicio} f_fin={course.fecha_fin} h_inicio={course.horario} h_fin={""} />
        </article>
        <article className="recursos">
          {
            course.id_tutor === id_user ? (
              <>
                <button onClick={() => setIsModalOpen(true)} className='CreateRecurso'>
                  Crear nuevo recurso
                </button>
                <button onClick={() => setIsModalO(true)} className='CreateRecurso-D'>
                  <BsFillTrashFill />
                </button>
              </>
            ) : null
          }
          <ConfirmationModal
            isOpen={isModalO}
            onClose={() => setIsModalO(false)}
            onConfirm={handleDelete}
          />

          {course.recursos && Array.isArray(course.recursos) && course.recursos.map(r => (
            <BarCard key={r._id} id={r._id} textContent={r.descripcion} titulo={r.titulo} owner={owner.toString()} id_curso={id_curso}></BarCard>
          ))}

          {isModalOpen && (
            <Modal_agregar_recurso
              idCurso={course._id}
              closeModal={() => setIsModalOpen(false)}
              onSubmit={(formData) => {
                console.log('Form submitted with data:', formData);
              }}
            />
          )}
        </article>
      </div>
    </div>
  )
}

export default Recursos;
/*
const fetchDataRecursos = async () => {
      try {
        const response = await axios.get(`${API_URL}/course/resources/${id}`);
        //console.log(response.data);
        setResurces(response.data);// Guardar los datos en el estado
      } catch (error) {
        console.error('Error al obtener los datos', error);
      }
    };
    fetchDataRecursos();// Llamada a la función de carga de datos
*/