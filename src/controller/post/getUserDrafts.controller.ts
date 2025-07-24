import { Request, Response } from 'express';
import { getUserDraftsService } from '../../services/post/getUserDrafts.service';

export const getUserDraftsController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required'
      });
    }

    const result = await getUserDraftsService(userId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in getUserDraftsController:', error);
    res.status(500).json({
      message: 'Failed to get user drafts',
      error: error.message
    });
  }
};