# Roth IRA Conversion Analyzer - Deployment Guide

This guide will help you deploy the Roth IRA Conversion Analyzer on a VPS using Docker.

## Prerequisites

- A VPS with Ubuntu 20.04+ (or similar Linux distribution)
- Docker and Docker Compose installed
- A domain name (optional, but recommended)
- SSH access to your VPS

## Quick Start

### 1. Install Docker on Your VPS

```bash
# Update package index
sudo apt-get update

# Install required packages
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add your user to docker group (optional, to run docker without sudo)
sudo usermod -aG docker $USER
```

### 2. Clone or Upload Your Project

```bash
# Option A: Clone from GitHub
git clone https://github.com/greysonbmiller/roth-conversion-analyzer.git
cd roth-conversion-analyzer

# Option B: Upload files via SCP
# On your local machine:
scp -r /path/to/project user@your-vps-ip:/home/user/roth-analyzer
```

### 3. Build and Run with Docker Compose

For **production deployment**:

```bash
# Build and start containers in detached mode
docker compose -f docker-compose.prod.yml up -d --build

# Check if containers are running
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

For **development**:

```bash
docker compose up -d --build
```

### 4. Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH (if not already allowed)
sudo ufw enable
```

### 5. Access Your Application

Open your browser and navigate to:
- `http://your-vps-ip` or `http://your-domain.com`

## SSL/TLS Configuration (HTTPS)

To enable HTTPS, you'll need to set up SSL certificates. Here's how to do it with Let's Encrypt:

### Install Certbot

```bash
sudo apt-get install -y certbot
```

### Option 1: Use Certbot Standalone (Requires stopping the app temporarily)

```bash
# Stop the application
docker compose -f docker-compose.prod.yml down

# Get certificates
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Certificates will be saved to /etc/letsencrypt/live/your-domain.com/
```

### Option 2: Use Nginx Reverse Proxy (Recommended)

Update `frontend/nginx.conf` to include SSL configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # ... rest of your nginx config
}
```

Then mount the certificates in `docker-compose.prod.yml`:

```yaml
  frontend:
    # ... other config
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
```

## Useful Docker Commands

### View Running Containers
```bash
docker compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
```

### Restart Services
```bash
docker compose -f docker-compose.prod.yml restart
```

### Stop Services
```bash
docker compose -f docker-compose.prod.yml stop
```

### Stop and Remove Containers
```bash
docker compose -f docker-compose.prod.yml down
```

### Rebuild After Code Changes
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Execute Commands in Running Container
```bash
# Backend
docker compose -f docker-compose.prod.yml exec backend bash

# Frontend
docker compose -f docker-compose.prod.yml exec frontend sh
```

## Updating the Application

When you have new code changes:

```bash
# Pull latest changes (if using git)
git pull origin master

# Rebuild and restart containers
docker compose -f docker-compose.prod.yml up -d --build

# Clean up old images (optional)
docker image prune -f
```

## Monitoring and Maintenance

### Check Container Health
```bash
docker compose -f docker-compose.prod.yml ps
docker inspect --format='{{.State.Health.Status}}' roth-analyzer-backend
docker inspect --format='{{.State.Health.Status}}' roth-analyzer-frontend
```

### Monitor Resource Usage
```bash
docker stats
```

### Backup Data
If you add a database in the future, create regular backups:

```bash
# Create backup directory
mkdir -p ~/backups

# Backup (example for future database)
# docker compose -f docker-compose.prod.yml exec -T database pg_dump -U user dbname > ~/backups/backup-$(date +%Y%m%d-%H%M%S).sql
```

### Auto-restart on Reboot
Docker containers with `restart: always` will automatically start when the system reboots.

## Troubleshooting

### Container Won't Start
```bash
# Check logs for errors
docker compose -f docker-compose.prod.yml logs backend
docker compose -f docker-compose.prod.yml logs frontend

# Check container status
docker compose -f docker-compose.prod.yml ps -a
```

### Port Already in Use
```bash
# Find what's using port 80
sudo lsof -i :80

# Stop the service or change the port in docker-compose.prod.yml
```

### Out of Disk Space
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove stopped containers
docker container prune
```

### Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Restart Docker daemon
sudo systemctl restart docker
```

## Production Best Practices

1. **Use Environment Variables**: Store sensitive data in environment variables, not in code
2. **Enable Logging**: Set up log rotation to prevent disk space issues
3. **Monitor Resources**: Use tools like Prometheus + Grafana for monitoring
4. **Automated Backups**: Set up cron jobs for regular backups
5. **Security Updates**: Keep your VPS and Docker images updated
6. **Use HTTPS**: Always use SSL/TLS in production
7. **Rate Limiting**: Consider adding rate limiting to your API
8. **CDN**: Use a CDN like Cloudflare for better performance and DDoS protection

## Architecture Overview

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────┐
│   Nginx (Frontend)          │
│   - Serves React app        │
│   - Proxies /api to backend │
│   - Port 80/443             │
└──────────┬──────────────────┘
           │
           ↓
    ┌──────────────┐
    │   Backend    │
    │   FastAPI    │
    │   Port 8000  │
    └──────────────┘
```

## Support

For issues or questions, please refer to the main README.md or open an issue on GitHub.
