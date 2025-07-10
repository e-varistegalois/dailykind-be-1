import express from 'express';
import { ChatbotController } from '../../controller/chatbot/ChatbotController';

const router = express.Router();

router.post('/', ChatbotController.createChatSession);
router.post('/send-message', ChatbotController.sendMessage);

export default router;
