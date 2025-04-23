"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const memoryController = __importStar(require("../controllers/memoryController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
// Toutes les routes dans ce fichier sont protégées par le middleware d'authentification
router.use(authMiddleware_1.default);
// Middleware pour définir la valeur par défaut pour le paramètre 'approved'
const setDefaultApproved = (req, _res, next) => {
    if (!req.query.approved) {
        // Créer une nouvelle instance de URLSearchParams
        const searchParams = new URLSearchParams();
        // Ajouter tous les paramètres existants
        Object.entries(req.query).forEach(([key, value]) => {
            if (value)
                searchParams.append(key, value.toString());
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
exports.default = router;
//# sourceMappingURL=protectedMemoryRoutes.js.map