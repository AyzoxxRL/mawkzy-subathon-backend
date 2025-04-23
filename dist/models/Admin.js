"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
// Schéma pour les administrateurs
const adminSchema = new mongoose_1.default.Schema({
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
adminSchema.methods.generateApiKey = function () {
    // Création d'une clé API aléatoire (combinaison de caractères alphanumériques)
    const apiKey = crypto_1.default.randomBytes(32).toString('hex');
    // Stockage du hash de la clé API (pour plus de sécurité)
    this.apiKeyHash = crypto_1.default.createHash('sha256').update(apiKey).digest('hex');
    return apiKey;
};
// Vérifier si une clé API correspond
adminSchema.methods.verifyApiKey = function (apiKey) {
    const hash = crypto_1.default.createHash('sha256').update(apiKey).digest('hex');
    return this.apiKeyHash === hash;
};
exports.default = mongoose_1.default.model('Admin', adminSchema);
//# sourceMappingURL=Admin.js.map