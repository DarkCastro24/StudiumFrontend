import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
    KEYCLOAK_MIN_VALIDITY,
    isKeycloakConfigured,
    keycloakInitOptions,
    keycloakInstance,
} from './keycloakConfig';

/**
 * Contexto React que expone la instancia Keycloak, el estado de autenticación
 * y los helpers principales. Mantiene el mismo patrón que `<MsalProvider>` +
 * `useMsal()` para minimizar cambios en los consumidores.
 */
const KeycloakContext = createContext({
    keycloak: null,
    initialized: false,
    authenticated: false,
    configured: false,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    updateToken: () => Promise.resolve(false),
});

export const KeycloakProvider = ({ children }) => {
    const [initialized, setInitialized] = useState(!isKeycloakConfigured);
    const [authenticated, setAuthenticated] = useState(false);
    const initRequested = useRef(false);

    useEffect(() => {
        if (!keycloakInstance || initRequested.current) return undefined;
        initRequested.current = true;

        keycloakInstance
            .init(keycloakInitOptions)
            .then((isAuthenticated) => {
                setAuthenticated(Boolean(isAuthenticated));
                setInitialized(true);
            })
            .catch((error) => {
                console.error('[Keycloak] Error inicializando el adaptador:', error);
                setInitialized(true);
            });

        // Mantener tokens vigentes: cada vez que el access token está a punto
        // de expirar, Keycloak intenta renovarlo usando el refresh token.
        keycloakInstance.onTokenExpired = () => {
            keycloakInstance
                .updateToken(KEYCLOAK_MIN_VALIDITY)
                .catch((error) => {
                    console.error('[Keycloak] No se pudo renovar el token:', error);
                    setAuthenticated(false);
                });
        };

        keycloakInstance.onAuthSuccess = () => setAuthenticated(true);
        keycloakInstance.onAuthLogout = () => setAuthenticated(false);
        keycloakInstance.onAuthError = (error) => {
            console.error('[Keycloak] Error de autenticación:', error);
            setAuthenticated(false);
        };

        return undefined;
    }, []);

    const value = useMemo(() => ({
        keycloak: keycloakInstance,
        initialized,
        authenticated,
        configured: isKeycloakConfigured,
        login: (options) => keycloakInstance ? keycloakInstance.login(options) : Promise.resolve(),
        logout: (options) => keycloakInstance ? keycloakInstance.logout(options) : Promise.resolve(),
        updateToken: (minValidity = KEYCLOAK_MIN_VALIDITY) =>
            keycloakInstance ? keycloakInstance.updateToken(minValidity) : Promise.resolve(false),
    }), [initialized, authenticated]);

    return (
        <KeycloakContext.Provider value={value}>
            {children}
        </KeycloakContext.Provider>
    );
};

KeycloakProvider.propTypes = {
    children: PropTypes.node,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useKeycloak = () => useContext(KeycloakContext);
