import { Request, Response } from 'express';
import { getPostsByUserIdService } from '../../services/post/getPostsByUserId.service';



export const getPostsByUserIdController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required'
      });
    }

    const result = await getPostsByUserIdService(userId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in getPostsByUserIdController:', error);
    res.status(500).json({
      message: 'Failed to get posts',
      error: error.message
    });
  }
};