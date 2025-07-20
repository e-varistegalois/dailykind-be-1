"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWeeklyChallenge = void 0;
const challenge_repositories_1 = require("../../repositories/challenge/challenge.repositories");
const generateChallenge_1 = require("./generateChallenge");
const generateWeeklyChallenge = async () => {
    const now = new Date();
    const monday9am = new Date(now);
    monday9am.setUTCHours(2, 0, 0, 0); // WIB 09:00 = UTC 02:00
    monday9am.setUTCDate(monday9am.getUTCDate() - ((monday9am.getUTCDay() + 6) % 7)); // ke Senin
    const existing = await (0, challenge_repositories_1.findChallengeByTimestamp)(monday9am);
    if (existing) {
        return { created: false, message: 'Challenge minggu ini sudah ada' };
    }
    const content = await (0, generateChallenge_1.generateChallenge)() ?? '';
    const challenge = await (0, challenge_repositories_1.createChallenge)(content, monday9am);
    return { created: true, challenge: challenge };
};
exports.generateWeeklyChallenge = generateWeeklyChallenge;
