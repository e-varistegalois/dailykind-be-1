import express from 'express';
import { ChatbotController } from '../../controller/chatbot/ChatbotController';

const router = express.Router();

// Basic routes - test these first
router.post('/', ChatbotController.createChatSession);
router.post('/send-message', ChatbotController.sendMessage);

// Comment out session routes temporarily to isolate the error
router.get('/sessions/user/:userId', ChatbotController.getUserSessions);
router.get('/sessions/session/:sessionId', ChatbotController.getSessionById);
router.delete('/sessions/session/:sessionId', ChatbotController.deleteSession);

export default router;
