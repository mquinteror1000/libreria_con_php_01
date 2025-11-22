#!/bin/bash

echo "🚀 Iniciando El Nido Literario..."
echo ""

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker no está instalado"
    echo "Por favor instala Docker desde https://www.docker.com/get-started"
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! docker compose version &> /dev/null; then
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Error: Docker Compose no está instalado"
        echo "Por favor instala Docker Compose"
        exit 1
    fi
    COMPOSE_CMD="docker-compose"
else
    COMPOSE_CMD="docker compose"
fi

echo "✅ Docker y Docker Compose detectados"
echo ""

# Detener contenedores previos si existen
echo "🛑 Deteniendo contenedores previos (si existen)..."
$COMPOSE_CMD down

echo ""
echo "🏗️  Construyendo y levantando contenedores..."
$COMPOSE_CMD up -d --build

echo ""
echo "⏳ Esperando a que MySQL se inicialice..."
sleep 10

echo ""
echo "✅ ¡Aplicación iniciada exitosamente!"
echo ""
echo "📱 Accede a la aplicación en:"
echo "   - Frontend:    http://localhost:3000"
echo "   - Backend API: http://localhost:8000/api"
echo "   - phpMyAdmin:  http://localhost:8080"
echo ""
echo "👥 Usuarios de prueba:"
echo "   Admin:   admin@nidoliterario.com / admin123"
echo "   Usuario: usuario@demo.com / demo123"
echo ""
echo "📊 Para ver los logs:"
echo "   docker compose logs -f"
echo ""
echo "🛑 Para detener la aplicación:"
echo "   docker compose down"
echo ""
