"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSession = void 0;
const activeChatbots_1 = __importDefault(require("../../repositories/chatbot/activeChatbots"));
const client_1 = require("@prisma/client");
const deleteSession_service_1 = require("../../services/chatbot/deleteSession.service");
const prisma = new client_1.PrismaClient();
const deleteSession = async (req, res) => {
    const { sessionId } = req.params;
    if (!sessionId) {
        return res.status(400).json({
            message: 'Session ID is required'
        });
    }
    try {
        console.log(sessionId);
        const deletedSession = await (0, deleteSession_service_1.deleteSessionService)(sessionId);
        res.status(200).json({
            message: 'Chat session deleted successfully and history persisted to DB',
            sessionId: deletedSession.data.session.id,
            activeSessions: activeChatbots_1.default.getSessionCount()
        });
    }
    catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
exports.deleteSession = deleteSession;
