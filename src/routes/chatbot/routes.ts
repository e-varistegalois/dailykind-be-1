import express from 'express';
import { ChatbotController } from '../../controller/chatbot/ChatbotController';

const router = express.Router();

router.post('/', ChatbotController.createChatSession);

export default router;
