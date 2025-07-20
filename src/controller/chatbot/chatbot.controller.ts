import { createChatSession } from './createChatSession.controller';
import { sendMessage } from './sendMessage';
import { getUserSessions } from './getUserSessions';
import { deleteSession } from './deleteSession.controller';
import { getSessionById } from './getSessionById';

export const ChatbotController = {
    createChatSession,
    sendMessage,
    getUserSessions,
    deleteSession,
    getSessionById
};