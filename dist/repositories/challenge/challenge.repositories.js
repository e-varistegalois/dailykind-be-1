"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveChallengeRepository = exports.inactivateChallenge = exports.createChallenge = exports.findChallengeById = exports.findChallengeByTimestamp = void 0;
const index_1 = require("../../db/index");
const findChallengeByTimestamp = async (timestamp) => {
    return index_1.prisma.challenge.findFirst({
        where: { timestamp },
    });
};
exports.findChallengeByTimestamp = findChallengeByTimestamp;
const findChallengeById = async (id) => {
    return index_1.prisma.challenge.findUnique({
        where: { id },
    });
};
exports.findChallengeById = findChallengeById;
const createChallenge = async (content, timestamp) => {
    return index_1.prisma.challenge.create({
        data: {
            content,
            timestamp,
        },
    });
};
exports.createChallenge = createChallenge;
const inactivateChallenge = async (id) => {
    return index_1.prisma.challenge.update({
        where: { id },
        data: { isActive: false },
    });
};
exports.inactivateChallenge = inactivateChallenge;
const getActiveChallengeRepository = async () => {
    return await index_1.prisma.challenge.findFirst({
        where: {
            isActive: true
        },
        orderBy: {
            timestamp: 'desc' // Ambil yang terbaru jika ada beberapa active
        }
    });
};
exports.getActiveChallengeRepository = getActiveChallengeRepository;
