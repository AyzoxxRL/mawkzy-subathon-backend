"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'mawkzy-admin-2024';
/**
 * Middleware qui vérifie si la requête contient une clé API valide
 * @param req - La requête Express
 * @param res - La réponse Express
 * @param next - La fonction suivante dans la chaîne
 */
const requireAuth = (req, res, next) => {
    try {
        // Récupérer la clé API depuis les en-têtes
        const apiKey = req.headers['x-api-key'];
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
    }
    catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de l\'authentification.',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
exports.requireAuth = requireAuth;
exports.default = exports.requireAuth;
//# sourceMappingURL=authMiddleware.js.map