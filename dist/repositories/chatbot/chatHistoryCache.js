"use strict";
// Simple in-memory cache for chat history
// key: sessionId, value: array of messages
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = getHistory;
exports.setHistory = setHistory;
exports.appendMessage = appendMessage;
exports.deleteHistory = deleteHistory;
const chatHistoryCache = new Map();
function getHistory(sessionId) {
    return chatHistoryCache.get(sessionId) || [];
}
function setHistory(sessionId, history) {
    chatHistoryCache.set(sessionId, history);
}
function appendMessage(sessionId, message) {
    const history = chatHistoryCache.get(sessionId) || [];
    history.push(message);
    chatHistoryCache.set(sessionId, history);
}
function deleteHistory(sessionId) {
    chatHistoryCache.delete(sessionId);
}
