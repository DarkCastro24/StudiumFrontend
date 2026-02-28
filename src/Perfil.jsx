import React from "react";
import { Link } from "react-router-dom";
import './assets/styles/components/_perfil.scss'

function Perfil() {
    return (
        <div className="perfil">
            <div className="cabecera">
                <img className='imagen' src='https://cdn.gogeticon.net/files/1925428/fa0cbc2764f70113bf2fad3905933545.png' alt="Imagen de perfil" />
                <div className="container-datos">
                    <h1>Alan Brito</h1>
                    <h3>Ingenieria info</h3>
                    <h3>00012345</h3>
                </div>
                <div className="container-botones">
                    <Link to='/perfil/editar'>
                        <button className="boton1">Editar perfil</button>
                    </Link>
                    <Link to='/perfil/agregar-curso'>
                        <button className="boton">Agregar curso</button>
                    </Link>
                </div>
            </div>
            <div className="container-notas">
                <div className="notas">
                    <div className="cum">
                        <h2>CUM:</h2>
                        <span className="texto"> 7.2 </span>
                    </div>
                    <div className="materias">
                        <h2>Materias aprobadas:</h2>
                        <span className="texto"> 22 </span>

                    </div>
                </div>
            </div>
            <div className="container-materia">
                <div className="materia-group">
                    <span className="lista-materias">Materia 1</span>
                    <span className="nota-materia">8.1</span>
                </div>
                <div className="materia-group">
                    <span className="lista-materias">Materia 2</span>
                    <span className="nota-materia">7.5</span>
                </div>
                <div className="materia-group">
                    <span className="lista-materias">Materia 3</span>
                    <span className="nota-materia">.5</span>
                </div>
            </div>

            <h2>Cursos impartidos: </h2>
            <h3>Cards xd</h3>
        </div>
    );
}

export default Perfil;