# Activacoop

## Sistema de gestión de eventos e inscripciones para una cooperativa.

Activacoop es una aplicación web orientada a facilitar la consulta de
eventos, la gestión de inscripciones y la administración de actividades
para los asociados de una cooperativa.

Estado: proyecto en desarrollo. El despliegue público y la
configuración de producción deben completarse por separado.

## Funcionalidades

-Consulta de eventos y categorías.

-Registro e inicio de sesión de usuarios.

-Autenticación mediante tokens JWT.

-Consulta de las inscripciones del usuario autenticado.

-Gestión administrativa de eventos.

-Consulta de estadísticas restringida a administradores.

-Control de acceso según el rol del usuario.

## Tecnologías

Frontend: React, Vite, JavaScript y CSS.
Backend: Node.js, Express y MySQL.
Librerías: mysql2, bcryptjs, jsonwebtoken y dotenv.

## Estructura general

```text
ACTIVACOOP/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── package.json
│
├── README.md
└── .gitignore
```

### Requisitos

Node.js y npm.

MySQL.

Git.

Navegador web moderno.

## Instalación y ejecución local

1. Clonar el repositorio

git clone <URL_DEL_REPOSITORIO>
cd ACTIVACOOP

Reemplaza <URL_DEL_REPOSITORIO> por la dirección real del repositorio.

2. Configurar el backend

cd backend
npm install

Crea backend/.env con la configuración de tu entorno. El backend
utiliza estas variables:

PORT=3000
DB_HOST=localhost
DB_USER=TU_USUARIO_MYSQL
DB_PASSWORD=TU_CONTRASENA_MYSQL
DB_NAME=TU_BASE_DE_DATOS
JWT_SECRET=CAMBIA_ESTA_CLAVE_POR_UNA_CLAVE_SEGURA

Ajusta los valores a tu instalación y asegúrate de que la base de datos
y sus tablas existan. No publiques el archivo .env ni compartas
credenciales o secretos.

### Inicia el backend:

npm run dev

Por defecto, el servidor utiliza el puerto 3000, salvo que se
configure otro valor en PORT.

3. Configurar el frontend

Abre otra terminal desde la carpeta raíz:

cd frontend
npm install
npm run dev

Abre en el navegador la dirección local que muestre Vite.

Para generar los archivos de producción:

npm run build

## Rutas de API identificadas

Método                  Ruta                                     Descripción

GET                     /api/eventos                           Consultar eventos

GET                     /api/eventos/:id                       Consultar un evento

POST                    /api/auth/registro                     Registrar usuario

POST                    /api/auth/login                        Iniciar sesión

GET                     /api/auth/perfil                       Consultar perfil con
autenticación

GET                     /api/inscripciones/mis-inscripciones   Consultar inscripciones
propias

POST                    /api/inscripciones                     Crear una inscripción
autenticada

DELETE                  /api/inscripciones/:id                 Cancelar una
inscripción autenticada

El backend también dispone de rutas para categorías y operaciones
administrativas. Consulta backend/routes/ para conocer el detalle
actualizado de los endpoints.

## Seguridad

-Las contraseñas se procesan con bcryptjs.

-Las rutas protegidas utilizan tokens JWT.

-Las operaciones administrativas verifican el rol del usuario.

-Las credenciales y secretos deben almacenarse en variables de
entorno.

-No incluyas tokens, contraseñas ni archivos .env en GitHub.

## Pruebas realizadas

En las pruebas locales registradas se verificaron estos escenarios:

- Consulta de eventos: 200 OK.

- Perfil sin token: 401 Unauthorized.

- Estadísticas sin token: 401 Unauthorized.

- Inicio de sesión con credenciales válidas: 200 OK.

- Acceso de un afiliado a estadísticas administrativas:
403 Forbidden.

- Consulta de inscripciones propias con token: 200 OK.

Estas pruebas cubren únicamente los escenarios indicados; no constituyen
una auditoría integral de seguridad ni una validación completa de todas
las funciones.

## Despliegue

Para publicar Activacoop en Internet es necesario desplegar y configurar
por separado el frontend, el backend y la base de datos MySQL. También
se deben configurar las variables de entorno, la URL del backend en el
frontend, CORS y la conexión a la base de datos.

No se incluye una URL pública porque el despliegue debe configurarse y
verificarse.

Autor y contexto académico

Proyecto desarrollado como parte del proceso formativo de Análisis y
Desarrollo de Software -- SENA.

Autor: Jhonatan Andrés Sierra Álvarez, 
        Camilo Hernadez
        
