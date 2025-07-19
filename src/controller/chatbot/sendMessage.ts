import { Request, Response } from "express";
import { sendMessageService } from '../../services/chatbot/sendMessageService';
import chatbotRepository from '../../repository/chatbot/activeChatbots';
import { appendMessage, getHistory } from '../../repository/chatbot/chatHistoryCache';
import { PrismaClient } from '@prisma/client';
import Personality from '../../config/chatbotPersonalityEnum';
import { openChatSession } from '../../services/chatbot/openChatSession';

const prisma = new PrismaClient();

export const sendMessage = async (req: Request, res: Response) => {
    const { sessionId, message } = req.body;

    // Validate required fields
    if (!sessionId || !message) {
        return res.status(400).json({ 
            message: 'Missing required fields: sessionId, message' 
        });
    }

    try {
        let session = chatbotRepository.getSession(sessionId);

        // Jika session tidak ada di memory, coba re-open dari database
        if (!session) {
            const dbSession = await prisma.chatSession.findUnique({ where: { id: sessionId } });
            if (!dbSession) {
                return res.status(404).json({ 
                    message: 'Chat session not found',
                    sessionId: sessionId
                });
            }
            // Buat ulang session di memory
            let chatHistory: Record<string, any>[] = Array.isArray(dbSession.history) ? dbSession.history as Record<string, any>[] : [];
            const chat = openChatSession(
                Personality[dbSession.personality],
                chatHistory
            );
            if (typeof chat !== 'string') {
                chatbotRepository.addSession(dbSession.id, dbSession.userId, dbSession.personality, chat);
                session = chatbotRepository.getSession(sessionId);
            } else {
                return res.status(500).json({ message: 'Failed to re-open chat session', error: chat });
            }
        }

        if (!session) {
            return res.status(500).json({ message: 'Failed to get or re-open chat session', sessionId });
        }

        // Append user message to cache
        appendMessage(sessionId, { role: 'user', content: message });

        // Send message to AI
        const response = await sendMessageService(session.chat, message);

        appendMessage(sessionId, { role: 'model', content: response });

        res.status(200).json({ 
            response: response,
            sessionId: sessionId,
            personality: session.personality,
            history: getHistory(sessionId) // Optionally return current history
        });

    } catch (error: any) {
        console.error('Error sending message:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
}
