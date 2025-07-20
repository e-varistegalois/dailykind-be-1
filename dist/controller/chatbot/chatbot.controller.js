"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotController = void 0;
const createChatSession_controller_1 = require("./createChatSession.controller");
const sendMessage_1 = require("./sendMessage");
const getUserSessions_1 = require("./getUserSessions");
const deleteSession_controller_1 = require("./deleteSession.controller");
const getSessionById_1 = require("./getSessionById");
exports.ChatbotController = {
    createChatSession: createChatSession_controller_1.createChatSession,
    sendMessage: sendMessage_1.sendMessage,
    getUserSessions: getUserSessions_1.getUserSessions,
    deleteSession: deleteSession_controller_1.deleteSession,
    getSessionById: getSessionById_1.getSessionById
};
