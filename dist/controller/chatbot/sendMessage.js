"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const sendMessageService_1 = require("../../services/chatbot/sendMessageService");
const activeChatbots_1 = __importDefault(require("../../repositories/chatbot/activeChatbots"));
const chatHistoryCache_1 = require("../../repositories/chatbot/chatHistoryCache");
const client_1 = require("@prisma/client");
const chatbotPersonalityEnum_1 = __importDefault(require("../../config/chatbotPersonalityEnum"));
const openChatSession_1 = require("../../services/chatbot/openChatSession");
const prisma = new client_1.PrismaClient();
const sendMessage = async (req, res) => {
    const { sessionId, message } = req.body;
    // Validate required fields
    if (!sessionId || !message) {
        return res.status(400).json({
            message: 'Missing required fields: sessionId, message'
        });
    }
    try {
        let session = activeChatbots_1.default.getSession(sessionId);
        // Jika session tidak ada di memory, coba re-open dari database
        if (!session) {
            const dbSession = await prisma.chatSession.findUnique({ where: { id: sessionId } });
            if (!dbSession) {
                return res.status(404).json({
                    message: 'Chat session not found',
                    sessionId: sessionId
                });
            }
            // Buat ulang session di memory
            let chatHistory = Array.isArray(dbSession.history) ? dbSession.history : [];
            const chat = (0, openChatSession_1.openChatSession)(chatbotPersonalityEnum_1.default[dbSession.personality], chatHistory);
            if (typeof chat !== 'string') {
                activeChatbots_1.default.addSession(dbSession.id, dbSession.userId, dbSession.personality, chat);
                session = activeChatbots_1.default.getSession(sessionId);
            }
            else {
                return res.status(500).json({ message: 'Failed to re-open chat session', error: chat });
            }
        }
        if (!session) {
            return res.status(500).json({ message: 'Failed to get or re-open chat session', sessionId });
        }
        // Append user message to cache
        (0, chatHistoryCache_1.appendMessage)(sessionId, { role: 'user', content: message });
        // Send message to AI
        const response = await (0, sendMessageService_1.sendMessageService)(session.chat, message);
        (0, chatHistoryCache_1.appendMessage)(sessionId, { role: 'model', content: response });
        res.status(200).json({
            response: response,
            sessionId: sessionId,
            personality: session.personality,
            history: (0, chatHistoryCache_1.getHistory)(sessionId) // Optionally return current history
        });
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
exports.sendMessage = sendMessage;
