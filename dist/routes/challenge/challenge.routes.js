"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/challengeRoutes.ts
const express_1 = require("express");
const challenge_controller_1 = require("../../controller/challenge/challenge.controller");
const router = (0, express_1.Router)();
router.get('/', challenge_controller_1.handleGetWeeklyChallenge);
exports.default = router;
