# Docker Quick Reference

## Local Development

### Start the application
```bash
docker compose up -d
```

### View logs
```bash
docker compose logs -f
```

### Stop the application
```bash
docker compose down
```

### Rebuild after code changes
```bash
docker compose up -d --build
```

## Production Deployment

### Start the application
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### View logs
```bash
docker compose -f docker-compose.prod.yml logs -f
```

### Stop the application
```bash
docker compose -f docker-compose.prod.yml down
```

### Update after code changes
```bash
git pull origin master
docker compose -f docker-compose.prod.yml up -d --build
docker image prune -f
```

## Health Checks

### Backend
```bash
curl http://localhost:8000/api/health
```

### Frontend
```bash
curl http://localhost/
```

## Access Container Shell

### Backend
```bash
docker compose exec backend bash
```

### Frontend
```bash
docker compose exec frontend sh
```

## Clean Up

### Remove all stopped containers
```bash
docker container prune
```

### Remove unused images
```bash
docker image prune -a
```

### Remove unused volumes
```bash
docker volume prune
```

### Remove everything (careful!)
```bash
docker system prune -a --volumes
```
