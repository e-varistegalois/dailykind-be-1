import { Request, Response } from "express";
import { openChatSession } from '../../services/chatbot/openChatSession';
import chatbots from '../../repository/chatbot/activeChatbots';
import Personality from "../../utils/chatbotPersonalityEnum";


export const createChatSession = (req: Request, res: Response) => {
    const { sessionId, personality, history } = req.body;

    if (!sessionId || !personality || !history) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!Object.values(Personality).includes(personality)) {
        return res.status(400).json({ message: 'Invalid chatbot personality' });
    }

    try {
        const chat = openChatSession(sessionId, personality, history);

        chatbots.push(chat);

        res.status(200).json({ message: 'Chat session created successfully', chatbots_len: chatbots.length, chat });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
