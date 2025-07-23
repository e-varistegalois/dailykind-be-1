import express from 'express';
import { getUserStreakController } from '../../controller/user/getUserStreak.controller';

const router = express.Router();

router.get('/:userId/streak', getUserStreakController);

export default router;