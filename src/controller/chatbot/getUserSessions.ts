import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { getHistory } from '../../repositories/chatbot/chatHistoryCache';
const prisma = new PrismaClient();

export const getUserSessions = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const sessions = await prisma.chatSession.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        const result = sessions.map(session => {
            // Cek cache dulu
            let history: any[] = getHistory(session.id);
            if (!history || history.length === 0) {
                // Fallback ke DB
                history = Array.isArray(session.history) ? session.history : [];
            }
            // Ambil 1-2 pesan pertama untuk displayChat
            const preview = history.slice(0, 2).map(h => h.content).join(' | ');
            return {
                sessionId: session.id,
                displayChat: preview || 'Belum ada chat',
                createdAt: session.createdAt,
                personality: session.personality
            };
        });

        res.status(200).json(result);

    } catch (error: any) {
        console.error('Error getting user sessions:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
} 