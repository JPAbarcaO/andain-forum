# Andain Forum - Aplicación Angular

## 📌 Descripción
Andain Forum es una aplicación web desarrollada en Angular 12.2.0 que permite a los usuarios interactuar en un foro de discusión. La aplicación permite a los usuarios autenticarse, crear, editar y eliminar publicaciones y comentarios.

## 🛠️ Tecnologías utilizadas
- **Angular** 12.2.0
- **Bootstrap** 5.3.3
- **PrimeNG** 12.2.3
- **SweetAlert2** 11.16.0
- **RxJS** 6.6.0
- **JWT Decode** 4.0.0

## 📂 Estructura del proyecto
```
|-- src
    |-- app
        |-- guards       # Guards para autenticación
        |-- interceptors # Interceptores para peticiones HTTP
        |-- models       # Modelos de datos
        |-- pages
            |-- forum    # Página principal del foro
            |-- login    # Página de login
        |-- services
            |-- auth     # Servicio de autenticación
            |-- forum    # Servicio de gestión del foro
            |-- register # Servicio de registro de usuario
        |-- validators  # Validaciones de formularios
    |-- assets          # Archivos estáticos
    |-- environments    # Configuración de entornos
```

## 🚀 Instalación y configuración
### 1️⃣ Clonar el repositorio
```sh
git clone https://github.com/tu-repositorio.git
cd andain-forum
```

### 2️⃣ Instalar dependencias
```sh
npm install
```

### 3️⃣ Iniciar la aplicación
```sh
npm start
```
Esto iniciará el servidor en `http://localhost:4200/`

## 🧪 Pruebas unitarias
Este proyecto utiliza **Karma y Jasmine** para pruebas unitarias.
Ejecuta las pruebas con:
```sh
npm test
```

## 📜 Scripts disponibles
| Comando           | Descripción                                |
|------------------|--------------------------------------------|
| `npm start`      | Ejecuta la aplicación en modo desarrollo  |
| `npm build`      | Genera la compilación de producción       |
| `npm test`       | Ejecuta las pruebas unitarias             |

## 📄 Licencia
Este proyecto está bajo la licencia **MIT**.

