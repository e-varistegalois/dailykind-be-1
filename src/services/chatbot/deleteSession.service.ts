import 'dotenv/config';
import { prisma } from '../../db/index';
import { getHistory, deleteHistory } from '../../repositories/chatbot/chatHistoryCache';
import chatbotRepository from '../../repositories/chatbot/activeChatbots';

export const deleteSessionService = async (
    sessionId: string
) => {
    try {
        const session = chatbotRepository.getSession(sessionId);
        if (session) {
            // Persist history from cache to DB
            const history = getHistory(sessionId);
            await prisma.chatSession.update({
                where: { id: sessionId },
                data: { history }
            }); 

            // Remove session from repository and cache
            chatbotRepository.removeSession(sessionId);
            deleteHistory(sessionId);
            return {
                data: {
                    session: { id: sessionId, status: 'session cleaned up from cache' }
                }
            };
        }
        
        // delete from db
        const deletedSession = await prisma.chatSession.delete({
            where: { id: sessionId },
        });
        
        return {
            data: {
                session: deletedSession
            }
        };
        
    } catch (err: any) {
        throw new Error(err.message);
    }
}