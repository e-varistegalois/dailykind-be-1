"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSessionService = void 0;
require("dotenv/config");
const index_1 = require("../../db/index");
const chatHistoryCache_1 = require("../../repositories/chatbot/chatHistoryCache");
const activeChatbots_1 = __importDefault(require("../../repositories/chatbot/activeChatbots"));
const deleteSessionService = async (sessionId) => {
    try {
        const session = activeChatbots_1.default.getSession(sessionId);
        if (session) {
            // Persist history from cache to DB
            const history = (0, chatHistoryCache_1.getHistory)(sessionId);
            await index_1.prisma.chatSession.update({
                where: { id: sessionId },
                data: { history }
            });
            // Remove session from repository and cache
            activeChatbots_1.default.removeSession(sessionId);
            (0, chatHistoryCache_1.deleteHistory)(sessionId);
            return {
                data: {
                    session: { id: sessionId, status: 'session cleaned up from cache' }
                }
            };
        }
        // delete from db
        const deletedSession = await index_1.prisma.chatSession.delete({
            where: { id: sessionId },
        });
        return {
            data: {
                session: deletedSession
            }
        };
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.deleteSessionService = deleteSessionService;
