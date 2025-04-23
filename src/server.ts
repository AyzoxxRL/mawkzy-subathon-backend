import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import memoryRoutes from './routes/memoryRoutes';
import commentRoutes from './routes/commentRoutes';
import protectedMemoryRoutes from './routes/protectedMemoryRoutes';
import protectedCommentRoutes from './routes/protectedCommentRoutes';

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mawkzy-memorybook';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Configuration CORS
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
}));

// Routes publiques
app.use('/api/memories', memoryRoutes);
app.use('/api/comments', commentRoutes);

// Routes protégées pour l'administration
app.use('/api/admin/memories', protectedMemoryRoutes);
app.use('/api/admin/comments', protectedCommentRoutes);

// Route de base pour vérifier que l'API fonctionne
app.get('/', (_req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Mawkzy Subathon MemoryBook',
    status: 'OK',
    endpoints: {
      memories: '/api/memories',
      comments: '/api/comments',
      admin: {
        memories: '/api/admin/memories',
        comments: '/api/admin/comments'
      }
    }
  });
});

// Middleware pour gérer les routes non trouvées
app.use((_req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware pour gérer les erreurs
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Une erreur s\'est produite sur le serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne'
  });
});

// Connexion à MongoDB et démarrage du serveur
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB');
    startServer();
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion à MongoDB', err);
    console.warn('⚠️ Démarrage du serveur sans MongoDB - Certaines fonctionnalités ne seront pas disponibles');
    startServer();
  });

function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  });
}

// Gestion de l'arrêt propre du serveur
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 Connexion MongoDB fermée');
  process.exit(0);
});

export default app; 