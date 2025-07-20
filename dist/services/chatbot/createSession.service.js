"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionService = void 0;
require("dotenv/config");
const uuid_1 = require("uuid");
const openChatSession_1 = require("./openChatSession");
const chatbotPersonalityEnum_1 = __importDefault(require("../../config/chatbotPersonalityEnum"));
const index_1 = require("../../db/index");
const createSessionService = async (userId, personality) => {
    try {
        const sessionId = (0, uuid_1.v4)();
        const chat = (0, openChatSession_1.openChatSession)(chatbotPersonalityEnum_1.default[personality], []);
        if (typeof chat === 'string') {
            throw new Error("Failed to create chat session");
        }
        // simpan ke database
        const createdSession = await index_1.prisma.chatSession.create({
            data: {
                id: sessionId,
                userId: userId,
                personality: personality,
                history: []
            }
        });
        return {
            data: {
                sessionId: createdSession.id,
                userId: createdSession.userId,
                chat: chat
            }
        };
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.createSessionService = createSessionService;
