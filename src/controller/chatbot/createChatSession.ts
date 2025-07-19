import { Request, Response } from "express";
import { openChatSession } from '../../services/chatbot/openChatSession';
import chatbotRepository from '../../repository/chatbot/activeChatbots';
import Personality from "../../config/chatbotPersonalityEnum";
import { PrismaClient } from '@prisma/client';
import {v4 as uuidv4} from 'uuid';
const prisma = new PrismaClient();

export const createChatSession = async (req: Request, res: Response) => {
    const { userId, personality, history } = req.body;

    const sessionId = uuidv4();

    if (!sessionId || !userId || !personality || !history) {
        return res.status(400).json({ 
            message: 'Missing required fields: sessionId, userId, personality, history' 
        });
    }

    if (!Object.keys(Personality).includes(personality)) {
        return res.status(400).json({ 
            message: 'Invalid chatbot personality. Available: calm, cheerful, emo, humorous' 
        });
    }

    try {
        const existingSession = chatbotRepository.getSession(sessionId);
        if (existingSession) {
            return res.status(409).json({ 
                message: 'Chat session already exists',
                sessionId: sessionId
            });
        }

        const chat = openChatSession(Personality[personality], history);

        if (typeof chat === 'string' && chat.startsWith('Error:')) {
            return res.status(500).json({ 
                message: 'Failed to create chat session',
                error: chat 
            });
        }

        if (typeof chat !== 'string') {
            chatbotRepository.addSession(sessionId, userId, personality, chat);
        }

        // === SIMPAN KE DATABASE JIKA BELUM ADA ===
        const dbSession = await prisma.chatSession.findUnique({
            where: { id: sessionId }
        });
        if (!dbSession) {
            await prisma.chatSession.create({
                data: {
                    id: sessionId,
                    userId: userId,
                    personality: personality,
                    history: history
                }
            });
        }

        res.status(201).json({ 
            message: 'Chat session created successfully',
            sessionId: sessionId,
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
