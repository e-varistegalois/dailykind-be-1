import { Request, Response } from 'express';
import { getUserStreakService } from '../../services/user/getUserStreak.service';

export const getUserStreakController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required'
      });
    }

    const result = await getUserStreakService(userId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in getUserStreakController:', error);
    res.status(500).json({
      message: 'Failed to get user streak',
      error: error.message
    });
  }
};