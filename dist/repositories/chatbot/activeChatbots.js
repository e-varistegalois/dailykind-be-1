"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const chatHistoryCache_1 = require("./chatHistoryCache");
const prisma = new client_1.PrismaClient();
class ChatbotRepository {
    sessions = new Map();
    // Add new chat session
    addSession(sessionId, userId, personality, chat) {
        const session = {
            id: sessionId,
            userId,
            personality,
            chat,
            createdAt: new Date(),
            lastActivity: new Date()
        };
        this.sessions.set(sessionId, session);
        console.log(`Chat session created: ${sessionId} with personality: ${personality}`);
    }
    // Get chat session by ID
    getSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.lastActivity = new Date();
        }
        return session;
    }
    // Get all sessions for a user
    getUserSessions(userId) {
        return Array.from(this.sessions.values())
            .filter(session => session.userId === userId);
    }
    // Remove session
    removeSession(sessionId) {
        return this.sessions.delete(sessionId);
    }
    // Cleanup inactive sessions (older than 1 hour)
    async cleanupInactiveSessions() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        // const oneHourAgo = new Date(Date.now() - 60 * 1000);
        let removedCount = 0;
        for (const [sessionId, session] of this.sessions.entries()) {
            if (session.lastActivity < oneHourAgo) {
                // Persist history to DB before removing
                const history = (0, chatHistoryCache_1.getHistory)(sessionId);
                try {
                    await prisma.chatSession.update({
                        where: { id: sessionId },
                        data: { history }
                    });
                }
                catch (err) {
                    console.error(`Failed to persist history for session ${sessionId}:`, err);
                }
                this.sessions.delete(sessionId);
                (0, chatHistoryCache_1.deleteHistory)(sessionId);
                removedCount++;
            }
        }
        if (removedCount > 0) {
            console.log(`Cleaned up ${removedCount} inactive sessions (persisted to DB)`);
        }
        return removedCount;
    }
    // Get session count
    getSessionCount() {
        return this.sessions.size;
    }
    // Get all sessions (for debugging)
    getAllSessions() {
        return Array.from(this.sessions.values());
    }
}
// Create singleton instance
const chatbotRepository = new ChatbotRepository();
// Cleanup inactive sessions every 30 minutes
setInterval(() => {
    chatbotRepository.cleanupInactiveSessions();
}, 30 * 60 * 1000);
//}, 60 * 1000);
exports.default = chatbotRepository;
