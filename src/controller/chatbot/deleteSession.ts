import { Request, Response } from "express";
import chatbotRepository from '../../repository/chatbot/activeChatbots';
import { getHistory, deleteHistory } from '../../repository/chatbot/chatHistoryCache';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const deleteSession = async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        return res.status(400).json({ 
            message: 'Session ID is required' 
        });
    }

    try {
        const session = chatbotRepository.getSession(sessionId);
        if (!session) {
            return res.status(404).json({ 
                message: 'Chat session not found',
                sessionId: sessionId
            });
        }

        // Persist history from cache to DB
        const history = getHistory(sessionId);
        await prisma.chatSession.update({
            where: { id: sessionId },
            data: { history }
        });

        // Remove session from repository and cache
        chatbotRepository.removeSession(sessionId);
        deleteHistory(sessionId);

        res.status(200).json({
            message: 'Chat session deleted successfully and history persisted to DB',
            sessionId: sessionId,
            activeSessions: chatbotRepository.getSessionCount()
        });

    } catch (error: any) {
        console.error('Error deleting session:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
} 