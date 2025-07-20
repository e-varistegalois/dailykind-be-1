// Simple in-memory cache for chat history
// key: sessionId, value: array of messages

const chatHistoryCache = new Map();

export function getHistory(sessionId: string) {
  return chatHistoryCache.get(sessionId) || [];
}

export function setHistory(sessionId: string, history: any[]) {
  chatHistoryCache.set(sessionId, history);
}

export function appendMessage(sessionId: string, message: any) {
  const history = chatHistoryCache.get(sessionId) || [];
  history.push(message);
  chatHistoryCache.set(sessionId, history);
}

export function deleteHistory(sessionId: string) {
  chatHistoryCache.delete(sessionId);
} 