import { createChatSession } from './createChatSession';
import { sendMessage } from './sendMessage';
import { getUserSessions } from './getUserSessions';
import { deleteSession } from './deleteSession';
import { getSessionById } from './getSessionById';

export const ChatbotController = {
    createChatSession,
    sendMessage,
    getUserSessions,
    deleteSession,
    getSessionById
};