"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChatSession = void 0;
const createSession_service_1 = require("../../services/chatbot/createSession.service");
const activeChatbots_1 = __importDefault(require("../../repositories/chatbot/activeChatbots"));
const chatbotPersonalityEnum_1 = __importDefault(require("../../config/chatbotPersonalityEnum"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createChatSession = async (req, res) => {
    const { userId, personality } = req.body;
    if (!userId || !personality) {
        return res.status(400).json({
            message: 'Missing required fields: sessionId, userId, personality, history'
        });
    }
    if (!Object.keys(chatbotPersonalityEnum_1.default).includes(personality)) {
        return res.status(400).json({
            message: 'Invalid chatbot personality. Available: Calm, Cheerful, Emo, Humorous'
        });
    }
    try {
        const createdSession = await (0, createSession_service_1.createSessionService)(userId, personality);
        // Add session to in-memory repository
        activeChatbots_1.default.addSession(createdSession.data.sessionId, userId, personality, createdSession.data.chat);
        res.status(201).json({
            message: 'Chat session created successfully',
            sessionId: createdSession.data.sessionId,
            personality: personality,
            activeSessions: activeChatbots_1.default.getSessionCount()
        });
    }
    catch (error) {
        console.error('Error creating chat session:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
exports.createChatSession = createChatSession;
