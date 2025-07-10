import { Request, Response } from "express";
import { sendMessageService } from '../../services/chatbot/sendMessageService';
import chatbots from '../../repository/chatbot/activeChatbots';

export const sendMessage = async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message required' });
    }

    try {
        const chat = chatbots[0];
        console.log(chat);

        const response = await sendMessageService(chat, message);

        res.status(200).json({ response: response });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
