import Swal from 'sweetalert2';

const baseTheme = {
    background: '#ffffff',
    color: '#1f2937',
    confirmButtonColor: '#1d4ed8',
    cancelButtonColor: '#6b7280',
    showClass: {
        popup: 'swal2-show',
    },
    hideClass: {
        popup: 'swal2-hide',
    },
};

export const showSuccess = ({
    title = '¡Operación exitosa!',
    text = 'La acción se realizó correctamente.',
    confirmButtonText = 'Aceptar',
} = {}) =>
    Swal.fire({
        ...baseTheme,
        icon: 'success',
        title,
        text,
        confirmButtonText,
    });

export const showError = ({
    title = 'Ocurrió un error',
    text = 'No se pudo completar la acción. Intenta nuevamente.',
    confirmButtonText = 'Aceptar',
} = {}) =>
    Swal.fire({
        ...baseTheme,
        icon: 'error',
        title,
        text,
        confirmButtonText,
    });

export const showWarning = ({
    title = 'Advertencia',
    text = 'Revisa la información antes de continuar.',
    confirmButtonText = 'Aceptar',
} = {}) =>
    Swal.fire({
        ...baseTheme,
        icon: 'warning',
        title,
        text,
        confirmButtonText,
    });

export const showInfo = ({
    title = 'Información',
    text = '',
    confirmButtonText = 'Aceptar',
} = {}) =>
    Swal.fire({
        ...baseTheme,
        icon: 'info',
        title,
        text,
        confirmButtonText,
    });

export const showQuestion = ({
    title = '¿Deseas continuar?',
    text = '',
    confirmButtonText = 'Aceptar',
} = {}) =>
    Swal.fire({
        ...baseTheme,
        icon: 'question',
        title,
        text,
        confirmButtonText,
    });

export const showConfirm = async ({
    title = '¿Estás seguro?',
    text = 'Esta acción no se puede deshacer.',
    icon = 'warning',
    confirmButtonText = 'Confirmar',
    cancelButtonText = 'Cancelar',
} = {}) => {
    const result = await Swal.fire({
        ...baseTheme,
        icon,
        title,
        text,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true,
        focusCancel: true,
    });
    return result.isConfirmed;
};

export default {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showQuestion,
    showConfirm,
};
