import { getPostsByUserIdRepository } from '../../repositories/post/post.repositories';

export const getPostsByUserIdService = async (userId: string) => {
  try {
    const posts = await getPostsByUserIdRepository(userId);

    return {
      posts: posts.map(post => ({
        id: post.id,
        challengeId: post.challengeId,
        userId: post.userId,
        content: post.content,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        likesCount: post._count.likes
      }))
    };
  } catch (error) {
    console.error('Error getting posts by user ID:', error);
    throw new Error('Failed to get posts by user ID');
  }
};
     
