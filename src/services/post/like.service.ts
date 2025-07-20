import * as likeRepo from '../../repositories/post/like.repositories';

export const toggleLike = async (userId: string, postId: string) => {
  const liked = await likeRepo.hasLiked(userId, postId);

  if (liked) {
    await likeRepo.deleteLike(userId, postId);
    return { liked: false };
  } else {
    await likeRepo.createLike(userId, postId);
    return { liked: true };
  }
};
