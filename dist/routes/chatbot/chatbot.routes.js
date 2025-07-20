"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatbot_controller_1 = require("../../controller/chatbot/chatbot.controller");
const router = express_1.default.Router();
// Basic routes - test these first
router.post('/', chatbot_controller_1.ChatbotController.createChatSession);
router.post('/send-message', chatbot_controller_1.ChatbotController.sendMessage);
// Comment out session routes temporarily to isolate the error
router.get('/sessions/user/:userId', chatbot_controller_1.ChatbotController.getUserSessions);
router.get('/sessions/session/:sessionId', chatbot_controller_1.ChatbotController.getSessionById);
router.delete('/sessions/session/:sessionId', chatbot_controller_1.ChatbotController.deleteSession);
exports.default = router;
