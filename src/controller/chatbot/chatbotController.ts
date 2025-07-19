import { createChatSession } from './createChatSession';
import { sendMessage } from './sendMessage';
import { getUserSessions } from './getUserSessions';
import { deleteSession } from './deleteSession';
import { getSession } from './getSession';

export const ChatbotController = {
    createChatSession,
    sendMessage,
    getUserSessions,
    deleteSession,
    getSession
};