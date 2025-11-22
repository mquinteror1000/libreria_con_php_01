# El Nido Literario - Aplicación Web de Librería

Aplicación web completa con frontend en React + TypeScript, backend en PHP, base de datos MySQL y phpMyAdmin para administración. Todo desplegado con Docker.

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

Deberías ver todos los servicios en estado "Up":

```
NAME                    STATUS
libreria_mysql          Up (healthy)
libreria_phpmyadmin     Up
libreria_backend        Up
libreria_frontend       Up
```

### 4. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **phpMyAdmin**: http://localhost:8080

## 👥 Usuarios de Prueba

La base de datos se inicializa con dos usuarios:

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

## 🔄 Integración del Frontend con el Backend Real

**IMPORTANTE**: Actualmente el frontend (`src/App.tsx`) utiliza estado local en memoria y NO está conectado al backend real.

Para conectar el frontend con la API:

### Opción 1: Usar AuthContext (Recomendado)

Ya existe un archivo `src/contexts/AuthContext.tsx` preparado para usar la API. Necesitas:

1. Modificar `src/App.tsx` para usar `AuthProvider`
2. Reemplazar el estado local con llamadas a la API usando `src/services/api.ts`
3. Actualizar los componentes para usar `useAuth()` y llamar a la API

### Opción 2: Modificación Mínima

Puedes mantener la estructura actual de `App.tsx` pero reemplazar las funciones que modifican el estado para que llamen a la API:

```typescript
import { booksAPI, authAPI, cartAPI, ordersAPI } from './services/api';

// En lugar de:
const addBook = (book: Omit<Book, 'id'>) => {
  const newBook: Book = { id: books.length + 1, ...book };
  setBooks([...books, newBook]);
};

// Hacer:
const addBook = async (book: Omit<Book, 'id'>) => {
  try {
    const newBook = await booksAPI.create({
      title: book.title,
      author: book.author,
      year: book.year,
      description: book.synopsis,
      price: book.price,
      stock: book.stock,
      image_url: book.image,
      category: '',
      isbn: ''
    });
    // Actualizar el estado local con los datos del servidor
    setBooks([...books, newBook]);
  } catch (error) {
    console.error('Error creating book:', error);
  }
};
```

## 🐛 Solución de Problemas

### El frontend no se conecta al backend

1. Verificar que todos los contenedores estén corriendo:
   ```bash
   docker-compose ps
   ```

2. Verificar logs del backend:
   ```bash
   docker-compose logs backend
   ```

3. Verificar la configuración de CORS en `backend/public/index.php`

### Error de conexión a MySQL

1. Esperar a que MySQL termine de inicializar (puede tardar 30-60 segundos)
2. Verificar el health check:
   ```bash
   docker-compose ps mysql
   ```

### No se pueden crear usuarios/libros

1. Verificar que la base de datos se haya inicializado correctamente:
   ```bash
   docker-compose exec mysql mysql -u root -prootpassword -e "USE libreria_db; SHOW TABLES;"
   ```

2. Si no hay tablas, reinicializar:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

## 📊 phpMyAdmin

Para administrar la base de datos visualmente:

1. Ir a http://localhost:8080
2. Ingresar credenciales:
   - Servidor: `mysql`
   - Usuario: `root`
   - Contraseña: `rootpassword`
3. Seleccionar la base de datos `libreria_db`

Desde aquí puedes:
- Ver todas las tablas
- Ejecutar queries SQL
- Modificar datos
- Ver la estructura de las tablas
- Exportar/importar datos

## 🔐 Seguridad

**IMPORTANTE**: Esta configuración es para desarrollo local. Para producción:

1. Cambiar las contraseñas en `docker-compose.yml`
2. Usar variables de entorno para secretos
3. Configurar HTTPS
4. Restringir CORS a dominios específicos
5. Implementar autenticación con JWT o sesiones
6. Validar y sanitizar todas las entradas

## 📝 Notas Adicionales

- Los datos de MySQL se persisten en un volumen Docker (`mysql_data`)
- El backend está configurado con Apache y mod_rewrite
- El frontend se construye con Vite y se sirve con nginx
- CORS está habilitado para desarrollo (`Access-Control-Allow-Origin: *`)

## 🛠️ Desarrollo Local (sin Docker)

Si prefieres desarrollar sin Docker:

### Backend
```bash
cd backend
php -S localhost:8000 -t public/
```

### Frontend
```bash
npm install
npm run dev
```

## 📚 Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, shadcn/ui
- **Backend**: PHP 8.2, Apache, PDO
- **Base de Datos**: MySQL 8.0
- **Administración**: phpMyAdmin
- **Contenedores**: Docker, Docker Compose
- **Servidor Web**: nginx (frontend), Apache (backend)

## 👨‍💻 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es de uso educativo.
