import { useEffect, useState } from 'react';
import CardCorreo from "./components/CardCorreo";
import { useLocation } from 'react-router-dom';
import { GLOBAL } from './assets/js/services';
import '../src/assets/styles/components/_formCurso.scss';

export const Correo = () => {
  const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
  const mail = localStorage.getItem('EMAIL');
  const name = localStorage.getItem('NAME');
  const [cursos, setCursos] = useState([]);
  const [cursosVacios, setCursosVacios] = useState(false); // Estado para manejar cursos vacíos
  const [recipient, setRecipient] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const id_user = localStorage.getItem('ID');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setIsModalError] = useState(false);
  const [isConfirmed, setConfirmed] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModalError = () => {
    setIsModalError(true);
  };

  const closeModalError = () => {
    setIsModalError(false);
  };

  useEffect(() => {
    fetch(`${API_URL}/course/filter/${id_user}`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCursos(data);
          setCursosVacios(data.length === 0);
        } else {
          console.error('La respuesta no es un array:', data);
          setCursosVacios(true);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setCursosVacios(true);
      });
  }, [id_user]);
  

  const handleCourseChange = (courseName) => {
    setSelectedCourseName(courseName);
  };

  const handleRecipientChange = (value) => {
    setRecipient(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!recipient.trim()) {
      setConfirmed(true);
      openModalError();
      //alert("No hay correos seleccionados."); // MOSTRAR EL MODAL ACA
      return;
    }

    try {
      const recipientsArray = recipient.split(',').map(email => email.trim());
      const combinedMessage = selectedCourseName ? `${message} \n\nTutor: ${name}\nCorreo: ${mail}\nCurso: ${selectedCourseName}` : message;

      const body = JSON.stringify({
        recipients: [recipientsArray],
        subject,
        message: combinedMessage
      });

      //console.log(body);

      const response = await fetch(`${API_URL}/email/send-email`, { // Peticion para enviar el correo
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const result = await response.json();
        console.log(result);
        
      } else {
        const text = await response.text();
        console.log('Response not JSON:', text);
      }

      setConfirmed(true);
      openModal();

    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const location = useLocation();
  const { id } = location.state || [];

  return (
    <div className='Correo-main-container'>
      {cursosVacios ? (
        <div><h2 className='NOCURSOS'>No hay cursos disponibles</h2></div>
      ) : (
        <article className="cursos">
          <h1 className="Correo2">Mis cursos</h1>
          <article>
            {cursos.map(curso => (
              <CardCorreo
                key={curso._id}
                id={curso._id}
                titulo={curso.nombre}
                horario={curso.horario}
                onRecipientChange={handleRecipientChange}
                onCourseChange={() => handleCourseChange(curso.nombre)}
              />
            ))}
          </article>
        </article>
      )}
      <article className="mail">
        <h1 className="Correo">Nuevo mensaje</h1>
        <form onSubmit={handleSubmit}>
          <span>
            <label htmlFor="recipient">Para</label>
            <input id="recipient" type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} required autoComplete="off" disabled />
          </span>
          <hr></hr>
          <span>
            <input id="subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Asunto" autoComplete="off" />
          </span>
          <hr></hr>
          <span className="body">
            <textarea id="body" value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="Mensaje" />
          </span>
          <hr></hr>
          <button type="submit">Enviar</button>
        </form>
      </article>
      {modalError && (
          <div className="modal-correo">
            <div className="modal-content-correo">
              <h2>¡Error, no se ha seleccionado destinatario!</h2>
              <button className="boton-confirm" onClick={closeModalError}>Aceptar</button>
            </div>
          </div>
        )}
        {isModalOpen && (
          <div className="modal-correo">
            <div className="modal-content-correo">
              <h2>¡Correo enviado exitosamente!</h2>
              <button className="boton-confirm" onClick={closeModal}>Aceptar</button>
            </div>
          </div>
        )}
    </div>
    
  );
}

export default Correo;