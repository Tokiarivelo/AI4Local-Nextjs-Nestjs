# Guide de Déploiement AI4Local

## 🚀 Déploiement de Production

### Prérequis
- Docker et Docker Compose
- Node.js 18+ et npm/pnpm
- Python 3.11+
- Domaine configuré avec SSL

### 1. Configuration de l'environnement

```bash
# Cloner le projet
git clone <repository-url>
cd ai4local

# Copier les variables d'environnement
cp .env.example .env
```

### 2. Configuration des variables d'environnement

Créer un fichier `.env` à la racine :

```env
# Base de données
DATABASE_URL=postgresql://user:password@postgres:5432/ai4local
REDIS_URL=redis://redis:6379

# Services AI
OPENAI_API_KEY=your_openai_api_key
AI_SERVICE_URL=http://ai-service:8000

# Sécurité
SECRET_KEY=your_super_secret_key_here
JWT_SECRET=your_jwt_secret_key

# Services externes
MVOLA_API_KEY=your_mvola_api_key
AIRTEL_MONEY_API_KEY=your_airtel_api_key
ORANGE_MONEY_API_KEY=your_orange_api_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Frontend
REACT_APP_API_URL=https://api.yourdomain.com
```

### 3. Déploiement avec Docker Compose

```bash
# Construction et démarrage des services
docker-compose -f docker-compose.prod.yml up -d

# Vérification des logs
docker-compose logs -f
```

### 4. Configuration Nginx (Reverse Proxy)

```nginx
# /etc/nginx/sites-available/ai4local
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Service AI (optionnel, peut rester interne)
    location /ai-service/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5. Configuration de la base de données

```bash
# Connexion au conteneur PostgreSQL
docker exec -it ai4local_postgres_1 psql -U postgres -d ai4local

# Création des tables (automatique au démarrage de l'API)
# Vérification
\dt
```

### 6. Monitoring et Logs

```bash
# Logs en temps réel
docker-compose logs -f api
docker-compose logs -f ai-service
docker-compose logs -f frontend

# Monitoring des ressources
docker stats

# Sauvegarde de la base de données
docker exec ai4local_postgres_1 pg_dump -U postgres ai4local > backup_$(date +%Y%m%d).sql
```

## 🔧 Déploiement de Développement

### Démarrage rapide

```bash
# Installation des dépendances
cd apps/frontend && npm install
cd ../api && pip install -r requirements.txt
cd ../../services/ai && pip install -r requirements.txt

# Démarrage des services
# Terminal 1: Service AI
cd services/ai && python main.py

# Terminal 2: API Backend
cd apps/api && python src/main.py

# Terminal 3: Frontend
cd apps/frontend && npm run dev
```

### URLs de développement
- Frontend: http://localhost:5173
- API Backend: http://localhost:5000
- Service AI: http://localhost:8000
- Documentation API: http://localhost:8000/docs

## 📊 Tests et Validation

### Tests automatisés
```bash
# Tests d'intégration
python test_api.py

# Tests unitaires (à implémenter)
cd apps/api && python -m pytest tests/
cd services/ai && python -m pytest tests/
```

### Validation manuelle
1. Inscription d'un utilisateur
2. Création d'un client
3. Création d'une campagne
4. Génération de contenu IA
5. Test des paiements mobiles

## 🔐 Sécurité

### Checklist de sécurité
- [ ] HTTPS activé avec certificats valides
- [ ] Variables d'environnement sécurisées
- [ ] Authentification JWT configurée
- [ ] Rate limiting activé
- [ ] Logs de sécurité configurés
- [ ] Sauvegarde automatique de la DB
- [ ] Monitoring des erreurs

### Configuration du firewall
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 📱 Intégrations Mobiles Money

### Configuration Mvola
```python
# Dans .env
MVOLA_API_KEY=your_mvola_api_key
MVOLA_MERCHANT_ID=your_merchant_id
MVOLA_CALLBACK_URL=https://yourdomain.com/api/payments/mvola/callback
```

### Configuration Airtel Money
```python
# Dans .env
AIRTEL_API_KEY=your_airtel_api_key
AIRTEL_MERCHANT_ID=your_merchant_id
AIRTEL_CALLBACK_URL=https://yourdomain.com/api/payments/airtel/callback
```

## 🚨 Dépannage

### Problèmes courants

1. **Service AI non accessible**
   ```bash
   docker-compose restart ai-service
   docker-compose logs ai-service
   ```

2. **Base de données non connectée**
   ```bash
   docker-compose restart postgres
   # Vérifier les logs
   docker-compose logs postgres
   ```

3. **Frontend ne charge pas**
   ```bash
   # Reconstruire le frontend
   cd apps/frontend
   npm run build
   ```

4. **Erreurs d'authentification**
   ```bash
   # Vérifier la configuration JWT
   echo $JWT_SECRET
   # Régénérer les tokens si nécessaire
   ```

### Logs utiles
```bash
# Logs applicatifs
tail -f /var/log/ai4local/app.log

# Logs Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Logs système
journalctl -u ai4local -f
```

## 📈 Mise à l'échelle

### Optimisations de performance
1. **Cache Redis** pour les sessions et données fréquentes
2. **CDN** pour les assets statiques
3. **Load balancer** pour multiple instances
4. **Database indexing** pour les requêtes fréquentes

### Monitoring recommandé
- **Prometheus + Grafana** pour les métriques
- **ELK Stack** pour les logs centralisés
- **Uptime monitoring** avec Pingdom/UptimeRobot
- **Error tracking** avec Sentry

## 🔄 Mise à jour

### Processus de mise à jour
```bash
# Sauvegarde
docker exec ai4local_postgres_1 pg_dump -U postgres ai4local > backup_pre_update.sql

# Mise à jour du code
git pull origin main

# Reconstruction des images
docker-compose build

# Redémarrage avec zéro downtime
docker-compose up -d --no-deps api
docker-compose up -d --no-deps frontend
docker-compose up -d --no-deps ai-service
```

## 📞 Support

Pour toute question ou problème :
- Documentation: https://docs.ai4local.mg
- Support: support@ai4local.mg
- Issues GitHub: https://github.com/ai4local/issues

