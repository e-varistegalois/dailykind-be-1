"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const createChallenge_service_1 = require("../services/challenge/createChallenge.service");
// Cron: Senin pukul 09:00 WIB (WIB = UTC+7 → 02:00 UTC)
//cron.schedule('0 2 * * 1', async () => {
//cron.schedule('38 14 * * 0', async () => {
node_cron_1.default.schedule('* * * * *', async () => {
    console.log('⏰ Menjalankan scheduler weekly challenge...');
    const result = await (0, createChallenge_service_1.generateWeeklyChallenge)();
    console.log('⏰ dia berhasil...');
    console.log(result);
});
