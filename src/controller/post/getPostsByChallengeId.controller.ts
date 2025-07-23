import { Request, Response } from 'express';
import { getPostsByChallengeIdService } from '../../services/post/getPostsByChallengeId.service';
import { PostSortBy } from '../../config/postSortBy';

export const getPostsByChallengeIdController = async (req: Request, res: Response) => {
  try {
    const { challengeId } = req.params;
    const sortBy = (req.query.sortBy as PostSortBy) || 'createdAt';
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    const result = await getPostsByChallengeIdService(challengeId, sortBy, page, limit);
    res.status(200).json({ posts: result });
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}