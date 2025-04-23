"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const memoryRoutes_1 = __importDefault(require("./routes/memoryRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const protectedMemoryRoutes_1 = __importDefault(require("./routes/protectedMemoryRoutes"));
const protectedCommentRoutes_1 = __importDefault(require("./routes/protectedCommentRoutes"));
// Chargement des variables d'environnement
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mawkzy-memorybook';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
// Configuration CORS
app.use((0, cors_1.default)({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
}));
// Routes publiques
app.use('/api/memories', memoryRoutes_1.default);
app.use('/api/comments', commentRoutes_1.default);
// Routes protégées pour l'administration
app.use('/api/admin/memories', protectedMemoryRoutes_1.default);
app.use('/api/admin/comments', protectedCommentRoutes_1.default);
// Route de base pour vérifier que l'API fonctionne
app.get('/', (_req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API Mawkzy Subathon MemoryBook',
        status: 'OK',
        endpoints: {
            memories: '/api/memories',
            comments: '/api/comments',
            admin: {
                memories: '/api/admin/memories',
                comments: '/api/admin/comments'
            }
        }
    });
});
// Middleware pour gérer les routes non trouvées
app.use((_req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});
// Middleware pour gérer les erreurs
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Une erreur s\'est produite sur le serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne'
    });
});
// Connexion à MongoDB et démarrage du serveur
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log('✅ Connecté à MongoDB');
    app.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('❌ Erreur de connexion à MongoDB', err);
    process.exit(1);
});
// Gestion de l'arrêt propre du serveur
process.on('SIGINT', async () => {
    await mongoose_1.default.connection.close();
    console.log('👋 Connexion MongoDB fermée');
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=server.js.map