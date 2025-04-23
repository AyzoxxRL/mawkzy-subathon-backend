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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentStats = exports.deleteComment = exports.rejectComment = exports.approveComment = exports.createComment = exports.getComment = exports.getComments = void 0;
const Comment_1 = __importStar(require("../models/Comment"));
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
const containsInappropriateContent = (message) => {
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
const getComments = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        // Filtrer par statut si spécifié
        if (status) {
            query.status = status;
        }
        else {
            // Par défaut, ne renvoyer que les commentaires approuvés pour les utilisateurs normaux
            query.status = Comment_1.ModerationStatus.APPROVED;
        }
        const comments = await Comment_1.default.find(query).sort({ createdAt: -1 });
        res.json(comments);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des commentaires', error });
    }
};
exports.getComments = getComments;
// Récupérer un commentaire spécifique
const getComment = async (req, res) => {
    try {
        const comment = await Comment_1.default.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Commentaire non trouvé' });
        }
        res.json(comment);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du commentaire', error });
    }
};
exports.getComment = getComment;
// Créer un nouveau commentaire
const createComment = async (req, res) => {
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
        const newComment = new Comment_1.default({
            author,
            message,
            status: Comment_1.ModerationStatus.PENDING // Par défaut, les commentaires nécessitent une approbation
        });
        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du commentaire', error });
    }
};
exports.createComment = createComment;
// Approuver un commentaire
const approveComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment_1.default.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Commentaire non trouvé' });
        }
        comment.status = Comment_1.ModerationStatus.APPROVED;
        comment.moderationDate = new Date();
        const updatedComment = await comment.save();
        res.json(updatedComment);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'approbation du commentaire', error });
    }
};
exports.approveComment = approveComment;
// Rejeter un commentaire
const rejectComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;
        const comment = await Comment_1.default.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Commentaire non trouvé' });
        }
        comment.status = Comment_1.ModerationStatus.REJECTED;
        comment.rejectionReason = rejectionReason || '';
        comment.moderationDate = new Date();
        const updatedComment = await comment.save();
        res.json(updatedComment);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors du rejet du commentaire', error });
    }
};
exports.rejectComment = rejectComment;
// Supprimer un commentaire
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment_1.default.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Commentaire non trouvé' });
        }
        await Comment_1.default.findByIdAndDelete(id);
        res.json({ message: 'Commentaire supprimé avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du commentaire', error });
    }
};
exports.deleteComment = deleteComment;
// Obtenir les statistiques de commentaires
const getCommentStats = async (_req, res) => {
    try {
        const total = await Comment_1.default.countDocuments();
        const pending = await Comment_1.default.countDocuments({ status: Comment_1.ModerationStatus.PENDING });
        const approved = await Comment_1.default.countDocuments({ status: Comment_1.ModerationStatus.APPROVED });
        const rejected = await Comment_1.default.countDocuments({ status: Comment_1.ModerationStatus.REJECTED });
        res.json({
            total,
            pending,
            approved,
            rejected
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error });
    }
};
exports.getCommentStats = getCommentStats;
//# sourceMappingURL=commentController.js.map