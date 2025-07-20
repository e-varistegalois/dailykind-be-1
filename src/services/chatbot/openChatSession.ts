import 'dotenv/config';
import Personality from '../../config/chatbotPersonalityEnum';
import instructions from '../../config/chatbotPersonalityInstruction.json';
import {
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/genai';


export const openChatSession = (
    personality: Personality,
    history: Record<string, any>[],
) => {
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const config = {
            temperature: 1,
            thinkingConfig: {
                thinkingBudget: 0,
            },
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,  // Block some
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,  // Block some
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  // Block most
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  // Block most
                },
            ],

            responseMimeType: 'text/plain',
            systemInstruction: [
                {
                    text: instructions[personality as keyof typeof instructions]['instruction'],
                }
            ],
        };
        
        const model = 'gemini-2.5-flash';
        const contents = history;

        const chat = ai.chats.create({
            model: model,
            config: config,
            history: contents,
        });
        
        return chat;
        
    } catch (err: any) {
        return "Error: " + err.message;
    }
}