import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/components/_CardPerfil.scss';

const CardPerfil = ({ id, nombre, img, cum, n_materias }) => {
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
CardPerfil.propTypes = {
    n_materias: PropTypes.number,
    id: PropTypes.string,
    cum: PropTypes.string,
    nombre: PropTypes.string,
    img: PropTypes.string
}
CardPerfil.defaultProps = {
    n_materias: 0,
    id: "0",
    cum: "0",
    nombre: "Nombre completo",
    img: "https://lh3.googleusercontent.com/a/ACg8ocIKryODAwt86tgz5wqRX2iiJEn4PVHkVGfEjGXSnwnbIw=s96-c"
}

export default CardPerfil;