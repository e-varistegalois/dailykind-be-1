"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChallenge = void 0;
require("dotenv/config");
const genai_1 = require("@google/genai");
const generateChallenge = async () => {
    try {
        const ai = new genai_1.GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
        const config = {
            temperature: 1,
            thinkingConfig: {
                thinkingBudget: 0,
            },
            safetySettings: [
                {
                    category: genai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: genai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, // Block some
                },
                {
                    category: genai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: genai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, // Block some
                },
                {
                    category: genai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: genai_1.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE, // Block most
                },
                {
                    category: genai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: genai_1.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE, // Block most
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
                tools: [{ codeExecution: {} }],
            },
        });
        return response.text;
    }
    catch (err) {
        return "Error: " + err.message;
    }
};
exports.generateChallenge = generateChallenge;
