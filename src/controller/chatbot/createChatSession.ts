import { Request, Response } from "express";
import { createSessionService } from "../../services/chatbot/createSessionService";
import chatbotRepository from '../../repository/chatbot/activeChatbots';
import Personality from "../../config/chatbotPersonalityEnum";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createChatSession = async (req: Request, res: Response) => {
    const { userId, personality} = req.body;

    if (!userId || !personality) {
        return res.status(400).json({ 
            message: 'Missing required fields: sessionId, userId, personality, history' 
        });
    }

    if (!Object.keys(Personality).includes(personality)) {
        return res.status(400).json({ 
            message: 'Invalid chatbot personality. Available: Calm, Cheerful, Emo, Humorous' 
        });
    }

    try {
        const createdSession = await createSessionService(userId, personality);

        // Add session to in-memory repository
        chatbotRepository.addSession(createdSession.data.sessionId, userId, personality, createdSession.data.chat);

        res.status(201).json({ 
            message: 'Chat session created successfully',
            sessionId: createdSession.data.sessionId,
            personality: personality,
            activeSessions: chatbotRepository.getSessionCount()
        });

    } catch (error: any) {
        console.error('Error creating chat session:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
}
