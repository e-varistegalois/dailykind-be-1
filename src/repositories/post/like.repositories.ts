import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createLike = async (userId: string, postId: string) => {
  await prisma.like.create({
    data: { userId, postId }
  });

  await prisma.post.update({
    where: { id: postId },
    data: {
      likesCount: { increment: 1 }
    }
  });
};

export const deleteLike = async (userId: string, postId: string) => {
  await prisma.like.delete({
    where: { userId_postId: { userId, postId } }
  });

  await prisma.post.update({
    where: { id: postId },
    data: {
      likesCount: { decrement: 1 }
    }
  });
};

export const hasLiked = async (userId: string, postId: string) => {
  return prisma.like.findUnique({
    where: { userId_postId: { userId, postId } }
  });
};

export const getPostsWithLikeStatus = async (userId: string, challengeId: string) => {
  const posts = await prisma.post.findMany({
    where: {
      challengeId: challengeId
    },
    select: {
      id: true, // postId
      likes: {
        where: {
          userId: userId
        },
        select: {
          id: true // hanya untuk mengecek apakah ada like
        }
      }
    }
  });

  // Transformasi data ke format yang diinginkan
  return posts.map(post => ({
    postId: post.id,
    liked: post.likes.length > 0 // jika ada like dari user, maka true
  }));
}
