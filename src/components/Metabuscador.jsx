import { useState } from 'react';
import axios from 'axios';
import { GLOBAL } from '../assets/js/services';
import Cards from './Cards';
import CardPerfil from './CardPerfil';

export const Metabuscador = () => {
  const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
  const [seleccion, setSeleccion] = useState("curso");
  const [placeH, setplaceH] = useState("Nombre del curso");
  const [inputValue, setInputValue] = useState("");
  const [dataCursos, setDataCursos] = useState([]);
  const [dataRecursos, setDataRecursos] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSeleccion(selectedValue);
    setInputValue("");
    setDataRecursos([]);
    setDataCursos([]);
    switch (selectedValue) {
      case "perfil":
        setplaceH("Nombre del estudiante");
        break;
      case "materia":
        setplaceH("Nombre de la materia");
        break;
      case "curso":
      default:
        setplaceH("Nombre del curso");
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario
    try {
      let response;
      if (seleccion === "materia") {
        // Realizar una solicitud para "materia"
        response = await axios.post(`${API_URL}/course/filter/subject/`, { materia: inputValue });
        setDataCursos(response.data);
      } else if (seleccion === "perfil") {
        // Realizar una solicitud para "perfil"
        response = await axios.post(`${API_URL}/user/filter/`, { nombre: inputValue });
        setDataRecursos(response.data);
      } else {
        // Realizar una solicitud para "cursos"
        response = await axios.post(`${API_URL}/course/filter/name/`, { materia: inputValue });
        setDataCursos(response.data);
      }
      //console.log(response.data);
    } catch (error) {
      console.error("Hubo un error en la solicitud", error);
    }
  };

  return (
    <div className='meta-buscador-container'>
      <h1>Busqueda</h1>
      <article className="buscador">
        <form onSubmit={handleSubmit}>
          <select onChange={handleChange}>
            <option value="curso">Cursos</option>
            <option value="materia">Cursos por materia</option>
            <option value="perfil">Perfiles</option>
          </select>
          <input type='text' value={inputValue} onChange={handleInputChange} placeholder={placeH} required></input>
          <button type="submit">Buscar</button>
        </form>
      </article>
      {seleccion === "materia" || seleccion === "curso" ?
        <div className='cards-container'>
          {dataCursos && Array.isArray(dataCursos) && dataCursos.length > 0 ? dataCursos.map(curso => { return <Cards key={curso._id} id={curso._id} tutor={curso.nombre_tutor} img={curso.imagen} h_fin={""} h_inicio={curso.horario} titulo={curso.nombre} f_inicio={curso.fecha_inicio} f_fin={curso.fecha_fin} materia={curso.materia}></Cards> }) : <p>No se encontraron coincidencias</p>}
        </div> :
        <div className='personaContainer'>
          {dataRecursos && Array.isArray(dataRecursos) && dataRecursos.length > 0 ? dataRecursos.map(r => { return <CardPerfil key={r._id} nombre={r.nombre} id={r._id} img={r.imagen} n_materias={r.num_materias} cum={r.cum}></CardPerfil> }) : <p>No se encontraron coincidencias</p>}
        </div>
      }
    </div>
  )
}

export default Metabuscador;
