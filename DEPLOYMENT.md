# Guía de Despliegue - El Nido Literario

## Servidor de Producción
- **IP**: 129.158.220.244
- **Sistema Operativo**: Linux (recomendado Ubuntu/Debian)

## Requisitos Previos en el Servidor

### 1. Instalar Docker y Docker Compose

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo apt install docker-compose-plugin -y

# Verificar instalación
docker --version
docker compose version
```

### 2. Configurar Firewall

```bash
# Permitir puertos necesarios
sudo ufw allow 80/tcp    # Frontend
sudo ufw allow 8000/tcp  # Backend API
sudo ufw allow 8080/tcp  # phpMyAdmin
sudo ufw allow 22/tcp    # SSH
sudo ufw enable
```

## Proceso de Despliegue

### Opción 1: Despliegue Automático (Recomendado)

1. **Transferir archivos al servidor:**

```bash
# Desde tu máquina local
scp -r /home/mquinteror/Documents/libreria_desde_front user@129.158.220.244:/home/user/
```

2. **Conectarse al servidor:**

```bash
ssh user@129.158.220.244
cd /home/user/libreria_desde_front
```

3. **Ejecutar script de despliegue:**

```bash
./deploy.sh
```

### Opción 2: Despliegue Manual

1. **Construir y ejecutar:**

```bash
# Cargar variables de entorno
export $(cat .env.production | grep -v '^#' | xargs)

# Construir imágenes
docker compose -f docker-compose.prod.yml build

# Iniciar servicios
docker compose -f docker-compose.prod.yml up -d
```

## Verificación del Despliegue

### Verificar contenedores en ejecución:

```bash
docker compose -f docker-compose.prod.yml ps
```

Todos los servicios deben mostrar estado "Up".

### Verificar logs:

```bash
# Ver todos los logs
docker compose -f docker-compose.prod.yml logs -f

# Ver logs de un servicio específico
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f mysql
```

### Probar endpoints:

```bash
# Desde el servidor
curl http://localhost:80                    # Frontend
curl http://localhost:8000/api/books        # Backend API
curl http://localhost:8080                  # phpMyAdmin

# Desde fuera del servidor
curl http://129.158.220.244:80
curl http://129.158.220.244:8000/api/books
```

## Acceso a la Aplicación

- **Frontend**: http://129.158.220.244
- **Backend API**: http://129.158.220.244:8000
- **phpMyAdmin**: http://129.158.220.244:8080

### Credenciales de Prueba:

- **Admin**: admin@nidoliterario.com / admin123
- **Usuario**: usuario@demo.com / demo123

## Comandos Útiles

### Reiniciar servicios:

```bash
docker compose -f docker-compose.prod.yml restart
```

### Detener servicios:

```bash
docker compose -f docker-compose.prod.yml stop
```

### Ver uso de recursos:

```bash
docker stats
```

### Acceder a la base de datos:

```bash
docker compose -f docker-compose.prod.yml exec mysql mysql -u root -prootpassword libreria_db
```

### Backup de la base de datos:

```bash
docker compose -f docker-compose.prod.yml exec -T mysql mysqldump -u root -prootpassword libreria_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurar backup:

```bash
docker compose -f docker-compose.prod.yml exec -T mysql mysql -u root -prootpassword libreria_db < backup_YYYYMMDD_HHMMSS.sql
```

## Actualizar la Aplicación

1. **Obtener cambios del repositorio:**

```bash
git pull origin pedidos
```

2. **Reconstruir y reiniciar:**

```bash
./deploy.sh
```

O manualmente:

```bash
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Si un contenedor no inicia:

```bash
# Ver logs detallados
docker compose -f docker-compose.prod.yml logs [servicio]

# Reiniciar contenedor específico
docker compose -f docker-compose.prod.yml restart [servicio]
```

### Si hay problemas de conexión:

1. Verificar firewall:
   ```bash
   sudo ufw status
   ```

2. Verificar que los contenedores estén en la misma red:
   ```bash
   docker network ls
   docker network inspect libreria_desde_front_libreria_network
   ```

3. Verificar puertos en uso:
   ```bash
   sudo netstat -tulpn | grep -E '80|8000|8080|3306'
   ```

### Limpiar recursos Docker:

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no usadas
docker image prune

# Eliminar volúmenes no usados (¡CUIDADO! Borra datos)
docker volume prune
```

## Seguridad Adicional (Recomendado)

### 1. Cambiar contraseñas por defecto:

Editar `.env.production` y cambiar:
- `DB_PASSWORD`
- Credenciales de usuarios en la base de datos

### 2. Configurar HTTPS con SSL/TLS:

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado (requiere dominio)
sudo certbot --nginx -d tudominio.com
```

### 3. Limitar acceso a phpMyAdmin:

Considerar usar un túnel SSH o VPN para acceder a phpMyAdmin en lugar de exponerlo públicamente.

## Monitoreo

### Configurar alertas de recursos:

```bash
# Instalar herramientas de monitoreo
sudo apt install htop

# Ver uso de recursos
htop
docker stats
```

## Soporte

Para más información consultar:
- Documentación de Docker: https://docs.docker.com/
- Repositorio del proyecto: https://github.com/mquinteror1000/libreria_con_php_01
