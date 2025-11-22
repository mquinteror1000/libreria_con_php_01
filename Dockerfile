# Stage 1: Build de la aplicación React con Vite
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Stage 2: Servir con nginx
FROM nginx:alpine

# Copiar los archivos buildeados desde el stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
