"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openChatSession = void 0;
require("dotenv/config");
const chatbotPersonalityInstruction_json_1 = __importDefault(require("../../config/chatbotPersonalityInstruction.json"));
const genai_1 = require("@google/genai");
const openChatSession = (personality, history) => {
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
                {
                    text: chatbotPersonalityInstruction_json_1.default[personality]['instruction'],
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
    }
    catch (err) {
        return "Error: " + err.message;
    }
};
exports.openChatSession = openChatSession;
