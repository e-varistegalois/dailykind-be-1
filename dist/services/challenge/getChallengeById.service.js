"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChallengeByIdService = void 0;
const challenge_repositories_1 = require("../../repositories/challenge/challenge.repositories");
const getChallengeByIdService = async (challengeId) => {
    if (!challengeId) {
        throw new Error('Error: challengeId is required');
    }
    const challenge = await (0, challenge_repositories_1.findChallengeById)(challengeId);
    return { challenge };
};
exports.getChallengeByIdService = getChallengeByIdService;
