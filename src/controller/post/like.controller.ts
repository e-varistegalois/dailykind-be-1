import { Request, Response } from 'express';
import * as likeService from '../../services/post/like.service';
import { getActiveChallengeService } from '../../services/challenge/getWeeklyChallenge.service';
import { getPostsWithLikeStatusService } from '../../services/post/getPostsWithLikeStatus.service';

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

export const getPostsWithLikeStatusController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ message: 'userId required' });

    const thisWeekChallenge = await getActiveChallengeService();

    if (!thisWeekChallenge.challenge) {
      return res.status(404).json({ message: 'No active challenge found' });
    }

    const challengeId = thisWeekChallenge.challenge.id;

    const posts = await getPostsWithLikeStatusService(userId, challengeId);

    res.status(200).json({ posts : posts });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


