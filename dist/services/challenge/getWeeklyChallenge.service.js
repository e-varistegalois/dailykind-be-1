"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveChallengeService = void 0;
const challenge_repositories_1 = require("../../repositories/challenge/challenge.repositories");
const getActiveChallengeService = async () => {
    try {
        const activeChallenge = await (0, challenge_repositories_1.getActiveChallengeRepository)();
        return {
            challenge: activeChallenge,
            message: activeChallenge
                ? 'Active weekly challenge found'
                : 'No active weekly challenge'
        };
    }
    catch (error) {
        console.error('Error getting active challenge:', error);
        throw new Error('Failed to get active challenge');
    }
};
exports.getActiveChallengeService = getActiveChallengeService;
