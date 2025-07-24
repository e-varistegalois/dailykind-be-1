import { prisma } from '../../db/index';
import { PostSortBy } from '../../config/postSortBy';

export const createPost = async (data: {
  user_id: string;
  challenge_id: string;
  text?: string ;
  image_url?: string;
  status: 'DRAFT' | 'PUBLISHED';
}) => {
  return prisma.post.create({
    data: {
      userId: data.user_id,
      challengeId: data.challenge_id,
      content: data.text,
      imageUrl: data.image_url,
      status: data.status,
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
    where: { challengeId, status: 'PUBLISHED'},
    orderBy:
      sortBy === 'likes'
        ? { likesCount: 'desc' }
        : { createdAt: 'desc' },
    skip: skip,
    take: take
  });
}

export const getPostsByChallengeIdWithLikes = async (
  challengeId: string,
  userId: string,
  sortBy: PostSortBy = 'createdAt',
  skip: number = 0,
  take: number = 20
) => {
  return prisma.post.findMany({
    where: { 
      challengeId, 
      status: 'PUBLISHED'
    },
    include: {
      likes: {
        where: {
          userId: userId
        },
        select: {
          userId: true
        }
      },
      _count: {
        select: {
          likes: true
        }
      }
    },
    orderBy:
      sortBy === 'likes'
        ? { likesCount: 'desc' }
        : { createdAt: 'desc' },
    skip: skip,
    take: take
  });
};

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

export const getUserDraftsRepository = async (userId: string) => {
  return await prisma.post.findMany({
    where: {
      userId,
      status: 'DRAFT',
      challenge: {
        isActive: true 
      }
    },
    include: {
      challenge: {
        select: {
          content: true,
          timestamp: true,
          isActive: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};
