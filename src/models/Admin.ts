import mongoose from 'mongoose';
import crypto from 'crypto';

// Schéma pour les administrateurs
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  apiKeyHash: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Générer une nouvelle clé API
adminSchema.methods.generateApiKey = function(): string {
  // Création d'une clé API aléatoire (combinaison de caractères alphanumériques)
  const apiKey = crypto.randomBytes(32).toString('hex');
  
  // Stockage du hash de la clé API (pour plus de sécurité)
  this.apiKeyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  
  return apiKey;
};

// Vérifier si une clé API correspond
adminSchema.methods.verifyApiKey = function(apiKey: string): boolean {
  const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
  return this.apiKeyHash === hash;
};

export default mongoose.model('Admin', adminSchema); 