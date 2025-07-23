import { prisma } from '../../db/index';
import { PostSortBy } from '../../config/postSortBy';

export const createPost = async (data: {
  user_id: string;
  challenge_id: string;
  text?: string ;
  image_url?: string;
}) => {
  return prisma.post.create({
    data: {
      userId: data.user_id,
      challengeId: data.challenge_id,
      content: data.text,
      imageUrl: data.image_url,
    },
  });
};

export const getPostsByChallengeId = async (
  challengeId: string, 
  sortBy: PostSortBy = 'createdAt',
  skip: number = 0,
  take: number = 20
) => {
  return prisma.post.findMany({
    where: { challengeId },
    orderBy:
      sortBy === 'likes'
        ? { likesCount: 'desc' }
        : { createdAt: 'desc' },
    skip: skip,
    take: take
  });
}

export const getPostsByUserIdRepository = async (userId: string) => {
  return await prisma.post.findMany({
    where: {
      userId: userId
    },
    include: {
      _count: {
        select: {
          likes: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc' 
    }
  });
};


