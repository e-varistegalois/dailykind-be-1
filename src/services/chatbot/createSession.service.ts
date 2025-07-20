import 'dotenv/config';
import {v4 as uuidv4} from 'uuid';
import { openChatSession } from './openChatSession';
import Personality from '../../config/chatbotPersonalityEnum';
import { prisma } from '../../db/index';

export const createSessionService = async (
    userId: string,
    personality: string,
) => {
    try {
        const sessionId = uuidv4();

        const chat = openChatSession(Personality[personality as keyof typeof Personality], []); 

        if (typeof chat === 'string') {
            throw new Error("Failed to create chat session");
        }
        
        // simpan ke database
        const createdSession = await prisma.chatSession.create({
            data: {
                id: sessionId,
                userId: userId,
                personality: personality,
                history: []
            }
        });
        
        return {
            data: {
                sessionId: createdSession.id,
                userId: createdSession.userId,
                chat: chat
            }
        };
        
    } catch (err: any) {
        throw new Error(err.message);
    }
}