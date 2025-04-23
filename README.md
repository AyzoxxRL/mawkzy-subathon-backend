# Backend pour Mawkzy Subathon MemoryBook

Ce répertoire contient l'API backend du projet Mawkzy Subathon MemoryBook, une application qui permet aux fans de partager leurs souvenirs du subathon et de laisser des commentaires.

## Fonctionnalités

- API RESTful avec Express
- Base de données MongoDB avec Mongoose
- Gestion des souvenirs (memories) avec possibilité d'ajouter des clips Twitch
- Système de commentaires avec modération
- Vérification de contenu inapproprié
- CORS configuré pour l'intégration avec le frontend

## Structure du projet

```
backend/
├── src/
│   ├── controllers/     # Contrôleurs pour gérer la logique métier
│   ├── models/          # Modèles Mongoose pour les collections MongoDB
│   ├── routes/          # Routes de l'API
│   └── server.ts        # Point d'entrée du serveur
├── package.json         # Dépendances et scripts
├── tsconfig.json        # Configuration TypeScript
└── README.md            # Ce fichier
```

## Installation

1. Assurez-vous d'avoir [Node.js](https://nodejs.org/) (v14 ou supérieur) et [MongoDB](https://www.mongodb.com/try/download/community) installés.

2. Installez les dépendances :

```bash
cd backend
npm install
```

3. Créez un fichier `.env` à la racine du dossier `backend` avec les variables suivantes :

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mawkzy-memorybook
JWT_SECRET=votre_clé_secrète_jwt
CLIENT_URL=https://votre-frontend-url.com
NODE_ENV=development
```

## Démarrage du serveur

### Mode développement

```bash
npm run dev
```

### Mode production

```bash
npm run build
npm start
```

## API Endpoints

### Souvenirs (Memories)

- `GET /api/memories` - Récupérer tous les souvenirs approuvés
- `GET /api/memories?approved=false` - Récupérer les souvenirs en attente (admin)
- `GET /api/memories/:id` - Récupérer un souvenir spécifique
- `POST /api/memories` - Créer un nouveau souvenir
- `PUT /api/memories/:id` - Mettre à jour un souvenir (admin)
- `PUT /api/memories/:id/like` - Ajouter un like à un souvenir
- `PUT /api/memories/:id/moderate` - Approuver/rejeter un souvenir (admin)
- `DELETE /api/memories/:id` - Supprimer un souvenir (admin)

### Commentaires

- `GET /api/comments` - Récupérer tous les commentaires approuvés
- `GET /api/comments?status=pending` - Récupérer commentaires en attente (admin)
- `GET /api/comments/stats` - Obtenir les statistiques de commentaires
- `GET /api/comments/:id` - Récupérer un commentaire spécifique
- `POST /api/comments` - Créer un nouveau commentaire
- `PUT /api/comments/:id/approve` - Approuver un commentaire (admin)
- `PUT /api/comments/:id/reject` - Rejeter un commentaire (admin)
- `DELETE /api/comments/:id` - Supprimer un commentaire (admin)

## Déploiement

Pour le déploiement en production, plusieurs options sont disponibles:

- Services de cloud MongoDB: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit pour commencer)
- Hébergement de l'API:
  - [Render](https://render.com/)
  - [Railway](https://railway.app/)
  - [Heroku](https://www.heroku.com/)
  - [DigitalOcean](https://www.digitalocean.com/)

## Prochaines étapes

- Ajouter un système d'authentification JWT complet pour les administrateurs
- Implémenter des tests unitaires et d'intégration
- Ajouter des webhooks pour les notifications
- Mettre en place un système de cache pour améliorer les performances 