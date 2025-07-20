import 'dotenv/config';
import {
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/genai';


export const generateChallenge = async () => {
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
                {}
            ],
        };
        
        const model = 'gemini-2.5-flash';

        const response = await ai.models.generateContent({
            model: model,
            contents: `Berikan satu challenge mingguan yang bisa dilakukan oleh user untuk menyebarkan kebaikan. Buatlah challenge tersebut dengan menggunakan bahasa Indonesia. Pastikan challenge tersebut mudah dipahami dan dapat dilakukan oleh kebanyakan orang
            Berikan dengan format seperti ini:
            Tantangan: ...
            Penjelasan: ...`,
            config: {
                tools: [{codeExecution: {}}],
            },
        });
        
        return response.text;
        
    } catch (err: any) {
        return "Error: " + err.message;
    }
}