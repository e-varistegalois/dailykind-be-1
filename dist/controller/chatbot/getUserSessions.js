"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSessions = void 0;
const client_1 = require("@prisma/client");
const chatHistoryCache_1 = require("../../repositories/chatbot/chatHistoryCache");
const prisma = new client_1.PrismaClient();
const getUserSessions = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const sessions = await prisma.chatSession.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        const result = sessions.map(session => {
            // Cek cache dulu
            let history = (0, chatHistoryCache_1.getHistory)(session.id);
            if (!history || history.length === 0) {
                // Fallback ke DB
                history = Array.isArray(session.history) ? session.history : [];
            }
            // Ambil 1-2 pesan pertama untuk displayChat
            const preview = history.slice(0, 2).map(h => h.content).join(' | ');
            return {
                sessionId: session.id,
                displayChat: preview || 'Belum ada chat',
                createdAt: session.createdAt,
                personality: session.personality
            };
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error getting user sessions:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getUserSessions = getUserSessions;
