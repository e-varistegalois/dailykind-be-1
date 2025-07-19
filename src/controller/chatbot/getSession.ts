import { Request, Response } from "express";
import chatbotRepository from '../../repository/chatbot/activeChatbots';
import { PrismaClient } from '@prisma/client';
import { getHistory } from '../../repository/chatbot/chatHistoryCache';
const prisma = new PrismaClient();

export const getSession = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is required' });
    }

    try {
        // Cek history di cache (memory)
        let history: any[] = getHistory(sessionId);
        if (!history || history.length === 0) {
            // Jika tidak ada di cache, ambil dari database
            const session = await prisma.chatSession.findUnique({
                where: { id: sessionId }
            });
            if (!session) {
                return res.status(404).json({ message: 'Chat session not found', sessionId });
            }
            history = Array.isArray(session.history) ? session.history : [];
        }

        const start = Math.max(history.length - offset - limit, 0);
        const end = history.length - offset;
        const pagedHistory = history.slice(start, end);

        res.status(200).json({
            sessionId,
            history: pagedHistory,
            totalMessages: history.length
        });

    } catch (error: any) {
        console.error('Error getting session:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
} 