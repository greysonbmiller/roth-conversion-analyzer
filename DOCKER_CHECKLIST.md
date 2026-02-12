# Docker Deployment Checklist

## ✅ Files Created

### Root Directory
- [x] `docker-compose.yml` - Development orchestration
- [x] `docker-compose.prod.yml` - Production orchestration
- [x] `.dockerignore` - Root ignore file
- [x] `.env.example` - Environment variables template
- [x] `DEPLOYMENT.md` - Complete deployment guide
- [x] `DOCKER.md` - Quick reference
- [x] `DOCKER_SETUP_SUMMARY.md` - Setup overview
- [x] `DOCKER_CHECKLIST.md` - This file

### Backend Directory
- [x] `backend/Dockerfile` - Backend container config
- [x] `backend/.dockerignore` - Backend ignore file

### Frontend Directory
- [x] `frontend/Dockerfile` - Frontend container config
- [x] `frontend/.dockerignore` - Frontend ignore file
- [x] `frontend/nginx.conf` - Nginx configuration

### Updated Files
- [x] `frontend/src/api.js` - Environment-aware API URLs
- [x] `backend/main.py` - Updated CORS configuration
- [x] `README.md` - Added Docker documentation
- [x] `.gitignore` - Added Docker ignores

## 🧪 Testing Locally

Before deploying to VPS, test the Docker setup locally:

```bash
# 1. Build containers
docker compose up -d --build

# 2. Check if containers are running
docker compose ps

# 3. View logs
docker compose logs -f

# 4. Test the application
# Open http://localhost in your browser

# 5. Test backend health
curl http://localhost:8000/api/health

# 6. Stop containers
docker compose down
```

## 📋 Pre-Deployment Checklist

Before deploying to VPS:

- [ ] Test Docker setup locally (see above)
- [ ] Commit Docker files to git
- [ ] Push to GitHub repository
- [ ] Ensure VPS has Docker installed
- [ ] Ensure VPS firewall allows ports 80, 443, 22
- [ ] (Optional) Purchase and configure domain name
- [ ] (Optional) Set up DNS records pointing to VPS IP

## 🚀 Deployment Steps

### 1. Prepare VPS

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. Deploy Application

```bash
# Clone repository
git clone https://github.com/greysonbmiller/roth-conversion-analyzer.git
cd roth-conversion-analyzer

# Build and start
docker compose -f docker-compose.prod.yml up -d --build

# Verify
docker compose -f docker-compose.prod.yml ps
```

### 3. Configure Firewall

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 4. Test Deployment

```bash
# Check health
curl http://your-vps-ip/api/health

# View in browser
# Open http://your-vps-ip
```

## 🔒 SSL/HTTPS Setup (Optional but Recommended)

### Using Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install -y certbot

# Stop containers temporarily
docker compose -f docker-compose.prod.yml down

# Get certificates
sudo certbot certonly --standalone -d your-domain.com

# Update nginx.conf with SSL configuration
# (See DEPLOYMENT.md for details)

# Restart containers
docker compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoring

### Check Status
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
docker stats
```

### Health Checks
```bash
# Backend
curl http://localhost:8000/api/health

# Frontend
curl http://localhost/
```

## 🔄 Updating Application

```bash
# Pull latest changes
git pull origin master

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build

# Clean up old images
docker image prune -f
```

## 🐛 Troubleshooting

### Containers won't start
```bash
# Check logs
docker compose -f docker-compose.prod.yml logs

# Check specific service
docker compose -f docker-compose.prod.yml logs backend
```

### Port conflicts
```bash
# Check what's using port 80
sudo lsof -i :80
sudo netstat -tulpn | grep :80
```

### Out of disk space
```bash
# Clean up Docker resources
docker system prune -a --volumes
```

### Application not accessible
```bash
# Check firewall
sudo ufw status

# Check if containers are running
docker compose -f docker-compose.prod.yml ps

# Check nginx logs
docker compose -f docker-compose.prod.yml logs frontend
```

## 📝 Post-Deployment Tasks

- [ ] Test all application features
- [ ] Set up automated backups (if needed)
- [ ] Configure monitoring/alerting
- [ ] Set up log rotation
- [ ] Document custom configurations
- [ ] Test SSL certificate auto-renewal (if using Let's Encrypt)
- [ ] Set up a staging environment (optional)
- [ ] Configure CDN (optional, for better performance)

## 🎯 Success Criteria

Your deployment is successful if:

- ✅ Both containers are running (`docker compose ps` shows "Up")
- ✅ Application is accessible via browser
- ✅ Backend API responds to health check
- ✅ Form submission works correctly
- ✅ Results are displayed properly
- ✅ No errors in container logs

## 📚 Resources

- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment guide
- [DOCKER.md](DOCKER.md) - Docker quick reference
- [DOCKER_SETUP_SUMMARY.md](DOCKER_SETUP_SUMMARY.md) - Architecture overview
- [README.md](README.md) - General documentation

## 🆘 Getting Help

If you encounter issues:

1. Check container logs: `docker compose logs`
2. Review [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
3. Verify all files are present and unchanged
4. Ensure VPS meets minimum requirements (1GB RAM, 1 CPU)
5. Check VPS provider documentation

---

**Ready to deploy? Start with local testing, then follow the deployment steps above!**
