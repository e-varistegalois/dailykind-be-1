import { Request, Response } from "express";
import chatbotRepository from '../../repository/chatbot/activeChatbots';

export const getUserSessions = (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ 
            message: 'User ID is required' 
        });
    }

    try {
        const sessions = chatbotRepository.getUserSessions(userId);
        
        res.status(200).json({
            userId: userId,
            sessions: sessions.map(session => ({
                sessionId: session.id,
                personality: session.personality,
                createdAt: session.createdAt,
                lastActivity: session.lastActivity
            })),
            totalSessions: sessions.length
        });

    } catch (error: any) {
        console.error('Error getting user sessions:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
} 