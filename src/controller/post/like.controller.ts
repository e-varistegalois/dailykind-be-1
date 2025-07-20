import { Request, Response } from 'express';
import * as likeService from '../../services/post/like.service';


export const toggleLikeController = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId; 
    const { postId } = req.params;

    if (!userId || !postId) return res.status(400).json({ message: 'Invalid input' });

    const result = await likeService.toggleLike(userId, postId);
    res.status(200).json({ message: result.liked ? 'Liked' : 'Unliked' });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
