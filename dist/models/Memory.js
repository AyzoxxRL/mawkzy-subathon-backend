"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Schéma pour les souvenirs
const memorySchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model('Memory', memorySchema);
//# sourceMappingURL=Memory.js.map