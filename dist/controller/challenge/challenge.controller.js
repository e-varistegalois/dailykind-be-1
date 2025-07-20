"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetWeeklyChallenge = exports.handleGenerateWeeklyChallenge = void 0;
const createChallenge_service_1 = require("../../services/challenge/createChallenge.service");
const getWeeklyChallenge_service_1 = require("../../services/challenge/getWeeklyChallenge.service");
const handleGenerateWeeklyChallenge = async (req, res) => {
    try {
        const result = await (0, createChallenge_service_1.generateWeeklyChallenge)();
        res.status(result.created ? 201 : 200).json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Gagal membuat challenge mingguan' });
    }
};
exports.handleGenerateWeeklyChallenge = handleGenerateWeeklyChallenge;
const handleGetWeeklyChallenge = async (req, res) => {
    try {
        const result = await (0, getWeeklyChallenge_service_1.getActiveChallengeService)();
        if (!result.challenge) {
            return res.status(404).json({
                message: 'No active weekly challenge found',
                challenge: null
            });
        }
        res.status(200).json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Gagal mengambil challenge mingguan' });
    }
};
exports.handleGetWeeklyChallenge = handleGetWeeklyChallenge;
