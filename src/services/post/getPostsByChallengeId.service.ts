import { PostSortBy } from '../../config/postSortBy';
import { getPostsByChallengeId } from '../../repositories/post/post.repositories';

export const getPostsByChallengeIdService = async (
  challengeId: string,
  sortBy: PostSortBy = 'createdAt',
  page: number = 1,
  limit: number = 20
) => {
  if (!challengeId) {
    throw { status: 400, message: 'challengeId is required' };
  }

  const skip = (page - 1) * limit;
  const posts = await getPostsByChallengeId(challengeId, sortBy, skip, limit);
  return posts;
};