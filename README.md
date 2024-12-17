# Sistema de Gestión de Laboratorios

Este proyecto es un sistema diseñado para la gestión de laboratorios. Permite a los usuarios autenticarse, crear y gestionar reservas de equipos, y realizar búsquedas de los elementos registrados en el sistema. Incluye funcionalidades modernas de autenticación y seguridad.

## Características
-Registrar salas de labortorio
-Listar las salas
-Gestionar 
-Consultar disponibilidad
-Login
-Logout
-Eliminar reservas 

### Autenticación
- **Registro de usuarios**: Permite crear cuentas nuevas con credenciales únicas.
- **Login con JWT**: Los usuarios inician sesión y obtienen un token para acceder a las rutas protegidas.
- **Protección de rutas**: Solo los usuarios autenticados pueden acceder a ciertas funcionalidades.

### Página Principal de Gestión
- **Formulario para crear nuevo elemento**: Los usuarios pueden registrar reservas o equipos.
- **Listado de elementos existentes**: Muestra las reservas o equipos almacenados.
- **Búsqueda/Filtrado**: Los usuarios pueden buscar elementos específicos según criterios definidos.

### Base de Datos
- **Colección de usuarios**: Almacena la información de los usuarios.
- **Colección específica**: Almacena información de reservas y equipos.
- **Relaciones**: Vincula usuarios con los elementos que han reservado o creado.

---

## Tecnologías Utilizadas
- **Backend**: Node.js
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Frontend**: HTML, CSS, javascript

---

## Requisitos del Sistema
1. Node.js (versión 14 o superior)
2. MongoDB (versión 4.0 o superior)

---


