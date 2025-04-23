import { Request, Response } from 'express';
import Comment, { ModerationStatus } from '../models/Comment';

// Liste de mots interdits pour la modération automatique
const FORBIDDEN_WORDS = [
  // Insultes générales
  'connard', 'connasse', 'con', 'salope', 'pute', 'putain', 'merde', 
  'enculé', 'enculer', 'pd', 'fdp', 'fils de pute', 'bâtard', 'batard',
  'cul', 'bite', 'couille', 'nichon', 'niquer', 'nique', 'ntm',
  'tg', 'ta gueule', 'ferme ta gueule', 'ferme la', 
  
  // Insultes plus spécifiques
  'noob', 'nul', 'pourri', 'mauvais', 'débile', 'débil', 'stupide', 'idiot',
  'mongol', 'attardé', 'attardé', 'handicapé', 'retardé',
];

// Expressions régulières pour détecter les patterns plus complexes
const FORBIDDEN_PATTERNS = [
  /\b(mawkzy|tu|t'es).{0,10}(nul|mauvais|pourri|bête|débile|stupide|idiot|bad|worst|horrible|terrible)\b/i,
  /\barrête\s+de\s+(jouer|stream|faire)\b/i,
  /\bpas\s+(bon|fort|capable|doué)\b/i,
  /\b(change|arrête|stop)\s+de\s+(jeu|stream|jouer)\b/i,
  /\bdégage\b/i,
  /\bcasse[\s-]toi\b/i,
  /\bne\s+sais\s+pas\s+jouer\b/i,
  /\bjoue\s+comme\s+(de la merde|un enfant|une merde)\b/i
];

// Fonction pour vérifier le contenu inapproprié
const containsInappropriateContent = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  // Vérification des mots interdits
  for (const word of FORBIDDEN_WORDS) {
    if (lowerMessage.includes(word.toLowerCase())) {
      return true;
    }
  }
  
  // Vérification des patterns interdits
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(lowerMessage)) {
      return true;
    }
  }
  
  return false;
};

// Récupérer tous les commentaires (avec filtrage par statut)
export const getComments = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let query: any = {};
    
    // Filtrer par statut si spécifié
    if (status) {
      query.status = status;
    } else {
      // Par défaut, ne renvoyer que les commentaires approuvés pour les utilisateurs normaux
      query.status = ModerationStatus.APPROVED;
    }
    
    const comments = await Comment.find(query).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commentaires', error });
  }
};

// Récupérer un commentaire spécifique
export const getComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du commentaire', error });
  }
};

// Créer un nouveau commentaire
export const createComment = async (req: Request, res: Response) => {
  try {
    const { author, message } = req.body;
    
    if (!author || !message) {
      return res.status(400).json({ message: 'Auteur et message sont requis' });
    }
    
    // Vérifier le contenu inapproprié
    const isInappropriate = containsInappropriateContent(message);
    if (isInappropriate) {
      return res.status(400).json({ 
        message: 'Le commentaire contient du contenu inapproprié et ne peut pas être publié',
        isInappropriate: true
      });
    }
    
    const newComment = new Comment({
      author,
      message,
      status: ModerationStatus.PENDING // Par défaut, les commentaires nécessitent une approbation
    });
    
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du commentaire', error });
  }
};

// Approuver un commentaire
export const approveComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }
    
    comment.status = ModerationStatus.APPROVED;
    comment.moderationDate = new Date();
    const updatedComment = await comment.save();
    
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'approbation du commentaire', error });
  }
};

// Rejeter un commentaire
export const rejectComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }
    
    comment.status = ModerationStatus.REJECTED;
    comment.rejectionReason = rejectionReason || '';
    comment.moderationDate = new Date();
    const updatedComment = await comment.save();
    
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du rejet du commentaire', error });
  }
};

// Supprimer un commentaire
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }
    
    await Comment.findByIdAndDelete(id);
    res.json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du commentaire', error });
  }
};

// Obtenir les statistiques de commentaires
export const getCommentStats = async (_req: Request, res: Response) => {
  try {
    const total = await Comment.countDocuments();
    const pending = await Comment.countDocuments({ status: ModerationStatus.PENDING });
    const approved = await Comment.countDocuments({ status: ModerationStatus.APPROVED });
    const rejected = await Comment.countDocuments({ status: ModerationStatus.REJECTED });
    
    res.json({
      total,
      pending,
      approved,
      rejected
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error });
  }
}; 