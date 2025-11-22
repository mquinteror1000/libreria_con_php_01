# El Nido Literario - Aplicación Web de Librería

Aplicación web completa con frontend en React + TypeScript, backend en PHP, base de datos MySQL y phpMyAdmin para administración. Todo desplegado con Docker.
Para sistemas distribuidos

## Integrantes
- G. M. Mariana
- G. P. Diego
- C. M. Ileana Angelica
- P. B. José Andrés
- Q. R. Martin

## 📋 Requisitos Previos

- Docker (v20.10 o superior)
- Docker Compose (v2.0 o superior)

## 🚀 Despliegue con Docker

### 1. Clonar o ubicarse en el directorio del proyecto


### 2. Construir y levantar los contenedores

```bash
docker-compose up -d --build
```

Este comando levantará 4 servicios:

- **MySQL** (Puerto 3306): Base de datos
- **phpMyAdmin** (Puerto 8080): Administrador de base de datos
- **Backend PHP** (Puerto 8000): API REST
- **Frontend React** (Puerto 3000): Aplicación web

### 3. Verificar que los servicios estén funcionando

```bash
docker-compose ps
```

### 4. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **phpMyAdmin**: http://localhost:8080

## 👥 Usuarios de Prueba


### Administrador
- Email: `admin@nidoliterario.com`
- Password: `admin123`

### Usuario Regular
- Email: `usuario@demo.com`
- Password: `demo123`

## 🗄️ Estructura del Proyecto

```
libreria_desde_front/
├── backend/                  # Backend PHP
│   ├── config/              # Configuración de BD
│   ├── controllers/         # Controladores (no usados en versión actual)
│   ├── models/              # Modelos de datos
│   │   ├── User.php
│   │   ├── Book.php
│   │   ├── Cart.php
│   │   └── Order.php
│   ├── public/              # Punto de entrada
│   │   ├── index.php        # Router principal de la API
│   │   └── .htaccess
│   ├── database/
│   │   └── schema.sql       # Esquema de la base de datos
│   └── Dockerfile
│
├── src/                     # Frontend React
│   ├── components/          # Componentes de UI
│   ├── contexts/            # Contextos de React
│   ├── services/            # Servicios API
│   │   └── api.ts          # Cliente de API REST
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Punto de entrada
│
├── docker-compose.yml       # Orquestación de servicios
├── Dockerfile              # Build del frontend
├── nginx.conf              # Configuración de nginx
└── vite.config.ts          # Configuración de Vite
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Libros
- `GET /api/books` - Listar libros
- `GET /api/books/:id` - Obtener libro
- `POST /api/books` - Crear libro
- `PUT /api/books/:id` - Actualizar libro
- `DELETE /api/books/:id` - Eliminar libro

### Carrito
- `GET /api/cart/:userId` - Obtener carrito
- `POST /api/cart` - Agregar al carrito
- `PUT /api/cart/:id` - Actualizar cantidad
- `DELETE /api/cart/:id` - Eliminar item
- `DELETE /api/cart/user/:userId` - Limpiar carrito

### Órdenes
- `GET /api/orders` - Listar órdenes (admin)
- `GET /api/orders/user/:userId` - Órdenes de usuario
- `GET /api/orders/:id` - Obtener orden
- `POST /api/orders` - Crear orden
- `PUT /api/orders/:id` - Actualizar orden
- `DELETE /api/orders/:id` - Eliminar orden

### Estadísticas
- `GET /api/stats` - Obtener estadísticas

## 🔧 Comandos Útiles

### Ver logs de los contenedores

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend
```

### Detener los servicios

```bash
docker-compose down
```

### Detener y eliminar volúmenes (CUIDADO: Borra la base de datos)

```bash
docker-compose down -v
```

### Reiniciar un servicio específico

```bash
docker-compose restart backend
docker-compose restart frontend
```

### Acceder a la consola de MySQL

```bash
docker-compose exec mysql mysql -u root -p
# Contraseña: rootpassword
```

### Ejecutar comandos en el contenedor del backend

```bash
docker-compose exec backend bash
```


## 📚 Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, shadcn/ui
- **Backend**: PHP 8.2, Apache, PDO
- **Base de Datos**: MySQL 8.0
- **Administración**: phpMyAdmin
- **Contenedores**: Docker, Docker Compose
- **Servidor Web**: nginx (frontend), Apache (backend)



## 📄 Licencia

Este proyecto es de uso educativo.
