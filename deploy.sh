#!/bin/bash

# Script de despliegue para El Nido Literario
# Uso: ./deploy.sh

set -e

echo "========================================="
echo "Desplegando El Nido Literario"
echo "========================================="

# Cargar variables de entorno
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
    echo "✓ Variables de entorno cargadas"
else
    echo "⚠️  Advertencia: .env.production no encontrado, usando valores por defecto"
fi

# Detener contenedores existentes
echo ""
echo "Deteniendo contenedores existentes..."
docker compose -f docker-compose.prod.yml down

# Construir imágenes
echo ""
echo "Construyendo imágenes Docker..."
docker compose -f docker-compose.prod.yml build --no-cache

# Iniciar servicios
echo ""
echo "Iniciando servicios..."
docker compose -f docker-compose.prod.yml up -d

# Esperar a que los servicios estén listos
echo ""
echo "Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado
echo ""
echo "Estado de los contenedores:"
docker compose -f docker-compose.prod.yml ps

echo ""
echo "========================================="
echo "✓ Despliegue completado exitosamente!"
echo "========================================="
echo ""
echo "Servicios disponibles en:"
echo "  - Frontend: http://${SERVER_IP}:${FRONTEND_PORT:-80}"
echo "  - Backend API: http://${SERVER_IP}:${BACKEND_PORT:-8000}"
echo "  - phpMyAdmin: http://${SERVER_IP}:${PHPMYADMIN_PORT:-8080}"
echo ""
echo "Para ver los logs:"
echo "  docker compose -f docker-compose.prod.yml logs -f"
echo ""
