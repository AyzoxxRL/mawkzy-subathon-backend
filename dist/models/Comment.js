"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Enum pour les statuts de modération
var ModerationStatus;
(function (ModerationStatus) {
    ModerationStatus["PENDING"] = "pending";
    ModerationStatus["APPROVED"] = "approved";
    ModerationStatus["REJECTED"] = "rejected";
})(ModerationStatus || (exports.ModerationStatus = ModerationStatus = {}));
// Schéma pour les commentaires
const commentSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model('Comment', commentSchema);
//# sourceMappingURL=Comment.js.map