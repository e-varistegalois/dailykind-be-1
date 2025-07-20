"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inactivateChallengeService = void 0;
const challenge_repositories_1 = require("../../repositories/challenge/challenge.repositories");
const inactivateChallengeService = async (challengeId) => {
    if (!challengeId) {
        const error = new Error("challengeId is required");
        error.status = 400;
        throw error;
    }
    const result = await (0, challenge_repositories_1.inactivateChallenge)(challengeId);
    return result;
};
exports.inactivateChallengeService = inactivateChallengeService;
