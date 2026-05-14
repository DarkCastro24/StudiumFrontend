import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/components/_CardPerfil.scss';

const UserProfileCard = ({ id, nombre, img, cum, n_materias }) => {
    const navigate = useNavigate();
    const redirectPerfil = () => {
        navigate(`/search/user/${id}`); 
    };
    return (
        <div className="CardPerfil" id={id} onClick={redirectPerfil}>
            <img src={img}></img>
            <div>
            <p>{nombre}</p>
            <p className='flex'>CUM: {cum} / #Materias: {n_materias}</p>
            </div>
        </div>
    )
}
UserProfileCard.propTypes = {
    n_materias: PropTypes.number,
    id: PropTypes.string,
    cum: PropTypes.string,
    nombre: PropTypes.string,
    img: PropTypes.string
}
UserProfileCard.defaultProps = {
    n_materias: 0,
    id: "0",
    cum: "0",
    nombre: "Nombre completo",
    // Imagen genérica de respaldo cuando Keycloak no expone una foto de perfil.
    img: "https://www.gravatar.com/avatar/?d=mp&s=200"
}

export default UserProfileCard;