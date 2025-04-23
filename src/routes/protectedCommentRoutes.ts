import express, { Request, Response, NextFunction } from 'express';
import * as commentController from '../controllers/commentController';
import requireAuth from '../middleware/authMiddleware';

const router = express.Router();

// Toutes les routes dans ce fichier sont protégées par le middleware d'authentification
router.use(requireAuth);

// Middleware pour définir le statut par défaut à 'pending'
const setDefaultStatus = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.query.status) {
    // Créer une nouvelle instance de URLSearchParams
    const searchParams = new URLSearchParams();
    
    // Ajouter tous les paramètres existants
    Object.entries(req.query).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
    
    // Ajouter le paramètre status=pending
    searchParams.append('status', 'pending');
    
    // Remplacer la chaîne de requête
    req.url = `${req.path}?${searchParams.toString()}`;
  }
  next();
};

// Routes d'administration pour les commentaires
router.get('/', setDefaultStatus, commentController.getComments);

router.put('/:id/approve', commentController.approveComment);
router.put('/:id/reject', commentController.rejectComment);
router.delete('/:id', commentController.deleteComment);

export default router; 