import express from 'express';
import * as commentController from '../controllers/commentController';

const router = express.Router();

// Routes publiques
router.get('/', commentController.getComments);
router.get('/stats', commentController.getCommentStats);
router.get('/:id', commentController.getComment);
router.post('/', commentController.createComment);

// Routes d'administration (ajouter middleware d'authentification en production)
router.put('/:id/approve', commentController.approveComment);
router.put('/:id/reject', commentController.rejectComment);
router.delete('/:id', commentController.deleteComment);

export default router; 