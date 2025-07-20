import { Request, Response } from "express";
import chatbotRepository from '../../repositories/chatbot/activeChatbots';
import { PrismaClient } from '@prisma/client';
import { deleteSessionService } from "../../services/chatbot/deleteSession.service";
const prisma = new PrismaClient();

export const deleteSession = async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        return res.status(400).json({ 
            message: 'Session ID is required' 
        });
    }

    try {
        console.log(sessionId);
        const deletedSession = await deleteSessionService(sessionId);

        res.status(200).json({
            message: 'Chat session deleted successfully and history persisted to DB',
            sessionId: deletedSession.data.session.id,
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