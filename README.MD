# Studium 360 — Frontend

Aplicación web frontend del sistema **Studium**, una plataforma para los círculos de estudio de la **Universidad Centroamericana José Simeón Cañas (UCA)**. Permite a estudiantes, catedráticos y administradores gestionar cursos, recursos académicos, perfiles y comunicaciones desde una interfaz única.

---

## Índice
- [Descripción general](#descripción-general)
- [Características principales](#características-principales)
- [Stack tecnológico](#stack-tecnológico)
- [Requisitos previos](#requisitos-previos)
- [Instalación rápida](#instalación-rápida)
- [Configuración](#configuración)
  - [Variables de entorno](#variables-de-entorno)
  - [Configuración del backend](#configuración-del-backend)
  - [Configuración de Keycloak](#configuración-de-keycloak)
  - [Federación con Microsoft Entra ID (opcional)](#federación-con-microsoft-entra-id-opcional)
- [Ejecución](#ejecución)
  - [Opción A — Docker Compose (recomendada)](#opción-a--docker-compose-recomendada)
  - [Opción B — Local sin Docker](#opción-b--local-sin-docker)
  - [Build de producción](#build-de-producción)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Flujo de autenticación](#flujo-de-autenticación)
- [API consumida](#api-consumida)
- [Scripts disponibles](#scripts-disponibles)
- [Estado del proyecto](#estado-del-proyecto)
- [Recursos y documentación adicional](#recursos-y-documentación-adicional)
- [Créditos](#créditos)

---

## Descripción general

Studium es una plataforma web orientada a apoyar los círculos de estudio de la UCA. El frontend está implementado como una **Single Page Application (SPA)** que consume los servicios REST expuestos por el backend del sistema y delega la autenticación a un servidor **Keycloak**.

La aplicación contempla vistas y permisos diferenciados según el rol del usuario:

| Tipo | Identificador interno | Cómo se asigna |
| ---- | --------------------- | -------------- |
| Estudiante (tutorado) | `tipo = 2` | Usuario cuyo correo empieza con 8 dígitos numéricos (carnet UCA) |
| Catedrático / Tutor   | `tipo = 3` | Cualquier otro correo en un dominio permitido |
| Administrador         | `tipo = 1` (TODO confirmar) | Asignado manualmente desde el backend |

---

## Características principales

- Inicio de sesión con **correo y contraseña** o **Keycloak** (OpenID Connect + PKCE).
- Federación opcional con **Microsoft Entra ID** y otros proveedores soportados por Keycloak.
- Visualización, creación y administración de **cursos**.
- Unión a cursos como estudiante o como catedrático.
- Gestión de **recursos** dentro de un curso (subida, edición, eliminación).
- Edición de **perfil** con seguimiento de progreso académico (CUM, materias cursadas, notas).
- **Buscador** de cursos, materias y perfiles.
- **Calendario** y control de asistencia.
- Envío de **correos** internos asociados a un curso.
- Notificaciones consistentes con **SweetAlert2**.

---

## Stack tecnológico

| Categoría | Tecnología |
| --------- | ---------- |
| Build / dev server | **Vite 4** |
| UI framework | **React 18** |
| Ruteo | **React Router 6** |
| Estilos | **Sass**, **Tailwind CSS 3**, **Reactstrap** |
| HTTP | **Axios** |
| Autenticación | **keycloak-js 25** (Authorization Code + PKCE) |
| Tokens | **jwt-decode** |
| Tablas | **react-table** |
| Iconografía | **react-icons** |
| Alertas | **SweetAlert2** |
| Gestor de paquetes | **npm** o **yarn** |
| Contenerización | **Docker** + **Docker Compose** |
| Linting | **ESLint** |

---

## Requisitos previos

### Para usar la aplicación

- Navegador web moderno (Chrome, Edge, Firefox, Safari).
- Cuenta válida en uno de los dominios permitidos: `gmail.com`, `hotmail.com`, `outlook.com`, `yahoo.com`, `icloud.com`, `live.com`, `uca.edu.sv`.

### Para desarrollo

Tienes dos rutas, según prefieras:

**Con Docker (recomendado)**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/macOS/Linux) o Docker Engine + Compose.

**Sin Docker**
- [Node.js](https://nodejs.org) **20 LTS o superior**.
- **npm 10+** o **Yarn 1.22+**.
- Una instancia de **Keycloak >= 25** accesible (instalación local o remota).
- Acceso al **backend** de Studium (local o desplegado).

---

## Instalación rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/DarkCastro24/StudiumFrontend-plus.git
cd StudiumFrontend-plus

# 2. Copiar la plantilla de variables de entorno
cp .env.example .env.local
# (en Windows PowerShell: Copy-Item .env.example .env.local)

# 3. Editar .env.local con tus valores (ver sección "Variables de entorno")
```

A partir de aquí elige Docker Compose o ejecución local — ver [Ejecución](#ejecución).

---

## Configuración

### Variables de entorno

Definidas en `.env.local` (o `.env`). Vite las inyecta en build time con el prefijo `VITE_`.

| Variable | Descripción | Default usado en Docker | Obligatoria |
| -------- | ----------- | ----------------------- | ----------- |
| `VITE_API_URL` | URL base del backend, incluyendo `/api`. | `https://studiumserver.onrender.com/api` | Sí |
| `VITE_DEFAULT_PASSWORD` | Contraseña usada al dar de alta usuarios nuevos desde el frontend. | `StudiumPassword` | Sí |
| `VITE_KEYCLOAK_URL` | URL pública del servidor Keycloak (sin `/auth`). | `http://localhost:8080` | Opcional* |
| `VITE_KEYCLOAK_REALM` | Nombre del realm donde vive el cliente. | `studium` | Opcional* |
| `VITE_KEYCLOAK_CLIENT_ID` | Client ID público (PKCE) registrado en el realm. | `studium` | Opcional* |
| `VITE_KEYCLOAK_MIN_VALIDITY` | Segundos mínimos restantes al access token antes de renovarlo. | `60` | No |

\* Si las tres variables de Keycloak están vacías, el botón **Iniciar sesión con Keycloak** seguirá visible pero mostrará un aviso indicando que la configuración está pendiente. El login clásico con correo y contraseña sigue funcionando.

### Configuración del backend

El frontend necesita un backend que exponga, como mínimo, los endpoints listados en [API consumida](#api-consumida).

- En desarrollo puedes apuntar a la instancia desplegada (`https://studiumserver.onrender.com/api`). Por ser plan free de Render, el primer request tras inactividad puede tardar **30-90 segundos** en responder ("cold start").
- Para evitar cold starts, ejecuta el backend localmente y apunta `VITE_API_URL` a `http://localhost:<puerto>/api`.

### Enlace del backend: 
https://github.com/Melissaav22/StudiumServer-plus

### Configuración de Keycloak

Studium delega la autenticación a un servidor **Keycloak >= 25** usando el flujo estándar **Authorization Code + PKCE**.

#### Crear el realm y el client

1. Entra a la consola admin de Keycloak (`/admin`) con credenciales de administrador.
2. Crea (o selecciona) un realm — por ejemplo `studium`. Este nombre se expone como `VITE_KEYCLOAK_REALM`.
3. **Clients → Create client**:
   - **Client type:** `OpenID Connect`.
   - **Client ID:** `studium` (debe coincidir con `VITE_KEYCLOAK_CLIENT_ID`).
4. **Capability config**:
   - **Client authentication:** **OFF** (cliente público con PKCE).
   - **Authorization:** OFF.
   - **Authentication flow:** marca **Standard flow** (y opcionalmente *Direct access grants*).
5. **Login settings**:
   - **Valid redirect URIs:** `http://localhost:5173/*` (dev) y `https://<tu-dominio>/*` (prod).
   - **Valid post logout redirect URIs:** mismas URLs que arriba.
   - **Web origins:** `+` (o las URLs explícitas).
6. **Advanced → Proof Key for Code Exchange Code Challenge Method:** **S256**.
7. Crea usuarios desde **Users → Add user** (o usa el setup automatizado de Docker Compose con un realm export).

#### Foto de perfil (claim `picture`) — opcional

El componente `UserProfileCard` lee el claim `picture` del id_token. Para poblarlo:

1. En el realm: **Users → Attributes** → añade el atributo `picture`.
2. En el client: **Client scopes → studium-dedicated → Add mapper → By configuration → User Attribute**:
   - User Attribute: `picture`.
   - Token Claim Name: `picture`.
   - Marca **Add to ID token**.

Mientras no esté configurado, el frontend usa el placeholder genérico de Gravatar (`?d=mp`).

### Federación con Microsoft Entra ID (opcional)

Keycloak puede delegar la autenticación a cuentas Microsoft (personales u organizativas) mediante un Identity Provider.

#### En Azure

1. [portal.azure.com](https://portal.azure.com) → **Microsoft Entra ID → App registrations → New registration**.
2. **Supported account types:** *"Accounts in any organizational directory (Multitenant) and personal Microsoft accounts"*.
3. **Redirect URI:** Web → `http://<keycloak-host>:8080/realms/studium/broker/microsoft/endpoint`.
4. Anota el **Application (client) ID**.
5. **Certificates & secrets → New client secret** → copia el **Value** inmediatamente.

#### En Keycloak

1. Realm `studium` → **Identity providers → Add provider → Microsoft**.
2. **Alias:** `microsoft` (debe coincidir con el redirect URI usado en Azure).
3. **Client ID** y **Client Secret:** los obtenidos en Azure.
4. **Tenant ID:** `common` (o déjalo vacío para multi-tenant + cuentas personales).
5. **Save**.

> Los Client Secrets son sensibles. No los versiones en git, ni los compartas por chat / correo. Rota el secret de inmediato si se filtra.

---

## Ejecución

### Opción A — Docker Compose (recomendada)

Levanta el frontend y un Keycloak completo (con tu realm exportado) en un solo comando.

#### Pre-requisito: exportar el realm de Keycloak

Si ya tienes un Keycloak con el realm `studium` configurado:

1. Entra a la consola admin → realm `studium` → **Realm settings**.
2. Esquina superior derecha → menú **Action ▼** → **Partial export**.
3. Activa todos los toggles (*Include groups and roles*, *Include clients*).
4. **Export** → descarga el JSON.
5. Renombra el archivo a `studium-realm.json` y colócalo en `keycloak/import/`.

> El partial export NO incluye client secrets de identity providers. Si usas el provider Microsoft, deberás reingresar su Client Secret en Keycloak después del primer arranque.

Si **no** tienes un realm previo, crea el archivo `keycloak/import/studium-realm.json` con la configuración mínima requerida (TODO: proveer un `studium-realm.example.json` versionado).

#### Levantar

```powershell
docker compose up -d
docker compose logs -f
```

Cuando termine de arrancar:
- Frontend: <http://localhost:5173>
- Keycloak admin: <http://localhost:8080/admin> (usuario `admin`, contraseña `admin`)

#### Comandos útiles

```powershell
docker compose down            # detener (mantiene el volumen de Keycloak)
docker compose down -v         # detener y borrar el volumen (reset)
docker compose logs -f frontend
docker compose logs -f keycloak
docker compose up -d --build frontend   # rebuild tras cambiar package.json
```

#### Hot reload

El código fuente se monta como volumen, así que cualquier cambio en `src/` se refleja al instante gracias a Vite HMR. El flag `CHOKIDAR_USEPOLLING=true` en `docker-compose.yml` garantiza que el watcher funcione en Windows.

### Opción B — Local sin Docker

```powershell
npm install      # o yarn install
npm run dev      # o yarn dev
```

El servidor de desarrollo arranca en <http://localhost:5173>.

Asegúrate de tener Keycloak corriendo en la URL apuntada por `VITE_KEYCLOAK_URL` y el backend respondiendo en `VITE_API_URL`.

### Build de producción

```powershell
npm run build      # genera bundles optimizados en /dist
npm run preview    # sirve /dist localmente para verificar
```

Los archivos generados en `dist/` pueden hospedarse en cualquier servidor estático (Vercel, Netlify, nginx, etc.).

El proyecto incluye `vercel.json` para despliegue en **Vercel** sin configuración adicional.

---

## Estructura del proyecto

```
StudiumFrontend-plus/
├── .env.example                      # plantilla de variables de entorno
├── docker-compose.yml                # orquestación frontend + Keycloak
├── Dockerfile.dev                    # imagen de desarrollo (Vite + node:20-alpine)
├── .dockerignore
├── vite.config.js                    # configuración de Vite
├── vercel.json                       # configuración de despliegue en Vercel
├── index.html                        # punto de entrada HTML
├── keycloak/
│   └── import/                       # realm export JSON (no versionado)
└── src/
    ├── main.jsx                      # bootstrap React + KeycloakProvider
    ├── App.jsx                       # rutas y layout principal
    ├── assets/
    │   ├── img/                      # imágenes (logos, etc.)
    │   └── styles/                   # Sass (componentes, vistas, base)
    ├── components/                   # componentes UI reutilizables
    │   ├── AppHeader.jsx
    │   ├── SidebarMenu.jsx
    │   ├── CourseCard.jsx
    │   ├── UserProfileCard.jsx
    │   ├── Modal*.jsx                # modales de creación/edición
    │   └── ...
    ├── views/                        # páginas (rutas)
    │   ├── LoginPage.jsx
    │   ├── HomePage.jsx
    │   ├── MessagesPage.jsx
    │   ├── SearchPage.jsx
    │   ├── StudentProfilePage.jsx
    │   ├── TeacherProfilePage.jsx
    │   ├── UserProfilePage.jsx
    │   ├── CreateCoursePage.jsx
    │   ├── CourseResourcesPage.jsx
    │   └── perfil/                   # secciones del perfil académico
    ├── services/
    │   ├── apiConfig.js              # GLOBAL — URL base del backend + KC
    │   ├── keycloakConfig.js         # instancia y opciones de keycloak-js
    │   ├── KeycloakProvider.jsx      # contexto React + useKeycloak()
    │   └── services.js               # exports legacy
    ├── hooks/
    │   └── useUserData.js            # hook con datos del usuario logueado
    └── utils/
        └── alerts.js                 # wrappers de SweetAlert2
```

---

## Rutas de la aplicación

Definidas en `src/App.jsx`. Las rutas marcadas como protegidas requieren un `ID` válido en `localStorage` (resultado del login); si no existe, el usuario es redirigido a `/login`.

| Ruta | Componente | Protegida | Descripción |
| ---- | ---------- | --------- | ----------- |
| `/` | `LoginPage` | No | Alias del login |
| `/login` | `LoginPage` | No | Login con correo/contraseña o Keycloak |
| `/home` | `HomePage` | Sí | Dashboard de cursos |
| `/perfil` | `StudentProfilePage` o `TeacherProfilePage` | Sí | Se renderiza según `tipo` del usuario |
| `/perfil/agregar-curso` | `CreateCoursePage` | Sí | Creación de cursos (catedrático) |
| `/recursos` | `CourseResourcesPage` | Sí | Recursos del curso seleccionado |
| `/messages` | `MessagesPage` | Sí | Correos del curso |
| `/search` | `SearchPage` | Sí | Buscador global |
| `/search/user/:id` | `UserProfilePage` | Sí | Perfil de otro usuario |

---

## Flujo de autenticación

El frontend soporta dos caminos para iniciar sesión, ambos terminan registrando un `TOKEN` y un `ID` en `localStorage`:

### 1. Login clásico (correo + contraseña)

1. El usuario llena correo y contraseña en `/login`.
2. `LoginPage.iniciarSesionConCredenciales` hace POST a varios candidatos de endpoint (`/auth/login`, `/auth/login/username`, etc.) hasta encontrar el correcto.
3. El backend devuelve un JWT.
4. El frontend lo decodifica con `jwt-decode`, valida que el dominio del correo esté en la lista permitida, y llama a `/auth/register` para hacer upsert del usuario.
5. El backend responde con un `ID` de Mongo → se guarda en `localStorage` y se redirige a `/home`.

### 2. Login federado con Keycloak (OpenID Connect + PKCE)

1. El usuario pulsa **Iniciar sesión con Keycloak**.
2. `KeycloakProvider` (en `src/services/KeycloakProvider.jsx`) ya inicializó `keycloak-js` con `onLoad: 'check-sso'`.
3. Al pulsar el botón se llama a `keycloak.login()` → redirige a Keycloak.
4. Keycloak muestra su pantalla: el usuario puede ingresar con usuario/contraseña del realm, o pulsar un botón de un **Identity Provider** federado (Microsoft, Google, etc.).
5. Tras autenticar, Keycloak redirige de vuelta a `/login` con tokens en el fragmento de URL.
6. El `useEffect` en `LoginPage` detecta `authenticated === true`, lee `tokenParsed.email`, valida el dominio, y llama a `/auth/register` para registrar/actualizar al usuario en el backend.
7. Redirige a `/home`.

`keycloak-js` se encarga automáticamente de renovar el access token cuando esté a punto de expirar (controlado por `VITE_KEYCLOAK_MIN_VALIDITY`).

---

## API consumida

Endpoints principales que el frontend consume del backend (ver `VITE_API_URL`):

| Endpoint | Método | Uso |
| -------- | ------ | --- |
| `/auth/login` (con fallbacks) | POST | Login clásico con username/password |
| `/auth/register` | POST | Alta/upsert del usuario tras autenticarse |
| `/user/profile/:id` | GET | Obtener el `tipo` del usuario logueado |
| `/cursos` | GET / POST | Listar y crear cursos |
| `/cursos/:cursoId/tutorados` | GET | Estudiantes de un curso |
| `/usuarios` | GET | Búsqueda y listado de usuarios |
| `/correo` | GET / POST | Correos internos del curso |

> **TODO**: completar esta tabla con todos los endpoints, métodos exactos y payloads cuando se documente la API REST del backend.

---

## Scripts disponibles

Definidos en `package.json`:

| Script | Comando | Descripción |
| ------ | ------- | ----------- |
| `dev` | `npm run dev` / `yarn dev` | Inicia el dev server de Vite con HMR en <http://localhost:5173> |
| `build` | `npm run build` / `yarn build` | Genera bundle de producción en `dist/` |
| `preview` | `npm run preview` / `yarn preview` | Sirve `dist/` localmente para verificar el build |
| `lint` | `npm run lint` / `yarn lint` | Ejecuta ESLint con `--max-warnings 0` |

---

## Estado del proyecto

- **Autenticación con Keycloak** integrada (Authorization Code + PKCE).
- **Federación con Microsoft Entra ID** documentada y probada.
- **Docker Compose** para entorno de desarrollo reproducible.
- Refactor de vistas a archivos con nombres descriptivos (`LoginPage.jsx`, `HomePage.jsx`, etc.).
- **Backend en Render free tier** — sufre cold starts de 30-90s. Considerar plan pagado o migrar para producción.
- **Foto de perfil desde Keycloak** — código preparado, falta configurar el mapper en el realm.
- **Documentación completa de la API REST** consumida (sección [API consumida](#api-consumida)).
- **Tests automatizados** (TODO: aún no se ha integrado un framework de pruebas).

---

## Recursos y documentación adicional

- **Manual de usuario:** <https://ucaedusv-my.sharepoint.com/:b:/g/personal/00117322_uca_edu_sv/IQBlsoPHtmA3SYl0OOM3MH80AcJ8wJSPjxYA6oPamoYvAvc?e=RX6KGr>
- **Prototipo en Figma:** <https://www.figma.com/proto/V4H6ZfMVBVq1UooTogtjQW/WEB?node-id=42-2&starting-point-node-id=42%3A2>
- **Documentación de Keycloak:** <https://www.keycloak.org/documentation>
- **Documentación de Vite:** <https://vitejs.dev>
