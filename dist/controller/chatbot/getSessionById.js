"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionById = void 0;
const client_1 = require("@prisma/client");
const chatHistoryCache_1 = require("../../repositories/chatbot/chatHistoryCache");
const prisma = new client_1.PrismaClient();
const getSessionById = async (req, res) => {
    const { sessionId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    if (!sessionId) {
        return res.status(400).json({
            message: 'Session ID is required'
        });
    }
    try {
        // Ambil history dari cache
        let history = (0, chatHistoryCache_1.getHistory)(sessionId);
        let source = 'cache';
        // Jika cache kosong, fallback ke DB
        if (!history || history.length === 0) {
            const session = await prisma.chatSession.findUnique({
                where: { id: sessionId }
            });
            if (!session) {
                return res.status(404).json({
                    message: 'Chat session not found',
                    sessionId: sessionId
                });
            }
            history = Array.isArray(session.history) ? session.history : [];
            source = 'db';
        }
        // Pagination
        const start = Math.max(history.length - offset - limit, 0);
        const end = history.length - offset;
        const pagedHistory = history.slice(start, end);
        console.log(`History diambil dari: ${source}, jumlah pesan: ${history.length}`);
        res.status(200).json({
            sessionId,
            history: pagedHistory,
            totalMessages: history.length
        });
    }
    catch (error) {
        console.error('Error getting session:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
exports.getSessionById = getSessionById;
