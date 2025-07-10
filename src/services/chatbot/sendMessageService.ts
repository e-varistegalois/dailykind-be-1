import 'dotenv/config';
import { Chat } from '@google/genai';


export const sendMessageService = async (
    chat: Chat,
    message: string,
) => {
    try {
        const response = await chat.sendMessage({
            message: message.trim()
        });
        
        return response.text;
        
    } catch (err: any) {
        return "Error: " + err.message;
    }
}