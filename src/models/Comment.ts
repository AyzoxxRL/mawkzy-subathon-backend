import mongoose from 'mongoose';

// Enum pour les statuts de modération
export enum ModerationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Schéma pour les commentaires
const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: Object.values(ModerationStatus),
    default: ModerationStatus.PENDING
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  moderationDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Création d'un index pour les recherches textuelles
commentSchema.index({ author: 'text', message: 'text' });

export default mongoose.model('Comment', commentSchema); 