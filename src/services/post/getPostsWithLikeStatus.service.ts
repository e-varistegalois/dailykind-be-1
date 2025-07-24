import { getPostsWithLikeStatus } from "../../repositories/post/like.repositories";

export const getPostsWithLikeStatusService = async (
  userId: string, 
  challengeId: string
) => {
  try {
    // Validasi input
    if (!userId || !challengeId) {
      throw { status: 400, message: 'userId and challengeId is required' };
    }

    // Dapatkan data dari repository
    const posts = await getPostsWithLikeStatus(userId, challengeId);

    return posts;
  } catch (error) {
    console.error('Error getting posts with like status:', error);
    throw new Error('Failed getting posts with like status');
  }
};