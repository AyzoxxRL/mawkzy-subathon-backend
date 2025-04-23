"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderateMemory = exports.likeMemory = exports.deleteMemory = exports.updateMemory = exports.createMemory = exports.getMemory = exports.getMemories = void 0;
const Memory_1 = __importDefault(require("../models/Memory"));
// Récupérer tous les souvenirs (avec filtrage optionnel)
const getMemories = async (req, res) => {
    try {
        const { search, filter, approved } = req.query;
        let query = {};
        // Filtrer par statut d'approbation si spécifié
        if (approved !== undefined) {
            query.approved = approved === 'true';
        }
        else {
            // Par défaut, ne renvoyer que les souvenirs approuvés pour les utilisateurs normaux
            query.approved = true;
        }
        // Recherche textuelle
        if (search) {
            query.$text = { $search: search };
        }
        // Récupérer les souvenirs
        let memories = await Memory_1.default.find(query);
        // Appliquer le tri
        if (filter === 'recent') {
            memories.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
        else if (filter === 'popular') {
            memories.sort((a, b) => b.likes - a.likes);
        }
        else {
            // Tri par défaut (récent)
            memories.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
        res.json(memories);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des souvenirs', error });
    }
};
exports.getMemories = getMemories;
// Récupérer un souvenir spécifique
const getMemory = async (req, res) => {
    try {
        const memory = await Memory_1.default.findById(req.params.id);
        if (!memory) {
            return res.status(404).json({ message: 'Souvenir non trouvé' });
        }
        res.json(memory);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du souvenir', error });
    }
};
exports.getMemory = getMemory;
// Créer un nouveau souvenir
const createMemory = async (req, res) => {
    try {
        const { author, message, clipUrl } = req.body;
        if (!author || !message) {
            return res.status(400).json({ message: 'Auteur et message sont requis' });
        }
        // Extraire clipId depuis clipUrl si disponible
        let clipId = '';
        if (clipUrl) {
            const regex = /(?:clips\.twitch\.tv\/|twitch\.tv\/\w+\/clip\/)([a-zA-Z0-9-_]+)/;
            const match = clipUrl.match(regex);
            clipId = match ? match[1] : '';
        }
        const newMemory = new Memory_1.default({
            author,
            message,
            clipUrl,
            clipId,
            timestamp: new Date(),
            likes: 0,
            approved: false // Par défaut, les souvenirs nécessitent une approbation
        });
        const savedMemory = await newMemory.save();
        res.status(201).json(savedMemory);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du souvenir', error });
    }
};
exports.createMemory = createMemory;
// Mettre à jour un souvenir
const updateMemory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const memory = await Memory_1.default.findById(id);
        if (!memory) {
            return res.status(404).json({ message: 'Souvenir non trouvé' });
        }
        const updatedMemory = await Memory_1.default.findByIdAndUpdate(id, updates, { new: true });
        res.json(updatedMemory);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du souvenir', error });
    }
};
exports.updateMemory = updateMemory;
// Supprimer un souvenir
const deleteMemory = async (req, res) => {
    try {
        const { id } = req.params;
        const memory = await Memory_1.default.findById(id);
        if (!memory) {
            return res.status(404).json({ message: 'Souvenir non trouvé' });
        }
        await Memory_1.default.findByIdAndDelete(id);
        res.json({ message: 'Souvenir supprimé avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du souvenir', error });
    }
};
exports.deleteMemory = deleteMemory;
// Augmenter le nombre de likes d'un souvenir
const likeMemory = async (req, res) => {
    try {
        const { id } = req.params;
        const memory = await Memory_1.default.findById(id);
        if (!memory) {
            return res.status(404).json({ message: 'Souvenir non trouvé' });
        }
        memory.likes += 1;
        const updatedMemory = await memory.save();
        res.json(updatedMemory);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout d\'un like', error });
    }
};
exports.likeMemory = likeMemory;
// Approuver ou rejeter un souvenir (modération)
const moderateMemory = async (req, res) => {
    try {
        const { id } = req.params;
        const { approved } = req.body;
        if (approved === undefined) {
            return res.status(400).json({ message: 'Le statut d\'approbation est requis' });
        }
        const memory = await Memory_1.default.findById(id);
        if (!memory) {
            return res.status(404).json({ message: 'Souvenir non trouvé' });
        }
        memory.approved = approved;
        const updatedMemory = await memory.save();
        res.json(updatedMemory);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modération du souvenir', error });
    }
};
exports.moderateMemory = moderateMemory;
//# sourceMappingURL=memoryController.js.map