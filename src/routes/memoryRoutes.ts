import express from 'express';
import * as memoryController from '../controllers/memoryController';

const router = express.Router();

// Routes publiques
router.get('/', memoryController.getMemories);
router.get('/:id', memoryController.getMemory);
router.post('/', memoryController.createMemory);
router.put('/:id/like', memoryController.likeMemory);

// Routes d'administration (ajouter middleware d'authentification en production)
router.put('/:id', memoryController.updateMemory);
router.delete('/:id', memoryController.deleteMemory);
router.put('/:id/moderate', memoryController.moderateMemory);

export default router; 