import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import StudiumLogo from './assets/img/StudiumLogo.png';
import salida from './assets/img/salida.png';
import './assets/styles/components/_header.scss';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as GiIcons from "react-icons/gi";
import { SidebarData } from "./NavbarData"

function Header() {
    const [menuOpc, setMenuOpc] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const menuRef = useRef(null);
    const sidebarRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpc(!menuOpc);
    };

    const navigate = useNavigate();
    const redirectLogin = () => {
        localStorage.clear();
        setMenuOpc(!menuOpc);
        navigate('/login');
    };
    const redirectLogo = () => {
        navigate('/home');
    };

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const closeSidebar = () => {
        setSidebarVisible(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                closeSidebar();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='container'>
            < GiIcons.GiHamburgerMenu className="hamburguer" onClick={toggleSidebar} />
            <img className='logo' src={StudiumLogo} alt="Logo de marca Studium" onClick={redirectLogo} />
            <div className='fondo-salida'>
                <img className='salida' src={salida} alt="Botón para cerrar sesión" onClick={toggleMenu} />
                {menuOpc && (
                    <div className='menu-opciones' ref={menuRef}>
                        <button onClick={redirectLogin}>Cerrar sesión</button>
                        <button onClick={toggleMenu}>Cancelar</button>
                    </div>
                )}
            </div>

            {sidebarVisible && (
                <div className='sidebar' ref={sidebarRef}>
                    <div className='navbar'>
                        <Link to="#" className="abrir">
                            <FaIcons.FaBars onClick={toggleSidebar} />
                        </Link>
                    </div>
                    <nav className={sidebarVisible ? "nav-menu active" : "nav-menu"}>
                        <ul className="nav-menu-items" onClick={toggleSidebar}>
                            <li className="navbar-toggle">
                                <Link to="#" className="close">
                                    <AiIcons.AiOutlineClose />
                                </Link>
                            </li>
                            {SidebarData.map((item, index) => (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        <div className="icon">{item.icon}</div>
                                        <span className="opc">{item.title}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
}

export default Header;
