# Studium 360 - Frontend

## Índice
- [Repositorio](#repositorio)
- [Manuales de usuario](#manuales-de-usuario)
- [Aspectos generales](#aspectos-generales)
  - [Objetivos del documento](#objetivos-del-documento)
  - [Descripción general](#descripción-general)
  - [Requerimientos del sistema](#requerimientos-del-sistema)
  - [Software utilizado](#software-utilizado)
- [Arquitectura del sistema](#arquitectura-del-sistema)
  - [Patrones de diseño](#patrones-de-diseño)
  - [Modelo de información consumido](#modelo-de-información-consumido)
- [Guía de configuración](#guía-de-configuración)
  - [Configuración para el frontend del sistema](#configuración-para-el-frontend-del-sistema)
- [Compatibilidad de licencias](#compatibilidad-de-licencias)
- [Tipos de error](#tipos-de-error)
- [Tablero](#tablero)
- [Créditos](#créditos)

---

## Repositorio

**Frontend:** [https://github.com/DarkCastro24/StudiumFrontend.git]

---

## Manuales de usuario

- **Manual de usuario:** [https://ucaedusv-my.sharepoint.com/:b:/g/personal/00117322_uca_edu_sv/IQBlsoPHtmA3SYl0OOM3MH80AcJ8wJSPjxYA6oPamoYvAvc?e=RX6KGr]
- **Prototipo en Figma:** [https://www.figma.com/proto/V4H6ZfMVBVq1UooTogtjQW/WEB?node-id=42-2&starting-point-node-id=42%3A2]

---

## Aspectos generales

### Objetivos del documento

Este documento tiene como objetivo describir la estructura general, propósito, tecnologías, configuración y funcionamiento del frontend de **Studium**, con el fin de facilitar su instalación, comprensión y mantenimiento por parte del equipo de desarrollo y futuros colaboradores.

### Descripción general

**Studium** es una plataforma web orientada a apoyar los círculos de estudio de la Universidad Centroamericana José Simeón Cañas (UCA). Desde el frontend, el sistema permite que los usuarios interactúen con cursos, recursos académicos y perfiles según su rol dentro de la plataforma.

La aplicación contempla vistas y funcionalidades diferenciadas para los siguientes roles:

- **Tutor**
- **Tutorado**
- **Administrador**

Entre las funcionalidades principales del frontend se encuentran:

- Inicio de sesión con cuenta institucional
- Visualización de cursos disponibles
- Unión a cursos
- Creación y gestión de cursos
- Edición de perfil
- Registro y consulta de materias cursadas
- Gestión de recursos dentro de un curso
- Uso de calendario
- Control de asistencia
- Envío de correos
- Búsqueda por cursos, materias o perfiles

### Requerimientos del sistema

#### Para uso de la aplicación

- Navegador web actualizado
- Cuenta institucional UCA

#### Para desarrollo local

- **Node.js**
- **Yarn**
- **Sistema operativo Linux** (según la guía original del proyecto)
- Backend del sistema ejecutándose localmente

### Software utilizado

El frontend de Studium utiliza herramientas orientadas al desarrollo de una aplicación web moderna de una sola página.

Tecnologías y dependencias documentadas:

- **Axios**  
  Utilizado para realizar solicitudes HTTP hacia los servicios del backend.

- **jwt-decode**  
  Utilizado para decodificar tokens JWT del lado del cliente y obtener información del usuario autenticado.

- **React Router**  
  Utilizado para la navegación entre vistas dentro de la aplicación.

- **React Icons**  
  Utilizado para incorporar iconografía en la interfaz del sistema.

- **Yarn**  
  Utilizado como gestor de paquetes del frontend.

> Nota: por las dependencias documentadas y la naturaleza del prototipo, este frontend está planteado como una SPA basada en componentes.

---

## Arquitectura del sistema

El frontend de Studium está organizado como una interfaz web que consume los servicios expuestos por el backend del sistema. Su responsabilidad principal es presentar la información, administrar la interacción del usuario y facilitar el acceso a las funcionalidades según el rol autenticado.

### Patrones de diseño

A nivel frontend, el sistema puede describirse bajo los siguientes enfoques:

- **Arquitectura basada en componentes**  
  La interfaz se divide en vistas y secciones reutilizables.

- **Navegación por rutas**  
  Las diferentes pantallas del sistema se estructuran por rutas, permitiendo separar módulos como perfil, calendario, búsqueda, correo y cursos.

- **Separación por roles**  
  La interfaz adapta sus vistas y opciones para Tutor, Tutorado, Administrador y Catedrático.

### Modelo de información consumido

Aunque el modelo persistente pertenece al backend, el frontend consume principalmente las siguientes entidades:

- **Usuarios**
- **Cursos**
- **Recursos**
- **Tutorados**
- **Materias de interés**
- **Perfiles**
- **Mensajes de correo**

Principales rutas de API consumidas por el sistema:

- `/api/register`
- `/api/login`
- `/api/cursos`
- `/api/cursos/:cursoId/tutorados`
- `/api/usuarios`
- `/api/correo`

---

## Guía de configuración

### Configuración para el frontend del sistema

#### 1. Clonar el repositorio

```bash
git clone https://github.com/DarkCastro24/StudiumFrontend.git