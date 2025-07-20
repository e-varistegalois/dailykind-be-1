"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = moderateText;
exports.getModerationFailureReasons = getModerationFailureReasons;
const axios_1 = __importDefault(require("axios"));
async function moderateText(text) {
    try {
        if (!text?.trim())
            return true;
        // Truncate jika terlalu panjang
        const cleanText = text.length > 20000 ? text.substring(0, 20000) : text;
        const res = await axios_1.default.post(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_API_KEY}`, {
            requestedAttributes: {
                TOXICITY: {},
                SEVERE_TOXICITY: {},
                IDENTITY_ATTACK: {},
                INSULT: {},
                PROFANITY: {},
                THREAT: {}
            },
            languages: ['id', 'en'],
            comment: { text: cleanText },
            doNotStore: true,
            clientToken: `moderation-${Date.now()}`
        }, { timeout: 10000, headers: { 'Content-Type': 'application/json' } });
        const scores = res.data.attributeScores;
        console.log('PERSPECTIVE API RESPONSE:', JSON.stringify(res.data, null, 2));
        // Direct safety check dengan threshold
        const isTextSafe = ((scores.TOXICITY?.summaryScore?.value || 0) <= 0.6 &&
            (scores.SEVERE_TOXICITY?.summaryScore?.value || 0) <= 0.3 &&
            (scores.IDENTITY_ATTACK?.summaryScore?.value || 0) <= 0.4 &&
            (scores.INSULT?.summaryScore?.value || 0) <= 0.7 &&
            (scores.PROFANITY?.summaryScore?.value || 0) <= 0.8 &&
            (scores.THREAT?.summaryScore?.value || 0) <= 0.2);
        console.log('Text is safe:', isTextSafe);
        if (!isTextSafe) {
            const reasons = getModerationFailureReasons(scores);
            console.log('Text rejected for:', reasons.join(', '));
        }
        return isTextSafe;
    }
    catch (error) {
        console.error('Perspective API error:', error);
        return error.response?.status === 429 ? false : true; // Reject jika quota exceeded
    }
}
function getModerationFailureReasons(scores) {
    const checks = [
        [(scores.TOXICITY?.summaryScore?.value || 0) > 0.6, 'High toxicity detected'],
        [(scores.SEVERE_TOXICITY?.summaryScore?.value || 0) > 0.3, 'Severe toxicity detected'],
        [(scores.IDENTITY_ATTACK?.summaryScore?.value || 0) > 0.4, 'Identity-based hate speech detected'],
        [(scores.INSULT?.summaryScore?.value || 0) > 0.7, 'Insulting language detected'],
        [(scores.PROFANITY?.summaryScore?.value || 0) > 0.8, 'Profane language detected'],
        [(scores.THREAT?.summaryScore?.value || 0) > 0.2, 'Threatening language detected']
    ];
    return checks.filter(([condition]) => condition).map(([, reason]) => reason);
}
