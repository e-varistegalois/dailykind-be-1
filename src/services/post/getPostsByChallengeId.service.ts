import { PostSortBy } from '../../config/postSortBy';
import { getPostsByChallengeId, getPostsByChallengeIdWithLikes } from '../../repositories/post/post.repositories';

export const getPostsByChallengeIdService = async (
  challengeId: string,
  userId?: string,
  sortBy: PostSortBy = 'createdAt',
  page: number = 1,
  limit: number = 20
) => {
  if (!challengeId) {
    throw { status: 400, message: 'challengeId is required' };
  }

  const skip = (page - 1) * limit;
  const posts = userId 
    ? await getPostsByChallengeIdWithLikes(challengeId, userId, sortBy, skip, limit)
    : await getPostsByChallengeId(challengeId, sortBy, skip, limit);

  const transformedPosts = posts.map(post => {
    const basePost = {
      id: post.id,
      challengeId: post.challengeId,
      userId: post.userId,
      content: post.content,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      likesCount: post.likesCount
    };

    // Add isLiked only for authenticated users
    if (userId) {
      return {
        ...basePost,
        isLiked: (post as any).likes.length > 0
      };
    }

    return basePost;
  });

  return transformedPosts;
};