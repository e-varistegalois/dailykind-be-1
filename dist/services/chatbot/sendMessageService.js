"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageService = void 0;
require("dotenv/config");
const sendMessageService = async (chat, message) => {
    try {
        const response = await chat.sendMessage({
            message: message.trim()
        });
        return response.text;
    }
    catch (err) {
        return "Error: " + err.message;
    }
};
exports.sendMessageService = sendMessageService;
