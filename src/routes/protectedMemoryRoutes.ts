import express, { Request, Response, NextFunction } from 'express';
import * as memoryController from '../controllers/memoryController';
import requireAuth from '../middleware/authMiddleware';

const router = express.Router();

// Toutes les routes dans ce fichier sont protégées par le middleware d'authentification
router.use(requireAuth);

// Middleware pour définir la valeur par défaut pour le paramètre 'approved'
const setDefaultApproved = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.query.approved) {
    // Créer une nouvelle instance de URLSearchParams
    const searchParams = new URLSearchParams();
    
    // Ajouter tous les paramètres existants
    Object.entries(req.query).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
    
    // Ajouter le paramètre approved=false
    searchParams.append('approved', 'false');
    
    // Remplacer la chaîne de requête
    req.url = `${req.path}?${searchParams.toString()}`;
  }
  next();
};

// Routes d'administration pour les souvenirs
router.get('/', setDefaultApproved, memoryController.getMemories);

router.put('/:id', memoryController.updateMemory);
router.delete('/:id', memoryController.deleteMemory);
router.put('/:id/moderate', memoryController.moderateMemory);

export default router; 