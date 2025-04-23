import mongoose from 'mongoose';

// Schéma pour les souvenirs
const memorySchema = new mongoose.Schema({
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
  timestamp: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  approved: {
    type: Boolean,
    default: false
  },
  clipUrl: {
    type: String,
    trim: true
  },
  clipId: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Création d'un index pour les recherches textuelles
memorySchema.index({ author: 'text', message: 'text' });

export default mongoose.model('Memory', memorySchema); 