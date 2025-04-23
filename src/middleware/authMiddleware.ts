import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'mawkzy-admin-2024';

interface AuthRequest extends Request {
  admin?: boolean;
}

/**
 * Middleware qui vérifie si la requête contient une clé API valide
 * @param req - La requête Express
 * @param res - La réponse Express
 * @param next - La fonction suivante dans la chaîne
 */
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Récupérer la clé API depuis les en-têtes
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      return res.status(401).json({ 
        message: 'Accès non autorisé. Clé API manquante.' 
      });
    }
    
    // Vérifier si la clé API correspond
    if (apiKey !== ADMIN_API_KEY) {
      return res.status(403).json({ 
        message: 'Accès refusé. Clé API invalide.' 
      });
    }
    
    // Si la clé est valide, marquer la requête comme admin
    req.admin = true;
    next();
  } catch (error) {
    return res.status(500).json({ 
      message: 'Erreur lors de l\'authentification.',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

export default requireAuth; 