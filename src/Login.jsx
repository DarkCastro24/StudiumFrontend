import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import LogoUCA from './assets/img/LogoUCA-blanco.png';
import { useNavigate } from 'react-router-dom';
import { GLOBAL } from './assets/js/services'

export const Login = () => {
    //CREDENCIALES
    const API_URL = GLOBAL[0].BASE_URL;
    const DEFAULT_PASSWORD = import.meta.env.VITE_DEFAULT_PASSWORD || 'StudiumPassword';
    //PARA NAVEGAR AL HOME
    const navigate = useNavigate();
    const redirectHome = () => {
        navigate('/home');
    };
    //DOMINIOS VALIDOS
    const dominiosValidos = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'live.com', 'uca.edu.sv'];

    const validarDominioCorreo = (email) => {
        const dominio = email.split('@')[1]?.toLowerCase();
        return dominio && dominiosValidos.includes(dominio);
    };

    //EXPRESIONES REGULARES
    const validarEstudiante = (email) => {
        const regex = /^[0-9]{8}/;
        return regex.test(email);
    }

    const realizarPeticionPost = async (data) => {
        try {
            const payload = {
                password: DEFAULT_PASSWORD,
                ...data,
            };

            const response = await axios.post(`${API_URL}/auth/register`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            //console.log("ID MONGO USER:", response.data); //ID DE MONGO
            localStorage.setItem("ID", response.data); //GUARDA EN Local Storage EL ID
            return response.data;
        } catch (error) {
            console.error('Error en la petición:', error);
            throw error;
        }
    }

    const postUsernameLogin = async (credentials) => {
        const normalizedBaseUrl = API_URL.replace(/\/+$/, '');
        const apiRootUrl = normalizedBaseUrl.endsWith('/api')
            ? normalizedBaseUrl.slice(0, -4)
            : normalizedBaseUrl;

        const endpoints = [
            `${apiRootUrl}/api/auth/login`,
            `${apiRootUrl}/api/auth/login/username`,
            `${normalizedBaseUrl}/auth/login`,
            `${normalizedBaseUrl}/auth/login/username`,
        ];

        let lastError;
        for (const endpoint of [...new Set(endpoints)]) {
            try {
                console.log('Ruta de login enviada:', endpoint);
                console.log('Credenciales enviadas:', credentials);
                return await axios.post(endpoint, credentials, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                const status = error?.response?.status;
                if (status !== 404 && status !== 401) {
                    throw error;
                }
                lastError = error;
            }
        }

        throw lastError;
    };

    const persistSessionFromToken = async (token, fallbackData = {}) => {
        let decodedToken = {};

        try {
            decodedToken = jwtDecode(token);
        } catch (error) {
            decodedToken = {};
        }

        const email = String(
            decodedToken.email ||
            decodedToken.username ||
            fallbackData.email ||
            fallbackData.username ||
            ''
        ).trim();
        const name = String(
            decodedToken.name ||
            decodedToken.nombre ||
            fallbackData.name ||
            fallbackData.nombre ||
            email
        );
        const image = String(
            decodedToken.picture ||
            decodedToken.imagen ||
            fallbackData.picture ||
            fallbackData.imagen ||
            ''
        );

        if (!email) {
            throw new Error('Token inválido: no contiene correo');
        }

        localStorage.setItem("TOKEN", token);
        localStorage.setItem("EMAIL", email);
        localStorage.setItem("NAME", name);

        const formUser = {
            username: email,
            nombre: name,
            tipo: validarEstudiante(email) ? 2 : 3,
            imagen: image
        };

        await realizarPeticionPost(formUser);
    };

    const iniciarSesionConCredenciales = async (event) => {
        event.preventDefault();

        if (!username.trim() || !password.trim()) {
            setMensaje('Completa correo y contraseña');
            setEstadoBooleano(true);
            return;
        }

        setCargandoCredenciales(true);
        setEstadoBooleano(false);

        try {
            const response = await postUsernameLogin({
                username: username.trim(),
                email: username.trim(),
                password
            });

            const token = typeof response.data === 'string'
                ? response.data
                : response.data?.token || response.data?.access_token || response.data?.accessToken || response.data?.jwt;

            if (!token) {
                throw new Error('No se recibió token de autenticación');
            }

            const responseData = typeof response.data === 'object' && response.data !== null ? response.data : {};

            await persistSessionFromToken(token, {
                email: username.trim(),
                username: responseData.username,
                name: responseData.name,
                nombre: responseData.nombre,
                picture: responseData.picture,
                imagen: responseData.imagen,
            });
            redirectHome();
        } catch (error) {
            console.error('Error al iniciar sesión con correo y contraseña:', error);
            const mensajeError =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.response?.data?.msg ||
                'Correo o contraseña inválidos';
            setMensaje(mensajeError);
            setEstadoBooleano(true);
        } finally {
            setCargandoCredenciales(false);
        }
    };

    const handleCallbackResponse = async (response) => {
        if (!response?.credential) {
            setMensaje("No se pudo completar el inicio de sesión con Google. Intenta nuevamente.");
            setEstadoBooleano(true);
            return;
        }

        const userObject = jwtDecode(response.credential);
        //console.log(userObject); //DATOS DE GOOGLE

        if (!validarDominioCorreo(userObject.email)) {
            //SE DETIENE SI NO ES UN DOMINIO VALIDO
            setMensaje("Inicia sesión con un correo válido (Gmail, Hotmail, Yahoo, iCloud)")
            setEstadoBooleano(true);
            return;
        }
        //DATOS QUE SE ENVIAN A LA API
        const emailAsString = String(userObject.email);
        const nameAsString = String(userObject.name || userObject.email);
        const ImagenAsString = String(userObject.picture || '');
        localStorage.setItem("EMAIL", userObject.email);
        localStorage.setItem("NAME", nameAsString);
        localStorage.setItem("TOKEN", response.credential);

        setEstadoBooleano(false);

        if (validarEstudiante(userObject.email)) {
            //ESTUDIANTE
            const formEST = {
                username: emailAsString,
                nombre: nameAsString,
                tipo: 2,
                imagen: ImagenAsString
            };
            try {
                await realizarPeticionPost(formEST);
            } catch (error) {
                console.error("Error al enviar los datos del usuario:", error);
                setMensaje("Error al conectar con la API")
                setEstadoBooleano(true);
            }
            redirectHome(); //LO ENVIAMOS A HOME
        } else {
            //CATEDRATICO
            const formCATE = {
                username: emailAsString,
                nombre: nameAsString,
                tipo: 3,
                imagen: ImagenAsString
            };
            try {
                await realizarPeticionPost(formCATE);
            } catch (error) {
                console.error("Error al enviar los datos del usuario:", error);
                setMensaje("Error al conectar con la API")
                setEstadoBooleano(true);
            }
            redirectHome(); //LO ENVIAMOS A HOME
        }
    }

    useEffect(() => {
        //GOOGLE
        const clientId = GLOBAL[0].GOOGLE;
        if (!clientId) {
            console.error("VITE_GOOGLE_ID no está configurado en .env");
            return;
        }

        let scriptWasInjected = false;
        let loadListenerAttached = false;
        let existingScriptRef = null;

        const initializeGoogle = () => {
            try {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCallbackResponse,
                });
                window.google.accounts.id.renderButton(
                    document.getElementById("googleDIV"),
                    { theme: "outline", size: "large" },
                );
            } catch (error) {
                console.error("Error al inicializar Google Sign-In:", error);
                setMensaje("Error al cargar Google Sign-In. Verifica la configuración.");
                setEstadoBooleano(true);
            }
        };

        const scriptId = 'google-gsi-script';
        const existingScript = document.getElementById(scriptId);
        existingScriptRef = existingScript;

        const loadGoogleScript = () => {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogle;
            script.onerror = () => {
                setMensaje("No se pudo cargar Google Sign-In. Revisa tu conexión e intenta de nuevo.");
                setEstadoBooleano(true);
            };
            document.head.appendChild(script);
            scriptWasInjected = true;
            existingScriptRef = script;
        };

        if (window.google && window.google.accounts) {
            initializeGoogle();
        } else if (existingScript) {
            existingScript.addEventListener('load', initializeGoogle, { once: true });
            loadListenerAttached = true;
        } else {
            loadGoogleScript();
        }

        return () => {
            if (window.google?.accounts?.id) {
                window.google.accounts.id.cancel();
            }

            if (loadListenerAttached && existingScriptRef) {
                existingScriptRef.removeEventListener('load', initializeGoogle);
            }

            if (scriptWasInjected && existingScriptRef?.parentNode) {
                existingScriptRef.parentNode.removeChild(existingScriptRef);
            }

            const oneTapIframe = document.getElementById('gsi-consent-frame');
            if (oneTapIframe?.parentNode) {
                oneTapIframe.parentNode.removeChild(oneTapIframe);
            }

            const oneTapContainer = document.getElementById('credential_picker_container');
            if (oneTapContainer?.parentNode) {
                oneTapContainer.parentNode.removeChild(oneTapContainer);
            }
        };
    }, []);
    //MENSAJES DE ERROR
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [cargandoCredenciales, setCargandoCredenciales] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [estadoBooleano, setEstadoBooleano] = useState(false);
    //RENDER
    return (
        <div className='login'>
            <h1><b><span className='h1-rosa'>Bienvenidos a </span><span className='h1-azul'>Studium</span></b></h1>
            <article>
                <img src={LogoUCA} alt="Logo-UCA"></img>
                <p className='login-subtitle'>Inicia sesión con correo y contraseña</p>
                <form id='login' onSubmit={iniciarSesionConCredenciales}>
                    <input
                        type='email'
                        placeholder='Correo'
                        autoComplete='username'
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <div className='password-input-wrapper'>
                        <input
                            type={mostrarPassword ? 'text' : 'password'}
                            placeholder='Contraseña'
                            autoComplete='current-password'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <button
                            type='button'
                            className='toggle-password-btn'
                            onClick={() => setMostrarPassword((prev) => !prev)}
                            aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                            {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <button className='btn-login-admin' type='submit' disabled={cargandoCredenciales}>
                        {cargandoCredenciales ? 'Ingresando...' : 'Iniciar sesión'}
                    </button>
                </form>
                <p className='login-subtitle'>O continúa con tu cuenta de Google</p>
                <div id='googleDIV' className='googlebtn'></div>
                {
                    estadoBooleano === true &&
                    <div className='alertLogin'>
                        {mensaje}
                    </div>
                }
            </article>
        </div>
    )
}

export default Login;
