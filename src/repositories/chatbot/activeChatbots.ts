import { Chat } from '@google/genai';
import { PrismaClient } from '@prisma/client';
import { getHistory, deleteHistory } from './chatHistoryCache';

const prisma = new PrismaClient();

interface ChatSession {
    id: string;
    userId: string;
    personality: string;
    chat: Chat;
    createdAt: Date;
    lastActivity: Date;
}

class ChatbotRepository {
    private sessions: Map<string, ChatSession> = new Map();
    
    // Add new chat session
    addSession(sessionId: string, userId: string, personality: string, chat: Chat): void {
        const session: ChatSession = {
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
    getSession(sessionId: string): ChatSession | undefined {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.lastActivity = new Date();
        }
        return session;
    }
    
    // Get all sessions for a user
    getUserSessions(userId: string): ChatSession[] {
        return Array.from(this.sessions.values())
            .filter(session => session.userId === userId);
    }
    
    // Remove session
    removeSession(sessionId: string): boolean {
        return this.sessions.delete(sessionId);
    }
    
    // Cleanup inactive sessions (older than 1 hour)
    async cleanupInactiveSessions(): Promise<number> {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
       // const oneHourAgo = new Date(Date.now() - 60 * 1000);
        let removedCount = 0;
        
        for (const [sessionId, session] of this.sessions.entries()) {
            if (session.lastActivity < oneHourAgo) {
                // Persist history to DB before removing
                const history = getHistory(sessionId);
                try {
                    await prisma.chatSession.update({
                        where: { id: sessionId },
                        data: { history }
                    });
                } catch (err) {
                    console.error(`Failed to persist history for session ${sessionId}:`, err);
                }
                this.sessions.delete(sessionId);
                deleteHistory(sessionId);
                removedCount++;
            }
        }
        
        if (removedCount > 0) {
            console.log(`Cleaned up ${removedCount} inactive sessions (persisted to DB)`);
        }
        
        return removedCount;
    }
    
    // Get session count
    getSessionCount(): number {
        return this.sessions.size;
    }
    
    // Get all sessions (for debugging)
    getAllSessions(): ChatSession[] {
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

export default chatbotRepository;