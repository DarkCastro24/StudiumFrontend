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
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default ConfirmationModal;
