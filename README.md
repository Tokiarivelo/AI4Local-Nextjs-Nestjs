# AI4Local - Plateforme Marketing et Micro-commerce pour PME

## Vue d'ensemble

AI4Local est une plateforme MVP (Minimum Viable Product) conçue pour permettre aux petites et moyennes entreprises (PME) de créer des campagnes marketing, générer du contenu AI (annonces, publications, SMS), gérer leurs clients et produits, proposer de l'e-learning pour leur personnel, accepter des paiements mobiles locaux et recevoir des analyses - le tout optimisé pour les contextes à faible bande passante et mobile-first.

## Architecture

Le projet utilise une architecture monorepo avec les composants suivants :

- **Frontend** (`apps/frontend`): Application React avec Vite, Tailwind CSS et shadcn/ui
- **API Backend** (`apps/api`): API Flask avec SQLite (évolutif vers PostgreSQL)
- **Service AI** (`services/ai`): Microservice FastAPI pour la génération de contenu et l'IA
- **Base de données**: PostgreSQL pour les données principales, Redis pour les tâches, Weaviate pour les vecteurs

## Démarrage Rapide

### Prérequis

- Docker et Docker Compose
- Node.js 20+ (pour le développement local)
- Python 3.11+ (pour le développement local)

### Installation et Démarrage

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd ai4local
   ```

2. **Démarrer avec Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Accéder aux services**
   - Frontend: http://localhost:3000
   - API Backend: http://localhost:5000
   - Service AI: http://localhost:8000
   - Base de données Weaviate: http://localhost:8080

### Développement Local (sans Docker)

#### Frontend
```bash
cd apps/frontend
pnpm install
pnpm run dev
```

#### API Backend
```bash
cd apps/api
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

#### Service AI
```bash
cd services/ai
pip install -r requirements.txt
uvicorn main:app --reload
```

## Structure du Projet

```
ai4local/
├── apps/
│   ├── frontend/          # Application React
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── Dockerfile
│   └── api/               # API Flask
│       ├── src/
│       ├── requirements.txt
│       └── Dockerfile
├── services/
│   └── ai/                # Service AI FastAPI
│       ├── main.py
│       ├── requirements.txt
│       └── Dockerfile
├── shared/                # Code partagé (à développer)
├── docker-compose.yml
└── README.md
```

## Fonctionnalités MVP

### ✅ Implémentées
- [x] Structure monorepo avec Docker Compose
- [x] Service AI avec endpoints de base (génération de texte, embeddings, recherche sémantique)
- [x] Configuration Docker pour tous les services
- [x] Base de données PostgreSQL, Redis et Weaviate

### 🚧 En cours de développement
- [ ] Authentification et modèle multi-tenant
- [ ] Interface utilisateur React
- [ ] API CRUD pour clients et produits
- [ ] Constructeur de campagnes
- [ ] Intégration des paiements mobiles
- [ ] Système LMS
- [ ] Analytics et rapports

## API Endpoints

### Service AI (Port 8000)
- `GET /` - Status du service
- `GET /health` - Vérification de santé
- `POST /generate-text` - Génération de texte
- `POST /embed` - Création d'embeddings
- `POST /semantic-search` - Recherche sémantique

### API Backend (Port 5000)
- `GET /` - Status de l'API
- `POST /api/auth/signup` - Inscription utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/orgs/:id/customers` - Liste des clients
- `POST /api/orgs/:id/campaigns` - Création de campagne

## Base de Données

### Modèles Principaux
- **Organization**: Organisations/entreprises
- **User**: Utilisateurs avec rôles (Admin, Owner, Employee)
- **Customer**: Clients des entreprises
- **Product**: Produits/services
- **Campaign**: Campagnes marketing
- **Course**: Cours de formation
- **Payment**: Transactions de paiement

## Sécurité

- TLS/HTTPS pour tous les endpoints externes
- Authentification JWT
- Contrôle d'accès basé sur les rôles (RBAC)
- Limitation de débit sur les APIs
- Gestion sécurisée des secrets

## Tests

```bash
# Tests unitaires
npm test                    # Frontend
python -m pytest          # Backend

# Tests E2E
npm run test:e2e           # Avec Playwright
```

## Déploiement

### Staging/Production avec Kubernetes
```bash
# Utiliser les Helm charts (à développer)
helm install ai4local ./helm/ai4local
```

### Déploiement simple avec Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## Roadmap

### Milestone 1 - Infrastructure ✅
- [x] Monorepo et Docker Compose
- [x] Services de base

### Milestone 2 - Authentification (En cours)
- [ ] NextAuth.js intégration
- [ ] Modèle multi-tenant
- [ ] Interface d'onboarding

### Milestone 3 - CRUD de base
- [ ] Gestion des clients
- [ ] Gestion des produits
- [ ] Import CSV

### Milestone 4 - Campagnes
- [ ] Constructeur de campagnes
- [ ] Génération de contenu AI
- [ ] Planification

### Milestone 5 - AI et RAG
- [ ] Intégration Hugging Face
- [ ] Base de données vectorielle
- [ ] Recherche sémantique

### Milestone 6 - LMS et Offline
- [ ] Système de cours
- [ ] Synchronisation offline
- [ ] Progressive Web App

### Milestone 7 - Paiements
- [ ] Mvola, Airtel Money, Orange Money
- [ ] Webhooks
- [ ] Facturation

### Milestone 8 - Production
- [ ] Monitoring (Sentry, Prometheus, Grafana)
- [ ] Tests complets
- [ ] Helm charts

## Support

Pour toute question ou problème, veuillez créer une issue sur le repository GitHub.

## Licence

[À définir]

