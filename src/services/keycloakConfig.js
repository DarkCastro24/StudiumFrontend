import Keycloak from 'keycloak-js';

/**
 * Configuración del cliente Keycloak (OpenID Connect) para autenticación.
 *
 * --------------------------------------------------------------------------
 * REQUISITOS DE CONFIGURACIÓN EXTERNA (Servidor Keycloak)
 * --------------------------------------------------------------------------
 * Para que esta autenticación funcione es necesario tener un servidor
 * Keycloak (>=17) en línea y registrar un cliente en él:
 *
 *   1. Ingresa a la consola de administración de Keycloak.
 *   2. Selecciona o crea el realm donde vivirá la aplicación (ej.: "studium").
 *        - El nombre del realm se expone como VITE_KEYCLOAK_REALM.
 *   3. Clients → Create client:
 *        - Client ID: "studium-frontend" (o el que prefieras).
 *          Se expone como VITE_KEYCLOAK_CLIENT_ID.
 *        - Client type: OpenID Connect.
 *        - Client authentication: OFF  (cliente público, usa PKCE).
 *        - Authorization: OFF.
 *        - Authentication flow: marca "Standard flow" y "Direct access grants"
 *          (este último solo si lo necesitas en otros entornos).
 *   4. En la pestaña "Settings" del cliente:
 *        - Valid redirect URIs:
 *            • http://localhost:5173/*        (desarrollo con Vite)
 *            • https://<tu-dominio>/*         (producción)
 *        - Valid post logout redirect URIs:
 *            • mismas URLs que arriba
 *        - Web origins:
 *            • http://localhost:5173
 *            • https://<tu-dominio>
 *            • (o "+" para reutilizar los valid redirect URIs)
 *   5. En la pestaña "Advanced" → "Proof Key for Code Exchange Code Challenge Method"
 *      selecciona "S256" (recomendado).
 *   6. Crea usuarios en el realm (o configura federación con Microsoft Entra ID,
 *      LDAP, Google, etc. desde "Identity providers"). El flujo del frontend
 *      es independiente del proveedor que use Keycloak por debajo.
 *   7. Variables esperadas en `.env`:
 *        - VITE_KEYCLOAK_URL          → https://keycloak.midominio.com
 *        - VITE_KEYCLOAK_REALM        → studium
 *        - VITE_KEYCLOAK_CLIENT_ID    → studium-frontend
 *        - VITE_KEYCLOAK_MIN_VALIDITY → 60 (opcional, segundos)
 *
 * Mientras no se complete este registro, las variables pueden quedar vacías:
 * el botón seguirá visible y mostrará una alerta informando que la
 * configuración está pendiente, sin romper el resto del flujo del sistema.
 * --------------------------------------------------------------------------
 */

const url = import.meta.env.VITE_KEYCLOAK_URL || '';
const realm = import.meta.env.VITE_KEYCLOAK_REALM || '';
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || '';

const parsedMinValidity = Number(import.meta.env.VITE_KEYCLOAK_MIN_VALIDITY);
export const KEYCLOAK_MIN_VALIDITY = Number.isFinite(parsedMinValidity) && parsedMinValidity > 0
    ? parsedMinValidity
    : 60;

/**
 * Indica si la integración con Keycloak está completamente configurada.
 * Si es `false`, el componente de login muestra un mensaje aclarando
 * que la autenticación con Keycloak está pendiente de configuración.
 */
export const isKeycloakConfigured = Boolean(url && realm && clientId);

export const keycloakConfig = {
    url,
    realm,
    clientId,
};

/**
 * Opciones por defecto para `keycloak.init()`.
 *
 * - `onLoad: 'check-sso'` no fuerza el login: si el usuario ya tiene sesión
 *   activa en Keycloak la recupera, en caso contrario deja la app sin
 *   autenticar (permitiendo que se muestre la pantalla de Login).
 * - `pkceMethod: 'S256'` exige Proof Key for Code Exchange (recomendado en
 *   clientes públicos).
 * - `checkLoginIframe: false` evita el iframe oculto que algunos navegadores
 *   bloquean por políticas de cookies de terceros.
 */
export const keycloakInitOptions = {
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    checkLoginIframe: false,
    enableLogging: import.meta.env.DEV,
};

/**
 * Instancia compartida del cliente Keycloak.
 * Si la configuración no está completa devuelve `null`: el provider
 * la trata como "no inicializado" y la app sigue funcionando con el
 * login deshabilitado en lugar de romper en tiempo de import.
 */
export const keycloakInstance = isKeycloakConfigured
    ? new Keycloak(keycloakConfig)
    : null;
