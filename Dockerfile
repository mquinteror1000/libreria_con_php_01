# Stage 1: Build de la aplicación React con Vite
FROM node:18-alpine AS builder

WORKDIR /app

# Argumento para la URL de la API
ARG VITE_API_URL=http://localhost:8000

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Build de la aplicación con la URL de la API
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Servir con nginx
FROM nginx:alpine

# Copiar los archivos buildeados desde el stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
